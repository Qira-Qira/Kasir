import { Search, LayoutGrid, Coffee, UtensilsCrossed, Cookie, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
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
}: MenuViewProps) {
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-col space-y-4 overflow-hidden sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Menu</p>
          <h2 className="mt-1 text-lg font-semibold text-[#2b1d18] sm:text-xl">Pilihan Produk</h2>
        </div>

        <div className="w-fit rounded-full bg-[#f4e9dd] px-3 py-1.5 text-sm font-medium text-[#5a453c] shadow-sm">
          {filteredProducts.length} item
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
        <Input
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-11 text-sm text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b] sm:h-12"
        />
      </div>

      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileCategoryOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] px-3 py-2.5 text-left text-sm font-medium text-[#3a2d26]"
        >
          <span className="flex items-center gap-2">
            {mobileCategoryOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Kategori: {selectedCategory}
          </span>
          <span className="rounded-full bg-[#f3e7d9] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#5d4235]">
            {filteredProducts.length}
          </span>
        </button>

        {mobileCategoryOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-[#ebdcc7] bg-[#fffaf5] p-2 shadow-sm">
            {categories.map((category) => {
              const Icon = categoryMeta[category]?.icon ?? LayoutGrid;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    onCategoryChange(category);
                    setMobileCategoryOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium ${
                    isActive ? "bg-[#7c4a2d] text-[#fffaf5]" : "bg-[#f3e7d9] text-[#5d4235]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
          <TabsList className="mb-3 h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] p-1.5 sm:mb-5">
            {categories.map((category) => {
              const Icon = categoryMeta[category]?.icon ?? LayoutGrid;
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="min-w-[80px] flex-1 rounded-xl px-1.5 py-2 text-[10px] sm:min-w-[100px] sm:px-3 sm:text-sm"
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{category}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="min-h-0 min-w-0 flex-1 h-[260px] overflow-y-auto sm:h-[300px] md:h-[340px] xl:h-[calc(100vh-330px)]">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              disabled={auth?.role === "investor"}
              onAdd={() => onAddToCart(product)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
