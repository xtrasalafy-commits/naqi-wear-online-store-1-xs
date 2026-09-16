import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { kode, subtotal } = await req.json();

    if (!kode) {
      return NextResponse.json({ success: false, error: "Silakan masukkan kode voucher" }, { status: 400 });
    }

    const found = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.kode, kode.toUpperCase().trim()), eq(coupons.aktif, true)))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json({ success: false, error: "Kode voucher tidak ditemukan atau tidak aktif" }, { status: 404 });
    }

    const c = found[0];

    if (subtotal && subtotal < (c.minimalOrder || 0)) {
      return NextResponse.json({
        success: false,
        error: `Minimal belanja Rp ${(c.minimalOrder || 0).toLocaleString("id-ID")} untuk pakai kode ini`,
      }, { status: 400 });
    }

    let calculatedDiscount = 0;
    if (c.tipe === "persen") {
      calculatedDiscount = Math.round((subtotal * c.nilai) / 100);
      if (c.maksimalDiskon && calculatedDiscount > c.maksimalDiskon) {
        calculatedDiscount = c.maksimalDiskon;
      }
    } else {
      calculatedDiscount = c.nilai;
    }

    return NextResponse.json({
      success: true,
      message: `Voucher ${c.kode} berhasil dipasang!`,
      data: {
        kode: c.kode,
        diskon: calculatedDiscount,
        minimalOrder: c.minimalOrder,
        tipe: c.tipe,
        nilai: c.nilai
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses kode voucher" }, { status: 500 });
  }
}
