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
    Minuman: "bg-[#eaf3ff] text-[#376999]",
    Makanan: "bg-[#fff1d8] text-[#8e5b1f]",
    Snack: "bg-[#fce9db] text-[#9d5b41]",
  }[category] ?? "bg-[#f4efe9] text-[#6f5a4f]";

  return (
    <Card className="group cursor-pointer rounded-[24px] border-[#efdfca] bg-[#fffaf5] p-4 shadow-[0_12px_30px_rgba(73,46,32,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(73,46,32,0.12)]">
      <div className="flex min-h-[190px] flex-col justify-between gap-5">
        <div className="space-y-3">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${categoryColor}`}>
            {category}
          </span>

          <div className="rounded-[20px] bg-gradient-to-br from-[#f8eee6] to-[#f0dfca] p-3">
            <div className="flex h-20 items-center justify-center rounded-[16px] border border-[#eddcc3] bg-[#fffdf9] text-xl font-semibold text-[#7c4a2d]">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>

          <h3 className="line-clamp-2 text-base font-semibold text-[#2b1d18]">{name}</h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a6a52]">Harga</p>
            <p className="mt-1 text-lg font-semibold text-[#2b1d18]">Rp {price.toLocaleString('id-ID')}</p>
          </div>

          <Button size="sm" onClick={onAdd} className="gap-2 rounded-xl bg-[#7c4a2d] px-3 text-sm font-semibold text-[#fffaf5] hover:bg-[#6d3f2a]">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>
      </div>
    </Card>
  );
}
