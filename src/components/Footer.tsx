"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Truck, RefreshCw, HeartHandshake, CreditCard, Coffee } from "lucide-react";
import DownloadSourceButton from "@/components/DownloadSourceButton";
import {
  OPEN_SOURCE_CREDIT,
  TRAKTEER_URL,
  buildDefaultTrakteerTipUrl,
} from "@/lib/trakteer";

export default function Footer() {
  return (
    <footer className="bg-[#081C15] text-[#FDF6E3] border-t border-[#D4AF37]/30 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-emerald-900/60 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-[#1B4332] text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#D4AF37]">100% Syar&apos;i & Original</h4>
              <p className="text-xs text-stone-400">Bahan tebal tidak menerawang</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-[#1B4332] text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#D4AF37]">Pengiriman Cepat</h4>
              <p className="text-xs text-stone-400">Ke seluruh Indonesia & luar negeri</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-[#1B4332] text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#D4AF37]">Garansi Retur 7 Hari</h4>
              <p className="text-xs text-stone-400">Tukar ukuran/warna sangat mudah</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-[#1B4332] text-[#D4AF37] rounded-2xl border border-[#D4AF37]/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#D4AF37]">Layanan Santun CS</h4>
              <p className="text-xs text-stone-400">Respon ramah WhatsApp 24 jam</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#1B4332] flex items-center justify-center font-black text-xl">
                N
              </div>
              <span className="text-2xl font-black text-[#FDF6E3]">
                NAQI <span className="text-[#D4AF37]">WEAR</span>
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              NAQI WEAR adalah busana muslim wanita, pria, anak, dan keluarga berkualitas premium.
              Tampil syar&apos;i, anggun, dan nyaman setiap hari tanpa perlu khawatir menerawang.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-amber-200 fill-current" />
              CS WhatsApp: 0812-3456-7890
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#D4AF37] mb-4 text-sm uppercase tracking-wider">Kategori Populer</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link href="/katalog?kategori=wanita" className="hover:text-[#D4AF37]">Gamis & Abaya Syar&apos;i</Link></li>
              <li><Link href="/katalog?kategori=hijab" className="hover:text-[#D4AF37]">Pashmina & Khimar Pet</Link></li>
              <li><Link href="/katalog?kategori=mukena" className="hover:text-[#D4AF37]">Mukena Silk 2-in-1 Travel</Link></li>
              <li><Link href="/katalog?kategori=pria" className="hover:text-[#D4AF37]">Baju Koko & Jubah Saudi</Link></li>
              <li><Link href="/katalog?kategori=keluarga" className="hover:text-[#D4AF37]">Sarimbit Keluarga Lebaran</Link></li>
              <li><Link href="/promo" className="hover:text-[#D4AF37]">Paket Hemat Bundling</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-[#D4AF37] mb-4 text-sm uppercase tracking-wider">Layanan Pelanggan</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><Link href="/akun" className="hover:text-[#D4AF37]">Lacak Pesanan Saya</Link></li>
              <li><Link href="/artikel" className="hover:text-[#D4AF37]">Tips & Panduan Size Chart</Link></li>
              <li><Link href="/kebijakan-retur" className="hover:text-[#D4AF37]">Syarat & Kebijakan Retur</Link></li>
              <li><Link href="/admin/login" className="hover:text-[#D4AF37]">Login Portal Admin</Link></li>
              <li><Link href="/admin/google-sync" className="hover:text-[#D4AF37]">Integrasi Google Sheets & Drive</Link></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-bold text-[#D4AF37] mb-4 text-sm uppercase tracking-wider">Pembayaran Mudah</h4>
            <p className="text-xs text-stone-300 mb-3">Mendukung semua pilihan pembayaran favorit Anda:</p>
            <div className="flex flex-wrap gap-2">
              {["QRIS", "BCA", "Mandiri", "BRI", "BNI", "GoPay", "OVO", "ShopeePay", "COD"].map((pay) => (
                <span key={pay} className="bg-[#1B4332] text-stone-200 text-[10px] font-bold px-2.5 py-1 rounded border border-[#D4AF37]/30">
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dukungan & Source Code */}
        <div className="pt-8">
          <div className="bg-[#1B4332]/70 border border-[#D4AF37]/30 rounded-3xl p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left space-y-1">
              <h4 className="text-[#D4AF37] font-bold text-sm flex items-center justify-center lg:justify-start gap-2">
                <Coffee className="w-4 h-4" /> Gratis, Bebas Iklan, dan Open Source
              </h4>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Traktir kopi untuk bantu biaya server, atau unduh source code lengkap web app ini
                secara gratis (lisensi MIT).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto">
              <a
                href={buildDefaultTrakteerTipUrl()}
                target="_blank"
                rel="noopener noreferrer"
                title={`Traktir kopi untuk NAQI WEAR via ${TRAKTEER_URL}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B38F24] text-[#1B4332] font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-transform active:scale-95"
              >
                <Coffee className="w-4 h-4" /> Traktir Kopi via Trakteer
              </a>
              <DownloadSourceButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#081C15] hover:bg-[#0d2a1f] text-[#D4AF37] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 shadow transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-wait" />
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-emerald-900/60 mt-8 text-center text-xs text-stone-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} NAQI WEAR. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-stone-300">
            <span className="text-[#D4AF37] font-bold">{OPEN_SOURCE_CREDIT}</span>
            <span className="mx-1.5 text-stone-600">•</span>
            Lisensi MIT — bebas dipelajari, diubah, dan dibagikan
          </p>
        </div>
      </div>
    </footer>
  );
}
