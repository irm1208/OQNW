import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import AllPeptides from "@/pages/AllPeptides";
import PopularPeptides from "@/pages/PopularPeptides";
import ProductPage from "@/pages/ProductPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>
        {title}
      </h1>
      <p className="text-gray-500 mb-6 text-sm">{description || "This page is coming soon."}</p>
      <a href="/" className="text-sm hover:underline" style={{ color: "#1B5CB5" }}>
        ← Back to All Peptides
      </a>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AllPeptides} />
      <Route path="/popular-peptides" component={PopularPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/bundles">
        <PlaceholderPage title="Bundle & Save" description="Save on multi-peptide research bundles." />
      </Route>
      <Route path="/research">
        <PlaceholderPage title="Peptide Research" description="Scientific literature and research resources." />
      </Route>
      <Route path="/info">
        <PlaceholderPage title="Peptide Information" description="Educational information about research peptides." />
      </Route>
      <Route path="/company">
        <PlaceholderPage title="Our Company" description="Learn about OmniQure." />
      </Route>
      <Route path="/contact">
        <PlaceholderPage title="Contact Us" description="Get in touch with our research team." />
      </Route>
      <Route path="/sign-in">
        <PlaceholderPage title="Sign In" description="Sign in to your research account." />
      </Route>
      <Route path="/cart">
        <PlaceholderPage title="My Cart" description="Your research cart." />
      </Route>
      <Route path="/terms">
        <PlaceholderPage title="Terms & Conditions" description="Our terms and conditions of use." />
      </Route>
      <Route path="/shipping">
        <PlaceholderPage title="Shipping Policy" description="Our shipping and handling policy." />
      </Route>
      <Route path="/privacy">
        <PlaceholderPage title="Privacy Policy" description="How we handle your data." />
      </Route>
      <Route path="/refunds">
        <PlaceholderPage title="Refund Policy" description="Our refund and return policy." />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
