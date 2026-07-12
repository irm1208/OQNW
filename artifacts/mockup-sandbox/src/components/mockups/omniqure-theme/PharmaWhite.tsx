import { ShoppingCart, ChevronRight, CheckCircle, FlaskConical, FileText, BarChart3, Search, Menu, Shield, Award, Microscope } from "lucide-react";

const products = [
  { name: "BPC-157", category: "Tissue Repair", purity: "99.2%", price: "£42.00", weight: "5mg", badge: "COA" },
  { name: "TB-500", category: "Recovery", purity: "99.4%", price: "£58.00", weight: "5mg", badge: "HPLC" },
  { name: "Semaglutide", category: "Metabolic", purity: "99.1%", price: "£95.00", weight: "2mg", badge: "ESI-MS" },
  { name: "Selank", category: "Nootropic", purity: "99.3%", price: "£38.00", weight: "5mg", badge: "COA" },
  { name: "PT-141", category: "Research", purity: "99.0%", price: "£52.00", weight: "10mg", badge: "HPLC" },
  { name: "CJC-1295", category: "Growth", purity: "99.5%", price: "£68.00", weight: "2mg", badge: "ESI-MS" },
];

const categories = ["All", "Tissue Repair", "Metabolic", "Nootropic", "Growth", "Recovery"];

function DataBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "COA": "bg-blue-50 text-blue-700 border-blue-200",
    "HPLC": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "ESI-MS": "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase border rounded ${colors[label] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      <CheckCircle size={9} /> {label}
    </span>
  );
}

function ProductCard({ p }: { p: typeof products[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="h-[120px] bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
        <FlaskConical size={36} className="text-slate-300 group-hover:text-blue-400 transition-colors duration-200" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">{p.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{p.category} · {p.weight}</p>
          </div>
          <DataBadge label={p.badge} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Purity</span>
            <p className="text-sm font-bold text-emerald-600">{p.purity}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">Price</span>
            <p className="text-sm font-bold text-gray-900">{p.price}</p>
          </div>
        </div>
        <button className="mt-3 w-full py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors duration-150 flex items-center justify-center gap-1.5">
          <ShoppingCart size={11} /> Add to Order
        </button>
      </div>
    </div>
  );
}

export function PharmaWhite() {
  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] text-gray-900">

      {/* Announcement bar */}
      <div className="bg-blue-700 text-white text-center py-2 text-[11px] font-medium tracking-wide">
        All peptides ship with full COA · HPLC chromatogram · ESI-MS data — <span className="underline cursor-pointer">Download sample report</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded flex items-center justify-center">
              <Microscope size={14} className="text-white" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">omni</span><span className="text-[15px] font-bold text-blue-700 tracking-tight">qure</span>
              <p className="text-[8px] text-gray-400 tracking-[0.15em] uppercase leading-none">Peptide Research Institute</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Catalog", "Research Areas", "Data & COA", "About"].map(item => (
              <a key={item} className="text-[13px] text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
              <Search size={12} className="text-gray-400" />
              <span className="text-[12px] text-gray-400">Search peptides…</span>
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCart size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <Menu size={16} className="md:hidden text-gray-600" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14 flex items-center gap-12">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-5">
              <Award size={11} className="text-blue-600" />
              <span className="text-[11px] text-blue-700 font-semibold tracking-wide">HPLC-Verified · Research Grade</span>
            </div>
            <h1 className="text-[38px] font-bold leading-tight tracking-tight text-gray-900 mb-4">
              Precision peptides for<br />
              <span className="text-blue-700">in-vitro research</span>
            </h1>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6 max-w-md">
              81 HPLC-verified peptides. Every batch ships with full certificate of analysis, chromatogram, and mass spectrometry data. Not for human use.
            </p>
            <div className="flex items-center gap-3">
              <button className="bg-blue-700 hover:bg-blue-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-md transition-colors flex items-center gap-2">
                Browse Catalog <ChevronRight size={14} />
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 text-[13px] font-semibold px-5 py-2.5 rounded-md transition-colors flex items-center gap-2">
                <FileText size={13} /> Sample COA
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-3 flex-shrink-0">
            {[
              { icon: <BarChart3 size={18} />, label: "HPLC Verified", sub: "Every batch" },
              { icon: <FileText size={18} />, label: "Full COA", sub: "Included" },
              { icon: <Shield size={18} />, label: "99%+ Purity", sub: "Guaranteed" },
              { icon: <FlaskConical size={18} />, label: "81 Peptides", sub: "In stock" },
              { icon: <Microscope size={18} />, label: "ESI-MS Data", sub: "Available" },
              { icon: <CheckCircle size={18} />, label: "EU Compliant", sub: "Certified" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center w-24">
                <div className="text-blue-600 flex justify-center mb-1.5">{item.icon}</div>
                <p className="text-[11px] font-semibold text-gray-900 leading-tight">{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat, i) => (
            <button key={cat} className={`flex-shrink-0 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${i === 0 ? "bg-blue-700 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Research Peptide Catalog</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">81 compounds · All with COA/HPLC/ESI-MS documentation</p>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <span>Sort by:</span>
            <select className="border border-gray-200 rounded-md px-2 py-1 text-[12px] bg-white">
              <option>Purity (High→Low)</option>
              <option>Price</option>
              <option>Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {products.map((p) => <ProductCard key={p.name} p={p} />)}
        </div>

        <div className="mt-8 text-center">
          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 text-[13px] font-medium px-6 py-2.5 rounded-md transition-colors">
            View all 81 peptides
          </button>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-6 text-center">
            {[
              { n: "99%+", label: "Average purity across all batches" },
              { n: "81", label: "HPLC-verified research compounds" },
              { n: "100%", label: "Shipped with full documentation" },
              { n: "48h", label: "Typical UK dispatch time" },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-[26px] font-bold text-blue-700 leading-none">{s.n}</p>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">© 2026 OmniQure Peptide Research Institute. For in-vitro research use only. Not for human or veterinary use.</p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "COA Policy"].map(l => (
              <a key={l} className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
