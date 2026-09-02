import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { getAdminMeQueryKey, useAdminLogout, useAdminMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Loader2,
  RotateCcw, Star, ShoppingBag, Mail, Gift, BellRing,
  Truck, RefreshCcw, FileText, Bell, ShieldAlert,
  ChevronDown, ChevronRight, Settings2, ShieldBan, Send, BarChart3,
  Settings, UserCog, ClipboardList, WalletCards, Menu, ShieldCheck, Receipt, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAlerts, type AdminAlert } from "@/hooks/useAlerts";
import { Link as WLink } from "wouter";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const coreNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/reports",   label: "Reports",   icon: BarChart3 },
      { href: "/alerts",    label: "Alerts",    icon: Bell },
    ],
  },
  {
    label: "Orders",
    items: [
      { href: "/orders",      label: "Orders",           icon: ShoppingCart },
      { href: "/wholesale",   label: "Wholesale",        icon: Receipt },
      { href: "/fulfillment", label: "Fulfilment Queue", icon: ClipboardList },
      { href: "/fraud",       label: "Fraud Queue",      icon: ShieldAlert },
      { href: "/crypto-payments", label: "Crypto Audit", icon: WalletCards },
      { href: "/returns",     label: "Returns",          icon: RotateCcw },
      { href: "/refunds",     label: "Refunds",          icon: RefreshCcw },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/referrals", label: "Referrals", icon: Share2 },
    ],
  },
  {
    label: "Products",
    items: [
      { href: "/products",     label: "Products",     icon: Package },
      { href: "/discounts",    label: "Discounts",    icon: Tags },
      { href: "/stock-alerts", label: "Stock Alerts", icon: BellRing },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/settings",    label: "Store Settings", icon: Settings },
      { href: "/users",       label: "Admin Users",    icon: UserCog },
      { href: "/shipping",    label: "Shipping",       icon: Truck },
      { href: "/blocked-ips", label: "Blocked IPs",    icon: ShieldBan },
      { href: "/public-traffic", label: "Traffic Protection", icon: ShieldCheck },
      { href: "/security-activity", label: "Security Activity", icon: ShieldCheck },
    ],
  },
];

const advancedNavGroups: NavGroup[] = [
  {
    label: "Orders",
    items: [
      { href: "/abandoned-carts", label: "Abandoned Carts", icon: ShoppingBag },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/reviews",       label: "Reviews",       icon: Star },
      { href: "/loyalty",       label: "Loyalty",       icon: Gift },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/blog",       label: "Blog",       icon: FileText },
      { href: "/email-log",  label: "Email Log",  icon: Mail },
      { href: "/newsletter", label: "Newsletter", icon: Send },
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
  const recent = (alerts ?? []).slice(0, 8);

  return (
    <div className="absolute right-0 top-10 z-50 w-80 bg-card border rounded-xl shadow-xl overflow-hidden">
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
            <WLink key={alert.id} href={alert.link} onClick={onClose}>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEVERITY_DOT[alert.severity]}`} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold">{alert.title}</p>
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

  const criticalCount = (alerts ?? []).filter(
    (a) => a.severity === "danger" || a.severity === "warning",
  ).length;

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
        onClick={() => setOpen((o) => !o)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {criticalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {criticalCount > 99 ? "99+" : criticalCount}
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
  return (
    <>
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                       ? "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(27,92,181,0.28)]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
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
      <aside className="w-64 flex-col bg-card border-r hidden lg:flex">
        <div className="h-14 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-base font-extrabold text-primary-foreground">O</span>
            <h1 className="font-extrabold text-lg tracking-tight truncate">OmniQure</h1>
          </div>
          <BellButton />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
           <NavGroups groups={coreNavGroups} location={location} />

          <div className="border-t pt-3">
            <button
              onClick={() => setAdvancedOpen(o => !o)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings2 className="w-3 h-3 shrink-0" />
              <span className="flex-1 text-left">Advanced</span>
              {advancedOpen
                ? <ChevronDown className="w-3 h-3 shrink-0" />
                : <ChevronRight className="w-3 h-3 shrink-0" />}
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
          <div className="admin-page">{children}</div>
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
                   className="w-full min-h-11 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
                   aria-expanded={advancedOpen}
                 >
                   <Settings2 className="w-4 h-4 shrink-0" />
                   <span className="flex-1 text-left">Advanced</span>
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
