import test from "node:test";
import assert from "node:assert/strict";

import { normalizeProduct, normalizeTransactionItem } from "./supabase-data";

test("normalizeTransactionItem mempertahankan quantity add-on dalam riwayat transaksi", () => {
  const item = normalizeTransactionItem({
    name: "Cappuccino",
    quantity: 2,
    price: 25000,
    addons: [
      { name: "Normal Sugar", quantity: 2 },
      { name: "Extra Shot", quantity: 1 },
    ],
  } as any);

  assert.deepEqual(item.addons, [
    { name: "Normal Sugar", quantity: 2, price: 0 },
    { name: "Extra Shot", quantity: 1, price: 0 },
  ]);
});

test("normalizeProduct mempertahankan recipe dan addons dari payload Supabase", () => {
  const row = {
    id: "p-1",
    name: "Es Kopi Aren",
    price: 22000,
    category: "Minuman",
    created_by: "admin",
    recipe: [
      { ingredient: "Bubuk Kopi", gramsPerPortion: 18 },
      { ingredient: "Susu", gramsPerPortion: 120 },
    ],
    addons: [
      { id: "a-1", name: "Keju", group: "Toping", price: 3000 },
      { id: "a-2", name: "Extra Shot", group: "Ekstra", price: 5000 },
    ],
  };

  const product = normalizeProduct(row as any);

  assert.deepEqual(product.recipe, [
    { ingredient: "Bubuk Kopi", gramsPerPortion: 18 },
    { ingredient: "Susu", gramsPerPortion: 120 },
  ]);
  assert.deepEqual(product.addons, [
    { id: "a-1", name: "Keju", group: "Toping", price: 3000 },
    { id: "a-2", name: "Extra Shot", group: "Ekstra", price: 5000 },
    { id: "sugar-normal", name: "Normal Sugar", group: "Sugar Level", price: 0 },
    { id: "sugar-less", name: "Less Sugar", group: "Sugar Level", price: 0 },
    { id: "sugar-no", name: "No Sugar", group: "Sugar Level", price: 0 },
  ]);
});
