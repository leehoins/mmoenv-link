// 관리자 페이지 JavaScript

// 주문 관리 기능
class AdminOrderManager {
    constructor() {
        this.orderManager = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            // 페이지 로드시 Supabase 초기화
            await this.waitForOrderManager();
            this.setupEventListeners();
            await this.loadOrders();
            await this.loadStats();
            
            this.initialized = true;
            console.log('📊 관리자 주문 관리 시스템 준비 완료');
        } catch (error) {
            console.error('주문 관리 시스템 초기화 오류:', error);
            this.showError('주문 관리 시스템 초기화 실패');
        }
    }

    async waitForOrderManager() {
        // orderManager가 준비될 때까지 대기
        let attempts = 0;
        while (attempts < 30) { // 15초 대기
            if (window.orderManager && window.initOrderManager) {
                const success = await window.initOrderManager();
                if (success) {
                    this.orderManager = window.orderManager;
                    return;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        throw new Error('Supabase 연결 실패');
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refreshOrdersBtn');
        const exportBtn = document.getElementById('exportOrdersBtn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadOrders());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportOrders());
        }
    }

    async loadStats() {
        try {
            const result = await this.orderManager.getOrderStats();
            
            if (result.success) {
                const stats = result.stats;
                document.getElementById('totalOrders').textContent = stats.total_orders || 0;
                document.getElementById('pendingOrders').textContent = stats.pending_orders || 0;
                document.getElementById('inProgressOrders').textContent = stats.in_progress_orders || 0;
                document.getElementById('completedOrders').textContent = stats.completed_orders || 0;
            } else {
                this.showError('통계 로드 실패');
            }
        } catch (error) {
            console.error('통계 로드 오류:', error);
            this.showError('통계 로드 중 오류 발생');
        }
    }

    async loadOrders() {
        try {
            const orderList = document.getElementById('orderList');
            orderList.innerHTML = '<p>주문 목록을 불러오는 중...</p>';

            const result = await this.orderManager.getOrders({ limit: 50 });
            
            if (result.success) {
                this.renderOrders(result.orders);
            } else {
                this.showError('주문 목록 로드 실패');
            }
        } catch (error) {
            console.error('주문 로드 오류:', error);
            this.showError('주문 목록 로드 중 오류 발생');
        }
    }

    renderOrders(orders) {
        const orderList = document.getElementById('orderList');
        
        if (orders.length === 0) {
            orderList.innerHTML = '<p style="padding: 2rem; text-align: center; color: #6b7280;">아직 주문이 없습니다.</p>';
            return;
        }

        const orderItems = orders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <h4>${order.orderNumber} - ${order.customer_name}</h4>
                    <p>${order.order_type} | ${order.customer_phone} | ${this.formatDate(order.created_at)}</p>
                    <p>사용일: ${this.formatDate(order.usage_date)} | 희망 출고일: ${this.formatDate(order.desired_date)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                    <div class="order-actions">
                        <button class="btn-small" onclick="adminOrderManager.viewOrderDetails('${order.id}')">상세</button>
                        <button class="btn-small" onclick="adminOrderManager.updateStatus('${order.id}', '${order.status}')">상태변경</button>
                    </div>
                </div>
            </div>
        `).join('');

        orderList.innerHTML = orderItems;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '대기중',
            'confirmed': '확인됨',
            'in_progress': '진행중',
            'completed': '완료',
            'cancelled': '취소됨'
        };
        return statusMap[status] || status;
    }

    async viewOrderDetails(orderId) {
        try {
            const result = await this.orderManager.getOrderById(orderId);
            
            if (result.success) {
                const order = result.order;
                let details = `📋 주문 상세 정보\\n\\n`;
                details += `주문번호: ${order.orderNumber}\\n`;
                details += `고객명: ${order.customer_name} (${order.customer_phone})\\n`;
                details += `주문유형: ${order.order_type}\\n`;
                details += `풍선종류: ${order.balloon_type}\\n`;
                
                if (order.lettering_text) {
                    details += `레터링: "${order.lettering_text}"\\n`;
                }
                
                details += `상세요청: ${order.order_details}\\n`;
                details += `수령방법: ${order.delivery_method}\\n`;
                details += `사용일: ${this.formatDate(order.usage_date)}\\n`;
                details += `희망출고일: ${this.formatDate(order.desired_date)}\\n`;
                details += `상태: ${this.getStatusText(order.status)}\\n`;
                details += `주문일: ${this.formatDate(order.created_at)}\\n`;
                
                if (order.admin_notes) {
                    details += `관리자 메모: ${order.admin_notes}\\n`;
                }
                
                alert(details);
            } else {
                this.showError('주문 상세 정보 로드 실패');
            }
        } catch (error) {
            console.error('주문 상세 조회 오류:', error);
            this.showError('주문 상세 정보 조회 중 오류 발생');
        }
    }

    async updateStatus(orderId, currentStatus) {
        const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
        const statusTexts = ['대기중', '확인됨', '진행중', '완료', '취소됨'];
        
        let options = statuses.map((status, index) => 
            `${index + 1}. ${statusTexts[index]} ${status === currentStatus ? '(현재)' : ''}`
        ).join('\\n');
        
        const choice = prompt(`새 상태를 선택하세요:\\n\\n${options}\\n\\n번호를 입력하세요:`);
        
        if (choice) {
            const statusIndex = parseInt(choice) - 1;
            if (statusIndex >= 0 && statusIndex < statuses.length) {
                const newStatus = statuses[statusIndex];
                const notes = prompt('관리자 메모 (선택사항):');
                
                try {
                    const result = await this.orderManager.updateOrderStatus(orderId, newStatus, notes);
                    
                    if (result.success) {
                        alert('✅ 주문 상태가 업데이트되었습니다!');
                        await this.loadOrders();
                        await this.loadStats();
                    } else {
                        this.showError('상태 업데이트 실패');
                    }
                } catch (error) {
                    console.error('상태 업데이트 오류:', error);
                    this.showError('상태 업데이트 중 오류 발생');
                }
            }
        }
    }

    async exportOrders() {
        try {
            const result = await this.orderManager.getOrders();
            
            if (result.success) {
                const csv = this.generateCSV(result.orders);
                this.downloadCSV(csv, `주문목록_${new Date().toISOString().split('T')[0]}.csv`);
            } else {
                this.showError('주문 데이터 내보내기 실패');
            }
        } catch (error) {
            console.error('내보내기 오류:', error);
            this.showError('데이터 내보내기 중 오류 발생');
        }
    }

    generateCSV(orders) {
        const headers = [
            '주문번호', '고객명', '연락처', '이메일', '주문유형', '풍선종류',
            '레터링', '배송방법', '사용일', '희망출고일', '상태', '주문일', '관리자메모'
        ];
        
        const rows = orders.map(order => [
            order.orderNumber,
            order.customer_name,
            order.customer_phone,
            order.customer_email || '',
            order.order_type,
            order.balloon_type,
            order.lettering_text || '',
            order.delivery_method,
            order.usage_date,
            order.desired_date,
            this.getStatusText(order.status),
            this.formatDate(order.created_at),
            order.admin_notes || ''
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\\n');
            
        return csvContent;
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`✅ ${filename} 파일이 다운로드되었습니다!`);
    }

    showError(message) {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = `<p style="padding: 2rem; text-align: center; color: #dc2626;">⚠️ ${message}</p>`;
    }
}

// 전역 인스턴스 생성
const adminOrderManager = new AdminOrderManager();

// 기본 설정 - 비밀번호 해시값 (실제 비밀번호: mmoenv1!!)
const ADMIN_PASSWORD_HASH = '63e21e5b';
const STORAGE_KEY = 'mmoenv_menu_items';

// 기본 메뉴 데이터
const DEFAULT_MENU_ITEMS = [
    {
        id: 'menu-1',
        title: '모엔브 상품 구경하기',
        subtitle: '바로 구매 가능한 상품 보기',
        url: 'https://m.blog.naver.com/juul2',
        target: '_blank',
        style: 'featured',
        icon: 'M6.3 8.2h11.4l-.8 10.5a1.8 1.8 0 0 1-1.8 1.6H8.9a1.8 1.8 0 0 1-1.8-1.6L6.3 8.2Z M9 8.2V7a3 3 0 0 1 6 0v1.2'
    },
    {
        id: 'menu-2',
        title: '주문하기',
        subtitle: '픽업·배송 예약과 맞춤 제작 상담',
        url: 'order.html',
        target: '_self',
        style: 'primary',
        icon: 'M9 11H7v2h2v-2Z M13 11h-2v2h2v-2Z M17 11h-2v2h2v-2Z M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2ZM19 20H5V9h14v11Z'
    },
    {
        id: 'menu-3',
        title: '카카오 상담하기',
        subtitle: '자유로운 상담 및 특별 제작 문의',
        url: 'https://pf.kakao.com/_wDixjX',
        target: '_blank',
        style: 'normal',
        icon: 'M12 4.2c-4.7 0-8.5 3-8.5 6.8 0 2.4 1.6 4.5 4 5.7l-.7 2.8c-.1.4.3.7.6.4l3.2-2.2c.5.1.9.1 1.4.1 4.7 0 8.5-3 8.5-6.8S16.7 4.2 12 4.2Z'
    },
    {
        id: 'menu-4',
        title: '인스타그램 보기',
        subtitle: '작업 사진과 최신 소식',
        url: 'https://www.instagram.com/m.moenv',
        target: '_blank',
        style: 'normal',
        icon: '<rect x="5" y="5" width="14" height="14" rx="4"/> <circle cx="12" cy="12" r="3.2"/> <circle cx="16.3" cy="7.8" r=".8"/>'
    }
];

let currentMenuItems = [];
let editingMenuIndex = -1;
let draggedElement = null;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    loadMenuItems();
    
    // 주문 관리 시스템 초기화 (로그인 후에 실행됨)
    setTimeout(async () => {
        if (sessionStorage.getItem('admin_authenticated')) {
            await adminOrderManager.initialize();
        }
    }, 1000);
});

// 인증 확인
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated) {
        showAdminPage();
    } else {
        showLoginModal();
    }
}

// 로그인 모달 표시
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// 관리자 페이지 표시
function showAdminPage() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 로그인 폼
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 로그아웃
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // 메뉴 관리 버튼들
    document.getElementById('addMenuBtn').addEventListener('click', () => openMenuModal());
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);
    document.getElementById('resetMenuBtn').addEventListener('click', resetToDefault);
    
    // 모달 관련
    document.getElementById('closeModal').addEventListener('click', closeMenuModal);
    document.getElementById('cancelModal').addEventListener('click', closeMenuModal);
    document.getElementById('menuForm').addEventListener('submit', handleMenuSave);
}

// 간단한 해시 함수 (MD5 기반)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// 로그인 처리  
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const hashedPassword = simpleHash(password + 'mmoenv-salt-2024');
    
    if (hashedPassword === ADMIN_PASSWORD_HASH) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showAdminPage();
        document.getElementById('password').value = '';
    } else {
        alert('비밀번호가 올바르지 않습니다.');
        document.getElementById('password').value = '';
    }
}

// 로그아웃 처리
function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    location.reload();
}

// 메뉴 아이템 로드
function loadMenuItems() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        currentMenuItems = JSON.parse(saved);
    } else {
        currentMenuItems = [...DEFAULT_MENU_ITEMS];
    }
    renderMenuList();
}

// 메뉴 목록 렌더링
function renderMenuList() {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';
    
    currentMenuItems.forEach((item, index) => {
        const menuItem = createMenuItemElement(item, index);
        menuList.appendChild(menuItem);
    });
}

// 메뉴 아이템 요소 생성
function createMenuItemElement(item, index) {
    const div = document.createElement('div');
    div.className = `menu-item ${item.style}`;
    div.draggable = true;
    div.dataset.index = index;
    
    div.innerHTML = `
        <div class="menu-item-content">
            <div class="menu-item-info">
                <div class="menu-item-title">${item.title}</div>
                <div class="menu-item-subtitle">${item.subtitle}</div>
                <div class="menu-item-url">${item.url}</div>
                <div class="menu-item-meta">
                    스타일: ${getStyleText(item.style)} | 
                    링크: ${item.target === '_blank' ? '새 창' : '현재 창'}
                </div>
            </div>
            <div class="menu-item-actions">
                <button class="btn-edit" onclick="editMenuItem(${index})">편집</button>
                <button class="btn-delete" onclick="deleteMenuItem(${index})">삭제</button>
                <div class="drag-handle">⋮⋮</div>
            </div>
        </div>
        <div class="menu-item-preview">
            <div class="preview-icon">${renderIcon(item.icon)}</div>
            <div class="preview-text">
                <strong>${item.title}</strong>
                <small>${item.subtitle}</small>
            </div>
        </div>
    `;
    
    // 드래그 앤 드롭 이벤트
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);
    
    return div;
}

// 스타일 텍스트 변환
function getStyleText(style) {
    const styles = {
        'normal': '일반',
        'featured': '강조',
        'primary': '중요'
    };
    return styles[style] || '일반';
}

// 아이콘 렌더링
function renderIcon(icon) {
    if (!icon) return '';
    
    // SVG 태그가 포함된 경우
    if (icon.includes('<svg')) {
        return icon;
    }
    
    // path만 있는 경우
    return `<svg viewBox="0 0 24 24" focusable="false"><path d="${icon}"/></svg>`;
}

// 메뉴 모달 열기
function openMenuModal(index = -1) {
    editingMenuIndex = index;
    const modal = document.getElementById('menuModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (index >= 0) {
        // 편집 모드
        const item = currentMenuItems[index];
        modalTitle.textContent = '메뉴 편집';
        document.getElementById('menuTitle').value = item.title;
        document.getElementById('menuSubtitle').value = item.subtitle;
        document.getElementById('menuUrl').value = item.url;
        document.getElementById('menuTarget').value = item.target;
        document.getElementById('menuStyle').value = item.style;
        document.getElementById('menuIcon').value = item.icon;
    } else {
        // 추가 모드
        modalTitle.textContent = '메뉴 추가';
        document.getElementById('menuForm').reset();
    }
    
    modal.style.display = 'flex';
}

// 메뉴 모달 닫기
function closeMenuModal() {
    document.getElementById('menuModal').style.display = 'none';
    editingMenuIndex = -1;
}

// 메뉴 저장 처리
function handleMenuSave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const menuItem = {
        id: editingMenuIndex >= 0 ? currentMenuItems[editingMenuIndex].id : `menu-${Date.now()}`,
        title: document.getElementById('menuTitle').value,
        subtitle: document.getElementById('menuSubtitle').value,
        url: document.getElementById('menuUrl').value,
        target: document.getElementById('menuTarget').value,
        style: document.getElementById('menuStyle').value,
        icon: document.getElementById('menuIcon').value
    };
    
    if (editingMenuIndex >= 0) {
        // 편집
        currentMenuItems[editingMenuIndex] = menuItem;
    } else {
        // 추가
        currentMenuItems.push(menuItem);
    }
    
    renderMenuList();
    closeMenuModal();
    showSuccessMessage();
}

// 메뉴 편집
function editMenuItem(index) {
    openMenuModal(index);
}

// 메뉴 삭제
function deleteMenuItem(index) {
    if (confirm('이 메뉴를 삭제하시겠습니까?')) {
        currentMenuItems.splice(index, 1);
        renderMenuList();
        showSuccessMessage();
    }
}

// 드래그 앤 드롭 처리
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement !== e.target) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(e.target.closest('.menu-item').dataset.index);
        
        // 배열 순서 변경
        const draggedItem = currentMenuItems.splice(draggedIndex, 1)[0];
        currentMenuItems.splice(targetIndex, 0, draggedItem);
        
        renderMenuList();
        showSuccessMessage();
    }
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
}

// 변경사항 저장
function saveChanges() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMenuItems));
    updateMainPage();
    showSuccessMessage('변경사항이 저장되고 메인 페이지에 적용되었습니다!');
}

// 기본값으로 복원
function resetToDefault() {
    if (confirm('모든 메뉴를 기본값으로 복원하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        currentMenuItems = [...DEFAULT_MENU_ITEMS];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMenuItems));
        renderMenuList();
        updateMainPage();
        showSuccessMessage('메뉴가 기본값으로 복원되었습니다!');
    }
}

// 메인 페이지 업데이트
function updateMainPage() {
    // 메인 페이지의 메뉴를 업데이트하는 이벤트 발생
    window.postMessage({ type: 'MENU_UPDATED', menuItems: currentMenuItems }, '*');
}

// 성공 메시지 표시
function showSuccessMessage(message = '변경사항이 저장되었습니다!') {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// 전역 함수로 노출 (HTML onclick에서 사용)
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;