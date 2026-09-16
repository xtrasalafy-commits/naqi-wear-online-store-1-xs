import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products, users } from "@/db/schema";
import { ensureDatabaseInitialized } from "@/db/init";
import { count, sum, desc, eq, gte } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDatabaseInitialized();

    const allOrders = await db.select().from(orders);
    const totalOrders = allOrders.length;

    const totalRevenue = allOrders
      .filter((o) => o.statusPembayaran === "dibayar" || o.statusPesanan !== "dibatalkan")
      .reduce((acc, curr) => acc + curr.total, 0);

    const totalUsers = (await db.select({ val: count() }).from(users))[0]?.val || 0;
    const totalProducts = (await db.select({ val: count() }).from(products))[0]?.val || 0;

    const itemsSold = (await db.select({ val: sum(orderItems.qty) }).from(orderItems))[0]?.val || 0;

    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

    // Mock 7-day sales chart data
    const sales7Days = [
      { hari: "Senin", total: 1250000, transaksi: 4 },
      { hari: "Selasa", total: 1890000, transaksi: 6 },
      { hari: "Rabu", total: 2450000, transaksi: 8 },
      { hari: "Kamis", total: 1980000, transaksi: 7 },
      { hari: "Jumat", total: 3200000, transaksi: 12 },
      { hari: "Sabtu", total: 4100000, transaksi: 15 },
      { hari: "Minggu", total: 3850000, transaksi: 14 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        itemsSold: Number(itemsSold),
        sales7Days,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat statistik admin" }, { status: 500 });
  }
}
