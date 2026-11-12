/* Keyboard layout (QWERTY), finger map, and character -> key lookup. */
(function (global) {
  'use strict';

  // [id, width in key units, label?]  — each row totals 15 units
  const ROWS = [
    [['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['Backspace', 2, '⌫']],
    [['Tab', 1.5, 'TAB'], ['q', 1], ['w', 1], ['e', 1], ['r', 1], ['t', 1], ['y', 1], ['u', 1], ['i', 1], ['o', 1], ['p', 1], ['[', 1], [']', 1], ['\\', 1.5]],
    [['Caps', 1.75, 'CAPS'], ['a', 1], ['s', 1], ['d', 1], ['f', 1], ['g', 1], ['h', 1], ['j', 1], ['k', 1], ['l', 1], [';', 1], ["'", 1], ['Enter', 2.25, 'ENTER']],
    [['ShiftL', 2.25, 'SHIFT'], ['z', 1], ['x', 1], ['c', 1], ['v', 1], ['b', 1], ['n', 1], ['m', 1], [',', 1], ['.', 1], ['/', 1], ['ShiftR', 2.75, 'SHIFT']],
    [['CtrlL', 1.25, 'Ctrl'], ['Win', 1.25, ''], ['AltL', 1.25, 'Alt'], [' ', 6.25, ''], ['AltR', 1.25, 'Alt'], ['Fn', 1.25, ''], ['Menu', 1.25, ''], ['CtrlR', 1.25, 'Ctrl']]
  ];

  const FINGERS = {
    lp: { name: 'Kelingking kiri',   light: '#e6e3fb', mid: '#c9c4f7', dark: '#4f43b8' },
    lr: { name: 'Jari manis kiri',   light: '#daf7e7', mid: '#a9edc6', dark: '#1d7d48' },
    lm: { name: 'Jari tengah kiri',  light: '#fde3e9', mid: '#fcbccb', dark: '#a8244a' },
    li: { name: 'Telunjuk kiri',     light: '#d3f4f1', mid: '#93e5df', dark: '#0f6e67' },
    ri: { name: 'Telunjuk kanan',    light: '#fef3c7', mid: '#fde68a', dark: '#7a6400' },
    rm: { name: 'Jari tengah kanan', light: '#fde3e9', mid: '#fcbccb', dark: '#a8244a' },
    rr: { name: 'Jari manis kanan',  light: '#feecd6', mid: '#fdcf98', dark: '#a95607' },
    rp: { name: 'Kelingking kanan',  light: '#daf7e7', mid: '#a9edc6', dark: '#1d7d48' },
    th: { name: 'Ibu jari',          light: '#eef2f6', mid: '#dde3e8', dark: '#7b8a97' }
  };

  const FINGER_OF = {};
  const assign = (f, keys) => keys.forEach(k => { FINGER_OF[k] = f; });
  assign('lp', ['`', '1', 'q', 'a', 'z', 'Tab', 'Caps', 'ShiftL', 'CtrlL']);
  assign('lr', ['2', 'w', 's', 'x', 'Win']);
  assign('lm', ['3', 'e', 'd', 'c', 'AltL']);
  assign('li', ['4', '5', 'r', 't', 'f', 'g', 'v', 'b']);
  assign('ri', ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm']);
  assign('rm', ['8', 'i', 'k', ',', 'AltR']);
  assign('rr', ['9', 'o', 'l', '.', 'Fn']);
  assign('rp', ['0', '-', '=', 'p', '[', ']', '\\', ';', "'", '/', 'Backspace', 'Enter', 'ShiftR', 'Menu', 'CtrlR']);
  assign('th', [' ']);

  // characters typed with Shift -> base key
  const SHIFTED = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8',
    '(': '9', ')': '0', '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
    '<': ',', '>': '.', '?': '/'
  };

  const KEYS = {};
  ROWS.forEach((row, r) => {
    let x = 0;
    row.forEach(([id, w, label]) => {
      KEYS[id] = { id, row: r, x, w, cx: x + w / 2, label: label !== undefined ? label : id };
      x += w;
    });
  });

  const cache = {};
  function charInfo(ch) {
    if (cache[ch] !== undefined) return cache[ch];
    if (ch === '\n') { // end of line -> Enter
      cache[ch] = { ch, key: 'Enter', k: KEYS.Enter, shift: false, finger: 'rp', f: FINGERS.rp, shiftKey: null };
      return cache[ch];
    }
    let key = ch, shift = false;
    if (SHIFTED[ch]) { key = SHIFTED[ch]; shift = true; }
    else if (ch >= 'A' && ch <= 'Z') { key = ch.toLowerCase(); shift = true; }
    const k = KEYS[key];
    if (!k || key.length !== 1) { cache[ch] = null; return null; }
    const finger = FINGER_OF[key] || 'th';
    const info = {
      ch, key, k, shift, finger, f: FINGERS[finger],
      shiftKey: shift ? (finger[0] === 'l' ? 'ShiftR' : 'ShiftL') : null
    };
    cache[ch] = info;
    return info;
  }

  // finger names follow the UI language (falls back to the Indonesian names above)
  const fingerLabel = fid => (global.I18N ? global.I18N.t('finger.' + fid) : FINGERS[fid].name);
  function fingerName(key) {
    const info = charInfo(key);
    return info ? fingerLabel(info.finger) : '';
  }

  global.KB = { ROWS, KEYS, FINGERS, FINGER_OF, SHIFTED, charInfo, fingerName, fingerLabel };
})(window);
