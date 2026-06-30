import { useState } from "react";
import { Link } from "wouter";
import { Landmark, CheckCircle2, Copy, Check, ArrowLeft } from "lucide-react";

// Keep in sync with CheckoutPage.tsx / OrderConfirmation.tsx
const BANK_DETAILS = {
  accountName: "OmniQure Research Ltd",
  sortCode: "20-00-00",
  accountNumber: "12345678",
  bank: "Barclays Bank",
};

export default function ContinuePayment() {
  const params = new URLSearchParams(window.location.search);
  const order = params.get("order") ?? "OQ-000000";
  const name  = params.get("name")  ?? "Researcher";
  const total = params.get("total") ?? "0.00";

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sentAck, setSentAck] = useState(false);

  function copyValue(label: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <div style={{
      fontFamily: "'Arimo', Arial, sans-serif",
      backgroundColor: "#F5F8FC",
      minHeight: "70vh",
      padding: "32px 16px 60px",
    }}>
      <div style={{ maxWidth: "440px", margin: "0 auto" }}>
        <Link
          href={`/order-confirmation?order=${encodeURIComponent(order)}&name=${encodeURIComponent(name)}&total=${encodeURIComponent(total)}&payment=bank_transfer`}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "#64748B", textDecoration: "none", marginBottom: "18px" }}
        >
          <ArrowLeft size={14} /> Back to order
        </Link>

        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <Landmark size={26} color="#1240A0" />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", marginBottom: "6px" }}>
            Continue your bank transfer
          </h1>
          <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
            Send the transfer below from your banking app on this phone to complete order <strong style={{ color: "#0F172A" }}>{order}</strong>.
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff", borderRadius: "18px",
          border: "1.5px solid #E8EDF5", boxShadow: "0 8px 32px rgba(15,23,42,0.07)",
          padding: "22px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount to send</span>
            <span style={{ fontSize: "22px", fontWeight: 900, color: "#1240A0" }}>£{parseFloat(total).toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Pay To",          value: BANK_DETAILS.accountName },
              { label: "Bank",            value: BANK_DETAILS.bank },
              { label: "Sort Code",       value: BANK_DETAILS.sortCode },
              { label: "Account Number",  value: BANK_DETAILS.accountNumber },
              { label: "Reference",       value: order },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "10px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{row.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: row.label === "Reference" ? "#059669" : "#0F172A" }}>{row.value}</span>
                  <button
                    onClick={() => copyValue(row.label, row.value)}
                    aria-label={`Copy ${row.label}`}
                    style={{ border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "2px", display: "flex", color: "#94A3B8" }}
                  >
                    {copiedField === row.label ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.6, marginTop: "12px", marginBottom: 0 }}>
            Open your banking app, start a transfer, and enter the details above. Faster Payments usually clears the same day.
          </p>
        </div>

        {!sentAck ? (
          <button
            onClick={() => setSentAck(true)}
            style={{
              width: "100%", height: "48px", borderRadius: "12px",
              background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              border: "none", cursor: "pointer",
            }}
          >
            I've sent the payment
          </button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            borderRadius: "12px", border: "1.5px solid #BBF7D0", backgroundColor: "#F0FDF4",
            padding: "14px 16px",
          }}>
            <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "12.5px", color: "#065F46", lineHeight: 1.5 }}>
              Thanks! We'll email you at confirmation once your transfer clears and your order is dispatched.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
