import { and, eq } from "drizzle-orm";
import { db, productsInventoryTable } from "@workspace/db";
import { appDataPatchesTable } from "@workspace/db/schema";

const PATCH_ID = "inventory-stock-snapshot-2026-09-05";

const stockSnapshot = [
  ["NAD+ 500mg", 103],
  ["Cagrilintide 5mg", 25],
  ["Cagrilintide 10mg", 25],
  ["AOD-9604 5mg", 20],
  ["DSIP 10mg", 7],
  ["DSIP 5mg", 26],
  ["GLOW BLEND 70mg", 33],
  ["BPC-157 + TB-500 Blend 10mg", 16],
  ["BPC-157 + TB-500 Blend 20mg", 4],
  ["BPC-157 10mg", 76],
  ["GHK-Cu 50mg", 7],
  ["GHK-Cu 100mg", 65],
  ["KLOW BLEND 80mg", 50],
  ["MOTS-C 10mg", 14],
  ["MOTS-C 20mg", 57],
  ["KPV 10mg", 52],
  ["Kisspeptin-10 10mg", 23],
  ["Kisspeptin-10 5mg", 10],
  ["TB-500 10mg", 42],
  ["TB-500 5mg", 10],
  ["TB-500 Fragment (17-23) 10mg", 25],
  ["Melanotan 1 10mg", 15],
  ["Melanotan 2 10mg", 10],
  ["Semax 10mg", 29],
  ["Selank 10mg", 28],
  ["N-Acetyl Semax Amidate 10mg", 9],
  ["N-Acetyl Selank Amidate 10mg", 9],
  ["N-Acetyl Epithalon Amidate 5mg", 19],
  ["Semax + Selank Blend 20mg", 1],
  ["5-Amino-1MQ 50mg", 85],
  ["Retatrutide 10mg", 20],
  ["Retatrutide 20mg", 5],
  ["Retatrutide 30mg", 23],
  ["Retatrutide 40mg", 71],
  ["Retatrutide 50mg", 10],
  ["Retatrutide 60mg", 5],
  ["Tirzepatide 10mg", 10],
  ["Tirzepatide 30mg", 38],
  ["Tirzepatide 45mg", 68],
  ["Tirzepatide 60mg", 91],
  ["LL-37 5mg", 7],
  ["Thymosin Alpha-1 10mg", 32],
  ["CJC-1295 No DAC + Ipamorelin 5mg", 14],
  ["Tesamorelin 20mg", 15],
  ["ARA-290 16mg", 35],
  ["Epithalon 10mg", 5],
  ["PE-22-28 10mg", 19],
  ["SS-31 10mg", 10],
  ["VIP 10mg", 25],
] as const;

export async function applyInventoryStockSnapshot(): Promise<{ applied: boolean; updated: number }> {
  return db.transaction(async (tx) => {
    const [claim] = await tx
      .insert(appDataPatchesTable)
      .values({ id: PATCH_ID })
      .onConflictDoNothing()
      .returning({ id: appDataPatchesTable.id });

    if (!claim) return { applied: false, updated: 0 };

    let updated = 0;
    for (const [productName, stockLevel] of stockSnapshot) {
      const changed = await tx
        .update(productsInventoryTable)
        .set({ stockLevel })
        .where(and(
          eq(productsInventoryTable.productName, productName),
          eq(productsInventoryTable.isPublished, true),
        ))
        .returning({ id: productsInventoryTable.id });
      updated += changed.length;
    }

    if (updated !== stockSnapshot.length) {
      throw new Error(
        `Inventory stock snapshot matched ${updated} of ${stockSnapshot.length} published products`,
      );
    }

    return { applied: true, updated };
  });
}