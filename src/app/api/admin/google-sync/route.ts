import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, orders, reviews, coupons, banners, articles } from "@/db/schema";

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);
    const allOrders = await db.select().from(orders);
    const allReviews = await db.select().from(reviews);
    const allCoupons = await db.select().from(coupons);

    const appsScriptCode = `/**
 * GOOGLE APPS SCRIPT FOR NAQI WEAR
 * Spreadsheet: NAQI_WEARDATA
 * Drive Folders: NAQI_WEAR_ASSETS, NAQI_WEAR_DB
 */

function doGet(e) {
  var action = e.parameter.action || 'getProducts';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getProducts') {
    var sheet = ss.getSheetByName('Products');
    var data = sheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', store: 'NAQI WEAR' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (data.action === 'createOrder') {
    var sheet = ss.getSheetByName('Orders');
    sheet.appendRow([
      data.order.id,
      data.order.nomorPesanan,
      data.order.total,
      data.order.statusPesanan,
      new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Pesanan tersimpan ke Google Sheets!' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'received' }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

    return NextResponse.json({
      success: true,
      googleAppsScriptCode: appsScriptCode,
      exportData: {
        products: allProducts,
        categories: allCategories,
        orders: allOrders,
        reviews: allReviews,
        coupons: allCoupons,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses sync Google" }, { status: 500 });
  }
}
