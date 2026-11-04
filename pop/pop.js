// m.moenv /pop/ — Fibery-style landing interactions
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real catalogue from /order-script-multi.js
  var PRODUCTS = [
    ['24인치 버블인버블 레터링 풍선', 'he', 35000, '레터링 · 유지 약 7~10일'],
    ['24인치 마카롱 레터링 풍선', 'he', 33000, '레터링 · 유지 약 7~10일'],
    ['24인치 미니쉐입', 'he', 35000, '레터링 가능'],
    ['22인치 하트인하트', 'he', 32000, '레터링 가능'],
    ['숫자은박(대형)', 'he', 29000, '생일·기념일 숫자'],
    ['서커스풍선', 'he', 19000, '레터링 가능'],
    ['클리어 풍선', 'he', 8000, '택배 불가 · 픽업·퀵 가능'],
    ['미니옹브레', 'he', 6000, '레터링 가능'],
    ['다발 풍선(라운드)', 'he', 4000, '개당 · 제작 후 10시간 이내'],
    ['풍선케이크(기본)', 'air', 19000, '유지 1~3일'],
    ['풍선케이크(미니)', 'air', 13000, '유지 1~3일'],
    ['숫자은박(공기)', 'air', 8000, '뜨지 않는 숫자'],
    ['데이지 꽃풍선', 'air', 5000, '유지 1~3일'],
    ['튤립 꽃풍선', 'air', 5000, '유지 1~3일']
  ];

  var VIEWS = {
    pickup: { title: '동탄 픽업', rows: [
      ['장소', '동탄 본점 · 비대면 픽업'],
      ['시간', '09:00–20:00, 30분 단위로 고르기'],
      ['날짜', '상담을 통해 실제 날짜와 시간을 정해요', 'state'],
      ['주의', '픽업 1시간 이후 생긴 파손은 책임지기 어려워요']
    ] },
    parcel: { title: '전국 택배', rows: [
      ['도착', '보통 다음 날 도착 95% · 상황에 따라 2일'],
      ['출고', '행사일 기준 2~3일 전 출고', 'state'],
      ['지정', '도착 날짜와 시간은 지정할 수 없어요'],
      ['비용', '택배비 별도 · 클리어 풍선은 택배 불가']
    ] },
    direct: { title: '동탄·오산 직접 배송', rows: [
      ['지역', '동탄 · 오산'],
      ['비용', '7만 원 이상 구매 시 무료', 'state'],
      ['시간', '받는 시간은 상담 후 확정돼요'],
      ['주소', '주문서에 받을 분 연락처와 주소를 적어 주세요']
    ] },
    schedule: { title: '택배 발송 요일표', rows: [
      ['월~수요일 사용', '상담 후 결정'],
      ['목요일 사용', '월요일 발송', 'state'],
      ['금요일 사용', '화요일 발송'],
      ['토요일 사용', '수요일 발송'],
      ['일요일 사용', '목요일 발송']
    ] }
  };

  var OCCASIONS = {
    birthday: '숫자은박(대형)에 이름을 넣은 버블인버블 레터링 풍선을 더하면, 사진 한 장에 나이와 이름이 다 담겨요.',
    anniv: '하트인하트나 마카롱 레터링 풍선에 “우리 100일”처럼 짧은 문구를 넣어 보세요. 풍선케이크를 곁들여도 좋아요.',
    propose: '헬륨 풍선은 미리 주문해도 사용일 직전에 만들어요. 문구는 “Will you marry me?”처럼 대소 문자까지 그대로 적어 주세요.',
    event: '개수가 많은 행사라면 10개 이상 주문 할인이 있어요. 동탄·오산이면 7만 원 이상 직접 배송이 무료예요.'
  };

  var CHIPS = {
    a: [['cake', 'HAPPY BIRTHDAY'], ['ring', 'Will you marry me?'], ['gradcap', '합격 축하해!'], ['bouquet', '엄마 아빠 사랑해요'], ['rattle', 'Welcome Baby'], ['cheers', '결혼 축하해'], ['popper', 'Grand Open'], ['letter', '우리 100일'], ['trophy', '수고했어 오늘도']],
    b: [['sparkle', 'HAPPY 30th'], ['dress', 'Bride to be'], ['cake', '서윤아 생일 축하해'], ['balloon', 'Congratulations'], ['tulip', '선생님 감사합니다'], ['star', '퇴사 축하해'], ['paw', '두부야 생일 축하해'], ['heart', 'Love you forever'], ['bottle', '전역 축하해']]
  };

  function won(n) { return n.toLocaleString('ko-KR') + '원'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderProducts() {
    var tb = document.querySelector('[data-product-rows]');
    if (!tb) return;
    tb.innerHTML = PRODUCTS.map(function (p, i) {
      var tag = p[1] === 'he' ? '<span class="c-tag c-tag--he">' + window.mmIcons.icon('balloon') + '헬륨</span>' : '<span class="c-tag c-tag--air">' + window.mmIcons.icon('flower') + '공기</span>';
      return '<tr><td><span class="n">' + (i + 1) + '</span>' + esc(p[0]) + '</td><td>' + tag + '</td><td>' + won(p[2]) + '</td><td class="c-memo">' + esc(p[3]) + '</td></tr>';
    }).join('');
  }

  function setView(key) {
    var v = VIEWS[key];
    if (!v) return;
    document.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('is-on', b.dataset.view === key); });
    var t = document.querySelector('[data-view-title]');
    var tb = document.querySelector('[data-view-rows]');
    if (t) t.textContent = v.title;
    if (tb) tb.innerHTML = v.rows.map(function (r) {
      var val = r[2] === 'state' ? '<span class="c-state">' + esc(r[1]) + '</span>' : esc(r[1]);
      return '<tr' + (r[2] === 'state' ? ' class="hl"' : '') + '><td>' + esc(r[0]) + '</td><td>' + val + '</td></tr>';
    }).join('');
    if (tb) Array.prototype.forEach.call(tb.rows, function (tr, i) { tr.style.setProperty('--i', i); });
  }

  function setupViews() {
    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { setView(b.dataset.view); });
    });
    document.querySelectorAll('[data-jump-view]').forEach(function (a) {
      a.addEventListener('click', function () { setView(a.dataset.jumpView); });
    });
    setView('pickup');
  }

  function setupOccasions() {
    var note = document.querySelector('[data-occasion-note]');
    document.querySelectorAll('[data-occasion]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-occasion]').forEach(function (x) {
          x.classList.toggle('is-on', x === b);
          x.setAttribute('aria-selected', x === b ? 'true' : 'false');
        });
        if (note) note.textContent = OCCASIONS[b.dataset.occasion] || '';
      });
    });
  }

  function renderChips() {
    document.querySelectorAll('[data-chips]').forEach(function (row) {
      var list = CHIPS[row.dataset.chips] || [];
      var unit = list.map(function (c) { return '<span class="c-chip">' + window.mmIcons.icon(c[0]) + esc(c[1]) + '</span>'; }).join('');
      row.innerHTML = unit + unit;
    });
  }

  function setupReveal() {
    var els = document.querySelectorAll('.c-panel, .c-mini, .c-card, .c-bubble, .c-note-card, .c-route, .s-support__card, .c-island, .c-hub__city, .s-final__title');
    els.forEach(function (el) { el.classList.add('js-reveal'); });
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function setupHeader() {
    var h = document.querySelector('.l-header');
    if (!h) return;
    var on = function () { h.classList.toggle('is-stuck', window.scrollY > 10); };
    window.addEventListener('scroll', on, { passive: true });
    on();
  }


  /* ------------------------------------------------------------------
   * MOTION
   * ------------------------------------------------------------------ */
  var EASE = 'cubic-bezier(.45, 0, .2, 1)';
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function splitHeroTitle() {
    var t = document.querySelector('.s-hero__title');
    if (!t || t.dataset.split) return;
    t.dataset.split = '1';
    t.innerHTML = t.innerHTML.split(/<br\s*\/?>/i).map(function (line, i) {
      return '<span class="ln"><span style="--i:' + i + '">' + line.trim() + '</span></span>';
    }).join('');
  }

  function splitFinalTitle() {
    var t = document.querySelector('.s-final__title');
    if (!t) return;
    t.innerHTML = t.textContent.trim().split(/\s+/).map(function (w, i) {
      return '<span class="w" style="--i:' + i + '">' + esc(w) + '</span>';
    }).join(' ');
  }

  // Generic "is-in" trigger for motion blocks
  function observeIn(selector, threshold) {
    var els = document.querySelectorAll(selector);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: threshold || 0.2 });
    els.forEach(function (e) { io.observe(e); });
  }

  function setupIslands() {
    document.querySelectorAll('.c-islands__strings path').forEach(function (p) { p.setAttribute('pathLength', '1'); });
    document.querySelectorAll('.c-island').forEach(function (f, i) {
      f.style.transitionDelay = (i * 130) + 'ms';
      f.style.setProperty('--fd', (-i * 1.3) + 's');
    });
    document.querySelectorAll('.c-hub__labels li').forEach(function (li, i) {
      var p = document.createElement('i');
      p.className = 'c-hub__pulse';
      p.style.setProperty('--i', i);
      li.appendChild(p);
    });
  }

  function setupFloatingBalloons() {
    if (reduce) return;
    var COLORS = ['#f7a8c4', '#9ccfe0', '#f6d58f', '#c9b6ef', '#b9dca8', '#f4b49a'];
    [['.s-islands', 14], ['.s-final', 8]].forEach(function (conf) {
      var host = document.querySelector(conf[0]);
      if (!host) return;
      var layer = document.createElement('div');
      layer.className = 'c-float-layer';
      layer.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < conf[1]; i++) {
        var c = COLORS[i % COLORS.length];
        var s = 18 + Math.round(Math.random() * 26);
        var b = document.createElement('span');
        b.className = 'c-fb';
        b.style.setProperty('--x', (Math.random() * 96).toFixed(1) + '%');
        b.style.setProperty('--s', s + 'px');
        b.style.setProperty('--d', (16 + Math.random() * 14).toFixed(1) + 's');
        b.style.setProperty('--dl', (-Math.random() * 28).toFixed(1) + 's');
        b.style.setProperty('--dx', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
        b.innerHTML = '<svg viewBox="0 0 40 92"><path d="M20 50 q-6 14 2 26 t-2 16" fill="none" stroke="#9c8676" stroke-width="1.2"/>' +
          '<ellipse cx="20" cy="24" rx="17" ry="21" fill="' + c + '" stroke="#2a2320" stroke-width="1.6"/>' +
          '<path d="M17 45 h6 l-3 5z" fill="' + c + '" stroke="#2a2320" stroke-width="1.4" stroke-linejoin="round"/>' +
          '<ellipse cx="13" cy="15" rx="4" ry="6" fill="#fff" opacity=".6" transform="rotate(-25 13 15)"/></svg>';
        layer.appendChild(b);
      }
      host.insertBefore(layer, host.firstChild);
      var setH = function () { layer.style.setProperty('--h', host.offsetHeight + 'px'); layer.querySelectorAll('.c-fb').forEach(function (x) { x.style.setProperty('--h', host.offsetHeight + 'px'); }); };
      setH();
      window.addEventListener('resize', setH);
    });
  }

  function setupEntityLinks() {
    var wrap = document.querySelector('.c-entities');
    if (!wrap) return;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'c-entities__links');
    svg.setAttribute('aria-hidden', 'true');
    wrap.appendChild(svg);
    var dots = [];
    var draw = function () {
      var cards = wrap.querySelectorAll('.c-entity');
      var W = wrap.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + W.width + ' ' + W.height);
      svg.innerHTML = '';
      dots.forEach(function (d) { d.remove(); });
      dots = [];
      if (window.innerWidth <= 760) return;
      for (var i = 0; i < cards.length - 1; i++) {
        var a = cards[i].getBoundingClientRect(), b = cards[i + 1].getBoundingClientRect();
        if (Math.abs(a.top - b.top) > a.height) continue;
        var rowA = cards[i].querySelectorAll('li')[1] || cards[i];
        var rowB = cards[i + 1].querySelectorAll('li')[0] || cards[i + 1];
        var ra = rowA.getBoundingClientRect(), rb = rowB.getBoundingClientRect();
        var x1 = a.right - W.left - 2, y1 = ra.top + ra.height / 2 - W.top;
        var x2 = b.left - W.left + 2, y2 = rb.top + rb.height / 2 - W.top;
        var mx = (x1 + x2) / 2;
        var d = 'M' + x1 + ' ' + y1 + ' C' + (mx + 6) + ' ' + y1 + ' ' + (mx - 6) + ' ' + y2 + ' ' + x2 + ' ' + y2;
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('pathLength', '1');
        p.style.transitionDelay = (0.3 + i * 0.25) + 's';
        svg.appendChild(p);
        var dot = document.createElement('i');
        dot.className = 'c-entities__dot';
        dot.style.offsetPath = "path('" + d + "')";
        dot.style.animationDelay = (i * 0.5) + 's';
        wrap.appendChild(dot);
        dots.push(dot);
      }
    };
    draw();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 150); });
    window.addEventListener('load', draw);
  }

  function indexTableRows() {
    document.querySelectorAll('.c-table tbody').forEach(function (tb) {
      Array.prototype.forEach.call(tb.rows, function (tr, i) { tr.style.setProperty('--i', i); });
    });
  }

  /* Hero lettering board: a looping "live collaboration" scene */
  function setupBoard() {
    var board = document.querySelector('.c-board');
    if (!board || reduce) return;
    var svg = board.querySelector('.c-board__lines');
    var cardA = board.querySelector('.c-board__card--a');
    var cardB = board.querySelector('.c-board__card--b');
    var heart = board.querySelector('.c-board__heart');
    var heartText = heart.querySelector('span');
    var meta = board.querySelector('.c-board__meta');
    var metaB = meta.querySelector('b'), metaS = meta.querySelector('span');
    var stickies = Array.prototype.slice.call(board.querySelectorAll('.c-sticky'));
    var curA = board.querySelector('.c-cursor--a');
    var curB = board.querySelector('.c-cursor--b');
    var tools = Array.prototype.slice.call(board.querySelectorAll('.c-board__toolbar span'));
    var NS = 'http://www.w3.org/2000/svg';
    var visible = false, waiters = [];

    board.classList.add('is-scripted');
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) { waiters.forEach(function (w) { w(); }); waiters = []; }
    }, { threshold: 0.15 }).observe(board);
    function whenVisible() { return visible && !document.hidden ? Promise.resolve() : new Promise(function (r) { waiters.push(r); }); }
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible) { waiters.forEach(function (w) { w(); }); waiters = []; } });

    function rel(el, ax, ay) {
      var b = board.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width * ax, y: r.top - b.top + r.height * ay };
    }
    function shown(el) { return el && el.offsetParent !== null && getComputedStyle(el).display !== 'none'; }
    function clampP(p) { return { x: Math.max(4, Math.min(p.x, board.clientWidth - 78)), y: Math.max(4, Math.min(p.y, board.clientHeight - 40)) }; }
    function place(cur, p) { cur.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)'; cur._p = p; }
    function move(cur, p, dur) {
      p = clampP(p);
      var from = cur._p || p;
      place(cur, p);
      var a = cur.animate([{ transform: 'translate(' + from.x + 'px,' + from.y + 'px)' }, { transform: 'translate(' + p.x + 'px,' + p.y + 'px)' }], { duration: dur, easing: EASE });
      return a.finished.catch(function () {});
    }
    function tap(cur, color) {
      var t = document.createElement('span');
      t.className = 'c-tap';
      t.style.left = cur._p.x + 'px'; t.style.top = cur._p.y + 'px'; t.style.color = color;
      board.appendChild(t);
      setTimeout(function () { t.remove(); }, 700);
      cur.animate([{ scale: 1 }, { scale: .8 }, { scale: 1 }], { duration: 260 });
    }
    function tool(i) { tools.forEach(function (t, k) { t.classList.toggle('is-on', k === i); }); }
    function drawLine(from, to, cur, dur) {
      var b = board.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
      svg.setAttribute('preserveAspectRatio', 'none');
      var path = document.createElementNS(NS, 'path');
      var d = 'M' + from.x + ' ' + from.y + ' C' + (from.x + 90) + ' ' + from.y + ' ' + (to.x - 90) + ' ' + to.y + ' ' + to.x + ' ' + to.y;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#7a5bd0');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      return new Promise(function (res) {
        var t0 = performance.now();
        (function step(now) {
          var t = Math.min(1, (now - t0) / dur);
          var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          path.style.strokeDashoffset = len * (1 - e);
          var pt = path.getPointAtLength(len * e);
          place(cur, { x: pt.x, y: pt.y });
          if (t < 1) requestAnimationFrame(step);
          else { path.style.strokeDasharray = '5 5'; path.style.strokeDashoffset = 0; path.setAttribute('stroke', '#7aa6c2'); path.setAttribute('stroke-width', '1.5'); res(); }
        })(t0);
      });
    }
    async function type(lines) {
      heartText.innerHTML = '<i class="caret"></i>';
      var out = '';
      for (var l = 0; l < lines.length; l++) {
        if (l > 0) out += '<br>';
        for (var c = 0; c < lines[l].length; c++) {
          out += esc(lines[l][c]);
          heartText.innerHTML = out + '<i class="caret"></i>';
          await sleep(lines[l][c] === ' ' ? 40 : 85);
        }
      }
      await sleep(400);
      heartText.innerHTML = out;
    }

    var SCENES = [
      { card: cardB, text: ['서윤아', '생일 축하해'], meta: ['22인치 하트인하트', '32,000원 · 헬륨'] },
      { card: cardA, text: ['HAPPY 30th'], meta: ['24인치 버블인버블', '35,000원 · 헬륨'] }
    ];

    function reset() {
      svg.innerHTML = '';
      heart.classList.add('is-empty');
      heartText.innerHTML = '';
      meta.classList.add('is-hidden');
      stickies.forEach(function (s) { s.getAnimations().forEach(function (a) { a.cancel(); }); s.style.scale = '0'; });
      tool(0);
    }

    async function scene(s) {
      reset();
      await sleep(600);
      // 1. 모엔브 cursor picks a lettering card
      await move(curA, rel(s.card, .62, .62), 950);
      tap(curA, '#7a5bd0');
      s.card.classList.add('is-sel');
      await sleep(260);
      // 2. drags a connector to the balloon
      tool(5);
      await drawLine(rel(s.card, 1, .5), rel(heart, .12, .62), curA, 1000);
      s.card.classList.remove('is-sel');
      // 3. balloon inflates, lettering is typed
      tool(2);
      heart.classList.remove('is-empty');
      heart.animate([{ scale: .55 }, { scale: 1.12, offset: .6 }, { scale: .96, offset: .8 }, { scale: 1 }], { duration: 700, easing: 'ease-out' });
      await move(curA, rel(heart, .82, .72), 500);
      await type(s.text);
      metaB.textContent = s.meta[0]; metaS.textContent = s.meta[1];
      meta.classList.remove('is-hidden');
      tool(0);
      // 4. 고객님 drops sticky-note ideas
      if (shown(curB) && stickies.length && shown(stickies[0])) {
        await move(curB, rel(stickies[0], .5, .5), 850);
        for (var i = 0; i < stickies.length; i++) {
          stickies[i].animate([{ scale: 0 }, { scale: 1.15, offset: .7 }, { scale: 1 }], { duration: 420, easing: 'ease-out' });
          stickies[i].style.scale = '1';
          await sleep(170);
        }
        await sleep(200);
        await move(curB, rel(stickies[1], .45, .6), 500);
        tap(curB, '#2f8aa8');
        stickies[1].animate([{ rotate: '0deg' }, { rotate: '-7deg' }, { rotate: '6deg' }, { rotate: '0deg' }], { duration: 500 });
      }
      await move(curA, rel(meta, .9, 1.25), 700);
      await sleep(2600);
    }

    reset();
    place(curA, { x: board.clientWidth * .34, y: board.clientHeight * .88 });
    if (curB) place(curB, { x: board.clientWidth * .92, y: board.clientHeight * .9 });
    (async function loop() {
      var k = 0;
      for (;;) {
        await whenVisible();
        await scene(SCENES[k++ % SCENES.length]);
      }
    })();
  }

  function setupMotion() {
    splitHeroTitle();
    splitFinalTitle();
    setupIslands();
    setupFloatingBalloons();
    setupEntityLinks();
    indexTableRows();
    observeIn('.c-islands, .c-hub, .c-entities, .s-core__cta, .s-band, .s-final', 0.18);
    setupBoard();
  }


  function init() {
    if (window.mmIcons) window.mmIcons.renderAll();
    renderProducts();
    setupMotion();
    setupViews();
    setupOccasions();
    renderChips();
    setupReveal();
    setupHeader();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
