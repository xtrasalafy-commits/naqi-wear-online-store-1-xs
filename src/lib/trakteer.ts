/**
 * Konfigurasi Trakteer & atribusi Open Source.
 * --------------------------------------------
 * Semua nilai dapat dioverride lewat environment variable (lihat .env.example).
 *
 * Open Source oleh MZF - 2026
 */

export const TRAKTEER_URL =
  process.env.NEXT_PUBLIC_TRAKTEER_URL || "https://trakteer.id/perpus_opera";

/** Harga 1 unit traktiran (default Rp6.000, nominal lain harus kelipatannya). */
export const TRAKTEER_UNIT_PRICE = Number(
  process.env.NEXT_PUBLIC_TRAKTEER_UNIT_PRICE || 6000,
);

/** Nama unit traktiran yang tampil di widget (mis. "Kopi"). */
export const TRAKTEER_UNIT_LABEL =
  process.env.NEXT_PUBLIC_TRAKTEER_UNIT_LABEL || "Kopi";

/** Pengali nominal cepat yang ditampilkan di widget: 1x s.d. 5x harga satuan. */
export const TRAKTEER_NOMINAL_MULTIPLIERS = [1, 2, 3, 4, 5];

export const TRAKTEER_MESSAGE =
  "Web app ini gratis & bebas iklan. Traktir kopi untuk bantu biaya server?";

export const TRAKTEER_HANDLE = `@${TRAKTEER_URL.replace(/\/+$/, "")
  .split("/")
  .pop()}`;

export const TRAKTEER_TIP_PAGE_URL = `${TRAKTEER_URL.replace(/\/+$/, "")}/tip`;

/** Nama berkas arsip source code yang diunduh pengguna. */
export const SOURCE_CODE_ARCHIVE_NAME = "naqi-wear-open-source-mzf-2026.zip";

export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO ||
  "https://github.com/xtrasalafy-commits/naqi-wear-online-store-1-xs";

export const OPEN_SOURCE_CREDIT = "Open Source oleh MZF - 2026";

export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/**
 * Membuat link halaman Trakteer untuk nominal tertentu.
 * Parameter `quantity` dipakai Trakteer untuk mengisi jumlah unit (harga satuan).
 */
export function buildTrakteerTipUrl(nominal: number) {
  const quantity = Math.max(1, Math.round(nominal / TRAKTEER_UNIT_PRICE));
  return `${TRAKTEER_TIP_PAGE_URL}?quantity=${quantity}`;
}

/** Link langsung ke halaman Trakteer dengan nominal default (6.000). */
export function buildDefaultTrakteerTipUrl() {
  return buildTrakteerTipUrl(TRAKTEER_UNIT_PRICE);
}