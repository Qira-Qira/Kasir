import type { AddonOption } from "../types";

export const SUGAR_LEVEL_OPTIONS: AddonOption[] = [
  { id: "sugar-normal", name: "Normal Sugar", group: "Sugar Level", price: 0 },
  { id: "sugar-less", name: "Less Sugar", group: "Sugar Level", price: 0 },
  { id: "sugar-no", name: "No Sugar", group: "Sugar Level", price: 0 },
];

export function getDefaultSugarLevelOptions(): AddonOption[] {
  return SUGAR_LEVEL_OPTIONS.map((option) => ({ ...option }));
}

export function resolveSelectedAddons(
  _product: { addons?: AddonOption[] | null } | null,
  selectedAddons?: AddonOption[] | null
): AddonOption[] {
  if (!selectedAddons || selectedAddons.length === 0) {
    return [];
  }

  const unique = new Map<string, AddonOption>();

  for (const addon of selectedAddons) {
    unique.set(addon.id, addon);
  }

  return [...unique.values()];
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
