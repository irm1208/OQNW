import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/PageHero";
import {
  Thermometer, ShieldAlert, AlertTriangle, CheckCircle2,
  FlaskConical, Package, Snowflake, Sun, RefreshCw,
  ChevronDown, ChevronUp, Info, XCircle, Beaker, Zap, BookOpen
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  nav: string;
  icon: React.ElementType;
};

const SECTIONS: Section[] = [
  { id: "lyophilised",   title: "Lyophilised (Dry) Peptides",       nav: "Lyophilised", icon: Snowflake },
  { id: "reconstituted", title: "Reconstituted Peptide Solutions",   nav: "Reconstituted", icon: Beaker },
  { id: "freezethaw",    title: "Freeze / Thaw Cycles",              nav: "Freeze / thaw", icon: RefreshCw },
  { id: "light",         title: "Light & Oxidation Protection",      nav: "Light & oxidation", icon: Sun },
  { id: "contamination", title: "Contamination Prevention",          nav: "Contamination", icon: ShieldAlert },
  { id: "shipping",      title: "Receiving & Shipping Conditions",   nav: "Receiving", icon: Package },
  { id: "stability",     title: "Peptide Stability by Class",        nav: "Stability", icon: FlaskConical },
  { id: "checklist",     title: "Quick Reference Checklist",         nav: "Checklist", icon: CheckCircle2 },
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
        <div key={i} className="border border-[rgba(11,18,32,0.09)] rounded-2xl overflow-hidden bg-white">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#F2F0EB] transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-medium text-[var(--ink)] pr-4">{item.q}</span>
            {open === i
              ? <ChevronUp size={16} className="text-[rgba(74,85,104,0.6)] shrink-0" />
              : <ChevronDown size={16} className="text-[rgba(74,85,104,0.6)] shrink-0" />
            }
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-[var(--graphite)] leading-relaxed border-t border-[rgba(11,18,32,0.06)] bg-[#F2F0EB]">
              <p className="pt-4">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type TempCardProps = { temp: string; label: string; duration: string; use: string; icon: React.ElementType };
function TempCard({ temp, label, duration, use, icon: Icon }: TempCardProps) {
  return (
    <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-[var(--graphite)]" aria-hidden="true" />
        <span className="uppercase font-medium text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>{label}</span>
      </div>
      <p className="text-2xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.02em" }}>{temp}</p>
      <p className="text-sm text-[var(--graphite)]"><span className="font-semibold">Duration:</span> {duration}</p>
      <p className="text-sm text-[var(--graphite)]"><span className="font-semibold">Use for:</span> {use}</p>
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

      <PageHero image={{ key: "hdr-storage", alt: "OmniQure BPC-157 vial beside bacteriostatic water" }} crumbs={[{ label: "Storage & Handling Guide" }]} eyebrow="Research Guide" icon={Thermometer} title="Peptide Storage & Handling Guide">
        <p>
          Maintaining peptide integrity from receipt through reconstitution. Reference-grade protocols for lyophilised storage, cold-chain handling, and solution stability.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {["Lyophilised Storage", "Reconstituted Solutions", "Freeze/Thaw", "Contamination Prevention", "Stability Reference"].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[var(--graphite)] border border-[rgba(11,18,32,0.09)]">{tag}</span>
          ))}
        </div>
      </PageHero>

      {/* Disclaimer banner */}
      <div className="bg-[#F2F0EB] border-b border-[rgba(11,18,32,0.09)] py-3">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 flex items-start gap-2 text-[var(--graphite)] text-sm">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#85683A]" aria-hidden="true" />
          <span>This guide is for <strong>research purposes only</strong>. OmniQure peptides are sold exclusively for in vitro and laboratory research. All handling should comply with your institution's safety and regulatory protocols.</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10">

        {/* Section nav pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[rgba(11,18,32,0.09)] bg-white text-[var(--graphite)] transition-colors hover:text-[var(--ink)] hover:border-[rgba(11,18,32,0.2)]"
            >
              <s.icon size={12} />
              {s.nav}
            </a>
          ))}
        </div>

        {/* Temperature quick reference */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--ink)] mb-2" style={{ letterSpacing: "-0.015em" }}>Temperature Quick Reference</h2>
          <p className="text-sm text-[var(--graphite)] mb-5">Four storage states relevant to research peptide handling.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TempCard
              temp="−80 °C"
              label="Ultra-Low"
              icon={Snowflake}
              duration="Up to 36 months"
              use="Long-term archival of lyophilised peptides or stock aliquots"
            />
            <TempCard
              temp="−20 °C"
              label="Freezer"
              icon={Snowflake}
              duration="6–18 months"
              use="Standard long-term storage for lyophilised peptides"
            />
            <TempCard
              temp="2–8 °C"
              label="Refrigerator"
              icon={Thermometer}
              duration="4–6 weeks"
              use="Reconstituted solutions in BAC water (amber vial, capped)"
            />
            <TempCard
              temp="≤25 °C"
              label="Room Temp"
              icon={Sun}
              duration="48–72 hours max"
              use="Transit only — return to −20 °C on receipt"
            />
          </div>
        </div>

        {/* Section 1: Lyophilised */}
        <section id="lyophilised" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <Snowflake size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Lyophilised (Dry) Peptides</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            All OmniQure peptides are supplied as lyophilised (freeze-dried) powder in sealed, nitrogen-purged vials. This format dramatically extends shelf life by removing the aqueous environment required for hydrolysis, oxidation, and microbial growth. Maintaining the dry state is the single most important storage factor.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-[var(--cobalt)]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[var(--ink)]">Best Practice</span>
              </div>
              <ul className="space-y-2 text-sm text-[var(--graphite)]">
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Store sealed vials at <strong>−20 °C</strong> (or −80 °C for long-term archival)</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Allow vials to reach room temperature <strong>before opening</strong> to prevent condensation forming inside</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Return vials to freezer immediately after withdrawing powder or solution</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Keep vials in original opaque packaging or wrapped in foil to prevent photodegradation</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Use desiccant pouches in your freezer storage box to absorb ambient moisture</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Label vials clearly with compound name, lot number, and date received</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-[var(--graphite)]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[var(--ink)]">Avoid</span>
              </div>
              <ul className="space-y-2 text-sm text-[var(--graphite)]">
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Opening vials while cold — condensation will introduce moisture into the powder</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Storing near frost-free freezer vents where temperature cycling occurs</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Leaving vials at room temperature for more than 72 hours</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Exposing vials to direct light (UV promotes Met, Trp, Tyr, and Cys oxidation)</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Re-freezing a vial that has already been reconstituted without aliquoting first</span></li>
                <li className="flex gap-2"><span className="mt-0.5">•</span><span>Storing peptides in standard household fridges with frequent door opening (temperature variance)</span></li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB] p-5">
            <div className="flex items-start gap-2 text-[var(--graphite)] text-sm">
              <Info size={15} className="mt-0.5 shrink-0 text-[var(--cobalt)]" aria-hidden="true" />
              <p><strong>Equilibration protocol:</strong> Remove the sealed vial from −20 °C storage and allow it to equilibrate to room temperature for <strong>10–15 minutes</strong> before opening. This prevents atmospheric moisture condensing on the cold peptide cake. Only then remove the crimp cap and rubber septum for reconstitution.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Reconstituted */}
        <section id="reconstituted" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <Beaker size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Reconstituted Peptide Solutions</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            Once a peptide is reconstituted in bacteriostatic water or saline, its stability window narrows significantly. The aqueous environment re-enables hydrolysis, enzyme contamination, and microbial growth. Strict cold-chain and sterile technique are essential.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                solvent: "BAC Water (0.9% benzyl alcohol)",
                stability: "4–6 weeks",
                temp: "2–8 °C (fridge)",
                notes: "Preferred for multi-use vials. Benzyl alcohol inhibits bacterial growth throughout the usable period.",
              },
              {
                solvent: "Sterile Saline (0.9% NaCl)",
                stability: "24–48 hours",
                temp: "2–8 °C (fridge)",
                notes: "No bacteriostatic agent. Single-session use only. Suitable for peptides with low BAC water compatibility.",
              },
              {
                solvent: "Sterile Water (no preservative)",
                stability: "12–24 hours",
                temp: "2–8 °C (fridge)",
                notes: "Shortest window. Use immediately or discard. Appropriate for very small, single-use aliquots only.",
              },
            ].map(s => (
              <div key={s.solvent} className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-4">
                <p className="uppercase font-medium text-[var(--graphite)] mb-1" style={{ fontSize: 10, letterSpacing: "0.18em" }}>{s.solvent}</p>
                <p className="text-2xl font-semibold text-[var(--ink)] mb-1" style={{ letterSpacing: "-0.02em" }}>{s.stability}</p>
                <p className="text-xs text-[var(--graphite)] mb-2">{s.temp}</p>
                <p className="text-xs text-[var(--graphite)] leading-relaxed">{s.notes}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Reconstitution Best Practice</h3>
            <ol className="space-y-2 text-sm text-[var(--graphite)]">
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">1.</span><span>Allow the lyophilised vial to reach room temperature (10–15 min) before opening.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">2.</span><span>Use an alcohol swab on the vial septum and allow to air-dry for 30 seconds.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">3.</span><span>Add BAC water slowly down the inner wall of the vial — <strong>never inject directly onto the peptide cake</strong>, as this can denature the protein structure.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">4.</span><span>Gently swirl — do not vortex or shake vigorously, which can cause aggregation and foaming.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">5.</span><span>Allow 3–5 minutes for complete dissolution. Solution should be clear (some peptides may have a slight colour).</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">6.</span><span>If turbidity persists, warm gently to 37 °C for 1–2 minutes. If still turbid, do not use — the peptide may have aggregated.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">7.</span><span>Label the vial with compound, concentration (mg/mL), date of reconstitution, and expiry date.</span></li>
              <li className="flex gap-3"><span className="font-medium text-[var(--cobalt)] shrink-0">8.</span><span>Store in the refrigerator (2–8 °C) away from light. Do not freeze a reconstituted solution unless it has been aliquoted.</span></li>
            </ol>
          </div>
        </section>

        {/* Section 3: Freeze/Thaw */}
        <section id="freezethaw" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <RefreshCw size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Freeze / Thaw Cycles</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            Each freeze/thaw cycle subjects a peptide solution to physical shear forces (ice crystal growth) and concentrated chemical microenvironments during the freezing interface. Cumulative damage manifests as deamidation of Asn and Gln residues, oxidation of Met and Cys, and aggregation. Limiting cycles is among the most impactful steps a researcher can take.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { cycle: "0", label: "As reconstituted", risk: "Baseline" },
              { cycle: "1", label: "First thaw", risk: "Low" },
              { cycle: "2", label: "Second thaw", risk: "Moderate" },
              { cycle: "3+", label: "Third thaw onwards", risk: "High — discard" },
            ].map(c => (
              <div key={c.cycle} className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-4 text-center">
                <p className="text-3xl font-semibold mb-1 text-[var(--ink)]" style={{ letterSpacing: "-0.02em" }}>×{c.cycle}</p>
                <p className="text-xs text-[var(--graphite)] mb-1">{c.label}</p>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-[rgba(11,18,32,0.09)] text-[var(--graphite)]">{c.risk}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB] p-5">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2"><Zap size={15} className="text-[var(--graphite)]" aria-hidden="true" />Aliquoting Protocol — Eliminate Freeze/Thaw Risk</h3>
            <p className="text-sm text-[var(--graphite)] mb-3">The most reliable method is to aliquot the reconstituted solution into single-use volumes immediately after reconstitution, before any freezing. This way each aliquot undergoes at most one freeze/thaw cycle.</p>
            <ul className="space-y-1.5 text-sm text-[var(--graphite)]">
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
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <Sun size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Light & Oxidation Protection</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            UV radiation (290–400 nm) and blue visible light directly photodegrades aromatic amino acid residues. Tryptophan (Trp/W), Tyrosine (Tyr/Y), Phenylalanine (Phe/F), and Histidine (His/H) are particularly susceptible. Oxygen dissolved in reconstituted solutions oxidises Methionine (Met/M) and Cysteine (Cys/C), reducing activity.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB] p-5">
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">High Photosensitivity — Extra Protection Required</h3>
              <div className="space-y-2">
                {[
                  { peptide: "Melanotan 1 & 2", reason: "Contains Trp and Tyr in active sequence; light exposure reduces melanocortin receptor affinity" },
                  { peptide: "GHRP-2 & GHRP-6", reason: "Trp-containing hexapeptides; UV breaks aromatic ring and reduces GH-secretagogue potency" },
                  { peptide: "Epithalon", reason: "Tetrapeptide sensitive to oxidative degradation; amber vial and foil wrapping recommended" },
                  { peptide: "LL-37", reason: "Cathelicidin with multiple Trp residues; photodegradation reduces antimicrobial activity" },
                ].map(p => (
                  <div key={p.peptide} className="flex gap-3 text-sm">
                    <AlertTriangle size={14} className="text-[#85683A] mt-0.5 shrink-0" aria-hidden="true" />
                    <span><strong className="text-[var(--ink)]">{p.peptide}</strong> — <span className="text-[var(--graphite)]">{p.reason}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Practical Measures</h3>
              <ul className="space-y-2 text-sm text-[var(--graphite)]">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>Use amber glass vials (provided by OmniQure) for all reconstituted solutions</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>Wrap highly photosensitive vials in aluminium foil for additional UV blocking</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>Perform reconstitution under reduced or red-spectrum lighting for sensitive peptides</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>Store in a closed box or drawer within the fridge — avoid fridge door shelves</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>Minimise exposure time when drawing volumes — cap immediately after use</span></li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-[var(--cobalt)] mt-0.5 shrink-0" aria-hidden="true" /><span>For oxidation-sensitive peptides (Met, Cys): purge reconstituted vials with argon gas before sealing</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Contamination */}
        <section id="contamination" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <ShieldAlert size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Contamination Prevention</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            Microbial and particulate contamination of peptide solutions is the most common cause of compromised research results. Once introduced, contamination cannot be reversed. Sterile technique must be maintained throughout the reconstitution and aliquoting process.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Essential Sterile Technique</h3>
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
                    <div className="w-24 shrink-0 font-semibold text-[var(--graphite)]">{s.step}</div>
                    <div className="text-[var(--graphite)]">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB] p-5">
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-[#85683A]" aria-hidden="true" />Signs of Compromised Peptide Solutions</h3>
              <ul className="space-y-2 text-sm text-[var(--graphite)]">
                <li className="flex gap-2"><span>•</span><span><strong>Turbidity or cloudiness</strong> after full reconstitution may indicate aggregation or microbial contamination</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Visible particulates</strong> floating or settled at the bottom of the vial</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Unusual colour change</strong> — yellowing of normally clear solutions (common with oxidised Trp/Tyr)</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Off-odour</strong> when opening a previously stable vial</span></li>
                <li className="flex gap-2"><span>•</span><span><strong>Foam that does not dissipate</strong> — may indicate protein aggregation from agitation or temperature shock</span></li>
              </ul>
              <div className="mt-4 pt-4 border-t border-[rgba(11,18,32,0.09)]">
                <p className="text-xs text-[var(--ink)] font-semibold">If any of these signs are present — discard the solution. Do not attempt to filter and re-use a contaminated peptide solution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Shipping */}
        <section id="shipping" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <Package size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Receiving & Shipping Conditions</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            OmniQure peptides ship in thermally insulated packaging with gel packs rated for 48–72 hour ambient protection. Lyophilised peptides are inherently more stable in transit than reconstituted solutions, which is why we never ship reconstituted product.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            {[
              {
                title: "On Arrival — First Steps",
                icon: Package,
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
                items: [
                  "Fridge (2–8 °C) is for reconstituted solutions only",
                  "Lyophilised peptides stored at fridge temperature will absorb moisture from repeated door-opening",
                  "Always transfer dry, sealed vials to the freezer (−20 °C minimum)",
                ],
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <card.icon size={16} className="text-[var(--graphite)]" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{card.title}</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-[var(--graphite)]">
                  {card.items.map(it => (
                    <li key={it} className="flex gap-2"><span className="mt-0.5 text-[rgba(74,85,104,0.45)]">•</span><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Stability by class */}
        <section id="stability" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <FlaskConical size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Peptide Stability by Class</h2>
          </div>
          <p className="text-sm text-[var(--graphite)] mb-5 leading-relaxed">
            Stability varies by sequence composition, disulfide bond content, and molecular weight. The table below provides general guidance — always refer to product-specific documentation for specific stability data.
          </p>
          <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F2F0EB] border-b border-[rgba(11,18,32,0.09)]">
                  <th className="text-left px-4 py-3 font-medium uppercase text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Peptide Class</th>
                  <th className="text-left px-4 py-3 font-medium uppercase text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Examples</th>
                  <th className="text-left px-4 py-3 font-medium uppercase text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Lyophilised (−20 °C)</th>
                  <th className="text-left px-4 py-3 font-medium uppercase text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Reconstituted (2–8 °C)</th>
                  <th className="text-left px-4 py-3 font-medium uppercase text-[var(--graphite)]" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Key Sensitivities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(11,18,32,0.06)]">
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
                  <tr key={row.cls} className={i % 2 === 0 ? "bg-white" : "bg-[#F2F0EB]"}>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">{row.cls}</td>
                    <td className="px-4 py-3 text-[var(--graphite)] text-xs">{row.ex}</td>
                    <td className="px-4 py-3 text-[var(--graphite)]">{row.lyoph}</td>
                    <td className="px-4 py-3 text-[var(--graphite)]">{row.recon}</td>
                    <td className="px-4 py-3 text-[var(--graphite)] text-xs">{row.sens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 8: Checklist */}
        <section id="checklist" className="mb-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB]">
              <CheckCircle2 size={18} className="text-[var(--graphite)]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ink)]" style={{ letterSpacing: "-0.015em" }}>Quick Reference Checklist</h2>
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
              <div key={col.title} className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-5">
                <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[var(--graphite)]">
                      <CheckCircle2 size={14} className="text-[var(--cobalt)] shrink-0" aria-hidden="true" />
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
          <h2 className="text-xl font-semibold text-[var(--ink)] mb-5" style={{ letterSpacing: "-0.015em" }}>Frequently Asked Questions</h2>
          <FAQ />
        </section>

        {/* Related links */}
        <div className="rounded-2xl border border-[rgba(11,18,32,0.09)] bg-[#F2F0EB] p-6">
          <h3 className="text-base font-semibold text-[var(--ink)] mb-4 flex items-center gap-2" style={{ letterSpacing: "-0.01em" }}>
            <BookOpen size={16} className="text-[var(--cobalt)]" aria-hidden="true" />
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
                className="block rounded-2xl border border-[rgba(11,18,32,0.09)] bg-white p-4 hover:border-[rgba(11,18,32,0.2)] transition-colors group"
              >
                <p className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--cobalt)] transition-colors">{link.label}</p>
                <p className="text-xs text-[var(--graphite)] mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
