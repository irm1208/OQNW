import { Truck } from "lucide-react";

/**
 * Destination-based shipping callout for storefront surfaces.
 * Free standard shipping is not dependent on basket value.
 */
export default function FreeShippingBar() {
  return (
    <div style={{
      borderRadius: "14px",
      padding: "14px 16px",
      background: "#F4F5F8",
      border: "1.5px solid #94A895",
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Truck size={15} style={{ color: "#4E68C2", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#4E68C2" }}>
          Free standard tracked shipping to UK Mainland, Scotland Highlands &amp; Northern Ireland
        </span>
      </div>
    </div>
  );
}