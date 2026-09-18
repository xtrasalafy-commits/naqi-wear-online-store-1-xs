# NAQI WEAR — Toko Online Fashion Muslim Syar'i & Anggun

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Lisensi MIT](https://img.shields.io/badge/Lisensi-MIT-green)

> **Open Source oleh MZF — 2026** · Gratis, bebas iklan, dan bebas dipelajari.

Web App Toko Online Pakaian Muslim Wanita, Pria, Anak, dan Keluarga (Sarimbit) bernuansa Islami
elegan minimalis, dengan bahasa Indonesia yang santun dan jelas 100%.

---

## Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Floating Widget Trakteer](#-floating-widget-trakteer)
3. [Download Source Code](#-download-source-code-lengkap)
4. [Teknologi](#-teknologi)
5. [Struktur Proyek](#-struktur-proyek)
6. [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)
7. [Environment Variable](#-environment-variable)
8. [Endpoint API](#-endpoint-api)
9. [Integrasi Google Sheets & Google Drive](#-integrasi-google-sheets--google-drive)
10. [Deployment](#-deployment)
11. [Kustomisasi](#-kustomisasi)
12. [Lisensi & Kredit](#-lisensi--kredit)

---

## 🌟 Fitur Utama

- **100% Syar'i & Ramah Pengguna**: font besar, navigasi ringkas, badge "Tidak Menerawang",
  "Wudhu Friendly", dan "Busui Friendly".
- **Katalog Lengkap**: Wanita (Abaya, Gamis, Tunik, Hijab, Pashmina, Khimar, Mukena, Cadar, Ciput,
  Kaos Kaki), Pria (Koko, Jubah Saudi, Sarung, Sorban, Peci), Anak, Sarimbit Keluarga, & Paket Promo.
- **Keranjang & Checkout**: estimasi ongkir otomatis, input kode voucher promo, dan pilihan
  pembayaran (QRIS, VA Bank, E-Wallet, COD).
- **Akun & Pesanan**: pelacakan status visual (Kuning=Menunggu Bayar, Biru=Diproses, Ungu=Dikirim,
  Hijau=Selesai, Merah=Retur) & form "Ajukan Retur".
- **Dashboard Admin**: omset 7 hari, kelola produk, manajemen pesanan & resi, serta hub sinkronisasi
  Google Sheets & Google Drive (`/admin/google-sync`).
- **Floating Widget Trakteer**: dukung biaya server langsung dari dalam web app (lihat bagian
  berikutnya).
- **Tombol Download Source Code**: pengunjung dapat mengunduh seluruh kode web app ini dalam
  satu berkas `.zip`.

---

## ☕ Floating Widget Trakteer

Widget mengapung di **sudut kanan bawah layar** pada semua halaman. Tulisan yang tampil:

> *"Web app ini gratis & bebas iklan. Traktir kopi untuk bantu biaya server?"*

**Alur pemakaian (tanpa berpindah halaman):**

1. Pengguna menekan tombol widget di sudut kanan bawah.
2. Panel terbuka **di dalam web app** dan menampilkan pilihan nominal cepat:
   `Rp 6.000`, `Rp 12.000`, `Rp 18.000`, `Rp 24.000`, `Rp 30.000` (kelipatan harga satuan).
3. Tersedia kolom **nominal lain** — nilainya wajib kelipatan harga satuan (mis. `36.000`,
   `60.000`), bila tidak sesuai akan muncul notifikasi.
4. **QR Code otomatis dibuat ulang** setiap kali nominal berubah. QR dibuat secara lokal di browser
   memakai pustaka `qrcode` (tidak ada permintaan ke server, tidak ada data pembayaran yang
   dikirim ke web app ini).
5. Pengguna dapat memindai QR tersebut dengan kamera ponsel atau aplikasi e-wallet
   (QRIS, GoPay, OVO, DANA, ShopeePay), menyimpan gambar QR, menyalin link, atau membuka halaman
   Trakteer di tab baru.
6. Panel juga memuat tombol **Download Source Code** dan atribusi **Open Source oleh MZF — 2026**.

**Detail teknis:**

- Bawaannya menuju halaman Trakteer `https://trakteer.id/perpus_opera`.
- QR berisi `https://trakteer.id/perpus_opera/tip?quantity=<jumlah unit>`, di mana
  `jumlah unit = nominal ÷ harga satuan`. Parameter `quantity` dipakai Trakteer untuk mengisi
  jumlah unit pada formulir dukungan, sehingga nominal yang dipilih mengikuti di halaman Trakteer.
- Widget dapat ditutup dengan tombol **X** atau tombol **Esc**.
- Seluruh konfigurasi berada di `src/lib/trakteer.ts` dan bisa dioverride lewat `.env`.
---

## 📦 Download Source Code Lengkap

Web app ini menyediakan tombol unduh source code langsung dari dalam aplikasi:

- **Di panel widget Trakteer** → tombol `Download Source Code`.
- **Di footer** (bagian "Gratis, Bebas Iklan, dan Open Source") → tombol
  `Download Source Code (.zip)`.

**Cara kerja:**

1. Tombol memanggil endpoint `GET /api/source-code`.
2. Server membungkus seluruh berkas proyek menjadi arsip
   `naqi-wear-open-source-mzf-2026.zip` memakai `jszip`.
3. Arsip otomatis dikecualikan dari folder/berkas berikut supaya ringan dan aman:
   `node_modules`, `.next`, `.git`, `.kilo`, `.vercel`, `dist`, `build`, `coverage`,
   dan semua berkas rahasia `.env*` (serta berkas > 4 MB).
4. Di dalam arsip juga disertakan berkas `OPEN_SOURCE_MZF_2026.txt` berisi keterangan arsip dan
   atribusi **Open Source oleh MZF - 2026**.
5. Bila server tidak dapat membaca berkas proyek (mis. lingkungan serverless tanpa berkas sumber),
   tombol otomatis mengarahkan pengguna ke repositori GitHub proyek sebagai alternatif.

Setelah arsip diekstrak, jalankan:

```bash
npm install
cp .env.example .env   # sesuaikan isinya
npx drizzle-kit push
npm run dev
```

> Agar berkas sumber ikut terbawa pada deploy serverless, konfigurasi
> `outputFileTracingIncludes` untuk `/api/source-code` sudah ditambahkan di `next.config.ts`.

---

## 🛠 Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript 5 (strict) |
| UI | React 19 + Tailwind CSS 4 + lucide-react + framer-motion |
| Database | PostgreSQL + Drizzle ORM |
| QR Code | `qrcode` (dibuat di sisi klien) |
| Arsip source code | `jszip` |
| Bantuan | `clsx` + `tailwind-merge` |

---

## 📁 Struktur Proyek

```
naqi-wear-online-store-1-xs/
├─ src/
│  ├─ app/                     # Halaman & Route API (App Router)
│  │  ├─ api/                  # Endpoint REST (produk, pesanan, source-code, dll.)
│  │  ├─ admin/                # Portal admin (dashboard, produk, pesanan, google-sync)
│  │  ├─ katalog/ produk/ keranjang/ checkout/ promo/ artikel/ akun/ wishlist/ …
│  │  ├─ layout.tsx            # Root layout (Header, Footer, BottomNav, widget)
│  │  └─ globals.css           # Tema warna zamrud & emas
│  ├─ components/              # Header, Footer, ProductCard, TrakteerWidget, dll.
│  ├─ context/                 # AuthContext & CartContext
│  ├─ db/                     # Koneksi, skema, seed Drizzle
│  └─ lib/trakteer.ts          # Konfigurasi widget Trakteer & atribusi MZF
├─ drizzle/                    # Migrasi SQL (drizzle-kit)
├─ next.config.ts              # Konfigurasi Next.js + outputFileTracingIncludes
├─ vercel.json                 # Konfigurasi deploy Vercel
└─ .env.example                # Contoh environment variable
```

---

## 🚀 Cara Menjalankan Proyek

**Prasyarat:** Node.js `>= 20.9.0 < 27` dan PostgreSQL.

```bash
# 1. Install dependencies
npm install

# 2. Siapkan environment variable
cp .env.example .env
# isi DATABASE_URL (dan variabel opsional lain)

# 3. Push skema database ke PostgreSQL
npx drizzle-kit push

# 4. (Opsional) Isi data contoh
npm run db:seed

# 5. Jalankan server pengembang
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Portal Admin berada di `/admin`.

**Perintah lain:**

| Perintah | Keterangan |
| --- | --- |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build produksi |
| `npm run lint` | Jalankan ESLint |
| `npm run typecheck` | Pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run db:generate` | Membuat berkas migrasi Drizzle |
| `npm run db:push` | Menerapkan skema ke database |
| `npm run db:studio` | Membuka Drizzle Studio |
| `npm run db:seed` | Mengisi data contoh |
---

## 🔐 Environment Variable

Salin `.env.example` menjadi `.env` lalu sesuaikan:

| Variabel | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | Koneksi PostgreSQL (termasuk `?sslmode=require`) |
| `NEXT_PUBLIC_SITE_URL` | — | `http://localhost:3000` | URL publik web app |
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | — | — | URL Web App Google Apps Script untuk sinkronisasi |
| `NEXT_PUBLIC_TRAKTEER_URL` | — | `https://trakteer.id/perpus_opera` | Halaman Trakteer tujuan widget |
| `NEXT_PUBLIC_TRAKTEER_UNIT_PRICE` | — | `6000` | Harga 1 unit traktiran (nominal widget adalah kelipatannya) |
| `NEXT_PUBLIC_TRAKTEER_UNIT_LABEL` | — | `Kopi` | Nama unit traktiran yang tampil di widget |
| `NEXT_PUBLIC_GITHUB_REPO` | — | repo proyek ini | Tautan cadangan tombol download source code |

---

## 🔌 Endpoint API

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/api/health` | Pemeriksaan status server & database |
| `GET` | `/api/init` | Inisialisasi awal database |
| `GET` | `/api/products` · `/api/products/[slug]` | Daftar & detail produk |
| `GET` | `/api/categories` | Daftar kategori |
| `GET` | `/api/articles` · `/api/articles/[slug]` | Artikel & detail artikel |
| `GET` | `/api/banners` | Banner promosi |
| `GET` | `/api/coupons` · `/api/coupons/validate` | Daftar & validasi voucher |
| `GET/POST` | `/api/orders` · `/api/orders/[id]` | Pesanan pelanggan |
| `GET/POST` | `/api/reviews` | Ulasan produk |
| `GET/POST` | `/api/wishlists` | Daftar keinginan |
| `GET` | `/api/admin/stats` | Statistik dashboard admin |
| `GET` | `/api/admin/google-sync` | Kode Apps Script & data cadangan JSON |
| `GET` | `/api/source-code` | **Unduh arsip `.zip` source code lengkap** (Open Source oleh MZF - 2026) |

---

## 🛠️ Langkah Integrasi Google Sheets & Google Drive

1. **Buat Google Spreadsheet**:
   - Buat file Google Spreadsheet baru bernama **`NAQI_WEARDATA`**.
   - Buat sheet-tab terpisah: `Users`, `Categories`, `Products`, `ProductVariants`,
     `ProductImages`, `Orders`, `OrderItems`, `Payments`, `Reviews`, `Wishlists`, `Coupons`,
     `Banners`, `Notifications`.

2. **Buat Folder Google Drive**:
   - Buat folder Google Drive bernama **`NAQI_WEAR_ASSETS`** (untuk menyimpan foto produk & banner).
   - Buat folder Google Drive bernama **`NAQI_WEAR_DB`** (untuk menyimpan file JSON cadangan data).

3. **Deploy Google Apps Script (`Code.gs`)**:
   - Di Spreadsheet, buka menu **Extensions** > **Apps Script**.
   - Salin kode script dari halaman Admin Portal **`/admin/google-sync`** ke file `Code.gs`.
   - Klik **Deploy** > **New deployment** > Pilih **Web App**.
   - Atur *Who has access* ke **Anyone**.
   - Klik **Deploy** dan salin URL Web App yang dihasilkan.

4. **Konfigurasi Frontend**:
   - Masukkan URL Web App ke file `.env`
     (`NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`).
---

## 🚀 Deployment

Konfigurasi siap pakai sudah tersedia di `vercel.json` (framework Next.js, region `sin1`,
`maxDuration` 30 detik untuk seluruh route di `src/app/api/**`, dan header keamanan dasar).

1. Import repositori ini di [Vercel](https://vercel.com/new).
2. Tambahkan environment variable `DATABASE_URL` (wajib) dan variabel opsional lain
   (Trakteer, GitHub, Apps Script) pada menu **Settings → Environment Variables**.
3. Deploy. Setelah selesai, jalankan `npx drizzle-kit push` dengan `DATABASE_URL` produksi
   bila skema belum ada di server database.

Untuk hosting mandiri (VPS/Docker):

```bash
npm ci
npm run build
npm run start   # port 3000
```

---

## 🎨 Kustomisasi

**1. Mengubah nominal traktiran / halaman Trakteer** — cukup ubah `.env`:

```env
NEXT_PUBLIC_TRAKTEER_URL=https://trakteer.id/nama-kreator
NEXT_PUBLIC_TRAKTEER_UNIT_PRICE=6000
NEXT_PUBLIC_TRAKTEER_UNIT_LABEL=Kopi
```

Pilihan nominal di widget dihitung otomatis: `1×` sampai `5×` harga satuan
(`Rp 6.000` s.d. `Rp 30.000` bila harga satuan `6000`). Untuk mengubah daftar pengali,
sunting `TRAKTEER_NOMINAL_MULTIPLIERS` di `src/lib/trakteer.ts`.

**2. Mengubah teks widget** — sunting konstanta `TRAKTEER_MESSAGE` di `src/lib/trakteer.ts`:

```ts
export const TRAKTEER_MESSAGE =
  "Web app ini gratis & bebas iklan. Traktir kopi untuk bantu biaya server?";
```

**3. Posisi widget** — kelas Tailwind `bottom-36 md:bottom-24 right-4` pada root
`src/components/TrakteerWidget.tsx`. Widget sengaja diposisikan di atas tombol WhatsApp
(`FloatingWhatsApp`) dan di atas navigasi bawah versi mobile (`BottomNav`) agar tidak bertumpuk.

**4. Berkas yang ikut diunduh** — daftar pengecualian ada di `src/app/api/source-code/route.ts`
(`IGNORED_DIRS`, `IGNORED_FILES`, `MAX_FILE_BYTES`); daftar berkas yang disertakan saat
build/tracing ada di `next.config.ts` (`outputFileTracingIncludes`).

---

## 📄 Lisensi & Kredit

Proyek ini dirilis sebagai **Open Source** dengan lisensi **MIT** — bebas digunakan, dipelajari,
diubah, dan dibagikan, termasuk untuk keperluan komersial, dengan tetap menyertakan atribusi.

**Open Source oleh MZF - 2026**

- Widget Trakteer: [trakteer.id/perpus_opera](https://trakteer.id/perpus_opera)
- Repositori: [github.com/xtrasalafy-commits/naqi-wear-online-store-1-xs](https://github.com/xtrasalafy-commits/naqi-wear-online-store-1-xs)

Bila web app ini bermanfaat, dukungan Anda dipakai untuk biaya hosting, domain, dan
pengembangan fitur baru. Jazakumullahu khairan. 🤍

---

## 🤝 Kontribusi

1. Fork repositori ini.
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`.
3. Pastikan `npm run lint` dan `npm run typecheck` lolos.
4. Kirim Pull Request dengan deskripsi perubahan yang jelas.

---

<p align="center">
  Dibuat dengan ❤️ untuk kemudahan belanja syar'i — <strong>Open Source oleh MZF - 2026</strong>
</p>
