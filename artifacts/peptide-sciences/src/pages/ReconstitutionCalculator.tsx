import { useState, useMemo } from "react";
import { FlaskConical, Droplets, Syringe, Info, ChevronDown, ChevronUp } from "lucide-react";

type UnitMode = "mcg" | "mg";

function round(n: number, decimals: number) {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

const COMMON_AMOUNTS = [2, 5, 10, 20, 30, 50, 100];
const COMMON_VOLUMES = [1, 2, 3, 5, 10];

export default function ReconstitutionCalculator() {
  // --- Reconstitution inputs ---
  const [peptideMg, setPeptideMg] = useState<string>("10");
  const [bacWaterMl, setBacWaterMl] = useState<string>("2");

  // --- Dose inputs ---
  const [doseUnit, setDoseUnit] = useState<UnitMode>("mcg");
  const [doseValue, setDoseValue] = useState<string>("250");

  // --- Guide accordion ---
  const [guideOpen, setGuideOpen] = useState(false);

  const peptideNum = parseFloat(peptideMg) || 0;
  const waterNum = parseFloat(bacWaterMl) || 0;
  const doseNum = parseFloat(doseValue) || 0;

  const concentrationMcgPerMl = useMemo(() => {
    if (!peptideNum || !waterNum) return 0;
    return (peptideNum * 1000) / waterNum;
  }, [peptideNum, waterNum]);

  const concentrationMgPerMl = concentrationMcgPerMl / 1000;

  const doseMcg = doseUnit === "mcg" ? doseNum : doseNum * 1000;

  const injectionVolumeMl = useMemo(() => {
    if (!concentrationMcgPerMl || !doseMcg) return 0;
    return doseMcg / concentrationMcgPerMl;
  }, [concentrationMcgPerMl, doseMcg]);

  const injectionVolumeUl = injectionVolumeMl * 1000;

  // Insulin syringe: 100 IU = 1 mL → 1 IU = 0.01 mL
  const insulinUnits = injectionVolumeMl * 100;

  const totalDoses = useMemo(() => {
    if (!doseMcg) return 0;
    return (peptideNum * 1000) / doseMcg;
  }, [peptideNum, doseMcg]);

  const hasResult = concentrationMcgPerMl > 0;
  const hasDose = hasResult && doseMcg > 0;

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #E2E8F0",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#0F172A",
    backgroundColor: "#fff",
    outline: "none",
    fontFamily: "'Arimo', Arial, sans-serif",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "80vh" }}>
      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff" }}>
        <div className="max-w-[900px] mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <FlaskConical size={20} />
            </div>
            <h1 className="font-bold" style={{ fontSize: "24px" }}>Peptide Reconstitution Calculator</h1>
          </div>
          <p style={{ fontSize: "14px", opacity: 0.82, maxWidth: "560px", lineHeight: 1.6 }}>
            Calculate the exact concentration and injection volume for your lyophilized peptide research compounds.
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-8 space-y-5">

        {/* Research disclaimer */}
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <Info size={14} style={{ color: "#B45309", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "12px", color: "#92400E", lineHeight: 1.6 }}>
            <strong>Research Use Only.</strong> This calculator is for in-vitro laboratory research planning. Not intended to guide human administration. Must be 21+ to purchase research peptides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1: Reconstitution */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 4px 20px rgba(15,23,42,0.06)" }}>
            <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff" }}>
              <Droplets size={16} />
              <span className="font-bold" style={{ fontSize: "13px" }}>Step 1 — Reconstitution</span>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label style={labelStyle}>Peptide Amount</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={peptideMg}
                    onChange={e => setPeptideMg(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 10"
                  />
                  <span className="font-bold flex-shrink-0" style={{ color: "#64748B", fontSize: "13px" }}>mg</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_AMOUNTS.map(v => (
                    <button
                      key={v}
                      onClick={() => setPeptideMg(String(v))}
                      className="rounded-full font-medium transition-colors"
                      style={{
                        fontSize: "11px",
                        padding: "2px 10px",
                        backgroundColor: parseFloat(peptideMg) === v ? "#EEF4FF" : "#F8FAFC",
                        color: parseFloat(peptideMg) === v ? "#1B5CB5" : "#64748B",
                        border: `1px solid ${parseFloat(peptideMg) === v ? "#BFDBFE" : "#E2E8F0"}`,
                        cursor: "pointer",
                      }}
                    >
                      {v}mg
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>BAC Water to Add</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={bacWaterMl}
                    onChange={e => setBacWaterMl(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 2"
                  />
                  <span className="font-bold flex-shrink-0" style={{ color: "#64748B", fontSize: "13px" }}>mL</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_VOLUMES.map(v => (
                    <button
                      key={v}
                      onClick={() => setBacWaterMl(String(v))}
                      className="rounded-full font-medium transition-colors"
                      style={{
                        fontSize: "11px",
                        padding: "2px 10px",
                        backgroundColor: parseFloat(bacWaterMl) === v ? "#EEF4FF" : "#F8FAFC",
                        color: parseFloat(bacWaterMl) === v ? "#1B5CB5" : "#64748B",
                        border: `1px solid ${parseFloat(bacWaterMl) === v ? "#BFDBFE" : "#E2E8F0"}`,
                        cursor: "pointer",
                      }}
                    >
                      {v}mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Concentration result */}
              <div className="rounded-xl p-4" style={{ backgroundColor: hasResult ? "#EEF4FF" : "#F8FAFC", border: `1px solid ${hasResult ? "#BFDBFE" : "#E2E8F0"}`, transition: "all 0.2s" }}>
                <p className="font-bold mb-1" style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resulting Concentration</p>
                {hasResult ? (
                  <div className="space-y-1">
                    <p className="font-bold" style={{ fontSize: "26px", color: "#1B5CB5", lineHeight: 1.1 }}>
                      {round(concentrationMcgPerMl, 1).toLocaleString()} <span style={{ fontSize: "14px", fontWeight: 600 }}>mcg/mL</span>
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748B" }}>
                      = {round(concentrationMgPerMl, 4)} mg/mL
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "14px", color: "#94A3B8" }}>Enter values above</p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Dose */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 4px 20px rgba(15,23,42,0.06)" }}>
            <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ background: "linear-gradient(90deg, #059669 0%, #10b981 100%)", color: "#fff" }}>
              <Syringe size={16} />
              <span className="font-bold" style={{ fontSize: "13px" }}>Step 2 — Dose Volume</span>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label style={labelStyle}>Desired Dose per Injection</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={doseValue}
                    onChange={e => setDoseValue(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. 250"
                  />
                  {/* Unit toggle */}
                  <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid #E2E8F0" }}>
                    {(["mcg", "mg"] as UnitMode[]).map(u => (
                      <button
                        key={u}
                        onClick={() => setDoseUnit(u)}
                        className="font-bold transition-colors"
                        style={{
                          padding: "8px 12px",
                          fontSize: "12px",
                          backgroundColor: doseUnit === u ? "#1B5CB5" : "#fff",
                          color: doseUnit === u ? "#fff" : "#64748B",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[100, 250, 500, 1000, 2000].map(v => (
                    <button
                      key={v}
                      onClick={() => { setDoseValue(String(v)); setDoseUnit("mcg"); }}
                      className="rounded-full font-medium transition-colors"
                      style={{
                        fontSize: "11px",
                        padding: "2px 10px",
                        backgroundColor: parseFloat(doseValue) === v && doseUnit === "mcg" ? "#ECFDF5" : "#F8FAFC",
                        color: parseFloat(doseValue) === v && doseUnit === "mcg" ? "#059669" : "#64748B",
                        border: `1px solid ${parseFloat(doseValue) === v && doseUnit === "mcg" ? "#A7F3D0" : "#E2E8F0"}`,
                        cursor: "pointer",
                      }}
                    >
                      {v}mcg
                    </button>
                  ))}
                </div>
              </div>

              {/* Injection volume result */}
              <div className="rounded-xl p-4" style={{ backgroundColor: hasDose ? "#ECFDF5" : "#F8FAFC", border: `1px solid ${hasDose ? "#A7F3D0" : "#E2E8F0"}`, transition: "all 0.2s" }}>
                <p className="font-bold mb-1" style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Injection Volume</p>
                {hasDose ? (
                  <div className="space-y-1.5">
                    <p className="font-bold" style={{ fontSize: "26px", color: "#059669", lineHeight: 1.1 }}>
                      {round(injectionVolumeMl, 4)} <span style={{ fontSize: "14px", fontWeight: 600 }}>mL</span>
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748B" }}>
                      = {round(injectionVolumeUl, 2)} μL
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748B" }}>
                      = {round(insulinUnits, 2)} IU on insulin syringe
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "14px", color: "#94A3B8" }}>Enter dose above</p>
                )}
              </div>

              {/* Total doses */}
              {hasDose && (
                <div className="rounded-xl p-3.5 flex items-center justify-between" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>Total doses per vial</span>
                  <span className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
                    {round(totalDoses, 1)}×
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary card */}
        {hasDose && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 4px 20px rgba(15,23,42,0.06)" }}>
            <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFF" }}>
              <FlaskConical size={15} style={{ color: "#1B5CB5" }} />
              <span className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>Reconstitution Summary</span>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Vial Amount", value: `${peptideMg} mg` },
                  { label: "BAC Water Added", value: `${bacWaterMl} mL` },
                  { label: "Concentration", value: `${round(concentrationMcgPerMl, 1).toLocaleString()} mcg/mL` },
                  { label: "Dose Volume", value: `${round(insulinUnits, 2)} IU` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}>
                    <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                    <p className="font-bold mt-1" style={{ fontSize: "15px", color: "#0F172A" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How to reconstitute guide */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.04)" }}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            onClick={() => setGuideOpen(o => !o)}
          >
            <div className="flex items-center gap-2.5">
              <Info size={15} style={{ color: "#1B5CB5" }} />
              <span className="font-bold" style={{ fontSize: "14px", color: "#0F172A" }}>How to Reconstitute a Peptide</span>
            </div>
            {guideOpen ? <ChevronUp size={16} style={{ color: "#64748B" }} /> : <ChevronDown size={16} style={{ color: "#64748B" }} />}
          </button>

          {guideOpen && (
            <div className="px-5 pb-5" style={{ borderTop: "1px solid #F1F5F9" }}>
              <div className="space-y-4 pt-4">
                {[
                  {
                    step: "1",
                    title: "Allow vial to reach room temperature",
                    body: "Remove the lyophilized peptide vial from storage and allow it to equilibrate to room temperature for 15–20 minutes before opening. This prevents condensation from entering the vial.",
                  },
                  {
                    step: "2",
                    title: "Prepare bacteriostatic water",
                    body: "Draw the calculated volume of bacteriostatic water (BAC water) into a sterile insulin syringe. Bacteriostatic water contains 0.9% benzyl alcohol as a preservative, extending the reconstituted peptide's shelf life.",
                  },
                  {
                    step: "3",
                    title: "Add water slowly to the vial",
                    body: "Insert the syringe at an angle and inject the BAC water slowly against the glass wall — do not inject it directly onto the lyophilized powder. This prevents foaming and peptide degradation from mechanical agitation.",
                  },
                  {
                    step: "4",
                    title: "Gently swirl — do not shake",
                    body: "Gently swirl the vial in a slow circular motion until the powder fully dissolves. Never shake the vial. Vigorous agitation can break peptide bonds and reduce potency.",
                  },
                  {
                    step: "5",
                    title: "Store correctly",
                    body: "Store reconstituted peptides at 2–8°C (refrigerator) and use within 28 days for optimal potency. Protect from light. Do not freeze reconstituted solutions.",
                  },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-3.5">
                    <div
                      className="flex items-center justify-center font-bold flex-shrink-0 rounded-full"
                      style={{ width: "28px", height: "28px", backgroundColor: "#EEF4FF", color: "#1B5CB5", fontSize: "12px", marginTop: "1px" }}
                    >
                      {step}
                    </div>
                    <div>
                      <p className="font-bold" style={{ fontSize: "13.5px", color: "#0F172A" }}>{title}</p>
                      <p className="mt-1" style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center" style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.6 }}>
          This calculator is provided for research planning purposes only. OmniQure Peptide Research Institute makes no representations regarding the suitability of these calculations for any specific application. All products are for in-vitro laboratory research use only.
        </p>
      </div>
    </div>
  );
}
