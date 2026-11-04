// m.moenv /pop/ — balloon pop link page
(function () {
  'use strict';

  var STORAGE_KEY = 'mmoenv_menu_items';
  var OPENING_KEY = 'mmoenv_pop_opening';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * Link data (same defaults + normalisation as /menu-loader.js)
   * ------------------------------------------------------------------ */
  var CATEGORY = {
    shop: { label: '상품', en: 'SHOP', color: '#5684fe', thumb: 'ch-gift' },
    order: { label: '주문', en: 'ORDER', color: '#ff96ff', thumb: 'ch-star' },
    contact: { label: '상담', en: 'CONTACT', color: '#caff97', thumb: 'ch-round' },
    social: { label: 'SNS', en: 'SNS', color: '#d0b9ff', thumb: 'ch-dog' }
  };
  var EXTRA_THUMBS = ['ch-heart', 'ch-ride', 'ch-gift', 'ch-star'];

  var DEFAULT_MENU_ITEMS = [
    { id: 'menu-3', title: '카카오 상담하기', subtitle: '자유로운 상담 및 특별 제작 문의', url: 'https://pf.kakao.com/_wDixjX', target: '_blank', category: 'contact' },
    { id: 'menu-1', title: '모엔브 상품 구경하기', subtitle: '바로 구매 가능한 상품 보기', url: 'https://blog.naver.com/juul2/224314871649', target: '_blank', category: 'shop' },
    { id: 'menu-2', title: '주문하기', subtitle: '픽업·배송 예약과 맞춤 제작 상담', url: '/order/', target: '_self', category: 'order' },
    { id: 'menu-4', title: '인스타그램 보기', subtitle: '작업 사진 보기', url: 'https://www.instagram.com/m.moenv', target: '_blank', category: 'social' }
  ];

  function inferCategory(item) {
    var title = ((item.title || '') + ' ' + (item.subtitle || '')).toLowerCase();
    var url = (item.url || '').toLowerCase();
    if (url.indexOf('order') > -1 || title.indexOf('주문') > -1) return 'order';
    if (url.indexOf('kakao') > -1 || title.indexOf('상담') > -1) return 'contact';
    if (url.indexOf('instagram') > -1 || title.indexOf('인스타') > -1) return 'social';
    return 'shop';
  }

  function normalizeMenuItem(item) {
    var title = item.title || '제목 없음';
    var subtitle = title.indexOf('인스타그램') > -1 && /최신/.test(item.subtitle || '') ? '작업 사진 보기' : item.subtitle || '';
    var url = item.url === 'order.html' || item.url === './order.html' ? '/order/' : item.url || '';
    var category = CATEGORY[item.category] ? item.category : inferCategory(item);
    return { id: item.id, title: title, subtitle: subtitle, url: url, target: item.target || '_self', category: category };
  }

  function isKakao(item) {
    return /카카오|카톡/.test(item.title || '') || (item.url || '').toLowerCase().indexOf('pf.kakao.com') > -1;
  }

  function prioritizeKakao(items) {
    var i = items.findIndex(isKakao);
    if (i <= 0) return items;
    return [items[i]].concat(items.slice(0, i), items.slice(i + 1));
  }

  function loadMenuItems() {
    var list = DEFAULT_MENU_ITEMS;
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length) list = saved;
    } catch (e) { /* fall back to defaults */ }
    return prioritizeKakao(list.map(normalizeMenuItem));
  }

  function hostLabel(url) {
    if (/pf\.kakao\.com/.test(url)) return 'Kakao Channel';
    if (/blog\.naver\.com/.test(url)) return 'Naver Blog';
    if (/smartstore\.naver\.com/.test(url)) return 'Smart Store';
    if (/instagram\.com/.test(url)) return 'Instagram';
    if (/^\/|link\.mmoenv\.com/.test(url)) return 'm.moenv';
    try { return new URL(url, location.href).hostname.replace(/^www\./, ''); } catch (e) { return 'Link'; }
  }

  /* ------------------------------------------------------------------
   * Brand logo (original hand-drawn m.moenv mark)
   * ------------------------------------------------------------------ */
  var LOGO_SRC = 'assets/logo-mmoenv.png';
  function logoHTML() {
    return '<img class="c-logo__img" src="' + LOGO_SRC + '" alt="m.moenv" width="936" height="371">';
  }
  function renderLogos() {
    document.querySelectorAll('[data-logo]').forEach(function (slot) { slot.innerHTML = logoHTML(); });
  }

  /* ------------------------------------------------------------------
   * Pixel stickers (SVG, crisp edges)
   * ------------------------------------------------------------------ */
  var PIXELS = {
    heart: ['.DDD...DDD.', 'DXXXD.DXXXD', 'DXWXXDXXXXD', 'DXWXXXXXXXD', 'DXXXXXXXXXD', '.DXXXXXXXD.', '..DXXXXXD..', '...DXXXD...', '....DXD....', '.....D.....'],
    star: ['.....D.....', '....DXD....', '....DXD....', 'DDDDXXXDDDD', 'DXXXXWXXXXD', '.DXXXXXXXD.', '..DXXXXXD..', '..DXXDXXD..', '.DXXD.DXXD.', '.DXD...DXD.', '.DD.....DD.'],
    balloon: ['..DDDDD..', '.DXXXXXD.', 'DXWWXXXXD', 'DXWXXXXXD', 'DXXXXXXXD', 'DXXXXXXXD', '.DXXXXXD.', '..DXXXD..', '...DDD...', '....D....', '.....D...', '....D....', '...D.....'],
    sparkle: ['...D...', '...D...', '..DXD..', 'DDXWXDD', '..DXD..', '...D...', '...D...']
  };
  function renderPixels() {
    document.querySelectorAll('[data-pixel]').forEach(function (el) {
      var grid = PIXELS[el.dataset.pixel];
      if (!grid) return;
      var h = grid.length, w = grid[0].length, rects = '';
      grid.forEach(function (row, y) {
        row.split('').forEach(function (ch, x) {
          if (ch === '.') return;
          var fill = ch === 'D' ? '#17141f' : ch === 'W' ? '#ffffff' : 'var(--c, #ff96ff)';
          rects += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + fill + '"/>';
        });
      });
      el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + rects + '</svg>';
      el.style.aspectRatio = w + ' / ' + h;
    });
  }

  /* ------------------------------------------------------------------
   * Marquees
   * ------------------------------------------------------------------ */
  var MARQUEES = {
    opening: { items: ['풍선으로 마음을 전해요!', 'MAKE YOUR MOMENTS LOVELY!', '用气球传递心意!', '風船で想いを届けよう!'], icons: ['ch-heart', 'ch-star'] },
    info: { items: ['동탄 픽업', '전국 택배', '동탄/오산 직접배송', '맞춤 제작 상담'], icons: ['ch-round', 'ch-heart', 'ch-star', 'ch-dog'] },
    band: { items: ['작은 사랑으로 큰 행복을.', 'A LITTLE LOVE, A LOT OF HAPPINESS.'], icons: [] }
  };
  function renderMarquees() {
    document.querySelectorAll('[data-marquee]').forEach(function (track) {
      var conf = MARQUEES[track.dataset.marquee];
      if (!conf) return;
      var unit = '';
      for (var r = 0; r < 2; r++) {
        conf.items.forEach(function (text, i) {
          unit += '<span class="c-marquee__text">' + text + '</span>';
          if (conf.icons.length) unit += '<img class="c-marquee__icon" src="assets/' + conf.icons[i % conf.icons.length] + '.webp" alt="" width="40" height="40">';
        });
      }
      track.innerHTML = '<div class="c-marquee__group">' + unit + '</div><div class="c-marquee__group">' + unit + '</div>';
    });
  }

  /* ------------------------------------------------------------------
   * Link cards + filters
   * ------------------------------------------------------------------ */
  var items = [];
  var activeFilter = 'all';
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9.5 8H16v6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function cardHTML(item, index) {
    var cat = CATEGORY[item.category];
    var thumb = index < 4 ? cat.thumb : EXTRA_THUMBS[index % EXTRA_THUMBS.length];
    var blank = item.target === '_blank';
    var pix = ['heart', 'star', 'sparkle', 'balloon'][index % 4];
    return '<a class="c-card" data-category="' + item.category + '" href="' + esc(item.url) + '"' + (blank ? ' target="_blank" rel="noopener noreferrer"' : '') + ' style="--cat:' + cat.color + '">' +
      '<span class="c-card__thumb"><img src="assets/' + thumb + '.webp" alt="" width="360" height="360" loading="lazy">' +
      '<span class="c-pixel c-card__pixel" data-pixel="' + pix + '" style="--c:#fff"></span>' +
      '<span class="c-card__no u-mono">No.' + String(index + 1).padStart(2, '0') + '</span></span>' +
      '<span class="c-card__meta u-mono"><span>' + cat.en + ' — ' + (blank ? 'NEW TAB' : 'THIS PAGE') + '</span><span class="c-card__status">OPEN</span></span>' +
      '<strong class="c-card__title">' + esc(item.title) + '</strong>' +
      '<span class="c-card__sub">' + esc(item.subtitle) + '</span>' +
      '<span class="c-card__foot"><span class="c-card__tags"><span class="c-tag c-tag--cat">' + cat.label + '</span><span class="c-tag c-tag--host u-mono">' + esc(hostLabel(item.url)) + '</span></span>' +
      '<span class="c-card__go">' + ARROW + '</span></span>' +
      '</a>';
  }

  function renderLinks() {
    var grid = document.querySelector('[data-link-grid]');
    var empty = document.querySelector('[data-link-empty]');
    var count = document.querySelector('[data-link-count]');
    if (!grid) return;
    var visible = items.map(function (it, i) { return [it, i]; }).filter(function (p) {
      return activeFilter === 'all' || p[0].category === activeFilter;
    });
    grid.innerHTML = visible.map(function (p) { return cardHTML(p[0], p[1]); }).join('');
    if (empty) empty.hidden = visible.length > 0;
    if (count) count.textContent = String(visible.length).padStart(2, '0');
    renderPixels();
    grid.querySelectorAll('.c-card').forEach(function (card, i) {
      card.style.setProperty('--d', (i * 70) + 'ms');
    });
  }

  function syncSideNav() {
    document.querySelectorAll('[data-side]').forEach(function (a) {
      var hit = items.find(function (it) { return it.category === a.dataset.side; });
      if (!hit) return;
      a.href = hit.url;
      if (hit.target === '_blank') { a.target = '_blank'; a.rel = 'noopener noreferrer'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
    var kakao = items.find(isKakao);
    var kakaoBtn = document.querySelector('.p-header__kakao');
    if (kakao && kakaoBtn) kakaoBtn.href = kakao.url;
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(function (b) {
          b.classList.toggle('is-current', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        renderLinks();
        var target = document.getElementById('links');
        if (target) scrollToEl(target);
      });
    });
  }

  /* ------------------------------------------------------------------
   * Clock, smooth scroll, parallax, cursor
   * ------------------------------------------------------------------ */
  function setupClock() {
    var el = document.querySelector('[data-clock]');
    if (!el) return;
    var fmt = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul' });
    var tick = function () { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  function scrollToEl(el) {
    var y = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 1000 ? 70 : 24);
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function setupScrollLinks() {
    document.querySelectorAll('.js-scroll').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = (a.getAttribute('href') || '').slice(1);
        var el = id && document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        if (id === 'top') window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        else scrollToEl(el);
      });
    });
  }

  function setupParallax() {
    if (reduceMotion) return;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
    var ticking = false;
    var update = function () {
      var y = window.scrollY;
      els.forEach(function (el) {
        var sp = parseFloat(el.dataset.speed) || 0;
        el.style.setProperty('--py', (y * sp).toFixed(1) + 'px');
      });
      root.classList.toggle('is-scrolled', y > window.innerHeight * 0.6);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function setupCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cursor = document.querySelector('.c-cursor');
    if (!cursor) return;
    root.classList.add('has-cursor');
    var x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      var hit = e.target.closest && e.target.closest('a, button');
      cursor.classList.toggle('is-pointer', !!hit);
      cursor.classList.add('is-visible');
    });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('is-visible'); });
    var loop = function () {
      cx += (x - cx) * (reduceMotion ? 1 : 0.35);
      cy += (y - cy) * (reduceMotion ? 1 : 0.35);
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    };
    loop();
  }

  function setupInview() {
    var targets = document.querySelectorAll('.p-intro, .p-links, .p-footer');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add('is-inview'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-inview'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ------------------------------------------------------------------
   * Opening: big hand-drawn logo draws in → flies into the hero slot
   * ------------------------------------------------------------------ */
  function setupOpening() {
    var overlay = document.querySelector('.l-opening');
    if (!overlay) return;
    if (!root.classList.contains('is-opening')) { overlay.remove(); return; }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    try { sessionStorage.setItem(OPENING_KEY, '1'); } catch (e) {}

    var timers = [], anims = [], done = false;
    var finish = function () {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      root.classList.remove('is-opening');
      root.classList.add('is-opened');
      overlay.remove();
    };
    overlay.addEventListener('click', finish);
    root.classList.add('is-opening-in');

    timers.push(setTimeout(function () {
      var hero = document.querySelector('.p-fv__heading .c-logo__img');
      var big = overlay.querySelector('.p-opening__logo');
      if (hero && big) {
        var a = big.getBoundingClientRect(), h = hero.getBoundingClientRect();
        anims.push(big.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: 'translate(' + (h.left - a.left) + 'px,' + (h.top - a.top) + 'px) scale(' + (h.width / a.width) + ')' }
        ], { duration: 820, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }));
      }
      var card = overlay.querySelector('.p-opening__visual');
      var mv = document.querySelector('.p-fv__mv-image');
      if (card && mv) {
        var c = card.getBoundingClientRect(), m = mv.getBoundingClientRect();
        anims.push(card.animate([
          { transform: 'translate(0,0) scale(1,1)', borderRadius: '24px' },
          { transform: 'translate(' + (m.left - c.left) + 'px,' + (m.top - c.top) + 'px) scale(' + (m.width / c.width) + ',' + (m.height / c.height) + ')', borderRadius: '0px', opacity: 0.0 }
        ], { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }));
      }
      root.classList.add('is-opening-out');
    }, 1500));

    timers.push(setTimeout(finish, 2500));
  }

  /* ------------------------------------------------------------------ */
  function init() {
    renderLogos();
    renderPixels();
    renderMarquees();
    items = loadMenuItems();
    renderLinks();
    syncSideNav();
    setupFilters();
    setupClock();
    setupScrollLinks();
    setupParallax();
    setupCursor();
    setupInview();
    setupOpening();
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) { items = loadMenuItems(); renderLinks(); syncSideNav(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
