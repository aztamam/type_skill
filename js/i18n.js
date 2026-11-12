/* UI language (Indonesian / English). I18N.t('key', {var}) -> string with {var} replaced. */
(function (global) {
  'use strict';

  const STR = {
    id: {
      'page.title': 'Ketik10 — Latihan Mengetik 10 Jari',
      'nav.practice': 'Latihan', 'nav.test': 'Tes', 'nav.tips': 'Tips', 'nav.game': 'Game',
      'hdr.stars': 'Total bintang — klik untuk lihat pencapaian', 'hdr.profile': 'Profil & pencapaian', 'hdr.lang': 'Bahasa',
      'caps': 'Caps Lock aktif',
      'p.restart': 'Ulangi exercise (Esc)', 'p.settings': 'Pilih lesson & pengaturan',
      'st.acc': 'Akurasi', 'st.err': 'Error', 'st.target': 'Target', 'st.best': 'Terbaik',
      'finger': 'Jari', 'shiftL': 'Shift kiri', 'shiftR': 'Shift kanan',
      'finger.lp': 'Kelingking kiri', 'finger.lr': 'Jari manis kiri', 'finger.lm': 'Jari tengah kiri', 'finger.li': 'Telunjuk kiri',
      'finger.ri': 'Telunjuk kanan', 'finger.rm': 'Jari tengah kanan', 'finger.rr': 'Jari manis kanan', 'finger.rp': 'Kelingking kanan',
      'finger.th': 'Ibu jari',

      // results
      'res.fail': 'Belum lulus', 'res.course': 'Kursus selesai! 🎉', 'res.lesson': 'Lesson {n} selesai! 🎉', 'res.good': 'Bagus!',
      'star.done': 'Selesai<br>akurasi ≥95%', 'star.perfect': 'Tanpa<br>salah', 'star.fast': 'Cepat<br>≥{w} WPM',
      'res.time': 'Waktu',
      'res.msgBoth': 'Akurasi dan kecepatan tercapai.',
      'res.msgPass': 'Ulangi untuk mengejar bintang ⚡ kalau mau, atau lanjut.',
      'res.msgFail': 'Butuh akurasi minimal 95% untuk lanjut. Pelan-pelan saja, fokus ke ketepatan.',
      'btn.retry': 'Ulangi', 'btn.next': 'Lanjut', 'btn.tryAgain': 'Coba lagi', 'btn.start': 'Mulai', 'btn.close': 'Tutup',

      // picker & settings
      'pk.title': 'Pilih lesson',
      'set.keyboard': 'Keyboard di layar', 'set.colors': 'Warna jari', 'set.free': 'Mode bebas',
      'set.freeTip': 'Buka semua lesson tanpa harus lulus berurutan', 'set.lang': 'Bahasa',
      'set.reset': 'Reset progres', 'set.confirm': 'Klik lagi untuk konfirmasi',

      // test
      'test.crumb': 'Tes kecepatan', 'test.h1': 'Seberapa cepat kamu mengetik?',
      'test.langId': 'Indonesia', 'test.langEn': 'English',
      'test.words': 'Kata sederhana', 'test.wordsTip': 'Huruf kecil saja, tanpa tanda baca',
      'test.sentences': 'Kalimat lengkap', 'test.sentencesTip': 'Huruf kapital, tanda baca, dan angka',
      'test.d30': '30 detik', 'test.d60': '1 menit', 'test.d120': '2 menit',
      'test.newText': 'Teks baru (Esc)',
      'test.note': 'Timer mulai saat tombol pertama ditekan. Huruf benar jadi hijau, salah jadi merah (tetap lanjut). Tekan Backspace untuk memperbaiki.',
      'test.newBest': 'Rekor baru! 🎉', 'test.result': 'Hasil tes', 'test.typos': 'Salah ketik',
      'test.note90': 'Rekor hanya dihitung jika akurasi minimal 90%.', 'test.noteAvg': 'Ulangi beberapa kali, ambil rata-ratanya.',
      'test.again': 'Tes lagi',

      // tips
      'tips.h1': 'Tips mengetik 10 jari', 'tips.colors': 'Warna jari',
      'tip1': '<h3>1. Posisi awal (home row)</h3><p>Jari kiri di <b>A S D F</b>, jari kanan di <b>J K L ;</b>. Raba tonjolan kecil di tombol F dan J tanpa melihat. Kedua ibu jari di atas Space.</p>',
      'tip2': '<h3>2. Selalu kembali ke home row</h3><p>Setelah meraih tombol di atas atau bawah, jari langsung pulang ke posisi awalnya. Kebiasaan ini yang membuat kamu bisa mengetik tanpa melihat.</p>',
      'tip3': '<h3>3. Jangan lihat keyboard</h3><p>Lihat layar saja. Di awal memang lebih lambat, tapi otot jari belajar lebih cepat jika mata tidak membantu.</p>',
      'tip4': '<h3>4. Akurasi dulu, kecepatan nanti</h3><p>Targetkan akurasi minimal 95%. Kecepatan akan naik sendiri setelah gerakan jari sudah otomatis.</p>',
      'tip5': '<h3>5. Shift di sisi berlawanan</h3><p>Huruf kapital di sisi kiri keyboard pakai Shift kanan, huruf di sisi kanan pakai Shift kiri. Hindari Caps Lock.</p>',
      'tip6': '<h3>6. Posisi duduk</h3><p>Punggung tegak, bahu rileks, siku sekitar 90°. Pergelangan tangan melayang dan tidak menekuk ke atas.</p>',
      'tip7': '<h3>7. Ritme yang rata</h3><p>Ketik dengan tempo stabil seperti metronom. Lebih baik pelan dan rata daripada cepat tapi tersendat.</p>',
      'tip8': '<h3>8. Latihan pendek tapi rutin</h3><p>15–20 menit setiap hari jauh lebih efektif daripada 2 jam seminggu sekali. Istirahat jika tangan lelah.</p>',

      // game
      'game.desc': 'Huruf datang dari jauh. Ketik huruf yang <b>paling dekat</b> sebelum lewat. Lewat 3 kali = game over.',
      'game.level': 'Huruf dari', 'game.start': 'Mulai', 'game.resume': 'Lanjut', 'game.paused': 'Jeda',
      'game.restart': 'Main ulang', 'game.note': 'Kecepatan naik setiap 10 huruf benar. Tekan Esc untuk jeda.',
      'game.letters': '{n} huruf', 'game.newBest': 'Skor tertinggi baru! 🎉', 'game.score': 'Skor',
      'game.change': 'Ganti level', 'game.again': 'Main lagi',

      // time
      'ago.never': 'belum pernah', 'ago.now': 'baru saja', 'ago.min': '{n} menit lalu', 'ago.hour': '{n} jam lalu',
      'ago.yesterday': 'kemarin', 'ago.days': '{n} hari lalu',
      'dur.min': '{n} menit', 'dur.hm': '{h} jam {m} mnt',

      // achievements & history
      'ach.stars': 'dari {n} bintang', 'ach.pos': 'posisi sekarang', 'ach.graduated': 'Lulus 🎓',
      'ach.bestWpm': 'WPM terbaik latihan', 'ach.avgAcc': 'rata-rata akurasi', 'ach.lessons': 'lesson selesai',
      'ach.testBest': 'WPM terbaik tes', 'ach.gameBest': 'skor game terbaik', 'ach.time': 'latihan · {d} hari',
      'ach.summary': '{p} dari {t} exercise lulus ({pct}% kursus)',
      'hist.none': 'Belum ada riwayat latihan.', 'hist.test': 'Tes {d} detik', 'hist.words': ' · kata', 'hist.score': 'skor {s}',

      // profiles
      'prof.login': 'Masuk',
      'gate.who': 'Siapa yang latihan hari ini?', 'gate.welcome': 'Selamat datang di Ketik10',
      'gate.desc': 'Masukkan nama supaya progres dan pencapaianmu tersimpan.', 'gate.or': 'atau buat profil baru',
      'gate.ph': 'Nama kamu', 'gate.empty': 'Nama belum diisi.',
      'wel.hi': 'Halo, {name}! 👋', 'wel.back': 'Selamat datang kembali, {name}! 👋',
      'wel.fresh': 'Kita mulai dari Lesson 1: tombol F dan J. Letakkan jari di home row, lalu mulai mengetik.',
      'wel.last': 'Terakhir latihan {ago}. Ini pencapaianmu sejauh ini:',
      'wel.notMe': 'Bukan {name}?', 'wel.continue': 'Lanjut latihan',
      'prof.created': 'Profil dibuat {d}', 'prof.history': 'Riwayat terakhir', 'prof.switch': 'Ganti pengguna',
      'prof.add': 'Tambah pengguna', 'prof.addSub': 'buat profil baru',
      'prof.export': 'Backup ke file', 'prof.exportTip': 'Simpan semua profil ke file .json',
      'prof.import': 'Pulihkan dari file', 'prof.importTip': 'Pulihkan profil dari file backup .json',
      'prof.del': 'Hapus profil ini', 'prof.delConfirm': 'Klik lagi untuk menghapus',
      'imp.ok': 'Berhasil dipulihkan', 'imp.fail': 'Gagal memulihkan',
      'imp.okMsg': '{n} profil dari file backup sudah dimuat.', 'imp.failMsg': 'File ini bukan backup Ketik10 yang valid.',

      // lessons
      'key.,': 'Koma', 'key..': 'Titik', 'key.;': 'Titik koma', 'key./': 'Garis miring', 'key. ': 'Spasi',
      'l.pair': '{a} dan {b}', 'l.objKeys': 'Mengenal tombol {a} dan {b} ({f}). Akurasi dulu, kecepatan menyusul.',
      'l.review': 'Review {n} huruf', 'l.reviewAll': 'Review semua ({n} tombol)',
      'l.objReview': 'Mengulang {n} tombol: {keys}. Bobot lebih besar untuk {newest}.',
      'l.shift': 'Shift — huruf kapital', 'l.shiftObj': 'Mengetik huruf kapital dengan Shift di sisi yang berlawanan.',
      'l.punct': 'Tanda baca', 'l.punctObj': 'Mengenal tanda baca : " ? ! - dan petik.',
      'l.numbers': 'Angka 1–0', 'l.numbersObj': 'Mengenal baris angka, jari naik dari home row.',
      'l.sentences': 'Kalimat', 'l.sentencesObj': 'Mengetik kalimat utuh dengan semua yang sudah dipelajari.',
      'l.final': 'Tes akhir', 'l.finalObj': 'Tes akhir kursus mengetik 10 jari.',
      'f.ten': '10 jari', 'f.bothIndex': 'Kedua telunjuk', 'f.bothHands': 'Kedua tangan', 'f.tenShift': '10 jari + Shift',
      'ex.final': 'Final challenge', 'ex.finalGoal': 'Uji akurasi dan kecepatan. Lulus jika akurasi minimal 95%.',
      'ex.enterNote': ' Tekan Enter di akhir setiap baris.',
      'ex.noSpace': '{k} tanpa spasi', 'ex.noSpaceG': 'Tekan {k} berulang tanpa spasi. Rasakan posisi {f} di tombol ini.',
      'ex.intro': 'Mengenal {k}', 'ex.introG': 'Membiasakan {f} menekan {k}.',
      'ex.repeat': 'Ulangan {k}', 'ex.repeatG': 'Ritme konsisten, ibu jari menekan spasi.',
      'ex.combo': 'Kombinasi {a} dan {b}', 'ex.comboG': 'Berpindah antar dua tombol baru dengan lancar.',
      'ex.home': 'Kembali ke home row', 'ex.homeG': 'Setelah menekan tombol, jari selalu kembali ke posisi awal di home row.',
      'ex.mix': 'Campur dengan huruf lama', 'ex.mixG': 'Huruf baru dipasangkan dengan huruf yang sudah dipelajari.',
      'ex.random': 'Latihan acak', 'ex.randomG': 'Semua huruf yang sudah dipelajari, fokus ke huruf baru.',
      'ex.words': 'Kata nyata', 'ex.wordsG': 'Mengetik kata sungguhan dari huruf yang sudah dipelajari.',
      'rv.newest': 'Fokus huruf terbaru', 'rv.newestG': 'Pemanasan dengan {k}.',
      'rv.mix': 'Campuran semua huruf', 'rv.mixG': 'Sekitar 50% huruf terbaru dan 50% huruf lama.',
      'rv.alt': 'Ritme dua tangan', 'rv.altG': 'Tangan kiri dan kanan bergantian untuk melatih ritme.',
      'rv.wordsG': 'Kata sungguhan, diutamakan yang memakai huruf terbaru.',
      'l1.introJ': 'Mengenal huruf J', 'l1.introJG': 'Membiasakan jari telunjuk kanan menekan tombol J.',
      'l1.comboJ': 'Kombinasi huruf J', 'l1.comboJG': 'Melatih pengulangan tombol J dengan ritme yang konsisten.',
      'l1.spaceJ': 'Huruf J dengan spasi', 'l1.spaceJG': 'Membiasakan penggunaan tombol Space menggunakan ibu jari.',
      'l1.introF': 'Mengenal huruf F', 'l1.introFG': 'Membiasakan jari telunjuk kiri menekan tombol F.',
      'l1.comboF': 'Kombinasi huruf F', 'l1.comboFG': 'Melatih pengulangan tombol F dengan ritme yang konsisten.',
      'l1.spaceF': 'Huruf F dengan spasi', 'l1.spaceFG': 'Membiasakan tombol Space setelah huruf F.',
      'l1.comboFJ': 'Kombinasi F dan J', 'l1.comboFJG': 'Melatih koordinasi kedua telunjuk.',
      'l1.spaceFJ': 'F dan J dengan spasi', 'l1.spaceFJG': 'Koordinasi kedua telunjuk dan ibu jari.',
      'l1.random': 'Random practice', 'l1.randomG': 'Menguji tombol F, J, dan Space secara acak.',
      'sh.left': 'Kapital tangan kiri', 'sh.leftF': 'Kelingking kanan (Shift) + jari kiri',
      'sh.leftG': 'Huruf di sisi kiri keyboard: tahan Shift KANAN dengan kelingking kanan.',
      'sh.right': 'Kapital tangan kanan', 'sh.rightF': 'Kelingking kiri (Shift) + jari kanan',
      'sh.rightG': 'Huruf di sisi kanan keyboard: tahan Shift KIRI dengan kelingking kiri.',
      'sh.names': 'Nama & tempat', 'sh.namesG': 'Setiap kata diawali huruf kapital. Pakai Shift di sisi yang berlawanan.',
      'sh.short': 'Kalimat pendek', 'sh.shortG': 'Huruf kapital di awal kalimat, titik di akhir.',
      'pu.colon': 'Titik koma & titik dua', 'pu.colonG': 'Titik dua (:) = Shift kiri + titik koma.',
      'pu.quote': 'Petik & tanda kutip', 'pu.quoteG': 'Tanda kutip (") = Shift kiri + petik (\').',
      'pu.qe': 'Tanda tanya & seru', 'pu.qeG': 'Tanya (?) = Shift kiri + garis miring. Seru (!) = Shift kanan + 1.',
      'pu.hyphen': 'Tanda hubung', 'pu.hyphenG': 'Tanda hubung (-) ada di sebelah kanan angka 0.',
      'pu.sent': 'Kalimat bertanda baca', 'pu.sentG': 'Kalimat dengan berbagai tanda baca.',
      'f.pinky': 'Kelingking',
      'nu.pair': 'Angka {a} dan {b}', 'nu.index': 'Telunjuk kiri & kanan', 'nu.middle': 'Jari tengah', 'nu.ring': 'Jari manis', 'nu.pinky': 'Kelingking',
      'nu.47': 'Telunjuk naik dua baris dari F ke 4 dan dari J ke 7.', 'nu.56': 'Telunjuk meraih ke dalam: 5 (kiri) dan 6 (kanan).',
      'nu.38': 'Jari tengah dari D ke 3 dan dari K ke 8.', 'nu.29': 'Jari manis dari S ke 2 dan dari L ke 9.',
      'nu.10': 'Kelingking dari A ke 1 dan dari ; ke 0.',
      'nu.random': 'Angka acak', 'nu.randomG': 'Kombinasi angka secara acak.',
      'nu.sent': 'Angka dalam kalimat', 'nu.sentG': 'Angka bercampur dengan kata.',
      'se.n': 'Kalimat {i}', 'se.g': 'Ketik kalimat utuh dengan ritme yang stabil.',
      'fi.warm': 'Pemanasan', 'fi.warmG': 'Pemanasan sebelum tes akhir.',
      'fi.test': 'Tes akhir', 'fi.testG': 'Tes akhir kursus. Lulus jika akurasi minimal 95%.'
    },

    en: {
      'page.title': 'Ketik10 — Touch Typing Practice',
      'nav.practice': 'Practice', 'nav.test': 'Test', 'nav.tips': 'Tips', 'nav.game': 'Game',
      'hdr.stars': 'Total stars — click to see achievements', 'hdr.profile': 'Profile & achievements', 'hdr.lang': 'Language',
      'caps': 'Caps Lock is on',
      'p.restart': 'Restart exercise (Esc)', 'p.settings': 'Lessons & settings',
      'st.acc': 'Accuracy', 'st.err': 'Errors', 'st.target': 'Target', 'st.best': 'Best',
      'finger': 'Finger', 'shiftL': 'left Shift', 'shiftR': 'right Shift',
      'finger.lp': 'Left pinky', 'finger.lr': 'Left ring finger', 'finger.lm': 'Left middle finger', 'finger.li': 'Left index finger',
      'finger.ri': 'Right index finger', 'finger.rm': 'Right middle finger', 'finger.rr': 'Right ring finger', 'finger.rp': 'Right pinky',
      'finger.th': 'Thumb',

      'res.fail': 'Not passed yet', 'res.course': 'Course complete! 🎉', 'res.lesson': 'Lesson {n} complete! 🎉', 'res.good': 'Nice work!',
      'star.done': 'Completed<br>accuracy ≥95%', 'star.perfect': 'No<br>mistakes', 'star.fast': 'Fast<br>≥{w} WPM',
      'res.time': 'Time',
      'res.msgBoth': 'Accuracy and speed targets reached.',
      'res.msgPass': 'Repeat to chase the ⚡ star if you like, or move on.',
      'res.msgFail': 'You need at least 95% accuracy to continue. Slow down and focus on accuracy.',
      'btn.retry': 'Repeat', 'btn.next': 'Next', 'btn.tryAgain': 'Try again', 'btn.start': 'Start', 'btn.close': 'Close',

      'pk.title': 'Choose a lesson',
      'set.keyboard': 'On-screen keyboard', 'set.colors': 'Finger colours', 'set.free': 'Free mode',
      'set.freeTip': 'Open every lesson without passing them in order', 'set.lang': 'Language',
      'set.reset': 'Reset progress', 'set.confirm': 'Click again to confirm',

      'test.crumb': 'Speed test', 'test.h1': 'How fast do you type?',
      'test.langId': 'Indonesian', 'test.langEn': 'English',
      'test.words': 'Simple words', 'test.wordsTip': 'Lowercase only, no punctuation',
      'test.sentences': 'Full sentences', 'test.sentencesTip': 'Capitals, punctuation and numbers',
      'test.d30': '30 sec', 'test.d60': '1 min', 'test.d120': '2 min',
      'test.newText': 'New text (Esc)',
      'test.note': 'The timer starts on your first key press. Correct letters turn green, mistakes turn red (you keep going). Press Backspace to fix.',
      'test.newBest': 'New record! 🎉', 'test.result': 'Test result', 'test.typos': 'Typos',
      'test.note90': 'Records only count with at least 90% accuracy.', 'test.noteAvg': 'Take the test a few times and look at the average.',
      'test.again': 'Test again',

      'tips.h1': 'Touch typing tips', 'tips.colors': 'Finger colours',
      'tip1': '<h3>1. Starting position (home row)</h3><p>Left fingers on <b>A S D F</b>, right fingers on <b>J K L ;</b>. Feel the small bumps on F and J without looking. Both thumbs rest on Space.</p>',
      'tip2': '<h3>2. Always return to the home row</h3><p>After reaching for a key above or below, your finger goes straight back to its home key. This habit is what lets you type without looking.</p>',
      'tip3': '<h3>3. Don\'t look at the keyboard</h3><p>Keep your eyes on the screen. It is slower at first, but your fingers learn faster when your eyes are not helping.</p>',
      'tip4': '<h3>4. Accuracy first, speed later</h3><p>Aim for at least 95% accuracy. Speed comes on its own once the finger movements are automatic.</p>',
      'tip5': '<h3>5. Shift on the opposite side</h3><p>For capitals on the left side of the keyboard use the right Shift, and for the right side use the left Shift. Avoid Caps Lock.</p>',
      'tip6': '<h3>6. Sitting posture</h3><p>Back straight, shoulders relaxed, elbows at about 90°. Keep your wrists floating, not bent upwards.</p>',
      'tip7': '<h3>7. Even rhythm</h3><p>Type at a steady tempo, like a metronome. Slow and even beats fast and stumbling.</p>',
      'tip8': '<h3>8. Short but regular practice</h3><p>15–20 minutes every day works far better than 2 hours once a week. Take a break when your hands get tired.</p>',

      'game.desc': 'Letters come at you from far away. Type the <b>closest</b> one before it passes. Miss 3 = game over.',
      'game.level': 'Letters from', 'game.start': 'Start', 'game.resume': 'Resume', 'game.paused': 'Paused',
      'game.restart': 'Play again', 'game.note': 'Speed goes up every 10 correct letters. Press Esc to pause.',
      'game.letters': '{n} letters', 'game.newBest': 'New high score! 🎉', 'game.score': 'Score',
      'game.change': 'Change level', 'game.again': 'Play again',

      'ago.never': 'never', 'ago.now': 'just now', 'ago.min': '{n} min ago', 'ago.hour': '{n} h ago',
      'ago.yesterday': 'yesterday', 'ago.days': '{n} days ago',
      'dur.min': '{n} min', 'dur.hm': '{h} h {m} min',

      'ach.stars': 'of {n} stars', 'ach.pos': 'current position', 'ach.graduated': 'Graduated 🎓',
      'ach.bestWpm': 'best practice WPM', 'ach.avgAcc': 'average accuracy', 'ach.lessons': 'lessons completed',
      'ach.testBest': 'best test WPM', 'ach.gameBest': 'best game score', 'ach.time': 'practice · {d} days',
      'ach.summary': '{p} of {t} exercises passed ({pct}% of the course)',
      'hist.none': 'No practice history yet.', 'hist.test': 'Test {d} sec', 'hist.words': ' · words', 'hist.score': 'score {s}',

      'prof.login': 'Sign in',
      'gate.who': 'Who is practising today?', 'gate.welcome': 'Welcome to Ketik10',
      'gate.desc': 'Enter your name so your progress and achievements are saved.', 'gate.or': 'or create a new profile',
      'gate.ph': 'Your name', 'gate.empty': 'Please enter a name.',
      'wel.hi': 'Hi, {name}! 👋', 'wel.back': 'Welcome back, {name}! 👋',
      'wel.fresh': 'We\'ll start with Lesson 1: the F and J keys. Place your fingers on the home row and start typing.',
      'wel.last': 'Last practice {ago}. Here is what you have achieved so far:',
      'wel.notMe': 'Not {name}?', 'wel.continue': 'Continue practice',
      'prof.created': 'Profile created {d}', 'prof.history': 'Recent history', 'prof.switch': 'Switch user',
      'prof.add': 'Add user', 'prof.addSub': 'create a new profile',
      'prof.export': 'Back up to file', 'prof.exportTip': 'Save all profiles to a .json file',
      'prof.import': 'Restore from file', 'prof.importTip': 'Restore profiles from a .json backup file',
      'prof.del': 'Delete this profile', 'prof.delConfirm': 'Click again to delete',
      'imp.ok': 'Restored', 'imp.fail': 'Restore failed',
      'imp.okMsg': '{n} profile(s) loaded from the backup file.', 'imp.failMsg': 'This is not a valid Ketik10 backup file.',

      'key.,': 'Comma', 'key..': 'Period', 'key.;': 'Semicolon', 'key./': 'Slash', 'key. ': 'Space',
      'l.pair': '{a} and {b}', 'l.objKeys': 'Learn the {a} and {b} keys ({f}). Accuracy first, speed will follow.',
      'l.review': 'Review {n} letters', 'l.reviewAll': 'Review all ({n} keys)',
      'l.objReview': 'Review {n} keys: {keys}. Extra weight on {newest}.',
      'l.shift': 'Shift — capital letters', 'l.shiftObj': 'Type capital letters using the Shift key on the opposite side.',
      'l.punct': 'Punctuation', 'l.punctObj': 'Learn the punctuation marks : " ? ! - and the apostrophe.',
      'l.numbers': 'Numbers 1–0', 'l.numbersObj': 'Learn the number row, reaching up from the home row.',
      'l.sentences': 'Sentences', 'l.sentencesObj': 'Type full sentences using everything you have learned.',
      'l.final': 'Final test', 'l.finalObj': 'The final test of the touch typing course.',
      'f.ten': '10 fingers', 'f.bothIndex': 'Both index fingers', 'f.bothHands': 'Both hands', 'f.tenShift': '10 fingers + Shift',
      'ex.final': 'Final challenge', 'ex.finalGoal': 'Test your accuracy and speed. Pass with at least 95% accuracy.',
      'ex.enterNote': ' Press Enter at the end of each line.',
      'ex.noSpace': '{k} without spaces', 'ex.noSpaceG': 'Press {k} repeatedly without spaces. Feel where your {f} sits on this key.',
      'ex.intro': 'Meet {k}', 'ex.introG': 'Get your {f} used to pressing {k}.',
      'ex.repeat': 'Repeat {k}', 'ex.repeatG': 'Keep a steady rhythm; your thumb presses Space.',
      'ex.combo': 'Combine {a} and {b}', 'ex.comboG': 'Switch smoothly between the two new keys.',
      'ex.home': 'Back to the home row', 'ex.homeG': 'After each key press, your finger returns to its home row position.',
      'ex.mix': 'Mix with earlier letters', 'ex.mixG': 'New letters paired with letters you already know.',
      'ex.random': 'Random practice', 'ex.randomG': 'All letters learned so far, focusing on the new ones.',
      'ex.words': 'Real words', 'ex.wordsG': 'Type real words made from the letters you know.',
      'rv.newest': 'Focus on the newest letters', 'rv.newestG': 'Warm up with {k}.',
      'rv.mix': 'All letters mixed', 'rv.mixG': 'About 50% newest letters and 50% earlier ones.',
      'rv.alt': 'Two-hand rhythm', 'rv.altG': 'Left and right hands alternate to build rhythm.',
      'rv.wordsG': 'Real words, favouring ones with the newest letters.',
      'l1.introJ': 'Meet the letter J', 'l1.introJG': 'Get your right index finger used to pressing J.',
      'l1.comboJ': 'J combinations', 'l1.comboJG': 'Repeat J with a steady rhythm.',
      'l1.spaceJ': 'J with spaces', 'l1.spaceJG': 'Get used to pressing Space with your thumb.',
      'l1.introF': 'Meet the letter F', 'l1.introFG': 'Get your left index finger used to pressing F.',
      'l1.comboF': 'F combinations', 'l1.comboFG': 'Repeat F with a steady rhythm.',
      'l1.spaceF': 'F with spaces', 'l1.spaceFG': 'Practise Space after the letter F.',
      'l1.comboFJ': 'Combine F and J', 'l1.comboFJG': 'Coordinate both index fingers.',
      'l1.spaceFJ': 'F and J with spaces', 'l1.spaceFJG': 'Coordinate both index fingers and your thumb.',
      'l1.random': 'Random practice', 'l1.randomG': 'Random practice with F, J and Space.',
      'sh.left': 'Left-hand capitals', 'sh.leftF': 'Right pinky (Shift) + left hand',
      'sh.leftG': 'Letters on the left side: hold the RIGHT Shift with your right pinky.',
      'sh.right': 'Right-hand capitals', 'sh.rightF': 'Left pinky (Shift) + right hand',
      'sh.rightG': 'Letters on the right side: hold the LEFT Shift with your left pinky.',
      'sh.names': 'Names & places', 'sh.namesG': 'Every word starts with a capital. Use the Shift on the opposite side.',
      'sh.short': 'Short sentences', 'sh.shortG': 'Capital at the start, period at the end.',
      'pu.colon': 'Semicolon & colon', 'pu.colonG': 'Colon (:) = left Shift + semicolon.',
      'pu.quote': 'Apostrophe & quotes', 'pu.quoteG': 'Quote (") = left Shift + apostrophe (\').',
      'pu.qe': 'Question & exclamation marks', 'pu.qeG': 'Question mark (?) = left Shift + slash. Exclamation (!) = right Shift + 1.',
      'pu.hyphen': 'Hyphen', 'pu.hyphenG': 'The hyphen (-) is to the right of 0.',
      'pu.sent': 'Punctuated sentences', 'pu.sentG': 'Sentences with various punctuation marks.',
      'f.pinky': 'Pinky',
      'nu.pair': 'Numbers {a} and {b}', 'nu.index': 'Left & right index', 'nu.middle': 'Middle fingers', 'nu.ring': 'Ring fingers', 'nu.pinky': 'Pinkies',
      'nu.47': 'Index fingers reach up two rows: F to 4 and J to 7.', 'nu.56': 'Index fingers reach inward: 5 (left) and 6 (right).',
      'nu.38': 'Middle fingers: D to 3 and K to 8.', 'nu.29': 'Ring fingers: S to 2 and L to 9.',
      'nu.10': 'Pinkies: A to 1 and ; to 0.',
      'nu.random': 'Random numbers', 'nu.randomG': 'Random number combinations.',
      'nu.sent': 'Numbers in sentences', 'nu.sentG': 'Numbers mixed with words.',
      'se.n': 'Sentences {i}', 'se.g': 'Type full sentences with a steady rhythm.',
      'fi.warm': 'Warm-up', 'fi.warmG': 'Warm up before the final test.',
      'fi.test': 'Final test', 'fi.testG': 'The course final test. Pass with at least 95% accuracy.'
    }
  };

  const KEY = 'ketik10.lang';
  let lang = 'id';
  try { const l = localStorage.getItem(KEY); if (l === 'en' || l === 'id') lang = l; } catch (e) { /* ignore */ }

  function t(key, vars) {
    let s = (STR[lang] && STR[lang][key]) != null ? STR[lang][key] : (STR.id[key] != null ? STR.id[key] : key);
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'id';
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang;
  }
  // translate static markup: data-i18n (text), data-i18n-html, data-i18n-title, data-i18n-ph
  function apply(rootEl) {
    const r = rootEl || document;
    r.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    r.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    r.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    r.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.title = t('page.title');
  }

  document.documentElement.lang = lang;
  global.I18N = { t, setLang, apply, get lang() { return lang; } };
})(window);
