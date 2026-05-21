const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
  "icloud.com", "protonmail.com", "mail.com", "ymail.com", "msn.com",
  "aol.com", "gmx.com", "zoho.com", "inbox.com",
]);

const POBOX_PATTERNS = /\b(po\s*box|p\.o\.\s*box|post\s*office\s*box|pob)\b/i;

export interface FraudAssessment {
  score: number;
  flags: string[];
}

export interface FraudInput {
  email: string;
  totalGbp: number;
  country: string;
  address1?: string;
  isFirstOrder: boolean;
  orderCount: number;
  recentOrdersLastHour: number;
  paymentMethod?: string;
  isNewAccount?: boolean;
  ipCountry?: string | null;
  shippingCountryCode?: string | null;
  isProxy?: boolean;
}

export function assessFraud(input: FraudInput): FraudAssessment {
  const flags: string[] = [];
  let score = 0;

  if (input.isProxy) {
    score += 30;
    flags.push("vpn_proxy_detected");
  }

  if (
    input.ipCountry &&
    input.shippingCountryCode &&
    input.ipCountry.toUpperCase() !== input.shippingCountryCode.toUpperCase()
  ) {
    score += 20;
    flags.push("ip_country_mismatch");
  }

  if (input.isNewAccount) {
    score += 20;
    flags.push("new_account");
  }

  if (input.isFirstOrder && input.totalGbp > 200) {
    score += 25;
    flags.push("high_value_first_order");
  } else if (input.isFirstOrder && input.totalGbp > 100) {
    score += 10;
    flags.push("elevated_value_first_order");
  }

  if (input.recentOrdersLastHour >= 3) {
    score += 30;
    flags.push("multiple_orders_same_hour");
  } else if (input.recentOrdersLastHour >= 2) {
    score += 15;
    flags.push("repeated_orders_short_window");
  }

  if (input.address1 && POBOX_PATTERNS.test(input.address1)) {
    score += 10;
    flags.push("po_box_address");
  }

  const highValueInternational =
    !["GB", "US", "CA", "AU", "NZ", "IE"].includes(
      (input.shippingCountryCode ?? input.country.slice(0, 2)).toUpperCase(),
    ) && input.totalGbp > 150;
  if (highValueInternational) {
    score += 15;
    flags.push("high_value_international");
  }

  if (input.paymentMethod === "bitcoin") {
    score += 15;
    flags.push("cryptocurrency_payment");
  } else if (input.paymentMethod === "bank_transfer") {
    score += 10;
    flags.push("bank_transfer_payment");
  }

  if (input.email.includes("+") && !input.email.split("@")[1]?.includes("proton")) {
    score += 5;
    flags.push("email_alias_pattern");
  }

  const domain = input.email.split("@")[1]?.toLowerCase() ?? "";
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    score += 5;
    flags.push("free_email_provider");
  }

  return { score: Math.min(score, 100), flags };
}
