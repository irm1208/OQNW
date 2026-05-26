import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

const footerCategories = [
  {
    title: "Shop",
    href: "/all-peptides",
    links: [
      { label: "All Peptides",      href: "/all-peptides" },
      { label: "Research Stacks",   href: "/stacks" },
      { label: "Bundle & Save",     href: "/bundles" },
      { label: "Popular Peptides",  href: "/popular-peptides" },
    ],
  },
  {
    title: "Research",
    href: "/lab-results",
    links: [
      { label: "Lab Results & COA", href: "/lab-results" },
      { label: "Lab Tests",         href: "/lab-tests" },
      { label: "Peptide Calculator",href: "/calculator" },
    ],
  },
  {
    title: "Company",
    href: "/contact",
    links: [
      { label: "Contact Us",        href: "/contact" },
      { label: "Track Your Order",  href: "/track-order" },
    ],
  },
  {
    title: "Support",
    href: "/shipping",
    links: [
      { label: "Shipping Policy",   href: "/shipping" },
      { label: "Privacy Policy",    href: "/privacy" },
      { label: "Terms & Conditions",href: "/terms" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy",     href: "/privacy"   },
  { label: "Terms & Conditions", href: "/terms"     },
  { label: "Shipping Policy",    href: "/shipping"  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus("success");
        setMsg(data.message ?? "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMsg("Could not connect. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#EEF7F7", borderRadius: 0, border: "1px solid #D4E8E8" }}>
        <CheckCircle size={16} color="#2A5F5F" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 13, color: "#2A5F5F", fontWeight: 600 }}>{msg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "#999999", textTransform: "uppercase", letterSpacing: "0.25em" }}>
        Research Newsletter
      </p>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#666666", lineHeight: 1.6 }}>
        New compounds, lab updates &amp; exclusive offers.
      </p>
      <div style={{ display: "flex", gap: 0 }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            flex: 1, height: 40, padding: "0 12px",
            border: "1px solid #D4E8E8", borderRight: "none",
            background: "#FFFFFF", color: "#2C3E3E", fontSize: 13, outline: "none",
            fontFamily: "Roboto, Arial, sans-serif", borderRadius: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            height: 40, padding: "0 18px",
            background: status === "loading" ? "#A8D4D4" : "#2A5F5F",
            border: "none", color: "#fff", cursor: "pointer",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
            fontFamily: "Roboto, Arial, sans-serif", borderRadius: 0,
          }}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#DC2626" }}>{msg}</p>
      )}
    </form>
  );
}

export default function Footer() {
  return (
    <footer style={{ fontFamily: "Roboto, Arial, sans-serif" }}>

      {/* Email + legal strip — bg-[#2A3F3F] dark teal */}
      <div style={{ background: "#2A3F3F", padding: "56px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: "#A8D4D4", marginBottom: 10 }}>
            Exclusive Access
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 500, color: "#FFFFFF", margin: "0 0 12px", lineHeight: 1.2 }}>
            Research Insights.<br />Priority Launches.
          </h2>
          <p style={{ fontSize: 14, color: "#A8D4D4", margin: "0 auto 32px", maxWidth: 440, lineHeight: 1.7 }}>
            Subscribe for early access to new compounds, lab updates and an exclusive 15% off your first order.
          </p>
          <div style={{ maxWidth: 440, margin: "0 auto 14px" }}>
            <NewsletterForm />
          </div>
          <p style={{ fontSize: 10, color: "#6A9A9A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            No spam. Unsubscribe at any time.
          </p>

          {/* Legal disclaimer */}
          <div style={{ maxWidth: 800, margin: "36px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#FFFFFF", whiteSpace: "nowrap", marginTop: 2 }}>Research Use Only</span>
            <div style={{ width: 1, height: 16, background: "rgba(42,95,95,0.6)", marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: "#7A9F9F", lineHeight: 1.65, margin: 0 }}>
              All products are intended solely for in vitro laboratory research purposes. Not approved for human or veterinary use. Not for human consumption. By purchasing, you confirm you are{" "}
              <strong style={{ color: "#A0C4C4" }}>18+</strong> and products will be handled only by qualified researchers.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer — white bg */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #D4E8E8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 48px 32px" }}>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32, paddingBottom: 40, borderBottom: "1px solid #D4E8E8" }}>
            {/* Brand col */}
            <div>
              <img
                src="/omniqure-wordmark.png"
                alt="OmniQure"
                style={{ height: 50, width: "auto", marginBottom: 16, display: "block" }}
              />
              <p style={{ fontSize: 12, color: "#666666", lineHeight: 1.75, marginBottom: 20 }}>
                Premium research peptides. Third-party verified. HPLC purity guaranteed on every product.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["HPLC Verified", "COA Included", "Secure Checkout"].map(b => (
                  <span key={b} style={{ fontSize: 11, color: "#2A5F5F", border: "1px solid rgba(42,95,95,0.25)", padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#2A5F5F" }}>✓</span> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerCategories.map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#999999", marginBottom: 18 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        style={{ fontSize: 13, color: "#666666", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#2A5F5F"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#666666"}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "#999999", margin: 0 }}>
              © {new Date().getFullYear()} OmniQure Peptide Research Institute · For Laboratory Research Use Only
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {legalLinks.map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 12, color: "#999999", textDecoration: "none" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
