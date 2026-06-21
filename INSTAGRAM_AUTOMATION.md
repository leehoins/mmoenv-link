# Instagram feed automation

모엔브 홈 하단의 Instagram 영역은 외부 위젯을 쓰지 않고 다음 구조로 동작합니다.

- `instagram_feed` 테이블: 사이트가 읽는 공개 캐시
- `sync-instagram-feed` Supabase Edge Function: Instagram Graph API에서 최신 게시물을 가져와 캐시에 저장
- `.github/workflows/sync-instagram-feed.yml`: Edge Function 수동 호출, 설정 완료 후 6시간 주기 호출
- `instagram-feed.js`: 브라우저에서 공개 캐시만 읽어 카드 그리드 렌더링

## 1. Supabase 테이블 생성

Supabase SQL Editor에서 `instagram-feed-schema.sql` 전체를 실행합니다.

이 테이블은 `is_visible = true` 행만 공개 읽기를 허용합니다. 서비스 역할 키는 Edge Function에서만 사용하고, 브라우저에는 넣지 않습니다.

## 2. Edge Function 배포

Supabase CLI가 로그인된 상태에서 실행합니다.

```bash
supabase functions deploy sync-instagram-feed --project-ref <project-ref>
```

필요한 시크릿을 설정합니다.

```bash
supabase secrets set --project-ref <project-ref> \
  SUPABASE_URL=https://<project-ref>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
  INSTAGRAM_USER_ID=<instagram-business-or-creator-user-id> \
  INSTAGRAM_ACCESS_TOKEN=<instagram-graph-api-access-token> \
  INSTAGRAM_SYNC_SECRET=<random-sync-secret> \
  INSTAGRAM_GRAPH_VERSION=v25.0 \
  INSTAGRAM_LIMIT=9
```

`INSTAGRAM_ACCESS_TOKEN`은 브라우저에 노출하면 안 됩니다. Meta 앱, Facebook Page와 연결된 Instagram Business/Creator 계정, Instagram Graph API 권한이 필요합니다.

## 3. GitHub Actions 시크릿 설정

GitHub 저장소 Settings -> Secrets and variables -> Actions에 아래 값을 추가합니다.

```text
SUPABASE_INSTAGRAM_SYNC_URL=https://<project-ref>.functions.supabase.co/sync-instagram-feed
INSTAGRAM_SYNC_SECRET=<same-random-sync-secret>
```

현재 워크플로는 Supabase 설정 전 배포 실패를 막기 위해 수동 실행만 켜둔 상태입니다. Supabase 함수와 secrets 설정이 끝나면 `.github/workflows/sync-instagram-feed.yml`의 `schedule` 주석을 풀어 6시간 자동 실행을 켭니다.

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
