import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/pixels";
import { Link } from "wouter";
import { CheckCircle2, Clock, Truck, FlaskConical, ArrowRight, Search, Download } from "lucide-react";

/**
 * Landing page for customers returning from the Wallid hosted-checkout payment flow.
 *
 * Wallid redirects to success_url or fail_url with our own query params appended.
 * We read: order, name, total, ship, status (success | failed).
 */
export default function WallidReturn() {
  const params = new URLSearchParams(window.location.search);
  const order  = params.get("order") ?? "OQ-000000";
  const name   = params.get("name")  ?? "Researcher";
  const total  = params.get("total") ?? "0.00";
  const ship   = params.get("ship")  ?? "Standard";

  // Wallid appends status=success or status=failed to the redirect URL
  const wallidStatus = params.get("status") ?? "";
  const failed = wallidStatus.toLowerCase() === "failed" || wallidStatus.toLowerCase() === "cancelled";

  const today = new Date();
  const deliveryDays = ship === "Next Day" ? 1 : ship === "Express" ? 2 : 5;
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + deliveryDays);
  const deliveryStr = delivery.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const purchaseFired = useRef(false);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (!purchaseFired.current && order !== "OQ-000000" && !failed) {
      purchaseFired.current = true;
      trackPurchase(order, parseFloat(total), 1);
    }
  }, []);

  if (failed) {
    return (
      <div style={{
        fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC",
        minHeight: "70vh", padding: "48px 16px",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg, #DC2626, #EF4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Clock size={36} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A", marginBottom: "8px" }}>
            Payment not completed
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "28px", lineHeight: 1.6 }}>
            Your order <strong style={{ color: "#0F172A" }}>{order}</strong> has been reserved but we haven't received payment yet. You can try again or choose a different payment method.
          </p>
          <Link
            href="/cart"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              height: "46px", paddingLeft: "24px", paddingRight: "24px",
              borderRadius: "12px", background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
              color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none",
            }}
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC",
      minHeight: "70vh", padding: "48px 16px",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Success icon */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #059669, #34D399)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 12px 40px rgba(5,150,105,0.3)",
          }}>
            <CheckCircle2 size={40} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: "8px" }}>
            Payment received — thank you!
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.6 }}>
            Your open banking payment has been submitted,{" "}
            <strong style={{ color: "#0F172A" }}>{name}</strong>.
            We'll confirm and dispatch once it clears — usually within minutes.
          </p>
        </div>

        {/* Status card */}
        <div style={{
          borderRadius: "16px", border: "1.5px solid #BBF7D0",
          backgroundColor: "#F0FDF4", padding: "22px", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <CheckCircle2 size={18} color="#059669" />
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#065F46", margin: 0 }}>
              Bank payment submitted via Wallid
            </p>
          </div>
          <p style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.65, margin: 0 }}>
            Your payment has been initiated directly from your bank. Faster Payments typically settle within seconds. We'll send you an email confirmation once the funds are received and your order is dispatched.
          </p>
        </div>

        {/* Order card */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "20px",
          border: "1.5px solid #E8EDF5", boxShadow: "0 8px 40px rgba(15,23,42,0.07)",
          overflow: "hidden", marginBottom: "20px",
        }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "18px 24px", color: "#fff" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
              Order Reference
            </p>
            <p style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "0.05em", marginTop: "2px" }}>{order}</p>
          </div>

          {/* Status tracker */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", gap: "0", position: "relative" }}>
              {["Order Placed", "Payment Received", "Dispatched", "Delivered"].map((label, i) => (
                <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative" }}>
                  {i < 3 && (
                    <div style={{
                      position: "absolute", top: "12px", left: "50%", right: "-50%",
                      height: "2px", backgroundColor: i <= 1 ? "#059669" : "#E2E8F0", zIndex: 0,
                    }} />
                  )}
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", zIndex: 1,
                    backgroundColor: i <= 1 ? "#059669" : i === 2 ? "#FCD34D" : "#E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i <= 1
                      ? <CheckCircle2 size={14} color="#fff" />
                      : i === 2
                      ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />
                      : <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
                    }
                  </div>
                  <p style={{
                    fontSize: "10.5px", fontWeight: i <= 1 ? 700 : 500,
                    color: i <= 1 ? "#059669" : i === 2 ? "#D97706" : "#94A3B8",
                    textAlign: "center",
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: "20px 24px" }}>
            <div className="form-grid-2" style={{ gap: "16px" }}>
              {[
                { icon: <CheckCircle2 size={16} />, label: "Order Total", value: `£${parseFloat(total).toFixed(2)}`, color: "#1240A0" },
                { icon: <Truck size={16} />, label: "Shipping", value: ship, color: "#0F172A" },
                { icon: <FlaskConical size={16} />, label: "Est. Delivery", value: deliveryStr, color: "#0F172A" },
                { icon: <CheckCircle2 size={16} />, label: "Purity", value: "98%+ verified", color: "#059669" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{ color: "#1B5CB5", marginTop: "1px", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 700, color: item.color }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div style={{ padding: "18px 24px", backgroundColor: "#F8FAFF", borderTop: "1px solid #EEF4FF" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              What happens next
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Your open banking payment is being processed — Faster Payments usually settle in seconds.",
                "We'll send a confirmation email once funds are received.",
                "Our lab team will then prepare your secure, discreet packaging for dispatch.",
                "You'll receive a dispatch notification with tracking information.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                    backgroundColor: "#EEF4FF", color: "#1B5CB5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 800,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.55, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <Link
            href="/all-peptides"
            style={{
              flex: 1, height: "46px", borderRadius: "12px",
              background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              textDecoration: "none",
            }}
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link
            href={`/track-order?q=${encodeURIComponent(order)}`}
            style={{
              height: "46px", paddingLeft: "18px", paddingRight: "18px", borderRadius: "12px",
              border: "1.5px solid #E2E8F0", backgroundColor: "#fff",
              color: "#475569", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              textDecoration: "none",
            }}
          >
            <Search size={14} /> Track Order
          </Link>
          <button
            onClick={() => window.open(`/api/orders/${order}/receipt`, "_blank")}
            style={{
              height: "46px", paddingLeft: "18px", paddingRight: "18px", borderRadius: "12px",
              border: "1.5px solid #E2E8F0", backgroundColor: "#fff",
              color: "#475569", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <Download size={14} /> Receipt
          </button>
        </div>

        {/* RUO reminder */}
        <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "14px", flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: "12px", color: "#92400E", lineHeight: 1.6, margin: 0 }}>
            <strong>Research Use Only:</strong> These products are for in-vitro laboratory research exclusively. Not for human or veterinary use. Please handle and store in accordance with your institution's safety protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
