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
import PopularPeptides from "@/pages/PopularPeptides";
import ProductPage from "@/pages/ProductPage";
import PeptideResearch from "@/pages/PeptideResearch";
import StacksPage from "@/pages/StacksPage";
import ReconstitutionCalculator from "@/pages/ReconstitutionCalculator";
import TermsPage from "@/pages/TermsPage";
import ShippingPage from "@/pages/ShippingPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmation from "@/pages/OrderConfirmation";
import SignIn from "@/pages/SignIn";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import LiveChat from "@/components/LiveChat";
import JurisdictionWarning from "@/components/JurisdictionWarning";
import AgeGate from "@/components/AgeGate";

const queryClient = new QueryClient();

function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
        {title}
      </h1>
      <p className="text-gray-500 mb-6 text-sm">{description || "This page is coming soon."}</p>
      <a href="/all-peptides" className="text-sm hover:underline" style={{ color: "#1B5CB5" }}>
        ← Back to All Peptides
      </a>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/all-peptides" component={AllPeptides} />
      <Route path="/popular-peptides" component={PopularPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/bundles">
        <PlaceholderPage title="Bundle & Save" description="Save on multi-peptide research bundles." />
      </Route>
      <Route path="/stacks" component={StacksPage} />
      <Route path="/research" component={PeptideResearch} />
      <Route path="/calculator" component={ReconstitutionCalculator} />
      <Route path="/contact">
        <PlaceholderPage title="Contact Us" description="Get in touch with our research team." />
      </Route>
      <Route path="/sign-in" component={SignIn} />
      <Route path="/register" component={Register} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CurrencyProvider>
          <RecentlyViewedProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <ScrollToTop />
              <div className="min-h-screen bg-white flex flex-col">
                <AnnouncementBar />
                <Header />
                <JurisdictionWarning />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
              <LiveChat />
              <AgeGate />
            </WouterRouter>
            <Toaster />
          </CartProvider>
          </RecentlyViewedProvider>
        </CurrencyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
