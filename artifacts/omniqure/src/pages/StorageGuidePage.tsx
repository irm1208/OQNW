import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Thermometer, Droplets, ShieldAlert, AlertTriangle, CheckCircle2,
  FlaskConical, Package, Snowflake, Sun, RefreshCw, Clock,
  ChevronDown, ChevronUp, Info, XCircle, Beaker, Zap, BookOpen
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const SECTIONS: Section[] = [
  { id: "lyophilised",   title: "Lyophilised (Dry) Peptides",       icon: Snowflake,    color: "#1B5CB5", bg: "#EFF6FF" },
  { id: "reconstituted", title: "Reconstituted Peptide Solutions",   icon: Beaker,       color: "#059669", bg: "#ECFDF5" },
  { id: "freezethaw",    title: "Freeze / Thaw Cycles",              icon: RefreshCw,    color: "#7C3AED", bg: "#F5F3FF" },
  { id: "light",         title: "Light & Oxidation Protection",      icon: Sun,          color: "#D97706", bg: "#FFFBEB" },
  { id: "contamination", title: "Contamination Prevention",          icon: ShieldAlert,  color: "#DC2626", bg: "#FEF2F2" },
  { id: "shipping",      title: "Receiving & Shipping Conditions",   icon: Package,      color: "#0891B2", bg: "#F0F9FF" },
  { id: "stability",     title: "Peptide Stability by Class",        icon: FlaskConical, color: "#65A30D", bg: "#F7FEE7" },
  { id: "checklist",     title: "Quick Reference Checklist",         icon: CheckCircle2, color: "#475569", bg: "#F8FAFC" },
];

type FAQItem = { q: string; a: string };
const FAQS: FAQItem[] = [
  {
    q: "Can I store lyophilised peptides at room temperature?",
    a: "Short-term (a few days in transit) is generally acceptable, but for research integrity, lyophilised peptides should be returned to −20 °C as soon as possible upon receipt. Prolonged room-temperature exposure increases the risk of moisture absorption and hydrolytic degradation, particularly for peptides containing Asp, Asn, Gln, or Met residues.",
  },
  {
    q: "How long does a reconstituted peptide last in the fridge?",
    a: "Most reconstituted peptides in BAC water are stable for 4–6 weeks at 2–8 °C when stored in amber glass vials away from light. Peptides that are particularly sensitive to oxidation (e.g. those containing Met, Trp, or Cys) may degrade faster. Saline-reconstituted solutions should be used within 24–48 hours.",
  },
  {
    q: "What is the maximum number of freeze/thaw cycles?",
    a: "Best practice is to limit freeze/thaw cycles to a maximum of 3 for most peptides. Beyond this, cumulative physical stress (ice crystal formation) and chemical degradation (deamidation, oxidation) compound with each cycle. Aliquoting before freezing is strongly recommended.",
  },
  {
    q: "Does the amber vial OmniQure uses provide sufficient light protection?",
    a: "Yes — amber glass blocks >99% of UV light below 450 nm, which covers the primary photodegradation wavelengths for most peptides. Additional foil wrapping is only necessary for extremely photosensitive peptides (e.g. Melanotan 1 & 2, GHRP-6). Store all vials away from fluorescent lighting even when inside a fridge.",
  },
  {
    q: "Do I need to refrigerate vials immediately upon receipt?",
    a: "Once your order arrives, simply place the vials in your freezer. Lyophilised peptides store well at −20 °C for long-term stability.",
  },
  {
    q: "Can I reconstitute with sterile water instead of BAC water?",
    a: "Sterile water (without benzyl alcohol) provides no bacteriostatic protection. A reconstituted solution in plain sterile water should be used within the same research session or within 24 hours when refrigerated. BAC water is strongly preferred for multi-use vials and extends usable stability to approximately 4–6 weeks.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-medium text-gray-800 pr-4">{item.q}</span>
            {open === i
              ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
              : <ChevronDown size={16} className="text-gray-400 shrink-0" />
            }
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
              <p className="pt-4">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type TempCardProps = { temp: string; label: string; duration: string; use: string; color: string; bg: string; icon: React.ElementType };
function TempCard({ temp, label, duration, use, color, bg, icon: Icon }: TempCardProps) {
  return (
    <div className="rounded-xl border p-5 flex flex-col gap-2" style={{ borderColor: color + "33", background: bg }}>
      <div className="flex items-center gap-2">
        <Icon size={18} style={{ color }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{temp}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Duration:</span> {duration}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Use for:</span> {use}</p>
    </div>
  );
}

export default function StorageGuidePage() {
  useSEO({
    title: "Peptide Storage & Handling Guide | OmniQure Research",
    description: "Comprehensive guide to storing and handling research peptides — lyophilised storage temperatures, reconstitution, freeze/thaw cycles, contamination prevention, and stability by peptide class.",
    keywords: "peptide storage, lyophilised peptide, reconstitution, freeze thaw, research peptide handling, peptide stability, BAC water storage",
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F2A6B 0%, #1B5CB5 60%, #2563EB 100%)" }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="max-w-[1280px] mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Research & Education</Link>
            <span>/</span>
            <span className="text-white">Storage & Handling Guide</span>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Thermometer size={32} className="text-blue-200" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
                Peptide Storage & Handling Guide
              </h1>
              <p className="text-blue-100 text-base md:text-lg max-w-2xl">
                Maintaining peptide integrity from receipt through reconstitution. Reference-grade protocols for lyophilised storage, cold-chain handling, and solution stability.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {["Lyophilised Storage", "Reconstituted Solutions", "Freeze/Thaw", "Contamination Prevention", "Stability Reference"].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-100 border border-white/20">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-[1280px] mx-auto flex items-start gap-2 text-amber-800 text-sm">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>This guide is for <strong>research purposes only</strong>. OmniQure peptides are sold exclusively for in vitro and laboratory research. All handling should comply with your institution's safety and regulatory protocols.</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-10">

        {/* Section nav pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:opacity-90"
              style={{ borderColor: s.color + "44", color: s.color, background: s.bg }}
            >
              <s.icon size={12} />
              {s.title.split(" ").slice(0, 2).join(" ")}
            </a>
          ))}
        </div>

        {/* Temperature quick reference */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Temperature Quick Reference</h2>
          <p className="text-sm text-gray-500 mb-5">Four storage states relevant to research peptide handling.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TempCard
              temp="−80 °C"
              label="Ultra-Low"
              color="#7C3AED"
              bg="#F5F3FF"
              icon={Snowflake}
              duration="Up to 36 months"
              use="Long-term archival of lyophilised peptides or stock aliquots"
            />
            <TempCard
              temp="−20 °C"
              label="Freezer"
              color="#1B5CB5"
              bg="#EFF6FF"
              icon={Snowflake}
              duration="6–18 months"
              use="Standard long-term storage for lyophilised peptides"
            />
            <TempCard
              temp="2–8 °C"
              label="Refrigerator"
              color="#059669"
              bg="#ECFDF5"
              icon={Thermometer}
              duration="4–6 weeks"
              use="Reconstituted solutions in BAC water (amber vial, capped)"
            />
            <TempCard
              temp="≤25 °C"
              label="Room Temp"
              color="#D97706"
              bg="#FFFBEB"
              icon={Sun}
              duration="48–72 hours max"
              use="Transit only — return to −20 °C on receipt"
            />
          </div>
        </div>

        {/* Section 1: Lyophilised */}
        <section id="lyophilised" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#EFF6FF" }}>
              <Snowflake size={20} style={{ color: "#1B5CB5" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Lyophilised (Dry) Peptides</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            All OmniQure peptides are supplied as lyophilised (freeze-dried) powder in sealed, nitrogen-purged vials. This format dramatically extends shelf life by removing the aqueous environment required for hydrolysis, oxidation, and microbial growth. Maintaining the dry state is the single most important storage factor.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-800">Best Practice</span>
              </div>
              <ul className="space-y-2 text-sm text-green-900">
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Store sealed vials at <strong>−20 °C</strong> (or −80 °C for long-term archival)</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Allow vials to reach room temperature <strong>before opening</strong> to prevent condensation forming inside</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Return vials to freezer immediately after withdrawing powder or solution</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Keep vials in original opaque packaging or wrapped in foil to prevent photodegradation</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Use desiccant pouches in your freezer storage box to absorb ambient moisture</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Label vials clearly with compound name, lot number, and date received</span></li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-red-600" />
                <span className="text-sm font-bold text-red-800">Avoid</span>
              </div>
              <ul className="space-y-2 text-sm text-red-900">
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Opening vials while cold — condensation will introduce moisture into the powder</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Storing near frost-free freezer vents where temperature cycling occurs</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Leaving vials at room temperature for more than 72 hours</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Exposing vials to direct light (UV promotes Met, Trp, Tyr, and Cys oxidation)</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Re-freezing a vial that has already been reconstituted without aliquoting first</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Storing peptides in standard household fridges with frequent door opening (temperature variance)</span></li>
              </ul>
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-2 text-blue-800 text-sm">
              <Info size={15} className="mt-0.5 shrink-0" />
              <p><strong>Equilibration protocol:</strong> Remove the sealed vial from −20 °C storage and allow it to equilibrate to room temperature for <strong>10–15 minutes</strong> before opening. This prevents atmospheric moisture condensing on the cold peptide cake. Only then remove the crimp cap and rubber septum for reconstitution.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Reconstituted */}
        <section id="reconstituted" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#ECFDF5" }}>
              <Beaker size={20} style={{ color: "#059669" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Reconstituted Peptide Solutions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Once a peptide is reconstituted in bacteriostatic water or saline, its stability window narrows significantly. The aqueous environment re-enables hydrolysis, enzyme contamination, and microbial growth. Strict cold-chain and sterile technique are essential.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                solvent: "BAC Water (0.9% benzyl alcohol)",
                stability: "4–6 weeks",
                temp: "2–8 °C (fridge)",
                notes: "Preferred for multi-use vials. Benzyl alcohol inhibits bacterial growth throughout the usable period.",
                color: "#059669", bg: "#ECFDF5",
              },
              {
                solvent: "Sterile Saline (0.9% NaCl)",
                stability: "24–48 hours",
                temp: "2–8 °C (fridge)",
                notes: "No bacteriostatic agent. Single-session use only. Suitable for peptides with low BAC water compatibility.",
                color: "#D97706", bg: "#FFFBEB",
              },
              {
                solvent: "Sterile Water (no preservative)",
                stability: "12–24 hours",
                temp: "2–8 °C (fridge)",
                notes: "Shortest window. Use immediately or discard. Appropriate for very small, single-use aliquots only.",
                color: "#DC2626", bg: "#FEF2F2",
              },
            ].map(s => (
              <div key={s.solvent} className="rounded-xl border p-4" style={{ borderColor: s.color + "33", background: s.bg }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: s.color }}>{s.solvent}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{s.stability}</p>
                <p className="text-xs text-gray-500 mb-2">{s.temp}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{s.notes}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Reconstitution Best Practice</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">1.</span><span>Allow the lyophilised vial to reach room temperature (10–15 min) before opening.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">2.</span><span>Use an alcohol swab on the vial septum and allow to air-dry for 30 seconds.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">3.</span><span>Add BAC water slowly down the inner wall of the vial — <strong>never inject directly onto the peptide cake</strong>, as this can denature the protein structure.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">4.</span><span>Gently swirl — do not vortex or shake vigorously, which can cause aggregation and foaming.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">5.</span><span>Allow 3–5 minutes for complete dissolution. Solution should be clear (some peptides may have a slight colour).</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">6.</span><span>If turbidity persists, warm gently to 37 °C for 1–2 minutes. If still turbid, do not use — the peptide may have aggregated.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">7.</span><span>Label the vial with compound, concentration (mg/mL), date of reconstitution, and expiry date.</span></li>
              <li className="flex gap-3"><span className="font-bold text-blue-600 shrink-0">8.</span><span>Store in the refrigerator (2–8 °C) away from light. Do not freeze a reconstituted solution unless it has been aliquoted.</span></li>
            </ol>
          </div>
        </section>

        {/* Section 3: Freeze/Thaw */}
        <section id="freezethaw" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#F5F3FF" }}>
              <RefreshCw size={20} style={{ color: "#7C3AED" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Freeze / Thaw Cycles</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Each freeze/thaw cycle subjects a peptide solution to physical shear forces (ice crystal growth) and concentrated chemical microenvironments during the freezing interface. Cumulative damage manifests as deamidation of Asn and Gln residues, oxidation of Met and Cys, and aggregation. Limiting cycles is among the most impactful steps a researcher can take.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { cycle: "0", label: "As reconstituted", risk: "Baseline", color: "#059669", bg: "#ECFDF5" },
              { cycle: "1", label: "First thaw", risk: "Low", color: "#65A30D", bg: "#F7FEE7" },
              { cycle: "2", label: "Second thaw", risk: "Moderate", color: "#D97706", bg: "#FFFBEB" },
              { cycle: "3+", label: "Third thaw onwards", risk: "High — discard", color: "#DC2626", bg: "#FEF2F2" },
            ].map(c => (
              <div key={c.cycle} className="rounded-xl border p-4 text-center" style={{ borderColor: c.color + "33", background: c.bg }}>
                <p className="text-3xl font-bold mb-1" style={{ color: c.color }}>×{c.cycle}</p>
                <p className="text-xs text-gray-600 mb-1">{c.label}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: c.color + "22", color: c.color }}>{c.risk}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
            <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2"><Zap size={15} />Aliquoting Protocol — Eliminate Freeze/Thaw Risk</h3>
            <p className="text-sm text-purple-900 mb-3">The most reliable method is to aliquot the reconstituted solution into single-use volumes immediately after reconstitution, before any freezing. This way each aliquot undergoes at most one freeze/thaw cycle.</p>
            <ul className="space-y-1.5 text-sm text-purple-900">
              <li className="flex gap-2"><span>•</span><span>Use sterile, single-use 0.5 mL or 1.5 mL amber glass vials or polypropylene tubes</span></li>
              <li className="flex gap-2"><span>•</span><span>Aliquot into volumes matching your experimental dose (e.g. 100 µL per aliquot)</span></li>
              <li className="flex gap-2"><span>•</span><span>Seal with parafilm or crimp caps to prevent evaporation during freezing</span></li>
              <li className="flex gap-2"><span>•</span><span>Flash-freeze in liquid nitrogen or place directly on dry ice before transferring to −80 °C or −20 °C</span></li>
              <li className="flex gap-2"><span>•</span><span>Thaw only the aliquot needed; discard unused portion rather than re-freezing</span></li>
            </ul>
          </div>
        </section>

        {/* Section 4: Light */}
        <section id="light" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#FFFBEB" }}>
              <Sun size={20} style={{ color: "#D97706" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Light & Oxidation Protection</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            UV radiation (290–400 nm) and blue visible light directly photodegrades aromatic amino acid residues. Tryptophan (Trp/W), Tyrosine (Tyr/Y), Phenylalanine (Phe/F), and Histidine (His/H) are particularly susceptible. Oxygen dissolved in reconstituted solutions oxidises Methionine (Met/M) and Cysteine (Cys/C), reducing activity.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div className="rounded-xl border border-amber-200 p-5">
              <h3 className="text-sm font-bold text-amber-800 mb-3">High Photosensitivity — Extra Protection Required</h3>
              <div className="space-y-2">
                {[
                  { peptide: "Melanotan 1 & 2", reason: "Contains Trp and Tyr in active sequence; light exposure reduces melanocortin receptor affinity" },
                  { peptide: "GHRP-2 & GHRP-6", reason: "Trp-containing hexapeptides; UV breaks aromatic ring and reduces GH-secretagogue potency" },
                  { peptide: "Epithalon", reason: "Tetrapeptide sensitive to oxidative degradation; amber vial and foil wrapping recommended" },
                  { peptide: "LL-37", reason: "Cathelicidin with multiple Trp residues; photodegradation reduces antimicrobial activity" },
                ].map(p => (
                  <div key={p.peptide} className="flex gap-3 text-sm">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <span><strong className="text-gray-800">{p.peptide}</strong> — <span className="text-gray-600">{p.reason}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Practical Measures</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>Use amber glass vials (provided by OmniQure) for all reconstituted solutions</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>Wrap highly photosensitive vials in aluminium foil for additional UV blocking</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>Perform reconstitution under reduced or red-spectrum lighting for sensitive peptides</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>Store in a closed box or drawer within the fridge — avoid fridge door shelves</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>Minimise exposure time when drawing volumes — cap immediately after use</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /><span>For oxidation-sensitive peptides (Met, Cys): purge reconstituted vials with argon gas before sealing</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Contamination */}
        <section id="contamination" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#FEF2F2" }}>
              <ShieldAlert size={20} style={{ color: "#DC2626" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Contamination Prevention</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Microbial and particulate contamination of peptide solutions is the most common cause of compromised research results. Once introduced, contamination cannot be reversed. Sterile technique must be maintained throughout the reconstitution and aliquoting process.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Essential Sterile Technique</h3>
              <div className="space-y-3">
                {[
                  { step: "Work surface", detail: "Clean bench surface with 70% isopropyl alcohol and allow to dry completely before beginning." },
                  { step: "Hand hygiene", detail: "Wear nitrile gloves. Change gloves between compound preparations." },
                  { step: "Needle & syringe", detail: "Use single-use sterile syringes and needles. Never reuse needles between vials." },
                  { step: "Swab septa", detail: "Swab the rubber stopper of every vial with 70% IPA before each needle insertion. Allow to air-dry." },
                  { step: "Minimise openings", detail: "Open vials only when needed. Limit the time any vial is uncapped." },
                  { step: "0.22 µm filtration", detail: "If using non-BAC solvent or suspect contamination, filter through 0.22 µm sterile membrane before use." },
                ].map(s => (
                  <div key={s.step} className="flex gap-3 text-sm">
                    <div className="w-24 shrink-0 font-semibold text-gray-700">{s.step}</div>
                    <div className="text-gray-600">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle size={14} />Signs of Compromised Peptide Solutions</h3>
              <ul className="space-y-2 text-sm text-red-900">
                <li className="flex gap-2"><span>•</span><span><strong>Turbidity or cloudiness</strong> after full reconstitution may indicate aggregation or microbial contamination</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Visible particulates</strong> floating or settled at the bottom of the vial</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Unusual colour change</strong> — yellowing of normally clear solutions (common with oxidised Trp/Tyr)</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Off-odour</strong> when opening a previously stable vial</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Foam that does not dissipate</strong> — may indicate protein aggregation from agitation or temperature shock</span></li>
              </ul>
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-xs text-red-800 font-semibold">If any of these signs are present — discard the solution. Do not attempt to filter and re-use a contaminated peptide solution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Shipping */}
        <section id="shipping" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#F0F9FF" }}>
              <Package size={20} style={{ color: "#0891B2" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Receiving & Shipping Conditions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            OmniQure peptides ship in thermally insulated packaging with gel packs rated for 48–72 hour ambient protection. Lyophilised peptides are inherently more stable in transit than reconstituted solutions, which is why we never ship reconstituted product.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            {[
              {
                title: "On Arrival — First Steps",
                icon: Package,
                color: "#0891B2",
                bg: "#F0F9FF",
                items: [
                  "Inspect outer packaging for damage",
                  "Check gel pack temperature (should feel cool to cold)",
                  "Inventory vials against packing slip",
                  "Transfer all vials to −20 °C freezer immediately",
                  "Do not open sealed vials until needed",
                ],
              },
              {
                title: "Hot Climate Precautions",
                icon: Sun,
                color: "#D97706",
                bg: "#FFFBEB",
                items: [
                  "Request delivery to a cool location or lab address",
                  "Track shipment and be available to receive immediately",
                  "If package feels warm on arrival — check vials for any colour change before use",
                  "Contact support if you suspect cold chain was compromised",
                ],
              },
              {
                title: "Do Not Refrigerate — Freeze",
                icon: Snowflake,
                color: "#1B5CB5",
                bg: "#EFF6FF",
                items: [
                  "Fridge (2–8 °C) is for reconstituted solutions only",
                  "Lyophilised peptides stored at fridge temperature will absorb moisture from repeated door-opening",
                  "Always transfer dry, sealed vials to the freezer (−20 °C minimum)",
                ],
              },
            ].map(card => (
              <div key={card.title} className="rounded-xl border p-5" style={{ borderColor: card.color + "33", background: card.bg }}>
                <div className="flex items-center gap-2 mb-3">
                  <card.icon size={16} style={{ color: card.color }} />
                  <h3 className="text-sm font-bold" style={{ color: card.color }}>{card.title}</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {card.items.map(it => (
                    <li key={it} className="flex gap-2"><span className="mt-0.5" style={{ color: card.color }}>•</span><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Stability by class */}
        <section id="stability" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#F7FEE7" }}>
              <FlaskConical size={20} style={{ color: "#65A30D" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Peptide Stability by Class</h2>
          </div>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            Stability varies by sequence composition, disulfide bond content, and molecular weight. The table below provides general guidance — always refer to individual product COAs for specific stability data.
          </p>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Peptide Class</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Examples</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Lyophilised (−20 °C)</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Reconstituted (2–8 °C)</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Key Sensitivities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { cls: "Healing Peptides", ex: "BPC-157, TB-500", lyoph: "12–18 months", recon: "4–6 weeks", sens: "pH, prolonged heat" },
                  { cls: "Growth Hormone Secretagogues", ex: "GHRP-2, GHRP-6, Ipamorelin", lyoph: "12–18 months", recon: "4–5 weeks", sens: "UV light, oxidation (Trp)" },
                  { cls: "GHRH Analogues", ex: "CJC-1295, Sermorelin, Tesamorelin", lyoph: "18–24 months", recon: "4–6 weeks", sens: "Temperature cycling" },
                  { cls: "Melanocortin Peptides", ex: "Melanotan 1, Melanotan 2", lyoph: "12–18 months", recon: "3–4 weeks", sens: "UV (high), oxidation" },
                  { cls: "Longevity Peptides", ex: "Epithalon, Thymosin α-1", lyoph: "18–24 months", recon: "4–5 weeks", sens: "Light, Cys oxidation" },
                  { cls: "Nootropic Peptides", ex: "Semax, Selank, PE-22-28", lyoph: "12–18 months", recon: "3–4 weeks", sens: "pH extremes, light" },
                  { cls: "Copper Peptides", ex: "GHK-Cu", lyoph: "12–18 months", recon: "2–3 weeks", sens: "Metal chelation, light" },
                  { cls: "Neurological Peptides", ex: "DSIP, P21, VIP", lyoph: "12–18 months", recon: "3–5 weeks", sens: "Temperature, protease exposure" },
                  { cls: "Mitochondrial Peptides", ex: "SS-31, MOTS-C", lyoph: "18–24 months", recon: "4–6 weeks", sens: "Oxidation (Cys, Met)" },
                ].map((row, i) => (
                  <tr key={row.cls} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.cls}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.ex}</td>
                    <td className="px-4 py-3 text-gray-700">{row.lyoph}</td>
                    <td className="px-4 py-3 text-gray-700">{row.recon}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.sens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 8: Checklist */}
        <section id="checklist" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: "#F8FAFC" }}>
              <CheckCircle2 size={20} style={{ color: "#475569" }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Quick Reference Checklist</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "📦 On Receipt",
                items: [
                  "Check packaging integrity",
                  "Verify vials against packing slip",
                  "Transfer to −20 °C freezer immediately",
                  "Log lot numbers and receipt date",
                ],
              },
              {
                title: "🧪 Before Reconstitution",
                items: [
                  "Equilibrate sealed vial to room temp (10–15 min)",
                  "Swab septum with 70% IPA",
                  "Confirm correct solvent (BAC water recommended)",
                  "Calculate target concentration",
                ],
              },
              {
                title: "💧 During Reconstitution",
                items: [
                  "Add solvent slowly down inner vial wall",
                  "Swirl gently — do not vortex",
                  "Allow 3–5 min for full dissolution",
                  "Check for clarity before use",
                ],
              },
              {
                title: "🧊 Ongoing Storage",
                items: [
                  "Refrigerate reconstituted solution (2–8 °C)",
                  "Keep in amber vial away from light",
                  "Label with compound, concentration, date, expiry",
                  "Limit freeze/thaw to ≤3 cycles — aliquot to avoid",
                ],
              },
            ].map(col => (
              <div key={col.title} className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-800 mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>Frequently Asked Questions</h2>
          <FAQ />
        </section>

        {/* Related links */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
            <BookOpen size={16} className="text-blue-600" />
            Related Research Resources
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Reconstitution Calculator", href: "/calculator", desc: "Calculate volumes and concentrations" },
              { label: "Research Protocols", href: "/protocols", desc: "Dosing guides by compound" },
              { label: "Glossary", href: "/glossary", desc: "Scientific terminology" },
              { label: "Research Blog", href: "/blog", desc: "Peptide mechanism articles" },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
