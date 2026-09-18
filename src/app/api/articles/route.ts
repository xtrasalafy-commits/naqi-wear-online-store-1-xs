import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(articles).orderBy(desc(articles.createdAt));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat artikel" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { judul, slug, kategori, ringkasan, konten, gambarUrl, penulis } = body;

    const newArt = await db.insert(articles).values({
      judul,
      slug: slug || judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      kategori: kategori || "Tips Fashion",
      ringkasan,
      konten,
      gambarUrl: gambarUrl || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
      penulis: penulis || "Tim NAQI WEAR",
    }).returning();

    return NextResponse.json({ success: true, data: newArt[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal menyimpan artikel" }, { status: 500 });
  }
}
