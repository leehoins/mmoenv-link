// m.moenv /pop/ — Fibery-style landing interactions
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real catalogue from /order-script-multi.js
  var PRODUCTS = [
    ['24인치 버블인버블 레터링풍선', 'he', 35000, '레터링 · 유지 약 7~10일'],
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
    direct: { title: '동탄·오산 직접배송', rows: [
      ['지역', '동탄 · 오산'],
      ['비용', '7만 원 이상 구매 시 무료', 'state'],
      ['시간', '받는 시간은 상담 후 확정돼요'],
      ['주소', '주문서에 받을 분 연락처와 주소를 적어 주세요']
    ] },
    schedule: { title: '택배 발송 요일표', rows: [
      ['월~수요일 사용', '목요일 사용분부터 아래처럼 발송'],
      ['목요일 사용', '월요일 발송', 'state'],
      ['금요일 사용', '화요일 발송'],
      ['토요일 사용', '수요일 발송'],
      ['일요일 사용', '목요일 발송']
    ] }
  };

  var OCCASIONS = {
    birthday: '숫자은박(대형)에 이름을 넣은 버블인버블 레터링 풍선을 더하면, 사진 한 장에 나이와 이름이 다 담겨요.',
    anniv: '하트인하트나 마카롱 레터링 풍선에 “우리 100일”처럼 짧은 문구를 넣어 보세요. 풍선케이크를 곁들여도 좋아요.',
    propose: '헬륨 풍선은 미리 주문해도 사용일 직전에 만들어요. 문구는 “Will you marry me?”처럼 대소문자까지 그대로 적어 주세요.',
    event: '개수가 많은 행사라면 10개 이상 주문 할인이 있어요. 동탄·오산이면 7만 원 이상 직접배송이 무료예요.'
  };

  var CHIPS = {
    a: [['🎂', 'HAPPY BIRTHDAY'], ['💍', 'Will you marry me?'], ['🎓', '합격 축하해!'], ['💐', '엄마 아빠 사랑해요'], ['👶', 'Welcome Baby'], ['🥂', '결혼 축하해'], ['🎉', 'Grand Open'], ['💌', '우리 100일'], ['🏆', '수고했어 오늘도']],
    b: [['✨', 'HAPPY 30th'], ['👰', 'Bride to be'], ['🍰', '서윤아 생일 축하해'], ['🎈', 'Congratulations'], ['🌷', '선생님 감사합니다'], ['💪', '퇴사 축하해'], ['🐶', '두부야 생일 축하해'], ['💗', 'Love you forever'], ['🍾', '전역 축하해']]
  };

  function won(n) { return n.toLocaleString('ko-KR') + '원'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderProducts() {
    var tb = document.querySelector('[data-product-rows]');
    if (!tb) return;
    tb.innerHTML = PRODUCTS.map(function (p, i) {
      var tag = p[1] === 'he' ? '<span class="c-tag c-tag--he">🎈 헬륨</span>' : '<span class="c-tag c-tag--air">✿ 공기</span>';
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
      var unit = list.map(function (c) { return '<span class="c-chip"><i>' + c[0] + '</i>' + esc(c[1]) + '</span>'; }).join('');
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

  function init() {
    renderProducts();
    setupViews();
    setupOccasions();
    renderChips();
    setupReveal();
    setupHeader();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
