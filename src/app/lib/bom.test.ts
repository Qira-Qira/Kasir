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
    { id: "raw-1", name: "Biji Kopi", stockGrams: 5000, minimumStockGrams: 300, unit: "gram" as const },
    { id: "raw-2", name: "Gula Aren", stockGrams: 2000, minimumStockGrams: 250, unit: "gram" as const },
  ];

  const next = applyBomDeduction(ingredients, [
    { ingredient: "Biji Kopi", gramsPerPortion: 18 },
    { ingredient: "Gula Aren", gramsPerPortion: 20 },
  ], 3);

  assert.equal(next[0].stockGrams, 4946);
  assert.equal(next[1].stockGrams, 1940);
});

test("threshold stok kritis mendeteksi inventory yang berada di bawah minimum", () => {
  const ingredients = [
    { id: "raw-1", name: "Biji Kopi", stockGrams: 250, minimumStockGrams: 300, unit: "gram" as const },
    { id: "raw-2", name: "Susu", stockGrams: 600, minimumStockGrams: 500, unit: "gram" as const },
  ];

  const critical = getLowStockIngredients(ingredients);
  assert.deepEqual(critical.map((item) => item.name), ["Biji Kopi"]);
});
