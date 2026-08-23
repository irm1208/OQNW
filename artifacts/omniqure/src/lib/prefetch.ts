/**
 * Route prefetching — call prefetchRoute(path) to download a page's JS chunk
 * before the user navigates to it. Fire-and-forget; results are ignored.
 *
 * The import() strings here must match App.tsx exactly so Vite/webpack de-dupes
 * them into the same chunk rather than creating separate ones.
 */

const prefetched = new Set<string>();

// Map the leading path segment (or "/") to the same dynamic import as App.tsx
const ROUTE_LOADERS: Record<string, () => Promise<unknown>> = {
  "/":                 () => import("@/pages/HomePage"),
  "/all-peptides":     () => import("@/pages/AllPeptides"),
  "/product":          () => import("@/pages/ProductPage"),
  "/stacks":           () => import("@/pages/StacksPage"),
  "/calculator":       () => import("@/pages/ReconstitutionCalculator"),
  "/contact":          () => import("@/pages/ContactPage"),
  "/sign-in":          () => import("@/pages/SignIn"),
  "/register":         () => import("@/pages/Register"),
  "/forgot-password":  () => import("@/pages/ForgotPassword"),
  "/account":          () => import("@/pages/AccountPage"),
  "/cart":             () => import("@/pages/CartPage"),
  "/checkout":         () => import("@/pages/CheckoutPage"),
  "/wishlist":         () => import("@/pages/WishlistPage"),
  "/protocols":        () => import("@/pages/ProtocolsPage"),
  "/faq":              () => import("@/pages/FAQPage"),
  "/glossary":         () => import("@/pages/GlossaryPage"),
  "/lab-tests":        () => import("@/pages/LabTestsPage"),
  "/lab-reports":      () => import("@/pages/LabReportsPage"),
  "/bac-water":        () => import("@/pages/BacWaterPage"),
  "/terms":            () => import("@/pages/TermsPage"),
  "/shipping":         () => import("@/pages/ShippingPage"),
  "/privacy":          () => import("@/pages/PrivacyPage"),
  "/about":            () => import("@/pages/AboutPage"),
  "/refer-a-friend":   () => import("@/pages/ReferAFriendPage"),
  "/bundle-and-save":  () => import("@/pages/BundleAndSavePage"),
  "/storage-guide":    () => import("@/pages/StorageGuidePage"),
  "/research-results": () => import("@/pages/ResearchResultsPage"),
};

/** Trigger the chunk download for a given path (idempotent). */
export function prefetchRoute(path: string): void {
  // Normalise: strip query/hash, take the first path segment
  const segments = path.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const key = segments.length === 0 ? "/" : `/${segments[0]}`;
  if (prefetched.has(key)) return;
  const loader = ROUTE_LOADERS[key];
  if (!loader) return;
  prefetched.add(key);
  loader().catch(() => {/* silently ignore — network errors are fine here */});
}

/** Prefetch a list of paths sequentially during browser idle time. */
export function idlePrefetch(paths: string[]): void {
  const idle =
    typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 200);

  let i = 0;
  function next() {
    if (i >= paths.length) return;
    idle(() => {
      prefetchRoute(paths[i++]);
      next();
    });
  }
  next();
}
