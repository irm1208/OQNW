import { useEffect } from "react";
import { useLocation } from "wouter";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const STORAGE_KEY = "omniqure:affiliate-discount";
const CAPTURED_KEY = "omniqure:affiliate-captured";

function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

export default function AffiliateAttributionCapture() {
  const [location] = useLocation();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const trackingCode = (search.get("aff") ?? "").trim().toUpperCase();
    if (!trackingCode || window.sessionStorage.getItem(CAPTURED_KEY) === trackingCode) return;
    window.sessionStorage.setItem(CAPTURED_KEY, trackingCode);
    void fetch(apiUrl("affiliates/attribution"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingCode }),
    }).then(async response => {
      if (!response.ok) return;
      const data = await response.json() as { discountCode?: string };
      if (!data.discountCode) return;
      window.localStorage.setItem(STORAGE_KEY, data.discountCode);
      window.dispatchEvent(new CustomEvent("omniqure:affiliate-attributed", {
        detail: { discountCode: data.discountCode },
      }));
    }).catch(() => {
      window.sessionStorage.removeItem(CAPTURED_KEY);
    });
  }, [location]);

  return null;
}