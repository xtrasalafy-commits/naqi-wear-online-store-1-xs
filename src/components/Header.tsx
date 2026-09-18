"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { cart } = useCart();
  const { user, wishlistIds, isAdmin, logout, loginAsAdmin, loginAsUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const wishlistCount = wishlistIds.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1B4332] text-white shadow-md border-b border-[#D4AF37]/30">
      {/* Top Banner Bar */}
      <div className="bg-[#081C15] text-[#D4AF37] py-1.5 px-4 text-xs font-medium border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
            <span>Toko Fashion Muslim Syar&apos;i Terpercaya — Diskon Lebaran Hingga 50%</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-stone-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Tidak Menerawang
            </span>
            <a href="https://wa.me/6281234567890" target="_blank" className="hover:text-white flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" /> WA CS: 0812-3456-7890
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-[#D4AF37]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#1B4332] flex items-center justify-center font-black text-xl shadow-lg border border-amber-200">
              N
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-[#FDF6E3] group-hover:text-[#D4AF37] transition-colors block leading-tight">
                NAQI <span className="text-[#D4AF37]">WEAR</span>
              </span>
              <span className="text-[10px] text-amber-200/80 tracking-widest block font-light uppercase">
                Fashion Muslim Syar&apos;i
              </span>
            </div>
          </Link>
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Gamis, Hijab, Abaya, Baju Koko, Sarimbit..."
            className="w-full pl-4 pr-12 py-2.5 rounded-full bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-inner placeholder-stone-400"
          />
          <button
            type="submit"
            aria-label="Cari Produk"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#D4AF37] hover:bg-amber-400 text-[#1B4332] p-2 rounded-full transition-transform active:scale-95"
          >
            <Search className="w-4 h-4 font-bold" />
          </button>
        </form>

        {/* Quick Actions (Wishlist, Cart, User) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search trigger for mobile */}
          <Link
            href="/katalog"
            className="md:hidden p-2 text-[#FDF6E3] hover:text-[#D4AF37]"
            aria-label="Cari"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 text-[#FDF6E3] hover:text-[#D4AF37] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#1B4332] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/keranjang"
            className="relative p-2 text-[#FDF6E3] hover:text-[#D4AF37] transition-colors flex items-center gap-2 bg-[#2D6A4F] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span className="hidden sm:inline text-xs font-bold text-[#FDF6E3]">Keranjang</span>
            {cartCount > 0 && (
              <span className="bg-[#D4AF37] text-[#1B4332] text-xs font-extrabold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Admin Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#2D6A4F] text-[#FDF6E3] transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-stone-300">
                <img
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"}
                  alt={user?.nama || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-amber-200 hidden sm:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-stone-800 rounded-2xl shadow-2xl border border-amber-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-stone-100 bg-amber-50/50 rounded-xl mb-1">
                  <p className="font-bold text-sm text-[#1B4332]">{user?.nama || "Tamu Syar&apos;i"}</p>
                  <p className="text-xs text-stone-500">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-[#1B4332] text-[#D4AF37] font-bold px-2 py-0.5 rounded-full">
                    {isAdmin ? "Mode Admin" : "Pelanggan Setia"}
                  </span>
                </div>

                <Link
                  href="/akun"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-xl font-medium text-stone-700"
                >
                  <User className="w-4 h-4 text-[#1B4332]" />
                  Akun & Pesanan Saya
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-50 text-[#1B4332] hover:bg-emerald-100 rounded-xl font-bold my-1"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Dashboard Admin
                  </Link>
                )}

                <div className="border-t border-stone-100 pt-1 mt-1 space-y-1">
                  {!isAdmin ? (
                    <button
                      onClick={() => {
                        loginAsAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1B4332] font-semibold hover:bg-amber-50 rounded-lg"
                    >
                      Beralih ke Akun Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        loginAsUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1B4332] font-semibold hover:bg-amber-50 rounded-lg"
                    >
                      Beralih ke Akun Customer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 font-semibold hover:bg-red-50 rounded-lg"
                  >
                    Keluar / Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Category Nav Bar */}
      <nav className="hidden md:block bg-[#2D6A4F] border-t border-[#D4AF37]/20 text-xs font-semibold py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-6 text-[#FDF6E3]">
          <Link href="/katalog?kategori=wanita" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            WANITA
          </Link>
          <Link href="/katalog?kategori=pria" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            PRIA
          </Link>
          <Link href="/katalog?kategori=anak" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            ANAK
          </Link>
          <Link href="/katalog?kategori=keluarga" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            SARIMBIT KELUARGA
          </Link>
          <Link href="/katalog?kategori=mukena" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            MUKENA
          </Link>
          <Link href="/katalog?kategori=hijab" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            HIJAB & KHIMAR
          </Link>
          <Link href="/promo" className="text-[#D4AF37] font-bold hover:underline whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> PAKET PROMO
          </Link>
          <Link href="/artikel" className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            ARTIKEL ISLAMI
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1B4332] border-t border-[#D4AF37]/30 p-4 space-y-4 animate-in slide-in-from-top-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Gamis, Mukena, Koko..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-white text-stone-800 text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1B4332]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-[#FDF6E3]">
            <Link
              href="/katalog?kategori=wanita"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#2D6A4F] p-2.5 rounded-xl hover:bg-emerald-800"
            >
              Wanita
            </Link>
            <Link
              href="/katalog?kategori=pria"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#2D6A4F] p-2.5 rounded-xl hover:bg-emerald-800"
            >
              Pria
            </Link>
            <Link
              href="/katalog?kategori=anak"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#2D6A4F] p-2.5 rounded-xl hover:bg-emerald-800"
            >
              Anak
            </Link>
            <Link
              href="/katalog?kategori=keluarga"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#2D6A4F] p-2.5 rounded-xl hover:bg-emerald-800"
            >
              Keluarga
            </Link>
            <Link
              href="/katalog?kategori=mukena"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#2D6A4F] p-2.5 rounded-xl hover:bg-emerald-800"
            >
              Mukena
            </Link>
            <Link
              href="/promo"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#D4AF37] text-[#1B4332] font-extrabold p-2.5 rounded-xl"
            >
              Paket Promo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
