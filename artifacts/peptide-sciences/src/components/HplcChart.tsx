interface HplcChartProps {
  productId: string;
  productName: string;
  purity?: string;
}

function gaussian(t: number, mu: number, amplitude: number, sigma: number): number {
  return amplitude * Math.exp(-Math.pow(t - mu, 2) / (2 * sigma * sigma));
}

export default function HplcChart({ productId, productName, purity }: HplcChartProps) {
  const seed = parseInt(productId) || 1;

  // Vary retention time 9–17 min, peak width, and impurity sizes per product
  const retentionTime = 9 + (seed % 9);
  const sigma = 0.30 + (seed % 5) * 0.02;
  const imp1Amp = 5.5 + (seed % 4) * 0.8;          // 5.5–8.3 mAU
  const imp1RT  = retentionTime - 3.5 - (seed % 2);
  const imp2Amp = 3.0 + (seed % 3) * 0.7;          // 3.0–4.4 mAU
  const imp2RT  = retentionTime + 3.8 + (seed % 3) * 0.5;
  const imp1Sigma = 0.22 + (seed % 3) * 0.03;
  const imp2Sigma = 0.18 + (seed % 2) * 0.03;

  // Compute displayed purity from peak areas: area = A * sigma * sqrt(2π)
  const ROOT2PI = 2.5066;
  const mainArea = 1000 * sigma * ROOT2PI;
  const i1Area   = imp1Amp * imp1Sigma * ROOT2PI;
  const i2Area   = imp2Amp * imp2Sigma * ROOT2PI;
  const totalArea = mainArea + i1Area + i2Area;
  const computedPurity = ((mainArea / totalArea) * 100).toFixed(1);
  const displayPurity = purity ?? `${computedPurity}%`;

  // SVG layout
  const W = 560, H = 240;
  const pl = 58, pr = 20, pt = 18, pb = 38;
  const plotW = W - pl - pr;
  const plotH = H - pt - pb;
  const T_MAX = 25;
  const A_MAX = 1080;

  const sx = (t: number) => pl + (t / T_MAX) * plotW;
  const sy = (a: number) => pt + plotH - (Math.min(a, A_MAX) / A_MAX) * plotH;

  // Generate chromatogram points
  const N = 700;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX;
    const noise =
      2.8 * Math.sin(t * 6.1 + seed) +
      1.6 * Math.sin(t * 14.3 + seed * 0.7) +
      1.1 * Math.sin(t * 3.7 + seed * 1.3) +
      0.7 * Math.sin(t * 22.1);
    const abs =
      Math.max(0, noise) +
      gaussian(t, imp1RT, imp1Amp, imp1Sigma) +
      gaussian(t, imp2RT, imp2Amp, imp2Sigma) +
      gaussian(t, retentionTime, 1000, sigma);
    pts.push(`${sx(t).toFixed(1)},${sy(abs).toFixed(1)}`);
  }
  const polyline = pts.join(" ");

  // X-axis tick marks every 5 min
  const xTicks = [0, 5, 10, 15, 20, 25];
  // Y-axis ticks
  const yTicks = [0, 200, 400, 600, 800, 1000];

  // Peak annotation position
  const peakX = sx(retentionTime);
  const peakY = sy(1000);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
    >
      {/* Chart header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFF" }}
      >
        <div>
          <p className="font-bold text-sm" style={{ color: "#0F172A" }}>HPLC Chromatogram</p>
          <p className="text-xs" style={{ color: "#64748B", marginTop: "1px" }}>{productName}</p>
        </div>
        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
          >
            Purity: {displayPurity}
          </span>
          <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Reverse Phase C18 · 254 nm</p>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="px-4 pt-3 pb-2">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
          {/* Grid lines */}
          {yTicks.map((v) => (
            <line
              key={v}
              x1={pl} y1={sy(v)} x2={pl + plotW} y2={sy(v)}
              stroke="#F1F5F9" strokeWidth="1"
            />
          ))}
          {xTicks.map((t) => (
            <line
              key={t}
              x1={sx(t)} y1={pt} x2={sx(t)} y2={pt + plotH}
              stroke="#F1F5F9" strokeWidth="1"
            />
          ))}

          {/* Filled area under chromatogram */}
          <polyline
            points={`${sx(0)},${sy(0)} ${polyline} ${sx(T_MAX)},${sy(0)}`}
            fill="url(#hplcGrad)"
            stroke="none"
          />

          {/* Chromatogram line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#1B5CB5"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="hplcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B5CB5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1B5CB5" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Axes */}
          {/* Y axis */}
          <line x1={pl} y1={pt} x2={pl} y2={pt + plotH} stroke="#CBD5E1" strokeWidth="1.5" />
          {/* X axis */}
          <line x1={pl} y1={pt + plotH} x2={pl + plotW} y2={pt + plotH} stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Y tick labels */}
          {yTicks.map((v) => (
            <text key={v} x={pl - 6} y={sy(v) + 3.5} textAnchor="end" fontSize="9" fill="#94A3B8">
              {v}
            </text>
          ))}

          {/* X tick labels */}
          {xTicks.map((t) => (
            <text key={t} x={sx(t)} y={pt + plotH + 13} textAnchor="middle" fontSize="9" fill="#94A3B8">
              {t}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={pl - 42}
            y={pt + plotH / 2}
            textAnchor="middle"
            fontSize="9"
            fill="#64748B"
            transform={`rotate(-90, ${pl - 42}, ${pt + plotH / 2})`}
          >
            Absorbance (mAU)
          </text>
          <text x={pl + plotW / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#64748B">
            Time (min)
          </text>

          {/* Main peak annotation */}
          <line
            x1={peakX} y1={peakY - 4}
            x2={peakX} y2={peakY - 22}
            stroke="#1B5CB5" strokeWidth="1" strokeDasharray="2,2"
          />
          <rect
            x={peakX - 28} y={peakY - 38}
            width="56" height="14"
            rx="3" fill="#EEF4FF" stroke="#BFDBFE" strokeWidth="0.8"
          />
          <text x={peakX} y={peakY - 28} textAnchor="middle" fontSize="8.5" fill="#1B5CB5" fontWeight="600">
            tR = {retentionTime}.0 min
          </text>

          {/* Impurity 1 annotation (tiny) */}
          <text
            x={sx(imp1RT)}
            y={sy(imp1Amp) - 5}
            textAnchor="middle"
            fontSize="7"
            fill="#94A3B8"
          >
            {(i1Area / totalArea * 100).toFixed(2)}%
          </text>

          {/* Impurity 2 annotation (tiny) */}
          <text
            x={sx(imp2RT)}
            y={sy(imp2Amp) - 5}
            textAnchor="middle"
            fontSize="7"
            fill="#94A3B8"
          >
            {(i2Area / totalArea * 100).toFixed(2)}%
          </text>

          {/* Main peak % label */}
          <text
            x={peakX + 32}
            y={sy(500)}
            textAnchor="start"
            fontSize="8"
            fill="#059669"
            fontWeight="700"
          >
            {(mainArea / totalArea * 100).toFixed(2)}%
          </text>
        </svg>
      </div>

      {/* Run info footer */}
      <div
        className="grid grid-cols-4 gap-0 text-center"
        style={{ borderTop: "1px solid #F1F5F9" }}
      >
        {[
          { label: "Column", value: "C18 · 250×4.6mm" },
          { label: "Flow Rate", value: "1.0 mL/min" },
          { label: "Detection", value: "UV 254 nm" },
          { label: "Mobile Phase", value: "H₂O / ACN (TFA)" },
        ].map((info) => (
          <div key={info.label} className="py-2.5 px-2" style={{ borderRight: "1px solid #F1F5F9" }}>
            <p className="text-xs font-bold" style={{ color: "#0F172A", fontSize: "10px" }}>{info.value}</p>
            <p style={{ fontSize: "9px", color: "#94A3B8", marginTop: "1px" }}>{info.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
