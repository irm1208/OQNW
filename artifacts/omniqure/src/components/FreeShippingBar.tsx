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
      background: "linear-gradient(135deg,#EEF4FF 0%,#E8F0FF 100%)",
      border: "1.5px solid #BFDBFE",
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Truck size={15} style={{ color: "#1240A0", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1240A0" }}>
          Free standard tracked shipping to UK Mainland, Scotland Highlands &amp; Northern Ireland
        </span>
      </div>
    </div>
  );
}