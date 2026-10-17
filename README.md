# Bayu Firmansyah — Portfolio

Portofolio React berbahasa Indonesia untuk Senior Full Stack Developer & Edutech Solution Architect. Desain editorial hitam–lime mengadaptasi arahan `../task.md`; seluruh pengalaman, pendidikan, kontak, dan capaian bersumber dari CV Februari 2026.

## Jalankan

Node.js 22+ dan npm diperlukan.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

## Konten dan struktur

- `src/data/profile.ts`: profil, kontak, studi kasus, pengalaman, dan keahlian.
- `src/App.tsx`: struktur halaman, navigasi, hero, dialog studi kasus, unduhan dan kontak.
- `src/hooks/useMotion.ts`: GSAP/ScrollTrigger, Lenis, reveal, pointer parallax, magnetic CTA, serta cleanup.
- `src/components/ProjectVisual.tsx`: ilustrasi studi kasus. Visual bukan screenshot produk asli.
- `src/components/Lab.tsx` dan `CoreScene.tsx`: eksperimen 3D procedural, pemilihan warna, kontrol keyboard, reset, lazy loading, pause offscreen, dan fallback 2D.
- `src/styles/index.css`: tema, layout, dan breakpoint responsif.
- `public/bayu-firmansyah-cv.pdf`: CV sumber yang dapat diunduh.
- `ASSETS.md`: asal visual, prompt generasi, dan referensi desain.

## Hero dan gerakan

Hero menggunakan visual workspace developer orisinal. Di desktop, pointer menggeser dan memiringkan lapisan visual dengan easing. Scroll sepanjang kurang dari satu viewport menahan hero sebentar, mengurangi ukuran visual menjadi panel tengah, menggeser nama keluar, lalu mengungkap dua baris tipografi bergerak serta simbol kode yang digambar progresif. Pola ini terinspirasi pengalaman pada landonorris.com, bukan reproduksi source code atau asetnya. Tidak mengklaim foto workspace sebagai ruang kerja Bayu yang sebenarnya.

Mobile memakai parallax sederhana tanpa pin agar navigasi sentuh tetap nyaman. `prefers-reduced-motion` mematikan intro, smooth scrolling, pin, dan parallax; konten tetap terbaca. Kontrol warna dan rotasi 3D tetap dapat dioperasikan dengan keyboard.

## Data dan batasan

Angka 1.200+ menunjukkan jangkauan ekosistem SiakadCloud/EdLink, bukan jumlah klien pribadi. Peningkatan response time 40% dan pengalaman 5 tahun mengikuti isi CV. Status pekerjaan/pendidikan “sekarang” adalah snapshot Februari 2026 dan perlu diperbarui ketika CV berubah.

Tidak ada backend atau formulir kontak palsu: kontak membuka aplikasi email, LinkedIn membuka profil sumber, dan CV mengunduh PDF yang disediakan. Tidak ditambahkan testimoni, sponsor, data balapan, metrik live, atau proyek fiktif. Bagian racing pada brief diadaptasi menjadi engineering, mentoring, domain pendidikan, dan perjalanan karier.

Three.js dimuat terpisah saat area lab mendekati viewport. Chunk 3D berukuran lebih besar daripada bundle utama; browser tanpa WebGL mendapat visual CSS 2D. Gambar dan font disajikan lokal, tanpa ketergantungan runtime pada CDN gambar/font.

## Publikasi

`.openai/hosting.json` mengonfigurasi build statis `dist/` pada Sites. Situs baru menggunakan akses privat. Source dapat dijalankan mandiri di hosting statis lain yang mendukung Vite.

## Interactive chapters

Mulai dari bagian About, pengalaman kini mencakup huruf yang bisa diacak/disusun kembali, respons huruf saat pointer lewat, kartu studi kasus bertumpuk di desktop, efek perspektif pointer, timeline yang digambar saat scroll, dan penutup dengan tipografi berlapis.

Lab memiliki tiga bentuk (knot/orb/torus), wireframe, mode expand, dan slider energi. Playground “Make it connect” dapat diselesaikan dengan drag, sentuhan, atau keyboard: pilih modul lalu pilih slot yang cocok. Playground adalah ilustrasi alur full-stack, bukan simulasi produksi atau metrik proyek.

Tombol mengambang **Motion: Calm** menonaktifkan animasi nonesensial. Preferensi reduced motion perangkat selalu dihormati. Animasi memakai GSAP context cleanup; 3D berhenti merender ketika tidak terlihat. Marquee tetap memiliki tombol jeda tersendiri.

Uji interaksi (memakai Google Chrome lokal):

```sh
npm run test:e2e
```

## Engineering arcade

Menu **Play** membuka tiga eksperimen dengan progress misi selama sesi halaman:

- **KRS War Room**: naikkan beban request, aktifkan Redis cache/database index, amati antrean, lalu jeda atau reset simulasi. Kapasitas dan beban adalah angka model edukatif, bukan benchmark produksi.
- **Debug Challenge**: tiga kasus batas SKS, isolasi cache mahasiswa, dan race condition kursi kelas. Setiap jawaban benar menjelaskan alasan perbaikannya. Kode berupa ilustrasi; tidak dieksekusi.
- **Build Your Campus**: hubungkan KRS, LMS, payments, dan PDDIKTI pada visual kampus konseptual.

**Gravity Skills** dapat ditarik/dilempar atau dilontarkan dengan Enter. Build architecture menyusun skill menurut lapisannya. Mode Calm menyajikan susunan statis, sedangkan tombol jeda membekukan simulasi fisika.

Di lab, tahan **Overdrive** dengan pointer, Space, atau Enter untuk meningkatkan energi dan membuka satelit. Efek berhenti saat dilepas, pointer dibatalkan, fokus berpindah, layar ditinggalkan, atau setelah tiga detik. Reduced motion menonaktifkan boost.

Tombol **Terminal** atau shortcut `~` membuka dialog lokal dengan `help`, `whoami`, `projects`, `play`, `stack`, `contact`, `sudo hire bayu`, `clear`, dan `exit`. Shortcut diabaikan saat mengetik. Riwayat menggunakan ↑/↓; Escape menutup dan mengembalikan fokus. Terminal tidak menjalankan shell, mengirim email otomatis, atau terhubung ke backend.

Loop eksperimen berhenti saat area tidak terlihat atau tab browser tidak aktif. Perubahan tinggi konten memperbarui ScrollTrigger dan Lenis. Tes browser mencakup misi, drag, batas fisika, timer/pause, terminal, keyboard, mode Calm, serta overflow pada viewport kecil.
