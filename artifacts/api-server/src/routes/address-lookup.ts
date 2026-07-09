import { Router } from "express";

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

export default router;
