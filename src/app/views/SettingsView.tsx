import { ChevronLeft, ChevronRight, Search, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { Product } from "../types";

interface SettingsViewProps {
  products: Product[];
  menuSearch: string;
  setMenuSearch: (value: string) => void;
  settingsPage: number;
  setSettingsPage: (value: number) => void;
  handleStartEditProduct: (product: Product) => void;
  setProductToDeleteId: (value: string) => void;
  setIsAddMenuOpen: (value: boolean) => void;
  formatCurrency: (value: number) => string;
}

export function SettingsView({
  products,
  menuSearch,
  setMenuSearch,
  settingsPage,
  setSettingsPage,
  handleStartEditProduct,
  setProductToDeleteId,
  setIsAddMenuOpen,
  formatCurrency,
}: SettingsViewProps) {
  const menuQuery = menuSearch.trim().toLowerCase();
  const filteredMenuList = products.filter((product) => {
    if (!menuQuery) return true;
    return product.name.toLowerCase().includes(menuQuery) || product.category.toLowerCase().includes(menuQuery);
  });

  const totalPages = Math.max(1, Math.ceil(filteredMenuList.length / 7));
  const safeSettingsPage = Math.min(settingsPage, totalPages);
  const paginatedProducts = filteredMenuList.slice((safeSettingsPage - 1) * 7, safeSettingsPage * 7);

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
            <Settings className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-[#2b1d18] sm:text-lg">Kelola Menu</h3>
        </div>
        <span className="w-fit rounded-full bg-[#edf3ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
          {filteredMenuList.length} item
        </span>
      </div>

      <div className="mt-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
          <Input
            value={menuSearch}
            onChange={(event) => {
              setMenuSearch(event.target.value);
              setSettingsPage(1);
            }}
            placeholder="Cari menu..."
            className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
          />
        </div>
        <Button type="button" onClick={() => setIsAddMenuOpen(true)} className="h-11 rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]">
          Tambah Menu
        </Button>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-hidden">
        <div className="h-full space-y-3 overflow-y-auto pr-1">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product.id} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[#2b1d18]">{product.name}</p>
                    <p className="text-xs text-[#7d685f]">{product.category}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#2b1d18]">{formatCurrency(product.price)}</span>
                    <button type="button" onClick={() => handleStartEditProduct(product)} className="rounded-full bg-[#edf3ef] px-2 py-1 text-xs font-semibold text-[#2d5b45]">
                      Edit
                    </button>
                    <button type="button" onClick={() => setProductToDeleteId(product.id)} className="rounded-full bg-[#f8d7d7] px-2 py-1 text-xs font-semibold text-[#9b3b34]">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#f8f0e7] p-4 text-sm text-[#7d685f]">Menu tidak ditemukan.</div>
          )}
        </div>
      </div>

      {filteredMenuList.length > 7 && (
        <div className="mt-5 flex shrink-0 items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
          <button type="button" onClick={() => setSettingsPage(Math.max(1, settingsPage - 1))} disabled={safeSettingsPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e7d9] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman sebelumnya">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-[#4d382f]">Halaman {safeSettingsPage} / {totalPages}</span>
          <button type="button" onClick={() => setSettingsPage(Math.min(totalPages, settingsPage + 1))} disabled={safeSettingsPage === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c4a2d] text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman berikutnya">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
