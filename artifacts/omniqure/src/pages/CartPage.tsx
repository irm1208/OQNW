import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { trackInitiateCheckout } from "@/lib/pixels";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { type Product, isHiddenCategory } from "@/data/products";
import { getPurityStr } from "@/utils/productPurity";
import { useProducts } from "@/context/ProductsContext";
import BacWaterUpsell from "@/components/BacWaterUpsell";
import FreeShippingBar from "@/components/FreeShippingBar";
import {
  Trash2, Plus, Minus, ShoppingCart, ChevronRight, Sparkles, CheckCircle2,
  Lock, Shield, Truck,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

interface RelatedApiItem {
  productId: number;
  productName: string;
  productCategory: string;
  coOccurrences: number;
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
    freeOver: 50,
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
  { id: "BTC",  name: "Bitcoin",    symbol: "₿", color: "#F7931A", network: "Bitcoin",      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { id: "ETH",  name: "Ethereum",   symbol: "Ξ", color: "#627EEA", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDT", name: "USDT",       symbol: "₮", color: "#26A17B", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "USDC", name: "USDC",       symbol: "◎", color: "#2775CA", network: "ERC-20 / ETH", address: "0xYourEthereumAddressHere" },
  { id: "LTC",  name: "Litecoin",   symbol: "Ł", color: "#A6A9AA", network: "Litecoin",     address: "LYourLitecoinAddressHere" },
  { id: "XMR",  name: "Monero",     symbol: "ɱ", color: "#FF6600", network: "Monero",       address: "YourMoneroAddressHere" },
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
  { name: "Lloyds",    color: "#006A4D", viewBox: "", filled: false, path: "", imgSrc: "/banks/lloyds-v3.png" },
  { name: "Monzo",     color: "#14233C", viewBox: "", filled: false, path: "", imgSrc: "/banks/monzo.png" },
  { name: "Santander", color: "#EC0000", viewBox: "", filled: false, path: "", imgSrc: "/banks/santander.png" },
];

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

const THEME = {
  cardBg: "#ffffff" as const,
  cardBorder: "1px solid #E8EDF5" as const,
  inputBg: "#ffffff" as const,
  inputBorder: "#E2E8F0" as const,
  text: "#0F172A" as const,
  textMuted: "#64748B" as const,
  textSub: "#475569" as const,
  divider: "1px solid #F1F5F9" as const,
  cta: "#1B5CB5" as const,
  ctaHover: "#1240A0" as const,
};

const input: React.CSSProperties = {
  width: "100%", height: "44px", padding: "0 12px",
  border: `1px solid ${THEME.inputBorder}`, borderRadius: "4px",
  fontSize: "14px", color: THEME.text, outline: "none",
  fontFamily: "inherit", background: THEME.inputBg,
  boxSizing: "border-box",
};

const inputError: React.CSSProperties = { ...input, borderColor: "#ef4444" };

const label: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: THEME.textMuted, letterSpacing: "0.07em", textTransform: "uppercase",
  marginBottom: "5px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "13px", fontWeight: 800, color: THEME.text,
  letterSpacing: "0.08em", textTransform: "uppercase",
  margin: "0 0 16px",
};

const errText: React.CSSProperties = {
  fontSize: "11px", color: "#DC2626", marginTop: "3px",
};

const divider: React.CSSProperties = {
  border: "none", borderTop: THEME.divider, margin: "24px 0",
};

// ── Cart upsell components ───────────────────────────────────────────────

function CartUpsellCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart, items } = useCart();
  const { formatPrice } = useCurrency();
  const alreadyInCart = items.some((i) => i.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        className="rounded-xl bg-white flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200"
        style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#93B8F0";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(27,92,181,0.09)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EDF5";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(15,23,42,0.04)";
        }}
      >
        <div
          className="rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ width: "48px", height: "48px", background: "linear-gradient(145deg, #F4F8FF 0%, #EBF2FF 100%)", border: "1px solid #E2E8F0" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ fontSize: "12px", color: "#0F172A", lineHeight: 1.3 }}>{product.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span style={{ fontSize: "10px", color: "#059669", fontWeight: 600 }}>{getPurityStr(product.id)}</span>
            {product.price != null && (
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#1240A0" }}>{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        {alreadyInCart ? (
          <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: "#059669" }}>
            <CheckCircle2 size={13} /> In cart
          </span>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 font-semibold rounded-lg flex-shrink-0 transition-all"
            style={{
              backgroundColor: added ? "#059669" : "#1240A0",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: "11px", padding: "5px 10px", height: "28px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5"; }}
            onMouseLeave={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0"; }}
          >
            {added ? <><CheckCircle2 size={11} /> Added</> : <><ShoppingCart size={11} /> Add</>}
          </button>
        )}
      </div>
    </Link>
  );
}

function CartUpsells() {
  const { items } = useCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { products } = useProducts();

  useEffect(() => {
    if (items.length === 0) { setSuggestions([]); return; }

    const cartProductIds = new Set(items.map((i) => i.product.id));

    const fetchRelated = async () => {
      const allRelated: RelatedApiItem[] = [];
      const seen = new Set<number>();
      for (const { product } of items.slice(0, 3)) {
        const productIdInt = parseInt(product.id, 10);
        if (!productIdInt) continue;
        try {
          const res = await fetch(apiUrl(`products/${productIdInt}/related`), { credentials: "include" });
          if (res.ok) {
            const data = await res.json() as RelatedApiItem[];
            for (const item of data) {
              if (!seen.has(item.productId)) {
                seen.add(item.productId);
                allRelated.push(item);
              }
            }
          }
        } catch { /* skip */ }
      }

      const resolved = allRelated
        .sort((a, b) => b.coOccurrences - a.coOccurrences)
        .map((r) => products.find((p) => parseInt(p.id, 10) === r.productId))
        .filter((p): p is Product => !!p && !cartProductIds.has(p.id) && !isHiddenCategory(p.category))
        .slice(0, 4);

      setSuggestions(resolved);
    };

    void fetchRelated();
  }, [items.map((i) => i.product.id).join(","), products]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} style={{ color: "#1B5CB5" }} />
        <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>Frequently bought with your cart</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((p) => (
          <CartUpsellCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function CartPage() {
  useSEO({ title: "Cart & Checkout", description: "Review your research peptide cart and complete checkout in one step. OmniQure Peptide Research Institute.", canonicalPath: "/cart" });
  const [, navigate] = useLocation();
  const {
    items, totalItems, subtotal, peptideQty, bundleFreeBacWater, bundleFreeItemsCount,
    bundleDiscountAmount, freeUnitsByProductId, removeFromCart, updateQuantity, clearCart,
  } = useCart();
  const hasFreebie = bundleFreeBacWater || bundleFreeItemsCount > 0;
  const freebieLabel = bundleFreeItemsCount === 2 ? "2 peptides free" : bundleFreeItemsCount === 1 ? "1 peptide free" : "free BAC water";
  const { formatPrice } = useCurrency();
  const { customer } = useCustomerAuth();

  const checkoutFired = useRef(false);

  // Checkout form state
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
  const [paymentMethod, setPaymentMethod] = useState<"bitcoin" | "wallid">("wallid");
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("BTC");

  // Loyalty
  const [loyaltyBalance, setLoyaltyBalance] = useState<{ balance: number; gbpValue: number } | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [referralCreditGbp, setReferralCreditGbp] = useState(0);
  const [redeemFreePeptide, setRedeemFreePeptide] = useState(false);

  // 15-minute checkout timer — starts once there's something to check out
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  useEffect(() => {
    if (timeLeft <= 0 || items.length === 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, items.length]);
  const timerMins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const timerSecs = String(timeLeft % 60).padStart(2, "0");
  const timerExpired = timeLeft <= 0;
  const timerUrgent = timeLeft <= 120;
  const timerWarning = timeLeft <= 300 && timeLeft > 120;

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
      setReferralCreditGbp(0); setRedeemFreePeptide(false);
      return;
    }
    fetch(apiUrl("loyalty/balance"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ balance: number; gbpValue: number }> : null)
      .then(data => { if (data) setLoyaltyBalance(data); })
      .catch(() => {});
    fetch(apiUrl("account/referral"), { credentials: "include" })
      .then(r => r.ok ? r.json() as Promise<{ referralCreditGbp: number }> : null)
      .then(data => { if (data) setReferralCreditGbp(data.referralCreditGbp); })
      .catch(() => {});
  }, [customer]);

  useEffect(() => {
    if (!checkoutFired.current && items.length > 0) {
      checkoutFired.current = true;
      const value = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
      trackInitiateCheckout(value, items.reduce((s, i) => s + i.quantity, 0));
    }
  }, [items]);

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

  function renderShippingOptions() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
        {SHIPPING_OPTIONS.map(opt => {
          const cost = isUK && opt.freeOver && cartGBP >= opt.freeOver ? 0 : opt.price;
          const isFree = isUK && opt.freeOver && cartGBP >= opt.freeOver;
          const active = shipping === opt.id;
          return (
            <label
              key={opt.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                border: `1px solid ${active ? "#1240A0" : "#E8EDF5"}`,
                borderRadius: 6, cursor: "pointer",
                background: active ? "#EEF4FF" : THEME.cardBg,
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <input type="radio" name="shipping" value={opt.id} checked={active}
                onChange={() => setShipping(opt.id)}
                style={{ marginTop: 2, accentColor: THEME.cta, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: THEME.text }}>{opt.displayLabel}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: THEME.text, flexShrink: 0, marginLeft: 12 }}>
                    {isFree ? <span style={{ color: "#059669" }}>FREE</span> : `£${cost.toFixed(2)}`}
                  </span>
                </div>
                {opt.note && (
                  <p style={{ fontSize: "12px", color: THEME.textMuted, marginTop: 2 }}>{opt.note}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "60vh" }}>
        <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#EEF4FF" }}
          >
            <ShoppingCart size={36} style={{ color: "#1B5CB5" }} />
          </div>
          <h1 className="font-bold mb-3" style={{ fontSize: "24px", color: "#0F172A" }}>
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ fontSize: "14px", color: "#64748B" }}>
            Browse our catalogue of 81 research-grade peptides.
          </p>
          <Link
            href="/all-peptides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B5CB5", color: "#fff", textDecoration: "none" }}
          >
            Browse All Peptides <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const cartGBP = items.reduce((s, { product, quantity }) => s + (product.price ?? 0) * quantity, 0);
  const isUK = delivery.country === "United Kingdom";
  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const shippingCost = isUK && selectedShipping.freeOver && cartGBP >= selectedShipping.freeOver ? 0 : selectedShipping.price;
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const loyaltyDiscountGbp = loyaltyPointsToRedeem / 100;
  const freePeptideDeductGbp = redeemFreePeptide && referralCreditGbp > 0 ? Math.min(referralCreditGbp, cartGBP) : 0;
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
    if (Object.keys(e).length) {
      setErrors(e);
      // Scroll to the first invalid field rather than blindly going to the top
      const firstKey = Object.keys(e)[0];
      const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
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
          redeemFreePeptide: redeemFreePeptide && referralCreditGbp > 0 ? true : undefined,
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
        cryptoCurrency?: string; wallidPaymentUrl?: string;
      };

      // Wallid: redirect to hosted payment page.
      // Cart is NOT cleared before redirect — WallidReturn clears it on confirmed
      // success. If payment is cancelled or fails, the cart remains intact for retry.
      if (paymentMethod === "wallid" && data.wallidPaymentUrl) {
        window.location.href = data.wallidPaymentUrl;
        return;
      }

      clearCart();

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
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* ── Session expired overlay ── */}
      {timerExpired && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", border: "1px solid #E8EDF5", borderRadius: 12, padding: "32px 28px", textAlign: "center",
            maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏱</div>
            <p style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Session Expired</p>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: 24, lineHeight: 1.5 }}>
              Your checkout session has timed out for security. Your cart is still saved.
            </p>
            <button
              type="button"
              onClick={() => setTimeLeft(15 * 60)}
              style={{
                width: "100%", padding: "14px", borderRadius: 6, border: "none",
                background: THEME.cta, color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
              }}
            >
              Restart Checkout
            </button>
          </div>
        </div>
      )}

      {/* ── Research warning ── */}
      <div style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-start gap-2">
          <span style={{ fontSize: "14px", flexShrink: 0 }}>⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
            <strong>Research Use Only:</strong> All products are for in-vitro laboratory research. Not for human or veterinary use. Must be 18+ to purchase.
          </p>
        </div>
      </div>

      {/* ── Header bar ── */}
      <div style={{ borderBottom: "1px solid #E8EDF5", backgroundColor: "#fff" }}>
        <div className="checkout-breadcrumb-bar max-w-[1280px] mx-auto px-4" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <h1 className="font-bold" style={{ fontSize: "16px", color: "#0F172A" }}>
            My Cart
            <span className="ml-2 font-normal" style={{ fontSize: "13px", color: "#94A3B8" }}>
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>
          <div className="checkout-step-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "12px" }}>
            <Lock size={13} />
            <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

      {/* ── Timer banner ── */}
      <div className="checkout-timer-banner" style={{
        background: timerUrgent
          ? "linear-gradient(90deg, #7F1D1D 0%, #DC2626 50%, #7F1D1D 100%)"
          : timerWarning
          ? "linear-gradient(90deg, #78350F 0%, #D97706 50%, #78350F 100%)"
          : "linear-gradient(90deg, #1240A0 0%, #1B5CB5 50%, #1240A0 100%)",
        borderBottom: `2px solid ${timerUrgent ? "#EF4444" : timerWarning ? "#F59E0B" : "#3B82F6"}`,
        transition: "background 0.8s, border-color 0.8s",
        padding: "12px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          animation: "shimmer 2.4s linear infinite",
          pointerEvents: "none",
        }} />
        <div className="checkout-timer-inner">
          <div className="checkout-timer-clock" style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", flexShrink: 0,
            animation: timerUrgent ? "pulse 0.9s ease-in-out infinite" : "none",
          }}>⏱</div>
          <div className="checkout-timer-message" style={{ textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {timerUrgent ? "⚠️ Hurry — time is almost up!" : "Your items are reserved"}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 400, marginTop: "1px" }}>
              Complete checkout to secure your order
            </p>
          </div>
          <div className="checkout-timer-divider" style={{ width: 1, height: 36, background: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <div style={{ textAlign: "center" }}>
            <div className="checkout-timer-countdown" style={{
              fontVariantNumeric: "tabular-nums",
              fontSize: "32px", fontWeight: 900,
              color: "#fff", lineHeight: 1,
              letterSpacing: "0.04em",
              textShadow: timerUrgent ? "0 0 20px rgba(255,100,100,0.6)" : "0 0 16px rgba(255,255,255,0.25)",
            }}>
              {timerMins}<span style={{ opacity: 0.6, margin: "0 1px" }}>:</span>{timerSecs}
            </div>
            <p className="checkout-timer-label" style={{ margin: 0, fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>
              remaining
            </p>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="checkout-layout" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px", display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* ── LEFT COLUMN — items + checkout form ── */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>


          <div className="upsells-top space-y-3">
            <CartUpsells />
          </div>

          <hr style={divider} />

          {/* CONTACT INFORMATION */}
          <p style={sectionTitle}>Contact Information</p>
          <div className="form-grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label style={label}>Email *</label>
              <input
                data-field="email"
                value={delivery.email} onChange={setD("email")} type="email"
                placeholder="your@email.com" style={inp("email")}
                onFocus={e => { if (!errors.email) e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.email ? "#ef4444" : THEME.inputBorder; }}
              />
              {errors.email && <p style={errText}>{errors.email}</p>}
            </div>
            <div>
              <label style={label}>Phone</label>
              <input
                value={delivery.phone} onChange={setD("phone")} type="tel"
                placeholder="+44 7700 900000" style={input}
                onFocus={e => { e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }}
              />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", color: THEME.textSub, cursor: "pointer", marginBottom: 4 }}>
            <input type="checkbox" style={{ width: 15, height: 15, accentColor: THEME.cta }} />
            Email me with news and exclusive offers
          </label>

          <hr style={divider} />

          {/* SHIPPING ADDRESS */}
          <p style={sectionTitle}>Shipping Address</p>

          <div className="form-grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label style={label}>First Name *</label>
              <input data-field="firstName" value={delivery.firstName} onChange={setD("firstName")} placeholder="First Name" style={inp("firstName")}
                onFocus={e => { if (!errors.firstName) e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.firstName ? "#ef4444" : THEME.inputBorder; }} />
              {errors.firstName && <p style={errText}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={label}>Last Name *</label>
              <input data-field="lastName" value={delivery.lastName} onChange={setD("lastName")} placeholder="Last Name" style={inp("lastName")}
                onFocus={e => { if (!errors.lastName) e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.lastName ? "#ef4444" : THEME.inputBorder; }} />
              {errors.lastName && <p style={errText}>{errors.lastName}</p>}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={label}>Address *</label>
            <input data-field="address1" value={delivery.address1} onChange={setD("address1")} placeholder="Street address" style={inp("address1")}
              onFocus={e => { if (!errors.address1) e.currentTarget.style.borderColor = "#1240A0"; }}
              onBlur={e => { e.currentTarget.style.borderColor = errors.address1 ? "#ef4444" : THEME.inputBorder; }} />
            {errors.address1 && <p style={errText}>{errors.address1}</p>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={label}>Apt, Suite, Etc. (Optional)</label>
            <input value={delivery.address2} onChange={setD("address2")} placeholder="Apartment, suite, etc." style={input}
              onFocus={e => { e.currentTarget.style.borderColor = "#1240A0"; }}
              onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }} />
          </div>

          <div className="form-grid-3" style={{ marginBottom: 4 }}>
            <div>
              <label style={label}>City *</label>
              <input data-field="city" value={delivery.city} onChange={setD("city")} placeholder="City" style={inp("city")}
                onFocus={e => { if (!errors.city) e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.city ? "#ef4444" : THEME.inputBorder; }} />
              {errors.city && <p style={errText}>{errors.city}</p>}
            </div>
            <div>
              <label style={label}>Country *</label>
              <select data-field="country" value={delivery.country} onChange={setD("country")}
                style={{ ...inp("country"), height: 44, appearance: "none", cursor: "pointer" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.country ? "#ef4444" : THEME.inputBorder; }}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Postal Code *</label>
              <input data-field="postcode" value={delivery.postcode} onChange={setD("postcode")} placeholder="Postal Code" style={inp("postcode")}
                onFocus={e => { if (!errors.postcode) e.currentTarget.style.borderColor = "#1240A0"; }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = errors.postcode ? "#ef4444" : THEME.inputBorder;
                  onPostcodeBlur(e.currentTarget.value);
                }} />
              {postcodeLoading && <p style={{ fontSize: "12px", color: THEME.textMuted, marginTop: 4 }}>Looking up postcode…</p>}
              {errors.postcode && <p style={errText}>{errors.postcode}</p>}
            </div>
          </div>

          <hr style={divider} />

          {/* SHIPPING OPTIONS (desktop position — moves into Order Summary on mobile) */}
          <div className="shipping-options-form">
            <p style={sectionTitle}>Shipping Options</p>
            {renderShippingOptions()}
            <hr style={divider} />
          </div>

          {/* PAYMENT METHOD */}
          <p style={sectionTitle}>Payment Method</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Pay by Bank (Wallid) */}
            {(() => {
              const active = paymentMethod === "wallid";
              return (
                <div
                  onClick={() => setPaymentMethod("wallid")}
                  style={{
                    border: `2px solid ${active ? "#1240A0" : "#D8E4FF"}`,
                    borderRadius: 10, overflow: "hidden", cursor: "pointer",
                    background: active ? "#EEF4FF" : "#F4F7FF",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 16px 0" }}>
                    <input
                      type="radio" checked={active} onChange={() => setPaymentMethod("wallid")}
                      style={{ accentColor: "#1240A0", width: 18, height: 18, flexShrink: 0, marginTop: 2, cursor: "pointer" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>Pay by Bank</span>
                        <span style={{
                          fontSize: "10px", fontWeight: 800, letterSpacing: "0.07em",
                          background: "#059669", color: "#fff",
                          padding: "3px 9px", borderRadius: 100,
                        }}>RECOMMENDED · FASTEST</span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B", margin: "6px 0 0", lineHeight: 1.4 }}>
                        Tap your bank, approve in your banking app — done in seconds.
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "14px 16px 16px 46px" }}>
                    {/* Trust line */}
                    <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 12px", lineHeight: 1.5 }}>
                      🏦 FCA-authorised open banking · Read-only · No card details stored
                    </p>

                    {/* Bank logos */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      {BANK_SVGS.map(b => (
                        <div key={b.name} title={b.name} style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: "#fff", border: "1px solid #E8EDF5",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, overflow: "hidden",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}>
                          {"imgSrc" in b ? (
                            <img src={b.imgSrc} alt={b.name} style={{ width: 26, height: 26, objectFit: "contain" }} />
                          ) : (
                            <svg viewBox={b.viewBox} width={b.filled ? 22 : 28} height={b.filled ? 22 : 28} xmlns="http://www.w3.org/2000/svg">
                              <path d={b.path} fill={b.filled ? b.color : "none"} stroke={b.filled ? "none" : b.color} strokeWidth={b.filled ? undefined : 2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      ))}
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748B", marginLeft: 2 }}>+more</span>
                    </div>

                    {/* How it works */}
                    <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#64748B", margin: "0 0 10px", textTransform: "uppercase" }}>
                      How it works
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {["Choose your bank", "Approve in your banking app", "Order confirmed instantly"].map((step, i) => (
                        <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: "#1240A0", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 800, flexShrink: 0,
                          }}>{i + 1}</span>
                          <span style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Cryptocurrency */}
            {(() => {
              const active = paymentMethod === "bitcoin";
              return (
                <div
                  onClick={() => setPaymentMethod("bitcoin")}
                  style={{ border: `1px solid ${active ? "#1240A0" : "#E8EDF5"}`, borderRadius: 6, cursor: "pointer", background: active ? "#EEF4FF" : THEME.cardBg }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <input type="radio" checked={active} onChange={() => setPaymentMethod("bitcoin")}
                      style={{ accentColor: THEME.cta, width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: THEME.text }}>Cryptocurrency</span>
                      <p style={{ fontSize: "12px", color: THEME.textMuted, margin: "2px 0 0" }}>Bitcoin, Ethereum, USDT, USDC, Litecoin, Monero</p>
                    </div>
                  </div>
                  {active && (
                    <div style={{ borderTop: "1px solid #F1F5F9", padding: "14px 16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {CRYPTO_OPTIONS.map(c => (
                          <button key={c.id} type="button" onClick={e => { e.stopPropagation(); setCryptoCurrency(c.id); }}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "6px 12px", borderRadius: 100, border: "1px solid",
                              borderColor: cryptoCurrency === c.id ? THEME.cta : "#E2E8F0",
                              background: cryptoCurrency === c.id ? THEME.cta : "#F8FAFC",
                              color: cryptoCurrency === c.id ? "#fff" : THEME.textSub,
                              fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              width: 18, height: 18, borderRadius: "50%",
                              background: cryptoCurrency === c.id ? "rgba(255,255,255,0.25)" : c.color,
                              color: "#fff", fontSize: "9px", fontWeight: 800, flexShrink: 0,
                            }}>{c.symbol}</span>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {loyaltyBalance && loyaltyBalance.balance > 0 && (
            <div style={{ marginTop: 24, border: THEME.cardBorder, borderRadius: 6, padding: 16, background: THEME.cardBg }}>
              <p style={{ ...sectionTitle, marginBottom: 8 }}>Loyalty Points</p>
              <p style={{ fontSize: "13px", color: THEME.textSub, marginBottom: 10 }}>
                You have <strong>{loyaltyBalance.balance}</strong> points (worth <strong>£{loyaltyBalance.gbpValue.toFixed(2)}</strong>).
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="range" min={0} max={Math.min(loyaltyBalance.balance, Math.floor(totalGBP * 100))}
                  step={100} value={loyaltyPointsToRedeem}
                  onChange={e => setLoyaltyPointsToRedeem(Number(e.target.value))}
                  style={{ flex: 1, accentColor: THEME.cta }}
                />
                <span style={{ fontSize: "13px", fontWeight: 700, color: THEME.text, minWidth: 60, textAlign: "right" }}>
                  −£{(loyaltyPointsToRedeem / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {referralCreditGbp > 0 && (
            <div style={{ marginTop: 16, border: THEME.cardBorder, borderRadius: 6, padding: 16, background: THEME.cardBg }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "14px", color: THEME.text }}>
                <input type="checkbox" checked={redeemFreePeptide} onChange={e => setRedeemFreePeptide(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: THEME.cta }} />
                <span>Redeem referral credit — save £{Math.min(referralCreditGbp, cartGBP).toFixed(2)} on this order</span>
              </label>
            </div>
          )}

          <hr style={divider} />

          {/* Confirm + CTA */}
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            fontSize: "13px", color: THEME.textSub, cursor: "pointer", marginBottom: 16,
            lineHeight: 1.4,
          }}>
            <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
              style={{ width: 16, height: 16, marginTop: 1, accentColor: THEME.cta, flexShrink: 0 }} />
            I confirm that all products are for laboratory research purposes only, not for human consumption, and I am at least 18 years of age.
          </label>
          {errors.confirmed && <p style={{ ...errText, marginBottom: 12 }}>{errors.confirmed}</p>}

          {placeError && (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, fontSize: "13px", color: "#DC2626" }}>
              {placeError}
            </div>
          )}
          {stockErrors.length > 0 && (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, fontSize: "13px", color: "#DC2626" }}>
              {stockErrors.map(e => (
                <p key={e.productName} style={{ margin: "0 0 4px" }}>
                  {e.productName}: only {e.available} in stock (you requested {e.requested})
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={placing}
            style={{
              width: "100%", height: 52, borderRadius: 4,
              background: placing ? THEME.ctaHover : THEME.cta,
              color: "#fff", border: "none",
              fontSize: "13px", fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: placing ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.background = THEME.ctaHover; }}
            onMouseLeave={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.background = THEME.cta; }}
          >
            {placing ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Processing…
              </>
            ) : (
              <>
                <Lock size={14} />
                Place Order
              </>
            )}
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", color: THEME.textMuted, fontWeight: 600, letterSpacing: "0.05em" }}>
              <Shield size={13} /> SECURE CHECKOUT
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", color: THEME.textMuted, fontWeight: 600, letterSpacing: "0.05em" }}>
              <Truck size={13} /> FAST SHIPPING
            </div>
          </div>

          <Link
            href="/all-peptides"
            className="w-full rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{ height: "40px", backgroundColor: "#F1F5F9", color: "#475569", textDecoration: "none", fontSize: "13px", marginTop: 14, display: "flex" }}
          >
            Continue Shopping
          </Link>

          {/* Upsells below Place Order — mobile only */}
          <div className="upsells-bottom" style={{ display: "none", marginTop: 20 }}>
            <div className="space-y-3">
              <CartUpsells />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN — SINGLE ORDER SUMMARY ── */}
        <div className="checkout-sidebar" style={{ width: 360, flexShrink: 0, position: "sticky", top: 24 }}>
          <div style={{ border: THEME.cardBorder, borderRadius: 8, background: "#fff", overflow: "hidden", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}>
            <div style={{ padding: "14px 20px", background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)" }}>
              <p style={{ fontSize: "13px", fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                Order Summary
              </p>
            </div>
            <div style={{ padding: "16px 20px 0" }}>
              {items.map(({ product, quantity }) => {
                const price = product.price ?? 0;
                const freeQty = Math.min(freeUnitsByProductId[product.id] ?? 0, quantity);
                return (
                  <div key={String(product.id)} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 6, border: "1px solid #E8EDF5", overflow: "hidden", background: "#F8FAFC" }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#94A3B8" }}>IMG</div>
                        )}
                      </div>
                      <div style={{
                        position: "absolute", top: -6, right: -6,
                        width: 20, height: 20, borderRadius: "50%",
                        background: THEME.cta, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                      }}>{quantity}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: THEME.text, margin: 0 }}>{product.name}</p>
                      {freeQty > 0 && (
                        <p style={{ fontSize: "11px", color: "#059669", margin: "2px 0 0", fontWeight: 600 }}>
                          {freeQty} free (Bundle & Save)
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="hover:bg-slate-50 transition-colors"
                            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <div style={{ width: 28, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1.5px solid #E2E8F0", borderRight: "1.5px solid #E2E8F0", color: "#0F172A", fontSize: "12px", fontWeight: 700 }}>
                            {quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="hover:bg-slate-50 transition-colors"
                            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="hover:bg-red-50 transition-colors"
                          style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, color: "#EF4444", border: "1.5px solid #FEE2E2", background: "none", cursor: "pointer" }}
                          title="Remove"
                          aria-label="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: THEME.text, flexShrink: 0 }}>
                      £{(price * quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
              {bundleFreeBacWater && (
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 6, border: "1px solid #E8EDF5", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>💧</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: THEME.text, margin: 0 }}>Bacteriostatic Water 10ml</p>
                    <p style={{ fontSize: "11px", color: "#059669", margin: "2px 0 0", fontWeight: 600 }}>Free (Bundle & Save)</p>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669", flexShrink: 0 }}>£0.00</div>
                </div>
              )}
            </div>

            {/* Bundle & Save progress nudge */}
            {peptideQty < 10 && (
              <div style={{ padding: "0 20px 16px" }}>
                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: hasFreebie ? "#F0FDF4" : "#EEF4FF",
                    border: `1px solid ${hasFreebie ? "#BBF7D0" : "#BFDBFE"}`,
                  }}
                >
                  {peptideQty < 3 ? (
                    <>
                      <p style={{ fontSize: "11.5px", fontWeight: 700, color: "#1240A0", marginBottom: "6px" }}>
                        Bundle & Save — add {3 - peptideQty} more {3 - peptideQty === 1 ? "peptide" : "peptides"} for a free BAC water
                      </p>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <div style={{ flex: 1, height: "4px", borderRadius: "4px", backgroundColor: "#DBEAFE", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(peptideQty / 3) * 100}%`, borderRadius: "4px", background: "linear-gradient(90deg, #1B5CB5, #2563EB)", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "10px", color: "#475569", flexShrink: 0 }}>{peptideQty}/3</span>
                      </div>
                      <p style={{ fontSize: "10.5px", color: "#475569", marginTop: "5px" }}>3-4 = free BAC water · 5-9 = 1 peptide free · 10+ = 2 peptides free</p>
                    </>
                  ) : bundleFreeItemsCount === 0 ? (
                    <>
                      <p style={{ fontSize: "11.5px", fontWeight: 700, color: "#059669", marginBottom: "6px" }}>
                        ✓ Free BAC water unlocked — add {5 - peptideQty} more for 1 peptide free
                      </p>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <div style={{ flex: 1, height: "4px", borderRadius: "4px", backgroundColor: "#BBF7D0", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${((peptideQty - 3) / 2) * 100}%`, borderRadius: "4px", background: "linear-gradient(90deg, #059669, #16A34A)", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "10px", color: "#475569", flexShrink: 0 }}>{peptideQty}/5</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "11.5px", fontWeight: 700, color: "#059669", marginBottom: "6px" }}>
                        ✓ 1 peptide free applied — add {10 - peptideQty} more for 2 peptides free
                      </p>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <div style={{ flex: 1, height: "4px", borderRadius: "4px", backgroundColor: "#BBF7D0", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${((peptideQty - 5) / 5) * 100}%`, borderRadius: "4px", background: "linear-gradient(90deg, #059669, #16A34A)", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "10px", color: "#475569", flexShrink: 0 }}>{peptideQty}/10</span>
                      </div>
                    </>
                  )}
                </div>
                {bundleFreeItemsCount >= 2 && (
                  <div className="rounded-xl p-3 mt-2" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <p style={{ fontSize: "11.5px", fontWeight: 700, color: "#059669" }}>
                      ✓ 2 peptides free applied — maximum bundle tier active!
                    </p>
                  </div>
                )}
              </div>
            )}

            <hr style={{ margin: 0, border: "none", borderTop: THEME.divider }} />

            {/* BAC Water upsell — below cart items, above discount code */}
            <div style={{ padding: "16px 20px 4px" }}>
              <BacWaterUpsell />
            </div>

            {/* Discount code */}
            <div style={{ padding: "16px 20px" }}>
              {appliedDiscount ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 6 }}>
                  <span style={{ fontSize: "13px", color: "#065F46", fontWeight: 700 }}>
                    {appliedDiscount.code} — −£{appliedDiscount.discountAmount.toFixed(2)}
                  </span>
                  <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountError(null); setDiscountInput(""); }}
                    style={{ background: "none", border: "none", color: "#065F46", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>✕</button>
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
                        background: THEME.cta, color: "#fff",
                        border: "none", fontSize: "13px", fontWeight: 700,
                        cursor: "pointer", letterSpacing: "0.05em", flexShrink: 0,
                        opacity: (applyingDiscount || !discountInput.trim()) ? 0.5 : 1,
                      }}>APPLY</button>
                  </div>
                  {discountError && <p style={{ ...errText, marginTop: 4 }}>{discountError}</p>}
                </div>
              )}
            </div>

            <hr style={{ margin: 0, border: "none", borderTop: THEME.divider }} />

            {/* Shipping options (mobile only — shown next to the total) */}
            <div className="shipping-options-summary" style={{ display: "none", padding: "16px 20px 4px" }}>
              <p style={{ ...sectionTitle, marginBottom: 10 }}>Shipping Options</p>
              {renderShippingOptions()}
            </div>

            {/* Totals */}
            <div style={{ padding: "16px 20px" }}>
              {[
                ["Subtotal", `£${cartGBP.toFixed(2)}`],
                ["Shipping", shippingCost === 0 ? "FREE" : `£${shippingCost.toFixed(2)}`],
                ...(bundleDiscountAmount > 0 ? [["Bundle & Save", `−£${bundleDiscountAmount.toFixed(2)}`]] : []),
                ...(discountAmount > 0 ? [[`Discount (${appliedDiscount?.code})`, `−£${discountAmount.toFixed(2)}`]] : []),
                ...(loyaltyPointsToRedeem > 0 ? [["Loyalty Points", `−£${loyaltyDiscountGbp.toFixed(2)}`]] : []),
                ...(freePeptideDeductGbp > 0 ? [["Referral Credit", `−£${freePeptideDeductGbp.toFixed(2)}`]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "13px", color: THEME.textMuted }}>{k}</span>
                  <span style={{ fontSize: "13px", color: v?.startsWith("−") || v === "FREE" ? "#059669" : THEME.text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: THEME.divider }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: THEME.text }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: THEME.text }}>£{totalGBP.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

        .checkout-timer-inner { display: flex; align-items: center; gap: 12px; justify-content: center; }
        .form-grid-2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        .form-grid-2 > *, .form-grid-3 > * { min-width: 0; }
        .form-grid-2 input, .form-grid-2 select, .form-grid-3 input, .form-grid-3 select { min-width: 0; width: 100%; }
        .checkout-layout > * { min-width: 0; }

        @media (max-width: 900px) {
          .checkout-layout { flex-direction: column !important; align-items: stretch !important; padding: 12px !important; gap: 16px !important; }
          .checkout-layout > * { width: 100% !important; max-width: 100% !important; }
          .checkout-sidebar { width: 100% !important; position: static !important; order: -1 !important; }
          .checkout-breadcrumb-bar { height: 40px !important; }
          .checkout-timer-banner { padding: 8px 12px !important; }
          .checkout-timer-clock { width: 26px !important; height: 26px !important; font-size: 12px !important; }
          .checkout-timer-divider { display: none !important; }
          .checkout-timer-countdown { font-size: 22px !important; }
          .checkout-timer-label { font-size: 9px !important; }
          .checkout-timer-message p:first-child { font-size: 10px !important; }
          .checkout-timer-message p:last-child { font-size: 11px !important; }
          .form-grid-3 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          input[type="text"], input[type="email"], input[type="tel"], input[type="search"], select {
            height: 40px !important;
          }
          .checkout-layout hr { margin: 14px 0 !important; }
          .shipping-options-form { display: none !important; }
          .shipping-options-summary { display: block !important; }
          .upsells-top { display: none !important; }
          .upsells-bottom { display: block !important; }
        }
      `}</style>
    </div>
  );
}
