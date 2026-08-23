import { useCurrency } from "@/context/CurrencyContext";
import { Truck } from "lucide-react";

export const FREE_SHIPPING_THRESHOLD_GBP = 50;

/**
 * Free-shipping progress indicator. Shared by the cart/checkout flow so the
 * threshold logic and styling live in one place instead of being duplicated
 * across pages.
 */
export default function FreeShippingBar({ effectiveTotal, compact = false }: { effectiveTotal: number; compact?: boolean }) {
  const { formatPrice, rates, currency } = useCurrency();
  const rate = rates[currency.code] ?? 1;
  const thresholdLocal = FREE_SHIPPING_THRESHOLD_GBP * rate;
  const remaining = Math.max(0, thresholdLocal - effectiveTotal * rate);
  const pct = Math.min(100, (effectiveTotal / FREE_SHIPPING_THRESHOLD_GBP) * 100);
  const unlocked = pct >= 100;

  if (compact) {
    return (
      <div style={{
        borderRadius: "12px", padding: "10px 14px",
        background: unlocked ? "linear-gradient(90deg,#F0FDF4,#DCFCE7)" : "linear-gradient(90deg,#EEF4FF,#E0EAFF)",
        border: `1px solid ${unlocked ? "#BBF7D0" : "#BFDBFE"}`,
        marginBottom: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "7px" }}>
          <Truck size={13} style={{ color: unlocked ? "#16A34A" : "#1240A0", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: unlocked ? "#166534" : "#1240A0" }}>
            {unlocked
              ? "🎉 You've unlocked free shipping!"
              : `Add ${formatPrice(remaining / rate)} more for free shipping`}
          </span>
        </div>
        <div style={{ height: "6px", borderRadius: "99px", backgroundColor: unlocked ? "#BBF7D0" : "#BFDBFE", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: "99px",
            background: unlocked
              ? "linear-gradient(90deg,#16A34A,#22C55E)"
              : "linear-gradient(90deg,#1240A0,#3B82F6)",
            transition: "width 0.5s cubic-bezier(.22,.68,0,1.2)",
          }} />
        </div>
        {!unlocked && (
          <p style={{ fontSize: "10.5px", color: "#64748B", marginTop: "5px" }}>
            {formatPrice(effectiveTotal * rate / (rate || 1))} of {formatPrice(FREE_SHIPPING_THRESHOLD_GBP)} — {Math.round(pct)}% there
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: "14px", padding: "14px 16px",
      background: unlocked ? "linear-gradient(90deg,#F0FDF4,#DCFCE7)" : "linear-gradient(135deg,#EEF4FF 0%,#E8F0FF 100%)",
      border: `1.5px solid ${unlocked ? "#86EFAC" : "#BFDBFE"}`,
      marginBottom: "4px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "9px" }}>
        <Truck size={15} style={{ color: unlocked ? "#16A34A" : "#1240A0", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: 700, color: unlocked ? "#166534" : "#1240A0" }}>
          {unlocked
            ? "🎉 Free shipping unlocked on this order!"
            : <>Add <strong>{formatPrice(remaining / rate)}</strong> more to unlock free shipping</>}
        </span>
      </div>
      <div style={{ height: "8px", borderRadius: "99px", backgroundColor: unlocked ? "#BBF7D0" : "#DBEAFE", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: "99px",
          background: unlocked
            ? "linear-gradient(90deg,#16A34A,#22C55E)"
            : "linear-gradient(90deg,#1240A0,#2563EB,#3B82F6)",
          transition: "width 0.6s cubic-bezier(.22,.68,0,1.2)",
          boxShadow: unlocked ? "0 0 8px rgba(34,197,94,0.4)" : "0 0 8px rgba(37,99,235,0.3)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ fontSize: "11px", color: "#64748B" }}>
          {formatPrice(effectiveTotal * rate / (rate || 1))} spent
        </span>
        <span style={{ fontSize: "11px", color: "#64748B" }}>
          Free shipping at {formatPrice(FREE_SHIPPING_THRESHOLD_GBP)}
        </span>
      </div>
    </div>
  );
}
