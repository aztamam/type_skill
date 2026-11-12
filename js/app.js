/* App: screens, practice / test / game controllers, progress storage. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const t = (k, v) => I18N.t(k, v);
  let LESSONS = Lessons.build();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ================================================================ storage (per-user profiles)
  // localStorage 'ketik10.profiles' = { active: id, profiles: { id: { name, created, lastSeen, data } } }
  const ROOT_KEY = 'ketik10.profiles', LEGACY_KEY = 'ketik10.v2';
  function defaults() {
    return { progress: {}, settings: { keyboard: true, preview: true, fingerColors: true, free: false }, best: { game: {}, test: {} }, last: null, history: [] };
  }
  function normalize(s) {
    const d = defaults();
    if (s) {
      d.progress = s.progress || {};
      Object.assign(d.settings, s.settings || {});
      if (s.best) { d.best.game = s.best.game || {}; d.best.test = s.best.test || {}; }
      d.last = s.last || null;
      d.history = Array.isArray(s.history) ? s.history : [];
    }
    return d;
  }
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  let root = readJSON(ROOT_KEY);
  if (!root || !root.profiles) root = { active: null, profiles: {} };
  const activeProfile = () => (root.active && root.profiles[root.active]) || null;
  let prevSeen = activeProfile() ? activeProfile().lastSeen : null;
  let store = activeProfile() ? normalize(activeProfile().data) : defaults();
  function persist() { try { localStorage.setItem(ROOT_KEY, JSON.stringify(root)); } catch (e) { /* storage unavailable */ } }
  function save() {
    const p = activeProfile();
    if (!p) return;
    p.data = store;
    p.lastSeen = Date.now();
    persist();
  }
  function logHistory(entry) {
    store.history.push(Object.assign({ t: Date.now() }, entry));
    if (store.history.length > 300) store.history.splice(0, store.history.length - 300);
  }

  // ================================================================ progress helpers
  const FLAT = [];
  LESSONS.forEach((L, li) => L.exercises.forEach((_, ei) => FLAT.push([li, ei])));
  const pkey = (li, ei) => li + '-' + ei;
  const flatIndex = (li, ei) => FLAT.findIndex(([a, b]) => a === li && b === ei);
  const rec = (li, ei) => store.progress[pkey(li, ei)];
  const isPassed = (li, ei) => !!(rec(li, ei) && rec(li, ei).passed);
  function isUnlocked(li, ei) {
    if (store.settings.free) return true;
    const i = flatIndex(li, ei);
    if (i <= 0) return true;
    const [a, b] = FLAT[i - 1];
    return isPassed(a, b);
  }
  function firstOpen() {
    for (const [li, ei] of FLAT) if (!isPassed(li, ei)) return [li, ei];
    return FLAT[FLAT.length - 1];
  }
  const starCount = r => (r ? r.stars.filter(Boolean).length : 0);
  const totalStars = () => Object.values(store.progress).reduce((s, r) => s + starCount(r), 0);
  const lessonStars = li => LESSONS[li].exercises.reduce((s, _, ei) => s + starCount(rec(li, ei)), 0);
  function refreshStars() { $('#totalStars').textContent = '★ ' + totalStars(); }

  const fmtTime = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const calcWpm = (correct, ms, min) => (ms < (min == null ? 1000 : min) ? 0 : Math.round((correct / 5) / (ms / 60000)));
  const calcAcc = (correct, errors) => (correct + errors === 0 ? 100 : Math.round(correct / (correct + errors) * 1000) / 10);

  // ================================================================ keyboard (on-screen)
  const kbEl = $('#kb'), kbKeys = {};
  KB.ROWS.forEach(row => {
    const r = document.createElement('div');
    r.className = 'kb-row';
    row.forEach(([id, w]) => {
      const k = KB.KEYS[id], d = document.createElement('div');
      d.className = 'key f-' + (KB.FINGER_OF[id] || 'none');
      d.style.flex = `${w} ${w} 0`;
      d.textContent = k.label;
      if (k.label.length > 1) d.classList.add('mod');
      if (id === 'f' || id === 'j') d.classList.add('home');
      r.appendChild(d);
      kbKeys[id] = d;
    });
    kbEl.appendChild(r);
  });
  function highlightKeys(info) {
    $$('.key.next, .key.next-shift', kbEl).forEach(x => { x.classList.remove('next', 'next-shift'); x.style.removeProperty('--nc'); x.style.removeProperty('--nd'); });
    if (!info) return;
    const el = kbKeys[info.key];
    if (el) {
      el.classList.add('next');
      if (info.finger !== 'th') { el.style.setProperty('--nc', info.f.mid); el.style.setProperty('--nd', info.f.dark); }
    }
    if (info.shiftKey && kbKeys[info.shiftKey]) kbKeys[info.shiftKey].classList.add('next-shift');
  }
  function clearWrong() { $$('.key.wrong', kbEl).forEach(x => x.classList.remove('wrong')); }
  function flashKey(ch) {
    const info = KB.charInfo(ch), el = info && kbKeys[info.key];
    clearWrong();
    if (el) el.classList.add('wrong');
  }

  // finger legend on Tips page
  const renderLegend = () => $('#legend').innerHTML = Object.entries(KB.FINGERS)
    .map(([fid, f]) => `<span><i style="background:${f.mid};border-color:${f.dark}"></i>${KB.fingerLabel(fid)}</span>`).join('');

  function applySettings() {
    const s = store.settings;
    kbEl.style.display = s.keyboard ? '' : 'none';
    kbEl.classList.toggle('colored', s.fingerColors);
    if (P) updatePractice();
  }

  // ================================================================ modal
  const modal = $('#modal'), modalBox = $('#modalBox');
  let modalKeys = null, modalActs = null, modalLocked = false;
  function openModal(html, acts, keys, cls, locked) {
    modalLocked = !!locked;
    modalBox.className = 'modal-box ' + (cls || '');
    modalBox.innerHTML = html;
    modal.classList.add('open');
    modalActs = acts || {};
    modalKeys = keys || {};
  }
  function closeModal(force) {
    if (modalLocked && force !== true) return;
    modal.classList.remove('open');
    modalKeys = modalActs = null;
    modalLocked = false;
  }
  modal.addEventListener('mousedown', e => { if (e.target === modal) closeModal(); });
  modalBox.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (b && modalActs && modalActs[b.dataset.act]) modalActs[b.dataset.act](b);
  });
  modalBox.addEventListener('change', e => {
    const c = e.target.closest('[data-change]');
    if (c && modalActs && modalActs[c.dataset.change]) { modalActs[c.dataset.change](c); return; }
    const b = e.target.closest('[data-act]');
    if (b && modalActs && modalActs[b.dataset.act]) modalActs[b.dataset.act](b);
  });

  // ================================================================ PRACTICE
  const pHw = new Highway($('#pCanvas'));
  let P = null;

  function fingerHint(ex, info) {
    const f = info ? info.f : null;
    const name = info ? KB.fingerLabel(info.finger) : '';
    const now = info ? (info.key === 'Enter' ? name + ' · Enter' : name) + (info.shiftKey ? ' + ' + t(info.shiftKey === 'ShiftL' ? 'shiftL' : 'shiftR') : '') : '';
    return `<span class="muted">${t('finger')}:</span> ${esc(ex.finger)}` +
      (info ? ` <span class="sep">·</span> <i style="background:${f.mid};border-color:${f.dark}"></i><b>${esc(now)}</b>` : '');
  }

  function startExercise(li, ei) {
    const L = LESSONS[li], ex = L.exercises[ei];
    const text = Lessons.buildText(ex);
    // tiles = no-space drills, strip = drills with spaces, lines = final challenge
    const view = ex.view === 'lines' ? 'lines' : !text.includes(' ') ? 'tiles' : 'strip';
    P = { li, ei, L, ex, text, view, info: [...text].map(c => KB.charInfo(c)), idx: 0, errors: 0, correct: 0, t0: 0, tEnd: 0, slideAt: -1e9, errAt: -1e9, done: false, errSet: new Set() };
    $('#pCanvas').style.display = view === 'highway' ? '' : 'none';
    $('#pLines').classList.toggle('show', view === 'lines');
    $('#pTiles').classList.toggle('show', view === 'tiles');
    $('#pStrip').classList.toggle('show', view === 'strip');
    if (view === 'highway') pHw.resize();
    clearWrong();
    buildView();
    store.last = [li, ei];
    save();
    $('#pLesson').textContent = `Lesson ${L.n} · ${L.kind === 'review' ? '★ ' : ''}${L.title}`;
    $('#pExercise').textContent = `Exercise ${ei + 1}/${L.exercises.length} — ${ex.title}`;
    $('#pGoal').textContent = ex.goal;
    $('#pTarget').textContent = `≥95% · ${L.targetWpm} WPM`;
    updatePractice();
  }
  const restartExercise = () => { if (P) startExercise(P.li, P.ei); };

  // ---- tiles view: a row of key caps, typed caps slide off to the left
  const TILE = 70; // tile width + gap (px), keep in sync with CSS
  function buildView() {
    if (P.view === 'tiles') {
      $('#pTrack').innerHTML = P.info.map((inf, i) =>
        `<div class="tile" style="--c:${inf.f.mid};--d:${inf.f.dark}"><span>${esc(P.text[i])}</span></div>`).join('');
      P.nodes = $$('.tile', $('#pTrack'));
    } else if (P.view === 'strip') {
      // oneLine: whole exercise on one line (font shrinks only if it would not fit)
      P.chunks = P.ex.oneLine ? [[0, P.text.length]] : chunkText(P.text, 24);
      P.chunk = -1;
      const longest = Math.max(...P.chunks.map(([a, b]) => b - a));
      const fit = Math.floor(($('#pStrip').clientWidth || 860) * 0.92 / (longest * 0.6));
      $('#pStripTrack').style.fontSize = Math.min(56, fit) + 'px';
      P.nodes = [];
      renderStrip();
    } else if (P.view === 'lines') {
      buildLines();
      P.nodes = [];
    } else P.nodes = [];
  }

  // ---- strip view: the text stays still, only the cursor moves.
  // Long text is split into chunks (one line at a time); the next chunk replaces it when finished.
  function chunkText(text, max) {
    const out = [];
    let start = 0;
    while (start < text.length) {
      let end = Math.min(text.length, start + max);
      if (end < text.length) {
        const sp = text.lastIndexOf(' ', end);
        if (sp > start) end = sp + 1;
        else { const nx = text.indexOf(' ', end); end = nx === -1 ? text.length : nx + 1; }
      }
      out.push([start, end]);
      start = end;
    }
    return out;
  }
  function renderStrip() {
    let ci = P.chunks.findIndex(([, e]) => P.idx < e);
    if (ci < 0) ci = P.chunks.length - 1;
    const [a, b] = P.chunks[ci];
    if (ci !== P.chunk) {
      P.chunk = ci;
      $('#pStripTrack').innerHTML = P.text.slice(a, b).split('').map(c => `<span>${c === ' ' ? '\u00a0' : esc(c)}</span>`).join('');
    }
    $$('span', $('#pStripTrack')).forEach((el, k) => {
      const i = a + k, done = i < P.idx, cur = i === P.idx && !P.done;
      el.className = done ? (P.errSet.has(i) ? 'done bad' : 'done') : cur ? 'cur' + (P.errSet.has(i) ? ' err' : '') : '';
    });
  }
  function renderTrack() {
    if (P && P.view === 'strip') { renderStrip(); return; }
    if (!P || !P.nodes.length) return;
    for (let i = Math.max(0, P.idx - 2); i <= Math.min(P.nodes.length - 1, P.idx + 1); i++) {
      const done = i < P.idx, cur = i === P.idx && !P.done;
      P.nodes[i].className = (P.view === 'tiles' ? 'tile ' : '') +
        (done ? (P.errSet.has(i) ? 'done bad' : 'done') : cur ? 'cur' + (P.errSet.has(i) ? ' err' : '') : '');
    }
    {
      const step = (P.nodes[0].offsetWidth + 10) || TILE;
      $('#pTrack').style.transform = `translateX(${-(Math.max(0, Math.min(P.idx, P.nodes.length - 1) - 1)) * step}px)`;
    }
  }

  // ---- lines view (final challenge): previous line stays above, current line big,
  // next lines smaller below. After Enter/Space the stack animates up (current line moves back).
  const LINE_POS = { '-2': [-112, 0.4, 0], '-1': [-66, 0.55, 1], '0': [0, 1, 1], '1': [60, 0.6, 1], '2': [100, 0.45, 1], '3': [130, 0.35, 0] };
  function buildLines() {
    const el = $('#pLines');
    const lines = P.text.split('\n');
    lines.pop(); // text ends with '\n'
    P.lines = [];
    let start = 0;
    el.innerHTML = lines.map(line => {
      P.lines.push({ start, len: line.length });
      start += line.length + 1;
      return `<div class="lv-line">${line.split('').map(c => `<span>${c === ' ' ? ' ' : esc(c)}</span>`).join('')}<span class="lv-enter">↵</span></div>`;
    }).join('');
    P.lineEls = $$('.lv-line', el);
    const longest = Math.max(4, ...lines.map(l => l.length));
    const fs = Math.min(56, Math.floor((el.clientWidth || 860) * 0.85 / ((longest + 2) * 0.6)));
    el.style.setProperty('--fs', fs + 'px');
    P.lineScale = fs / 56;
    P.curLine = -1;
    // place lines without animation first
    el.classList.add('no-anim');
    renderLines();
    void el.offsetWidth;
    el.classList.remove('no-anim');
  }
  function renderLines() {
    if (!P.lines) return;
    let cur = P.lines.findIndex(L => P.idx <= L.start + L.len);
    if (cur < 0) cur = P.lines.length - 1;
    if (cur !== P.curLine) {
      P.curLine = cur;
      P.lineEls.forEach((el, j) => {
        const off = Math.max(-2, Math.min(3, j - cur));
        const [dy, sc, op] = LINE_POS[off];
        el.style.transform = `translate(-50%, -50%) translateY(${dy * P.lineScale}px) scale(${sc})`;
        el.style.opacity = op;
        el.className = 'lv-line ' + (off < 0 ? 'past' : off === 0 ? 'now' : 'next' + off);
      });
    }
    [cur - 1, cur].forEach(j => {
      if (j < 0) return;
      const L = P.lines[j], spans = P.lineEls[j].children;
      for (let k = 0; k <= L.len; k++) {
        const gi = L.start + k;
        const cls = gi < P.idx ? (P.errSet.has(gi) ? 'bad' : 'ok') : gi === P.idx && !P.done ? 'cur' + (P.errSet.has(gi) ? ' err' : '') : '';
        spans[k].className = (k === L.len ? 'lv-enter ' : '') + cls;
      }
    });
  }

  function updatePractice() {
    const info = P && !P.done ? P.info[P.idx] : null;
    $('#pFinger').innerHTML = P ? fingerHint(P.ex, info) : '';
    highlightKeys(info);
    if (P && P.view === 'lines') renderLines();
    else renderTrack();
    updatePracticeStats();
  }
  function updatePracticeStats() {
    if (!P) return;
    const ms = P.t0 ? (P.tEnd || performance.now()) - P.t0 : 0;
    $('#pWpm').textContent = calcWpm(P.correct, ms);
    $('#pAcc').textContent = calcAcc(P.correct, P.errors) + '%';
    $('#pErr').textContent = P.errors;
    $('#pBar').style.width = (P.idx / P.text.length * 100) + '%';
  }

  function practiceKey(key) {
    if (!P || P.done) return;
    const now = performance.now();
    if (!P.t0) P.t0 = now;
    const expected = P.text[P.idx];
    if (key === expected || (expected === '\n' && key === ' ')) {
      P.idx++; P.correct++; P.slideAt = now;
      clearWrong();
      if (P.idx >= P.text.length) { finishExercise(); return; }
    } else {
      P.errors++; P.errAt = now;
      P.errSet.add(P.idx);
      flashKey(key);
    }
    updatePractice();
  }

  function finishExercise() {
    P.done = true;
    P.tEnd = performance.now();
    updatePractice();
    const ms = P.tEnd - P.t0;
    const wpm = calcWpm(P.correct, ms, 200), acc = calcAcc(P.correct, P.errors);
    const passed = acc >= 95;
    const stars = [passed, passed && P.errors === 0, passed && wpm >= P.L.targetWpm];
    const k = pkey(P.li, P.ei), old = store.progress[k];
    store.progress[k] = {
      passed: passed || !!(old && old.passed),
      stars: stars.map((s, i) => s || !!(old && old.stars[i])),
      wpm: Math.max(wpm, old ? old.wpm : 0),
      acc: Math.max(acc, old ? old.acc : 0)
    };
    logHistory({ type: 'ex', li: P.li, ei: P.ei, wpm, acc, err: P.errors, ms: Math.round(ms), passed });
    save();
    refreshStars();
    setTimeout(() => showPracticeResult({ wpm, acc, errors: P.errors, ms, stars, passed }), 250);
  }

  function nextExercise() {
    const i = flatIndex(P.li, P.ei);
    if (i < FLAT.length - 1) { const [li, ei] = FLAT[i + 1]; startExercise(li, ei); }
  }

  function showPracticeResult(r) {
    const L = P.L, isLast = flatIndex(P.li, P.ei) === FLAT.length - 1;
    const star = (on, icon, label) => `<div class="st ${on ? 'on' : ''}"><span>${icon}</span><small>${label}</small></div>`;
    const lessonDone = r.passed && P.ei === L.exercises.length - 1;
    const title = !r.passed ? t('res.fail') : isLast ? t('res.course') : lessonDone ? t('res.lesson', { n: L.n }) : t('res.good');
    const html = `
      <div class="result">
        <h2>${title}</h2>
        <div class="stars-row">
          ${star(r.stars[0], '★', t('star.done'))}
          ${star(r.stars[1], '◎', t('star.perfect'))}
          ${star(r.stars[2], '⚡', t('star.fast', { w: L.targetWpm }))}
        </div>
        <div class="res-grid">
          <div><b>${r.wpm}</b><span>WPM</span></div>
          <div><b>${r.acc}%</b><span>${t('st.acc')}</span></div>
          <div><b>${r.errors}</b><span>${t('st.err')}</span></div>
          <div><b>${fmtTime(r.ms)}</b><span>${t('res.time')}</span></div>
        </div>
        <p class="muted">${r.passed ? (r.stars[2] ? t('res.msgBoth') : t('res.msgPass')) : t('res.msgFail')}</p>
        <div class="btns">
          <button class="btn ghost" data-act="retry">${t('btn.retry')} <kbd>R</kbd></button>
          ${r.passed && !isLast ? `<button class="btn" data-act="next">${t('btn.next')} <kbd>Enter</kbd></button>`
            : !r.passed ? `<button class="btn" data-act="retry">${t('btn.tryAgain')} <kbd>Enter</kbd></button>` : ''}
        </div>
      </div>`;
    const retry = () => { closeModal(); restartExercise(); };
    const next = () => { closeModal(); nextExercise(); };
    openModal(html, { retry, next }, { r: retry, Enter: r.passed && !isLast ? next : retry });
  }

  function drawPractice(now) {
    if (!P || P.view !== 'highway') return;
    const t = Math.min(1, (now - P.slideAt) / 140), off = 1 - (1 - Math.pow(1 - t, 3)); // ease-out slide
    const errAge = now - P.errAt, rows = [];
    for (let i = Math.max(0, P.idx - 1); i < Math.min(P.text.length, P.idx + 6); i++) {
      const cur = i === P.idx && !P.done;
      rows.push({
        ch: P.text[i], info: P.info[i], pos: (i - P.idx) + off, current: cur,
        error: cur && errAge < 260, shake: cur ? Math.max(0, 1 - errAge / 260) : 0
      });
    }
    pHw.draw(rows, now);
  }

  // ---------------------------------------------------------------- lesson picker + settings
  function openPicker(selLi) {
    if (selLi == null) selLi = P ? P.li : 0;
    const L = LESSONS[selLi], s = store.settings;
    const miniStars = r => [0, 1, 2].map(i => `<i class="${r && r.stars[i] ? 'on' : ''}"></i>`).join('');
    const html = `
      <div class="pk-head"><h2>${t('pk.title')}</h2><button class="icon close" data-act="close" title="${t('btn.close')}">✕</button></div>
      <div class="picker">
        <div class="pk-lessons">
          ${LESSONS.map((l, li) => `
            <button class="pk-l ${li === selLi ? 'sel' : ''} ${isUnlocked(li, 0) ? '' : 'locked'} ${l.kind}" data-act="lesson" data-li="${li}">
              <span class="n">${l.n}</span><span class="t">${l.kind === 'review' ? '★ ' : ''}${esc(l.title)}</span>
              <span class="s">${lessonStars(li)}/${l.exercises.length * 3}</span>
            </button>`).join('')}
        </div>
        <div class="pk-ex">
          <h3>Lesson ${L.n} — ${esc(L.title)}</h3>
          <p class="muted">${esc(L.objective)}</p>
          ${L.exercises.map((ex, ei) => {
            const open = isUnlocked(selLi, ei);
            return `<button class="pk-e ${open ? '' : 'locked'} ${P && P.li === selLi && P.ei === ei ? 'cur' : ''}" data-act="ex" data-li="${selLi}" data-ei="${ei}" ${open ? '' : 'disabled'}>
              <span>${ei + 1}. ${esc(ex.title)}${ex.final ? ' <em>final</em>' : ''}</span><span class="ms">${open ? miniStars(rec(selLi, ei)) : '🔒'}</span></button>`;
          }).join('')}
        </div>
      </div>
      <div class="pk-settings">
        <label><input type="checkbox" data-act="set" data-k="keyboard" ${s.keyboard ? 'checked' : ''}> ${t('set.keyboard')}</label>
        <label><input type="checkbox" data-act="set" data-k="fingerColors" ${s.fingerColors ? 'checked' : ''}> ${t('set.colors')}</label>
        <label title="${t('set.freeTip')}"><input type="checkbox" data-act="set" data-k="free" ${s.free ? 'checked' : ''}> ${t('set.free')}</label>
        <span class="set-lang">${t('set.lang')}: <span class="seg lang-seg">
          <button data-act="lang" data-l="id" class="${I18N.lang === 'id' ? 'active' : ''}">Indonesia</button>
          <button data-act="lang" data-l="en" class="${I18N.lang === 'en' ? 'active' : ''}">English</button></span></span>
        <button class="btn ghost small" data-act="reset">${t('set.reset')}</button>
      </div>`;
    let resetArmed = false;
    openModal(html, {
      close: closeModal,
      lesson: b => openPicker(+b.dataset.li),
      ex: b => { closeModal(); startExercise(+b.dataset.li, +b.dataset.ei); },
      set: b => { store.settings[b.dataset.k] = b.checked; save(); applySettings(); if (b.dataset.k === 'free') openPicker(selLi); },
      lang: b => { setLanguage(b.dataset.l); openPicker(selLi); },
      reset: b => {
        if (!resetArmed) { resetArmed = true; b.textContent = t('set.confirm'); b.classList.add('danger'); return; }
        store.progress = {}; store.last = null; save(); refreshStars(); closeModal(); startExercise(0, 0);
      }
    }, {}, 'wide');
    const sel = $('.pk-l.sel', modalBox);
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  $('#pRestart').addEventListener('click', restartExercise);
  $('#pSettings').addEventListener('click', () => openPicker());

  // ================================================================ TEST
  // Like most typing tests: a wrong key still advances (marked red), Backspace corrects.
  let T = null, testDur = 60, testMode = null, testLang = null;
  const tBox = $('#tBox'), tText = $('#tText');
  // best-score key: [en-][w]duration  (Indonesian sentences keep the plain duration key)
  const bestKey = () => (testLang === 'en' ? 'en-' : '') + (testMode === 'words' ? 'w' : '') + testDur;

  function defaultTestMode() {
    if (store.settings.testMode) return store.settings.testMode;
    const shiftLesson = LESSONS.findIndex(L => L.special === 'shift');
    return shiftLesson >= 0 && isPassed(shiftLesson, 0) ? 'sentences' : 'words';
  }
  function syncTestButtons() {
    $$('#tMode button').forEach(x => x.classList.toggle('active', x.dataset.m === testMode));
    $$('#tDur button').forEach(x => x.classList.toggle('active', +x.dataset.d === testDur));
    $$('#tLang button').forEach(x => x.classList.toggle('active', x.dataset.l === testLang));
  }

  function testNew() {
    if (!testMode) testMode = defaultTestMode();
    if (!testLang) testLang = store.settings.testLang || I18N.lang;
    syncTestButtons();
    const text = testMode === 'words' ? Lessons.wordText(testDur * 12, testLang) : Lessons.sentenceText(testDur * 12, testLang);
    T = { text, dur: testDur, mode: testMode, lang: testLang, idx: 0, errors: 0, correct: 0, marks: [], t0: 0, done: false, spans: [], lastShown: -1 };
    tText.innerHTML = [...text].map(c => `<span>${c === ' ' ? ' ' : esc(c)}</span>`).join('');
    T.spans = $$('span', tText);
    tBox.scrollTop = 0;
    const best = store.best.test[bestKey()];
    $('#tBest').textContent = best ? best + ' WPM' : '-';
    testUpdate();
  }
  function paint(i) {
    const s = T.spans[i];
    if (!s) return;
    const m = T.marks[i];
    s.className = i === T.idx ? 'cur' : m === 'ok' ? 'done' : m === 'bad' ? 'done err' : '';
  }
  function testUpdate() {
    if (!T) return;
    const cur = T.spans[T.idx];
    if (cur) {
      const lh = cur.offsetHeight || 34;
      tBox.scrollTop = Math.max(0, cur.offsetTop - lh * 0.9);
    }
    const ms = T.t0 ? Math.min(performance.now() - T.t0, T.dur * 1000) : 0;
    $('#tWpm').textContent = calcWpm(T.correct, ms);
    $('#tAcc').textContent = calcAcc(T.correct, T.errors) + '%';
    $('#tErr').textContent = T.errors;
  }
  function testKey(key) {
    if (!T || T.done) return;
    if (key === 'Backspace') {
      if (T.idx === 0) return;
      T.idx--;
      if (T.marks[T.idx] === 'ok') T.correct--;
      T.marks[T.idx] = undefined;
      paint(T.idx + 1); paint(T.idx);
      testUpdate();
      return;
    }
    if (!T.t0) T.t0 = performance.now();
    const ok = key === T.text[T.idx];
    T.marks[T.idx] = ok ? 'ok' : 'bad';
    if (ok) T.correct++; else T.errors++;
    T.idx++;
    paint(T.idx - 1); paint(T.idx);
    if (T.idx >= T.text.length) { finishTest(); return; }
    testUpdate();
  }
  function testTick(now) {
    if (!T) return;
    const elapsed = T.t0 ? (now - T.t0) / 1000 : 0;
    const remain = Math.max(0, T.dur - elapsed);
    $('#tTime').textContent = Math.ceil(remain);
    $('#tBar').style.width = (elapsed / T.dur * 100) + '%';
    if (T.t0 && !T.done && remain <= 0) finishTest();
    else if (T.t0 && !T.done && Math.floor(now / 250) !== T.lastShown) { T.lastShown = Math.floor(now / 250); testUpdate(); }
  }
  function finishTest() {
    T.done = true;
    const ms = Math.min(performance.now() - T.t0, T.dur * 1000);
    const wpm = calcWpm(T.correct, ms, 200), acc = calcAcc(T.correct, T.errors);
    const k = bestKey(), prev = store.best.test[k] || 0, isBest = wpm > prev && acc >= 90;
    if (isBest) store.best.test[k] = wpm;
    logHistory({ type: 'test', dur: T.dur, mode: T.mode, lang: T.lang, wpm, acc, ms: Math.round(ms) });
    save();
    testUpdate();
    const again = () => { closeModal(); testNew(); };
    openModal(`
      <div class="result">
        <h2>${isBest ? t('test.newBest') : t('test.result')}</h2>
        <div class="res-grid">
          <div><b>${wpm}</b><span>WPM</span></div>
          <div><b>${acc}%</b><span>${t('st.acc')}</span></div>
          <div><b>${T.errors}</b><span>${t('test.typos')}</span></div>
          <div><b>${store.best.test[k] || '-'}</b><span>${t('st.best')}</span></div>
        </div>
        <p class="muted">${acc < 90 ? t('test.note90') : t('test.noteAvg')}</p>
        <div class="btns"><button class="btn" data-act="again">${t('test.again')} <kbd>Enter</kbd></button></div>
      </div>`, { again }, { Enter: again });
  }
  $$('#tDur button').forEach(b => b.addEventListener('click', () => { testDur = +b.dataset.d; testNew(); }));
  $$('#tMode button').forEach(b => b.addEventListener('click', () => {
    testMode = b.dataset.m;
    store.settings.testMode = testMode;
    save();
    testNew();
  }));
  $$('#tLang button').forEach(b => b.addEventListener('click', () => {
    testLang = b.dataset.l;
    store.settings.testLang = testLang;
    save();
    testNew();
  }));
  $('#tRestart').addEventListener('click', testNew);

  // ================================================================ GAME
  const gHw = new Highway($('#gCanvas'));
  let G = null;
  const gLevel = $('#gLevel');
  const levelLessons = LESSONS.map((L, li) => li).filter(li => LESSONS[li].kind !== 'special' && LESSONS[li].keys.length >= 2);

  function fillLevels() {
    let best = levelLessons[0];
    gLevel.innerHTML = levelLessons.map(li => {
      const L = LESSONS[li], open = isUnlocked(li, 0);
      if (open) best = li;
      const letters = L.keys.filter(k => /[a-z]/.test(k)).join(' ');
      return `<option value="${li}" ${open ? '' : 'disabled'}>Lesson ${L.n} (${letters.length > 24 ? t('game.letters', { n: L.keys.length }) : letters})</option>`;
    }).join('');
    gLevel.value = String(best);
  }
  gLevel.addEventListener('change', () => { gLevel.blur(); gameIdle(); });

  function gameIdle() {
    G = null;
    $('#gOverlay').classList.add('show');
    $('#gOverlay').classList.remove('paused');
    $('#gOverlay h2').textContent = 'Highway';
    $('#gStart').innerHTML = `${t('game.start')} <kbd>Space</kbd>`;
    $('#gLives').innerHTML = heartHtml(3);
    $('#gScore').textContent = '★ 0';
    $('#gBar').style.width = '0%';
    $('#gSpeed').textContent = 'Lv 1';
    $('#gBest').textContent = store.best.game[gLevel.value] || 0;
  }
  const heartHtml = n => [0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}">♥</span>`).join('');

  function gameStart() {
    const li = +gLevel.value;
    const keys = LESSONS[li].keys.filter(k => /[a-z]/.test(k));
    G = { li, keys, rows: [], fx: [], score: 0, hits: 0, wrong: 0, lives: 3, last: performance.now(), running: true, paused: false, errAt: -1e9, over: false };
    for (let p = 2; p <= 5; p++) G.rows.push(gameRow(p));
    $('#gOverlay').classList.remove('show', 'paused');
    $('#gLives').innerHTML = heartHtml(3);
  }
  function gameRow(pos) {
    let ch = G.keys[Math.floor(Math.random() * G.keys.length)];
    const prev = G.rows.length ? G.rows[G.rows.length - 1].ch : null;
    if (ch === prev && G.keys.length > 1) ch = G.keys[(G.keys.indexOf(ch) + 1) % G.keys.length];
    return { ch, info: KB.charInfo(ch), pos };
  }
  const gameSpeed = () => Math.min(3, 0.55 + Math.floor(G.hits / 10) * 0.1);

  function gameKey(key) {
    if (!G) { if (key === ' ') gameStart(); return; }
    if (G.over) return;
    if (G.paused) { if (key === ' ') { G.paused = false; G.last = performance.now(); $('#gOverlay').classList.remove('show', 'paused'); } return; }
    const target = G.rows[0];
    if (!target) return;
    const now = performance.now();
    if (key === target.ch) {
      G.rows.shift();
      G.hits++; G.score++;
      G.fx.push({ ch: target.ch, info: target.info, pos: target.pos, at: now, hit: true });
      $('#gScore').textContent = '★ ' + G.score;
      $('#gBar').style.width = ((G.hits % 10) / 10 * 100) + '%';
      $('#gSpeed').textContent = 'Lv ' + (1 + Math.floor(G.hits / 10));
    } else {
      G.wrong++; G.errAt = now;
    }
  }

  function gamePause() {
    if (!G || G.over || G.paused) return;
    G.paused = true;
    $('#gOverlay').classList.add('show', 'paused');
    $('#gOverlay h2').textContent = t('game.paused');
    $('#gStart').innerHTML = `${t('game.resume')} <kbd>Space</kbd>`;
  }

  function gameFrame(now) {
    if (!G) { gHw.draw([], now); return; }
    const dt = Math.min(0.05, (now - G.last) / 1000);
    G.last = now;
    if (G.running && !G.paused && !G.over) {
      const v = gameSpeed();
      G.rows.forEach(r => { r.pos -= v * dt; });
      while (!G.rows.length || G.rows[G.rows.length - 1].pos < 4.6) {
        G.rows.push(gameRow(G.rows.length ? G.rows[G.rows.length - 1].pos + 1 : 5));
      }
      if (G.rows[0].pos < -0.45) {
        const m = G.rows.shift();
        G.lives--;
        G.fx.push({ ch: m.ch, info: m.info, pos: m.pos, at: now, miss: true });
        $('#gLives').innerHTML = heartHtml(G.lives);
        if (G.lives <= 0) gameOver();
      }
    }
    G.fx = G.fx.filter(f => now - f.at < 300);
    const errAge = now - G.errAt;
    const rows = G.rows.map((r, i) => ({ ...r, current: i === 0, error: i === 0 && errAge < 220, shake: i === 0 ? Math.max(0, 1 - errAge / 220) : 0 }));
    G.fx.forEach(f => rows.push({ ch: f.ch, info: f.info, pos: f.pos - (now - f.at) / 600, hit: f.hit, error: f.miss, current: true, fade: 1 - (now - f.at) / 300 }));
    gHw.draw(rows, now);
  }

  function gameOver() {
    G.over = true;
    const total = G.hits + G.wrong, acc = total ? Math.round(G.hits / total * 100) : 100;
    const k = String(G.li), prev = store.best.game[k] || 0, isBest = G.score > prev;
    if (isBest) store.best.game[k] = G.score;
    logHistory({ type: 'game', li: G.li, score: G.score, acc });
    save();
    $('#gBest').textContent = store.best.game[k] || 0;
    const again = () => { closeModal(); gameStart(); };
    const menu = () => { closeModal(); gameIdle(); };
    setTimeout(() => openModal(`
      <div class="result">
        <h2>${isBest ? t('game.newBest') : 'Game over'}</h2>
        <div class="res-grid three">
          <div><b>${G.score}</b><span>${t('game.score')}</span></div>
          <div><b>${acc}%</b><span>${t('st.acc')}</span></div>
          <div><b>${store.best.game[k] || 0}</b><span>${t('st.best')}</span></div>
        </div>
        <div class="btns"><button class="btn ghost" data-act="menu">${t('game.change')}</button><button class="btn" data-act="again">${t('game.again')} <kbd>Enter</kbd></button></div>
      </div>`, { again, menu }, { Enter: again, ' ': again }), 350);
  }

  $('#gStart').addEventListener('click', () => { if (!G) gameStart(); else if (G.paused) gameKey(' '); });
  $('#gRestart').addEventListener('click', gameStart);
  document.addEventListener('visibilitychange', () => { if (document.hidden) gamePause(); });

  // ================================================================ screens
  let screen = 'practice';
  function show(name) {
    if (screen === 'game' && name !== 'game') gamePause();
    screen = name;
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
    $$('nav button').forEach(b => b.classList.toggle('active', b.dataset.screen === name));
    if (name === 'practice') pHw.resize();
    if (name === 'game') { gHw.resize(); fillLevels(); if (!G || G.over) gameIdle(); }
    if (name === 'test' && (!T || T.done)) testNew();
  }
  $$('nav button').forEach(b => b.addEventListener('click', () => show(b.dataset.screen)));

  // ================================================================ input routing
  document.addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.blur(); });
  document.addEventListener('keydown', e => {
    if (e.getModifierState) $('#capsWarn').classList.toggle('show', e.getModifierState('CapsLock'));
    if (modal.classList.contains('open')) {
      const fn = modalKeys && (modalKeys[e.key] || modalKeys[e.key.toLowerCase()]);
      if (fn) { e.preventDefault(); fn(); }
      else if (e.key === 'Escape') closeModal();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.matches && e.target.matches('input, select, textarea')) return;
    const typed = e.key.length === 1;
    if (typed || e.key === 'Escape' || (screen === 'practice' && e.key === 'Enter')) e.preventDefault();
    if (screen === 'practice') {
      if (e.key === 'Escape') restartExercise();
      else if (e.key === 'Enter') practiceKey('\n');
      else if (typed) practiceKey(e.key);
    } else if (screen === 'test') {
      if (e.key === 'Escape') testNew();
      else if (e.key === 'Backspace') { e.preventDefault(); testKey('Backspace'); }
      else if (typed) testKey(e.key);
    } else if (screen === 'game') {
      if (e.key === 'Escape') gamePause();
      else if (typed) gameKey(e.key);
    }
  });

  // ================================================================ main loop
  function frame(now) {
    if (screen === 'practice') {
      drawPractice(now);
      if (P && P.t0 && !P.done && Math.floor(now / 250) !== (P._tick || 0)) { P._tick = Math.floor(now / 250); updatePracticeStats(); }
    } else if (screen === 'game') gameFrame(now);
    else if (screen === 'test') testTick(now);
    requestAnimationFrame(frame);
  }

  // ================================================================ profiles & achievements
  const ago = ts => {
    if (!ts) return t('ago.never');
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return t('ago.now');
    if (m < 60) return t('ago.min', { n: m });
    const h = Math.round(m / 60);
    if (h < 24) return t('ago.hour', { n: h });
    const d = Math.round(h / 24);
    return d === 1 ? t('ago.yesterday') : t('ago.days', { n: d });
  };
  const fmtDur = ms => { const m = Math.round(ms / 60000); return m < 60 ? t('dur.min', { n: m }) : t('dur.hm', { h: Math.floor(m / 60), m: m % 60 }); };
  const fmtDate = ts => { const d = new Date(ts), z = n => String(n).padStart(2, '0'); return `${z(d.getDate())}/${z(d.getMonth() + 1)} ${z(d.getHours())}:${z(d.getMinutes())}`; };
  const initial = name => esc((name || '?').trim()[0].toUpperCase());
  const profList = () => Object.entries(root.profiles).map(([id, p]) => Object.assign({ id }, p)).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));

  function statsOf(st) {
    const recs = Object.values(st.progress);
    const passed = recs.filter(r => r.passed);
    const lessonsDone = LESSONS.filter((L, li) => L.exercises.every((_, ei) => { const r = st.progress[pkey(li, ei)]; return r && r.passed; })).length;
    let pos = null;
    for (const [li, ei] of FLAT) { const r = st.progress[pkey(li, ei)]; if (!(r && r.passed)) { pos = [li, ei]; break; } }
    const h = st.history || [];
    return {
      stars: recs.reduce((n, r) => n + starCount(r), 0), maxStars: FLAT.length * 3,
      passed: passed.length, total: FLAT.length, lessonsDone, pos,
      bestWpm: passed.reduce((m, r) => Math.max(m, r.wpm || 0), 0),
      avgAcc: passed.length ? Math.round(passed.reduce((n, r) => n + r.acc, 0) / passed.length * 10) / 10 : 0,
      timeMs: h.reduce((n, x) => n + (x.ms || 0), 0),
      days: new Set(h.map(x => new Date(x.t).toDateString())).size,
      testBest: Math.max(0, ...Object.values(st.best.test || {})),
      gameBest: Math.max(0, ...Object.values(st.best.game || {}))
    };
  }

  function statsHtml(st) {
    const s = statsOf(st), pct = Math.round(s.passed / s.total * 100);
    const pos = s.pos ? `Lesson ${LESSONS[s.pos[0]].n} · Ex ${s.pos[1] + 1}` : t('ach.graduated');
    return `
      <div class="ach-grid">
        <div><b>★ ${s.stars}</b><span>${t('ach.stars', { n: s.maxStars })}</span></div>
        <div><b>${pos}</b><span>${t('ach.pos')}</span></div>
        <div><b>${s.bestWpm || '-'}</b><span>${t('ach.bestWpm')}</span></div>
        <div><b>${s.avgAcc ? s.avgAcc + '%' : '-'}</b><span>${t('ach.avgAcc')}</span></div>
        <div><b>${s.lessonsDone}/${LESSONS.length}</b><span>${t('ach.lessons')}</span></div>
        <div><b>${s.testBest || '-'}</b><span>${t('ach.testBest')}</span></div>
        <div><b>${s.gameBest || '-'}</b><span>${t('ach.gameBest')}</span></div>
        <div><b>${fmtDur(s.timeMs)}</b><span>${t('ach.time', { d: s.days })}</span></div>
      </div>
      <div class="course-bar"><div style="width:${pct}%"></div></div>
      <p class="muted small center">${t('ach.summary', { p: s.passed, t: s.total, pct })}</p>`;
  }

  function historyHtml(st, n) {
    const h = (st.history || []).slice(-n).reverse();
    if (!h.length) return `<p class="muted small">${t('hist.none')}</p>`;
    const row = x => {
      let what, res;
      if (x.type === 'ex') {
        const L = LESSONS[x.li], ex = L && L.exercises[x.ei];
        what = `Lesson ${L ? L.n : '?'}.${x.ei + 1} ${ex ? esc(ex.title) : ''}`;
        res = `${x.wpm} WPM · ${x.acc}% <span class="${x.passed ? 'ok' : 'no'}">${x.passed ? '✓' : '✗'}</span>`;
      } else if (x.type === 'test') {
        what = t('hist.test', { d: x.dur }) + (x.mode === 'words' ? t('hist.words') : '') + (x.lang === 'en' ? ' · EN' : x.lang === 'id' ? ' · ID' : ''); res = `${x.wpm} WPM · ${x.acc}%`;
      } else {
        what = `Game (Lesson ${LESSONS[x.li] ? LESSONS[x.li].n : '?'})`; res = `${t('hist.score', { s: x.score })} · ${x.acc}%`;
      }
      return `<tr><td class="muted">${fmtDate(x.t)}</td><td>${what}</td><td class="r">${res}</td></tr>`;
    };
    return `<table class="hist"><tbody>${h.map(row).join('')}</tbody></table>`;
  }

  function profButton(p) {
    return `<button class="prof" data-act="pick" data-id="${p.id}"><span class="av">${initial(p.name)}</span>
      <span><b>${esc(p.name)}</b><small>★ ${statsOf(normalize(p.data)).stars} · ${ago(p.lastSeen)}</small></span></button>`;
  }

  function refreshProfileBtn() {
    const p = activeProfile();
    $('#profileBtn').innerHTML = p ? `<span class="av">${initial(p.name)}</span>${esc(p.name)}` : t('prof.login');
  }

  function openNameGate() {
    const list = profList();
    const html = `
      <div class="result gate">
        <div class="gate-lang"><span class="seg lang-seg">
          <button data-act="lang" data-l="id" class="${I18N.lang === 'id' ? 'active' : ''}">ID</button>
          <button data-act="lang" data-l="en" class="${I18N.lang === 'en' ? 'active' : ''}">EN</button></span></div>
        <div class="logo big">K</div>
        <h2>${list.length ? t('gate.who') : t('gate.welcome')}</h2>
        <p class="muted">${t('gate.desc')}</p>
        ${list.length ? `<div class="prof-list">${list.map(profButton).join('')}</div><div class="or"><span>${t('gate.or')}</span></div>` : ''}
        <input id="nameInput" class="name-input" maxlength="20" placeholder="${t('gate.ph')}" autocomplete="off" spellcheck="false">
        <p class="gate-err" id="gateErr"></p>
        <div class="btns"><button class="btn" data-act="create">${t('btn.start')} <kbd>Enter</kbd></button></div>
      </div>`;
    const create = () => {
      const name = ($('#nameInput').value || '').trim().replace(/\s+/g, ' ');
      if (!name) { $('#gateErr').textContent = t('gate.empty'); $('#nameInput').focus(); return; }
      closeModal(true);
      createProfile(name);
    };
    openModal(html, {
      create,
      pick: b => { closeModal(true); switchProfile(b.dataset.id); },
      lang: b => { const typed = $('#nameInput').value; closeModal(true); setLanguage(b.dataset.l); openNameGate(); $('#nameInput').value = typed; }
    }, { Enter: create }, '', true);
    setTimeout(() => { const i = $('#nameInput'); if (i) i.focus(); }, 30);
  }

  function createProfile(name) {
    const same = profList().find(p => p.name.toLowerCase() === name.toLowerCase());
    if (same) { switchProfile(same.id); return; }
    const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    let data = defaults();
    if (!Object.keys(root.profiles).length) { const legacy = readJSON(LEGACY_KEY); if (legacy) data = normalize(legacy); } // progress from before profiles existed
    root.profiles[id] = { name, created: Date.now(), lastSeen: Date.now(), data };
    root.active = id;
    store = data;
    prevSeen = null;
    save();
    onProfileChanged();
    openWelcome();
  }

  function switchProfile(id) {
    const p = root.profiles[id];
    if (!p) return;
    prevSeen = p.lastSeen;
    root.active = id;
    store = normalize(p.data);
    save();
    onProfileChanged();
    openWelcome();
  }

  function onProfileChanged() {
    applySettings();
    refreshStars();
    refreshProfileBtn();
    G = null; T = null; testMode = null; testLang = null;
    if (screen === 'game') { fillLevels(); gameIdle(); }
    if (screen === 'test') testNew();
    const st = store.last && LESSONS[store.last[0]] && LESSONS[store.last[0]].exercises[store.last[1]] && isUnlocked(store.last[0], store.last[1])
      ? store.last : firstOpen();
    startExercise(st[0], st[1]);
  }

  function openWelcome() {
    const p = activeProfile(), fresh = !store.history.length;
    const html = `
      <div class="result">
        <h2>${fresh ? t('wel.hi', { name: esc(p.name) }) : t('wel.back', { name: esc(p.name) })}</h2>
        <p class="muted">${fresh ? t('wel.fresh') : t('wel.last', { ago: ago(prevSeen) })}</p>
        ${fresh ? '' : statsHtml(store)}
        <div class="btns">
          <button class="btn ghost" data-act="switch">${t('wel.notMe', { name: esc(p.name) })}</button>
          <button class="btn" data-act="go">${fresh ? t('btn.start') : t('wel.continue')} <kbd>Enter</kbd></button>
        </div>
      </div>`;
    const go = () => closeModal(true);
    openModal(html, { go, switch: () => { closeModal(true); openNameGate(); } }, { Enter: go }, 'mid');
  }

  function openProfile() {
    const p = activeProfile();
    if (!p) { openNameGate(); return; }
    const others = profList().filter(x => x.id !== root.active);
    let delArmed = false, wipeArmed = false;
    const html = `
      <div class="pk-head"><h2 class="prof-title"><span class="av big">${initial(p.name)}</span>${esc(p.name)}</h2>
        <button class="icon close" data-act="close" title="${t('btn.close')}">✕</button></div>
      <p class="muted small">${t('prof.created', { d: new Date(p.created).toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : 'id-ID') })}</p>
      ${statsHtml(store)}
      <h3 class="sec">${t('prof.history')}</h3>
      ${historyHtml(store, 10)}
      <h3 class="sec">${t('prof.switch')}</h3>
      <div class="prof-list">${others.map(profButton).join('')}
        <button class="prof add" data-act="new"><span class="av">+</span><span><b>${t('prof.add')}</b><small>${t('prof.addSub')}</small></span></button></div>
      <div class="pk-settings">
        <button class="btn ghost small" data-act="export" title="${t('prof.exportTip')}">${t('prof.export')}</button>
        <label class="btn ghost small" title="${t('prof.importTip')}">${t('prof.import')}<input type="file" accept=".json,application/json" data-change="import" hidden></label>
        <button class="btn ghost small" data-act="del">${t('prof.del')}</button>
        <button class="btn ghost small" data-act="wipe" title="${t('prof.wipeTip')}">${t('prof.wipe')}</button>
      </div>`;
    openModal(html, {
      close: () => closeModal(),
      pick: b => { closeModal(); switchProfile(b.dataset.id); },
      new: () => { closeModal(); openNameGate(); },
      export: exportData,
      import: importData,
      // wipe everything Ketik10 stored in this browser, then start fresh
      wipe: b => {
        if (!wipeArmed) { wipeArmed = true; b.textContent = t('prof.wipeConfirm'); b.classList.add('danger'); return; }
        try { [ROOT_KEY, LEGACY_KEY, 'ketik10.v1'].forEach(k => localStorage.removeItem(k)); } catch (e) { /* ignore */ }
        location.reload();
      },
      del: b => {
        if (!delArmed) { delArmed = true; b.textContent = t('prof.delConfirm'); b.classList.add('danger'); return; }
        delete root.profiles[root.active];
        root.active = null;
        persist();
        store = defaults();
        refreshProfileBtn();
        refreshStars();
        closeModal();
        openNameGate();
      }
    }, {}, 'wide');
  }

  function exportData() {
    save();
    const json = JSON.stringify({ app: 'ketik10', version: 1, exported: new Date().toISOString(), profiles: root.profiles }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = `ketik10-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function importData(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let n = 0;
      try {
        const j = JSON.parse(reader.result);
        Object.entries(j.profiles || {}).forEach(([id, pr]) => { if (pr && pr.name && pr.data) { root.profiles[id] = pr; n++; } });
      } catch (e) { n = -1; }
      if (n > 0) {
        if (!activeProfile()) root.active = profList()[0].id;
        persist();
        store = normalize(activeProfile().data);
        onProfileChanged();
      }
      const ok = () => closeModal();
      openModal(`<div class="result"><h2>${n > 0 ? t('imp.ok') : t('imp.fail')}</h2>
        <p class="muted">${n > 0 ? t('imp.okMsg', { n }) : t('imp.failMsg')}</p>
        <div class="btns"><button class="btn" data-act="ok">OK <kbd>Enter</kbd></button></div></div>`, { ok }, { Enter: ok });
    };
    reader.readAsText(file);
  }

  // ================================================================ language
  function syncLangButtons() { $$('#uiLang button').forEach(b => b.classList.toggle('active', b.dataset.l === I18N.lang)); }
  function setLanguage(l) {
    if (l === I18N.lang) return;
    I18N.setLang(l);
    LESSONS = Lessons.build(); // same layout, texts in the new language
    I18N.apply();
    syncLangButtons();
    renderLegend();
    refreshProfileBtn();
    // the speed test follows the UI language
    testLang = l;
    store.settings.testLang = l;
    save();
    if (T) testNew();
    if (!G || G.over) { fillLevels(); gameIdle(); } else fillLevels();
    if (P) startExercise(P.li, P.ei);
  }
  $$('#uiLang button').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.l)));

  $('#profileBtn').addEventListener('click', openProfile);
  $('#totalStars').addEventListener('click', openProfile);

  // ================================================================ boot
  I18N.apply();
  syncLangButtons();
  renderLegend();
  requestAnimationFrame(frame);
  if (activeProfile()) {
    onProfileChanged();
    openWelcome();
  } else {
    applySettings();
    refreshStars();
    refreshProfileBtn();
    startExercise(0, 0);
    openNameGate();
  }

  // handy for debugging in DevTools
  window.__ketik10 = { get LESSONS() { return LESSONS; }, setLanguage, get store() { return store; }, get root() { return root; }, startExercise, show };
})();
