import { Switch, Route, Router as WouterRouter } from "wouter";
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
import ReconstitutionCalculator from "@/pages/ReconstitutionCalculator";
import CartPage from "@/pages/CartPage";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/context/CartContext";

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
      <Route path="/research" component={PeptideResearch} />
      <Route path="/calculator" component={ReconstitutionCalculator} />
      <Route path="/contact">
        <PlaceholderPage title="Contact Us" description="Get in touch with our research team." />
      </Route>
      <Route path="/sign-in">
        <PlaceholderPage title="Sign In" description="Sign in to your research account." />
      </Route>
      <Route path="/cart" component={CartPage} />
      <Route path="/terms">
        <PlaceholderPage title="Terms & Conditions" description="Our terms and conditions of use." />
      </Route>
      <Route path="/shipping">
        <PlaceholderPage title="Shipping Policy" description="Our shipping and handling policy." />
      </Route>
      <Route path="/privacy">
        <PlaceholderPage title="Privacy Policy" description="How we handle your data." />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="min-h-screen bg-white flex flex-col">
              <AnnouncementBar />
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </WouterRouter>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
