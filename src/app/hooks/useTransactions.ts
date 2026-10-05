import { useState } from "react";
import type { Transaction, CartItemType } from "../types";
import { generateTransactionId } from "../utils";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const handlePaymentComplete = (
    paymentMethod: string,
    amountPaid: number,
    orderType: "Dine In" | "Takeaway",
    cartItems: CartItemType[],
    total: number
  ) => {
    const transaction: Transaction = {
      id: generateTransactionId(),
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      paymentMethod,
      amountPaid,
      orderType,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, transaction]);
    setCurrentTransaction(transaction);
    setPaymentDialogOpen(false);
    setReceiptDialogOpen(true);
  };

  const handleNewTransaction = () => {
    setReceiptDialogOpen(false);
    setCurrentTransaction(null);
  };

  return {
    transactions,
    setTransactions,
    currentTransaction,
    setCurrentTransaction,
    selectedTransactionId,
    setSelectedTransactionId,
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptDialogOpen,
    setReceiptDialogOpen,
    handlePaymentComplete,
    handleNewTransaction,
  };
};
