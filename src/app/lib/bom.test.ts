import test from "node:test";
import assert from "node:assert/strict";

import {
  applyBomDeduction,
  convertKgToGrams,
  getLowStockIngredients,
  isValidRawMaterialUnit,
} from "./bom";
import { buildShiftSummaryRows, calculateShiftVariance } from "./shift";
import { formatCurrency } from "../utils";

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

test("satuan bahan baku dapat berupa pcs", () => {
  assert.equal(isValidRawMaterialUnit("pcs"), true);
  assert.equal(isValidRawMaterialUnit("gram"), true);
  assert.equal(isValidRawMaterialUnit("ml"), true);
  assert.equal(isValidRawMaterialUnit("liter"), false);
});

test("formatCurrency menampilkan desimal untuk nilai HPP pecahan", () => {
  assert.equal(formatCurrency(1250.5), "Rp 1.250,50");
  assert.equal(formatCurrency(2000), "Rp 2.000");
});

test("rumus varians shift menghitung selisih kas dengan benar", () => {
  const variance = calculateShiftVariance({
    startingCash: 500000,
    cashSales: 250000,
    pettyCashOut: 30000,
    actualCash: 720000,
  });

  assert.equal(variance, 0);
});

test("ringkasan shift mengambil nilai terakhir dari sesi kas yang ditutup", () => {
  const rows = buildShiftSummaryRows([
    {
      startingCash: 500000,
      actualCash: 720000,
      pettyCashOut: 30000,
      difference: 0,
    },
    {
      startingCash: 400000,
      actualCash: 610000,
      pettyCashOut: 20000,
      difference: 10000,
    },
  ]);

  assert.deepEqual(rows[0], { label: "Kas Awal", value: "Rp 500.000" });
  assert.deepEqual(rows[1], { label: "Kas Akhir", value: "Rp 720.000" });
  assert.deepEqual(rows[2], { label: "Petty Cash", value: "Rp 30.000" });
  assert.deepEqual(rows[3], { label: "Selisih Kas", value: "Rp 0" });
});

test("stok yang habis atau nol ditandai sebagai bahan baku rendah", () => {
  const ingredients = [
    { id: "raw-1", name: "Biji Kopi", stockGrams: 0, hppPerUnit: 2200, unit: "gram" as const },
    { id: "raw-2", name: "Susu", stockGrams: 600, hppPerUnit: 3500, unit: "ml" as const },
  ];

  const critical = getLowStockIngredients(ingredients);
  assert.deepEqual(critical.map((item) => item.name), ["Biji Kopi"]);
});
