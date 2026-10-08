export interface ShiftCashInput {
  startingCash: number;
  cashSales: number;
  pettyCashOut?: number;
  cashIn?: number;
  actualCash?: number;
}

export interface ShiftClosingSummary {
  startingCash: number;
  cashSales: number;
  pettyCashOut: number;
  cashIn: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
}

export interface ShiftSessionSummary {
  startingCash: number;
  actualCash: number;
  pettyCashOut?: number;
  difference?: number;
  closedAt?: string | null;
}

export const calculateExpectedCash = ({
  startingCash,
  cashSales,
  pettyCashOut = 0,
  cashIn = 0,
}: ShiftCashInput) => {
  const safeStartingCash = Number.isFinite(startingCash) ? Number(startingCash) : 0;
  const safeCashSales = Number.isFinite(cashSales) ? Number(cashSales) : 0;
  const safePettyCashOut = Number.isFinite(pettyCashOut) ? Number(pettyCashOut) : 0;
  const safeCashIn = Number.isFinite(cashIn) ? Number(cashIn) : 0;

  return Number((safeStartingCash + safeCashSales + safeCashIn - safePettyCashOut).toFixed(2));
};

export const calculateShiftVariance = ({
  startingCash,
  cashSales,
  pettyCashOut = 0,
  cashIn = 0,
  actualCash = 0,
}: ShiftCashInput) => {
  const expected = calculateExpectedCash({ startingCash, cashSales, pettyCashOut, cashIn });
  const safeActualCash = Number.isFinite(actualCash) ? Number(actualCash) : 0;
  return Number((safeActualCash - expected).toFixed(2));
};

export const buildShiftSummaryRows = (sessions: ShiftSessionSummary[] = []) => {
  const snapshot = sessions[0] ?? null;

  if (!snapshot) {
    return [
      { label: "Kas Awal", value: "Rp 0" },
      { label: "Kas Akhir", value: "Rp 0" },
      { label: "Petty Cash", value: "Rp 0" },
      { label: "Selisih Kas", value: "Rp 0" },
    ];
  }

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? Number(value) : 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(safeValue)
      .replace(/\u00a0/g, " ");
  };

  const expected = calculateExpectedCash({
    startingCash: snapshot.startingCash,
    cashSales: (snapshot as any).cashSales ?? 0,
    cashIn: (snapshot as any).cashIn ?? 0,
    pettyCashOut: snapshot.pettyCashOut ?? 0,
  });

  const difference = Number.isFinite(snapshot.difference ?? NaN)
    ? Number(snapshot.difference)
    : Number((snapshot.actualCash - expected).toFixed(2));

  return [
    { label: "Kas Awal", value: formatCurrency(snapshot.startingCash) },
    { label: "Kas Akhir", value: formatCurrency(snapshot.actualCash) },
    { label: "Petty Cash", value: formatCurrency(snapshot.pettyCashOut ?? 0) },
    { label: "Selisih Kas", value: formatCurrency(difference) },
  ];
};
