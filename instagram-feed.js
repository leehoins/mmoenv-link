// 자체 Instagram 피드 렌더러

const INSTAGRAM_FALLBACK_ITEMS = [
    {
        id: 'fallback-1',
        caption: '맞춤 풍선 작업과 최신 소식은 인스타그램에서 확인할 수 있어요.',
        media_type: 'IMAGE',
        media_url: 'assets/hero.jpg',
        permalink: 'https://www.instagram.com/m.moenv',
        timestamp: new Date().toISOString(),
    },
    {
        id: 'fallback-2',
        caption: '동탄 픽업, 전국 택배, 맞춤 제작 상담을 도와드려요.',
        media_type: 'IMAGE',
        media_url: 'logo.png',
        permalink: 'https://www.instagram.com/m.moenv',
        timestamp: new Date().toISOString(),
    },
];

document.addEventListener('DOMContentLoaded', function() {
    loadInstagramFeed();
});

async function loadInstagramFeed() {
    const feed = document.querySelector('[data-instagram-feed]');
    if (!feed) return;

    try {
        const items = await fetchInstagramFeed();
        renderInstagramFeed(feed, items.length > 0 ? items : INSTAGRAM_FALLBACK_ITEMS, items.length === 0);
    } catch (error) {
        console.warn('인스타그램 피드 로드 실패:', error);
        renderInstagramFeed(feed, INSTAGRAM_FALLBACK_ITEMS, true);
    }
}

async function fetchInstagramFeed() {
    const config = window.SUPABASE_CONFIG;
    const feedConfig = config?.instagramFeed || {};
    if (!feedConfig.enabled || !config?.url || !config?.anonKey) {
        return [];
    }

    const endpoint = new URL(`${config.url.replace(/\/$/, '')}/rest/v1/instagram_feed`);
    endpoint.searchParams.set('select', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username');
    endpoint.searchParams.set('is_visible', 'eq.true');
    endpoint.searchParams.set('order', 'timestamp.desc');
    endpoint.searchParams.set('limit', String(feedConfig.limit || 9));

    const response = await fetch(endpoint, {
        headers: {
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Supabase feed request failed: ${response.status}`);
    }

    const items = await response.json();
    return Array.isArray(items) ? items : [];
}

function renderInstagramFeed(feed, items, isFallback) {
    feed.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'instagram-feed-grid';

    items.forEach(function(item) {
        grid.appendChild(createInstagramCard(item));
    });

    feed.appendChild(grid);

    if (isFallback) {
        const status = document.createElement('p');
        status.className = 'feed-status feed-status-muted';
        status.textContent = '등록된 작업 소식이 아직 없어 기본 안내를 표시합니다.';
        feed.appendChild(status);
    }
}

function createInstagramCard(item) {
    const card = document.createElement('a');
    card.className = 'instagram-card';
    card.href = item.permalink || 'https://www.instagram.com/m.moenv';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const media = document.createElement('div');
    media.className = 'instagram-card-media';

    const image = document.createElement('img');
    image.src = item.thumbnail_url || item.media_url;
    image.alt = getCaptionPreview(item.caption) || 'm.moenv Instagram post';
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', function() {
        image.src = 'logo.png';
        media.classList.add('is-fallback-image');
    }, { once: true });

    media.appendChild(image);

    if (item.media_type === 'VIDEO') {
        const badge = document.createElement('span');
        badge.className = 'instagram-media-badge';
        badge.textContent = 'VIDEO';
        media.appendChild(badge);
    }

    const body = document.createElement('div');
    body.className = 'instagram-card-body';

    const caption = document.createElement('p');
    caption.className = 'instagram-caption';
    caption.textContent = getCaptionPreview(item.caption) || '모엔브 작업 소식';

    const meta = document.createElement('span');
    meta.className = 'instagram-meta';
    meta.textContent = formatInstagramDate(item.timestamp);

    body.append(caption, meta);
    card.append(media, body);
    return card;
}

function getCaptionPreview(caption) {
    if (!caption) return '';
    return caption.replace(/\s+/g, ' ').trim().slice(0, 90);
}

function formatInstagramDate(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return 'INSTAGRAM';

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
