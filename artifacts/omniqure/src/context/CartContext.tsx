import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { trackAddToCart } from "@/lib/pixels";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  bundleDiscountPct: number;
  bundleDiscountAmount: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "omniqure_cart";
const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage);
  const { customer } = useCustomerAuth();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const syncToServer = useCallback(
    (cartItems: CartItem[], cust: typeof customer) => {
      if (!cust) return;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        const payload = cartItems.map((i) => ({
          productId: parseInt(i.product.id, 10) || 0,
          productName: i.product.name,
          quantity: i.quantity,
          priceGbp: i.product.price ?? 0,
        }));
        fetch(apiUrl("api/cart/save"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customerEmail: cust.email,
            customerName: `${cust.firstName} ${cust.lastName}`,
            items: payload,
          }),
        }).catch(() => {});
      }, 2000);
    },
    []
  );

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      trackAddToCart({ id: product.id, name: product.name, price: product.price ?? null, category: product.category }, qty);
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const next = existing
          ? prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            )
          : [...prev, { product, quantity: qty }];
        syncToServer(next, customer);
        return next;
      });
    },
    [customer, syncToServer]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.product.id !== productId);
        syncToServer(next, customer);
        return next;
      });
    },
    [customer, syncToServer]
  );

  const updateQuantity = useCallback(
    (productId: string, qty: number) => {
      if (qty < 1) return;
      setItems((prev) => {
        const next = prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        );
        syncToServer(next, customer);
        return next;
      });
    },
    [customer, syncToServer]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (customer) {
      fetch(apiUrl("api/cart/save"), {
        method: "DELETE",
        credentials: "include",
      }).catch(() => {});
    }
  }, [customer]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
  const bundleDiscountPct = totalItems >= 15 ? 20 : totalItems >= 11 ? 15 : totalItems >= 7 ? 10 : totalItems >= 3 ? 5 : 0;
  const bundleDiscountAmount = subtotal * bundleDiscountPct / 100;

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, bundleDiscountPct, bundleDiscountAmount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
