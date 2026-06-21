-- 모엔브 인스타그램 피드 캐시 스키마
-- Supabase SQL Editor에서 실행하세요.

CREATE TABLE IF NOT EXISTS instagram_feed (
    id TEXT PRIMARY KEY,
    caption TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    permalink TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    username TEXT,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_instagram_feed_visible_timestamp
    ON instagram_feed (is_visible, timestamp DESC);

ALTER TABLE instagram_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on visible instagram feed" ON instagram_feed;
CREATE POLICY "Allow public read on visible instagram feed" ON instagram_feed
    FOR SELECT
    USING (is_visible = TRUE);
