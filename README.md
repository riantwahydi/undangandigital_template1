# Undangan Digital Pernikahan (invitation-pro)

Website undangan digital premium (static) siap deploy. Semua data bersifat placeholder.

## Struktur
- `index.html` — halaman utama
- `css/styles.css` — design system
- `js/config.js` — data & konfigurasi (edit di sini)
- `js/app.js` — logika interaksi
- `js/leaves.js` — efek dekorasi daun berguguran

## Cara Pakai
1. Buka folder di server lokal (disarankan) atau double-click `index.html`.
2. Edit data pada `js/config.js`:
   - Nama mempelai, orang tua
   - Tanggal pernikahan (ISO)
   - Lokasi & link Google Maps
   - Cerita, galeri, rekening

## Fitur
- Cover dengan transisi, musik dengan kontrol.
- Efek dekoratif daun & kelopak berguguran (otomatis nonaktif jika `prefers-reduced-motion` aktif).
- Countdown real-time, hero, mempelai, acara, timeline, galeri + lightbox, RSVP + ucapan, wedding gift.
- Navigasi desktop & bottom nav mobile, back-to-top, toast, copy nomor rekening.

## Backend RSVP (opsional)
Secara default data disimpan di localStorage (demo). Untuk menyimpan ke Supabase:

1. Buat tabel `rsvps` dengan kolom: name (text), attendance (text), guests (int), message (text), created_at (timestamptz).
2. Set RLS policy sesuai kebutuhan.
3. Pada `js/config.js`:
```js
backend: {
  type: "supabase",
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-KEY",
  table: "rsvps"
}
```
Pastikan CORS/RLS mengizinkan insert dari domain Anda.

## Aksesibilitas & Performa
- Menghormati `prefers-reduced-motion`.
- Lazy-loading gambar, metadata & Open Graph dasar.
- Kontras teks & ukuran tombol ramah sentuh.

## Catatan
- Semua nilai contoh ditandai placeholder; ganti sebelum publikasi.
- Informasi keuangan hanya masukkan data yang Anda miliki.
