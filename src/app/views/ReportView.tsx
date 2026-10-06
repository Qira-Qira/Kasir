import { BarChart3, ChartNoAxesCombined, CircleDollarSign, Clock, ShoppingCart, TrendingUp, ShieldCheck } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type ReportRange = "Hari Ini" | "7 Hari Terakhir" | "Bulanan" | "Custom Date";
type ReportShift = "Semua Shift" | "Shift 1" | "Shift 2";
type ReportBranch = "Semua Cabang" | "Cabang Utama" | "Cabang 2";

interface ReportViewProps {
  products?: Array<{ name: string; category: string }>;
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
    transactions?: Array<{
      id: string;
      items: Array<{ name: string; quantity: number; price: number; category?: string }>;
      total: number;
      paymentMethod: string;
      amountPaid: number;
      orderType: string;
      createdAt: string;
    }>;
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

export function ReportView({ products = [], report, reportRange, setReportRange, reportShift, setReportShift, reportBranch, setReportBranch, reportStartDate, setReportStartDate, reportEndDate, setReportEndDate, }: ReportViewProps) {
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

  const productCategoryMap = new Map(
    products.map((product) => [product.name.toLowerCase(), product.category])
  );

  const transactionItems = (report?.transactions ?? []).map((transaction) => {
    const categories = transaction.items
      .map((item) => productCategoryMap.get(item.name.toLowerCase()) || item.category || "Lainnya")
      .filter(Boolean);

    return {
      ...transaction,
      categories,
    };
  });

  const categoryOptions = ["Semua Kategori", ...new Set(products.map((item) => item.category).filter(Boolean))];

  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("Semua Kategori");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const filteredTransactions = transactionItems.filter((transaction) => {
    const haystack = [
      transaction.id,
      transaction.paymentMethod,
      transaction.orderType,
      transaction.total.toString(),
      ...transaction.items.map((item) => `${item.name} ${item.quantity} ${item.price}`),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !transactionSearch || haystack.includes(transactionSearch.toLowerCase());
    const matchesCategory =
      transactionCategory === "Semua Kategori" ||
      transaction.categories.includes(transactionCategory);

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / transactionsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * transactionsPerPage,
    safeCurrentPage * transactionsPerPage,
  );

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

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex flex-col gap-3 border-b border-[#f0e1cf] pb-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Riwayat Transaksi</h3>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={transactionSearch}
              onChange={(event) => setTransactionSearch(event.target.value)}
              placeholder="Cari transaksi / item / ID"
              className="h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none sm:w-64"
            />
            <select
              value={transactionCategory}
              onChange={(event) => setTransactionCategory(event.target.value)}
              className="h-10 rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          {filteredTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e5d1b8] bg-[#faf2ea] p-6 text-center text-sm text-[#7d685f]">
              Tidak ada transaksi yang sesuai dengan filter yang dipilih.
            </div>
          ) : (
            <div className="divide-y divide-[#eadcc0] overflow-hidden rounded-2xl border border-[#eadcc0] bg-[#fffaf5]">
              {paginatedTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-[#f8f0e7]/80 p-4 transition-colors hover:bg-[#f4e7d5]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">ID Transaksi</p>
                      <p className="mt-1 text-base font-semibold text-[#2b1d18]">{transaction.id}</p>
                    </div>

                    <div className="grid w-full gap-2 text-sm text-[#5f493d] sm:grid-cols-3 lg:max-w-[560px]">
                      <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Waktu</p>
                        <p className="mt-1 text-sm font-medium text-[#2b1d18]">
                          {new Date(transaction.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Metode</p>
                        <p className="mt-1 text-sm font-medium text-[#2b1d18]">{transaction.paymentMethod}</p>
                      </div>
                      <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Jenis</p>
                        <p className="mt-1 text-sm font-medium text-[#2b1d18]">{transaction.orderType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {transaction.items.slice(0, 3).map((item) => (
                        <span key={`${transaction.id}-${item.name}`} className="rounded-full bg-[#efe3d3] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                      {transaction.items.length > 3 && (
                        <span className="rounded-full bg-[#e9ddd0] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]">
                          +{transaction.items.length - 3} lagi
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Total</p>
                      <p className="mt-1 text-lg font-semibold text-[#2b1d18]">Rp {transaction.total.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {transaction.categories.map((category) => (
                      <span key={`${transaction.id}-${category}`} className="rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-[#eadcc0] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5f493d]">
              Menampilkan {Math.min(filteredTransactions.length, (safeCurrentPage - 1) * transactionsPerPage + 1)}-{Math.min(filteredTransactions.length, safeCurrentPage * transactionsPerPage)} dari {filteredTransactions.length} transaksi
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="rounded-xl border border-[#d9b897] bg-[#fffaf5] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <span className="rounded-xl bg-[#f0e8de] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d4235]">
                {safeCurrentPage}/{totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage === totalPages}
                className="rounded-xl border border-[#d9b897] bg-[#fffaf5] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
