import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(coupons).where(eq(coupons.aktif, true));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat kupon promo" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kode, tipe, nilai, minimalOrder, maksimalDiskon, kuota } = body;

    const newCoupon = await db.insert(coupons).values({
      kode: kode.toUpperCase().trim(),
      tipe: tipe || "persen",
      nilai: Number(nilai),
      minimalOrder: Number(minimalOrder) || 0,
      maksimalDiskon: Number(maksimalDiskon) || 0,
      kuota: Number(kuota) || 100,
      terpakai: 0,
      mulai: "2025-01-01",
      berakhir: "2026-12-31",
      aktif: true,
    }).returning();

    return NextResponse.json({ success: true, data: newCoupon[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan kupon baru" }, { status: 500 });
  }
}
