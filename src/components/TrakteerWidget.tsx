"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Coffee,
  X,
  QrCode,
  ExternalLink,
  Copy,
  Download,
  Loader2,
  HeartHandshake,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import DownloadSourceButton from "@/components/DownloadSourceButton";
import {
  TRAKTEER_HANDLE,
  TRAKTEER_MESSAGE,
  TRAKTEER_NOMINAL_MULTIPLIERS,
  TRAKTEER_UNIT_LABEL,
  TRAKTEER_UNIT_PRICE,
  buildTrakteerTipUrl,
  formatRupiah,
} from "@/lib/trakteer";

/**
 * Floating Widget Trakteer
 * ------------------------
 * Widget mengapung di sudut kanan bawah layar. Ketika diklik, pengguna dapat
 * memilih nominal traktiran (mulai Rp6.000 dan kelipatannya) lalu langsung
 * melihat QR Code di dalam web app ini tanpa berpindah halaman.
 *
 * Open Source oleh MZF - 2026
 */

// Konfigurasi utama ada di "@/lib/trakteer" agar mudah diubah / dioverride lewat .env.
const WIDGET_MESSAGE = TRAKTEER_MESSAGE;
const NOMINAL_MULTIPLIERS = TRAKTEER_NOMINAL_MULTIPLIERS;

export default function TrakteerWidget() {
  const { showToast } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState(TRAKTEER_UNIT_PRICE);
  const [customNominal, setCustomNominal] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isQrLoading, setIsQrLoading] = useState(false);

  const nominalOptions = useMemo(
    () => NOMINAL_MULTIPLIERS.map((multiplier) => multiplier * TRAKTEER_UNIT_PRICE),
    [],
  );

  const tipUrl = useMemo(
    () => buildTrakteerTipUrl(selectedNominal),
    [selectedNominal],
  );
  const unitCount = Math.max(1, Math.round(selectedNominal / TRAKTEER_UNIT_PRICE));

  // Tutup panel dengan tombol Escape agar nyaman dipakai di desktop.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // QR Code dibuat lokal di browser (paket `qrcode`) sehingga tidak butuh request ke server.
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    const generateQr = async () => {
      setIsQrLoading(true);
      try {
        const { toDataURL } = await import("qrcode");
        const dataUrl = await toDataURL(buildTrakteerTipUrl(selectedNominal), {
          width: 480,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#1B4332", light: "#FFFFFF" },
        });
        if (!isCancelled) setQrDataUrl(dataUrl);
      } catch (error) {
        console.error("Gagal membuat QR Code Trakteer:", error);
        if (!isCancelled) setQrDataUrl("");
      } finally {
        if (!isCancelled) setIsQrLoading(false);
      }
    };

    generateQr();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, selectedNominal]);

  const handleSelectNominal = (nominal: number) => {
    setSelectedNominal(nominal);
    setCustomNominal("");
  };

  const handleApplyCustomNominal = () => {
    const parsed = Number(customNominal.replace(/\D/g, ""));

    if (!parsed || parsed < TRAKTEER_UNIT_PRICE) {
      showToast(`Nominal minimal ${formatRupiah(TRAKTEER_UNIT_PRICE)} ya.`);
      return;
    }

    if (parsed % TRAKTEER_UNIT_PRICE !== 0) {
      showToast(
        `Nominal harus kelipatan ${formatRupiah(TRAKTEER_UNIT_PRICE)} (mis. 6.000, 12.000, 18.000).`,
      );
      return;
    }

    setSelectedNominal(parsed);
    showToast(`✓ Nominal ${formatRupiah(parsed)} siap ditraktir.`);
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      showToast("✓ Link Trakteer dengan nominal terpilih berhasil disalin!");
    } catch {
      showToast("Browser tidak mengizinkan menyalin otomatis. Silakan salin manual.");
    }
  }, [showToast, tipUrl]);

  const handleDownloadQr = useCallback(() => {
    if (!qrDataUrl) {
      showToast("QR Code belum siap. Tunggu sebentar ya.");
      return;
    }
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = qrDataUrl;
    downloadAnchor.download = `trakteer-${TRAKTEER_HANDLE.replace("@", "")}-${selectedNominal}.png`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("✓ Gambar QR Code berhasil diunduh!");
  }, [qrDataUrl, selectedNominal, showToast]);

  return (
    <div className="fixed bottom-36 md:bottom-24 right-4 z-40 flex flex-col items-end gap-3 print:hidden">
      {isOpen && (
        <div
          role="dialog"
          aria-label="Dukung NAQI WEAR lewat Trakteer"
          className="w-[min(23rem,calc(100vw-2rem))] max-h-[72vh] overflow-y-auto bg-white rounded-3xl border-2 border-[#D4AF37]/60 shadow-2xl shadow-[#1B4332]/25 p-4 space-y-4 text-left"
        >
          {/* Header Panel */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-[#1B4332] leading-tight">
                  Traktir Kopi via Trakteer
                </h3>
                <p className="text-[11px] text-stone-500">
                  Dukung server web app ini — {TRAKTEER_HANDLE}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup widget Trakteer"
              className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed bg-amber-50 border border-amber-100 rounded-2xl p-3">
            {WIDGET_MESSAGE}
          </p>

          {/* Pilihan Nominal */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#1B4332]">
              1. Pilih nominal (kelipatan {formatRupiah(TRAKTEER_UNIT_PRICE)})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {nominalOptions.map((nominal) => {
                const isActive = nominal === selectedNominal;
                return (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => handleSelectNominal(nominal)}
                    aria-pressed={isActive}
                    className={`text-xs font-bold py-2.5 rounded-xl border transition-all active:scale-95 ${
                      isActive
                        ? "bg-[#1B4332] text-[#D4AF37] border-[#D4AF37]"
                        : "bg-white text-[#1B4332] border-stone-200 hover:border-[#D4AF37]"
                    }`}
                  >
                    {formatRupiah(nominal)}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={customNominal}
                onChange={(event) => setCustomNominal(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleApplyCustomNominal();
                }}
                placeholder="Nominal lain (mis. 36000)"
                aria-label="Nominal traktiran lain"
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] text-stone-700"
              />
              <button
                type="button"
                onClick={handleApplyCustomNominal}
                className="text-xs font-bold px-3 py-2.5 rounded-xl bg-[#D4AF37] text-[#1B4332] hover:bg-[#B38F24] active:scale-95"
              >
                Terapkan
              </button>
            </div>
          </div>
          {/* QR Code */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#1B4332] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" /> 2. Scan QR Code di dalam web app
            </p>
            <div className="bg-[#FDF6E3] border border-[#D4AF37]/40 rounded-3xl p-3 flex flex-col items-center gap-2">
              {isQrLoading ? (
                <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 text-stone-500">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1B4332]" />
                  <span className="text-[11px]">Membuat QR Code...</span>
                </div>
              ) : qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR Code Trakteer ${formatRupiah(selectedNominal)}`}
                  className="w-40 h-40 rounded-xl bg-white border border-stone-200 p-1"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-[11px] text-stone-500 text-center px-3">
                  QR Code gagal dibuat. Gunakan tombol &quot;Buka Trakteer&quot; di bawah.
                </div>
              )}

              <p className="text-[11px] text-stone-600 text-center leading-relaxed">
                QR berisi halaman Trakteer dengan nominal{" "}
                <strong className="text-[#1B4332]">{formatRupiah(selectedNominal)}</strong> (
                {unitCount} {TRAKTEER_UNIT_LABEL}).
              </p>
              <p className="text-[10px] text-stone-500 text-center">
                Scan pakai kamera HP / aplikasi e-wallet (QRIS, GoPay, OVO, DANA, ShopeePay).
              </p>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="text-[11px] font-bold text-[#1B4332] underline decoration-dotted flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Simpan gambar QR
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={tipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-[#D4AF37] font-bold text-xs px-3 py-2.5 rounded-xl border border-[#D4AF37]/40 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka Trakteer
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1.5 bg-[#FDF6E3] hover:bg-[#F7E8C4] text-[#1B4332] font-bold text-xs px-3 py-2.5 rounded-xl border border-[#D4AF37]/40 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" /> Salin Link
            </button>
          </div>

          {/* Ucapan Terima Kasih, Source Code & Atribusi */}
          <div className="pt-3 border-t border-amber-100 space-y-2">
            <p className="text-[11px] text-stone-600 flex items-start gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0 mt-0.5" />
              Traktiran Anda dipakai untuk biaya hosting, domain, dan pengembangan fitur baru.
              Jazakumullahu khairan!
            </p>
            <p className="text-[10px] text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Gratis, bebas iklan, dan tanpa perlu login untuk mendukung.
            </p>
            <DownloadSourceButton
              compact
              label="Download Source Code"
              className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-[#1B4332] font-bold text-[11px] px-3 py-2.5 rounded-xl border border-stone-200 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            />
            <p className="text-[10px] text-center text-stone-400 font-semibold">
              Open Source oleh MZF — 2026
            </p>
          </div>
        </div>
      )}

      {/* Tombol Mengapung di Sudut Kanan Bawah */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={WIDGET_MESSAGE}
        title={WIDGET_MESSAGE}
        className={`max-w-[calc(100vw-2rem)] flex items-center gap-2.5 text-left font-semibold rounded-2xl shadow-2xl px-4 py-3 border-2 transition-transform hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-[#D4AF37] text-[#1B4332] border-[#1B4332]/30"
            : "bg-[#1B4332] text-[#FDF6E3] border-[#D4AF37]"
        }`}
      >
        <Coffee
          className={`w-5 h-5 shrink-0 ${isOpen ? "text-[#1B4332]" : "text-[#D4AF37]"}`}
        />
        <span className="text-[11px] sm:text-xs leading-snug">{WIDGET_MESSAGE}</span>
        {isOpen ? (
          <X className="w-4 h-4 shrink-0 opacity-70" />
        ) : (
          <HeartHandshake className="w-4 h-4 shrink-0 text-[#D4AF37] hidden sm:block" />
        )}
      </button>
    </div>
  );
}
