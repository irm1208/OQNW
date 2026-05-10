import { Link } from "wouter";
import { FlaskConical, Mail, MapPin } from "lucide-react";

const footerCategories = [
  {
    title: "Purchase Peptides",
    href: "/all-peptides",
    links: [
      { label: "BPC-157 5mg",      href: "/product/10" },
      { label: "Ipamorelin 5mg",   href: "/product/75" },
      { label: "GHK-Cu 50mg",      href: "/product/44" },
      { label: "Sermorelin 5mg",   href: "/product/63" },
      { label: "AOD-9604 5mg",     href: "/product/1"  },
      { label: "TB-500 5mg",       href: "/product/71" },
    ],
  },
  {
    title: "Peptide Blends",
    href: "/all-peptides?category=Peptide+Blends",
    links: [
      { label: "BPC-157 + TB-500 10mg",   href: "/product/7"  },
      { label: "BPC-157 + TB-500 20mg",   href: "/product/8"  },
      { label: "CJC1295 + GHRP-2",        href: "/product/24" },
      { label: "CJC1295 + Ipamorelin",    href: "/product/27" },
      { label: "Sermorelin + GHRP-2",     href: "/product/67" },
    ],
  },
  {
    title: "Categories",
    href: "/all-peptides",
    links: [
      { label: "Growth Peptides",     href: "/all-peptides?category=Growth+Peptides"     },
      { label: "Healing Peptides",    href: "/all-peptides?category=Healing+Peptides"    },
      { label: "Weight Management",   href: "/all-peptides?category=Weight+Management"   },
      { label: "Longevity Peptides",  href: "/all-peptides?category=Longevity+Peptides"  },
      { label: "Nootropics",          href: "/all-peptides?category=Nootropics"          },
    ],
  },
  {
    title: "Company",
    href: "/company",
    links: [
      { label: "Contact Us",          href: "/contact"          },
      { label: "Peptide Research",    href: "/research"         },
      { label: "Popular Peptides",    href: "/popular-peptides" },
      { label: "All Peptides",        href: "/all-peptides"     },
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
          background: "linear-gradient(90deg, #020B1E 0%, #071A4A 40%, #1240A0 70%, #071A4A 100%)",
          padding: "11px 16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#93C5FD",
            letterSpacing: "0.1em",
            position: "relative",
            zIndex: 1,
          }}
        >
          ⚗️ FOR IN-VITRO LABORATORY RESEARCH USE ONLY · NOT FOR HUMAN USE · 18+ TO PURCHASE
        </p>
      </div>

      {/* Main footer body */}
      <div style={{ backgroundColor: "#070F1F", color: "#94A3B8" }}>
        <div className="max-w-[1280px] mx-auto px-4 pt-12 pb-8">

          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">

            {/* Brand column */}
            <div className="md:w-[240px] flex-shrink-0">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/omniqure-logo.jpeg"
                  alt="OmniQure Peptide Research Institute"
                  style={{ height: "42px", width: "auto", display: "block", borderRadius: "8px" }}
                />
              </div>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.75", marginBottom: "16px" }}>
                Research peptides manufactured to the highest standards of quality and purity. ≥99% HPLC purity guaranteed on every product.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["≥99% HPLC", "COA Tested", "Secure Checkout"].map(b => (
                  <span
                    key={b}
                    className="text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                    style={{ backgroundColor: "#0D1A30", color: "#475569", border: "1px solid #1E2D45", fontSize: "11px" }}
                  >
                    <span style={{ color: "#34D399" }}>✓</span> {b}
                  </span>
                ))}
              </div>

              {/* Contact micro-info */}
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "#475569" }}>
                  <MapPin size={13} style={{ color: "#334155", flexShrink: 0 }} />
                  United Kingdom
                </span>
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "#475569" }}>
                  <Mail size={13} style={{ color: "#334155", flexShrink: 0 }} />
                  research@omniqure.co.uk
                </span>
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "#475569" }}>
                  <FlaskConical size={13} style={{ color: "#334155", flexShrink: 0 }} />
                  RUO · Lab Certified · HPLC Verified
                </span>
              </div>
            </div>

            {/* Link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {footerCategories.map(col => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="block font-bold mb-4"
                    style={{ color: "#CBD5E1", fontSize: "12.5px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#CBD5E1"}
                  >
                    {col.title}
                  </Link>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          style={{ fontSize: "12.5px", color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#94A3B8"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
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
              backgroundColor: "#0D1A30",
              border: "1px solid #1E2D45",
              backgroundImage: "linear-gradient(135deg, #0D1A30 0%, #0A1525 100%)",
            }}
          >
            <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#334155" }}>
              <strong style={{ color: "#475569" }}>IMPORTANT LEGAL NOTICE:</strong>{" "}
              All products sold by OmniQure are intended for in-vitro laboratory research use only. These products are not for human or veterinary use. By purchasing, you confirm you are at least 18 years of age and a qualified researcher.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#334155" }}>
              Products have not been approved by the FDA or any other regulatory body. OmniQure is not responsible for the misuse of any of its products.
            </p>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid #0D1A30" }}
          >
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5">
              {legalLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ fontSize: "11.5px", color: "#334155", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#334155"}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span style={{ fontSize: "11px", color: "#1E2D45", marginRight: "2px" }}>We Accept:</span>
              {paymentMethods.map(p => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: "#0D1A30",
                    color: "#334155",
                    border: "1px solid #1E2D45",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center mt-5" style={{ fontSize: "11px", color: "#1E2D45" }}>
            © {new Date().getFullYear()} OmniQure Peptide Research Institute — All Rights Reserved · For Laboratory Research Use Only · United Kingdom
          </div>
        </div>
      </div>
    </footer>
  );
}
