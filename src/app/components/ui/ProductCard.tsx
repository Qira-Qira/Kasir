import { Plus } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  onAdd: () => void;
}

export function ProductCard({ name, price, category, image, onAdd }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <p className="text-muted-foreground text-sm">{category}</p>
          <h3 className="line-clamp-1">{name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary">Rp {price.toLocaleString('id-ID')}</p>
          <Button size="sm" onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
