import { Router } from "express";
import {
  AddressVerificationError,
  createAddressVerificationProof,
  verifyAddressWithGoogle,
  type DeliveryAddress,
} from "../lib/addressVerification";

const router = Router();

interface GetAddressResult {
  postcode: string;
  latitude: number;
  longitude: number;
  addresses: Array<{
    formatted_address: string[];
    line_1: string;
    line_2: string;
    line_3: string;
    line_4: string;
    locality: string;
    town_or_city: string;
    county: string;
    district: string;
    country: string;
  }>;
}

/**
 * GET /api/address-lookup?postcode=SW1A1AA
 * Proxies to getaddress.io so the API key is never exposed to the browser.
 */
router.get("/address-lookup", async (req, res) => {
  const postcode = (req.query["postcode"] as string | undefined)?.trim();
  if (!postcode) {
    return res.status(400).json({ error: "postcode query param required" });
  }

  const apiKey = process.env["GETADDRESS_API_KEY"];
  if (!apiKey) {
    return res.status(503).json({ error: "Address lookup not configured" });
  }

  try {
    const url = `https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${apiKey}&expand=true`;
    const upstream = await fetch(url);

    if (upstream.status === 404) {
      return res.status(404).json({ error: "No addresses found for this postcode" });
    }
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Address lookup failed" });
    }

    const data = (await upstream.json()) as GetAddressResult;

    const addresses = (data.addresses ?? []).map(a => ({
      line1: a.line_1,
      line2: [a.line_2, a.line_3, a.line_4].filter(Boolean).join(", "),
      city: a.town_or_city || a.locality || a.district,
      county: a.county,
      label: [a.line_1, a.line_2, a.town_or_city].filter(Boolean).join(", "),
    }));

    return res.json({ postcode: data.postcode, addresses });
  } catch {
    return res.status(500).json({ error: "Address lookup request failed" });
  }
});

/**
 * POST /api/address-verification
 * Validates a complete international delivery address server-side. The response
 * includes a short-lived proof bound to the canonical address for use at checkout.
 */
router.post("/address-verification", async (req, res) => {
  const delivery = req.body as Partial<DeliveryAddress>;
  if (
    typeof delivery.address1 !== "string" ||
    typeof delivery.city !== "string" ||
    typeof delivery.postcode !== "string" ||
    typeof delivery.country !== "string"
  ) {
    return res.status(400).json({ error: "A complete delivery address is required." });
  }

  try {
    const canonical = await verifyAddressWithGoogle({
      address1: delivery.address1,
      address2: typeof delivery.address2 === "string" ? delivery.address2 : undefined,
      city: delivery.city,
      county: typeof delivery.county === "string" ? delivery.county : undefined,
      postcode: delivery.postcode,
      country: delivery.country,
    });
    const proof = createAddressVerificationProof(canonical);
    return res.status(200).json({
      verified: true,
      canonicalAddress: canonical,
      verificationToken: proof.token,
      expiresAt: proof.expiresAt,
    });
  } catch (error) {
    if (error instanceof AddressVerificationError) {
      return res.status(error.status).json({ error: error.message, code: error.code });
    }
    req.log.error({ error }, "Unexpected address verification error");
    return res.status(503).json({
      error: "Address verification is temporarily unavailable. Please try again later.",
      code: "ADDRESS_VERIFICATION_UNAVAILABLE",
    });
  }
});

export default router;
