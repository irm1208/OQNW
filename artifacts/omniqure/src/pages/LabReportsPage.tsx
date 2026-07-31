import { useSEO } from "@/hooks/useSEO";
import { FlaskConical, BarChart2, Atom } from "lucide-react";

export default function LabReportsPage() {
  useSEO({
    title: "Lab Reports",
    description:
      "Independent HPLC chromatography and ESI-MS mass spectrometry lab reports for every OmniQure peptide. Purity verification, molecular identity confirmation, and batch traceability for in-vitro research.",
    canonicalPath: "/lab-reports",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FC", fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "40px 24px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 13px", borderRadius: "20px", marginBottom: "16px" }}>
            <BarChart2 size={12} color="#93C5FD" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em" }}>
              INDEPENDENT THIRD-PARTY TESTING
            </span>
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            Lab Reports
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#BFDBFE", lineHeight: 1.7, maxWidth: "580px" }}>
            Independent HPLC and ESI-MS reports for every peptide in our catalogue, verified by Janoshik Analytical.
          </p>
        </div>
      </div>

      {/* Empty state */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
          <span style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FlaskConical size={24} color="#1B5CB5" />
          </span>
          <span style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Atom size={24} color="#7C3AED" />
          </span>
          <span style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={24} color="#059669" />
          </span>
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 800, color: "#0D2565" }}>
          Reports coming soon
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.7, maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
          Janoshik Analytical lab reports will be published here. Each report will include HPLC chromatography purity data and ESI-MS molecular identity confirmation.
        </p>
      </div>

    </div>
  );
}
