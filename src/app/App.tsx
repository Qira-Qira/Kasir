import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Cookie,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Moon,
  Trash2,
  TrendingUp,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { ProductCard } from "./components/ui/ProductCard";
import { CartItem } from "./components/ui/CartItem";
import { PaymentDialog } from "./components/ui/PaymentDialog";
import { ReceiptDialog } from "./components/ui/ReceiptDialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";

type Role = "admin" | "investor" | "kasir";
type ViewKey = "Menu" | "Laporan" | "Stok" | "Dashboard" | "Pengaturan";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdBy?: "admin" | "system";
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

interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
}

interface AuthState {
  username: string;
  name: string;
  role: Role;
}

interface UserAccount {
  username: string;
  password: string;
  role: Role;
  name: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Espresso", price: 15000, category: "Minuman", stock: 24, createdBy: "admin" },
  { id: "2", name: "Cappuccino", price: 25000, category: "Minuman", stock: 18, createdBy: "admin" },
  { id: "3", name: "Latte", price: 28000, category: "Minuman", stock: 12, createdBy: "admin" },
  { id: "4", name: "Americano", price: 20000, category: "Minuman", stock: 16, createdBy: "admin" },
  { id: "5", name: "Croissant", price: 18000, category: "Snack", stock: 9, createdBy: "admin" },
  { id: "6", name: "Chocolate Cake", price: 35000, category: "Snack", stock: 7, createdBy: "admin" },
  { id: "7", name: "Blueberry Muffin", price: 22000, category: "Snack", stock: 10, createdBy: "admin" },
  { id: "8", name: "Green Tea", price: 15000, category: "Minuman", stock: 11, createdBy: "admin" },
  { id: "9", name: "Iced Tea", price: 12000, category: "Minuman", stock: 14, createdBy: "admin" },
  { id: "10", name: "Sandwich", price: 30000, category: "Makanan", stock: 8, createdBy: "admin" },
  { id: "11", name: "Smoothie Bowl", price: 38000, category: "Makanan", stock: 6, createdBy: "admin" },
  { id: "12", name: "Orange Juice", price: 18000, category: "Minuman", stock: 13, createdBy: "admin" },
];

const USER_ACCOUNTS: UserAccount[] = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin POS" },
  { username: "investor", password: "investor123", role: "investor", name: "Investor Team" },
  { username: "kasir", password: "kasir123", role: "kasir", name: "Kasir Outlet" },
];

const ROLE_OPTIONS = [
  { role: "admin" as const, label: "Admin", subtitle: "Kelola semua operasional", icon: ShieldCheck },
  { role: "investor" as const, label: "Investor", subtitle: "Pantau performa bisnis", icon: BriefcaseBusiness },
  { role: "kasir" as const, label: "Kasir", subtitle: "Kasir & penjualan harian", icon: Users },
];

const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    navItems: NavItem[];
    accent: string;
    badge: string;
  }
> = {
  admin: {
    label: "Admin",
    navItems: [
      { key: "Menu", label: "Menu", icon: ListOrdered },
      { key: "Stok", label: "Stok", icon: Package },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
      { key: "Pengaturan", label: "Pengaturan", icon: Settings },
    ],
    accent: "bg-[#f4e6d7] text-[#5d4337]",
    badge: "bg-[#7c4a2d] text-white",
  },
  investor: {
    label: "Investor",
    navItems: [
      { key: "Dashboard", label: "Dashboard", icon: TrendingUp },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
    ],
    accent: "bg-[#edf3ef] text-[#2d5b45]",
    badge: "bg-[#2d5b45] text-white",
  },
  kasir: {
    label: "Kasir",
    navItems: [
      { key: "Menu", label: "Menu", icon: ListOrdered },
      { key: "Laporan", label: "Laporan", icon: BarChart3 },
    ],
    accent: "bg-[#fbe7df] text-[#8d4c3d]",
    badge: "bg-[#a95d3a] text-white",
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [systemUsers, setSystemUsers] = useState<UserAccount[]>(USER_ACCOUNTS);
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [activeView, setActiveView] = useState<ViewKey>("Menu");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Minuman", stock: "" });
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "kasir" as Role });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState({ name: "", price: "", category: "Minuman", stock: "" });
  const [editingUserUsername, setEditingUserUsername] = useState<string | null>(null);
  const [userDraft, setUserDraft] = useState({ username: "", password: "", role: "kasir" as Role });
  const [userPage, setUserPage] = useState(1);
  const [restockProductId, setRestockProductId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("10");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState<"all" | "Cash" | "QRIS" | "Debit" | "Transfer">("all");
  const [settingsPage, setSettingsPage] = useState(1);

  const categories = ["Semua", "Minuman", "Makanan", "Snack"] as const;
  const categoryMeta: Record<string, { icon: LucideIcon }> = {
    Semua: { icon: LayoutGrid },
    Minuman: { icon: Coffee },
    Makanan: { icon: UtensilsCrossed },
    Snack: { icon: Cookie },
  };
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const roleConfig = auth ? ROLE_CONFIG[auth.role] : ROLE_CONFIG.admin;
  const visibleNavItems = useMemo(() => roleConfig.navItems, [roleConfig]);

  useEffect(() => {
    const maxProductPages = Math.max(1, Math.ceil(products.length / 5));
    setSettingsPage((page) => Math.min(page, maxProductPages));
  }, [products.length]);

  useEffect(() => {
    const maxUserPages = Math.max(1, Math.ceil(systemUsers.length / 5));
    setUserPage((page) => Math.min(page, maxUserPages));
  }, [systemUsers.length]);

  const recentTransactions = transactions.slice(0, 3);
  const filteredTransactions =
    reportFilter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.paymentMethod === reportFilter);
  const selectedTransaction =
    transactions.find((transaction) => transaction.id === selectedTransactionId) ?? filteredTransactions[0] ?? null;
  const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const averageBasket = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  const accessibleProducts = useMemo(() => {
    if (!auth) return products;

    if (auth.role === "kasir") {
      return products.filter((product) => product.createdBy === "admin" || product.createdBy === undefined);
    }

    return products;
  }, [auth, products]);

  const filteredProducts = accessibleProducts.filter((product) => {
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockProducts = accessibleProducts.filter((product) => product.stock <= 10).slice(0, 3);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item))
    );

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
    const target = cart.find((item) => item.id === id);
    const product = products.find((item) => item.id === id);

    if (!target || !product || product.stock <= 0) return;

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock - 1) } : item))
    );

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: string) => {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: item.stock + 1 } : item))
    );

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cart.find((item) => item.id === id);
    if (!itemToRemove) return;

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: item.stock + itemToRemove.quantity } : item))
    );

    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (cart.length === 0) return;

    setProducts((prev) =>
      prev.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        return cartItem ? { ...product, stock: product.stock + cartItem.quantity } : product;
      })
    );

    setCart([]);
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newProduct.name.trim();
    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);

    if (!name || !Number.isFinite(price) || !Number.isFinite(stock) || price <= 0 || stock < 0) {
      return;
    }

    setProducts((prev) => [
      {
        id: `product-${Date.now()}`,
        name,
        price,
        category: newProduct.category,
        stock,
        createdBy: "admin",
      },
      ...prev,
    ]);

    setNewProduct({ name: "", price: "", category: "Minuman", stock: "" });
    setIsAddMenuOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setProductToDeleteId(null);
  };

  const handleStartEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
    });
  };

  const handleSaveProductEdit = (id: string) => {
    const name = productDraft.name.trim();
    const price = Number(productDraft.price);
    const stock = Number(productDraft.stock);

    if (!name || !Number.isFinite(price) || !Number.isFinite(stock) || price <= 0 || stock < 0) {
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, name, price, category: productDraft.category, stock, createdBy: product.createdBy ?? "admin" }
          : product
      )
    );

    setEditingProductId(null);
    setProductDraft({ name: "", price: "", category: "Minuman", stock: "" });
  };

  const handleRestockProduct = (id: string, amount = 10) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, stock: product.stock + amount } : product
      )
    );
  };

  const handleStartEditUser = (user: UserAccount) => {
    setEditingUserUsername(user.username);
    setUserDraft({
      username: user.username,
      password: user.password,
      role: user.role,
    });
  };

  const handleSaveUserEdit = (currentUsername: string) => {
    const username = userDraft.username.trim();
    const password = userDraft.password.trim();

    if (!username || !password) {
      return;
    }

    setSystemUsers((prev) =>
      prev.map((user) =>
        user.username === currentUsername
          ? { ...user, name: username, username, password, role: userDraft.role }
          : user
      )
    );

    setEditingUserUsername(null);
    setUserDraft({ username: "", password: "", role: "kasir" });
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = newUser.username.trim();
    const password = newUser.password.trim();

    if (!username || !password) {
      return;
    }

    setSystemUsers((prev) => {
      if (prev.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
        return prev;
      }

      return [
        ...prev,
        {
          name: username,
          username,
          password,
          role: newUser.role,
        },
      ];
    });

    setNewUser({ username: "", password: "", role: "kasir" });
  };

  const handleDeleteUser = (username: string) => {
    if (username === "admin") return;
    setSystemUsers((prev) => prev.filter((user) => user.username !== username));
    setEditingUserUsername((prev) => (prev === username ? null : prev));
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

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = loginForm.username.trim().toLowerCase();
    const matchedUser = systemUsers.find(
      (user) => user.username === trimmedUsername && user.password === loginForm.password
    );

    if (!matchedUser) {
      setLoginError("Username atau password tidak valid.");
      return;
    }

    setAuth({
      username: matchedUser.username,
      name: matchedUser.name,
      role: matchedUser.role,
    });

    const firstView = ROLE_CONFIG[matchedUser.role].navItems[0].key;
    setActiveView(firstView);
    setLoginError("");
  };

  const handleLogout = () => {
    setAuth(null);
    setActiveView("Menu");
    setCart([]);
    setCurrentTransaction(null);
    setReceiptDialogOpen(false);
    setPaymentDialogOpen(false);
  };

  const renderDashboardView = () => (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Trend</p>
              <h3 className="mt-1 text-lg font-semibold text-[#2b1d18]">Pertumbuhan Penjualan</h3>
            </div>
            <div className="rounded-full bg-[#edf3ef] p-2 text-[#2d5b45]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4e6d7] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#866c5d]">Hari Ini</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">Rp 1.2Jt</p>
            </div>
            <div className="rounded-2xl bg-[#edf3ef] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#6d8175]">Minggu</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">Rp 3.8Jt</p>
            </div>
            <div className="rounded-2xl bg-[#fbe7df] p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#8f6d61]">Bulan</p>
              <p className="mt-2 text-lg font-semibold text-[#2b1d18]">Rp 15.2Jt</p>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] bg-[#f8f0e7] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Sales velocity</p>
              <p className="text-sm font-semibold text-[#2b1d18]">87%</p>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-[#eee0ce]">
              <span className="block w-[85%] rounded-full bg-[#7c4a2d]" />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-[#7d685f]">
              <span>Target</span>
              <span>Rp 1.8Jt</span>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Investor</p>
          <h3 className="mt-1 text-lg font-semibold text-[#2b1d18]">Status Portofolio</h3>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">ROI</span>
              <span className="font-semibold text-[#2b1d18]">+18.4%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">Margin</span>
              <span className="font-semibold text-[#2b1d18]">34.2%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <span className="text-sm text-[#5f493d]">Kas</span>
              <span className="font-semibold text-[#2b1d18]">Rp 420Jt</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Top Products</p>
            <Badge className="rounded-full bg-[#7c4a2d] text-white">Live</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { name: "Cappuccino", sales: 142, share: "26%" },
              { name: "Sandwich", sales: 98, share: "18%" },
              { name: "Croissant", sales: 85, share: "15%" },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#2b1d18]">{item.name}</span>
                  <span className="text-[#7d685f]">{item.sales} sold</span>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-[#efe0d0]">
                  <span className="block rounded-full bg-[#c98b5b]" style={{ width: item.share }} />
                </div>
                <p className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7d685f]">{item.share}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Operational Health</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Customer satisfaction", value: 96, color: "bg-[#2d5b45]" },
              { label: "Inventory accuracy", value: 91, color: "bg-[#7c4a2d]" },
              { label: "Payment success", value: 99, color: "bg-[#c98b5b]" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[#5f493d]">
                  <span>{item.label}</span>
                  <span className="font-semibold text-[#2b1d18]">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f0e1cf]">
                  <span className={`block h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Inventory Watchlist</p>
          <Badge className="rounded-full bg-[#fbe7df] text-[#8d4c3d]">Low stock</Badge>
        </div>

        <div className="mt-5 space-y-3">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
                <div>
                  <p className="font-medium text-[#2b1d18]">{product.name}</p>
                  <p className="text-xs text-[#7d685f]">{product.category}</p>
                </div>
                <span className="rounded-full bg-[#f8d7d7] px-2.5 py-1 text-xs font-semibold text-[#9b3b34]">
                  {product.stock} left
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#f8f0e7] p-4 text-sm text-[#7d685f]">Semua stok aman.</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMenuView = () => (
    <div className="flex min-h-0 flex-col space-y-5 overflow-hidden">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Menu</p>
          <h2 className="mt-1 text-xl font-semibold text-[#2b1d18]">Pilihan Produk</h2>
        </div>

        <div className="rounded-full bg-[#f4e9dd] px-3 py-1.5 text-sm font-medium text-[#5a453c] shadow-sm">
          {filteredProducts.length} item
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
        <Input
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-12 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-11 text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-5 h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] p-1.5">
          {categories.map((category) => {
            const Icon = categoryMeta[category]?.icon ?? LayoutGrid;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="min-w-[90px] flex-1 rounded-xl px-2 py-2 text-[11px] sm:min-w-[100px] sm:px-3 sm:text-sm"
              >
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{category}</span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <ScrollArea className="min-h-0 min-w-0 flex-1 h-[260px] sm:h-[320px] xl:h-[calc(100vh-330px)] overflow-y-auto">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              stock={product.stock}
              disabled={auth?.role === "investor" || product.stock <= 0}
              isAdmin={auth?.role === "admin"}
              onAdd={() => addToCart(product)}
              onEdit={() => handleStartEditProduct(product)}
              onDelete={() => setProductToDeleteId(product.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderReportView = () => (
    <div className="flex min-h-0 flex-col space-y-5 overflow-y-auto">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Pendapatan</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{formatCurrency(totalRevenue || 0)}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Transaksi</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{transactions.length}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Rata-rata</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{formatCurrency(averageBasket || 0)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
                <ChartNoAxesCombined className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-[#2b1d18]">Revenue Trend</h3>
            </div>
            <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">+12.4%</span>
          </div>

          <div className="mt-6 flex h-44 items-end gap-3">
            {[55, 68, 72, 63, 78, 90, 84].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center rounded-t-[16px] bg-[linear-gradient(180deg,#d69e7a_0%,#7c4a2d_100%)]" style={{ height: `${height}%` }} />
                <span className="text-[10px] font-medium text-[#7d685f]">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Investor Snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-[#f8f0e7] p-3">
              <div className="flex items-center justify-between text-sm text-[#5f493d]">
                <span>Net profit</span>
                <span className="font-semibold text-[#2b1d18]">{formatCurrency((totalRevenue || 0) * 0.28)}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f8f0e7] p-3">
              <div className="flex items-center justify-between text-sm text-[#5f493d]">
                <span>Cash flow</span>
                <span className="font-semibold text-[#2b1d18]">{formatCurrency((totalRevenue || 0) * 0.14)}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f8f0e7] p-3">
              <div className="flex items-center justify-between text-sm text-[#5f493d]">
                <span>Retention</span>
                <span className="font-semibold text-[#2b1d18]">89%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ChartNoAxesCombined className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Riwayat Transaksi</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "Cash", "QRIS", "Debit", "Transfer"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setReportFilter(method)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${reportFilter === method ? "bg-[#7c4a2d] text-white" : "bg-[#f3e7d9] text-[#5d4235]"}`}
              >
                {method === "all" ? "Semua" : method}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid min-h-0 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <ScrollArea className="h-[300px] min-h-0 w-full overflow-y-auto">
            <div className="space-y-3 pr-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <button
                    key={transaction.id}
                    type="button"
                    onClick={() => setSelectedTransactionId(transaction.id)}
                    className={`flex w-full flex-col gap-2 rounded-2xl bg-[#f8f0e7] p-3 text-left sm:flex-row sm:items-center sm:justify-between ${selectedTransaction?.id === transaction.id ? "ring-2 ring-[#7c4a2d]" : ""}`}
                  >
                    <div>
                      <p className="font-medium text-[#2b1d18]">{transaction.id}</p>
                      <p className="text-xs text-[#7d685f]">{transaction.paymentMethod}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-[#2b1d18]">{formatCurrency(transaction.total)}</p>
                      <p className="text-xs text-[#7d685f]">{new Date(transaction.date).toLocaleDateString("id-ID")}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl bg-[#f8f0e7] p-4 text-sm text-[#7d685f]">Belum ada transaksi dengan filter ini.</div>
              )}
            </div>
          </ScrollArea>

          {selectedTransaction && (
            <div className="rounded-[22px] bg-[#f8f0e7] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Detail</p>
              <h4 className="mt-2 text-lg font-semibold text-[#2b1d18]">{selectedTransaction.id}</h4>

              <div className="mt-4 space-y-2 text-sm text-[#5f493d]">
                <div className="flex items-center justify-between">
                  <span>Metode</span>
                  <span className="font-semibold text-[#2b1d18]">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bayar</span>
                  <span className="font-semibold text-[#2b1d18]">{formatCurrency(selectedTransaction.amountPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-[#2b1d18]">{formatCurrency(selectedTransaction.total)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#ead8c1] pt-3">
                {selectedTransaction.items.map((item) => (
                  <div key={`${selectedTransaction.id}-${item.name}`} className="flex items-center justify-between text-sm text-[#5f493d]">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettingsView = () => {
    const totalPages = Math.max(1, Math.ceil(products.length / 5));
    const paginatedProducts = products.slice((settingsPage - 1) * 5, settingsPage * 5);
    const userTotalPages = Math.max(1, Math.ceil(systemUsers.length / 5));
    const paginatedUsers = systemUsers.slice((userPage - 1) * 5, userPage * 5);

    return (
      <ScrollArea className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-0 flex-col space-y-5 pb-2">
          <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
                <Settings className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-[#2b1d18]">Kelola Menu</h3>
            </div>
            <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
              {products.length} item
            </span>
          </div>

          <form onSubmit={handleAddProduct} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Input
              value={newProduct.name}
              onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nama produk"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
            <Input
              type="number"
              value={newProduct.price}
              onChange={(event) => setNewProduct((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Harga"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
            <select
              value={newProduct.category}
              onChange={(event) => setNewProduct((prev) => ({ ...prev, category: event.target.value }))}
              className="h-11 rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
            >
              {categories.filter((item) => item !== "Semua").map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Input
              type="number"
              value={newProduct.stock}
              onChange={(event) => setNewProduct((prev) => ({ ...prev, stock: event.target.value }))}
              placeholder="Stok"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
            <Button type="submit" className="h-11 rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]">
              Tambah
            </Button>
          </form>

          <div className="mt-5 space-y-3">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="rounded-2xl bg-[#f8f0e7] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[#2b1d18]">{product.name}</p>
                    <p className="text-xs text-[#7d685f]">{product.category} • {product.stock} pcs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#2b1d18]">{formatCurrency(product.price)}</span>
                    <button
                      type="button"
                      onClick={() => handleStartEditProduct(product)}
                      className="rounded-full bg-[#edf3ef] px-2 py-1 text-xs font-semibold text-[#2d5b45]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDeleteId(product.id)}
                      className="rounded-full bg-[#f8d7d7] px-2 py-1 text-xs font-semibold text-[#9b3b34]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 5 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8f0e7] p-3">
              <button
                type="button"
                onClick={() => setSettingsPage((page) => Math.max(1, page - 1))}
                disabled={settingsPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e7d9] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-[#4d382f]">Halaman {settingsPage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setSettingsPage((page) => Math.min(totalPages, page + 1))}
                disabled={settingsPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c4a2d] text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Buat Akun</h3>
          </div>

          <form onSubmit={handleAddUser} className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
            <Input
              value={newUser.username}
              onChange={(event) => setNewUser((prev) => ({ ...prev, username: event.target.value }))}
              placeholder="Username"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
            <Input
              type="password"
              value={newUser.password}
              onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Password"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
            <select
              value={newUser.role}
              onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as Role }))}
              className="h-11 rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
            >
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
              <option value="investor">Investor</option>
            </select>
            <Button type="submit" className="h-11 rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]">
              Tambah Akun
            </Button>
          </form>

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#f8f0e7]">
            <ScrollArea className="max-h-[320px] min-h-0 w-full overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-[#2b1d18]">
                  <thead className="bg-[#f1e4d6] text-[#5d4235]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Username</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => {
                      const isEditing = editingUserUsername === user.username;

                      return (
                        <tr key={`${user.role}-${user.username}`} className="border-t border-[#ebdcc7]">
                          <td className="px-4 py-3 font-medium">{user.username}</td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <select
                                value={userDraft.role}
                                onChange={(event) => setUserDraft((prev) => ({ ...prev, role: event.target.value as Role }))}
                                className="h-10 rounded-xl border border-[#ebdcc7] bg-[#fffaf5] px-2 text-[#2b1d18] outline-none"
                              >
                                <option value="admin">Admin</option>
                                <option value="kasir">Kasir</option>
                                <option value="investor">Investor</option>
                              </select>
                            ) : (
                              <span className="rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
                                {user.role}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveUserEdit(user.username)}
                                  className="rounded-full bg-[#7c4a2d] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingUserUsername(null)}
                                  className="rounded-full bg-[#f3e7d9] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditUser(user)}
                                  className="rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold text-[#2d5b45]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user.username)}
                                  disabled={user.username === "admin"}
                                  className="rounded-full bg-[#f8d7d7] px-2 py-1 text-[10px] font-semibold text-[#9b3b34] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ScrollArea>

            {systemUsers.length > 5 && (
              <div className="flex items-center justify-between border-t border-[#ebdcc7] bg-[#f7efe8] p-3">
                <button
                  type="button"
                  onClick={() => setUserPage((page) => Math.max(1, page - 1))}
                  disabled={userPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e7d9] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Halaman pengguna sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#4d382f]">Halaman {userPage} / {userTotalPages}</span>
                <button
                  type="button"
                  onClick={() => setUserPage((page) => Math.min(userTotalPages, page + 1))}
                  disabled={userPage === userTotalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c4a2d] text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Halaman pengguna berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </ScrollArea>
    );
  };

  const renderStockView = () => (
    <div className="flex min-h-0 flex-col space-y-5 overflow-hidden">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Total Item</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.length}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Low Stock</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.filter((product) => product.stock <= 10).length}</p>
        </div>
        <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Status</p>
          <p className="mt-2 text-2xl font-semibold text-[#2b1d18]">{products.filter((product) => product.stock <= 10).length === 0 ? "Aman" : "Perlu Tindak"}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_12px_24px_rgba(88,63,46,0.04)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              <ListOrdered className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#2b1d18]">Stok Menu</h3>
          </div>
          <Badge className="rounded-full bg-[#edf3ef] text-[#2d5b45]">{products.filter((product) => product.stock <= 10).length} needs attention</Badge>
        </div>

        <ScrollArea className="mt-5 h-[340px] w-full min-w-0 overflow-hidden">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl bg-[#f8f0e7] p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2b1d18]">{product.name}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${product.stock <= 10 ? "bg-[#f8d7d7] text-[#9b3b34]" : "bg-[#edf3ef] text-[#2d5b45]"}`}>
                  {product.stock <= 10 ? "Low" : "Good"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#7d685f]">{product.category}</p>
              <p className="mt-1 text-lg font-semibold text-[#2b1d18]">{product.stock} pcs</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRestockProduct(product.id, 10)}
                  className="rounded-full bg-[#7c4a2d] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                >
                  Restock +10
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestockProductId(product.id);
                    setRestockQty("10");
                  }}
                  className="rounded-full bg-[#f3e7d9] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d4235]"
                >
                  Order
                </button>
              </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {productToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2b1d18]">Hapus Menu</h3>
              <button
                type="button"
                onClick={() => setProductToDeleteId(null)}
                className="rounded-full bg-[#f3e7d9] px-2.5 py-1 text-xs font-semibold text-[#5d4235]"
              >
                Tutup
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#f8f0e7] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Menu yang akan dihapus</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">
                  {products.find((product) => product.id === productToDeleteId)?.name || "Produk"}
                </p>
                <p className="mt-1 text-sm text-[#7d685f]">
                  {products.find((product) => product.id === productToDeleteId)?.category || "Kategori"} • {products.find((product) => product.id === productToDeleteId)?.stock || 0} pcs
                </p>
              </div>

              <p className="text-sm text-[#5d4235]">
                Tindakan ini akan menghapus menu dari katalog dan tidak dapat dipilih saat transaksi berikutnya.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDeleteId(null)}
                  className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(productToDeleteId!)}
                  className="rounded-2xl bg-[#9b3b34] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#842f2a]"
                >
                  Hapus Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {restockProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2b1d18]">Restock Supplier</h3>
              <button
                type="button"
                onClick={() => setRestockProductId(null)}
                className="rounded-full bg-[#f3e7d9] px-2.5 py-1 text-xs font-semibold text-[#5d4235]"
              >
                Tutup
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d6d5a]">Menu</label>
                <p className="mt-2 text-base font-semibold text-[#2b1d18]">
                  {products.find((product) => product.id === restockProductId)?.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#4d382f]">Jumlah restock</label>
                <Input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(event) => setRestockQty(event.target.value)}
                  className="mt-2 h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <Button
                type="button"
                onClick={() => {
                  const qty = Number(restockQty);
                  if (Number.isFinite(qty) && qty > 0) {
                    handleRestockProduct(restockProductId, qty);
                    setRestockProductId(null);
                    setRestockQty("10");
                  }
                }}
                className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]"
              >
                Konfirmasi Restock
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  const renderContent = () => {
    if (!auth) return null;

    switch (activeView) {
      case "Dashboard":
        return renderDashboardView();
      case "Menu":
        return renderMenuView();
      case "Laporan":
        return renderReportView();
      case "Stok":
        return renderStockView();
      case "Pengaturan":
        return renderSettingsView();
      default:
        return renderMenuView();
    }
  };

  if (!auth) {
    const shellClass = isDarkMode
      ? "bg-[#111827] text-[#f3f4f6]"
      : "bg-[radial-gradient(circle_at_top,_#f7efe7,_#f0e2d3_38%,_#e8d4b5_100%)] text-[#1f2937]";

    return (
      <div className={`flex min-h-screen items-center justify-center p-4 sm:p-6 ${shellClass}`}>
        <div className={`w-full max-w-md rounded-[28px] border p-6 shadow-[0_40px_90px_rgba(70,42,28,0.16)] backdrop-blur-sm ${isDarkMode ? "border-[#2f3747] bg-[#1f2937]/95" : "border-[#ebdcc7] bg-[#fffaf5]/95"}`}>
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c4a2d] text-lg font-bold text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)]">
              P
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isDarkMode ? "text-[#d9cab6]" : "text-[#8d6d5a]"}`}>System</p>
              <h1 className={`mt-1 text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>POSLite</h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>Login</h2>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? "text-[#e5e7eb]" : "text-[#4d382f]"}`}>Username</label>
              <Input
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="Masukkan username"
                className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? "text-[#e5e7eb]" : "text-[#4d382f]"}`}>Password</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Masukkan password"
                className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
              />
            </div>

            {loginError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <Button type="submit" className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] shadow-[0_18px_25px_rgba(124,74,45,0.18)] hover:bg-[#6d3f2a]">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const currentRoleLabel = auth ? ROLE_CONFIG[auth.role].label : "Admin";
  const appShellClass = isDarkMode ? "bg-[#0f172a] text-[#f8fafc]" : "bg-[radial-gradient(circle_at_top,_#f7efe7,_#f0e2d3_38%,_#e8d4b5_100%)] text-[#1f2937]";
  const appPanelClass = isDarkMode ? "border-[#2f3747] bg-[#111827]/95" : "border-[#e9d8c2] bg-[#fffaf5]/95";
  const appSidebarClass = isDarkMode ? "border-[#2f3747] bg-[#111827]" : "border-[#ead8c1] bg-[#f7efe6]";
  const appHeaderClass = isDarkMode ? "border-[#2f3747] bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)]" : "border-[#eedcc7] bg-[linear-gradient(135deg,#fffaf5_0%,#f8eee4_100%)]";
  const isCatalogView = activeView === "Menu";

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${appShellClass}`}>
      <div className={`mx-auto flex h-auto w-full max-w-[1600px] min-w-0 flex-col overflow-hidden rounded-[28px] border shadow-[0_40px_90px_rgba(70,42,28,0.16)] backdrop-blur-sm xl:h-[calc(100vh-2rem)] xl:flex-row ${appPanelClass}`}>
        <aside className={`hidden w-[220px] flex-col justify-between border-r p-3 xl:flex ${appSidebarClass}`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf5] px-3 py-3 shadow-[0_10px_20px_rgba(74,49,36,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c4a2d] text-lg font-bold text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)]">
                {auth?.role === "admin" ? "A" : auth?.role === "investor" ? "I" : "K"}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Role</p>
                <p className="text-base font-semibold text-[#2b1d18]">{currentRoleLabel}</p>
              </div>
            </div>

            <nav className="mt-2 flex w-full flex-col gap-2">
              {visibleNavItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveView(key)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${activeView === key ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_10px_18px_rgba(124,74,45,0.18)]" : "bg-[#f3e7d9] text-[#5c463b] hover:bg-[#e9d7c2]"}`}
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ead8c1] bg-[#fffaf5] px-3 py-3 text-sm font-medium text-[#4d382f] transition hover:bg-[#f5ebdf]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className={`relative overflow-hidden border-b px-4 py-4 sm:px-6 sm:py-5 ${appHeaderClass}`}>
            <div className="absolute inset-y-0 right-0 w-56 bg-[radial-gradient(circle,_rgba(124,74,45,0.10),_transparent_65%)]" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isDarkMode ? "text-[#d9cab6]" : "text-[#8d6d5a]"}`}>Cafe & Resto</p>
                <h1 className={`mt-1 text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>POSLite ESB</h1>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-inner ${isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[#0b1220]" : "bg-[#f3e6d9] text-[#534036] shadow-[#f0e2d6]"}`}>
                  <Clock className="h-4 w-4" />
                  {currentTime}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#ead8c1] bg-[#fffaf5]/80 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(false)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${!isDarkMode ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_8px_18px_rgba(124,74,45,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"}`}
                    aria-label="Light mode"
                    title="Light mode"
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(true)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[0_8px_18px_rgba(17,24,39,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"}`}
                    aria-label="Dark mode"
                    title="Dark mode"
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
            {isCatalogView ? (
              <>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                    <Input
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-12 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-11 text-[#2b1d18] placeholder:text-[#9a8479] focus:ring-[#c98b5b]"
                    />
                  </div>
                </div>

                {auth?.role === "admin" && isAddMenuOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
                    <div className="w-full max-w-2xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
                          <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">Tambah Menu Baru</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddMenuOpen(false)}
                          className="rounded-full bg-[#f3e7d9] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5d4235]"
                        >
                          Tutup
                        </button>
                      </div>

                      <form onSubmit={handleAddProduct} className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-[#4d382f]">Nama produk</label>
                          <Input
                            value={newProduct.name}
                            onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
                            placeholder="Contoh: Pisang Nugget"
                            className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#4d382f]">Harga</label>
                          <Input
                            type="number"
                            value={newProduct.price}
                            onChange={(event) => setNewProduct((prev) => ({ ...prev, price: event.target.value }))}
                            placeholder="15000"
                            className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#4d382f]">Stok awal</label>
                          <Input
                            type="number"
                            value={newProduct.stock}
                            onChange={(event) => setNewProduct((prev) => ({ ...prev, stock: event.target.value }))}
                            placeholder="20"
                            className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-[#4d382f]">Kategori</label>
                          <select
                            value={newProduct.category}
                            onChange={(event) => setNewProduct((prev) => ({ ...prev, category: event.target.value }))}
                            className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
                          >
                            {categories.filter((item) => item !== "Semua").map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2 mt-2 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setIsAddMenuOpen(false)}
                            className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                          >
                            Batal
                          </button>
                          <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
                            Simpan Menu
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="mb-5 h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-[#ebdcc7] bg-[#f8f0e9] p-1.5">
                    {categories.map((category) => {
                      const Icon = categoryMeta[category]?.icon ?? LayoutGrid;
                      return (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="min-w-[90px] flex-1 rounded-xl px-2 py-2 text-[11px] sm:min-w-[100px] sm:px-3 sm:text-sm"
                        >
                          <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>{category}</span>
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>

                <ScrollArea className="min-h-0 min-w-0 flex-1 h-[260px] sm:h-[320px] xl:h-[calc(100%-240px)]">
                  <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        category={product.category}
                        stock={product.stock}
                        disabled={auth?.role === "investor" || product.stock <= 0}
                        onAdd={() => addToCart(product)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              renderContent()
            )}
          </div>
        </div>

        {isCatalogView && (
          <aside className="flex w-full flex-col border-t border-[#ead8c1] bg-[#f8f1ea] xl:w-[390px] xl:border-l xl:border-t-0">
            <div className="border-b border-[#ead8c1] bg-[linear-gradient(180deg,#f9f3ee_0%,#f4e9df_100%)] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1e1ce] text-[#5d4235] shadow-[0_8px_18px_rgba(124,74,45,0.14)]">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Pesanan</p>
                    <h2 className="mt-1 text-lg font-semibold text-[#2b1d18]">Saat Ini</h2>
                  </div>
                </div>

                {totalItems > 0 && (
                  <Badge variant="secondary" className="rounded-full bg-[#7c4a2d] px-2.5 py-1 text-white shadow-[0_10px_18px_rgba(124,74,45,0.18)]">
                    {totalItems}
                  </Badge>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto p-4 sm:p-5">
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

            <div className="space-y-4 border-t border-[#ead8c1] bg-[#f8f1ea] p-4 sm:p-6">
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

              <div className="rounded-[22px] bg-[#fffdf9] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.05)]">
                <div className="flex items-center justify-between text-sm text-[#7d685f]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#f0e6db] pt-3 text-base font-semibold text-[#2b1d18]">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
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
        )}
      </div>

      {isCatalogView && (
        <>
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
        </>
      )}
    </div>
  );
}