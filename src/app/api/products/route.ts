import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productImages, productVariants, reviews } from "@/db/schema";
import { eq, ilike, and, gte, lte, desc, asc, sql, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || searchParams.get("kategori") || "";
    const gender = searchParams.get("gender") || "";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const sort = searchParams.get("sort") || "terbaru";
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;

    let categoryIdFilter = null;
    if (categorySlug && categorySlug !== "semua") {
      const catObj = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
      if (catObj.length > 0) {
        categoryIdFilter = catObj[0].id;
      }
    }

    const conditions = [eq(products.status, "aktif")];

    if (q) {
      conditions.push(
        or(
          ilike(products.nama, `%${q}%`),
          ilike(products.deskripsi, `%${q}%`),
          ilike(products.bahan, `%${q}%`)
        )!
      );
    }

    if (categoryIdFilter) {
      conditions.push(eq(products.categoryId, categoryIdFilter));
    }

    if (gender && gender !== "semua") {
      conditions.push(eq(products.gender, gender));
    }

    if (featured) {
      conditions.push(eq(products.unggulan, true));
    }

    if (bestseller) {
      conditions.push(eq(products.terlaris, true));
    }

    if (minPrice !== null && !isNaN(minPrice)) {
      conditions.push(gte(products.hargaDasar, minPrice));
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      conditions.push(lte(products.hargaDasar, maxPrice));
    }

    let orderByClause = desc(products.createdAt);
    if (sort === "murah") {
      orderByClause = asc(products.hargaDasar);
    } else if (sort === "mahal") {
      orderByClause = desc(products.hargaDasar);
    } else if (sort === "terlaris") {
      orderByClause = desc(products.terlaris);
    }

    const productList = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        nama: products.nama,
        slug: products.slug,
        deskripsi: products.deskripsi,
        bahan: products.bahan,
        gender: products.gender,
        hargaDasar: products.hargaDasar,
        hargaDiskon: products.hargaDiskon,
        beratGram: products.beratGram,
        status: products.status,
        unggulan: products.unggulan,
        terlaris: products.terlaris,
        badgeSyari: products.badgeSyari,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit);

    // Fetch images and calculate review rating for each product
    const enrichedProducts = await Promise.all(
      productList.map(async (prod) => {
        const images = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, prod.id))
          .orderBy(asc(productImages.urutan));

        const revs = await db
          .select({ rating: reviews.rating })
          .from(reviews)
          .where(eq(reviews.productId, prod.id));

        const avgRating =
          revs.length > 0
            ? Number((revs.reduce((acc, curr) => acc + curr.rating, 0) / revs.length).toFixed(1))
            : 5.0;

        return {
          ...prod,
          gambarUtama: images.length > 0 ? images[0].gambarUrl : "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
          gambar: images.map((img) => img.gambarUrl),
          avgRating,
          reviewCount: revs.length || 12,
        };
      })
    );

    return NextResponse.json({ success: true, data: enrichedProducts });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nama,
      slug,
      categoryId,
      deskripsi,
      bahan,
      gender,
      hargaDasar,
      hargaDiskon,
      beratGram,
      unggulan,
      terlaris,
      badgeSyari,
      gambarUrls,
      variants,
    } = body;

    const generatedSlug = slug || nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const newProd = await db.insert(products).values({
      nama,
      slug: generatedSlug,
      categoryId: categoryId || 1,
      deskripsi: deskripsi || "",
      bahan: bahan || "Katun Premium",
      gender: gender || "wanita",
      hargaDasar: Number(hargaDasar),
      hargaDiskon: Number(hargaDiskon) || 0,
      beratGram: Number(beratGram) || 250,
      status: "aktif",
      unggulan: Boolean(unggulan),
      terlaris: Boolean(terlaris),
      badgeSyari: badgeSyari || ["Tidak Menerawang", "Wudhu Friendly", "Panjang Syar'i"],
    }).returning();

    const createdProduct = newProd[0];

    // Add Images
    if (gambarUrls && Array.isArray(gambarUrls) && gambarUrls.length > 0) {
      for (let i = 0; i < gambarUrls.length; i++) {
        await db.insert(productImages).values({
          productId: createdProduct.id,
          gambarUrl: gambarUrls[i],
          altText: `${nama} ${i + 1}`,
          urutan: i + 1,
          utama: i === 0,
        });
      }
    } else {
      await db.insert(productImages).values({
        productId: createdProduct.id,
        gambarUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
        altText: nama,
        urutan: 1,
        utama: true,
      });
    }

    // Add Variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        await db.insert(productVariants).values({
          productId: createdProduct.id,
          sku: v.sku || `NQ-${createdProduct.id}-${v.warna?.substring(0, 2).toUpperCase()}-${v.ukuran}`,
          warna: v.warna || "Standar",
          ukuran: v.ukuran || "All Size",
          harga: Number(v.harga) || Number(hargaDiskon) || Number(hargaDasar),
          stok: Number(v.stok) || 10,
          gambarUrl: v.gambarUrl || (gambarUrls?.[0] || ""),
          beratGram: Number(beratGram) || 250,
          aktif: true,
        });
      }
    } else {
      // Default variants
      const colors = ["Hijau Zamrud", "Emas Khaki", "Krem Murni"];
      const sizes = ["S", "M", "L", "XL"];
      for (const c of colors) {
        for (const s of sizes) {
          await db.insert(productVariants).values({
            productId: createdProduct.id,
            sku: `NQ-${createdProduct.id}-${c.substring(0, 2).toUpperCase()}-${s}`,
            warna: c,
            ukuran: s,
            harga: Number(hargaDiskon) || Number(hargaDasar),
            stok: 15,
            gambarUrl: gambarUrls?.[0] || "",
            beratGram: Number(beratGram) || 250,
            aktif: true,
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Produk berhasil ditambahkan", data: createdProduct });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan produk baru" }, { status: 500 });
  }
}
