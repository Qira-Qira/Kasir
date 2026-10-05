import { useState, useEffect } from "react";
import type { Product, NewProduct, ProductDraft } from "../types";
import { MOCK_PRODUCTS } from "../constants";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>({
    name: "",
    price: "",
    category: "Minuman",
    stock: "",
  });
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    price: "",
    category: "Minuman",
    stock: "",
  });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [settingsPage, setSettingsPage] = useState(1);

  useEffect(() => {
    const maxProductPages = Math.max(1, Math.ceil(products.length / 5));
    setSettingsPage((page) => Math.min(page, maxProductPages));
  }, [products.length]);

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    const product: Product = {
      id: `${Date.now()}-${Math.random()}`,
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      stock: Number(newProduct.stock),
      createdBy: "admin",
    };

    setProducts((prev) => [...prev, product]);
    setNewProduct({ name: "", price: "", category: "Minuman", stock: "" });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setProductToDeleteId(null);
  };

  const handleStartEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
    });
  };

  const handleCloseEditProduct = () => {
    setEditingProductId(null);
    setProductDraft({ name: "", price: "", category: "Minuman", stock: "" });
  };

  const handleSaveProductEdit = (id: string) => {
    if (!productDraft.name || !productDraft.price || !productDraft.stock) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: productDraft.name,
              price: Number(productDraft.price),
              category: productDraft.category,
              stock: Number(productDraft.stock),
            }
          : p
      )
    );
    handleCloseEditProduct();
  };

  const handleRestockProduct = (id: string, amount = 10) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: p.stock + amount } : p
      )
    );
  };

  return {
    products,
    setProducts,
    editingProductId,
    setEditingProductId,
    productDraft,
    setProductDraft,
    newProduct,
    setNewProduct,
    productToDeleteId,
    setProductToDeleteId,
    settingsPage,
    setSettingsPage,
    handleAddProduct,
    handleDeleteProduct,
    handleStartEditProduct,
    handleCloseEditProduct,
    handleSaveProductEdit,
    handleRestockProduct,
  };
};
