import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { getAdminMeQueryKey, useAdminLogout, useAdminMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Loader2,
  RotateCcw, Star, ShoppingBag, Mail, Gift, BellRing,
  Truck, RefreshCcw, FileText, Bell, ShieldAlert,
  ChevronDown, ChevronRight, Settings2, ShieldBan, Send, BarChart3,
  Settings, UserCog, ClipboardList, WalletCards, Menu, ShieldCheck, Receipt, Share2, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAlerts, useMarkAlertRead, type AdminAlert } from "@/hooks/useAlerts";
import { Link as WLink } from "wouter";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const coreNavGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/orders", label: "Orders", icon: ShoppingCart },
      { href: "/products", label: "Products", icon: Package },
      { href: "/customers", label: "Registered Users", icon: Users },
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/fulfillment", label: "Fulfilment", icon: ClipboardList },
      { href: "/returns", label: "Returns", icon: RotateCcw },
      { href: "/affiliates", label: "Affiliates", icon: Network },
      { href: "/discounts", label: "Discounts", icon: Tags },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/settings", label: "Store Settings", icon: Settings },
      { href: "/users", label: "Admin Users", icon: UserCog },
    ],
  },
];

const advancedNavGroups: NavGroup[] = [
  {
    label: "Sales",
    items: [
      { href: "/wholesale", label: "Wholesale", icon: Receipt },
      { href: "/fraud", label: "Fraud Queue", icon: ShieldAlert },
      { href: "/crypto-payments", label: "Crypto Audit", icon: WalletCards },
      { href: "/refunds", label: "Refunds", icon: RefreshCcw },
      { href: "/abandoned-carts", label: "Abandoned Carts", icon: ShoppingBag },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/reviews",       label: "Reviews",       icon: Star },
      { href: "/loyalty",       label: "Loyalty",       icon: Gift },
      { href: "/referrals", label: "Referrals", icon: Share2 },
    ],
  },
  {
    label: "Storefront",
    items: [
      { href: "/stock-alerts", label: "Stock Alerts", icon: BellRing },
      { href: "/shipping", label: "Shipping", icon: Truck },
      { href: "/blog",       label: "Blog",       icon: FileText },
      { href: "/email-log",  label: "Email Log",  icon: Mail },
      { href: "/newsletter", label: "Newsletter", icon: Send },
    ],
  },
  {
    label: "Security",
    items: [
      { href: "/blocked-ips", label: "Blocked IPs", icon: ShieldBan },
      { href: "/public-traffic", label: "Traffic Protection", icon: ShieldCheck },
      { href: "/security-activity", label: "Security Activity", icon: ShieldCheck },
    ],
  },
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

function NavGroups({
  groups,
  location,
  onNavigate,
}: {
  groups: NavGroup[];
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

  return (
    <>
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-2.5 mb-1.5 mt-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = location.startsWith(item.href);
              const notificationCount = notificationCounts[item.href] ?? 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  onPointerDown={onNavigate}
                  className={`relative flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium transition-colors ${
                    isActive
                        ? "bg-black/5 dark:bg-white/10 text-foreground font-semibold"
                       : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
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
        </div>
      ))}
    </>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: session, isLoading } = useAdminMe();
  const logout = useAdminLogout();
  const queryClient = useQueryClient();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-sm">O</span>
            <h1 className="font-semibold text-[15px] tracking-tight truncate">OmniQure</h1>
          </div>
          <BellButton />
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
           <NavGroups groups={coreNavGroups} location={location} />

          <div className="border-t pt-3">
            <button
              onClick={() => setAdvancedOpen(o => !o)}
              className="w-full flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-expanded={advancedOpen}
            >
              <Settings2 className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Specialist tools</span>
              {advancedOpen
                ? <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </button>
            {advancedOpen && (
              <div className="mt-3 space-y-4">
                <NavGroups groups={advancedNavGroups} location={location} />
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="min-h-12 sm:min-h-14 flex items-center justify-between gap-3 px-3 sm:px-6 bg-card border-b lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open admin navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-base sm:text-lg text-primary truncate flex-1">OmniQure Admin</h1>
          <div className="flex items-center gap-1">
            <BellButton />
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <div data-admin-content className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="admin-page mx-auto w-full max-w-[1440px]">{children}</div>
        </div>
      </main>

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
               <h1 className="font-bold text-lg text-primary tracking-tight">OmniQure Admin</h1>
             </div>
             <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
               <NavGroups groups={coreNavGroups} location={location} onNavigate={() => setMobileNavOpen(false)} />
               <div className="border-t pt-3">
                 <button
                   onClick={() => setAdvancedOpen(o => !o)}
                    className="w-full flex min-h-10 md:min-h-8 items-center gap-3 md:gap-2.5 rounded-md px-3 md:px-2.5 py-2 md:py-1.5 text-sm md:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                   aria-expanded={advancedOpen}
                 >
                   <Settings2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">Specialist tools</span>
                   {advancedOpen
                     ? <ChevronDown className="w-4 h-4 shrink-0" />
                     : <ChevronRight className="w-4 h-4 shrink-0" />}
                 </button>
                 {advancedOpen && (
                   <div className="mt-3 space-y-4">
                     <NavGroups groups={advancedNavGroups} location={location} onNavigate={() => setMobileNavOpen(false)} />
                   </div>
                 )}
               </div>
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
