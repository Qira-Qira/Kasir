import type { LucideIcon } from "lucide-react";

export type Role = "admin" | "investor" | "kasir";
export type ViewKey = "Menu" | "Laporan" | "Riwayat" | "Stok" | "Dashboard" | "Pengaturan";
export type PaymentMethod = "Cash" | "QRIS" | "Debit" | "Transfer";
export type OrderType = "Dine In" | "Takeaway";
export type ReportRange = "Hari Ini" | "7 Hari Terakhir" | "Bulanan" | "Custom Date";
export type ReportShift = "Semua Shift" | "Shift 1" | "Shift 2";
export type ReportBranch = "Semua Cabang" | "Cabang Utama" | "Cabang 2";

export interface BomRecipeItem {
  ingredient: string;
  gramsPerPortion: number;
}

export interface ProductRecipeDraftItem {
  ingredientName: string;
  grams: string;
}

export type RawMaterialUnit = "gram" | "ml";

export interface RawMaterialStock {
  id: string;
  name: string;
  stockGrams: number;
  hppPerUnit: number;
  unit: RawMaterialUnit;
}

export interface AddonOption {
  id: string;
  name: string;
  group: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  createdBy?: "admin" | "system";
  recipe?: BomRecipeItem[];
  minimumStockThreshold?: number;
  addons?: AddonOption[];
}

export interface CartAddonItem {
  id: string;
  group: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  price: number;
  basePrice: number;
  quantity: number;
  addOns: CartAddonItem[];
}

export interface TransactionAddonItem {
  name: string;
  quantity: number;
  price: number;
}

export interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
  addons?: TransactionAddonItem[];
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: string;
  amountPaid: number;
  orderType: OrderType;
  date: string;
  isCompleted: boolean;
}

export interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
}

export interface AuthState {
  username: string;
  name: string;
  role: Role;
}

export interface UserAccount {
  username: string;
  password: string;
  role: Role;
  name: string;
}

export interface RoleConfig {
  label: string;
  navItems: NavItem[];
  accent: string;
  badge: string;
}

export interface NewProduct {
  name: string;
  price: string;
  category: string;
  stock: string;
}

export interface NewUser {
  username: string;
  password: string;
  role: Role;
}

export interface ProductDraft {
  name: string;
  price: string;
  category: string;
  stock: string;
}

export interface UserDraft {
  username: string;
  password: string;
  role: Role;
}
