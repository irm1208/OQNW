import { Link, useLocation, Redirect } from "wouter";
import { useAdminLogout, useAdminMe } from "@workspace/api-client-react";
import { LayoutDashboard, ShoppingCart, Users, Package, Tags, LogOut, Loader2, RotateCcw, Star, ShoppingBag, RefreshCw, Mail, Gift, BellRing, Receipt, Truck, RefreshCcw, ClipboardList, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/returns", label: "Returns", icon: RotateCcw },
  { href: "/refunds",      label: "Refunds",      icon: RefreshCcw },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/inventory-audit", label: "Inventory Audit", icon: ClipboardList },
  { href: "/discounts", label: "Discounts", icon: Tags },
  { href: "/loyalty",   label: "Loyalty",   icon: Gift },
  { href: "/reviews",   label: "Reviews",   icon: Star },
  { href: "/abandoned-carts", label: "Abandoned Carts", icon: ShoppingBag },
  { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/email-log", label: "Email Log", icon: Mail },
  { href: "/stock-alerts", label: "Stock Alerts", icon: BellRing },
  { href: "/tax",          label: "Tax Rates",    icon: Receipt },
  { href: "/shipping",     label: "Shipping",     icon: Truck },
  { href: "/blog",         label: "Blog",         icon: FileText },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: session, isLoading } = useAdminMe();
  const logout = useAdminLogout();

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
        <div className="h-14 flex items-center px-6 border-b">
          <h1 className="font-bold text-lg text-primary tracking-tight">OmniQure Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
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
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
