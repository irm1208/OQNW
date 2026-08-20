import crypto from "crypto";

export type DeliveryAddress = {
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
};

export type VerifiedAddress = DeliveryAddress & {
  countryCode: string;
  formattedAddress: string;
};

type GoogleAddressValidationResponse = {
  result?: {
    verdict?: {
      addressComplete?: boolean;
      hasUnconfirmedComponents?: boolean;
      validationGranularity?: string;
    };
    address?: {
      formattedAddress?: string;
      postalAddress?: {
        addressLines?: string[];
        locality?: string;
        administrativeArea?: string;
        postalCode?: string;
        regionCode?: string;
      };
    };
  };
  error?: { message?: string };
};

type VerificationProof = {
  addressHash: string;
  expiresAt: number;
  canonical: VerifiedAddress;
};

const VERIFICATION_TTL_MS = 15 * 60 * 1000;
const GLOBAL_ADDRESS_VALIDATION_URL =
  "https://addressvalidation.googleapis.com/v1:validateAddress";

const COUNTRY_ALIASES: Record<string, string> = {
  "bosnia and herzegovina": "BA",
  "czech republic": "CZ",
  "hong kong": "HK",
  "kosovo": "XK",
  "macau": "MO",
  "moldova": "MD",
  "north macedonia": "MK",
  "south korea": "KR",
  "taiwan": "TW",
  "turkey": "TR",
  "united kingdom": "GB",
  "united states": "US",
  "vietnam": "VN",
};

const ISO_REGION_CODES = (
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

const POSTCODE_OPTIONAL_COUNTRY_CODES = new Set(["AE", "HK", "MO", "QA"]);

export class AddressVerificationError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code:
      | "ADDRESS_NOT_CONFIRMED"
      | "ADDRESS_TOO_BROAD"
      | "ADDRESS_VERIFICATION_UNAVAILABLE"
      | "INVALID_COUNTRY",
  ) {
    super(message);
  }
}

function normalizeText(value: string | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");
}

function countryLookupKey(value: string): string {
  return normalizeText(value).toLocaleLowerCase("en-GB");
}

function buildCountryNameMap(): Map<string, string> {
  const countries = new Map<string, string>();
  for (const [name, code] of Object.entries(COUNTRY_ALIASES)) {
    countries.set(name, code);
  }

  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    for (const code of ISO_REGION_CODES) {
      const name = displayNames.of(code);
      if (name) countries.set(countryLookupKey(name), code);
    }
  } catch {
    // The aliases above cover the storefront's primary destinations. A caller
    // receives an explicit invalid-country response if ICU data is unavailable.
  }

  return countries;
}

const COUNTRY_NAME_TO_CODE = buildCountryNameMap();

function signingSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "omniqure-cust-session-fallback-secret"
  );
}

function encodedJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

function safeSignatureMatches(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function countryCodeForName(country: string): string | null {
  const normalized = normalizeText(country);
  if (/^[A-Za-z]{2}$/.test(normalized)) return normalized.toUpperCase();
  return COUNTRY_NAME_TO_CODE.get(countryLookupKey(normalized)) ?? null;
}

export function postcodeIsRequired(countryCode: string): boolean {
  return !POSTCODE_OPTIONAL_COUNTRY_CODES.has(countryCode);
}

function addressHash(address: DeliveryAddress): string {
  const countryCode = countryCodeForName(address.country) ?? address.country;
  const normalized = [
    normalizeText(address.address1).toLocaleLowerCase("en-GB"),
    normalizeText(address.address2).toLocaleLowerCase("en-GB"),
    normalizeText(address.city).toLocaleLowerCase("en-GB"),
    normalizeText(address.county).toLocaleLowerCase("en-GB"),
    normalizeText(address.postcode).toLocaleUpperCase("en-GB"),
    countryCode.toLocaleUpperCase("en-GB"),
  ].join("\n");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function toCanonicalAddress(
  input: DeliveryAddress,
  response: GoogleAddressValidationResponse,
  countryCode: string,
): VerifiedAddress {
  const postalAddress = response.result?.address?.postalAddress;
  const addressLines = postalAddress?.addressLines?.map(normalizeText).filter(Boolean) ?? [];
  const canonical: DeliveryAddress = {
    address1: addressLines[0] || normalizeText(input.address1),
    address2: addressLines.slice(1).join(", ") || normalizeText(input.address2),
    city: normalizeText(postalAddress?.locality) || normalizeText(input.city),
    county:
      normalizeText(postalAddress?.administrativeArea) || normalizeText(input.county),
    postcode: normalizeText(postalAddress?.postalCode) || normalizeText(input.postcode),
    country: normalizeText(input.country),
  };
  const formattedAddress =
    normalizeText(response.result?.address?.formattedAddress) ||
    [
      canonical.address1,
      canonical.address2,
      canonical.city,
      canonical.county,
      canonical.postcode,
      canonical.country,
    ]
      .filter(Boolean)
      .join(", ");

  return { ...canonical, countryCode, formattedAddress };
}

export async function verifyAddressWithGoogle(
  input: DeliveryAddress,
  fetcher: typeof fetch = fetch,
): Promise<VerifiedAddress> {
  const countryCode = countryCodeForName(input.country);
  if (!countryCode) {
    throw new AddressVerificationError(
      "Choose a valid delivery country.",
      400,
      "INVALID_COUNTRY",
    );
  }
  if (
    !normalizeText(input.address1) ||
    !normalizeText(input.city) ||
    (postcodeIsRequired(countryCode) && !normalizeText(input.postcode))
  ) {
    throw new AddressVerificationError(
      "Enter a complete delivery address before verifying it.",
      400,
      "ADDRESS_NOT_CONFIRMED",
    );
  }

  const apiKey = process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY;
  if (!apiKey) {
    throw new AddressVerificationError(
      "Address verification is temporarily unavailable. Please try again later.",
      503,
      "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  }

  let response: Response;
  try {
    response = await fetcher(`${GLOBAL_ADDRESS_VALIDATION_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: {
          regionCode: countryCode,
          addressLines: [normalizeText(input.address1), normalizeText(input.address2)].filter(Boolean),
          locality: normalizeText(input.city),
          administrativeArea: normalizeText(input.county),
          postalCode: normalizeText(input.postcode),
        },
      }),
    });
  } catch {
    throw new AddressVerificationError(
      "Address verification is temporarily unavailable. Please try again later.",
      503,
      "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  }

  const payload = (await response.json().catch(() => ({}))) as GoogleAddressValidationResponse;
  if (!response.ok) {
    const providerUnavailable = response.status === 401 || response.status === 403 || response.status >= 500;
    throw new AddressVerificationError(
      providerUnavailable
        ? "Address verification is temporarily unavailable. Please try again later."
        : "We could not verify that address. Check the details and try again.",
      providerUnavailable ? 503 : 422,
      providerUnavailable
        ? "ADDRESS_VERIFICATION_UNAVAILABLE"
        : "ADDRESS_NOT_CONFIRMED",
    );
  }

  const verdict = payload.result?.verdict;
  if (!verdict?.addressComplete || verdict.hasUnconfirmedComponents) {
    throw new AddressVerificationError(
      "We could not confirm this complete address. Check each field and try again.",
      422,
      "ADDRESS_NOT_CONFIRMED",
    );
  }

  if (
    verdict.validationGranularity !== "PREMISE" &&
    verdict.validationGranularity !== "SUB_PREMISE"
  ) {
    throw new AddressVerificationError(
      "Please enter a specific building or delivery address, not only a street or area.",
      422,
      "ADDRESS_TOO_BROAD",
    );
  }

  return toCanonicalAddress(input, payload, countryCode);
}

export function createAddressVerificationProof(canonical: VerifiedAddress): {
  token: string;
  expiresAt: string;
} {
  const payload: VerificationProof = {
    addressHash: addressHash(canonical),
    canonical,
    expiresAt: Date.now() + VERIFICATION_TTL_MS,
  };
  const encoded = encodedJson(payload);
  return {
    token: `${encoded}.${sign(encoded)}`,
    expiresAt: new Date(payload.expiresAt).toISOString(),
  };
}

export function verifyAddressVerificationProof(
  token: string,
  submittedAddress: DeliveryAddress,
): { valid: true; canonical: VerifiedAddress } | { valid: false; reason: string } {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return { valid: false, reason: "Address verification is missing." };

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!safeSignatureMatches(signature, sign(encoded))) {
    return { valid: false, reason: "Address verification is invalid. Please verify again." };
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as VerificationProof;
    if (!payload.expiresAt || payload.expiresAt <= Date.now()) {
      return { valid: false, reason: "Address verification has expired. Please verify again." };
    }
    if (!payload.canonical || payload.addressHash !== addressHash(submittedAddress)) {
      return {
        valid: false,
        reason: "Address details changed after verification. Please verify the address again.",
      };
    }
    return { valid: true, canonical: payload.canonical };
  } catch {
    return { valid: false, reason: "Address verification is invalid. Please verify again." };
  }
}