import { Link } from "wouter";

const INK = "#1D2948";
const GRAPHITE = "#4A5672";
const HAIRLINE = "rgba(11,18,32,0.09)";

const columns = [
  {
    title: "Catalog",
    links: [
      { label: "All peptides", href: "/all-peptides" },
      { label: "Research stacks", href: "/stacks" },
      { label: "Bundle & save", href: "/bundle-and-save" },
      { label: "Bac water", href: "/bac-water" },
    ],
  },
  {
    title: "Lab",
    links: [
      { label: "Peptide calculator", href: "/peptide-calculator" },
      { label: "Lab reports", href: "/lab-reports" },
      { label: "Protocols", href: "/protocols" },
      { label: "Storage guide", href: "/storage-guide" },
      { label: "Glossary", href: "/glossary" },
      { label: "Research notes", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About & standards", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Track your order", href: "/track-order" },
      { label: "FAQ", href: "/faq" },
      { label: "Refer a friend", href: "/refer-a-friend" },
      { label: "Earn with us", href: "/affiliate" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Shipping", href: "/shipping" },
  { label: "Contact", href: "/contact" },
];

const mono = { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: GRAPHITE };
const legal = { fontSize: 11.5, lineHeight: 1.65, color: GRAPHITE };

export default function Footer() {
  return (
    <footer className="bg-white" style={{ borderTop: `1px solid ${HAIRLINE}`, fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          <div className="col-span-2 max-w-md">
            <Link href="/" aria-label="OmniQure home" className="inline-flex items-center hover:opacity-80 transition-opacity">
              <img src="/omniqure-wordmark.png?v=4" alt="OmniQure" className="header-logo" style={{ width: 170, maxHeight: 36 }} />
            </Link>
            <p className="mt-5" style={{ fontSize: 14, lineHeight: 1.625, color: GRAPHITE }}>
              Research peptides manufactured to the highest standards of quality and purity. 99%+ independently verified purity across every published result.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ border: `1px solid ${HAIRLINE}`, background: "rgba(239,244,252,0.4)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#4F6B52" }} />
              <span style={mono}>Janoshik verified · RUO</span>
            </div>
            <address className="mt-6 not-italic" style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(74,85,104,0.8)" }}>
              <a href="mailto:support@omniqure.com" className="hover:text-[#1D2948]">support@omniqure.com</a>
            </address>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4" style={mono}>{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-[#4E68C2]" style={{ fontSize: 13.5, color: INK }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12" style={legal}>
          OmniQure is an independent supplier of research-use-only compounds. Any third-party names or trade marks referred to remain the property of their respective owners.
        </p>
        <p className="mt-3" style={legal}>
          Purity results are published as independent Janoshik HPLC and mass-spec reports on our lab reports page.
        </p>

        <div className="mt-14 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <div style={mono}>© {new Date().getFullYear()} OmniQure</div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-[#1D2948]" style={{ fontSize: 11.5, color: GRAPHITE }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 max-w-3xl" style={{ fontSize: 11, lineHeight: 1.65, color: "rgba(74,85,104,0.8)" }}>
          <span className="mr-1" style={{ ...mono, color: INK }}>Disclaimer.</span>
          All products are intended for in-vitro laboratory research purposes only. Not for human or animal consumption, clinical, diagnostic, therapeutic, cosmetic or any in-vivo use. By purchasing, you confirm you are a qualified researcher or laboratory professional.
        </p>
      </div>
    </footer>
  );
}
