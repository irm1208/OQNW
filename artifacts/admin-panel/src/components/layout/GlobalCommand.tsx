import * as React from "react";
import { useLocation } from "wouter";
import { Search, ShoppingCart, Users, Package, Network, Clock, Loader2, LayoutDashboard, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type RecentItem = {
  id: string;
  type: "route" | "order" | "customer" | "product" | "affiliate";
  title: string;
  subtitle: string;
  url: string;
};

type OrderSearchResult = {
  id: number;
  orderNumber: string;
  customerName: string | null;
  status: string;
  totalGbp: number | string;
};

type CustomerSearchResult = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

type ProductSearchResult = {
  id: number;
  name: string;
  category: string;
  priceGbp: number | string | null;
};

type AffiliateSearchResult = {
  id: number;
  name: string;
  email: string;
  status: string;
};

const RECENT_KEY = "omniqure:admin:recent_searches";

function loadRecent(): RecentItem[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 5) as RecentItem[] : [];
  } catch {
    return [];
  }
}

function saveRecent(items: RecentItem[]) {
  try {
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    // Search remains fully usable when browser storage is unavailable.
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const formatCurrency = (value: number | string) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
    : "—";
};

export function GlobalCommand({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 300);
  const searchTerm = debouncedSearch.trim();
  const [recentItems, setRecentItems] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    if (open) {
      setRecentItems(loadRecent());
    }
  }, [open]);

  // Clear search when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const MIN_SEARCH_LEN = 2;

  const { data: orders, isFetching: loadingOrders, error: errorOrders } = useQuery({
    queryKey: ["admin", "search", "orders", searchTerm],
    queryFn: () => fetchJson<{ orders: OrderSearchResult[] }>(`/api/admin/orders?search=${encodeURIComponent(searchTerm)}&limit=5&offset=0`, { credentials: "include" }),
    enabled: searchTerm.length >= MIN_SEARCH_LEN && open,
  });

  const { data: customers, isFetching: loadingCustomers, error: errorCustomers } = useQuery({
    queryKey: ["admin", "search", "customers", searchTerm],
    queryFn: () => fetchJson<{ customers: CustomerSearchResult[] }>(`/api/admin/customers?search=${encodeURIComponent(searchTerm)}&limit=5&offset=0`, { credentials: "include" }),
    enabled: searchTerm.length >= MIN_SEARCH_LEN && open,
  });

  const { data: products, isFetching: loadingProducts, error: errorProducts } = useQuery({
    queryKey: ["admin", "search", "products", searchTerm],
    queryFn: () => fetchJson<ProductSearchResult[]>(`/api/admin/catalog?search=${encodeURIComponent(searchTerm)}`, { credentials: "include" }).then(res => res.slice(0, 5)),
    enabled: searchTerm.length >= MIN_SEARCH_LEN && open,
  });

  const { data: affiliates, isFetching: loadingAffiliates, error: errorAffiliates } = useQuery({
    queryKey: ["admin", "search", "affiliates", searchTerm],
    queryFn: () => fetchJson<{ partners: AffiliateSearchResult[] }>(`/api/admin/affiliates/partners?search=${encodeURIComponent(searchTerm)}&status=all`, { credentials: "include" }).then(res => ({ partners: res.partners.slice(0, 5) })),
    enabled: searchTerm.length >= MIN_SEARCH_LEN && open,
  });

  const isSearching = loadingOrders || loadingCustomers || loadingProducts || loadingAffiliates;
  const hasErrors = !!(errorOrders || errorCustomers || errorProducts || errorAffiliates);
  const hasResults = 
    (orders?.orders?.length || 0) > 0 ||
    (customers?.customers?.length || 0) > 0 ||
    (products?.length || 0) > 0 ||
    (affiliates?.partners?.length || 0) > 0;

  const handleNavigation = (url: string) => {
    setLocation(url);
    onOpenChange(false);
  };

  const handleSelect = (item: RecentItem) => {
    const prev = loadRecent();
    const next = [item, ...prev.filter(i => i.url !== item.url)].slice(0, 5);
    saveRecent(next);
    setRecentItems(next);
    setLocation(item.url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-2xl sm:rounded-xl">
        <DialogTitle className="sr-only">Global Search</DialogTitle>
        <DialogDescription className="sr-only">Search for orders, customers, products, and partners, or navigate to an admin section.</DialogDescription>
        <Command 
          shouldFilter={false} 
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
        >
          <CommandInput placeholder="Search orders, customers, products..." value={search} onValueChange={setSearch} />
          <CommandList className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            {searchTerm.length > 0 && searchTerm.length < MIN_SEARCH_LEN && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Keep typing to search...
              </div>
            )}

            {searchTerm.length >= MIN_SEARCH_LEN && isSearching && !hasResults && (
              <div className="py-6 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {searchTerm.length >= MIN_SEARCH_LEN && !isSearching && hasErrors && !hasResults && (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load search results.
              </div>
            )}

            {searchTerm.length >= MIN_SEARCH_LEN && !isSearching && !hasErrors && !hasResults && (
              <div className="py-6 text-center text-sm">No results found for "{searchTerm}".</div>
            )}

            {searchTerm.length >= MIN_SEARCH_LEN && hasResults && (
              <>
                {hasErrors && (
                  <div className="border-b px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
                    Some search sources are temporarily unavailable.
                  </div>
                )}
                {orders?.orders && orders.orders.length > 0 && (
                  <CommandGroup heading="Orders">
                    {orders.orders.map(order => (
                      <CommandItem key={`order-${order.id}`} value={`order-${order.id}`} onSelect={() => handleSelect({
                        id: String(order.id),
                        type: "order",
                        title: "Previously opened order",
                        subtitle: "",
                        url: `/orders/${order.id}`,
                      })}>
                        <ShoppingCart className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.orderNumber}</span>
                          <span className="text-xs text-muted-foreground">{order.customerName} &middot; {order.status}</span>
                        </div>
                        <span className="ml-auto text-sm text-muted-foreground">{formatCurrency(order.totalGbp)}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {customers?.customers && customers.customers.length > 0 && (
                  <CommandGroup heading="Registered Users">
                    {customers.customers.map(customer => (
                      <CommandItem key={`customer-${customer.id}`} value={`customer-${customer.id}`} onSelect={() => handleSelect({
                        id: String(customer.id),
                        type: "customer",
                        title: "Previously opened customer",
                        subtitle: "",
                        url: `/customers/${customer.id}`,
                      })}>
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{customer.firstName} {customer.lastName}</span>
                          <span className="text-xs text-muted-foreground">{customer.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {products && products.length > 0 && (
                  <CommandGroup heading="Products">
                    {products.map(product => (
                      <CommandItem key={`product-${product.id}`} value={`product-${product.id}`} onSelect={() => handleSelect({
                        id: String(product.id),
                        type: "product",
                        title: product.name,
                        subtitle: product.category,
                        url: "/products",
                      })}>
                        <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{product.name}</span>
                          <span className="text-xs text-muted-foreground">{product.category}</span>
                        </div>
                        <span className="ml-auto text-sm text-muted-foreground">{product.priceGbp != null ? formatCurrency(product.priceGbp) : "—"}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {affiliates?.partners && affiliates.partners.length > 0 && (
                  <CommandGroup heading="Affiliate Partners">
                    {affiliates.partners.map(partner => (
                      <CommandItem key={`affiliate-${partner.id}`} value={`affiliate-${partner.id}`} onSelect={() => handleSelect({
                        id: String(partner.id),
                        type: "affiliate",
                        title: "Previously opened affiliate",
                        subtitle: "",
                        url: "/affiliates",
                      })}>
                        <Network className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{partner.name}</span>
                          <span className="text-xs text-muted-foreground">{partner.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}

            {!searchTerm && (
              <>
                {recentItems.length > 0 && (
                  <CommandGroup heading="Recent">
                    {recentItems.map(item => (
                      <CommandItem key={item.url} value={item.url} onSelect={() => handleSelect(item)}>
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup heading="Quick Navigation">
                  <CommandItem value="nav-dashboard" onSelect={() => handleNavigation("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Dashboard</span>
                  </CommandItem>
                  <CommandItem value="nav-orders" onSelect={() => handleNavigation("/orders")}>
                    <ShoppingCart className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Orders</span>
                  </CommandItem>
                  <CommandItem value="nav-products" onSelect={() => handleNavigation("/products")}>
                    <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Products</span>
                  </CommandItem>
                  <CommandItem value="nav-customers" onSelect={() => handleNavigation("/customers")}>
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Customers</span>
                  </CommandItem>
                  <CommandItem value="nav-audit-history" onSelect={() => handleNavigation("/audit-history")}>
                    <ClipboardList className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Audit History</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
