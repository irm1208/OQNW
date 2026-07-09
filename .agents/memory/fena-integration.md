---
name: Fena open-banking payment integration
description: How Fena is wired into OmniQure checkout — API shape, endpoint, flow, webhook security.
---

## API endpoint (from toolkit-php-sdk Payment.php source)
- Create: POST `https://epos.api.prod-gcp.fena.co/open/payments/single/create-and-process`
- Status: GET `https://epos.api.prod-gcp.fena.co/public/payment-flow/payment/{hashedId}`
- Auth headers: `integration-id` and `secret-key`
- Body: `reference`, `amount` (2dp string), `customerEmail`, `customerName`, `customRedirectUrl`, `items: []`
- Response: `{ created: true, result: { link: "https://...?id=HASHED_ID" } }`

**Why toolkit shape (reference) not old fena-php-sdk shape (invoiceRefNumber):** endpoint URL is from toolkit-php-sdk; use its field names.

## Payment flow
1. Checkout sends `paymentMethod: "fena"` to POST /api/orders
2. Server creates order (awaiting_payment), calls Fena API with customRedirectUrl = `{req.headers.origin}/fena-return?order=...&name=...&total=...&ship=...`
3. Server returns `{ fenaPaymentUrl }` — frontend does `window.location.href = fenaPaymentUrl`
4. Customer authenticates at Fena; Fena redirects back to /fena-return (FenaReturn.tsx)
5. Fena also POSTs to /api/fena-webhook → order marked paid

## Webhook security
- Raw body captured via `express.json({ verify: (req,_res,buf) => { req.rawBody = buf; } })` in app.ts
- FENA_WEBHOOK_SECRET set → requests without signature header are rejected (401)
- HMAC verified against raw bytes; only COMPLETED/PAID/SUCCESS/AUTHORIZED statuses mark paid

## Key files
- `artifacts/api-server/src/lib/fena.ts`
- `artifacts/api-server/src/routes/fena-webhook.ts`
- `artifacts/omniqure/src/pages/FenaReturn.tsx`
