# Panduan Kustomisasi Website Undangan

Dokumen ini menjelaskan cara mengganti isi, aset visual, dan perilaku website undangan digital **Raka & Anindya** tanpa mengubah struktur utama aplikasi. Website menggunakan React + TypeScript + Vite dan halaman utama berada di `client/src/pages/Home.tsx`.

> Prinsip utama: ubah data dan aset melalui titik konfigurasi yang sudah tersedia. Hindari menyalin data pasangan ke banyak komponen agar isi undangan tetap konsisten.

## 1. Lokasi file penting

| Kebutuhan | File atau lokasi |
|---|---|
| Data pasangan, acara, rekening, dan musik | `client/src/pages/Home.tsx`, objek `CONFIG` |
| Teks cerita, label section, dan copy form | `client/src/pages/Home.tsx` |
| Foto hero, story, dan galeri | URL aset pada `Home.tsx` |
| Warna, font, layout, responsive, dan animasi | `client/src/index.css` |
| Judul browser dan metadata | `client/index.html` |
| Arah desain dan keputusan visual | `ideas.md` |

## 2. Mengganti data pasangan dan acara

Buka `client/src/pages/Home.tsx`, lalu cari objek `CONFIG` di bagian atas file. Ganti nilai di sebelah kanan setiap properti. Struktur konfigurasi saat ini adalah sebagai berikut.

```ts
const CONFIG = {
  couple: "Raka & Anindya",
  shortNames: "Raka · Anin",
  parents: "Putra pertama dari ...",
  dateLabel: "Sabtu, 24 Oktober 2026",
  eventDate: "2026-10-24T16:00:00+07:00",
  akadTime: "15.30 — 16.30 WIB",
  receptionTime: "18.30 — 21.00 WIB",
  venue: "Sasana Rasa, Bandung",
  address: "Jl. Ciumbuleuit No. 108, Bandung, Jawa Barat",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sasana+Rasa+Bandung",
  calendarUrl: "https://calendar.google.com/calendar/render?...",
  walletProvider: "GoPay",
  walletNumber: "0812 3456 7890",
  bank: "BCA",
  accountNumber: "1234567890",
  accountName: "Anindya Larasati",
  paymentLink: "https://contoh.link/raka-anin",
  ambientTrack: "",
};
```

`eventDate` harus menggunakan format ISO dengan zona waktu, misalnya `2026-12-12T16:00:00+07:00`. Nilai ini dipakai oleh countdown. `dateLabel`, `akadTime`, dan `receptionTime` adalah teks yang tampil kepada tamu sehingga dapat ditulis dalam format yang paling sesuai dengan undangan.

Setelah mengganti tanggal, perbarui juga `calendarUrl`. URL tersebut harus menunjuk ke Google Calendar dengan judul, tanggal mulai/selesai, deskripsi, lokasi, dan timezone yang benar. Jangan meninggalkan URL contoh ketika website sudah dipublikasikan.

## 3. Mengganti nama tamu pada URL

Nama tamu dibaca dari parameter URL `to`. Contoh penggunaan:

```text
https://undanganwb-jldrtwij.manus.space/?to=Keluarga%20Budi%20Santoso
```

Jika parameter tersebut tidak ada, cover menampilkan `Tamu undangan`. Nilainya dirapikan, dibatasi panjangnya, dan dirender sebagai teks biasa. Untuk membuat tautan undangan personal, gunakan spasi yang sudah dienkode menjadi `%20` atau biarkan browser melakukan encoding saat tautan dibuat.

## 4. Mengganti foto

Daftar foto galeri berada pada konstanta `gallery` di `Home.tsx`. Setiap item memiliki tiga properti: `src`, `alt`, dan `caption`.

```ts
{
  src: "URL-FOTO",
  alt: "Deskripsi foto untuk aksesibilitas",
  caption: "Judul singkat foto"
}
```

Gunakan enam foto yang berbeda. `alt` harus menjelaskan isi foto secara singkat, bukan mengulang nama file. Jangan memakai URL yang sama untuk dua item galeri. Item galeri menggunakan key unik berbasis indeks dan caption, sehingga caption sebaiknya juga berbeda.

Untuk aset lokal berukuran besar, simpan salinan kerja di luar source project, lalu upload melalui penyimpanan aset web dan gunakan URL permanen hasil upload pada `src`. Jangan menaruh foto, video, atau audio besar di `client/public` atau `client/src/assets` karena dapat memperlambat deployment.

Foto utama digunakan di tiga lokasi berikut:

| Area | Cari di `Home.tsx` | Rekomendasi gambar |
|---|---|---|
| Cover | class `cover-image` pada CSS | Landscape, gelap, dengan ruang negatif untuk teks |
| Hero | `hero-photo` | Landscape atau portrait editorial |
| Cerita | `story-photo` | Portrait detail atau momen intim |

Jika mengganti path hero atau story, pastikan path yang sama juga diperbarui pada aturan CSS cover jika diperlukan.

## 5. Mengganti emblem atau logo

Emblem botani digunakan pada cover dan header melalui URL:

```tsx
/manus-storage/emblem-botanical_02c68f81.png
```

Ganti semua kemunculan URL tersebut dengan URL emblem baru agar cover dan header tetap konsisten. Gunakan PNG transparan berbentuk simbol tanpa teks. Jika ingin mempertahankan tampilan emblem sebagai cap arsip, gunakan gambar dengan ruang kosong secukupnya di sekeliling simbol.

## 6. Mengganti warna, font, dan gaya visual

Semua token visual utama berada di baris `:root` pada `client/src/index.css`.

| Token | Fungsi |
|---|---|
| `--ink` | Latar gelap dan teks utama |
| `--ivory` | Latar terang utama |
| `--paper` | Latar section cerita dan RSVP |
| `--olive` | Aksen brand, CTA, dan emphasis |
| `--olive-dark` | Teks metadata dan label |
| `--display` | Font judul dan nama pasangan |
| `--body` | Font isi, navigasi, dan form |

Jika mengganti palet, periksa kontras pada cover, tombol, label, dan teks di atas foto. Pertahankan maksimal dua keluarga font agar identitas tetap terarah. Untuk perubahan besar seperti tema coastal atau art deco, perbarui juga `ideas.md` sehingga keputusan visual terdokumentasi.

## 7. Mengaktifkan musik latar

Properti `ambientTrack` saat ini kosong:

```ts
ambientTrack: "",
```

Isi dengan URL MP3 permanen, misalnya:

```ts
ambientTrack: "/manus-storage/nama-file.mp3",
```

Kontrol musik akan muncul otomatis ketika nilai tersebut tidak kosong. Pemutaran dimulai setelah tombol `Buka Undangan` ditekan, karena browser dapat menolak autoplay bersuara sebelum ada interaksi pengguna. Jika playback gagal, undangan tetap dapat digunakan dan kontrol musik tetap aman untuk dicoba kembali.

Gunakan musik instrumental yang memang Anda miliki hak penggunaannya. Atur volume default di elemen audio atau tambahkan `audioRef.current.volume = 0.25` saat inisialisasi jika ingin membatasi volume menjadi 25%.

## 8. RSVP dan buku tamu

Form RSVP memiliki field nama, status kehadiran, dan pesan. Data disimpan di `localStorage` dengan key `raka-anin-guestbook`, sehingga data hanya tersedia pada browser/perangkat yang sama. Tidak ada pesan awal yang dibuat-buat.

Untuk mengubah pilihan status, edit elemen `<select>` di section `rsvp`. Untuk mengubah teks feedback, cari state `submitted` dan elemen dengan class `success`.

Jika RSVP perlu tersimpan lintas perangkat, bagian penyimpanan lokal harus diganti dengan backend atau database. Saat melakukan perubahan tersebut, pertahankan validasi nama dan pesan, state loading, success, serta error. Jangan memasukkan testimonial, rating, atau pesan tamu contoh sebagai seed data.

## 9. Tanda kasih dan data pembayaran

Detail e-wallet dan rekening berasal dari properti berikut:

```ts
walletProvider
walletNumber
bank
accountNumber
accountName
paymentLink
```

Tombol salin menggunakan Clipboard API dan fallback lokal. Setelah mengganti nomor, uji tombol `Salin nomor` pada perangkat mobile dan desktop. QR pada versi saat ini adalah tampilan visual dekoratif; untuk QR pembayaran sungguhan, ganti `qr-pattern` dengan QR yang dibuat dari payload pembayaran final dan pastikan nominal/provider sesuai.

## 10. Mengubah copy undangan

Teks cerita, headline, label section, caption galeri, dan footer ditulis langsung pada JSX di `Home.tsx`. Saat mengganti copy, pertahankan:

1. Teks headline tetap singkat agar tidak pecah secara tidak terduga pada lebar 320–375 px.
2. Copy yang ditampilkan di atas foto harus memiliki overlay yang cukup gelap atau warna teks yang kontras.
3. Isi dari tamu pada guestbook tetap dirender sebagai teks biasa; jangan menggunakan `dangerouslySetInnerHTML`.
4. Hindari penggunaan kata filler dan pertahankan suara yang hangat, personal, serta spesifik.

## 11. Menjalankan website secara lokal

Dari root project, jalankan perintah berikut:

```bash
pnpm install
pnpm dev
```

Buka URL lokal yang ditampilkan oleh Vite. Untuk menguji nama tamu, tambahkan parameter seperti `?to=Keluarga%20Budi` pada URL.

Sebelum menyimpan perubahan sebagai versi baru, jalankan:

```bash
pnpm check
pnpm build
```

`pnpm check` memeriksa tipe TypeScript. `pnpm build` membuat production build. Perbaiki semua error sebelum checkpoint. Warning ukuran bundle dari Vite dapat ditinjau kemudian, tetapi error TypeScript atau build harus diselesaikan terlebih dahulu.

## 12. Checklist sebelum publikasi

| Pemeriksaan | Hasil yang diharapkan |
|---|---|
| Cover tanpa `?to=` | Menampilkan `Tamu undangan` |
| Cover dengan `?to=` | Nama tamu muncul aman dan tidak merusak layout |
| Tombol buka | Cover naik dan konten dapat digunakan |
| Countdown | Mengarah ke tanggal baru dan berhenti di nol setelah acara |
| Google Maps | Membuka tab baru dengan lokasi final |
| Google Calendar | Membuka event dengan waktu dan timezone final |
| Galeri | Enam gambar berbeda, key unik, lightbox berfungsi |
| RSVP kosong | Form tidak berhasil dikirim tanpa nama/pesan |
| RSVP berhasil | Pesan masuk ke guestbook tanpa reload |
| Tombol salin | Label berubah sementara menjadi `Tersalin` |
| Mobile 375 px | Tidak ada horizontal overflow atau elemen tertutup |
| Reduced motion | Konten tampil tanpa animasi non-esensial |

## 13. File yang sebaiknya tidak diubah

Jangan mengubah `server/` untuk kustomisasi visual biasa. Struktur route pada `App.tsx` juga tidak perlu diubah selama undangan tetap menggunakan satu halaman. Komponen shadcn/ui di `client/src/components/ui` hanya perlu diubah jika Anda menambahkan interaksi baru yang memang membutuhkan primitive tersebut.

## Referensi

[1]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams "MDN Web Docs — URLSearchParams"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API "MDN Web Docs — Clipboard API"
[3]: https://developers.google.com/calendar/api/guides/create-events "Google Calendar API — Create Events"
