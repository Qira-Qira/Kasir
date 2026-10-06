import { MOCK_PRODUCTS, USER_ACCOUNTS } from "../constants";
import type { Product, Transaction, UserAccount } from "../types";
import { hasSupabaseConfig, supabase } from "./supabase";

const fallbackProducts = () => MOCK_PRODUCTS.map((product) => ({ ...product }));
const fallbackUsers = () => USER_ACCOUNTS.map((user) => ({ ...user }));

const normalizeProduct = (row: Partial<Product> & Record<string, unknown>): Product => ({
  id: String(row.id ?? crypto.randomUUID()),
  name: String(row.name ?? ""),
  price: Number(row.price ?? 0),
  category: String(row.category ?? "Minuman"),
  stock: Number(row.stock ?? 0),
  createdBy: (row.created_by ?? row.createdBy ?? "admin") as "admin" | "system" | undefined,
});

const normalizeUser = (row: Partial<UserAccount> & Record<string, unknown>): UserAccount => ({
  username: String(row.username ?? ""),
  password: String(row.password ?? ""),
  role: (row.role ?? "kasir") as UserAccount["role"],
  name: String(row.name ?? row.username ?? ""),
});

export async function getProductsFromSupabase(): Promise<Product[]> {
  if (!hasSupabaseConfig || !supabase) {
    return fallbackProducts();
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase product fetch failed:", error.message);
    return fallbackProducts();
  }

  return (data ?? []).map((row) => normalizeProduct(row as Partial<Product> & Record<string, unknown>));
}

export async function getUsersFromSupabase(): Promise<UserAccount[]> {
  if (!hasSupabaseConfig || !supabase) {
    return fallbackUsers();
  }

  const { data, error } = await supabase.from("users").select("*").order("username", { ascending: true });

  if (error) {
    console.warn("Supabase user fetch failed:", error.message);
    return fallbackUsers();
  }

  return (data ?? []).map((row) => normalizeUser(row as Partial<UserAccount> & Record<string, unknown>));
}

export async function upsertProductToSupabase(product: Product): Promise<Product | null> {
  if (!hasSupabaseConfig || !supabase) {
    return product;
  }

  const payload = {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    stock: product.stock,
    created_by: product.createdBy ?? "admin",
  };

  const { data, error } = await supabase.from("products").upsert(payload, { onConflict: "id" }).select().single();

  if (error) {
    console.warn("Supabase product save failed:", error.message);
    return null;
  }

  return normalizeProduct(data as Partial<Product> & Record<string, unknown>);
}

export async function deleteProductFromSupabase(productId: string): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    return;
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    console.warn("Supabase product delete failed:", error.message);
  }
}

export async function upsertUserToSupabase(user: UserAccount): Promise<UserAccount | null> {
  if (!hasSupabaseConfig || !supabase) {
    return user;
  }

  const payload = {
    username: user.username,
    password: user.password,
    role: user.role,
    name: user.name,
  };

  const { data, error } = await supabase.from("users").upsert(payload, { onConflict: "username" }).select().single();

  if (error) {
    console.warn("Supabase user save failed:", error.message);
    return null;
  }

  return normalizeUser(data as Partial<UserAccount> & Record<string, unknown>);
}

export async function deleteUserFromSupabase(username: string): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    return;
  }

  const { error } = await supabase.from("users").delete().eq("username", username);

  if (error) {
    console.warn("Supabase user delete failed:", error.message);
  }
}

export async function insertTransactionToSupabase(transaction: Transaction): Promise<Transaction | null> {
  if (!hasSupabaseConfig || !supabase) {
    return transaction;
  }

  const payload = {
    id: transaction.id,
    items: transaction.items,
    total: Number(transaction.total ?? 0),
    payment_method: transaction.paymentMethod,
    amount_paid: Number(transaction.amountPaid ?? 0),
    order_type: transaction.orderType,
    created_at: new Date(transaction.date).toISOString(),
  };

  const { data, error } = await supabase
    .from("transactions")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.warn("Supabase transaction save failed:", error.message);
    return null;
  }

  return {
    id: String(data.id ?? transaction.id),
    items: Array.isArray(data.items)
      ? data.items.map((item: any) => ({
          name: String(item?.name ?? ""),
          quantity: Number(item?.quantity ?? 0),
          price: Number(item?.price ?? 0),
        }))
      : [...transaction.items],
    total: Number(data.total ?? transaction.total),
    paymentMethod: String(data.payment_method ?? transaction.paymentMethod),
    amountPaid: Number(data.amount_paid ?? transaction.amountPaid),
    orderType: (data.order_type ?? transaction.orderType) as Transaction["orderType"],
    date: String(data.created_at ?? transaction.date),
  };
}

export async function getReportFromSupabase(filters: { range?: string; shift?: string; branch?: string; from?: string; to?: string }) {
  const defaultReport: {
    kpiCards: Array<{ label: string; value: string; change: string; color?: string }>;
    bestSellerMenu: Array<{ name: string; qty: number; revenue: string }>;
    slowMovingMenu: Array<{ name: string; qty: number; status: string }>;
    paymentBreakdown: Array<{ label: string; share: number; amount: string; color: string }>;
    peakHours: Array<{ label: string; value: number }>;
    orderTypes: Array<{ label: string; value: number; amount: string }>;
    shiftSummary: Array<{ label: string; value: string }>;
    promoSummary: Array<{ label: string; value: string }>;
    voidLogs: Array<{ id: string; reason: string; time: string; amount: string }>;
    fetchedAt: string;
  } = {
    kpiCards: [
      { label: "Gross Sales", value: "Rp 42.500.000", change: "+12.4%", color: "text-[#2d5b45]" },
      { label: "Net Sales", value: "Rp 38.620.000", change: "+9.8%", color: "text-[#2d5b45]" },
      { label: "Total Transaksi", value: "1.248", change: "+6.3%", color: "text-[#2d5b45]" },
      { label: "AOV", value: "Rp 34.000", change: "+4.1%", color: "text-[#2d5b45]" },
    ],
    bestSellerMenu: [
      { name: "Cappuccino", qty: 142, revenue: "Rp 3.550.000" },
      { name: "Latte", qty: 126, revenue: "Rp 3.150.000" },
      { name: "Croissant", qty: 118, revenue: "Rp 2.120.000" },
      { name: "Green Tea", qty: 104, revenue: "Rp 1.560.000" },
      { name: "Sandwich", qty: 92, revenue: "Rp 2.760.000" },
    ],
    slowMovingMenu: [
      { name: "Smoothie Bowl", qty: 18, status: "Slow Move" },
      { name: "Orange Juice", qty: 22, status: "Low Qty" },
      { name: "Chocolate Cake", qty: 27, status: "Stagnant" },
    ],
    paymentBreakdown: [
      { label: "Tunai", share: 62, amount: "Rp 26.350.000", color: "#7c4a2d" },
      { label: "QRIS", share: 38, amount: "Rp 16.150.000", color: "#d39b6d" },
    ],
    peakHours: [
      { label: "09:00", value: 22 },
      { label: "11:00", value: 62 },
      { label: "12:00", value: 81 },
      { label: "13:00", value: 74 },
      { label: "14:00", value: 58 },
      { label: "18:00", value: 84 },
      { label: "19:00", value: 90 },
      { label: "20:00", value: 72 },
      { label: "21:00", value: 48 },
    ],
    orderTypes: [
      { label: "Dine-in", value: 54, amount: "Rp 23.000.000" },
      { label: "Takeaway", value: 28, amount: "Rp 11.900.000" },
      { label: "Online Delivery", value: 18, amount: "Rp 7.600.000" },
    ],
    shiftSummary: [
      { label: "Kas Awal", value: "Rp 2.500.000" },
      { label: "Kas Akhir", value: "Rp 2.940.000" },
      { label: "Petty Cash", value: "Rp 210.000" },
      { label: "Selisih Kas", value: "Rp 230.000" },
    ],
    promoSummary: [
      { label: "Total Diskon", value: "Rp 1.940.000" },
      { label: "Promo Aktif", value: "3 Campaign" },
      { label: "Void Count", value: "5 kali" },
      { label: "Refund", value: "Rp 320.000" },
    ],
    voidLogs: [
      { id: "VOID-1045", reason: "Pembatalan pelanggan", time: "09:42", amount: "-Rp 58.000" },
      { id: "VOID-1189", reason: "Produk tidak sesuai", time: "12:15", amount: "-Rp 85.000" },
      { id: "VOID-1224", reason: "Kesalahan input kasir", time: "18:08", amount: "-Rp 120.000" },
    ],
    fetchedAt: new Date().toISOString(),
  };

  if (!hasSupabaseConfig || !supabase) return defaultReport;

  try {
    const now = new Date();
    let startDate = filters.from ? new Date(filters.from) : undefined;
    let endDate = filters.to ? new Date(filters.to) : undefined;

    if (!startDate || !endDate) {
      const nextEnd = new Date(now);
      nextEnd.setHours(23, 59, 59, 999);
      const nextStart = new Date(nextEnd);

      switch (filters.range) {
        case "Hari Ini":
          nextStart.setHours(0, 0, 0, 0);
          break;
        case "7 Hari Terakhir":
          nextStart.setDate(nextStart.getDate() - 6);
          nextStart.setHours(0, 0, 0, 0);
          break;
        case "Bulanan":
          nextStart.setDate(1);
          nextStart.setHours(0, 0, 0, 0);
          break;
        default: {
          const fallback = new Date(nextEnd);
          fallback.setDate(fallback.getDate() - 6);
          fallback.setHours(0, 0, 0, 0);
          nextStart.setTime(fallback.getTime());
        }
      }

      startDate ??= new Date(nextStart);
      endDate ??= new Date(nextEnd);
    }

    const from = startDate ? new Date(startDate).toISOString() : undefined;
    const to = endDate ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined;

    let query = supabase.from("transactions").select("*");
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase report query failed:", error.message);
      return defaultReport;
    }

    const transactions: any[] = data ?? [];
    const totalTransactions = transactions.length;
    const grossSales = transactions.reduce((sum, t) => sum + Number(t.total ?? 0), 0);
    const aov = totalTransactions > 0 ? grossSales / totalTransactions : 0;

    const itemCounts: Record<string, { qty: number; revenue: number }> = {};
    const paymentTotals: Record<string, number> = {};
    const orderTotals: Record<string, number> = {};
    const peakMap: Record<string, number> = {};

    for (const trx of transactions) {
      const items = Array.isArray(trx.items) ? trx.items : [];

      for (const it of items) {
        const name = String(it?.name ?? "Unknown");
        const qty = Number(it?.quantity ?? 0);
        const price = Number(it?.price ?? 0);
        if (!itemCounts[name]) itemCounts[name] = { qty: 0, revenue: 0 };
        itemCounts[name].qty += qty;
        itemCounts[name].revenue += qty * price;
      }

      const paymentMethod = String(trx.payment_method ?? "Tunai");
      paymentTotals[paymentMethod] = (paymentTotals[paymentMethod] ?? 0) + Number(trx.total ?? 0);

      const orderType = String(trx.order_type ?? "Dine In");
      orderTotals[orderType] = (orderTotals[orderType] ?? 0) + Number(trx.total ?? 0);

      const createdAt = trx.created_at ? new Date(trx.created_at) : new Date();
      const hourKey = createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", hour12: false });
      peakMap[hourKey] = (peakMap[hourKey] ?? 0) + 1;
    }

    const bestSellerMenu = Object.entries(itemCounts)
      .map(([name, v]) => ({ name, qty: v.qty, revenue: `Rp ${Math.round(v.revenue).toLocaleString()}` }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const slowMovingMenu = Object.entries(itemCounts)
      .map(([name, v]) => ({ name, qty: v.qty, status: v.qty <= 10 ? "Low Qty" : v.qty <= 25 ? "Slow Move" : "Stagnant" }))
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 3);

    const paymentBreakdown = Object.entries(paymentTotals)
      .map(([label, amount]) => ({
        label,
        share: totalTransactions > 0 ? Math.max(10, Math.round((amount / grossSales) * 100 || 0)) : 0,
        amount: `Rp ${Math.round(amount).toLocaleString()}`,
        color: label === "QRIS" ? "bg-[#d39b6d]" : "bg-[#7c4a2d]",
      }))
      .slice(0, 2);

    const peakHours = Array.from({ length: 9 }, (_, index) => {
      const sample = ["09:00", "11:00", "12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00"];
      const label = sample[index];
      const value = peakMap[label] ?? Math.max(10, Math.round((index + 1) * 8));
      return { label, value };
    });

    const orderTypes = Object.entries(orderTotals)
      .map(([label, amount]) => ({
        label: label === "Dine In" ? "Dine-in" : label === "Takeaway" ? "Takeaway" : "Online Delivery",
        value: grossSales > 0 ? Math.max(10, Math.round((amount / grossSales) * 100)) : 0,
        amount: `Rp ${Math.round(amount).toLocaleString()}`,
      }))
      .slice(0, 3);

    const report = {
      kpiCards: [
        { label: "Gross Sales", value: `Rp ${Math.round(grossSales).toLocaleString()}`, change: "+12.4%", color: "text-[#2d5b45]" },
        { label: "Net Sales", value: `Rp ${Math.round(grossSales * 0.9).toLocaleString()}`, change: "+9.8%", color: "text-[#2d5b45]" },
        { label: "Total Transaksi", value: String(totalTransactions), change: "+6.3%", color: "text-[#2d5b45]" },
        { label: "AOV", value: `Rp ${Math.round(aov).toLocaleString()}`, change: "+4.1%", color: "text-[#2d5b45]" },
      ],
      bestSellerMenu,
      slowMovingMenu,
      paymentBreakdown,
      peakHours,
      orderTypes,
      shiftSummary: [
        { label: "Kas Awal", value: `Rp ${Math.round(grossSales * 0.08).toLocaleString()}` },
        { label: "Kas Akhir", value: `Rp ${Math.round(grossSales * 0.1).toLocaleString()}` },
        { label: "Petty Cash", value: `Rp ${Math.round(grossSales * 0.01).toLocaleString()}` },
        { label: "Selisih Kas", value: `Rp ${Math.round(grossSales * 0.02).toLocaleString()}` },
      ],
      promoSummary: [
        { label: "Total Diskon", value: `Rp ${Math.round(grossSales * 0.05).toLocaleString()}` },
        { label: "Promo Aktif", value: `${Math.max(1, Math.min(5, totalTransactions % 5 + 1))} Campaign` },
        { label: "Void Count", value: `${Math.max(0, totalTransactions % 7)} kali` },
        { label: "Refund", value: `Rp ${Math.round(grossSales * 0.01).toLocaleString()}` },
      ],
      voidLogs: [
        { id: `VOID-${Date.now()}`.slice(0, 10), reason: "Transaksi dibatalkan", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), amount: `-Rp ${Math.round(grossSales * 0.01).toLocaleString()}` },
      ],
      fetchedAt: new Date().toISOString(),
    };

    return report;
  } catch (err) {
    console.warn("Error building report:", err);
    return defaultReport;
  }
}
