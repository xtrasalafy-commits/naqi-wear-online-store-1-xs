"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  GITHUB_REPO_URL,
  SOURCE_CODE_ARCHIVE_NAME,
} from "@/lib/trakteer";
import { Code2, Download, Loader2 } from "lucide-react";

export default function DownloadSourceButton({
  className,
  label = "Download Source Code (.zip)",
  compact = false,
}: {
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { showToast } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/source-code", { cache: "no-store" });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = objectUrl;
      downloadAnchor.download = SOURCE_CODE_ARCHIVE_NAME;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(objectUrl);

      showToast("✓ Source code lengkap NAQI WEAR berhasil diunduh!");
    } catch (error) {
      console.error("Gagal mengunduh source code:", error);
      showToast("Server tidak bisa membungkus arsip. Membuka repositori GitHub...");
      window.open(GITHUB_REPO_URL, "_blank", "noopener,noreferrer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      title="Unduh seluruh source code web app ini (Open Source oleh MZF - 2026)"
      aria-label="Download source code lengkap web app"
      className={
        className ||
        "inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-[#D4AF37] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 shadow transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-wait"
      }
    >
      {isLoading ? (
        <Loader2 className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} animate-spin`} />
      ) : (
        <Download className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
      )}
      <Code2 className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
      <span>{isLoading ? "Menyiapkan arsip..." : label}</span>
    </button>
  );
}
