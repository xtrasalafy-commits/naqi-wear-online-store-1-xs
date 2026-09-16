"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import ImageLoader from "./ImageLoader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export interface ProductCardProps {
  id: number;
  nama: string;
  slug: string;
  hargaDasar: number;
  hargaDiskon?: number | null;
  gambarUtama?: string;
  avgRating?: number;
  reviewCount?: number;
  unggulan?: boolean;
  terlaris?: boolean;
  badgeSyari?: string[] | any;
  bahan?: string;
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  const isDiscounted = product.hargaDiskon && product.hargaDiskon < product.hargaDasar;
  const finalPrice = isDiscounted ? product.hargaDiskon! : product.hargaDasar;
  const discountPercent = isDiscounted
    ? Math.round(((product.hargaDasar - product.hargaDiskon!) / product.hargaDasar) * 100)
    : 0;

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        productId: product.id,
        nama: product.nama,
        slug: product.slug,
        warna: "Hijau Zamrud",
        ukuran: "M",
        harga: finalPrice,
        gambarUrl: product.gambarUtama || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
        bahan: product.bahan || "Bahan Premium",
      },
      1
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-amber-100 shadow-syari hover:shadow-syari-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-[#D4AF37] text-[#1B4332] text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
            Diskon {discountPercent}%
          </span>
        )}
        {product.terlaris && (
          <span className="bg-[#1B4332] text-[#FDF6E3] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        aria-label="Tambah ke Wishlist"
        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-stone-600 hover:text-red-500 hover:bg-white transition-all shadow-md active:scale-90"
      >
        <Heart
          className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-stone-500"}`}
        />
      </button>

      {/* Image Gallery Link */}
      <Link href={`/produk/${product.slug}`} className="block relative aspect-3/4 overflow-hidden bg-amber-50/20">
        <ImageLoader
          src={product.gambarUtama || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800"}
          alt={product.nama}
          className="w-full h-full zoom-on-hover"
        />
        {/* Hover Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1B4332]/80 via-[#1B4332]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            + Keranjang
          </button>
        </div>
      </Link>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{product.avgRating || 4.9}</span>
            <span className="text-stone-400">({product.reviewCount || 12} ulasan)</span>
          </div>

          {/* Title */}
          <Link href={`/produk/${product.slug}`} className="block">
            <h3 className="font-semibold text-stone-800 text-sm sm:text-base line-clamp-2 hover:text-[#1B4332] transition-colors leading-snug">
              {product.nama}
            </h3>
          </Link>
        </div>

        {/* Syar'i Badges */}
        {product.badgeSyari && Array.isArray(product.badgeSyari) && (
          <div className="flex flex-wrap gap-1 pt-1">
            {product.badgeSyari.slice(0, 2).map((b: string, i: number) => (
              <span
                key={i}
                className="text-[10px] bg-emerald-50 text-[#1B4332] font-medium px-2 py-0.5 rounded border border-emerald-200/60 inline-flex items-center gap-0.5"
              >
                <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="pt-2 border-t border-amber-100/60 flex items-end justify-between">
          <div>
            {isDiscounted && (
              <span className="block text-xs text-stone-400 line-through">
                Rp {product.hargaDasar.toLocaleString("id-ID")}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-[#1B4332]">
              Rp {finalPrice.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label="Tambah Produk"
            className="sm:hidden p-2 rounded-xl bg-[#1B4332] text-[#D4AF37] hover:bg-[#2D6A4F] active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
