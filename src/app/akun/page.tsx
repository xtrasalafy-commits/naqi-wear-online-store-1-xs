"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, LogOut, Truck, CheckCircle2, Clock, RefreshCw, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { showToast } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"pesanan" | "profil" | "alamat">("pesanan");

  // Return modal
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returAlasan, setReturAlasan] = useState("");

  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?userId=${user?.id || 2}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder || !returAlasan) return;

    try {
      const res = await fetch(`/api/orders/${returnModalOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusPesanan: "retur",
          returAlasan,
          returFotoUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✓ Permohonan retur berhasil diajukan!");
        setReturnModalOrder(null);
        setReturAlasan("");
        fetchUserOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "menunggu_bayar":
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full">Kuning: Menunggu Bayar</span>;
      case "diproses":
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] px-2.5 py-1 rounded-full">Biru: Diproses</span>;
      case "dikirim":
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[10px] px-2.5 py-1 rounded-full">Ungu: Dikirim</span>;
      case "selesai":
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-full">Hijau: Selesai</span>;
      case "retur":
        return <span className="bg-red-100 text-red-900 border border-red-300 font-bold text-[10px] px-2.5 py-1 rounded-full">Merah: Retur</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 font-bold text-[10px] px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* User Header Profile */}
      <div className="bg-[#1B4332] text-[#FDF6E3] p-6 sm:p-8 rounded-3xl border border-[#D4AF37] shadow-syari flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shrink-0">
            <img src={user?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300"} alt={user?.nama || "User"} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#FDF6E3]">{user?.nama || "Aisyah Nurul"}</h1>
            <p className="text-xs text-amber-200">{user?.email || "aisyah@gmail.com"} • WhatsApp: {user?.nomorWa || "082198765432"}</p>
            <span className="inline-block mt-2 bg-[#D4AF37] text-[#1B4332] text-[10px] font-black px-3 py-0.5 rounded-full">
              Pelanggan Setia NAQI WEAR
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-900/60 hover:bg-red-900 text-red-100 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-red-400/40"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 gap-6">
        <button
          onClick={() => setActiveTab("pesanan")}
          className={`pb-3 font-extrabold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === "pesanan" ? "border-[#1B4332] text-[#1B4332]" : "border-transparent text-stone-400"
          }`}
        >
          <Package className="w-4 h-4" /> Pesanan Saya ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("profil")}
          className={`pb-3 font-extrabold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === "profil" ? "border-[#1B4332] text-[#1B4332]" : "border-transparent text-stone-400"
          }`}
        >
          <User className="w-4 h-4" /> Profil Saya
        </button>
        <button
          onClick={() => setActiveTab("alamat")}
          className={`pb-3 font-extrabold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === "alamat" ? "border-[#1B4332] text-[#1B4332]" : "border-transparent text-stone-400"
          }`}
        >
          <MapPin className="w-4 h-4" /> Alamat Pengiriman
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === "pesanan" && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-stone-500 text-center py-8">Memuat riwayat pesanan...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-amber-100 text-center space-y-3">
              <p className="text-stone-500 text-xs">Belum ada riwayat pesanan.</p>
              <Link href="/katalog" className="inline-block bg-[#1B4332] text-white font-bold text-xs px-4 py-2 rounded-xl">
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
                  <div>
                    <span className="font-mono font-black text-[#1B4332] text-sm">#{ord.nomorPesanan}</span>
                    <span className="text-[11px] text-stone-400 block sm:inline sm:ml-2">
                      {new Date(ord.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  {getStatusBadge(ord.statusPesanan)}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items && ord.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-800">{it.snapshotNama}</p>
                        <p className="text-[10px] text-stone-400">{it.snapshotVarian} x {it.qty}</p>
                      </div>
                      <span className="font-bold text-[#1B4332]">
                        Rp {it.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visual Timeline */}
                <div className="pt-3 border-t border-amber-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Progres Pesanan:</p>
                  <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold text-stone-500">
                    <div className="bg-emerald-100 text-emerald-900 p-1.5 rounded-lg">1. Dibuat</div>
                    <div className={`p-1.5 rounded-lg ${["dibayar", "diproses", "dikirim", "selesai"].includes(ord.statusPembayaran) ? "bg-emerald-100 text-emerald-900" : "bg-stone-100"}`}>2. Dibayar</div>
                    <div className={`p-1.5 rounded-lg ${["diproses", "dikirim", "selesai"].includes(ord.statusPesanan) ? "bg-emerald-100 text-emerald-900" : "bg-stone-100"}`}>3. Diproses</div>
                    <div className={`p-1.5 rounded-lg ${["dikirim", "selesai"].includes(ord.statusPesanan) ? "bg-emerald-100 text-emerald-900" : "bg-stone-100"}`}>4. Dikirim</div>
                    <div className={`p-1.5 rounded-lg ${ord.statusPesanan === "selesai" ? "bg-emerald-100 text-emerald-900" : "bg-stone-100"}`}>5. Selesai</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-extrabold text-[#1B4332] text-sm">
                    Total: Rp {ord.total.toLocaleString("id-ID")}
                  </span>

                  {ord.statusPesanan === "selesai" && (
                    <button
                      onClick={() => setReturnModalOrder(ord)}
                      className="bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl hover:bg-amber-200"
                    >
                      Ajukan Retur / Tukar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PROFIL TAB */}
      {activeTab === "profil" && (
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4 max-w-lg">
          <h3 className="font-black text-[#1B4332]">Informasi Akun Pelanggan</h3>
          <div className="space-y-2 text-xs">
            <p><strong>Nama:</strong> {user?.nama}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>WhatsApp:</strong> {user?.nomorWa}</p>
            <p><strong>Status Syar'i:</strong> Terverifikasi Active Member</p>
          </div>
        </div>
      )}

      {/* ALAMAT TAB */}
      {activeTab === "alamat" && (
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4 max-w-lg">
          <h3 className="font-black text-[#1B4332]">Alamat Pengiriman Utama</h3>
          <div className="bg-amber-50/50 p-4 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-stone-800">Aisyah Nurul (082198765432)</p>
            <p className="text-stone-600">Jl. Mawar Mekar No. 12, Kebayoran Baru, Jakarta Selatan, DKI Jakarta (12310)</p>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-black text-[#1B4332] text-lg">Form Pengajuan Retur</h3>
            <p className="text-xs text-stone-500">Pesanan #{returnModalOrder.nomorPesanan}</p>

            <form onSubmit={handleReturnSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Alasan Retur / Tukar Ukuran:</label>
                <textarea
                  rows={3}
                  value={returAlasan}
                  onChange={(e) => setReturAlasan(e.target.value)}
                  placeholder="Jelaskan alasan retur secara jujur & santun..."
                  className="w-full p-2.5 border rounded-xl text-xs"
                  required
                />
              </div>

              <div className="p-3 border border-dashed rounded-xl text-center text-xs text-stone-500">
                <Upload className="w-4 h-4 mx-auto mb-1 text-[#1B4332]" />
                Foto Produk Lampiran Terverifikasi
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="flex-1 bg-stone-100 font-bold py-2 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1B4332] text-white font-bold py-2 rounded-xl text-xs"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
