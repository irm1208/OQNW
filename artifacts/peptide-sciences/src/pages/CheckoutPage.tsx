import { useState, useEffect, useRef } from "react";
import { trackInitiateCheckout } from "@/lib/pixels";
import { Link, useLocation } from "wouter";
import {
  ChevronRight, ChevronDown, Lock, Truck, Zap, Package,
  CreditCard, User, MapPin, Phone, Mail,
  CheckCircle2, ShieldCheck, FlaskConical, Tag, X, Award, Gift, Check,
} from "lucide-react";
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
    days: "3–5 working days",
    price: 9.95,
    freeOver: 100,
    icon: <Package size={18} />,
    description: "Discreet packaging included",
  },
  {
    id: "express",
    label: "Express",
    days: "1–2 working days",
    price: 24.95,
    freeOver: null,
    icon: <Truck size={18} />,
    description: "Priority tracked delivery",
  },
  {
    id: "nextday",
    label: "Next Day",
    days: "Next working day",
    price: 39.95,
    freeOver: null,
    icon: <Zap size={18} />,
    description: "Order before 2pm for same-day dispatch",
  },
];

// ── Payment method configuration ──────────────────────────────────────────────
// Update these with your real bank details before going live
const BANK_DETAILS = {
  accountName: "OmniQure Research Ltd",
  sortCode: "20-00-00",
  accountNumber: "12345678",
  bank: "Barclays Bank",
};
const BITCOIN_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
// ──────────────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

type DeliveryForm = {
  email: string; firstName: string; lastName: string; phone: string;
  address1: string; address2: string; city: string; county: string;
  postcode: string; country: string;
};

type PaymentForm = {
  cardNumber: string; nameOnCard: string; expiry: string; cvv: string;
  sameAsDelivery: boolean;
};

type AppliedDiscount = {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
};

const emptyDelivery: DeliveryForm = {
  email: "", firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", county: "",
  postcode: "", country: "",
};

const emptyPayment: PaymentForm = {
  cardNumber: "", nameOnCard: "", expiry: "", cvv: "", sameAsDelivery: true,
};

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "14px",
    borderRadius: "10px",
    border: `1.5px solid ${hasError ? "#FCA5A5" : "#E2E8F0"}`,
    fontSize: "14px", color: "#0F172A", outline: "none",
    backgroundColor: hasError ? "#FFF5F5" : "#F8FAFC",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "'Arimo', Arial, sans-serif",
  };
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
      color: "#94A3B8", pointerEvents: "none", display: "flex", alignItems: "center",
    }}>
      {children}
    </span>
  );
}

function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { items, clearCart, bundleDiscountAmount } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { customer } = useCustomerAuth();
  const [step, setStep] = useState<Step>(1);
  const checkoutFired = useRef(false);
  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState<PaymentForm>(emptyPayment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<{ productName: string; available: number; requested: number }[]>([]);

  // Discount code state
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  // Gift card
  const [giftCardInput, setGiftCardInput] = useState("");
  const [appliedGiftCard, setAppliedGiftCard] = useState<{ code: string; remainingGbp: number } | null>(null);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [applyingGiftCard, setApplyingGiftCard] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer" | "bitcoin">("bank_transfer");

  // Loyalty points
  const [loyaltyBalance, setLoyaltyBalance] = useState<{ balance: number; gbpValue: number } | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);

  // Free peptide credits
  const [freePeptideCredits, setFreePeptideCredits] = useState(0);
  const [redeemFreePeptide, setRedeemFreePeptide] = useState(false);

  // Mobile order summary toggle (collapsed by default)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Pre-fill delivery form for logged-in customers
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

  // Fetch loyalty balance for logged-in customers
  useEffect(() => {
    if (!customer) { setLoyaltyBalance(null); setLoyaltyPointsToRedeem(0); setFreePeptideCredits(0); setRedeemFreePeptide(false); return; }
    fetch(apiUrl("loyalty/balance"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ balance: number; gbpValue: number }> : null)
      .then(data => { if (data) setLoyaltyBalance(data); })
      .catch(() => {});
    fetch(apiUrl("account/referral"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ freePeptideCredits: number }> : null)
      .then(data => { if (data) setFreePeptideCredits(data.freePeptideCredits); })
      .catch(() => {});
  }, [customer]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  useEffect(() => {
    if (!checkoutFired.current && items.length > 0) {
      checkoutFired.current = true;
      const value = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
      const numItems = items.reduce((sum, i) => sum + i.quantity, 0);
      trackInitiateCheckout(value, numItems);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div style={{ fontFamily: "'Arimo', Arial, sans-serif", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F5F8FC" }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>Your cart is empty</p>
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
  const preGiftTotal = Math.max(0, cartGBP + shippingCost - bundleDiscountAmount - discountAmount - loyaltyDiscountGbp - freePeptideDeductGbp);
  const giftCardDeductGbp = appliedGiftCard ? Math.min(appliedGiftCard.remainingGbp, preGiftTotal) : 0;
  const totalGBP = Math.max(0, preGiftTotal - giftCardDeductGbp);

  const setD = (f: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDelivery(d => ({ ...d, [f]: e.target.value }));
  const setP = (f: keyof PaymentForm) => (v: string | boolean) =>
    setPayment(p => ({ ...p, [f]: v }));

  function validateDelivery() {
    const e: Record<string, string> = {};
    if (!delivery.email.includes("@")) e.email = "Valid email required";
    if (!delivery.firstName.trim()) e.firstName = "Required";
    if (!delivery.lastName.trim()) e.lastName = "Required";
    if (!delivery.address1.trim()) e.address1 = "Required";
    if (!delivery.city.trim()) e.city = "Required";
    if (!delivery.postcode.trim()) e.postcode = "Required";
    return e;
  }

  function validatePayment() {
    if (paymentMethod !== "card") return {};
    const e: Record<string, string> = {};
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (digits.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
    if (!payment.nameOnCard.trim()) e.nameOnCard = "Required";
    const parts = payment.expiry.split("/");
    if (payment.expiry.length < 5 || !parts[0] || !parts[1] || parseInt(parts[0]) > 12) e.expiry = "Use MM/YY format";
    if (payment.cvv.length < 3) e.cvv = "3 or 4 digits required";
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
        setAppliedDiscount({
          code: data.code,
          type: data.type!,
          value: data.value!,
          discountAmount: data.discountAmount,
        });
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

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountError(null);
    setDiscountInput("");
  }

  async function applyGiftCard() {
    if (!giftCardInput.trim()) return;
    setApplyingGiftCard(true);
    setGiftCardError(null);
    try {
      const res = await fetch(apiUrl(`gift-cards/validate/${encodeURIComponent(giftCardInput.trim().toUpperCase())}`), {
        credentials: "include",
      });
      const data = await res.json() as { valid: boolean; error?: string; remainingGbp?: number };
      if (data.valid && data.remainingGbp !== undefined) {
        setAppliedGiftCard({ code: giftCardInput.trim().toUpperCase(), remainingGbp: data.remainingGbp });
        setGiftCardInput("");
        setGiftCardError(null);
      } else {
        setGiftCardError(data.error ?? "Invalid gift card code");
        setAppliedGiftCard(null);
      }
    } catch {
      setGiftCardError("Could not verify gift card. Please try again.");
    } finally {
      setApplyingGiftCard(false);
    }
  }

  function removeGiftCard() {
    setAppliedGiftCard(null);
    setGiftCardError(null);
    setGiftCardInput("");
  }

  async function handleNext() {
    if (step === 1) {
      const e = validateDelivery();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      setErrors({});
      setStep(3);
    } else {
      const e = validatePayment();
      if (Object.keys(e).length) { setErrors(e); return; }
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
              productName: product.name,
              productCategory: product.category ?? "",
              quantity,
              priceGbp: product.price ?? 0,
            })),
            discountCode: appliedDiscount?.code ?? null,
            giftCardCode: appliedGiftCard?.code ?? null,
            loyaltyPointsRedeemed: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
            redeemFreePeptide: redeemFreePeptide && freePeptideCredits > 0 ? true : undefined,
            paymentMethod,
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
          orderNumber: string;
          customerName: string;
          totalGbp: number;
          shippingMethod: string;
          btcAddress?: string;
          btcAmount?: string;
          btcPaymentUrl?: string;
        };
        clearCart();
        const params = new URLSearchParams({
          order: data.orderNumber,
          name: delivery.firstName,
          total: data.totalGbp.toFixed(2),
          ship: data.shippingMethod,
          payment: paymentMethod,
        });
        if (data.btcAddress)    params.set("btcAddress", data.btcAddress);
        if (data.btcAmount)     params.set("btcAmount", data.btcAmount);
        if (data.btcPaymentUrl) params.set("btcUrl", data.btcPaymentUrl);
        navigate(`/order-confirmation?${params.toString()}`);
      } catch (err) {
        setPlaceError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setPlacing(false);
      }
    }
  }

  const STEPS = ["Delivery", "Shipping", "Payment"];

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "#1B5CB5");
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, key: string) =>
    (e.currentTarget.style.borderColor = errors[key] ? "#FCA5A5" : "#E2E8F0");

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "70vh" }}>

      {/* Progress header */}
      <div style={{ background: "linear-gradient(90deg, #0D2565, #1B5CB5)", padding: "20px 0" }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Lock size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              Secure Checkout — SSL Encrypted
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {STEPS.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: done ? "#34D399" : active ? "#fff" : "rgba(255,255,255,0.2)",
                      color: done ? "#fff" : active ? "#1240A0" : "rgba(255,255,255,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 800, flexShrink: 0,
                      transition: "all 0.2s",
                    }}>
                      {done ? <CheckCircle2 size={16} /> : num}
                    </div>
                    <span className="checkout-step-label" style={{
                      fontSize: "13px", fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: "2px", backgroundColor: done ? "#34D399" : "rgba(255,255,255,0.15)", margin: "0 8px", borderRadius: "1px" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-7" style={{ alignItems: "flex-start" }}>

          {/* ── FORM AREA ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* STEP 1 — Delivery */}
            {step === 1 && (
              <div className="form-card-mobile" style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Delivery Details</h2>
                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>Where should we ship your order?</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Email */}
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Email address *</label>
                    <div style={{ position: "relative" }}>
                      <Icon><Mail size={14} /></Icon>
                      <input value={delivery.email} onChange={setD("email")} type="email" placeholder="researcher@institution.ac.uk"
                        style={fieldStyle(!!errors.email)} onFocus={inputFocus} onBlur={e => inputBlur(e, "email")} />
                    </div>
                    {errors.email && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.email}</p>}
                  </div>

                  {/* Name row */}
                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>First name *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><User size={14} /></Icon>
                        <input value={delivery.firstName} onChange={setD("firstName")} placeholder="Jane"
                          style={fieldStyle(!!errors.firstName)} onFocus={inputFocus} onBlur={e => inputBlur(e, "firstName")} />
                      </div>
                      {errors.firstName && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Last name *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><User size={14} /></Icon>
                        <input value={delivery.lastName} onChange={setD("lastName")} placeholder="Smith"
                          style={fieldStyle(!!errors.lastName)} onFocus={inputFocus} onBlur={e => inputBlur(e, "lastName")} />
                      </div>
                      {errors.lastName && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Phone number</label>
                    <div style={{ position: "relative" }}>
                      <Icon><Phone size={14} /></Icon>
                      <input value={delivery.phone} onChange={setD("phone")} type="tel" placeholder="+44 7911 123456"
                        style={fieldStyle(false)} onFocus={inputFocus} onBlur={e => inputBlur(e, "phone")} />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Address line 1 *</label>
                    <div style={{ position: "relative" }}>
                      <Icon><MapPin size={14} /></Icon>
                      <input value={delivery.address1} onChange={setD("address1")} placeholder="123 Research Park Lane"
                        style={fieldStyle(!!errors.address1)} onFocus={inputFocus} onBlur={e => inputBlur(e, "address1")} />
                    </div>
                    {errors.address1 && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.address1}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Address line 2 <span style={{ color: "#94A3B8", fontWeight: 400 }}>(optional)</span></label>
                    <div style={{ position: "relative" }}>
                      <Icon><MapPin size={14} /></Icon>
                      <input value={delivery.address2} onChange={setD("address2")} placeholder="Lab Building, Suite 4"
                        style={fieldStyle(false)} onFocus={inputFocus} onBlur={e => inputBlur(e, "address2")} />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Town / City *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><MapPin size={14} /></Icon>
                        <input value={delivery.city} onChange={setD("city")} placeholder="London"
                          style={fieldStyle(!!errors.city)} onFocus={inputFocus} onBlur={e => inputBlur(e, "city")} />
                      </div>
                      {errors.city && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.city}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>County / State</label>
                      <div style={{ position: "relative" }}>
                        <Icon><MapPin size={14} /></Icon>
                        <input value={delivery.county} onChange={setD("county")} placeholder="Greater London"
                          style={fieldStyle(false)} onFocus={inputFocus} onBlur={e => inputBlur(e, "county")} />
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Postcode / ZIP *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><MapPin size={14} /></Icon>
                        <input value={delivery.postcode} onChange={setD("postcode")} placeholder="EC1A 1BB"
                          style={fieldStyle(!!errors.postcode)} onFocus={inputFocus} onBlur={e => inputBlur(e, "postcode")} />
                      </div>
                      {errors.postcode && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.postcode}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Country *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><MapPin size={14} /></Icon>
                        <select value={delivery.country} onChange={setD("country")}
                          style={{ ...fieldStyle(false), paddingLeft: "38px", appearance: "none", cursor: "pointer" }}
                          onFocus={inputFocus} onBlur={e => inputBlur(e, "country")}
                        >
                          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Shipping */}
            {step === 2 && (
              <div className="form-card-mobile" style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Shipping Method</h2>
                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>
                  All orders include discreet, secure packaging at no extra cost.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {SHIPPING_OPTIONS.map(opt => {
                    const active = shipping === opt.id;
                    const cost = opt.freeOver && cartGBP >= opt.freeOver ? 0 : opt.price;
                    const isFree = opt.freeOver && cartGBP >= opt.freeOver;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setShipping(opt.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "16px",
                          padding: "16px 18px", borderRadius: "14px",
                          border: `2px solid ${active ? "#1B5CB5" : "#E2E8F0"}`,
                          backgroundColor: active ? "#EEF4FF" : "#F8FAFC",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        <div style={{
                          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${active ? "#1B5CB5" : "#CBD5E1"}`,
                          backgroundColor: active ? "#1B5CB5" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {active && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />}
                        </div>
                        <div style={{ color: active ? "#1B5CB5" : "#64748B", flexShrink: 0 }}>{opt.icon}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: active ? "#1240A0" : "#0F172A" }}>{opt.label}</p>
                          <p style={{ fontSize: "12px", color: "#64748B" }}>{opt.days} · {opt.description}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {isFree
                            ? <span style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>FREE</span>
                            : <span style={{ fontSize: "14px", fontWeight: 700, color: active ? "#1240A0" : "#0F172A" }}>{currency.symbol}{cost.toFixed(2)}</span>
                          }
                          {opt.freeOver && !isFree && (
                            <p style={{ fontSize: "10.5px", color: "#94A3B8" }}>Free over {currency.symbol}{opt.freeOver}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery notice */}
                <div style={{ marginTop: "20px", padding: "14px", borderRadius: "12px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <FlaskConical size={14} style={{ color: "#16A34A", flexShrink: 0, marginTop: "1px" }} />
                  <p style={{ fontSize: "12px", color: "#166534", lineHeight: 1.6, margin: 0 }}>
                    All peptides are shipped in <strong>insulated, discreet packaging</strong> to maintain stability during transit. UK orders dispatched within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === 3 && (
              <div className="form-card-mobile" style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Payment</h2>
                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>Choose how you'd like to pay.</p>

                {/* Payment method selector */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {([
                    { id: "card" as const,          label: "Card Payment By Email Link", sub: "We'll email you a secure payment link after placing your order", icon: "💳" },
                    { id: "bank_transfer" as const, label: "Pay By Bank",                sub: "BACS / Faster Payments — no fees, dispatched on clearance",        icon: "🏦" },
                    { id: "bitcoin" as const,       label: "Cryptocurrency Payment",     sub: "Pay with Bitcoin — confirmed within ~1 hour",                      icon: "₿"  },
                  ]).map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                        border: `2px solid ${paymentMethod === opt.id ? "#1240A0" : "#E2E8F0"}`,
                        backgroundColor: paymentMethod === opt.id ? "#EEF4FF" : "#F8FAFC",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${paymentMethod === opt.id ? "#1240A0" : "#CBD5E1"}`,
                        backgroundColor: paymentMethod === opt.id ? "#1240A0" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {paymentMethod === opt.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: "22px", flexShrink: 0, lineHeight: 1 }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: paymentMethod === opt.id ? "#1240A0" : "#0F172A" }}>{opt.label}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>{opt.sub}</p>
                      </div>
                      {paymentMethod === opt.id && <Check size={16} color="#1240A0" />}
                    </div>
                  ))}
                </div>

                {/* Bank Transfer details */}
                {paymentMethod === "bank_transfer" && (
                  <div style={{ borderRadius: "14px", border: "1.5px solid #BFDBFE", backgroundColor: "#EFF6FF", padding: "20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#1E40AF", marginBottom: "14px" }}>
                      Place your order, then send payment to the account below. We'll dispatch once it clears — usually same day for Faster Payments.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { label: "Account Name",   value: BANK_DETAILS.accountName },
                        { label: "Sort Code",       value: BANK_DETAILS.sortCode },
                        { label: "Account Number",  value: BANK_DETAILS.accountNumber },
                        { label: "Bank",            value: BANK_DETAILS.bank },
                        { label: "Reference",       value: "Use your order number (shown after placing)" },
                      ].map(row => (
                        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #DBEAFE" }}>
                          <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{row.label}</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#1240A0" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#475569", marginTop: "12px", lineHeight: 1.6, marginBottom: 0 }}>
                      Faster Payments clears same day. CHAPS next working day. Orders paid after 3pm are dispatched the following morning.
                    </p>
                  </div>
                )}

                {/* Card Payment By Email Link */}
                {paymentMethod === "card" && (
                  <div style={{ borderRadius: "14px", border: "1.5px solid #DBEAFE", backgroundColor: "#F0F7FF", padding: "20px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={20} color="#fff" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#1240A0" }}>Secure payment link by email</p>
                        <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "#475569", lineHeight: 1.5 }}>
                          Place your order and we'll send a secure hosted payment page to your email address. No card details are entered on this site.
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { step: "1", text: "Place your order below" },
                        { step: "2", text: "Check your inbox — a payment link arrives within minutes" },
                        { step: "3", text: "Click the link to pay securely via Visa or Mastercard" },
                        { step: "4", text: "Your order is confirmed and dispatched once payment clears" },
                      ].map(item => (
                        <div key={item.step} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, backgroundColor: "#1240A0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800 }}>
                            {item.step}
                          </div>
                          <p style={{ margin: 0, fontSize: "13px", color: "#374151" }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #DBEAFE", display: "flex", gap: "8px", alignItems: "center" }}>
                      <ShieldCheck size={14} color="#1B5CB5" style={{ flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: "11.5px", color: "#1E40AF" }}>
                        The payment link expires in 24 hours. OmniQure never stores card data.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bitcoin */}
                {paymentMethod === "bitcoin" && (
                  <div style={{ borderRadius: "14px", border: "1.5px solid #FDE68A", backgroundColor: "#FFFBEB", padding: "20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#92400E", marginBottom: "14px" }}>
                      Place your order then send the BTC equivalent of your order total to the address below. We'll process once the transaction has 1 confirmation.
                    </p>
                    <div style={{ padding: "14px 16px", borderRadius: "10px", backgroundColor: "#fff", border: "1.5px solid #FDE68A", marginBottom: "12px" }}>
                      <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Bitcoin Address</p>
                      <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A", wordBreak: "break-all", fontFamily: "monospace", letterSpacing: "0.02em", margin: 0 }}>{BITCOIN_ADDRESS}</p>
                    </div>
                    <div style={{ fontSize: "12px", color: "#92400E", lineHeight: 1.8 }}>
                      ₿ Convert your order total to BTC at the current rate before sending.<br />
                      ₿ Transactions typically confirm within 1 hour on the Bitcoin network.<br />
                      ₿ Include your order number in the memo/note field where your wallet allows.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review summary (step 2 & 3) */}
            {step >= 2 && (
              <div style={{ marginTop: "16px", backgroundColor: "#fff", borderRadius: "16px", border: "1.5px solid #E8EDF5", padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Delivering to</p>
                  <button onClick={() => setStep(1)} style={{ fontSize: "12px", color: "#1B5CB5", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                </div>
                <p style={{ fontSize: "13.5px", color: "#0F172A", fontWeight: 600 }}>{delivery.firstName} {delivery.lastName}</p>
                <p style={{ fontSize: "13px", color: "#64748B" }}>{delivery.address1}{delivery.address2 ? `, ${delivery.address2}` : ""}</p>
                <p style={{ fontSize: "13px", color: "#64748B" }}>{delivery.city}{delivery.postcode ? ` ${delivery.postcode}` : ""}, {delivery.country}</p>
              </div>
            )}

            {step === 3 && (
              <div style={{ marginTop: "12px", backgroundColor: "#fff", borderRadius: "16px", border: "1.5px solid #E8EDF5", padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Shipping method</p>
                  <button onClick={() => setStep(2)} style={{ fontSize: "12px", color: "#1B5CB5", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                </div>
                <p style={{ fontSize: "13.5px", color: "#0F172A", fontWeight: 600 }}>{selectedShipping.label} — {selectedShipping.days}</p>
                <p style={{ fontSize: "13px", color: "#64748B" }}>
                  {shippingCost === 0 ? "Free" : `${currency.symbol}${shippingCost.toFixed(2)}`}
                </p>
              </div>
            )}

            {/* Place order error */}
            {placeError && (
              <div style={{ marginTop: "12px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "#FFF5F5", border: "1.5px solid #FCA5A5" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: stockErrors.length > 0 ? "10px" : 0 }}>
                  <X size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
                  <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{placeError}</p>
                </div>
                {stockErrors.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: "28px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {stockErrors.map((se) => (
                      <li key={se.productName} style={{ fontSize: "12px", color: "#B91C1C" }}>
                        <strong>{se.productName}</strong>
                        {se.available === 0
                          ? " — Out of stock"
                          : ` — Only ${se.available} available (you requested ${se.requested})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  style={{ height: "48px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "12px", border: "1.5px solid #E2E8F0", backgroundColor: "#fff", color: "#475569", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={placing}
                style={{
                  flex: 1, height: "48px", borderRadius: "12px", border: "none",
                  background: placing ? "#93C5FD" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  cursor: placing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (!placing) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { if (!placing) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {placing ? (
                  "Processing order…"
                ) : step === 3 ? (
                  paymentMethod === "card"
                    ? <><Mail size={15} /> Place Order — Send My Payment Link</>
                    : paymentMethod === "bank_transfer"
                    ? <><Lock size={15} /> Place Order — Pay by Bank Transfer</>
                    : <><Lock size={15} /> Place Order — Pay with Bitcoin</>
                ) : (
                  <>Continue <ChevronRight size={16} /></>
                )}
              </button>
            </div>

            <p style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center", marginTop: "12px" }}>
              By placing your order you confirm you are 18+ and a qualified researcher. Products are for Research Use Only.
            </p>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="checkout-summary-mobile-first w-full lg:w-[320px] lg:flex-shrink-0 lg:sticky" style={{ top: "24px" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", overflow: "hidden" }}>

              {/* Mobile toggle header */}
              <button
                className="lg:hidden w-full"
                onClick={() => setMobileSummaryOpen(o => !o)}
                aria-expanded={mobileSummaryOpen}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "linear-gradient(90deg, #1240A0, #1B5CB5)",
                  padding: "14px 18px", border: "none", cursor: "pointer", width: "100%",
                  borderRadius: 0,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>
                    {mobileSummaryOpen ? "Hide order summary" : "Show order summary"}
                  </p>
                  <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)", marginTop: "1px", margin: 0 }}>
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>{formatPrice(totalGBP)}</span>
                  <ChevronDown
                    size={16}
                    style={{ color: "rgba(255,255,255,0.8)", transition: "transform 0.2s", transform: mobileSummaryOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>
              </button>

              {/* Desktop header (always visible) */}
              <div className="hidden lg:block" style={{ background: "linear-gradient(90deg, #1240A0, #1B5CB5)", padding: "14px 18px", color: "#fff" }}>
                <p style={{ fontSize: "14px", fontWeight: 700 }}>Order Summary</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)", marginTop: "1px" }}>{items.reduce((s, i) => s + i.quantity, 0)} items</p>
              </div>

              {/* Body — hidden on mobile when collapsed */}
              <div className={mobileSummaryOpen ? undefined : "max-lg:hidden"}>

              <div style={{ padding: "14px 18px", maxHeight: "260px", overflowY: "auto" }}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} style={{ display: "flex", gap: "10px", alignItems: "center", paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #F1F5F9" }}>
                    <img src={product.image} alt={product.name} style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", border: "1px solid #E8EDF5", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                      <p style={{ fontSize: "11px", color: "#94A3B8" }}>Qty: {quantity}</p>
                    </div>
                    <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A", flexShrink: 0 }}>
                      {product.price != null ? formatPrice(product.price * quantity) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0 18px 18px" }}>

                {/* Discount code input */}
                {!appliedDiscount ? (
                  <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                      <Tag size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                      Discount code
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        value={discountInput}
                        onChange={e => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(null); }}
                        onKeyDown={e => e.key === "Enter" && applyDiscount()}
                        placeholder="PROMO CODE"
                        style={{
                          flex: 1, height: "36px", padding: "0 10px",
                          borderRadius: "8px", border: `1.5px solid ${discountError ? "#FCA5A5" : "#E2E8F0"}`,
                          fontSize: "12.5px", color: "#0F172A", outline: "none",
                          backgroundColor: discountError ? "#FFF5F5" : "#F8FAFC",
                          fontFamily: "'Arimo', Arial, sans-serif",
                          letterSpacing: "0.05em",
                        }}
                      />
                      <button
                        onClick={applyDiscount}
                        disabled={applyingDiscount || !discountInput.trim()}
                        style={{
                          height: "36px", paddingLeft: "12px", paddingRight: "12px",
                          borderRadius: "8px", border: "none",
                          backgroundColor: applyingDiscount || !discountInput.trim() ? "#E2E8F0" : "#1B5CB5",
                          color: applyingDiscount || !discountInput.trim() ? "#94A3B8" : "#fff",
                          fontSize: "12.5px", fontWeight: 700, cursor: applyingDiscount || !discountInput.trim() ? "not-allowed" : "pointer",
                          flexShrink: 0, transition: "background 0.15s",
                        }}
                      >
                        {applyingDiscount ? "…" : "Apply"}
                      </button>
                    </div>
                    {discountError && (
                      <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{discountError}</p>
                    )}
                  </div>
                ) : (
                  <div style={{
                    marginBottom: "12px", padding: "10px 12px",
                    borderRadius: "10px", backgroundColor: "#F0FDF4",
                    border: "1.5px solid #BBF7D0",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderTop: "1px solid #F1F5F9",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Tag size={13} style={{ color: "#059669" }} />
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#059669", margin: 0 }}>{appliedDiscount.code}</p>
                        <p style={{ fontSize: "11px", color: "#166534", margin: 0 }}>
                          {appliedDiscount.type === "percentage"
                            ? `${appliedDiscount.value}% off`
                            : `£${appliedDiscount.value.toFixed(2)} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeDiscount}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#059669", padding: "2px", display: "flex", alignItems: "center" }}
                      title="Remove discount"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                {/* Gift card redemption */}
                {!appliedGiftCard ? (
                  <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                      <Gift size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                      Gift card
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        value={giftCardInput}
                        onChange={e => { setGiftCardInput(e.target.value.toUpperCase()); setGiftCardError(null); }}
                        onKeyDown={e => e.key === "Enter" && applyGiftCard()}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        style={{
                          flex: 1, height: "36px", padding: "0 10px",
                          borderRadius: "8px", border: `1.5px solid ${giftCardError ? "#FCA5A5" : "#E2E8F0"}`,
                          fontSize: "12px", color: "#0F172A", outline: "none",
                          backgroundColor: giftCardError ? "#FFF5F5" : "#F8FAFC",
                          fontFamily: "'Arimo', Arial, sans-serif",
                          letterSpacing: "0.08em",
                        }}
                      />
                      <button
                        onClick={applyGiftCard}
                        disabled={applyingGiftCard || !giftCardInput.trim()}
                        style={{
                          height: "36px", paddingLeft: "12px", paddingRight: "12px",
                          borderRadius: "8px", border: "none",
                          backgroundColor: applyingGiftCard || !giftCardInput.trim() ? "#E2E8F0" : "#7C3AED",
                          color: applyingGiftCard || !giftCardInput.trim() ? "#94A3B8" : "#fff",
                          fontSize: "12.5px", fontWeight: 700, cursor: applyingGiftCard || !giftCardInput.trim() ? "not-allowed" : "pointer",
                          flexShrink: 0, transition: "background 0.15s",
                        }}
                      >
                        {applyingGiftCard ? "…" : "Apply"}
                      </button>
                    </div>
                    {giftCardError && (
                      <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{giftCardError}</p>
                    )}
                  </div>
                ) : (
                  <div style={{
                    marginBottom: "12px", padding: "10px 12px",
                    borderRadius: "10px", backgroundColor: "#FAF5FF",
                    border: "1.5px solid #DDD6FE",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderTop: "1px solid #F1F5F9",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Gift size={13} style={{ color: "#7C3AED" }} />
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#7C3AED", margin: 0 }}>{appliedGiftCard.code}</p>
                        <p style={{ fontSize: "11px", color: "#6D28D9", margin: 0 }}>
                          £{appliedGiftCard.remainingGbp.toFixed(2)} balance · −{formatPrice(giftCardDeductGbp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeGiftCard}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#7C3AED", padding: "2px", display: "flex", alignItems: "center" }}
                      title="Remove gift card"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                {/* Free peptide credit redemption */}
                {customer && freePeptideCredits > 0 && (
                  <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    {!redeemFreePeptide ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "13px" }}>🎁</span>
                            Free Peptide Credit
                          </label>
                          <span style={{ fontSize: "11px", color: "#64748B" }}>{freePeptideCredits} available</span>
                        </div>
                        <button
                          onClick={() => setRedeemFreePeptide(true)}
                          style={{
                            width: "100%", height: "36px", borderRadius: "8px",
                            border: "1.5px dashed #15803D", backgroundColor: "#F0FDF4",
                            color: "#166534", fontSize: "12.5px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          }}
                        >
                          🎁 Redeem 1 free peptide (−{formatPrice(cheapestItemPrice)})
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        padding: "10px 12px", borderRadius: "10px",
                        backgroundColor: "#F0FDF4", border: "1.5px solid #86EFAC",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "15px" }}>🎁</span>
                          <div>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#15803D", margin: 0 }}>Free peptide applied</p>
                            <p style={{ fontSize: "11px", color: "#166534", margin: 0 }}>−{formatPrice(cheapestItemPrice)} off (cheapest item)</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setRedeemFreePeptide(false)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#15803D", padding: "2px", display: "flex", alignItems: "center" }}
                          title="Remove free peptide credit"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Loyalty points redemption */}
                {customer && loyaltyBalance && loyaltyBalance.balance >= 100 && (
                  <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                    {loyaltyPointsToRedeem === 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Award size={11} style={{ color: "#F59E0B" }} />
                            Loyalty Points
                          </label>
                          <span style={{ fontSize: "11px", color: "#64748B" }}>{loyaltyBalance.balance} pts available</span>
                        </div>
                        <button
                          onClick={() => setLoyaltyPointsToRedeem(loyaltyBalance.balance)}
                          style={{
                            width: "100%", height: "36px", borderRadius: "8px",
                            border: "1.5px dashed #F59E0B", backgroundColor: "#FFFBEB",
                            color: "#92400E", fontSize: "12.5px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                          }}
                        >
                          <Award size={12} />
                          Apply {loyaltyBalance.balance} pts (−£{loyaltyBalance.gbpValue.toFixed(2)})
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        padding: "10px 12px", borderRadius: "10px",
                        backgroundColor: "#FFFBEB", border: "1.5px solid #F59E0B",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Award size={13} style={{ color: "#F59E0B" }} />
                          <div>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", margin: 0 }}>
                              {loyaltyPointsToRedeem} pts applied
                            </p>
                            <p style={{ fontSize: "11px", color: "#78350F", margin: 0 }}>
                              −£{loyaltyDiscountGbp.toFixed(2)} off your order
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setLoyaltyPointsToRedeem(0)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#D97706", padding: "2px", display: "flex", alignItems: "center" }}
                          title="Remove loyalty reward"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{formatPrice(cartGBP)}</span>
                </div>
                {bundleDiscountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "#059669", fontWeight: 600 }}>
                      Bundle & Save ({items.reduce((s, i) => s + i.quantity, 0) >= 15 ? "20%" : items.reduce((s, i) => s + i.quantity, 0) >= 11 ? "15%" : items.reduce((s, i) => s + i.quantity, 0) >= 7 ? "10%" : "5%"} off)
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#059669" }}>−{formatPrice(bundleDiscountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>Shipping</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: shippingCost === 0 ? "#059669" : "#0F172A" }}>
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {appliedDiscount && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "#059669" }}>Discount ({appliedDiscount.code})</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#059669" }}>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {redeemFreePeptide && freePeptideDeductGbp > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "#15803D" }}>🎁 Free peptide credit</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#15803D" }}>−{formatPrice(freePeptideDeductGbp)}</span>
                  </div>
                )}
                {loyaltyPointsToRedeem > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "#D97706" }}>Loyalty reward ({loyaltyPointsToRedeem} pts)</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#D97706" }}>−£{loyaltyDiscountGbp.toFixed(2)}</span>
                  </div>
                )}
                {appliedGiftCard && giftCardDeductGbp > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ fontSize: "13px", color: "#7C3AED" }}>Gift card ({appliedGiftCard.code.slice(0, 9)}…)</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#7C3AED" }}>−{formatPrice(giftCardDeductGbp)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #E8EDF5", marginTop: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>Total</span>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#1240A0" }}>{formatPrice(totalGBP)}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {["256-bit SSL Encrypted", "Discreet Packaging", "99%+ HPLC Verified"].map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={12} style={{ color: "#059669", flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: "#64748B" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>{/* end body wrapper */}
          </div>{/* end card */}

          <Link href="/cart" style={{ display: "block", textAlign: "center", marginTop: "12px", fontSize: "12.5px", color: "#94A3B8", textDecoration: "none" }}>
            ← Return to cart
          </Link>
          </div>{/* end order summary outer */}
        </div>
      </div>
    </div>
  );
}
