# Wallid Payment Gateway — API Reference

## Overview

The Wallid Payment Gateway API lets you create hosted payment sessions and track their status. The customer is redirected to a Wallid-hosted checkout page, completes the payment there, and is then sent back to your success or failure URL.

**Base URL:** `https://payment-api.wallid.co/api/payment-gw/v1`

---

## Authentication

All requests use **HTTP Basic Authentication**.

| Field    | Value                    |
|----------|--------------------------|
| Username | Your API Key ID          |
| Password | Your API Key Secret      |

```http
Authorization: Basic <base64(keyID:secret)>
```

Credentials are provided to you by Wallid. Keep your secret safe — do not expose it in client-side code or logs.

---

## Amounts

All monetary amounts are in **minor units** (smallest denomination of the currency).

| Display amount | Minor units |
|----------------|-------------|
| $10.00 USD     | `1000`      |
| £0.50 GBP      | `50`        |
| €99.99 EUR     | `9999`      |

---

## Create Payment

```
POST /api/payment-gw/v1/create
Content-Type: application/json
```

Creates a new payment session and returns a hosted checkout link. Redirect your customer to `payment_link` to complete the payment.

### Request body

| Field            | Type             | Required | Description                                                  |
|------------------|------------------|----------|--------------------------------------------------------------|
| `order_id`       | string           | yes      | Your internal order identifier. Must be unique per merchant. |
| `amount`         | integer (int64)  | yes      | Total order amount in minor units.                           |
| `currency`       | string           | yes      | ISO 4217 currency code, e.g. `"GBP"`, `"EUR"`, `"USD"`.    |
| `success_url`    | string (URL)     | yes      | Redirect URL after successful payment.                       |
| `fail_url`       | string (URL)     | yes      | Redirect URL after failed or cancelled payment.              |
| `items`          | array of Item    | yes      | Order line items. At least one item is required.             |
| `description`    | string           | no       | Free-text description of the order.                          |
| `customer_email` | string           | no       | Customer's email address.                                    |
| `customer_id`    | string           | no       | Your internal customer identifier.                           |
| `expires_at`     | string (RFC3339) | no       | Payment expiry time. Defaults to 15 minutes from creation.  |
| `metadata`       | object           | no       | Arbitrary key-value pairs stored with the payment.           |
| `locale`         | string           | no       | Language code for the checkout page, e.g. `"en"`, `"fr"`.  |
| `country`        | string           | no       | ISO 3166-1 alpha-2 country code, e.g. `"GB"`, `"US"`.      |

#### Item object

| Field         | Type            | Required | Description                      |
|---------------|-----------------|----------|----------------------------------|
| `name`        | string          | yes      | Product name.                    |
| `category`    | string          | yes      | Product category.                |
| `price_minor` | integer (int64) | yes      | Item price in minor units (≥ 0). |
| `image_url`   | string (URL)    | yes      | Product image URL.               |
| `product_url` | string (URL)    | yes      | Product page URL.                |

#### Example request

```json
{
  "order_id": "order-1234",
  "amount": 4999,
  "currency": "GBP",
  "success_url": "https://yourshop.com/orders/1234/success",
  "fail_url": "https://yourshop.com/orders/1234/cancel",
  "customer_email": "customer@example.com",
  "items": [
    {
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price_minor": 4999,
      "image_url": "https://yourshop.com/images/headphones.jpg",
      "product_url": "https://yourshop.com/products/headphones"
    }
  ]
}
```

### Response

```json
{
  "api_payment_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "order_id": "order-1234",
  "status": "NEW",
  "statusAt": "2024-01-15T10:30:00Z",
  "statusError": "",
  "payment_link": "https://pay.wallid.io/?data=eyJwcmljZSI6...",
  "amount": 4999,
  "currency": "GBP",
  "expires_at": "2024-01-15T10:45:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "items": [...]
}
```

**Next step:** Redirect your customer to the `payment_link` URL.

---

## Get Payment Status

```
GET /api/payment-gw/v1/status?apiPaymentId={api_payment_id}
```

Returns the current status of a payment.

### Query parameters

| Parameter      | Required | Description                                            |
|----------------|----------|--------------------------------------------------------|
| `apiPaymentId` | yes      | The `api_payment_id` returned by the create endpoint. |

### Response

Same structure as the create response. See [Payment statuses](#payment-statuses) for possible values.

---

## Payment Statuses

| Status    | Description                                           |
|-----------|-------------------------------------------------------|
| `NEW`     | Payment created, customer has not yet visited checkout.|
| `PENDING` | Customer is on the checkout page, payment in progress.|
| `SUCCESS` | Payment completed successfully.                       |
| `FAILED`  | Payment was declined or an error occurred.            |
| `EXPIRED` | Payment was not completed within the allowed time.    |

`FAILED` and `EXPIRED` may include a human-readable reason in `statusError`.

---

## Webhooks

When a payment reaches a final status (`SUCCESS`, `FAILED`, or `EXPIRED`), Wallid sends an HTTP POST to your webhook URL. The webhook URL is configured per merchant — contact Wallid to set it up.

### Delivery

- Events are delivered as a JSON array (multiple events can be batched in one request).
- Wallid retries on network errors or `5xx` responses: after 1 min, then 5 min, then 30 min.
- `4xx` responses are treated as permanent failures — no retry.
- After 4 failed attempts, the event is discarded.

### Headers

| Header                  | Description                                              |
|-------------------------|----------------------------------------------------------|
| `Content-Type`          | `application/json`                                       |
| `X-Webhook-Timestamp`   | Unix timestamp (seconds) when the request was sent.     |
| `X-Webhook-Event-Count` | Number of events in this request.                        |
| `X-Webhook-Signature`   | HMAC-SHA256 signature (only if a webhook secret is set). |

### Request body

```json
{
  "events": [
    {
      "event_id": "evt_8f3a2b1c",
      "api_payment_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "order_id": "order-1234",
      "status": "SUCCESS",
      "status_error": "",
      "amount": 4999,
      "currency": "GBP",
      "occurred_at": "2024-01-15T10:32:00Z"
    }
  ]
}
```

### Verifying the signature

If you have configured a webhook secret, every request from Wallid includes an `X-Webhook-Signature` header. You should reject any request where the signature does not match.

```
X-Webhook-Signature: sha256=<lowercase hex>
```

#### How the signature is constructed

```
message   = "{X-Webhook-Timestamp}.{raw request body}"
signature = "sha256=" + hex( HMAC-SHA256(key=secret, data=message) )
```

The signed message is the Unix timestamp from the header, a literal dot `.`, and the **raw JSON body bytes** — exactly as received, before any parsing.

#### Verification steps

1. Read the raw request body **before** parsing it as JSON. Signature verification must happen on the original bytes.
2. Read `X-Webhook-Timestamp` from the header.
3. **Reject if the timestamp is more than 5 minutes old** (`|now − timestamp| > 300 s`). This prevents replay attacks where an attacker resends a previously captured valid request.
4. Build the signed message: `"{timestamp}.{raw_body}"`.
5. Compute `HMAC-SHA256` of that message using your webhook secret as the key.
6. Prepend `sha256=` to the lowercase hex digest.
7. **Compare using a constant-time function** (see examples below). Standard string equality leaks timing information and is vulnerable to timing attacks.
8. If the values do not match, return `400` and do not process the event.

#### Example (Go)

```go
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "fmt"
    "io"
    "net/http"
    "strconv"
    "time"
)

func verifyWebhook(r *http.Request, secret string) (body []byte, ok bool) {
    tsStr := r.Header.Get("X-Webhook-Timestamp")
    sig := r.Header.Get("X-Webhook-Signature")

    ts, err := strconv.ParseInt(tsStr, 10, 64)
    if err != nil || abs(time.Now().Unix()-ts) > 300 {
        return nil, false // missing or stale timestamp
    }

    body, err = io.ReadAll(r.Body)
    if err != nil {
        return nil, false
    }

    msg := fmt.Sprintf("%s.%s", tsStr, body)
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write([]byte(msg))
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))

    return body, hmac.Equal([]byte(expected), []byte(sig))
}

func abs(x int64) int64 {
    if x < 0 { return -x }
    return x
}
```

#### Example (Python)

```python
import hashlib
import hmac
import time

def verify_webhook(headers: dict, raw_body: bytes, secret: str) -> bool:
    ts_str = headers.get("X-Webhook-Timestamp", "")
    sig    = headers.get("X-Webhook-Signature", "")

    try:
        ts = int(ts_str)
    except ValueError:
        return False

    if abs(time.time() - ts) > 300:
        return False  # replay protection

    message  = f"{ts_str}.".encode() + raw_body
    expected = "sha256=" + hmac.new(
        secret.encode(), message, hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, sig)  # constant-time
```

#### Example (Node.js)

```js
const crypto = require("crypto");

function verifyWebhook(headers, rawBody, secret) {
  const ts  = parseInt(headers["x-webhook-timestamp"] ?? "", 10);
  const sig = headers["x-webhook-signature"] ?? "";

  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
    return false; // missing or stale timestamp
  }

  const message  = `${ts}.${rawBody}`;
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  // Buffer lengths must match before timingSafeEqual
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
```

### Responding to webhooks

Return any `2xx` status code to acknowledge receipt. Wallid does not inspect the response body. Respond within **30 seconds** to avoid a timeout-triggered retry.

---

## Errors

Error responses have a plain-text body and a standard HTTP status code.

| Status | Meaning                                               |
|--------|-------------------------------------------------------|
| `400`  | Invalid request — missing or malformed field.         |
| `401`  | Authentication failed — check your API key and secret.|
| `404`  | Payment not found.                                    |
| `500`  | Internal server error — contact Wallid support.       |

**Example validation error (400):**

```
amount must be positive, got 0
```

---

## Quick Integration Checklist

- [ ] Receive API Key ID and Secret from Wallid.
- [ ] Provide your webhook URL (and optionally a webhook secret) to Wallid.
- [ ] On checkout: call `POST /create`, store `api_payment_id`, redirect customer to `payment_link`.
- [ ] Handle the redirect back to `success_url` / `fail_url` in your frontend.
- [ ] Listen for webhook events to update order status server-side.
- [ ] Verify the webhook signature if a secret is configured.
- [ ] For resilience, poll `GET /status` if a webhook was not received within a reasonable window.
