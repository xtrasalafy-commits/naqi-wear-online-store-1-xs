import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const art = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);

    if (art.length === 0) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: art[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat artikel" }, { status: 500 });
  }
}
