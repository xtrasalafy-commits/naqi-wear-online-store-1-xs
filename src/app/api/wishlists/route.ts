import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishlists, products, productImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId")) || 1;

    const list = await db.select().from(wishlists).where(eq(wishlists.userId, userId));

    const enriched = await Promise.all(
      list.map(async (w) => {
        const prod = await db.select().from(products).where(eq(products.id, w.productId)).limit(1);
        if (prod.length === 0) return null;
        const imgs = await db.select().from(productImages).where(eq(productImages.productId, w.productId)).limit(1);
        return {
          wishlistId: w.id,
          ...prod[0],
          gambarUtama: imgs[0]?.gambarUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
        };
      })
    );

    return NextResponse.json({ success: true, data: enriched.filter(Boolean) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId = 1, productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID diperlukan" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      // Remove if already in wishlist (toggle behavior)
      await db.delete(wishlists).where(eq(wishlists.id, existing[0].id));
      return NextResponse.json({ success: true, action: "removed", message: "Dihapus dari Wishlist" });
    } else {
      await db.insert(wishlists).values({ userId, productId });
      return NextResponse.json({ success: true, action: "added", message: "Ditambahkan ke Wishlist" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengubah wishlist" }, { status: 500 });
  }
}
