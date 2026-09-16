import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { ensureDatabaseInitialized } from "@/db/init";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let revList;
    if (productId) {
      revList = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, Number(productId)))
        .orderBy(desc(reviews.createdAt));
    } else {
      revList = await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(30);
    }

    return NextResponse.json({ success: true, data: revList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat ulasan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, namaPengulas, rating, judul, komentar, gambarUrlJson } = body;

    if (!productId || !rating || !komentar) {
      return NextResponse.json({ success: false, error: "Harap lengkapi rating dan ulasan Anda" }, { status: 400 });
    }

    const newReview = await db.insert(reviews).values({
      productId: Number(productId),
      namaPengulas: namaPengulas || "Pelanggan Setia NAQI",
      rating: Number(rating),
      judul: judul || "Ulasan Pembelian",
      komentar: komentar,
      gambarUrlJson: gambarUrlJson || [],
      terverifikasi: true,
      status: "disetujui",
    }).returning();

    return NextResponse.json({ success: true, message: "Terima kasih atas ulasan syar'i Anda!", data: newReview[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengirimkan ulasan" }, { status: 500 });
  }
}
