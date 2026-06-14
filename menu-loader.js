// 메인 페이지 동적 메뉴 로더

const STORAGE_KEY = 'mmoenv_menu_items';

// 기본 메뉴 데이터 (백업용)
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

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadAndRenderMenu();
    setupMenuUpdateListener();
});

// 메뉴 로드 및 렌더링
function loadAndRenderMenu() {
    let menuItems;
    
    // 로컬 스토리지에서 메뉴 데이터 로드
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            menuItems = JSON.parse(saved);
        } catch (e) {
            console.error('메뉴 데이터 파싱 오류:', e);
            menuItems = DEFAULT_MENU_ITEMS;
        }
    } else {
        menuItems = DEFAULT_MENU_ITEMS;
    }
    
    renderMenuItems(menuItems);
}

// 메뉴 아이템 렌더링
function renderMenuItems(menuItems) {
    const linkList = document.querySelector('.link-list');
    if (!linkList) return;
    
    // 기존 메뉴 제거
    linkList.innerHTML = '';
    
    // 새 메뉴 생성
    menuItems.forEach(item => {
        const linkCard = createLinkCard(item);
        linkList.appendChild(linkCard);
    });
}

// 링크 카드 생성
function createLinkCard(item) {
    const link = document.createElement('a');
    link.className = `link-card ${item.style}`;
    link.href = item.url;
    
    // 외부 링크인 경우
    if (item.target === '_blank') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
    
    // 아이콘 처리
    const iconSvg = renderIcon(item.icon);
    
    link.innerHTML = `
        <span class="icon" aria-hidden="true">
            ${iconSvg}
        </span>
        <span>
            <strong>${item.title}</strong>
            <small>${item.subtitle}</small>
        </span>
    `;
    
    return link;
}

// 아이콘 렌더링
function renderIcon(icon) {
    if (!icon) {
        // 기본 아이콘
        return '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="10"/></svg>';
    }
    
    // 이미 완전한 SVG 태그인 경우
    if (icon.includes('<svg')) {
        return icon;
    }
    
    // SVG 내부 요소들만 있는 경우
    if (icon.includes('<')) {
        return `<svg viewBox="0 0 24 24" focusable="false">${icon}</svg>`;
    }
    
    // path 데이터만 있는 경우
    return `<svg viewBox="0 0 24 24" focusable="false"><path d="${icon}"/></svg>`;
}

// 관리자 페이지에서 메뉴 업데이트 감지
function setupMenuUpdateListener() {
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'MENU_UPDATED') {
            renderMenuItems(event.data.menuItems);
        }
    });
    
    // 스토리지 변경 감지 (다른 탭에서 수정한 경우)
    window.addEventListener('storage', function(event) {
        if (event.key === STORAGE_KEY) {
            loadAndRenderMenu();
        }
    });
}

// 메뉴 데이터 초기화 (개발용)
function resetMenuData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
    loadAndRenderMenu();
}

// 전역으로 노출 (개발자 콘솔에서 사용 가능)
window.menuLoader = {
    loadAndRenderMenu,
    resetMenuData
};