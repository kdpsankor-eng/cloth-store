"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  nameBn: string;
  slug: string;
  imageUrl: string;
  size?: string | null;
  color?: string | null;
  price: number;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string | null | undefined) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("wcs_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("wcs_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [items, isMounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const matchIndex = prev.findIndex(
        (it) => it.productId === newItem.productId && it.variantId === newItem.variantId
      );

      if (matchIndex > -1) {
        const updated = [...prev];
        const existing = updated[matchIndex];
        const newQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock || 99);
        updated[matchIndex] = { ...existing, quantity: newQty };
        return updated;
      }

      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const updateQuantity = (
    productId: string,
    variantId: string | null | undefined,
    qty: number
  ) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.productId === productId && it.variantId === variantId) {
          const validQty = Math.min(qty, it.maxStock || 99);
          return { ...it, quantity: validQty };
        }
        return it;
      })
    );
  };

  const removeFromCart = (productId: string, variantId: string | null | undefined) => {
    setItems((prev) =>
      prev.filter(
        (it) => !(it.productId === productId && it.variantId === variantId)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
