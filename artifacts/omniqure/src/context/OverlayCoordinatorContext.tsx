import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// Coordinates fixed-position, bottom-anchored overlays (cookie consent bar,
// mobile cart bar, chat widget) so they stack on top of each other instead of
// visually overlapping. Each overlay reports its own rendered height under a
// unique id; consumers (like the chat bubble) read the combined inset and
// shift themselves up by that amount.
interface OverlayCoordinatorValue {
  bottomInset: number;
  registerBottomInset: (id: string, height: number) => void;
}

const OverlayCoordinatorContext = createContext<OverlayCoordinatorValue | null>(null);

export function OverlayCoordinatorProvider({ children }: { children: ReactNode }) {
  const [insets, setInsets] = useState<Record<string, number>>({});

  const registerBottomInset = useCallback((id: string, height: number) => {
    setInsets(prev => {
      const rounded = Math.max(0, Math.round(height));
      if (rounded <= 0) {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (prev[id] === rounded) return prev;
      return { ...prev, [id]: rounded };
    });
  }, []);

  const bottomInset = useMemo(
    () => Object.values(insets).reduce((max, h) => Math.max(max, h), 0),
    [insets]
  );

  const value = useMemo(() => ({ bottomInset, registerBottomInset }), [bottomInset, registerBottomInset]);

  return (
    <OverlayCoordinatorContext.Provider value={value}>
      {children}
    </OverlayCoordinatorContext.Provider>
  );
}

export function useOverlayCoordinator(): OverlayCoordinatorValue {
  const ctx = useContext(OverlayCoordinatorContext);
  if (!ctx) return { bottomInset: 0, registerBottomInset: () => {} };
  return ctx;
}
