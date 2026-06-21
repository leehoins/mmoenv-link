import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-secret",
};

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
};

type CachedMedia = {
  id: string;
  caption: string | null;
  media_type: InstagramMedia["media_type"];
  media_url: string;
  thumbnail_url: string | null;
  permalink: string;
  timestamp: string;
  username: string | null;
  is_visible: boolean;
  synced_at: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function toCachedMedia(item: InstagramMedia, syncedAt: string): CachedMedia | null {
  const displayUrl = item.media_type === "VIDEO"
    ? item.thumbnail_url || item.media_url
    : item.media_url;

  if (!displayUrl || !item.permalink || !item.timestamp) {
    return null;
  }

  return {
    id: item.id,
    caption: item.caption || null,
    media_type: item.media_type,
    media_url: displayUrl,
    thumbnail_url: item.thumbnail_url || null,
    permalink: item.permalink,
    timestamp: item.timestamp,
    username: item.username || null,
    is_visible: true,
    synced_at: syncedAt,
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const syncSecret = Deno.env.get("INSTAGRAM_SYNC_SECRET");
    if (syncSecret && request.headers.get("x-sync-secret") !== syncSecret) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/$/, "");
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const instagramUserId = getRequiredEnv("INSTAGRAM_USER_ID");
    const instagramAccessToken = getRequiredEnv("INSTAGRAM_ACCESS_TOKEN");
    const graphVersion = Deno.env.get("INSTAGRAM_GRAPH_VERSION") || "v25.0";
    const limit = Number(Deno.env.get("INSTAGRAM_LIMIT") || "9");
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
      "username",
    ].join(",");

    const instagramEndpoint = new URL(`https://graph.facebook.com/${graphVersion}/${instagramUserId}/media`);
    instagramEndpoint.searchParams.set("fields", fields);
    instagramEndpoint.searchParams.set("limit", String(limit));
    instagramEndpoint.searchParams.set("access_token", instagramAccessToken);

    const instagramResponse = await fetch(instagramEndpoint);
    if (!instagramResponse.ok) {
      const errorBody = await instagramResponse.text();
      return jsonResponse({
        error: "Instagram API request failed",
        status: instagramResponse.status,
        detail: errorBody,
      }, 502);
    }

    const instagramPayload = await instagramResponse.json() as { data?: InstagramMedia[] };
    const syncedAt = new Date().toISOString();
    const rows = (instagramPayload.data || [])
      .map((item) => toCachedMedia(item, syncedAt))
      .filter((item): item is CachedMedia => Boolean(item));

    if (rows.length === 0) {
      return jsonResponse({ synced: 0, message: "No valid Instagram media returned" });
    }

    const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_feed?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    });

    if (!upsertResponse.ok) {
      const errorBody = await upsertResponse.text();
      return jsonResponse({
        error: "Supabase upsert failed",
        status: upsertResponse.status,
        detail: errorBody,
      }, 502);
    }

    const currentIds = rows.map((row) => row.id).join(",");
    const visibilityEndpoint = new URL(`${supabaseUrl}/rest/v1/instagram_feed`);
    visibilityEndpoint.searchParams.set("id", `not.in.(${currentIds})`);
    const visibilityResponse = await fetch(visibilityEndpoint, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        is_visible: false,
        synced_at: syncedAt,
      }),
    });

    if (!visibilityResponse.ok) {
      const errorBody = await visibilityResponse.text();
      return jsonResponse({
        error: "Supabase stale visibility update failed",
        status: visibilityResponse.status,
        detail: errorBody,
      }, 502);
    }

    return jsonResponse({ synced: rows.length, synced_at: syncedAt });
  } catch (error) {
    return jsonResponse({
      error: error instanceof Error ? error.message : "Unknown sync error",
    }, 500);
  }
});
