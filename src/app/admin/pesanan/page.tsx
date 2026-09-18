"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AdminOrdersPage() {
  const { showToast } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchOrders();
    })();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, statusPesanan: string, resi?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusPesanan,
          statusPembayaran: ["diproses", "dikirim", "selesai"].includes(statusPesanan) ? "dibayar" : undefined,
          resi,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("✓ Status pesanan berhasil diperbarui!");
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = filterStatus === "semua"
    ? orders
    : orders.filter((o) => o.statusPesanan === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-stone-100 rounded-xl hover:bg-stone-200">
            <ArrowLeft className="w-5 h-5 text-[#1B4332]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#1B4332]">Manajemen Pesanan Masuk</h1>
            <p className="text-xs text-stone-500">Ubah status transaksi, input resi, dan verifikasi bayar</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 text-xs font-bold bg-stone-100 p-1 rounded-xl">
          {["semua", "menunggu_bayar", "diproses", "dikirim", "selesai", "retur"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterStatus === st ? "bg-[#1B4332] text-[#D4AF37]" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-xs text-stone-500 py-8">Memuat daftar pesanan...</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
                <div>
                  <span className="font-mono font-black text-[#1B4332] text-sm">#{ord.nomorPesanan}</span>
                  <span className="text-xs text-stone-500 ml-2">Total: Rp {ord.total.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Ubah Status:</span>
                  <select
                    value={ord.statusPesanan}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                    className="bg-amber-50 border border-amber-300 font-bold text-xs p-1.5 rounded-xl text-[#1B4332]"
                  >
                    <option value="menunggu_bayar">Menunggu Bayar</option>
                    <option value="diproses">Diproses</option>
                    <option value="dikirim">Dikirim</option>
                    <option value="selesai">Selesai</option>
                    <option value="retur">Retur</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 text-xs text-stone-700">
                {ord.items?.map((it: any) => (
                  <p key={it.id}>• <strong>{it.snapshotNama}</strong> ({it.snapshotVarian}) x {it.qty}</p>
                ))}
              </div>

              {/* Courier & Resi */}
              <div className="flex items-center gap-3 pt-2 text-xs text-stone-500">
                <span>Kurir: <strong>{ord.kurir}</strong></span>
                <span>• Resi: <strong className="font-mono">{ord.resi || "Belum ada resi"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
