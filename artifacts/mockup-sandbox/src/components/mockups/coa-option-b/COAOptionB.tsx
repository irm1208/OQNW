export default function COAOptionB() {
  const blue = "#1240A0";
  const ink = "#111827";
  const muted = "#6B7280";
  const green = "#16A34A";
  const border = "#E5E7EB";
  const bgLight = "#F9FAFB";
  const rowAlt = "#F0F7FF";

  const divider: React.CSSProperties = { borderTop: `1px solid ${border}`, margin: "0 0 16px" };

  const product = "BPC-157 10mg";
  const baseName = "BPC-157";
  const lot = "BP10-0609";
  const received = "28 Jun 2026";
  const analysis = "29 Jun 2026";
  const issued = "29 Jun 2026";
  const coaRef = "OQ-COA-BP100609-004";
  const purityStr = "99.892% — PASS";
  const actualMass = "11.95 mg";
  const mw = "1419.5 g/mol";
  const cas = "137525-51-0";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: "36px 40px 32px",
        width: "100%",
        maxWidth: "720px",
        color: ink,
        lineHeight: 1.5,
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 900, color: blue, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              CERTIFICATE<br />OF ANALYSIS
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
              borderRadius: "10px",
              padding: "8px 14px 10px",
              display: "inline-block",
              marginBottom: "6px",
            }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: "18px", letterSpacing: "-0.01em" }}>OmniQure</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.18em", marginTop: "2px" }}>
                PEPTIDE RESEARCH INSTITUTE
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "10px", color: muted }}>www.omniqure.com</p>
          </div>
        </div>

        <hr style={divider} />

        {/* ── Reference row ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: muted }}>Reference Number</p>
            <p style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 700, color: ink, fontFamily: "monospace" }}>{coaRef}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "11.5px", color: muted }}>
            <p style={{ margin: 0 }}>Sample received &nbsp;›&nbsp; <strong style={{ color: ink }}>{received}</strong></p>
            <p style={{ margin: "4px 0 0" }}>Analysis Date &nbsp;›&nbsp; <strong style={{ color: ink }}>{analysis}</strong></p>
            <p style={{ margin: "4px 0 0" }}>Report Issued &nbsp;›&nbsp; <strong style={{ color: ink }}>{issued}</strong></p>
          </div>
        </div>

        <hr style={divider} />

        {/* ── Client / Sample table ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "13px" }}>
          <tbody>
            {[
              { label: "Client",       value: "OmniQure Peptide Research Institute" },
              { label: "Sample",       value: `${product}    ${lot}` },
              { label: "Manufacturer", value: "OmniQure Peptide Research Institute" },
              { label: "Batch",        value: lot },
              { label: "Tested by",    value: "Janoshik Analytical  ·  janoshik.com", highlight: true },
            ].map(row => (
              <tr key={row.label}>
                <td style={{ width: "130px", padding: "5px 12px 5px 0", color: blue, fontWeight: 600, verticalAlign: "top", fontSize: "12.5px" }}>
                  {row.label}
                </td>
                <td style={{ padding: "5px 0", color: (row as any).highlight ? "#1a5c1a" : ink, verticalAlign: "top", fontWeight: (row as any).highlight ? 600 : 400 }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={divider} />

        {/* ── Sample description ── */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Sample description ›</p>
          <div style={{ background: bgLight, border: `1px solid ${border}`, borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151" }}>
            Lyophilised peptide powder, white to off-white appearance. Store at −20 °C (lyophilised) or 4 °C after reconstitution.
          </div>
        </div>

        {/* ── Tests requested ── */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Tests requested ›</p>
          <div style={{ background: bgLight, border: `1px solid ${border}`, borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151" }}>
            Third-party purity analysis (HPLC-UV, 214 nm) commissioned through Janoshik Analytical.
          </div>
        </div>

        <hr style={divider} />

        {/* ── Results ── */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: blue }}>Results ›</p>

            {/* Option B badge — "Third-Party Verified" instead of "OMNIQURE LABS" */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f0f7ff",
              border: `1.5px solid ${blue}`,
              borderRadius: "8px",
              padding: "6px 12px",
            }}>
              {/* Shield icon */}
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1L2 4.5V10C2 14.75 5.5 19.2 10 21C14.5 19.2 18 14.75 18 10V4.5L10 1Z"
                  fill={blue} fillOpacity="0.12" stroke={blue} strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M7 11L9 13L13 9" stroke={blue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: blue, letterSpacing: "0.12em" }}>THIRD-PARTY VERIFIED</div>
                <div style={{ fontSize: "8px", color: muted, marginTop: "1px" }}>Janoshik Analytical</div>
              </div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <tbody>
              {[
                { label: baseName,          value: actualMass,  green: false, bold: true  },
                { label: "Purity",          value: purityStr,   green: true,  bold: false },
                { label: "Molecular Weight",value: mw,          green: false, bold: false },
                { label: "CAS Number",      value: cas,         green: false, bold: false },
              ].map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? rowAlt : "#fff" }}>
                  <td style={{
                    padding: "9px 14px",
                    border: `1px solid ${blue}`,
                    borderLeft: `3px solid ${blue}`,
                    fontWeight: row.bold ? 700 : 500,
                    color: ink,
                  }}>{row.label}</td>
                  <td style={{
                    padding: "9px 14px",
                    border: `1px solid ${blue}`,
                    fontWeight: 700,
                    color: row.green ? green : ink,
                  }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Comments ── */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Comments ›</p>
          <div style={{ background: bgLight, border: `1px solid ${border}`, borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151" }}>
            All specifications met. Sample approved for research distribution and use. For laboratory research purposes only — not for human or veterinary use.
          </div>
        </div>

        <hr style={divider} />

        {/* ── Analysis conducted ── */}
        <div style={{ marginBottom: "16px", fontSize: "12.5px", color: muted }}>
          <p style={{ margin: 0 }}>
            Sample received ›&nbsp;
            <span style={{ fontWeight: 700, color: ink }}>{received}</span>
          </p>
          <p style={{ margin: "6px 0 0" }}>
            Analysis conducted ›&nbsp;
            <span style={{ fontWeight: 700, color: ink, background: rowAlt, padding: "2px 8px", borderRadius: "4px" }}>{analysis}</span>
          </p>
        </div>

        {/* ── Footer note ── */}
        <p style={{ margin: "0 0 20px", fontSize: "10px", color: muted, fontStyle: "italic", lineHeight: 1.6 }}>
          This certificate is generated electronically and is valid for the lot number stated above.
          Testing performed independently by <strong style={{ color: "#374151" }}>Janoshik Analytical</strong> (janoshik.com).
          OmniQure Peptide Research Institute curates and distributes these results for transparency.
        </p>

        {/* ── Dark footer bar ── */}
        <div style={{
          background: "#0D2565",
          borderRadius: "6px",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "15px", letterSpacing: "-0.01em" }}>OmniQure</div>
          <div style={{ textAlign: "center", color: "rgba(150,175,215,0.9)", fontSize: "9px" }}>
            {coaRef} · Lot: {lot} · Issued: {issued}
          </div>
          <div style={{ fontSize: "9px", color: "rgba(150,175,215,0.75)", textAlign: "right" }}>
            omniqure.com<br />For in-vitro research use only
          </div>
        </div>
      </div>
    </div>
  );
}
