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
      { label: "Track Your Order",    href: "/track-order"      },
      { label: "Research Stacks",     href: "/stacks"           },
      { label: "Bundle & Save",       href: "/bundles"          },
      { label: "Lab Results & COA",   href: "/lab-results"      },
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
          background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
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
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", color: "#94A3B8" }}>
        <div className="max-w-[1280px] mx-auto px-4 pt-12 pb-8">

          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">

            {/* Brand column */}
            <div className="md:w-[240px] flex-shrink-0">
              <div className="flex items-center gap-2.5 mb-4">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                  <div>
                    <img
                      src="/omniqure-wordmark.png"
                      alt="OmniQure"
                      style={{ height: "52px", width: "auto", display: "block" }}
                    />
                    <span style={{ display: "block", marginLeft: "33%", width: "61%", textAlign: "center", color: "rgba(255,255,255,0.82)", fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.18em", overflow: "hidden", marginTop: "2px" }}>
                      PEPTIDE RESEARCH INSTITUTE
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.70)", lineHeight: "1.75", marginBottom: "16px" }}>
                Research peptides manufactured to the highest standards of quality and purity. 99%+ HPLC purity guaranteed on every product.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["99%+ HPLC", "COA Tested", "Secure Checkout"].map(b => (
                  <span
                    key={b}
                    className="text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.20)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.20)", fontSize: "11px" }}
                  >
                    <span style={{ color: "#34D399" }}>✓</span> {b}
                  </span>
                ))}
              </div>

              {/* Contact micro-info */}
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.70)" }}>
                  <Mail size={13} style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
                  research@omniqure.com
                </span>
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.70)" }}>
                  <FlaskConical size={13} style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
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
                    style={{ color: "#fff", fontSize: "12.5px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#34D399"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                  >
                    {col.title}
                  </Link>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.60)", textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.60)"}
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
              backgroundColor: "rgba(0,0,0,0.20)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p className="text-xs leading-relaxed mb-1.5" style={{ color: "rgba(255,255,255,0.65)" }}>
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>IMPORTANT LEGAL NOTICE:</strong>{" "}
              All products sold by OmniQure are intended for in-vitro laboratory research use only. These products are not for human or veterinary use. By purchasing, you confirm you are at least 18 years of age and a qualified researcher.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Products have not been approved by the FDA or any other regulatory body. OmniQure is not responsible for the misuse of any of its products.
            </p>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5">
              {legalLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.50)", marginRight: "2px" }}>We Accept:</span>
              {paymentMethods.map(p => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.20)",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center mt-5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} OmniQure Peptide Research Institute — All Rights Reserved · For Laboratory Research Use Only
          </div>
        </div>
      </div>
    </footer>
  );
}
