import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { getCatalogueVialImage } from "@/lib/catalogueImages";
import { STUDIO_BG } from "@/lib/studioImage";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { trackInitiateCheckout } from "@/lib/pixels";
import { createCheckoutQuoteInputKey } from "@/lib/checkoutQuoteInputKey";
import { standardShippingPriceGbpForCountry } from "@/lib/shipping";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { type Product, isHiddenCategory } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import BacWaterUpsell from "@/components/BacWaterUpsell";
import PageHero from "@/components/PageHero";
import CatalogueCard from "@/components/CatalogueCard";
import { groupProducts } from "@/data/groupedProducts";
import {
  Trash2, Plus, Minus, ShoppingCart, ChevronRight, Sparkles, CheckCircle2,
  Lock, Shield, Truck, AlertTriangle, Clock, Check, Droplets, ChevronDown,
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

const ISO_COUNTRY_CODES = (
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ " +
  "BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ " +
  "DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY " +
  "HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY " +
  "MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
  "NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA " +
  "RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ " +
  "TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ " +
  "VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW"
).split(" ");

// ISO 3166-1 alpha-2 codes we do not ship to.
// Covers UK/UN/EU comprehensive sanctions, OFSI restrictions, and UN arms embargoes.
const NON_SHIPPABLE_COUNTRY_CODES = new Set([
  "RU", // Russia                   — UK/UN/EU comprehensive sanctions
  "BY", // Belarus                  — UK/UN/EU comprehensive sanctions
  "IR", // Iran                     — UK/UN/EU comprehensive sanctions
  "KP", // North Korea              — UN/UK comprehensive sanctions
  "IL", // Israel                   — business decision
  "SY", // Syria                    — UK/UN/EU comprehensive sanctions
  "MM", // Myanmar (Burma)          — UK/EU sanctions
  "CU", // Cuba                     — UK trade restrictions
  "VE", // Venezuela                — UK/US/EU sectoral sanctions
  "SD", // Sudan                    — UN arms embargo, UK sanctions
  "SS", // South Sudan              — UN/UK sanctions
  "LY", // Libya                    — UN arms embargo
  "SO", // Somalia                  — UN arms embargo
  "YE", // Yemen                    — UN sanctions
  "AF", // Afghanistan              — UN/UK sanctions (Taliban regime)
  "NI", // Nicaragua                — UK/US sanctions
  "ZW", // Zimbabwe                 — UK sanctions
  "CD", // DR Congo                 — UN arms embargo
  "CF", // Central African Republic — UN arms embargo
  "ML", // Mali                     — ECOWAS/UN sanctions
  "GN", // Guinea                   — ECOWAS sanctions
  "GW", // Guinea-Bissau            — UN sanctions
  "HT", // Haiti                    — US/UK sanctions
  "ER", // Eritrea                  — UN arms embargo
]);

const COUNTRIES = (() => {
  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  return ISO_COUNTRY_CODES
    .filter(code => !NON_SHIPPABLE_COUNTRY_CODES.has(code))
    .map(code => displayNames.of(code))
    .filter((name): name is string => name !== undefined)
    .sort((a, b) => {
  // Keep primary markets at the top
  const pinned = ["United Kingdom", "United States", "Canada", "Ireland", "Australia", "New Zealand"];
  const ai = pinned.indexOf(a), bi = pinned.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b);
    });
})();

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard",
    displayLabel: "Standard Tracked (2–3 business days)",
    price: 4.99,
    note: "Tracked parcel delivery, up to 2kg. Remote areas (Highlands, NI, Channel Islands) may take 1–2 extra days.",
  },
  {
    id: "nextday_weekday",
    label: "Next Day Weekday",
    displayLabel: "Next Day Weekday (order before 1pm Mon–Thu)",
    price: 9.99,
    freeOver: null,
    note: "Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast",
  },
  {
    id: "nextday_weekend",
    label: "Next-Day Weekend",
    displayLabel: "Next-Day Weekend (order before 1pm Fri)",
    price: 14.99,
    freeOver: null,
    note: "Excluding Channel Islands, Jersey, Isle of Wight, Highlands and Belfast",
  },
];

type CryptoRoute = {
  currency: "BTC" | "ETH" | "SOL" | "USDT" | "USDC";
  network: string;
  minConfirmations: number;
};

const CRYPTO_META: Record<CryptoRoute["currency"], { name: string; symbol: string; color: string }> = {
  BTC: { name: "Bitcoin", symbol: "₿", color: "#F7931A" },
  ETH: { name: "Ethereum", symbol: "Ξ", color: "#627EEA" },
  SOL: { name: "Solana", symbol: "◎", color: "#14F195" },
  USDT: { name: "Tether", symbol: "₮", color: "#26A17B" },
  USDC: { name: "USD Coin", symbol: "◎", color: "#2775CA" },
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

type CanonicalAddress = {
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
};

type AddressVerification = {
  canonicalAddress: CanonicalAddress;
  verificationToken: string;
  expiresAt: string;
};
type AddressSuggestion = AddressVerification;
const ADDRESS_SUGGESTION_CACHE_TTL_MS = 60_000;
const ADDRESS_SUGGESTION_CACHE_MAX_ENTRIES = 20;
const PHONE_COUNTRY_CODES = [
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "United States / Canada" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+353", country: "Ireland" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+45", country: "Denmark" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+48", country: "Poland" },
  { code: "+351", country: "Portugal" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+65", country: "Singapore" },
  { code: "+852", country: "Hong Kong" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+974", country: "Qatar" },
  { code: "+27", country: "South Africa" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+90", country: "Turkey" },
  { code: "+7", country: "Kazakhstan" },
  { code: "custom", country: "Other country" },
] as const;
// Phone list is curated to shippable destinations only — no filtering needed.
const SHIPPABLE_PHONE_COUNTRY_CODES = PHONE_COUNTRY_CODES;
const PHONE_CODE_BY_COUNTRY: Record<string, string> = {
  "United Kingdom": "+44",
  "United States": "+1",
  Canada: "+1",
  Australia: "+61",
  "New Zealand": "+64",
  Ireland: "+353",
  France: "+33",
  Germany: "+49",
  Spain: "+34",
  Italy: "+39",
  Netherlands: "+31",
  Belgium: "+32",
  Switzerland: "+41",
  Austria: "+43",
  Denmark: "+45",
  Sweden: "+46",
  Norway: "+47",
  Poland: "+48",
  Portugal: "+351",
  Japan: "+81",
  "South Korea": "+82",
  China: "+86",
  India: "+91",
  Singapore: "+65",
  "Hong Kong": "+852",
  "United Arab Emirates": "+971",
  Qatar: "+974",
  "South Africa": "+27",
  Brazil: "+55",
  Mexico: "+52",
  Turkey: "+90",
  Kazakhstan: "+7",
};

type AppliedDiscount = {
  code: string; type: string; value: number; discountAmount: number;
};

type PaymentQuote = {
  paymentQuoteToken: string;
  expiresAt: string;
  paymentCurrency: "GBP" | "EUR";
  paymentAmountMinor: number;
  totalGbp: number;
  subtotalGbp: number;
  shippingCostGbp: number;
  bundleDiscountGbp: number;
  discountAmountGbp: number;
  loyaltyDiscountGbp: number;
  referralCreditGbp: number;
  testPayment?: {
    active: boolean;
    normalTotalGbp: number;
    adjustmentGbp: number;
  };
};

const WALLID_TEST_CHECKOUT_STORAGE_KEY = "omniqure.wallid-test-checkout";
const CRYPTO_TEST_CHECKOUT_STORAGE_KEY = "omniqure.crypto-test-checkout";

function readSavedWallidTestToken(): string | null {
  try {
    return window.sessionStorage.getItem(WALLID_TEST_CHECKOUT_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function saveWallidTestToken(token: string): void {
  try {
    window.sessionStorage.setItem(WALLID_TEST_CHECKOUT_STORAGE_KEY, token);
  } catch {
    // The URL token remains sufficient when browser storage is unavailable.
  }
}

function clearSavedWallidTestToken(): void {
  try {
    window.sessionStorage.removeItem(WALLID_TEST_CHECKOUT_STORAGE_KEY);
  } catch {
    // Nothing else is needed when browser storage is unavailable.
  }
}

function readSavedCryptoTestToken(): string | null {
  try {
    return window.sessionStorage.getItem(CRYPTO_TEST_CHECKOUT_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function saveCryptoTestToken(token: string): void {
  try {
    window.sessionStorage.setItem(CRYPTO_TEST_CHECKOUT_STORAGE_KEY, token);
  } catch {
    // The URL token remains sufficient when browser storage is unavailable.
  }
}

function clearSavedCryptoTestToken(): void {
  try {
    window.sessionStorage.removeItem(CRYPTO_TEST_CHECKOUT_STORAGE_KEY);
  } catch {
    // Nothing else is needed when browser storage is unavailable.
  }
}

const emptyDelivery: DeliveryForm = {
  email: "", firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", county: "",
  postcode: "", country: "United Kingdom",
};

const ADDRESS_FIELDS = new Set<keyof DeliveryForm>([
  "address1", "address2", "city", "county", "postcode", "country",
]);

const POSTCODE_RULES: Record<string, { pattern: RegExp; message: string }> = {
  "United Kingdom": {
    pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
    message: "Enter a valid UK postcode",
  },
  "United States": {
    pattern: /^\d{5}(?:-\d{4})?$/,
    message: "Enter a valid ZIP code",
  },
  "Canada": {
    pattern: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
    message: "Enter a valid Canadian postal code",
  },
  "Australia": {
    pattern: /^\d{4}$/,
    message: "Enter a valid Australian postcode",
  },
  "Japan": {
    pattern: /^\d{3}-?\d{4}$/,
    message: "Enter a valid Japanese postal code",
  },
};

// ── Styles ──────────────────────────────────────────────────────────────────

const THEME = {
  cardBg: "#ffffff" as const,
  cardBorder: "1px solid rgba(11,18,32,0.09)" as const,
  inputBg: "#ffffff" as const,
  inputBorder: "rgba(11,18,32,0.12)" as const,
  text: "#1D2948" as const,
  textMuted: "#4A5672" as const,
  textSub: "#4A5672" as const,
  divider: "1px solid #F4F5F8" as const,
  cta: "#1D2948" as const,
  ctaHover: "#0A2472" as const,
};

const input: React.CSSProperties = {
  width: "100%", height: "46px", padding: "0 14px",
  border: `1px solid ${THEME.inputBorder}`, borderRadius: "6px",
  fontSize: "14px", color: THEME.text, outline: "none",
  fontFamily: "inherit", background: THEME.inputBg,
  boxSizing: "border-box",
};

const inputError: React.CSSProperties = { ...input, borderColor: "#9C4A44" };

const label: React.CSSProperties = {
  display: "block", fontSize: "12.5px", fontWeight: 500,
  color: THEME.textMuted, marginBottom: "6px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "18px", fontWeight: 600, color: THEME.text,
  letterSpacing: "-0.01em", margin: "0 0 18px",
};

const errText: React.CSSProperties = {
  fontSize: "11px", color: "#9C4A44", marginTop: "3px",
};

const divider: React.CSSProperties = {
  border: "none", borderTop: THEME.divider, margin: "24px 0",
};

// ── Cart upsell components ───────────────────────────────────────────────

function CartUpsellCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart, items } = useCart();
  const { formatPrice, currency } = useCurrency();
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
        style={{ border: "1.5px solid #D3D8E2", boxShadow: "none" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#8D9BB8";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(11,18,32,0.09)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <div
          className="rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ width: "48px", height: "48px", background: "#EDF0F9", border: "1px solid #D3D8E2" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ fontSize: "12px", color: "#22252C", lineHeight: 1.3 }}>{product.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span style={{ fontSize: "10px", color: "#4F6B52", fontWeight: 600 }}>{product.purity ?? "Purity not specified"}</span>
            {product.price != null && (
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#4E68C2" }}>{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        {alreadyInCart ? (
          <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: "#4F6B52" }}>
            <CheckCircle2 size={13} /> In cart
          </span>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 font-semibold rounded-lg flex-shrink-0 transition-all"
            style={{
              backgroundColor: added ? "#4F6B52" : "#4E68C2",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: "11px", padding: "5px 10px", height: "28px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#4E68C2"; }}
            onMouseLeave={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#4E68C2"; }}
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
        <Sparkles size={14} style={{ color: "#4E68C2" }} />
        <p className="font-bold" style={{ fontSize: "13px", color: "#22252C" }}>Frequently bought with your cart</p>
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
  useSEO({ title: "Cart & Checkout", description: "Review your research peptide cart and complete checkout in one step. OmniQure.", canonicalPath: "/cart" });
  const [, navigate] = useLocation();
  const wallidTestTokenFromUrl = new URLSearchParams(window.location.search).get("wallidTest")?.trim() || null;
  const cryptoTestTokenFromUrl = new URLSearchParams(window.location.search).get("cryptoTest")?.trim() || null;
  // Test links begin with an empty cart. Persist the one-time capability in
  // this tab while an admin browses for products and returns via /cart.
  const [wallidTestToken] = useState(() => {
    if (cryptoTestTokenFromUrl) return null;
    if (wallidTestTokenFromUrl) {
      clearSavedCryptoTestToken();
      saveWallidTestToken(wallidTestTokenFromUrl);
      return wallidTestTokenFromUrl;
    }
    return readSavedWallidTestToken();
  });
  const [cryptoTestToken] = useState(() => {
    if (wallidTestTokenFromUrl) return null;
    if (cryptoTestTokenFromUrl) {
      clearSavedWallidTestToken();
      saveCryptoTestToken(cryptoTestTokenFromUrl);
      return cryptoTestTokenFromUrl;
    }
    return readSavedWallidTestToken() ? null : readSavedCryptoTestToken();
  });
  const isWallidTestCheckout = Boolean(wallidTestToken);
  const isCryptoTestCheckout = Boolean(cryptoTestToken);
  const isAdminTestCheckout = isWallidTestCheckout || isCryptoTestCheckout;
  const {
    items, totalItems, subtotal, peptideQty, bundleFreeBacWater, bundleFreeItemsCount,
    bundleDiscountAmount, freeUnitsByProductId, removeFromCart, updateQuantity, clearCart,
  } = useCart();
  const hasFreebie = bundleFreeBacWater || bundleFreeItemsCount > 0;
  const freebieLabel = bundleFreeItemsCount === 2 ? "2 peptides free" : bundleFreeItemsCount === 1 ? "1 peptide free" : "free 10ml BAC water ampule";
  const { formatPrice, currency, rates } = useCurrency();
  const { customer } = useCustomerAuth();
  // Live product prices from the API — used at submission to override any stale
  // prices that may be stored in localStorage from a previous session.
  const { products: liveProducts } = useProducts();
  const livePriceBySlug = Object.fromEntries(
    liveProducts
      .filter((p) => (p as { slug?: string }).slug && p.price != null)
      .map((p) => [(p as { slug?: string }).slug!, p.price!])
  );

  const checkoutFired = useRef(false);
  const testCartReset = useRef(false);

  // Checkout form state
  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);
  const [shipping, setShipping] = useState("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  // Phones: the order summary starts collapsed to one row so the form leads.
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<{ productName: string; available: number; requested: number }[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [pendingAddressVerification, setPendingAddressVerification] = useState<AddressVerification | null>(null);
  const [addressVerification, setAddressVerification] = useState<AddressVerification | null>(null);
  const [addressVerificationLoading, setAddressVerificationLoading] = useState(false);
  const [addressVerificationError, setAddressVerificationError] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressSuggestionsLoading, setAddressSuggestionsLoading] = useState(false);
  const [addressSuggestionsError, setAddressSuggestionsError] = useState<string | null>(null);
  const [addressSuggestionsSearched, setAddressSuggestionsSearched] = useState(false);
  const [manualAddressEntry, setManualAddressEntry] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+44");
  const [customPhoneCountryCode, setCustomPhoneCountryCode] = useState("");
  const [phoneCodeDropdownOpen, setPhoneCodeDropdownOpen] = useState(false);
  const phoneCountryCodeTouched = useRef(false);
  const addressSuggestionRequest = useRef(0);
  const lastAddressSuggestionKey = useRef<string | null>(null);
  const addressSuggestionDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressSuggestionCache = useRef(new Map<string, {
    expiresAt: number;
    suggestions: AddressSuggestion[];
  }>());

  // Discount
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const affiliateDiscountApplied = useRef(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "wallid">("wallid");
  const [paymentCurrency, setPaymentCurrency] = useState<"GBP" | "EUR">("GBP");
  const [paymentQuote, setPaymentQuote] = useState<PaymentQuote | null>(null);
  const [paymentQuoteInputKey, setPaymentQuoteInputKey] = useState<string | null>(null);
  const [paymentQuoteLoading, setPaymentQuoteLoading] = useState(false);
  const [paymentQuoteError, setPaymentQuoteError] = useState<string | null>(null);
  const [paymentQuoteRefresh, setPaymentQuoteRefresh] = useState(0);
  const [wallidTestStatus, setWallidTestStatus] = useState<"checking" | "active" | "invalid">(
    wallidTestToken ? "checking" : "invalid",
  );
  const [cryptoTestStatus, setCryptoTestStatus] = useState<"checking" | "active" | "invalid">(
    cryptoTestToken ? "checking" : "invalid",
  );
  const [cryptoRoutes, setCryptoRoutes] = useState<CryptoRoute[]>([]);
  const [cryptoRoute, setCryptoRoute] = useState<CryptoRoute | null>(null);
  const paymentCurrencyChosen = useRef(false);

  useEffect(() => {
    if (!paymentCurrencyChosen.current && currency.code === "EUR") {
      setPaymentCurrency("EUR");
    }
  }, [currency.code]);

  useEffect(() => {
    if (!wallidTestToken) return;
    paymentCurrencyChosen.current = true;
    setPaymentMethod("wallid");
    setPaymentCurrency("GBP");
    setWallidTestStatus("checking");
  }, [wallidTestToken]);

  useEffect(() => {
    if (!cryptoTestToken) return;
    setPaymentMethod("crypto");
    setCryptoTestStatus("checking");
  }, [cryptoTestToken]);

  useEffect(() => {
    if (!cryptoTestTokenFromUrl || testCartReset.current) return;
    testCartReset.current = true;
    clearCart();
  }, [clearCart, cryptoTestTokenFromUrl]);

  useEffect(() => {
    fetch(apiUrl("crypto/payment-options"))
      .then((response) => response.ok ? response.json() as Promise<{ routes?: CryptoRoute[] }> : { routes: [] })
      .then((data) => {
        const routes = Array.isArray(data.routes) ? data.routes : [];
        setCryptoRoutes(routes);
        setCryptoRoute((current) => current && routes.some((route) => route.currency === current.currency && route.network === current.network)
          ? current
          : routes[0] ?? null);
        if (cryptoTestToken) setCryptoTestStatus(routes.length > 0 ? "active" : "invalid");
      })
      .catch(() => {
        setCryptoRoutes([]);
        if (cryptoTestToken) setCryptoTestStatus("invalid");
      });
  }, [cryptoTestToken]);

  // Loyalty
  const [loyaltyBalance, setLoyaltyBalance] = useState<{ balance: number; gbpValue: number } | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [referralCreditGbp, setReferralCreditGbp] = useState(0);
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

  // Countries that use a State/Province field instead of County
  const STATE_PROVINCE_COUNTRIES = new Set([
    "United States", "Canada", "Australia", "New Zealand",
    "India", "Brazil", "Mexico", "Argentina", "Malaysia",
  ]);
  // Countries that do not use postal codes for standard delivery addressing.
  const POSTCODE_OPTIONAL_COUNTRIES = new Set([
    "Hong Kong", "Macau", "Qatar", "United Arab Emirates",
  ]);

  const isUKPostcode = delivery.country === "United Kingdom";
  const usesStateProvince = STATE_PROVINCE_COUNTRIES.has(delivery.country);
  const postcodeOptional = POSTCODE_OPTIONAL_COUNTRIES.has(delivery.country);
  const postcodeLabel = delivery.country === "United Kingdom"
    ? "Postcode"
    : delivery.country === "United States"
      ? "ZIP Code"
      : "Postal Code";
  const stateLabel = delivery.country === "Canada" ? "Province" : "State";
  const countyStateLabel = usesStateProvince ? stateLabel : "County / Region";
  // With a postcode present (≥3 chars) a single-digit door number is enough.
  // Without a postcode (optional-postcode countries) require ≥3 chars of address.
  const hasUsablePostcode = !postcodeOptional && delivery.postcode.trim().length >= 3;
  const canFindAddressMatches =
    delivery.address1.trim().length >= 1 &&
    (hasUsablePostcode || (postcodeOptional && delivery.address1.trim().length >= 3));
  // Always show all address fields — verification gate removed.
  const showFullAddressFields = true;

  // Auto-fill city/county when a valid UK postcode is entered.
  const onPostcodeBlur = useCallback(async (pc: string, country: string) => {
    if (country !== "United Kingdom") return;
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
          const isFree = isUK && opt.id === "standard";
          const cost = opt.id === "standard"
            ? standardShippingPriceGbpForCountry(delivery.country)
            : opt.price;
          const active = shipping === opt.id;
          return (
            <label
              key={opt.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                border: `1px solid ${active ? "#4E68C2" : "rgba(11,18,32,0.09)"}`,
                borderRadius: 6, cursor: "pointer",
                background: active ? "#fff" : THEME.cardBg,
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <input type="radio" name="shipping" value={opt.id} checked={active}
                onChange={() => setShipping(opt.id)}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  flexShrink: 0,
                  border: `2px solid ${active ? THEME.cta : "#8D9BB8"}`,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  boxShadow: active ? `inset 0 0 0 4px ${THEME.cta}` : "none",
                  cursor: "pointer",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: THEME.text }}>{opt.displayLabel}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: THEME.text, flexShrink: 0, marginLeft: 12 }}>
                    {isFree ? <span style={{ color: "#4F6B52" }}>FREE</span> : `£${cost.toFixed(2)}`}
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

  const quoteInputItems = items.map(({ product, quantity }) => {
    const slug = (product as { slug?: string }).slug ?? "";
    const priceGbp = (slug && livePriceBySlug[slug] != null)
      ? livePriceBySlug[slug]
      : (product.price ?? 0);
    return {
      productId: parseInt(String(product.id), 10) || 0,
      productSlug: slug,
      quantity,
      priceGbp,
    };
  });
  const currentPaymentQuoteInputKey = createCheckoutQuoteInputKey({
    items: quoteInputItems,
    shipping,
    country: delivery.country,
    discountCode: appliedDiscount?.code ?? null,
    loyaltyPointsToRedeem,
    redeemFreePeptide: redeemFreePeptide && referralCreditGbp > 0,
    referralCreditGbp,
    paymentCurrency,
    paymentMethod,
    wallidTestToken,
  });

  useEffect(() => {
    if (paymentMethod !== "wallid" || items.length === 0) {
      setPaymentQuote(null);
      setPaymentQuoteInputKey(null);
      setPaymentQuoteLoading(false);
      setPaymentQuoteError(null);
      return;
    }

    const selectedOption = SHIPPING_OPTIONS.find((option) => option.id === shipping);
    if (!selectedOption) {
      setPaymentQuote(null);
      setPaymentQuoteError("Choose a shipping option to confirm your payment total.");
      return;
    }

    const controller = new AbortController();
    const requestTimer = window.setTimeout(() => {
      setPaymentQuoteLoading(true);
      setPaymentQuoteError(null);
      setPaymentQuote(null);
      setPaymentQuoteInputKey(null);
      if (wallidTestToken) setWallidTestStatus("checking");

      const quoteItems = items.map(({ product, quantity }, index) => {
        const quoteItem = quoteInputItems[index];
        return {
          productId: quoteItem.productId,
          productSlug: quoteItem.productSlug,
          productName: product.name,
          productCategory: product.category ?? "",
          quantity,
          priceGbp: quoteItem.priceGbp,
        };
      });

      void fetch(apiUrl("orders/quote"), {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivery: { country: delivery.country },
          shippingMethod: selectedOption.label,
          items: quoteItems,
          discountCode: appliedDiscount?.code ?? null,
          loyaltyPointsRedeemed: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
          redeemFreePeptide: redeemFreePeptide && referralCreditGbp > 0 ? true : undefined,
          paymentMethod: "wallid",
          paymentCurrency,
          wallidTestToken: wallidTestToken ?? undefined,
        }),
      })
        .then(async (response) => {
          const data = await response.json().catch(() => ({})) as Partial<PaymentQuote> & { error?: string };
          if (!response.ok) throw new Error(data.error ?? "We could not confirm your payment total.");
          if (
            typeof data.paymentQuoteToken !== "string" ||
            typeof data.expiresAt !== "string" ||
            (data.paymentCurrency !== "GBP" && data.paymentCurrency !== "EUR") ||
            typeof data.paymentAmountMinor !== "number" ||
            typeof data.totalGbp !== "number" ||
            typeof data.subtotalGbp !== "number" ||
            typeof data.shippingCostGbp !== "number" ||
            typeof data.bundleDiscountGbp !== "number" ||
            typeof data.discountAmountGbp !== "number" ||
            typeof data.loyaltyDiscountGbp !== "number" ||
            typeof data.referralCreditGbp !== "number"
            || (wallidTestToken !== null && (
              data.testPayment?.active !== true ||
              typeof data.testPayment.normalTotalGbp !== "number" ||
              typeof data.testPayment.adjustmentGbp !== "number"
            ))
          ) {
            throw new Error("We received an incomplete payment total. Please try again.");
          }
          if (!controller.signal.aborted) {
            setPaymentQuote(data as PaymentQuote);
            setPaymentQuoteInputKey(currentPaymentQuoteInputKey);
            if (wallidTestToken) setWallidTestStatus("active");
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            const message = error instanceof Error ? error.message : "We could not confirm your payment total.";
            setPaymentQuoteError(message);
            if (wallidTestToken) {
              setWallidTestStatus("invalid");
              if (/test checkout link is invalid|expired|no longer authorised/i.test(message)) {
                clearSavedWallidTestToken();
              }
            }
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setPaymentQuoteLoading(false);
        });
    }, 150);

    return () => {
      window.clearTimeout(requestTimer);
      controller.abort();
    };
  }, [
    currentPaymentQuoteInputKey,
    paymentQuoteRefresh,
  ]);

  useEffect(() => {
    if (!paymentQuote) return;
    const refreshIn = Math.max(0, new Date(paymentQuote.expiresAt).getTime() - Date.now());
    const refreshTimer = window.setTimeout(
      () => setPaymentQuoteRefresh((current) => current + 1),
      refreshIn,
    );
    return () => window.clearTimeout(refreshTimer);
  }, [paymentQuote]);

  const cartGBP = items.reduce((s, { product, quantity }) => s + (product.price ?? 0) * quantity, 0);

  useEffect(() => {
    if (affiliateDiscountApplied.current || appliedDiscount || cartGBP <= 0) return;
    const savedCode = window.localStorage.getItem("omniqure:affiliate-discount")?.trim();
    if (!savedCode) return;
    affiliateDiscountApplied.current = true;
    void applyDiscountCode(savedCode, false);
  }, [appliedDiscount, cartGBP]);

  if (items.length === 0) {
    const suggestions = groupProducts(liveProducts.filter((p) => !isHiddenCategory(p.category))).slice(0, 4);
    return (
      <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#fff" }}>
        <PageHero crumbs={[{ label: "Cart" }]} eyebrow="Your cart" title="Your cart is empty.">
          Browse our catalogue of 81 research-grade peptides, each independently verified with a published Janoshik report.
        </PageHero>
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-14">
          {isAdminTestCheckout && (
            <p className="mb-6 max-w-xl rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold" style={{ color: "#85683A", background: "#F8F4EF", borderColor: "#CDB894" }}>
              Your £1 {isCryptoTestCheckout ? "crypto" : "Wallid"} test session stays active in this browser tab while you add a product, then return to your cart.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/all-peptides" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
              Browse all peptides <ChevronRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/bundle-and-save" className="inline-flex items-center rounded-full border px-6 py-3.5 text-[14px] font-semibold transition-colors hover:bg-[#F4F5F8]" style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
              Bundle &amp; save
            </Link>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-14">
              <p className="mb-5 uppercase" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", color: "var(--cobalt)" }}>Popular with researchers</p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                {suggestions.map((g) => <CatalogueCard key={g.baseName} group={g} />)}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  const isUK = delivery.country === "United Kingdom";
  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const shippingCost = selectedShipping.id === "standard"
    ? standardShippingPriceGbpForCountry(delivery.country)
    : selectedShipping.price;
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const loyaltyDiscountGbp = loyaltyPointsToRedeem / 100;
  const freePeptideDeductGbp = redeemFreePeptide && referralCreditGbp > 0 ? Math.min(referralCreditGbp, cartGBP) : 0;
  const totalGBP = Math.max(0, cartGBP + shippingCost - bundleDiscountAmount - discountAmount - loyaltyDiscountGbp - freePeptideDeductGbp);
  const bankPaymentQuote = (
    paymentMethod === "wallid" &&
    paymentQuoteInputKey === currentPaymentQuoteInputKey &&
    paymentQuote &&
    new Date(paymentQuote.expiresAt).getTime() > Date.now()
  ) ? paymentQuote : null;
  const checkoutSubtotalGbp = bankPaymentQuote?.subtotalGbp ?? cartGBP;
  const checkoutShippingCostGbp = bankPaymentQuote?.shippingCostGbp ?? shippingCost;
  const checkoutBundleDiscountGbp = bankPaymentQuote?.bundleDiscountGbp ?? bundleDiscountAmount;
  const checkoutDiscountGbp = bankPaymentQuote?.discountAmountGbp ?? discountAmount;
  const checkoutLoyaltyDiscountGbp = bankPaymentQuote?.loyaltyDiscountGbp ?? loyaltyDiscountGbp;
  const checkoutReferralCreditGbp = bankPaymentQuote?.referralCreditGbp ?? freePeptideDeductGbp;
  const checkoutTotalGbp = isCryptoTestCheckout ? 1 : bankPaymentQuote?.totalGbp ?? totalGBP;
  const checkoutTestPaymentAdjustmentGbp = isCryptoTestCheckout
    ? Math.max(0, Math.round((totalGBP - 1) * 100) / 100)
    : bankPaymentQuote?.testPayment?.adjustmentGbp ?? 0;
  const displayedPaymentTotal = bankPaymentQuote
    ? bankPaymentQuote.paymentAmountMinor / 100
    : null;
  const bankPaymentReady = paymentMethod !== "wallid" || (
    Boolean(bankPaymentQuote) && !paymentQuoteLoading && !paymentQuoteError
  );
  const selectedPhonePrefix = phoneCountryCode === "custom"
    ? customPhoneCountryCode.trim()
    : phoneCountryCode;
  const orderPhone = delivery.phone.trim()
    ? [selectedPhonePrefix, delivery.phone.trim()].filter(Boolean).join(" ")
    : undefined;

  const setD = (f: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (ADDRESS_FIELDS.has(f)) {
      setAddressVerification(null);
      setPendingAddressVerification(null);
      setAddressVerificationError(null);
      addressSuggestionRequest.current += 1;
      lastAddressSuggestionKey.current = null;
      setAddressSuggestions([]);
      setAddressSuggestionsError(null);
      setAddressSuggestionsSearched(false);
    }
    setDelivery(d => ({ ...d, [f]: e.target.value }));
  };

  async function findAddressMatches(
    changes: Partial<Pick<DeliveryForm, "address1" | "address2" | "postcode" | "country">> = {},
  ) {
    const lookup = { ...delivery, ...changes };
    const lookupPostcodeOptional = POSTCODE_OPTIONAL_COUNTRIES.has(lookup.country);
    const lookupHasUsablePostcode = !lookupPostcodeOptional && lookup.postcode.trim().length >= 3;
    const lookupCanSearch =
      lookup.address1.trim().length >= 1 &&
      (lookupHasUsablePostcode || (lookupPostcodeOptional && lookup.address1.trim().length >= 3));
    if (!lookupCanSearch) return;

    const lookupKey = [
      lookup.address1.trim().toLocaleLowerCase("en-GB"),
      lookup.address2.trim().toLocaleLowerCase("en-GB"),
      lookup.postcode.trim().toLocaleUpperCase("en-GB"),
      lookup.country,
    ].join("|");
    const cached = addressSuggestionCache.current.get(lookupKey);
    if (cached && cached.expiresAt > Date.now()) {
      lastAddressSuggestionKey.current = lookupKey;
      setAddressSuggestions(cached.suggestions);
      setAddressSuggestionsLoading(false);
      setAddressSuggestionsError(null);
      setAddressSuggestionsSearched(true);
      return;
    }
    if (cached) addressSuggestionCache.current.delete(lookupKey);
    if (lastAddressSuggestionKey.current === lookupKey) return;

    lastAddressSuggestionKey.current = lookupKey;
    const requestId = ++addressSuggestionRequest.current;
    setAddressSuggestionsLoading(true);
    setAddressSuggestionsError(null);
    setAddressSuggestionsSearched(false);
    try {
      const res = await fetch(apiUrl("address-suggestions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address1: lookup.address1,
          address2: lookup.address2 || undefined,
          postcode: lookup.postcode,
          country: lookup.country,
        }),
      });
      const data = await res.json().catch(() => ({})) as {
        error?: string;
        suggestions?: AddressSuggestion[];
      };
      if (!res.ok || !Array.isArray(data.suggestions)) {
        throw new Error(data.error ?? "We could not find matching addresses. Please check the details.");
      }
      if (requestId !== addressSuggestionRequest.current) return;
      if (addressSuggestionCache.current.size >= ADDRESS_SUGGESTION_CACHE_MAX_ENTRIES) {
        const oldestKey = addressSuggestionCache.current.keys().next().value;
        if (oldestKey) addressSuggestionCache.current.delete(oldestKey);
      }
      addressSuggestionCache.current.set(lookupKey, {
        expiresAt: Date.now() + ADDRESS_SUGGESTION_CACHE_TTL_MS,
        suggestions: data.suggestions,
      });
      setAddressSuggestions(data.suggestions);
      setAddressSuggestionsSearched(true);
    } catch (error) {
      if (requestId !== addressSuggestionRequest.current) return;
      lastAddressSuggestionKey.current = null;
      setAddressSuggestions([]);
      setAddressSuggestionsSearched(true);
      setAddressSuggestionsError(
        error instanceof Error
          ? error.message
          : "Address lookup is temporarily unavailable. Please try again later.",
      );
    } finally {
      if (requestId === addressSuggestionRequest.current) {
        setAddressSuggestionsLoading(false);
      }
    }
  }

  function applyAddressSuggestion(suggestion: AddressSuggestion) {
    const { canonicalAddress } = suggestion;
    setDelivery(current => ({
      ...current,
      address1: canonicalAddress.address1,
      address2: canonicalAddress.address2 ?? "",
      city: canonicalAddress.city,
      county: canonicalAddress.county ?? "",
      postcode: canonicalAddress.postcode,
      country: canonicalAddress.country,
    }));
    setAddressVerification(null);
    setPendingAddressVerification(suggestion);
    setManualAddressEntry(true);
    setAddressVerificationError(null);
    setAddressSuggestions([]);
    setAddressSuggestionsError(null);
    setAddressSuggestionsSearched(false);
    setErrors(current => {
      const {
        address1: _address1,
        address2: _address2,
        city: _city,
        county: _county,
        postcode: _postcode,
        country: _country,
        addressVerification: _addressVerification,
        ...rest
      } = current;
      return rest;
    });
  }

  function enterAddressManually() {
    setManualAddressEntry(true);
    void onPostcodeBlur(delivery.postcode, delivery.country);
  }

  function validateAddressFields(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!delivery.address1.trim()) e.address1 = "Required";
    if (!delivery.city.trim()) e.city = "Required";
    if (!delivery.country.trim()) e.country = "Required";
    if (!postcodeOptional && !delivery.postcode.trim()) {
      e.postcode = "Required";
    } else {
      const rule = POSTCODE_RULES[delivery.country];
      if (delivery.postcode.trim() && rule && !rule.pattern.test(delivery.postcode.trim())) {
        e.postcode = rule.message;
      }
    }
    return e;
  }

  function validateAll(): Record<string, string> {
    const e = validateAddressFields();
    if (!delivery.email.includes("@")) e.email = "Valid email required";
    if (!delivery.firstName.trim()) e.firstName = "Required";
    if (!delivery.lastName.trim()) e.lastName = "Required";
    return e;
  }

  async function verifyDeliveryAddress() {
    const fieldErrors = validateAddressFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(current => ({ ...current, ...fieldErrors }));
      return;
    }

    setAddressVerificationLoading(true);
    setAddressVerificationError(null);
    setAddressVerification(null);
    setPendingAddressVerification(null);
    try {
      const res = await fetch(apiUrl("address-verification"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address1: delivery.address1,
          address2: delivery.address2 || undefined,
          city: delivery.city,
          county: delivery.county || undefined,
          postcode: delivery.postcode,
          country: delivery.country,
        }),
      });
      const data = await res.json().catch(() => ({})) as {
        error?: string;
        canonicalAddress?: CanonicalAddress;
        verificationToken?: string;
        expiresAt?: string;
      };
      if (
        !res.ok ||
        !data.canonicalAddress ||
        !data.verificationToken ||
        !data.expiresAt
      ) {
        throw new Error(data.error ?? "We could not verify that address. Check the details and try again.");
      }
      setPendingAddressVerification({
        canonicalAddress: data.canonicalAddress,
        verificationToken: data.verificationToken,
        expiresAt: data.expiresAt,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Address verification is temporarily unavailable. Please try again.";
      setAddressVerificationError(message);
      setErrors(current => ({ ...current, addressVerification: message }));
    } finally {
      setAddressVerificationLoading(false);
    }
  }

  function useVerifiedAddress() {
    if (!pendingAddressVerification) return;
    const { canonicalAddress } = pendingAddressVerification;
    setDelivery(current => ({
      ...current,
      address1: canonicalAddress.address1,
      address2: canonicalAddress.address2 ?? "",
      city: canonicalAddress.city,
      county: canonicalAddress.county ?? "",
      postcode: canonicalAddress.postcode,
      country: canonicalAddress.country,
    }));
    setAddressVerification(pendingAddressVerification);
    setPendingAddressVerification(null);
    setAddressVerificationError(null);
    setErrors(current => {
      const { addressVerification: _addressVerification, ...rest } = current;
      return rest;
    });
  }

  async function applyDiscountCode(code: string, showError: boolean) {
    if (!code.trim()) return;
    setApplyingDiscount(true);
    if (showError) setDiscountError(null);
    try {
      const res = await fetch(apiUrl("discounts/validate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), cartTotal: cartGBP }),
      });
      const data = await res.json() as { valid: boolean; error?: string; code?: string; type?: string; value?: number; discountAmount?: number };
      if (data.valid && data.code && data.discountAmount !== undefined) {
        setAppliedDiscount({ code: data.code, type: data.type!, value: data.value!, discountAmount: data.discountAmount });
        setDiscountInput("");
        setDiscountError(null);
      } else {
        if (showError) setDiscountError(data.error ?? "Invalid discount code");
        else window.localStorage.removeItem("omniqure:affiliate-discount");
        setAppliedDiscount(null);
      }
    } catch {
      if (showError) setDiscountError("Could not verify discount code. Please try again.");
    } finally {
      setApplyingDiscount(false);
    }
  }

  async function applyDiscount() {
    await applyDiscountCode(discountInput, true);
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
    if (paymentMethod === "wallid") {
      if (!bankPaymentReady || !bankPaymentQuote) {
        setPlaceError(paymentQuoteError ?? "Confirming your exact payment total. Please wait a moment and try again.");
        return;
      }
      if (new Date(bankPaymentQuote.expiresAt).getTime() <= Date.now()) {
        setPaymentQuote(null);
        setPaymentQuoteRefresh((current) => current + 1);
        setPlaceError("Your payment total has expired. We’re refreshing it now—please review it and place your order again.");
        return;
      }
    }
    if (paymentMethod === "crypto" && !cryptoRoute) {
      setPlaceError("Choose an available crypto route before placing your order.");
      return;
    }
    if (paymentMethod === "crypto" && isCryptoTestCheckout && cryptoTestStatus !== "active") {
      setPlaceError(
        cryptoTestStatus === "checking"
          ? "Checking your crypto test link. Please wait a moment and try again."
          : "This crypto test link is invalid or expired. Create a new link from the admin panel.",
      );
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
            phone: orderPhone,
            address1: delivery.address1,
            address2: delivery.address2 || undefined,
            city: delivery.city,
            county: delivery.county || undefined,
            postcode: delivery.postcode,
            country: delivery.country,
            addressVerificationToken: addressVerification?.verificationToken,
          },
          shippingMethod: selectedShipping.label,
          shippingCostGbp: shippingCost,
          items: items.map(({ product, quantity }) => {
            const slug = (product as { slug?: string }).slug ?? "";
            // Prefer the live API price over the stored cart price — this prevents
            // stale localStorage prices (e.g. from before a price-sheet update) from
            // causing a server-side price-mismatch rejection.
            const priceGbp = (slug && livePriceBySlug[slug] != null)
              ? livePriceBySlug[slug]
              : (product.price ?? 0);
            return {
              productId: parseInt(String(product.id)) || 0,
              productSlug: slug,
              productName: product.name,
              productCategory: product.category ?? "",
              quantity,
              priceGbp,
            };
          }),
          discountCode: appliedDiscount?.code ?? null,
          loyaltyPointsRedeemed: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
          redeemFreePeptide: redeemFreePeptide && referralCreditGbp > 0 ? true : undefined,
          paymentMethod,
          paymentCurrency: paymentMethod === "wallid" ? paymentCurrency : undefined,
          paymentQuoteToken: paymentMethod === "wallid" ? bankPaymentQuote?.paymentQuoteToken : undefined,
          wallidTestToken: paymentMethod === "wallid" ? wallidTestToken ?? undefined : undefined,
          cryptoCurrency: paymentMethod === "crypto" ? cryptoRoute?.currency : undefined,
          cryptoNetwork: paymentMethod === "crypto" ? cryptoRoute?.network : undefined,
          cryptoTestToken: paymentMethod === "crypto" ? cryptoTestToken ?? undefined : undefined,
        }),
      });

      if (res.status === 422) {
        const body = await res.json().catch(() => ({})) as { error?: string; stockErrors?: { productName: string; available: number; requested: number }[] };
        setStockErrors(body.stockErrors ?? []);
        setPlaceError(body.error ?? "Some items in your cart are unavailable.");
        setPlacing(false);
        return;
      }

      if (res.status === 409 && paymentMethod === "wallid") {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setPaymentQuote(null);
        setPaymentQuoteRefresh((current) => current + 1);
        setPlaceError(body.error ?? "Your payment total changed. We’re refreshing it now—please review it and place your order again.");
        setPlacing(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Order failed" })) as { error?: string };
        throw new Error(err.error ?? "Order failed");
      }

      const data = await res.json() as {
        orderNumber: string; customerName: string; totalGbp: number; shippingMethod: string;
        cryptoPaymentToken?: string;
        cryptoPayment?: { currency: string; network: string; walletAddress: string; expectedAmount: string; rateExpiresAt: string };
        wallidPaymentUrl?: string;
        paymentCurrency?: "GBP" | "EUR"; paymentAmountMinor?: number;
      };

      // Retain only same-browser, post-checkout account context. This lets the
      // registration page prefill the guest's identity without putting email
      // addresses into payment-return URLs.
      try {
        window.sessionStorage.setItem("omniqure:checkout-account", JSON.stringify({
          orderNumber: data.orderNumber,
          firstName: delivery.firstName,
          lastName: delivery.lastName,
          email: delivery.email,
        }));
      } catch {
        // Account creation remains available if storage is unavailable.
      }

      // Wallid: redirect to hosted payment page.
      // Cart is NOT cleared before redirect — WallidReturn clears it on confirmed
      // success. If payment is cancelled or fails, the cart remains intact for retry.
      if (paymentMethod === "wallid" && data.wallidPaymentUrl) {
        if (wallidTestToken) clearSavedWallidTestToken();
        window.location.href = data.wallidPaymentUrl;
        return;
      }

      if (cryptoTestToken) clearSavedCryptoTestToken();
      clearCart();

      const params = new URLSearchParams({
        order: data.orderNumber,
        name: delivery.firstName,
        total: data.totalGbp.toFixed(2),
        ship: data.shippingMethod,
        payment: paymentMethod,
      });
      if (paymentMethod === "crypto" && data.cryptoPaymentToken) {
        params.set("cryptoToken", data.cryptoPaymentToken);
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

  // One label for every "Place order" button: the exact amount the shopper pays.
  const payTotalLabel = bankPaymentQuote
    ? `${bankPaymentQuote.paymentCurrency === "EUR" ? "€" : "£"}${(bankPaymentQuote.paymentAmountMinor / 100).toFixed(2)}`
    : `£${checkoutTotalGbp.toFixed(2)}`;
  const ctaDisabled = placing || !bankPaymentReady;

  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      {isWallidTestCheckout && (
        <div style={{
          background: wallidTestStatus === "invalid" ? "#F8F2F3" : "#F8F4EF",
          borderBottom: `1px solid ${wallidTestStatus === "invalid" ? "#C9939A" : "#CDB894"}`,
          color: wallidTestStatus === "invalid" ? "#9C4A44" : "#85683A",
          padding: "10px 16px", textAlign: "center", fontSize: "13px", fontWeight: 700,
        }}>
          {wallidTestStatus === "invalid"
            ? "This £1 Wallid test checkout link is invalid, expired, or no longer authorised. Generate a new link from the admin panel."
            : wallidTestStatus === "checking"
              ? "Verifying your admin Wallid test checkout…"
              : "Admin Wallid test checkout — this is a real £1.00 bank payment and expires shortly."}
        </div>
      )}
      {isCryptoTestCheckout && (
        <div
          data-testid="status-crypto-test-checkout"
          style={{
            background: cryptoTestStatus === "invalid" ? "#F8F2F3" : "#EFF2EF",
            borderBottom: `1px solid ${cryptoTestStatus === "invalid" ? "#C9939A" : "#94A895"}`,
            color: cryptoTestStatus === "invalid" ? "#9C4A44" : "#0A2472",
            padding: "10px 16px", textAlign: "center", fontSize: "13px", fontWeight: 700,
          }}
        >
          {cryptoTestStatus === "invalid"
            ? "This £1 crypto test checkout is unavailable, expired, or has no configured payment route. Generate a new link from the admin panel."
            : cryptoTestStatus === "checking"
              ? "Checking configured crypto payment routes…"
              : "Admin crypto test checkout — this creates a real £1.00 on-chain payment and expires shortly."}
        </div>
      )}


      {/* ── Research warning ── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: "#85683A", flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: "#4A5672" }}>
            <strong style={{ color: "#1D2948" }}>Research use only.</strong> All products are for in-vitro laboratory research. Not for human or veterinary use. Must be 18+ to purchase.
          </p>
        </div>
      </div>

      {/* ── Header bar ── */}
      <div style={{ borderBottom: "1px solid rgba(11,18,32,0.09)", backgroundColor: "#fff" }}>
        <div className="checkout-breadcrumb-bar max-w-[1280px] mx-auto px-6" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
          <h1 style={{ fontSize: "26px", fontWeight: 600, letterSpacing: "-0.02em", color: "#1D2948" }}>
            My Cart
            <span className="ml-2 font-normal" style={{ fontSize: "14px", letterSpacing: 0, color: "#4A5672" }}>
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>
          <div className="checkout-step-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4A5672", fontSize: "10px" }}>
            <Lock size={12} />
            <span style={{ fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" }}>Secure checkout</span>
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
          <div className="form-grid-2 form-grid-contact" style={{ marginBottom: 12 }}>
            <div>
              <label style={label}>Email *</label>
              <input
                data-field="email"
                value={delivery.email} onChange={setD("email")} type="email"
                placeholder="your@email.com" style={inp("email")}
                onFocus={e => { if (!errors.email) e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.email ? "#9C4A44" : THEME.inputBorder; }}
              />
              {errors.email && <p style={errText}>{errors.email}</p>}
            </div>
            <div>
              <label style={label}>Phone</label>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(105px, 0.42fr) minmax(0, 1fr)", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    aria-label="Phone country code"
                    aria-haspopup="listbox"
                    aria-expanded={phoneCodeDropdownOpen}
                    onClick={() => setPhoneCodeDropdownOpen(open => !open)}
                    style={{
                      ...input,
                      width: "100%",
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#4E68C2"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }}
                  >
                    <span>
                      {phoneCountryCode === "custom"
                        ? customPhoneCountryCode.trim() || "Other"
                        : phoneCountryCode}
                    </span>
                    <span aria-hidden="true" style={{ fontSize: 12, color: THEME.textMuted }}>⌄</span>
                  </button>
                  {phoneCodeDropdownOpen && (
                    <div
                      role="listbox"
                      aria-label="Phone country codes"
                      style={{
                        position: "absolute",
                        zIndex: 20,
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        maxHeight: 240,
                        overflowY: "auto",
                        padding: 4,
                        border: `1px solid ${THEME.inputBorder}`,
                        borderRadius: 6,
                        background: "#fff",
                        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
                      }}
                    >
                      {SHIPPABLE_PHONE_COUNTRY_CODES.map(option => (
                        <button
                          key={option.code}
                          type="button"
                          role="option"
                          aria-selected={phoneCountryCode === option.code}
                          onClick={() => {
                            phoneCountryCodeTouched.current = true;
                            setPhoneCountryCode(option.code);
                            if (option.code !== "custom") setCustomPhoneCountryCode("");
                            setPhoneCodeDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            width: "100%",
                            border: "none",
                            borderRadius: 4,
                            background: phoneCountryCode === option.code ? "#fff" : "#fff",
                            color: THEME.text,
                            padding: "8px 7px",
                            fontSize: "11px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          <span>{option.code === "custom" ? "Other country" : option.country}</span>
                          <span style={{ color: THEME.textSub, fontWeight: 700 }}>
                            {option.code === "custom" ? "—" : option.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  data-field="phone"
                  value={delivery.phone} onChange={setD("phone")} type="tel"
                  placeholder="Local number" style={input}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4E68C2"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }}
                />
              </div>
              {phoneCountryCode === "custom" && (
                <input
                  aria-label="Custom phone country code"
                  value={customPhoneCountryCode}
                  onChange={e => setCustomPhoneCountryCode(e.target.value)}
                  inputMode="tel"
                  placeholder="+358"
                  style={{ ...input, marginTop: 8 }}
                />
              )}
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
                onFocus={e => { if (!errors.firstName) e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.firstName ? "#9C4A44" : THEME.inputBorder; }} />
              {errors.firstName && <p style={errText}>{errors.firstName}</p>}
            </div>
            <div>
              <label style={label}>Last Name *</label>
              <input data-field="lastName" value={delivery.lastName} onChange={setD("lastName")} placeholder="Last Name" style={inp("lastName")}
                onFocus={e => { if (!errors.lastName) e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.lastName ? "#9C4A44" : THEME.inputBorder; }} />
              {errors.lastName && <p style={errText}>{errors.lastName}</p>}
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: 12 }}>
            <div>
              <label style={label}>Country *</label>
              <select data-field="country" value={delivery.country} onChange={e => {
                const nextCountry = e.target.value;
                setD("country")(e);
                if (!phoneCountryCodeTouched.current) {
                  setPhoneCountryCode(PHONE_CODE_BY_COUNTRY[nextCountry] ?? "custom");
                }
                void findAddressMatches({ country: e.target.value });
              }}
                style={{ ...inp("country"), height: 44, appearance: "none", cursor: "pointer" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.country ? "#9C4A44" : THEME.inputBorder; }}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.country && <p style={errText}>{errors.country}</p>}
            </div>
            <div>
              <label style={label}>
                {postcodeLabel}{postcodeOptional
                  ? <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "10px" }}> (optional)</span>
                  : " *"}
              </label>
              <input data-field="postcode" value={delivery.postcode}
                autoComplete="off"
                onChange={e => {
                  setD("postcode")(e);
                  const val = e.target.value;
                  if (addressSuggestionDebounce.current) clearTimeout(addressSuggestionDebounce.current);
                  addressSuggestionDebounce.current = setTimeout(() => {
                    void findAddressMatches({ postcode: val });
                  }, 420);
                }}
                placeholder={postcodeLabel} style={inp("postcode")}
                onFocus={e => { if (!errors.postcode) e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = errors.postcode ? "#9C4A44" : THEME.inputBorder;
                  void onPostcodeBlur(e.currentTarget.value, delivery.country);
                }} />
              {postcodeLoading && <p style={{ fontSize: "12px", color: THEME.textMuted, marginTop: 4 }}>Looking up postcode…</p>}
              {errors.postcode && <p style={errText}>{errors.postcode}</p>}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={label}>Address Line 1 *</label>
            <div style={{ position: "relative" }}>
              <input
                data-field="address1"
                value={delivery.address1}
                autoComplete="off"
                onChange={e => {
                  setD("address1")(e);
                  const val = e.target.value;
                  if (addressSuggestionDebounce.current) clearTimeout(addressSuggestionDebounce.current);
                  addressSuggestionDebounce.current = setTimeout(() => {
                    void findAddressMatches({ address1: val });
                  }, 420);
                }}
                placeholder="Street address"
                style={inp("address1")}
                onFocus={e => { if (!errors.address1) e.currentTarget.style.borderColor = "#4E68C2"; }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.address1 ? "#9C4A44" : THEME.inputBorder; }}
              />

              {/* ── Inline autocomplete dropdown ── */}
              {(addressSuggestionsLoading || addressSuggestions.length > 0) && (
                <div
                  role="listbox"
                  aria-label="Address suggestions"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 3px)",
                    left: 0,
                    right: 0,
                    zIndex: 60,
                    background: "#fff",
                    border: "1px solid #D3D8E2",
                    borderRadius: 10,
                    boxShadow: "none",
                    overflow: "hidden",
                  }}
                >
                  {addressSuggestionsLoading ? (
                    <div style={{ padding: "13px 16px", fontSize: "13px", color: THEME.textMuted }}>
                      Finding matching addresses…
                    </div>
                  ) : (
                    <>
                      {addressSuggestions.map((suggestion, idx) => (
                        <button
                          key={suggestion.verificationToken}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onMouseDown={e => { e.preventDefault(); applyAddressSuggestion(suggestion); }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                            borderBottom: idx < addressSuggestions.length - 1 ? "1px solid #F4F5F8" : "none",
                            background: "#fff",
                            cursor: "pointer",
                            padding: "11px 16px",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#F4F5F8"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                        >
                          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: THEME.text, lineHeight: 1.35 }}>
                            {suggestion.canonicalAddress.address1}
                          </p>
                          <p style={{ margin: "3px 0 0", fontSize: "12px", color: THEME.textSub, lineHeight: 1.5 }}>
                            {suggestion.canonicalAddress.formattedAddress}
                          </p>
                        </button>
                      ))}
                      <div style={{ padding: "6px 16px", borderTop: "1px solid #F4F5F8", background: "#F4F5F8" }}>
                        <p style={{ margin: 0, fontSize: "11px", color: THEME.textMuted }}>
                          © OpenStreetMap contributors
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* No results — prompt to fill in fields below */}
              {addressSuggestionsSearched && !addressSuggestionsLoading && !addressSuggestionsError && addressSuggestions.length === 0 && (
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: THEME.textMuted }}>
                  No address found — please fill in your details below.
                </p>
              )}
              {addressSuggestionsError && (
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: THEME.textMuted }}>
                  Address lookup unavailable — please enter your address below.
                </p>
              )}
            </div>
            {errors.address1 && <p style={errText}>{errors.address1}</p>}
          </div>

          {showFullAddressFields && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={label}>Apt, Suite, Etc. (Optional)</label>
                <input value={delivery.address2} onChange={setD("address2")} placeholder="Apartment, suite, etc." style={input}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4E68C2"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }} />
              </div>

              <div className="form-grid-2" style={{ marginBottom: 12 }}>
                <div>
                  <label style={label}>City *</label>
                  <input data-field="city" value={delivery.city} onChange={setD("city")} placeholder="City" style={inp("city")}
                    onFocus={e => { if (!errors.city) e.currentTarget.style.borderColor = "#4E68C2"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.city ? "#9C4A44" : THEME.inputBorder; }} />
                  {errors.city && <p style={errText}>{errors.city}</p>}
                </div>
                <div>
                  <label style={label}>{countyStateLabel} <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "10px" }}>(optional)</span></label>
                  <input value={delivery.county} onChange={setD("county")}
                    placeholder={usesStateProvince ? (delivery.country === "Canada" ? "Province" : "State") : "County / Region"}
                    style={input}
                    onFocus={e => { e.currentTarget.style.borderColor = "#4E68C2"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = THEME.inputBorder; }} />
                </div>
              </div>
            </>
          )}



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
            {!isCryptoTestCheckout && (() => {
              const active = paymentMethod === "wallid";
              return (
                <div
                  onClick={() => setPaymentMethod("wallid")}
                  style={{
                    border: `${active ? 2 : 1}px solid ${active ? "#4E68C2" : "rgba(11,18,32,0.12)"}`,
                    borderRadius: 6, overflow: "hidden", cursor: "pointer",
                    background: "#fff",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 16px 0" }}>
                    <input
                      type="radio" checked={active} onChange={() => setPaymentMethod("wallid")}
                      style={{ accentColor: "#4E68C2", width: 18, height: 18, flexShrink: 0, marginTop: 2, cursor: "pointer" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "16px", fontWeight: 600, color: "#22252C" }}>Pay by Bank</span>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em",
                          border: "1.5px solid #1D2948", color: "#1D2948",
                          padding: "1px 7px", borderRadius: 4, textTransform: "uppercase",
                        }}>Recommended · fastest</span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#4A5672", margin: "6px 0 0", lineHeight: 1.4 }}>
                        Tap your bank, approve in your banking app — done in seconds.
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "14px 16px 16px 46px" }}>
                    {/* Payment currency */}
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#4A5672", margin: "0 0 8px", textTransform: "uppercase" }}>
                        Pay in
                      </p>
                      <div role="radiogroup" aria-label="Pay by Bank currency" style={{ display: "flex", gap: 8 }}>
                        {([
                          { code: "GBP" as const, label: "£ GBP" },
                          { code: "EUR" as const, label: "€ EUR" },
                        ].filter(option => !isWallidTestCheckout || option.code === "GBP")).map(option => {
                          const selected = paymentCurrency === option.code;
                          return (
                            <button
                              key={option.code}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={event => {
                                event.stopPropagation();
                                if (!isWallidTestCheckout) {
                                  paymentCurrencyChosen.current = true;
                                  setPaymentCurrency(option.code);
                                }
                              }}
                              style={{
                                flex: 1, padding: "9px 10px", borderRadius: 7, cursor: "pointer",
                                border: `1.5px solid ${selected ? "#1D2948" : "rgba(11,18,32,0.12)"}`,
                                background: selected ? "#1D2948" : "#fff",
                                color: selected ? "#fff" : "#22252C",
                                fontSize: "13px", fontWeight: 600,
                              }}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                      <p style={{ fontSize: "12px", color: paymentQuoteError ? "#9C4A44" : "#4A5672", margin: "8px 0 0", lineHeight: 1.45 }}>
                        {paymentQuoteLoading ? (
                          "Confirming your exact payment total…"
                        ) : displayedPaymentTotal !== null && bankPaymentQuote ? (
                          <>You&apos;ll pay <strong style={{ color: "#22252C" }}>
                            {bankPaymentQuote.paymentCurrency === "EUR" ? "€" : "£"}
                            {displayedPaymentTotal.toFixed(2)} {bankPaymentQuote.paymentCurrency}
                          </strong>. This secured total is the exact amount sent to your bank.</>
                        ) : (
                          paymentQuoteError ?? "Your exact payment total is not available yet. Please wait before placing your order."
                        )}
                      </p>
                    </div>

                    {/* Trust line */}
                    <p style={{ fontSize: "12px", color: "#4A5672", margin: "0 0 12px", lineHeight: 1.5 }}>
                      Pay by Card / Bank Transfer via Wallid
                    </p>

                    {/* Bank logos */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      {BANK_SVGS.map(b => (
                        <div key={b.name} title={b.name} style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: "#fff", border: "1px solid #D3D8E2",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, overflow: "hidden",
                          boxShadow: "none",
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
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#4A5672", marginLeft: 2 }}>+more</span>
                    </div>

                    {/* How it works */}
                    <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: "#4A5672", margin: "0 0 10px", textTransform: "uppercase" }}>
                      How it works
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {["Choose your bank", "Approve in your banking app", "Order confirmed instantly"].map((step, i) => (
                        <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: "50%",
                            border: "1.5px solid #1D2948", color: "#1D2948",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: 600, flexShrink: 0,
                          }}>{i + 1}</span>
                          <span style={{ fontSize: "13px", color: "#22252C", fontWeight: 500 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Cryptocurrency */}
            {!isWallidTestCheckout && cryptoRoutes.length > 0 && (() => {
              const active = paymentMethod === "crypto";
              return (
                <div
                  onClick={() => setPaymentMethod("crypto")}
                  style={{ border: `1px solid ${active ? "#4E68C2" : "rgba(11,18,32,0.09)"}`, borderRadius: 6, cursor: "pointer", background: active ? "#fff" : THEME.cardBg }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    <input type="radio" checked={active} onChange={() => setPaymentMethod("crypto")}
                      style={{ accentColor: THEME.cta, width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: THEME.text }}>Cryptocurrency</span>
                      <p style={{ fontSize: "12px", color: THEME.textMuted, margin: "2px 0 0" }}>Pay from your wallet with a verified on-chain payment</p>
                    </div>
                  </div>
                  {active && (
                    <div style={{ borderTop: "1px solid #F4F5F8", padding: "14px 16px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {cryptoRoutes.map(route => {
                          const meta = CRYPTO_META[route.currency];
                          const selected = cryptoRoute?.currency === route.currency && cryptoRoute?.network === route.network;
                          return (
                          <button key={`${route.network}:${route.currency}`} type="button" onClick={e => { e.stopPropagation(); setCryptoRoute(route); }}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "6px 12px", borderRadius: 100, border: "1px solid",
                              borderColor: selected ? THEME.cta : "#D3D8E2",
                              background: selected ? THEME.cta : "#F4F5F8",
                              color: selected ? "#fff" : THEME.textSub,
                              fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              width: 18, height: 18, borderRadius: "50%",
                              background: selected ? "rgba(255,255,255,0.25)" : meta.color,
                              color: "#fff", fontSize: "9px", fontWeight: 800, flexShrink: 0,
                            }}>{meta.symbol}</span>
                            {route.currency} · {networkLabel(route.network)}
                          </button>
                          );
                        })}
                      </div>
                      {cryptoRoute && (
                        <p style={{ fontSize: "12px", color: THEME.textMuted, margin: "12px 0 0", lineHeight: 1.45 }}>
                          You&apos;ll receive the exact {cryptoRoute.currency} amount and verified wallet address after placing the order. Rate locks last 15 minutes.
                        </p>
                      )}
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
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#F8F2F3", border: "1px solid #C9939A", borderRadius: 6, fontSize: "13px", color: "#9C4A44" }}>
              {placeError}
            </div>
          )}
          {stockErrors.length > 0 && (
            <div style={{ marginBottom: 12, padding: "10px 12px", background: "#F8F2F3", border: "1px solid #C9939A", borderRadius: 6, fontSize: "13px", color: "#9C4A44" }}>
              {stockErrors.map(e => (
                <p key={e.productName} style={{ margin: "0 0 4px" }}>
                  {e.productName}: low stock. Reduce the requested quantity.
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={placing || !bankPaymentReady}
            style={{
              width: "100%", height: 54, borderRadius: 999,
              background: placing || !bankPaymentReady ? "#4A5672" : THEME.cta,
              color: "#fff", border: "none",
              fontSize: "15px", fontWeight: 600,
              cursor: placing || !bankPaymentReady ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!placing && bankPaymentReady) (e.currentTarget as HTMLButtonElement).style.background = THEME.ctaHover; }}
            onMouseLeave={e => { if (!placing && bankPaymentReady) (e.currentTarget as HTMLButtonElement).style.background = THEME.cta; }}
          >
            {placing ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Processing…
              </>
            ) : !bankPaymentReady ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Confirming Total…
              </>
            ) : (
              <>
                <Lock size={15} />
                Place order · {payTotalLabel}
              </>
            )}
          </button>

          <ul className="checkout-trust">
            <li><Shield size={13} /> Secure encrypted checkout</li>
            <li><Truck size={13} /> Free UK tracked delivery</li>
            <li><Clock size={13} /> Same-day dispatch, Mon–Fri</li>
          </ul>

          <Link href="/all-peptides" className="checkout-continue">
            ← Continue shopping
          </Link>

          {/* Upsells below Place Order — mobile only */}
          <div className="upsells-bottom" style={{ display: "none", marginTop: 20 }}>
            <div className="space-y-3">
              <CartUpsells />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN — SINGLE ORDER SUMMARY ── */}
        <div className="checkout-sidebar" style={{ width: 360, flexShrink: 0, position: "sticky", top: 88 }}>
          <div style={{ border: THEME.cardBorder, borderRadius: 6, background: "#fff", overflow: "hidden" }}>
            {/* Heading on desktop and tablet; a show/hide toggle with the total on phones */}
            <button
              type="button"
              className="checkout-summary-toggle"
              aria-expanded={summaryOpen}
              aria-controls="checkout-summary-body"
              onClick={() => setSummaryOpen(open => !open)}
            >
              <span className="checkout-summary-toggle__title">Order Summary</span>
              <span className="checkout-summary-toggle__hint">
                {summaryOpen ? "Hide" : "Show"} · {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
              <span className="checkout-summary-toggle__total">{payTotalLabel}</span>
              <ChevronDown size={16} className="checkout-summary-toggle__chev" aria-hidden="true" />
            </button>
            <div id="checkout-summary-body" className="checkout-summary-body" data-open={summaryOpen}>
            <div style={{ padding: "16px 20px 0" }}>
              {items.map(({ product, quantity }) => {
                const price = product.price ?? 0;
                const freeQty = Math.min(freeUnitsByProductId[product.id] ?? 0, quantity);
                return (
                  <div key={String(product.id)} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 4, border: "1px solid #D3D8E2", overflow: "hidden", background: STUDIO_BG }}>
                        {product.image ? (
                          <img src={getCatalogueVialImage(product.id, product.slug, product.image, product.sourceImage)} alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#8D9BB8" }}>IMG</div>
                        )}
                      </div>
                      <div style={{
                        position: "absolute", top: -6, right: -6,
                        minWidth: 20, height: 20, padding: "0 5px", borderRadius: 999,
                        background: "#1D2948", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                      }}>{quantity}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: THEME.text, margin: 0 }}>{product.name}</p>
                      {freeQty > 0 && (
                        <p style={{ fontSize: "11px", color: "#4F6B52", margin: "2px 0 0", fontWeight: 600 }}>
                          {freeQty} free (Bundle & Save)
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #D3D8E2", borderRadius: 8, overflow: "hidden" }}>
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="hover:bg-[#F4F5F8] transition-colors"
                            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5672", background: "none", border: "none", cursor: "pointer" }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <div style={{ width: 28, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1.5px solid #D3D8E2", borderRight: "1.5px solid #D3D8E2", color: "#22252C", fontSize: "12px", fontWeight: 700 }}>
                            {quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="hover:bg-[#F4F5F8] transition-colors"
                            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5672", background: "none", border: "none", cursor: "pointer" }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="hover:bg-[#F8F2F3] transition-colors"
                          style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, color: "#9C4A44", border: "1.5px solid #F8F2F3", background: "none", cursor: "pointer" }}
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
                  <div style={{ width: 56, height: 56, borderRadius: 4, border: "1px dashed #8D9BB8", background: "#fff", color: "#4E68C2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Droplets size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: THEME.text, margin: 0 }}>Bacteriostatic Water 10ml Ampule</p>
                    <p style={{ fontSize: "11px", color: "#4F6B52", margin: "2px 0 0", fontWeight: 600 }}>Free (Bundle & Save)</p>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#4F6B52", flexShrink: 0 }}>Free</div>
                </div>
              )}
            </div>

            {/* Bundle & Save progress nudge: one Chalk strip and a Cornflower
                bar, as in the cart preview. */}
            {(() => {
              const next = [
                { min: 3, label: "a free 10ml BAC water ampule" },
                { min: 5, label: "1 peptide free" },
                { min: 10, label: "2 peptides free" },
              ].find(t => peptideQty < t.min);
              const reached = bundleFreeItemsCount >= 2 ? "2 peptides free applied"
                : bundleFreeItemsCount === 1 ? "1 peptide free applied"
                : peptideQty >= 3 ? "Free BAC water unlocked" : null;
              return (
                <div className="checkout-bundle">
                  {reached && <p className="checkout-bundle__done"><Check size={13} /> {reached}</p>}
                  {next ? (
                    <>
                      <div className="checkout-bundle__row">
                        <span>Add <strong>{next.min - peptideQty} more</strong> for <strong>{next.label}</strong></span>
                        <span className="checkout-bundle__count">{peptideQty}/{next.min}</span>
                      </div>
                      <div className="checkout-bundle__bar"><span style={{ width: `${Math.min(100, (peptideQty / next.min) * 100)}%` }} /></div>
                    </>
                  ) : (
                    <p className="checkout-bundle__row">Top bundle tier reached.</p>
                  )}
                  <p className="checkout-bundle__tiers">3+ vials: free BAC water · 5+: 1 peptide free · 10+: 2 peptides free</p>
                </div>
              );
            })()}

            <hr style={{ margin: 0, border: "none", borderTop: THEME.divider }} />

            {/* BAC Water upsell — below cart items, above discount code */}
            <div style={{ padding: "16px 20px 4px" }}>
              <BacWaterUpsell />
            </div>

            {/* Discount code */}
            <div style={{ padding: "16px 20px" }}>
              {appliedDiscount ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#EFF2EF", border: "1px solid #94A895", borderRadius: 6 }}>
                  <span style={{ fontSize: "13px", color: "#4F6B52", fontWeight: 700 }}>
                    {appliedDiscount.code} — −£{appliedDiscount.discountAmount.toFixed(2)}
                  </span>
                  <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountError(null); setDiscountInput(""); }}
                    style={{ background: "none", border: "none", color: "#4F6B52", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>✕</button>
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
                        padding: "0 18px", height: 40, borderRadius: 999,
                        background: "#1D2948", color: "#fff",
                        border: "none", fontSize: "13px", fontWeight: 600,
                        cursor: "pointer", flexShrink: 0,
                        opacity: (applyingDiscount || !discountInput.trim()) ? 0.5 : 1,
                      }}>Apply</button>
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
                ["Subtotal", `£${checkoutSubtotalGbp.toFixed(2)}`],
                ["Shipping", checkoutShippingCostGbp === 0 ? "FREE" : `£${checkoutShippingCostGbp.toFixed(2)}`],
                ...(checkoutBundleDiscountGbp > 0 ? [["Bundle & Save", `−£${checkoutBundleDiscountGbp.toFixed(2)}`]] : []),
                ...(checkoutDiscountGbp > 0 ? [[`Discount (${appliedDiscount?.code})`, `−£${checkoutDiscountGbp.toFixed(2)}`]] : []),
                ...(checkoutLoyaltyDiscountGbp > 0 ? [["Loyalty Points", `−£${checkoutLoyaltyDiscountGbp.toFixed(2)}`]] : []),
                ...(checkoutReferralCreditGbp > 0 ? [["Referral Credit", `−£${checkoutReferralCreditGbp.toFixed(2)}`]] : []),
                ...(checkoutTestPaymentAdjustmentGbp > 0 ? [["Admin £1 test adjustment", `−£${checkoutTestPaymentAdjustmentGbp.toFixed(2)}`]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "13px", color: THEME.textMuted }}>{k}</span>
                  <span style={{ fontSize: "13px", color: v?.startsWith("−") || v === "FREE" ? "#4F6B52" : THEME.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{v === "FREE" ? "Free" : v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: THEME.divider }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: THEME.text }}>
                  {bankPaymentQuote ? "Pay by Bank total" : "Total"}
                </span>
                <span style={{ fontSize: "20px", fontWeight: 600, color: THEME.text, fontVariantNumeric: "tabular-nums" }}>
                  {bankPaymentQuote
                    ? `${bankPaymentQuote.paymentCurrency === "EUR" ? "€" : "£"}${(bankPaymentQuote.paymentAmountMinor / 100).toFixed(2)} ${bankPaymentQuote.paymentCurrency}`
                    : `£${checkoutTotalGbp.toFixed(2)}`}
                </span>
              </div>
              {/* Desktop: the order can be placed from the summary, which stays in
                  view. Validation scrolls to anything still missing. */}
              <button type="button" onClick={placeOrder} disabled={ctaDisabled} className="checkout-summary-cta">
                <Lock size={14} /> {ctaDisabled ? (placing ? "Processing…" : "Confirming total…") : `Place order · ${payTotalLabel}`}
              </button>
            </div>
            </div>

          </div>
        </div>
      </div>

      {items.length > 0 && createPortal(
        <div className="checkout-mobile-bar">
          <div>
            <span className="checkout-mobile-bar__label">Total</span>
            <span className="checkout-mobile-bar__total">{payTotalLabel}</span>
          </div>
          <button type="button" onClick={placeOrder} disabled={ctaDisabled}>
            <Lock size={14} /> {ctaDisabled ? (placing ? "Processing…" : "Confirming…") : "Place order"}
          </button>
        </div>,
        document.body,
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

        .form-grid-2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        .form-grid-2 > *, .form-grid-3 > * { min-width: 0; }
        .form-grid-2 input, .form-grid-2 select, .form-grid-3 input, .form-grid-3 select { min-width: 0; width: 100%; }
        .checkout-layout > * { min-width: 0; }
        /* Email and phone side by side only where the form column is wide */
        @media (max-width: 1023px) {
          .form-grid-contact { grid-template-columns: minmax(0,1fr); gap: 12px; }
        }

        /* Tablet: keep two columns with a narrower summary */
        @media (min-width: 768px) and (max-width: 1023px) {
          .checkout-layout { padding: 20px !important; gap: 20px !important; }
          .checkout-sidebar { width: 300px !important; }
        }

        @media (max-width: 767px) {
          .checkout-layout { flex-direction: column !important; align-items: stretch !important; padding: 12px !important; gap: 16px !important; }
          .checkout-layout > * { width: 100% !important; max-width: 100% !important; }
          .checkout-sidebar { width: 100% !important; position: static !important; order: -1 !important; }
          .form-grid-3 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
          /* 44px tap targets; 16px text stops iOS zooming into fields */
          input[type="text"], input[type="email"], input[type="tel"], input[type="search"], select {
            height: 44px !important;
            font-size: 16px !important;
          }
          .checkout-layout hr { margin: 18px 0 !important; }
          .upsells-top { display: none !important; }
          .upsells-bottom { display: block !important; }
        }
      `}</style>
    </div>
  );
}
