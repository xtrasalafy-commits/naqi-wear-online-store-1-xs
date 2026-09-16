"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-syari space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
          <div className="p-3 bg-[#1B4332] text-[#D4AF37] rounded-2xl">
            <RefreshCw className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1B4332]">Kebijakan Retur & Garansi Pas Ukuran</h1>
            <p className="text-xs text-stone-500">Komitmen NAQI WEAR untuk kepuasan dan kenyamanan belanja Anda</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-900 border border-emerald-200 font-medium">
            <p className="font-bold mb-1">🌿 Garansi 7 Hari Tanpa Ribet:</p>
            <p>Jika baju yang diterima tidak pas ukurannya, cacat produksi, atau warna tidak sesuai foto, Anda berhak mengajukan tukar produk dalam 7 hari setelah pesanan tiba.</p>
          </div>

          <h3 className="font-bold text-[#1B4332] text-base">Syarat & Ketentuan Retur:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Produk belum dicuci dan tag/label merek NAQI WEAR masih terpasang utuh.</li>
            <li>Pakaian tidak berbau wewangian tajam, noda makanan, atau kerusakan akibat kelalaian pemakaian.</li>
            <li>Menyertakan foto atau video unboxing singkat saat membuka paket.</li>
          </ul>

          <h3 className="font-bold text-[#1B4332] text-base">Langkah Mudah Retur:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Buka halaman <strong>Akun Saya &gt; Pesanan Saya</strong>.</li>
            <li>Tekan tombol <strong>"Ajukan Retur"</strong> pada pesanan yang sudah berstatus selesai.</li>
            <li>Isi alasan retur dan unggah foto produk.</li>
            <li>Tim CS WhatsApp kami akan menghubungi Anda dalam 1x24 jam untuk pengiriman tukar produk.</li>
          </ol>

          <div className="pt-4 text-center">
            <a
              href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Admin%20NAQI%20WEAR,%20saya%20mau%20tanya%20retur%20ukuran"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow"
            >
              <MessageCircle className="w-5 h-5 text-amber-200 fill-current" />
              Hubungi CS Retur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
