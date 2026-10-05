export function ProductPageSkeleton() {
  return (
    <div className="flex min-h-0 flex-col space-y-4 overflow-hidden sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-2.5 w-20 animate-pulse rounded-full bg-[#eadcc6]" />
          <div className="h-6 w-36 animate-pulse rounded-xl bg-[#eadcc6]" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-full bg-[#eadcc6]" />
      </div>

      <div className="h-12 animate-pulse rounded-2xl bg-[#f1e5d4]" />

      <div className="hidden md:block">
        <div className="mb-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 flex-1 animate-pulse rounded-xl bg-[#f1e5d4]" />
          ))}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-[24px] border border-[#efdfca] bg-[#fffaf5] p-4 shadow-[0_12px_30px_rgba(73,46,32,0.06)]">
            <div className="space-y-3">
              <div className="h-5 w-16 animate-pulse rounded-full bg-[#f1e5d4]" />
              <div className="h-24 animate-pulse rounded-[20px] bg-[#f1e5d4]" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-[#f1e5d4]" />
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-3 w-12 animate-pulse rounded-full bg-[#f1e5d4]" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-[#f1e5d4]" />
                </div>
                <div className="h-6 w-12 animate-pulse rounded-full bg-[#f1e5d4]" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-xl bg-[#f1e5d4]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportPageSkeleton() {
  return (
    <div className="flex min-h-0 flex-col space-y-5 overflow-y-auto pb-2">
      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="h-7 w-40 animate-pulse rounded-xl bg-[#f1e5d4]" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-[#f1e5d4]" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[24px] bg-[#f1e5d4]" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-[24px] bg-[#f1e5d4]" />
        <div className="h-72 animate-pulse rounded-[24px] bg-[#f1e5d4]" />
      </div>
    </div>
  );
}
