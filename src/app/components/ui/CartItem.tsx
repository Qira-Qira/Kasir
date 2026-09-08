import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

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
    <div className="flex items-center gap-3 py-3 border-b border-border">
      <div className="flex-1 min-w-0">
        <p className="truncate">{name}</p>
        <p className="text-sm text-muted-foreground">Rp {price.toLocaleString('id-ID')}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8"
          onClick={onDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8"
          onClick={onIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
