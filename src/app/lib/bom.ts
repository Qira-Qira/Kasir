export interface BomRecipeItem {
  ingredient: string;
  gramsPerPortion: number;
}

export type RawMaterialUnit = "gram" | "ml";

export interface RawMaterialStock {
  id: string;
  name: string;
  stockGrams: number;
  hppPerUnit: number;
  unit: RawMaterialUnit;
}

export const convertKgToGrams = (kilogram: number) => {
  const safeKg = Number.isFinite(Number(kilogram)) ? Number(kilogram) : 0;
  return Number(Math.max(0, safeKg * 1000).toFixed(2));
};

export const applyBomDeduction = (
  inventory: RawMaterialStock[],
  recipe: BomRecipeItem[],
  soldQuantity: number
) => {
  const safeQty = Number.isFinite(Number(soldQuantity)) ? Number(soldQuantity) : 0;
  const nextInventory = inventory.map((item) => ({ ...item }));

  if (safeQty <= 0 || recipe.length === 0) {
    return nextInventory;
  }

  for (const entry of recipe) {
    const target = nextInventory.find(
      (item) => item.name.toLowerCase() === entry.ingredient.toLowerCase()
    );

    if (!target) continue;

    const deduction = entry.gramsPerPortion * safeQty;
    target.stockGrams = Number(Math.max(0, target.stockGrams - deduction).toFixed(2));
  }

  return nextInventory;
};

export const getLowStockIngredients = (inventory: RawMaterialStock[]) =>
  inventory.filter((item) => item.stockGrams <= 0);
