import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export type ProductRecipeDraftItem = {
  ingredientName: string;
  grams: string;
};

export type ProductFormState = {
  name: string;
  price: string;
  category: string;
  recipe: ProductRecipeDraftItem[];
};

interface ProductFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  formState: ProductFormState;
  categories: readonly string[];
  rawMaterials: Array<{ id: string; name: string }>;
  onChange: (field: keyof ProductFormState, value: string | ProductRecipeDraftItem[]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function ProductFormModal({
  open,
  title,
  submitLabel,
  formState,
  categories,
  rawMaterials,
  onChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  if (!open) return null;

  const recipeRows = formState.recipe.length > 0 ? formState.recipe : [{ ingredientName: "", grams: "" }];

  const addRecipeRow = () => {
    onChange("recipe", [
      ...recipeRows,
      { ingredientName: rawMaterials[0]?.name ?? "", grams: "" },
    ]);
  };

  const updateRecipeRow = (index: number, field: keyof ProductRecipeDraftItem, value: string) => {
    const next = [...recipeRows];
    next[index] = { ...next[index], [field]: value };
    onChange("recipe", next);
  };

  const removeRecipeRow = (index: number) => {
    const next = recipeRows.filter((_, itemIndex) => itemIndex !== index);
    onChange("recipe", next.length > 0 ? next : [{ ingredientName: "", grams: "" }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
      <div className="w-full max-w-3xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
            <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">{title}</h3>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Nama produk</label>
            <Input
              value={formState.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="Contoh: Kopi Susu"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Harga</label>
            <Input
              type="number"
              value={formState.price}
              onChange={(event) => onChange("price", event.target.value)}
              placeholder="15000"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Kategori</label>
            <select
              value={formState.category}
              onChange={(event) => onChange("category", event.target.value)}
              className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
            >
              {categories.filter((item) => item !== "Semua").map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-[#eddcc3] bg-[#f8f0e7] p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[#4d382f]">Resep bahan baku (gram)</label>
              <button
                type="button"
                onClick={addRecipeRow}
                className="rounded-full bg-[#7c4a2d] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                + Tambah bahan
              </button>
            </div>

            <div className="space-y-3">
              {recipeRows.map((row, index) => (
                <div key={`${row.ingredientName}-${index}`} className="grid gap-2 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Bahan</label>
                    <select
                      value={row.ingredientName}
                      onChange={(event) => updateRecipeRow(index, "ingredientName", event.target.value)}
                      className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-[#2b1d18] outline-none"
                    >
                      <option value="">Pilih bahan baku</option>
                      {rawMaterials.map((material) => (
                        <option key={material.id} value={material.name}>{material.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Gram per porsi</label>
                    <Input
                      type="number"
                      min="1"
                      value={row.grams}
                      onChange={(event) => updateRecipeRow(index, "grams", event.target.value)}
                      placeholder="20"
                      className="h-11 rounded-2xl border-[#ebdcc7] bg-[#fffaf5] text-[#2b1d18]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRecipeRow(index)}
                    className="h-11 rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-3 text-xs font-medium text-[#4d382f]"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
            >
              Batal
            </button>
            <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
