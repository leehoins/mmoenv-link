// m.moenv custom icon set — 24px grid, ink line + pastel fill
(function () {
  'use strict';
  var C = { pink: '#f7b4c8', yellow: '#f6d58f', peach: '#f4c7a4', sage: '#c9d9a7', lav: '#d6c6f3', blue: '#b9dcea', white: '#fffaf3', coral: '#f39a86' };
  function f(c) { return ' fill="' + C[c] + '"'; }
  var P = {
    cake: '<rect x="4" y="11" width="16" height="9.5" rx="2.2"' + f('pink') + '/><path d="M4 14.6c1.3 1.3 2.7 1.3 4 0s2.7-1.3 4 0 2.7 1.3 4 0 2.7-1.3 4 0"/><rect x="11" y="6.6" width="2" height="4.4" rx=".8"' + f('white') + '/><path d="M12 2.6c1.1 1.3 1.4 2.1.9 2.9-.4.6-1.3.6-1.8 0-.5-.8-.2-1.6.9-2.9z"' + f('yellow') + '/>',
    ring: '<circle cx="12" cy="15" r="5.8"/><circle cx="12" cy="15" r="3.6" stroke-opacity=".35"/><path d="M8.9 5.9l1.6-2.6h3l1.6 2.6L12 9.4z"' + f('blue') + '/><path d="M8.9 5.9h6.2"/>',
    bouquet: '<path d="M12 15l-3.2-4.6M12 15V9.6M12 15l3.2-4.6"/><circle cx="8" cy="8.4" r="2.7"' + f('pink') + '/><circle cx="12" cy="6.2" r="2.7"' + f('yellow') + '/><circle cx="16" cy="8.4" r="2.7"' + f('peach') + '/><path d="M7.4 12.6h9.2L13.2 21h-2.4z"' + f('sage') + '/>',
    popper: '<path d="M3.8 20.2l4.4-11.4 7 7z"' + f('yellow') + '/><path d="M6 14.6l3.4 3.4"/><path d="M13.8 3.6l.7 2.2M18.6 9.6l2-.8M16.8 4.4c-.6 1.8.3 2.6-.7 4.1"/><circle cx="19.2" cy="5.2" r="1.1"' + f('pink') + '/><circle cx="20" cy="13.4" r="1"' + f('blue') + '/><rect x="10.6" y="6.6" width="2" height="2" rx=".5" transform="rotate(20 11.6 7.6)"' + f('lav') + '/>',
    gradcap: '<path d="M2.6 9.4L12 5l9.4 4.4L12 13.8z"' + f('lav') + '/><path d="M6.4 11.2v4.2c0 1.6 2.5 3.1 5.6 3.1s5.6-1.5 5.6-3.1v-4.2"/><path d="M19.2 10.4v5.2"/><circle cx="19.2" cy="16.6" r="1"' + f('yellow') + '/>',
    rattle: '<circle cx="9" cy="9" r="5.3"' + f('yellow') + '/><path d="M6.6 9h4.8M9 6.6v4.8" stroke-opacity=".45"/><path d="M12.8 12.8l5.6 5.6"/><circle cx="19.3" cy="19.3" r="1.8"' + f('pink') + '/>',
    cheers: '<path d="M4.6 3.6h5l-.8 5.8a1.7 1.7 0 0 1-3.4 0z"' + f('yellow') + '/><path d="M7.1 11.2V19M5 19.6h4.3"/><path d="M14.4 3.6h5l-.8 5.8a1.7 1.7 0 0 1-3.4 0z"' + f('yellow') + '/><path d="M16.9 11.2V19M14.8 19.6h4.3"/><path d="M12 2.4v2.2M10.2 5.2l.8.8M13.8 5.2l-.8.8"/>',
    letter: '<rect x="3" y="6" width="18" height="13.2" rx="2"' + f('peach') + '/><path d="M3.6 7l8.4 6.4L20.4 7"/><path d="M12 18.4c-1.5-1-2.4-1.8-2.4-2.8 0-.7.5-1.3 1.2-1.3.5 0 .9.3 1.2.7.3-.4.7-.7 1.2-.7.7 0 1.2.6 1.2 1.3 0 1-.9 1.8-2.4 2.8z"' + f('pink') + '/>',
    trophy: '<path d="M7 3.8h10v4.4a5 5 0 0 1-10 0z"' + f('yellow') + '/><path d="M7 5.6H4.6a2.6 2.6 0 0 0 3 3.8M17 5.6h2.4a2.6 2.6 0 0 1-3 3.8"/><path d="M12 13.2v3"/><path d="M8.2 20.4h7.6v-2.6a1.2 1.2 0 0 0-1.2-1.2H9.4a1.2 1.2 0 0 0-1.2 1.2z"' + f('peach') + '/>',
    sparkle: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"' + f('yellow') + '/><path d="M18.4 14.6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"' + f('pink') + '/>',
    dress: '<path d="M9.6 3.4h4.8l-1 4.6h-2.8z"' + f('white') + '/><path d="M10.6 8h2.8l5.2 12.4H5.4z"' + f('lav') + '/><path d="M10 8h4"/><path d="M8.4 14.6c1.2.6 2.4.6 3.6 0s2.4-.6 3.6 0" stroke-opacity=".5"/>',
    balloon: '<ellipse cx="12" cy="9.6" rx="6" ry="7"' + f('pink') + '/><path d="M11 16.5h2l-1 1.5z"' + f('pink') + '/><path d="M12 18c-1.6 1.4 1.6 2.4 0 4"/><path d="M9 6.6c.5-1 1.4-1.6 2.4-1.8" stroke="#fff" stroke-width="1.8"/>',
    tulip: '<path d="M7 4.8s1.6 2 2.6 2.6L12 4l2.4 3.4C15.4 6.8 17 4.8 17 4.8v4.8a5 5 0 0 1-10 0z"' + f('pink') + '/><path d="M12 14.6V21"/><path d="M12 18.4c-2.6 0-4.2-1.5-4.6-3.6 2.6 0 4.2 1.1 4.6 3.6z"' + f('sage') + '/>',
    paw: '<ellipse cx="12" cy="15.6" rx="4.4" ry="3.8"' + f('peach') + '/><circle cx="6.3" cy="10.6" r="1.9"' + f('peach') + '/><circle cx="9.7" cy="6.9" r="1.9"' + f('peach') + '/><circle cx="14.3" cy="6.9" r="1.9"' + f('peach') + '/><circle cx="17.7" cy="10.6" r="1.9"' + f('peach') + '/>',
    heart: '<path d="M12 20.4C6.6 16.8 3.6 13.8 3.6 10.1c0-2.8 2.1-4.8 4.6-4.8 1.7 0 3 .8 3.8 2.1.8-1.3 2.1-2.1 3.8-2.1 2.5 0 4.6 2 4.6 4.8 0 3.7-3 6.7-8.4 10.3z"' + f('pink') + '/><path d="M7.2 9c.2-.9.8-1.5 1.6-1.7" stroke="#fff" stroke-width="1.8"/>',
    bottle: '<path d="M10.2 2.8h3.6v3.6l1.6 2.6v11a1 1 0 0 1-1 1H9.6a1 1 0 0 1-1-1V9l1.6-2.6z"' + f('sage') + '/><rect x="8.6" y="12" width="6.8" height="4.4"' + f('yellow') + '/><path d="M10.2 4.6h3.6"/><circle cx="18.2" cy="4" r=".9"/><circle cx="19.4" cy="7" r=".7"/>',
    flower: '<circle cx="12" cy="7.4" r="3.2"' + f('white') + '/><circle cx="16.4" cy="10.6" r="3.2"' + f('white') + '/><circle cx="14.7" cy="15.8" r="3.2"' + f('white') + '/><circle cx="9.3" cy="15.8" r="3.2"' + f('white') + '/><circle cx="7.6" cy="10.6" r="3.2"' + f('white') + '/><circle cx="12" cy="12" r="2.6"' + f('yellow') + '/>',
    clock: '<circle cx="12" cy="12" r="8.6"' + f('blue') + '/><path d="M12 7.4V12l3.2 2"/>',
    pencil: '<path d="M15.6 4.4l4 4L9 19l-5 1 1-5z"' + f('yellow') + '/><path d="M13.4 6.6l4 4M5 15l4 4"/>',
    tag: '<path d="M3.6 12.6V5.1a1.5 1.5 0 0 1 1.5-1.5h7.5l7.9 7.9-9 9z"' + f('peach') + '/><circle cx="8" cy="8" r="1.5"' + f('white') + '/>',
    number: '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4"' + f('lav') + '/><path d="M10.2 7.2L8.8 16.8M15.2 7.2l-1.4 9.6M7.2 10.2h10.2M6.6 13.8h10.2"/>',
    cakebox: '<path d="M4 10.6h16v8.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z"' + f('peach') + '/><path d="M4 14c1.3 1.1 2.7 1.1 4 0s2.7-1.1 4 0 2.7 1.1 4 0 2.7-1.1 4 0"/><circle cx="8" cy="7.6" r="2.6"' + f('pink') + '/><circle cx="12" cy="6.4" r="2.6"' + f('blue') + '/><circle cx="16" cy="7.6" r="2.6"' + f('yellow') + '/>',
    lines: '<rect x="4" y="3.4" width="16" height="17.2" rx="2.4"' + f('yellow') + '/><path d="M8 8.4h8M8 12h8M8 15.6h4.8"/>',
    letters: '<path d="M3.4 18.4L7.6 6.6h1.2l4.2 11.8M5 14.4h6"/><path d="M15 12.2a2.6 2.6 0 0 1 5.2 0v6.2M20.2 15.2c-2.8 0-5.4.2-5.4 1.8 0 1.6 2.6 1.8 5.4-.4"/>',
    palette: '<path d="M12 3.4a8.6 8.6 0 1 0 0 17.2c1.2 0 1.8-.8 1.5-1.8-.4-1.3.3-2.2 1.6-2.2h2.1c1.9 0 3.4-1.4 3.4-3.4 0-5.5-3.9-9.8-8.6-9.8z"' + f('peach') + '/><circle cx="7.8" cy="10.2" r="1.5"' + f('pink') + '/><circle cx="11" cy="6.9" r="1.5"' + f('blue') + '/><circle cx="15.5" cy="7.8" r="1.5"' + f('sage') + '/><circle cx="7.9" cy="14.4" r="1.5"' + f('yellow') + '/>',
    store: '<rect x="5" y="9.4" width="14" height="11" rx="1"' + f('peach') + '/><path d="M3.6 9.4L5 4.4h14l1.4 5z"' + f('pink') + '/><path d="M3.6 9.4c0 1.3 1 2.2 2.2 2.2s2.2-.9 2.2-2.2c0 1.3 1 2.2 2.2 2.2s1.8-.9 1.8-2.2c0 1.3.8 2.2 1.8 2.2s2.2-.9 2.2-2.2c0 1.3 1 2.2 2.2 2.2s2.2-.9 2.2-2.2"' + f('pink') + '/><rect x="10" y="14.6" width="4" height="5.8"' + f('white') + '/>',
    box: '<path d="M3.6 7.8L12 3.4l8.4 4.4v8.6L12 20.8l-8.4-4.4z"' + f('peach') + '/><path d="M3.6 7.8L12 12.2l8.4-4.4M12 12.2v8.6"/><path d="M7.8 5.6l8.4 4.4" stroke-opacity=".5"/>',
    truck: '<path d="M2.6 6.6h11v9.6h-11z"' + f('yellow') + '/><path d="M13.6 9.6h3.8l3 3.2v3.4h-6.8z"' + f('blue') + '/><circle cx="7" cy="17.4" r="2"' + f('white') + '/><circle cx="17" cy="17.4" r="2"' + f('white') + '/><path d="M5.6 9.6h4.6" stroke-opacity=".5"/>',
    calendar: '<rect x="3.6" y="5" width="16.8" height="15.4" rx="2.4"' + f('white') + '/><path d="M3.6 7.4A2.4 2.4 0 0 1 6 5h12a2.4 2.4 0 0 1 2.4 2.4v2.4H3.6z"' + f('pink') + '/><path d="M8 3.4v3.2M16 3.4v3.2"/><circle cx="8.4" cy="13.6" r="1"' + f('peach') + '/><circle cx="12" cy="13.6" r="1"' + f('peach') + '/><circle cx="15.6" cy="13.6" r="1"' + f('sage') + '/><circle cx="8.4" cy="17" r="1"' + f('peach') + '/>',
    board: '<rect x="3.6" y="3.6" width="7.4" height="7.4" rx="2"' + f('pink') + '/><rect x="13" y="3.6" width="7.4" height="7.4" rx="2"' + f('yellow') + '/><rect x="3.6" y="13" width="7.4" height="7.4" rx="2"' + f('sage') + '/><rect x="13" y="13" width="7.4" height="7.4" rx="2"' + f('blue') + '/>',
    chat: '<path d="M4 6.6A2.6 2.6 0 0 1 6.6 4h10.8A2.6 2.6 0 0 1 20 6.6v6.8a2.6 2.6 0 0 1-2.6 2.6H11l-4.6 3.6V16A2.6 2.6 0 0 1 4 13.4z"' + f('sage') + '/><circle cx="8.6" cy="10" r=".9" fill="currentColor"/><circle cx="12" cy="10" r=".9" fill="currentColor"/><circle cx="15.4" cy="10" r=".9" fill="currentColor"/>',
    cursor: '<path d="M5 3.4l13.2 7.2-5.6 1.6L10 18.6z"' + f('lav') + '/>',
    hand: '<path d="M8 13.4V6a1.3 1.3 0 0 1 2.6 0v4.6V4.6a1.3 1.3 0 0 1 2.6 0v6V5.6a1.3 1.3 0 0 1 2.6 0v5.6-3a1.3 1.3 0 0 1 2.6 0V14c0 3.6-2.6 6.6-6.2 6.6-2.4 0-3.8-1-5-3L4.6 13a1.3 1.3 0 0 1 2.2-1.4z"' + f('peach') + '/>',
    text: '<path d="M6 6.2h12M12 6.2v12.4M9.4 18.6h5.2"/>',
    circle: '<circle cx="12" cy="12" r="7.6"' + f('blue') + '/>',
    square: '<rect x="4.6" y="4.6" width="14.8" height="14.8" rx="2.6"' + f('yellow') + '/>',
    plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
    home: '<path d="M4 11.2l8-7 8 7v8.4a1 1 0 0 1-1 1h-4.6v-5.8H9.6v5.8H5a1 1 0 0 1-1-1z"' + f('peach') + '/>',
    chevron: '<path d="M7 10l5 5 5-5"/>',
    star: '<path d="M12 3.4l2.6 5.4 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"' + f('yellow') + '/>'
  };
  function icon(name, cls) {
    var body = P[name];
    if (!body) return '';
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  }
  function renderAll(root) {
    (root || document).querySelectorAll('[data-ic]').forEach(function (el) {
      if (el.firstChild && el.firstChild.nodeName === 'svg') return;
      el.innerHTML = icon(el.getAttribute('data-ic'));
    });
  }
  window.mmIcons = { icon: icon, renderAll: renderAll, names: Object.keys(P) };
})();
