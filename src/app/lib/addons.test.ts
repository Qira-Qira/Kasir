import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCartItemLineId,
  getSugarLevelDeductionGrams,
  normalizeAddonGroupSelection,
  resolveSelectedAddons,
} from "./addons";

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

test("cart item key stabil walau add-on dipilih dalam urutan berbeda", () => {
  const first = buildCartItemLineId("indomie", [{ id: "telur" }, { id: "keju" }]);
  const second = buildCartItemLineId("indomie", [{ id: "keju" }, { id: "telur" }]);
  const different = buildCartItemLineId("indomie", [{ id: "telur" }]);

  assert.equal(first, second);
  assert.notEqual(first, different);
});

test("case 3 indomie dengan telur 0, 2, dan 1 dipisah berdasarkan quantity add-on masing-masing", () => {
  const base = resolveSelectedAddons(null, [{ id: "telur", name: "Telur", group: "Ekstra", price: 3000 }]);
  const double = resolveSelectedAddons(null, [
    { id: "telur", name: "Telur", group: "Ekstra", price: 3000 },
    { id: "telur", name: "Telur", group: "Ekstra", price: 3000 },
  ]);
  const single = resolveSelectedAddons(null, [
    { id: "telur", name: "Telur", group: "Ekstra", price: 3000 },
  ]);

  assert.equal(base.length, 1);
  assert.equal(double[0]?.quantity, 2);
  assert.equal(single[0]?.quantity, undefined);
  assert.notEqual(buildCartItemLineId("indomie", double), buildCartItemLineId("indomie", single));
  assert.notEqual(buildCartItemLineId("indomie", double), buildCartItemLineId("indomie", []));
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
