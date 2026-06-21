// 메인 페이지 동적 메뉴 로더

const STORAGE_KEY = 'mmoenv_menu_items';
const CATEGORY_LABELS = {
    shop: '상품',
    order: '주문',
    contact: '상담',
    social: 'SNS',
};

let activeFilter = 'all';
let currentMenuItems = [];

const DEFAULT_MENU_ITEMS = [
    {
        id: 'menu-1',
        title: '모엔브 상품 구경하기',
        subtitle: '바로 구매 가능한 상품 보기',
        url: 'https://blog.naver.com/juul2/224314871649',
        target: '_blank',
        style: 'featured',
        category: 'shop',
        icon: 'M6.3 8.2h11.4l-.8 10.5a1.8 1.8 0 0 1-1.8 1.6H8.9a1.8 1.8 0 0 1-1.8-1.6L6.3 8.2Z M9 8.2V7a3 3 0 0 1 6 0v1.2'
    },
    {
        id: 'menu-2',
        title: '주문하기',
        subtitle: '픽업·배송 예약과 맞춤 제작 상담',
        url: '/order',
        target: '_self',
        style: 'primary',
        category: 'order',
        icon: 'M9 11H7v2h2v-2Z M13 11h-2v2h2v-2Z M17 11h-2v2h2v-2Z M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2ZM19 20H5V9h14v11Z'
    },
    {
        id: 'menu-3',
        title: '카카오 상담하기',
        subtitle: '자유로운 상담 및 특별 제작 문의',
        url: 'https://pf.kakao.com/_wDixjX',
        target: '_blank',
        style: 'normal',
        category: 'contact',
        icon: 'M12 4.2c-4.7 0-8.5 3-8.5 6.8 0 2.4 1.6 4.5 4 5.7l-.7 2.8c-.1.4.3.7.6.4l3.2-2.2c.5.1.9.1 1.4.1 4.7 0 8.5-3 8.5-6.8S16.7 4.2 12 4.2Z'
    },
    {
        id: 'menu-4',
        title: '인스타그램 보기',
        subtitle: '작업 사진 보기',
        url: 'https://www.instagram.com/m.moenv',
        target: '_blank',
        style: 'normal',
        category: 'social',
        icon: '<rect x="5" y="5" width="14" height="14" rx="4"/> <circle cx="12" cy="12" r="3.2"/> <circle cx="16.3" cy="7.8" r=".8"/>'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    setupFilterControls();
    loadAndRenderMenu();
    setupMenuUpdateListener();
});

function loadAndRenderMenu() {
    currentMenuItems = loadMenuItems();
    renderMenuItems();
}

function loadMenuItems() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return DEFAULT_MENU_ITEMS.map(normalizeMenuItem);
    }

    try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            return DEFAULT_MENU_ITEMS.map(normalizeMenuItem);
        }
        return parsed.map(normalizeMenuItem);
    } catch (error) {
        console.error('메뉴 데이터 파싱 오류:', error);
        return DEFAULT_MENU_ITEMS.map(normalizeMenuItem);
    }
}

function normalizeMenuItem(item) {
    const title = item.title || '제목 없음';
    const subtitle = title.includes('인스타그램') && /최신/.test(item.subtitle || '')
        ? '작업 사진 보기'
        : item.subtitle || '';
    const url = item.url === 'order.html' || item.url === './order.html'
        ? '/order'
        : item.url || '';

    return {
        ...item,
        category: item.category || inferCategory(item),
        title,
        subtitle,
        url,
        target: item.target || '_self',
        style: item.style || 'normal',
    };
}

function inferCategory(item) {
    const title = `${item.title || ''} ${item.subtitle || ''}`.toLowerCase();
    const url = `${item.url || ''}`.toLowerCase();

    if (url.includes('order') || title.includes('주문')) return 'order';
    if (url.includes('kakao') || title.includes('상담')) return 'contact';
    if (url.includes('instagram') || title.includes('인스타')) return 'social';
    return 'shop';
}

function setupFilterControls() {
    document.querySelectorAll('.filter-option').forEach(function(button) {
        button.addEventListener('click', function() {
            activeFilter = button.dataset.filter || 'all';
            document.querySelectorAll('.filter-option').forEach(function(option) {
                option.classList.toggle('is-active', option === button);
            });
            renderMenuItems();
        });
    });
}

function renderMenuItems() {
    const linkList = document.querySelector('.link-list');
    const emptyState = document.querySelector('.empty-state');
    if (!linkList) return;

    const visibleItems = currentMenuItems.filter(function(item) {
        const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
        return matchesCategory;
    });

    linkList.innerHTML = '';
    visibleItems.forEach(function(item) {
        linkList.appendChild(createLinkRow(item));
    });

    if (emptyState) {
        emptyState.hidden = visibleItems.length > 0;
    }
}

function createLinkRow(item) {
    const link = document.createElement('a');
    link.className = `link-row ${item.style}`;
    link.dataset.category = item.category;
    link.href = item.url;

    if (item.target === '_blank') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    const text = document.createElement('span');
    const title = document.createElement('strong');
    const meta = document.createElement('small');
    const arrow = document.createElement('span');

    title.textContent = item.title;
    meta.textContent = `${CATEGORY_LABELS[item.category] || '링크'} | ${item.subtitle}`;
    arrow.className = 'link-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = 'OPEN';

    text.append(title, meta);
    link.append(text, arrow);
    return link;
}

function setupMenuUpdateListener() {
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'MENU_UPDATED') {
            currentMenuItems = event.data.menuItems.map(normalizeMenuItem);
            renderMenuItems();
        }
    });

    window.addEventListener('storage', function(event) {
        if (event.key === STORAGE_KEY) {
            loadAndRenderMenu();
        }
    });
}

function resetMenuData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
    loadAndRenderMenu();
}

window.menuLoader = {
    loadAndRenderMenu,
    resetMenuData
};
