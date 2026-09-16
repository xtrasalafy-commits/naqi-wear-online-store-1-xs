"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, BookOpen } from "lucide-react";
import ImageLoader from "@/components/ImageLoader";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${resolvedParams.slug}`);
        const json = await res.json();
        if (json.success) setArticle(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [resolvedParams.slug]);

  if (loading) {
    return <div className="text-center p-12 text-xs text-stone-500">Memuat artikel...</div>;
  }

  if (!article) {
    return (
      <div className="text-center p-12 space-y-3">
        <p className="font-bold text-stone-700">Artikel tidak ditemukan.</p>
        <Link href="/artikel" className="text-[#1B4332] font-bold underline text-xs">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/artikel" className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4332] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Artikel
      </Link>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-amber-100 shadow-syari space-y-6">
        <div>
          <span className="bg-emerald-50 text-[#1B4332] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            {article.kategori}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] mt-3 leading-tight">
            {article.judul}
          </h1>
          <p className="text-xs text-stone-400 mt-2">
            Dipublikasikan oleh {article.penulis} • NAQI WEAR Journal
          </p>
        </div>

        <div className="aspect-16/9 rounded-2xl overflow-hidden bg-amber-50">
          <ImageLoader src={article.gambarUrl} alt={article.judul} className="w-full h-full object-cover" />
        </div>

        <div className="prose text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
          {article.konten}
        </div>
      </div>
    </div>
  );
}
