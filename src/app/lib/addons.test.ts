import test from "node:test";
import assert from "node:assert/strict";

import { getSugarLevelDeductionGrams, normalizeAddonGroupSelection, resolveSelectedAddons } from "./addons";

test("produk tanpa pilihan add-on tetap dihitung sebagai base item, bukan otomatis menambah semua add-on default", () => {
  const product = {
    id: "p-1",
    name: "Espresso",
    addons: [
      { id: "a-1", name: "Extra Shot", group: "Ekstra", price: 5000 },
      { id: "a-2", name: "Es Tambahan", group: "Ekstra", price: 2000 },
    ],
  };

  assert.deepEqual(resolveSelectedAddons(product, []), []);
  assert.deepEqual(resolveSelectedAddons(product, undefined), []);
  assert.deepEqual(resolveSelectedAddons(product, [product.addons![0]]), [product.addons![0]]);
});

test("grup Sugar Level hanya boleh memilih satu level gula dan pengurangan stok mengikuti level gula", () => {
  const previous = [
    { id: "a-sugar-normal", name: "Normal Sugar", group: "Sugar Level", price: 0 },
    { id: "a-extra-shot", name: "Extra Shot", group: "Ekstra", price: 5000 },
  ];

  const nextSelection = normalizeAddonGroupSelection(previous, {
    id: "a-sugar-less",
    name: "Less Sugar",
    group: "Sugar Level",
    price: 0,
  });

  assert.deepEqual(nextSelection, [
    { id: "a-extra-shot", name: "Extra Shot", group: "Ekstra", price: 5000 },
    { id: "a-sugar-less", name: "Less Sugar", group: "Sugar Level", price: 0 },
  ]);
  assert.equal(getSugarLevelDeductionGrams("Normal Sugar"), 20);
  assert.equal(getSugarLevelDeductionGrams("Less Sugar"), 10);
  assert.equal(getSugarLevelDeductionGrams("No Sugar"), 0);
});
