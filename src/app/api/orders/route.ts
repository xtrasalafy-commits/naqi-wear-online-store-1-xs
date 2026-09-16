import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, payments, notifications } from "@/db/schema";
import { ensureDatabaseInitialized } from "@/db/init";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let orderList;
    if (userId) {
      orderList = await db.select().from(orders).where(eq(orders.userId, Number(userId))).orderBy(desc(orders.createdAt));
    } else {
      orderList = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
    }

    const enrichedOrders = await Promise.all(
      orderList.map(async (ord) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, ord.id));
        return {
          ...ord,
          items,
        };
      })
    );

    return NextResponse.json({ success: true, data: enrichedOrders });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat data pesanan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      snapshotAlamat,
      items,
      subtotal,
      diskon,
      ongkir,
      total,
      kurir,
      layanan,
      metodePembayaran,
      catatan,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Keranjang belanja kosong" }, { status: 400 });
    }

    // Generate readable order number: NQ-YYYYMMDD-XXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const nomorPesanan = `NQ-${dateStr}-${randomSuffix}`;

    const newOrder = await db.insert(orders).values({
      nomorPesanan,
      userId: userId ? Number(userId) : null,
      snapshotAlamat,
      subtotal: Number(subtotal),
      diskon: Number(diskon) || 0,
      ongkir: Number(ongkir) || 0,
      total: Number(total),
      kurir: kurir || "JNE REG",
      layanan: layanan || "Reguler (2-3 hari)",
      statusPembayaran: "menunggu_pembayaran",
      statusPesanan: "menunggu_bayar",
      catatan: catatan || "",
    }).returning();

    const createdOrder = newOrder[0];

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: createdOrder.id,
        productId: item.productId,
        variantId: item.variantId || null,
        snapshotNama: item.nama,
        snapshotSku: item.sku || "NQ-GENERIC",
        snapshotVarian: `${item.warna || ""} / ${item.ukuran || ""}`,
        qty: item.qty,
        harga: item.harga,
        subtotal: item.harga * item.qty,
      });
    }

    // Insert Payment record
    await db.insert(payments).values({
      orderId: createdOrder.id,
      metode: metodePembayaran || "QRIS",
      idTransaksi: `TRX-${createdOrder.id}-${Date.now()}`,
      jumlah: Number(total),
      status: "menunggu",
    });

    // Create notification
    await db.insert(notifications).values({
      userId: userId ? Number(userId) : null,
      tipe: "pesanan_baru",
      judul: "Pesanan Berhasil Dibuat",
      pesan: `Pesanan #${nomorPesanan} berhasil dibuat. Silakan lakukan pembayaran agar segera diproses.`,
      dibaca: false,
    });

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      data: {
        ...createdOrder,
        metodePembayaran,
      }
    });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat pesanan" }, { status: 500 });
  }
}
