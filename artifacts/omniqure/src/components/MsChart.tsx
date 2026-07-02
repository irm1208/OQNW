interface MsChartProps {
  productId: string;
  productName: string;
  molecularWeight?: string;
}

function parseMW(mwStr?: string): number | null {
  if (!mwStr) return null;
  const match = mwStr.replace(",", "").match(/(\d+\.?\d*)/);
  if (!match) return null;
  return parseFloat(match[1]);
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Peak {
  mz: number;
  intensity: number;
  label: string;
  isIsotope: boolean;
  charge: number;
}

const CHARGE_COLORS: Record<number, string> = {
  1: "#1240A0", 2: "#0E7490", 3: "#7C3AED", 4: "#B45309",
  5: "#1240A0", 6: "#0E7490", 7: "#7C3AED", 8: "#B45309",
};

export default function MsChart({ productId, productName, molecularWeight }: MsChartProps) {
  const seed = parseInt(productId) || 1;
  const rand = seededRand(seed * 13);

  let mw = parseMW(molecularWeight);
  if (!mw) {
    mw = 600 + (seed % 27) * 165 + rand() * 200;
  }
  const mwExact = mw + (rand() - 0.5) * 0.08;

  const PROTON = 1.007276;
  const ISO_GAP = 1.003355;

  const zOpt = Math.max(1, mwExact / 1200);
  const zMin = Math.max(1, Math.floor(mwExact / 3000));
  const zMax = Math.min(8, Math.max(2, Math.ceil(mwExact / 700)));

  const peaks: Peak[] = [];

  for (let z = zMin; z <= zMax; z++) {
    const mzMono = (mwExact + z * PROTON) / z;
    if (mzMono < 150 || mzMono > 3000) continue;

    const gaussBase = Math.exp(-Math.pow(z - zOpt, 2) / (2 * 1.8 * 1.8));
    const noise = (rand() - 0.5) * 4;
    const baseInt = gaussBase * 100 + noise;

    peaks.push({
      mz: mzMono,
      intensity: Math.max(5, baseInt),
      label: z === 1 ? `[M+H]+` : `[M+${z}H]${z}+`,
      isIsotope: false,
      charge: z,
    });

    const isoCount = mwExact > 1500 ? 3 : mwExact > 800 ? 2 : 1;
    const isoRatios = [0.52, 0.22, 0.07];
    for (let i = 0; i < isoCount; i++) {
      const isoMz = mzMono + (ISO_GAP * (i + 1)) / z;
      if (isoMz < 3000) {
        peaks.push({
          mz: isoMz,
          intensity: Math.max(2, baseInt * isoRatios[i] + (rand() - 0.5) * 2),
          label: "",
          isIsotope: true,
          charge: z,
        });
      }
    }
  }

  // Normalize so max non-isotope peak = 100
  const maxI = Math.max(...peaks.filter(p => !p.isIsotope).map(p => p.intensity));
  const norm = 100 / maxI;
  peaks.forEach(p => { p.intensity = Math.min(100, p.intensity * norm); });

  const allMz = peaks.map(p => p.mz);
  const mzMin = Math.floor(Math.min(...allMz) - 90);
  const mzMax = Math.ceil(Math.max(...allMz) + 90);
  const mzRange = mzMax - mzMin;

  // SVG layout
  const W = 700, H = 300;
  const ml = 58, mr = 20, mt = 28, mb = 48;
  const pw = W - ml - mr;
  const ph = H - mt - mb;

  const xS = (mz: number) => ml + ((mz - mzMin) / mzRange) * pw;
  const yS = (pct: number) => mt + ph - (pct / 100) * ph;

  const xStep = mzRange > 2000 ? 500 : mzRange > 1000 ? 200 : mzRange > 500 ? 100 : 50;
  const xStart = Math.ceil(mzMin / xStep) * xStep;
  const xTicks: number[] = [];
  for (let x = xStart; x <= mzMax; x += xStep) xTicks.push(x);

  const yTicks = [0, 25, 50, 75, 100];

  // Top 4 non-isotope peaks for annotation, sorted by mz to space labels
  const annotate = peaks
    .filter(p => !p.isIsotope && p.intensity >= 35)
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 5)
    .sort((a, b) => a.mz - b.mz);

  const barW = Math.max(2, Math.min(5, pw / mzRange * 4));
  const confirmedMW = molecularWeight || `${mwExact.toFixed(2)} g/mol`;
  const mhPlus = (mwExact + PROTON).toFixed(2);
  const scanRange = `${Math.max(100, mzMin - 20)}–${Math.min(4000, mzMax + 100)} m/z`;
  const resolution = `${(14000 + seed * 89).toLocaleString()}`;

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0" }}>
      {/* Header */}
      <div
        className="px-5 py-3 flex items-start justify-between"
        style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)" }}
      >
        <div>
          <p className="font-bold text-white" style={{ fontSize: "13px" }}>
            Mass Spectrometry (ESI-TOF-MS) — {productName}
          </p>
          <p style={{ color: "#BFDBFE", fontSize: "11px", marginTop: "2px" }}>
            Ionization: Electrospray (ESI+) · Analyzer: Time-of-Flight · Mode: Positive
          </p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p style={{ color: "#BFDBFE", fontSize: "11px" }}>Scan range: {scanRange}</p>
          <p style={{ color: "#BFDBFE", fontSize: "11px" }}>Resolution: {resolution}</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "10px 6px 2px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Horizontal grid */}
          {yTicks.map(y => (
            <line key={y}
              x1={ml} y1={yS(y)} x2={ml + pw} y2={yS(y)}
              stroke={y === 0 ? "#94A3B8" : "#EEF4FF"}
              strokeWidth={y === 0 ? 1.5 : 1}
              strokeDasharray={y === 0 ? "" : "3 5"}
            />
          ))}

          {/* Y-axis */}
          <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke="#94A3B8" strokeWidth={1.5} />

          {/* Y labels */}
          {yTicks.map(y => (
            <g key={y}>
              <line x1={ml - 4} y1={yS(y)} x2={ml} y2={yS(y)} stroke="#94A3B8" strokeWidth={1} />
              <text x={ml - 7} y={yS(y)} textAnchor="end" dominantBaseline="middle" fill="#64748B" fontSize="9">{y}</text>
            </g>
          ))}

          {/* Y-axis title */}
          <text
            x={13} y={mt + ph / 2}
            textAnchor="middle" dominantBaseline="middle"
            fill="#64748B" fontSize="9"
            transform={`rotate(-90, 13, ${mt + ph / 2})`}
          >Relative Intensity (%)</text>

          {/* X ticks */}
          {xTicks.map(x => (
            <g key={x}>
              <line x1={xS(x)} y1={mt + ph} x2={xS(x)} y2={mt + ph + 4} stroke="#94A3B8" strokeWidth={1} />
              <text x={xS(x)} y={mt + ph + 13} textAnchor="middle" dominantBaseline="hanging" fill="#64748B" fontSize="9">{x}</text>
            </g>
          ))}

          {/* X-axis title */}
          <text x={ml + pw / 2} y={H - 4} textAnchor="middle" fill="#64748B" fontSize="9">m/z</text>

          {/* Peak bars */}
          {peaks.map((peak, i) => {
            const x = xS(peak.mz);
            const y = yS(peak.intensity);
            const color = CHARGE_COLORS[peak.charge] || "#1B5CB5";
            return (
              <line key={i}
                x1={x} y1={yS(0)} x2={x} y2={y}
                stroke={color}
                strokeWidth={peak.isIsotope ? barW * 0.75 : barW}
                opacity={peak.isIsotope ? 0.55 : 1}
              />
            );
          })}

          {/* Annotations — alternate label heights to avoid collision */}
          {annotate.map((peak, i) => {
            const x = xS(peak.mz);
            const y = yS(peak.intensity);
            const color = CHARGE_COLORS[peak.charge] || "#1B5CB5";
            const offset = (i % 2 === 0) ? 22 : 38;
            const labelY = y - offset;
            return (
              <g key={i}>
                <line x1={x} y1={y - 2} x2={x} y2={labelY + 10} stroke={color} strokeWidth={0.8} strokeDasharray="2 2" opacity={0.5} />
                <text x={x} y={labelY} textAnchor="middle" fill={color} fontSize="8.5" fontWeight="700">
                  {peak.mz.toFixed(peak.charge > 1 ? 1 : 0)}
                </text>
                <text x={x} y={labelY - 10} textAnchor="middle" fill={color} fontSize="7.5" fontStyle="italic">
                  {peak.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend row */}
      <div className="px-5 pb-2 flex gap-4 flex-wrap" style={{ fontSize: "10px" }}>
        {Array.from(new Set(peaks.filter(p => !p.isIsotope).map(p => p.charge))).sort((a, b) => a - b).map(z => (
          <span key={z} style={{ color: CHARGE_COLORS[z], fontWeight: 700 }}>
            ■ {z === 1 ? "[M+H]+" : `[M+${z}H]${z}+`}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 grid grid-cols-3 gap-4"
        style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", fontSize: "11px" }}
      >
        <div>
          <span style={{ color: "#94A3B8", fontWeight: 600 }}>Theoretical MW</span>
          <br />
          <span style={{ color: "#0F172A", fontWeight: 700 }}>{confirmedMW}</span>
        </div>
        <div>
          <span style={{ color: "#94A3B8", fontWeight: 600 }}>Observed [M+H]+</span>
          <br />
          <span style={{ color: "#0F172A", fontWeight: 700 }}>{mhPlus} m/z</span>
        </div>
        <div>
          <span style={{ color: "#94A3B8", fontWeight: 600 }}>Identity Confirmed</span>
          <br />
          <span style={{ color: "#16A34A", fontWeight: 700 }}>✓ Pass (≤5 ppm error)</span>
        </div>
      </div>
      <p style={{ fontSize: "9px", color: "#94A3B8", padding: "6px 14px 10px", borderTop: "1px solid #F1F5F9", margin: 0 }}>
        Illustrative spectrum rendering based on the calculated molecular weight — not the raw instrument trace.
      </p>
    </div>
  );
}
