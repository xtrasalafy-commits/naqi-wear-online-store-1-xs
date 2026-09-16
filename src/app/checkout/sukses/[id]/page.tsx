"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Copy, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { showToast } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`);
        const json = await res.json();
        if (json.success) {
          setOrder(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [resolvedParams.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("✓ Berhasil disalin ke clipboard!");
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1B4332] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="font-bold text-[#1B4332] text-sm">Menyiapkan instruksi pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <p>Pesanan tidak ditemukan.</p>
        <Link href="/" className="text-[#1B4332] font-bold underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const waText = encodeURIComponent(
    `Assalamu'alaikum Admin NAQI WEAR, saya sudah buat pesanan #${order.nomorPesanan} dengan total Rp ${order.total.toLocaleString("id-ID")}. Mohon diproses ya.`
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center">
      <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-syari space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-[#1B4332] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-[#1B4332]" />
        </div>

        <div>
          <span className="bg-emerald-50 text-[#1B4332] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Pesanan Berhasil Dibuat!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] mt-2">
            Jazakillahu Khair Atas Kepercayaannya
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Nomor Pesanan Resmi Anda:
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl text-base font-black text-[#1B4332] mt-2 border border-amber-300">
            <span>{order.nomorPesanan}</span>
            <button onClick={() => copyToClipboard(order.nomorPesanan)} className="text-stone-500 hover:text-[#1B4332]">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-[#1B4332] text-[#FDF6E3] p-6 rounded-2xl space-y-4 text-left border border-[#D4AF37]">
          <div className="flex justify-between items-center border-b border-[#D4AF37]/30 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Metode Pembayaran</span>
            <span className="font-extrabold text-sm">{order.payment?.metode || "QRIS"}</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-stone-200">Total Yang Harus Dibayar:</p>
            <p className="text-3xl font-black text-[#D4AF37]">
              Rp {order.total.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-amber-200">Harap bayar sesuai nominal di atas</p>
          </div>

          {/* QRIS / VA Code Simulation */}
          <div className="bg-white text-stone-800 p-4 rounded-xl text-center space-y-2">
            <p className="text-xs font-bold text-[#1B4332]">Kode Bayar Virtual / QRIS Token:</p>
            <div className="flex items-center justify-center gap-2 text-lg font-mono font-black text-emerald-900">
              <span>8809-{order.id}-9281</span>
              <button
                onClick={() => copyToClipboard(`8809-${order.id}-9281`)}
                className="p-1 bg-stone-100 rounded hover:bg-stone-200 text-stone-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400">Bisa dibayar via BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay</p>
          </div>
        </div>

        {/* WhatsApp CS Button CTA */}
        <div className="pt-2 space-y-3">
          <a
            href={`https://wa.me/6281234567890?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-5 h-5 text-amber-200 fill-current" />
            Konfirmasi ke Admin via WhatsApp
          </a>

          <Link
            href="/akun"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4332] hover:underline"
          >
            Lihat Status Pesanan Saya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
