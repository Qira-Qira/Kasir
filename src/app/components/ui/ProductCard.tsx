import { Plus } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  onAdd: () => void;
}

export function ProductCard({ name, price, category, onAdd }: ProductCardProps) {
  const categoryColor = {
    Kopi: "bg-amber-100 text-amber-800",
    Makanan: "bg-orange-100 text-orange-800",
    Teh: "bg-emerald-100 text-emerald-800",
    Minuman: "bg-sky-100 text-sky-800",
  }[category] ?? "bg-muted text-muted-foreground";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex min-h-32 flex-col justify-between gap-6">
        <div>
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${categoryColor}`}>
            {category}
          </span>
          <h3 className="mt-3 line-clamp-2">{name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary">Rp {price.toLocaleString('id-ID')}</p>
          <Button size="sm" onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>
      </div>
    </Card>
  );
}
