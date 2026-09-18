"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import ImageLoader from "@/components/ImageLoader";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles");
        const json = await res.json();
        if (json.success) setArticles(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-syari space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-[#D4AF37]" /> Artikel & Inspirasi Busana Syar&apos;i
        </h1>
        <p className="text-xs text-stone-500">
          Panduan memilih bahan, tips merawat gamis, dan inspirasi sarimbit keluarga.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-xs text-stone-500 py-8">Memuat artikel...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/artikel/${art.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-syari hover:shadow-syari-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 bg-amber-50 relative overflow-hidden">
                  <ImageLoader src={art.gambarUrl} alt={art.judul} className="w-full h-full zoom-on-hover" />
                  <span className="absolute top-3 left-3 bg-[#1B4332] text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {art.kategori}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-stone-800 group-hover:text-[#1B4332] line-clamp-2">
                    {art.judul}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                    {art.ringkasan}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex justify-between items-center text-xs font-bold text-[#D4AF37] group-hover:underline">
                <span>Penulis: {art.penulis}</span>
                <span className="flex items-center gap-1">Baca <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
