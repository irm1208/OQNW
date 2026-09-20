import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  FlaskConical, ShieldCheck, Truck, Award, Microscope, Globe,
  ArrowRight, CheckCircle, Beaker, Target, Users, Zap,
} from "lucide-react";

const STATS = [
  { value: "81+",   label: "Unique Peptide Compounds" },
  { value: "99%+",  label: "Independent result purity" },
  { value: "500+",  label: "Orders Fulfilled" },
];

const PILLARS = [
  {
    icon: <Microscope size={22} />,
    color: "#3B82F6",
    bg: "#EFF6FF",
    title: "Verified Purity",
    body: "Every compound is tested by accredited laboratories using High-Performance Liquid Chromatography. We publish certificates of analysis for all products — no hidden results.",
  },
  {
    icon: <Beaker size={22} />,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    title: "Pharmaceutical-Grade Synthesis",
    body: "Our peptides are synthesised in GMP-compliant facilities using pharmaceutical-grade reagents. Lyophilised vials maintain stability for up to 24 months under correct storage conditions.",
  },
  {
    icon: <ShieldCheck size={22} />,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Transparent Testing",
    body: "We don't just claim quality — we prove it through independently published Janoshik reports.",
  },
  {
    icon: <Truck size={22} />,
    color: "#F59E0B",
    bg: "#FFFBEB",
    title: "Reliable Worldwide Shipping",
    body: "Orders are dispatched same or next business day with full tracking. We ship to research institutions across Europe, North America, Asia Pacific, and the Middle East.",
  },
  {
    icon: <Target size={22} />,
    color: "#EF4444",
    bg: "#FEF2F2",
    title: "Research-First Approach",
    body: "Every product description, protocol guide, and research stack is written with scientific rigour. We provide relevant literature references and never overstate what the peer-reviewed data actually shows.",
  },
  {
    icon: <Globe size={22} />,
    color: "#06B6D4",
    bg: "#ECFEFF",
    title: "Global Research Community",
    body: "OmniQure serves independent researchers, academic institutions, and pharmaceutical companies across 40+ countries. Our multilingual support team and multi-currency checkout removes friction for global science.",
  },
];

const TIMELINE = [
  {
    year: "Founded",
    title: "Built from a Research Gap",
    body: "OmniQure was founded by researchers who experienced first-hand how difficult it was to source high-purity peptides with transparent documentation. Most suppliers offered little more than a purity number and a price — we set out to change that.",
  },
  {
    year: "Catalogue",
    title: "81+ Compounds and Growing",
    body: "From foundational research peptides like BPC-157 and TB-500 to cutting-edge GLP-1 receptor agonists, our catalogue covers the full spectrum of active research areas — growth, healing, longevity, cognition, weight management, and beyond.",
  },
  {
    year: "Quality",
    title: "Every Batch Tested",
    body: "We established our testing programme before we shipped a single order. Every compound in our catalogue is independently verified, mass-confirmed, and documented through published Janoshik reports.",
  },
  {
    year: "Today",
    title: "Trusted by Researchers Worldwide",
    body: "Today OmniQure supplies researchers across 40+ countries. Our commitment to quality, reliable shipping, and support that understands the science behind the compounds we sell has made us a trusted source for research peptides worldwide.",
  },
];

const VALUES = [
  { icon: <CheckCircle size={16} />, text: "Publish independent Janoshik reports — no selective disclosure" },
  { icon: <CheckCircle size={16} />, text: "Never overstate efficacy claims beyond peer-reviewed data" },
  { icon: <CheckCircle size={16} />, text: "Respond to support queries within 1–2 business days" },
  { icon: <CheckCircle size={16} />, text: "Retest batches that fall below our purity threshold" },
  { icon: <CheckCircle size={16} />, text: "Maintain GMP-compliant synthesis and packaging standards" },
  { icon: <CheckCircle size={16} />, text: "Provide free reconstitution guidance and protocol support" },
];

export default function AboutPage() {
  useSEO({
    title: "About OmniQure — Verified Research Peptides",
    description: "Learn about OmniQure's mission to supply verified research peptides with full transparency. Founded by researchers. Trusted by institutions worldwide.",
    canonicalPath: "/about",
  });

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0D2565 0%, #1240A0 45%, #1B5CB5 80%, #1E68CC 100%)",
        padding: "80px 0 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px", pointerEvents: "none",
        }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "-80px", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #60A5FA, #93C5FD)" }} />
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: "#93C5FD", margin: 0 }}>
              OmniQure
            </p>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900,
            lineHeight: 1.06, letterSpacing: "-0.03em",
            color: "#fff", maxWidth: 760, marginBottom: 24,
          }}>
            Advancing research through<br />
            <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              verifiable science.
            </span>
          </h1>

          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.68)", lineHeight: 1.8, maxWidth: 580, marginBottom: 40 }}>
            OmniQure was founded on a single belief: researchers deserve peptide suppliers that are as rigorous about quality documentation as they are about their own work. Every vial we ship is independently verified, mass-confirmed, and backed by a published Janoshik report.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/all-peptides"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(90deg, #34D399, #059669)",
                color: "#022c22", textDecoration: "none",
                borderRadius: 10, padding: "12px 24px",
                fontSize: 13, fontWeight: 900,
                boxShadow: "0 0 20px rgba(52,211,153,0.3)",
              }}
            >
              Browse All Peptides <ArrowRight size={15} />
            </Link>
            <Link
              href="/lab-reports"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", textDecoration: "none",
                borderRadius: 10, padding: "12px 24px",
                fontSize: 13, fontWeight: 700,
              }}
            >
              View Lab Results <FlaskConical size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 20px",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid #F1F5F9" : "none",
                }}
                className={i < 2 ? "border-b md:border-b-0" : ""}
              >
                <p style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 900, color: "#0D2565", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "72px 0", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #3B82F6, #60A5FA)", borderRadius: 2 }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#3B82F6" }}>Our Mission</span>
              </div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#0F172A", marginBottom: 20 }}>
                Quality you can verify,<br />not just trust.
              </h2>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.85, marginBottom: 18 }}>
                In peptide research, the difference between 95% purity and 99%+ purity isn't just a number — it can materially affect experimental outcomes. Too many suppliers cite purity figures without providing the data to back them up.
              </p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.85, marginBottom: 28 }}>
                OmniQure publishes independent data for every compound in our catalogue. We invite our customers to scrutinise our results because transparency isn't a marketing strategy — it's the standard we hold ourselves to.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {VALUES.map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "#10B981", marginTop: 1, flexShrink: 0 }}>{v.icon}</span>
                    <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{v.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual accent card */}
            <div style={{
              background: "linear-gradient(135deg, #0D2565 0%, #1240A0 100%)",
              borderRadius: 24, padding: "40px 36px",
              color: "#fff", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(52,211,153,0.15)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24,
                }}>
                  <FlaskConical size={24} style={{ color: "#34D399" }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
                  What "research use only" means to us
                </h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 24 }}>
                  All OmniQure compounds are intended strictly for <strong style={{ color: "rgba(255,255,255,0.9)" }}>in-vitro laboratory research</strong> by qualified scientists. We do not condone, support, or facilitate human or animal administration. This distinction is fundamental — not a legal footnote.
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 20 }}>
                  {[
                    "Not for human consumption",
                    "Not for veterinary use",
                    "Purchasers must be 18+ qualified researchers",
                    "All products comply with RUO regulations",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 3 ? 10 : 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY / TIMELINE ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "72px 0", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center" style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #7C3AED, #A78BFA)", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#7C3AED" }}>Our Story</span>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #A78BFA, #7C3AED)", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.1 }}>
              Built by researchers, for researchers.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "#F7FAFF",
                  border: "1.5px solid #E8EDF5",
                  borderRadius: 18,
                  padding: "28px 24px",
                  position: "relative",
                }}
              >
                <span style={{
                  display: "inline-block",
                  fontSize: 9, fontWeight: 900,
                  textTransform: "uppercase", letterSpacing: "0.16em",
                  color: "#1B5CB5",
                  background: "#EEF4FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 20, padding: "3px 10px",
                  marginBottom: 14,
                }}>
                  {t.year}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 10, lineHeight: 1.3 }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.75 }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS / HOW WE OPERATE ─────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "72px 0", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center" style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #10B981, #34D399)", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#10B981" }}>How We Operate</span>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #34D399, #10B981)", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, letterSpacing: "-0.025em", color: "#0F172A", lineHeight: 1.1, marginBottom: 14 }}>
              Six pillars of quality.
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
              Every aspect of our operation is built around one outcome — delivering peptides that researchers can rely on.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1.5px solid #E8EDF5",
                  borderRadius: 18,
                  padding: "28px 24px",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${p.color}14`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.04)";
                }}
              >
                <div
                  style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: p.bg, color: p.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 10, lineHeight: 1.3 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.75 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        borderTop: "3px solid #34D399",
        padding: "60px 0",
      }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <Award size={20} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#93C5FD" }}>
              Trusted by researchers worldwide
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 16 }}>
            Ready to order?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px" }}>
            Browse our full catalogue of 81+ verified peptides, review Janoshik reports where available, and check out with your preferred currency.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/all-peptides"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(90deg, #34D399, #059669)",
                color: "#022c22", textDecoration: "none",
                borderRadius: 10, padding: "13px 28px",
                fontSize: 14, fontWeight: 900,
                boxShadow: "0 0 24px rgba(52,211,153,0.3)",
              }}
            >
              Shop All Peptides <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "#fff", textDecoration: "none",
                borderRadius: 10, padding: "13px 28px",
                fontSize: 14, fontWeight: 700,
              }}
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", borderTop: "1px solid #E8EDF5", padding: "20px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-center" style={{ fontSize: "11.5px", color: "#94A3B8", lineHeight: 1.7 }}>
            <strong style={{ color: "#64748B" }}>Research Use Only.</strong>{" "}
            All products are intended strictly for in-vitro laboratory research. Not approved by the FDA. Not for human or animal use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </section>

    </div>
  );
}
