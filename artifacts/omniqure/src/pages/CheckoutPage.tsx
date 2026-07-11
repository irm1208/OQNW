import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Cart and checkout were merged into a single flow living at /cart. This route
 * is kept only so old links/bookmarks to /checkout don't 404 — it immediately
 * redirects to the unified page.
 */
export default function CheckoutPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/cart", { replace: true });
  }, [navigate]);
  return null;
}
