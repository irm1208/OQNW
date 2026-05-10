import { useState, useMemo } from "react";
import { FlaskConical, ChevronDown, ChevronUp } from "lucide-react";

function round(n: number, d: number) {
  return Math.round(n * 10 ** d) / 10 ** d;
}

const VIAL_PRESETS = [2, 5, 10, 20, 50];
const WATER_PRESETS = [1, 2, 3, 5];
const DOSE_PRESETS_MCG = [100, 250, 500, 1000];
const DOSE_PRESETS_MG = [0.1, 0.25, 0.5, 1, 2];

function SyringeSVG({ iuValue }: { iuValue: number }) {
  const MAX = 100;
  const clamped = Math.min(Math.max(iuValue, 0), MAX);
  const pct = clamped / MAX;

  // layout
  const W = 460;
  const H = 88;
  const bx = 52;   // barrel start x
  const bw = 340;  // barrel width (0→100 IU span)
  const by = 28;   // barrel top y
  const bh = 26;   // barrel height
  const midY = by + bh / 2;

  const fillW = pct * bw;
  const indicatorX = bx + fillW;

  const ticks: { x: number; label: string | null }[] = [];
  for (let i = 0; i <= MAX; i += 2) {
    ticks.push({
      x: bx + (i / MAX) * bw,
      label: i % 20 === 0 ? String(i) : null,
    });
  }

  const overflowing = iuValue > MAX;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block", maxWidth: "460px", margin: "0 auto" }}
    >
      {/* Plunger handle */}
      <rect x={0} y={by - 8} width={6} height={bh + 16} rx={2} fill="#90A4C8" />
      <rect x={0} y={by - 14} width={28} height={7} rx={3} fill="#7090B8" />
      <rect x={0} y={by + bh + 7} width={28} height={7} rx={3} fill="#7090B8" />
      {/* Plunger rod */}
      <rect x={6} y={midY - 4} width={bx - 6} height={8} rx={2} fill="#B8C8E0" />

      {/* Barrel background */}
      <rect x={bx} y={by} width={bw} height={bh} rx={4} fill="#EEF4FF" stroke="#BFDBFE" strokeWidth={1.5} />

      {/* Fill */}
      {fillW > 0 && (
        <rect x={bx} y={by} width={fillW} height={bh} rx={4} fill="rgba(27,92,181,0.22)" />
      )}

      {/* Ticks */}
      {ticks.map(({ x, label }) => (
        <g key={x}>
          <line
            x1={x} y1={label ? by : by + bh * 0.5}
            x2={x} y2={by + bh}
            stroke={label ? "#64748B" : "#CBD5E1"}
            strokeWidth={label ? 1.5 : 1}
          />
          {label && (
            <text x={x} y={by - 5} textAnchor="middle" fontSize="8.5" fill="#64748B" fontWeight="600" fontFamily="Arimo, Arial, sans-serif">
              {label}
            </text>
          )}
        </g>
      ))}

      {/* Needle hub (tapered) */}
      <polygon
        points={`${bx + bw},${by} ${bx + bw + 22},${midY - 5} ${bx + bw + 22},${midY + 5} ${bx + bw},${by + bh}`}
        fill="#B8C8E0"
      />
      {/* Needle shaft */}
      <line x1={bx + bw + 22} y1={midY - 3} x2={bx + bw + 22} y2={midY + 3} stroke="#B8C8E0" strokeWidth={1} />
      <polygon
        points={`${bx + bw + 22},${midY - 2.5} ${W - 4},${midY} ${bx + bw + 22},${midY + 2.5}`}
        fill="#94A3B8"
      />

      {/* Indicator line at current IU */}
      {clamped > 0 && !overflowing && (
        <>
          <line
            x1={indicatorX} y1={by + bh}
            x2={indicatorX} y2={H - 10}
            stroke="#1B5CB5" strokeWidth={2} strokeDasharray="3,2"
          />
          <circle cx={indicatorX} cy={by + bh} r={3} fill="#1B5CB5" />
          <text
            x={indicatorX} y={H - 1}
            textAnchor={pct > 0.85 ? "end" : pct < 0.15 ? "start" : "middle"}
            fontSize="9.5" fill="#1B5CB5" fontWeight="700" fontFamily="Arimo, Arial, sans-serif"
          >
            {round(iuValue, 1)} IU
          </text>
        </>
      )}

      {overflowing && (
        <text x={bx + bw / 2} y={H - 1} textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="700" fontFamily="Arimo, Arial, sans-serif">
          &gt;100 IU — split across multiple injections
        </text>
      )}
    </svg>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        border: `1.5px solid ${active ? "#1B5CB5" : "#E2E8F0"}`,
        backgroundColor: active ? "#EEF4FF" : "#F8FAFC",
        color: active ? "#1B5CB5" : "#64748B",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  presets,
  onPreset,
  activePreset,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  presets: number[];
  onPreset: (v: number) => void;
  activePreset: number | null;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#94A3B8",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 14px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#0F172A",
            border: "2px solid #E2E8F0",
            borderRadius: "12px",
            outline: "none",
            backgroundColor: "#fff",
            fontFamily: "'Arimo', Arial, sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1B5CB5")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
        />
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#64748B", minWidth: "36px" }}>
          {unit}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {presets.map((v) => (
          <Chip
            key={v}
            label={`${v}${unit}`}
            active={activePreset === v}
            onClick={() => onPreset(v)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ReconstitutionCalculator() {
  const [peptideMg, setPeptideMg] = useState("10");
  const [waterMl, setWaterMl] = useState("2");
  const [doseValue, setDoseValue] = useState("250");
  const [doseUnit, setDoseUnit] = useState<"mcg" | "mg">("mcg");
  const [guideOpen, setGuideOpen] = useState(false);

  const pNum = parseFloat(peptideMg) || 0;
  const wNum = parseFloat(waterMl) || 0;
  const dNum = parseFloat(doseValue) || 0;

  // Always work in mcg internally
  const doseMcgNorm = doseUnit === "mg" ? dNum * 1000 : dNum;

  const concentrationMcgMl = pNum && wNum ? (pNum * 1000) / wNum : 0;
  const volumeMl = concentrationMcgMl && doseMcgNorm ? doseMcgNorm / concentrationMcgMl : 0;
  const volumeUl = volumeMl * 1000;
  const insulinIU = volumeMl * 100;
  const totalDoses = doseMcgNorm && pNum ? (pNum * 1000) / doseMcgNorm : 0;

  const ready = concentrationMcgMl > 0 && doseMcgNorm > 0;

  const DOSE_PRESETS = doseUnit === "mcg" ? DOSE_PRESETS_MCG : DOSE_PRESETS_MG;

  const activeVial = useMemo(
    () => (VIAL_PRESETS.includes(parseFloat(peptideMg)) ? parseFloat(peptideMg) : null),
    [peptideMg]
  );
  const activeWater = useMemo(
    () => (WATER_PRESETS.includes(parseFloat(waterMl)) ? parseFloat(waterMl) : null),
    [waterMl]
  );
  const activeDose = useMemo(
    () => (DOSE_PRESETS.includes(parseFloat(doseValue)) ? parseFloat(doseValue) : null),
    [doseValue, DOSE_PRESETS]
  );

  return (
    <div
      style={{
        fontFamily: "'Arimo', Arial, sans-serif",
        backgroundColor: "#F5F8FC",
        minHeight: "80vh",
        paddingBottom: "60px",
      }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlaskConical size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
              Reconstitution Calculator
            </h1>
          </div>
          <p style={{ fontSize: "14px", opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
            Enter your vial size, water volume, and desired dose to get your exact injection amount.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px 0" }}>

        {/* Main calculator card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1px solid #E8EDF5",
            boxShadow: "0 8px 32px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "28px 28px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

              <Field
                label="Peptide vial size"
                unit="mg"
                value={peptideMg}
                onChange={setPeptideMg}
                presets={VIAL_PRESETS}
                onPreset={(v) => setPeptideMg(String(v))}
                activePreset={activeVial}
              />

              <Field
                label="Bacteriostatic water to add"
                unit="mL"
                value={waterMl}
                onChange={setWaterMl}
                presets={WATER_PRESETS}
                onPreset={(v) => setWaterMl(String(v))}
                activePreset={activeWater}
              />

              {/* Concentration result inline */}
              {concentrationMcgMl > 0 && (
                <div
                  style={{
                    backgroundColor: "#EEF4FF",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #BFDBFE",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>
                    Concentration
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#1B5CB5" }}>
                    {round(concentrationMcgMl, 1).toLocaleString()} mcg/mL
                  </span>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "#F1F5F9", margin: "0 -28px" }} />

              {/* Dose field with mcg/mg toggle */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#94A3B8",
                    marginBottom: "8px",
                  }}
                >
                  Desired dose per injection
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={doseValue}
                    onChange={(e) => setDoseValue(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#0F172A",
                      border: "2px solid #E2E8F0",
                      borderRadius: "12px",
                      outline: "none",
                      backgroundColor: "#fff",
                      fontFamily: "'Arimo', Arial, sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1B5CB5")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                  {/* Unit toggle */}
                  <div
                    style={{
                      display: "flex",
                      borderRadius: "10px",
                      border: "2px solid #E2E8F0",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {(["mcg", "mg"] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          setDoseUnit(u);
                          setDoseValue(u === "mcg" ? "250" : "0.25");
                        }}
                        style={{
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "none",
                          backgroundColor: doseUnit === u ? "#1B5CB5" : "#fff",
                          color: doseUnit === u ? "#fff" : "#64748B",
                          transition: "all 0.15s",
                          fontFamily: "'Arimo', Arial, sans-serif",
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {DOSE_PRESETS.map((v) => (
                    <Chip
                      key={v}
                      label={`${v}${doseUnit}`}
                      active={activeDose === v}
                      onClick={() => setDoseValue(String(v))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result banner */}
          <div
            style={{
              margin: "28px",
              borderRadius: "16px",
              background: ready
                ? "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)"
                : "#F8FAFC",
              border: ready ? "none" : "2px dashed #E2E8F0",
              padding: "24px",
              textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            {ready ? (
              <>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.7)",
                    margin: "0 0 6px",
                  }}
                >
                  Draw up this amount
                </p>
                <p
                  style={{
                    fontSize: "52px",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                    margin: "0 0 4px",
                  }}
                >
                  {round(insulinIU, 1)} <span style={{ fontSize: "24px" }}>IU</span>
                </p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", margin: "8px 0 0" }}>
                  {round(volumeMl, 4)} mL &nbsp;·&nbsp; {round(volumeUl, 2)} μL
                </p>
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {round(totalDoses, 1)} total doses per vial
                </div>
              </>
            ) : (
              <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0 }}>
                Fill in all three fields to see your result
              </p>
            )}
          </div>
        </div>

        {/* Syringe visual */}
        {ready && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #E8EDF5",
              boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
              padding: "20px 20px 14px",
              marginTop: "12px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#94A3B8",
                margin: "0 0 14px",
              }}
            >
              Insulin syringe — draw to this line
            </p>
            <SyringeSVG iuValue={insulinIU} />
          </div>
        )}

        {/* Quick reference table */}
        {concentrationMcgMl > 0 && (
          <div
            style={{
              marginTop: "16px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #E8EDF5",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid #F1F5F9",
                backgroundColor: "#FAFBFF",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Dose reference — {round(concentrationMcgMl, 1).toLocaleString()} mcg/mL
              </p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC" }}>
                  {["Dose", "mL", "μL", "IU (insulin syringe)"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 16px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#94A3B8",
                        textAlign: h === "Dose" ? "left" : "right",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[100, 250, 500, 750, 1000, 2000].map((dose, idx) => {
                  const ml = dose / concentrationMcgMl;
                  const ul = ml * 1000;
                  const iu = ml * 100;
                  const isActive = doseMcgNorm === dose;
                  return (
                    <tr
                      key={dose}
                      style={{
                        backgroundColor: isActive ? "#EEF4FF" : idx % 2 === 0 ? "#fff" : "#FAFBFF",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 16px",
                          fontSize: "13px",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#1B5CB5" : "#0F172A",
                        }}
                      >
                        {dose} mcg{isActive ? " ←" : ""}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", textAlign: "right", color: "#475569", fontWeight: isActive ? 700 : 400 }}>
                        {round(ml, 4)}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", textAlign: "right", color: "#475569", fontWeight: isActive ? 700 : 400 }}>
                        {round(ul, 2)}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", textAlign: "right", color: isActive ? "#1B5CB5" : "#475569", fontWeight: isActive ? 700 : 400 }}>
                        {round(iu, 2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* How-to guide */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #E8EDF5",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          }}
        >
          <button
            onClick={() => setGuideOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Arimo', Arial, sans-serif",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
              How to reconstitute a peptide
            </span>
            {guideOpen ? (
              <ChevronUp size={16} style={{ color: "#64748B" }} />
            ) : (
              <ChevronDown size={16} style={{ color: "#64748B" }} />
            )}
          </button>
          {guideOpen && (
            <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F1F5F9" }}>
              <ol style={{ margin: "16px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Let the vial warm to room temperature for 15–20 minutes.",
                  "Draw the calculated BAC water volume into a sterile syringe.",
                  "Insert the needle and slowly inject water down the vial wall — don't aim at the powder.",
                  "Gently swirl (don't shake) until the powder fully dissolves.",
                  "Store reconstituted peptide at 2–8°C and use within 28 days.",
                ].map((step, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <p
          style={{
            marginTop: "24px",
            fontSize: "11px",
            color: "#CBD5E1",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          For in-vitro laboratory research use only. Not for human or veterinary use.
        </p>
      </div>
    </div>
  );
}
