"use client";

import React, { useState } from "react";
import { Star, X, Upload, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSuccess?: () => void;
}) {
  const { showToast } = useCart();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [nama, setNama] = useState("");
  const [judul, setJudul] = useState("");
  const [komentar, setKomentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!komentar.trim()) {
      alert("Harap masukkan ulasan Anda terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          namaPengulas: nama.trim() || "Ukhti NAQI",
          rating,
          judul: judul.trim() || "Sangat Puas & Anggun",
          komentar,
          gambarUrlJson: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400"],
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Jazakillahu khair! Ulasan Anda telah berhasil disimpan.");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(json.error || "Gagal menyimpan ulasan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-extrabold text-xl text-[#1B4332] mb-1">Tulis Ulasan Produk</h3>
        <p className="text-xs text-stone-500 mb-4 line-clamp-1">{productName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Pilih Rating Bintang:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star ? "fill-amber-400" : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nama Pengulas (opsional):</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Ukhti Aisyah / Hamba Allah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Judul Ulasan:</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Bahannya adem, tidak menerawang!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Ulasan Detail:</label>
            <textarea
              rows={4}
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Tuliskan pengalaman Anda memakai pakaian dari NAQI WEAR..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              required
            />
          </div>

          <div className="border-2 border-dashed border-amber-200 bg-amber-50/40 rounded-2xl p-3 text-center text-xs text-stone-500">
            <Upload className="w-5 h-5 mx-auto text-[#1B4332] mb-1" />
            <p className="font-semibold text-stone-700">Foto Pembelian Terlampir</p>
            <p className="text-[10px] text-stone-400">Gambar akan otomatis diverifikasi untuk kenyamanan ulasan syar'i</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FDF6E3] font-bold py-3 rounded-2xl transition-all shadow-lg active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan Ulasan..." : "Kirim Ulasan Syar'i"}
          </button>
        </form>
      </div>
    </div>
  );
}
