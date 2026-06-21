# Instagram feed automation

모엔브 홈 하단의 Instagram 영역은 외부 위젯을 쓰지 않고 다음 구조로 동작합니다.

- `instagram_feed` 테이블: 사이트가 읽는 공개 캐시
- `sync-instagram-feed` Supabase Edge Function: Instagram Graph API에서 최신 게시물을 가져와 캐시에 저장
- `.github/workflows/sync-instagram-feed.yml`: Edge Function 수동 호출, 설정 완료 후 6시간 주기 호출
- `instagram-feed.js`: 브라우저에서 공개 캐시만 읽어 카드 그리드 렌더링

## Meta 로그인이 안 될 때

Meta 개발자 로그인이 막혀 `INSTAGRAM_USER_ID`와 `INSTAGRAM_ACCESS_TOKEN`을 받을 수 없으면 공식 자동 동기화는 켤 수 없습니다. 이때는 `instagram_feed` 테이블에 작업 소식을 직접 등록해서 사이트에 노출합니다.

현재 `supabase-config.js`는 `instagramFeed.enabled: true`로 설정되어 있어, `instagram_feed` 테이블에 `is_visible = true` 행이 들어오면 홈 하단에 바로 표시됩니다. 테이블이 비어 있으면 기본 안내 카드만 표시됩니다.

Supabase Dashboard -> Table Editor -> `instagram_feed` -> Insert row에서 아래 필드를 채웁니다.

```text
id: 20260621-01 같은 고유값
caption: 카드에 보여줄 작업 설명
media_type: IMAGE
media_url: 공개 접근 가능한 이미지 URL
thumbnail_url: 비워도 됨
permalink: 연결할 인스타그램 게시물 또는 상담 링크
timestamp: 2026-06-21T00:00:00+09:00 같은 날짜
username: m.moenv
is_visible: true
```

이미지는 공개 URL이어야 합니다. Supabase Storage, GitHub repo의 `assets/` 이미지, 또는 공개 CDN URL을 사용할 수 있습니다. 브라우저에 서비스 역할 키를 넣지 마세요.

## 1. Supabase 테이블 생성

Supabase SQL Editor에서 `instagram-feed-schema.sql` 전체를 실행합니다.

이 테이블은 `is_visible = true` 행만 공개 읽기를 허용합니다. 서비스 역할 키는 Edge Function에서만 사용하고, 브라우저에는 넣지 않습니다.

현재 프로젝트(`dnyuvyompyqcyvvwssvj`)에는 2026-06-21에 이 스키마를 적용했습니다.

## 2. Edge Function 배포

Supabase CLI가 로그인된 상태에서 실행합니다.

```bash
supabase functions deploy sync-instagram-feed --project-ref <project-ref> --no-verify-jwt
```

GitHub Actions가 `x-sync-secret` 헤더로 호출하므로 JWT 검증은 꺼야 합니다. 이 설정은 `supabase/config.toml`에도 반영되어 있습니다.

필요한 시크릿을 설정합니다.

```bash
supabase secrets set --project-ref <project-ref> \
  INSTAGRAM_USER_ID=<instagram-business-or-creator-user-id> \
  INSTAGRAM_ACCESS_TOKEN=<instagram-graph-api-access-token> \
  INSTAGRAM_SYNC_SECRET=<random-sync-secret> \
  INSTAGRAM_GRAPH_VERSION=v25.0 \
  INSTAGRAM_LIMIT=9
```

`SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`는 Supabase Edge Function 런타임 기본 시크릿으로 제공됩니다. CLI에서 `SUPABASE_`로 시작하는 이름은 직접 등록하지 않습니다.

`INSTAGRAM_ACCESS_TOKEN`은 브라우저에 노출하면 안 됩니다. Meta 앱, Facebook Page와 연결된 Instagram Business/Creator 계정, Instagram Graph API 권한이 필요합니다.

## 3. GitHub Actions 시크릿 설정

GitHub 저장소 Settings -> Secrets and variables -> Actions에 아래 값을 추가합니다.

```text
SUPABASE_INSTAGRAM_SYNC_URL=https://<project-ref>.supabase.co/functions/v1/sync-instagram-feed
INSTAGRAM_SYNC_SECRET=<same-random-sync-secret>
```

현재 워크플로는 Instagram API 토큰 설정 전 배포 실패를 막기 위해 수동 실행만 켜둔 상태입니다. `INSTAGRAM_USER_ID`와 `INSTAGRAM_ACCESS_TOKEN` 설정 후 수동 동기화가 성공하면 `.github/workflows/sync-instagram-feed.yml`의 `schedule` 주석을 풀어 6시간 자동 실행을 켭니다.

## 4. 수동 동기화 테스트

```bash
curl -fsS -X POST "$SUPABASE_INSTAGRAM_SYNC_URL" \
  -H "content-type: application/json" \
  -H "x-sync-secret: $INSTAGRAM_SYNC_SECRET" \
  --data '{"source":"manual"}'
```

정상 응답 예시는 다음과 같습니다.

```json
{"synced":9,"synced_at":"2026-06-21T00:00:00.000Z"}
```

동기화가 성공하면 최신 응답에 포함되지 않은 기존 캐시 행은 `is_visible = false`로 바뀝니다.

## 5. 프론트 확인

SQL과 동기화 함수 설정이 끝나면 `supabase-config.js`에서 피드를 켭니다.

```javascript
instagramFeed: {
  enabled: true,
  limit: 9,
},
```

홈페이지를 열면 `instagram-feed.js`가 Supabase REST API로 `instagram_feed` 공개 행을 읽어 렌더링합니다. 피드가 꺼져 있거나 테이블이 비어 있으면 기본 안내 카드가 표시됩니다.

Graph API 버전은 Meta 정책에 따라 바뀌므로, 새 버전이 나오면 `INSTAGRAM_GRAPH_VERSION`을 갱신하고 Edge Function을 재배포합니다.
