"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, MapPin, Truck, CreditCard, ChevronRight, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    totalDiscount,
    grandTotal,
    shippingCost,
    setShippingCost,
    shippingAddress,
    setShippingAddress,
    clearCart,
  } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courier, setCourier] = useState("SiCepat REG");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Form State
  const [formData, setFormData] = useState({
    nama: shippingAddress.nama || "Aisyah Nurul",
    nomorWa: shippingAddress.nomorWa || "082198765432",
    jalan: shippingAddress.jalan || "Jl. Mawar Mekar No. 12",
    kota: shippingAddress.kota || "Jakarta Selatan",
    provinsi: shippingAddress.provinsi || "DKI Jakarta",
    kodePos: shippingAddress.kodePos || "12310",
  });

  const handleCourierChange = (selectedCourierName: string, cost: number) => {
    setCourier(selectedCourierName);
    setShippingCost(cost);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 2,
          snapshotAlamat: formData,
          items: cart,
          subtotal,
          diskon: totalDiscount,
          ongkir: shippingCost,
          total: grandTotal,
          kurir: courier,
          layanan: "Reguler Fast",
          metodePembayaran: paymentMethod,
          catatan,
        }),
      });

      const json = await res.json();
      if (json.success) {
        clearCart();
        router.push(`/checkout/sukses/${json.data.id}`);
      } else {
        alert(json.error || "Gagal membuat pesanan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Steps Indicator */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332]">
          Checkout Pesanan Syar'i
        </h1>
        <p className="text-xs text-stone-500">Lengkapi 3 langkah mudah berikut tanpa perlu ribet</p>

        {/* Steps Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 pt-4 max-w-2xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
              step === 1 ? "bg-[#1B4332] text-[#D4AF37]" : "bg-stone-200 text-stone-600"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            Alamat Pengiriman
          </button>
          <ChevronRight className="w-4 h-4 text-stone-300" />

          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
              step === 2 ? "bg-[#1B4332] text-[#D4AF37]" : "bg-stone-200 text-stone-600"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            Kurir & Bayar
          </button>
          <ChevronRight className="w-4 h-4 text-stone-300" />

          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
              step === 3 ? "bg-[#1B4332] text-[#D4AF37]" : "bg-stone-200 text-stone-600"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            Konfirmasi Pesanan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN STEPS CONTAINER */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-syari">
          {/* STEP 1: ALAMAT PENGIRIMAN */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-[#1B4332] text-lg flex items-center gap-2 pb-3 border-b border-amber-100">
                <MapPin className="w-5 h-5 text-[#D4AF37]" /> Langkah 1: Alamat Penerima
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap Penerima:</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Aktif:</label>
                  <input
                    type="text"
                    value={formData.nomorWa}
                    onChange={(e) => setFormData({ ...formData, nomorWa: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Lengkap (Jalan, RT/RW, No. Rumah):</label>
                  <textarea
                    rows={2}
                    value={formData.jalan}
                    onChange={(e) => setFormData({ ...formData, jalan: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kota / Kabupaten:</label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Provinsi:</label>
                  <input
                    type="text"
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kode Pos:</label>
                  <input
                    type="text"
                    value={formData.kodePos}
                    onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setShippingAddress(formData);
                  setStep(2);
                }}
                className="mt-4 bg-[#1B4332] text-[#D4AF37] font-bold px-6 py-3 rounded-2xl w-full sm:w-auto"
              >
                Simpan & Lanjut ke Kurir →
              </button>
            </div>
          )}

          {/* STEP 2: KURIR & PEMBAYARAN */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Courier Selection */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-[#1B4332] text-lg flex items-center gap-2 pb-2 border-b border-amber-100">
                  <Truck className="w-5 h-5 text-[#D4AF37]" /> Pilih Jasa Pengiriman
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { name: "SiCepat REG", estimasi: "1-2 Hari Kerja", cost: 15000 },
                    { name: "JNE REG", estimasi: "2-3 Hari Kerja", cost: 18000 },
                    { name: "GoSend Instant", estimasi: "Tiba Hari Ini", cost: 30000 },
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleCourierChange(c.name, c.cost)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        courier === c.name
                          ? "bg-emerald-50 border-[#1B4332] font-bold ring-2 ring-[#D4AF37]"
                          : "border-stone-200 hover:bg-amber-50/50"
                      }`}
                    >
                      <p className="font-extrabold text-[#1B4332]">{c.name}</p>
                      <p className="text-[10px] text-stone-500">{c.estimasi}</p>
                      <p className="text-xs text-[#D4AF37] font-black mt-1">
                        Rp {c.cost.toLocaleString("id-ID")}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-4 border-t border-amber-100">
                <h3 className="font-extrabold text-[#1B4332] text-lg flex items-center gap-2 pb-2 border-b border-amber-100">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" /> Pilih Metode Pembayaran
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { id: "QRIS", label: "QRIS (Semua E-Wallet)", desc: "Scan otomatis" },
                    { id: "BCA_VA", label: "BCA Virtual Account", desc: "Verifikasi instan" },
                    { id: "MANDIRI_VA", label: "Mandiri Virtual Account", desc: "Verifikasi instan" },
                    { id: "TRANSFER", label: "Transfer Bank Manual", desc: "BCA / Mandiri" },
                    { id: "EWALLET", label: "GoPay / ShopeePay / OVO", desc: "Buka aplikasi" },
                    { id: "COD", label: "Bayar di Tempat (COD)", desc: "Bayar ke Kurir" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        paymentMethod === p.id
                          ? "bg-[#1B4332] text-[#FDF6E3] border-[#1B4332] font-bold shadow-md"
                          : "border-stone-200 hover:bg-amber-50/50 text-stone-800"
                      }`}
                    >
                      <p className="font-bold">{p.label}</p>
                      <p className="text-[10px] opacity-80">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-stone-600 hover:underline"
                >
                  ← Kembali ke Alamat
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="bg-[#1B4332] text-[#D4AF37] font-bold px-6 py-3 rounded-2xl"
                >
                  Lanjut ke Review Pesanan →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-[#1B4332] text-lg flex items-center gap-2 pb-2 border-b border-amber-100">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> Langkah 3: Tinjauan Pesanan
              </h3>

              <div className="bg-amber-50/50 p-4 rounded-2xl text-xs space-y-2 border border-amber-200">
                <p><strong>Penerima:</strong> {formData.nama} ({formData.nomorWa})</p>
                <p><strong>Alamat:</strong> {formData.jalan}, {formData.kota}, {formData.provinsi} ({formData.kodePos})</p>
                <p><strong>Kurir:</strong> {courier} (Rp {shippingCost.toLocaleString("id-ID")})</p>
                <p><strong>Pembayaran:</strong> {paymentMethod}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Tambahan untuk Penjual (Opsional):</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Tolong bungkus rapi dengan ucapan kado..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-black py-4 rounded-2xl text-base shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Memproses Pesanan..." : " Buat Pesanan & Bayar Sekarang"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Items List Preview */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-syari space-y-4 sticky top-24">
            <h4 className="font-black text-[#1B4332] text-sm pb-2 border-b border-amber-100">
              Rincian ({cart.length} Produk)
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <img src={item.gambarUrl} alt={item.nama} className="w-10 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 line-clamp-1">{item.nama}</p>
                    <p className="text-[10px] text-stone-400">{item.warna} / {item.ukuran} x {item.qty}</p>
                  </div>
                  <span className="font-bold text-[#1B4332]">
                    Rp {(item.harga * item.qty).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-amber-100 text-xs space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim:</span>
                <span className="font-bold">Rp {shippingCost.toLocaleString("id-ID")}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskon Voucher:</span>
                  <span>- Rp {totalDiscount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#1B4332] pt-2 border-t border-amber-100">
                <span>Total Biaya:</span>
                <span className="text-lg text-[#1B4332]">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
