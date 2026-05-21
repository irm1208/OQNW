import { useState, useRef, useEffect } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { useAdminLogout, useAdminMe } from "@workspace/api-client-react";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Loader2,
  RotateCcw, Star, ShoppingBag, RefreshCw, Mail, Gift, BellRing, Receipt,
  Truck, RefreshCcw, ClipboardList, FileText, Bell, CreditCard, ShieldAlert,
  ChevronDown, ChevronRight, Settings2, ShieldBan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAlerts, type AdminAlert } from "@/hooks/useAlerts";
import { Link as WLink } from "wouter";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const coreNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/alerts",    label: "Alerts",    icon: Bell },
    ],
  },
  {
    label: "Orders",
    items: [
      { href: "/orders",  label: "Orders",      icon: ShoppingCart },
      { href: "/fraud",   label: "Fraud Queue", icon: ShieldAlert },
      { href: "/returns", label: "Returns",     icon: RotateCcw },
      { href: "/refunds", label: "Refunds",     icon: RefreshCcw },
    ],
  },
  {
    label: "Customers",
    items: [
      { href: "/customers", label: "Customers", icon: Users },
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
      { href: "/tax",         label: "Tax Rates",   icon: Receipt },
      { href: "/shipping",    label: "Shipping",    icon: Truck },
      { href: "/blocked-ips", label: "Blocked IPs", icon: ShieldBan },
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
      { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
      { href: "/credits",       label: "Credits",       icon: CreditCard },
    ],
  },
  {
    label: "Products",
    items: [
      { href: "/inventory-audit", label: "Inventory Audit", icon: ClipboardList },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/blog",      label: "Blog",      icon: FileText },
      { href: "/email-log", label: "Email Log", icon: Mail },
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

function NavGroups({ groups, location }: { groups: NavGroup[]; location: string }) {
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 flex-col bg-card border-r hidden md:flex">
        <div className="h-14 flex items-center justify-between px-6 border-b">
          <h1 className="font-bold text-lg text-primary tracking-tight">OmniQure Admin</h1>
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

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 bg-card border-b md:hidden">
          <h1 className="font-bold text-lg text-primary">OmniQure Admin</h1>
          <div className="flex items-center gap-1">
            <BellButton />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
