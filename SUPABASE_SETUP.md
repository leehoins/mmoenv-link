# 🎈 모엔브 Supabase 백엔드 설정 가이드

모엔브 주문 시스템을 위한 Supabase 백엔드 설정 방법입니다.

## 📋 설정 순서

### 1단계: Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정 생성/로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `mmoenv-orders` (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: `Northeast Asia (Seoul)` 선택
4. "Create new project" 클릭

### 2단계: 데이터베이스 설정

1. Supabase 대시보드에서 "SQL Editor" 메뉴 선택
2. `database-schema.sql` 파일의 전체 내용을 복사
3. SQL Editor에 붙여넣고 "Run" 버튼 클릭
4. 테이블과 함수들이 성공적으로 생성되었는지 확인

### 3단계: API 키 설정

1. Supabase 대시보드에서 "Settings" → "API" 메뉴 선택
2. 다음 정보들을 복사:
   - **Project URL**: `https://xxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (긴 토큰 문자열)

### 4단계: 환경 설정 파일 업데이트

`supabase-config.js` 파일을 열고 다음과 같이 수정:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://여기에복사한URL.supabase.co',
  anonKey: '여기에복사한anon-key',
};
```

### 5단계: 테스트

1. 웹사이트에서 주문 폼을 열기
2. 브라우저 개발자 도구(F12) → Console 탭 확인
3. 다음 메시지가 나타나면 성공:
   ```
   🎈 Supabase 연동 완료
   🎈 모엔브 주문 관리자 준비 완료
   ```

## 🗄️ 데이터베이스 구조

### 주요 테이블들

#### `orders` 테이블
- 모든 주문 정보 저장
- 고객 정보, 주문 상세, 배송 정보 포함
- 자동 ID 생성 및 타임스탬프

#### `order_status_history` 테이블  
- 주문 상태 변경 이력 추적
- 자동으로 상태 변경시 기록됨

#### `admin_users` 테이블
- 관리자 계정 정보 (향후 확장용)

#### `order_stats` 뷰
- 주문 통계 정보 제공

## 🔒 보안 설정

### Row Level Security (RLS)
- 모든 테이블에 RLS 활성화
- 공개 접근: 주문 생성만 허용
- 관리자 접근: 전체 데이터 관리 권한

### 정책 설정
- `Allow public insert on orders`: 누구나 주문 생성 가능
- `Allow admin full access`: 관리자 전체 접근 권한

## 📊 관리 기능

### 주문 조회
```javascript
// 최근 주문 목록
const orders = await orderManager.getOrders({ limit: 20 });

// 특정 상태 주문만
const pending = await orderManager.getOrders({ status: 'pending' });
```

### 주문 상태 업데이트
```javascript
await orderManager.updateOrderStatus(orderId, 'confirmed', '확인 완료');
```

### 실시간 알림
```javascript
// 새 주문 알림 구독
const subscription = orderManager.subscribeToNewOrders((order) => {
  console.log('새 주문:', order.orderNumber);
});
```

## 🚀 배포 고려사항

### 환경변수 보안
- 프로덕션에서는 환경변수 사용 권장
- API 키를 코드에 직접 노출하지 않기

### 백업 설정
- Supabase 자동 백업 활성화
- 중요 데이터 별도 백업 고려

### 모니터링
- Supabase 대시보드에서 API 사용량 모니터링
- 에러 로그 정기 확인

## 📞 문제해결

### 연결 실패시
1. API URL과 키가 정확한지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인

### 주문 저장 실패시
1. 데이터베이스 스키마가 올바르게 생성되었는지 확인
2. RLS 정책이 제대로 설정되었는지 확인
3. 필수 필드가 모두 전달되었는지 확인

## 📈 향후 확장 계획

1. **이메일 알림**: Resend API 연동
2. **관리자 대시보드**: 주문 관리 UI
3. **고급 분석**: 매출 통계, 트렌드 분석
4. **재고 관리**: 상품별 재고 추적
5. **고객 관리**: 단골 고객 정보 관리

## ✅ 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 완료
- [ ] API 키 설정 완료
- [ ] `supabase-config.js` 파일 업데이트 완료
- [ ] 웹사이트에서 연결 테스트 완료
- [ ] 실제 주문 테스트 완료

---

💡 **팁**: 처음 설정할 때는 테스트 주문을 몇 개 생성해서 모든 기능이 정상 작동하는지 확인해보세요!