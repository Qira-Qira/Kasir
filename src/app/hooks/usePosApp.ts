import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  DEFAULT_SUGAR_LEVEL_OPTIONS,
  MOCK_PRODUCTS,
  RAW_MATERIALS_STOCK,
  ROLE_CONFIG,
  USER_ACCOUNTS,
} from "../constants";
import { applyBomDeduction, convertKgToGrams, getLowStockIngredients } from "../lib/bom";
import { getSugarLevelDeductionGrams, resolveSelectedAddons } from "../lib/addons";
import {
  deleteProductFromSupabase,
  deleteRawMaterialFromSupabase,
  deleteUserFromSupabase,
  getProductsFromSupabase,
  getRawMaterialsFromSupabase,
  getTransactionsFromSupabase,
  getUsersFromSupabase,
  insertTransactionToSupabase,
  upsertProductToSupabase,
  updateTransactionStatusInSupabase,
  upsertRawMaterialToSupabase,
  upsertUserToSupabase,
} from "../lib/supabase-data";
import type {
  AuthState,
  AddonOption,
  CartItemType,
  Product,
  RawMaterialStock,
  Role,
  Transaction,
  UserAccount,
  ViewKey,
} from "../types";
import { getCurrentTime } from "../utils";

export const usePosApp = () => {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const storedAuth = window.localStorage.getItem("kasir-auth");
      return storedAuth ? (JSON.parse(storedAuth) as AuthState) : null;
    } catch {
      return null;
    }
  });
  const [systemUsers, setSystemUsers] = useState<UserAccount[]>(USER_ACCOUNTS);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeView, setActiveView] = useState<ViewKey>(() => {
    if (typeof window === "undefined") return "Menu";

    try {
      const stored = window.localStorage.getItem("kasir-activeView");
      const allowed = ["Menu", "Laporan", "Riwayat", "Stok", "Dashboard", "Pengaturan"] as const;
      if (stored && (allowed as readonly string[]).includes(stored)) {
        return stored as ViewKey;
      }
    } catch {
      // ignore
    }

    return "Menu";
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [rawMaterialStock, setRawMaterialStock] = useState<RawMaterialStock[]>(RAW_MATERIALS_STOCK);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Minuman",
    recipe: [{ ingredientName: "", grams: "" }],
    addons: [{ name: "", group: "Ekstra", price: "" }],
  });
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "kasir" as Role });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [userDeleteUsername, setUserDeleteUsername] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState({
    name: "",
    price: "",
    category: "Minuman",
    recipe: [{ ingredientName: "", grams: "" }],
    addons: [{ name: "", group: "Ekstra", price: "" }],
  });
  const [editingUserUsername, setEditingUserUsername] = useState<string | null>(null);
  const [userDraft, setUserDraft] = useState({ username: "", password: "", role: "kasir" as Role });
  const [userPage, setUserPage] = useState(1);
  const [restockProductId, setRestockProductId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("10");
  const [rawMaterialDraft, setRawMaterialDraft] = useState({
    name: "",
    stockGrams: "",
    hppPerUnit: "",
    unit: "gram" as "gram" | "ml",
  });
  const [editingRawMaterialId, setEditingRawMaterialId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [reportRange, setReportRange] = useState<"Hari Ini" | "7 Hari Terakhir" | "Bulanan" | "Custom Date">("7 Hari Terakhir");
  const [reportShift, setReportShift] = useState<"Semua Shift" | "Shift 1" | "Shift 2">("Semua Shift");
  const [reportBranch, setReportBranch] = useState<"Semua Cabang" | "Cabang Utama" | "Cabang 2">("Semua Cabang");
  const [reportStartDate, setReportStartDate] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const stored = window.localStorage.getItem("kasir-reportStartDate");
      if (stored) return stored;
    } catch {}
    // default to 7 days ago
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [reportEndDate, setReportEndDate] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const stored = window.localStorage.getItem("kasir-reportEndDate");
      if (stored) return stored;
    } catch {}
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [stockSearch, setStockSearch] = useState("");
  const [stockCategory, setStockCategory] = useState("Semua");
  const [stockPage, setStockPage] = useState(1);
  const [settingsPage, setSettingsPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  const categories = CATEGORIES;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (auth) {
      window.localStorage.setItem("kasir-auth", JSON.stringify(auth));
      return;
    }

    window.localStorage.removeItem("kasir-auth");
  }, [auth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem("kasir-activeView", activeView);
    } catch {
      // ignore
    }
  }, [activeView]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("kasir-reportStartDate", reportStartDate);
    } catch {}
  }, [reportStartDate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("kasir-reportEndDate", reportEndDate);
    } catch {}
  }, [reportEndDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrateData = async () => {
      const [nextProducts, nextUsers, nextRawMaterials, nextTransactions] = await Promise.all([
        getProductsFromSupabase(),
        getUsersFromSupabase(),
        getRawMaterialsFromSupabase(),
        getTransactionsFromSupabase(),
      ]);

      if (!isMounted) return;

      setProducts(nextProducts);
      setSystemUsers(nextUsers);
      setRawMaterialStock(nextRawMaterials);
      setTransactions(nextTransactions);
    };

    void hydrateData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const lowStockProducts = useMemo(() => [], [accessibleProducts]);

  const lowStockIngredients = useMemo(
    () => getLowStockIngredients(rawMaterialStock),
    [rawMaterialStock]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = (product: Product, selectedAddons: AddonOption[] = []) => {
    const resolvedAddons = resolveSelectedAddons(product, selectedAddons);
    const addOnTotal = resolvedAddons.reduce((sum, option) => sum + option.price, 0);
    const lineId = `${product.id}-${resolvedAddons.map((addon) => addon.id).join("-") || "base"}`;
    const itemName = [product.name, ...resolvedAddons.map((addon) => addon.name)].join(" + ");

    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + 1, price: product.price + addOnTotal } : item
        );
      }

      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          name: itemName,
          price: product.price + addOnTotal,
          basePrice: product.price,
          quantity: 1,
          addOns: resolvedAddons.map((addon) => ({
            id: addon.id,
            group: addon.group,
            name: addon.name,
            price: addon.price,
            quantity: 1,
          })),
        },
      ];
    });
  };

  const adjustAddonQuantity = (itemId: string, addonId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const nextAddOns = item.addOns
          .map((addon) => {
            if (addon.id !== addonId) return addon;
            const nextQuantity = Math.max(0, addon.quantity + delta);
            return { ...addon, quantity: nextQuantity };
          })
          .filter((addon) => addon.quantity > 0);

        const nextUnitPrice = item.basePrice + nextAddOns.reduce((sum, addon) => sum + addon.price * addon.quantity, 0);

        return {
          ...item,
          addOns: nextAddOns,
          price: nextUnitPrice,
          name: [item.productId ? products.find((product) => product.id === item.productId)?.name ?? "" : "", ...nextAddOns.map((addon) => addon.name)].join(" + ") || item.name,
        };
      })
    );
  };

  const increaseQuantity = (id: string) => {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const increaseAddonQuantity = (itemId: string, addonId: string) => {
    adjustAddonQuantity(itemId, addonId, 1);
  };

  const decreaseAddonQuantity = (itemId: string, addonId: string) => {
    adjustAddonQuantity(itemId, addonId, -1);
  };

  const decreaseQuantity = (id: string) => {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newProduct.name.trim();
    const price = Number(newProduct.price);
    const category = newProduct.category;
    const recipe = (newProduct.recipe ?? [])
      .filter((entry) => entry.ingredientName.trim() && Number(entry.grams) > 0)
      .map((entry) => ({
        ingredient: entry.ingredientName.trim(),
        gramsPerPortion: Number(entry.grams),
      }));

    const explicitAddons = (newProduct.addons ?? [])
      .filter((entry) => entry.name.trim() && Number(entry.price) >= 0)
      .map((entry, index) => ({
        id: `addon-${Date.now()}-${index}`,
        name: entry.name.trim(),
        group: entry.group.trim() || "Ekstra",
        price: Number(entry.price),
      }));

    const sugarAddons = category === "Minuman"
      ? DEFAULT_SUGAR_LEVEL_OPTIONS.map((option) => ({
          id: `addon-${Date.now()}-${option.id}`,
          name: option.name,
          group: option.group,
          price: option.price,
        }))
      : [];

    const addons = category === "Minuman"
      ? [...sugarAddons, ...explicitAddons.filter((entry) => entry.group !== "Sugar Level")]
      : explicitAddons;

    if (!name || !Number.isFinite(price) || price <= 0) {
      return;
    }

    const productToAdd: Product = {
      id: `product-${Date.now()}`,
      name,
      price,
      category,
      createdBy: "admin",
      recipe: recipe.length > 0 ? recipe : undefined,
      addons: addons.length > 0 ? addons : undefined,
    };

    setProducts((prev) => [productToAdd, ...prev]);
    void upsertProductToSupabase(productToAdd);

    setNewProduct({
      name: "",
      price: "",
      category: "Minuman",
      recipe: [{ ingredientName: "", grams: "" }],
      addons: [{ name: "", group: "Ekstra", price: "" }],
    });
    setIsAddMenuOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    void deleteProductFromSupabase(id);
    setProductToDeleteId(null);
    setEditingProductId((prev) => (prev === id ? null : prev));
  };

  const handleStartEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: String(product.price),
      category: product.category,
      recipe: (product.recipe ?? []).map((item) => ({ ingredientName: item.ingredient, grams: String(item.gramsPerPortion) })),
      addons: (product.addons ?? [])
        .filter((item) => item.group !== "Sugar Level")
        .map((item) => ({ name: item.name, group: item.group, price: String(item.price) })),
    });
  };

  const handleCloseEditProduct = () => {
    setEditingProductId(null);
    setProductDraft({
      name: "",
      price: "",
      category: "Minuman",
      recipe: [{ ingredientName: "", grams: "" }],
      addons: [{ name: "", group: "Ekstra", price: "" }],
    });
  };

  const handleSaveProductEdit = (id: string) => {
    const name = productDraft.name.trim();
    const price = Number(productDraft.price);
    const category = productDraft.category;
    const recipe = (productDraft.recipe ?? [])
      .filter((entry) => entry.ingredientName.trim() && Number(entry.grams) > 0)
      .map((entry) => ({
        ingredient: entry.ingredientName.trim(),
        gramsPerPortion: Number(entry.grams),
      }));

    const explicitAddons = (productDraft.addons ?? [])
      .filter((entry) => entry.name.trim() && Number(entry.price) >= 0 && entry.group !== "Sugar Level")
      .map((entry, index) => ({
        id: `addon-${id}-${index}`,
        name: entry.name.trim(),
        group: entry.group.trim() || "Ekstra",
        price: Number(entry.price),
      }));

    const sugarAddons = category === "Minuman"
      ? DEFAULT_SUGAR_LEVEL_OPTIONS.map((option) => ({
          id: `addon-${id}-${option.id}`,
          name: option.name,
          group: option.group,
          price: option.price,
        }))
      : [];

    const addons = category === "Minuman"
      ? [...sugarAddons, ...explicitAddons.filter((entry) => entry.group !== "Sugar Level")]
      : explicitAddons;

    if (!name || !Number.isFinite(price) || price <= 0) {
      return;
    }

    const updatedProduct: Product = {
      id,
      name,
      price,
      category,
      createdBy: "admin",
      recipe: recipe.length > 0 ? recipe : undefined,
      addons: addons.length > 0 ? addons : undefined,
    };

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...updatedProduct, createdBy: product.createdBy ?? "admin" }
          : product
      )
    );

    void upsertProductToSupabase(updatedProduct);
    handleCloseEditProduct();
  };

  const handleRestockProduct = (_id: string, _amount = 10) => {
    return;
  };

  const handleRestockIngredient = (ingredientName: string, grams: number) => {
    if (!Number.isFinite(grams) || grams <= 0) return;

    setRawMaterialStock((prev) => {
      const nextState = prev.map((item) =>
        item.name.toLowerCase() === ingredientName.toLowerCase()
          ? { ...item, stockGrams: Number((item.stockGrams + grams).toFixed(2)) }
          : item
      );

      void Promise.all(nextState.map((item) => upsertRawMaterialToSupabase(item)));
      return nextState;
    });
  };

  const handleAddRawMaterial = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const name = rawMaterialDraft.name.trim();
    const stockGrams = Number(rawMaterialDraft.stockGrams);
    const hppPerUnit = Number(rawMaterialDraft.hppPerUnit);
    const unit = rawMaterialDraft.unit;

    if (!name || !Number.isFinite(stockGrams) || !Number.isFinite(hppPerUnit) || stockGrams < 0 || hppPerUnit < 0) {
      return;
    }

    const newMaterial: RawMaterialStock = {
      id: `raw-${Date.now()}`,
      name,
      stockGrams: Number(stockGrams.toFixed(2)),
      hppPerUnit: Number(hppPerUnit.toFixed(2)),
      unit,
    };

    setRawMaterialStock((prev) => {
      const exists = prev.some((item) => item.name.toLowerCase() === name.toLowerCase());
      let nextState: RawMaterialStock[];

      if (exists) {
        nextState = prev.map((item) =>
          item.name.toLowerCase() === name.toLowerCase()
            ? {
                ...item,
                stockGrams: Number((item.stockGrams + stockGrams).toFixed(2)),
                hppPerUnit: Number(hppPerUnit.toFixed(2)),
                unit,
              }
            : item
        );
      } else {
        nextState = [newMaterial, ...prev];
      }

      const persisted = nextState.find((item) => item.name.toLowerCase() === name.toLowerCase());
      if (persisted) {
        void upsertRawMaterialToSupabase(persisted);
      }

      return nextState;
    });

    setRawMaterialDraft({ name: "", stockGrams: "", hppPerUnit: "", unit: "gram" });
  };

  const handleUpdateRawMaterial = (id: string) => {
    const name = rawMaterialDraft.name.trim();
    const stockGrams = Number(rawMaterialDraft.stockGrams);
    const hppPerUnit = Number(rawMaterialDraft.hppPerUnit);
    const unit = rawMaterialDraft.unit;

    if (!name || !Number.isFinite(stockGrams) || !Number.isFinite(hppPerUnit) || stockGrams < 0 || hppPerUnit < 0) return;

    setRawMaterialStock((prev) => {
      const nextState = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              stockGrams: Number(stockGrams.toFixed(2)),
              hppPerUnit: Number(hppPerUnit.toFixed(2)),
              unit,
            }
          : item
      );

      const persisted = nextState.find((item) => item.id === id);
      if (persisted) {
        void upsertRawMaterialToSupabase(persisted);
      }

      return nextState;
    });

    setEditingRawMaterialId(null);
    setRawMaterialDraft({ name: "", stockGrams: "", hppPerUnit: "", unit: "gram" });
  };

  const handleDeleteRawMaterial = (id: string) => {
    setRawMaterialStock((prev) => {
      const nextState = prev.filter((item) => item.id !== id);
      const target = prev.find((item) => item.id === id);
      if (target) {
        void deleteRawMaterialFromSupabase(target.id);
      }
      return nextState;
    });
    if (editingRawMaterialId === id) {
      setEditingRawMaterialId(null);
      setRawMaterialDraft({ name: "", stockGrams: "", hppPerUnit: "", unit: "gram" });
    }
  };

  const handleStartEditRawMaterial = (material: RawMaterialStock) => {
    setEditingRawMaterialId(material.id);
    setRawMaterialDraft({
      name: material.name,
      stockGrams: String(material.stockGrams),
      hppPerUnit: String(material.hppPerUnit),
      unit: material.unit,
    });
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

    const updatedUser: UserAccount = {
      username,
      password,
      role: userDraft.role,
      name: username,
    };

    setSystemUsers((prev) =>
      prev.map((user) =>
        user.username === currentUsername
          ? { ...user, ...updatedUser, name: username }
          : user
      )
    );

    void upsertUserToSupabase(updatedUser);
    handleCloseEditUser();
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = newUser.username.trim();
    const password = newUser.password.trim();

    if (!username || !password) return;

    const userToAdd: UserAccount = {
      name: username,
      username,
      password,
      role: newUser.role,
    };

    setSystemUsers((prev) => {
      if (prev.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
        return prev;
      }

      return [...prev, userToAdd];
    });

    void upsertUserToSupabase(userToAdd);
    setNewUser({ username: "", password: "", role: "kasir" });
    setIsAddUserModalOpen(false);
    setUserPage(1);
  };

  const handleDeleteUser = (username: string) => {
    if (username === "admin") return;
    setSystemUsers((prev) => prev.filter((user) => user.username !== username));
    void deleteUserFromSupabase(username);
    setEditingUserUsername((prev) => (prev === username ? null : prev));
    setUserDeleteUsername(null);
  };

  const handlePaymentComplete = (
    paymentMethod: string,
    amountPaid: number,
    orderType: "Dine In" | "Takeaway"
  ) => {
    if (cart.length === 0) return;

    let nextMaterialStock = [...rawMaterialStock];

    for (const cartItem of cart) {
      const product = products.find((item) => item.id === cartItem.productId);
      if (product?.recipe && product.recipe.length > 0) {
        nextMaterialStock = applyBomDeduction(nextMaterialStock, product.recipe, cartItem.quantity);
      }

      const sugarOption = cartItem.addOns.find((addon) => addon.group === "Sugar Level");
      if (sugarOption) {
        const sugarDeduction = getSugarLevelDeductionGrams(sugarOption.name) * cartItem.quantity;
        const sugarTarget = nextMaterialStock.find(
          (material) => material.name.toLowerCase().includes("gula") || material.name.toLowerCase().includes("sugar")
        );

        if (sugarTarget && sugarDeduction > 0) {
          sugarTarget.stockGrams = Number(Math.max(0, sugarTarget.stockGrams - sugarDeduction).toFixed(2));
        }
      }
    }

    setRawMaterialStock(nextMaterialStock);
    void Promise.all(nextMaterialStock.map((item) => upsertRawMaterialToSupabase(item)));

    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        addons: item.addOns.map((addon) => ({
          name: addon.name,
          quantity: addon.quantity,
          price: addon.price,
        })),
      })),
      total: totalAmount,
      paymentMethod,
      amountPaid,
      orderType,
      date: new Date().toISOString(),
      isCompleted: false,
    };

    setTransactions((prev) => [transaction, ...prev]);
    void insertTransactionToSupabase(transaction);
    setCurrentTransaction(transaction);
    setReceiptDialogOpen(true);
  };

  const handleNewTransaction = () => {
    clearCart();
    setCurrentTransaction(null);
    setReceiptDialogOpen(false);
  };

  const handleToggleTransactionStatus = (transactionId: string) => {
    setTransactions((prev) => {
      const target = prev.find((transaction) => transaction.id === transactionId);
      if (!target) return prev;

      const nextValue = !target.isCompleted;
      void updateTransactionStatusInSupabase(transactionId, nextValue);

      return prev.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, isCompleted: nextValue } : transaction
      );
    });
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
    rawMaterialDraft,
    setRawMaterialDraft,
    editingRawMaterialId,
    setEditingRawMaterialId,
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
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
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
    lowStockIngredients,
    rawMaterialStock,
    setRawMaterialStock,
    totalAmount,
    totalItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    increaseAddonQuantity,
    decreaseAddonQuantity,
    removeFromCart,
    clearCart,
    handleAddProduct,
    handleDeleteProduct,
    handleStartEditProduct,
    handleCloseEditProduct,
    handleSaveProductEdit,
    handleRestockProduct,
    handleRestockIngredient,
    handleAddRawMaterial,
    handleUpdateRawMaterial,
    handleDeleteRawMaterial,
    handleStartEditRawMaterial,
    handleStartEditUser,
    handleCloseEditUser,
    handleSaveUserEdit,
    handleAddUser,
    handleDeleteUser,
    handlePaymentComplete,
    handleNewTransaction,
    handleToggleTransactionStatus,
    handleLogin,
    handleLogout,
  };
};
