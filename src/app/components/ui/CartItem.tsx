import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ name, price, quantity, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffdf9] p-3 shadow-[0_8px_20px_rgba(88,63,46,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[#2b1d18]">{name}</p>
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
