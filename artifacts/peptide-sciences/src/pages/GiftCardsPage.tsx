import { useState } from "react";
import { Gift, CheckCircle2, Mail, User, MessageSquare, ChevronRight, Heart, Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

const DENOMINATIONS = [
  { label: "£25", value: 25 },
  { label: "£50", value: 50 },
  { label: "£100", value: 100 },
  { label: "£150", value: 150 },
  { label: "Custom", value: 0 },
];

export default function GiftCardsPage() {
  useSEO({
    title: "Gift Cards",
    description: "Send an OmniQure Peptide Sciences gift card — the perfect gift for researchers. Available in £25, £50, £100 and custom amounts.",
    canonicalPath: "/gift-cards",
  });

  const [selectedDenom, setSelectedDenom] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ purchaserEmail: "", recipientEmail: "", recipientName: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = selectedDenom > 0 ? selectedDenom : parseFloat(customAmount) || 0;

  const setField = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.purchaserEmail.includes("@")) { setError("Enter your email address."); return; }
    if (!form.recipientEmail.includes("@")) { setError("Enter the recipient's email address."); return; }
    if (amount < 10 || amount > 500) { setError("Amount must be between £10 and £500."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("gift-cards/purchase"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaserEmail: form.purchaserEmail.trim(),
          recipientEmail: form.recipientEmail.trim(),
          recipientName: form.recipientName.trim() || undefined,
          message: form.message.trim() || undefined,
          amountGbp: amount,
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) { setError(data.error ?? "Something went wrong. Please try again."); return; }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px", maxWidth: "480px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #16A34A, #15803D)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={36} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", marginBottom: "12px" }}>Gift Card Sent!</h1>
          <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.65, marginBottom: "8px" }}>
            A <strong style={{ color: "#0F172A" }}>£{amount.toFixed(2)} gift card</strong> has been sent to <strong style={{ color: "#0F172A" }}>{form.recipientEmail}</strong>.
          </p>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "32px" }}>
            You'll receive a confirmation at {form.purchaserEmail}.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm({ purchaserEmail: "", recipientEmail: "", recipientName: "", message: "" }); setSelectedDenom(50); setCustomAmount(""); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "12px",
              background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
              color: "#fff", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer",
            }}
          >
            <Gift size={15} />
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #020B1E 0%, #071A4A 35%, #0D2565 65%, #1240A0 100%)",
        padding: "48px 0 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="max-w-[900px] mx-auto px-4" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Gift size={24} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", marginBottom: "10px" }}>
            Gift Cards
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
            The perfect gift for researchers. Send an OmniQure gift card instantly by email — redeemable on any order.
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="lg:grid-cols-[1fr_340px]">

          {/* Left: Form */}
          <form onSubmit={void handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Step 1: Amount */}
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>1</div>
                <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Choose an amount</h2>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {DENOMINATIONS.map(d => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => { setSelectedDenom(d.value); if (d.value > 0) setCustomAmount(""); }}
                    style={{
                      padding: "10px 20px", borderRadius: "12px", border: `2px solid ${selectedDenom === d.value ? "#1B5CB5" : "#E2E8F0"}`,
                      backgroundColor: selectedDenom === d.value ? "#EEF4FF" : "#fff",
                      color: selectedDenom === d.value ? "#1240A0" : "#475569",
                      fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {selectedDenom === 0 && (
                <div style={{ marginTop: "14px", position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", fontWeight: 700, color: "#64748B" }}>£</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (£10–£500)"
                    min={10}
                    max={500}
                    style={{
                      width: "100%", height: "44px", paddingLeft: "28px", paddingRight: "12px",
                      borderRadius: "10px", border: "1.5px solid #E2E8F0",
                      fontSize: "15px", color: "#0F172A", outline: "none",
                      fontFamily: "'Arimo', Arial, sans-serif",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Step 2: Details */}
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>2</div>
                <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Your details & recipient</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { key: "purchaserEmail", label: "Your email", placeholder: "your@email.com", icon: <Mail size={14} />, type: "email" },
                  { key: "recipientEmail", label: "Recipient's email", placeholder: "recipient@email.com", icon: <Mail size={14} />, type: "email" },
                  { key: "recipientName", label: "Recipient's name (optional)", placeholder: "Dr. Jane Smith", icon: <User size={14} />, type: "text" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                      <span style={{ color: "#64748B" }}>{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={setField(field.key as keyof typeof form)}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%", height: "42px", padding: "0 12px",
                        borderRadius: "10px", border: "1.5px solid #E2E8F0",
                        fontSize: "13.5px", color: "#0F172A", outline: "none",
                        fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F8FAFC",
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                    <MessageSquare size={14} style={{ color: "#64748B" }} />
                    Personal message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={setField("message")}
                    placeholder="Happy researching! Wishing you great results…"
                    rows={3}
                    style={{
                      width: "100%", padding: "10px 12px",
                      borderRadius: "10px", border: "1.5px solid #E2E8F0",
                      fontSize: "13.5px", color: "#0F172A", outline: "none", resize: "none",
                      fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F8FAFC",
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || amount < 10}
              onClick={handleSubmit}
              style={{
                width: "100%", height: "52px", borderRadius: "14px", border: "none",
                background: submitting || amount < 10 ? "#E2E8F0" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                color: submitting || amount < 10 ? "#94A3B8" : "#fff",
                fontWeight: 800, fontSize: "15px", cursor: submitting || amount < 10 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.15s",
              }}
            >
              <Gift size={16} />
              {submitting ? "Sending gift card…" : amount >= 10 ? `Send £${amount.toFixed(2)} Gift Card` : "Choose an amount"}
            </button>
          </form>

          {/* Right: Preview & Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Card preview */}
            <div style={{
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 8px 32px rgba(13,37,101,0.18)",
            }}>
              <div style={{ background: "linear-gradient(135deg, #0D2565 0%, #1B5CB5 60%, #2563EB 100%)", padding: "28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>OMNIQURE</span>
                  <Gift size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
                </div>
                <p style={{ fontSize: "28px", fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                  {amount >= 10 ? `£${amount.toFixed(2)}` : "£—"}
                </p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>Gift Card</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "14px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    {form.recipientName || "Recipient"} · {form.recipientEmail || "recipient@email.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", padding: "20px 22px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", marginBottom: "14px" }}>How it works</h3>
              {[
                { icon: <Gift size={13} />, text: "Choose an amount and fill in recipient details" },
                { icon: <Mail size={13} />, text: "Recipient receives a unique code by email instantly" },
                { icon: <CheckCircle2 size={13} />, text: "Code is redeemable at checkout on any order" },
                { icon: <Heart size={13} />, text: "No expiry — valid until the balance is used" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i < 3 ? "10px" : 0 }}>
                  <span style={{ color: "#1B5CB5", marginTop: "1px", flexShrink: 0 }}>{step.icon}</span>
                  <p style={{ fontSize: "12.5px", color: "#475569", margin: 0, lineHeight: 1.5 }}>{step.text}</p>
                </div>
              ))}
            </div>

            {/* Trust */}
            <div style={{ backgroundColor: "#F0F5FF", borderRadius: "14px", border: "1px solid #C7D7F7", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Shield size={15} style={{ color: "#1B5CB5", flexShrink: 0 }} />
              <p style={{ fontSize: "12px", color: "#1240A0", margin: 0, lineHeight: 1.5 }}>
                Gift cards are delivered instantly by email and can be used alongside other discounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
