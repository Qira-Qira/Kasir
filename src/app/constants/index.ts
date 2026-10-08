import {
  BarChart3,
  BriefcaseBusiness,
  History,
  ListOrdered,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Product, RawMaterialStock, UserAccount, RoleConfig, Role, AddonOption } from "../types";

export const DEFAULT_SUGAR_LEVEL_OPTIONS: AddonOption[] = [
  { id: "addon-sugar-normal", name: "Normal Sugar", group: "Sugar Level", price: 0 },
  { id: "addon-sugar-less", name: "Less Sugar", group: "Sugar Level", price: 0 },
  { id: "addon-sugar-no", name: "No Sugar", group: "Sugar Level", price: 0 },
];

export const RAW_MATERIALS_STOCK: RawMaterialStock[] = [
  { id: "raw-bubuk-kopi", name: "Bubuk Kopi", stockGrams: 5000, hppPerUnit: 2000, unit: "gram" },
  { id: "raw-susu", name: "Susu", stockGrams: 2500, hppPerUnit: 3500, unit: "ml" },
  { id: "raw-gula-aren", name: "Gula Aren", stockGrams: 2000, hppPerUnit: 1500, unit: "gram" },
];

export const DEFAULT_ADDON_OPTIONS: AddonOption[] = [
  { id: "addon-keju", name: "Keju", group: "Toping", price: 3000 },
  { id: "addon-extra-shot", name: "Extra Shot", group: "Ekstra", price: 5000 },
  { id: "addon-extra-susu", name: "Extra Susu", group: "Ekstra", price: 4000 },
  { id: "addon-large", name: "Ukuran Large", group: "Ukuran", price: 6000 },
  { id: "addon-whipped", name: "Whipped Cream", group: "Toping", price: 4500 },
  { id: "addon-ice", name: "Es Tambahan", group: "Ekstra", price: 2000 },
];

export const getProductAddons = (product: Pick<Product, "id" | "category" | "name">): AddonOption[] => {
  const productSpecific: Record<string, AddonOption[]> = {
    "1": [
      { id: "addon-extra-shot", name: "Extra Shot", group: "Ekstra", price: 5000 },
      { id: "addon-ice", name: "Es Tambahan", group: "Ekstra", price: 2000 },
    ],
    "2": [
      { id: "addon-keju", name: "Keju", group: "Toping", price: 3000 },
      { id: "addon-whipped", name: "Whipped Cream", group: "Toping", price: 4500 },
    ],
    "3": [
      { id: "addon-extra-susu", name: "Extra Susu", group: "Ekstra", price: 4000 },
      { id: "addon-large", name: "Ukuran Large", group: "Ukuran", price: 6000 },
    ],
    "13": [
      { id: "addon-keju", name: "Keju", group: "Toping", price: 3000 },
      { id: "addon-extra-shot", name: "Extra Shot", group: "Ekstra", price: 5000 },
      { id: "addon-ice", name: "Es Tambahan", group: "Ekstra", price: 2000 },
    ],
  };

  if (productSpecific[product.id]) return productSpecific[product.id];
  if (product.category === "Minuman") {
    return [...DEFAULT_SUGAR_LEVEL_OPTIONS, ...DEFAULT_ADDON_OPTIONS.filter((item) => item.group !== "Toping")];
  }
  if (product.category === "Snack") return DEFAULT_ADDON_OPTIONS.filter((item) => item.group === "Toping");

  return DEFAULT_ADDON_OPTIONS;
};

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Espresso", price: 15000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "1", name: "Espresso", category: "Minuman" }) },
  { id: "2", name: "Cappuccino", price: 25000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "2", name: "Cappuccino", category: "Minuman" }) },
  { id: "3", name: "Latte", price: 28000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "3", name: "Latte", category: "Minuman" }) },
  { id: "4", name: "Americano", price: 20000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "4", name: "Americano", category: "Minuman" }) },
  { id: "5", name: "Croissant", price: 18000, category: "Snack", createdBy: "admin", addons: getProductAddons({ id: "5", name: "Croissant", category: "Snack" }) },
  { id: "6", name: "Chocolate Cake", price: 35000, category: "Snack", createdBy: "admin", addons: getProductAddons({ id: "6", name: "Chocolate Cake", category: "Snack" }) },
  { id: "7", name: "Blueberry Muffin", price: 22000, category: "Snack", createdBy: "admin", addons: getProductAddons({ id: "7", name: "Blueberry Muffin", category: "Snack" }) },
  { id: "8", name: "Green Tea", price: 15000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "8", name: "Green Tea", category: "Minuman" }) },
  { id: "9", name: "Iced Tea", price: 12000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "9", name: "Iced Tea", category: "Minuman" }) },
  { id: "10", name: "Sandwich", price: 30000, category: "Makanan", createdBy: "admin", addons: getProductAddons({ id: "10", name: "Sandwich", category: "Makanan" }) },
  { id: "11", name: "Smoothie Bowl", price: 38000, category: "Makanan", createdBy: "admin", addons: getProductAddons({ id: "11", name: "Smoothie Bowl", category: "Makanan" }) },
  { id: "12", name: "Orange Juice", price: 18000, category: "Minuman", createdBy: "admin", addons: getProductAddons({ id: "12", name: "Orange Juice", category: "Minuman" }) },
  {
    id: "13",
    name: "Es Kopi Aren",
    price: 22000,
    category: "Minuman",
    createdBy: "admin",
    minimumStockThreshold: 2,
    addons: getProductAddons({ id: "13", name: "Es Kopi Aren", category: "Minuman" }),
    recipe: [
      { ingredient: "Bubuk Kopi", gramsPerPortion: 18 },
      { ingredient: "Susu", gramsPerPortion: 120 },
      { ingredient: "Gula Aren", gramsPerPortion: 20 },
    ],
  },
];

export const USER_ACCOUNTS: UserAccount[] = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin POS" },
  { username: "investor", password: "investor123", role: "investor", name: "Investor Team" },
  { username: "kasir", password: "kasir123", role: "kasir", name: "Kasir Outlet" },
];

export const ROLE_OPTIONS = [
  { role: "admin" as const, label: "Admin", subtitle: "Kelola semua operasional", icon: ShieldCheck },
  { role: "investor" as const, label: "Investor", subtitle: "Pantau performa bisnis", icon: BriefcaseBusiness },
  { role: "kasir" as const, label: "Kasir", subtitle: "Kasir & penjualan harian", icon: Users },
];

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  admin: {
    label: "Admin",
    navItems: [
      { key: "Menu", label: "Menu", icon: ListOrdered },
      { key: "Stok", label: "Stok", icon: Package },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
      { key: "Riwayat", label: "Riwayat", icon: History },
      { key: "Pengaturan", label: "Kelola Menu", icon: ListOrdered },
      { key: "Akun", label: "Akun", icon: Users },
    ],
    accent: "bg-[#f4e6d7] text-[#5d4337]",
    badge: "bg-[#7c4a2d] text-white",
  },
  investor: {
    label: "Investor",
    navItems: [
      { key: "Dashboard", label: "Dashboard", icon: TrendingUp },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
    ],
    accent: "bg-[#edf3ef] text-[#2d5b45]",
    badge: "bg-[#2d5b45] text-white",
  },
  kasir: {
    label: "Kasir",
    navItems: [
      { key: "Menu", label: "Menu", icon: ListOrdered },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
      { key: "Riwayat", label: "Riwayat", icon: History },
    ],
    accent: "bg-[#fbe7df] text-[#8d4c3d]",
    badge: "bg-[#a95d3a] text-white",
  },
};

export const CATEGORIES = ["Semua", "Minuman", "Makanan", "Snack"] as const;
