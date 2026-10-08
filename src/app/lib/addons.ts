import type { AddonOption } from "../types";

export const SUGAR_LEVEL_OPTIONS: AddonOption[] = [
  { id: "sugar-normal", name: "Normal Sugar", group: "Sugar Level", price: 0 },
  { id: "sugar-less", name: "Less Sugar", group: "Sugar Level", price: 0 },
  { id: "sugar-no", name: "No Sugar", group: "Sugar Level", price: 0 },
];

export function getDefaultSugarLevelOptions(): AddonOption[] {
  return SUGAR_LEVEL_OPTIONS.map((option) => ({ ...option }));
}

export function buildCartItemLineId(productId: string, addons: Array<{ id: string; quantity?: number }> = []): string {
  const addonKey = [...addons]
    .map((addon) => {
      const qty = Number(addon.quantity ?? 1);
      return qty > 1 ? `${addon.id}:${qty}` : addon.id;
    })
    .filter(Boolean)
    .sort();

  return addonKey.length > 0 ? `${productId}-${addonKey.join("-")}` : `${productId}-base`;
}

export function resolveSelectedAddons(
  _product: { addons?: AddonOption[] | null } | null,
  selectedAddons?: AddonOption[] | null
): AddonOption[] {
  if (!selectedAddons || selectedAddons.length === 0) {
    return [];
  }

  const aggregated = new Map<string, AddonOption>();

  for (const addon of selectedAddons) {
    const key = addon.id;
    const current = aggregated.get(key);
    const currentQuantity = current?.quantity ?? 1;
    const nextQuantity = current ? currentQuantity + 1 : 1;

    if (!current) {
      aggregated.set(key, { ...addon, ...(nextQuantity > 1 ? { quantity: nextQuantity } : {}) });
      continue;
    }

    aggregated.set(key, {
      ...current,
      ...(nextQuantity > 1 ? { quantity: nextQuantity } : {}),
      price: addon.price || current.price,
    });
  }

  return [...aggregated.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function ensureSystemSugarLevelAddons(category: string, addons: AddonOption[] = []): AddonOption[] {
  const filtered = addons.filter((addon) => addon.group !== "Sugar Level");

  if (category !== "Minuman") {
    return filtered;
  }

  return [...filtered, ...SUGAR_LEVEL_OPTIONS.map((option) => ({ ...option }))];
}

export function getSugarLevelDeductionGrams(addonName: string): number {
  const normalized = addonName.toLowerCase();

  if (normalized.includes("no sugar")) return 0;
  if (normalized.includes("less sugar")) return 10;
  return 20;
}

export function normalizeAddonGroupSelection(selectedAddons: AddonOption[], nextOption: AddonOption): AddonOption[] {
  const filtered = selectedAddons.filter((addon) => addon.group !== nextOption.group);
  const exists = selectedAddons.some((addon) => addon.id === nextOption.id && addon.group === nextOption.group);

  if (exists) {
    return filtered;
  }

  return [...filtered, nextOption];
}
