import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { ProductDetail } from "@/data/productDetails";

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #E8EDF5" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "16px 0" }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0F172A",
          }}
        >
          {title}
        </span>
        {open ? (
          <ChevronUp size={16} style={{ color: "#94A3B8", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#94A3B8", flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div style={{ paddingBottom: "16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductInfoAccordion({ detail }: { detail: ProductDetail }) {
  return (
    <div>
      {/* COMPOSITION */}
      {detail.alsoKnownAs && (
        <Section title="Composition" defaultOpen>
          <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7 }}>
            {detail.alsoKnownAs}
          </p>
        </Section>
      )}

      {/* RESEARCH FOCUS */}
      {detail.researchAreas && detail.researchAreas.length > 0 && (
        <Section title="Research Focus" defaultOpen>
          <div className="flex flex-wrap gap-2">
            {detail.researchAreas.map((area) => (
              <span
                key={area}
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 500,
                  backgroundColor: "#EEF4FF",
                  color: "#1B5CB5",
                  border: "1px solid #BFDBFE",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* STORAGE INSTRUCTIONS */}
      <Section title="Storage Instructions" defaultOpen>
        <div className="flex items-start gap-3">
          <span style={{ fontSize: "20px", flexShrink: 0, lineHeight: 1.4 }}>❄</span>
          <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.75, margin: 0 }}>
            {detail.storage ||
              "Store lyophilised powder at 2–8°C. Once reconstituted for in-vitro use, refrigerate and use within 30–45 days. Do not freeze."}
          </p>
        </div>
      </Section>

      {/* SHIPPING & DELIVERY */}
      <Section title="Shipping & Delivery">
        {[
          {
            label: "Free Standard Shipping",
            desc: "(3–5 business days) — on orders over £100",
          },
          {
            label: "Standard",
            desc: "(3–5 business days)",
          },
          {
            label: "Next-Day Delivery - Weekday",
            desc: "— Order before 1PM (Fri before 1PM & weekend orders ship Mon). Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast.",
          },
          {
            label: "Next-Day Delivery - Weekend",
            desc: "— Order before 1PM Fri, delivered Sat. Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast.",
          },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-start gap-2.5 mb-2 last:mb-0">
            <span style={{ color: "#059669", fontWeight: 700, fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✓</span>
            <p style={{ fontSize: "13.5px", color: "#374151", lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: "#0F172A" }}>{label}</strong> {desc}
            </p>
          </div>
        ))}
      </Section>

      {/* RETURNS & REFUNDS */}
      <Section title="Returns & Refunds">
        <p style={{ fontSize: "13.5px", color: "#374151", lineHeight: 1.75, margin: 0 }}>
          Due to the nature of our products, we only accept returns where the wrong item has been sent, provided it remains unopened and in its original condition. We do not accept returns for change of mind. Claims must be raised within 48 hours of delivery with photographic evidence. Contact{" "}
          <a href="mailto:info@omniqure.com" style={{ color: "#1B5CB5", textDecoration: "underline" }}>
            info@omniqure.com
          </a>{" "}
          to initiate a claim.
        </p>
      </Section>
    </div>
  );
}
