import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const catList = await db.select().from(categories).orderBy(asc(categories.urutan));

    // Get item counts
    const enriched = await Promise.all(
      catList.map(async (c) => {
        const prodCount = await db
          .select({ value: count() })
          .from(products)
          .where(eq(products.categoryId, c.id));
        return {
          ...c,
          itemCount: prodCount[0]?.value || 0,
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat kategori" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, slug, parentId, gambarUrl, urutan } = body;

    const newCat = await db
      .insert(categories)
      .values({
        nama,
        slug: slug || nama.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        parentId: parentId ? Number(parentId) : null,
        gambarUrl: gambarUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500",
        urutan: Number(urutan) || 0,
      })
      .returning();

    return NextResponse.json({ success: true, message: "Kategori berhasil disimpan", data: newCat[0] });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan kategori" }, { status: 500 });
  }
}
