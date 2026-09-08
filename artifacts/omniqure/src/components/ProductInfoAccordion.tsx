import type { ProductDetail } from "@/data/productDetails";
export default function ProductInfoAccordion({
  detail,
}: {
  detail: ProductDetail;
}) {
  const items = [
    ...(detail.purity ? [{ label: "Purity", value: detail.purity }] : []),
    ...(detail.appearance ? [{ label: "Form", value: detail.appearance }] : []),
    ...(detail.alsoKnownAs ? [{ label: "Composition", value: detail.alsoKnownAs }] : []),
    ...(detail.storage ? [{ label: "Storage", value: detail.storage }] : []),
  ];

  return (
    <div style={{ marginTop: "12px" }}>
      {/* Description block */}
      {detail.description && (
        <div
          style={{
            borderLeft: "4px solid #1B5CB5",
            backgroundColor: "#F0F5FF",
            padding: "14px 16px",
            borderRadius: "0 8px 8px 0",
            marginBottom: "18px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#1e3a5f", lineHeight: 1.75, margin: 0 }}>
            {detail.description}
          </p>
        </div>
      )}

      {/* Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ color: "#1B5CB5", fontWeight: 700, fontSize: "15px", flexShrink: 0, lineHeight: 1.5 }}>✓</span>
            <p style={{ fontSize: "13.5px", color: "#374151", lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: "#0F172A" }}>{label}:</strong> {value}
            </p>
          </div>
        ))}
      </div>

      {/* RUO badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          padding: "10px 14px",
          backgroundColor: "#F8FAFC",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1B5CB5", flexShrink: 0 }} />
        <p style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#334155", margin: 0 }}>
          For Research Use Only — Not For Human Consumption
        </p>
      </div>
    </div>
  );
}
