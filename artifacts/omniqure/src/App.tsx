import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
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
import MobileBottomBar from "@/components/MobileBottomBar";
import CartPreviewPanel from "@/components/CartPreviewPanel";
import SiteDisclaimer from "@/components/SiteDisclaimer";
import { initPixels } from "@/lib/pixels";
import { usePageTracking } from "@/hooks/usePageTracking";
import { idlePrefetch, prefetchRoute } from "@/lib/prefetch";

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
const LabTestsPage         = lazy(() => import("@/pages/LabTestsPage"));
const LabReportsPage       = lazy(() => import("@/pages/LabReportsPage"));
const BacWaterPage         = lazy(() => import("@/pages/BacWaterPage"));
const AboutPage            = lazy(() => import("@/pages/AboutPage"));
const ReferAFriendPage     = lazy(() => import("@/pages/ReferAFriendPage"));
const BundleAndSavePage    = lazy(() => import("@/pages/BundleAndSavePage"));
const StorageGuidePage     = lazy(() => import("@/pages/StorageGuidePage"));
const ResearchResultsPage  = lazy(() => import("@/pages/ResearchResultsPage"));
const ContactPage          = lazy(() => import("@/pages/ContactPage"));
const ChatWidget            = lazy(() => import("@/components/ChatWidget"));
const NotFound             = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function PixelTracker() {
  useEffect(() => { initPixels(); }, []);
  usePageTracking();
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
        background: "linear-gradient(90deg, #2563EB, #60A5FA)",
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
    if (!el) return;
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


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/all-peptides" component={AllPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/stacks" component={StacksPage} />
      <Route path="/calculator" component={ReconstitutionCalculator} />
      <Route path="/peptide-calculator">{() => { const [, nav] = useLocation(); useEffect(() => nav("/calculator", { replace: true }), []); return null; }}</Route>
      <Route path="/contact" component={ContactPage} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
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
      <Route path="/lab-tests" component={LabTestsPage} />
      <Route path="/lab-reports" component={LabReportsPage} />
      <Route path="/bac-water" component={BacWaterPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/refer-a-friend" component={ReferAFriendPage} />
      <Route path="/bundle-and-save" component={BundleAndSavePage} />
      <Route path="/storage-guide" component={StorageGuidePage} />
      <Route path="/research-results" component={ResearchResultsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // When a jurisdiction compliance banner is active for the visitor's country,
  // it takes priority over the marketing announcement bar — showing both at
  // once stacks two full-width bars back to back for no added value.
  const [jurisdictionActive, setJurisdictionActive] = useState(false);

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
              <IdlePrefetcher />
              <GlobalPrefetch />
              <CookieConsent />
              <div className="min-h-screen bg-white flex flex-col">
                <AnnouncementBar suppressed={jurisdictionActive} />
                <Header />
                <JurisdictionWarning onActiveChange={setJurisdictionActive} />
                <PageFade>
                  <Suspense fallback={null}>
                    <Router />
                  </Suspense>
                </PageFade>
                <SiteDisclaimer />
                <Footer />
              </div>
              <CartPreviewPanel />
              <MobileBottomBar />
              <ChatWidget />
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
