import { Link } from "wouter";
import { FlaskConical, Mail, MapPin } from "lucide-react";

const footerCategories = [
  {
    title: "Purchase Peptides",
    href: "/all-peptides",
    links: [
      { label: "BPC-157 5mg",    href: "/product/10" },
      { label: "Ipamorelin 5mg", href: "/product/75" },
      { label: "GHK-Cu 50mg",    href: "/product/44" },
      { label: "Sermorelin 5mg", href: "/product/63" },
      { label: "AOD-9604 5mg",   href: "/product/1"  },
      { label: "TB-500 5mg",     href: "/product/71" },
    ],
  },
  {
    title: "Peptide Blends",
    href: "/all-peptides?category=Peptide+Blends",
    links: [
      { label: "BPC-157 + TB-500 10mg", href: "/product/7"  },
      { label: "BPC-157 + TB-500 20mg", href: "/product/8"  },
      { label: "CJC1295 + GHRP-2",      href: "/product/24" },
      { label: "CJC1295 + Ipamorelin",  href: "/product/27" },
      { label: "Sermorelin + GHRP-2",   href: "/product/67" },
    ],
  },
  {
    title: "Categories",
    href: "/all-peptides",
    links: [
      { label: "Growth Peptides",   href: "/all-peptides?category=Growth+Peptides"   },
      { label: "Healing Peptides",  href: "/all-peptides?category=Healing+Peptides"  },
      { label: "Weight Management", href: "/all-peptides?category=Weight+Management" },
      { label: "Longevity",         href: "/all-peptides?category=Longevity+Peptides"},
      { label: "Nootropics",        href: "/all-peptides?category=Nootropics"        },
    ],
  },
  {
    title: "Company",
    href: "/contact",
    links: [
      { label: "Contact Us",       href: "/contact"          },
      { label: "Peptide Research", href: "/research"         },
      { label: "Popular Peptides", href: "/popular-peptides" },
      { label: "All Peptides",     href: "/all-peptides"     },
    ],
  },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms"    },
  { label: "Shipping Policy",    href: "/shipping" },
  { label: "Privacy Policy",     href: "/privacy"  },
];

const paymentMethods = ["Visa", "Mastercard", "Amex", "Bitcoin", "Ethereum"];

export default function Footer() {
  return (
    <footer style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* RUO Disclaimer strip */}
      <div
        style={{
          background: "linear-gradient(90deg, #020810 0%, #050D1C 40%, #050D1C 60%, #020810 100%)",
          padding: "11px 16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        {/* Neon top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #00D4FF 30%, #8B5CF6 70%, transparent)", opacity: 0.7 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,212,255,0.04) 1px, transparent 0)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#2A5070", letterSpacing: "0.1em", position: "relative", zIndex: 1, fontFamily: "'Share Tech Mono', monospace" }}>
          ⚗ FOR IN-VITRO LABORATORY RESEARCH USE ONLY · NOT FOR HUMAN USE · 18+ TO PURCHASE
        </p>
      </div>

      {/* Main footer body */}
      <div style={{ backgroundColor: "#020810", color: "#2A5070" }}>

        {/* Neon divider at top */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.15) 50%, transparent)", margin: "0" }} />

        <div className="max-w-[1280px] mx-auto px-4 pt-12 pb-8">

          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">

            {/* Brand column */}
            <div className="md:w-[240px] flex-shrink-0">
              <div className="flex items-center gap-2.5 mb-5">
                <img
                  src="/omniqure-logo.jpeg"
                  alt="OmniQure Peptide Research Institute"
                  style={{ height: "44px", width: "auto", display: "block", borderRadius: "8px" }}
                />
              </div>
              <p style={{ fontSize: "13px", color: "#1A3550", lineHeight: "1.75", marginBottom: "16px" }}>
                Research peptides manufactured to the highest standards of quality and purity. ≥99% HPLC purity guaranteed on every product.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: "≥99% HPLC",      neon: "#00D4FF" },
                  { label: "COA Tested",      neon: "#00FF88" },
                  { label: "Secure Checkout", neon: "#8B5CF6" },
                ].map(b => (
                  <span
                    key={b.label}
                    className="text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                    style={{ background: `${b.neon}08`, color: b.neon, border: `1px solid ${b.neon}25`, fontSize: "10.5px", fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    <span>✓</span> {b.label}
                  </span>
                ))}
              </div>

              {/* Contact micro-info */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: <MapPin size={12} />, text: "United Kingdom",                neon: "#00D4FF" },
                  { icon: <Mail size={12} />,   text: "research@omniqure.co.uk",       neon: "#00D4FF" },
                  { icon: <FlaskConical size={12} />, text: "RUO · HPLC Verified",     neon: "#00D4FF" },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-2" style={{ fontSize: "12px", color: "#1A3550" }}>
                    <span style={{ color: "#1A3A50", flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {footerCategories.map(col => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="block font-bold mb-4"
                    style={{
                      color: "#2A5070", fontSize: "11px", textDecoration: "none",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00D4FF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2A5070"; }}
                  >
                    {col.title}
                  </Link>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          style={{ fontSize: "12.5px", color: "#1A3550", textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#3A6880"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#1A3550"; }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Legal disclaimer block */}
          <div
            className="rounded-xl p-4 mb-7"
            style={{
              background: "rgba(0,212,255,0.03)",
              border: "1px solid rgba(0,212,255,0.1)",
            }}
          >
            <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#142230" }}>
              <strong style={{ color: "#1A3550" }}>IMPORTANT LEGAL NOTICE:</strong>{" "}
              All products sold by OmniQure are intended for in-vitro laboratory research use only. These products are not for human or veterinary use. By purchasing, you confirm you are at least 18 years of age and a qualified researcher.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#142230" }}>
              Products have not been approved by the FDA or any other regulatory body. OmniQure is not responsible for the misuse of any of its products.
            </p>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(0,212,255,0.07)" }}
          >
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5">
              {legalLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ fontSize: "11.5px", color: "#142230", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#2A5070"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#142230"; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span style={{ fontSize: "11px", color: "#0E1E2E", marginRight: "2px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}>WE ACCEPT:</span>
              {paymentMethods.map(p => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md"
                  style={{
                    background: "rgba(0,212,255,0.04)",
                    color: "#1A3550",
                    border: "1px solid rgba(0,212,255,0.1)",
                    fontSize: "10.5px", fontWeight: 700,
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center mt-5" style={{ fontSize: "11px", color: "#0E1E2E", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}>
            © {new Date().getFullYear()} OMNIQURE PEPTIDE RESEARCH INSTITUTE — ALL RIGHTS RESERVED · FOR LABORATORY RESEARCH USE ONLY · UNITED KINGDOM
          </div>
        </div>
      </div>
    </footer>
  );
}
