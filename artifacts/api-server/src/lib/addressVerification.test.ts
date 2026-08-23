import assert from "node:assert/strict";
import test from "node:test";
import {
  AddressVerificationError,
  countryCodeForName,
  createAddressVerificationProof,
  findNominatimAddressSuggestions,
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

test("returns international address suggestions without requiring a submitted city", async () => {
  const suggestions = await findNominatimAddressSuggestions(
    {
      address1: "10 Downing Street",
      postcode: "SW1A 2AA",
      country: "United Kingdom",
    },
    async () =>
      new Response(
        JSON.stringify([
          {
            display_name: "10 Downing Street, Westminster, London, SW1A 2AA, United Kingdom",
            address: {
              house_number: "10",
              road: "Downing Street",
              city: "City of Westminster",
              state: "England",
              postcode: "SW1A 2AA",
              country_code: "gb",
            },
          },
        ]),
        { status: 200 },
      ),
    withoutNominatimRateLimit,
  );

  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0]?.address1, "10 Downing Street");
  assert.equal(suggestions[0]?.city, "City of Westminster");
});

test("reuses concurrent and recent identical address suggestions", async () => {
  let requests = 0;
  const input = {
    address1: "42 Cache Lane",
    postcode: "EC1A 1BB",
    country: "United Kingdom",
  };
  const fetcher: typeof fetch = async () => {
    requests += 1;
    await new Promise(resolve => setTimeout(resolve, 5));
    return new Response(
      JSON.stringify([
        {
          display_name: "42 Cache Lane, London, EC1A 1BB, United Kingdom",
          address: {
            house_number: "42",
            road: "Cache Lane",
            city: "London",
            state: "England",
            postcode: "EC1A 1BB",
            country_code: "gb",
          },
        },
      ]),
      { status: 200 },
    );
  };

  const [first, second] = await Promise.all([
    findNominatimAddressSuggestions(input, fetcher, withoutNominatimRateLimit),
    findNominatimAddressSuggestions(input, fetcher, withoutNominatimRateLimit),
  ]);
  const third = await findNominatimAddressSuggestions(input, fetcher, withoutNominatimRateLimit);

  assert.equal(requests, 1);
  assert.equal(first[0]?.formattedAddress, second[0]?.formattedAddress);
  assert.equal(third[0]?.address1, "42 Cache Lane");
});

test("finds addresses in countries where postal codes are optional", async () => {
  const suggestions = await findNominatimAddressSuggestions(
    {
      address1: "1 Harbour Road",
      postcode: "",
      country: "Hong Kong",
    },
    async () =>
      new Response(
        JSON.stringify([
          {
            display_name: "1 Harbour Road, Wan Chai, Hong Kong",
            address: {
              house_number: "1",
              road: "Harbour Road",
              city: "Wan Chai",
              state: "Hong Kong Island",
              country_code: "hk",
            },
          },
        ]),
        { status: 200 },
      ),
    withoutNominatimRateLimit,
  );

  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0]?.postcode, "");
  assert.equal(suggestions[0]?.countryCode, "HK");
});

test("fails closed when the Nominatim request exceeds its deadline", async () => {
  await assert.rejects(
    verifyAddressWithNominatim(
      address,
      async (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
      withoutNominatimRateLimit,
      5,
    ),
    (error: unknown) =>
      error instanceof AddressVerificationError &&
      error.code === "ADDRESS_VERIFICATION_UNAVAILABLE",
  );
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