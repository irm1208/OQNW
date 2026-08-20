import assert from "node:assert/strict";
import test from "node:test";
import {
  AddressVerificationError,
  countryCodeForName,
  createAddressVerificationProof,
  postcodeIsRequired,
  verifyAddressVerificationProof,
  verifyAddressWithGoogle,
  type DeliveryAddress,
} from "./addressVerification";

const address: DeliveryAddress = {
  address1: "1600 Amphitheatre Parkway",
  city: "Mountain View",
  county: "CA",
  postcode: "94043",
  country: "United States",
};

test("resolves supported country names and postal requirements", () => {
  assert.equal(countryCodeForName("United Kingdom"), "GB");
  assert.equal(countryCodeForName("Japan"), "JP");
  assert.equal(postcodeIsRequired("US"), true);
  assert.equal(postcodeIsRequired("HK"), false);
});

test("accepts a premise-level canonical address from the global provider", async () => {
  const originalKey = process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY;
  process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY = "test-key";
  try {
    const verified = await verifyAddressWithGoogle(address, async () =>
      new Response(
        JSON.stringify({
          result: {
            verdict: { addressComplete: true, validationGranularity: "PREMISE" },
            address: {
              formattedAddress: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
              postalAddress: {
                addressLines: ["1600 Amphitheatre Pkwy"],
                locality: "Mountain View",
                administrativeArea: "CA",
                postalCode: "94043",
                regionCode: "US",
              },
            },
          },
        }),
        { status: 200 },
      ),
    );
    assert.equal(verified.address1, "1600 Amphitheatre Pkwy");
    assert.equal(verified.countryCode, "US");
  } finally {
    if (originalKey === undefined) delete process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY;
    else process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY = originalKey;
  }
});

test("rejects broad, unconfirmed provider responses", async () => {
  const originalKey = process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY;
  process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY = "test-key";
  try {
    await assert.rejects(
      verifyAddressWithGoogle(address, async () =>
        new Response(
          JSON.stringify({
            result: {
              verdict: { addressComplete: true, validationGranularity: "ROUTE" },
            },
          }),
          { status: 200 },
        ),
      ),
      (error: unknown) =>
        error instanceof AddressVerificationError && error.code === "ADDRESS_TOO_BROAD",
    );
  } finally {
    if (originalKey === undefined) delete process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY;
    else process.env.GOOGLE_ADDRESS_VALIDATION_API_KEY = originalKey;
  }
});

test("rejects a verification proof when delivery details are changed", () => {
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
});