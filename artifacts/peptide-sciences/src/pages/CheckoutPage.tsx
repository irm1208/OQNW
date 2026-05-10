import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  ChevronRight, Lock, Truck, Zap, Package,
  CreditCard, User, MapPin, Phone, Mail,
  CheckCircle2, ShieldCheck, FlaskConical
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

const COUNTRIES = [
  // UK & Ireland
  "United Kingdom",
  "Ireland",
  // North America
  "United States",
  "Canada",
  // Oceania
  "Australia",
  "New Zealand",
  // Western Europe
  "Austria",
  "Belgium",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Iceland",
  "Luxembourg",
  "Netherlands",
  "Norway",
  "Portugal",
  "Spain",
  "Sweden",
  "Switzerland",
  // Southern / Eastern Europe
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Estonia",
  "Greece",
  "Hungary",
  "Italy",
  "Latvia",
  "Lithuania",
  "Malta",
  "Poland",
  "Romania",
  "Slovakia",
  "Slovenia",
  // Asia Pacific
  "Hong Kong",
  "Japan",
  "Malaysia",
  "Singapore",
  "South Korea",
  "Taiwan",
  "Thailand",
  // Middle East
  "United Arab Emirates",
];

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard",
    days: "3–5 working days",
    price: 9.95,
    freeOver: 200,
    icon: <Package size={18} />,
    description: "Cold-chain packaging included",
  },
  {
    id: "express",
    label: "Express",
    days: "1–2 working days",
    price: 24.95,
    freeOver: null,
    icon: <Truck size={18} />,
    description: "Priority cold-chain delivery",
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

const emptyDelivery: DeliveryForm = {
  email: "", firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", county: "",
  postcode: "", country: "United Kingdom",
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
  const { items, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [step, setStep] = useState<Step>(1);
  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState<PaymentForm>(emptyPayment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

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
  const totalGBP = cartGBP + shippingCost;

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
    const e: Record<string, string> = {};
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (digits.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
    if (!payment.nameOnCard.trim()) e.nameOnCard = "Required";
    const parts = payment.expiry.split("/");
    if (payment.expiry.length < 5 || !parts[0] || !parts[1] || parseInt(parts[0]) > 12) e.expiry = "Use MM/YY format";
    if (payment.cvv.length < 3) e.cvv = "3 or 4 digits required";
    return e;
  }

  function handleNext() {
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
      setTimeout(() => {
        clearCart();
        navigate(`/order-confirmation?order=OQ-${Math.floor(100000 + Math.random() * 900000)}&name=${encodeURIComponent(delivery.firstName)}&total=${totalGBP.toFixed(2)}&ship=${selectedShipping.label}`);
      }, 1800);
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
                    <span style={{
                      fontSize: "13px", fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: "2px", backgroundColor: done ? "#34D399" : "rgba(255,255,255,0.15)", margin: "0 12px", borderRadius: "1px" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>

          {/* ── FORM AREA ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* STEP 1 — Delivery */}
            {step === 1 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Shipping Method</h2>
                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>
                  All orders include cold-chain packaging at no extra cost.
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
                    All peptides are shipped in <strong>insulated cold-chain packaging</strong> with gel packs to maintain −20°C temperatures during transit. UK orders dispatched within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === 3 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Payment</h2>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["VISA", "MC", "AMEX"].map(b => (
                      <span key={b} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", backgroundColor: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" }}>{b}</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>Your payment information is encrypted and secure.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Card number */}
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Card number *</label>
                    <div style={{ position: "relative" }}>
                      <Icon><CreditCard size={14} /></Icon>
                      <input
                        value={payment.cardNumber}
                        onChange={e => setP("cardNumber")(formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        style={fieldStyle(!!errors.cardNumber)}
                        onFocus={inputFocus} onBlur={e => inputBlur(e, "cardNumber")}
                      />
                    </div>
                    {errors.cardNumber && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.cardNumber}</p>}
                  </div>

                  {/* Name on card */}
                  <div>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Name on card *</label>
                    <div style={{ position: "relative" }}>
                      <Icon><User size={14} /></Icon>
                      <input
                        value={payment.nameOnCard}
                        onChange={e => setP("nameOnCard")(e.target.value)}
                        placeholder="JANE SMITH"
                        style={fieldStyle(!!errors.nameOnCard)}
                        onFocus={inputFocus} onBlur={e => inputBlur(e, "nameOnCard")}
                      />
                    </div>
                    {errors.nameOnCard && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.nameOnCard}</p>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {/* Expiry */}
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Expiry date *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><CreditCard size={14} /></Icon>
                        <input
                          value={payment.expiry}
                          onChange={e => setP("expiry")(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          inputMode="numeric"
                          style={fieldStyle(!!errors.expiry)}
                          onFocus={inputFocus} onBlur={e => inputBlur(e, "expiry")}
                        />
                      </div>
                      {errors.expiry && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.expiry}</p>}
                    </div>

                    {/* CVV */}
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Security code (CVV) *</label>
                      <div style={{ position: "relative" }}>
                        <Icon><Lock size={14} /></Icon>
                        <input
                          value={payment.cvv}
                          onChange={e => setP("cvv")(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="•••"
                          inputMode="numeric"
                          type="password"
                          style={fieldStyle(!!errors.cvv)}
                          onFocus={inputFocus} onBlur={e => inputBlur(e, "cvv")}
                        />
                      </div>
                      {errors.cvv && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "3px" }}>{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Billing same as delivery */}
                  <div
                    onClick={() => setP("sameAsDelivery")(!payment.sameAsDelivery)}
                    style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px", borderRadius: "10px", backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0,
                      border: `2px solid ${payment.sameAsDelivery ? "#1B5CB5" : "#CBD5E1"}`,
                      backgroundColor: payment.sameAsDelivery ? "#1B5CB5" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {payment.sameAsDelivery && <CheckCircle2 size={12} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                      Billing address same as delivery address
                    </span>
                  </div>
                </div>

                {/* Security notice */}
                <div style={{ marginTop: "20px", padding: "14px", borderRadius: "12px", backgroundColor: "#F8FAFF", border: "1px solid #DBEAFE", display: "flex", gap: "10px", alignItems: "center" }}>
                  <ShieldCheck size={16} style={{ color: "#1B5CB5", flexShrink: 0 }} />
                  <p style={{ fontSize: "12px", color: "#1E40AF", lineHeight: 1.5, margin: 0 }}>
                    Your card details are protected by 256-bit SSL encryption. OmniQure never stores card data.
                  </p>
                </div>
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
                  <><Lock size={15} /> Place Order — {formatPrice(totalGBP)}</>
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
          <div style={{ width: "320px", flexShrink: 0, position: "sticky", top: "24px" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1.5px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #1240A0, #1B5CB5)", padding: "14px 18px", color: "#fff" }}>
                <p style={{ fontSize: "14px", fontWeight: 700 }}>Order Summary</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.6)", marginTop: "1px" }}>{items.reduce((s, i) => s + i.quantity, 0)} items</p>
              </div>

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
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{formatPrice(cartGBP)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontSize: "13px", color: "#64748B" }}>Shipping</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: shippingCost === 0 ? "#059669" : "#0F172A" }}>
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #E8EDF5", marginTop: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>Total</span>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#1240A0" }}>{formatPrice(totalGBP)}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {["256-bit SSL Encrypted", "Cold-Chain Guaranteed", "98%+ HPLC Verified"].map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={12} style={{ color: "#059669", flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: "#64748B" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/cart" style={{ display: "block", textAlign: "center", marginTop: "12px", fontSize: "12.5px", color: "#94A3B8", textDecoration: "none" }}>
              ← Return to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
