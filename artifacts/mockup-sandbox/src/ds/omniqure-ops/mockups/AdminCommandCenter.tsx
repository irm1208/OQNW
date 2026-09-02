import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleCheck,
  Clock3,
  CreditCard,
  ExternalLink,
  Filter,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  X,
} from "lucide-react";
import "./_group.css";

type Tone = "mint" | "amber" | "red" | "blue";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: Activity },
      { label: "Reports", icon: ArrowUpRight },
      { label: "Alerts", icon: Bell, count: 7 },
    ],
  },
  {
    label: "Orders",
    items: [
      { label: "Orders", icon: ShoppingCart },
      { label: "Fulfilment Queue", icon: Package, count: 18 },
      { label: "Fraud Queue", icon: ShieldCheck, count: 3 },
      { label: "Crypto Audit", icon: CreditCard },
      { label: "Returns", icon: RefreshCw },
    ],
  },
  {
    label: "Customers",
    items: [{ label: "Customers", icon: Users }],
  },
  {
    label: "Products",
    items: [
      { label: "Products", icon: Package },
      { label: "Discounts", icon: Filter },
      { label: "Stock Alerts", icon: AlertTriangle, count: 4 },
    ],
  },
];

const revenueBars = [42, 51, 44, 62, 57, 74, 69, 86, 76, 91, 83, 96, 88, 100];
const orders = [
  { id: "OQ-10482", customer: "Dr Eleanor Voss", amount: "£428.60", status: "Processing", tone: "blue" as Tone, age: "08m" },
  { id: "OQ-10481", customer: "Meridian Labs Ltd", amount: "£1,284.00", status: "Ready to ship", tone: "mint" as Tone, age: "14m" },
  { id: "OQ-10480", customer: "Northbank Research", amount: "£92.40", status: "Payment review", tone: "amber" as Tone, age: "31m" },
  { id: "OQ-10479", customer: "A. K. Patel", amount: "£670.00", status: "Dispatched", tone: "mint" as Tone, age: "46m" },
];

const alerts = [
  { title: "Payment review required", body: "OQ-10480 · AVS mismatch on a £92.40 order", tone: "amber" as Tone, time: "4m ago" },
  { title: "Stock threshold reached", body: "BPC-157 5mg · 4 units remaining", tone: "red" as Tone, time: "19m ago" },
  { title: "Gateway latency elevated", body: "Checkout confirmation p95 is 1.8s", tone: "blue" as Tone, time: "37m ago" },
];

function Signal({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const styles: Record<Tone, string> = {
    mint: "bg-[#e3f6f0] text-[#087b68] border-[#bde8dc]",
    amber: "bg-[#fff4df] text-[#956316] border-[#f1d39b]",
    red: "bg-[#ffebee] text-[#b7354d] border-[#f2c2cc]",
    blue: "bg-[#e7effc] text-[#1d55a7] border-[#c4d7f5]",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}

function Metric({ label, value, detail, tone = "blue", icon: Icon }: { label: string; value: string; detail: string; tone?: Tone; icon: typeof Activity }) {
  const color: Record<Tone, string> = { mint: "text-[#0e9f83]", amber: "text-[#b47a19]", red: "text-[#d6475e]", blue: "text-[#1240a0]" };
  return (
    <div className="oq-panel oq-interactive min-w-0 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><p className="oq-eyebrow">{label}</p><Icon className={`h-4 w-4 ${color[tone]}`} /></div>
      <p className="oq-mono mt-3 text-[clamp(1.45rem,2vw,2rem)] font-semibold tracking-[-0.06em]">{value}</p>
      <p className={`mt-2 flex items-center gap-1 text-xs font-bold ${color[tone]}`}>{tone === "red" || tone === "amber" ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}{detail}</p>
    </div>
  );
}

export function AdminCommandCenter() {
  const [period, setPeriod] = useState("30 days");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [refreshed, setRefreshed] = useState(false);
  const [query, setQuery] = useState("");

  const visibleOrders = useMemo(() => orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const acknowledge = (title: string) => setAcknowledged((items) => [...items, title]);

  return (
    <main className="min-h-[100dvh] bg-[var(--oq-background)] text-[var(--oq-foreground)]">
      <div className="flex min-h-[100dvh]">
        <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 w-[268px] shrink-0 border-r border-[#17365b] bg-[var(--oq-ink-deep)] text-white transition-transform lg:static lg:translate-x-0`}>
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex items-center justify-between"><div><p className="text-[17px] font-extrabold tracking-[-0.04em]">Omni<span className="text-[#65b7ee]">Qure</span></p><p className="oq-eyebrow mt-1 text-[#88a4c3]">Operations console</p></div><button onClick={() => setMobileOpen(false)} className="oq-focus-ring rounded-md p-2 lg:hidden"><X className="h-4 w-4" /></button></div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#2d547f] bg-[#102b4b] px-3 py-2.5"><span className="h-2 w-2 rounded-full bg-[#13b8a6] shadow-[0_0_0_4px_rgba(19,184,166,.12)]" /><span className="text-xs font-bold">Systems nominal</span><span className="oq-mono ml-auto text-[10px] text-[#88a4c3]">LIVE</span></div>
            </div>
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
              {navGroups.map((group) => <div key={group.label}><p className="oq-eyebrow mb-2 px-3 text-[#6f8eaf]">{group.label}</p><div className="space-y-1">{group.items.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { setActiveNav(label); setMobileOpen(false); }} className={`oq-focus-ring flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition-colors ${activeNav === label ? "bg-[#1240a0] text-white shadow-[0_8px_18px_rgba(18,64,160,.28)]" : "text-[#a9bdd4] hover:bg-[#102b4b] hover:text-white"}`}><Icon className="h-4 w-4 shrink-0" /><span className="flex-1">{label}</span>{count && <span className={`oq-mono rounded px-1.5 py-0.5 text-[10px] ${activeNav === label ? "bg-white/15 text-white" : "bg-[#244668] text-[#b8cce0]"}`}>{count}</span>}</button>)}</div></div>)}
              <div className="border-t border-white/10 pt-5"><p className="oq-eyebrow mb-2 px-3 text-[#6f8eaf]">Security</p><button onClick={() => setActiveNav("Security Activity")} className="oq-focus-ring flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#a9bdd4] hover:bg-[#102b4b] hover:text-white"><LockKeyhole className="h-4 w-4" />Security Activity</button></div>
            </nav>
            <div className="border-t border-white/10 p-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#65b7ee] text-xs font-extrabold text-[#07162b]">JM</div><div className="min-w-0"><p className="truncate text-xs font-bold">J. Mercer</p><p className="oq-mono mt-0.5 text-[10px] text-[#7895b4]">OWNER / UK</p></div><MoreHorizontal className="ml-auto h-4 w-4 text-[#7895b4]" /></div></div>
          </div>
        </aside>
        {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-20 bg-[#07162b]/40 lg:hidden" />}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex min-h-[68px] items-center gap-3 border-b border-[var(--oq-border)] bg-[#edf3f9]/95 px-4 backdrop-blur sm:px-7">
            <button onClick={() => setMobileOpen(true)} className="oq-focus-ring rounded-lg p-2 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1"><p className="oq-eyebrow">Private command centre</p><p className="mt-1 truncate text-sm font-extrabold sm:text-base">{activeNav} <span className="mx-1 font-normal text-[#9aabbd]">/</span> <span className="font-medium text-[#60748c]">Tuesday, 14 May 2024</span></p></div>
            <button onClick={() => setRefreshed(true)} className={`oq-interactive oq-focus-ring flex min-h-10 items-center gap-2 rounded-lg border border-[var(--oq-border)] bg-white px-3 text-xs font-bold text-[#294665] ${refreshed ? "text-[#0e9f83]" : ""}`}><RefreshCw className={`h-3.5 w-3.5 ${refreshed ? "animate-spin" : ""}`} /> <span className="hidden sm:inline">{refreshed ? "Updated just now" : "Refresh data"}</span></button>
            <button className="oq-focus-ring relative rounded-lg border border-[var(--oq-border)] bg-white p-2.5"><Bell className="h-4 w-4 text-[#294665]" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d6475e]" /></button>
          </header>

          <div className="mx-auto max-w-[1480px] space-y-5 p-4 sm:p-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="oq-eyebrow text-[var(--oq-primary)]">Tuesday operating brief</p><h1 className="mt-2 text-2xl font-extrabold tracking-[-0.055em] sm:text-3xl">Good morning, James.</h1><p className="mt-1 text-sm text-[var(--oq-muted-foreground)]">The store is moving cleanly. Three decisions need your attention.</p></div><div className="flex items-center gap-2"><span className="oq-eyebrow hidden sm:block">Window</span><div className="flex rounded-lg border border-[var(--oq-border)] bg-white p-1">{["7 days", "30 days", "90 days"].map((p) => <button key={p} onClick={() => setPeriod(p)} className={`oq-focus-ring rounded-md px-3 py-2 text-xs font-bold ${period === p ? "bg-[var(--oq-primary)] text-white" : "text-[#60748c] hover:text-[#0b1e36]"}`}>{p}</button>)}</div></div></div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Revenue today" value="£18,420.80" detail="+12.6% vs yesterday" icon={CreditCard} /><Metric label="Orders today" value="147" detail="+8.4% vs yesterday" icon={ShoppingCart} /><Metric label="Average order value" value="£125.31" detail="+£6.20 this period" icon={ArrowUpRight} tone="mint" /><Metric label="Awaiting fulfilment" value="18" detail="4 older than 2 hours" icon={Package} tone="amber" /><Metric label="Open risk signals" value="03" detail="1 requires action" icon={ShieldCheck} tone="red" /></div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)]">
              <section className="oq-panel min-w-0 overflow-hidden"><div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--oq-border)] px-5 py-4 sm:px-6"><div><p className="oq-eyebrow">Commercial pulse / {period}</p><h2 className="mt-1 text-base font-extrabold">Revenue performance</h2></div><div className="flex items-center gap-4 text-xs text-[#60748c]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#1240a0]" />Revenue</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#13b8a6]" />Orders</span><button className="oq-focus-ring rounded-md p-1"><MoreHorizontal className="h-4 w-4" /></button></div></div><div className="px-5 pb-5 pt-6 sm:px-6"><div className="flex items-end justify-between"><div><span className="oq-mono text-2xl font-semibold tracking-[-0.05em]">£286,941.42</span><span className="ml-3 text-xs font-bold text-[#0e9f83]">↑ 14.8%</span></div><span className="oq-mono text-[10px] text-[#8b9caf]">01 MAY — 14 MAY</span></div><div className="relative mt-6 h-[210px]"><div className="absolute inset-0 flex flex-col justify-between">{[0, 1, 2, 3].map((line) => <div key={line} className="border-t border-dashed border-[#dce6ef]" />)}</div><div className="absolute inset-x-0 bottom-0 top-1 flex items-end gap-1.5 sm:gap-3">{revenueBars.map((height, i) => <div key={i} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t-[3px] bg-[#dce8f8] transition-all group-hover:bg-[#65b7ee]" style={{ height: `${height - 13}%` }} /><div className="absolute bottom-0 w-full rounded-t-[3px] bg-[#1240a0] opacity-90 transition-all group-hover:bg-[#13b8a6]" style={{ height: `${height}%` }} /></div>)}</div></div><div className="oq-mono mt-3 flex justify-between text-[10px] text-[#8b9caf]"><span>01 May</span><span>04 May</span><span>07 May</span><span>10 May</span><span>14 May</span></div></div></section>

              <section className="oq-panel overflow-hidden"><div className="flex items-start justify-between border-b border-[var(--oq-border)] px-5 py-4"><div><p className="oq-eyebrow">Operational health</p><h2 className="mt-1 text-base font-extrabold">Order flow</h2></div><span className="oq-mono text-xs font-bold text-[#0e9f83]">96.8%</span></div><div className="space-y-4 p-5"><div className="flex items-center justify-center py-1"><div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: "conic-gradient(#0e9f83 0deg 348deg, #e9eff5 348deg 360deg)" }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="oq-mono text-2xl font-semibold">1,284</span><span className="text-[10px] font-bold text-[#71869d]">TOTAL ORDERS</span></div></div></div>{[["Delivered", "812", "63.2%", "mint"], ["Processing", "284", "22.1%", "blue"], ["Pending review", "47", "3.7%", "amber"], ["Cancelled / returned", "41", "3.2%", "red"]].map(([label, value, pct, tone]) => <div key={label} className="flex items-center gap-3 text-xs"><span className={`h-2 w-2 rounded-full ${tone === "mint" ? "bg-[#0e9f83]" : tone === "blue" ? "bg-[#1240a0]" : tone === "amber" ? "bg-[#dd9a2b]" : "bg-[#d6475e]"}`} /><span className="flex-1 font-semibold text-[#294665]">{label}</span><span className="oq-mono text-[#60748c]">{value}</span><span className="oq-mono w-12 text-right text-[#8b9caf]">{pct}</span></div>)}</div></section>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
              <section className="oq-panel overflow-hidden"><div className="flex flex-col gap-3 border-b border-[var(--oq-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="oq-eyebrow">Live queue</p><h2 className="mt-1 text-base font-extrabold">Recent orders</h2></div><div className="relative"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8b9caf]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order or customer" className="oq-focus-ring h-9 w-full rounded-lg border border-[var(--oq-border)] bg-[#f8fbfd] pl-9 pr-3 text-xs outline-none placeholder:text-[#9aabbd] sm:w-56" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-[var(--oq-border)] text-[10px] uppercase tracking-[0.12em] text-[#8b9caf]"><th className="px-5 py-3 font-extrabold sm:px-6">Order</th><th className="px-3 py-3 font-extrabold">Customer</th><th className="px-3 py-3 font-extrabold">Value</th><th className="px-3 py-3 font-extrabold">State</th><th className="px-5 py-3 text-right font-extrabold sm:px-6">Age</th></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id} className="oq-interactive border-b border-[#edf2f6] last:border-0 hover:bg-[#f7fafc]"><td className="oq-mono px-5 py-4 text-xs font-semibold text-[#1240a0] sm:px-6">{order.id}</td><td className="px-3 py-4 text-xs font-bold">{order.customer}</td><td className="oq-mono px-3 py-4 text-xs">{order.amount}</td><td className="px-3 py-4"><Signal tone={order.tone}>{order.status}</Signal></td><td className="oq-mono px-5 py-4 text-right text-[10px] text-[#8b9caf] sm:px-6">{order.age}</td></tr>)}</tbody></table>{visibleOrders.length === 0 && <p className="p-8 text-center text-sm text-[#60748c]">No orders match this search.</p>}</div><button onClick={() => setActiveNav("Orders")} className="oq-focus-ring flex w-full items-center justify-center gap-2 border-t border-[var(--oq-border)] py-3 text-xs font-extrabold text-[#1240a0] hover:bg-[#f4f8fc]">View all orders <ExternalLink className="h-3 w-3" /></button></section>

              <section className="oq-panel overflow-hidden"><div className="flex items-start justify-between border-b border-[var(--oq-border)] px-5 py-4"><div><p className="oq-eyebrow">Needs a human look</p><h2 className="mt-1 text-base font-extrabold">Attention signals</h2></div><span className="rounded-full bg-[#ffebee] px-2 py-1 text-[10px] font-extrabold text-[#b7354d]">{alerts.length - acknowledged.length} OPEN</span></div><div className="divide-y divide-[#edf2f6]">{alerts.map((alert) => acknowledged.includes(alert.title) ? null : <div key={alert.title} className="p-4"><div className="flex gap-3"><div className={`mt-0.5 rounded-lg p-2 ${alert.tone === "red" ? "bg-[#ffebee] text-[#d6475e]" : alert.tone === "amber" ? "bg-[#fff4df] text-[#b47a19]" : "bg-[#e7effc] text-[#1240a0]"}`}><AlertTriangle className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-xs font-extrabold">{alert.title}</p><span className="oq-mono whitespace-nowrap text-[9px] text-[#9aabbd]">{alert.time}</span></div><p className="mt-1 text-[11px] leading-5 text-[#60748c]">{alert.body}</p><button onClick={() => acknowledge(alert.title)} className="oq-focus-ring mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[var(--oq-border)] px-2.5 text-[10px] font-extrabold text-[#294665] hover:border-[#13b8a6] hover:text-[#087b68]"><CircleCheck className="h-3.5 w-3.5" />Acknowledge</button></div></div></div>)}</div>{acknowledged.length === alerts.length && <div className="p-8 text-center"><CircleCheck className="mx-auto h-7 w-7 text-[#0e9f83]" /><p className="mt-2 text-xs font-extrabold">Queue is clear</p><p className="mt-1 text-[11px] text-[#60748c]">All attention signals acknowledged.</p></div>}<button onClick={() => setActiveNav("Alerts")} className="oq-focus-ring flex w-full items-center justify-center gap-2 border-t border-[var(--oq-border)] py-3 text-xs font-extrabold text-[#1240a0] hover:bg-[#f4f8fc]">Open alert centre <ExternalLink className="h-3 w-3" /></button></section>
            </div>

            <footer className="flex flex-col gap-2 border-t border-[var(--oq-border)] pt-4 text-[10px] text-[#7890a8] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />Last synced 14 May 2024, 09:42:18 BST</span><span className="oq-mono">REGION: UK-01 / ALL SYSTEMS NOMINAL</span></footer>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminCommandCenter;