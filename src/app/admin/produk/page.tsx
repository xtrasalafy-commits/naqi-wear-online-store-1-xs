"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AdminProductsPage() {
  const { showToast } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [nama, setNama] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [hargaDasar, setHargaDasar] = useState("250000");
  const [hargaDiskon, setHargaDiskon] = useState("199000");
  const [deskripsi, setDeskripsi] = useState("");
  const [bahan, setBahan] = useState("Armani Silk Premium");
  const [gender, setGender] = useState("wanita");
  const [gambarUrl, setGambarUrl] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const resP = await fetch("/api/products?limit=100");
      const jsonP = await resP.json();
      if (jsonP.success) setProducts(jsonP.data);

      const resC = await fetch("/api/categories");
      const jsonC = await resC.json();
      if (jsonC.success) setCategories(jsonC.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          categoryId: Number(categoryId),
          hargaDasar: Number(hargaDasar),
          hargaDiskon: Number(hargaDiskon),
          deskripsi: deskripsi || "Pakaian muslim syar'i premium adem dan anggun.",
          bahan,
          gender,
          gambarUrls: [gambarUrl],
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("✓ Produk baru berhasil ditambahkan!");
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-stone-100 rounded-xl hover:bg-stone-200">
            <ArrowLeft className="w-5 h-5 text-[#1B4332]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#1B4332]">Manajemen Produk NAQI WEAR</h1>
            <p className="text-xs text-stone-500">Kelola katalog busana muslim, varian, dan foto</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1B4332] text-[#D4AF37] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#2D6A4F] flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {loading ? (
        <p className="text-center text-xs text-stone-500 py-8">Memuat daftar produk...</p>
      ) : (
        <div className="bg-white rounded-3xl border border-amber-100 shadow-syari overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1B4332] text-[#FDF6E3] font-bold">
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nama Produk</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Harga Diskon</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 font-medium">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-amber-50/40">
                    <td className="p-3">
                      <img src={prod.gambarUtama} alt={prod.nama} className="w-10 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="p-3 font-bold text-[#1B4332]">{prod.nama}</td>
                    <td className="p-3 capitalize">{prod.gender}</td>
                    <td className="p-3 font-bold text-emerald-800">
                      Rp {(prod.hargaDiskon || prod.hargaDasar).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 capitalize">{prod.gender}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button className="p-1.5 text-stone-600 hover:text-[#1B4332]">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-[#1B4332] text-lg">Tambah Produk Baru</h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Produk:</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Gamis Syar'i Silk Luxury"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Harga Dasar (Rp):</label>
                  <input
                    type="number"
                    value={hargaDasar}
                    onChange={(e) => setHargaDasar(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Harga Diskon (Rp):</label>
                  <input
                    type="number"
                    value={hargaDiskon}
                    onChange={(e) => setHargaDiskon(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Kategori:</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Bahan Pakaian:</label>
                <input
                  type="text"
                  value={bahan}
                  onChange={(e) => setBahan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">URL Foto (Google Drive / Unsplash Link):</label>
                <input
                  type="text"
                  value={gambarUrl}
                  onChange={(e) => setGambarUrl(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-stone-100 font-bold py-2.5 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1B4332] text-white font-bold py-2.5 rounded-xl"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
