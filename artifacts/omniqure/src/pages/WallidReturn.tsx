import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Package, Loader2, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * /wallid-return
 *
 * Landing page after a Wallid hosted payment. Wallid redirects to our
 * success_url or fail_url depending on the payment outcome.
 *
 * For the success path the page polls GET /api/orders/track to obtain the
 * server-authoritative status before showing a confirmation or clearing the
 * cart. This guards against direct URL navigation and the race where Wallid
 * redirects before the webhook fires.
 *
 * URL params:
 *   ?order=OQ-XXXXXX   order number
 *   ?status=success     Wallid redirected to success_url
 *   ?status=failed      Wallid redirected to fail_url
 *   ?name=FirstName     customer first name
 *   ?total=99.00        order total in GBP
 */

type VerifyState = "verifying" | "paid" | "pending_webhook" | "failed" | "error";

const MAX_POLL_ATTEMPTS = 40;   // 40 × 3 s ≈ 2 minutes
const POLL_INTERVAL_MS  = 3000;

export default function WallidReturn() {
  const params      = new URLSearchParams(window.location.search);
  const urlStatus   = params.get("status");   // "success" | "failed"
  const orderNumber = params.get("order") ?? "";
  const firstName   = params.get("name") ?? "";
  const total       = params.get("total") ?? "";

  const { clearCart } = useCart();

  // failure path: no server call needed — Wallid redirected to failUrl
  const initialState: VerifyState = urlStatus === "failed" ? "failed" : "verifying";
  const [verifyState, setVerifyState] = useState<VerifyState>(initialState);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (verifyState === "failed") return; // failure — nothing to poll
    if (!orderNumber) {
      setVerifyState("error");
      return;
    }

    async function checkOrderStatus(): Promise<boolean> {
      try {
        const res = await fetch(`/api/orders/track?number=${encodeURIComponent(orderNumber)}`);
        if (!res.ok) return false;
        const data = (await res.json()) as { status?: string };
        if (data.status === "paid") {
          if (!cancelledRef.current) {
            clearCart();
            setVerifyState("paid");
          }
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }

    // Check immediately on mount, then start polling if not yet paid
    void checkOrderStatus().then(done => {
      if (done || cancelledRef.current) return;

      pollRef.current = setInterval(() => {
        if (cancelledRef.current) {
          clearInterval(pollRef.current!);
          return;
        }
        attemptsRef.current++;
        void checkOrderStatus().then(done => {
          if (done || cancelledRef.current) {
            clearInterval(pollRef.current!);
            return;
          }
          if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
            clearInterval(pollRef.current!);
            if (!cancelledRef.current) setVerifyState("pending_webhook");
          }
        });
      }, POLL_INTERVAL_MS);
    });

    return () => {
      cancelledRef.current = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Verifying / polling ───────────────────────────────────────────────────
  if (verifyState === "verifying") {
    return (
      <PageShell bg="linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)">
        <div style={{ textAlign: "center" }}>
          <Loader2 size={56} style={{ color: "#0369A1", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "20px 0 8px" }}>
            Confirming your payment…
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
            Please wait while we verify your payment with your bank.
          </p>
          {orderNumber && (
            <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: 12 }}>
              Order reference: <strong style={{ color: "#0F172A" }}>{orderNumber}</strong>
            </p>
          )}
        </div>
        <Branding />
      </PageShell>
    );
  }

  // ── Payment confirmed (server-verified) ───────────────────────────────────
  if (verifyState === "paid") {
    return (
      <PageShell bg="linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)">
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={64} style={{ color: "#059669" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A", margin: "16px 0 8px" }}>
            Payment Confirmed!
          </h1>
          {firstName && (
            <p style={{ fontSize: "15px", color: "#64748B", marginBottom: 4 }}>
              Thank you, <strong>{firstName}</strong>.
            </p>
          )}
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
            Your bank payment was received and your order is now being prepared.
          </p>

          {orderNumber && (
            <div style={{
              background: "#F0FDF4", border: "1px solid #D1FAE5",
              borderRadius: 10, padding: "14px 20px", marginBottom: 28,
            }}>
              <p style={{ fontSize: "12px", color: "#059669", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "18px", fontWeight: 900, color: "#0F172A", margin: "4px 0 0", letterSpacing: "0.04em" }}>{orderNumber}</p>
              {total && <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0" }}>£{parseFloat(total).toFixed(2)} GBP</p>}
            </div>
          )}

          <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: 28, lineHeight: 1.6 }}>
            A confirmation email will be sent shortly. Keep your order reference safe.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={orderNumber ? `/track-order?number=${encodeURIComponent(orderNumber)}` : "/track-order"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(90deg, #059669, #34D399)",
                color: "#022c22", textDecoration: "none",
                borderRadius: 10, padding: "13px 20px",
                fontSize: "14px", fontWeight: 800,
                boxShadow: "0 0 20px rgba(52,211,153,0.25)",
              }}
            >
              <Package size={16} /> Track Your Order <ArrowRight size={14} />
            </Link>
            <Link href="/" style={secondaryBtn}>Continue Shopping</Link>
          </div>
        </div>
        <Branding />
      </PageShell>
    );
  }

  // ── Webhook delayed — payment still processing ────────────────────────────
  if (verifyState === "pending_webhook") {
    return (
      <PageShell bg="linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)">
        <div style={{ textAlign: "center" }}>
          <Clock size={56} style={{ color: "#D97706" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "16px 0 8px" }}>
            Payment Processing
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
            Your bank has approved the payment and we're waiting for the final confirmation.
            This may take a few minutes.
          </p>
          {orderNumber && (
            <div style={{
              background: "#FEF9EE", border: "1px solid #FDE68A",
              borderRadius: 10, padding: "14px 20px", marginBottom: 24,
            }}>
              <p style={{ fontSize: "12px", color: "#D97706", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "17px", fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>{orderNumber}</p>
            </div>
          )}
          <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: 28, lineHeight: 1.6 }}>
            You'll receive a confirmation email once the payment settles.
            You can also check your order status below.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={orderNumber ? `/track-order?number=${encodeURIComponent(orderNumber)}` : "/track-order"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(90deg, #D97706, #F59E0B)",
                color: "#fff", textDecoration: "none",
                borderRadius: 10, padding: "13px 20px",
                fontSize: "14px", fontWeight: 800,
              }}
            >
              <Package size={16} /> Check Order Status
            </Link>
            <Link href="/" style={secondaryBtn}>Back to Homepage</Link>
          </div>
        </div>
        <Branding />
      </PageShell>
    );
  }

  // ── Failure / cancelled ───────────────────────────────────────────────────
  if (verifyState === "failed") {
    return (
      <PageShell bg="linear-gradient(135deg, #FFF1F2 0%, #FFF5F5 100%)">
        <div style={{ textAlign: "center" }}>
          <XCircle size={64} style={{ color: "#EF4444" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A", margin: "16px 0 8px" }}>
            Payment Unsuccessful
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
            Your payment was not completed — it may have been declined or cancelled. Your order has not been charged.
          </p>
          {orderNumber && (
            <div style={{
              background: "#FFF1F2", border: "1px solid #FECDD3",
              borderRadius: 10, padding: "12px 20px", marginBottom: 28,
            }}>
              <p style={{ fontSize: "12px", color: "#EF4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "4px 0 0" }}>{orderNumber}</p>
            </div>
          )}
          <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: 28 }}>
            Your cart is still saved. Return to checkout to try again.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "linear-gradient(90deg, #0a1d4f, #1240A0)",
              color: "#fff", textDecoration: "none",
              borderRadius: 10, padding: "13px 20px",
              fontSize: "14px", fontWeight: 800,
            }}>
              <RotateCcw size={15} /> Return to Checkout
            </Link>
            <Link href="/" style={secondaryBtn}>Back to Homepage</Link>
          </div>
        </div>
        <Branding />
      </PageShell>
    );
  }

  // ── Generic error (no order number, network failure, etc.) ────────────────
  return (
    <PageShell bg="linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)">
      <div style={{ textAlign: "center" }}>
        <XCircle size={56} style={{ color: "#94A3B8" }} />
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "16px 0 8px" }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: 28, lineHeight: 1.6 }}>
          We couldn't verify your payment status. If you believe your payment went through, please check your email or{" "}
          <Link href="/track-order" style={{ color: "#1240A0" }}>track your order</Link>.
        </p>
        <Link href="/" style={secondaryBtn}>Back to Homepage</Link>
      </div>
      <Branding />
    </PageShell>
  );
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

function PageShell({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px", fontFamily: "'Arimo', Arial, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 20px 60px rgba(15,23,42,0.1)",
      }}>
        {children}
      </div>
    </div>
  );
}

function Branding() {
  return (
    <p style={{ marginTop: 32, fontSize: "12px", color: "#94A3B8", textAlign: "center" }}>
      Secure payment powered by <strong style={{ color: "#0D2565" }}>Wallid</strong> · OmniQure Peptide Research Institute
    </p>
  );
}

const secondaryBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  background: "#F8FAFC", border: "1px solid #E2E8F0",
  color: "#0F172A", textDecoration: "none",
  borderRadius: 10, padding: "13px 20px",
  fontSize: "14px", fontWeight: 700,
};
