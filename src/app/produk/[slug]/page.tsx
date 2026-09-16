"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Check,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Ruler,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import ImageLoader from "@/components/ImageLoader";
import SizeChartModal from "@/components/SizeChartModal";
import ReviewModal from "@/components/ReviewModal";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, showToast } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "ulasan">("deskripsi");

  // Shipping estimator state
  const [postalCode, setPostalCode] = useState("");
  const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);

  // Modals
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [resolvedParams.slug]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${resolvedParams.slug}`);
      const json = await res.json();
      if (json.success) {
        setProduct(json.data);
        if (json.data.images && json.data.images.length > 0) {
          setSelectedImage(json.data.images[0].gambarUrl);
        } else {
          setSelectedImage(json.data.gambarUtama || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800");
        }

        if (json.data.variants && json.data.variants.length > 0) {
          setSelectedColor(json.data.variants[0].warna);
          setSelectedSize(json.data.variants[0].ukuran);
        } else {
          setSelectedColor("Hijau Zamrud");
          setSelectedSize("M");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#1B4332] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="font-bold text-[#1B4332] text-sm">Memuat Busana Syar'i NAQI WEAR...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-syari space-y-4">
        <span className="text-5xl">🔍</span>
        <h2 className="text-xl font-bold text-[#1B4332]">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-stone-500">Maaf, pakaian yang Anda cari tidak tersedia atau telah habis.</p>
        <Link href="/katalog" className="inline-block bg-[#1B4332] text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isDiscounted = product.hargaDiskon && product.hargaDiskon < product.hargaDasar;
  const finalPrice = isDiscounted ? product.hargaDiskon : product.hargaDasar;
  const discountPercent = isDiscounted
    ? Math.round(((product.hargaDasar - product.hargaDiskon) / product.hargaDasar) * 100)
    : 0;

  const isLiked = isInWishlist(product.id);

  // Colors & Sizes from variants
  const availableColors = Array.from(new Set(product.variants?.map((v: any) => v.warna) || ["Hijau Zamrud", "Emas Khaki", "Krem Murni"]));
  const availableSizes = Array.from(new Set(product.variants?.map((v: any) => v.ukuran) || ["S", "M", "L", "XL", "XXL"]));

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        nama: product.nama,
        slug: product.slug,
        warna: selectedColor || "Hijau Zamrud",
        ukuran: selectedSize || "M",
        harga: finalPrice,
        gambarUrl: selectedImage || product.gambarUtama,
        bahan: product.bahan,
      },
      qty
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/keranjang");
  };

  const calculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setShippingEstimate(`Estimasi tiba: 1-2 hari kerja (JNE / SiCepat REG - Rp 15.000) ke ${postalCode}`);
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link href="/" className="hover:text-[#1B4332]">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href="/katalog" className="hover:text-[#1B4332]">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href={`/katalog?kategori=${product.categorySlug}`} className="hover:text-[#1B4332]">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-[#1B4332] font-bold line-clamp-1">{product.nama}</span>
      </nav>

      {/* Main 2 Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-syari">
        {/* LEFT COLUMN: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-3/4 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/20 shadow-md">
            <ImageLoader
              src={selectedImage}
              alt={product.nama}
              className="w-full h-full object-cover zoom-on-hover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-[#1B4332] text-xs font-black px-3 py-1 rounded-full shadow">
                Hemat {discountPercent}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 text-stone-600 hover:text-red-500 shadow-md"
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.gambarUrl)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.gambarUrl
                      ? "border-[#1B4332] ring-2 ring-[#D4AF37]"
                      : "border-stone-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.gambarUrl} alt={img.altText || ""} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-emerald-50 text-[#1B4332] text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 mb-2">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] leading-tight">
              {product.nama}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.avgRating || 4.9}</span>
              </div>
              <span className="text-stone-300">•</span>
              <button
                onClick={() => setActiveTab("ulasan")}
                className="text-stone-500 underline hover:text-[#1B4332]"
              >
                {product.reviewCount || 12} Ulasan Pelanggan
              </button>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-semibold">Stok Ready Siap Kirim</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#1B4332]">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
              {isDiscounted && (
                <span className="ml-3 text-sm text-stone-400 line-through">
                  Rp {product.hargaDasar.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="bg-[#1B4332] text-[#D4AF37] font-bold text-xs px-3 py-1 rounded-lg">
                Hemat Rp {(product.hargaDasar - finalPrice).toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Syar'i Badges */}
          {product.badgeSyari && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.badgeSyari.map((badge: string, i: number) => (
                <span
                  key={i}
                  className="bg-emerald-50 text-[#1B4332] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Pilih Warna: <span className="text-[#1B4332]">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color: any) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedColor === color
                      ? "bg-[#1B4332] text-[#FDF6E3] border-[#1B4332] shadow-md"
                      : "bg-stone-50 border-stone-300 text-stone-700 hover:border-[#1B4332]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-stone-700">
                Pilih Ukuran: <span className="text-[#1B4332]">{selectedSize}</span>
              </label>
              <button
                onClick={() => setSizeChartOpen(true)}
                className="text-[#1B4332] font-bold underline flex items-center gap-1 hover:text-[#D4AF37]"
              >
                <Ruler className="w-3.5 h-3.5" /> Lihat Size Chart
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size: any) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-[#D4AF37] text-[#1B4332] border-[#D4AF37] shadow-md"
                      : "bg-stone-50 border-stone-300 text-stone-700 hover:border-[#1B4332]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <label className="text-xs font-bold text-stone-700">Jumlah:</label>
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2.5 hover:bg-stone-200 text-stone-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-sm text-[#1B4332]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-2.5 hover:bg-stone-200 text-stone-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FDF6E3] font-extrabold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <ShoppingCart className="w-5 h-5 text-[#D4AF37]" /> + Keranjang Belanja
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-black py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              ⚡ Beli Sekarang
            </button>
          </div>

          {/* Shipping Cost Estimator */}
          <div className="pt-4 border-t border-amber-100">
            <form onSubmit={calculateShipping} className="flex gap-2">
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Masukkan Kode Pos / Kota Anda..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
              <button
                type="submit"
                className="bg-stone-800 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-stone-900"
              >
                Cek Ongkir
              </button>
            </form>
            {shippingEstimate && (
              <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                {shippingEstimate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section: Deskripsi & Ulasan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-syari space-y-6">
        <div className="flex border-b border-amber-100 gap-6">
          <button
            onClick={() => setActiveTab("deskripsi")}
            className={`pb-3 font-extrabold text-sm border-b-2 transition-colors ${
              activeTab === "deskripsi"
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Deskripsi & Bahan
          </button>
          <button
            onClick={() => setActiveTab("ulasan")}
            className={`pb-3 font-extrabold text-sm border-b-2 transition-colors ${
              activeTab === "ulasan"
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Ulasan Pelanggan ({product.reviewCount || 12})
          </button>
        </div>

        {activeTab === "deskripsi" ? (
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>{product.deskripsi}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-100">
              <div className="p-4 bg-amber-50/50 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#1B4332]">Detail Spesifikasi:</h4>
                <p>• <strong>Bahan Utama:</strong> {product.bahan}</p>
                <p>• <strong>Berat Pakaian:</strong> {product.beratGram || 250} gram</p>
                <p>• <strong>Fitur Syar'i:</strong> Wudhu Friendly, Busui Friendly, Saku Dalam</p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#1B4332]">Petunjuk Perawatan:</h4>
                <p>• Cuci dengan suhu air hangat suam-suam kuku</p>
                <p>• Hindari pemutih pakaian keras</p>
                <p>• Setrika pada suhu sedang agar bahan tidak mengkilap</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-[#1B4332]">{product.avgRating || 4.9}</span>
                <div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-500">Berdasarkan ulasan terverifikasi</p>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="bg-[#1B4332] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#2D6A4F]"
              >
                + Tulis Ulasan Anda
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 border border-stone-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1B4332]">{rev.namaPengulas}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Terverifikasi
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <h5 className="font-bold text-xs text-stone-800">{rev.judul}</h5>
                    <p className="text-xs text-stone-600">{rev.komentar}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 text-center py-4">
                  Belum ada ulasan untuk varian ini. Jadilah yang pertama memberikan ulasan!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-[#1B4332]">Produk Terkait Yang Mungkin Anda Sukai</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        category={product.categoryName}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={product.id}
        productName={product.nama}
        onSuccess={fetchProductDetail}
      />
    </div>
  );
}
