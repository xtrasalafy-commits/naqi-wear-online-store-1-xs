import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import JSZip from "jszip";
import { SOURCE_CODE_ARCHIVE_NAME } from "@/lib/trakteer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Route ini membungkus seluruh source code proyek menjadi satu file .zip
 * supaya pengunjung web app bisa mengunduh kode lengkapnya langsung dari
 * dalam aplikasi (tanpa perlu login/clone repository).
 *
 * Open Source oleh MZF - 2026
 */

const ROOT_DIR = process.cwd();
const ARCHIVE_NAME = SOURCE_CODE_ARCHIVE_NAME;

// Folder yang tidak perlu ikut dibundel (dependensi, build, cache, meta editor).
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".kilo",
  ".vercel",
  ".turbo",
  ".swc",
  "coverage",
  "dist",
  "build",
  "out",
]);

// File yang tidak perlu / tidak boleh ikut dibundel.
const IGNORED_FILES = new Set([
  ".env",
  ".env.local",
  ".DS_Store",
  "Thumbs.db",
  "tsconfig.tsbuildinfo",
  "npm-debug.log",
  "yarn-error.log",
]);

// Batasi ukuran tiap file (misal aset gambar besar) agar proses zip tetap ringan.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const INFO_FILE_NAME = "OPEN_SOURCE_MZF_2026.txt";

async function addDirectoryToZip(
  zip: JSZip,
  absoluteDir: string,
  relativeDir = "",
): Promise<number> {
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry.name);
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      fileCount += await addDirectoryToZip(zip, absolutePath, relativePath);
      continue;
    }

    if (!entry.isFile()) continue;
    if (IGNORED_FILES.has(entry.name) || entry.name.startsWith(".env")) continue;

    const stats = await fs.stat(absolutePath);
    if (stats.size > MAX_FILE_BYTES) continue;

    const content = await fs.readFile(absolutePath);
    zip.file(relativePath, content);
    fileCount += 1;
  }

  return fileCount;
}

export async function GET() {
  try {
    const zip = new JSZip();
    const fileCount = await addDirectoryToZip(zip, ROOT_DIR);

    if (fileCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Source code tidak dapat dibaca dari server ini. Silakan unduh melalui repositori GitHub proyek.",
        },
        { status: 503 },
      );
    }

    zip.file(
      INFO_FILE_NAME,
      [
        "NAQI WEAR - Toko Online Fashion Muslim Syar'i",
        "==============================================",
        "",
        `Arsip source code lengkap ini dibuat otomatis pada: ${new Date().toISOString()}`,
        `Jumlah berkas: ${fileCount}`,
        "",
        "Open Source oleh MZF - 2026",
        "Silakan baca README.md di dalam arsip untuk panduan instalasi & konfigurasi.",
        "",
        "Catatan: folder node_modules, .next, .git, dan berkas rahasia (.env) tidak disertakan.",
        "Jalankan `npm install` lalu `npm run dev` setelah mengekstrak arsip ini.",
        "",
      ].join("\n"),
    );

    const archive = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new NextResponse(archive, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${ARCHIVE_NAME}"`,
        "Content-Length": String(archive.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gagal membuat arsip source code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat membungkus source code. Silakan coba lagi.",
      },
      { status: 500 },
    );
  }
}
