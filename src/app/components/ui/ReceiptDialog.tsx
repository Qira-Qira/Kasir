import { Check, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Separator } from "./separator";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ReceiptItem[];
  total: number;
  paymentMethod: string;
  amountPaid: number;
  transactionId: string;
  onNewTransaction: () => void;
}

export function ReceiptDialog({
  open,
  onOpenChange,
  items,
  total,
  paymentMethod,
  amountPaid,
  transactionId,
  onNewTransaction,
}: ReceiptDialogProps) {
  const change = amountPaid - total;
  const date = new Date().toLocaleString('id-ID');
  const paymentMethodLabel = {
    cash: "Tunai",
    card: "Kartu Debit/Kredit",
    ewallet: "Dompet Digital",
  }[paymentMethod] ?? paymentMethod;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            Pembayaran Berhasil
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Transaksi</span>
              <span>{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Metode Pembayaran</span>
              <span>{paymentMethodLabel}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Daftar Produk</p>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.name}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            {paymentMethod === "cash" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>Rp {amountPaid.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span>Rp {change.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Cetak
          </Button>
          <Button className="flex-1" onClick={() => {
            onNewTransaction();
            onOpenChange(false);
          }}>
            Transaksi Baru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
