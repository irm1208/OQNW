import { Link } from "wouter";
import type { GroupedProduct } from "@/data/groupedProducts";
import { useCurrency } from "@/context/CurrencyContext";
import { studioFallback, STUDIO_BG } from "@/lib/studioImage";

/* Flat catalogue tile: 4:5 image, name, category, purity, "From" price. */
export default function CatalogueCard({ group }: { group: GroupedProduct }) {
  const { formatPrice } = useCurrency();
  const first = group.variants[0];
  const prices = group.variants.map(v => v.price).filter((p): p is number => p != null);
  const fromPrice = prices.length ? Math.min(...prices) : null;
  const soldOut = group.variants.every(v => v.stockLevel === 0);
  const purity = group.variants.find(v => v.purity)?.purity;

  return (
    <Link
      href={`/product/${first.slug || first.id}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border bg-white hover:shadow-md transition-shadow"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: STUDIO_BG }}>
        <img
          src={group.image}
          onError={studioFallback(group.cardImage || group.image)}
          alt={`${group.baseName} research peptide vial`}
          loading="lazy"
          width={1254}
          height={1254}
          className="h-full w-full object-cover scale-[1.08] sm:scale-100 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--graphite)" }}>
            Sold out
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="font-semibold text-[13px] sm:text-[16px] leading-snug" style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}>
          {group.baseName}
        </p>
        <p className="mt-0.5 text-[11px] sm:text-[12px] truncate" style={{ color: "var(--graphite)" }}>
          {group.category}
        </p>
        <p className="mt-1.5 min-h-[15px] text-[10.5px] font-semibold" style={{ color: "var(--cobalt)" }}>
          {purity ? `${purity} HPLC purity` : " "}
        </p>
        <div className="mt-2.5 flex items-end justify-between gap-1.5">
          {fromPrice != null ? (
            <div className="leading-none">
              <span className="mb-1 block text-[8.5px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--graphite)" }}>From</span>
              <span className="font-bold text-[15px] sm:text-[17px] tabular-nums" style={{ color: "var(--ink)" }}>{formatPrice(fromPrice)}</span>
            </div>
          ) : (
            <span className="text-[12px] font-medium" style={{ color: "var(--graphite)" }}>See options</span>
          )}
          <span className="shrink-0 text-[11px] sm:text-[11.5px] font-medium transition-colors text-[var(--graphite)] group-hover:text-[var(--cobalt)]">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
