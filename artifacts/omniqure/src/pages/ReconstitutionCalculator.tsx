import { useState } from "react";
import { Link } from "wouter";
import { FlaskConical, ChevronDown, Calculator, ArrowRight, Droplets, AlertTriangle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/useSEO";

function round(n: number, d: number) {
  return Math.round(n * 10 ** d) / 10 ** d;
}


function SyringeSVG({ iuValue }: { iuValue: number }) {
  const MAX = 100;
  const clamped = Math.min(Math.max(iuValue, 0), MAX);
  const pct = clamped / MAX;

  // Layout — needle on RIGHT, 0 IU at RIGHT end, 100 IU at LEFT end
  const W = 480;
  const H = 92;
  const bx = 46;   // barrel left edge (plunger side)
  const bw = 340;  // barrel width
  const by = 28;
  const bh = 26;
  const midY = by + bh / 2;

  // 0 IU → x = bx + bw (needle end)
  // N IU → x = bx + bw - (N/MAX)*bw
  const iuToX = (iu: number) => bx + bw - (iu / MAX) * bw;

  const fillStartX = iuToX(clamped); // plunger stopper position
  const fillEndX   = bx + bw;        // needle end (always right)
  const fillW      = fillEndX - fillStartX;

  const indicatorX = fillStartX; // "draw to this line" indicator is at stopper

  // Ticks every 5 IU, labels every 10 IU
  const ticks: { x: number; iu: number; major: boolean }[] = [];
  for (let i = 0; i <= MAX; i += 5) {
    ticks.push({ x: iuToX(i), iu: i, major: i % 10 === 0 });
  }

  const overflowing = iuValue > MAX;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block", maxWidth: "480px", margin: "0 auto" }}
    >
      {/* Plunger handle (left) */}
      <rect x={0} y={by - 8} width={6} height={bh + 16} rx={2} fill="#90A4C8" />
      <rect x={0} y={by - 14} width={28} height={7} rx={3} fill="#7090B8" />
      <rect x={0} y={by + bh + 7} width={28} height={7} rx={3} fill="#7090B8" />
      {/* Plunger rod */}
      <rect x={6} y={midY - 4} width={bx - 6} height={8} rx={2} fill="#B8C8E0" />
      {/* Plunger stopper (rubber tip) — sits at the current IU line */}
      {!overflowing && clamped >= 0 && (
        <rect
          x={indicatorX - 5}
          y={by - 1}
          width={8}
          height={bh + 2}
          rx={3}
          fill="#4E68C2"
          opacity={0.85}
        />
      )}

      {/* Barrel background */}
      <rect x={bx} y={by} width={bw} height={bh} rx={4} fill="#E8F2DE" stroke="#C8DDB4" strokeWidth={1.5} />

      {/* Fluid fill — from stopper to needle end */}
      {fillW > 0 && !overflowing && (
        <rect x={fillStartX} y={by + 1} width={fillW} height={bh - 2} fill="rgba(59, 98, 171,0.18)" />
      )}
      {overflowing && (
        <rect x={bx} y={by + 1} width={bw} height={bh - 2} fill="rgba(220,38,38,0.12)" />
      )}

      {/* Ticks — drawn on top of fill */}
      {ticks.map(({ x, iu, major }) => (
        <g key={iu}>
          <line
            x1={x} y1={major ? by : by + bh * 0.45}
            x2={x} y2={by + bh}
            stroke={major ? "#475569" : "#94A3B8"}
            strokeWidth={major ? 1.5 : 1}
          />
          {major && (
            <text
              x={x} y={by - 6}
              textAnchor="middle"
              fontSize="8.5"
              fill="#64748B"
              fontWeight="600"
              fontFamily="Inter, Arial, sans-serif"
            >
              {iu}
            </text>
          )}
        </g>
      ))}

      {/* Needle hub */}
      <polygon
        points={`${bx + bw},${by} ${bx + bw + 22},${midY - 5} ${bx + bw + 22},${midY + 5} ${bx + bw},${by + bh}`}
        fill="#B8C8E0"
      />
      {/* Needle shaft */}
      <polygon
        points={`${bx + bw + 22},${midY - 2.5} ${W - 4},${midY} ${bx + bw + 22},${midY + 2.5}`}
        fill="#94A3B8"
      />

      {/* Indicator label below — near needle for small doses */}
      {clamped > 0 && !overflowing && (
        <>
          <line
            x1={indicatorX} y1={by + bh + 2}
            x2={indicatorX} y2={H - 12}
            stroke="#4E68C2" strokeWidth={1.5} strokeDasharray="3,2"
          />
          <text
            x={Math.min(indicatorX, bx + bw - 2)}
            y={H - 2}
            textAnchor={pct < 0.15 ? "end" : "middle"}
            fontSize="9.5"
            fill="#4E68C2"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
          >
            ← draw to {round(iuValue, 1)} units
          </text>
        </>
      )}

      {overflowing && (
        <text x={bx + bw / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
          &gt;100 units — split across multiple aliquots
        </text>
      )}
    </svg>
  );
}

const inputCls = "w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--cobalt)]";
const inputStyle = { borderColor: "var(--hairline)", background: "#fff", color: "var(--ink)" } as const;

function UnitToggle({ options, value, onChange }: { options: readonly ("mg" | "mcg")[]; value: "mg" | "mcg"; onChange: (v: "mg" | "mcg") => void }) {
  return (
    <div className="flex gap-1" role="group">
      {options.map((u) => (
        <button
          key={u}
          type="button"
          aria-pressed={value === u}
          onClick={() => onChange(u)}
          className="px-2.5 py-2.5 text-[13px] font-semibold rounded-lg border transition-colors"
          style={value === u
            ? { background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }
            : { background: "#fff", color: "var(--graphite)", borderColor: "var(--hairline)" }}
        >
          {u}
        </button>
      ))}
    </div>
  );
}

function ResultRow({ label, value, sub, big = false }: { label: string; value: string; sub?: string; big?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${big ? "" : "border-t pt-3"}`} style={big ? undefined : { borderColor: "var(--hairline)" }}>
      <span style={{ fontSize: big ? 13 : 12.5, color: "var(--graphite)" }}>{label}</span>
      <span className="text-right">
        <span className="font-bold tabular-nums leading-none" style={{ fontSize: big ? 26 : 15, color: big ? "var(--cobalt)" : "var(--ink)" }}>{value}</span>
        {sub && <span className="ml-1.5" style={{ fontSize: 12, color: "var(--graphite)" }}>{sub}</span>}
      </span>
    </div>
  );
}

const CALC_FAQ = [
  { q: "How do you calculate peptide reconstitution?", a: "Divide the peptide amount in the vial by the volume of bacteriostatic water added to get the concentration. Then divide your target amount by that concentration to get the volume to draw. For example, 5 mg in 2 mL gives 2.5 mg/mL, so a 250 mcg measurement is 0.1 mL, or 10 units on a U-100 syringe." },
  { q: "How much bacteriostatic water should I add to a peptide vial?", a: "There is no single correct amount. More water makes each drawn unit contain less peptide, which makes small amounts easier to measure precisely. 1 to 3 mL is common for 5 to 10 mg vials. Enter different volumes above to compare." },
  { q: "What is a unit on an insulin syringe?", a: "A standard U-100 insulin syringe has 100 units per millilitre, so 1 unit = 0.01 mL and 10 units = 0.1 mL. The calculator converts every result into units for you." },
  { q: "How many doses are in one vial?", a: "Divide the total amount in the vial by your target amount per draw. The calculator shows this as measurements per vial." },
  { q: "What is bacteriostatic water?", a: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol, which inhibits bacterial growth so a vial can be accessed multiple times during a research protocol." },
  { q: "Is this peptide calculator free?", a: "Yes. The calculator is completely free and runs instantly in your browser. Nothing you enter is stored or sent anywhere." },
];

export default function ReconstitutionCalculator() {
  useSEO({
    title: "Peptide Reconstitution Calculator",
    description: "Free peptide reconstitution calculator — enter your peptide mass (mg) and desired concentration to calculate exactly how much BAC water to add. Supports µg/ml and IU dosing.",
    canonicalPath: "/calculator",
  });
  const [peptideAmt, setPeptideAmt] = useState("5");
  const [peptideUnit, setPeptideUnit] = useState<"mg" | "mcg">("mg");
  const [waterMl, setWaterMl] = useState("2");
  const [doseValue, setDoseValue] = useState("250");
  const [doseUnit, setDoseUnit] = useState<"mcg" | "mg">("mcg");

  const pRaw = parseFloat(peptideAmt) || 0;
  const pNum = peptideUnit === "mcg" ? pRaw / 1000 : pRaw;
  const wNum = parseFloat(waterMl) || 0;
  const dNum = parseFloat(doseValue) || 0;

  // Always work in mcg internally
  const doseMcgNorm = doseUnit === "mg" ? dNum * 1000 : dNum;

  const concentrationMcgMl = pNum && wNum ? (pNum * 1000) / wNum : 0;
  const volumeMl = concentrationMcgMl && doseMcgNorm ? doseMcgNorm / concentrationMcgMl : 0;
  const insulinIU = volumeMl * 100;
  const totalDoses = doseMcgNorm && pNum ? Math.floor((pNum * 1000) / doseMcgNorm) : 0;

  const ready = concentrationMcgMl > 0 && doseMcgNorm > 0;

  const card = "rounded-2xl border p-5 sm:p-6";
  const labelText = "mb-1.5 block text-[12.5px] font-semibold";

  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#fff", minHeight: "80vh" }}>
      <PageHero crumbs={[{ label: "Calculator" }]} eyebrow="Free research tool" icon={Calculator} title="Peptide Reconstitution Calculator">
        Enter your vial size, the bacteriostatic water you're adding and your target amount to get the exact concentration, the volume to draw and the reading in insulin-syringe units. For laboratory research use only.
      </PageHero>

      <section className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={card} style={{ borderColor: "var(--hairline)", background: "#fff" }}>
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold" style={{ color: "var(--ink)" }}>
              <FlaskConical size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> Your vial
            </h2>
            <label className="block">
              <span className={labelText} style={{ color: "var(--ink)" }}>Peptide in the vial</span>
              <div className="flex gap-2">
                <input type="number" min="0" step="any" inputMode="decimal" value={peptideAmt} onChange={(e) => setPeptideAmt(e.target.value)} className={inputCls} style={inputStyle} />
                <UnitToggle options={["mg", "mcg"] as const} value={peptideUnit} onChange={setPeptideUnit} />
              </div>
            </label>
            <label className="mt-4 block">
              <span className={labelText} style={{ color: "var(--ink)" }}>Bacteriostatic water added</span>
              <div className="relative">
                <input type="number" min="0" step="any" inputMode="decimal" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} className={inputCls} style={inputStyle} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold" style={{ color: "var(--graphite)" }}>mL</span>
              </div>
              <span className="mt-1 block text-[11.5px]" style={{ color: "var(--graphite)" }}>More water = lower concentration = finer measurement.</span>
            </label>
            <label className="mt-4 block">
              <span className={labelText} style={{ color: "var(--ink)" }}>Target amount per draw</span>
              <div className="flex gap-2">
                <input type="number" min="0" step="any" inputMode="decimal" value={doseValue} onChange={(e) => setDoseValue(e.target.value)} className={inputCls} style={inputStyle} />
                <UnitToggle
                  options={["mcg", "mg"] as const}
                  value={doseUnit}
                  onChange={(u) => { if (u !== doseUnit) { setDoseValue(String(round(u === "mg" ? dNum / 1000 : dNum * 1000, 4))); setDoseUnit(u); } }}
                />
              </div>
            </label>
          </div>

          <div className={card} style={{ borderColor: "var(--hairline)", background: "linear-gradient(135deg, rgba(244,246,250,0.6), #fff)" }} aria-live="polite">
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold" style={{ color: "var(--ink)" }}>
              <Calculator size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> Draw this much
            </h2>
            {ready ? (
              <div className="space-y-3">
                <ResultRow big label="Volume to draw" value={`${round(volumeMl, 3)} mL`} sub={`= ${round(insulinIU, 1)} units`} />
                <div className="rounded-xl border p-3" style={{ borderColor: "var(--hairline)", background: "#fff" }}>
                  <SyringeSVG iuValue={insulinIU} />
                  <p className="mt-1 text-center text-[11px]" style={{ color: "var(--graphite)" }}>
                    Fill to <b style={{ color: "var(--ink)" }}>{round(insulinIU, 1)} units</b> on a U-100 insulin syringe
                  </p>
                </div>
                <ResultRow label="Concentration" value={`${round(concentrationMcgMl / 1000, 3)} mg/mL`} sub={`= ${round(concentrationMcgMl, 1).toLocaleString()} mcg/mL`} />
                <ResultRow label="Measurements per vial" value={String(totalDoses)} sub="draws" />
              </div>
            ) : (
              <p className="rounded-xl border border-dashed p-6 text-center text-[13px]" style={{ borderColor: "var(--hairline)", color: "var(--graphite)" }}>
                Fill in all three fields to see your result.
              </p>
            )}
            <p className="mt-5 flex items-start gap-1.5 border-t pt-4 text-[11px] leading-relaxed" style={{ borderColor: "var(--hairline)", color: "var(--graphite)" }}>
              <AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" />
              For laboratory research and measurement only. Not medical advice, and not for human or veterinary use. Always verify calculations independently.
            </p>
          </div>
        </div>

      </section>

      <section className="border-t" style={{ borderColor: "var(--hairline)", background: "rgba(244,246,250,0.15)" }}>
        <div className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>How the peptide calculator works</h2>
              <div className="mt-4 space-y-4 text-[14px] leading-[1.75]" style={{ color: "var(--graphite)" }}>
                <p>
                  Reconstitution is simply mixing a lyophilised (freeze-dried) peptide with a liquid so it can be measured accurately. The maths is two short steps:
                </p>
                <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--hairline)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>1 · Concentration</p>
                  <p className="mt-1 text-[13px]">
                    Peptide amount ÷ water volume. Example: 5 mg ÷ 2 mL = <b style={{ color: "var(--ink)" }}>2.5 mg/mL</b> (2,500 mcg/mL).
                  </p>
                  <p className="mt-3 text-[13px] font-semibold" style={{ color: "var(--ink)" }}>2 · Volume to draw</p>
                  <p className="mt-1 text-[13px]">
                    Target amount ÷ concentration. Example: 250 mcg ÷ 2,500 mcg/mL = <b style={{ color: "var(--ink)" }}>0.1 mL</b> = <b style={{ color: "var(--ink)" }}>10 units</b> on a U-100 syringe.
                  </p>
                </div>
                <p>
                  A <b style={{ color: "var(--ink)" }}>U-100 insulin syringe</b> has 100 units per millilitre, so 1 unit = 0.01 mL. The calculator converts your draw volume into units automatically so you can measure to the exact graduation. Adding more bacteriostatic water lowers the concentration, which makes each unit represent a smaller amount and improves precision.
                </p>
              </div>

              <h2 className="mt-10 text-[22px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Frequently asked questions</h2>
              <div className="mt-4 divide-y rounded-2xl border bg-white" style={{ borderColor: "var(--hairline)" }}>
                {CALC_FAQ.map((f) => (
                  <details key={f.q} className="group px-5 py-4" style={{ borderColor: "var(--hairline)" }}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold [&::-webkit-details-marker]:hidden" style={{ color: "var(--ink)" }}>
                      {f.q}
                      <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: "var(--graphite)" }} aria-hidden="true" />
                    </summary>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--graphite)" }}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--hairline)" }}>
                <h3 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                  <Droplets size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> You'll also need
                </h3>
                <p className="mt-1.5 text-[12.5px]" style={{ color: "var(--graphite)" }}>Bacteriostatic water to reconstitute your vial.</p>
                <Link href="/bac-water" className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
                  Bacteriostatic water <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              {[
                { t: "Reconstitution guide", d: "Step-by-step method and storage protocol.", l: "Read the guide", h: "/storage-guide" },
                { t: "Browse peptides", d: "99%+ HPLC-verified, COA per batch, same-day dispatch.", l: "All peptides", h: "/all-peptides" },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--hairline)" }}>
                  <h3 className="text-[14px] font-bold" style={{ color: "var(--ink)" }}>{c.t}</h3>
                  <p className="mt-1.5 text-[12.5px]" style={{ color: "var(--graphite)" }}>{c.d}</p>
                  <Link href={c.h} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-[var(--ink)]" style={{ color: "var(--cobalt)" }}>
                    {c.l} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
