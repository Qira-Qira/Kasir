import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, MOCK_PRODUCTS, ROLE_CONFIG, USER_ACCOUNTS } from "../constants";
import type {
  AuthState,
  CartItemType,
  Product,
  Role,
  Transaction,
  UserAccount,
  ViewKey,
} from "../types";
import { getCurrentTime } from "../utils";

export const usePosApp = () => {
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

  const filteredProducts = useMemo(() => {
    return accessibleProducts.filter((product) => {
      const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [accessibleProducts, searchQuery, selectedCategory]);

  const lowStockProducts = useMemo(
    () => accessibleProducts.filter((product) => product.stock <= 10).slice(0, 3),
    [accessibleProducts]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

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
      prev.map((productItem) => {
        const cartItem = cart.find((item) => item.id === productItem.id);
        return cartItem ? { ...productItem, stock: productItem.stock + cartItem.quantity } : productItem;
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
    setReceiptDialogOpen(false);
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

  return {
    auth,
    setAuth,
    systemUsers,
    setSystemUsers,
    loginForm,
    setLoginForm,
    loginError,
    setLoginError,
    activeView,
    setActiveView,
    isDarkMode,
    setIsDarkMode,
    cart,
    setCart,
    products,
    setProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isAddMenuOpen,
    setIsAddMenuOpen,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    menuSearch,
    setMenuSearch,
    userSearch,
    setUserSearch,
    newProduct,
    setNewProduct,
    newUser,
    setNewUser,
    productToDeleteId,
    setProductToDeleteId,
    userDeleteUsername,
    setUserDeleteUsername,
    editingProductId,
    setEditingProductId,
    productDraft,
    setProductDraft,
    editingUserUsername,
    setEditingUserUsername,
    userDraft,
    setUserDraft,
    userPage,
    setUserPage,
    restockProductId,
    setRestockProductId,
    restockQty,
    setRestockQty,
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptDialogOpen,
    setReceiptDialogOpen,
    transactions,
    setTransactions,
    currentTransaction,
    setCurrentTransaction,
    reportRange,
    setReportRange,
    reportShift,
    setReportShift,
    reportBranch,
    setReportBranch,
    stockSearch,
    setStockSearch,
    stockCategory,
    setStockCategory,
    stockPage,
    setStockPage,
    settingsPage,
    setSettingsPage,
    categories,
    currentTime,
    visibleNavItems,
    accessibleProducts,
    filteredProducts,
    lowStockProducts,
    totalAmount,
    totalItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    handleAddProduct,
    handleDeleteProduct,
    handleStartEditProduct,
    handleCloseEditProduct,
    handleSaveProductEdit,
    handleRestockProduct,
    handleStartEditUser,
    handleCloseEditUser,
    handleSaveUserEdit,
    handleAddUser,
    handleDeleteUser,
    handlePaymentComplete,
    handleNewTransaction,
    handleLogin,
    handleLogout,
  };
};
