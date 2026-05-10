import { Link } from "wouter";

const footerCategories = [
  {
    title: "Purchase Peptides",
    href: "/?category=Purchase+Peptides",
    links: [
      { label: "BPC-157 5mg", href: "/product/10" },
      { label: "TB-500 2mg", href: "/product/143" },
      { label: "Ipamorelin 2mg", href: "/product/75" },
      { label: "Semaglutide 3mg", href: "/product/126" },
      { label: "Tirzepatide 5mg", href: "/product/160" },
      { label: "Sermorelin 2mg", href: "/product/134" },
      { label: "NAD+ 100mg", href: "/product/99" },
      { label: "GHK-Cu 50mg", href: "/product/44" },
    ],
  },
  {
    title: "Peptide Blends",
    href: "/?category=Peptide+Blends",
    links: [
      { label: "BPC-157, TB-500 10mg", href: "/product/13" },
      { label: "BPC-157, TB-500 20mg", href: "/product/14" },
      { label: "CJC1295, GHRP2", href: "/product/24" },
      { label: "CJC1295, Ipamorelin", href: "/product/27" },
      { label: "ModGRF, Ipamorelin", href: "/product/93" },
      { label: "Sermorelin, GHRP-2", href: "/product/130" },
      { label: "Tesamorelin, Ipamorelin", href: "/product/148" },
    ],
  },
  {
    title: "Bioregulators",
    href: "/?category=Bioregulators",
    links: [
      { label: "Bronchogen 20mg", href: "/product/18" },
      { label: "Epithalon 20mg", href: "/product/33" },
      { label: "Cardiogen 20mg", href: "/product/20" },
      { label: "Pinealon 20mg", href: "/product/115" },
      { label: "Cortagen 20mg", href: "/product/29" },
      { label: "Vilon 20mg", href: "/product/167" },
    ],
  },
  {
    title: "Other Categories",
    href: "/",
    links: [
      { label: "IGF-1 Proteins", href: "/?category=IGF-1+Proteins" },
      { label: "Melanotan Peptides", href: "/?category=Melanotan+Peptides" },
      { label: "Popular Peptides", href: "/popular-peptides" },
      { label: "All Peptides", href: "/" },
    ],
  },
];

const infoLinks = [
  { label: "About Us", href: "/company" },
  { label: "Contact Us", href: "/contact" },
  { label: "Research", href: "/research" },
  { label: "Peptide Information", href: "/info" },
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
        className="text-center py-3 text-xs font-semibold"
        style={{ backgroundColor: "#E7461E", color: "#fff" }}
      >
        FOR IN-VITRO LABORATORY RESEARCH USE ONLY | NOT FOR HUMAN OR VETERINARY USE | YOU MUST BE 21+ TO PURCHASE
      </div>

      {/* Main footer */}
      <div style={{ backgroundColor: "#222", color: "#ccc" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-10">
          {/* Logo + tagline */}
          <div className="flex flex-col md:flex-row gap-10 mb-8">
            <div className="md:w-[220px] flex-shrink-0">
              <div className="mb-3">
                <img
                  src="/omniqure-logo.jpeg"
                  alt="OmniQure Peptide Research Institute"
                  style={{ height: "46px", width: "auto", display: "block", borderRadius: "5px" }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>
                USA-made research peptides manufactured to the highest standards of quality and purity. 99% HPLC purity guaranteed.
              </p>
              <div className="mt-4 flex gap-3">
                {["Facebook", "Twitter", "Instagram"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs hover:opacity-80"
                    style={{ backgroundColor: "#444", color: "#fff" }}
                    title={s}
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Category columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {footerCategories.map((col) => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="block font-bold mb-3 hover:underline"
                    style={{ color: "#E7461E", fontSize: "13px" }}
                  >
                    {col.title}
                  </Link>
                  <ul className="space-y-1.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="hover:underline hover:text-white transition-colors"
                          style={{ fontSize: "12px", color: "#aaa" }}
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

          {/* Info links */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {infoLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:underline hover:text-white"
                  style={{ fontSize: "12px", color: "#aaa" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer text */}
          <div className="border-t border-gray-700 pt-6">
            <div
              className="text-xs leading-relaxed mb-4"
              style={{ color: "#888" }}
            >
              <p className="mb-2">
                <strong style={{ color: "#aaa" }}>IMPORTANT LEGAL NOTICE:</strong> All products sold by OmniQure.com are intended for in-vitro laboratory research use only. These products are not for human or veterinary use. By purchasing products from this website, you confirm that you are at least 21 years of age and that you are a qualified researcher or are purchasing for use in qualified research.
              </p>
              <p className="mb-2">
                The products are not drugs, and have not been approved by the FDA or any other regulatory body. The products are not intended to diagnose, treat, cure, or prevent any disease. OmniQure.com makes no claims as to the safety or efficacy of its products for human use.
              </p>
              <p>
                Use of any peptide purchased from OmniQure.com for any purpose other than laboratory research is strictly prohibited. OmniQure.com is not responsible for the misuse of any of its products.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {["99% HPLC Purity", "USA Made", "Lab Tested", "Secure Checkout"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 text-xs rounded-sm"
                  style={{ backgroundColor: "#333", color: "#aaa", border: "1px solid #444" }}
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* Payment icons row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span style={{ fontSize: "11px", color: "#666" }}>We Accept:</span>
              {["Visa", "Mastercard", "Amex", "Discover", "Bitcoin", "Ethereum"].map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: "#333", color: "#999", fontSize: "11px" }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Copyright */}
            <div
              className="border-t border-gray-700 pt-4 text-center"
              style={{ fontSize: "11px", color: "#666" }}
            >
              © {new Date().getFullYear()} OmniQure.com — All Rights Reserved. | USA Manufactured Research Peptides | For Laboratory Research Use Only
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
