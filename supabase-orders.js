// Supabase 주문 관리 모듈
class SupabaseOrderManager {
    constructor() {
        this.supabase = null;
        this.initialized = false;
    }

    // 초기화
    async initialize() {
        try {
            this.supabase = await initSupabase();
            
            if (!this.supabase) {
                throw new Error('Supabase 클라이언트 초기화 실패');
            }

            if (!validateConfig()) {
                throw new Error('Supabase 설정이 올바르지 않습니다');
            }

            this.initialized = true;
            console.log('Supabase 주문 관리자 초기화 완료');
            return true;
        } catch (error) {
            console.error('Supabase 초기화 오류:', error);
            return false;
        }
    }

    // 주문 저장
    async saveOrder(orderData) {
        if (!this.initialized) {
            throw new Error('Supabase가 초기화되지 않았습니다');
        }

        try {
            // 주문 데이터 변환
            const dbOrder = this.transformOrderData(orderData);
            
            const { data, error } = await this.supabase
                .from('orders')
                .insert(dbOrder)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('주문 저장 완료:', data.id);
            return {
                success: true,
                orderId: data.id,
                orderNumber: this.generateOrderNumber(data.created_at, data.id)
            };

        } catch (error) {
            console.error('주문 저장 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 주문 데이터 변환 (폼 데이터를 DB 형식으로)
    transformOrderData(formData) {
        // 추가 옵션을 JSON 배열로 변환
        let extraOptions = [];
        if (formData.extraOptions) {
            if (Array.isArray(formData.extraOptions)) {
                extraOptions = formData.extraOptions;
            } else {
                extraOptions = [formData.extraOptions];
            }
        }

        return {
            // 고객 정보
            customer_name: formData.customerName,
            customer_phone: formData.customerPhone,
            customer_email: formData.customerEmail || null,

            // 주문 정보
            order_type: formData.orderType,
            balloon_type: formData.balloonType,
            balloon_quantity: formData.balloonQuantity || null,
            custom_quantity: formData.customQuantityInput || null,

            // 레터링 정보
            lettering_text: formData.letteringText || null,
            font_type: formData.fontType || null,
            font_color: formData.fontColor || null,

            // 추가 옵션
            extra_options: extraOptions,

            // 상세 정보
            order_details: formData.orderDetails,
            budget: formData.budget || null,

            // 배송 정보
            delivery_method: formData.deliveryMethod,
            pickup_location: formData.pickupLocation || null,
            pickup_time: formData.pickupTime || null,
            delivery_address: formData.deliveryAddress || null,
            delivery_phone: formData.deliveryPhone || null,
            direct_address: formData.directAddress || null,

            // 일정
            usage_date: formData.usageDate,
            desired_date: formData.desiredDate,
            time_preference: formData.timePreference || null,

            // 추가 요청사항
            additional_notes: formData.additionalNotes || null,

            // 기본 상태
            status: 'pending'
        };
    }

    // 주문 번호 생성
    generateOrderNumber(createdAt, orderId) {
        const date = new Date(createdAt);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const shortId = orderId.slice(-6).toUpperCase();
        
        return `MO${year}${month}${day}-${shortId}`;
    }

    // 주문 목록 조회 (관리자용)
    async getOrders(filters = {}) {
        if (!this.initialized) {
            throw new Error('Supabase가 초기화되지 않았습니다');
        }

        try {
            let query = this.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            // 필터 적용
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.dateFrom) {
                query = query.gte('created_at', filters.dateFrom);
            }

            if (filters.dateTo) {
                query = query.lte('created_at', filters.dateTo);
            }

            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return {
                success: true,
                orders: data.map(order => ({
                    ...order,
                    orderNumber: this.generateOrderNumber(order.created_at, order.id)
                }))
            };

        } catch (error) {
            console.error('주문 조회 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 주문 상태 업데이트
    async updateOrderStatus(orderId, newStatus, notes = null) {
        if (!this.initialized) {
            throw new Error('Supabase가 초기화되지 않았습니다');
        }

        try {
            const updateData = { status: newStatus };
            if (notes) {
                updateData.admin_notes = notes;
            }

            const { data, error } = await this.supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                order: data
            };

        } catch (error) {
            console.error('주문 상태 업데이트 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 주문 통계 조회
    async getOrderStats() {
        if (!this.initialized) {
            throw new Error('Supabase가 초기화되지 않았습니다');
        }

        try {
            const { data, error } = await this.supabase
                .from('order_stats')
                .select('*')
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                stats: data
            };

        } catch (error) {
            console.error('주문 통계 조회 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 주문 상세 조회
    async getOrderById(orderId) {
        if (!this.initialized) {
            throw new Error('Supabase가 초기화되지 않았습니다');
        }

        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select(`
                    *,
                    order_status_history(
                        previous_status,
                        new_status,
                        changed_at,
                        changed_by,
                        notes
                    )
                `)
                .eq('id', orderId)
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                order: {
                    ...data,
                    orderNumber: this.generateOrderNumber(data.created_at, data.id)
                }
            };

        } catch (error) {
            console.error('주문 상세 조회 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 실시간 주문 알림 구독 (관리자용)
    subscribeToNewOrders(callback) {
        if (!this.initialized) {
            console.error('Supabase가 초기화되지 않았습니다');
            return null;
        }

        try {
            const subscription = this.supabase
                .channel('orders')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders'
                }, (payload) => {
                    const order = {
                        ...payload.new,
                        orderNumber: this.generateOrderNumber(payload.new.created_at, payload.new.id)
                    };
                    callback(order);
                })
                .subscribe();

            return subscription;

        } catch (error) {
            console.error('실시간 구독 오류:', error);
            return null;
        }
    }

    // 구독 해제
    unsubscribe(subscription) {
        if (subscription) {
            this.supabase.removeChannel(subscription);
        }
    }
}

// 전역 인스턴스 생성
const orderManager = new SupabaseOrderManager();

// 전역으로 내보내기
if (typeof window !== 'undefined') {
    window.orderManager = orderManager;
}

// 초기화 함수 (HTML에서 호출)
async function initOrderManager() {
    const success = await orderManager.initialize();
    if (success) {
        console.log('🎈 모엔브 주문 관리자 준비 완료');
    } else {
        console.warn('⚠️ 주문 관리자 초기화 실패 - 로컬 모드로 동작합니다');
    }
    return success;
}

// 주문 제출 헬퍼 함수
async function submitOrderToDatabase(formData) {
    try {
        if (!orderManager.initialized) {
            console.log('데이터베이스 미연결 - 카카오톡으로만 전송');
            return { success: false, reason: 'database_not_connected' };
        }

        const result = await orderManager.saveOrder(formData);
        
        if (result.success) {
            console.log(`✅ 주문 저장 완료 - 주문번호: ${result.orderNumber}`);
            return {
                success: true,
                orderId: result.orderId,
                orderNumber: result.orderNumber
            };
        } else {
            console.error('❌ 주문 저장 실패:', result.error);
            return { success: false, error: result.error };
        }

    } catch (error) {
        console.error('주문 제출 중 오류:', error);
        return { success: false, error: error.message };
    }
}

// HTML에서 사용할 전역 함수들
if (typeof window !== 'undefined') {
    window.initOrderManager = initOrderManager;
    window.submitOrderToDatabase = submitOrderToDatabase;
    window.SupabaseOrderManager = SupabaseOrderManager;
}