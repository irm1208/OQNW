import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import AllPeptides from "@/pages/AllPeptides";
import ProductPage from "@/pages/ProductPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="text-gray-500 mb-6">This page is coming soon.</p>
      <a href="/" className="text-sm" style={{ color: "#E7461E" }}>
        ← Back to All Peptides
      </a>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AllPeptides} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/bundles">
        <PlaceholderPage title="Bundle & Save" />
      </Route>
      <Route path="/research">
        <PlaceholderPage title="Peptide Research" />
      </Route>
      <Route path="/info">
        <PlaceholderPage title="Peptide Information" />
      </Route>
      <Route path="/company">
        <PlaceholderPage title="Our Company" />
      </Route>
      <Route path="/contact">
        <PlaceholderPage title="Contact Us" />
      </Route>
      <Route path="/sign-in">
        <PlaceholderPage title="Sign In" />
      </Route>
      <Route path="/cart">
        <PlaceholderPage title="My Cart" />
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
          <div className="min-h-screen bg-white">
            <Header />
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
