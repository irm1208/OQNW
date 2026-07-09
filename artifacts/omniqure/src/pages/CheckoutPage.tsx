import { useState, useEffect, useRef, useCallback } from "react";
import { trackInitiateCheckout } from "@/lib/pixels";
import { Link, useLocation } from "wouter";
import { Lock, Shield, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

const COUNTRIES = [
  "United Kingdom", "Ireland",
  "United States", "Canada",
  "Australia", "New Zealand",
  "Austria", "Belgium", "Denmark", "Finland", "France", "Germany",
  "Iceland", "Luxembourg", "Netherlands", "Norway", "Portugal", "Spain",
  "Sweden", "Switzerland",
  "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Estonia", "Greece",
  "Hungary", "Italy", "Latvia", "Lithuania", "Malta", "Poland", "Romania",
  "Slovakia", "Slovenia",
  "Hong Kong", "Japan", "Malaysia", "Singapore", "South Korea", "Taiwan", "Thailand",
  "United Arab Emirates",
];

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard",
    displayLabel: "Standard (3–5 business days)",
    price: 5.00,
    freeOver: 100,
    note: "",
  },
  {
    id: "nextday_weekday",
    label: "Next Day Weekday",
    displayLabel: "Next Day Weekday (order before 1pm Mon–Thu)",
    price: 9.50,
    freeOver: null,
    note: "Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast",
  },
  {
    id: "nextday_weekend",
    label: "Next-Day Weekend",
    displayLabel: "Next-Day Weekend (order before 1pm Fri)",
    price: 13.99,
    freeOver: null,
    note: "Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast",
  },
];


const CRYPTO_OPTIONS = [
  { id: "BTC",  name: "Bitcoin",    symbol: "₿", network: "Bitcoin",      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { id: "ETH",  name: "Ethereum",   symbol: "Ξ", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDT", name: "USDT",       symbol: "₮", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDC", name: "USDC",       symbol: "◎", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "LTC",  name: "Litecoin",   symbol: "Ł", network: "Litecoin",     address: "LYourLitecoinAddressHere" },
  { id: "XMR",  name: "Monero",     symbol: "ɱ", network: "Monero",       address: "YourMoneroAddressHere" },
] as const;
type CryptoCurrency = typeof CRYPTO_OPTIONS[number]["id"];

type BankEntry =
  | { name: string; color: string; viewBox: string; filled: boolean; path: string }
  | { name: string; color: string; viewBox: string; filled: boolean; path: string; imgSrc: string };

const BANK_SVGS: BankEntry[] = [
  {
    name: "HSBC",
    color: "#DB0011",
    viewBox: "0 0 24 24",
    filled: true,
    path: "m24 12.007-5.996 5.997V5.996L24 12.007zm-5.996-6.01H6.01l5.996 6.01 5.997-6.01zM0 12.006l6.01 5.997V5.996L0 12.007zm6.01 5.997h11.994l-5.997-5.997-5.996 5.997z",
  },
  {
    name: "Barclays",
    color: "#00AEEF",
    viewBox: "0 0 24 24",
    filled: true,
    path: "M21.043 3.629a3.235 3.235 0 0 0-1.048-.54 3.076 3.076 0 0 0-.937-.144h-.046c-.413.006-1.184.105-1.701.71a1.138 1.138 0 0 0-.226 1.023.9.9 0 0 0 .555.63s.088.032.228.058c-.04.078-.136.214-.136.214-.179.265-.576.612-1.668.612h-.063c-.578-.038-1.056-.189-1.616-.915-.347-.45-.523-1.207-.549-2.452-.022-.624-.107-1.165-.256-1.6-.1-.29-.333-.596-.557-.742a2.55 2.55 0 0 0-.694-.336c-.373-.12-.848-.14-1.204-.146-.462-.01-.717.096-.878.292-.027.033-.032.05-.068.046-.084-.006-.272-.006-.328-.006-.264 0-.498.043-.721.09-.47.1-.761.295-1.019.503-.12.095-.347.365-.399.653a.76.76 0 0 0 .097.578c.14-.148.374-.264.816-.266.493-.002 1.169.224 1.406.608.336.547.27.99.199 1.517-.183 1.347-.68 2.048-1.783 2.203-.191.026-.38.04-.56.04-.776 0-1.34-.248-1.63-.716a.71.71 0 0 1-.088-.168s.087-.021.163-.056c.294-.14.514-.344.594-.661.09-.353.004-.728-.23-1.007-.415-.47-.991-.708-1.713-.708-.4 0-.755.076-.982.14-.908.256-1.633.947-2.214 2.112-.412.824-.7 1.912-.81 3.067-.11 1.13-.056 2.085.019 2.949.124 1.437.363 2.298.708 3.22a15.68 15.68 0 0 0 1.609 3.19c.09-.094.15-.161.308-.318.188-.19.724-.893.876-1.11.19-.27.51-.779.664-1.147l.15.119c.16.127.252.348.249.592-.003.215-.053.464-.184.922a8.703 8.703 0 0 1-.784 1.818c-.189.341-.27.508-.199.584.015.015.038.03.06.026.116 0 .34-.117.585-.304.222-.17.813-.672 1.527-1.675a15.449 15.449 0 0 0 1.452-2.521c.12.046.255.101.317.226a.92.92 0 0 1 .08.563c-.065.539-.379 1.353-.63 1.94-.425.998-1.208 2.115-1.788 2.877-.022.03-.163.197-.186.227.9.792 1.944 1.555 3.007 2.136.725.408 2.203 1.162 3.183 1.424.98-.262 2.458-1.016 3.184-1.424a17.063 17.063 0 0 0 3.003-2.134c-.05-.076-.13-.158-.183-.23-.582-.763-1.365-1.881-1.79-2.875-.25-.59-.563-1.405-.628-1.94-.028-.221-.002-.417.08-.565.033-.098.274-.218.317-.226.405.884.887 1.73 1.452 2.522.715 1.003 1.306 1.506 1.527 1.674.248.191.467.304.586.304a.07.07 0 0 0 .044-.012c.094-.069.017-.234-.183-.594a9.003 9.003 0 0 1-.786-1.822c-.13-.456-.18-.706-.182-.92-.004-.246.088-.466.248-.594l.15-.118c.155.373.5.919.665 1.147.15.216.685.919.876 1.11.156.158.22.222.308.32a15.672 15.672 0 0 0 1.609-3.19c.343-.923.583-1.784.707-3.222.075-.86.128-1.81.02-2.948-.101-1.116-.404-2.264-.81-3.068-.249-.49-.605-1.112-1.171-1.566z",
  },
  {
    name: "Lloyds",
    color: "#006A4D",
    viewBox: "",
    filled: false,
    path: "",
    imgSrc: "/banks/lloyds-v3.png",
  },
  {
    name: "Monzo",
    color: "#14233C",
    viewBox: "",
    filled: false,
    path: "",
    imgSrc: "/banks/monzo.png",
  },
  {
    name: "Santander",
    color: "#EC0000",
    viewBox: "",
    filled: false,
    path: "",
    imgSrc: "/banks/santander.png",
  },
];

type AddressOption = { line1: string; line2: string; city: string; county: string; label: string };

type DeliveryForm = {
  email: string; firstName: string; lastName: string; phone: string;
  address1: string; address2: string; city: string; county: string;
  postcode: string; country: string;
};

type AppliedDiscount = {
  code: string; type: string; value: number; discountAmount: number;
};

const emptyDelivery: DeliveryForm = {
  email: "", firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", county: "",
  postcode: "", country: "United Kingdom",
};

// ── Styles ──────────────────────────────────────────────────────────────────

const input: React.CSSProperties = {
  width: "100%", height: "44px", padding: "0 12px",
  border: "1px solid #d1d5db", borderRadius: "4px",
  fontSize: "14px", color: "#111827", outline: "none",
  fontFamily: "inherit", background: "#fff",
  boxSizing: "border-box",
};

const inputError: React.CSSProperties = { ...input, borderColor: "#ef4444" };

const label: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "#374151", letterSpacing: "0.07em", textTransform: "uppercase",
  marginBottom: "5px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "13px", fontWeight: 800, color: "#111827",
  letterSpacing: "0.08em", textTransform: "uppercase",
  margin: "0 0 16px",
};

const errText: React.CSSProperties = {
  fontSize: "11px", color: "#ef4444", marginTop: "3px",
};

const divider: React.CSSProperties = {
  border: "none", borderTop: "1px solid #e5e7eb", margin: "24px 0",
};

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { items, clearCart, bundleDiscountAmount, bundleFreeBacWater, bundleFreeItemsCount, freeUnitsByProductId } = useCart();
  const { formatPrice } = useCurrency();
  const { customer } = useCustomerAuth();

  const checkoutFired = useRef(false);

  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);
  const [shipping, setShipping] = useState("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<{ productName: string; available: number; requested: number }[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  // Discount
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"bitcoin" | "fena">("fena");
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");

  // Loyalty
  const [loyaltyBalance, setLoyaltyBalance] = useState<{ balance: number; gbpValue: number } | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [freePeptideCredits, setFreePeptideCredits] = useState(0);
  const [redeemFreePeptide, setRedeemFreePeptide] = useState(false);

  // Postcode — auto-fill city/county on blur via postcodes.io
  const [postcodeLoading, setPostcodeLoading] = useState(false);

  // Pre-fill for logged-in customers
  useEffect(() => {
    if (customer) {
      setDelivery(prev => ({
        ...prev,
        email: prev.email || customer.email,
        firstName: prev.firstName || customer.firstName,
        lastName: prev.lastName || customer.lastName,
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (!customer) {
      setLoyaltyBalance(null); setLoyaltyPointsToRedeem(0);
      setFreePeptideCredits(0); setRedeemFreePeptide(false);
      return;
    }
    fetch(apiUrl("loyalty/balance"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ balance: number; gbpValue: number }> : null)
      .then(data => { if (data) setLoyaltyBalance(data); })
      .catch(() => {});
    fetch(apiUrl("account/referral"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ freePeptideCredits: number }> : null)
      .then(data => { if (data) setFreePeptideCredits(data.freePeptideCredits); })
      .catch(() => {});
  }, [customer]);

  useEffect(() => {
    if (!checkoutFired.current && items.length > 0) {
      checkoutFired.current = true;
      const value = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
      trackInitiateCheckout(value, items.reduce((s, i) => s + i.quantity, 0));
    }
  }, []);

  // Auto-fill city/county when a valid postcode is entered
  const onPostcodeBlur = useCallback(async (pc: string) => {
    const q = pc.trim().toUpperCase().replace(/\s/g, "");
    if (q.length < 5) return;
    setPostcodeLoading(true);
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data = await res.json() as { result?: { admin_district?: string; admin_county?: string; parish?: string } };
      if (data?.result) {
        setDelivery(d => ({
          ...d,
          city: d.city || data.result!.admin_district || "",
          county: d.county || data.result!.admin_county || data.result!.parish || "",
        }));
      }
    } catch { /* ignore */ } finally {
      setPostcodeLoading(false);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ fontFamily: "inherit", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>Your cart is empty</p>
          <Link href="/all-peptides" style={{ color: "#1B5CB5", fontSize: "14px" }}>← Browse peptides</Link>
        </div>
      </div>
    );
  }

  const cartGBP = items.reduce((s, { product, quantity }) => s + (product.price ?? 0) * quantity, 0);
  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const shippingCost = selectedShipping.freeOver && cartGBP >= selectedShipping.freeOver ? 0 : selectedShipping.price;
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const loyaltyDiscountGbp = loyaltyPointsToRedeem / 100;
  const cheapestItemPrice = items.length > 0 ? Math.min(...items.map(i => i.product.price ?? 0)) : 0;
  const freePeptideDeductGbp = redeemFreePeptide && freePeptideCredits > 0 ? cheapestItemPrice : 0;
  const totalGBP = Math.max(0, cartGBP + shippingCost - bundleDiscountAmount - discountAmount - loyaltyDiscountGbp - freePeptideDeductGbp);

  const setD = (f: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDelivery(d => ({ ...d, [f]: e.target.value }));

  function validateAll(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!delivery.email.includes("@")) e.email = "Valid email required";
    if (!delivery.firstName.trim()) e.firstName = "Required";
    if (!delivery.lastName.trim()) e.lastName = "Required";
    if (!delivery.address1.trim()) e.address1 = "Required";
    if (!delivery.city.trim()) e.city = "Required";
    if (!delivery.postcode.trim()) e.postcode = "Required";
    if (!delivery.country.trim()) e.country = "Required";
    return e;
  }

  async function applyDiscount() {
    if (!discountInput.trim()) return;
    setApplyingDiscount(true);
    setDiscountError(null);
    try {
      const res = await fetch(apiUrl("discounts/validate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput.trim(), cartTotal: cartGBP }),
      });
      const data = await res.json() as { valid: boolean; error?: string; code?: string; type?: string; value?: number; discountAmount?: number };
      if (data.valid && data.code && data.discountAmount !== undefined) {
        setAppliedDiscount({ code: data.code, type: data.type!, value: data.value!, discountAmount: data.discountAmount });
        setDiscountInput("");
        setDiscountError(null);
      } else {
        setDiscountError(data.error ?? "Invalid discount code");
        setAppliedDiscount(null);
      }
    } catch {
      setDiscountError("Could not verify discount code. Please try again.");
    } finally {
      setApplyingDiscount(false);
    }
  }

  async function placeOrder() {
    const e = validateAll();
    if (Object.keys(e).length) { setErrors(e); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!confirmed) {
      setErrors({ confirmed: "Please confirm before placing your order" });
      return;
    }
    setErrors({});
    setPlacing(true);
    setPlaceError(null);
    setStockErrors([]);
    try {
      const res = await fetch(apiUrl("orders"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivery: {
            email: delivery.email,
            firstName: delivery.firstName,
            lastName: delivery.lastName,
            phone: delivery.phone || undefined,
            address1: delivery.address1,
            address2: delivery.address2 || undefined,
            city: delivery.city,
            county: delivery.county || undefined,
            postcode: delivery.postcode,
            country: delivery.country,
          },
          shippingMethod: selectedShipping.label,
          shippingCostGbp: shippingCost,
          items: items.map(({ product, quantity }) => ({
            productId: parseInt(String(product.id)) || 0,
            productSlug: (product as { slug?: string }).slug ?? "",
            productName: product.name,
            productCategory: product.category ?? "",
            quantity,
            priceGbp: product.price ?? 0,
          })),
          discountCode: appliedDiscount?.code ?? null,
          loyaltyPointsRedeemed: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
          redeemFreePeptide: redeemFreePeptide && freePeptideCredits > 0 ? true : undefined,
          paymentMethod,
          cryptoCurrency: paymentMethod === "bitcoin" ? cryptoCurrency : undefined,
        }),
      });

      if (res.status === 422) {
        const body = await res.json().catch(() => ({})) as { error?: string; stockErrors?: { productName: string; available: number; requested: number }[] };
        setStockErrors(body.stockErrors ?? []);
        setPlaceError(body.error ?? "Some items in your cart are unavailable.");
        setPlacing(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Order failed" })) as { error?: string };
        throw new Error(err.error ?? "Order failed");
      }

      const data = await res.json() as {
        orderNumber: string; customerName: string; totalGbp: number; shippingMethod: string;
        btcAddress?: string; btcAmount?: string; btcPaymentUrl?: string;
        cryptoCurrency?: string; fenaPaymentUrl?: string;
      };
      clearCart();

      if (paymentMethod === "fena" && data.fenaPaymentUrl) {
        window.location.href = data.fenaPaymentUrl;
        return;
      }

      const selectedCoin = CRYPTO_OPTIONS.find(c => c.id === cryptoCurrency) ?? CRYPTO_OPTIONS[0];
      const params = new URLSearchParams({
        order: data.orderNumber,
        name: delivery.firstName,
        total: data.totalGbp.toFixed(2),
        ship: data.shippingMethod,
        payment: paymentMethod,
      });
      if (paymentMethod === "bitcoin") {
        params.set("cryptoCurrency", cryptoCurrency);
        const addr = data.btcAddress ?? selectedCoin.address;
        params.set("cryptoAddress", addr);
        if (data.btcAmount) params.set("btcAmount", data.btcAmount);
        if (data.btcPaymentUrl) params.set("btcUrl", data.btcPaymentUrl);
      }
      navigate(`/order-confirmation?${params.toString()}`);
    } catch (err) {
      setPlaceError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  // Shared input style with error state
  const inp = (key: string): React.CSSProperties =>
    errors[key] ? inputError : input;

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* ── Breadcrumb bar ── */}
      <div style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ fontSize: "18px", fontWeight: 800, color: "#111827", textDecoration: "none", letterSpacing: "-0.02em" }}>
            OmniQure
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            {["Cart", "Information", "Shipping", "Payment"].map((s, i) => (
              <span key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span style={{ color: "#9ca3af" }}>›</span>}
                <span style={{ color: i === 1 ? "#111827" : "#9ca3af" }}>{s}</span>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px" }}>
            <Lock size={13} />
            <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="checkout-layout" style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 40, alignItems: "flex-start" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>

          {/* CONTACT INFORMATION */}
          <p style={sectionTitle}>Contact Information</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={label}>Email *</label>
              <input
                value={delivery.email} onChange={setD("email")} type="email"
                placeholder="your@email.com" style={inp("email")}
                onFocus={e => { if (!errors.email) e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#d1d5db"; }}
              />
              {errors.email && <p style={errText}>{errors.email}</p>}
            </div>
            <div>
              <label style={label}>Phone</label>
              <input
                value={delivery.phone} onChange={setD("phone")} type="tel"
                placeholder="+44 7700 900000" style={input}
                onFocus={e => { e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#d1d5db"; }}
              />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", color: "#374151", cursor: "pointer", marginBottom: 4 }}>
            <input type="checkbox" style={{ width: 15, height: 15, accentColor: "#111827" }} />
            Email me with news and exclusive offers
          </label>

          <hr style={divider} />

          {/* SHIPPING ADDRESS */}
          <p style={sectionTitle}>Shipping Address</p>

          {/* Name row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={label}>First Name *</label>
              <input value={delivery.firstName} onChange={setD("firstName")} placeholder="First Name" style={inp("firstName")}
                onFocus={e => { if (!errors.firstName) e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.firstName ? "#ef4444" : "#d1d5db"; }} />
              {errors.firstName && <p style={errText}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={label}>Last Name *</label>
              <input value={delivery.lastName} onChange={setD("lastName")} placeholder="Last Name" style={inp("lastName")}
                onFocus={e => { if (!errors.lastName) e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.lastName ? "#ef4444" : "#d1d5db"; }} />
              {errors.lastName && <p style={errText}>{errors.lastName}</p>}
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Address *</label>
            <input value={delivery.address1} onChange={setD("address1")} placeholder="Street address" style={inp("address1")}
              onFocus={e => { if (!errors.address1) e.currentTarget.style.borderColor = "#374151"; }}
              onBlur={e => { e.currentTarget.style.borderColor = errors.address1 ? "#ef4444" : "#d1d5db"; }} />
            {errors.address1 && <p style={errText}>{errors.address1}</p>}
          </div>

          {/* Address 2 */}
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Apt, Suite, Etc. (Optional)</label>
            <input value={delivery.address2} onChange={setD("address2")} placeholder="Apartment, suite, etc." style={input}
              onFocus={e => { e.currentTarget.style.borderColor = "#374151"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#d1d5db"; }} />
          </div>

          {/* City / Country / Postcode */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 4 }}>
            <div>
              <label style={label}>City *</label>
              <input value={delivery.city} onChange={setD("city")} placeholder="City" style={inp("city")}
                onFocus={e => { if (!errors.city) e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.city ? "#ef4444" : "#d1d5db"; }} />
              {errors.city && <p style={errText}>{errors.city}</p>}
            </div>
            <div>
              <label style={label}>Country *</label>
              <select value={delivery.country} onChange={setD("country")}
                style={{ ...inp("country"), height: 44, appearance: "none", cursor: "pointer" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.country ? "#ef4444" : "#d1d5db"; }}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Postal Code *</label>
              <input value={delivery.postcode} onChange={setD("postcode")} placeholder="Postal Code" style={inp("postcode")}
                onFocus={e => { if (!errors.postcode) e.currentTarget.style.borderColor = "#374151"; }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = errors.postcode ? "#ef4444" : "#d1d5db";
                  onPostcodeBlur(e.currentTarget.value);
                }} />
              {postcodeLoading && <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 4 }}>Looking up postcode…</p>}
              {errors.postcode && <p style={errText}>{errors.postcode}</p>}
            </div>
          </div>

          <hr style={divider} />

          {/* SHIPPING OPTIONS */}
          <p style={sectionTitle}>Shipping Options</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
            {SHIPPING_OPTIONS.map(opt => {
              const cost = opt.freeOver && cartGBP >= opt.freeOver ? 0 : opt.price;
              const isFree = opt.freeOver && cartGBP >= opt.freeOver;
              const active = shipping === opt.id;
              return (
                <label
                  key={opt.id}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                    border: `1px solid ${active ? "#374151" : "#d1d5db"}`,
                    borderRadius: 6, cursor: "pointer", background: "#fff",
                    transition: "border-color 0.15s",
                  }}
                >
                  <input type="radio" name="shipping" value={opt.id} checked={active}
                    onChange={() => setShipping(opt.id)}
                    style={{ marginTop: 2, accentColor: "#111827", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{opt.displayLabel}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", flexShrink: 0, marginLeft: 12 }}>
                        {isFree ? <span style={{ color: "#059669" }}>FREE</span> : `£${cost.toFixed(2)}`}
                      </span>
                    </div>
                    {opt.note && (
                      <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 2 }}>{opt.note}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <hr style={divider} />

          {/* PAYMENT METHOD */}
          <p style={sectionTitle}>Payment Method</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* ── Pay by Bank (Fena) ── */}
            {(() => {
              const TEAL = "#1A6B52";
              const active = paymentMethod === "fena";
              return (
                <div
                  onClick={() => setPaymentMethod("fena")}
                  style={{
                    border: `${active ? "2px" : "1px"} solid ${active ? TEAL : "#d1d5db"}`,
                    borderRadius: 6, overflow: "hidden", cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <input type="radio" checked={active} onChange={() => setPaymentMethod("fena")}
                      style={{ accentColor: TEAL, width: 16, height: 16, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Pay by Bank</span>
                        <span style={{
                          fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
                          background: "#059669", color: "#fff",
                          padding: "2px 8px", borderRadius: 100,
                        }}>RECOMMENDED · FASTEST</span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: "4px 0 0" }}>
                        Tap your bank, approve in your banking app — done in seconds.
                      </p>
                    </div>
                  </div>

                  {active && (
                    <div style={{ borderTop: "1px solid #e5e7eb", padding: "14px 16px" }}>
                      {/* Trust line */}
                      <p style={{ fontSize: "12px", color: "#4b5563", marginBottom: 12 }}>
                        🏦 FCA-authorised open banking · Read-only · No card details stored
                      </p>
                      {/* Bank logos — inline SVG, no external requests */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                        {BANK_SVGS.map(b => (
                          <div key={b.name} title={b.name} style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: "#fff", border: "1px solid #e5e7eb",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, overflow: "hidden",
                          }}>
                            {"imgSrc" in b ? (
                              <img
                                src={b.imgSrc}
                                alt={b.name}
                                style={{ width: 32, height: 32, objectFit: "contain" }}
                              />
                            ) : (
                              <svg
                                viewBox={b.viewBox}
                                width={b.filled ? 32 : 38}
                                height={b.filled ? 32 : 38}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d={b.path}
                                  fill={b.filled ? b.color : "none"}
                                  stroke={b.filled ? "none" : b.color}
                                  strokeWidth={b.filled ? undefined : 2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        ))}
                        <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>+more</span>
                      </div>
                      {/* How it works */}
                      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                        <p style={{ fontSize: "11px", fontWeight: 800, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                          How it works
                        </p>
                        {["Choose your bank", "Approve in your banking app", "Order confirmed instantly"].map((step, i) => (
                          <div key={step} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: "50%",
                              background: TEAL, color: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "11px", fontWeight: 800, flexShrink: 0,
                            }}>{i + 1}</div>
                            <span style={{ fontSize: "13px", color: "#374151" }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Cryptocurrency ── */}
            {(() => {
              const active = paymentMethod === "bitcoin";
              return (
                <div
                  onClick={() => setPaymentMethod("bitcoin")}
                  style={{ border: `${active ? "2px" : "1px"} solid ${active ? "#374151" : "#d1d5db"}`, borderRadius: 6, cursor: "pointer", background: "#fff" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <input type="radio" checked={active} onChange={() => setPaymentMethod("bitcoin")}
                      style={{ accentColor: "#111827", width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Cryptocurrency</span>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>Bitcoin, Ethereum, USDT, USDC, Litecoin, Monero</p>
                    </div>
                  </div>
                  {active && (
                    <div style={{ borderTop: "1px solid #e5e7eb", padding: "14px 16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {/* BTC is processed via BTCPay; other coins use static wallet addresses */}
                      {CRYPTO_OPTIONS.map(c => (
                          <button key={c.id} type="button" onClick={e => { e.stopPropagation(); setCryptoCurrency(c.id); }}
                            style={{
                              padding: "6px 14px", borderRadius: 100, border: "1px solid",
                              borderColor: cryptoCurrency === c.id ? "#111827" : "#d1d5db",
                              background: cryptoCurrency === c.id ? "#111827" : "#fff",
                              color: cryptoCurrency === c.id ? "#fff" : "#374151",
                              fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            }}>{c.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Loyalty points (logged-in only) */}
          {loyaltyBalance && loyaltyBalance.balance > 0 && (
            <div style={{ marginTop: 24, border: "1px solid #d1d5db", borderRadius: 6, padding: 16, background: "#fff" }}>
              <p style={{ ...sectionTitle, marginBottom: 8 }}>Loyalty Points</p>
              <p style={{ fontSize: "13px", color: "#374151", marginBottom: 10 }}>
                You have <strong>{loyaltyBalance.balance}</strong> points (worth <strong>£{loyaltyBalance.gbpValue.toFixed(2)}</strong>).
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="range" min={0} max={Math.min(loyaltyBalance.balance, Math.floor(totalGBP * 100))}
                  step={100} value={loyaltyPointsToRedeem}
                  onChange={e => setLoyaltyPointsToRedeem(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#111827" }}
                />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", minWidth: 60, textAlign: "right" }}>
                  −£{(loyaltyPointsToRedeem / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {freePeptideCredits > 0 && (
            <div style={{ marginTop: 16, border: "1px solid #d1d5db", borderRadius: 6, padding: 16, background: "#fff" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "14px", color: "#111827" }}>
                <input type="checkbox" checked={redeemFreePeptide} onChange={e => setRedeemFreePeptide(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#111827" }} />
                <span>Redeem free peptide credit — save £{cheapestItemPrice.toFixed(2)} on your cheapest item</span>
              </label>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN — ORDER SUMMARY ── */}
        <div className="checkout-sidebar" style={{ width: 360, flexShrink: 0, position: "sticky", top: 24 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 0" }}>
              <p style={{ fontSize: "13px", fontWeight: 800, color: "#111827", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
                Order Summary
              </p>

              {/* Cart items */}
              {items.map(({ product, quantity }) => {
                const price = product.price ?? 0;
                const freeQty = freeUnitsByProductId?.[parseInt(String(product.id))] ?? 0;
                return (
                  <div key={String(product.id)} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 6, border: "1px solid #e5e7eb", overflow: "hidden", background: "#f9fafb" }}>
                        {(product as { image?: string }).image ? (
                          <img src={(product as { image?: string }).image} alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#9ca3af" }}>IMG</div>
                        )}
                      </div>
                      <div style={{
                        position: "absolute", top: -6, right: -6,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#374151", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                      }}>{quantity}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{product.name}</p>
                      {freeQty > 0 && (
                        <p style={{ fontSize: "11px", color: "#059669", margin: "2px 0 0", fontWeight: 600 }}>
                          {freeQty} free (Bundle & Save)
                        </p>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827", flexShrink: 0 }}>
                      £{(price * quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />

            {/* Discount code */}
            <div style={{ padding: "16px 20px" }}>
              {appliedDiscount ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6 }}>
                  <span style={{ fontSize: "13px", color: "#065f46", fontWeight: 700 }}>
                    {appliedDiscount.code} — −£{appliedDiscount.discountAmount.toFixed(2)}
                  </span>
                  <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountError(null); setDiscountInput(""); }}
                    style={{ background: "none", border: "none", color: "#065f46", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>✕</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={discountInput} onChange={e => setDiscountInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && applyDiscount()}
                      placeholder="Gift card or discount code"
                      style={{ ...input, flex: 1, height: 40 }}
                    />
                    <button type="button" onClick={applyDiscount} disabled={applyingDiscount || !discountInput.trim()}
                      style={{
                        padding: "0 16px", height: 40, borderRadius: 4,
                        background: "#374151", color: "#fff",
                        border: "none", fontSize: "13px", fontWeight: 700,
                        cursor: "pointer", letterSpacing: "0.05em", flexShrink: 0,
                        opacity: (applyingDiscount || !discountInput.trim()) ? 0.5 : 1,
                      }}>APPLY</button>
                  </div>
                  {discountError && <p style={{ ...errText, marginTop: 4 }}>{discountError}</p>}
                </div>
              )}
            </div>

            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />

            {/* Totals */}
            <div style={{ padding: "16px 20px" }}>
              {[
                ["Subtotal", `£${cartGBP.toFixed(2)}`],
                ["Shipping", shippingCost === 0 ? "FREE" : `£${shippingCost.toFixed(2)}`],
                ...(bundleDiscountAmount > 0 ? [["Bundle & Save", `−£${bundleDiscountAmount.toFixed(2)}`]] : []),
                ...(discountAmount > 0 ? [[`Discount (${appliedDiscount?.code})`, `−£${discountAmount.toFixed(2)}`]] : []),
                ...(loyaltyPointsToRedeem > 0 ? [["Loyalty Points", `−£${loyaltyDiscountGbp.toFixed(2)}`]] : []),
                ...(freePeptideDeductGbp > 0 ? [["Free Peptide Credit", `−£${freePeptideDeductGbp.toFixed(2)}`]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{k}</span>
                  <span style={{ fontSize: "13px", color: v?.startsWith("−") || v === "FREE" ? "#059669" : "#111827", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>£{totalGBP.toFixed(2)}</span>
              </div>
            </div>

            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />

            {/* Confirm + CTA */}
            <div style={{ padding: "16px 20px 20px" }}>
              {/* Confirm checkbox */}
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: "13px", color: "#374151", cursor: "pointer", marginBottom: 16,
                lineHeight: 1.4,
              }}>
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  style={{ width: 16, height: 16, marginTop: 1, accentColor: "#111827", flexShrink: 0 }} />
                I confirm that all products are for laboratory research purposes only, not for human consumption, and I am at least 18 years of age.
              </label>
              {errors.confirmed && <p style={{ ...errText, marginBottom: 12 }}>{errors.confirmed}</p>}

              {/* Errors */}
              {placeError && (
                <div style={{ marginBottom: 12, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: "13px", color: "#dc2626" }}>
                  {placeError}
                </div>
              )}
              {stockErrors.length > 0 && (
                <div style={{ marginBottom: 12, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: "13px", color: "#dc2626" }}>
                  {stockErrors.map(e => (
                    <p key={e.productName} style={{ margin: "0 0 4px" }}>
                      {e.productName}: only {e.available} in stock (you requested {e.requested})
                    </p>
                  ))}
                </div>
              )}

              {/* COMPLETE ORDER button */}
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                style={{
                  width: "100%", height: 52, borderRadius: 4,
                  background: placing ? "#374151" : "#111827",
                  color: "#fff", border: "none",
                  fontSize: "13px", fontWeight: 800,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: placing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.background = "#374151"; }}
                onMouseLeave={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.background = "#111827"; }}
              >
                {placing ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Complete Order
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em" }}>
                  <Shield size={13} /> SECURE CHECKOUT
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em" }}>
                  <Truck size={13} /> FAST SHIPPING
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .checkout-layout { flex-direction: column !important; }
          .checkout-sidebar { width: 100% !important; position: static !important; }
        }
      `}</style>
    </div>
  );
}
