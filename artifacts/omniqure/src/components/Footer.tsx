import { Link } from "wouter";
import { FlaskConical, Mail, MapPin } from "lucide-react";

const footerCategories = [
  {
    title: "Purchase Peptides",
    href: "/all-peptides",
    links: [
      { label: "BPC-157 5mg",      href: "/product/bpc-157-5mg" },
      { label: "Ipamorelin 5mg",   href: "/product/ipamorelin-5mg" },
      { label: "GHK-Cu 50mg",      href: "/product/ghk-cu-50mg" },
      { label: "Sermorelin 5mg",   href: "/product/sermorelin-5mg" },
      { label: "AOD-9604 5mg",     href: "/product/aod-9604-5mg" },
      { label: "TB-500 5mg",       href: "/product/tb-500-5mg" },
    ],
  },
  {
    title: "Peptide Blends",
    href: "/all-peptides?category=Peptide+Blends",
    links: [
      { label: "BPC-157 + TB-500 10mg",   href: "/product/bpc-157-tb-500-blend-10mg" },
      { label: "BPC-157 + TB-500 20mg",   href: "/product/bpc-157-tb-500-blend-20mg" },
      { label: "CJC-1295 + Ipamorelin",   href: "/product/cjc-1295-no-dac-ipamorelin-5mg" },
      { label: "Tesamorelin + Ipamorelin", href: "/product/tesamorelin-ipamorelin-blend-8mg" },
      { label: "Semax + Selank",          href: "/product/semax-selank-blend-20mg" },
    ],
  },
  {
    title: "Categories",
    href: "/all-peptides",
    links: [
      { label: "Growth Peptides",     href: "/all-peptides?category=Growth+Peptides"     },
      { label: "Healing Peptides",    href: "/all-peptides?category=Healing+Peptides"    },
      { label: "Longevity Peptides",  href: "/all-peptides?category=Longevity+Peptides"  },
      { label: "Nootropics",          href: "/all-peptides?category=Nootropics"          },
    ],
  },
  {
    title: "Company",
    href: "/about",
    links: [
      { label: "About Us",             href: "/about"            },
      { label: "Contact Us",          href: "/contact"          },
      { label: "Track Your Order",    href: "/track-order"      },
      { label: "Research Stacks",     href: "/stacks"           },
      { label: "Protocols",           href: "/protocols"        },
      { label: "Storage Guide",       href: "/storage-guide"    },
      { label: "FAQ",                 href: "/faq"              },
      { label: "Glossary",            href: "/glossary"         },
      { label: "Bundle & Save",       href: "/bundle-and-save"  },
      { label: "All Peptides",        href: "/all-peptides"     },
      { label: "Refer a Friend",      href: "/refer-a-friend"   },
    ],
  },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms"    },
  { label: "Shipping Policy",    href: "/shipping" },
  { label: "Privacy Policy",     href: "/privacy"  },
];

const paymentBadges = [
  {
    label: "Pay by Bank",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Bitcoin",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.06 11.57c.29-.69.45-1.45.45-2.23C17.51 6.37 15.14 4 12.17 4H8v3H6v2h2v2H6v2h2v7h4.65c2.75 0 5-2.06 5.12-4.76.08-1.65-.69-3.11-1.71-3.67zM11 7h1.17c1.02 0 1.84.82 1.84 1.84S13.19 10.68 12.17 10.68H11V7zm1.65 10H11v-3.33h1.65c.92 0 1.67.75 1.67 1.67s-.75 1.66-1.67 1.66z"/>
      </svg>
    ),
  },
  {
    label: "Ethereum",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L5 12.5l7 4 7-4L12 2zM5 14l7 8 7-8-7 4-7-4z"/>
      </svg>
    ),
  },
  {
    label: "USDT",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <path d="M13 8h-5v2.5h2v5.5h2V10.5h2V8h-1zm1 0h1v8h-1V8z" fill="white"/>
      </svg>
    ),
  },
];


export default function Footer() {
  return (
    <footer style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>


      {/* Main footer body */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", color: "#94A3B8" }}>
        <div className="max-w-[1280px] mx-auto px-4 pt-2 md:pt-12 pb-4 md:pb-8">

          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 mb-4 md:mb-10">

            {/* Brand column */}
            <div className="md:w-[240px] flex-shrink-0 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2.5 mb-2 md:mb-4">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                  <div style={{ display: "inline-block" }}>
                    <img
                      src="/omniqure-wordmark.png"
                      alt="OmniQure"
                      className="h-8 md:h-[52px]"
                      style={{ width: "auto", maxWidth: "none", display: "block" }}
                    />
                    <span className="hidden md:block" style={{ display: "block", width: "230px", textAlign: "right", color: "#E8A93E", fontSize: "8px", fontWeight: 900, letterSpacing: "0.18em", whiteSpace: "nowrap", overflow: "hidden", marginTop: "2px" }}>
                      PEPTIDE RESEARCH INSTITUTE
                    </span>
                  </div>
                </div>
              </div>
              <p className="hidden md:block" style={{ fontSize: "13px", color: "rgba(255,255,255,0.70)", lineHeight: "1.75", marginBottom: "16px" }}>
                Research peptides manufactured to the highest standards of quality and purity. 98%+ verified purity guaranteed on every product.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-2 md:mb-5">
                {["98%+", "Janoshik Verified", "Secure Checkout"].map(b => (
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
              <div className="hidden md:flex flex-col gap-2">
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.70)" }}>
                  <Mail size={13} style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
                  research@omniqure.com
                </span>
                <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.70)" }}>
                  <FlaskConical size={13} style={{ color: "rgba(255,255,255,0.50)", flexShrink: 0 }} />
                  RUO · Lab Certified · verified
                </span>
              </div>

            </div>

            {/* Link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 md:gap-6">
              {footerCategories.map(col => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="block font-bold mb-2 md:mb-4"
                    style={{ color: "#E8A93E", fontSize: "12.5px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#F5C76B"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#E8A93E"}
                  >
                    {col.title}
                  </Link>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
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

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 pt-3 md:pt-6"
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
              {paymentBadges.map(b => (
                <span
                  key={b.label}
                  className="px-2.5 py-1 rounded-md"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    backgroundColor: "rgba(0,0,0,0.20)",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Janoshik independent verification strip */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 md:mt-6 py-3 md:py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Independently Verified By
            </span>
            <a
              href="/lab-reports"
              style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
              title="View our independent lab reports on Janoshik"
            >
              <span style={{
                background: "#E8F0F8",
                borderRadius: "40px",
                padding: "5px 16px",
                display: "inline-flex",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(0,0,0,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.25)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
              >
                <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "24px", width: "auto", borderRadius: "3px", display: "block" }} />
              </span>
            </a>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.40)" }}>
              HPLC &amp; ESI-MS · Every batch tested
            </span>
          </div>

          <div className="text-center mt-3 md:mt-5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} OmniQure Peptide Research Institute — All Rights Reserved · For Laboratory Research Use Only
          </div>
        </div>
      </div>
    </footer>
  );
}
