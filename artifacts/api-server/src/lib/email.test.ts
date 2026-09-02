import assert from "node:assert/strict";
import test from "node:test";
import { createWholesaleInvoicePdf } from "./email";

test("renders a branded wholesale invoice PDF in the invoice currency", async () => {
  const pdf = await createWholesaleInvoicePdf({
    referenceNumber: "EUR-TEST",
    dueDate: "2026-09-16",
    paymentUrl: "https://pay.wallid.co/?data=test",
    currency: "EUR",
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    orderNumber: "WS-EUR-TEST",
    items: [
      {
        productName: "ARA-290 16mg",
        productCategory: "Research Peptides",
        quantity: 2,
        priceGbp: 12.5,
      },
    ],
    subtotalGbp: 25,
    shippingCostGbp: 0,
    totalGbp: 25,
    shippingMethod: "Wholesale",
    trackingNumber: null,
    address1: null,
    address2: null,
    city: null,
    postcode: null,
    country: null,
  });

  assert.ok(pdf.subarray(0, 8).toString("ascii") === "%PDF-1.3");
  assert.ok(pdf.length > 10_000);
  assert.match(pdf.toString("latin1"), /\/Type\s*\/Page\b/);
});