"use client";

import React from "react";
import { X, Ruler } from "lucide-react";

export default function SizeChartModal({
  isOpen,
  onClose,
  category = "Gamis & Abaya",
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 text-[#1B4332] mb-4 pb-3 border-b border-amber-100">
          <Ruler className="w-7 h-7 text-[#D4AF37]" />
          <div>
            <h3 className="font-black text-xl">Tabel Panduan Ukuran (Size Chart)</h3>
            <p className="text-xs text-stone-500">Ukur badan Anda secara rileks menggunakan pita meteran</p>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#1B4332] text-[#FDF6E3]">
                <th className="p-3 rounded-tl-xl">Ukuran</th>
                <th className="p-3">Lingkar Dada (LD)</th>
                <th className="p-3">Panjang Baju (PB)</th>
                <th className="p-3">Panjang Lengan</th>
                <th className="p-3 rounded-tr-xl">Rekomendasi Berat Badannya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-stone-700">
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-bold text-[#1B4332]">S</td>
                <td className="p-3">92 - 96 cm</td>
                <td className="p-3">135 cm</td>
                <td className="p-3">56 cm</td>
                <td className="p-3">40 - 50 kg</td>
              </tr>
              <tr className="hover:bg-amber-50/50 bg-amber-50/30">
                <td className="p-3 font-bold text-[#1B4332]">M</td>
                <td className="p-3">98 - 102 cm</td>
                <td className="p-3">138 cm</td>
                <td className="p-3">57 cm</td>
                <td className="p-3">51 - 60 kg</td>
              </tr>
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-bold text-[#1B4332]">L</td>
                <td className="p-3">104 - 108 cm</td>
                <td className="p-3">140 cm</td>
                <td className="p-3">58 cm</td>
                <td className="p-3">61 - 70 kg</td>
              </tr>
              <tr className="hover:bg-amber-50/50 bg-amber-50/30">
                <td className="p-3 font-bold text-[#1B4332]">XL</td>
                <td className="p-3">110 - 114 cm</td>
                <td className="p-3">142 cm</td>
                <td className="p-3">59 cm</td>
                <td className="p-3">71 - 80 kg</td>
              </tr>
              <tr className="hover:bg-amber-50/50">
                <td className="p-3 font-bold text-[#1B4332]">XXL / Jumbo</td>
                <td className="p-3">118 - 124 cm</td>
                <td className="p-3">142 cm</td>
                <td className="p-3">60 cm</td>
                <td className="p-3">81 - 95 kg</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-emerald-50 text-[#1B4332] p-4 rounded-2xl text-xs space-y-1 border border-emerald-200">
          <p className="font-bold">💡 Tips Belanja Syar'i:</p>
          <p>• Bila lingkar dada berada di antara 2 ukuran, pilihlah ukuran yang lebih besar agar lebih longgar dan syar'i.</p>
          <p>• Semua produk NAQI WEAR sudah dilengkapi toleransi jahit 1-2 cm.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1B4332] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2D6A4F]"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
