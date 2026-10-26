import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { parseName, type GroupedProduct } from "@/data/groupedProducts";
import { popularProductSlugs } from "@/data/popularPeptides";
import { rangeColourForCategory } from "@/lib/rangeColour";
import { STUDIO_BG } from "@/lib/studioImage";

/*
 * Navigation parts in a clinical register: the look of the vial label and the
 * specification sheet. Hairline rules, square corners, numbered index rows in
 * IBM Plex Mono, Matte Navy only as a thin top rule, and range colours only as
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

const idx = (i: number) => String(i + 1).padStart(2, "0");

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
function ProductRow({ group, formatPrice, onNavigate }: {
  group: GroupedProduct;
  formatPrice: (n: number) => string;
  onNavigate: () => void;
}) {
  const price = lowestPrice(group);
  const first = group.variants[0];
  return (
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
      <span className="prow__text">
        <span className="prow__name">{group.baseName}</span>
        <span className="prow__meta">{strengths(group) || group.category}</span>
      </span>
      {price != null && (
        <span className="prow__price">
          {group.variants.length > 1 && <span className="prow__from">from</span>}
          {formatPrice(price)}
        </span>
      )}
    </Link>
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

/** Numbered index list: 01 Title / description, separated by hairlines. */
export function IndexList({ items, onNavigate, location, columns = 1 }: {
  items: { label: string; href: string; desc: string }[];
  onNavigate: () => void;
  location: string;
  columns?: 1 | 2;
}) {
  return (
    <ol className={`ilist${columns === 2 ? " ilist--2" : ""}`}>
      {items.map((item, i) => {
        const active = location === item.href || location.startsWith(item.href + "/");
        return (
          <li key={item.href}>
            <Link href={item.href} onClick={onNavigate} className="ilist__row" data-active={active} aria-current={active ? "page" : undefined}>
              <span className="ilist__idx">{idx(i)}</span>
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
  const shown = current?.groups.slice(0, 12) ?? [];
  const rangeHref = (name: string) => name === POPULAR ? "/popular-peptides" : `/all-peptides?category=${encodeURIComponent(name)}`;

  return (
    <div className="mega" role="region" aria-label="Shop peptides" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="mega__inner">
        <nav className="mega__ranges" aria-label="Product ranges">
          <p className="nav-label">Ranges</p>
          <ol>
            {ranges.map((r, i) => (
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
                  <span className="mrange__idx">{idx(i)}</span>
                  <span className="mrange__name">{r.name}</span>
                  <span className="mrange__count">{r.groups.length}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mega__products">
          <div className="mega__head">
            <p className="nav-label">
              <span className="mega__marker" style={{ background: current?.colour }} />
              {current?.name} · {current?.groups.length} compounds
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

/** Phone and tablet drawer: most-ordered products as rows, then the range index. */
export function DrawerShop({ groups, formatPrice, onNavigate }: {
  groups: GroupedProduct[];
  formatPrice: (n: number) => string;
  onNavigate: () => void;
}) {
  const ranges = useRanges(groups);
  const popular = ranges[0]?.groups.slice(0, 5) ?? [];
  return (
    <div className="dshop">
      <div className="dshop__head">
        <p className="nav-label">Most ordered</p>
        <Link href="/all-peptides" onClick={onNavigate} className="nav-link">
          Full catalogue <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <div className="dshop__rows">
        {popular.map((g) => <ProductRow key={g.baseName} group={g} formatPrice={formatPrice} onNavigate={onNavigate} />)}
      </div>
      <p className="nav-label dshop__label">Ranges</p>
      <ol className="dshop__ranges">
        {ranges.slice(1).map((r, i) => (
          <li key={r.name}>
            <Link
              href={`/all-peptides?category=${encodeURIComponent(r.name)}`}
              onClick={onNavigate}
              className="mrange"
              style={{ "--row-range": r.colour } as React.CSSProperties}
            >
              <span className="mrange__idx">{idx(i)}</span>
              <span className="mrange__name">{r.name}</span>
              <span className="mrange__count">{r.groups.length}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
