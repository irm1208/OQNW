import { Link } from "wouter";

const footerCategories = [
  {
    title: "Purchase Peptides",
    href: "/all-peptides",
    links: [
      { label: "BPC-157 5mg", href: "/product/10" },
      { label: "Ipamorelin 5mg", href: "/product/75" },
      { label: "GHK-Cu 50mg", href: "/product/44" },
      { label: "Sermorelin 5mg", href: "/product/63" },
      { label: "AOD-9604 5mg", href: "/product/1" },
      { label: "TB-500 5mg", href: "/product/71" },
    ],
  },
  {
    title: "Peptide Blends",
    href: "/all-peptides?category=Peptide+Blends",
    links: [
      { label: "BPC-157 + TB-500 10mg", href: "/product/7" },
      { label: "BPC-157 + TB-500 20mg", href: "/product/8" },
      { label: "CJC1295 + GHRP-2", href: "/product/24" },
      { label: "CJC1295 + Ipamorelin", href: "/product/27" },
      { label: "Sermorelin + GHRP-2", href: "/product/67" },
    ],
  },
  {
    title: "Categories",
    href: "/all-peptides",
    links: [
      { label: "Growth Peptides", href: "/all-peptides?category=Growth+Peptides" },
      { label: "Healing Peptides", href: "/all-peptides?category=Healing+Peptides" },
      { label: "Weight Management", href: "/all-peptides?category=Weight+Management" },
      { label: "Longevity Peptides", href: "/all-peptides?category=Longevity+Peptides" },
      { label: "Nootropics", href: "/all-peptides?category=Nootropics" },
    ],
  },
  {
    title: "Company",
    href: "/company",
    links: [
      { label: "About Us", href: "/company" },
      { label: "Contact Us", href: "/contact" },
      { label: "Peptide Research", href: "/research" },
      { label: "Popular Peptides", href: "/popular-peptides" },
      { label: "All Peptides", href: "/all-peptides" },
    ],
  },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refunds" },
];

export default function Footer() {
  return (
    <footer style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
      {/* Research disclaimer bar */}
      <div
        className="text-center py-2.5 px-4 text-xs font-semibold"
        style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff", letterSpacing: "0.04em" }}
      >
        FOR IN-VITRO LABORATORY RESEARCH USE ONLY · NOT FOR HUMAN USE · 18+ TO PURCHASE
      </div>

      {/* Main footer */}
      <div style={{ backgroundColor: "#0F172A", color: "#94A3B8" }}>
        <div className="max-w-[1280px] mx-auto px-4 pt-10 pb-8">
          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Brand */}
            <div className="md:w-[220px] flex-shrink-0">
              <img
                src="/omniqure-logo.jpeg"
                alt="OmniQure Peptide Research Institute"
                style={{ height: "44px", width: "auto", display: "block", borderRadius: "8px", marginBottom: "14px" }}
              />
              <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.7" }}>
                Research peptides manufactured to the highest standards of quality and purity. 99% HPLC purity guaranteed on every product.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["99% HPLC Purity", "Lab Tested", "Secure Checkout"].map((b) => (
                  <span
                    key={b}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "#1E293B", color: "#64748B", border: "1px solid #334155" }}
                  >
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Link columns — 2 cols on mobile, 4 on md+ */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {footerCategories.map((col) => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="block font-bold mb-3 hover:text-white transition-colors"
                    style={{ color: "#E2E8F0", fontSize: "13px", textDecoration: "none", letterSpacing: "0.02em" }}
                  >
                    {col.title}
                  </Link>
                  <ul className="space-y-1.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="hover:text-white transition-colors"
                          style={{ fontSize: "12px", color: "#64748B", textDecoration: "none" }}
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

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
          >
            <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#475569" }}>
              <strong style={{ color: "#64748B" }}>IMPORTANT LEGAL NOTICE:</strong> All products sold by OmniQure are intended for in-vitro laboratory research use only. These products are not for human or veterinary use. By purchasing, you confirm you are at least 18 years of age and a qualified researcher.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
              Products have not been approved by the FDA or any other regulatory body. OmniQure is not responsible for the misuse of any of its products.
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5" style={{ borderTop: "1px solid #1E293B" }}>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white transition-colors"
                  style={{ fontSize: "11.5px", color: "#475569", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span style={{ fontSize: "11px", color: "#334155" }}>We Accept:</span>
              {["Visa", "Mastercard", "Amex", "Bitcoin", "Ethereum"].map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: "#1E293B", color: "#475569", border: "1px solid #334155", fontSize: "11px" }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center mt-5" style={{ fontSize: "11px", color: "#334155" }}>
            © {new Date().getFullYear()} OmniQure — All Rights Reserved · For Laboratory Research Use Only
          </div>
        </div>
      </div>
    </footer>
  );
}
