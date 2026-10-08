import test from "node:test";
import assert from "node:assert/strict";

import {
  applyBomDeduction,
  convertKgToGrams,
  getLowStockIngredients,
} from "./bom";

test("konversi kg ke gram mengikuti rumus 1 kg = 1000 gram", () => {
  assert.equal(convertKgToGrams(5), 5000);
});

test("pengurangan BOM berbasis resep mengurangi stok bahan baku per porsi yang terjual", () => {
  const ingredients = [
    { id: "raw-1", name: "Biji Kopi", stockGrams: 5000, hppPerUnit: 2000, unit: "gram" as const },
    { id: "raw-2", name: "Gula Aren", stockGrams: 2000, hppPerUnit: 1500, unit: "gram" as const },
  ];

  const next = applyBomDeduction(ingredients, [
    { ingredient: "Biji Kopi", gramsPerPortion: 18 },
    { ingredient: "Gula Aren", gramsPerPortion: 20 },
  ], 3);

  assert.equal(next[0].stockGrams, 4946);
  assert.equal(next[1].stockGrams, 1940);
});

test("stok yang habis atau nol ditandai sebagai bahan baku rendah", () => {
  const ingredients = [
    { id: "raw-1", name: "Biji Kopi", stockGrams: 0, hppPerUnit: 2200, unit: "gram" as const },
    { id: "raw-2", name: "Susu", stockGrams: 600, hppPerUnit: 3500, unit: "ml" as const },
  ];

  const critical = getLowStockIngredients(ingredients);
  assert.deepEqual(critical.map((item) => item.name), ["Biji Kopi"]);
});
