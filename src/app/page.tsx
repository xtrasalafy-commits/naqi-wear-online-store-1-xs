"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Star,
  Shirt,
  Users,
  Smile,
  Truck,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import ImageLoader from "@/components/ImageLoader";

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        // Best sellers
        const resBest = await fetch("/api/products?bestseller=true&limit=4");
        const jsonBest = await resBest.json();
        if (jsonBest.success) setBestSellers(jsonBest.data);

        // New arrivals
        const resNew = await fetch("/api/products?sort=terbaru&limit=4");
        const jsonNew = await resNew.json();
        if (jsonNew.success) setNewArrivals(jsonNew.data);

        // Articles
        const resArt = await fetch("/api/articles");
        const jsonArt = await resArt.json();
        if (jsonArt.success) setArticles(jsonArt.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const popularCategoryIcons = [
    { label: "Hijab & Khimar", slug: "hijab", icon: "🧕", count: "120+ Model" },
    { label: "Gamis & Abaya", slug: "wanita", icon: "👗", count: "85+ Model" },
    { label: "Mukena Silk", slug: "mukena", icon: "✨", count: "40+ Model" },
    { label: "Baju Koko & Jubah", slug: "pria", icon: "👔", count: "60+ Model" },
    { label: "Busana Anak", slug: "anak", icon: "👶", count: "45+ Model" },
    { label: "Sarimbit Keluarga", slug: "keluarga", icon: "👨‍👩‍👧‍👦", count: "Paket Hemat" },
  ];

  const testimonials = [
    {
      nama: "Ibu Hajjah Mariam",
      kota: "Bandung",
      foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
      bintang: 5,
      ulasan: "Masya Allah, pesanan abaya dan sarimbit keluarga sampai tepat waktu. Bahannya dingin, tebal tapi tidak gerah saat dipakai pengajian.",
      produk: "Abaya Silk & Sarimbit Harmony",
    },
    {
      nama: "Ustadz Hilman",
      kota: "Surakarta",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      bintang: 5,
      ulasan: "Baju koko kurta Toyobo dari NAQI WEAR jahitan rapi sekali. Kancing tersembunyi elegan dan saku dalam sangat membantu saat sholat.",
      produk: "Baju Koko Kurta Toyobo",
    },
    {
      nama: "Keluarga dr. Faisal",
      kota: "Surabaya",
      foto: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300",
      bintang: 5,
      ulasan: "Suka banget belanja di sini! Tidak perlu pusing mikirin ukuran karena CS WhatsApp bantu ukur secara mendalam dan ramah.",
      produk: "Paket Sarimbit Lebaran",
    }
  ];

  const faqs = [
    {
      q: "Apakah bahan pakaian di NAQI WEAR dijamin tidak menerawang?",
      a: "Insya Allah 100% dijamin. Semua produk NAQI WEAR menggunakan bahan serat rapat pilihan seperti Armani Silk, Toyobo Deluxe, dan Ceruty Furing Katun yang teruji syar'i dan tidak menerawang saat digunakan."
    },
    {
      q: "Bagaimana jika ukuran baju yang dipesan ternyata kebesaran atau kekecilan?",
      a: "Tenang saja! Kami menyediakan Garansi Retur & Tukar Ukuran Gratis dalam waktu 7 hari setelah barang diterima. Anda cukup menghubungi CS WhatsApp kami."
    },
    {
      q: "Berapa lama estimasi pengiriman pesanan?",
      a: "Untuk wilayah Jabodetabek dan Jawa Barat 1-2 hari kerja. Wilayah Jawa Tengah/Timur & Bali 2-3 hari kerja. Luar Pulau Jawa 3-5 hari kerja menggunakan JNE, SiCepat, atau GoSend."
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "Kami menerima QRIS (semua e-wallet), Transfer Virtual Account Bank (BCA, Mandiri, BRI, BNI), Kartu Kredit, dan layanan Bayar di Tempat (COD)."
    }
  ];

  return (
    <div className="space-y-12">
      {/* HERO BANNER SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#081C15] text-white p-6 sm:p-10 lg:p-12 shadow-syari-lg border border-[#D4AF37]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#081C15]/80 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-extrabold border border-[#D4AF37]/40 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
            KOLEKSI SYAR&apos;I TERBARU 2025
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FDF6E3] tracking-tight leading-tight">
            Tampil Syar&apos;i, Nyaman, & Elegan <span className="text-[#D4AF37]">Setiap Hari</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light">
            Busana muslim premium untuk Wanita, Pria, Anak, dan Sarimbit Keluarga. 
            Bahan lembut adem, wudhu friendly, dan <strong className="text-[#D4AF37] font-bold">100% tidak menerawang</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
            <Link
              href="/katalog"
              className="bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-black text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              Belanja Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/katalog?kategori=keluarga"
              className="bg-white/10 hover:bg-white/20 text-[#FDF6E3] font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl border border-[#D4AF37]/50 flex items-center justify-center gap-2 transition-all"
            >
              Lihat Sarimbit Keluarga
            </Link>
          </div>

          {/* Guarantees Badges */}
          <div className="pt-4 grid grid-cols-3 gap-2 text-[11px] text-amber-100 border-t border-emerald-800/80">
            <div className="flex items-center gap-1.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Garansi Pas Ukuran</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Bahan Tidak Gerah</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Bisa Bayar COD</span>
            </div>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/40">
            <ImageLoader
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800"
              alt="Model Busana NAQI WEAR"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-transparent to-transparent opacity-60" />
            
            {/* Float Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-stone-800 shadow-xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1B4332]">Abaya Premium Silk Naqi</p>
                <p className="text-xs text-[#D4AF37] font-extrabold">Rp 299.000 <span className="line-through text-stone-400 font-normal">Rp 389.000</span></p>
              </div>
              <span className="bg-[#1B4332] text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Terlaris
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES HORIZONTAL ICONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1B4332]">Kategori Populer Pilihan</h2>
            <p className="text-xs sm:text-sm text-stone-500">Pilih kategori pavorit untuk belanja cepat tanpa ribet</p>
          </div>
          <Link href="/katalog" className="text-xs font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {popularCategoryIcons.map((cat) => (
            <Link
              key={cat.slug}
              href={`/katalog?kategori=${cat.slug}`}
              className="group bg-white p-4 rounded-2xl border border-amber-100 shadow-syari hover:shadow-syari-lg hover:border-[#D4AF37] transition-all text-center flex flex-col items-center justify-center space-y-2 hover:-translate-y-1"
            >
              <span className="text-3xl p-2.5 rounded-2xl bg-amber-50 group-hover:bg-[#1B4332] transition-colors">
                {cat.icon}
              </span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-[#1B4332]">
                  {cat.label}
                </h3>
                <p className="text-[10px] text-stone-400 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#D4AF37] text-[#1B4332] rounded-xl font-bold">⭐</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1B4332]">Produk Terlaris (Best Seller)</h2>
              <p className="text-xs sm:text-sm text-stone-500">Paling banyak dibeli & disukai ukhti se-Indonesia</p>
            </div>
          </div>
          <Link href="/katalog?sort=terlaris" className="text-xs font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* MID PROMO BANNER */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-3xl p-6 sm:p-10 text-white shadow-xl border-2 border-[#D4AF37] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <span className="bg-[#D4AF37] text-[#1B4332] text-xs font-black px-3 py-1 rounded-full uppercase">
            Promo Paket Hemat Lebaran
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#FDF6E3]">
            Diskon Spesial Sarimbit Keluarga Harmoni
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 max-w-lg">
            Gunakan kode voucher <strong className="bg-[#081C15] text-[#D4AF37] px-2 py-0.5 rounded font-mono text-sm border border-[#D4AF37]">BERKAHRAMADHAN</strong> saat checkout untuk potongan langsung Rp 50.000!
          </p>
        </div>
        <Link
          href="/promo"
          className="bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-black px-6 py-3 rounded-2xl shadow-lg shrink-0 transition-transform active:scale-95"
        >
          Klaim Voucher Sekarang
        </Link>
      </section>

      {/* NEW ARRIVALS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#1B4332] text-[#D4AF37] rounded-xl font-bold">✨</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1B4332]">Koleksi Terbaru Syar&apos;i</h2>
              <p className="text-xs sm:text-sm text-stone-500">Desain kekinian paling hangat di toko kami</p>
            </div>
          </div>
          <Link href="/katalog?sort=terbaru" className="text-xs font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="bg-white rounded-3xl p-8 border border-amber-100 shadow-syari space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-[#1B4332]">Mengapa Memilih NAQI WEAR?</h2>
          <p className="text-xs text-stone-500">
            Diciptakan khusus agar Anda belanja cepat, nyaman, dan tenang sesuai kaidah syar&apos;i.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border border-amber-100">
            <div className="w-12 h-12 bg-[#1B4332] text-[#D4AF37] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Bahan Berkualitas</h3>
            <p className="text-[11px] text-stone-500">Armani Silk, Katun Toyobo, dan Voal Ultrafine adem</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border border-amber-100">
            <div className="w-12 h-12 bg-[#1B4332] text-[#D4AF37] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Ukuran S - XXL</h3>
            <p className="text-[11px] text-stone-500">Tersedia size chart lengkap hingga ukuran Jumbo</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border border-amber-100">
            <div className="w-12 h-12 bg-[#1B4332] text-[#D4AF37] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Tidak Menerawang</h3>
            <p className="text-[11px] text-stone-500">Kerapatan kain tinggi, dilapisi furing katun lembut</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border border-amber-100">
            <div className="w-12 h-12 bg-[#1B4332] text-[#D4AF37] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Pengiriman Aman</h3>
            <p className="text-[11px] text-stone-500">Dilengkapi resi cepat JNE, SiCepat, dan GoSend</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 space-y-2 border border-amber-100">
            <div className="w-12 h-12 bg-[#1B4332] text-[#D4AF37] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B4332]">Pembayaran Mudah</h3>
            <p className="text-[11px] text-stone-500">QRIS, VA Bank, E-Wallet, hingga Bayar COD</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-[#1B4332]">Kata Pelanggan NAQI WEAR</h2>
          <p className="text-xs text-stone-500">Testimoni jujur dari ukhti dan ikhwan yang sudah berbelanja</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.bintang }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  &quot;{t.ulasan}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
                  <img src={t.foto} alt={t.nama} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1B4332]">{t.nama}</h4>
                  <p className="text-[10px] text-stone-400">{t.kota} • Purchased {t.produk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ISLAMIC ARTICLES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1B4332]">Artikel & Inspirasi Syar&apos;i</h2>
            <p className="text-xs sm:text-sm text-stone-500">Panduan busana, tips padu padan, dan inspirasi sarimbit</p>
          </div>
          <Link href="/artikel" className="text-xs font-bold text-[#1B4332] hover:text-[#D4AF37] flex items-center gap-1">
            Lihat Artikel <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/artikel/${art.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-syari hover:shadow-syari-lg transition-all flex flex-col"
            >
              <div className="aspect-16/9 overflow-hidden bg-amber-50 relative">
                <ImageLoader src={art.gambarUrl} alt={art.judul} className="w-full h-full zoom-on-hover" />
                <span className="absolute top-3 left-3 bg-[#1B4332] text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {art.kategori}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-800 group-hover:text-[#1B4332] line-clamp-2 leading-snug">
                    {art.judul}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed">
                    {art.ringkasan}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#D4AF37] group-hover:underline inline-flex items-center gap-1 pt-2">
                  Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-syari space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-[#1B4332] font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> FAQ Pembeli Awam
          </div>
          <h2 className="text-2xl font-black text-[#1B4332]">Pertanyaan Sering Ditanyakan</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden transition-colors">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 bg-amber-50/40 hover:bg-amber-50 font-bold text-sm text-[#1B4332] flex items-center justify-between gap-2"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? "rotate-180 text-[#D4AF37]" : "text-stone-400"}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs text-stone-600 leading-relaxed border-t border-amber-100 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
