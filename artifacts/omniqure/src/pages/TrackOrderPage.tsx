import { useState, useEffect } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, FlaskConical, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

type OrderStatus = "pending" | "awaiting_payment" | "payment_received" | "processing" | "shipped" | "delivered" | "cancelled";

type TrackResult = {
  orderNumber: string;
  status: OrderStatus;
  shippingMethod: string | null;
  createdAt: string;
  itemCount: number;
  items: Array<{ productName: string; quantity: number }>;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode; step: number }> = {
  pending:           { label: "Order Placed",      color: "#D97706", bg: "#FFFBEB", icon: <Clock size={18} />,        step: 0 },
  awaiting_payment:  { label: "Awaiting Payment",   color: "#B45309", bg: "#FFFBEB", icon: <Clock size={18} />,        step: -1 },
  payment_received:  { label: "Payment Received",   color: "#0D9488", bg: "#F0FDFA", icon: <CheckCircle2 size={18} />, step: 0 },
  processing:        { label: "Processing",         color: "#2563EB", bg: "#EFF6FF", icon: <Package size={18} />,      step: 1 },
  shipped:           { label: "Dispatched",         color: "#7C3AED", bg: "#F5F3FF", icon: <Truck size={18} />,        step: 2 },
  delivered:         { label: "Delivered",          color: "#059669", bg: "#F0FDF4", icon: <CheckCircle2 size={18} />, step: 3 },
  cancelled:         { label: "Cancelled",          color: "#DC2626", bg: "#FEF2F2", icon: <XCircle size={18} />,      step: -1 },
};

const STEPS = ["Order Placed", "Processing", "Dispatched", "Delivered"];

export default function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? params.get("number");
    if (q) {
      const val = q.trim().toUpperCase();
      setInput(val);
      setLoading(true);
      setSearched(true);
      fetch(apiUrl(`orders/track?number=${encodeURIComponent(val)}`))
        .then((res) => {
          if (res.status === 404) { setError("No order found with that reference number."); return null; }
          if (!res.ok) throw new Error("Server error");
          return res.json() as Promise<TrackResult>;
        })
        .then((data) => { if (data) setResult(data); })
        .catch(() => setError("Something went wrong. Please try again."))
        .finally(() => setLoading(false));
    }
  }, []);

  async function handleTrack(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);
    try {
      const res = await fetch(apiUrl(`orders/track?number=${encodeURIComponent(trimmed)}`));
      if (res.status === 404) {
        setError("No order found with that reference number. Please check and try again.");
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json() as TrackResult;
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cfg = result ? STATUS_CONFIG[result.status] ?? STATUS_CONFIG.pending : null;

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "70vh", padding: "48px 16px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0D2565, #1B5CB5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(13,37,101,0.25)",
          }}>
            <Package size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: "8px" }}>
            Track Your Order
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
            Enter your order reference number to see the current status of your shipment.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleTrack} style={{ marginBottom: "28px" }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "20px",
            border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
            padding: "24px",
          }}>
            <label style={{ fontSize: "13px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "10px" }}>
              Order Reference Number
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  value={input}
                  onChange={e => setInput(e.target.value.toUpperCase())}
                  placeholder="OQ-123456"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "14px",
                    borderRadius: "10px", border: "1.5px solid #E2E8F0",
                    fontSize: "15px", fontWeight: 700, color: "#0F172A",
                    backgroundColor: "#F8FAFC", outline: "none",
                    letterSpacing: "0.06em", boxSizing: "border-box",
                    fontFamily: "'Arimo', Arial, sans-serif",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#1B5CB5"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  height: "44px", paddingLeft: "20px", paddingRight: "20px",
                  borderRadius: "10px", border: "none",
                  background: loading || !input.trim() ? "#E2E8F0" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                  color: loading || !input.trim() ? "#94A3B8" : "#fff",
                  fontSize: "14px", fontWeight: 700,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  flexShrink: 0, transition: "background 0.15s",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {loading ? "Searching…" : <><Search size={14} /> Track</>}
              </button>
            </div>
          </div>
        </form>

        {/* Error state */}
        {error && searched && (
          <div style={{
            backgroundColor: "#FEF2F2", border: "1.5px solid #FCA5A5",
            borderRadius: "16px", padding: "20px 24px",
            display: "flex", gap: "12px", alignItems: "flex-start",
            marginBottom: "20px",
          }}>
            <XCircle size={18} style={{ color: "#DC2626", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#DC2626", marginBottom: "4px" }}>Order not found</p>
              <p style={{ fontSize: "13px", color: "#7F1D1D" }}>{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && cfg && (
          <div style={{
            backgroundColor: "#fff", borderRadius: "20px",
            border: "1.5px solid #E8EDF5", boxShadow: "0 8px 40px rgba(15,23,42,0.07)",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "18px 24px", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Order Reference</p>
                  <p style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "0.05em", marginTop: "2px" }}>{result.orderNumber}</p>
                </div>
                <div style={{
                  backgroundColor: cfg.bg, color: cfg.color,
                  borderRadius: "12px", padding: "8px 14px",
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "13px", fontWeight: 700,
                }}>
                  {cfg.icon} {cfg.label}
                </div>
              </div>
            </div>

            {/* Awaiting-payment banner (no progress tracker — payment hasn't been confirmed yet) */}
            {result.status === "awaiting_payment" && (
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Clock size={18} style={{ color: "#B45309", flexShrink: 0, marginTop: "1px" }} />
                <div>
                  <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>We're waiting for your bank transfer</p>
                  <p style={{ fontSize: "12.5px", color: "#78350F", lineHeight: 1.6 }}>
                    Bank transfers are confirmed manually by our team and can take 1–2 business days to arrive. We'll update this page as soon as we've confirmed receipt — there's no need to contact us unless it's been longer than that.
                  </p>
                </div>
              </div>
            )}

            {/* Progress tracker (only shown once the order is confirmed and moving through fulfillment) */}
            {result.status !== "cancelled" && result.status !== "awaiting_payment" && (
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", gap: "0", position: "relative" }}>
                  {STEPS.map((label, i) => {
                    const done = cfg.step > i;
                    const active = cfg.step === i;
                    return (
                      <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative" }}>
                        {i < STEPS.length - 1 && (
                          <div style={{ position: "absolute", top: "11px", left: "50%", right: "-50%", height: "2px", backgroundColor: done ? "#059669" : "#E2E8F0", zIndex: 0 }} />
                        )}
                        <div style={{
                          width: "22px", height: "22px", borderRadius: "50%", zIndex: 1,
                          backgroundColor: done ? "#059669" : active ? "#1B5CB5" : "#E2E8F0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {done
                            ? <CheckCircle2 size={13} color="#fff" />
                            : active
                            ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />
                            : <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
                          }
                        </div>
                        <p style={{ fontSize: "10px", fontWeight: done || active ? 700 : 500, color: done ? "#059669" : active ? "#1B5CB5" : "#94A3B8", textAlign: "center" }}>
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Details */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
              <div className="form-grid-2" style={{ gap: "16px" }}>
                {[
                  { label: "Order Date", value: new Date(result.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Shipping Method", value: result.shippingMethod ?? "Standard" },
                  { label: "Items", value: `${result.itemCount} item${result.itemCount !== 1 ? "s" : ""}` },
                  { label: "Status", value: cfg.label },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items list */}
            <div style={{ padding: "18px 24px 20px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Items in this order
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                      backgroundColor: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <FlaskConical size={13} style={{ color: "#1B5CB5" }} />
                    </div>
                    <p style={{ fontSize: "13.5px", color: "#0F172A", flex: 1 }}>{item.productName}</p>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: "0 24px 20px" }}>
              <Link
                href="/all-peptides"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  height: "44px", borderRadius: "12px",
                  background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Continue Shopping <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Help text */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <p style={{ fontSize: "12.5px", color: "#94A3B8" }}>
            Your order reference was included in your confirmation email.
          </p>
          <p style={{ fontSize: "12.5px", color: "#94A3B8", marginTop: "4px" }}>
            Need help? <a href="/contact" style={{ color: "#1B5CB5", fontWeight: 600 }}>Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
