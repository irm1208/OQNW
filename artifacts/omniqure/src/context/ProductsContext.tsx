import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { products as staticProducts } from "@/data/products";
import { productDetails as staticProductDetails } from "@/data/productDetails";

type ProductsContextType = {
  products: Product[];
  productDetails: Record<string, ProductDetail>;
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  productDetails: {},
  loading: true,
});

function withProtectedImage(image: string): string {
  if (!image.startsWith("/") || image.startsWith("/api/")) return image;
  return `/api/catalogue-assets${image}`;
}

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
  alsoKnownAs: string | null;
  molecularWeight: string | null;
  casNumber: string | null;
  formula: string | null;
  sequence: string | null;
  storage: string | null;
  appearance: string | null;
  solubility: string | null;
  halfLife: string | null;
  isFeatured: boolean;
  stockLevel: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const CATALOGUE_IMAGE_OVERRIDES: Record<string, string> = {
  "5-amino-1q-50mg": "/products/83-card.png",
  "glow-blend-70mg": "/products/22-card.png",
  "klow-blend-80mg": "/products/35-card.png",
  "ghk-cu-50mg": "/products/17-card.png",
  "ghk-cu-100mg": "/products/18-card.png",
  "nad-plus-500mg": "/products/nad-plus-500mg.png",
  "nad-plus-1000mg": "/products/nad-plus-1000mg.png",
};

function toProduct(p: ApiProduct): Product {
  const image = CATALOGUE_IMAGE_OVERRIDES[p.slug] ?? p.imageUrl ?? "";
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    price: p.priceGbp,
    image: withProtectedImage(image),
    category: p.category,
    description: p.shortDescription ?? p.description ?? null,
    purity: p.purity ?? null,
    stockLevel: p.stockLevel ?? undefined,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
  };
}

// Keep only detail fields that do not have an admin/database equivalent.
const staticSupplementalDetails: Record<string, Pick<ProductDetail, "longDescription" | "researchAreas" | "refNumber">> = {};
for (const p of staticProducts) {
  const detail = staticProductDetails[p.id];
  if (detail) {
    staticSupplementalDetails[p.slug] = {
      longDescription: detail.longDescription,
      researchAreas: detail.researchAreas,
      refNumber: detail.refNumber,
    };
  }
}

function toProductDetail(p: ApiProduct): ProductDetail {
  return {
    ...staticSupplementalDetails[p.slug],
    id: String(p.id),
    description: p.description ?? "",
    sequence: p.sequence ?? undefined,
    molecularWeight: p.molecularWeight ?? undefined,
    casNumber: p.casNumber ?? undefined,
    formula: p.formula ?? undefined,
    purity: p.purity ?? undefined,
    storage: p.storage ?? undefined,
    appearance: p.appearance ?? undefined,
    solubility: p.solubility ?? undefined,
    halfLife: p.halfLife ?? undefined,
    alsoKnownAs: p.alsoKnownAs ?? undefined,
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetail>>({});
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(false);
  const latestRequestRef = useRef(0);

  const refreshProducts = useCallback(async (showLoading = false) => {
    const requestId = ++latestRequestRef.current;
    if (showLoading && isMountedRef.current) setLoading(true);

    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = response.ok ? await response.json() as ApiProduct[] : null;
      if (!isMountedRef.current || requestId !== latestRequestRef.current) return;
      if (!data || !Array.isArray(data)) {
        setProducts([]);
        setProductDetails({});
        return;
      }
      // API is the source of truth — disabled products must not be re-added from the static list.
      setProducts(data.map(toProduct));
      setProductDetails(Object.fromEntries(data.map(product => [product.slug, toProductDetail(product)])));
    } catch {
      if (isMountedRef.current && requestId === latestRequestRef.current) {
        setProducts([]);
        setProductDetails({});
      }
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
    <ProductsContext.Provider value={{ products, productDetails, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
