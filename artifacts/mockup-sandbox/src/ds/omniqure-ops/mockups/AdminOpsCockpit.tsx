import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Eye,
  Flag,
  Gauge,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import "./_group.css";

type Tone = "danger" | "warning" | "success" | "info";

const toneMap: Record<Tone, { ink: string; bg: string; line: string; icon: typeof AlertTriangle }> = {
  danger: { ink: "text-[var(--oq-danger)]", bg: "bg-rose-50", line: "border-rose-200", icon: ShieldAlert },
  warning: { ink: "text-[var(--oq-warning)]", bg: "bg-amber-50", line: "border-amber-200", icon: AlertTriangle },
  success: { ink: "text-[var(--oq-success)]", bg: "bg-emerald-50", line: "border-emerald-200", icon: CheckCircle2 },
  info: { ink: "text-[var(--oq-primary)]", bg: "bg-sky-50", line: "border-sky-200", icon: Activity },
};

const nav = [
  { label: "Dashboard", icon: Gauge },
  { label: "Orders", icon: ShoppingCart, count: "18" },
  { label: "Fulfilment Queue", icon: ClipboardCheck, count: "7" },
  { label: "Fraud Queue", icon: ShieldAlert, count: "3", tone: "danger" as Tone },
  { label: "Crypto Audit", icon: CreditCard },
  { label: "Products", icon: Package, count: "2" },
  { label: "Customers", icon: UserRound },
  { label: "Security Activity", icon: LockKeyhole },
];

const initialAlerts = [
  { id: 1, tone: "danger" as Tone, title: "Payment blocked", detail: "Order #OQ-84271 · AVS mismatch", time: "2m ago", action: "Review payment" },
  { id: 2, tone: "warning" as Tone, title: "Dispatch SLA at risk", detail: "4 orders waiting beyond 3 hours", time: "8m ago", action: "Open queue" },
  { id: 3, tone: "warning" as Tone, title: "Low stock threshold", detail: "Semaglutide 5mg · 8 units remaining", time: "14m ago", action: "View stock" },
  { id: 4, tone: "info" as Tone, title: "New sign-in observed", detail: "Admin account · London, GB", time: "21m ago", action: "View activity" },
];

const fulfilment = [
  { id: "OQ-84276", customer: "M. Richardson", items: "2 items", carrier: "Royal Mail Tracked 24", age: "14m", state: "Ready to pick", tone: "success" as Tone },
  { id: "OQ-84274", customer: "S. Patel", items: "1 item", carrier: "DPD Next Day", age: "38m", state: "Payment confirmed", tone: "info" as Tone },
  { id: "OQ-84271", customer: "A. Williams", items: "3 items", carrier: "Royal Mail Tracked 48", age: "1h 12m", state: "Payment review", tone: "danger" as Tone },
  { id: "OQ-84269", customer: "J. Clarke", items: "1 item", carrier: "Evri Standard", age: "2h 04m", state: "Address check", tone: "warning" as Tone },
];

function StatusChip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const token = toneMap[tone];
  const Icon = token.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-extrabold ${token.bg} ${token.line} ${token.ink}`}>
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function Sparkline({ points, tone = "primary" }: { points: number[]; tone?: "primary" | "success" | "danger" }) {
  const color = tone === "success" ? "var(--oq-success)" : tone === "danger" ? "var(--oq-danger)" : "var(--oq-primary)";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points.map((point, index) => `${(index / (points.length - 1)) * 100},${34 - ((point - min) / Math.max(1, max - min)) * 27}`).join(" ");
  return (
    <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="h-10 w-28 overflow-visible">
      <polyline points={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={100} cy={Number(path.split(" ").at(-1)?.split(",")[0])} r="2.3" fill={color} />
    </svg>
  );
}

export function AdminOpsCockpit() {
  const [active, setActive] = useState("Dashboard");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [paused, setPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const visibleAlerts = showAll ? alerts : alerts.slice(0, 3);

  const signalCount = useMemo(() => alerts.filter((alert) => alert.tone === "danger" || alert.tone === "warning").length, [alerts]);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const acknowledge = (id: number) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
    notify("Signal acknowledged and removed from the live queue");
  };

  return (
    <main className="min-h-screen bg-[var(--oq-background)] text-[var(--oq-foreground)]">
      <div className="flex min-h-screen">
        <aside className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} oq-interactive fixed inset-y-0 left-0 z-40 flex w-[258px] shrink-0 flex-col bg-[var(--oq-ink-deep)] text-white lg:relative lg:translate-x-0`}>
          <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--oq-accent)] text-[var(--oq-ink-deep)]"><Zap className="h-4 w-4 fill-current" /></div>
                <span className="text-[17px] font-extrabold tracking-[-0.04em]">OmniQure</span>
              </div>
              <p className="oq-eyebrow mt-1 !text-slate-400">Operations console</p>
            </div>
            <button className="oq-focus-ring rounded-lg p-2 text-slate-400 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button>
          </div>
          <div className="px-4 pt-5">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
              <div className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-[var(--oq-accent)] shadow-[0_0_0_4px_rgba(19,184,166,.12)]" /><div><p className="text-xs font-bold">Shift live</p><p className="oq-mono text-[9px] text-slate-400">09:00 — 17:30 GMT</p></div></div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-3">
            <p className="oq-eyebrow mb-2 px-3 !text-slate-500">Workspace</p>
            {nav.map(({ label, icon: Icon, count, tone }) => (
              <button key={label} onClick={() => { setActive(label); setMobileNav(false); }} className={`oq-focus-ring oq-interactive flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] font-bold ${active === label ? "bg-[var(--oq-primary)] text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/[0.07] hover:text-white"}`}>
                <Icon className="h-[16px] w-[16px] shrink-0" />
                <span className="flex-1">{label}</span>
                {count && <span className={`oq-mono rounded px-1.5 py-0.5 text-[9px] ${tone === "danger" ? "bg-rose-400/20 text-rose-300" : active === label ? "bg-white/15 text-white" : "bg-white/10 text-slate-400"}`}>{count}</span>}
              </button>
            ))}
            <div className="my-5 border-t border-white/10" />
            <p className="oq-eyebrow mb-2 px-3 !text-slate-500">Shortcuts</p>
            <button onClick={() => notify("Report builder opened")} className="oq-interactive flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] font-bold text-slate-400 hover:bg-white/[0.07] hover:text-white"><Activity className="h-4 w-4" /> Reports <span className="ml-auto oq-mono text-[9px] text-slate-600">⌘R</span></button>
            <button onClick={() => notify("Settings are protected for this shift")} className="oq-interactive flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] font-bold text-slate-400 hover:bg-white/[0.07] hover:text-white"><SlidersHorizontal className="h-4 w-4" /> Store settings</button>
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--oq-sky)] text-xs font-extrabold text-[var(--oq-ink-deep)]">EM</div>
              <div className="min-w-0"><p className="truncate text-xs font-bold">Eleanor Morris</p><p className="text-[10px] text-slate-500">Shift lead · Online</p></div>
              <MoreHorizontal className="ml-auto h-4 w-4 text-slate-500" />
            </div>
          </div>
        </aside>
        {mobileNav && <button className="fixed inset-0 z-30 bg-[var(--oq-ink-deep)]/40 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close menu overlay" />}

        <section className="min-w-0 flex-1">
          <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[var(--oq-border)] bg-white/80 px-4 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="oq-focus-ring rounded-lg p-2 text-[var(--oq-ink-soft)] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
              <div><p className="oq-eyebrow text-[var(--oq-primary)]">Tuesday · 14 May 2024</p><h1 className="mt-0.5 text-lg font-extrabold tracking-[-0.035em] sm:text-[21px]">Good morning, Eleanor.</h1></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => notify("Search is ready — try order OQ-84271")} className="oq-focus-ring hidden items-center gap-2 rounded-lg border border-[var(--oq-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--oq-muted-foreground)] sm:flex"><Search className="h-3.5 w-3.5" /> Search <span className="oq-mono ml-3 rounded bg-[var(--oq-muted)] px-1.5 py-0.5 text-[9px]">/</span></button>
              <button onClick={() => { setPaused((value) => !value); notify(paused ? "Live signal resumed" : "Live signal paused for 5 minutes"); }} className={`oq-focus-ring flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-extrabold ${paused ? "border-amber-200 bg-amber-50 text-[var(--oq-warning)]" : "border-emerald-200 bg-emerald-50 text-[var(--oq-success)]"}`}><span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-[var(--oq-warning)]" : "animate-pulse bg-[var(--oq-success)]"}`} /> {paused ? "Paused" : "Live"} <ChevronDown className="h-3 w-3" /></button>
              <button onClick={() => notify(`${signalCount} attention signals in your queue`)} className="oq-focus-ring relative rounded-lg border border-[var(--oq-border)] bg-white p-2.5 text-[var(--oq-ink-soft)]"><Bell className="h-4 w-4" />{signalCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--oq-danger)] px-1 text-[9px] font-bold text-white">{signalCount}</span>}</button>
            </div>
          </header>

          <div className="mx-auto max-w-[1480px] space-y-5 p-4 sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><div className="flex items-center gap-2"><span className="oq-eyebrow text-[var(--oq-primary)]">Live operations</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-[var(--oq-success)]">ALL SYSTEMS NOMINAL</span></div><p className="mt-1 text-sm text-[var(--oq-muted-foreground)]">The signals that need a decision, in priority order.</p></div>
              <div className="flex items-center gap-2"><button onClick={() => notify("Dashboard data refreshed")} className="oq-focus-ring oq-interactive flex min-h-10 items-center gap-2 rounded-lg border border-[var(--oq-border)] bg-white px-3 text-xs font-bold"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button><button onClick={() => notify("Export queued — your report will be emailed")} className="oq-focus-ring oq-interactive min-h-10 rounded-lg bg-[var(--oq-primary)] px-3.5 text-xs font-extrabold text-white shadow-lg shadow-blue-900/15">Export shift report</button></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Revenue today", value: "£18,420.60", delta: "+12.6%", note: "vs last Tuesday", points: [15, 18, 16, 22, 21, 25, 30, 28, 35], tone: "primary" as const, icon: CreditCard },
                { label: "Orders today", value: "184", delta: "+8.4%", note: "26 in the last hour", points: [12, 15, 14, 16, 18, 17, 21, 24, 28], tone: "success" as const, icon: ShoppingCart },
                { label: "Ready to fulfil", value: "47", delta: "7 urgent", note: "oldest waiting 2h 04m", points: [35, 30, 31, 34, 29, 26, 30, 27, 22], tone: "danger" as const, icon: Truck },
                { label: "Healthy checkout", value: "98.4%", delta: "+0.8%", note: "last 24 hours", points: [24, 25, 24, 27, 26, 28, 29, 30, 32], tone: "success" as const, icon: ShieldCheck },
              ].map((stat) => (
                <div key={stat.label} className="oq-panel oq-interactive p-4">
                  <div className="flex items-start justify-between"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--oq-muted)] text-[var(--oq-primary)]"><stat.icon className="h-4 w-4" /></div><Sparkline points={stat.points} tone={stat.tone} /></div>
                  <p className="oq-eyebrow mt-4">{stat.label}</p><div className="mt-1 flex items-baseline justify-between gap-2"><p className="oq-mono text-[23px] font-semibold tracking-[-0.06em]">{stat.value}</p><span className={`oq-mono text-[10px] font-bold ${stat.tone === "danger" ? "text-[var(--oq-danger)]" : "text-[var(--oq-success)]"}`}>{stat.delta}</span></div><p className="mt-1 text-[10px] text-[var(--oq-muted-foreground)]">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[1.42fr_0.78fr]">
              <div className="oq-panel overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-[var(--oq-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div><div className="flex items-center gap-2"><h2 className="text-[15px] font-extrabold">Attention queue</h2><span className="oq-mono rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-[var(--oq-danger)]">{alerts.length}</span></div><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">Prioritised by impact and time sensitivity</p></div>
                  <button onClick={() => setShowAll((value) => !value)} className="oq-focus-ring flex items-center gap-1 text-xs font-extrabold text-[var(--oq-primary)]">{showAll ? "Show less" : "View all signals"} <ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
                <div className="divide-y divide-[var(--oq-border)]">
                  {visibleAlerts.length === 0 ? <div className="flex flex-col items-center px-5 py-12 text-center"><CheckCircle2 className="h-8 w-8 text-[var(--oq-success)]" /><p className="mt-3 text-sm font-extrabold">Queue clear</p><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">Every operational signal has been acknowledged.</p></div> : visibleAlerts.map((alert) => { const token = toneMap[alert.tone]; const Icon = token.icon; return <div key={alert.id} className="oq-interactive group flex items-start gap-3 px-5 py-4 hover:bg-[var(--oq-background)]"><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${token.bg} ${token.ink}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-xs font-extrabold">{alert.title}</p><span className="oq-mono text-[9px] text-[var(--oq-muted-foreground)]">{alert.time}</span></div><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">{alert.detail}</p><button onClick={() => notify(`${alert.action} opened for ${alert.title.toLowerCase()}`)} className={`mt-2 text-[10px] font-extrabold ${token.ink}`}>{alert.action} <ArrowUpRight className="ml-0.5 inline h-3 w-3" /></button></div><button onClick={() => acknowledge(alert.id)} aria-label={`Acknowledge ${alert.title}`} className="oq-focus-ring rounded-md p-2 text-[var(--oq-muted-foreground)] opacity-60 hover:bg-white hover:text-[var(--oq-success)] group-hover:opacity-100"><Check className="h-4 w-4" /></button></div>; })}
                </div>
              </div>

              <div className="oq-panel overflow-hidden">
                <div className="border-b border-[var(--oq-border)] p-5"><div className="flex items-center justify-between"><div><h2 className="text-[15px] font-extrabold">System pulse</h2><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">Last checked <span className="oq-mono">09:42:18</span></p></div><Activity className="h-4 w-4 text-[var(--oq-accent)]" /></div></div>
                <div className="space-y-1 p-3">
                  {[["Checkout & payments", "Operational", "99.98%", "success", CreditCard], ["Order processing", "Operational", "100%", "success", ShoppingCart], ["Royal Mail integration", "Delayed", "92.4%", "warning", Truck], ["Traffic protection", "Monitoring", "18 req/s", "info", ShieldCheck]].map(([label, state, value, tone, Icon]) => <div key={label as string} className="flex items-center gap-3 rounded-lg p-3 hover:bg-[var(--oq-background)]"><div className={`flex h-7 w-7 items-center justify-center rounded-md ${toneMap[tone as Tone].bg} ${toneMap[tone as Tone].ink}`}><Icon className="h-3.5 w-3.5" /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-bold">{label as string}</p><p className={`mt-0.5 text-[10px] ${toneMap[tone as Tone].ink}`}>{state as string}</p></div><span className="oq-mono text-[10px] font-semibold text-[var(--oq-muted-foreground)]">{value as string}</span></div>)}
                </div>
                <div className="mx-5 mb-5 flex items-center gap-2 rounded-lg bg-[var(--oq-background)] px-3 py-2.5"><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--oq-accent)]" /><p className="text-[10px] font-semibold text-[var(--oq-muted-foreground)]">No active incidents</p><button onClick={() => notify("Incident history opened")} className="ml-auto text-[10px] font-extrabold text-[var(--oq-primary)]">History</button></div>
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[1.42fr_0.78fr]">
              <div className="oq-panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--oq-border)] p-5"><div><h2 className="text-[15px] font-extrabold">Fulfilment queue</h2><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">Orders requiring a warehouse decision</p></div><button onClick={() => { setActive("Fulfilment Queue"); notify("Fulfilment queue opened"); }} className="oq-focus-ring text-xs font-extrabold text-[var(--oq-primary)]">Open queue <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
                <div className="hidden grid-cols-[1.1fr_0.9fr_1.2fr_0.55fr_1fr] gap-3 bg-[var(--oq-background)] px-5 py-2.5 sm:grid"><p className="oq-eyebrow">Order</p><p className="oq-eyebrow">Customer</p><p className="oq-eyebrow">Carrier</p><p className="oq-eyebrow">Age</p><p className="oq-eyebrow">State</p></div>
                {fulfilment.map((order) => <div key={order.id} className="oq-interactive grid gap-2 border-b border-[var(--oq-border)] px-5 py-3.5 hover:bg-[var(--oq-background)] sm:grid-cols-[1.1fr_0.9fr_1.2fr_0.55fr_1fr] sm:items-center sm:gap-3"><div><p className="oq-mono text-[11px] font-bold text-[var(--oq-primary)]">{order.id}</p><p className="mt-1 text-[10px] text-[var(--oq-muted-foreground)] sm:hidden">{order.items} · {order.carrier}</p></div><p className="hidden truncate text-[11px] font-semibold sm:block">{order.customer}</p><p className="hidden truncate text-[10px] text-[var(--oq-muted-foreground)] sm:block">{order.carrier}</p><p className="oq-mono hidden text-[10px] text-[var(--oq-muted-foreground)] sm:block">{order.age}</p><div className="flex items-center justify-between sm:block"><StatusChip tone={order.tone}>{order.state}</StatusChip><button onClick={() => notify(`Order ${order.id} selected`)} className="oq-focus-ring rounded p-1 text-[var(--oq-muted-foreground)] sm:hidden"><Eye className="h-4 w-4" /></button></div></div>)}
              </div>
              <div className="oq-panel p-5">
                <div className="flex items-start justify-between"><div><p className="oq-eyebrow">Shift checklist</p><h2 className="mt-1 text-[15px] font-extrabold">Stay ahead of the queue</h2></div><Flag className="h-4 w-4 text-[var(--oq-warning)]" /></div>
                <div className="mt-5 space-y-3">{[["Review 3 fraud holds", true], ["Release 7 ready orders", false], ["Confirm Royal Mail delay", false], ["Check low stock alerts", false]].map(([label, done], index) => <button key={label as string} onClick={() => notify(done ? "Already completed" : `${label} marked complete`)} className="oq-focus-ring flex w-full items-center gap-3 text-left"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${done ? "border-[var(--oq-success)] bg-[var(--oq-success)] text-white" : "border-[var(--oq-border)] bg-white"}`}>{done && <Check className="h-3 w-3" />}</span><span className={`text-xs font-semibold ${done ? "text-[var(--oq-muted-foreground)] line-through" : ""}`}>{label as string}</span><span className="oq-mono ml-auto text-[9px] text-[var(--oq-muted-foreground)]">0{index + 1}</span></button>)}</div>
                <div className="mt-6 border-t border-[var(--oq-border)] pt-4"><div className="mb-2 flex justify-between text-[10px] font-bold"><span>Shift progress</span><span className="oq-mono text-[var(--oq-primary)]">25%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--oq-muted)]"><div className="h-full w-1/4 rounded-full bg-[var(--oq-accent)]" /></div></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--oq-border)] pt-3"><p className="oq-mono text-[9px] text-[var(--oq-muted-foreground)]"><span className="text-[var(--oq-success)]">●</span> LIVE FEED · DATA REFRESHES EVERY 30 SEC · REGION GB-SOUTH-1</p><button onClick={() => notify("Help centre opened")} className="text-[10px] font-bold text-[var(--oq-primary)]">Ops help centre <ArrowUpRight className="ml-1 inline h-3 w-3" /></button></div>
          </div>
        </section>
      </div>
      {toast && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[var(--oq-ink-deep)] px-4 py-3 text-xs font-bold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-[var(--oq-accent)]" />{toast}</div>}
    </main>
  );
}

export default AdminOpsCockpit;