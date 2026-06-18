-- 보안 강화 마이그레이션
-- 문제: orders/admin_users 테이블의 RLS 정책이 USING (true)로 되어 있어
--       공개 anon 키만으로 누구나 모든 주문(고객 이름/연락처/주소)과
--       관리자 계정 정보를 조회·수정·삭제할 수 있었음.
-- 조치: "전체 접근" 정책을 인증된 사용자(Supabase Auth)로 한정.
--       고객의 주문 생성(INSERT)은 기존처럼 익명으로도 계속 가능.
--
-- 실행 방법: Supabase 대시보드 → SQL Editor → 아래 전체 붙여넣고 Run
-- 실행 전에 반드시 Authentication > Users 에서 관리자 계정을 먼저 만들어두세요
-- (admin.html 로그인에 이메일/비밀번호로 사용됩니다).

-- 1) orders: 조회/수정/삭제는 인증된 사용자만. 생성(INSERT)은 기존 정책대로 누구나 가능.
DROP POLICY IF EXISTS "Allow admin full access on orders" ON orders;
CREATE POLICY "Authenticated full access on orders" ON orders
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 2) order_status_history: 인증된 사용자만 접근
DROP POLICY IF EXISTS "Allow admin full access on order_status_history" ON order_status_history;
CREATE POLICY "Authenticated full access on order_status_history" ON order_status_history
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3) admin_users: 더 이상 로그인에 쓰이지 않음(Supabase Auth로 대체). 외부 접근 전면 차단.
DROP POLICY IF EXISTS "Allow admin full access on admin_users" ON admin_users;

-- 4) order_stats 통계 뷰: 비로그인 사용자에게는 숨김
REVOKE SELECT ON order_stats FROM anon;
GRANT SELECT ON order_stats TO authenticated;
