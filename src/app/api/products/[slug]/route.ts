import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productImages, productVariants, reviews } from "@/db/schema";
import { eq, or, asc, desc, ne, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let prodQuery;
    if (!isNaN(Number(slug))) {
      prodQuery = await db.select().from(products).where(eq(products.id, Number(slug))).limit(1);
    } else {
      prodQuery = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    }

    if (prodQuery.length === 0) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const product = prodQuery[0];

    // Images
    const imgs = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.urutan));

    // Variants
    const vars = await db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.productId, product.id), eq(productVariants.aktif, true)));

    // Category Name
    const cat = await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1);

    // Reviews
    const revs = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt));

    const avgRating =
      revs.length > 0
        ? Number((revs.reduce((acc, curr) => acc + curr.rating, 0) / revs.length).toFixed(1))
        : 4.9;

    // Related products (same category or gender)
    const related = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, "aktif"),
          ne(products.id, product.id),
          eq(products.categoryId, product.categoryId)
        )
      )
      .limit(4);

    const enrichedRelated = await Promise.all(
      related.map(async (p) => {
        const pImgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).limit(1);
        return {
          ...p,
          gambarUtama: pImgs.length > 0 ? pImgs[0].gambarUrl : "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        categoryName: cat.length > 0 ? cat[0].nama : "Fashion Syar'i",
        categorySlug: cat.length > 0 ? cat[0].slug : "wanita",
        images: imgs,
        variants: vars,
        reviews: revs,
        avgRating,
        reviewCount: revs.length,
        relatedProducts: enrichedRelated,
      },
    });
  } catch (error) {
    console.error("GET Product Detail Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat detail produk" }, { status: 500 });
  }
}
