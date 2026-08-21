import crypto from "crypto";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

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

type NominatimResult = {
  display_name?: string;
  type?: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    residential?: string;
    unit?: string;
    apartment?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
};

type NominatimSearchInput = Pick<
  DeliveryAddress,
  "address1" | "address2" | "postcode" | "country"
> & {
  city?: string;
};

type VerificationProof = {
  addressHash: string;
  expiresAt: number;
  canonical: VerifiedAddress;
};

const VERIFICATION_TTL_MS = 15 * 60 * 1000;
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_MIN_REQUEST_INTERVAL_MS = 1_000;
const NOMINATIM_ADVISORY_LOCK_KEY = 248_104_211;
const NOMINATIM_REQUEST_TIMEOUT_MS = 8_000;
type NominatimRateLimiter = <T>(request: () => Promise<T>) => Promise<T>;

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

function signingSecret(): string | null {
  const secret = process.env.SESSION_SECRET?.trim();
  return secret || null;
}

function encodedJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(value: string): string | null {
  const secret = signingSecret();
  return secret
    ? crypto.createHmac("sha256", secret).update(value).digest("base64url")
    : null;
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

function normalizePostcode(value: string | undefined): string {
  return normalizeText(value).replace(/[\s-]/g, "").toLocaleUpperCase("en-GB");
}

async function withSharedNominatimRateLimit<T>(request: () => Promise<T>): Promise<T> {
  return db.transaction(async tx => {
    await tx.execute(sql`SET LOCAL lock_timeout = '5s'`);
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${NOMINATIM_ADVISORY_LOCK_KEY})`);
    const dispatchedAt = Date.now();
    try {
      return await request();
    } finally {
      const remainingMs = NOMINATIM_MIN_REQUEST_INTERVAL_MS - (Date.now() - dispatchedAt);
      if (remainingMs > 0) {
        await tx.execute(sql`SELECT pg_sleep(${remainingMs / 1_000})`);
      }
    }
  });
}

function canonicalAddressFromNominatim(
  input: Pick<DeliveryAddress, "address1" | "address2" | "postcode" | "country">,
  result: NominatimResult,
  countryCode: string,
): VerifiedAddress | null {
  const address = result.address;
  if (!address || address.country_code?.toUpperCase() !== countryCode) return null;

  const road = normalizeText(address.road || address.pedestrian || address.residential);
  const houseNumber = normalizeText(address.house_number);
  const returnedPostcode = normalizeText(address.postcode);
  const submittedPostcode = normalizePostcode(input.postcode);
  if (
    !road ||
    !houseNumber ||
    (postcodeIsRequired(countryCode) && !returnedPostcode) ||
    (submittedPostcode && normalizePostcode(returnedPostcode) !== submittedPostcode)
  ) {
    return null;
  }

  const city = normalizeText(
    address.city || address.town || address.village || address.municipality,
  );
  if (!city) return null;

  const canonical: DeliveryAddress = {
    address1: `${houseNumber} ${road}`,
    address2: [normalizeText(address.unit), normalizeText(address.apartment)]
      .filter(Boolean)
      .join(", ") || normalizeText(input.address2),
    city,
    county: normalizeText(address.state || address.county),
    postcode: returnedPostcode || normalizeText(input.postcode),
    country: normalizeText(input.country),
  };
  const formattedAddress =
    normalizeText(result.display_name) ||
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

async function searchNominatim(
  input: NominatimSearchInput,
  countryCode: string,
  fetcher: typeof fetch = fetch,
  rateLimiter: NominatimRateLimiter = withSharedNominatimRateLimit,
  requestTimeoutMs = NOMINATIM_REQUEST_TIMEOUT_MS,
): Promise<NominatimResult[]> {
  let response: Response;
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: countryCode.toLowerCase(),
      q: [
        normalizeText(input.address1),
        normalizeText(input.address2),
        normalizeText(input.city),
        normalizeText(input.postcode),
        normalizeText(input.country),
      ]
        .filter(Boolean)
        .join(", "),
    });
    response = await rateLimiter(async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
      try {
        return await fetcher(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
          headers: {
            Accept: "application/json",
            "User-Agent":
              process.env.NOMINATIM_USER_AGENT ??
              "OmniQure checkout address lookup (server-side)",
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
    });
  } catch {
    throw new AddressVerificationError(
      "Address verification is temporarily unavailable. Please try again later.",
      503,
      "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const providerUnavailable = response.status === 429 || response.status >= 500;
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

  if (!Array.isArray(payload)) {
    throw new AddressVerificationError(
      "Address verification is temporarily unavailable. Please try again later.",
      503,
      "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  }

  return payload as NominatimResult[];
}

export async function findNominatimAddressSuggestions(
  input: Pick<DeliveryAddress, "address1" | "address2" | "postcode" | "country">,
  fetcher: typeof fetch = fetch,
  rateLimiter: NominatimRateLimiter = withSharedNominatimRateLimit,
  requestTimeoutMs = NOMINATIM_REQUEST_TIMEOUT_MS,
): Promise<VerifiedAddress[]> {
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
    (postcodeIsRequired(countryCode) && !normalizeText(input.postcode))
  ) {
    throw new AddressVerificationError(
      postcodeIsRequired(countryCode)
        ? "Enter a street address and postal code to find matching addresses."
        : "Enter a street address to find matching addresses.",
      400,
      "ADDRESS_NOT_CONFIRMED",
    );
  }

  const payload = await searchNominatim(
    input,
    countryCode,
    fetcher,
    rateLimiter,
    requestTimeoutMs,
  );
  const suggestions = new Map<string, VerifiedAddress>();
  for (const result of payload) {
    const canonical = canonicalAddressFromNominatim(input, result, countryCode);
    if (canonical) suggestions.set(canonical.formattedAddress, canonical);
  }
  return [...suggestions.values()].slice(0, 5);
}

export async function verifyAddressWithNominatim(
  input: DeliveryAddress,
  fetcher: typeof fetch = fetch,
  rateLimiter: NominatimRateLimiter = withSharedNominatimRateLimit,
  requestTimeoutMs = NOMINATIM_REQUEST_TIMEOUT_MS,
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

  const payload = await searchNominatim(
    input,
    countryCode,
    fetcher,
    rateLimiter,
    requestTimeoutMs,
  );
  const canonical = payload
    .map(result => canonicalAddressFromNominatim(input, result as NominatimResult, countryCode))
    .find((result): result is VerifiedAddress => result !== null);
  if (!canonical) {
    throw new AddressVerificationError(
      "We could not confirm this specific address. Check the building number, street, city, and postcode.",
      422,
      "ADDRESS_NOT_CONFIRMED",
    );
  }

  return canonical;
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
  const signature = sign(encoded);
  if (!signature) {
    throw new AddressVerificationError(
      "Address confirmation is temporarily unavailable. Please try again later.",
      503,
      "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  }
  return {
    token: `${encoded}.${signature}`,
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
  const expectedSignature = sign(encoded);
  if (!expectedSignature) {
    return { valid: false, reason: "Address confirmation is temporarily unavailable. Please try again." };
  }
  if (!safeSignatureMatches(signature, expectedSignature)) {
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