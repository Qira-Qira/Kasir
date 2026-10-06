import { BarChart3, ChartNoAxesCombined, CircleDollarSign, Clock, ShoppingCart, TrendingUp, ShieldCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type ReportRange = "Hari Ini" | "7 Hari Terakhir" | "Bulanan" | "Custom Date";
type ReportShift = "Semua Shift" | "Shift 1" | "Shift 2";
type ReportBranch = "Semua Cabang" | "Cabang Utama" | "Cabang 2";

interface ReportViewProps {
  report?: {
    kpiCards?: Array<{ label: string; value: string; change: string; color?: string }>;
    bestSellerMenu?: Array<{ name: string; qty: number; revenue: string }>;
    slowMovingMenu?: Array<{ name: string; qty: number; status: string }>;
    paymentBreakdown?: Array<{ label: string; share: number; amount: string; color: string }>;
    peakHours?: Array<{ label: string; value: number }>;
    orderTypes?: Array<{ label: string; value: number; amount: string }>;
    shiftSummary?: Array<{ label: string; value: string }>;
    promoSummary?: Array<{ label: string; value: string }>;
    voidLogs?: Array<{ id: string; reason: string; time: string; amount: string }>;
    fetchedAt?: string;
  };
  reportRange: ReportRange;
  setReportRange: Dispatch<SetStateAction<ReportRange>>;
  reportShift: ReportShift;
  setReportShift: Dispatch<SetStateAction<ReportShift>>;
  reportBranch: ReportBranch;
  setReportBranch: Dispatch<SetStateAction<ReportBranch>>;
  reportStartDate: string;
  setReportStartDate: Dispatch<SetStateAction<string>>;
  reportEndDate: string;
  setReportEndDate: Dispatch<SetStateAction<string>>;
}

export function ReportView({ report, reportRange, setReportRange, reportShift, setReportShift, reportBranch, setReportBranch, reportStartDate, setReportStartDate, reportEndDate, setReportEndDate, }: ReportViewProps) {
  const rangeOptions = ["Hari Ini", "7 Hari Terakhir", "Bulanan", "Custom Date"] as const;
  const shiftOptions = ["Semua Shift", "Shift 1", "Shift 2"] as const;
  const branchOptions = ["Semua Cabang", "Cabang Utama", "Cabang 2"] as const;

  const kpiCards = report?.kpiCards ?? [
    { label: "Gross Sales", value: "Rp 42.500.000", change: "+12.4%", color: "text-[#2d5b45]" },
    { label: "Net Sales", value: "Rp 38.620.000", change: "+9.8%", color: "text-[#2d5b45]" },
    { label: "Total Transaksi", value: "1.248", change: "+6.3%", color: "text-[#2d5b45]" },
    { label: "AOV", value: "Rp 34.000", change: "+4.1%", color: "text-[#2d5b45]" },
  ];

  const bestSellerMenu = report?.bestSellerMenu ?? [
    { name: "Cappuccino", qty: 142, revenue: "Rp 3.550.000" },
    { name: "Latte", qty: 126, revenue: "Rp 3.150.000" },
    { name: "Croissant", qty: 118, revenue: "Rp 2.120.000" },
    { name: "Green Tea", qty: 104, revenue: "Rp 1.560.000" },
    { name: "Sandwich", qty: 92, revenue: "Rp 2.760.000" },
  ];

  const slowMovingMenu = report?.slowMovingMenu ?? [
    { name: "Smoothie Bowl", qty: 18, status: "Slow Move" },
    { name: "Orange Juice", qty: 22, status: "Low Qty" },
    { name: "Chocolate Cake", qty: 27, status: "Stagnant" },
  ];

  const paymentBreakdown = report?.paymentBreakdown ?? [
    { label: "Tunai", share: 62, amount: "Rp 26.350.000", color: "#7c4a2d" },
    { label: "QRIS", share: 38, amount: "Rp 16.150.000", color: "#d39b6d" },
  ];

  const peakHours = report?.peakHours ?? [
    { label: "09:00", value: 22 },
    { label: "11:00", value: 62 },
    { label: "12:00", value: 81 },
    { label: "13:00", value: 74 },
    { label: "14:00", value: 58 },
    { label: "18:00", value: 84 },
    { label: "19:00", value: 90 },
    { label: "20:00", value: 72 },
    { label: "21:00", value: 48 },
  ];

  const orderTypes = report?.orderTypes ?? [
    { label: "Dine-in", value: 54, amount: "Rp 23.000.000" },
    { label: "Takeaway", value: 28, amount: "Rp 11.900.000" },
    { label: "Online Delivery", value: 18, amount: "Rp 7.600.000" },
  ];

  const shiftSummary = report?.shiftSummary ?? [
    { label: "Kas Awal", value: "Rp 2.500.000" },
    { label: "Kas Akhir", value: "Rp 2.940.000" },
    { label: "Petty Cash", value: "Rp 210.000" },
    { label: "Selisih Kas", value: "Rp 230.000" },
  ];

  const promoSummary = report?.promoSummary ?? [
    { label: "Total Diskon", value: "Rp 1.940.000" },
    { label: "Promo Aktif", value: "3 Campaign" },
    { label: "Void Count", value: "5 kali" },
    { label: "Refund", value: "Rp 320.000" },
  ];

  const voidLogs = report?.voidLogs ?? [
    { id: "VOID-1045", reason: "Pembatalan pelanggan", time: "09:42", amount: "-Rp 58.000" },
    { id: "VOID-1189", reason: "Produk tidak sesuai", time: "12:15", amount: "-Rp 85.000" },
    { id: "VOID-1224", reason: "Kesalahan input kasir", time: "18:08", amount: "-Rp 120.000" },
  ];

  const normalizedPaymentBreakdown = paymentBreakdown.length > 0
    ? paymentBreakdown.map((item, index, array) => {
        const total = array.reduce((sum, current) => sum + (Number(current.share) || 0), 0) || 100;
        const previous = array.slice(0, index).reduce((sum, current) => sum + (Number(current.share) || 0), 0);
        const start = (previous / total) * 100;
        const end = ((previous + (Number(item.share) || 0)) / total) * 100;
        const safeColor = item.color?.startsWith("#") ? item.color : "#7c4a2d";
        return { ...item, color: safeColor, start, end };
      })
    : [];

  const leadingShare = normalizedPaymentBreakdown.reduce(
    (max, item) => Math.max(max, Number(item.share) || 0),
    0
  );

  const donutGradient = normalizedPaymentBreakdown.length > 0
    ? `conic-gradient(${normalizedPaymentBreakdown
        .map((item) => `${item.color} ${item.start}% ${item.end}%`)
        .join(", ")})`
    : "conic-gradient(#e7d7c5 0% 100%)";

  return (
    <div className="flex min-h-0 flex-col space-y-5 overflow-y-auto pb-2">
      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Header Filter</p>
              <h3 className="text-lg font-semibold text-[#2b1d18]">Laporan Penjualan</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setReportRange(option)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${reportRange === option ? "bg-[#edf3ef] text-[#2d5b45]" : "bg-[#f3e7d9] text-[#5d4235]"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Shift</label>
            <select value={reportShift} onChange={(e) => setReportShift(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none">
              {shiftOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Cabang</label>
            <select value={reportBranch} onChange={(e) => setReportBranch(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none">
              {branchOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Tanggal mulai</label>
            <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none" />
          </div>
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Tanggal akhir</label>
            <input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((item) => (
          <div key={item.label} className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">{item.label}</p>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${item.color}`}>{item.change}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#2b1d18]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
                <ChartNoAxesCombined className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-[#2b1d18]">Best-Seller Menu</h3>
            </div>
            <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">Top 5</span>
          </div>

          <div className="mt-5 space-y-3">
            {bestSellerMenu.map((item, index) => (
              <div key={item.name} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7c4a2d] text-xs font-bold text-white">{index + 1}</span>
                    <div>
                      <p className="font-medium text-[#2b1d18]">{item.name}</p>
                      <p className="text-xs text-[#7d685f]">{item.qty} terjual</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#2b1d18]">{item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Slow-Moving</h3>
          </div>

          <div className="mt-5 space-y-3">
            {slowMovingMenu.map((item) => (
              <div key={item.name} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#2b1d18]">{item.name}</span>
                  <span className="rounded-full bg-[#f8d7d7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b3b34]">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-[#7d685f]">{item.qty} item terjual</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <CircleDollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Payment Method Breakdown</h3>
          </div>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: donutGradient }}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fffaf5] text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Share</p>
                  <p className="text-lg font-semibold text-[#2b1d18]">{leadingShare}%</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              {paymentBreakdown.map((item) => (
                <div key={item.label} className="rounded-2xl bg-[#f8f0e7] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || "#7c4a2d" }} />
                      <span className="font-medium text-[#2b1d18]">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#2b1d18]">{item.share}%</span>
                  </div>
                  <p className="mt-2 text-sm text-[#7d685f]">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Peak Hours Analysis</h3>
          </div>

          <div className="mt-6 flex h-44 items-end gap-2">
            {peakHours.map((hour) => (
              <div key={hour.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-[14px] bg-[linear-gradient(180deg,#d39b6d_0%,#7c4a2d_100%)]" style={{ height: `${hour.value}%` }} />
                <span className="text-[10px] font-medium text-[#7d685f]">{hour.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Order Type Breakdown</h3>
          </div>

          <div className="mt-6 space-y-4">
            {orderTypes.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[#5f493d]">
                  <span>{item.label}</span>
                  <span className="font-semibold text-[#2b1d18]">{item.amount}</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#f1e4d6]">
                  <div className="h-2.5 rounded-full bg-[#7c4a2d]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <CircleDollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Shift & Reconciliation Summary</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {shiftSummary.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Void, Refund & Promo Log</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {promoSummary.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-[#2b1d18]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {voidLogs.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
                <div>
                  <p className="font-medium text-[#2b1d18]">{item.id}</p>
                  <p className="text-xs text-[#7d685f]">{item.reason} • {item.time}</p>
                </div>
                <span className="font-semibold text-[#9b3b34]">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Action Summary</h3>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-[#edf3ef] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d5b45]">Promo yang efektif</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">Buy 1 Get 1 • 24% uplift</p>
            </div>
            <div className="rounded-2xl bg-[#f8f0e7] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Puncak transaksi</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">18:00 - 21:00</p>
            </div>
            <div className="rounded-2xl bg-[#f8f0e7] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Komposisi pembayaran</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">Tunai 62% • QRIS 38%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
