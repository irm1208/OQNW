import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import HomePage from "@/pages/HomePage";
import AllPeptides from "@/pages/AllPeptides";
import ProductPage from "@/pages/ProductPage";
import StacksPage from "@/pages/StacksPage";
import ReconstitutionCalculator from "@/pages/ReconstitutionCalculator";
import TermsPage from "@/pages/TermsPage";
import ShippingPage from "@/pages/ShippingPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmation from "@/pages/OrderConfirmation";
import ContinuePayment from "@/pages/ContinuePayment";
import TrackOrderPage from "@/pages/TrackOrderPage";
import SignIn from "@/pages/SignIn";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Register from "@/pages/Register";
import AccountPage from "@/pages/AccountPage";
import WishlistPage from "@/pages/WishlistPage";
import ProtocolsPage from "@/pages/ProtocolsPage";
import FAQPage from "@/pages/FAQPage";
import GlossaryPage from "@/pages/GlossaryPage";
import LabTestsPage from "@/pages/LabTestsPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import BacWaterPage from "@/pages/BacWaterPage";
import AboutPage from "@/pages/AboutPage";
import ReferAFriendPage from "@/pages/ReferAFriendPage";
import BundleAndSavePage from "@/pages/BundleAndSavePage";
import StorageGuidePage from "@/pages/StorageGuidePage";
import ResearchResultsPage from "@/pages/ResearchResultsPage";
import ContactPage from "@/pages/ContactPage";
import { CookieConsent } from "@/components/CookieConsent";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ChatWidget from "@/components/ChatWidget";
import JurisdictionWarning from "@/components/JurisdictionWarning";
import AgeGate from "@/components/AgeGate";
import MobileBottomBar from "@/components/MobileBottomBar";
import CartPreviewPanel from "@/components/CartPreviewPanel";
import SiteDisclaimer from "@/components/SiteDisclaimer";
import { initPixels } from "@/lib/pixels";
import { usePageTracking } from "@/hooks/usePageTracking";

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
      <Route path="/continue-payment" component={ContinuePayment} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/protocols" component={ProtocolsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/glossary" component={GlossaryPage} />
      <Route path="/lab-tests" component={LabTestsPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
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
              <ScrollToTop />
              <PixelTracker />
              <CookieConsent />
              <div className="min-h-screen bg-white flex flex-col">
                <AnnouncementBar />
                <Header />
                <JurisdictionWarning />
                <main className="flex-1">
                  <Router />
                </main>
                <SiteDisclaimer />
                <Footer />
              </div>
              <CartPreviewPanel />
              <MobileBottomBar />
              <ChatWidget />
              <AgeGate />
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
