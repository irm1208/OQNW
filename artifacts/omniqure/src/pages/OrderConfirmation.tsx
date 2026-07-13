import { useEffect, useState, useRef } from "react";
import { trackPurchase } from "@/lib/pixels";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Package, Truck, FlaskConical, ArrowRight, Download, Search, Clock, Smartphone, Monitor } from "lucide-react";

// Keep in sync with CheckoutPage.tsx
const BANK_DETAILS = {
  accountName: "OmniQure Research Ltd",
  sortCode: "20-00-00",
  accountNumber: "12345678",
  bank: "Barclays Bank",
};
const CRYPTO_OPTIONS = [
  { id: "BTC",  name: "Bitcoin",  symbol: "₿", network: "Bitcoin",       color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E" },
  { id: "ETH",  name: "Ethereum", symbol: "Ξ", network: "ERC-20 / ETH", color: "#6366F1", bg: "#EEF2FF", border: "#C7D2FE", text: "#3730A3" },
  { id: "USDT", name: "USDT",     symbol: "₮", network: "ERC-20 / ETH", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46" },
  { id: "USDC", name: "USDC",     symbol: "◎", network: "ERC-20 / ETH", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
  { id: "LTC",  name: "Litecoin", symbol: "Ł", network: "Litecoin",     color: "#64748B", bg: "#F8FAFC", border: "#CBD5E1", text: "#334155" },
  { id: "XMR",  name: "Monero",   symbol: "ɱ", network: "Monero",       color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", text: "#9A3412" },
];

export default function OrderConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const order          = params.get("order")          ?? "OQ-000000";
  const name           = params.get("name")           ?? "Researcher";
  const total          = params.get("total")          ?? "0.00";
  const ship           = params.get("ship")           ?? "Standard";
  const payment        = params.get("payment")        ?? "bank_transfer";
  const cryptoCurrId   = params.get("cryptoCurrency") ?? "BTC";
  const cryptoAddress  = params.get("cryptoAddress")  ?? null;
  const btcAmount      = params.get("btcAmount")      ?? null;
  const btcUrl         = params.get("btcUrl")         ?? null;
  const coin = CRYPTO_OPTIONS.find(c => c.id === cryptoCurrId) ?? CRYPTO_OPTIONS[0];

  const continuePaymentParams = new URLSearchParams({ order, name, total });
  const continuePaymentUrl = `${window.location.origin}${import.meta.env.BASE_URL ?? "/"}continue-payment?${continuePaymentParams.toString()}`.replace(/([^:])\/\//, "$1/");
  const [showOnDevice, setShowOnDevice] = useState(false);

  const today = new Date();
  const deliveryDays = ship === "Next Day" ? 1 : ship === "Express" ? 2 : 5;
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + deliveryDays);
  const deliveryStr = delivery.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const [copied, setCopied] = useState(false);
  const purchaseFired = useRef(false);
  function copy() {
    navigator.clipboard.writeText(order).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (!purchaseFired.current && order !== "OQ-000000") {
      purchaseFired.current = true;
      trackPurchase(order, parseFloat(total), 1);
    }
  }, []);

  return (
    <div style={{
      fontFamily: "'Arimo', Arial, sans-serif",
      backgroundColor: "#F5F8FC",
      minHeight: "70vh",
      padding: "48px 16px",
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
            {payment === "bank_transfer" ? "Order placed — payment awaited" : `Order placed — awaiting ${coin.name}`}
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.6 }}>
            {payment === "bank_transfer"
              ? <>Thank you, <strong style={{ color: "#0F172A" }}>{name}</strong>. Your order is reserved — please send your bank transfer to secure it.</>
              : <>Thank you, <strong style={{ color: "#0F172A" }}>{name}</strong>. Your order is reserved — please send the {coin.name} equivalent to the address below.</>
            }
          </p>
        </div>

        {/* Bank Transfer action panel */}
        {payment === "bank_transfer" && (
          <div style={{ borderRadius: "16px", border: "1.5px solid #BFDBFE", backgroundColor: "#EFF6FF", padding: "22px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Clock size={18} color="#1E40AF" />
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#1E40AF", margin: 0 }}>
                Send your bank transfer now
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "12px" }}>
              {[
                { label: "Account Name",   value: BANK_DETAILS.accountName },
                { label: "Sort Code",       value: BANK_DETAILS.sortCode },
                { label: "Account Number",  value: BANK_DETAILS.accountNumber },
                { label: "Bank",            value: BANK_DETAILS.bank },
                { label: "Reference",       value: order },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #DBEAFE" }}>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: row.label === "Reference" ? "#059669" : "#1240A0" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11.5px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Use your order number as the payment reference. Faster Payments usually clears same day. We'll email you once payment is confirmed and your order is dispatched.
            </p>
          </div>
        )}

        {/* Pay By Bank — scan to continue on phone */}
        {payment === "bank_transfer" && (
          <div style={{ borderRadius: "16px", border: "1.5px solid #E8EDF5", backgroundColor: "#fff", padding: "22px", marginBottom: "20px", boxShadow: "0 4px 20px rgba(15,23,42,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Smartphone size={18} color="#1240A0" />
              <p style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Scan to continue on your phone
              </p>
            </div>
            {!showOnDevice ? (
              <>
                <div style={{ display: "flex", justifyContent: "center", padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "12px" }}>
                  <QRCodeSVG value={continuePaymentUrl} size={180} bgColor="#F8FAFC" fgColor="#0F172A" />
                </div>
                <p style={{ fontSize: "12px", color: "#64748B", textAlign: "center", marginBottom: "14px" }}>
                  Scan the QR code to open your payment details on your phone — handy if your banking app lives there.
                </p>
                <button
                  onClick={() => setShowOnDevice(true)}
                  style={{
                    width: "100%", height: "42px", borderRadius: "10px",
                    border: "1.5px solid #1240A0", backgroundColor: "#fff", color: "#1240A0",
                    fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}
                >
                  <Monitor size={15} /> Continue on this device
                </button>
              </>
            ) : (
              <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                No problem — the bank details above are all you need. Send the transfer from this device whenever you're ready.
              </p>
            )}
          </div>
        )}

        {/* Cryptocurrency action panel */}
        {payment === "bitcoin" && (
          <div style={{ borderRadius: "16px", border: `1.5px solid ${coin.border}`, backgroundColor: coin.bg, padding: "22px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Clock size={18} color={coin.color} />
              <p style={{ fontSize: "14px", fontWeight: 800, color: coin.text, margin: 0 }}>
                Send your {coin.name} payment now
              </p>
              <span style={{ marginLeft: "auto", fontSize: "22px", lineHeight: 1 }}>{coin.symbol}</span>
            </div>

            {/* BTC amount from BTCPay (BTC only) */}
            {btcAmount && coin.id === "BTC" && (
              <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#fff", border: `1.5px solid ${coin.border}`, marginBottom: "10px" }}>
                <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Exact Amount to Send</p>
                <p style={{ fontSize: "20px", fontWeight: 900, color: coin.text, margin: 0 }}>{btcAmount} <span style={{ fontSize: "14px" }}>BTC</span></p>
                <p style={{ fontSize: "11px", color: "#94A3B8", margin: "2px 0 0" }}>≈ £{parseFloat(total).toFixed(2)} at current rate — locked for 60 min</p>
              </div>
            )}

            {/* Wallet address */}
            {cryptoAddress && (
              <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#fff", border: `1.5px solid ${coin.border}`, marginBottom: "12px" }}>
                <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{coin.name} Address — {coin.network}</p>
                <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A", wordBreak: "break-all", fontFamily: "monospace", letterSpacing: "0.02em", margin: 0 }}>
                  {cryptoAddress}
                </p>
              </div>
            )}

            {/* Open in BTCPay (BTC only) */}
            {btcUrl && coin.id === "BTC" && (
              <a
                href={btcUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", textAlign: "center", padding: "12px", borderRadius: "10px",
                  backgroundColor: coin.color, color: "#fff", fontWeight: 700, fontSize: "14px",
                  textDecoration: "none", marginBottom: "12px",
                }}
              >
                Open in Wallet / BTCPay Page ↗
              </a>
            )}

            <div style={{ fontSize: "12px", color: coin.text, lineHeight: 1.8 }}>
              {btcAmount && coin.id === "BTC"
                ? <>{coin.symbol} Send <strong>{btcAmount} BTC</strong> — do not round the amount.</>
                : <>{coin.symbol} Convert £{parseFloat(total).toFixed(2)} to {coin.id} at the current rate before sending.</>
              }<br />
              {coin.symbol} Use your order number <strong>{order}</strong> in the memo / payment ID field.<br />
              {coin.symbol} We'll email you once your payment is confirmed and your order is dispatched.
            </div>
          </div>
        )}

        {/* Order card */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "20px",
          border: "1.5px solid #E8EDF5", boxShadow: "0 8px 40px rgba(15,23,42,0.07)",
          overflow: "hidden", marginBottom: "20px",
        }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "18px 24px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Order Reference</p>
                <p style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "0.05em", marginTop: "2px" }}>{order}</p>
              </div>
              <button
                onClick={copy}
                style={{
                  fontSize: "11.5px", fontWeight: 700, padding: "6px 14px", borderRadius: "8px",
                  border: "1.5px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fff", cursor: "pointer", transition: "background 0.15s",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Status row */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", gap: "0", position: "relative" }}>
              {["Order Placed", "Processing", "Dispatched", "Delivered"].map((label, i) => (
                <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative" }}>
                  {i < 3 && (
                    <div style={{ position: "absolute", top: "12px", left: "50%", right: "-50%", height: "2px", backgroundColor: i === 0 ? "#059669" : "#E2E8F0", zIndex: 0 }} />
                  )}
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", zIndex: 1,
                    backgroundColor: i === 0 ? "#059669" : i === 1 ? "#FCD34D" : "#E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i === 0
                      ? <CheckCircle2 size={14} color="#fff" />
                      : i === 1
                      ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />
                      : <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
                    }
                  </div>
                  <p style={{ fontSize: "10.5px", fontWeight: i <= 1 ? 700 : 500, color: i === 0 ? "#059669" : i === 1 ? "#D97706" : "#94A3B8", textAlign: "center" }}>
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
                { icon: <Package size={16} />, label: "Order Total", value: `£${parseFloat(total).toFixed(2)}`, color: "#1240A0" },
                { icon: <Truck size={16} />, label: "Shipping", value: ship, color: "#0F172A" },
                { icon: <FlaskConical size={16} />, label: "Est. Delivery", value: deliveryStr, color: "#0F172A" },
                { icon: <CheckCircle2 size={16} />, label: "Purity", value: "99%+ verified", color: "#059669" },
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
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>What happens next</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(payment === "bank_transfer" ? [
                "Send your bank transfer using the reference and account details above.",
                "We'll email confirmation as soon as your payment clears (usually same day).",
                "Our lab team will then prepare your secure, discreet packaging for dispatch.",
                "You'll receive a dispatch notification with tracking information.",
              ] : payment === "bitcoin" ? [
                `Send the ${coin.name} equivalent to the address above — include your order number in the memo/payment ID.`,
                `Your ${coin.network} transaction will be confirmed on the network.`,
                "We'll email you once confirmed and your order is being prepared for dispatch.",
                "Your peptides arrive in insulated packaging maintaining −20°C.",
              ] : [
                "You will receive an order confirmation email within the next few minutes.",
                "Our lab team will verify your order and prepare your secure, discreet packaging.",
                "You'll receive a dispatch notification with tracking information.",
                "Your peptides arrive in insulated packaging maintaining −20°C.",
              ]).map((text, i) => (
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
            onClick={() => window.print()}
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
