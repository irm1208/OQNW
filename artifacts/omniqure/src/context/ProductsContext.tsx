import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { products as staticProducts } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { productDetails as staticProductDetails } from "@/data/productDetails";

type ProductsContextType = {
  products: Product[];
  productDetails: Record<string, ProductDetail>;
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextType>({
  products: staticProducts,
  productDetails: staticProductDetails,
  loading: true,
});

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  priceGbp: number | null;
  imageUrl: string | null;
  shortDescription: string | null;
  description?: string | null;
  purity: string | null;
  isFeatured: boolean;
  stockLevel: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function toProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    price: p.priceGbp,
    image: p.imageUrl ?? `/products/${p.id}.jpg`,
    category: p.category,
    description: p.description ?? null,
    purity: p.purity ?? null,
    stockLevel: p.stockLevel ?? undefined,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
  };
}

// Build a slug-keyed productDetails map so lookups work regardless of DB id shifts
const slugProductDetails: Record<string, ProductDetail> = {};
for (const p of staticProducts) {
  const detail = staticProductDetails[p.id];
  if (detail) slugProductDetails[p.slug] = detail;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(false);
  const latestRequestRef = useRef(0);

  const refreshProducts = useCallback(async (showLoading = false) => {
    const requestId = ++latestRequestRef.current;
    if (showLoading && isMountedRef.current) setLoading(true);

    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = response.ok ? await response.json() as ApiProduct[] : null;
      if (!isMountedRef.current || requestId !== latestRequestRef.current || !data || !Array.isArray(data)) return;
      // API is the source of truth — disabled products must not be re-added from the static list.
      setProducts(data.map(toProduct));
    } catch {
      // Preserve the last successfully loaded catalog if a background refresh fails.
    } finally {
      if (showLoading && isMountedRef.current && requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refreshProducts(true);

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshProducts();
    };
    const refreshAfterCatalogUpdate = (event: StorageEvent) => {
      if (event.key === "omniqure:catalog-updated") void refreshProducts();
    };
    const refreshInterval = window.setInterval(refreshWhenVisible, 15_000);

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("storage", refreshAfterCatalogUpdate);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("storage", refreshAfterCatalogUpdate);
    };
  }, [refreshProducts]);

  return (
    <ProductsContext.Provider value={{ products, productDetails: slugProductDetails, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
