import { useState } from "react";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onComplete: (paymentMethod: string, amountPaid: number) => void;
}

export function PaymentDialog({ open, onOpenChange, total, onComplete }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");

  const handleComplete = () => {
    const paid = parseFloat(amountPaid) || total;
    onComplete(paymentMethod, paid);
    setAmountPaid("");
    onOpenChange(false);
  };

  const change = (parseFloat(amountPaid) || 0) - total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <Label>Metode Pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3 space-y-3">
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Banknote className="h-5 w-5" />
                  Tunai
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5" />
                  Kartu Debit/Kredit
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="ewallet" id="ewallet" />
                <Label htmlFor="ewallet" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5" />
                  Dompet Digital
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            {paymentMethod === "cash" && (
              <>
                <div>
                  <Label htmlFor="amount">Jumlah Dibayar</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="mt-2"
                  />
                </div>
                {change >= 0 && amountPaid && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kembalian</span>
                    <span className={change === 0 ? "text-muted-foreground" : ""}>
                      Rp {change.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={paymentMethod === "cash" && (change < 0 || !amountPaid)}
          >
            Selesaikan Pembayaran
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
