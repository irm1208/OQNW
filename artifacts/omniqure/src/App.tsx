import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { OverlayCoordinatorProvider } from "@/context/OverlayCoordinatorContext";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import JurisdictionWarning from "@/components/JurisdictionWarning";
import AgeGate from "@/components/AgeGate";
import CartPreviewPanel from "@/components/CartPreviewPanel";
import SiteDisclaimer from "@/components/SiteDisclaimer";
import StickyCartBar from "@/components/StickyCartBar";
import { initPixels } from "@/lib/pixels";
import { usePageTracking } from "@/hooks/usePageTracking";
import { idlePrefetch, prefetchRoute } from "@/lib/prefetch";
import AffiliateAttributionCapture from "@/components/AffiliateAttributionCapture";

// Lazy-loaded pages — each becomes its own JS chunk, loaded only when visited
const HomePage             = lazy(() => import("@/pages/HomePage"));
const AllPeptides          = lazy(() => import("@/pages/AllPeptides"));
const ProductPage          = lazy(() => import("@/pages/ProductPage"));
const StacksPage           = lazy(() => import("@/pages/StacksPage"));
const ReconstitutionCalculator = lazy(() => import("@/pages/ReconstitutionCalculator"));
const TermsPage            = lazy(() => import("@/pages/TermsPage"));
const ShippingPage         = lazy(() => import("@/pages/ShippingPage"));
const PrivacyPage          = lazy(() => import("@/pages/PrivacyPage"));
const CartPage             = lazy(() => import("@/pages/CartPage"));
const CheckoutPage         = lazy(() => import("@/pages/CheckoutPage"));
const OrderConfirmation    = lazy(() => import("@/pages/OrderConfirmation"));
const WallidReturn         = lazy(() => import("@/pages/WallidReturn"));
const ContinuePayment      = lazy(() => import("@/pages/ContinuePayment"));
const TrackOrderPage       = lazy(() => import("@/pages/TrackOrderPage"));
const SignIn               = lazy(() => import("@/pages/SignIn"));
const ForgotPassword       = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword        = lazy(() => import("@/pages/ResetPassword"));
const Register             = lazy(() => import("@/pages/Register"));
const AccountPage          = lazy(() => import("@/pages/AccountPage"));
const WishlistPage         = lazy(() => import("@/pages/WishlistPage"));
const ProtocolsPage        = lazy(() => import("@/pages/ProtocolsPage"));
const FAQPage              = lazy(() => import("@/pages/FAQPage"));
const GlossaryPage         = lazy(() => import("@/pages/GlossaryPage"));
const LabReportsPage       = lazy(() => import("@/pages/LabReportsPage"));
const BacWaterPage         = lazy(() => import("@/pages/BacWaterPage"));
const AboutPage            = lazy(() => import("@/pages/AboutPage"));
const ReferAFriendPage     = lazy(() => import("@/pages/ReferAFriendPage"));
const AffiliatePage        = lazy(() => import("@/pages/AffiliatePage"));
const BundleAndSavePage    = lazy(() => import("@/pages/BundleAndSavePage"));
const StorageGuidePage     = lazy(() => import("@/pages/StorageGuidePage"));
const ResearchResultsPage  = lazy(() => import("@/pages/ResearchResultsPage"));
const ContactPage          = lazy(() => import("@/pages/ContactPage"));
// ChatWidget is hidden for now; restore the lazy import and <ChatWidget /> below to bring it back.
const BlogIndexPage        = lazy(() => import("@/pages/BlogIndexPage"));
const BlogPostPage         = lazy(() => import("@/pages/BlogPostPage"));
const NotFound             = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

/** In-place navigations (e.g. switching a product's strength) pass
    `state: { keepScroll: true }`: no scroll reset and no progress bar. */
export const isInPlaceNavigation = () => !!(window.history.state as { keepScroll?: boolean } | null)?.keepScroll;

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (isInPlaceNavigation()) return;
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function PixelTracker() {
  useEffect(() => { initPixels(); }, []);
  usePageTracking();
  return null;
}

function LiveVisitorHeartbeat() {
  const [location] = useLocation();

  useEffect(() => {
    let visitorId = sessionStorage.getItem("omniqure-live-visitor");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      sessionStorage.setItem("omniqure-live-visitor", visitorId);
    }
    const sendHeartbeat = () => {
      if (document.visibilityState !== "visible") return;
      void fetch("/api/traffic/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, path: window.location.pathname }),
        keepalive: true,
      });
    };
    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 30_000);
    document.addEventListener("visibilitychange", sendHeartbeat);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", sendHeartbeat);
    };
  }, [location]);

  return null;
}

function IdlePrefetcher() {
  useEffect(() => {
    // Kick off background chunk downloads after the first paint settles.
    // Order = most-visited first so the highest-value routes load earliest.
    idlePrefetch([
      "/all-peptides",
      "/product",
      "/cart",
      "/bac-water",
      "/protocols",
      "/faq",
      "/stacks",
      "/sign-in",
      "/account",
      "/checkout",
      "/about",
      "/shipping",
      "/affiliate",
    ]);
  }, []);
  return null;
}

/** Slim top-of-page progress bar — gives instant feedback on every navigation. */
function NavProgress() {
  const [location] = useLocation();
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isInPlaceNavigation()) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(true);
    setPct(0);
    // Animate: 0 → 70 quickly, 70 → 92 slowly (simulates waiting), then snap to 100 and fade
    timers.current.push(setTimeout(() => setPct(70), 60));
    timers.current.push(setTimeout(() => setPct(92), 400));
    timers.current.push(setTimeout(() => setPct(100), 700));
    timers.current.push(setTimeout(() => setVisible(false), 950));
    return () => timers.current.forEach(clearTimeout);
  }, [location]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        height: 3,
        width: `${pct}%`,
        background: "var(--oq-cornflower)",
        transition: pct === 0 ? "none" : "width 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease",
        opacity: visible ? 1 : 0,
        borderRadius: "0 2px 2px 0",
        pointerEvents: "none",
      }}
    />
  );
}

/** Document-level hover listener — prefetches the chunk for ANY internal link,
 *  covering product cards, footer links, and every other anchor sitewide. */
function GlobalPrefetch() {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#") || href.startsWith("tel")) return;
      prefetchRoute(href);
    };
    document.addEventListener("mouseover", handle, { passive: true });
    return () => document.removeEventListener("mouseover", handle);
  }, []);
  return null;
}

/** Fades the page content in each time the route changes — removes the jarring hard-cut. */
function PageFade({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInPlaceNavigation()) return;
    el.animate(
      [
        { opacity: 0, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 180, easing: "ease-out", fill: "forwards" }
    );
  }, [location]);

  return (
    <main ref={ref} className="flex-1">
      {children}
    </main>
  );
}

function PeptideCalculatorRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/calculator", { replace: true });
  }, [navigate]);

  return null;
}


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/all-peptides" component={AllPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/stacks" component={StacksPage} />
      <Route path="/calculator" component={ReconstitutionCalculator} />
      <Route path="/peptide-calculator" component={PeptideCalculatorRedirect} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/sign-up" component={Register} />
      <Route path="/register" component={Register} />
      <Route path="/account" component={AccountPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/wallid-return" component={WallidReturn} />
      <Route path="/continue-payment" component={ContinuePayment} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/protocols" component={ProtocolsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/glossary" component={GlossaryPage} />
      <Route path="/lab-reports" component={LabReportsPage} />
      <Route path="/bac-water" component={BacWaterPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/refer-a-friend" component={ReferAFriendPage} />
      <Route path="/affiliate" component={AffiliatePage} />
      <Route path="/bundle-and-save" component={BundleAndSavePage} />
      <Route path="/storage-guide" component={StorageGuidePage} />
      <Route path="/research-results" component={ResearchResultsPage} />
      <Route path="/blog" component={BlogIndexPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function HeaderStack() {
  // On the homepage the conversion band occupies the slot under the header,
  // so the jurisdiction notice shows on every other route.
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <>
      <Header />
      {!isHome && <JurisdictionWarning />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProductsProvider>
        <CustomerAuthProvider>
        <CurrencyProvider>
          <RecentlyViewedProvider>
          <WishlistProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <OverlayCoordinatorProvider>
              <NavProgress />
              <ScrollToTop />
              <PixelTracker />
               <LiveVisitorHeartbeat />
              <AffiliateAttributionCapture />
              <IdlePrefetcher />
              <GlobalPrefetch />
              <CookieConsent />
              <div className="min-h-screen bg-white flex flex-col">
                <HeaderStack />
                <PageFade>
                  {/* Hold a screen of space while a page's code loads, so the
                      footer doesn't flash into view and then jump away. */}
                  <Suspense fallback={<div style={{ minHeight: "100vh" }} aria-busy="true" />}>
                    <Router />
                  </Suspense>
                </PageFade>
                <SiteDisclaimer />
                <Footer />
              </div>
              <CartPreviewPanel />
              <StickyCartBar />
              <AgeGate />
              </OverlayCoordinatorProvider>
            </WouterRouter>
            <Toaster />
          </CartProvider>
          </WishlistProvider>
          </RecentlyViewedProvider>
        </CurrencyProvider>
        </CustomerAuthProvider>
        </ProductsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
