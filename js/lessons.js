/* Curriculum: 28 lessons, generated from a compact spec.
 *
 * Exercise kinds
 *   fixed      – lines are typed as written (joined with a space)
 *   random     – random letter groups   gen: {keys, focus, ratio, groups, min, max}
 *   alternate  – left/right hand alternating groups  gen: {keys, groups, min, max}
 *   words      – real words from unlocked letters    gen: {letters, count, focus, punct, caps}
 *   names      – capitalised names / places          gen: {count}
 *   sentences  – full sentences    gen: {count, pool: 'basic'|'punct'|'num'|'all', allow: RegExp}
 *   mixed      – several parts     gen: {parts: [{kind, gen}, ...]}
 */
(function (global) {
  'use strict';
  const KB = global.KB;

  // Home-row key each finger returns to after a reach
  const ANCHOR = {
    r: 'f', t: 'f', g: 'f', v: 'f', b: 'f',
    u: 'j', y: 'j', h: 'j', n: 'j', m: 'j',
    e: 'd', c: 'd', i: 'k', ',': 'k',
    w: 's', x: 's', o: 'l', '.': 'l',
    q: 'a', z: 'a', p: ';', '/': ';'
  };
  const t = (k, v) => global.I18N.t(k, v);
  const isEn = () => global.I18N.lang === 'en';
  const lab = k => (/[a-z]/.test(k) ? k.toUpperCase() : `${t('key.' + k)} (${k})`);
  const short = k => (/[a-z]/.test(k) ? k.toUpperCase() : k);

  // ---------------------------------------------------------------- word banks
  const WORDS_ID = `
    yang dan di ini itu dengan untuk tidak dari dalam akan pada juga saya ke karena bisa ada mereka lebih
    kami sudah atau satu oleh telah kita hanya harus seperti baru bagi masih jika banyak orang ia hari tahun
    dua tiga empat lima enam tujuh delapan sembilan sepuluh rumah kerja makan minum tidur jalan pagi siang
    sore malam besar kecil baik buruk cepat lambat tinggi rendah murah mahal buku meja kursi pintu jendela
    air api tanah angin hujan panas dingin kota desa pasar toko uang harga beli jual kirim terima tulis baca
    ketik jari tangan kaki mata kepala hati teman guru murid anak ibu bapak kakak adik nenek kakek keluarga
    sekolah kantor kelas ujian nilai belajar latihan main lari duduk pergi pulang datang buka tutup ambil
    beri bawa cari temu tanya jawab kata huruf angka layar tombol papan suara warna merah biru hijau kuning
    putih hitam ungu langit laut gunung sungai danau pantai pulau bunga pohon daun buah nasi roti kopi teh
    susu gula garam ikan ayam sapi kuda kucing anjing burung semut gajah mobil motor sepeda kereta kapal
    jam menit detik minggu bulan senin selasa rabu kamis jumat sabtu besok kemarin nanti dulu semua setiap
    penuh kosong benar salah mudah sulit senang sedih kuat lemah bersih kotor terang gelap dekat jauh kiri
    kanan atas bawah depan luar tengah sampai mulai selesai lagi saja terus tetap pernah selalu sering
    mungkin pasti boleh mau ingin suka tahu kenal lihat dengar rasa pikir ingat lupa coba bantu jaga tunggu
    pakai buat masak cuci potong ganti isi nama nomor kabar berita cerita lagu film foto gambar kertas pena
    tas baju celana sepatu topi kain jarum rindu guru tidur ibu beri minum kunci untuk hidup tiket kirim
    ide indah dingin gigi kuning bumi budi hutan duri bibir kebun undi ubi tebu debu temu tengah
  `.trim().split(/\s+/);

  const WORDS_EN = `
    the be to of and in that have it for not on with he as you do at this but his by from they we say her
    she or an will my one all would there their what so up out if about who get which go me when make can
    like time no just him know take people into year your good some could them see other than then now
    look only come its over think also back after use two how our work first well way even new want because
    any these give day most us red big run fun hug bug net ten hen men tub rub gum hut nut cut fit hit kit
    bit dig fig jig rig mud bud dug tug vet rug key keg met get jet set wet pet bet let leg beg egg end fed
    bed led dim kid lid mid rid tin pin win bin fin kin sit lit wit hike bike like time line fine mine nine
    vine dine ride hide side tide wide five hive dive give live true blue tree free green fresh truth trunk
    thumb thing think during under number begin hunger unity buy guy fry try dry tiny thin
  `.trim().split(/\s+/);

  const NAMES = `Andi Budi Citra Dewi Eko Fajar Gita Hadi Indah Joko Kiki Lina Made Nina Omar Putri Rudi
    Sari Tono Umar Vina Wati Yusuf Zaki Jakarta Bandung Surabaya Medan Bali Bogor Malang Solo Depok Padang
    Makassar Lombok Aceh Ambon Papua Jogja`.trim().split(/\s+/);

  const SENTENCES = [
    'Saya belajar mengetik dengan sepuluh jari setiap pagi.',
    'Latihan sedikit demi sedikit lebih baik daripada tidak sama sekali.',
    'Jari telunjuk kiri selalu kembali ke huruf F.',
    'Jangan melihat keyboard saat mengetik.',
    'Akurasi lebih penting daripada kecepatan.',
    'Ibu membeli sayur dan buah di pasar.',
    'Kami pergi ke pantai pada hari Minggu.',
    'Hujan turun sejak sore hingga malam.',
    'Adik membaca buku cerita di kamar.',
    'Kopi panas enak diminum saat pagi.',
    'Kereta berangkat tepat waktu dari stasiun.',
    'Tolong kirim laporan itu sebelum sore.',
    'Setiap hari kita punya kesempatan untuk belajar hal baru.',
    'Duduklah dengan tegak dan rilekskan bahu.',
    'Teman saya bekerja di sebuah kantor di Jakarta.',
    'Kucing itu tidur di atas kursi dekat jendela.',
    'Rapat dimulai setelah makan siang.',
    'Bapak memperbaiki sepeda di halaman rumah.',
    'Langit biru cerah tanpa awan sedikit pun.',
    'Gunakan jari kelingking untuk menekan tombol Shift.',
    'Mengetik cepat butuh latihan yang rutin.',
    'Kami menanam pohon mangga di belakang rumah.',
    'Harga tiket naik menjelang hari libur.',
    'Anak-anak bermain bola di lapangan.',
    'Jangan lupa istirahat sejenak setelah berlatih.',
    'Dia menulis surat untuk neneknya di desa.',
    'Pasar itu ramai sejak pagi buta.',
    'Lampu kota mulai menyala ketika matahari terbenam.'
  ];

  const PUNCT_SENT = [
    'Apa kabar? Semoga baik-baik saja!',
    'Ibu berkata: "Jangan lupa sarapan."',
    'Siapa yang datang? Teman lama!',
    'Catatan: rapat diundur ke hari Jumat.',
    'Wah, hasilnya bagus sekali!',
    'Dia bertanya, "Kapan kita berangkat?"',
    'Anak-anak bermain di taman; orang tua duduk di bangku.',
    "It's a good day to practice!",
    'Bawa tiga barang: buku, pena, dan botol air.',
    'Benarkah? Aku tidak percaya!'
  ];

  const NUM_SENT = [
    'Rapat dimulai pukul 09.30 di ruang 2.',
    'Harga buku itu 45000 rupiah.',
    'Kami memesan 3 kopi dan 2 teh.',
    'Kelas kami berisi 32 murid.',
    'Kereta tiba pada jam 14.15.',
    'Nomor rumahnya 17 di jalan Melati.',
    'Tahun ini ada 365 hari.',
    'Dia berlari 5 kilometer setiap pagi.',
    'Tinggi menara itu sekitar 128 meter.',
    'Pesanan nomor 2048 sudah dikirim.'
  ];

  // English text for the speed test
  const SENTENCES_EN = [
    'Practice a little every day and your fingers will learn the way.',
    'Keep your eyes on the screen, not on the keyboard.',
    'Accuracy comes first and speed will follow.',
    'The left index finger always returns to the letter F.',
    'We walked along the beach until the sun went down.',
    'My brother is reading a book in the living room.',
    'The train leaves the station right on time.',
    'Please send the report before the meeting starts.',
    'A cup of hot tea is nice on a rainy morning.',
    'Sit up straight and relax your shoulders.',
    'Our team finished the project ahead of schedule.',
    'The cat is sleeping on the chair by the window.',
    'She planted a small garden behind the house.',
    'Typing fast takes patience and regular practice.',
    'The market is busy from early in the morning.',
    'Every mistake is a chance to learn something new.',
    'He fixed his bicycle in the front yard.',
    'The city lights come on when the sun sets.',
    'Use your little finger to press the Shift key.',
    'Children are playing football in the park.'
  ];
  const PUNCT_SENT_EN = [
    'How are you today? I hope you are well!',
    'She said: "Do not forget your lunch."',
    "It's a great day to practice, isn't it?",
    'Bring three things: a book, a pen, and some water.',
    'Wow, that was fast!',
    'Note: the meeting moved to Friday.',
    'He asked, "When do we leave?"',
    'The kids played outside; the parents stayed in.'
  ];
  const NUM_SENT_EN = [
    'The meeting starts at 9.30 in room 2.',
    'We ordered 3 coffees and 2 teas.',
    'There are 32 students in our class.',
    'The train arrives at 14.15.',
    'A year has 365 days.',
    'She runs 5 kilometers every morning.',
    'Order number 2048 has been shipped.',
    'The tower is about 128 meters tall.'
  ];
  const WORDS_EN_TEST = `
    the be to of and a in that have it for not on with he as you do at this but his by from they we say her
    she or an will my one all would there their what so up out if about who get which go me when make can
    like time no just him know take people into year your good some could them see other than then now look
    only come its over think also back after use two how our work first well way even new want because any
    these give day most us find here thing many tell very through long where much should before right too
    mean old same small large under city tree cross farm hard start might story far sea draw left late run
    while press close night real life few north open seem together next white children begin got walk paper
    group always music those both mark often letter until mile river car feet care second book carry took
    science eat room friend began idea fish mountain stop once base hear horse cut sure watch color face wood
    main enough plain girl usual young ready above ever red list though feel talk bird soon body dog family
    direct pose leave song measure door product black short class wind question happen complete ship area
    half rock order fire south problem piece told knew pass since top whole king space heard best hour better
    true during hundred five remember step early hold west ground interest reach fast verb sing listen six
    table travel less morning ten simple several toward war lay against pattern slow center love person money
    serve appear road map rain rule pull cold notice voice energy hunt bed brother egg ride cell believe
  `.trim().split(/\s+/);

  // ---------------------------------------------------------------- random helpers
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // which = 'all' (decides lesson layout, identical in both languages) | 'lang' (content in the UI language)
  function wordsFor(letters, which) {
    const set = new Set(letters);
    const ok = w => [...w].every(c => set.has(c));
    const lists = which === 'all' ? [WORDS_ID, WORDS_EN, WORDS_EN_TEST]
      : isEn() ? [WORDS_EN, WORDS_EN_TEST] : [WORDS_ID, WORDS_EN];
    return [].concat(...lists.map(l => l.filter(ok))).filter((w, i, a) => a.indexOf(w) === i);
  }
  const wordCount = letters => wordsFor(letters, 'all').length;

  function genRandom(g) {
    const ratio = g.ratio == null ? 0.5 : g.ratio;
    const out = [];
    for (let i = 0; i < g.groups; i++) {
      const len = g.min + rnd(g.max - g.min + 1);
      let s = '';
      for (let j = 0; j < len; j++) {
        const pool = g.focus && g.focus.length && Math.random() < ratio ? g.focus : g.keys;
        let ch = pick(pool);
        if (s.length >= 2 && s[s.length - 1] === ch && s[s.length - 2] === ch) ch = pick(g.keys);
        s += ch;
      }
      out.push(s);
    }
    return out.join(' ');
  }

  function genAlternate(g) {
    const L = g.keys.filter(k => (KB.FINGER_OF[k] || '')[0] === 'l');
    const R = g.keys.filter(k => (KB.FINGER_OF[k] || '')[0] === 'r');
    if (!L.length || !R.length) return genRandom(g);
    const out = [];
    for (let i = 0; i < g.groups; i++) {
      const len = g.min + rnd(g.max - g.min + 1);
      let left = Math.random() < 0.5, s = '';
      for (let j = 0; j < len; j++) { s += pick(left ? L : R); left = !left; }
      out.push(s);
    }
    return out.join(' ');
  }

  function genWords(g) {
    let pool = wordsFor(g.letters);
    if (pool.length < 4) return genRandom({ keys: g.letters.filter(k => /[a-z]/.test(k)), focus: g.focus, groups: g.count, min: 2, max: 5 });
    if (g.focus) {
      const f = pool.filter(w => g.focus.some(c => w.includes(c)));
      if (f.length >= 3) pool = pool.concat(f, f); // weight words containing the new letters
    }
    const punct = g.punct || [];
    const out = [];
    let prev = '', run = 0;
    for (let i = 0; i < g.count; i++) {
      let w = pick(pool);
      if (w === prev) w = pick(pool);
      prev = w;
      if (g.caps && run === 0) w = w[0].toUpperCase() + w.slice(1);
      run++;
      const last = i === g.count - 1;
      if (punct.includes('.') && (last || (run >= 4 && Math.random() < 0.25))) { w += '.'; run = 0; }
      else if (!last && punct.includes(',') && run >= 2 && Math.random() < 0.12) w += ',';
      out.push(w);
    }
    return out.join(' ');
  }

  function genNames(g) {
    const out = [];
    for (let i = 0; i < g.count; i++) out.push(pick(NAMES));
    return out.join(' ');
  }

  function genSentences(g) {
    const en = isEn();
    const B = en ? SENTENCES_EN : SENTENCES, PU = en ? PUNCT_SENT_EN : PUNCT_SENT, NU = en ? NUM_SENT_EN : NUM_SENT;
    let pool = g.pool === 'punct' ? PU : g.pool === 'num' ? NU : g.pool === 'all' ? B.concat(PU, NU) : B;
    if (g.allow) pool = pool.filter(s => g.allow.test(s));
    return shuffle(pool).slice(0, g.count).join(' ');
  }

  function textFor(ex) {
    const g = ex.gen;
    let out;
    switch (ex.kind) {
      case 'fixed': {
        const lines = isEn() && ex.linesEn ? ex.linesEn : ex.lines;
        out = lines.join(ex.join == null ? ' ' : ex.join);
        if (ex.shuffle) out = shuffle(out.split(' ')).join(' '); // new order every time the exercise starts
        break;
      }
      case 'random': out = genRandom(g); break;
      case 'alternate': out = genAlternate(g); break;
      case 'words': out = genWords(g); break;
      case 'names': out = genNames(g); break;
      case 'sentences': out = genSentences(g); break;
      case 'mixed': out = g.parts.map(p => textFor(p)).join(' '); break;
      default: out = '';
    }
    // keep only characters that exist on the keyboard
    return [...out.replace(/\s+/g, ' ').trim()].filter(c => KB.charInfo(c)).join('');
  }

  // "lines" view: text is split into short lines, each ending with Enter (↵)
  function wrap(text, max) {
    const lines = [];
    let cur = '';
    text.split(' ').forEach(w => {
      if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function linesOf(ex) {
    if (ex.kind === 'fixed') return ex.lines.slice();
    if (ex.kind === 'random' || ex.kind === 'alternate') return textFor(ex).split(' '); // one group per line
    if (ex.kind === 'mixed') return ex.gen.parts.reduce((a, p) => a.concat(linesOf(p)), []);
    return wrap(textFor(ex), ex.lineLen || (ex.kind === 'sentences' ? 28 : 22));
  }
  function buildText(ex) {
    if (ex.view !== 'lines') return textFor(ex);
    return linesOf(ex).filter(Boolean).join('\n') + '\n';
  }

  // simple test text: lowercase Indonesian words, no capitals or punctuation
  function wordText(minLen, lang) {
    const pool = (lang === 'en' ? WORDS_EN_TEST : WORDS_ID).filter(w => w.length >= 2);
    const out = [];
    let len = 0, prev = '';
    while (len < minLen) {
      let w = pick(pool);
      if (w === prev) w = pick(pool);
      out.push(w); prev = w; len += w.length + 1;
    }
    return out.join(' ');
  }

  function sentenceText(minLen, lang) {
    const src = lang === 'en' ? SENTENCES_EN.concat(PUNCT_SENT_EN, NUM_SENT_EN) : SENTENCES.concat(PUNCT_SENT, NUM_SENT);
    let all = shuffle(src), out = '';
    while (out.length < minLen) {
      if (!all.length) all = shuffle(src);
      out += (out ? ' ' : '') + all.pop();
    }
    return out;
  }

  // ---------------------------------------------------------------- builders
  const fixed = (title, finger, goal, lines, join) => ({ kind: 'fixed', title, finger, goal, lines, join, shuffle: join == null });
  // final challenges use the stacked "lines" view (each line ends with Enter)
  const gen = (kind, title, finger, goal, g, final) => ({ kind, title, finger, goal, gen: g, final: !!final, view: final ? 'lines' : 'highway' });
  const noSpace = (k, finger) => fixed(t('ex.noSpace', { k: short(k) }), finger,
    t('ex.noSpaceG', { k: lab(k), f: finger.toLowerCase() }), [k.repeat(12)], ''); // one row, no scrolling

  function fingersOf(keys) {
    const seen = [];
    keys.forEach(k => { const n = KB.fingerName(k); if (n && !seen.includes(n)) seen.push(n); });
    if (seen.length > 3) return t('f.ten');
    return seen.join(' + ');
  }
  const punctOf = all => ['.', ','].filter(c => all.includes(c));
  function spread(arr, n) {
    if (arr.length <= n) return arr.slice();
    const out = [];
    for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * arr.length / n)]);
    return out;
  }

  function finalEx(all, focus, hasWords, groups) {
    const letters = all.filter(k => k !== ' ');
    if (hasWords) {
      return gen('mixed', t('ex.final'), fingersOf(all), t('ex.finalGoal'), {
        parts: [
          { kind: 'random', gen: { keys: letters, focus, ratio: 0.4, groups: 6, min: 4, max: 6 } },
          { kind: 'words', gen: { letters, count: 12, focus, punct: punctOf(all) } }
        ]
      }, true);
    }
    return gen('random', t('ex.final'), fingersOf(all), t('ex.finalGoal'),
      { keys: letters, focus, ratio: 0.4, groups: groups || 12, min: 4, max: 6 }, true);
  }

  // Lesson 1: every spaced exercise is a single line, shown whole (no line changes)
  function lesson1() {
    const J = KB.fingerName('j'), F = KB.fingerName('f'), TH = KB.fingerName(' ');
    const one = ex => Object.assign(ex, { oneLine: true });
    return [
      noSpace('j', J),
      one(fixed(t('l1.introJ'), J, t('l1.introJG'), ['j j j j j j j j j j j j'])),
      one(fixed(t('l1.comboJ'), J, t('l1.comboJG'), ['jj jj jjj jjj jjjj jjjj'])),
      one(fixed(t('l1.spaceJ'), J + ' + ' + TH, t('l1.spaceJG'), ['j jj jjj jjjj jjj jj j'])),
      noSpace('f', F),
      one(fixed(t('l1.introF'), F, t('l1.introFG'), ['f f f f f f f f f f f f'])),
      one(fixed(t('l1.comboF'), F, t('l1.comboFG'), ['ff ff fff fff ffff ffff'])),
      one(fixed(t('l1.spaceF'), F + ' + ' + TH, t('l1.spaceFG'), ['f ff fff ffff fff ff f'])),
      one(fixed(t('l1.comboFJ'), t('f.bothIndex'), t('l1.comboFJG'), ['fj jf fj jf ff jj jj ff'])),
      one(fixed(t('l1.spaceFJ'), t('f.bothIndex') + ' + ' + TH, t('l1.spaceFJG'), ['fjf jfj ffj jff fjfj jfjf'])),
      one(gen('random', t('l1.random'), t('f.bothIndex') + ' + ' + TH, t('l1.randomG'), { keys: ['f', 'j'], groups: 6, min: 2, max: 3 })),
      gen('random', t('ex.final'), t('f.bothIndex'), t('ex.finalGoal') + t('ex.enterNote'), { keys: ['f', 'j'], groups: 12, min: 5, max: 5 }, true)
    ];
  }

  function keyLesson(A, B, prev) {
    const all = prev.concat([A, B]);
    const fA = KB.fingerName(A), fB = KB.fingerName(B), TH = KB.fingerName(' ');
    const r = (k, n) => k.repeat(n);
    const ex = [];
    ex.push(noSpace(A, fA));
    ex.push(fixed(t('ex.intro', { k: lab(A) }), fA, t('ex.introG', { f: fA.toLowerCase(), k: lab(A) }),
      [A, `${A} ${A}`, `${A} ${A} ${A}`, `${A} ${A} ${A} ${A}`]));
    ex.push(fixed(t('ex.repeat', { k: lab(A) }), fA + ' + ' + TH, t('ex.repeatG'),
      [r(A, 2), `${r(A, 2)} ${r(A, 2)}`, `${r(A, 3)} ${r(A, 3)}`, `${r(A, 4)} ${r(A, 4)}`]));
    ex.push(noSpace(B, fB));
    ex.push(fixed(t('ex.intro', { k: lab(B) }), fB, t('ex.introG', { f: fB.toLowerCase(), k: lab(B) }),
      [B, `${B} ${B}`, `${B} ${B} ${B}`, `${B} ${B} ${B} ${B}`]));
    ex.push(fixed(t('ex.repeat', { k: lab(B) }), fB + ' + ' + TH, t('ex.repeatG'),
      [r(B, 2), `${r(B, 2)} ${r(B, 2)}`, `${r(B, 3)} ${r(B, 3)}`, `${r(B, 4)} ${r(B, 4)}`]));
    ex.push(fixed(t('ex.combo', { a: short(A), b: short(B) }), fingersOf([A, B]), t('ex.comboG'),
      [`${A}${B} ${B}${A}`, `${A}${B}${A} ${B}${A}${B}`, `${r(A, 2)}${r(B, 2)} ${r(B, 2)}${r(A, 2)}`, `${A}${B}${A}${B} ${B}${A}${B}${A}`]));

    const anchored = [A, B].filter(k => ANCHOR[k]);
    if (anchored.length) {
      const lines = [];
      anchored.forEach(k => { const h = ANCHOR[k]; lines.push(`${h}${k}${h} ${h}${k}${h}`, `${h}${k} ${h}${k} ${h}${k}`); });
      if (anchored.length === 2) {
        const [a, b] = anchored;
        lines.push(`${ANCHOR[a]}${a} ${ANCHOR[b]}${b} ${ANCHOR[a]}${a} ${ANCHOR[b]}${b}`);
      }
      ex.push(fixed(t('ex.home'), fingersOf(anchored), t('ex.homeG'), lines));
    }

    if (prev.length) {
      const sel = spread(prev, 8), lines = [];
      for (let i = 0; i < sel.length; i += 2) lines.push(sel.slice(i, i + 2).map(k => `${k}${A} ${B}${k}`).join(' '));
      ex.push(fixed(t('ex.mix'), fingersOf(all), t('ex.mixG'), lines));
    }

    ex.push(gen('random', t('ex.random'), fingersOf(all), t('ex.randomG'),
      { keys: all, focus: [A, B], ratio: 0.5, groups: 12, min: 2, max: 5 }));

    const hasWords = wordCount(all) >= 6;
    if (hasWords) {
      ex.push(gen('words', t('ex.words'), fingersOf(all), t('ex.wordsG'),
        { letters: all, count: 12, focus: [A, B], punct: punctOf(all) }));
    }
    ex.push(finalEx(all, [A, B], hasWords));
    return ex;
  }

  function reviewLesson(newest, all) {
    const ex = [];
    ex.push(gen('random', t('rv.newest'), fingersOf(newest), t('rv.newestG', { k: newest.map(short).join(' ') }),
      { keys: newest, groups: 10, min: 2, max: 4 }));
    ex.push(gen('random', t('rv.mix'), fingersOf(all), t('rv.mixG'),
      { keys: all, focus: newest, ratio: 0.5, groups: 14, min: 2, max: 5 }));
    ex.push(gen('alternate', t('rv.alt'), t('f.bothHands'), t('rv.altG'),
      { keys: all, groups: 12, min: 3, max: 5 }));
    const hasWords = wordCount(all) >= 6;
    if (hasWords) {
      ex.push(gen('words', t('ex.words'), fingersOf(all), t('rv.wordsG'),
        { letters: all, count: 16, focus: newest, punct: punctOf(all) }));
    }
    ex.push(finalEx(all, newest, hasWords, 14));
    return ex;
  }

  const BASIC = /^[A-Za-z ,.]+$/;

  function shiftLesson(all) {
    return [
      fixed(t('sh.left'), t('sh.leftF'), t('sh.leftG'), ['Ff Dd Ss Aa', 'Rr Tt Ee Ww Qq', 'Gg Vv Cc Xx Zz Bb', 'Fa Ra Te Sa']),
      fixed(t('sh.right'), t('sh.rightF'), t('sh.rightG'), ['Jj Kk Ll', 'Uu Ii Oo Pp Yy', 'Hh Nn Mm', 'Jo Ku Lu Hi']),
      gen('names', t('sh.names'), t('f.tenShift'), t('sh.namesG'), { count: 12 }),
      gen('words', t('sh.short'), t('f.tenShift'), t('sh.shortG'), { letters: all, count: 18, caps: true, punct: ['.', ','] }),
      gen('sentences', t('ex.final'), t('f.tenShift'), t('ex.finalGoal'), { count: 3, pool: 'basic', allow: BASIC }, true)
    ];
  }

  function punctLesson() {
    const RP = KB.fingerName('p');
    const L = (ex, en) => Object.assign(ex, { linesEn: en });
    return [
      L(fixed(t('pu.colon'), RP, t('pu.colonG'), [';; ;; ;;', ';: ;: ;:', ':: ;; ::', 'satu; dua: tiga;']),
        [';; ;; ;;', ';: ;: ;:', ':: ;; ::', 'one; two: three;']),
      L(fixed(t('pu.quote'), RP, t('pu.quoteG'), ["'' '' ''", "'\" '\" '\"", '"ya" \'oke\'', "it's don't"]),
        ["'' '' ''", "'\" '\" '\"", '"yes" \'ok\'', "it's don't"]),
      L(fixed(t('pu.qe'), t('f.pinky'), t('pu.qeG'), ['/? /? /?', '?? ?? ??', '1! 1! !!', 'apa? ya! siapa? oke!']),
        ['/? /? /?', '?? ?? ??', '1! 1! !!', 'what? yes! who? ok!']),
      L(fixed(t('pu.hyphen'), RP, t('pu.hyphenG'), ['-- -- --', 'anak-anak', 'kupu-kupu', 'jalan-jalan', 'sehari-hari']),
        ['-- -- --', 'well-known', 'self-made', 'long-term', 'up-to-date']),
      gen('sentences', t('pu.sent'), t('f.tenShift'), t('pu.sentG'), { count: 3, pool: 'punct' }),
      gen('sentences', t('ex.final'), t('f.tenShift'), t('ex.finalGoal'), { count: 4, pool: 'punct' }, true)
    ];
  }

  function numbersLesson() {
    const digits = '1234567890'.split('');
    return [
      fixed(t('nu.pair', { a: 4, b: 7 }), t('nu.index'), t('nu.47'), ['f4f j7j', '44 77 44 77', '4 7 47 74', 'f4 j7 f4 j7']),
      fixed(t('nu.pair', { a: 5, b: 6 }), t('nu.index'), t('nu.56'), ['f5f j6j', '55 66 55 66', '56 65 5 6', 'f5 j6 f5 j6']),
      fixed(t('nu.pair', { a: 3, b: 8 }), t('nu.middle'), t('nu.38'), ['d3d k8k', '33 88 33 88', '38 83 3 8', 'd3 k8 d3 k8']),
      fixed(t('nu.pair', { a: 2, b: 9 }), t('nu.ring'), t('nu.29'), ['s2s l9l', '22 99 22 99', '29 92 2 9', 's2 l9 s2 l9']),
      fixed(t('nu.pair', { a: 1, b: 0 }), t('nu.pinky'), t('nu.10'), ['a1a ;0;', '11 00 11 00', '10 01 1 0', 'a1 ;0 a1 ;0']),
      gen('random', t('nu.random'), t('f.ten'), t('nu.randomG'), { keys: digits, groups: 14, min: 2, max: 4 }),
      gen('sentences', t('nu.sent'), t('f.ten'), t('nu.sentG'), { count: 3, pool: 'num' }),
      gen('mixed', t('ex.final'), t('f.ten'), t('ex.finalGoal'), {
        parts: [{ kind: 'random', gen: { keys: digits, groups: 8, min: 2, max: 4 } }, { kind: 'sentences', gen: { count: 2, pool: 'num' } }]
      }, true)
    ];
  }

  function sentencesLesson() {
    const ex = [];
    for (let i = 1; i <= 4; i++) ex.push(gen('sentences', t('se.n', { i }), t('f.ten'), t('se.g'), { count: 2 + (i > 2 ? 1 : 0), pool: 'basic' }));
    ex.push(gen('sentences', t('ex.final'), t('f.ten'), t('ex.finalGoal'), { count: 4, pool: 'all' }, true));
    return ex;
  }

  function finalLesson() {
    return [
      gen('sentences', t('fi.warm'), t('f.ten'), t('fi.warmG'), { count: 2, pool: 'basic' }),
      gen('sentences', t('fi.test'), t('f.ten'), t('fi.testG'), { count: 7, pool: 'all' }, true)
    ];
  }

  // ---------------------------------------------------------------- curriculum spec
  const SPEC = [
    { keys: ['f', 'j'] }, { keys: ['r', 't'] }, { review: true },
    { keys: ['u', 'y'] }, { keys: ['g', 'h'] }, { review: true },
    { keys: ['v', 'b'] }, { keys: ['n', 'm'] }, { review: true },
    { keys: ['d', 'k'] }, { keys: ['e', 'i'] }, { review: true },
    { keys: ['c', ','] }, { keys: ['s', 'l'] }, { review: true },
    { keys: ['w', 'o'] }, { keys: ['x', '.'] }, { review: true },
    { keys: ['a', ';'] }, { keys: ['q', 'p'] }, { review: true },
    { keys: ['z', '/'] }, { review: true, all: true },
    { special: 'shift' }, { special: 'punct' }, { special: 'numbers' }, { special: 'sentences' }, { special: 'final' }
  ];

  // Build the curriculum in the current UI language. The layout (lessons / exercise count)
  // is identical in both languages, so saved progress keys stay valid.
  function build() {
    const LESSONS = [];
    let unlocked = [], sinceReview = [];
    SPEC.forEach((s, i) => {
      const n = i + 1;
      let L;
      if (s.keys) {
        const [A, B] = s.keys, prev = unlocked.slice();
        unlocked = unlocked.concat(s.keys);
        sinceReview = sinceReview.concat(s.keys);
        L = {
          kind: 'keys', title: t('l.pair', { a: short(A), b: short(B) }), newKeys: s.keys.slice(),
          objective: t('l.objKeys', { a: lab(A), b: lab(B), f: fingersOf([A, B]) }),
          exercises: n === 1 ? lesson1() : keyLesson(A, B, prev)
        };
      } else if (s.review) {
        const newest = sinceReview.slice();
        L = {
          kind: 'review', title: t(s.all ? 'l.reviewAll' : 'l.review', { n: unlocked.length }),
          newKeys: newest,
          objective: t('l.objReview', { n: unlocked.length, keys: unlocked.map(short).join(' '), newest: newest.map(short).join(' ') }),
          exercises: reviewLesson(newest, unlocked.slice())
        };
        sinceReview = [];
      } else {
        const make = {
          shift: () => shiftLesson(unlocked.slice()), punct: punctLesson, numbers: numbersLesson,
          sentences: sentencesLesson, final: finalLesson
        }[s.special];
        L = { kind: 'special', special: s.special, title: t('l.' + s.special), newKeys: [], objective: t('l.' + s.special + 'Obj'), exercises: make() };
      }
      L.n = n;
      L.keys = unlocked.slice();
      L.targetWpm = Math.round(10 + i * 25 / (SPEC.length - 1)); // 10 WPM -> 35 WPM
      LESSONS.push(L);
    });
    return LESSONS;
  }

  global.Lessons = { build, textFor, buildText, sentenceText, wordText, wordsFor, short };
})(window);
