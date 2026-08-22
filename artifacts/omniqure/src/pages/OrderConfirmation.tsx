import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, CheckCircle2, Clock, Copy, ExternalLink, Package, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const apiUrl = (path: string) => `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");

type CryptoPayment = {
  currency: "BTC" | "ETH" | "USDT" | "USDC";
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
};

const META: Record<CryptoPayment["currency"], { name: string; symbol: string; color: string; background: string; text: string }> = {
  BTC: { name: "Bitcoin", symbol: "₿", color: "#F59E0B", background: "#FFFBEB", text: "#92400E" },
  ETH: { name: "Ethereum", symbol: "Ξ", color: "#6366F1", background: "#EEF2FF", text: "#3730A3" },
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

export default function OrderConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const order = params.get("order") ?? "OQ-000000";
  const orderId = params.get("orderId") ?? order;
  const payment = params.get("payment") ?? "wallid";
  const cryptoToken = params.get("cryptoToken");
  const name = params.get("name") ?? "Researcher";
  const total = Number(params.get("total") ?? "0");
  const ship = params.get("ship") ?? "Standard";
  const isCrypto = payment === "crypto" && Boolean(cryptoToken);
  const [cryptoPayment, setCryptoPayment] = useState<CryptoPayment | null>(null);
  const [loading, setLoading] = useState(isCrypto);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  const refreshPayment = async () => {
    if (!isCrypto || !cryptoToken) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl(`orders/${encodeURIComponent(orderId)}/crypto-payment`)}?token=${encodeURIComponent(cryptoToken)}`,
      );
      const data = await response.json().catch(() => ({})) as CryptoPayment & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to load the crypto payment");
      setCryptoPayment(data);
      setTxHash(data.txHash ?? "");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the crypto payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    void refreshPayment();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const coin = cryptoPayment ? META[cryptoPayment.currency] : null;
  const rateExpiresAt = cryptoPayment ? new Date(cryptoPayment.rateExpiresAt).getTime() : 0;
  const rateExpired = Boolean(cryptoPayment && rateExpiresAt <= now);
  const minutesRemaining = cryptoPayment && !rateExpired ? Math.max(1, Math.ceil((rateExpiresAt - now) / 60_000)) : 0;
  const qrValue = useMemo(() => {
    if (!cryptoPayment) return "";
    if (cryptoPayment.network === "bitcoin") return `bitcoin:${cryptoPayment.walletAddress}?amount=${cryptoPayment.expectedAmount}`;
    return cryptoPayment.walletAddress;
  }, [cryptoPayment]);

  async function copyAddress() {
    if (!cryptoPayment) return;
    await navigator.clipboard.writeText(cryptoPayment.walletAddress).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function refreshRate() {
    if (!cryptoPayment || !cryptoToken) return;
    setSubmitting(true);
    try {
      const response = await fetch(apiUrl(`orders/${encodeURIComponent(orderId)}/lock-usdt-rate`), {
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

  async function submitTransaction() {
    if (!cryptoToken || !txHash.trim() || rateExpired) return;
    setSubmitting(true);
    try {
      const response = await fetch(apiUrl(`orders/${encodeURIComponent(orderId)}/pay`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentToken: cryptoToken, txHash: txHash.trim() }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to verify the transaction");
      await refreshPayment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify the transaction");
    } finally {
      setSubmitting(false);
    }
  }

  const delivery = new Date();
  delivery.setDate(delivery.getDate() + (ship === "Next Day" ? 1 : ship === "Express" ? 2 : 5));

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
            {error && <p style={{ margin: 0, color: "#B91C1C", fontWeight: 700 }}>{error}</p>}
            {!loading && cryptoPayment && coin && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Clock size={18} color={coin.color} />
                  <strong style={{ color: coin.text }}>Send {coin.name} on {networkLabel(cryptoPayment.network)}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 24, color: coin.color }}>{coin.symbol}</span>
                </div>

                {cryptoPayment.status === "confirmed" ? (
                  <div style={{ padding: 16, borderRadius: 10, background: "#ECFDF5", color: "#065F46", fontSize: 14, lineHeight: 1.55 }}>
                    <strong>Payment confirmed.</strong> We have verified {cryptoPayment.observedAmount ?? cryptoPayment.expectedAmount} {cryptoPayment.currency} with {cryptoPayment.confirmations ?? 0} confirmation(s). Your order can now be prepared for dispatch.
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, alignItems: "center", background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(15,23,42,.1)" }}>
                      <QRCodeSVG value={qrValue} size={106} level="M" includeMargin />
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 800, color: "#64748B", margin: "0 0 4px" }}>Exact amount to send</p>
                        <p style={{ fontSize: 23, fontWeight: 900, color: "#0F172A", margin: 0 }}>{cryptoPayment.expectedAmount} <span style={{ fontSize: 14 }}>{cryptoPayment.currency}</span></p>
                        <p style={{ fontSize: 12, color: rateExpired ? "#B91C1C" : "#475569", margin: "5px 0 0" }}>
                          {rateExpired ? "This rate lock has expired." : `Rate locked for about ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}.`}
                        </p>
                      </div>
                    </div>

                    <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(15,23,42,.1)", marginTop: 12 }}>
                      <p style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 800, color: "#64748B", margin: "0 0 6px" }}>Receiving wallet · {networkLabel(cryptoPayment.network)}</p>
                      <p style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#0F172A", wordBreak: "break-all", lineHeight: 1.5, margin: 0 }}>{cryptoPayment.walletAddress}</p>
                      <button type="button" onClick={() => void copyAddress()} style={{ marginTop: 10, border: 0, background: "#EEF4FF", color: "#1240A0", borderRadius: 7, padding: "7px 10px", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                        <Copy size={13} style={{ verticalAlign: "text-bottom", marginRight: 5 }} />{copied ? "Copied" : "Copy address"}
                      </button>
                    </div>

                    {rateExpired ? (
                      <button type="button" onClick={() => void refreshRate()} disabled={submitting} style={{ width: "100%", marginTop: 14, border: 0, background: "#1240A0", color: "#fff", padding: 12, borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>
                        <RefreshCw size={15} style={{ verticalAlign: "text-bottom", marginRight: 7 }} />{submitting ? "Refreshing…" : "Refresh locked rate"}
                      </button>
                    ) : (
                      <div style={{ marginTop: 14 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: coin.text, marginBottom: 6 }}>After sending, paste your transaction hash</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={txHash} onChange={event => setTxHash(event.target.value)} placeholder="Transaction hash" style={{ flex: 1, minWidth: 0, border: "1px solid #CBD5E1", borderRadius: 9, padding: "11px 12px", fontFamily: "monospace", fontSize: 12 }} />
                          <button type="button" onClick={() => void submitTransaction()} disabled={submitting || !txHash.trim()} style={{ border: 0, background: coin.color, color: "#fff", borderRadius: 9, padding: "0 14px", fontWeight: 800, cursor: "pointer", opacity: submitting || !txHash.trim() ? .6 : 1 }}>
                            {submitting ? "Checking…" : "Verify"}
                          </button>
                        </div>
                      </div>
                    )}
                    <p style={{ fontSize: 12, lineHeight: 1.6, color: coin.text, margin: "14px 0 0" }}>
                      Send only <strong>{cryptoPayment.currency}</strong> on <strong>{networkLabel(cryptoPayment.network)}</strong>. Payments need {cryptoPayment.confirmationsRequired} confirmation{cryptoPayment.confirmationsRequired === 1 ? "" : "s"} before dispatch. Do not use a different network or token.
                    </p>
                  </>
                )}
              </>
            )}
          </section>
        )}

        <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF5", overflow: "hidden", boxShadow: "0 8px 35px rgba(15,23,42,.06)" }}>
          <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "18px 22px", color: "#fff" }}>
            <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", margin: 0, opacity: .7 }}>Order reference</p>
            <p style={{ fontSize: 20, fontWeight: 900, letterSpacing: ".05em", margin: "3px 0 0" }}>{order}</p>
          </div>
          <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18 }}>
            {[
              { icon: <Package size={16} />, label: "Order total", value: `£${total.toFixed(2)}` },
              { icon: <Truck size={16} />, label: "Shipping", value: ship },
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
        </section>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Link href="/all-peptides" style={{ flex: 1, borderRadius: 10, background: "#1240A0", color: "#fff", padding: 13, textAlign: "center", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
            Continue shopping <ArrowRight size={15} style={{ verticalAlign: "text-bottom", marginLeft: 5 }} />
          </Link>
          <Link href={`/track-order?q=${encodeURIComponent(order)}`} style={{ borderRadius: 10, border: "1px solid #CBD5E1", color: "#334155", padding: "13px 16px", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
            Track order <ExternalLink size={14} style={{ verticalAlign: "text-bottom", marginLeft: 4 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}