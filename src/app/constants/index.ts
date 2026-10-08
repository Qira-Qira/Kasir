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
import type { Product, RawMaterialStock, UserAccount, RoleConfig, Role } from "../types";

export const RAW_MATERIALS_STOCK: RawMaterialStock[] = [
  { id: "raw-bubuk-kopi", name: "Bubuk Kopi", stockGrams: 5000, hppPerUnit: 2000, unit: "gram" },
  { id: "raw-susu", name: "Susu", stockGrams: 2500, hppPerUnit: 3500, unit: "ml" },
  { id: "raw-gula-aren", name: "Gula Aren", stockGrams: 2000, hppPerUnit: 1500, unit: "gram" },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Espresso", price: 15000, category: "Minuman", createdBy: "admin" },
  { id: "2", name: "Cappuccino", price: 25000, category: "Minuman", createdBy: "admin" },
  { id: "3", name: "Latte", price: 28000, category: "Minuman", createdBy: "admin" },
  { id: "4", name: "Americano", price: 20000, category: "Minuman", createdBy: "admin" },
  { id: "5", name: "Croissant", price: 18000, category: "Snack", createdBy: "admin" },
  { id: "6", name: "Chocolate Cake", price: 35000, category: "Snack", createdBy: "admin" },
  { id: "7", name: "Blueberry Muffin", price: 22000, category: "Snack", createdBy: "admin" },
  { id: "8", name: "Green Tea", price: 15000, category: "Minuman", createdBy: "admin" },
  { id: "9", name: "Iced Tea", price: 12000, category: "Minuman", createdBy: "admin" },
  { id: "10", name: "Sandwich", price: 30000, category: "Makanan", createdBy: "admin" },
  { id: "11", name: "Smoothie Bowl", price: 38000, category: "Makanan", createdBy: "admin" },
  { id: "12", name: "Orange Juice", price: 18000, category: "Minuman", createdBy: "admin" },
  {
    id: "13",
    name: "Es Kopi Aren",
    price: 22000,
    category: "Minuman",
    createdBy: "admin",
    minimumStockThreshold: 2,
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
      { key: "Pengaturan", label: "Kelola Menu & Akun", icon: Users },
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
