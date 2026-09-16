import { db } from "./index";
import { products } from "./schema";
import { seedDatabase } from "./seed";

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return;
  try {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length === 0) {
      console.log("Database is empty. Running seed...");
      await seedDatabase();
    }
    isInitialized = true;
  } catch (err) {
    console.error("Error checking or seeding database:", err);
  }
}
