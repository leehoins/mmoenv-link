-- 모엔브 주문 관리 데이터베이스 스키마
-- Supabase에서 실행할 SQL

-- 주문 테이블 생성
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 고객 정보
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    
    -- 주문 정보
    order_type VARCHAR(50) NOT NULL,
    balloon_type VARCHAR(100) NOT NULL,
    
    -- 레터링 정보
    lettering_text TEXT,
    font_type VARCHAR(50),
    font_color VARCHAR(30),
    
    -- 추가 옵션 (JSON 배열로 저장)
    extra_options JSONB DEFAULT '[]',
    
    -- 상세 요청사항
    order_details TEXT NOT NULL,
    budget VARCHAR(20),
    
    -- 수령 방법
    delivery_method VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(50),
    pickup_time VARCHAR(20),
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    direct_address TEXT,
    
    -- 일정
    usage_date DATE NOT NULL,
    desired_date DATE NOT NULL,
    time_preference VARCHAR(20),
    
    -- 추가 요청사항
    additional_notes TEXT,
    
    -- 주문 상태
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    
    -- 관리자 메모
    admin_notes TEXT,
    confirmed_price INTEGER, -- 확정 가격 (원)
    estimated_delivery DATE -- 예상 완료일
);

-- 주문 상태 히스토리 테이블
CREATE TABLE order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by VARCHAR(50), -- 'system' 또는 관리자 이름
    notes TEXT
);

-- 관리자 계정 테이블
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 인덱스 생성
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_desired_date ON orders(desired_date);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 주문 상태 변경시 히스토리 자동 기록 함수
CREATE OR REPLACE FUNCTION record_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- 상태가 변경된 경우에만 기록
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'system');
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 상태 변경 히스토리 트리거
CREATE TRIGGER record_order_status_change
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION record_status_change();

-- Row Level Security (RLS) 설정
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 공개 접근 정책 (주문 생성만 허용)
CREATE POLICY "Allow public insert on orders" ON orders
    FOR INSERT WITH CHECK (true);

-- 관리자 전체 접근 정책 (향후 인증 시스템 연동시 사용)
CREATE POLICY "Allow admin full access on orders" ON orders
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access on order_status_history" ON order_status_history
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access on admin_users" ON admin_users
    FOR ALL USING (true);

-- 기본 관리자 계정 생성 (비밀번호는 bcrypt 해시)
-- 비밀번호: admin123 (실제 운영시에는 변경 필요)
INSERT INTO admin_users (username, password_hash, name) 
VALUES ('admin', '$2b$10$rOvHLzYgEkBc/ZjzwHQtKuXy.f7P.UQ5v5JJ.YHZ5ZKmF.yXZ6L6S', '관리자');

-- 주문 통계를 위한 뷰
CREATE VIEW order_stats AS
SELECT 
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as orders_this_week,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_this_month
FROM orders;