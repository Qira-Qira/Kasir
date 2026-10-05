import { ChevronLeft, ChevronRight, ListOrdered, Search } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import type { Product } from "../types";

interface StockViewProps {
  products: Product[];
  stockSearch: string;
  setStockSearch: (value: string) => void;
  stockCategory: string;
  setStockCategory: (value: string) => void;
  stockPage: number;
  setStockPage: (value: number) => void;
  formatCurrency: (value: number) => string;
  handleStartEditProduct: (product: Product) => void;
  setProductToDeleteId: (value: string) => void;
  setRestockProductId: (value: string | null) => void;
  setRestockQty: (value: string) => void;
}

export function StockView({
  products,
  stockSearch,
  setStockSearch,
  stockCategory,
  setStockCategory,
  stockPage,
  setStockPage,
  formatCurrency,
  handleStartEditProduct,
  setProductToDeleteId,
  setRestockProductId,
  setRestockQty,
}: StockViewProps) {
  const stockCategories = ["Semua", ...Array.from(new Set(products.map((product) => product.category)))];
  const stockFilteredProducts = [...products]
    .filter((product) => {
      const matchesCategory = stockCategory === "Semua" || product.category === stockCategory;
      const matchesSearch = product.name.toLowerCase().includes(stockSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.stock - b.stock);

  const stockTotalPages = Math.max(1, Math.ceil(stockFilteredProducts.length / 6));
  const safeStockPage = Math.min(stockPage, stockTotalPages);
  const paginatedStockProducts = stockFilteredProducts.slice((safeStockPage - 1) * 6, safeStockPage * 6);

  return (
    <div className="flex min-h-0 flex-col space-y-5 overflow-hidden">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Total Item</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.length}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Low Stock</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.filter((product) => product.stock <= 10).length}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Status</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.filter((product) => product.stock <= 10).length === 0 ? "Aman" : "Perlu Tindak"}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 sm:p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ListOrdered className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Stok Menu</h3>
          </div>
          <Badge className="w-fit rounded-full bg-[#edf3ef] text-[#2d5b45]">{products.filter((product) => product.stock <= 10).length} needs attention</Badge>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
            <Input
              value={stockSearch}
              onChange={(event) => {
                setStockSearch(event.target.value);
                setStockPage(1);
              }}
              placeholder="Cari menu stok..."
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {stockCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setStockCategory(category);
                  setStockPage(1);
                }}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${stockCategory === category ? "bg-[#7c4a2d] text-white" : "bg-[#f3e7d9] text-[#5d4235]"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#f8f0e7]">
          <div className="max-h-[500px] overflow-y-auto">
            <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
              {paginatedStockProducts.length > 0 ? (
                paginatedStockProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl bg-[#fffaf5] p-3 shadow-[0_8px_16px_rgba(88,63,46,0.03)]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[#2b1d18]">{product.name}</p>
                        <p className="mt-1 text-xs text-[#7d685f]">{product.category}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${product.stock <= 10 ? "bg-[#f8d7d7] text-[#9b3b34]" : "bg-[#edf3ef] text-[#2d5b45]"}`}>
                        {product.stock <= 10 ? "Low" : "Good"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#5f493d]">
                      <div className="rounded-xl bg-[#f8f0e7] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Stok</p>
                        <p className="mt-1 font-semibold text-[#2b1d18]">{product.stock} pcs</p>
                      </div>
                      <div className="rounded-xl bg-[#f8f0e7] p-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Harga</p>
                        <p className="mt-1 font-semibold text-[#2b1d18]">{formatCurrency(product.price)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleStartEditProduct(product)} className="rounded-full bg-[#edf3ef] px-2.5 py-1.5 text-[10px] font-semibold text-[#2d5b45]">
                        Edit
                      </button>
                      <button type="button" onClick={() => setProductToDeleteId(product.id)} className="rounded-full bg-[#f8d7d7] px-2.5 py-1.5 text-[10px] font-semibold text-[#9b3b34]">
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRestockProductId(product.id);
                          setRestockQty("10");
                        }}
                        className="ml-auto rounded-full bg-[#7c4a2d] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-2xl bg-[#fffaf5] p-4 text-sm text-[#7d685f]">Menu tidak ditemukan untuk filter dan pencarian saat ini.</div>
              )}
            </div>
          </div>
        </div>

        {stockFilteredProducts.length > 6 && (
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
            <button type="button" onClick={() => setStockPage(Math.max(1, stockPage - 1))} disabled={safeStockPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e7d9] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman stok sebelumnya">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-[#4d382f]">Halaman {safeStockPage} / {stockTotalPages}</span>
            <button type="button" onClick={() => setStockPage(Math.min(stockTotalPages, stockPage + 1))} disabled={safeStockPage === stockTotalPages} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c4a2d] text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman stok berikutnya">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
