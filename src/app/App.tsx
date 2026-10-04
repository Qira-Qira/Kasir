import { useState } from "react";
import { Search, ShoppingCart, Clock, Trash2 } from "lucide-react";
import { ProductCard } from "./components/ui/ProductCard";
import { CartItem } from "./components/ui/CartItem";
import { PaymentDialog } from "./components/ui/PaymentDialog";
import { ReceiptDialog } from "./components/ui/ReceiptDialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  amountPaid: number;
  date: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Espresso", price: 15000, category: "Minuman" },
  { id: "2", name: "Cappuccino", price: 25000, category: "Minuman" },
  { id: "3", name: "Latte", price: 28000, category: "Minuman" },
  { id: "4", name: "Americano", price: 20000, category: "Minuman" },
  { id: "5", name: "Croissant", price: 18000, category: "Snack" },
  { id: "6", name: "Chocolate Cake", price: 35000, category: "Snack" },
  { id: "7", name: "Blueberry Muffin", price: 22000, category: "Snack" },
  { id: "8", name: "Green Tea", price: 15000, category: "Minuman" },
  { id: "9", name: "Iced Tea", price: 12000, category: "Minuman" },
  { id: "10", name: "Sandwich", price: 30000, category: "Makanan" },
  { id: "11", name: "Smoothie Bowl", price: 38000, category: "Makanan" },
  { id: "12", name: "Orange Juice", price: 18000, category: "Minuman" },
];

export default function App() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const categories = ["Semua", "Minuman", "Makanan", "Snack"];
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePaymentComplete = (paymentMethod: string, amountPaid: number) => {
    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalAmount,
      paymentMethod,
      amountPaid,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setCurrentTransaction(transaction);
    setReceiptDialogOpen(true);
  };

  const handleNewTransaction = () => {
    clearCart();
    setCurrentTransaction(null);
  };

  return (
    <div className="min-h-screen bg-[#f5efe8] p-4 md:p-6">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden rounded-[30px] border border-[#ead8c1] bg-[#fffaf5] shadow-[0_32px_80px_rgba(74,49,36,0.12)]">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#eedcc7] bg-[#fffaf5] px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8d6d5a]">Cafe & Resto</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#2b1d18]">Moka POS</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#f3e6d9] px-3 py-2 text-sm font-medium text-[#534036]">
                <Clock className="h-4 w-4" />
                {currentTime}
              </div>
            </div>
          </header>

          <div className="flex-1 p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Menu</p>
                <h2 className="mt-1 text-xl font-semibold text-[#2b1d18]">Pilihan Produk</h2>
              </div>

              <div className="rounded-full bg-[#f4e9dd] px-3 py-1.5 text-sm font-medium text-[#5a453c]">
                {filteredProducts.length} item
              </div>
            </div>

            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-11 text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-5 h-auto w-full justify-start rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] p-1.5">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-1 rounded-xl px-3 py-2 text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[calc(100%-200px)]">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAdd={() => addToCart(product)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <aside className="flex w-[390px] flex-col border-l border-[#ead8c1] bg-[#f8f1ea]">
          <div className="border-b border-[#ead8c1] p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1e1ce] text-[#5d4235]">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Pesanan</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#2b1d18]">Saat Ini</h2>
                </div>
              </div>

              {totalItems > 0 && (
                <Badge variant="secondary" className="rounded-full bg-[#7c4a2d] px-2.5 py-1 text-white">
                  {totalItems}
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-5">
            {cart.length === 0 ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8c3a5] bg-[#fffaf5] p-6 text-center text-[#7d685f]">
                <ShoppingCart className="mb-4 h-12 w-12 opacity-50" />
                <p className="text-base font-medium text-[#3d2a22]">Keranjang masih kosong</p>
                <p className="mt-1 text-sm">Pilih menu untuk memulai order</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onIncrease={() => increaseQuantity(item.id)}
                    onDecrease={() => decreaseQuantity(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="space-y-4 border-t border-[#ead8c1] bg-[#f8f1ea] p-6">
            {cart.length > 0 && (
              <Button
                variant="outline"
                className="w-full gap-2 rounded-2xl border-[#e7d4ba] bg-[#fffaf5] text-[#3f2d26]"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4" />
                Kosongkan Keranjang
              </Button>
            )}

            <div className="rounded-[22px] bg-[#fffdf9] p-4 shadow-[0_8px_20px_rgba(88,63,46,0.04)]">
              <div className="flex items-center justify-between text-sm text-[#7d685f]">
                <span>Subtotal</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f0e6db] pt-3 text-base font-semibold text-[#2b1d18]">
                <span>Total</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] shadow-[0_18px_25px_rgba(124,74,45,0.18)] hover:bg-[#6d3f2a]"
              size="lg"
              disabled={cart.length === 0}
              onClick={() => setPaymentDialogOpen(true)}
            >
              Bayar Sekarang
            </Button>
          </div>
        </aside>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        total={totalAmount}
        onComplete={handlePaymentComplete}
      />

      {currentTransaction && (
        <ReceiptDialog
          open={receiptDialogOpen}
          onOpenChange={setReceiptDialogOpen}
          items={currentTransaction.items}
          total={currentTransaction.total}
          paymentMethod={currentTransaction.paymentMethod}
          amountPaid={currentTransaction.amountPaid}
          transactionId={currentTransaction.id}
          onNewTransaction={handleNewTransaction}
        />
      )}
    </div>
  );
}