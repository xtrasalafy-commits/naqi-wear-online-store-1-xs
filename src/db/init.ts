import { db } from "./index";
import { products } from "./schema";
import { seedDatabase } from "./seed";

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export function ensureDatabaseInitialized() {
  if (isInitialized) {
    return Promise.resolve();
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length === 0) {
        console.log("Database is empty. Running seed...");
        await seedDatabase();
      }
      isInitialized = true;
    })().finally(() => {
      initializationPromise = null;
    });
  }

  return initializationPromise;
}
