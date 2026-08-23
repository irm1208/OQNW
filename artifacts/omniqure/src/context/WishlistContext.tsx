import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

const LOCAL_KEY = "omniqure_wishlist";

function loadLocal(): number[] {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved) as number[];
  } catch (_e) {}
  return [];
}

function saveLocal(ids: Set<number>): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...ids]));
  } catch (_e) {}
}

type WishlistCtx = {
  wishlistIds: Set<number>;
  toggle: (productId: number) => Promise<void>;
  has: (productId: number) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistCtx>({
  wishlistIds: new Set(),
  toggle: async () => {},
  has: () => false,
  count: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customer } = useCustomerAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(() => new Set(loadLocal()));

  useEffect(() => {
    if (!customer) return;
    fetch(apiUrl("wishlist"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<{ productIds: number[] }>) : null))
      .then((data) => {
        if (!data) return;
        const serverIds = new Set(data.productIds);
        const localIds = loadLocal();
        const newItems = localIds.filter((id) => !serverIds.has(id));
        if (newItems.length > 0) {
          newItems.forEach((id) => {
            fetch(apiUrl(`wishlist/${id}`), { method: "POST", credentials: "include" }).catch(() => {});
          });
        }
        const merged = new Set([...serverIds, ...localIds]);
        setWishlistIds(merged);
        saveLocal(merged);
      })
      .catch(() => {});
  }, [customer?.id]);

  const toggle = useCallback(async (productId: number) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      const inList = next.has(productId);
      if (inList) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      saveLocal(next);
      if (customer) {
        const method = inList ? "DELETE" : "POST";
        fetch(apiUrl(`wishlist/${productId}`), { method, credentials: "include" }).catch(() => {});
      }
      return next;
    });
  }, [customer]);

  const has = useCallback((productId: number) => wishlistIds.has(productId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, has, count: wishlistIds.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
