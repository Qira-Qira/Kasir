import { useEffect, useMemo, useState } from "react";
import { Clock, LogOut, Moon, ShoppingCart, Sun, Trash2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { CartItem } from "./components/ui/CartItem";
import { Input } from "./components/ui/input";
import { PaymentDialog } from "./components/ui/PaymentDialog";
import { ReceiptDialog } from "./components/ui/ReceiptDialog";
import { ScrollArea } from "./components/ui/scroll-area";
import { ROLE_CONFIG, MOCK_PRODUCTS, USER_ACCOUNTS, CATEGORIES } from "./constants";
import type {
  AuthState,
  CartItemType,
  Product,
  Role,
  Transaction,
  UserAccount,
  ViewKey,
} from "./types";
import { formatCurrency, getCurrentTime } from "./utils";
import { DashboardView } from "./views/DashboardView";
import { MenuView } from "./views/MenuView";
import { ReportView } from "./views/ReportView";
import { SettingsView } from "./views/SettingsView";
import { StockView } from "./views/StockView";

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
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Minuman", stock: "" });
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "kasir" as Role });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [userDeleteUsername, setUserDeleteUsername] = useState<string | null>(null);
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
  const [reportRange, setReportRange] = useState<"Hari Ini" | "7 Hari Terakhir" | "Bulanan" | "Custom Date">("7 Hari Terakhir");
  const [reportShift, setReportShift] = useState<"Semua Shift" | "Shift 1" | "Shift 2">("Semua Shift");
  const [reportBranch, setReportBranch] = useState<"Semua Cabang" | "Cabang Utama" | "Cabang 2">("Semua Cabang");
  const [stockSearch, setStockSearch] = useState("");
  const [stockCategory, setStockCategory] = useState("Semua");
  const [stockPage, setStockPage] = useState(1);
  const [settingsPage, setSettingsPage] = useState(1);

  const categories = CATEGORIES;
  const currentTime = getCurrentTime();

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
    setEditingProductId((prev) => (prev === id ? null : prev));
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

  const handleCloseEditProduct = () => {
    setEditingProductId(null);
    setProductDraft({ name: "", price: "", category: "Minuman", stock: "" });
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

    handleCloseEditProduct();
  };

  const handleRestockProduct = (id: string, amount = 10) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, stock: product.stock + amount } : product))
    );
  };

  const handleStartEditUser = (user: UserAccount) => {
    setEditingUserUsername(user.username);
    setUserDraft({ username: user.username, password: user.password, role: user.role });
  };

  const handleCloseEditUser = () => {
    setEditingUserUsername(null);
    setUserDraft({ username: "", password: "", role: "kasir" });
  };

  const handleSaveUserEdit = (currentUsername: string) => {
    const username = userDraft.username.trim();
    const password = userDraft.password.trim();

    if (!username || !password) return;

    setSystemUsers((prev) =>
      prev.map((user) =>
        user.username === currentUsername
          ? { ...user, name: username, username, password, role: userDraft.role }
          : user
      )
    );

    handleCloseEditUser();
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = newUser.username.trim();
    const password = newUser.password.trim();

    if (!username || !password) return;

    setSystemUsers((prev) => {
      if (prev.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
        return prev;
      }

      return [...prev, { name: username, username, password, role: newUser.role }];
    });

    setNewUser({ username: "", password: "", role: "kasir" });
    setIsAddUserModalOpen(false);
    setUserPage(1);
  };

  const handleDeleteUser = (username: string) => {
    if (username === "admin") return;
    setSystemUsers((prev) => prev.filter((user) => user.username !== username));
    setEditingUserUsername((prev) => (prev === username ? null : prev));
    setUserDeleteUsername(null);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePaymentComplete = (
    paymentMethod: string,
    amountPaid: number,
    orderType: "Dine In" | "Takeaway"
  ) => {
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
      orderType,
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

  const renderContent = () => {
    if (!auth) return null;

    switch (activeView) {
      case "Dashboard":
        return <DashboardView lowStockProducts={lowStockProducts} />;
      case "Menu":
        return (
          <MenuView
            products={products}
            auth={auth}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            filteredProducts={filteredProducts}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onAddToCart={addToCart}
            onStartEditProduct={handleStartEditProduct}
            onDeleteProduct={setProductToDeleteId}
          />
        );
      case "Laporan":
        return <ReportView />;
      case "Stok":
        return (
          <StockView
            products={products}
            stockSearch={stockSearch}
            setStockSearch={setStockSearch}
            stockCategory={stockCategory}
            setStockCategory={setStockCategory}
            stockPage={stockPage}
            setStockPage={setStockPage}
            formatCurrency={formatCurrency}
            handleStartEditProduct={handleStartEditProduct}
            setProductToDeleteId={setProductToDeleteId}
            setRestockProductId={setRestockProductId}
            setRestockQty={setRestockQty}
          />
        );
      case "Pengaturan":
        return (
          <SettingsView
            products={products}
            systemUsers={systemUsers}
            menuSearch={menuSearch}
            setMenuSearch={setMenuSearch}
            settingsPage={settingsPage}
            setSettingsPage={setSettingsPage}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userPage={userPage}
            setUserPage={setUserPage}
            handleStartEditProduct={handleStartEditProduct}
            setProductToDeleteId={setProductToDeleteId}
            handleStartEditUser={handleStartEditUser}
            setUserDeleteUsername={setUserDeleteUsername}
            setIsAddMenuOpen={setIsAddMenuOpen}
            setIsAddUserModalOpen={setIsAddUserModalOpen}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return <DashboardView lowStockProducts={lowStockProducts} />;
    }
  };

  if (!auth) {
    const shellClass = isDarkMode
      ? "bg-[#111827] text-[#f3f4f6]"
      : "bg-[radial-gradient(circle_at_top,_#f7efe7,_#f0e2d3_38%,_#e8d4b5_100%)] text-[#1f2937]";

    return (
      <div className={`flex min-h-screen items-center justify-center p-4 sm:p-6 ${shellClass}`}>
        <div
          className={`w-full max-w-md rounded-[28px] border p-6 shadow-[0_40px_90px_rgba(70,42,28,0.16)] backdrop-blur-sm ${
            isDarkMode ? "border-[#2f3747] bg-[#1f2937]/95" : "border-[#ebdcc7] bg-[#fffaf5]/95"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c4a2d] text-lg font-bold text-[#fffaf5] shadow-[0_12px_20px_rgba(124,74,45,0.18)]">
              P
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isDarkMode ? "text-[#d9cab6]" : "text-[#8d6d5a]"}`}>
                System
              </p>
              <h1 className={`mt-1 text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>
                POSLite
              </h1>
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
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                    activeView === key
                      ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_10px_18px_rgba(124,74,45,0.18)]"
                      : "bg-[#f3e7d9] text-[#5c463b] hover:bg-[#e9d7c2]"
                  }`}
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
                <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isDarkMode ? "text-[#d9cab6]" : "text-[#8d6d5a]"}`}>
                  Cafe & Resto
                </p>
                <h1 className={`mt-1 text-2xl font-semibold ${isDarkMode ? "text-[#f3f4f6]" : "text-[#2b1d18]"}`}>
                  POSLite ESB
                </h1>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-inner ${
                    isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[#0b1220]" : "bg-[#f3e6d9] text-[#534036] shadow-[#f0e2d6]"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {currentTime}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#ead8c1] bg-[#fffaf5]/80 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(false)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      !isDarkMode ? "bg-[#7c4a2d] text-[#fffaf5] shadow-[0_8px_18px_rgba(124,74,45,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"
                    }`}
                    aria-label="Light mode"
                    title="Light mode"
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(true)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      isDarkMode ? "bg-[#1f2937] text-[#f3f4f6] shadow-[0_8px_18px_rgba(17,24,39,0.20)]" : "text-[#5d4337] hover:bg-[#f3e7d9]"
                    }`}
                    aria-label="Dark mode"
                    title="Dark mode"
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">{renderContent()}</div>
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

      {productToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2b1d18]">Hapus Menu</h3>
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
                  onClick={() => handleDeleteProduct(productToDeleteId)}
                  className="rounded-2xl bg-[#9b3b34] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#842f2a]"
                >
                  Hapus Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {auth?.role === "admin" && isAddMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-2xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
                <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">Tambah Menu Baru</h3>
              </div>
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

      {editingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-2xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
                <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">Edit Menu</h3>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveProductEdit(editingProductId);
              }}
              className="mt-5 grid gap-3 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Nama produk</label>
                <Input
                  value={productDraft.name}
                  onChange={(event) => setProductDraft((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Contoh: Pisang Nugget"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Harga</label>
                <Input
                  type="number"
                  value={productDraft.price}
                  onChange={(event) => setProductDraft((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="15000"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Stok</label>
                <Input
                  type="number"
                  value={productDraft.stock}
                  onChange={(event) => setProductDraft((prev) => ({ ...prev, stock: event.target.value }))}
                  placeholder="20"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Kategori</label>
                <select
                  value={productDraft.category}
                  onChange={(event) => setProductDraft((prev) => ({ ...prev, category: event.target.value }))}
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
                  onClick={handleCloseEditProduct}
                  className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  Batal
                </button>
                <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
                <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">Tambah Akun Baru</h3>
              </div>
            </div>

            <form onSubmit={handleAddUser} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Username</label>
                <Input
                  value={newUser.username}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, username: event.target.value }))}
                  placeholder="Masukkan username"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Password</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Masukkan password"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Role</label>
                <select
                  value={newUser.role}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as Role }))}
                  className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  <option value="investor">Investor</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  Batal
                </button>
                <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
                  Simpan Akun
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUserUsername && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
                <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">Edit Akun</h3>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveUserEdit(editingUserUsername);
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Username</label>
                <Input
                  value={userDraft.username}
                  onChange={(event) => setUserDraft((prev) => ({ ...prev, username: event.target.value }))}
                  placeholder="Masukkan username"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Password</label>
                <Input
                  type="password"
                  value={userDraft.password}
                  onChange={(event) => setUserDraft((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Masukkan password"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Role</label>
                <select
                  value={userDraft.role}
                  onChange={(event) => setUserDraft((prev) => ({ ...prev, role: event.target.value as Role }))}
                  className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  <option value="investor">Investor</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditUser}
                  className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  Batal
                </button>
                <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userDeleteUsername && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2b1d18]">Hapus Akun</h3>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#f8f0e7] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d6d5a]">Akun yang akan dihapus</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{userDeleteUsername}</p>
                <p className="mt-1 text-sm text-[#7d685f]">
                  {systemUsers.find((user) => user.username === userDeleteUsername)?.role || "Role"}
                </p>
              </div>

              <p className="text-sm text-[#5d4235]">
                Tindakan ini akan menghapus akun dari sistem dan semua akses login terkait akan hilang.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUserDeleteUsername(null)}
                  className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (userDeleteUsername) handleDeleteUser(userDeleteUsername);
                  }}
                  className="rounded-2xl bg-[#9b3b34] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#842f2a]"
                >
                  Hapus Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {restockProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
            <h3 className="text-lg font-semibold text-[#2b1d18]">Restock Supplier</h3>

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
              orderType={currentTransaction.orderType}
              transactionId={currentTransaction.id}
              onNewTransaction={handleNewTransaction}
            />
          )}
        </>
      )}
    </div>
  );
}
