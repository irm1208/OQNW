import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CurrencyCode =
  | "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "CHF" | "JPY" | "SGD" | "NZD"
  | "DKK" | "NOK" | "SEK" | "PLN" | "CZK" | "HUF"
  | "HKD" | "KRW" | "TWD" | "MYR" | "THB" | "AED";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  flag: string;
  label: string;
};

export const CURRENCIES: CurrencyInfo[] = [
  // Major / default
  { code: "GBP", symbol: "£",    flag: "🇬🇧", label: "British Pound" },
  { code: "USD", symbol: "$",    flag: "🇺🇸", label: "US Dollar" },
  { code: "EUR", symbol: "€",    flag: "🇪🇺", label: "Euro" },
  { code: "AUD", symbol: "A$",   flag: "🇦🇺", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$",   flag: "🇨🇦", label: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr",   flag: "🇨🇭", label: "Swiss Franc" },
  { code: "NZD", symbol: "NZ$",  flag: "🇳🇿", label: "New Zealand Dollar" },
  // Scandinavia / Nordic
  { code: "DKK", symbol: "kr",   flag: "🇩🇰", label: "Danish Krone" },
  { code: "NOK", symbol: "kr",   flag: "🇳🇴", label: "Norwegian Krone" },
  { code: "SEK", symbol: "kr",   flag: "🇸🇪", label: "Swedish Krona" },
  // Central / Eastern Europe
  { code: "PLN", symbol: "zł",   flag: "🇵🇱", label: "Polish Złoty" },
  { code: "CZK", symbol: "Kč",   flag: "🇨🇿", label: "Czech Koruna" },
  { code: "HUF", symbol: "Ft",   flag: "🇭🇺", label: "Hungarian Forint" },
  // Asia Pacific
  { code: "JPY", symbol: "¥",    flag: "🇯🇵", label: "Japanese Yen" },
  { code: "SGD", symbol: "S$",   flag: "🇸🇬", label: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$",  flag: "🇭🇰", label: "Hong Kong Dollar" },
  { code: "KRW", symbol: "₩",    flag: "🇰🇷", label: "South Korean Won" },
  { code: "TWD", symbol: "NT$",  flag: "🇹🇼", label: "Taiwan Dollar" },
  { code: "MYR", symbol: "RM",   flag: "🇲🇾", label: "Malaysian Ringgit" },
  { code: "THB", symbol: "฿",    flag: "🇹🇭", label: "Thai Baht" },
  // Middle East
  { code: "AED", symbol: "د.إ",  flag: "🇦🇪", label: "UAE Dirham" },
];

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // GBP
  GB: "GBP", IM: "GBP", JE: "GBP", GG: "GBP",
  // USD
  US: "USD", PR: "USD", GU: "USD", VI: "USD", AS: "USD",
  // AUD
  AU: "AUD", NF: "AUD",
  // CAD
  CA: "CAD",
  // CHF
  CH: "CHF", LI: "CHF",
  // NZD
  NZ: "NZD",
  // Scandinavian
  DK: "DKK", FO: "DKK", GL: "DKK",
  NO: "NOK", SJ: "NOK",
  SE: "SEK",
  // Central / Eastern Europe
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  // Euro zone
  AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR",
  ES: "EUR", FI: "EUR", FR: "EUR", GR: "EUR", HR: "EUR",
  IE: "EUR", IT: "EUR", LT: "EUR", LU: "EUR", LV: "EUR",
  MT: "EUR", NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR",
  // Iceland (ISK — maps to EUR as closest supported)
  IS: "EUR",
  // Bulgaria (BGN pegged to EUR)
  BG: "EUR",
  // Romania
  RO: "EUR",
  // Asia Pacific
  JP: "JPY",
  SG: "SGD",
  HK: "HKD",
  KR: "KRW",
  TW: "TWD",
  MY: "MYR",
  TH: "THB",
  // Middle East
  AE: "AED",
};

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  GBP: 1.00,
  USD: 1.27,
  EUR: 1.17,
  AUD: 1.97,
  CAD: 1.75,
  CHF: 1.13,
  NZD: 2.15,
  // Scandinavian
  DKK: 8.77,
  NOK: 13.40,
  SEK: 13.30,
  // Central / Eastern Europe
  PLN: 5.10,
  CZK: 29.50,
  HUF: 463.0,
  // Asia Pacific
  JPY: 193.0,
  SGD: 1.71,
  HKD: 9.90,
  KRW: 1720.0,
  TWD: 41.50,
  MYR: 5.95,
  THB: 44.50,
  // Middle East
  AED: 4.66,
};

const NO_DECIMAL_CURRENCIES: Set<CurrencyCode> = new Set(["JPY", "KRW", "HUF"]);

const STORAGE_KEY = "omniqure_currency";

type CurrencyContextType = {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (gbp: number) => string;
  rates: Record<CurrencyCode, number>;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

function getInitialCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES.find(c => c.code === stored)) return stored;
  } catch {}
  return "GBP";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(getInitialCurrency);
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
          const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
          if (!cancelled && geoRes.ok) {
            const geo = await geoRes.json();
            const detected = COUNTRY_TO_CURRENCY[geo.country_code as string] ?? "GBP";
            if (!cancelled) {
              setCurrencyCode(detected);
              localStorage.setItem(STORAGE_KEY, detected);
            }
          }
        }

        const ratesRes = await fetch("https://open.er-api.com/v6/latest/GBP", { signal: AbortSignal.timeout(6000) });
        if (!cancelled && ratesRes.ok) {
          const data = await ratesRes.json();
          if (data.rates) {
            const live: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>;
            for (const c of CURRENCIES) {
              live[c.code] = data.rates[c.code] ?? FALLBACK_RATES[c.code];
            }
            if (!cancelled) setRates(live);
          }
        }
      } catch {}

      if (!cancelled) setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyCode(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, []);

  const currency = CURRENCIES.find(c => c.code === currencyCode)!;

  const formatPrice = useCallback((gbp: number): string => {
    const converted = gbp * (rates[currencyCode] ?? 1);
    const info = CURRENCIES.find(c => c.code === currencyCode)!;
    if (NO_DECIMAL_CURRENCIES.has(currencyCode)) {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toFixed(2)}`;
  }, [currencyCode, rates]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
