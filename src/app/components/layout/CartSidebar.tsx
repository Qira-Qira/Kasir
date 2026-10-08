import { ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CartItem } from "../ui/CartItem";
import { ScrollArea } from "../ui/scroll-area";
import type { CartItemType } from "../../types";

type CartSidebarProps = {
  cart: CartItemType[];
  totalItems: number;
  totalAmount: number;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onIncreaseAddon: (itemId: string, addonId: string) => void;
  onDecreaseAddon: (itemId: string, addonId: string) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onPayNow: () => void;
  formatCurrency: (value: number) => string;
};

export function CartSidebar({
  cart,
  totalItems,
  totalAmount,
  onIncrease,
  onDecrease,
  onIncreaseAddon,
  onDecreaseAddon,
  onRemove,
  onClearCart,
  onPayNow,
  formatCurrency,
}: CartSidebarProps) {
  return (
    <aside className="flex w-full flex-col border-t border-[#ead8c1] bg-[#f8f1ea] md:w-[320px] lg:w-[340px] xl:w-[390px] xl:border-l xl:border-t-0">
      <div className="border-b border-[#ead8c1] bg-[linear-gradient(180deg,#f9f3ee_0%,#f4e9df_100%)] p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1e1ce] text-[#5d4235] shadow-[0_8px_18px_rgba(124,74,45,0.14)]">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Pesanan</p>
              <h2 className="mt-1 text-lg font-semibold text-[#2b1d18]">Saat Ini</h2>
            </div>
          </div>

          {totalItems > 0 && (
            <Badge variant="secondary" className="rounded-full bg-[#7c4a2d] px-2.5 py-1 text-white shadow-[0_10px_18px_rgba(124,74,45,0.18)]">
              {totalItems}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto p-4 sm:p-5">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8c3a5] bg-[#fffaf5] p-6 text-center text-[#7d685f]">
            <ShoppingCart className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-base font-medium text-[#3d2a22]">Keranjang masih kosong</p>
            <p className="mt-1 text-sm">Pilih menu untuk memulai order</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                addOns={item.addOns}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
                onIncreaseAddon={(addonId) => onIncreaseAddon(item.id, addonId)}
                onDecreaseAddon={(addonId) => onDecreaseAddon(item.id, addonId)}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="space-y-4 border-t border-[#ead8c1] bg-[#f8f1ea] p-4 sm:p-6">
        {cart.length > 0 && (
          <Button
            variant="outline"
            className="w-full gap-2 rounded-2xl border-[#e7d4ba] bg-[#fffaf5] text-[#3f2d26]"
            onClick={onClearCart}
          >
            <Trash2 className="h-4 w-4" />
            Kosongkan Keranjang
          </Button>
        )}

        <div className="rounded-[22px] bg-[#fffdf9] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.05)]">
          <div className="flex items-center justify-between text-sm text-[#7d685f]">
            <span>Subtotal</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#f0e6db] pt-3 text-base font-semibold text-[#2b1d18]">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <Button
          className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] shadow-[0_18px_25px_rgba(124,74,45,0.18)] hover:bg-[#6d3f2a]"
          size="lg"
          disabled={cart.length === 0}
          onClick={onPayNow}
        >
          Bayar Sekarang
        </Button>
      </div>
    </aside>
  );
}
