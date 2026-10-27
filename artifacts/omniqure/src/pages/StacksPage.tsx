import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { ShoppingCart, CheckCircle2, ChevronDown, ChevronUp, FlaskConical, Clock, Zap, AlertTriangle, Users, BookOpen, Layers, HeartPulse, TrendingUp, Brain, Hourglass, Shield, Scale, Sparkles, type LucideIcon } from "lucide-react";

const STACK_ICONS: Record<string, LucideIcon> = { "🩹": HeartPulse, "📈": TrendingUp, "🧠": Brain, "⏳": Hourglass, "🛡️": Shield, "⚖️": Scale, "✨": Sparkles };
import PageHero from "@/components/PageHero";
import { researchStacks, type ResearchStack } from "@/data/stacks";
import { type Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { parseName } from "@/data/groupedProducts";

const DIFFICULTY_COLORS = {
  Beginner:     { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  Intermediate: { bg: "#E8F2DE", color: "#4E68C2", border: "#C8DDB4" },
  Advanced:     { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
};

type StackProductItem = {
  slug: string;
  role: string;
  suggestedDose: string;
  frequency: string;
  notes?: string;
  product: Product;
};

function StackProductRow({ sp, index }: { sp: StackProductItem; index: number }) {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);

  const { baseName } = parseName(sp.product.name);
  const allVariants = products
    .filter(p => parseName(p.name).baseName === baseName && !/\(Vial [B-Z]\)/i.test(p.name))
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  const defaultIdx = Math.max(0, allVariants.findIndex(v => v.id === sp.product.id));
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx);
  const selected = allVariants[selectedIdx] ?? sp.product;

  const handleAdd = () => {
    addToCart(selected, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="rounded-xl"
      style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)", padding: "12px" }}
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <div
          className="rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ width: "60px", height: "60px", background: "#fff", border: "1px solid var(--hairline)" }}
        >
          <img
            src={selected.image}
            alt={selected.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div>
              <span className="text-xs font-semibold mr-2" style={{ color: "var(--graphite)", opacity: 0.6 }}>#{index + 1}</span>
              <Link
                href={`/product/${selected.id}`}
                className="font-semibold hover:underline"
                style={{ fontSize: "13px", color: "var(--ink)", textDecoration: "none", letterSpacing: "-0.01em" }}
              >
                {baseName}
              </Link>
            </div>
            {selected.price != null && (
              <span className="font-semibold flex-shrink-0" style={{ fontSize: "14px", color: "var(--ink)" }}>
                {formatPrice(selected.price)}
              </span>
            )}
          </div>

          <p className="text-xs font-medium mb-1" style={{ color: "var(--cobalt)" }}>{sp.role}</p>

          <div className="flex flex-wrap gap-3 mb-1">
            <span className="text-xs" style={{ color: "var(--graphite)" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Dose:</strong> {sp.suggestedDose}
            </span>
            <span className="text-xs" style={{ color: "var(--graphite)" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Freq:</strong> {sp.frequency}
            </span>
          </div>

          {sp.notes && (
            <p className="text-xs mb-1" style={{ color: "var(--graphite)", opacity: 0.8, lineHeight: 1.5 }}>{sp.notes}</p>
          )}

          <div className="flex items-center gap-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#ECFDF5", color: "#047857" }}
            >
              {selected.purity ?? "Purity not specified"}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#EEF3FC", color: "var(--cobalt)" }}
            >
              {selected.category}
            </span>
          </div>
        </div>
      </div>

      {/* Strength pills + Add to Cart */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {allVariants.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
            {allVariants.map((v, i) => {
              const { strength } = parseName(v.name);
              const active = i === selectedIdx;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    fontSize: "11px", fontWeight: 600,
                    padding: "3px 10px", borderRadius: "999px",
                    border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
                    backgroundColor: active ? "var(--ink)" : "#fff",
                    color: active ? "#fff" : "var(--graphite)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {strength}
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={handleAdd}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", fontWeight: 600,
            padding: "6px 14px", borderRadius: "999px",
            backgroundColor: added ? "#059669" : "var(--ink)",
            color: "#fff", border: "none", cursor: "pointer",
            transition: "background-color 0.2s", flexShrink: 0,
          }}
        >
          {added ? <><CheckCircle2 size={12} /> Added</> : <><ShoppingCart size={12} /> Add</>}
        </button>
      </div>
    </div>
  );
}

function StackCard({ stack }: { stack: ResearchStack }) {
  const { products } = useProducts();
  const [expanded, setExpanded] = useState(false);
  const [addedAll, setAddedAll] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const stackProducts = stack.products
    .map((sp) => ({ ...sp, product: products.find((p) => p.slug === sp.slug) }))
    .filter((sp) => sp.product != null) as Array<typeof stack.products[0] & { product: NonNullable<ReturnType<typeof products.find>> }>;

  const totalPrice = stackProducts.reduce((sum, sp) => sum + (sp.product.price ?? 0), 0);
  const diff = DIFFICULTY_COLORS[stack.difficulty];

  const handleAddAll = () => {
    stackProducts.forEach((sp) => addToCart(sp.product, 1));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2200);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: "1px solid rgba(11,18,32,0.09)", borderRadius: 16 }}
    >
      {/* Header band */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-4"
        style={{ background: "#F2F0EB", borderBottom: "1px solid var(--hairline)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {(() => {
            const StackIcon = STACK_ICONS[stack.icon] ?? FlaskConical;
            return (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "#FFF6F2", color: "var(--cobalt)" }} aria-hidden="true">
                <StackIcon size={18} />
              </span>
            );
          })()}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: stack.badgeColor + "14", color: stack.badgeColor, fontSize: "10px" }}
              >
                {stack.badge}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: diff.bg, color: diff.color, fontSize: "10px" }}
              >
                {stack.difficulty}
              </span>
            </div>
            <h3 className="leading-tight" style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink)" }}>
              {stack.name}
            </h3>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="uppercase" style={{ fontSize: "10px", letterSpacing: "0.12em", color: "var(--graphite)" }}>Stack total</p>
          <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{formatPrice(totalPrice)}</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        {/* Tagline */}
        <p className="font-semibold mb-2" style={{ fontSize: "13.5px", color: "var(--ink)" }}>
          {stack.tagline}
        </p>
        <p className="leading-relaxed mb-4" style={{ fontSize: "13px", color: "var(--graphite)", lineHeight: "1.75" }}>
          {stack.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--graphite)" }}>
            <Clock size={12} style={{ color: "var(--cobalt)" }} />
            Cycle: {stack.cycleLength}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--graphite)" }}>
            <FlaskConical size={12} style={{ color: "var(--cobalt)" }} />
            {stack.products.length} compounds
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--graphite)" }}>
            <Zap size={12} style={{ color: "var(--cobalt)" }} />
            {stack.difficulty} protocol
          </span>
        </div>

        {/* Research areas */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {stack.researchAreas.map((area) => (
            <span
              key={area}
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#EEF3FC", color: "var(--cobalt)" }}
            >
              {area}
            </span>
          ))}
        </div>

        {/* Product rows */}
        <div className="flex flex-col gap-3 mb-4">
          {stackProducts.map((sp, i) => (
            <StackProductRow key={sp.slug} sp={sp} index={i} />
          ))}
        </div>

        {/* Add All to Cart CTA */}
        <button
          onClick={handleAddAll}
          className="w-full flex items-center justify-center gap-2 font-semibold rounded-full transition-all mb-4"
          style={{
            height: "48px",
            background: addedAll ? "#059669" : "var(--ink)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background 0.25s",
          }}
        >
          {addedAll ? (
            <><CheckCircle2 size={17} /> All {stackProducts.length} compounds added!</>
          ) : (
            <><ShoppingCart size={17} /> Add Full Stack to Cart — {formatPrice(totalPrice)}</>
          )}
        </button>

        {/* Expandable detail */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between text-sm font-medium rounded-full px-5 py-3 transition-colors"
          style={{
            backgroundColor: expanded ? "#F2F0EB" : "#fff",
            border: "1px solid var(--hairline)",
            color: "var(--ink)",
            cursor: "pointer",
          }}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={14} />
            {expanded ? "Hide" : "View"} Research Rationale & Synergy
          </span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-4">
            {/* Rationale */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--cobalt)" }}>
                Research Rationale
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--graphite)", lineHeight: "1.75" }}>
                {stack.rationale}
              </p>
            </div>

            {/* Synergy */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--cobalt)" }}>
                Synergy Mechanism
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--graphite)", lineHeight: "1.75" }}>
                {stack.synergy}
              </p>
            </div>

            {/* Warnings */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
                <AlertTriangle size={12} style={{ color: "#D97706" }} /> Research Notices
              </p>
              <ul className="space-y-1">
                {stack.warnings.map((w, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--graphite)" }}>
                    <span style={{ flexShrink: 0 }}>•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StacksPage() {
  useSEO({
    title: "Research Stacks",
    description: "Curated research peptide stacks combining complementary compounds for specific research protocols. verified peptides from OmniQure.",
    canonicalPath: "/stacks",
  });
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = activeFilter === "All"
    ? researchStacks
    : researchStacks.filter((s) => s.difficulty === activeFilter);

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <PageHero image={{ key: "hdr-bundles", alt: "OmniQure build-your-own-bundle box with eight vials" }}
        crumbs={[{ label: "Research Stacks" }]}
        eyebrow="Research Protocols"
        icon={Layers}
        title={<>Research Stacks &amp; Protocol Guides</>}
        aside={
          <div className="flex gap-8">
            {[
              { val: researchStacks.length, label: "Curated protocols" },
              { val: researchStacks.filter((s) => s.difficulty === "Beginner").length, label: "Beginner" },
              { val: researchStacks.filter((s) => s.difficulty === "Advanced").length, label: "Advanced" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--ink)" }}>{item.val}</div>
                <div className="uppercase mt-1.5" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--graphite)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        }
      >
        <p style={{ margin: 0 }}>
          Curated multi-peptide research combinations with mechanistic rationale, suggested dosing parameters, and synergy explanations drawn from preclinical literature.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
          {[
            { icon: <FlaskConical size={13} />, label: `${researchStacks.length} curated protocols` },
            { icon: <BookOpen size={13} />, label: "Research-backed rationale" },
            { icon: <Users size={13} />, label: "Add full stack to cart" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5" style={{ fontSize: 13, color: "var(--graphite)" }}>
              <span style={{ color: "var(--cobalt)" }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </PageHero>

      {/* RUO notice */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 pt-8">
        <div
          className="flex items-start gap-2.5 px-4 py-3"
          style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: 12 }}
        >
          <AlertTriangle size={14} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <p className="text-xs leading-relaxed" style={{ color: "var(--graphite)", margin: 0 }}>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Research Chemical Only:</strong> All compounds listed are for in-vitro laboratory research only. Dosing figures are drawn from published preclinical literature and are not recommendations for human use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-8 md:py-10">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-sm font-medium mr-1" style={{ color: "var(--graphite)" }}>Filter by level:</span>
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={active}
                className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: active ? "var(--ink)" : "#fff",
                  color: active ? "#fff" : "var(--graphite)",
                  border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
                  cursor: "pointer",
                }}
              >
                {f}
                {f !== "All" && (
                  <span className="ml-1.5 text-xs" style={{ opacity: 0.7 }}>
                    ({researchStacks.filter((s) => s.difficulty === f).length})
                  </span>
                )}
              </button>
            );
          })}
          <span className="ml-auto text-sm" style={{ color: "var(--graphite)" }}>
            {filtered.length} protocol{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Stack grid */}
        <div className="grid gap-6 md:gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))" }}>
          {filtered.map((stack) => (
            <StackCard key={stack.id} stack={stack} />
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div
          className="p-5 mt-10 flex items-start gap-3"
          style={{ backgroundColor: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: 16 }}
        >
          <AlertTriangle size={15} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <div>
            <p className="text-xs mb-1.5 uppercase tracking-wide" style={{ color: "var(--ink)", fontWeight: 600 }}>
              Research Use Only — Important Notice
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--graphite)", margin: 0 }}>
              All protocol guides and dosing parameters on this page are compiled from published preclinical research literature for educational and informational purposes only. They do not constitute medical advice, clinical recommendations, or protocols for human use. All compounds are intended strictly for in-vitro laboratory research by qualified researchers. OmniQure products have not been approved by the FDA or any regulatory authority for human use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
