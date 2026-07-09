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

const BANK_DETAILS = {
  accountName: "OmniQure Research Ltd",
  sortCode: "20-00-00",
  accountNumber: "12345678",
  bank: "Barclays Bank",
};

const CRYPTO_OPTIONS = [
  { id: "BTC",  name: "Bitcoin",    symbol: "₿", network: "Bitcoin",      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { id: "ETH",  name: "Ethereum",   symbol: "Ξ", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDT", name: "USDT",       symbol: "₮", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDC", name: "USDC",       symbol: "◎", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "LTC",  name: "Litecoin",   symbol: "Ł", network: "Litecoin",     address: "LYourLitecoinAddressHere" },
  { id: "XMR",  name: "Monero",     symbol: "ɱ", network: "Monero",       address: "YourMoneroAddressHere" },
] as const;
type CryptoCurrency = typeof CRYPTO_OPTIONS[number]["id"];

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
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "bitcoin" | "fena">("fena");
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");

  // Loyalty
  const [loyaltyBalance, setLoyaltyBalance] = useState<{ balance: number; gbpValue: number } | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [freePeptideCredits, setFreePeptideCredits] = useState(0);
  const [redeemFreePeptide, setRedeemFreePeptide] = useState(false);

  // Postcode lookup
  const [postcodeLookup, setPostcodeLookup] = useState("");
  const [postcodeResults, setPostcodeResults] = useState<string[]>([]);
  const [postcodeDropOpen, setPostcodeDropOpen] = useState(false);
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const postcodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Postcode autocomplete via postcodes.io
  const lookupPostcode = useCallback((val: string) => {
    const q = val.trim().toUpperCase().replace(/\s/g, "");
    if (q.length < 2) { setPostcodeResults([]); setPostcodeDropOpen(false); return; }
    setPostcodeLoading(true);
    fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`)
      .then(r => r.ok ? r.json() as Promise<{ result: string[] | null }> : null)
      .then(data => {
        const results = data?.result ?? [];
        setPostcodeResults(results.slice(0, 6));
        setPostcodeDropOpen(results.length > 0);
      })
      .catch(() => {})
      .finally(() => setPostcodeLoading(false));
  }, []);

  const onPostcodeLookupChange = (val: string) => {
    setPostcodeLookup(val);
    if (postcodeTimer.current) clearTimeout(postcodeTimer.current);
    postcodeTimer.current = setTimeout(() => lookupPostcode(val), 350);
  };

  const selectPostcode = (pc: string) => {
    setPostcodeDropOpen(false);
    setPostcodeLookup(pc);
    setDelivery(d => ({ ...d, postcode: pc }));
    // Fetch details to auto-fill city/county
    fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { result?: { admin_district?: string; admin_county?: string; parish?: string } } | null) => {
        if (data?.result) {
          const city = data.result.admin_district ?? "";
          const county = data.result.admin_county ?? data.result.parish ?? "";
          setDelivery(d => ({
            ...d,
            city: d.city || city,
            county: d.county || county,
          }));
        }
      })
      .catch(() => {});
  };

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

          {/* Postcode lookup */}
          <div style={{ marginBottom: 12, position: "relative" }}>
            <label style={label}>Postcode Lookup</label>
            <input
              value={postcodeLookup}
              onChange={e => onPostcodeLookupChange(e.target.value)}
              onBlur={() => setTimeout(() => setPostcodeDropOpen(false), 200)}
              placeholder="Start typing your postcode e.g. SW1A…"
              style={input}
            />
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 4 }}>
              {postcodeLoading ? "Searching…" : "Type your postcode then select it to see your address options"}
            </p>
            {postcodeDropOpen && postcodeResults.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                background: "#fff", border: "1px solid #d1d5db", borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginTop: 2,
              }}>
                {postcodeResults.map(pc => (
                  <button
                    key={pc} type="button"
                    onMouseDown={() => selectPostcode(pc)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "10px 12px", fontSize: "14px", color: "#111827",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    {pc}
                  </button>
                ))}
              </div>
            )}
          </div>

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
                onBlur={e => { e.currentTarget.style.borderColor = errors.postcode ? "#ef4444" : "#d1d5db"; }} />
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
                      {/* Bank tiles */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                        {[
                          { name: "HSBC", bg: "#E8192C", color: "#fff" },
                          { name: "Barclays", bg: "#00AEEF", color: "#fff" },
                          { name: "Lloyds", bg: "#006A4D", color: "#fff" },
                          { name: "Monzo", bg: "#FF4D42", color: "#fff" },
                          { name: "NatWest", bg: "#5A1E82", color: "#fff" },
                        ].map(b => (
                          <div key={b.name} style={{
                            width: 44, height: 30, borderRadius: 5,
                            background: b.bg, color: b.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "8px", fontWeight: 800, letterSpacing: "0.03em",
                            flexShrink: 0, textAlign: "center", padding: "0 3px",
                          }}>{b.name}</div>
                        ))}
                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>+more</span>
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

            {/* ── Bank Transfer ── */}
            {(() => {
              const active = paymentMethod === "bank_transfer";
              return (
                <div
                  onClick={() => setPaymentMethod("bank_transfer")}
                  style={{ border: `${active ? "2px" : "1px"} solid ${active ? "#374151" : "#d1d5db"}`, borderRadius: 6, cursor: "pointer", background: "#fff" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <input type="radio" checked={active} onChange={() => setPaymentMethod("bank_transfer")}
                      style={{ accentColor: "#111827", width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Bank Transfer</span>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>Pay via direct bank transfer — we'll send details with your order</p>
                    </div>
                  </div>
                  {active && (
                    <div style={{ borderTop: "1px solid #e5e7eb", padding: "14px 16px", background: "#f9fafb" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: "13px" }}>
                        {[
                          ["Account Name", BANK_DETAILS.accountName],
                          ["Bank", BANK_DETAILS.bank],
                          ["Sort Code", BANK_DETAILS.sortCode],
                          ["Account No.", BANK_DETAILS.accountNumber],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p style={{ color: "#6b7280", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{k}</p>
                            <p style={{ color: "#111827", fontWeight: 700 }}>{v}</p>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 10 }}>
                        Use your order number as the payment reference. Orders are dispatched once payment clears.
                      </p>
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

          {/* YOU MIGHT ALSO LIKE */}
          <div style={{ marginTop: 20, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px 8px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#111827", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                You Might Also Like
              </p>
              {[
                { name: "Bacteriostatic Water 10ml", sub: "From £4.50", href: "/products/bacteriostatic-water", action: "OPTIONS" },
                { name: "Insulin Syringe Pack (100)", sub: "£12.99", href: "/products/insulin-syringes", action: "ADD" },
              ].map(item => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: "#f3f4f6", border: "1px solid #e5e7eb", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>{item.sub}</p>
                  </div>
                  <Link href={item.href}
                    style={{
                      padding: "6px 14px", borderRadius: 4,
                      border: "1px solid #d1d5db", background: "#fff",
                      fontSize: "12px", fontWeight: 700, color: "#374151",
                      textDecoration: "none", letterSpacing: "0.04em",
                      flexShrink: 0,
                    }}>{item.action}</Link>
                </div>
              ))}
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
