import { Search, LayoutGrid, Coffee, UtensilsCrossed, Cookie } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { ProductCard } from "../components/ui/ProductCard";
import type { AuthState, Product } from "../types";

interface MenuViewProps {
  products: Product[];
  auth: AuthState | null;
  searchQuery: string;
  selectedCategory: string;
  categories: readonly string[];
  filteredProducts: Product[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddToCart: (product: Product) => void;
  onStartEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const categoryMeta: Record<string, { icon: LucideIcon }> = {
  Semua: { icon: LayoutGrid },
  Minuman: { icon: Coffee },
  Makanan: { icon: UtensilsCrossed },
  Snack: { icon: Cookie },
};

export function MenuView({
  products,
  auth,
  searchQuery,
  selectedCategory,
  categories,
  filteredProducts,
  onSearchChange,
  onCategoryChange,
  onAddToCart,
  onStartEditProduct,
  onDeleteProduct,
}: MenuViewProps) {
  return (
    <div className="flex min-h-0 flex-col space-y-5 overflow-hidden">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Menu</p>
          <h2 className="mt-1 text-xl font-semibold text-[#2b1d18]">Pilihan Produk</h2>
        </div>

        <div className="rounded-full bg-[#f4e9dd] px-3 py-1.5 text-sm font-medium text-[#5a453c] shadow-sm">
          {filteredProducts.length} item
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
        <Input
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-12 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-11 text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="mb-5 h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] p-1.5">
          {categories.map((category) => {
            const Icon = categoryMeta[category]?.icon ?? LayoutGrid;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="min-w-[90px] flex-1 rounded-xl px-2 py-2 text-[11px] sm:min-w-[100px] sm:px-3 sm:text-sm"
              >
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{category}</span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <ScrollArea className="min-h-0 min-w-0 flex-1 h-[260px] sm:h-[320px] xl:h-[calc(100vh-330px)] overflow-y-auto">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              stock={product.stock}
              disabled={auth?.role === "investor" || product.stock <= 0}
              isAdmin={auth?.role === "admin"}
              onAdd={() => onAddToCart(product)}
              onEdit={() => onStartEditProduct(product)}
              onDelete={() => onDeleteProduct(product.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
