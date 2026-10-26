import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Gift } from "lucide-react";
import type { GroupedProduct } from "@/data/groupedProducts";
import { popularProductSlugs } from "@/data/popularPeptides";
import { rangeColourForCategory } from "@/lib/rangeColour";
import { STUDIO_BG } from "@/lib/studioImage";

type Range = { name: string; colour: string; groups: GroupedProduct[] };

const POPULAR = "Popular";

function lowestPrice(group: GroupedProduct): number | null {
  const prices = group.variants.map((v) => v.price).filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : null;
}

/** Ranges ordered by size, plus a "Popular" range built from the curated list. */
export function useRanges(groups: GroupedProduct[]): Range[] {
  return useMemo(() => {
    const byCategory = new Map<string, GroupedProduct[]>();
    for (const g of groups) {
      if (!byCategory.has(g.category)) byCategory.set(g.category, []);
      byCategory.get(g.category)!.push(g);
    }
    const popularSlugs = new Set(popularProductSlugs.map((e) => e.slug));
    const popular = groups.filter((g) => g.variants.some((v) => popularSlugs.has(v.slug)));
    const ranges = [...byCategory.entries()]
      .map(([name, list]) => ({ name, colour: rangeColourForCategory(name), groups: list }))
      .sort((a, b) => b.groups.length - a.groups.length || a.name.localeCompare(b.name));
    return [{ name: POPULAR, colour: "var(--oq-cornflower)", groups: popular }, ...ranges];
  }, [groups]);
}

/** A vial tile: studio image, name, from-price and a range-colour rule. */
export function VialTile({ group, formatPrice, onNavigate, size = "md" }: {
  group: GroupedProduct;
  formatPrice: (n: number) => string;
  onNavigate: () => void;
  size?: "sm" | "md";
}) {
  const price = lowestPrice(group);
  const first = group.variants[0];
  return (
    <Link
      href={`/product/${first.slug || first.id}`}
      onClick={onNavigate}
      className={`vial-tile vial-tile--${size}`}
      style={{ "--tile-range": rangeColourForCategory(group.category) } as React.CSSProperties}
    >
      <span className="vial-tile__media" style={{ background: STUDIO_BG }}>
        {/* Tiles only mount while a menu is open, so load at once. */}
        <img src={group.image || group.cardImage} alt="" decoding="async" />
      </span>
      <span className="vial-tile__name">{group.baseName}</span>
      {price != null && (
        <span className="vial-tile__price">
          {group.variants.length > 1 ? "From " : ""}{formatPrice(price)}
        </span>
      )}
    </Link>
  );
}

/**
 * Desktop "All Peptides" mega menu: product ranges on the left, the chosen
 * range's vials as image tiles in the middle, and the bundle offer on the right.
 */
export default function PeptideMegaMenu({ groups, formatPrice, onNavigate, onMouseEnter, onMouseLeave }: {
  groups: GroupedProduct[];
  formatPrice: (n: number) => string;
  onNavigate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const ranges = useRanges(groups);
  const [active, setActive] = useState(POPULAR);
  const current = ranges.find((r) => r.name === active) ?? ranges[0];
  const shown = current?.groups.slice(0, 10) ?? [];

  return (
    <div className="mega" role="region" aria-label="Shop peptides" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega__inner">
        <nav className="mega__ranges" aria-label="Product ranges">
          <p className="mega__label">Shop by range</p>
          <ul>
            {ranges.map((r) => (
              <li key={r.name}>
                <Link
                  href={r.name === POPULAR ? "/popular-peptides" : `/all-peptides?category=${encodeURIComponent(r.name)}`}
                  onClick={onNavigate}
                  onMouseEnter={() => setActive(r.name)}
                  onFocus={() => setActive(r.name)}
                  className="mega__range"
                  data-active={r.name === current?.name}
                >
                  <span className="mega__dot" style={{ background: r.colour }} />
                  <span className="mega__range-name">{r.name}</span>
                  <span className="mega__count">{r.groups.length}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/all-peptides" onClick={onNavigate} className="mega__all">
            All peptides <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </nav>

        <div className="mega__products">
          <div className="mega__products-head">
            <p className="mega__title">
              <span className="mega__dot" style={{ background: current?.colour }} />
              {current?.name}
            </p>
            <Link
              href={current?.name === POPULAR ? "/popular-peptides" : `/all-peptides?category=${encodeURIComponent(current?.name ?? "")}`}
              onClick={onNavigate}
              className="mega__view"
            >
              View all {current?.groups.length} <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="mega__grid">
            {shown.map((g) => <VialTile key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} />)}
          </div>
        </div>

        <Link href="/bundle-and-save" onClick={onNavigate} className="mega__promo">
          <span className="mega__promo-stripe" />
          <span className="mega__promo-body">
            <Gift size={18} aria-hidden="true" />
            <span className="mega__promo-eyebrow">Bundle &amp; save</span>
            <span className="mega__promo-title">Build your own bundle.</span>
            <span className="mega__promo-text">Free 10ml BAC water with 3+ vials. 1 peptide free at 5, 2 free at 10.</span>
            <span className="mega__promo-cta">Start building <ArrowRight size={14} aria-hidden="true" /></span>
          </span>
        </Link>
      </div>
    </div>
  );
}

/** Phone and tablet drawer: popular vials as a swipe row, then range chips. */
export function DrawerShop({ groups, formatPrice, onNavigate }: {
  groups: GroupedProduct[];
  formatPrice: (n: number) => string;
  onNavigate: () => void;
}) {
  const ranges = useRanges(groups);
  const popular = ranges[0]?.groups.slice(0, 10) ?? [];
  return (
    <div className="drawer-shop">
      <div className="drawer-shop__head">
        <p className="mega__label">Popular peptides</p>
        <Link href="/all-peptides" onClick={onNavigate} className="mega__view">
          View all <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <div className="drawer-shop__row">
        {popular.map((g) => <VialTile key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} size="sm" />)}
      </div>
      <p className="mega__label drawer-shop__label">Shop by range</p>
      <ul className="drawer-shop__ranges">
        {ranges.slice(1).map((r) => (
          <li key={r.name}>
            <Link href={`/all-peptides?category=${encodeURIComponent(r.name)}`} onClick={onNavigate} className="drawer-shop__range">
              <span className="mega__dot" style={{ background: r.colour }} />
              <span className="drawer-shop__range-name">{r.name}</span>
              <span className="mega__count">{r.groups.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
