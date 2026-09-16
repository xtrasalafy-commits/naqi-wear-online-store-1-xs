# NAQI WEAR — Toko Online Fashion Muslim Syar'i & Anggun

Web App Toko Online Pakaian Muslim Wanita, Pria, Anak, dan Keluarga (Sarimbit) bernuansa Islami elegan minimalis, menggunakan bahasa Indonesia santun dan jelas 100%.

## 🌟 Fitur Utama
- **100% Syar'i & Ramah Pengguna**: Font besar, navigasi ringkas, badge "Tidak Menerawang", "Wudhu Friendly", "Busui Friendly".
- **Katalog Lengkap**: Wanita (Abaya, Gamis, Tunik, Hijab, Pashmina, Khimar, Mukena, Cadar, Ciput, Kaos Kaki), Pria (Koko, Jubah Saudi, Sarung, Sorban, Peci), Anak, Sarimbit Keluarga, & Paket Promo.
- **Keranjang & Checkout**: Estimasi ongkir otomatis, input kode voucher promo, pilihan pembayaran (QRIS, VA Bank, E-Wallet, COD).
- **Akun & Pesanan**: Pelacakan status visual (Kuning=Menunggu Bayar, Biru=Diproses, Ungu=Dikirim, Hijau=Selesai, Merah=Retur) & Form "Ajukan Retur".
- **Dashboard Admin**: Omset 7 hari, kelola produk, manajemen pesanan & resi, serta hub sinkronisasi Google Sheets & Drive.

---

## 🛠️ Langkah Integrasi Google Sheets & Google Drive

1. **Buat Google Spreadsheet**:
   - Buat file Google Spreadsheet baru bernama **`NAQI_WEARDATA`**.
   - Buat sheet-tab terpisah: `Users`, `Categories`, `Products`, `ProductVariants`, `ProductImages`, `Orders`, `OrderItems`, `Payments`, `Reviews`, `Wishlists`, `Coupons`, `Banners`, `Notifications`.

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
   - Masukkan URL Web App ke file konfigurasi `.env` (`NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`).

---

## 🚀 Cara Menjalankan Proyek

```bash
# 1. Install dependencies
npm install

# 2. Push database schema ke PostgreSQL
npx drizzle-kit push

# 3. Jalankan server pengembang
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.
Portal Admin berada di `/admin`.
