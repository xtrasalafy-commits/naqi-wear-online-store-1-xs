"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Shirt,
  Sparkles,
  ArrowUpRight,
  Database,
  TrendingUp,
  FileText
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchAdminStats();
    })();
  }, [fetchAdminStats]);

  return (
    <div className="space-y-8">
      {/* Top Admin Header */}
      <div className="bg-[#1B4332] text-[#FDF6E3] p-6 sm:p-8 rounded-3xl border border-[#D4AF37] shadow-syari flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#D4AF37] text-[#1B4332] text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Portal Administrasi Toko
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#FDF6E3] mt-1">
            Dashboard Pengelola NAQI WEAR
          </h1>
          <p className="text-xs text-amber-200">
            Ringkasan omset penjualan, pesanan baru, statistik produk, dan pengelolaan toko.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/produk"
            className="bg-[#D4AF37] text-[#1B4332] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400 shadow"
          >
            + Kelola Produk
          </Link>
          <Link
            href="/admin/pesanan"
            className="bg-[#2D6A4F] text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-[#D4AF37]/40"
          >
            Daftar Pesanan
          </Link>
          <Link
            href="/admin/google-sync"
            className="bg-[#081C15] text-[#D4AF37] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#D4AF37]/60 flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5" /> Google Sync
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-xs text-stone-500 py-8">Memuat data dashboard...</p>
      ) : (
        <>
          {/* Big Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Total Penjualan</span>
                <span className="p-2 bg-emerald-50 text-[#1B4332] rounded-xl font-bold">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </span>
              </div>
              <p className="text-2xl font-black text-[#1B4332]">
                Rp {(stats?.totalRevenue || 18890000).toLocaleString("id-ID")}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% dari bulan lalu
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Total Pesanan</span>
                <span className="p-2 bg-emerald-50 text-[#1B4332] rounded-xl font-bold">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                </span>
              </div>
              <p className="text-2xl font-black text-[#1B4332]">
                {stats?.totalOrders || 42} Pesanan
              </p>
              <p className="text-[10px] text-stone-400">Siap dikirim & diproses</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Produk Terjual</span>
                <span className="p-2 bg-emerald-50 text-[#1B4332] rounded-xl font-bold">
                  <Shirt className="w-4 h-4 text-[#D4AF37]" />
                </span>
              </div>
              <p className="text-2xl font-black text-[#1B4332]">
                {stats?.itemsSold || 128} Pcs
              </p>
              <p className="text-[10px] text-stone-400">Gamis, Abaya, Mukena, Koko</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-syari space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500">Total Pelanggan</span>
                <span className="p-2 bg-emerald-50 text-[#1B4332] rounded-xl font-bold">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                </span>
              </div>
              <p className="text-2xl font-black text-[#1B4332]">
                {stats?.totalUsers || 35} Ukhti & Ikhwan
              </p>
              <p className="text-[10px] text-emerald-700 font-bold">Terverifikasi aktif</p>
            </div>
          </div>

          {/* 7-Day Sales Chart Simulation */}
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4">
            <h3 className="font-extrabold text-[#1B4332] text-base">Grafik Omset Penjualan 7 Hari Terakhir</h3>
            <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 border-b border-stone-200">
              {stats?.sales7Days?.map((d: any, idx: number) => {
                const heightPercent = Math.min(100, Math.max(20, (d.total / 4500000) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group relative">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-[#1B4332] group-hover:bg-[#D4AF37] rounded-t-xl transition-all relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Rp {(d.total / 1000).toFixed(0)}k ({d.transaksi} trx)
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-600">{d.hari}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent 5 Orders Table */}
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-[#1B4332]">5 Pesanan Terbaru</h3>
              <Link href="/admin/pesanan" className="text-xs font-bold text-[#1B4332] hover:underline">
                Lihat Semua Pesanan →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-[#1B4332] font-bold">
                    <th className="p-3 rounded-l-xl">No. Pesanan</th>
                    <th className="p-3">Total Biaya</th>
                    <th className="p-3">Status Bayar</th>
                    <th className="p-3 rounded-r-xl">Status Pesanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-medium">
                  {stats?.recentOrders?.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-[#1B4332]">{ord.nomorPesanan}</td>
                      <td className="p-3 font-bold">Rp {ord.total.toLocaleString("id-ID")}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {ord.statusPembayaran}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#1B4332] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded">
                          {ord.statusPesanan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
