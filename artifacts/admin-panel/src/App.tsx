import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Products from "@/pages/Products";
import Discounts from "@/pages/Discounts";
import Returns from "@/pages/Returns";
import Reviews from "@/pages/Reviews";
import AbandonedCarts from "@/pages/AbandonedCarts";
import EmailLog from "@/pages/EmailLog";
import Loyalty from "@/pages/Loyalty";
import StockAlerts from "@/pages/StockAlerts";
import Shipping from "@/pages/Shipping";
import Refunds from "@/pages/Refunds";
import Blog from "@/pages/Blog";
import Alerts from "@/pages/Alerts";
import Fraud from "@/pages/Fraud";
import BlockedIps from "@/pages/BlockedIps";
import Newsletter from "@/pages/Newsletter";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import Reports from "@/pages/Reports";
import FulfillmentQueue from "@/pages/FulfillmentQueue";

const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/alerts">
        <AdminLayout>
          <Alerts />
        </AdminLayout>
      </Route>
      <Route path="/fraud">
        <AdminLayout>
          <Fraud />
        </AdminLayout>
      </Route>
      <Route path="/orders">
        <AdminLayout>
          <Orders />
        </AdminLayout>
      </Route>
      <Route path="/orders/:id">
        <AdminLayout>
          <OrderDetail />
        </AdminLayout>
      </Route>
      <Route path="/fulfillment">
        <AdminLayout>
          <FulfillmentQueue />
        </AdminLayout>
      </Route>
      <Route path="/customers">
        <AdminLayout>
          <Customers />
        </AdminLayout>
      </Route>
      <Route path="/customers/:id">
        <AdminLayout>
          <CustomerDetail />
        </AdminLayout>
      </Route>
      <Route path="/products">
        <AdminLayout>
          <Products />
        </AdminLayout>
      </Route>
      <Route path="/discounts">
        <AdminLayout>
          <Discounts />
        </AdminLayout>
      </Route>
      <Route path="/returns">
        <AdminLayout>
          <Returns />
        </AdminLayout>
      </Route>
      <Route path="/reviews">
        <AdminLayout>
          <Reviews />
        </AdminLayout>
      </Route>
      <Route path="/abandoned-carts">
        <AdminLayout>
          <AbandonedCarts />
        </AdminLayout>
      </Route>
      <Route path="/email-log">
        <AdminLayout>
          <EmailLog />
        </AdminLayout>
      </Route>
      <Route path="/loyalty">
        <AdminLayout>
          <Loyalty />
        </AdminLayout>
      </Route>
      <Route path="/stock-alerts">
        <AdminLayout>
          <StockAlerts />
        </AdminLayout>
      </Route>
      <Route path="/shipping">
        <AdminLayout>
          <Shipping />
        </AdminLayout>
      </Route>
      <Route path="/refunds">
        <AdminLayout>
          <Refunds />
        </AdminLayout>
      </Route>
      <Route path="/blog">
        <AdminLayout>
          <Blog />
        </AdminLayout>
      </Route>
      <Route path="/blocked-ips">
        <AdminLayout>
          <BlockedIps />
        </AdminLayout>
      </Route>
      <Route path="/reports">
        <AdminLayout>
          <Reports />
        </AdminLayout>
      </Route>
      <Route path="/newsletter">
        <AdminLayout>
          <Newsletter />
        </AdminLayout>
      </Route>
      <Route path="/settings">
        <AdminLayout>
          <Settings />
        </AdminLayout>
      </Route>
      <Route path="/users">
        <AdminLayout>
          <Users />
        </AdminLayout>
      </Route>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route>
        <AdminLayout>
          <div className="flex h-[50vh] items-center justify-center text-muted-foreground text-lg">
            Page Not Found
          </div>
        </AdminLayout>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={basePath}>
        <AppRoutes />
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}
