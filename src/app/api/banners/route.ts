import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(banners)
      .where(eq(banners.aktif, true))
      .orderBy(asc(banners.urutan));

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("GET Banners Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat banner" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judul, gambarUrl, tautan, urutan, aktif } = body;

    const newBanner = await db.insert(banners).values({
      judul,
      gambarUrl,
      tautan: tautan || "/katalog",
      urutan: Number(urutan) || 1,
      aktif: aktif !== undefined ? Boolean(aktif) : true,
    }).returning();

    return NextResponse.json({ success: true, data: newBanner[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan banner" }, { status: 500 });
  }
}
