import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, CheckCircle2, ChevronDown, ChevronUp, FlaskConical, Clock, Zap, AlertTriangle, Users, BookOpen } from "lucide-react";
import { researchStacks, type ResearchStack } from "@/data/stacks";
import { type Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getPurityStr } from "@/utils/productPurity";
import { parseName } from "@/data/groupedProducts";

const DIFFICULTY_COLORS = {
  Beginner:     { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  Intermediate: { bg: "#EEF4FF", color: "#1B5CB5", border: "#BFDBFE" },
  Advanced:     { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
};

type StackProductItem = {
  productId: string;
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
      style={{ backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5", padding: "12px" }}
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <div
          className="rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ width: "60px", height: "60px", background: "linear-gradient(145deg, #EBF2FF, #F4F8FF)" }}
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
              <span className="text-xs font-bold mr-2" style={{ color: "#94A3B8" }}>#{index + 1}</span>
              <Link
                href={`/product/${selected.id}`}
                className="font-bold hover:underline"
                style={{ fontSize: "13px", color: "#0F172A", textDecoration: "none" }}
              >
                {baseName}
              </Link>
            </div>
            {selected.price != null && (
              <span className="font-bold flex-shrink-0" style={{ fontSize: "14px", color: "#1240A0" }}>
                {formatPrice(selected.price)}
              </span>
            )}
          </div>

          <p className="text-xs font-semibold mb-1" style={{ color: "#1B5CB5" }}>{sp.role}</p>

          <div className="flex flex-wrap gap-3 mb-1">
            <span className="text-xs" style={{ color: "#64748B" }}>
              <strong style={{ color: "#475569" }}>Dose:</strong> {sp.suggestedDose}
            </span>
            <span className="text-xs" style={{ color: "#64748B" }}>
              <strong style={{ color: "#475569" }}>Freq:</strong> {sp.frequency}
            </span>
          </div>

          {sp.notes && (
            <p className="text-xs mb-1" style={{ color: "#94A3B8", lineHeight: 1.5 }}>{sp.notes}</p>
          )}

          <div className="flex items-center gap-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
            >
              {getPurityStr(selected.id)} HPLC
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE" }}
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
                    fontSize: "11px", fontWeight: 700,
                    padding: "3px 9px", borderRadius: "6px",
                    border: `1.5px solid ${active ? "#1240A0" : "#E2E8F0"}`,
                    backgroundColor: active ? "#1240A0" : "#F8FAFC",
                    color: active ? "#fff" : "#64748B",
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
            fontSize: "12px", fontWeight: 700,
            padding: "5px 12px", borderRadius: "8px",
            backgroundColor: added ? "#059669" : "#1240A0",
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
    .map((sp) => ({ ...sp, product: products.find((p) => p.id === sp.productId) }))
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
      style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}
    >
      {/* Header band */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-4"
        style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ fontSize: "26px", flexShrink: 0 }}>{stack.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: stack.badgeColor, color: "#fff", fontSize: "10px" }}
              >
                {stack.badge}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, fontSize: "10px" }}
              >
                {stack.difficulty}
              </span>
            </div>
            <h3 className="font-bold text-white leading-tight" style={{ fontSize: "17px" }}>
              {stack.name}
            </h3>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>Stack total</p>
          <p className="font-bold text-white" style={{ fontSize: "18px" }}>{formatPrice(totalPrice)}</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        {/* Tagline */}
        <p className="font-semibold mb-2" style={{ fontSize: "13.5px", color: "#1240A0" }}>
          {stack.tagline}
        </p>
        <p className="leading-relaxed mb-4" style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75" }}>
          {stack.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <Clock size={12} style={{ color: "#1B5CB5" }} />
            Cycle: {stack.cycleLength}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <FlaskConical size={12} style={{ color: "#1B5CB5" }} />
            {stack.products.length} compounds
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <Zap size={12} style={{ color: "#1B5CB5" }} />
            {stack.difficulty} protocol
          </span>
        </div>

        {/* Research areas */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {stack.researchAreas.map((area) => (
            <span
              key={area}
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE" }}
            >
              {area}
            </span>
          ))}
        </div>

        {/* Product rows */}
        <div className="flex flex-col gap-3 mb-4">
          {stackProducts.map((sp, i) => (
            <StackProductRow key={sp.productId} sp={sp} index={i} />
          ))}
        </div>

        {/* Add All to Cart CTA */}
        <button
          onClick={handleAddAll}
          className="w-full flex items-center justify-center gap-2 font-bold rounded-xl transition-all mb-4"
          style={{
            height: "48px",
            background: addedAll
              ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
              : "linear-gradient(135deg, #1B5CB5 0%, #1240A0 100%)",
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
          className="w-full flex items-center justify-between text-sm font-semibold rounded-xl px-4 py-3 transition-colors"
          style={{
            backgroundColor: expanded ? "#EEF4FF" : "#F8FAFC",
            border: "1px solid #E8EDF5",
            color: "#1B5CB5",
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
              style={{ backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1B5CB5" }}>
                Research Rationale
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#374151", lineHeight: "1.75" }}>
                {stack.rationale}
              </p>
            </div>

            {/* Synergy */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "#F0F5FF", border: "1px solid #BFDBFE" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1240A0" }}>
                Synergy Mechanism
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#1E3A6E", lineHeight: "1.75" }}>
                {stack.synergy}
              </p>
            </div>

            {/* Warnings */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "#B45309" }}>
                <AlertTriangle size={12} /> Research Notices
              </p>
              <ul className="space-y-1">
                {stack.warnings.map((w, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: "#92400E" }}>
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
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = activeFilter === "All"
    ? researchStacks
    : researchStacks.filter((s) => s.difficulty === activeFilter);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #071A4A 0%, #0D2565 35%, #1240A0 70%, #1B5CB5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-4 py-14 md:py-20 relative">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Research Protocols
            </span>
          </div>
          <h1 className="font-bold text-white mb-4" style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.15 }}>
            Research Stacks &<br />Protocol Guides
          </h1>
          <p className="max-w-[600px] mb-6" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.75" }}>
            Curated multi-peptide research combinations with mechanistic rationale, suggested dosing parameters, and synergy explanations drawn from preclinical literature.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: <FlaskConical size={14} />, label: `${researchStacks.length} curated protocols` },
              { icon: <BookOpen size={14} />, label: "Research-backed rationale" },
              { icon: <Users size={14} />, label: "Add full stack to cart" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <span style={{ color: "#93C5FD" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RUO Warning */}
      <div style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-start gap-2">
          <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
            <strong>Research Chemical Only:</strong> All compounds listed are for in-vitro laboratory research only. Dosing figures are drawn from published preclinical literature and are not recommendations for human use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-sm font-semibold mr-1" style={{ color: "#64748B" }}>Filter by level:</span>
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="text-sm font-semibold px-4 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: active ? "#1240A0" : "#fff",
                  color: active ? "#fff" : "#475569",
                  border: active ? "1.5px solid #1240A0" : "1.5px solid #E2E8F0",
                  cursor: "pointer",
                }}
              >
                {f}
                {f !== "All" && (
                  <span
                    className="ml-1.5 text-xs"
                    style={{ opacity: 0.7 }}
                  >
                    ({researchStacks.filter((s) => s.difficulty === f).length})
                  </span>
                )}
              </button>
            );
          })}
          <span className="ml-auto text-sm" style={{ color: "#94A3B8" }}>
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
          className="rounded-2xl p-5 mt-10"
          style={{ backgroundColor: "#FFF8F0", border: "1px solid #FED7AA" }}
        >
          <p className="text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#C2410C" }}>
            ⚠ Research Use Only — Important Notice
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7C2D12" }}>
            All protocol guides and dosing parameters on this page are compiled from published preclinical research literature for educational and informational purposes only. They do not constitute medical advice, clinical recommendations, or protocols for human use. All compounds are intended strictly for in-vitro laboratory research by qualified researchers. OmniQure products have not been approved by the FDA or any regulatory authority for human use.
          </p>
        </div>
      </div>
    </div>
  );
}
