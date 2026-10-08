import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addOns?: Array<{ id: string; name: string; price: number; quantity: number }>;
  onIncrease: () => void;
  onDecrease: () => void;
  onIncreaseAddon?: (addonId: string) => void;
  onDecreaseAddon?: (addonId: string) => void;
  onRemove: () => void;
}

export function CartItem({ name, price, quantity, addOns = [], onIncrease, onDecrease, onIncreaseAddon, onDecreaseAddon, onRemove }: CartItemProps) {
  const addOnSummary = addOns.length > 0 ? addOns.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`).join(", ") : "Tanpa add-on";

  return (
    <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffdf9] p-3 shadow-[0_8px_20px_rgba(88,63,46,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[#2b1d18]">{name}</p>
          <p className="mt-1 text-xs text-[#7d685f]">{addOnSummary}</p>
          <p className="mt-1 text-sm text-[#7d685f]">Rp {price.toLocaleString('id-ID')}</p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-[#b9614e] hover:bg-[#fbeae6]"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {addOns.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-[#f2e5d4] pt-3">
          {addOns.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between gap-2 rounded-xl bg-[#f9f3ed] px-2 py-1.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#3f2d26]">{addon.name}</p>
                <p className="text-[10px] text-[#7d685f]">Rp {addon.price.toLocaleString('id-ID')}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-[#e9d4ba] bg-[#fffaf5] text-[#3c2d25]"
                  onClick={() => onDecreaseAddon?.(addon.id)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center text-xs font-semibold text-[#2b1d18]">{addon.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-[#e9d4ba] bg-[#fffaf5] text-[#3c2d25]"
                  onClick={() => onIncreaseAddon?.(addon.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-[#e9d4ba] bg-[#f9f3ed] text-[#3c2d25]"
            onClick={onDecrease}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center text-sm font-semibold text-[#2b1d18]">{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-[#e9d4ba] bg-[#f9f3ed] text-[#3c2d25]"
            onClick={onIncrease}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm font-semibold text-[#2b1d18]">
          Rp {(price * quantity).toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}
