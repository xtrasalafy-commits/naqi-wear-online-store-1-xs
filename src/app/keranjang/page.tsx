"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    totalDiscount,
    grandTotal,
    shippingCost,
    appliedCoupon,
    applyCoupon,
    showToast,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponInputLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponInputLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode: couponInput.trim(), subtotal }),
      });
      const json = await res.json();
      if (json.success) {
        applyCoupon(json.data);
        setCouponInput("");
      } else {
        setCouponError(json.error || "Voucher tidak valid");
      }
    } catch (err) {
      setCouponError("Terjadi kesalahan jaringan.");
    } finally {
      setCouponInputLoading(false);
    }
  };

  const addOnItems = [
    {
      id: 991,
      nama: "Ciput Inner Rayon Premium Anti Geser",
      harga: 25000,
      gambarUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300",
    },
    {
      id: 992,
      nama: "Kaos Kaki Wudhu Soft Spandex",
      harga: 18000,
      gambarUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300",
    }
  ];

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-syari space-y-6 max-w-xl mx-auto my-8">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-4xl">
          🛒
        </div>
        <h2 className="text-2xl font-black text-[#1B4332]">Keranjang Belanja Anda Masih Kosong</h2>
        <p className="text-xs text-stone-500">
          Yuk lihat-lihat koleksi gamis, hijab, mukena, dan baju koko syar&apos;i terbaru di NAQI WEAR!
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 bg-[#1B4332] text-[#FDF6E3] font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-[#2D6A4F]"
        >
          Belanja Sekarang <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#D4AF37]" /> Keranjang Belanja
          </h1>
          <p className="text-xs text-stone-500">
            Periksa item pesanan syar&apos;i Anda sebelum lanjut ke langkah pembayaran.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-bold"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.productId}-${item.warna}-${item.ukuran}-${idx}`}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-syari flex flex-col sm:flex-row items-center gap-4 relative"
            >
              <div className="w-24 h-28 rounded-2xl overflow-hidden bg-amber-50 shrink-0 border border-amber-200">
                <img src={item.gambarUrl} alt={item.nama} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                <h3 className="font-bold text-sm sm:text-base text-[#1B4332] line-clamp-1">
                  {item.nama}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Varian: <span className="text-stone-800 font-semibold">{item.warna}</span> | Ukuran: <span className="text-stone-800 font-semibold">{item.ukuran}</span>
                </p>
                <p className="text-xs text-emerald-800 font-semibold">✓ Ready Stock</p>

                <div className="pt-2 flex items-center justify-between sm:justify-start gap-4">
                  <span className="font-black text-sm sm:text-base text-[#1B4332]">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </span>

                  {/* Qty +/- Controls */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                    <button
                      onClick={() => updateQty(item.productId, item.warna, item.ukuran, item.qty - 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.warna, item.ukuran, item.qty + 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtotal & Delete */}
              <div className="sm:text-right shrink-0 flex sm:flex-col items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <span className="font-black text-base text-[#1B4332]">
                  Rp {(item.harga * item.qty).toLocaleString("id-ID")}
                </span>
                <button
                  onClick={() => removeFromCart(item.productId, item.warna, item.ukuran)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Hapus Produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Upsell Cross-sell Box */}
          <div className="bg-emerald-50/60 rounded-3xl p-5 border border-emerald-200 space-y-3">
            <h4 className="font-bold text-xs text-[#1B4332] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Lengkapi Penampilan Syar&apos;i Anda:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addOnItems.map((addOn) => (
                <div key={addOn.id} className="bg-white p-3 rounded-2xl flex items-center gap-3 border border-amber-100 shadow-sm">
                  <img src={addOn.gambarUrl} alt={addOn.nama} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-xs text-stone-800 line-clamp-1">{addOn.nama}</p>
                    <p className="text-xs text-[#1B4332] font-black">Rp {addOn.harga.toLocaleString("id-ID")}</p>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`✓ Added ${addOn.nama} ke keranjang!`);
                    }}
                    className="bg-[#1B4332] text-[#D4AF37] font-bold text-xs px-2.5 py-1 rounded-lg hover:bg-[#2D6A4F]"
                  >
                    + Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-syari space-y-5 sticky top-24">
            <h3 className="font-black text-lg text-[#1B4332] pb-3 border-b border-amber-100">
              Ringkasan Pesanan
            </h3>

            {/* Voucher Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">Punya Kode Voucher?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Contoh: NAQISELAMA10"
                  className="flex-1 uppercase font-mono px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="bg-[#1B4332] text-[#D4AF37] font-bold px-4 py-2 text-xs rounded-xl hover:bg-[#2D6A4F]"
                >
                  Gunakan
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
              {appliedCoupon && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span>✓ Voucher {appliedCoupon.kode} Aktif</span>
                  <button onClick={() => applyCoupon(null)} className="text-red-600 hover:underline text-[10px]">
                    Lepas
                  </button>
                </div>
              )}
            </form>

            {/* Breakdown Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-amber-100">
              <div className="flex justify-between">
                <span>Subtotal Produk:</span>
                <span className="font-bold text-stone-800">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimasi Ongkos Kirim:</span>
                <span className="font-bold text-stone-800">Rp {shippingCost.toLocaleString("id-ID")}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskon Voucher:</span>
                  <span>- Rp {totalDiscount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-[#1B4332] pt-3 border-t border-amber-100">
                <span>Total Pembayaran:</span>
                <span className="text-lg text-[#1B4332]">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-base transition-transform active:scale-98"
            >
              Lanjut ke Checkout <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Transaksi Aman & Bergaransi 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
