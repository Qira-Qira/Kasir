import { Search, Package, Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import type { RawMaterialStock } from "../types";

interface StockViewProps {
  rawMaterialStock: RawMaterialStock[];
  rawMaterialDraft: { name: string; stockGrams: string; hppPerUnit: string; unit: "gram" | "ml" };
  editingRawMaterialId: string | null;
  setRawMaterialDraft: (value: { name: string; stockGrams: string; hppPerUnit: string; unit: "gram" | "ml" }) => void;
  setEditingRawMaterialId: (value: string | null) => void;
  handleAddRawMaterial: (event?: React.FormEvent<HTMLFormElement>) => void;
  handleUpdateRawMaterial: (id: string) => void;
  handleDeleteRawMaterial: (id: string) => void;
  handleStartEditRawMaterial: (material: RawMaterialStock) => void;
  handleRestockIngredient: (ingredientName: string, grams: number) => void;
  stockSearch: string;
  setStockSearch: (value: string) => void;
  stockPage: number;
  setStockPage: (value: number) => void;
  formatCurrency: (value: number) => string;
}

export function StockView({
  rawMaterialStock,
  rawMaterialDraft,
  editingRawMaterialId,
  setRawMaterialDraft,
  setEditingRawMaterialId,
  handleAddRawMaterial,
  handleUpdateRawMaterial,
  handleDeleteRawMaterial,
  handleStartEditRawMaterial,
  handleRestockIngredient,
  stockSearch,
  setStockSearch,
  stockPage,
  setStockPage,
  formatCurrency,
}: StockViewProps) {
  const filteredMaterials = [...rawMaterialStock]
    .filter((material) => material.name.toLowerCase().includes(stockSearch.toLowerCase()))
    .sort((a, b) => a.stockGrams - b.stockGrams);

  const totalCritical = rawMaterialStock.filter((item) => item.stockGrams <= 0).length;

  return (
    <div className="flex min-h-0 flex-col space-y-4 overflow-hidden sm:space-y-5">
      <div className="rounded-[22px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:p-5 sm:rounded-[24px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <Package className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-[#2b1d18] sm:text-lg">Master Bahan Baku</h3>
          </div>
          <Badge className="w-fit rounded-full bg-[#edf3ef] text-[#2d5b45]">Satuan: gram</Badge>
        </div>

        <form onSubmit={(event) => {
          event.preventDefault();
          if (editingRawMaterialId) {
            handleUpdateRawMaterial(editingRawMaterialId);
            return;
          }
          handleAddRawMaterial(event);
        }} className="mt-4 grid gap-3 rounded-2xl border border-[#ebdcc7] bg-[#f8f0e7] p-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Nama bahan</label>
            <Input
              value={rawMaterialDraft.name}
              onChange={(event) => setRawMaterialDraft({ ...rawMaterialDraft, name: event.target.value })}
              placeholder="Contoh: Bubuk Kopi"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#fffaf5] text-[#2b1d18]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Stok awal</label>
            <Input
              type="number"
              min="0"
              value={rawMaterialDraft.stockGrams}
              onChange={(event) => setRawMaterialDraft({ ...rawMaterialDraft, stockGrams: event.target.value })}
              placeholder="5000"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#fffaf5] text-[#2b1d18]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">HPP / satuan</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={rawMaterialDraft.hppPerUnit}
                onChange={(event) => setRawMaterialDraft({ ...rawMaterialDraft, hppPerUnit: event.target.value })}
                placeholder="2000"
                className="h-11 flex-1 rounded-2xl border-[#ebdcc7] bg-[#fffaf5] text-[#2b1d18]"
              />
              <select
                value={rawMaterialDraft.unit}
                onChange={(event) => setRawMaterialDraft({ ...rawMaterialDraft, unit: event.target.value as "gram" | "ml" })}
                className="h-11 rounded-2xl border border-[#ebdcc7] bg-[#fffaf5] px-2 text-sm text-[#2b1d18]"
              >
                <option value="gram">gram</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-2">
            {editingRawMaterialId && (
              <button
                type="button"
                onClick={() => {
                  setEditingRawMaterialId(null);
                  setRawMaterialDraft({ name: "", stockGrams: "", hppPerUnit: "", unit: "gram" });
                }}
                className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="rounded-2xl bg-[#7c4a2d] px-4 py-2.5 text-sm font-semibold text-[#fffaf5]"
            >
              {editingRawMaterialId ? "Simpan Perubahan" : "Tambah Bahan"}
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
            <Input
              value={stockSearch}
              onChange={(event) => setStockSearch(event.target.value)}
              placeholder="Cari bahan baku..."
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
            />
          </div>
          <Badge className="w-fit rounded-full bg-[#fbe7df] text-[#8d4c3d]">{filteredMaterials.length} item</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div key={material.id} className="rounded-2xl bg-[#fffaf5] p-3 shadow-[0_8px_16px_rgba(88,63,46,0.03)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#2b1d18]">{material.name}</p>
                    <p className="mt-1 text-[11px] text-[#7d685f]">{material.unit === "gram" ? "HPP / gram" : "HPP / ml"}</p>
                  </div>
                  {material.stockGrams <= 0 && (
                    <span className="rounded-full bg-[#f8d7d7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b3b34]">
                      Kosong
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#5f493d]">
                  <div className="rounded-xl bg-[#f8f0e7] p-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Stok</p>
                    <p className="mt-1 font-semibold text-[#2b1d18]">{material.stockGrams} {material.unit}</p>
                  </div>
                  <div className="rounded-xl bg-[#f8f0e7] p-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Subtotal</p>
                    <p className="mt-1 font-semibold text-[#2b1d18]">{formatCurrency(material.stockGrams * material.hppPerUnit)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#f8f0e7] p-2 text-sm text-[#5f493d]">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">HPP / satuan</p>
                  <p className="mt-1 font-semibold text-[#2b1d18]">{formatCurrency(material.hppPerUnit)} / {material.unit}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => handleStartEditRawMaterial(material)} className="rounded-full bg-[#edf3ef] px-2.5 py-1.5 text-[10px] font-semibold text-[#2d5b45]">
                    <span className="inline-flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</span>
                  </button>
                  <button type="button" onClick={() => handleDeleteRawMaterial(material.id)} className="rounded-full bg-[#f8d7d7] px-2.5 py-1.5 text-[10px] font-semibold text-[#9b3b34]">
                    <span className="inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Hapus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input = window.prompt(`Masukkan jumlah stok untuk ${material.name} (${material.unit}):`, "500");
                      if (input === null) return;

                      const nextAmount = Number(input);
                      if (!Number.isFinite(nextAmount) || nextAmount <= 0) {
                        window.alert(`Jumlah stok harus angka lebih dari 0 ${material.unit}.`);
                        return;
                      }

                      handleRestockIngredient(material.name, nextAmount);
                    }}
                    className="ml-auto rounded-full bg-[#7c4a2d] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    <span className="inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Stok</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl bg-[#fffaf5] p-4 text-sm text-[#7d685f]">Bahan baku tidak ditemukan.</div>
          )}
        </div>
      </div>
    </div>
  );
}
