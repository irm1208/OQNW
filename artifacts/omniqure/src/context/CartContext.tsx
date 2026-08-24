import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useProducts } from "@/context/ProductsContext";
import { trackAddToCart } from "@/lib/pixels";
import { toast } from "@/hooks/use-toast";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  /** Number of qualifying (non-accessory) peptide units in the cart — the quantity that unlocks free-item tiers. */
  peptideQty: number;
  /** True once 3+ peptides are in the cart — customer gets a free 10ml bacteriostatic water. */
  bundleFreeBacWater: boolean;
  /** How many peptide units are free at the current tier (0, 1 at 5+, or 2 at 10+). Not cumulative across tiers. */
  bundleFreeItemsCount: number;
  /** Combined monetary value of all free items (free BAC water + free peptide units) — subtract from subtotal for the discounted total. */
  bundleDiscountAmount: number;
  /** Maps productId -> number of units of that specific line that are free (the cheapest eligible units at the current tier), so the UI can flag exactly which line item(s) are free. */
  freeUnitsByProductId: Record<string, number>;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
};

// Bundle & Save — free-item tiers (mutually exclusive, not cumulative):
//   3-4 peptides  -> a free 10ml bacteriostatic water
//   5-9 peptides  -> the cheapest peptide in the cart is free (no free BAC water)
//   10+ peptides  -> the 2 cheapest peptides in the cart are free (no free BAC water)
export const BUNDLE_FREE_BAC_THRESHOLD = 3;
export const BUNDLE_FREE_ONE_THRESHOLD = 5;
export const BUNDLE_FREE_TWO_THRESHOLD = 10;
export const FREE_BAC_WATER_VALUE_GBP = 8.99;

function isAccessory(product: Product): boolean {
  return product.category === "Accessories";
}

function computeBundleFreebies(items: CartItem[]) {
  const qualifyingUnits: { productId: string; price: number }[] = [];
  let peptideQty = 0;
  for (const { product, quantity } of items) {
    if (isAccessory(product)) continue;
    peptideQty += quantity;
    for (let i = 0; i < quantity; i++) {
      qualifyingUnits.push({ productId: product.id, price: product.price ?? 0 });
    }
  }

  const bundleFreeItemsCount =
    peptideQty >= BUNDLE_FREE_TWO_THRESHOLD ? 2 : peptideQty >= BUNDLE_FREE_ONE_THRESHOLD ? 1 : 0;
  const bundleFreeBacWater =
    peptideQty >= BUNDLE_FREE_BAC_THRESHOLD && peptideQty < BUNDLE_FREE_ONE_THRESHOLD;

  // The cheapest N qualifying units become free — stable-sort by price so ties resolve
  // to the order items were pushed in (cart order), keeping the "which items are free" answer deterministic.
  const cheapestFreeUnits = qualifyingUnits
    .map((u, idx) => ({ ...u, idx }))
    .sort((a, b) => a.price - b.price || a.idx - b.idx)
    .slice(0, bundleFreeItemsCount);

  const freeUnitsByProductId: Record<string, number> = {};
  let freeItemsValue = 0;
  for (const u of cheapestFreeUnits) {
    freeUnitsByProductId[u.productId] = (freeUnitsByProductId[u.productId] ?? 0) + 1;
    freeItemsValue += u.price;
  }

  const bundleDiscountAmount = freeItemsValue + (bundleFreeBacWater ? FREE_BAC_WATER_VALUE_GBP : 0);

  return { peptideQty, bundleFreeBacWater, bundleFreeItemsCount, bundleDiscountAmount, freeUnitsByProductId };
}

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
  const { products } = useProducts();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(previous => {
      const next = previous.map(item => {
        const latestProduct = products.find(product => product.id === item.product.id);
        return latestProduct ? { ...item, product: latestProduct } : item;
      });
      return next.some((item, index) => item.product !== previous[index].product) ? next : previous;
    });
  }, [products]);

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
      if (product.stockLevel === 0) {
        toast({
          title: "Sold out",
          description: `${product.name} is currently unavailable.`,
        });
        return;
      }
      trackAddToCart({ id: product.id, name: product.name, price: product.price ?? null, category: product.category }, qty);
      setItems((prev) => {
        const before = computeBundleFreebies(prev);
        const existing = prev.find((i) => i.product.id === product.id);
        const next = existing
          ? prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            )
          : [...prev, { product, quantity: qty }];
        syncToServer(next, customer);

        const after = computeBundleFreebies(next);
        if (after.bundleFreeItemsCount > before.bundleFreeItemsCount) {
          toast({
            title: after.bundleFreeItemsCount === 2 ? "🎁 2 free peptides unlocked!" : "🎁 1 free peptide unlocked!",
            description: "Your cheapest qualifying peptide(s) are now free — Bundle & Save applies automatically at checkout.",
          });
        } else if (!before.bundleFreeBacWater && after.bundleFreeBacWater) {
          toast({
            title: "🎁 Free 10ml BAC water unlocked!",
            description: "You've reached 3-4 peptides — a free bacteriostatic water has been added to your order automatically.",
          });
        } else if (!isAccessory(product) && !after.bundleFreeBacWater) {
          const remaining = BUNDLE_FREE_BAC_THRESHOLD - after.peptideQty;
          if (remaining > 0) {
            toast({
              title: "Added to cart",
              description: `Add ${remaining} more peptide${remaining !== 1 ? "s" : ""} to unlock a free BAC water.`,
            });
          }
        }

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
        const item = prev.find(cartItem => cartItem.product.id === productId);
        if (item?.product.stockLevel !== undefined && qty > item.product.stockLevel) {
          toast({
            title: "Only limited stock is available",
            description: `Only ${item.product.stockLevel} of ${item.product.name} remain in stock.`,
          });
          return prev;
        }
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
  const { peptideQty, bundleFreeBacWater, bundleFreeItemsCount, bundleDiscountAmount, freeUnitsByProductId } = computeBundleFreebies(items);

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, peptideQty, bundleFreeBacWater, bundleFreeItemsCount, bundleDiscountAmount, freeUnitsByProductId, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
