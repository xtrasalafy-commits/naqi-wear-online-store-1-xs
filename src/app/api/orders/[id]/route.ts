import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let ordQuery;
    if (!isNaN(Number(id))) {
      ordQuery = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
    } else {
      ordQuery = await db.select().from(orders).where(eq(orders.nomorPesanan, id)).limit(1);
    }

    if (ordQuery.length === 0) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const order = ordQuery[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const pymt = await db.select().from(payments).where(eq(payments.orderId, order.id)).limit(1);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        payment: pymt[0] || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memuat detail pesanan" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { statusPesanan, statusPembayaran, resi, returAlasan, returFotoUrl } = body;

    const orderId = Number(id);

    const updateData: Record<string, any> = {};
    if (statusPesanan) updateData.statusPesanan = statusPesanan;
    if (statusPembayaran) updateData.statusPembayaran = statusPembayaran;
    if (resi !== undefined) updateData.resi = resi;
    if (returAlasan) updateData.returAlasan = returAlasan;
    if (returFotoUrl) updateData.returFotoUrl = returFotoUrl;

    const updated = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    if (statusPembayaran === "dibayar") {
      await db
        .update(payments)
        .set({ status: "berhasil", dibayarPada: new Date() })
        .where(eq(payments.orderId, orderId));
    }

    return NextResponse.json({ success: true, message: "Status pesanan berhasil diperbarui", data: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memperbarui status pesanan" }, { status: 500 });
  }
}
