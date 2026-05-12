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
