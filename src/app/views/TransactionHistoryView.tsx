import { CheckCircle2, Clock3, Search, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { Transaction } from "../types";

interface TransactionHistoryViewProps {
  transactions: Transaction[];
  onToggleStatus: (transactionId: string) => void;
  formatCurrency: (value: number) => string;
}

export function TransactionHistoryView({
  transactions,
  onToggleStatus,
  formatCurrency,
}: TransactionHistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortedTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const matchesStartDate = !startDate || transactionDate >= new Date(`${startDate}T00:00:00`);
      const matchesEndDate = !endDate || transactionDate <= new Date(`${endDate}T23:59:59`);

      const searchableText = [
        transaction.id,
        transaction.paymentMethod,
        transaction.orderType,
        transaction.items.map((item) => `${item.name} ${item.quantity}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [endDate, searchTerm, sortedTransactions, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const completedCount = sortedTransactions.filter((transaction) => transaction.isCompleted).length;
  const pendingCount = sortedTransactions.length - completedCount;

  return (
    <div className="flex min-h-0 flex-col space-y-5 overflow-y-auto pb-2">
      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Order Monitor</p>
              <h3 className="text-lg font-semibold text-[#2b1d18]">Riwayat Pesanan</h3>
            </div>
          </div>

          <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-[#ebdcc7] bg-[#fffaf5] px-3 py-2">
            <Search className="h-4 w-4 text-[#8d6d5a]" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari ID, metode, atau item"
              className="w-full border-none bg-transparent text-sm text-[#2b1d18] outline-none placeholder:text-[#9a8579]"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Dari tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none"
            />
          </div>
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Sampai tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-2 h-10 w-full rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-3 text-sm text-[#2b1d18] outline-none"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-[#f8f0e7] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Total Pesanan</p>
            <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{sortedTransactions.length}</p>
          </div>
          <div className="rounded-2xl bg-[#edf3ef] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d5b45]">Sudah Dibuat</p>
            <p className="mt-2 text-2xl font-semibold text-[#2d5b45]">{completedCount}</p>
          </div>
          <div className="rounded-2xl bg-[#f6ebde] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d4c3d]">Belum Dibuat</p>
            <p className="mt-2 text-2xl font-semibold text-[#8d4c3d]">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5d1b8] bg-[#faf2ea] p-8 text-center text-sm text-[#7d685f]">
            Tidak ada pesanan yang sesuai pencarian atau rentang tanggal.
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-[#eadcc0] bg-[#f8f0e7]/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">ID Pesanan</p>
                    <p className="mt-1 text-base font-semibold text-[#2b1d18]">{transaction.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#efe3d3] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]">
                      {transaction.paymentMethod}
                    </span>
                    <span className="rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
                      {transaction.orderType}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Waktu</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#2b1d18]">
                      <Clock3 className="h-3.5 w-3.5 text-[#8d6d5a]" />
                      {new Date(transaction.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Total</p>
                    <p className="mt-1 text-sm font-semibold text-[#2b1d18]">{formatCurrency(transaction.total)}</p>
                  </div>

                  <div className="rounded-xl border border-[#eadcc0] bg-[#fffaf5] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8d6d5a]">Status</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#2b1d18]">
                      {transaction.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-[#2d5b45]" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-[#8d4c3d]" />
                      )}
                      {transaction.isCompleted ? "Sudah dibuat" : "Belum dibuat"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {transaction.items.map((item) => (
                      <span key={`${transaction.id}-${item.name}`} className="rounded-full bg-[#efe3d3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(transaction.id)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                      transaction.isCompleted
                        ? "border border-[#d4e9dc] bg-[#edf3ef] text-[#2d5b45]"
                        : "border border-[#f0d1b8] bg-[#fff4ed] text-[#8d4c3d]"
                    }`}
                  >
                    {transaction.isCompleted ? "Tandai belum dibuat" : "Tandai sudah dibuat"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-[#eadcc0] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5f493d]">
              Menampilkan {Math.min(filteredTransactions.length, (safeCurrentPage - 1) * pageSize + 1)}-{Math.min(filteredTransactions.length, safeCurrentPage * pageSize)} dari {filteredTransactions.length} pesanan
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
