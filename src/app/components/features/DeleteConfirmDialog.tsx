interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  targetName: string;
  meta: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  title,
  targetName,
  meta,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
      <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2b1d18]">{title}</h3>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-[#f8f0e7] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Target</p>
            <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{targetName}</p>
            <p className="mt-1 text-sm text-[#7d685f]">{meta}</p>
          </div>

          <p className="text-sm text-[#5d4235]">{description}</p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-2xl bg-[#9b3b34] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#842f2a]"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
