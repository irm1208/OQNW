import assert from "node:assert/strict";
import test from "node:test";
import {
  createAffiliateAttributionToken,
  verifyAffiliateAttributionToken,
} from "./affiliateAttribution";

test("signed affiliate attribution round trips", () => {
  const clickedAt = new Date("2026-09-03T10:00:00.000Z");
  const token = createAffiliateAttributionToken(42, "SCIENCE-1234", clickedAt);
  assert.deepEqual(verifyAffiliateAttributionToken(token), {
    partnerId: 42,
    trackingCode: "SCIENCE-1234",
    clickedAt,
  });
});

test("tampered affiliate attribution is rejected", () => {
  const token = createAffiliateAttributionToken(42, "SCIENCE-1234");
  const [payload, signature] = token.split(".");
  assert.equal(verifyAffiliateAttributionToken(`${payload}x.${signature}`), null);
});