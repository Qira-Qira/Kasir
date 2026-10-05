import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface RestockDialogProps {
  open: boolean;
  productName?: string;
  restockQty: string;
  onQtyChange: (value: string) => void;
  onConfirm: (qty: number) => void;
  onClose: () => void;
}

export function RestockDialog({
  open,
  productName,
  restockQty,
  onQtyChange,
  onConfirm,
  onClose,
}: RestockDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
      <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
        <h3 className="text-lg font-semibold text-[#2b1d18]">Restock Supplier</h3>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Menu</label>
            <p className="mt-2 text-base font-semibold text-[#2b1d18]">{productName ?? "Produk"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#4d382f]">Jumlah restock</label>
            <Input
              type="number"
              min="1"
              value={restockQty}
              onChange={(event) => onQtyChange(event.target.value)}
              className="mt-2 h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
          </div>

          <Button
            type="button"
            onClick={() => {
              const qty = Number(restockQty);
              if (Number.isFinite(qty) && qty > 0) {
                onConfirm(qty);
                onClose();
              }
            }}
            className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]"
          >
            Konfirmasi Restock
          </Button>
        </div>
      </div>
    </div>
  );
}
