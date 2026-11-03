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
   * Puffy balloon logotype (inline SVG)
   * ------------------------------------------------------------------ */
  var W = 40;
  var GLYPHS = [
    { id: 'm1', part: 'a', type: 'stroke', w: 120, d: 'M0 140 V80 C0 54 14 40 30 40 C46 40 60 54 60 80 V140 M60 80 C60 54 74 40 90 40 C106 40 120 54 120 80 V140', color: '#ff96ff' },
    { id: 'dot', part: 'b', type: 'stroke', w: 0, d: 'M0 134 L0.01 134', color: '#fe806f', extra: 6 },
    { id: 'm2', part: 'c', type: 'stroke', w: 120, d: 'M0 140 V80 C0 54 14 40 30 40 C46 40 60 54 60 80 V140 M60 80 C60 54 74 40 90 40 C106 40 120 54 120 80 V140', color: '#5684fe' },
    { id: 'flower', part: 'c', type: 'flower', w: 124, color: '#caff97' },
    { id: 'e', part: 'd', type: 'stroke', w: 98, d: 'M10 92 H98 C98 58 80 40 54 40 C26 40 8 62 8 90 C8 120 28 140 58 140 C76 140 88 134 96 124', color: '#d0b9ff' },
    { id: 'n', part: 'd', type: 'stroke', w: 74, d: 'M0 140 V80 C0 54 16 40 37 40 C58 40 74 54 74 80 V140', color: '#fe806f' },
    { id: 'v', part: 'd', type: 'stroke', w: 80, d: 'M0 44 L40 136 L80 44', color: '#ff96ff' }
  ];
  var GAP = 4;
  var VARIANTS = {
    pastel: { outline: '#17141f', bg: '#f8fff3', stem: '#17141f', mono: null },
    black: { outline: null, bg: '#f8fff3', stem: '#111111', mono: '#202024' }
  };

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Layout once: x offset per glyph (visual left edge sits on the cursor)
  var LAYOUT = (function () {
    var x = 0, out = {};
    GLYPHS.forEach(function (g) {
      var half = g.type === 'flower' ? 0 : (W + (g.extra || 0)) / 2;
      var vis = g.type === 'flower' ? g.w : g.w + half * 2;
      out[g.id] = { x: x + half, left: x, right: x + vis };
      x += vis + GAP;
    });
    return out;
  })();

  var logoCount = 0;
  function buildLogo(opts) {
    var variant = VARIANTS[opts.variant] || VARIANTS.pastel;
    var parts = opts.parts || ['a', 'b', 'c', 'd'];
    var showStem = opts.stem !== false && parts.indexOf('c') > -1;
    var uid = 'pf' + (++logoCount);
    var glyphs = GLYPHS.filter(function (g) { return parts.indexOf(g.part) > -1; });
    var minX = Infinity, maxX = -Infinity;
    glyphs.forEach(function (g) { minX = Math.min(minX, LAYOUT[g.id].left); maxX = Math.max(maxX, LAYOUT[g.id].right); });
    if (showStem) minX = Math.min(minX, LAYOUT.flower.x - 70);
    var pad = 14;
    var vbX = minX - pad, vbY = 8, vbW = maxX - minX + pad * 2 + 10, vbH = (showStem ? 238 : 170);

    var defs = '<filter id="' + uid + 'f" filterUnits="userSpaceOnUse" x="-120" y="-40" width="300" height="260" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="7.5" result="b"/>' +
      '<feDiffuseLighting in="b" surfaceScale="9" diffuseConstant="1.05" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="52"/></feDiffuseLighting>' +
      '<feSpecularLighting in="b" surfaceScale="9" specularConstant="0.95" specularExponent="30" lighting-color="#fff" result="s"><feDistantLight azimuth="235" elevation="50"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="si"/>' +
      '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="0.76" k2="0.24" result="sh"/>' +
      '<feComposite in="si" in2="sh" operator="arithmetic" k2="1" k3="1" result="o"/>' +
      '<feComposite in="o" in2="SourceAlpha" operator="in"/>' +
      '</filter>';
    var grads = {};
    function gradFor(color) {
      if (grads[color]) return grads[color];
      var id = uid + 'g' + Object.keys(grads).length;
      defs += '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="0" y2="160">' +
        '<stop offset="0" stop-color="' + shade(color, 0.42) + '"/><stop offset=".45" stop-color="' + color + '"/><stop offset="1" stop-color="' + shade(color, -0.22) + '"/></linearGradient>';
      grads[color] = id;
      return id;
    }

    var groups = { a: '', b: '', c: '', d: '' };
    glyphs.forEach(function (g) {
      var color = variant.mono || g.color;
      var fill = 'url(#' + gradFor(color) + ')';
      var x = LAYOUT[g.id].x;
      var s = '';
      if (g.type === 'stroke') {
        var sw = W + (g.extra || 0);
        var common = ' d="' + g.d + '" fill="none" stroke-linecap="round" stroke-linejoin="round"';
        s += '<path' + common + ' stroke="rgba(30,20,60,.14)" stroke-width="' + sw + '" transform="translate(5 9)"/>';
        if (variant.outline) s += '<path' + common + ' stroke="' + variant.outline + '" stroke-width="' + (sw + 9) + '"/>';
        s += '<path' + common + ' stroke="' + fill + '" stroke-width="' + sw + '" filter="url(#' + uid + 'f)"/>';
      } else {
        var cx = 62, cy = 90, R = 27, D = 33, circles = [];
        for (var i = 0; i < 5; i++) {
          var a = -Math.PI / 2 + i * Math.PI * 2 / 5;
          circles.push([cx + D * Math.cos(a), cy + D * Math.sin(a), R]);
        }
        circles.push([cx, cy, 30]);
        var shape = function (extraR, attrs) {
          return circles.map(function (c) { return '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + (c[2] + extraR) + '"' + attrs + '/>'; }).join('');
        };
        s += '<g transform="translate(5 9)" fill="rgba(30,20,60,.14)">' + shape(0, '') + '</g>';
        if (variant.outline) s += '<g fill="' + variant.outline + '">' + shape(4.5, '') + '</g>';
        s += '<g fill="' + fill + '" filter="url(#' + uid + 'f)">' + shape(0, '') + '</g>';
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="' + variant.bg + '"' + (variant.outline ? ' stroke="' + variant.outline + '" stroke-width="4"' : '') + '/>';
      }
      groups[g.part] += '<g transform="translate(' + x + ' 0)">' + s + '</g>';
    });

    var stem = '';
    if (showStem) {
      var fx = LAYOUT.flower.x + 62;
      stem = '<path d="M' + (fx - 20) + ' 138 C' + (fx - 34) + ' 168 ' + (fx - 70) + ' 176 ' + (fx - 96) + ' 196 C' + (fx - 112) + ' 208 ' + (fx - 120) + ' 222 ' + (fx - 124) + ' 236" fill="none" stroke="' + variant.stem + '" stroke-width="7" stroke-linecap="round"/>';
    }

    var body = '';
    ['a', 'b', 'c', 'd'].forEach(function (p) {
      if (parts.indexOf(p) < 0) return;
      body += '<g data-part="' + p + '">' + (p === 'c' ? stem : '') + groups[p] + '</g>';
    });

    return '<svg class="c-puff__svg" viewBox="' + vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>' + defs + '</defs>' + body + '</svg>';
  }

  function currentVariant() {
    var m = /[?&]logo=(pastel|black)/.exec(location.search);
    return (m && m[1]) || root.dataset.logo || 'pastel';
  }

  function renderLogos() {
    var variant = currentVariant();
    document.querySelectorAll('[data-logo]').forEach(function (slot) {
      var v = slot.dataset.variant || variant;
      slot.innerHTML = buildLogo({ variant: v, stem: slot.dataset.logo !== 'side' });
    });
    return variant;
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
   * Opening: logo pieces scattered → fly into the hero logotype
   * ------------------------------------------------------------------ */
  function setupOpening(variant) {
    var overlay = document.querySelector('.l-opening');
    if (!overlay) return;
    if (!root.classList.contains('is-opening')) { overlay.remove(); return; }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    try { sessionStorage.setItem(OPENING_KEY, '1'); } catch (e) {}

    overlay.querySelectorAll('[data-piece]').forEach(function (el) {
      el.innerHTML = buildLogo({ variant: variant, parts: [el.dataset.piece] });
    });

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
      var hero = document.querySelector('.p-fv__heading .c-puff__svg');
      overlay.querySelectorAll('[data-piece]').forEach(function (el, i) {
        var p = el.dataset.piece;
        var from = el.querySelector('[data-part="' + p + '"]');
        var to = hero && hero.querySelector('[data-part="' + p + '"]');
        if (!from || !to) return;
        var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
        var s = b.height / a.height;
        var host = el.getBoundingClientRect();
        var ox = a.left - host.left, oy = a.top - host.top;
        var tx = b.left - (host.left + ox * s), ty = b.top - (host.top + oy * s);
        anims.push(el.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')' }
        ], { duration: 820, delay: i * 50, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }));
      });
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
    var variant = renderLogos();
    root.dataset.logo = variant;
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
    setupOpening(variant);
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) { items = loadMenuItems(); renderLinks(); syncSideNav(); }
    });
  }

  window.mmoenvPop = { buildLogo: buildLogo };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
