import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "omniqure_recently_viewed";
const MAX_ITEMS = 10;

interface RecentlyViewedContextValue {
  recentIds: string[];
  trackView: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue>({
  recentIds: [],
  trackView: () => {},
});

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {}
  }, [recentIds]);

  function trackView(productId: string) {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, trackView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
