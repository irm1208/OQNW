import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight, CheckCircle2, Clock, Copy, ExternalLink, Package,
  RefreshCw, ShieldCheck, Truck,
} from "lucide-react";
import PostOrderAccountPrompt from "@/components/PostOrderAccountPrompt";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const apiUrl = (path: string) => `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");

type CryptoPayment = {
  currency: "BTC" | "ETH" | "SOL" | "USDT" | "USDC";
  network: string;
  walletAddress: string;
  expectedAmount: string;
  rateUsd: number;
  rateExpiresAt: string;
  confirmationsRequired: number;
  status: "rate_locked" | "pending" | "confirmed" | "underpaid" | "wrong_wallet" | "manual_review";
  txHash: string | null;
  observedAmount: string | null;
  confirmations: number | null;
  reason: string | null;
  confirmedAt: string | null;
  lastCheckedAt: string | null;
};

type SecureOrderSummary = {
  orderNumber: string;
  status: string;
  totalGbp: number;
  shippingMethod: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number }>;
};

type CryptoPaymentResponse = CryptoPayment & {
  orderId: number;
  orderNumber: string;
  order?: SecureOrderSummary;
  error?: string;
};

type CryptoPaymentCheck = Pick<CryptoPayment, "status" | "reason" | "observedAmount" | "confirmations">;

const META: Record<CryptoPayment["currency"], { name: string; symbol: string; color: string; background: string; text: string }> = {
  BTC: { name: "Bitcoin", symbol: "₿", color: "#F59E0B", background: "#FFFBEB", text: "#92400E" },
  ETH: { name: "Ethereum", symbol: "Ξ", color: "#6366F1", background: "#EEF2FF", text: "#3730A3" },
  SOL: { name: "Solana", symbol: "◎", color: "#0EA5E9", background: "#F0F9FF", text: "#075985" },
  USDT: { name: "Tether", symbol: "₮", color: "#059669", background: "#ECFDF5", text: "#065F46" },
  USDC: { name: "USD Coin", symbol: "◎", color: "#2563EB", background: "#EFF6FF", text: "#1E40AF" },
};

function networkLabel(network: string): string {
  return {
    bitcoin: "Bitcoin",
    ethereum: "Ethereum",
    bsc: "BNB Smart Chain",
    arbitrum: "Arbitrum",
    polygon: "Polygon",
    solana: "Solana",
    tron: "Tron",
  }[network] ?? network;
}

function explorerUrl(network: string, txHash: string): string | null {
  const base = {
    bitcoin: "https://mempool.space/tx/",
    ethereum: "https://etherscan.io/tx/",
    bsc: "https://bscscan.com/tx/",
    arbitrum: "https://arbiscan.io/tx/",
    polygon: "https://polygonscan.com/tx/",
    solana: "https://solscan.io/tx/",
    tron: "https://tronscan.org/#/transaction/",
  }[network];
  return base ? `${base}${encodeURIComponent(txHash)}` : null;
}

function statusLabel(status: CryptoPayment["status"]): string {
  return {
    rate_locked: "Ready to pay",
    pending: "Payment detected",
    confirmed: "Payment confirmed",
    underpaid: "Payment needs review",
    wrong_wallet: "Wrong wallet",
    manual_review: "Manual review required",
  }[status];
}

function verificationMessage(result: CryptoPaymentCheck, confirmationsRequired: number): string {
  if (result.status === "confirmed") {
    return "Payment verified successfully. Your order can now be prepared for dispatch.";
  }
  if (result.status === "pending" && result.confirmations !== null) {
    return `${result.reason ?? "Payment detected."} ${result.confirmations} of ${confirmationsRequired} confirmation${confirmationsRequired === 1 ? "" : "s"} recorded.`;
  }
  return result.reason ?? "The payment status has been updated.";
}

function shortHash(value: string): string {
  return value.length > 22 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;
}

function formatCryptoAmount(value: string | number): string {
  const raw = String(value).trim();
  const match = raw.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match) return raw;

  const sign = match[1];
  const whole = match[2].replace(/^0+(?=\d)/, "");
  const fraction = (match[3] ?? "").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""}`;
}

export default function OrderConfirmation() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const requestedOrder = params.get("order") ?? "OQ-000000";
  const orderRef = requestedOrder;
  const payment = params.get("payment") ?? "wallid";
  const cryptoToken = params.get("cryptoToken");
  const name = params.get("name") ?? "Researcher";
  const urlTotal = Number(params.get("total") ?? "0");
  const urlShipping = params.get("ship") ?? "Standard";
  const isCrypto = payment === "crypto" && Boolean(cryptoToken);

  const [cryptoPayment, setCryptoPayment] = useState<CryptoPayment | null>(null);
  const [orderSummary, setOrderSummary] = useState<SecureOrderSummary | null>(null);
  const [loading, setLoading] = useState(isCrypto);
  const [error, setError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copiedValue, setCopiedValue] = useState<"wallet" | "transaction" | null>(null);
  const [now, setNow] = useState(Date.now());

  const refreshPayment = useCallback(async (): Promise<CryptoPayment | null> => {
    if (!isCrypto || !cryptoToken) return null;
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl(`orders/${encodeURIComponent(orderRef)}/crypto-payment`)}?token=${encodeURIComponent(cryptoToken)}`,
        { cache: "no-store", headers: { "Cache-Control": "no-cache" } },
      );
      const data = await response.json().catch(() => ({})) as CryptoPaymentResponse;
      if (!response.ok) throw new Error(data.error ?? "Unable to load the crypto payment");
      if (!data.currency || !data.network || !data.walletAddress || !data.expectedAmount) {
        throw new Error("The secure payment details were incomplete. Please refresh and try again.");
      }
      setCryptoPayment(data);
      setOrderSummary(data.order ?? null);
      setTxHash(data.txHash ?? "");
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the crypto payment");
      return null;
    } finally {
      setLoading(false);
    }
  }, [cryptoToken, isCrypto, orderRef]);

  useEffect(() => {
    window.scrollTo(0, 0);
    void refreshPayment();
  }, [refreshPayment]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const coin = cryptoPayment ? META[cryptoPayment.currency] : null;
  const rateExpiresAt = cryptoPayment ? new Date(cryptoPayment.rateExpiresAt).getTime() : 0;
  const rateExpired = Boolean(cryptoPayment && rateExpiresAt <= now);
  const minutesRemaining = cryptoPayment && !rateExpired ? Math.max(1, Math.ceil((rateExpiresAt - now) / 60_000)) : 0;
  const shippingMethod = orderSummary?.shippingMethod ?? urlShipping;
  const total = orderSummary?.totalGbp ?? urlTotal;
  const displayedOrder = orderSummary?.orderNumber ?? requestedOrder;
  const createdAt = orderSummary?.createdAt ? new Date(orderSummary.createdAt) : new Date();
  const delivery = new Date(createdAt);
  delivery.setDate(delivery.getDate() + (shippingMethod === "Next Day" ? 1 : shippingMethod === "Express" ? 2 : 5));
  const displayedExpectedAmount = cryptoPayment ? formatCryptoAmount(cryptoPayment.expectedAmount) : "";
  const displayedObservedAmount = cryptoPayment?.observedAmount
    ? formatCryptoAmount(cryptoPayment.observedAmount)
    : null;
  const qrValue = useMemo(() => {
    if (!cryptoPayment) return "";
    return cryptoPayment.network === "bitcoin"
      ? `bitcoin:${cryptoPayment.walletAddress}?amount=${cryptoPayment.expectedAmount}`
      : cryptoPayment.walletAddress;
  }, [cryptoPayment]);

  async function copyValue(value: string, target: "wallet" | "transaction") {
    await navigator.clipboard.writeText(value).catch(() => {});
    setCopiedValue(target);
    window.setTimeout(() => setCopiedValue(null), 1800);
  }

  async function refreshRate() {
    if (!cryptoPayment || !cryptoToken) return;
    setSubmitting(true);
    setSubmissionMessage(null);
    setError(null);
    try {
      const response = await fetch(apiUrl(`orders/${encodeURIComponent(orderRef)}/lock-usdt-rate`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentToken: cryptoToken,
          currency: cryptoPayment.currency,
          network: cryptoPayment.network,
        }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to refresh the rate");
      await refreshPayment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh the rate");
    } finally {
      setSubmitting(false);
    }
  }

  const checkPendingTransaction = useCallback(async () => {
    const submittedHash = cryptoPayment?.txHash;
    if (!cryptoToken || !submittedHash || cryptoPayment?.status !== "pending") return;
    setChecking(true);
    try {
      const response = await fetch(apiUrl(`orders/${encodeURIComponent(orderRef)}/crypto-payment/check`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentToken: cryptoToken }),
      });
      const data = await response.json().catch(() => ({})) as CryptoPaymentCheck & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to check the transaction");
      await refreshPayment();
      setSubmissionMessage(verificationMessage(data, cryptoPayment.confirmationsRequired));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to check the transaction");
    } finally {
      setChecking(false);
    }
  }, [cryptoPayment?.confirmationsRequired, cryptoPayment?.status, cryptoPayment?.txHash, cryptoToken, orderRef, refreshPayment]);

  useEffect(() => {
    if (cryptoPayment?.status !== "pending" || !cryptoPayment.txHash) return;
    void checkPendingTransaction();
    const timer = window.setInterval(() => void checkPendingTransaction(), 20_000);
    return () => window.clearInterval(timer);
  }, [checkPendingTransaction, cryptoPayment?.status, cryptoPayment?.txHash]);

  async function submitTransaction() {
    if (!cryptoToken || !txHash.trim()) {
      setError("Enter your transaction hash before clicking Verify.");
      return;
    }
    if (rateExpired) {
      setError("This rate lock has expired. Refresh the locked rate before verifying your transaction.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSubmissionMessage(null);
    try {
      const response = await fetch(apiUrl(`orders/${encodeURIComponent(orderRef)}/pay`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentToken: cryptoToken, txHash: txHash.trim() }),
      });
      const data = await response.json().catch(() => ({})) as CryptoPaymentCheck & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to verify the transaction");
      await refreshPayment();
      setSubmissionMessage(verificationMessage(data, cryptoPayment?.confirmationsRequired ?? 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify the transaction");
    } finally {
      setSubmitting(false);
    }
  }

  const actionButton: React.CSSProperties = {
    flex: 1,
    borderRadius: 10,
    padding: 13,
    textAlign: "center",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", background: "#F5F8FC", minHeight: "70vh", padding: "48px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #34D399)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 40px rgba(5,150,105,.25)" }}>
            <CheckCircle2 size={38} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "18px 0 8px" }}>
            {isCrypto ? `Order placed — ${cryptoPayment ? statusLabel(cryptoPayment.status).toLowerCase() : "loading payment"}` : "Order received"}
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0, lineHeight: 1.55 }}>
            Thank you, <strong style={{ color: "#0F172A" }}>{name}</strong>. {isCrypto ? "Your order is reserved while we verify payment on-chain." : "We’ll email you with the next steps for your order."}
          </p>
        </div>

        {isCrypto && (
          <section style={{ borderRadius: 16, border: `1.5px solid ${coin?.color ?? "#CBD5E1"}`, background: coin?.background ?? "#fff", padding: 22, marginBottom: 20 }}>
            {loading && <p style={{ margin: 0, color: "#475569" }}>Loading your secure payment instructions…</p>}
            {error && <p role="alert" style={{ margin: loading ? "12px 0 0" : 0, color: "#B91C1C", fontWeight: 700 }}>{error}</p>}
            {!loading && cryptoPayment && coin && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Clock size={18} color={coin.color} />
                  <strong style={{ color: coin.text }}>Pay with {coin.name} on {networkLabel(cryptoPayment.network)}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 24, color: coin.color }}>{coin.symbol}</span>
                </div>

                {cryptoPayment.status !== "rate_locked" && (
                  <div role="status" aria-live="polite" style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 10, background: cryptoPayment.status === "confirmed" ? "#ECFDF5" : cryptoPayment.status === "pending" ? "#EFF6FF" : "#FFF7ED", color: cryptoPayment.status === "confirmed" ? "#047857" : cryptoPayment.status === "pending" ? "#1D4ED8" : "#9A3412", fontSize: 13, lineHeight: 1.5 }}>
                    <strong>{statusLabel(cryptoPayment.status)}.</strong> {cryptoPayment.reason ?? "Checking the submitted transaction."}
                  </div>
                )}

                {cryptoPayment.status === "confirmed" ? (
                  <div style={{ padding: 16, borderRadius: 10, background: "#ECFDF5", color: "#065F46", fontSize: 14, lineHeight: 1.55 }}>
                    <strong>Payment confirmed.</strong> We verified {displayedObservedAmount ?? displayedExpectedAmount} {cryptoPayment.currency} with {cryptoPayment.confirmations ?? 0} confirmation(s). Your order can now be prepared for dispatch.
                  </div>
                ) : !cryptoPayment.txHash && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "center", background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(15,23,42,.1)" }}>
                      <QRCodeSVG value={qrValue} size={106} level="M" includeMargin />
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 800, color: "#64748B", margin: "0 0 4px" }}>Exact amount to send</p>
                        <p style={{ fontSize: 23, fontWeight: 900, color: "#0F172A", margin: 0 }}>{displayedExpectedAmount} <span style={{ fontSize: 14 }}>{cryptoPayment.currency}</span></p>
                        <p style={{ fontSize: 12, color: rateExpired ? "#B91C1C" : "#475569", margin: "5px 0 0" }}>
                          {rateExpired ? "This rate lock has expired." : `Rate locked for about ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}.`}
                        </p>
                      </div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(15,23,42,.1)", marginTop: 12 }}>
                      <p style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 800, color: "#64748B", margin: "0 0 6px" }}>Receiving wallet · {networkLabel(cryptoPayment.network)}</p>
                      <p style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#0F172A", wordBreak: "break-all", lineHeight: 1.5, margin: 0 }}>{cryptoPayment.walletAddress}</p>
                      <button type="button" onClick={() => void copyValue(cryptoPayment.walletAddress, "wallet")} style={{ marginTop: 10, border: 0, background: "#EEF4FF", color: "#1240A0", borderRadius: 7, padding: "7px 10px", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                        <Copy size={13} style={{ verticalAlign: "text-bottom", marginRight: 5 }} />{copiedValue === "wallet" ? "Copied" : "Copy address"}
                      </button>
                    </div>
                  </>
                )}

                {cryptoPayment.txHash && (
                  <section style={{ background: "#fff", border: "1px solid rgba(15,23,42,.1)", borderRadius: 12, padding: 16, marginTop: 14 }}>
                    <p style={{ margin: "0 0 13px", fontSize: 11, color: "#64748B", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Verified transaction details</p>
                    <div style={{ display: "grid", gap: 12 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, color: "#64748B", fontWeight: 700 }}>TRANSACTION HASH</p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                          <code style={{ color: "#0F172A", fontSize: 12.5, fontWeight: 700, wordBreak: "break-all" }}>{cryptoPayment.txHash}</code>
                          <button type="button" onClick={() => void copyValue(cryptoPayment.txHash!, "transaction")} aria-label="Copy transaction hash" style={{ border: 0, background: "#EEF4FF", color: "#1240A0", borderRadius: 6, padding: "5px 7px", cursor: "pointer", fontSize: 11, fontWeight: 800 }}>
                            <Copy size={12} style={{ verticalAlign: "text-bottom", marginRight: 3 }} />{copiedValue === "transaction" ? "Copied" : "Copy"}
                          </button>
                          {explorerUrl(cryptoPayment.network, cryptoPayment.txHash) && (
                            <a href={explorerUrl(cryptoPayment.network, cryptoPayment.txHash)!} target="_blank" rel="noreferrer" style={{ color: "#1240A0", fontWeight: 800, fontSize: 11.5, textDecoration: "none" }}>
                              View on explorer <ExternalLink size={12} style={{ verticalAlign: "text-bottom" }} />
                            </a>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                        {[
                          { label: "Asset & network", value: `${cryptoPayment.currency} · ${networkLabel(cryptoPayment.network)}` },
                          { label: "Amount received", value: `${displayedObservedAmount ?? "Checking…"} ${cryptoPayment.currency}` },
                          { label: "Confirmations", value: `${cryptoPayment.confirmations ?? 0} of ${cryptoPayment.confirmationsRequired}` },
                          { label: "Last verified", value: cryptoPayment.confirmedAt || cryptoPayment.lastCheckedAt ? new Date(cryptoPayment.confirmedAt ?? cryptoPayment.lastCheckedAt!).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Awaiting check" },
                        ].map((item) => (
                          <div key={item.label}>
                            <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", fontWeight: 800, textTransform: "uppercase" }}>{item.label}</p>
                            <p style={{ margin: "3px 0 0", color: "#0F172A", fontSize: 12.5, fontWeight: 700, lineHeight: 1.4 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, color: "#64748B", fontWeight: 700 }}>RECEIVING WALLET</p>
                        <code style={{ display: "block", marginTop: 4, color: "#0F172A", fontSize: 11.5, wordBreak: "break-all" }}>{cryptoPayment.walletAddress}</code>
                      </div>
                    </div>
                  </section>
                )}

                {cryptoPayment.status === "pending" && cryptoPayment.txHash ? (
                  <button type="button" onClick={() => void checkPendingTransaction()} disabled={checking} aria-busy={checking} style={{ width: "100%", border: 0, background: coin.color, color: "#fff", padding: 12, borderRadius: 10, fontWeight: 800, cursor: checking ? "wait" : "pointer", opacity: checking ? .6 : 1, marginTop: 14 }}>
                    <RefreshCw size={15} style={{ verticalAlign: "text-bottom", marginRight: 7 }} />{checking ? "Checking…" : "Check transaction now"}
                  </button>
                ) : !cryptoPayment.txHash && rateExpired ? (
                  <button type="button" onClick={() => void refreshRate()} disabled={submitting} style={{ width: "100%", marginTop: 14, border: 0, background: "#1240A0", color: "#fff", padding: 12, borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>
                    <RefreshCw size={15} style={{ verticalAlign: "text-bottom", marginRight: 7 }} />{submitting ? "Refreshing…" : "Refresh locked rate"}
                  </button>
                ) : !cryptoPayment.txHash && cryptoPayment.status === "rate_locked" ? (
                  <div style={{ marginTop: 14 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: coin.text, marginBottom: 6 }}>After sending, paste your transaction hash</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={txHash} onChange={(event) => setTxHash(event.target.value)} placeholder="Transaction hash" style={{ flex: 1, minWidth: 0, border: "1px solid #CBD5E1", borderRadius: 9, padding: "11px 12px", fontFamily: "monospace", fontSize: 12 }} />
                      <button type="button" onClick={() => void submitTransaction()} disabled={submitting} aria-busy={submitting} style={{ border: 0, background: coin.color, color: "#fff", borderRadius: 9, padding: "0 14px", fontWeight: 800, cursor: submitting ? "wait" : "pointer", opacity: submitting ? .6 : 1 }}>
                        {submitting ? "Checking…" : "Verify"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {submissionMessage && <p aria-live="polite" style={{ margin: "10px 0 0", color: "#047857", fontSize: 12, fontWeight: 700 }}>{submissionMessage}</p>}
                <p style={{ fontSize: 12, lineHeight: 1.6, color: coin.text, margin: "14px 0 0" }}>
                  Send only <strong>{cryptoPayment.currency}</strong> on <strong>{networkLabel(cryptoPayment.network)}</strong>. Payments need {cryptoPayment.confirmationsRequired} confirmation{cryptoPayment.confirmationsRequired === 1 ? "" : "s"} before dispatch.
                </p>
              </>
            )}
          </section>
        )}

        <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF5", overflow: "hidden", boxShadow: "0 8px 35px rgba(15,23,42,.06)" }}>
          <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "18px 22px", color: "#fff" }}>
            <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", margin: 0, opacity: .7 }}>Order reference</p>
            <p style={{ fontSize: 20, fontWeight: 900, letterSpacing: ".05em", margin: "3px 0 0" }}>{displayedOrder}</p>
          </div>
          <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }}>
            {[
              { icon: <Package size={16} />, label: "Order total", value: `£${total.toFixed(2)}` },
              { icon: <Truck size={16} />, label: "Shipping", value: shippingMethod },
              { icon: <Clock size={16} />, label: "Estimated delivery", value: delivery.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
              { icon: <ShieldCheck size={16} />, label: "Order status", value: isCrypto && cryptoPayment ? statusLabel(cryptoPayment.status) : "Received" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 9 }}>
                <span style={{ color: "#1B5CB5" }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", fontWeight: 800, margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "3px 0 0" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          {orderSummary?.items.length ? (
            <div style={{ borderTop: "1px solid #E8EDF5", padding: "16px 20px 20px" }}>
              <p style={{ margin: "0 0 10px", color: "#64748B", fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>Items in this order</p>
              {orderSummary.items.map((item, index) => (
                <div key={`${item.productName}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "#334155", padding: "4px 0" }}>
                  <span>{item.productName}</span><strong>×{item.quantity}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <PostOrderAccountPrompt orderNumber={displayedOrder} />

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button type="button" onClick={() => navigate("/all-peptides")} style={{ ...actionButton, border: 0, background: "#1240A0", color: "#fff" }}>
            Continue shopping <ArrowRight size={15} style={{ verticalAlign: "text-bottom", marginLeft: 5 }} />
          </button>
          <button type="button" onClick={() => navigate(`/track-order?number=${encodeURIComponent(displayedOrder)}`)} style={{ ...actionButton, flex: "0 0 auto", border: "1px solid #CBD5E1", background: "#fff", color: "#334155", padding: "13px 16px" }}>
            Track order <ExternalLink size={14} style={{ verticalAlign: "text-bottom", marginLeft: 4 }} />
          </button>
        </div>
      </div>
    </div>
  );
}