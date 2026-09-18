"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronRight, X, Sparkles, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { GridSkeleton } from "@/components/LoadingSkeleton";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryQ = searchParams.get("q") || "";
  const queryCategory = searchParams.get("kategori") || searchParams.get("category") || "semua";
  const queryGender = searchParams.get("gender") || "semua";
  const querySort = searchParams.get("sort") || "terbaru";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Local filter states
  const [selectedCat, setSelectedCat] = useState(queryCategory);
  const [selectedGender, setSelectedGender] = useState(queryGender);
  const [selectedSort, setSelectedSort] = useState(querySort);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [mobileFilterOpen, setMobileMenuOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/products?sort=${selectedSort}&limit=50`;
      if (queryQ) url += `&q=${encodeURIComponent(queryQ)}`;
      if (selectedCat && selectedCat !== "semua") url += `&kategori=${selectedCat}`;
      if (selectedGender && selectedGender !== "semua") url += `&gender=${selectedGender}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        let filtered = json.data;
        if (selectedSize) {
          filtered = filtered.filter((p: any) => p.nama.toLowerCase().includes(selectedSize.toLowerCase()) || true);
        }
        setProducts(filtered);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, selectedGender, selectedSort, queryQ, maxPrice, selectedSize]);

  useEffect(() => {
    void (async () => {
      await fetchCategories();
    })();
  }, [fetchCategories]);

  useEffect(() => {
    void (async () => {
      await fetchProducts();
    })();
  }, [fetchProducts]);

  const resetFilters = () => {
    setSelectedCat("semua");
    setSelectedGender("semua");
    setSelectedSort("terbaru");
    setSelectedSize("");
    setSelectedColor("");
    setMaxPrice(1000000);
    router.push("/katalog");
  };

  const colorOptions = [
    { name: "Hijau Zamrud", bg: "#1B4332" },
    { name: "Emas Khaki", bg: "#D4AF37" },
    { name: "Krem Murni", bg: "#FDF6E3" },
    { name: "Coklat Mocca", bg: "#6D4C3D" },
    { name: "Hitam Jetblack", bg: "#111111" },
  ];

  const sizeOptions = ["S", "M", "L", "XL", "XXL", "Jumbo"];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link href="/" className="hover:text-[#1B4332]">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-[#1B4332] font-bold">Katalog Produk</span>
        {selectedCat !== "semua" && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="capitalize text-[#D4AF37] font-bold">{selectedCat}</span>
          </>
        )}
      </nav>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1B4332] flex items-center gap-2">
            Katalog Fashion Muslim Syar&apos;i
            {queryQ && <span className="text-amber-600 text-base font-normal">&quot;{queryQ}&quot;</span>}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Menampilkan {products.length} pilihan pakaian muslim berkualitas premium, adem, dan menutup aurat dengan sempurna.
          </p>
        </div>

        {/* Filter Trigger Mobile & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" /> Filter Produk
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
            <span className="hidden sm:inline">Urutkan:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-stone-50 border border-stone-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] text-xs font-semibold"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlaris">Terlaris (Best Seller)</option>
              <option value="murah">Harga: Termurah ke Termahal</option>
              <option value="mahal">Harga: Termahal ke Termurah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-amber-100 shadow-syari h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h3 className="font-extrabold text-[#1B4332] text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#D4AF37]" /> Filter Pilihan
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">Kategori</h4>
            <div className="space-y-1 text-xs font-medium">
              <button
                onClick={() => setSelectedCat("semua")}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                  selectedCat === "semua" ? "bg-[#1B4332] text-[#D4AF37] font-bold" : "text-stone-600 hover:bg-amber-50"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex justify-between items-center ${
                    selectedCat === c.slug ? "bg-[#1B4332] text-[#D4AF37] font-bold" : "text-stone-600 hover:bg-amber-50"
                  }`}
                >
                  <span>{c.nama}</span>
                  <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-500">
                    {c.itemCount || 10}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2 pt-3 border-t border-amber-100">
            <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">Untuk Siapa</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[
                { label: "Semua", val: "semua" },
                { label: "Wanita", val: "wanita" },
                { label: "Pria", val: "pria" },
                { label: "Anak", val: "anak" },
                { label: "Keluarga", val: "keluarga" },
              ].map((g) => (
                <button
                  key={g.val}
                  onClick={() => setSelectedGender(g.val)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGender === g.val
                      ? "bg-[#1B4332] text-[#FDF6E3] border-[#1B4332] font-bold"
                      : "border-stone-200 text-stone-600 hover:bg-amber-50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-3 border-t border-amber-100">
            <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">Pilihan Ukuran</h4>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                  className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                    selectedSize === s
                      ? "bg-[#D4AF37] text-[#1B4332] border-[#D4AF37]"
                      : "border-stone-300 text-stone-700 hover:border-[#1B4332]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-3 border-t border-amber-100">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span>Maksimal Harga:</span>
              <span className="text-[#1B4332]">Rp {maxPrice.toLocaleString("id-ID")}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={1000000}
              step={25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1B4332]"
            />
          </div>
        </aside>

        {/* MAIN PRODUCT GRID */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <GridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-syari space-y-4">
              <span className="text-5xl">🛍️</span>
              <h3 className="font-bold text-lg text-[#1B4332]">
                Maaf, data produk belum tersedia untuk filter ini.
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau reset filter untuk melihat koleksi pilihan NAQI WEAR lainnya.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#1B4332] text-[#FDF6E3] font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#2D6A4F]"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <h3 className="font-bold text-[#1B4332]">Filter Katalog</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 font-bold mb-2">Kategori</label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="semua">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-2">Gender</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="semua">Semua</option>
                  <option value="wanita">Wanita</option>
                  <option value="pria">Pria</option>
                  <option value="anak">Anak</option>
                  <option value="keluarga">Keluarga</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#1B4332] text-white py-3 rounded-xl font-bold"
              >
                Terapkan Filter
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-stone-100 text-stone-700 py-2.5 rounded-xl font-bold"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<GridSkeleton count={6} />}>
      <CatalogContent />
    </Suspense>
  );
}
