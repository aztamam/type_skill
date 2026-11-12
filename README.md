# Ketik10 — Latihan Mengetik 10 Jari

Website standalone (tanpa server, tanpa build). Buka `index.html` langsung di browser.

## Fitur
- **Latihan**: 28 lesson berurutan. Exercise berikutnya terbuka setelah lulus (akurasi ≥ 95%).
  Setiap exercise memberi 3 bintang: ★ selesai, ◎ tanpa salah, ⚡ mencapai target WPM lesson.
- **Tampilan latihan**:
  - *Tanpa spasi* (mis. `jjjjjj`): deretan tile tombol berwarna jari, tile yang sudah diketik bergeser ke kiri.
  - *Dengan spasi* (mis. `j jj jjj`): pita teks besar, kursor di tengah, huruf yang sudah diketik memudar.
  - *Final challenge*: baris bertumpuk dengan ↵ di akhir baris.
  - Salah tekan: huruf aktif jadi merah dan tombol yang salah ditekan menyala merah di keyboard.
- **Game "Highway"**: model jalan berperspektif (lihat `js/highway.js`).
- **Final challenge (tampilan baris)**: baris aktif besar di atas, baris berikutnya mengecil di bawahnya.
  Huruf benar jadi hijau, huruf yang sempat salah jadi merah. Setiap baris diakhiri ↵ (tekan Enter; Spasi juga diterima).
- **Tes**: tes kecepatan 30 detik / 1 menit / 2 menit dengan kalimat bahasa Indonesia.
- **Game "Highway"**: huruf datang dari jauh dan harus diketik sebelum lewat. 3 nyawa, kecepatan naik setiap 10 huruf.
- **Tips**: posisi jari, postur, dan legenda warna jari.
- **Profil pengguna**: saat pertama dibuka, pengguna mengisi nama. Setiap kali dibuka lagi muncul sapaan
  "Selamat datang kembali" beserta pencapaian (bintang, posisi lesson, WPM & akurasi terbaik, skor game,
  total waktu latihan). Klik nama di pojok kanan atas untuk melihat riwayat, ganti pengguna, atau menambah profil.
- Data disimpan di `localStorage` browser (`ketik10.profiles`), jadi hanya ada di browser & komputer itu.
  Pakai **Backup ke file / Pulihkan dari file** di menu profil untuk memindahkan atau mengamankan progres.

## Bahasa (ID/EN)
- Tombol **ID / EN** di kanan atas (juga di layar awal dan menu ⚙) mengganti seluruh tampilan:
  menu, lesson, keterangan, Tips, profil, Game, serta isi latihan (kata & kalimat) dan Tes.
- Struktur lesson sama di kedua bahasa, jadi progres tetap berlaku saat ganti bahasa.
- Semua teks ada di `js/i18n.js` (kamus `id` dan `en`).
- Exercise kombinasi berpola diacak ulang setiap kali dimulai/diulang; latihan acak, kata, dan kalimat juga selalu baru.

## Struktur
```
index.html
css/style.css
js/i18n.js       teks antarmuka ID/EN
js/keyboard.js   layout QWERTY, peta jari, warna jari, char -> tombol
js/lessons.js    kurikulum 28 lesson + generator teks (acak, kata, kalimat)
js/highway.js    renderer canvas untuk model ketik
js/app.js        layar Latihan / Tes / Game / Tips, progres, input
```

## Urutan lesson
| # | Lesson | # | Lesson |
|---|---|---|---|
| 1 | F J | 15 | ★ Review 20 huruf |
| 2 | R T | 16 | W O |
| 3 | ★ Review 4 huruf | 17 | X . |
| 4 | U Y | 18 | ★ Review 24 huruf |
| 5 | G H | 19 | A ; |
| 6 | ★ Review 8 huruf | 20 | Q P |
| 7 | V B | 21 | ★ Review 28 huruf |
| 8 | N M | 22 | Z / |
| 9 | ★ Review 12 huruf | 23 | ★ Review semua (30 tombol) |
| 10 | D K | 24 | Shift — huruf kapital |
| 11 | E I | 25 | Tanda baca |
| 12 | ★ Review 16 huruf | 26 | Angka 1–0 |
| 13 | C , | 27 | Kalimat |
| 14 | S L | 28 | Tes akhir |

Template exercise lesson huruf: A tanpa spasi (aaaaaa) → kenal A → ulangan A → B tanpa spasi → kenal B → ulangan B → kombinasi A+B →
kembali ke home row → campur huruf lama → acak → kata nyata (jika cukup kata) → final challenge (tampilan baris).
Lesson review memberi bobot sekitar 50% untuk huruf terbaru.

## Mengubah konten
- Urutan lesson: array `SPEC` di `js/lessons.js`.
- Isi Lesson 1: fungsi `lesson1()`.
- Kata, nama, dan kalimat: `WORDS_ID`, `WORDS_EN`, `NAMES`, `SENTENCES`, `PUNCT_SENT`, `NUM_SENT`.
- Target WPM: `L.targetWpm` (naik dari 10 ke 35 WPM).

## Tips pengembangan
- Di menu ⚙ (tombol slider) aktifkan **Mode bebas** untuk membuka semua lesson saat testing.
- Di DevTools: `__ketik10.startExercise(lessonIndex, exerciseIndex)` (index mulai dari 0).
