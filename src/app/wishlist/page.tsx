"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";

export default function WishlistPage() {
  const { wishlistIds } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, [wishlistIds]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      if (json.success) {
        const liked = json.data.filter((p: any) => wishlistIds.includes(p.id));
        setWishlistProducts(liked);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B4332] flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500 fill-red-500" /> Wishlist Produk Disukai
          </h1>
          <p className="text-xs text-stone-500">
            Koleksi busana muslim pavorit yang Anda simpan untuk dibeli nanti.
          </p>
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={4} />
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-syari space-y-4 max-w-lg mx-auto">
          <span className="text-5xl">❤️</span>
          <h3 className="font-bold text-lg text-[#1B4332]">Belum Ada Produk di Wishlist</h3>
          <p className="text-xs text-stone-500">
            Klik ikon hati pada produk pilihan Anda di katalog untuk menyimpannya di sini.
          </p>
          <Link href="/katalog" className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-bold text-xs px-6 py-3 rounded-xl">
            Jelajahi Katalog Syar'i <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
