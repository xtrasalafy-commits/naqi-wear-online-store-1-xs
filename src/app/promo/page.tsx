"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, Sparkles, Copy, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function PromoPage() {
  const { showToast } = useCart();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch("/api/coupons");
        const json = await res.json();
        if (json.success) setCoupons(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCoupons();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`✓ Kode voucher "${code}" berhasil disalin!`);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#081C15] text-white p-8 rounded-3xl border border-[#D4AF37] shadow-syari space-y-3 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-[#1B4332] font-black text-xs px-3.5 py-1 rounded-full">
          <Sparkles className="w-4 h-4" /> PAKET HEMAT & VOUCHER RAMADHAN
        </span>
        <h1 className="text-3xl font-black text-[#FDF6E3]">Daftar Kupon Diskon Spesial</h1>
        <p className="text-xs text-stone-200 max-w-xl">
          Salin kode promo di bawah ini dan tempelkan pada kolom voucher saat di halaman Keranjang Belanja untuk menikmati potongan harga.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-xs text-stone-500 py-8">Memuat daftar kupon promo...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id || c.kode} className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-syari space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-emerald-50 text-[#1B4332] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {c.tipe === "persen" ? `Diskon ${c.nilai}%` : `Potongan Rp ${c.nilai.toLocaleString("id-ID")}`}
                </span>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-black text-xl text-[#1B4332] tracking-wider bg-amber-50 px-3 py-1 rounded-xl border border-amber-300">
                    {c.kode}
                  </span>
                  <button
                    onClick={() => copyCode(c.kode)}
                    className="p-2.5 bg-[#1B4332] text-[#D4AF37] hover:bg-[#2D6A4F] rounded-xl text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Copy className="w-4 h-4" /> Salin Kode
                  </button>
                </div>

                <p className="text-xs text-stone-600 font-medium">
                  Minimal belanja: <strong className="text-[#1B4332]">Rp {(c.minimalOrder || 0).toLocaleString("id-ID")}</strong>
                </p>
                <p className="text-[10px] text-stone-400">
                  Maksimal potongan: Rp {(c.maksimalDiskon || c.nilai).toLocaleString("id-ID")} • Kuota sisa: {c.kuota - c.terpakai}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-100 flex justify-between items-center text-[11px] text-stone-500 font-semibold">
                <span>Berlaku s/d: {c.berakhir}</span>
                <Link href="/katalog" className="text-[#1B4332] font-bold hover:underline flex items-center gap-0.5">
                  Pakai Sekarang <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
