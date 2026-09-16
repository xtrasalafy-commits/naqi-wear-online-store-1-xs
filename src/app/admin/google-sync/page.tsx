"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Copy, CheckCircle2, Folder, FileSpreadsheet, Download } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function GoogleSyncPage() {
  const { showToast } = useCart();
  const [appsScriptCode, setAppsScriptCode] = useState("");
  const [exportData, setExportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleSyncData() {
      try {
        const res = await fetch("/api/admin/google-sync");
        const json = await res.json();
        if (json.success) {
          setAppsScriptCode(json.googleAppsScriptCode);
          setExportData(json.exportData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchGoogleSyncData();
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    showToast("✓ Kode Google Apps Script (.gs) berhasil disalin!");
  };

  const downloadJsonBackup = () => {
    if (!exportData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "NAQI_WEAR_BACKUP_DB.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("✓ Backup JSON NAQI WEAR berhasil diunduh!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-amber-200">
        <Link href="/admin" className="p-2 bg-stone-100 rounded-xl hover:bg-stone-200">
          <ArrowLeft className="w-5 h-5 text-[#1B4332]" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1B4332]">Integrasi Google Sheets & Drive</h1>
          <p className="text-xs text-stone-500">
            Panduan & Script REST API untuk Spreadsheet NAQI_WEARDATA & Google Drive
          </p>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-syari space-y-4 text-xs sm:text-sm text-stone-700">
        <h3 className="font-extrabold text-[#1B4332] text-base flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#D4AF37]" /> Langkah Setup Google Ecosystem:
        </h3>

        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Buat Google Spreadsheet baru di Drive Anda, beri nama <strong className="text-[#1B4332]">NAQI_WEARDATA</strong>.
          </li>
          <li>
            Buat sheet-tab dengan nama: <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Users</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Categories</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Products</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">ProductVariants</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">ProductImages</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Orders</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Reviews</span>, <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded font-bold">Coupons</span>.
          </li>
          <li>
            Buat 2 folder di Google Drive: <strong className="text-[#1B4332]">NAQI_WEAR_ASSETS</strong> (untuk gambar) & <strong className="text-[#1B4332]">NAQI_WEAR_DB</strong> (untuk file cadangan).
          </li>
          <li>
            Buka Spreadsheet &gt; Extensions &gt; Apps Script. Salin kode <span className="font-mono">Code.gs</span> di bawah dan Deploy sebagai Web App!
          </li>
        </ol>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadJsonBackup}
            className="bg-[#1B4332] text-[#D4AF37] font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Unduh Cadangan JSON (NAQI_WEAR_DB)
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-[#081C15] text-[#FDF6E3] p-6 rounded-3xl border border-[#D4AF37] space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/30">
          <span className="font-mono font-bold text-xs text-[#D4AF37]">Code.gs (Google Apps Script API Web App)</span>
          <button
            onClick={copyCode}
            className="bg-[#D4AF37] text-[#1B4332] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Salin Kode .gs
          </button>
        </div>

        <pre className="p-4 bg-[#1B4332] rounded-xl text-[11px] font-mono overflow-x-auto text-amber-100 max-h-80 overflow-y-auto">
          {appsScriptCode || "Memuat kode script..."}
        </pre>
      </div>
    </div>
  );
}
