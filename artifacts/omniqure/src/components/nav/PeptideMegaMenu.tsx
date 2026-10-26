import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { parseName, type GroupedProduct } from "@/data/groupedProducts";
import { popularProductSlugs } from "@/data/popularPeptides";
import { rangeColourForCategory } from "@/lib/rangeColour";
import { STUDIO_BG } from "@/lib/studioImage";

/*
 * Navigation parts in the register of the vial label and specification sheet:
 * white surfaces, hairline rules, square corners, IBM Plex Mono only for data
 * (strengths, prices, tiers). Matte Navy as a thin top rule; range colours as
 * fine markers.
 */

type Range = { name: string; colour: string; groups: GroupedProduct[] };

const POPULAR = "Most ordered";

export const BUNDLE_TIERS = [
  { qty: "3+ vials", reward: "Free 10ml BAC water" },
  { qty: "5+ vials", reward: "1 peptide free" },
  { qty: "10+ vials", reward: "2 peptides free" },
];

function lowestPrice(group: GroupedProduct): number | null {
  const prices = group.variants.map((v) => v.price).filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : null;
}

function strengths(group: GroupedProduct): string {
  const list = [...new Set(group.variants.map((v) => parseName(v.name).strength).filter(Boolean))];
  return list.slice(0, 4).join(" · ");
}

/** Ranges ordered by size, led by the curated "most ordered" list. */
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
    return [{ name: POPULAR, colour: "var(--oq-matte-navy)", groups: popular }, ...ranges];
  }, [groups]);
}

/** One product as a data row: vial thumbnail, name, strengths, price. */
function ProductRow({ group, formatPrice, onNavigate, quickAdd = false }: {
  group: GroupedProduct;
  formatPrice: (n: number) => string;
  onNavigate: () => void;
  quickAdd?: boolean;
}) {
  const price = lowestPrice(group);
  const first = group.variants[0];
  const link = (
    <Link
      href={`/product/${first.slug || first.id}`}
      onClick={onNavigate}
      className="prow"
      style={{ "--row-range": rangeColourForCategory(group.category) } as React.CSSProperties}
    >
      <span className="prow__thumb" style={{ background: STUDIO_BG }}>
        {/* Rows only mount while a menu is open, so load at once. */}
        <img src={group.image || group.cardImage} alt="" decoding="async" />
      </span>
      {/* Name on its own line so it isn't clipped; strengths and price beneath */}
      <span className="prow__text">
        <span className="prow__name">{group.baseName}</span>
        <span className="prow__line">
          <span className="prow__meta">{strengths(group) || group.category}</span>
          {price != null && (
            <span className="prow__price">{group.variants.length > 1 ? "from " : ""}{formatPrice(price)}</span>
          )}
        </span>
      </span>
    </Link>
  );
  if (!quickAdd) return link;
  return (
    <div className="prow-wrap">
      {link}
      <QuickAdd group={group} />
    </div>
  );
}

/** Adds the lowest-priced strength to the cart; ticks briefly on success. */
function QuickAdd({ group }: { group: GroupedProduct }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const variant = group.variants[0];
  const soldOut = !variant || variant.stockLevel === 0;
  return (
    <button
      type="button"
      className="qadd"
      data-added={added}
      disabled={soldOut}
      aria-label={soldOut ? `${group.baseName} is sold out` : `Add ${variant.name} to cart`}
      onClick={() => {
        addToCart(variant, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      {added ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
    </button>
  );
}

/** Bundle tiers as a specification table. */
export function BundleSpec({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="bspec">
      <p className="nav-label">Bundle &amp; save</p>
      <dl className="bspec__table">
        {BUNDLE_TIERS.map((t) => (
          <div key={t.qty} className="bspec__row">
            <dt>{t.qty}</dt>
            <dd>{t.reward}</dd>
          </div>
        ))}
      </dl>
      <p className="bspec__note">Applied automatically at checkout. Mix any compounds.</p>
      <Link href="/bundle-and-save" onClick={onNavigate} className="nav-link">
        Build a bundle <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Title-and-description link list, separated by hairlines. */
export function IndexList({ items, onNavigate, location, columns = 1 }: {
  items: { label: string; href: string; desc: string }[];
  onNavigate: () => void;
  location: string;
  columns?: 1 | 2;
}) {
  return (
    <ol className={`ilist${columns === 2 ? " ilist--2" : ""}`}>
      {items.map((item) => {
        const active = location === item.href || location.startsWith(item.href + "/");
        return (
          <li key={item.href}>
            <Link href={item.href} onClick={onNavigate} className="ilist__row" data-active={active} aria-current={active ? "page" : undefined}>
              <span className="ilist__text">
                <span className="ilist__title">{item.label}</span>
                <span className="ilist__desc">{item.desc}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Desktop "All Peptides" mega menu: an index of ranges, the chosen range's
 * products as data rows, and the bundle tiers as a specification table.
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
  const shown = current?.groups.slice(0, 8) ?? [];
  const rangeHref = (name: string) => name === POPULAR ? "/popular-peptides" : `/all-peptides?category=${encodeURIComponent(name)}`;

  return (
    <div className="mega" role="region" aria-label="Shop peptides" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega__inner">
        <nav className="mega__ranges" aria-label="Product ranges">
          <p className="nav-label">Ranges</p>
          <ol>
            {ranges.slice(0, 9).map((r) => (
              <li key={r.name}>
                <Link
                  href={rangeHref(r.name)}
                  onClick={onNavigate}
                  onMouseEnter={() => setActive(r.name)}
                  onFocus={() => setActive(r.name)}
                  className="mrange"
                  data-active={r.name === current?.name}
                  style={{ "--row-range": r.colour } as React.CSSProperties}
                >
                  <span className="mrange__name">{r.name}</span>
                  <span className="mrange__count">{r.groups.length}</span>
                </Link>
              </li>
            ))}
          </ol>
          {ranges.length > 9 && (
            <Link href="/all-peptides" onClick={onNavigate} className="nav-link mega__more">
              All {ranges.length - 1} ranges <ArrowRight size={13} aria-hidden="true" />
            </Link>
          )}
        </nav>

        <div className="mega__products">
          <div className="mega__head">
            <p className="nav-label">
              <span className="mega__marker" style={{ background: current?.colour }} />
              {current?.name}
            </p>
            <Link href={rangeHref(current?.name ?? "")} onClick={onNavigate} className="nav-link">
              View range <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="mega__grid">
            {shown.map((g) => <ProductRow key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} />)}
          </div>
          <div className="mega__foot">
            <Link href="/all-peptides" onClick={onNavigate} className="nav-link">
              Full catalogue <ArrowRight size={13} aria-hidden="true" />
            </Link>
            <Link href="/lab-reports" onClick={onNavigate} className="nav-link nav-link--quiet">
              Independent lab reports for every batch
            </Link>
          </div>
        </div>

        <aside className="mega__aside">
          <BundleSpec onNavigate={onNavigate} />
        </aside>
      </div>
    </div>
  );
}

/** Phone menu first screen: the most-ordered peptides as rows. */
export function DrawerPopular({ groups, formatPrice, onNavigate }: {
  groups: GroupedProduct[];
  formatPrice: (n: number) => string;
  onNavigate: () => void;
}) {
  const ranges = useRanges(groups);
  const popular = ranges[0]?.groups.slice(0, 5) ?? [];
  return (
    <div className="dpop">
      <div className="dpop__head">
        <p className="nav-label">Popular peptides</p>
        <Link href="/all-peptides" onClick={onNavigate} className="nav-link">
          All {groups.length} <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      {popular.map((g) => <ProductRow key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} quickAdd />)}
    </div>
  );
}

/** Phone and tablet "Shop peptides" panel: catalogue link, four most-ordered
    products, then the ranges. */
export function DrawerShop({ groups, formatPrice, onNavigate }: {
  groups: GroupedProduct[];
  formatPrice: (n: number) => string;
  onNavigate: () => void;
}) {
  const ranges = useRanges(groups);
  const popular = ranges[0]?.groups.slice(0, 4) ?? [];
  return (
    <div className="dshop">
      <Link href="/all-peptides" onClick={onNavigate} className="mnav-row mnav-row--lead">
        <span>
          <span className="mnav-row__title">All peptides</span>
          <span className="mnav-row__desc">{groups.length} compounds, independently tested</span>
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <p className="nav-label dshop__label">Most ordered</p>
      <div className="dshop__rows">
        {popular.map((g) => <ProductRow key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} />)}
      </div>

      <p className="nav-label dshop__label">By range</p>
      <ul className="dshop__ranges">
        {ranges.slice(1).map((r) => (
          <li key={r.name}>
            <Link
              href={`/all-peptides?category=${encodeURIComponent(r.name)}`}
              onClick={onNavigate}
              className="mrange"
              style={{ "--row-range": r.colour } as React.CSSProperties}
            >
              <span className="mrange__name">{r.name}</span>
              <span className="mrange__count">{r.groups.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
