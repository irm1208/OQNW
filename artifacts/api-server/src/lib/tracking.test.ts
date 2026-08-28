import assert from "node:assert/strict";
import test from "node:test";
import {
  DISPATCHABLE_ORDER_STATUSES,
  isAllowedAdminStatusTransition,
  normalizeHttpsTrackingUrl,
  validateDispatchDetails,
} from "./tracking";

test("accepts and normalizes complete HTTPS dispatch details", () => {
  const result = validateDispatchDetails({
    carrierName: " Royal Mail ",
    trackingNumber: " AB 123 ",
    trackingUrl: "https://www.royalmail.com/track?number=AB123",
  });

  assert.deepEqual(result, {
    ok: true,
    value: {
      carrierName: "Royal Mail",
      trackingNumber: "AB 123",
      trackingUrl: "https://www.royalmail.com/track?number=AB123",
    },
  });
});

test("rejects incomplete dispatch details and unsafe links", () => {
  assert.equal(validateDispatchDetails({}).ok, false);
  assert.equal(validateDispatchDetails({
    carrierName: "Carrier",
    trackingNumber: "123",
    trackingUrl: "http://example.com/track/123",
  }).ok, false);
  assert.equal(normalizeHttpsTrackingUrl("javascript:alert(1)"), null);
  assert.equal(normalizeHttpsTrackingUrl("https://user:pass@example.com/track"), null);
});

test("only fulfillment-ready statuses can claim the first dispatch transition", () => {
  assert.deepEqual(DISPATCHABLE_ORDER_STATUSES, ["paid", "payment_received", "processing"]);
  assert.equal(DISPATCHABLE_ORDER_STATUSES.includes("shipped" as never), false);
});

test("shipped and delivered statuses cannot regress into a second dispatch", () => {
  assert.equal(isAllowedAdminStatusTransition("shipped", "processing"), false);
  assert.equal(isAllowedAdminStatusTransition("shipped", "delivered"), true);
  assert.equal(isAllowedAdminStatusTransition("delivered", "processing"), false);
  assert.equal(isAllowedAdminStatusTransition("processing", "shipped"), false);
  assert.equal(isAllowedAdminStatusTransition("processing", "delivered"), false);
});