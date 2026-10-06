import { MOCK_PRODUCTS, USER_ACCOUNTS } from "../constants";
import type { Product, UserAccount } from "../types";
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
