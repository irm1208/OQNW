import type { Product } from "./products";

export type GroupedProduct = {
  baseName: string;
  category: string;
  image: string;
  variants: Product[];
};

export function parseName(name: string): { baseName: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g))(\s+.*)?$/i);
  if (match) {
    const suffix = match[3] ? match[3].trim() : "";
    return { baseName: match[1].trim(), strength: suffix ? `${match[2]} ${suffix}` : match[2] };
  }
  return { baseName: name, strength: "" };
}

export function groupProducts(productList: Product[]): GroupedProduct[] {
  const filtered = productList.filter(p => !/\(Vial [B-Z]\)/i.test(p.name));

  const map = new Map<string, GroupedProduct>();

  for (const product of filtered) {
    const { baseName } = parseName(product.name);
    if (!map.has(baseName)) {
      map.set(baseName, {
        baseName,
        category: product.category,
        image: product.image,
        variants: [],
      });
    }
    map.get(baseName)!.variants.push(product);
  }

  for (const group of map.values()) {
    group.variants.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }

  return Array.from(map.values());
}
