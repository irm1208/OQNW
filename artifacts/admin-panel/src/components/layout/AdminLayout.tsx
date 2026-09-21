import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { getAdminMeQueryKey, useAdminLogout, useAdminMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Loader2,
  RotateCcw, Bell, ShieldAlert, ChevronDown, ChevronRight, BarChart3,
  Settings, ClipboardList, Menu, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAlerts, useMarkAlertRead, type AdminAlert } from "@/hooks/useAlerts";
import { Link as WLink } from "wouter";
import { GlobalCommand } from "./GlobalCommand";

type NavLink = { href: string; label: string; icon?: React.ElementType; isGroup?: false };
type NavGroup = { label: string; icon: React.ElementType; items: Omit<NavLink, "icon" | "isGroup">[]; isGroup: true };
type NavItem = NavLink | NavGroup;

const navigation: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, isGroup: false },
  {
    label: "Orders", icon: ShoppingCart, isGroup: true,
    items: [
      { href: "/orders", label: "Orders" },
      { href: "/refunds", label: "Refunds" },
      { href: "/crypto-payments", label: "Crypto Audit" },
      { href: "/wholesale", label: "Wholesale" },
    ]
  },
  {
    label: "Products & Inventory", icon: Package, isGroup: true,
    items: [
      { href: "/products", label: "Products" },
      { href: "/stock-alerts", label: "Stock Alerts" },
      { href: "/inventory-audit", label: "Inventory Audit" },
    ]
  },
  {
    label: "Customers", icon: Users, isGroup: true,
    items: [
      { href: "/customers", label: "Customers" },
      { href: "/customer-segments", label: "Segments" },
      { href: "/loyalty", label: "Loyalty" },
      { href: "/credits", label: "Credits" },
      { href: "/referrals", label: "Referrals" },
      { href: "/affiliates", label: "Affiliates" },
    ]
  },
  { href: "/fulfillment", label: "Fulfilment", icon: ClipboardList, isGroup: false },
  {
    label: "Returns", icon: RotateCcw, isGroup: true,
    items: [
      { href: "/returns", label: "Returns" },
      { href: "/reviews", label: "Reviews" },
    ]
  },
  {
    label: "Marketing", icon: Tags, isGroup: true,
    items: [
      { href: "/discounts", label: "Discounts" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/blog", label: "Blog" },
      { href: "/abandoned-carts", label: "Abandoned Carts" },
      { href: "/email-log", label: "Email Log" },
    ]
  },
  { href: "/reports", label: "Reports", icon: BarChart3, isGroup: false },
  {
    label: "Risk & Security", icon: ShieldAlert, isGroup: true,
    items: [
      { href: "/fraud", label: "Fraud Queue" },
      { href: "/blocked-ips", label: "Blocked IPs" },
      { href: "/public-traffic", label: "Traffic Protection" },
      { href: "/security-activity", label: "Security Activity" },
      { href: "/audit-history", label: "Audit History" },
    ]
  },
  {
    label: "Settings", icon: Settings, isGroup: true,
    items: [
      { href: "/settings", label: "Store Settings" },
      { href: "/shipping", label: "Shipping" },
      { href: "/tax", label: "Tax Rates" },
      { href: "/webhooks", label: "Webhooks" },
      { href: "/users", label: "Admin Users" },
    ]
  }
];

const SEVERITY_DOT: Record<AdminAlert["severity"], string> = {
  danger:  "bg-red-500",
  warning: "bg-amber-400",
  info:    "bg-slate-400",
};

function AlertsDropdown({ onClose }: { onClose: () => void }) {
  const { data: alerts } = useAlerts();
  const markRead = useMarkAlertRead();
  const recent = (alerts ?? []).slice(0, 8);

  return (
    <div className="absolute right-0 top-10 z-50 w-[min(calc(100vw-1.5rem),20rem)] max-w-[calc(100vw-1.5rem)] bg-card border rounded-xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-sm">Alerts</span>
        <WLink href="/alerts" onClick={onClose} className="text-xs text-primary hover:underline">
          View all
        </WLink>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No alerts</p>
      ) : (
        <div className="divide-y max-h-72 overflow-y-auto">
          {recent.map((alert) => (
            <WLink key={`${alert.id}:${alert.createdAt}`} href={alert.link} onClick={() => {
              if (!alert.isRead) markRead.mutate(alert);
              onClose();
            }}>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[alert.severity]}`} />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${alert.isRead ? "text-muted-foreground" : ""}`}>{alert.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                </div>
              </div>
            </WLink>
          ))}
        </div>
      )}
    </div>
  );
}

function BellButton() {
  const { data: alerts } = useAlerts();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notificationCount = (alerts ?? []).filter((alert) => !alert.isRead).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </Button>
      {open && <AlertsDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}

function NavigationMenu({
  location,
  onNavigate,
}: {
  location: string;
  onNavigate?: () => void;
}) {
  const { data: alerts } = useAlerts();
  const notificationCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "/alerts": (alerts ?? []).filter((alert) => !alert.isRead).length,
    };
    const hrefByType: Record<AdminAlert["type"], string> = {
      order: "/orders",
      return: "/returns",
      stock: "/stock-alerts",
      cart: "/abandoned-carts",
      fraud: "/fraud",
    };
    for (const alert of (alerts ?? []).filter((item) => !item.isRead)) {
      const href = hrefByType[alert.type];
      counts[href] = (counts[href] ?? 0) + 1;
    }
    return counts;
  }, [alerts]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    try {
      const stored = sessionStorage.getItem("omniqure:admin:nav:expanded");
      const parsed = stored ? JSON.parse(stored) : {};

      const autoExpanded = { ...parsed };
      navigation.forEach((item) => {
        if (item.isGroup) {
          const hasActiveChild = item.items.some((child) => location === child.href || location.startsWith(`${child.href}/`));
          if (hasActiveChild) {
            autoExpanded[item.label] = true;
          }
        }
      });
      return autoExpanded;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const activeGroup = navigation.find(
      (item): item is NavGroup =>
        item.isGroup === true &&
        item.items.some(
          (child) => location === child.href || location.startsWith(`${child.href}/`),
        ),
    );
    if (!activeGroup) return;

    setExpanded((current) => {
      if (current[activeGroup.label]) return current;
      const next = { ...current, [activeGroup.label]: true };
      try {
        sessionStorage.setItem("omniqure:admin:nav:expanded", JSON.stringify(next));
      } catch {
        // Navigation still works when session storage is unavailable.
      }
      return next;
    });
  }, [location]);

  const toggleGroup = (label: string) => {
    const next = { ...expanded, [label]: !expanded[label] };
    setExpanded(next);
    try {
      sessionStorage.setItem("omniqure:admin:nav:expanded", JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        if (item.isGroup) {
          const hasActiveChild = item.items.some(child => location === child.href || location.startsWith(`${child.href}/`));
          const isExpanded = expanded[item.label] || false;

          return (
            <div key={item.label} className="space-y-0.5">
              <button
                onClick={() => toggleGroup(item.label)}
                aria-expanded={isExpanded}
                className={`w-full flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                  hasActiveChild
                    ? "bg-black/5 dark:bg-white/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${hasActiveChild ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-0.5 mt-0.5 ml-2 border-l border-border pl-2">
                  {item.items.map((child) => {
                    const isActive = location === child.href || location.startsWith(`${child.href}/`);
                    const notificationCount = notificationCounts[child.href] ?? 0;

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`relative flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                          isActive
                            ? "text-foreground font-semibold bg-black/5 dark:bg-white/10"
                            : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate">{child.label}</span>
                        {notificationCount > 0 && (
                          <span
                            aria-label={`${notificationCount} notification${notificationCount === 1 ? "" : "s"}`}
                            className="min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1"
                          >
                            {notificationCount > 99 ? "99+" : notificationCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const isActive = location === item.href || location.startsWith(`${item.href}/`);
        const notificationCount = notificationCounts[item.href] ?? 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`relative flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
              isActive
                ? "bg-black/5 dark:bg-white/10 text-foreground font-semibold"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {item.icon && <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />}
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {notificationCount > 0 && (
              <span
                aria-label={`${notificationCount} notification${notificationCount === 1 ? "" : "s"}`}
                className="min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: session, isLoading } = useAdminMe();
  const logout = useAdminLogout();
  const queryClient = useQueryClient();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return <Redirect to="/login" />;
  }

  const handleLogout = () => {
    if (logout.isPending) return;
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        queryClient.setQueryData(getAdminMeQueryKey(), { authenticated: false });
        navigate("/login");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-[240px] flex-col bg-sidebar border-r border-border hidden lg:flex">
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={`${import.meta.env.BASE_URL}omniqure-wordmark.png?v=4`}
              alt="OmniQure"
              className="h-auto w-[150px]"
            />
            <span className="sr-only">OmniQure Admin</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
           <NavigationMenu location={location} />
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="min-h-12 sm:min-h-14 flex items-center justify-between gap-3 px-3 sm:px-6 bg-card border-b">
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open admin navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <img
              src={`${import.meta.env.BASE_URL}omniqure-wordmark.png?v=4`}
              alt="OmniQure Admin"
              className="h-auto w-[128px] sm:w-[150px]"
            />
          </div>

          <div className="hidden lg:flex flex-1 items-center max-w-md ml-4">
            <Button
              variant="outline"
              onClick={() => setCommandOpen(true)}
              className="relative w-full justify-start text-sm text-muted-foreground bg-muted/50 hover:bg-muted"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search orders, customers, products...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)} aria-label="Search">
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <BellButton />
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout} className="hidden lg:flex">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <div data-admin-content className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="admin-page mx-auto w-full max-w-[1440px]">{children}</div>
        </div>
      </main>

      <GlobalCommand open={commandOpen} onOpenChange={setCommandOpen} />

       <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
         <SheetContent
           side="left"
           className="w-[min(88vw,20rem)] p-0 bg-card [&>button]:right-3 [&>button]:top-4"
         >
           <SheetHeader className="sr-only">
             <SheetTitle>Admin navigation</SheetTitle>
             <SheetDescription>Navigate to an admin section.</SheetDescription>
           </SheetHeader>
           <div className="flex h-full flex-col">
             <div className="h-14 shrink-0 flex items-center px-5 border-b">
                <img
                  src={`${import.meta.env.BASE_URL}omniqure-wordmark.png?v=4`}
                  alt="OmniQure Admin"
                  className="h-auto w-[160px]"
                />
             </div>
             <nav className="flex-1 px-3 py-4 overflow-y-auto">
               <NavigationMenu location={location} onNavigate={() => setMobileNavOpen(false)} />
             </nav>
             <div className="p-4 border-t">
               <Button variant="ghost" className="w-full min-h-11 justify-start text-muted-foreground" onClick={handleLogout}>
                 <LogOut className="w-4 h-4 mr-2" />
                 Logout
               </Button>
             </div>
           </div>
         </SheetContent>
       </Sheet>
    </div>
  );
}
