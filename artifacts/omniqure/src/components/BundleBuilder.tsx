import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ChevronDown, Gift, Minus, Plus, Search, ShoppingCart, Sparkles } from "lucide-react";
import type { Product } from "@/data/products";
import { BUNDLE_FREE_BAC_THRESHOLD, BUNDLE_FREE_ONE_THRESHOLD, BUNDLE_FREE_TWO_THRESHOLD } from "@/context/CartContext";
import { getCatalogueVialImage } from "@/lib/catalogueImages";
import { STUDIO_BG } from "@/lib/studioImage";

export const VOLUME_TIERS = [
  { min: BUNDLE_FREE_BAC_THRESHOLD, short: "3+", reward: "Free BAC water" },
  { min: BUNDLE_FREE_ONE_THRESHOLD, short: "5+", reward: "1 free peptide" },
  { min: BUNDLE_FREE_TWO_THRESHOLD, short: "10+", reward: "2 free peptides" },
] as const;

/** Cart actions shared by every pick list on the product page. */
export type PickActions = {
  cartQty: (productId: string) => number;
  freeUnits: Record<string, number>;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  formatPrice: (n: number) => string;
};

type Tone = "light" | "dark";

/* Three segments, one per tier, each filling from the previous threshold to
   its own — so the bar always shows progress toward the next reward. */
export function TierProgress({ peptideQty, tone }: { peptideQty: number; tone: Tone }) {
  const nextTier = VOLUME_TIERS.find((t) => peptideQty < t.min);
  const toNext = nextTier ? nextTier.min - peptideQty : 0;
  const freeCount = peptideQty >= BUNDLE_FREE_TWO_THRESHOLD ? 2 : peptideQty >= BUNDLE_FREE_ONE_THRESHOLD ? 1 : 0;

  return (
    <div className={`tier-progress tier-progress--${tone}`}>
      <p className="tier-progress__msg">
        {nextTier ? (
          <>
            Add <strong>{toNext} more vial{toNext > 1 ? "s" : ""}</strong> to unlock <strong>{nextTier.reward.toLowerCase()}</strong>.
          </>
        ) : (
          <span className="tier-progress__done">
            <Sparkles size={12} className="inline" /> Top tier unlocked — {freeCount} peptides free with this order.
          </span>
        )}
      </p>
      <ol className="tier-progress__tiers">
        {VOLUME_TIERS.map((tier, i) => {
          const from = i === 0 ? 0 : VOLUME_TIERS[i - 1].min;
          const pct = Math.max(0, Math.min(100, ((peptideQty - from) / (tier.min - from)) * 100));
          const on = peptideQty >= tier.min;
          return (
            <li key={tier.min} data-on={on}>
              <span className="tier-progress__bar"><span style={{ width: `${pct}%` }} /></span>
              <span className="tier-progress__label">{tier.short} vials</span>
              <span className="tier-progress__reward">{tier.reward}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PickRow({ product, tone, thumb, actions }: { product: Product; tone: Tone; thumb: boolean; actions: PickActions }) {
  const { cartQty, freeUnits, onAdd, onRemove, formatPrice } = actions;
  const qty = cartQty(product.id);
  const free = freeUnits[product.id] ?? 0;
  return (
    <li className={`pick-row pick-row--${tone}`} data-in-cart={qty > 0}>
      {thumb && (
        <span className="pick-row__thumb" style={{ background: STUDIO_BG }}>
          <img
            src={getCatalogueVialImage(product.id, product.slug, product.image, product.sourceImage)}
            alt=""
            loading="lazy"
            width={44}
            height={44}
          />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <Link href={`/product/${product.slug || product.id}`} className="pick-row__name">{product.name}</Link>
        <span className="pick-row__price">
          {free > 0 && <span className="pick-row__free">Free</span>}
          <span style={{ textDecoration: free > 0 ? "line-through" : undefined }}>
            {product.price != null ? formatPrice(product.price) : ""}
          </span>
        </span>
      </span>
      {qty === 0 ? (
        <button type="button" onClick={() => onAdd(product)} aria-label={`Add ${product.name}`} className="pick-row__add">
          <Plus size={13} strokeWidth={2.5} /> Add
        </button>
      ) : (
        <span className="pick-row__stepper">
          <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove one ${product.name}`}>
            <Minus size={12} />
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => onAdd(product)} aria-label={`Add another ${product.name}`}>
            <Plus size={12} />
          </button>
        </span>
      )}
    </li>
  );
}

function matches(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  return !q || product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q);
}

function SearchField({ value, onChange, tone, label }: { value: string; onChange: (v: string) => void; tone: Tone; label: string }) {
  return (
    <label className={`pick-search pick-search--${tone}`}>
      <Search size={14} aria-hidden="true" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} aria-label={label} />
    </label>
  );
}

/** Compact promotion card in the buy box: tier progress, with every product in a
    scroll list that stays collapsed until the shopper asks for it. */
export function BundleAndSave({ peptideQty, products, actions }: { peptideQty: number; products: Product[]; actions: PickActions }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const shown = products.filter((p) => matches(p, query));
  return (
    <div className="bundle-card">
      <div className="bundle-card__head">
        <p className="bundle-card__title"><Gift size={14} className="accent-ink" /> Bundle &amp; save</p>
        <span className="bundle-card__count">{peptideQty} vial{peptideQty === 1 ? "" : "s"} in cart</span>
      </div>
      <TierProgress peptideQty={peptideQty} tone="light" />
      <button type="button" className="bundle-card__toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Hide products" : `Add products to your bundle (${products.length})`}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="bundle-card__list">
          <SearchField value={query} onChange={setQuery} tone="light" label={`Search ${products.length} products`} />
          <ul className="pick-scroll pick-scroll--compact">
            {shown.map((p) => <PickRow key={p.id} product={p} tone="light" thumb={false} actions={actions} />)}
            {shown.length === 0 && <li className="pick-empty">No products match “{query}”.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Navy kit-builder section: category filter and a scrollable grid of products to add. */
export function KitBuilder({ peptideQty, products, actions }: { peptideQty: number; products: Product[]; actions: PickActions }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()];
  const shown = products
    .filter((p) => (category === "All" || p.category === category) && matches(p, query))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="kit-builder">
      <div className="kit-builder__intro">
        <p className="product-eyebrow product-eyebrow--dark">Bundle &amp; save</p>
        <h2 className="kit-builder__title">Build your own kit.</h2>
        <p className="kit-builder__lead">
          Pick any combination of peptides. Free items apply automatically at checkout once your kit reaches each tier.
        </p>
        <TierProgress peptideQty={peptideQty} tone="dark" />
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/cart" className="kit-builder__cta">
            <ShoppingCart size={14} aria-hidden="true" /> Review kit · {peptideQty} vial{peptideQty === 1 ? "" : "s"}
          </Link>
          <Link href="/bundle-and-save" className="kit-builder__link">
            How bundles work <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="kit-builder__panel">
        <div className="kit-builder__filters" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={c === category} onClick={() => setCategory(c)} className="kit-chip">
              {c}
            </button>
          ))}
        </div>
        <SearchField value={query} onChange={setQuery} tone="dark" label="Search peptides" />
        <ul className="pick-scroll pick-scroll--grid">
          {shown.map((p) => <PickRow key={p.id} product={p} tone="dark" thumb actions={actions} />)}
          {shown.length === 0 && <li className="pick-empty">No products match your filter.</li>}
        </ul>
      </div>
    </div>
  );
}
