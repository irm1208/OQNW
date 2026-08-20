import assert from "node:assert/strict";
import test from "node:test";
import {
  AddressVerificationError,
  countryCodeForName,
  createAddressVerificationProof,
  postcodeIsRequired,
  verifyAddressVerificationProof,
  verifyAddressWithNominatim,
  type DeliveryAddress,
} from "./addressVerification";

const address: DeliveryAddress = {
  address1: "1600 Amphitheatre Parkway",
  city: "Mountain View",
  county: "CA",
  postcode: "94043",
  country: "United States",
};
const withoutNominatimRateLimit = <T>(request: () => Promise<T>) => request();

test("resolves supported country names and postal requirements", () => {
  assert.equal(countryCodeForName("United Kingdom"), "GB");
  assert.equal(countryCodeForName("Japan"), "JP");
  assert.equal(postcodeIsRequired("US"), true);
  assert.equal(postcodeIsRequired("HK"), false);
});

test("accepts a specific canonical address from Nominatim", async () => {
  let requestUrl = "";
  let requestHeaders: Record<string, string> | undefined;
  const verified = await verifyAddressWithNominatim(address, async (url, init) => {
      requestUrl = String(url);
      requestHeaders = init?.headers as Record<string, string> | undefined;
      return new Response(
        JSON.stringify(
          [
            {
              display_name: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, United States",
              type: "house",
              address: {
                house_number: "1600",
                road: "Amphitheatre Pkwy",
                city: "Mountain View",
                state: "CA",
                postcode: "94043",
                country_code: "us",
              },
            },
          ],
        ),
        { status: 200 },
      );
  }, withoutNominatimRateLimit);
  assert.equal(verified.address1, "1600 Amphitheatre Pkwy");
  assert.equal(verified.countryCode, "US");
  assert.match(requestUrl, /countrycodes=us/);
  assert.doesNotMatch(new URL(requestUrl).searchParams.get("q") ?? "", /\bCA\b/);
  assert.equal(requestHeaders?.["User-Agent"], "OmniQure checkout address lookup (server-side)");
});

test("rejects Nominatim matches without a building number", async () => {
  await assert.rejects(
      verifyAddressWithNominatim(
        address,
        async () =>
          new Response(
            JSON.stringify(
              [
                {
                  display_name: "Amphitheatre Pkwy, Mountain View, CA 94043, United States",
                  type: "road",
                  address: {
                    road: "Amphitheatre Pkwy",
                    city: "Mountain View",
                    postcode: "94043",
                    country_code: "us",
                  },
                },
              ],
            ),
            { status: 200 },
          ),
        withoutNominatimRateLimit,
      ),
      (error: unknown) =>
        error instanceof AddressVerificationError && error.code === "ADDRESS_NOT_CONFIRMED",
    );
});

test("rejects a verification proof when delivery details are changed", () => {
  const originalSecret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-only-address-verification-signing-secret";
  try {
    const proof = createAddressVerificationProof({
      ...address,
      countryCode: "US",
      formattedAddress: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    });
    assert.equal(verifyAddressVerificationProof(proof.token, address).valid, true);
    assert.equal(
      verifyAddressVerificationProof(proof.token, { ...address, postcode: "94040" }).valid,
      false,
    );
  } finally {
    if (originalSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalSecret;
  }
});

test("fails closed when no server signing secret is configured", () => {
  const originalSecret = process.env.SESSION_SECRET;
  delete process.env.SESSION_SECRET;
  try {
    assert.throws(
      () =>
        createAddressVerificationProof({
          ...address,
          countryCode: "US",
          formattedAddress: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
        }),
      (error: unknown) =>
        error instanceof AddressVerificationError &&
        error.code === "ADDRESS_VERIFICATION_UNAVAILABLE",
    );
  } finally {
    if (originalSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalSecret;
  }
});