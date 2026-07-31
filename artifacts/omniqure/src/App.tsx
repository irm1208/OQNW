import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useState } from "react";
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
const FenaReturn           = lazy(() => import("@/pages/FenaReturn"));
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


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/all-peptides" component={AllPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/stacks" component={StacksPage} />
      <Route path="/calculator" component={ReconstitutionCalculator} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/register" component={Register} />
      <Route path="/account" component={AccountPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/fena-return" component={FenaReturn} />
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
              <ScrollToTop />
              <PixelTracker />
              <CookieConsent />
              <div className="min-h-screen bg-white flex flex-col">
                <AnnouncementBar suppressed={jurisdictionActive} />
                <Header />
                <JurisdictionWarning onActiveChange={setJurisdictionActive} />
                <main className="flex-1">
                  <Suspense fallback={null}>
                    <Router />
                  </Suspense>
                </main>
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
