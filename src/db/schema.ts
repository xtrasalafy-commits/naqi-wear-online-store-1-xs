import { pgTable, serial, text, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  email: text("email").notNull().unique(),
  nomorWa: text("nomor_wa"),
  alamatJson: json("alamat_json"),
  gender: text("gender").default("wanita"),
  tanggalLahir: text("tanggal_lahir"),
  role: text("role").notNull().default("customer"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  nama: text("nama").notNull(),
  slug: text("slug").notNull().unique(),
  gambarUrl: text("gambar_url"),
  urutan: integer("urutan").default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  nama: text("nama").notNull(),
  slug: text("slug").notNull().unique(),
  deskripsi: text("deskripsi").notNull(),
  bahan: text("bahan"),
  gender: text("gender").notNull().default("wanita"), // 'wanita', 'pria', 'anak', 'keluarga', 'semua'
  hargaDasar: integer("harga_dasar").notNull(),
  hargaDiskon: integer("harga_diskon").default(0),
  beratGram: integer("berat_gram").default(250),
  status: text("status").default("aktif"), // 'aktif', 'nonaktif'
  unggulan: boolean("unggulan").default(false),
  terlaris: boolean("terlaris").default(false),
  badgeSyari: json("badge_syari"), // e.g. ["Tidak Menerawang", "Wudhu Friendly", "Busui Friendly", "Panjang Syar'i"]
  createdAt: timestamp("created_at").defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sku: text("sku").notNull(),
  warna: text("warna").notNull(),
  ukuran: text("ukuran").notNull(), // S, M, L, XL, XXL, Jumbo, All Size
  harga: integer("harga").notNull(),
  stok: integer("stok").notNull().default(10),
  gambarUrl: text("gambar_url"),
  beratGram: integer("berat_gram").default(250),
  aktif: boolean("aktif").default(true),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  gambarUrl: text("gambar_url").notNull(),
  altText: text("alt_text"),
  urutan: integer("urutan").default(0),
  utama: boolean("utama").default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  nomorPesanan: text("nomor_pesanan").notNull().unique(),
  userId: integer("user_id"),
  snapshotAlamat: json("snapshot_alamat").notNull(),
  subtotal: integer("subtotal").notNull(),
  diskon: integer("diskon").default(0),
  ongkir: integer("ongkir").default(0),
  total: integer("total").notNull(),
  kurir: text("kurir").notNull(),
  layanan: text("layanan").notNull(),
  resi: text("resi"),
  statusPembayaran: text("status_pembayaran").notNull().default("menunggu_pembayaran"), // 'menunggu_pembayaran', 'dibayar', 'gagal'
  statusPesanan: text("status_pesanan").notNull().default("menunggu_bayar"), // 'menunggu_bayar', 'diproses', 'dikirim', 'selesai', 'retur', 'dibatalkan'
  catatan: text("catatan"),
  returAlasan: text("retur_alasan"),
  returFotoUrl: text("retur_foto_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  variantId: integer("variant_id"),
  snapshotNama: text("snapshot_nama").notNull(),
  snapshotSku: text("snapshot_sku"),
  snapshotVarian: text("snapshot_varian"),
  qty: integer("qty").notNull(),
  harga: integer("harga").notNull(),
  subtotal: integer("subtotal").notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  metode: text("metode").notNull(),
  idTransaksi: text("id_transaksi").notNull(),
  jumlah: integer("jumlah").notNull(),
  status: text("status").notNull().default("berhasil"),
  dibayarPada: timestamp("dibayar_pada").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  productId: integer("product_id").notNull(),
  orderId: integer("order_id"),
  namaPengulas: text("nama_pengulas").notNull().default("Hamba Allah"),
  rating: integer("rating").notNull(),
  judul: text("judul"),
  komentar: text("komentar").notNull(),
  gambarUrlJson: json("gambar_url_json"),
  terverifikasi: boolean("terverifikasi").default(true),
  status: text("status").default("disetujui"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  kode: text("kode").notNull().unique(),
  tipe: text("tipe").notNull().default("persen"), // 'persen', 'nominal'
  nilai: integer("nilai").notNull(),
  minimalOrder: integer("minimal_order").default(0),
  maksimalDiskon: integer("maksimal_diskon").default(0),
  kuota: integer("kuota").default(100),
  terpakai: integer("terpakai").default(0),
  mulai: text("mulai"),
  berakhir: text("berakhir"),
  aktif: boolean("aktif").default(true),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  gambarUrl: text("gambar_url").notNull(),
  tautan: text("tautan"),
  mulai: text("mulai"),
  berakhir: text("berakhir"),
  aktif: boolean("aktif").default(true),
  urutan: integer("urutan").default(0),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  tipe: text("tipe").notNull().default("info"),
  judul: text("judul").notNull(),
  pesan: text("pesan").notNull(),
  dibaca: boolean("dibaca").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  judul: text("judul").notNull(),
  slug: text("slug").notNull().unique(),
  kategori: text("kategori").notNull().default("Tips Fashion"),
  ringkasan: text("ringkasan").notNull(),
  konten: text("konten").notNull(),
  gambarUrl: text("gambar_url").notNull(),
  penulis: text("penulis").default("Tim NAQI WEAR"),
  createdAt: timestamp("created_at").defaultNow(),
});
