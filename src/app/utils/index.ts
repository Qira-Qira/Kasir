import { Coffee, Cookie, LayoutGrid, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const getCurrentTime = () =>
  new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getCategoryIcon = (category: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Semua: LayoutGrid,
    Minuman: Coffee,
    Makanan: UtensilsCrossed,
    Snack: Cookie,
  };
  return iconMap[category] ?? LayoutGrid;
};

export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TXN-${timestamp}-${random}`;
};

export const validateProductData = (data: {
  name: string;
  price: string;
  category: string;
  stock: string;
}): string | null => {
  if (!data.name.trim()) return "Nama produk tidak boleh kosong";
  if (!data.price || isNaN(Number(data.price))) return "Harga harus berupa angka";
  if (!data.category.trim()) return "Kategori harus dipilih";
  if (!data.stock || isNaN(Number(data.stock))) return "Stok harus berupa angka";
  return null;
};

export const validateUserData = (data: {
  username: string;
  password: string;
  role: string;
}): string | null => {
  if (!data.username.trim()) return "Username tidak boleh kosong";
  if (!data.password) return "Password tidak boleh kosong";
  if (data.password.length < 6) return "Password minimal 6 karakter";
  if (!data.role) return "Role harus dipilih";
  return null;
};
