import { Check, Coffee, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import type { AddonOption, Product } from "../../types";
import { normalizeAddonGroupSelection } from "../../lib/addons";

interface AddonSelectionDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (selectedAddons: AddonOption[]) => void;
}

export function AddonSelectionDialog({ open, product, onClose, onConfirm }: AddonSelectionDialogProps) {
  const options = useMemo(() => product?.addons ?? [], [product]);
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);

  useEffect(() => {
    const defaultSugar =
      options.find((option) => option.group === "Sugar Level" && option.name === "Normal Sugar") ??
      options.find((option) => option.group === "Sugar Level");
    setSelectedAddons(defaultSugar ? [defaultSugar] : []);
  }, [options, product, open]);

  if (!product || !options.length) return null;

  const toggleOption = (option: AddonOption) => {
    setSelectedAddons((prev) => {
      if (option.group === "Sugar Level") {
        return normalizeAddonGroupSelection(prev, option);
      }

      const existingIndex = prev.findIndex((item) => item.id === option.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next.splice(existingIndex, 1);
        return next;
      }

      return [...prev, option];
    });
  };

  const total = selectedAddons.reduce((sum, item) => sum + item.price, 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-w-lg rounded-[28px] border-[#eddcc3] bg-[#fffaf5] p-0 shadow-[0_24px_50px_rgba(88,63,46,0.12)]">
        <div className="border-b border-[#f0e1cf] p-5">
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3e5d5] text-[#5d4235]">
                <Coffee className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Modifier</p>
                <DialogTitle className="text-lg font-semibold text-[#2b1d18]">{product.name}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 p-5">
          {Array.from(new Set(options.map((item) => item.group))).map((group) => (
            <div key={group} className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">{group}</p>
              <div className="space-y-2">
                {options.filter((item) => item.group === group).map((option) => {
                  const active = selectedAddons.some((item) => item.id === option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleOption(option)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                        active ? "border-[#7c4a2d] bg-[#f8efe8] text-[#2b1d18]" : "border-[#ebdcc7] bg-[#fffaf5] text-[#5d4235]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? "bg-[#7c4a2d] text-white" : "bg-[#f3e7d9] text-[#5d4235]"}`}>
                          {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                        <span className="font-medium">{option.name}</span>
                      </span>
                      <span className="text-sm font-semibold">+Rp {option.price.toLocaleString("id-ID")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-[#f0e1cf] bg-[#faf3eb] p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Tambah biaya</p>
            <p className="text-lg font-semibold text-[#2b1d18]">Rp {total.toLocaleString("id-ID")}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-[#e7d4ba] bg-[#fffaf5] text-[#3f2d26]" onClick={onClose}>
              Batal
            </Button>
            <Button className="rounded-xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]" onClick={() => onConfirm(selectedAddons)}>
              Tambahkan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
