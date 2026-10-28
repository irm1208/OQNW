import { useState } from "react";
import { Link } from "wouter";
import { Check, ShoppingCart } from "lucide-react";
import { parseName, type GroupedProduct } from "@/data/groupedProducts";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { studioFallback, STUDIO_BG } from "@/lib/studioImage";
import { rangeColourForCategory } from "@/lib/rangeColour";

/*
 * Catalogue tile: vial image and name link to the product; strength, price
 * and Add to cart work from the grid. Controls sit outside the links so
 * each one is its own focus stop.
 */
export default function CatalogueCard({ group }: { group: GroupedProduct }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [variantId, setVariantId] = useState(
    () => (group.variants.find(v => (v.stockLevel ?? 1) > 0) ?? group.variants[0]).id,
  );
  const [added, setAdded] = useState(false);

  const variant = group.variants.find(v => v.id === variantId) ?? group.variants[0];
  const href = `/product/${variant.slug || variant.id}`;
  const soldOut = variant.stockLevel === 0;
  const lowStock = variant.stockLevel != null && variant.stockLevel > 0 && variant.stockLevel <= 10;
  const purity = variant.purity ?? group.variants.find(v => v.purity)?.purity;
  const strengthOf = (name: string) => parseName(name).strength;

  const add = () => {
    if (soldOut) return;
    addToCart(variant, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="ccard" style={{ "--range": rangeColourForCategory(group.category) } as React.CSSProperties}>
      <Link href={href} className="ccard__media" style={{ background: STUDIO_BG }} tabIndex={-1} aria-hidden="true">
        <img
          src={group.image}
          onError={studioFallback(group.cardImage || group.image)}
          alt=""
          loading="lazy"
          width={1254}
          height={1254}
        />
        {soldOut ? (
          <span className="ccard__badge">Sold out</span>
        ) : lowStock ? (
          <span className="ccard__badge ccard__badge--low">{variant.stockLevel} left</span>
        ) : null}
      </Link>

      <div className="ccard__body">
        <Link href={href} className="ccard__name">{group.baseName}</Link>
        <p className="ccard__meta">
          <span className="ccard__range" aria-hidden="true" />
          <span className="truncate">{group.category}</span>
        </p>
        {purity && <p className="ccard__purity">{purity} HPLC purity</p>}

        <div className="ccard__buy">
          {group.variants.length > 1 ? (
            <select
              className="ccard__strength"
              value={variantId}
              onChange={e => setVariantId(e.target.value)}
              aria-label={`${group.baseName} strength`}
            >
              {group.variants.map(v => (
                <option key={v.id} value={v.id} disabled={v.stockLevel === 0}>
                  {strengthOf(v.name) || v.name}{v.stockLevel === 0 ? " (sold out)" : ""}
                </option>
              ))}
            </select>
          ) : (
            <span className="ccard__strength ccard__strength--fixed">{strengthOf(variant.name) || "Single vial"}</span>
          )}

          <span className="ccard__price">{variant.price != null ? formatPrice(variant.price) : "See options"}</span>

          <button
            type="button"
            className="ccard__add"
            data-added={added}
            disabled={soldOut}
            onClick={add}
            aria-label={soldOut ? `${variant.name} is sold out` : `Add ${variant.name} to cart`}
          >
            {soldOut ? "Sold out" : added ? <><Check size={15} strokeWidth={2.5} aria-hidden="true" /> Added</> : <><ShoppingCart size={15} aria-hidden="true" /> Add to cart</>}
          </button>
        </div>
      </div>
    </article>
  );
}
