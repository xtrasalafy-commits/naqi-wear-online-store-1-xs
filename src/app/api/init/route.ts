import { NextResponse } from "next/server";
import { ensureDatabaseInitialized } from "@/db/init";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    return NextResponse.json({ success: true, message: "Database NAQI WEAR siap digunakan." });
  } catch (error) {
    console.error("Init Error:", error);
    return NextResponse.json({ success: false, error: "Gagal inisialisasi database" }, { status: 500 });
  }
}
