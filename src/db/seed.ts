import "dotenv/config";
import { basename } from "node:path";
import { db, pool } from "./index";
import {
  users,
  categories,
  products,
  productVariants,
  productImages,
  coupons,
  banners,
  reviews,
  articles,
  orders,
  orderItems,
  notifications
} from "./schema";

export async function seedDatabase() {
  console.log("Seeding NAQI WEAR database...");

  // 1. Users
  const insertedUsers = await db.insert(users).values([
    {
      nama: "Admin NAQI WEAR",
      email: "admin@naqiwear.id",
      nomorWa: "081234567890",
      alamatJson: { jalan: "Jl. Zamrud Syar'i No. 88", kota: "Bandung", provinsi: "Jawa Barat", kodePos: "40123" },
      gender: "wanita",
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    },
    {
      nama: "Aisyah Nurul",
      email: "aisyah@gmail.com",
      nomorWa: "082198765432",
      alamatJson: { jalan: "Jl. Mawar Mekar No. 12", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", kodePos: "12310" },
      gender: "wanita",
      role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    },
    {
      nama: "Ahmad Fauzi",
      email: "ahmad@gmail.com",
      nomorWa: "085712345678",
      alamatJson: { jalan: "Jl. Kebon Jeruk No. 45", kota: "Surabaya", provinsi: "Jawa Timur", kodePos: "60234" },
      gender: "pria",
      role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    }
  ]).returning();

  // 2. Categories
  const categoryData = [
    { nama: "Wanita", slug: "wanita", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80", urutan: 1 },
    { nama: "Pria", slug: "pria", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&auto=format&fit=crop&q=80", urutan: 2 },
    { nama: "Anak", slug: "anak", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&auto=format&fit=crop&q=80", urutan: 3 },
    { nama: "Couple & Keluarga", slug: "keluarga", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop&q=80", urutan: 4 },
    { nama: "Paket Promo", slug: "promo", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=80", urutan: 5 },
    { nama: "Hijab & Khimar", slug: "hijab", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&auto=format&fit=crop&q=80", urutan: 6 },
    { nama: "Mukena", slug: "mukena", parentId: null, gambarUrl: "https://images.unsplash.com/photo-1621252179027-94259f326357?w=500&auto=format&fit=crop&q=80", urutan: 7 },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  const catMap = Object.fromEntries(insertedCategories.map(c => [c.slug, c.id]));

  // 3. Products
  const productsData = [
    {
      categoryId: catMap["wanita"],
      nama: "Abaya Premium Silk Naqi",
      slug: "abaya-premium-silk-naqi",
      deskripsi: "Abaya mewah anggun berbahan Armani Silk Premium yang jatuh lembut di kulit, adem, dan tidak menerawang. Potongan A-line syar'i memberikan kenyamanan maksimal untuk acara formal maupun harian.",
      bahan: "Armani Silk Grade A",
      gender: "wanita",
      hargaDasar: 389000,
      hargaDiskon: 299000,
      beratGram: 450,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Tidak Menerawang", "Wudhu Friendly", "Busui Friendly", "Panjang Syar'i"],
    },
    {
      categoryId: catMap["wanita"],
      nama: "Gamis Syar'i Layer Ceruty",
      slug: "gamis-syari-layer-ceruty",
      deskripsi: "Gamis berdesain layer bertumpuk cantik dengan furing katun adem. Dilengkapi resleting depan busui friendly dan karet elastis di bagian pergelangan tangan wudhu friendly.",
      bahan: "Ceruty Baby Doll + Full Furing Katun",
      gender: "wanita",
      hargaDasar: 320000,
      hargaDiskon: 245000,
      beratGram: 500,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Tidak Menerawang", "Wudhu Friendly", "Busui Friendly"],
    },
    {
      categoryId: catMap["wanita"],
      nama: "Tunik Linen Oversize Syar'i",
      slug: "tunik-linen-oversize-syari",
      deskripsi: "Tunik santai kekinian dengan bahan Linen Pure Soft yang menyerap keringat. Potongan longgar syar'i hingga paha bawah, sangat cocok untuk kuliah, kerja, maupun jalan-jalan.",
      bahan: "Linen Pure Soft Premium",
      gender: "wanita",
      hargaDasar: 210000,
      hargaDiskon: 169000,
      beratGram: 350,
      status: "aktif",
      unggulan: false,
      terlaris: true,
      badgeSyari: ["Wudhu Friendly", "Adem & Nyaman"],
    },
    {
      categoryId: catMap["hijab"],
      nama: "Pashmina Instan Flowy Premium",
      slug: "pashmina-instan-flowy-premium",
      deskripsi: "Pashmina praktis tanpa pentul! Sudah dilengkapi inner ciput menyatu, mudah dibentuk, langsung cantik rapi dalam 5 detik. Anti geser dan menutup dada.",
      bahan: "Chiffon Italian Premium + Rayon Inner",
      gender: "wanita",
      hargaDasar: 95000,
      hargaDiskon: 69000,
      beratGram: 150,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Langsung Rapi", "Menutup Dada", "Anti Geser"],
    },
    {
      categoryId: catMap["hijab"],
      nama: "Hijab Segiempat Voal Premium Voile",
      slug: "hijab-segiempat-voal-premium",
      deskripsi: "Jilbab segiempat ukuran 120x120 cm. Tegak di dahi, bahan voal ultra soft yang ringan, tidak pekak di telinga, dan pinggiran laser cut mewah.",
      bahan: "Voal Ultrafine Premium",
      gender: "wanita",
      hargaDasar: 85000,
      hargaDiskon: 55000,
      beratGram: 120,
      status: "aktif",
      unggulan: false,
      terlaris: true,
      badgeSyari: ["Tegak Dahi", "Laser Cut", "Tidak Pekak"],
    },
    {
      categoryId: catMap["hijab"],
      nama: "Khimar Syar'i Softpad Pet",
      slug: "khimar-syari-softpad-pet",
      deskripsi: "Khimar double layer syar'i menutup dada dan punggung secara sempurna. Softpad antem (anti tembem) membingkai wajah jadi tirus.",
      bahan: "Ceruty Premium Babydoll",
      gender: "wanita",
      hargaDasar: 165000,
      hargaDiskon: 129000,
      beratGram: 250,
      status: "aktif",
      unggulan: false,
      terlaris: false,
      badgeSyari: ["Syar'i Jumbo", "Softpad Antem", "Tidak Menerawang"],
    },
    {
      categoryId: catMap["mukena"],
      nama: "Mukena Dewasa Silk Travel Pouch 2 in 1",
      slug: "mukena-dewasa-silk-travel-2in1",
      deskripsi: "Mukena traveling mewah super ringkas dengan pouch cantik. Resleting dagu 2in1 bisa dipakai model biasa atau ponco hijab tanpa merusak tatanan jilbab.",
      bahan: "Velvet Silk Touch Anti Kusut",
      gender: "wanita",
      hargaDasar: 275000,
      hargaDiskon: 199000,
      beratGram: 400,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["2 in 1 Dagu", "Bonus Pouch", "Ultra Ringan"],
    },
    {
      categoryId: catMap["pria"],
      nama: "Baju Koko Kurta Modern Katun Toyobo",
      slug: "baju-koko-kurta-katun-toyobo",
      deskripsi: "Baju Koko Kurta Pria dengan potongan pakistani modern. Bahan Katun Toyobo Jepang yang super adem, serat halus, kancing tersembunyi, dan kantong samping.",
      bahan: "Katun Toyobo Deluxe Original",
      gender: "pria",
      hargaDasar: 220000,
      hargaDiskon: 175000,
      beratGram: 300,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Bahan Adem", "Kancing Tersembunyi", "Saku Dalam"],
    },
    {
      categoryId: catMap["pria"],
      nama: "Gamis Pria Jubah Saudi Exclusive",
      slug: "gamis-pria-jubah-saudi-exclusive",
      deskripsi: "Jubah gamis pria gaya Saudi Minimalis. Potongan elegan dengan kerah tegak, bahan jatuh tidak kaku, sangat nyaman untuk ibadah harian maupun acara keagamaan.",
      bahan: "Poly-Cotton Spun Premium",
      gender: "pria",
      hargaDasar: 290000,
      hargaDiskon: 225000,
      beratGram: 450,
      status: "aktif",
      unggulan: true,
      terlaris: false,
      badgeSyari: ["Gaya Saudi", "Bahan Jatuh", "Saku Dada & Samping"],
    },
    {
      categoryId: catMap["pria"],
      nama: "Sarung Tenun Premium Motif Elegant",
      slug: "sarung-tenun-premium-motif-elegant",
      deskripsi: "Sarung tenun halus dengan kerapatan benang tinggi, tidak luntur, bahan dingin, dan pilihan warna islami earthy yang sangat berkelas.",
      bahan: "Tenun Mercerized Cotton",
      gender: "pria",
      hargaDasar: 150000,
      hargaDiskon: 119000,
      beratGram: 400,
      status: "aktif",
      unggulan: false,
      terlaris: true,
      badgeSyari: ["Tenun Halus", "Warna Tidak Luntur"],
    },
    {
      categoryId: catMap["anak"],
      nama: "Gamis Anak Perempuan Set Hijab Flower",
      slug: "gamis-anak-perempuan-set-hijab",
      deskripsi: "Setelan Gamis Anak Perempuan lengkap dengan jilbab instant-nya! Bahan spandek katun yang melar, sangat lembut di kulit sensitif anak, dan adem seharian.",
      bahan: "Katun Combbed Soft Premium + Spandex",
      gender: "anak",
      hargaDasar: 180000,
      hargaDiskon: 139000,
      beratGram: 300,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Termasuk Hijab", "Lembut di Kulit", "Pilihan Warna Ceria"],
    },
    {
      categoryId: catMap["anak"],
      nama: "Baju Koko Anak Set Celana & Peci",
      slug: "baju-koko-anak-set-celana-peci",
      deskripsi: "Paket lengkap Baju Koko Anak + Celana Panjang + Peci matching. Memudahkan buah hati siap beribadah ke masjid dengan gaya ceria dan sopan.",
      bahan: "Katun Micro Breathable",
      gender: "anak",
      hargaDasar: 170000,
      hargaDiskon: 129000,
      beratGram: 350,
      status: "aktif",
      unggulan: false,
      terlaris: true,
      badgeSyari: ["Set 3 in 1", "Pinggang Karet", "Super Adem"],
    },
    {
      categoryId: catMap["keluarga"],
      nama: "Sarimbit Keluarga Lebaran Harmony Series",
      slug: "sarimbit-keluarga-lebaran-harmony-series",
      deskripsi: "Paket Busana Muslim Seragam Keluarga Terlengkap! Terdiri dari Gamis Ibu, Koko Ayah, Gamis Anak Perempuan, dan Koko Anak Pria dengan warna & motif senada bernuansa Zamrud & Emas.",
      bahan: "Jacquard Luxury + Katun Toyobo",
      gender: "keluarga",
      hargaDasar: 850000,
      hargaDiskon: 699000,
      beratGram: 1800,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Seragam 4 Anggota", "Eksklusif Lebaran", "Bisa Tambah Ukuran"],
    },
    {
      categoryId: catMap["promo"],
      nama: "Paket Bundling Hijab Voal 3 Warna Cantik",
      slug: "paket-bundling-hijab-voal-3-warna",
      deskripsi: "Dapatkan 3 jilbab segiempat voal premium warna favorit pilihan (Zamrud, Nude Cream, Emerald Brown) dengan harga jauh lebih hemat!",
      bahan: "Voal Ultrafine Soft",
      gender: "wanita",
      hargaDasar: 255000,
      hargaDiskon: 139000,
      beratGram: 360,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Hemat 45%", "Isi 3 Hijab", "Free Box Kado"],
    },
    {
      categoryId: catMap["promo"],
      nama: "Paket Ibadah Koko + Sarung + Peci Pria",
      slug: "paket-ibadah-koko-sarung-peci-pria",
      deskripsi: "Paket Ibadah Pria Lengkap: 1 Baju Koko Kurta + 1 Sarung Tenun Premium + 1 Peci Rajut Syar'i. Sangat pas untuk kado suami, ayah, atau hantaran nikah.",
      bahan: "Katun Toyobo + Tenun Mercerized",
      gender: "pria",
      hargaDasar: 420000,
      hargaDiskon: 299000,
      beratGram: 850,
      status: "aktif",
      unggulan: true,
      terlaris: true,
      badgeSyari: ["Paket 3-in-1 Lengkap", "Siap Pakai Ibadah", "Bonus Tas Sajadah"],
    }
  ];

  const insertedProducts = await db.insert(products).values(productsData).returning();

  // 4. Product Images & Variants
  const imageMap: Record<string, string[]> = {
    "abaya-premium-silk-naqi": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
    ],
    "gamis-syari-layer-ceruty": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80"
    ],
    "tunik-linen-oversize-syari": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
    ],
    "pashmina-instan-flowy-premium": [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
    ],
    "hijab-segiempat-voal-premium": [
      "https://images.unsplash.com/photo-1621252179027-94259f326357?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80"
    ],
    "khimar-syari-softpad-pet": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
    ],
    "mukena-dewasa-silk-travel-2in1": [
      "https://images.unsplash.com/photo-1621252179027-94259f326357?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
    ],
    "baju-koko-kurta-katun-toyobo": [
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80"
    ],
    "gamis-pria-jubah-saudi-exclusive": [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80"
    ],
    "sarung-tenun-premium-motif-elegant": [
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80"
    ],
    "gamis-anak-perempuan-set-hijab": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80"
    ],
    "baju-koko-anak-set-celana-peci": [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&auto=format&fit=crop&q=80"
    ],
    "sarimbit-keluarga-lebaran-harmony-series": [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80"
    ],
    "paket-bundling-hijab-voal-3-warna": [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80"
    ],
    "paket-ibadah-koko-sarung-peci-pria": [
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80"
    ]
  };

  const colors = ["Hijau Zamrud", "Emas Khaki", "Krem Murni", "Coklat Mocca", "Hitam Jetblack"];
  const sizes = ["S", "M", "L", "XL", "XXL", "Jumbo"];

  for (const prod of insertedProducts) {
    // Images
    const imgs = imageMap[prod.slug] || ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"];
    for (let idx = 0; idx < imgs.length; idx++) {
      await db.insert(productImages).values({
        productId: prod.id,
        gambarUrl: imgs[idx],
        altText: `${prod.nama} foto ${idx + 1}`,
        urutan: idx + 1,
        utama: idx === 0,
      });
    }

    // Variants
    for (const color of colors.slice(0, 3)) {
      for (const size of sizes.slice(0, 4)) {
        await db.insert(productVariants).values({
          productId: prod.id,
          sku: `NQ-${prod.id}-${color.substring(0,2).toUpperCase()}-${size}`,
          warna: color,
          ukuran: size,
          harga: prod.hargaDiskon || prod.hargaDasar,
          stok: Math.floor(Math.random() * 20) + 5,
          gambarUrl: imgs[0],
          beratGram: prod.beratGram || 250,
          aktif: true,
        });
      }
    }
  }

  // 5. Coupons
  await db.insert(coupons).values([
    {
      kode: "NAQISELAMA10",
      tipe: "persen",
      nilai: 10,
      minimalOrder: 100000,
      maksimalDiskon: 30000,
      kuota: 200,
      terpakai: 15,
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
    },
    {
      kode: "BERKAHRAMADHAN",
      tipe: "nominal",
      nilai: 50000,
      minimalOrder: 300000,
      maksimalDiskon: 50000,
      kuota: 100,
      terpakai: 28,
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
    },
    {
      kode: "ONGKIRSYARI",
      tipe: "nominal",
      nilai: 15000,
      minimalOrder: 150000,
      maksimalDiskon: 15000,
      kuota: 500,
      terpakai: 88,
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
    }
  ]);

  // 6. Banners
  await db.insert(banners).values([
    {
      judul: "Koleksi Terbaru Syar'i & Anggun Lebaran",
      gambarUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop&q=80",
      tautan: "/katalog?kategori=wanita",
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
      urutan: 1,
    },
    {
      judul: "Sarimbit Keluarga Harmoni Ramadhan",
      gambarUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&auto=format&fit=crop&q=80",
      tautan: "/katalog?kategori=keluarga",
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
      urutan: 2,
    },
    {
      judul: "Paket Promo Hemat Berkah Syar'i",
      gambarUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
      tautan: "/promo",
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
      urutan: 3,
    }
  ]);

  // 7. Reviews
  await db.insert(reviews).values([
    {
      userId: insertedUsers[1].id,
      productId: insertedProducts[0].id,
      namaPengulas: "Aisyah Nurul",
      rating: 5,
      judul: "Bahannya Super Jatuh dan Anggun!",
      komentar: "Masya Allah abaya ini bagus sekali! Bahannya adem, halus di kulit, dan tidak menerawang sama sekali saat dipakai outdoor. Jahitannya rapi khas toko mewah.",
      gambarUrlJson: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80"],
      terverifikasi: true,
      status: "disetujui",
    },
    {
      userId: insertedUsers[2].id,
      productId: insertedProducts[7].id,
      namaPengulas: "Ahmad Fauzi",
      rating: 5,
      judul: "Baju Koko Ter-adem Yang Pernah Saya Beli",
      komentar: "Sangat recommended! Kain toyobo-nya adem banget buat sholat Jumat dan tarawih. Ukuran pas banget, bahannya tebal tapi dingin.",
      gambarUrlJson: [],
      terverifikasi: true,
      status: "disetujui",
    },
    {
      userId: insertedUsers[1].id,
      productId: insertedProducts[3].id,
      namaPengulas: "Ukhti Rahma",
      rating: 5,
      judul: "Pashmina Praktis Anti Ribet",
      komentar: "Subhanallah suka banget pashmina instan ini! Gak perlu pusing pake jarum bentul lagi, ciputnya lembut gak bikin sakit telinga.",
      gambarUrlJson: [],
      terverifikasi: true,
      status: "disetujui",
    }
  ]);

  // 8. Articles
  await db.insert(articles).values([
    {
      judul: "Panduan Memilih Hijab yang Nyaman & Tidak Menerawang",
      slug: "panduan-memilih-hijab-nyaman-syari",
      kategori: "Tips Fashion",
      ringkasan: "Simak 5 poin penting dalam memilih bahan hijab yang adem, tegak di dahi, dan tidak menerawang sesuai kaidah syar'i.",
      konten: `Memilih hijab tidak hanya soal estetika, namun juga kenyamanan dan pemenuhan kriteria syar'i. Berikut panduan praktis dari NAQI WEAR:

1. Perhatikan Kerapatan Serat Kain: Bahan seperti Voal Ultrafine dan Ceruty Baby Doll memiliki kerapatan benang yang pas sehingga tidak menerawang.
2. Fitur Antem (Anti Tembem): Pilih khimar atau pashmina dengan pad lembut agar membingkai pipi dengan rapi.
3. Sirkulasi Udara Baik: Pastikan bahan seperti katun atau rayon menyerap keringat dengan baik untuk aktivitas seharian.
4. Ukuran Syar'i Menutup Dada: Pastikan panjang jilbab memadai menutup dada dan bahu dengan sempurna.`,
      gambarUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80",
      penulis: "Tim Syar'i NAQI WEAR",
    },
    {
      judul: "Tips Memilih Ukuran Gamis Agar Pas dan Bebas Gerak",
      slug: "tips-memilih-ukuran-gamis-pas",
      kategori: "Panduan Ukuran",
      ringkasan: "Jangan salah pilih size! Ini dia panduan mengukur lingkar dada, panjang badan, dan lingkar ketiak sebelum beli gamis online.",
      konten: `Beli gamis secara online sangat mudah bila Anda mengetahui cara mengukur badan dengan tepat.

- Lingkar Dada (LD): Ukur melingkar di bagian dada paling lebar. Tambahkan 4-6 cm untuk kelonggaran syar'i.
- Panjang Gamis (PG): Ukur dari bahu tertinggi hingga tumit kaki.
- Lingkar Lengan: Pastikan ada fitur wudhu friendly (karet elastis atau manset kancing) agar mudah digulung saat berwudhu.`,
      gambarUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      penulis: "Tim Syar'i NAQI WEAR",
    },
    {
      judul: "Inspirasi Sarimbit Keluarga Harmoni untuk Hari Raya",
      slug: "inspirasi-sarimbit-keluarga-hari-raya",
      kategori: "Inspirasi Gaya",
      ringkasan: "Perpaduan warna Hijau Zamrud dan Emas Murni yang bikin foto keluarga di Hari Raya terlihat anggun dan kompak.",
      konten: `Sarimbit keluarga adalah cara indah merayakan momen kebersamaan di hari yang fitri.

Memilih perpaduan warna earthy seperti Hijau Zamrud (#1B4332) dipadukan aksen Emas Muda (#D4AF37) memberikan kesan islami yang tenang, mewah, namun tetap rendah hati.`,
      gambarUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80",
      penulis: "Desainer NAQI WEAR",
    }
  ]);

  // 9. Sample Orders
  const order1 = await db.insert(orders).values({
    nomorPesanan: "NQ-20250501-001",
    userId: insertedUsers[1].id,
    snapshotAlamat: {
      nama: "Aisyah Nurul",
      nomorWa: "082198765432",
      jalan: "Jl. Mawar Mekar No. 12",
      kota: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
      kodePos: "12310"
    },
    subtotal: 299000,
    diskon: 30000,
    ongkir: 15000,
    total: 284000,
    kurir: "SiCepat REG",
    layanan: "Reguler (1-2 hari)",
    resi: "TKP123456789NQ",
    statusPembayaran: "dibayar",
    statusPesanan: "dikirim",
    catatan: "Tolong bungkus rapi ya kak untuk kado.",
  }).returning();

  await db.insert(orderItems).values({
    orderId: order1[0].id,
    productId: insertedProducts[0].id,
    snapshotNama: insertedProducts[0].nama,
    snapshotSku: "NQ-1-HIJAU-M",
    snapshotVarian: "Hijau Zamrud / M",
    qty: 1,
    harga: 299000,
    subtotal: 299000,
  });

  console.log("Database successfully seeded!");
}

if (basename(process.argv[1] ?? "") === "seed.ts") {
  seedDatabase()
    .catch((error) => {
      console.error("Seed error:", error);
      process.exitCode = 1;
    })
    .finally(() => {
      void pool.end();
    });
}
