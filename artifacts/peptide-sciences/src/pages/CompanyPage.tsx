import { Shield, FlaskConical, Award, Truck, Microscope, Users, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";

const values = [
  {
    icon: <FlaskConical size={24} />,
    title: "Scientific Rigour",
    body: "Every compound we supply undergoes HPLC purity verification to ≥99% before it leaves our facility. We do not compromise on analytical standards.",
  },
  {
    icon: <Shield size={24} />,
    title: "Transparency",
    body: "Full Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra are published for every product — no redactions, no approximations.",
  },
  {
    icon: <Microscope size={24} />,
    title: "Research-First",
    body: "Our catalogue is built around what the research community actually needs: well-characterised peptides, accurate labelling, and consistent batch quality.",
  },
  {
    icon: <Truck size={24} />,
    title: "Cold-Chain Integrity",
    body: "Lyophilised peptides are packed with validated cold-chain insulation and despatched for next-day or express delivery across the UK and Europe.",
  },
];

const milestones = [
  { year: "2019", text: "OmniQure founded in the United Kingdom with a focus on supplying HPLC-verified research peptides to academic institutions." },
  { year: "2021", text: "Catalogue expanded to 40 compounds following demand from independent researchers and private laboratories." },
  { year: "2023", text: "Introduced full ESI-TOF mass spectrometry data for every batch, raising the analytical standard across the catalogue." },
  { year: "2024", text: "Launched 81-product catalogue covering healing, metabolic, cognitive, longevity, and weight-management peptide classes." },
  { year: "2025", text: "Expanded cold-chain logistics to provide reliable next-day delivery throughout the UK and express shipping across the EU." },
];

const team = [
  {
    name: "Dr. James Whitfield",
    role: "Chief Scientific Officer",
    bio: "Biochemist with 15 years in peptide synthesis and analytical characterisation. Oversees QC protocols and batch release criteria.",
  },
  {
    name: "Sarah Okafor",
    role: "Head of Operations",
    bio: "Logistics and supply-chain specialist ensuring cold-chain integrity from synthesis to despatch for every UK and European order.",
  },
  {
    name: "Dr. Priya Nair",
    role: "Research Liaison",
    bio: "Connects researchers with the right compounds for their protocols, drawing on a background in molecular pharmacology and in-vitro assay design.",
  },
];

export default function CompanyPage() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
          padding: "72px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
        <div className="max-w-[1000px] mx-auto" style={{ position: "relative" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px",
              padding: "5px 14px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            <MapPin size={11} /> United Kingdom
          </span>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              margin: "0 0 18px",
            }}
          >
            OmniQure Peptide<br />
            <span style={{ color: "#93C5FD" }}>Research Institute</span>
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "580px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            A UK-based supplier of research-grade peptides — built on analytical transparency,
            cold-chain reliability, and an unwavering commitment to the scientific community.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ backgroundColor: "#fff", padding: "64px 24px" }}>
        <div className="max-w-[1000px] mx-auto" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Our Mission</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "0 0 18px" }}>
              Advancing research through verified peptide science
            </h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
              OmniQure was founded on a straightforward principle: researchers deserve access to
              compounds they can trust — not just by supplier reputation, but by independently
              verifiable analytical data on every single batch.
            </p>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.75, margin: 0 }}>
              We supply 81 HPLC-verified peptides to academic institutions, independent
              laboratories, and qualified researchers across the United Kingdom and Europe.
              Every vial ships with a full Certificate of Analysis, HPLC chromatogram, and
              ESI-TOF mass spectrum — because data, not claims, should define quality.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { value: "81+", label: "Verified Peptides" },
              { value: "≥99%", label: "HPLC Purity" },
              { value: "COA", label: "On Every Batch" },
              { value: "UK", label: "Based & Operated" },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  borderRadius: "16px",
                  padding: "24px 20px",
                  backgroundColor: "#F5F8FC",
                  border: "1px solid #E8EDF5",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "28px", fontWeight: 800, color: "#1240A0", margin: "0 0 4px" }}>{s.value}</p>
                <p style={{ fontSize: "12px", color: "#64748B", fontWeight: 500, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: "#F5F8FC", padding: "64px 24px" }}>
        <div className="max-w-[1000px] mx-auto">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>What We Stand For</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0F172A", margin: 0 }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {values.map(v => (
              <div
                key={v.title}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "18px",
                  padding: "28px 24px",
                  border: "1px solid #E8EDF5",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1B5CB5",
                    marginBottom: "16px",
                  }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{v.title}</h3>
                <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.65, margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ backgroundColor: "#fff", padding: "64px 24px" }}>
        <div className="max-w-[760px] mx-auto">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Our Journey</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0F172A", margin: 0 }}>How We Got Here</h2>
          </div>
          <div style={{ position: "relative", paddingLeft: "28px", borderLeft: "2px solid #E8EDF5" }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ position: "relative", marginBottom: i < milestones.length - 1 ? "36px" : 0 }}>
                <div
                  style={{
                    position: "absolute",
                    left: "-37px",
                    top: "2px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#1B5CB5",
                    border: "3px solid #fff",
                    boxShadow: "0 0 0 2px #1B5CB5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", margin: "0 0 4px", letterSpacing: "0.05em" }}>{m.year}</p>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, margin: 0 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ backgroundColor: "#F5F8FC", padding: "64px 24px" }}>
        <div className="max-w-[1000px] mx-auto">
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>The People Behind OmniQure</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0F172A", margin: 0 }}>Our Team</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {team.map(t => (
              <div
                key={t.name}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "18px",
                  padding: "28px 24px",
                  border: "1px solid #E8EDF5",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1240A0, #1B5CB5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "18px",
                    marginBottom: "14px",
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "0 0 3px" }}>{t.name}</h3>
                <p style={{ fontSize: "11.5px", fontWeight: 600, color: "#1B5CB5", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role}</p>
                <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.65, margin: 0 }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality commitment */}
      <section style={{ backgroundColor: "#fff", padding: "64px 24px" }}>
        <div className="max-w-[760px] mx-auto">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Quality Assurance</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>What Every Batch Includes</h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, margin: 0 }}>
              We believe quality assurance should be visible, not implicit. Every product
              shipped by OmniQure includes the following analytical documentation.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { title: "Certificate of Analysis (COA)", desc: "A full document confirming identity, purity, and specification compliance for the specific batch." },
              { title: "HPLC Chromatogram", desc: "High-Performance Liquid Chromatography trace showing purity at ≥99%, with peak integration data." },
              { title: "ESI-TOF Mass Spectrum", desc: "Electrospray ionisation time-of-flight mass spectrometry data confirming molecular weight and identity." },
              { title: "Lyophilisation & Stability Data", desc: "Batch-specific lyophilisation records and recommended storage conditions to preserve peptide integrity." },
            ].map(item => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  backgroundColor: "#F5F8FC",
                  borderRadius: "14px",
                  padding: "20px 20px",
                  border: "1px solid #E8EDF5",
                }}
              >
                <CheckCircle size={18} style={{ color: "#1B5CB5", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>{item.title}</p>
                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div className="max-w-[600px] mx-auto">
          <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Ready to start your research?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Browse our full catalogue of 81 HPLC-verified peptides, each backed by
            complete analytical documentation and cold-chain delivery.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/all-peptides"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                color: "#1240A0",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Browse All Peptides
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
