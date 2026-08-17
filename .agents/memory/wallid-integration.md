---
name: Wallid payment integration
description: Wallid replaced Fena as the hosted-checkout payment provider. Key API shape, env vars, redirect flow, and webhook format.
---

# Wallid Payment Integration

## Key files
- `artifacts/api-server/src/lib/wallid.ts` — API client (create + status)
- `artifacts/api-server/src/routes/wallid-webhook.ts` — webhook handler
- `artifacts/omniqure/src/pages/WallidReturn.tsx` — return landing page
- Payment method string throughout codebase: `"wallid"` (was `"fena"`)

## API shape
- Base URL: `https://payment-api.wallid.co/api/payment-gw/v1`
- Auth: HTTP Basic (`WALLID_API_KEY_ID:WALLID_API_KEY_SECRET`)
- Create: POST `/create` — `order_id`, `amount` (minor units = pence), `currency: "GBP"`, `success_url`, `fail_url`, `items[]`
- Each item requires: `name`, `category`, `price_minor`, `image_url`, `product_url` (all required by API)
- Response: `api_payment_id`, `payment_link` — redirect customer to `payment_link`
- Status: GET `/status?apiPaymentId=...` — returns `status: NEW|PENDING|SUCCESS|FAILED|EXPIRED`

## Redirect URLs
- success: `${origin}/wallid-return?order=...&name=...&total=...&ship=...&status=success`
- fail:    `${origin}/wallid-return?order=...&name=...&total=...&ship=...&status=failed`

## Webhook format
- Events arrive as `{ events: [...] }` array (may be batched)
- Each event: `{ event_id, api_payment_id, order_id, status, status_error, amount, currency, occurred_at }`
- Treat `status === "SUCCESS"` as paid; ignore FAILED/EXPIRED
- Signature: `sha256=hex(HMAC-SHA256(key=WALLID_WEBHOOK_SECRET, data="${X-Webhook-Timestamp}.${rawBody}"))`
- Reject if timestamp > 5 min old (replay protection)
- Webhook endpoint: `POST /api/wallid-webhook`

## Env vars
- `WALLID_API_KEY_ID` — required for payment creation
- `WALLID_API_KEY_SECRET` — required for payment creation
- `WALLID_WEBHOOK_SECRET` — optional; if set, signature verification is enforced

**Why:** Fena was removed by the user in favour of Wallid. The payment_method string "wallid" is used across orders.ts, CartPage.tsx, and DB status logic.
