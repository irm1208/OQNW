import { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bell,
  BellRing,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  RefreshCcw,
  RotateCcw,
  Send,
  Settings,
  Settings2,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tags,
  Truck,
  TrendingUp,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./_group.css";

type NavItem = { label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const coreNavGroups: NavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard }, { label: "Reports", icon: BarChart3 }, { label: "Alerts", icon: Bell }] },
  { label: "Orders", items: [{ label: "Orders", icon: ShoppingCart }, { label: "Fulfilment Queue", icon: ClipboardList }, { label: "Fraud Queue", icon: ShieldAlert }, { label: "Crypto Audit", icon: WalletCards }, { label: "Returns", icon: RotateCcw }, { label: "Refunds", icon: RefreshCcw }] },
  { label: "Customers", items: [{ label: "Customers", icon: Users }] },
  { label: "Products", items: [{ label: "Products", icon: Package }, { label: "Discounts", icon: Tags }, { label: "Stock Alerts", icon: BellRing }] },
  { label: "Settings", items: [{ label: "Store Settings", icon: Settings }, { label: "Admin Users", icon: UserCog }, { label: "Shipping", icon: Truck }, { label: "Blocked IPs", icon: ShieldBan }, { label: "Traffic Protection", icon: ShieldCheck }, { label: "Security Activity", icon: ShieldCheck }] },
];

const advancedNavGroups: NavGroup[] = [
  { label: "Orders", items: [{ label: "Abandoned Carts", icon: ShoppingBag }] },
  { label: "Customers", items: [{ label: "Reviews", icon: Star }, { label: "Loyalty", icon: Gift }] },
  { label: "Content", items: [{ label: "Blog", icon: FileText }, { label: "Email Log", icon: Mail }, { label: "Newsletter", icon: Send }] },
];

const revenue = [
  { date: "May 1", value: 1380 }, { date: "May 5", value: 1810 }, { date: "May 9", value: 1520 },
  { date: "May 13", value: 2350 }, { date: "May 17", value: 2100 }, { date: "May 21", value: 2780 },
  { date: "May 25", value: 2490 }, { date: "May 30", value: 3140 },
];
const customers = [
  { date: "May 1", value: 9 }, { date: "May 5", value: 13 }, { date: "May 9", value: 11 },
  { date: "May 13", value: 16 }, { date: "May 17", value: 14 }, { date: "May 21", value: 20 },
  { date: "May 25", value: 18 }, { date: "May 30", value: 24 },
];
const orderStatus = [
  { name: "pending", value: 14, color: "#f59e0b" }, { name: "processing", value: 22, color: "#3b82f6" },
  { name: "shipped", value: 18, color: "#8b5cf6" }, { name: "delivered", value: 86, color: "#10b981" },
  { name: "cancelled", value: 4, color: "#ef4444" },
];
const categories = [
  { name: "Supplements", value: 18200 }, { name: "Skincare", value: 12640 }, { name: "Wellness", value: 8940 },
  { name: "Bundles", value: 6210 }, { name: "Accessories", value: 3890 },
];
const categoryColors = ["#1240a0", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

function Navigation({ advanced, onAdvanced }: { advanced: boolean; onAdvanced: () => void }) {
  return (
    <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
      {coreNavGroups.map((group) => <NavGroup key={group.label} group={group} />)}
      <div className="border-t border-[var(--oq-border)] pt-3">
        <button onClick={onAdvanced} className="oq-focus-ring flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--oq-muted-foreground)] hover:bg-[var(--oq-muted)]">
          <Settings2 className="h-3 w-3" /><span className="flex-1 text-left">Advanced</span>
          {advanced ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        {advanced && <div className="mt-3 space-y-4">{advancedNavGroups.map((group) => <NavGroup key={group.label} group={group} />)}</div>}
      </div>
    </nav>
  );
}

function NavGroup({ group }: { group: NavGroup }) {
  return <div>
    <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-[var(--oq-muted-foreground)]">{group.label}</p>
    <div className="space-y-0.5">{group.items.map(({ label, icon: Icon }) => (
      <button key={label} className={`oq-focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${label === "Dashboard" ? "bg-[var(--oq-primary)] text-white" : "text-[var(--oq-muted-foreground)] hover:bg-[var(--oq-muted)] hover:text-[var(--oq-foreground)]"}`}>
        <Icon className="h-4 w-4 shrink-0" />{label}
      </button>
    ))}</div>
  </div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-[var(--oq-border)] bg-[var(--oq-card)] ${className}`}>{children}</section>;
}

export function CurrentAdminBaseline() {
  const [period, setPeriod] = useState("30d");
  const [advanced, setAdvanced] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const statCards: { title: string; value: string; icon: React.ElementType; sub?: string; danger?: boolean }[] = [
    { title: "Today's Revenue", value: "£1,842.00", icon: TrendingUp, sub: "12 orders today" }, { title: "Total Revenue", value: "£96,420.50", icon: CreditCard },
    { title: "Total Orders", value: "1,284", icon: ShoppingCart }, { title: "Customers", value: "842", icon: Users }, { title: "Avg Order Value", value: "£75.09", icon: Package },
    { title: "Low Stock Alerts", value: "3", icon: AlertCircle, danger: true },
  ];
  return (
    <div className="flex min-h-screen bg-[#f6f9fc] text-[var(--oq-foreground)]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--oq-border)] bg-white lg:flex">
        <div className="flex h-14 items-center justify-between border-b border-[var(--oq-border)] px-6">
          <h1 className="text-lg font-bold tracking-tight text-[var(--oq-primary)]">OmniQure Admin</h1>
          <div className="relative">
            <button onClick={() => setAlertsOpen(!alertsOpen)} className="oq-focus-ring relative rounded-md p-2 hover:bg-[var(--oq-muted)]" aria-label="Alerts"><Bell className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">3</span></button>
            {alertsOpen && <div className="absolute right-0 top-10 z-10 w-72 overflow-hidden rounded-xl border border-[var(--oq-border)] bg-white shadow-xl"><p className="border-b p-3 text-sm font-semibold">Alerts</p><div className="p-3 text-xs text-[var(--oq-muted-foreground)]">3 low stock products require attention</div></div>}
          </div>
        </div>
        <Navigation advanced={advanced} onAdvanced={() => setAdvanced(!advanced)} />
        <div className="border-t border-[var(--oq-border)] p-4"><button className="oq-focus-ring flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--oq-muted-foreground)] hover:bg-[var(--oq-muted)]"><LogOut className="h-4 w-4" />Logout</button></div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex min-h-14 items-center justify-between border-b border-[var(--oq-border)] bg-white px-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="oq-focus-ring rounded-md p-2" aria-label="Open admin navigation"><Menu className="h-5 w-5" /></button><h1 className="flex-1 px-3 text-base font-bold text-[var(--oq-primary)]">OmniQure Admin</h1><Bell className="h-5 w-5" />
        </header>
        {mobileOpen && <div className="fixed inset-0 z-20 bg-[#07162b]/35 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-[min(88vw,20rem)] flex-col bg-white" onClick={(event) => event.stopPropagation()}><div className="flex h-14 items-center border-b px-5 text-lg font-bold text-[var(--oq-primary)]">OmniQure Admin</div><Navigation advanced={advanced} onAdvanced={() => setAdvanced(!advanced)} /></aside></div>}
        <div className="min-w-0 overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><h2 className="text-2xl font-bold tracking-tight">Overview</h2><div className="flex gap-1 rounded-md bg-[var(--oq-muted)] p-1">{["7d", "30d", "90d", "1y"].map((value) => <button key={value} onClick={() => setPeriod(value)} className={`oq-focus-ring rounded px-3 py-1 text-xs font-medium ${period === value ? "bg-white text-[var(--oq-foreground)] shadow-sm" : "text-[var(--oq-muted-foreground)]"}`}>{value}</button>)}</div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{statCards.map(({ title, value, icon: Icon, sub, danger }) => <Card key={title} className="p-5"><div className="flex items-center justify-between pb-2 text-sm font-medium">{title}<Icon className={`h-4 w-4 ${danger ? "text-red-500" : "text-[var(--oq-muted-foreground)]"}`} /></div><p className={`text-2xl font-bold ${danger ? "text-red-500" : ""}`}>{value}</p>{sub && <p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">{sub}</p>}</Card>)}</div>
            <div className="grid gap-6 md:grid-cols-7">
              <Card className="p-6 md:col-span-5"><h3 className="font-semibold">Revenue</h3><div className="mt-4 h-[260px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenue}><defs><linearGradient id="admin-revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1240a0" stopOpacity=".3" /><stop offset="95%" stopColor="#1240a0" stopOpacity="0" /></linearGradient></defs><XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} /><YAxis tickFormatter={(n) => `£${n / 1000}k`} fontSize={11} tickLine={false} axisLine={false} /><Tooltip formatter={(n) => [`£${Number(n).toLocaleString("en-GB")}`, "Revenue"]} /><Area type="monotone" dataKey="value" stroke="#1240a0" strokeWidth={2} fill="url(#admin-revenue)" /></AreaChart></ResponsiveContainer></div></Card>
              <Card className="p-6 md:col-span-2"><h3 className="font-semibold">Order Status</h3><div className="mt-2 h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={orderStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>{orderStatus.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">{orderStatus.map((item) => <span key={item.name} className="flex items-center gap-1 text-xs"><i className="h-2 w-2 rounded-full" style={{ background: item.color }} /><span className="capitalize text-[var(--oq-muted-foreground)]">{item.name}</span><b>{item.value}</b></span>)}</div></Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6"><h3 className="font-semibold">New Customers</h3><div className="mt-4 h-[220px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={customers}><XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Card>
              <Card className="p-6"><h3 className="font-semibold">Revenue by Category</h3><div className="mt-4 h-[220px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories} layout="vertical"><XAxis type="number" tickFormatter={(n) => `£${n / 1000}k`} fontSize={11} tickLine={false} axisLine={false} /><YAxis type="category" dataKey="name" width={88} fontSize={11} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="value" radius={[0, 4, 4, 0]}>{categories.map((item, i) => <Cell key={item.name} fill={categoryColors[i]} />)}</Bar></BarChart></ResponsiveContainer></div></Card>
            </div>
            <Card className="p-6"><h3 className="font-semibold">Top Products</h3><div className="mt-4 divide-y divide-[var(--oq-border)]">{[["Daily Balance Capsules", "384", "£12,480.00"], ["Renewal Night Serum", "271", "£9,214.00"], ["Essential Wellness Bundle", "192", "£8,640.00"], ["Restore Hydration Cream", "158", "£6,162.00"]].map(([name, sold, total], i) => <div className="flex items-center gap-4 py-3" key={name}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[var(--oq-muted)] text-xs font-bold text-[var(--oq-muted-foreground)]">{i + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{name}</p><p className="text-xs text-[var(--oq-muted-foreground)]">{sold} units sold</p></div><p className="text-sm font-semibold">{total}</p></div>)}</div></Card>
          </div>
        </div>
      </main>
    </div>
  );
}
