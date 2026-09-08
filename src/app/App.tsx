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
  image: string;
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
  { id: "1", name: "Espresso", price: 15000, category: "Coffee", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400" },
  { id: "2", name: "Cappuccino", price: 25000, category: "Coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
  { id: "3", name: "Latte", price: 28000, category: "Coffee", image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400" },
  { id: "4", name: "Americano", price: 20000, category: "Coffee", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" },
  { id: "5", name: "Croissant", price: 18000, category: "Food", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
  { id: "6", name: "Chocolate Cake", price: 35000, category: "Food", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
  { id: "7", name: "Blueberry Muffin", price: 22000, category: "Food", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400" },
  { id: "8", name: "Green Tea", price: 15000, category: "Tea", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?w=400" },
  { id: "9", name: "Iced Tea", price: 12000, category: "Tea", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400" },
  { id: "10", name: "Sandwich", price: 30000, category: "Food", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400" },
  { id: "11", name: "Smoothie Bowl", price: 38000, category: "Food", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400" },
  { id: "12", name: "Orange Juice", price: 18000, category: "Drinks", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400" },
];

export default function App() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const categories = ["All", "Coffee", "Food", "Tea", "Drinks"];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
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
    <div className="h-screen flex bg-background">
      {/* Products Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border">
          <h1 className="mb-4">POS Cashier</h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {/* Cart Section */}
      <div className="w-96 border-l border-border flex flex-col bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5" />
            <h2>Current Order</h2>
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems}</Badge>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div>
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

        <div className="p-6 border-t border-border space-y-4">
          {cart.length > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </Button>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span>Total</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={cart.length === 0}
            onClick={() => setPaymentDialogOpen(true)}
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        total={totalAmount}
        onComplete={handlePaymentComplete}
      />

      {/* Receipt Dialog */}
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