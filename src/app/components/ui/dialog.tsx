import { useEffect, type HTMLAttributes, type ReactNode } from "react";

interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode; }
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={() => onOpenChange(false)}>{children}</div>;
}
export function DialogContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()} className={`w-full rounded-lg border border-border bg-background p-6 shadow-lg ${className}`} {...props} />;
}
export function DialogHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`flex flex-col space-y-1.5 ${className}`} {...props} />; }
export function DialogTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h2 className={`text-lg font-semibold ${className}`} {...props} />; }
export function DialogFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`flex justify-end gap-2 ${className}`} {...props} />; }
