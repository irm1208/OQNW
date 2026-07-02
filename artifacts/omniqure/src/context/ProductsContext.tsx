import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
  loading: false,
});

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  priceGbp: number | null;
  imageUrl: string | null;
  shortDescription: string | null;
  purity: string | null;
  isFeatured: boolean;
  stockLevel: number | null;
  coaUrl?: string | null;
  msImageUrl?: string | null;
};

function toProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    price: p.priceGbp,
    image: p.imageUrl ?? `/products/${p.id}.jpg`,
    category: p.category,
    stockLevel: p.stockLevel ?? undefined,
    coaUrl: p.coaUrl ?? null,
    msImageUrl: p.msImageUrl ?? null,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiProduct[] | null) => {
        if (cancelled || !data || !Array.isArray(data)) return;
        const apiProducts = data.map(toProduct);
        // Deduplicate by slug so DB sequential IDs don't cause duplicates
        const apiSlugs = new Set(apiProducts.map((p) => p.slug));
        const fallback = staticProducts.filter((p) => !apiSlugs.has(p.slug));
        setProducts([...apiProducts, ...fallback]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, productDetails: slugProductDetails, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
