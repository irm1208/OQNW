import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Package, Loader2, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import PostOrderAccountPrompt from "@/components/PostOrderAccountPrompt";

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
 * Payment amount and currency are always read back from the server's tracked
 * order record, rather than trusting URL parameters.
 */

type VerifyState = "verifying" | "paid" | "pending_webhook" | "failed" | "error";

const MAX_POLL_ATTEMPTS = 40;   // 40 × 3 s ≈ 2 minutes
const POLL_INTERVAL_MS  = 3000;

export default function WallidReturn() {
  const params      = new URLSearchParams(window.location.search);
  const urlStatus   = params.get("status");   // "success" | "failed"
  const orderNumber = params.get("order") ?? "";
  const firstName   = params.get("name") ?? "";
  const { clearCart } = useCart();
  const [payment, setPayment] = useState<{ currency: string; amountMinor: number } | null>(null);

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
        const data = (await res.json()) as {
          status?: string;
          paymentCurrency?: string | null;
          paymentAmountMinor?: number | null;
        };
        if (data.paymentCurrency && typeof data.paymentAmountMinor === "number") {
          setPayment({ currency: data.paymentCurrency, amountMinor: data.paymentAmountMinor });
        }
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
      <PageShell bg="#F4F5F8">
        <div style={{ textAlign: "center" }}>
          <Loader2 size={56} style={{ color: "#4C7376", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#22252C", margin: "20px 0 8px" }}>
            Confirming your payment…
          </h1>
          <p style={{ fontSize: "14px", color: "#4A5672", lineHeight: 1.6 }}>
            Please wait while we verify your payment with your bank.
          </p>
          {orderNumber && (
            <p style={{ fontSize: "13px", color: "#8D9BB8", marginTop: 12 }}>
              Order reference: <strong style={{ color: "#22252C" }}>{orderNumber}</strong>
            </p>
          )}
        </div>
      </PageShell>
    );
  }

  // ── Payment confirmed (server-verified) ───────────────────────────────────
  if (verifyState === "paid") {
    return (
      <PageShell bg="#EFF2EF">
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={64} style={{ color: "#4F6B52" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#22252C", margin: "16px 0 8px" }}>
            Payment Confirmed!
          </h1>
          {firstName && (
            <p style={{ fontSize: "15px", color: "#4A5672", marginBottom: 4 }}>
              Thank you, <strong>{firstName}</strong>.
            </p>
          )}
          <p style={{ fontSize: "15px", color: "#4A5672", marginBottom: 24, lineHeight: 1.6 }}>
            Your bank payment was received and your order is now being prepared.
          </p>

          {orderNumber && (
            <div style={{
              background: "#EFF2EF", border: "1px solid #EFF2EF",
              borderRadius: 10, padding: "14px 20px", marginBottom: 28,
            }}>
              <p style={{ fontSize: "12px", color: "#4F6B52", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "18px", fontWeight: 900, color: "#22252C", margin: "4px 0 0", letterSpacing: "0.04em" }}>{orderNumber}</p>
              {payment && (
                <p style={{ fontSize: "13px", color: "#4A5672", margin: "4px 0 0" }}>
                  {formatPaymentAmount(payment.amountMinor, payment.currency)}
                </p>
              )}
            </div>
          )}

          <p style={{ fontSize: "13px", color: "#8D9BB8", marginBottom: 28, lineHeight: 1.6 }}>
            A confirmation email will be sent shortly. Keep your order reference safe.
          </p>
          <PostOrderAccountPrompt orderNumber={orderNumber} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={orderNumber ? `/track-order?number=${encodeURIComponent(orderNumber)}` : "/track-order"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#4F6B52",
                color: "#4F6B52", textDecoration: "none",
                borderRadius: 10, padding: "13px 20px",
                fontSize: "14px", fontWeight: 800,
                boxShadow: "none",
              }}
            >
              <Package size={16} /> Track Your Order <ArrowRight size={14} />
            </Link>
            <Link href="/" style={secondaryBtn}>Continue Shopping</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Webhook delayed — payment still processing ────────────────────────────
  if (verifyState === "pending_webhook") {
    return (
      <PageShell bg="#F8F4EF">
        <div style={{ textAlign: "center" }}>
          <Clock size={56} style={{ color: "#85683A" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#22252C", margin: "16px 0 8px" }}>
            Payment Processing
          </h1>
          <p style={{ fontSize: "15px", color: "#4A5672", marginBottom: 24, lineHeight: 1.6 }}>
            Your bank has approved the payment and we're waiting for the final confirmation.
            This may take a few minutes.
          </p>
          {orderNumber && (
            <div style={{
              background: "#F8F4EF", border: "1px solid #CDB894",
              borderRadius: 10, padding: "14px 20px", marginBottom: 24,
            }}>
              <p style={{ fontSize: "12px", color: "#85683A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "17px", fontWeight: 900, color: "#22252C", margin: "4px 0 0" }}>{orderNumber}</p>
            </div>
          )}
          <p style={{ fontSize: "13px", color: "#8D9BB8", marginBottom: 28, lineHeight: 1.6 }}>
            You'll receive a confirmation email once the payment settles.
            You can also check your order status below.
          </p>
          <PostOrderAccountPrompt orderNumber={orderNumber} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={orderNumber ? `/track-order?number=${encodeURIComponent(orderNumber)}` : "/track-order"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#85683A",
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
      </PageShell>
    );
  }

  // ── Failure / cancelled ───────────────────────────────────────────────────
  if (verifyState === "failed") {
    return (
      <PageShell bg="#F8F2F3">
        <div style={{ textAlign: "center" }}>
          <XCircle size={64} style={{ color: "#9C4A44" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#22252C", margin: "16px 0 8px" }}>
            Payment Unsuccessful
          </h1>
          <p style={{ fontSize: "15px", color: "#4A5672", marginBottom: 24, lineHeight: 1.6 }}>
            Your payment was not completed — it may have been declined or cancelled. Your order has not been charged.
          </p>
          {orderNumber && (
            <div style={{
              background: "#F8F2F3", border: "1px solid #C9939A",
              borderRadius: 10, padding: "12px 20px", marginBottom: 28,
            }}>
              <p style={{ fontSize: "12px", color: "#9C4A44", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Order Reference</p>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#22252C", margin: "4px 0 0" }}>{orderNumber}</p>
            </div>
          )}
          <p style={{ fontSize: "13px", color: "#8D9BB8", marginBottom: 28 }}>
            Your cart is still saved. Return to checkout to try again.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#1D2948",
              color: "#fff", textDecoration: "none",
              borderRadius: 10, padding: "13px 20px",
              fontSize: "14px", fontWeight: 800,
            }}>
              <RotateCcw size={15} /> Return to Checkout
            </Link>
            <Link href="/" style={secondaryBtn}>Back to Homepage</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Generic error (no order number, network failure, etc.) ────────────────
  return (
    <PageShell bg="#F4F5F8">
      <div style={{ textAlign: "center" }}>
        <XCircle size={56} style={{ color: "#8D9BB8" }} />
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#22252C", margin: "16px 0 8px" }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "14px", color: "#4A5672", marginBottom: 28, lineHeight: 1.6 }}>
          We couldn't verify your payment status. If you believe your payment went through, please check your email or{" "}
          <Link href="/track-order" style={{ color: "#4E68C2" }}>track your order</Link>.
        </p>
        <Link href="/" style={secondaryBtn}>Back to Homepage</Link>
      </div>
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
      padding: "40px 20px", fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "none",
      }}>
        {children}
      </div>
    </div>
  );
}

const secondaryBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  background: "#F4F5F8", border: "1px solid #D3D8E2",
  color: "#22252C", textDecoration: "none",
  borderRadius: 10, padding: "13px 20px",
  fontSize: "14px", fontWeight: 700,
};

function formatPaymentAmount(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amountMinor / 100) + ` ${currency}`;
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}
