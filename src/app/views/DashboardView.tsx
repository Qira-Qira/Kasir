import { TrendingUp, BadgeCheck, PackageSearch } from "lucide-react";
import { Badge } from "../components/ui/badge";
import type { Product } from "../types";

interface DashboardViewProps {
  lowStockProducts: Product[];
}

export function DashboardView({ lowStockProducts }: DashboardViewProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Trend</p>
              <h3 className="mt-1 text-base font-semibold text-[#2b1d18] sm:text-lg">Pertumbuhan Penjualan</h3>
            </div>
            <div className="rounded-full bg-[#edf3ef] p-2 text-[#2d5b45]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4e6d7] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#866c5d]">Hari Ini</p>
              <p className="mt-2 text-base font-semibold text-[#2b1d18] sm:text-lg">Rp 1.2Jt</p>
            </div>
            <div className="rounded-2xl bg-[#edf3ef] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#6d8175]">Minggu</p>
              <p className="mt-2 text-base font-semibold text-[#2b1d18] sm:text-lg">Rp 3.8Jt</p>
            </div>
            <div className="rounded-2xl bg-[#fbe7df] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#8f6d61]">Bulan</p>
              <p className="mt-2 text-base font-semibold text-[#2b1d18] sm:text-lg">Rp 15.2Jt</p>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] bg-[#f8f0e7] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Sales velocity</p>
              <p className="text-sm font-semibold text-[#2b1d18]">87%</p>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-[#eee0ce]">
              <span className="block w-[85%] rounded-full bg-[#7c4a2d]" />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-[#7d685f]">
              <span>Target</span>
              <span>Rp 1.8Jt</span>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Investor</p>
          <h3 className="mt-1 text-base font-semibold text-[#2b1d18] sm:text-lg">Status Portofolio</h3>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">ROI</span>
              <span className="font-semibold text-[#2b1d18]">+18.4%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">Margin</span>
              <span className="font-semibold text-[#2b1d18]">34.2%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">Kas</span>
              <span className="font-semibold text-[#2b1d18]">Rp 420Jt</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Top Products</p>
            <Badge className="rounded-full bg-[#7c4a2d] text-white">Live</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { name: "Cappuccino", sales: 142, share: "26%" },
              { name: "Sandwich", sales: 98, share: "18%" },
              { name: "Croissant", sales: 85, share: "15%" },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-[#2b1d18]">{item.name}</span>
                  <span className="text-[#7d685f]">{item.sales} sold</span>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-[#efe0d0]">
                  <span className="block rounded-full bg-[#c98b5b]" style={{ width: item.share }} />
                </div>
                <p className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7d685f]">{item.share}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Operational Health</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Customer satisfaction", value: 96, color: "bg-[#2d5b45]" },
              { label: "Inventory accuracy", value: 91, color: "bg-[#7c4a2d]" },
              { label: "Payment success", value: 99, color: "bg-[#c98b5b]" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[#5f493d]">
                  <span>{item.label}</span>
                  <span className="font-semibold text-[#2b1d18]">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f0e1cf]">
                  <span className={`block h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Inventory Watchlist</p>
          <Badge className="rounded-full bg-[#fbe7df] text-[#8d4c3d]">Low stock</Badge>
        </div>

        <div className="mt-5 space-y-3">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8f0e7] p-3">
                <div>
                  <p className="font-medium text-[#2b1d18]">{product.name}</p>
                  <p className="text-xs text-[#7d685f]">{product.category}</p>
                </div>
                <span className="rounded-full bg-[#f8d7d7] px-2.5 py-1 text-xs font-semibold text-[#9b3b34]">
                  {product.stock} left
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#f8f0e7] p-4 text-sm text-[#7d685f]">Semua stok aman.</div>
          )}
        </div>
      </div>
    </div>
  );
}
