import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tags,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import "./_group.css";

type TaskTone = "amber" | "rose" | "aqua" | "blue";

type Task = {
  id: number;
  title: string;
  detail: string;
  context: string;
  age: string;
  tone: TaskTone;
  icon: typeof Package;
};

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Reports", icon: Activity },
      { label: "Alerts", icon: Bell, count: 4 },
    ],
  },
  {
    label: "Orders",
    items: [
      { label: "Orders", icon: ShoppingCart, count: 18 },
      { label: "Fulfilment Queue", icon: CheckCircle2, count: 7 },
      { label: "Fraud Queue", icon: ShieldCheck, count: 2 },
      { label: "Returns", icon: RefreshCw },
      { label: "Refunds", icon: ArrowRight },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", icon: Package },
      { label: "Discounts", icon: Tags },
      { label: "Stock Alerts", icon: AlertCircle, count: 3 },
    ],
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Release 7 orders for fulfilment",
    detail: "Payments captured · labels ready",
    context: "Orders / Fulfilment Queue",
    age: "12 min",
    tone: "aqua",
    icon: Truck,
  },
  {
    id: 2,
    title: "Review 2 payment risk flags",
    detail: "One high-value order needs a second look",
    context: "Orders / Fraud Queue",
    age: "26 min",
    tone: "rose",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Restock L-Carnitine 500mg",
    detail: "Only 4 units left · 11-day lead time",
    context: "Catalogue / Stock Alerts",
    age: "41 min",
    tone: "amber",
    icon: Package,
  },
  {
    id: 4,
    title: "Approve 3 customer reviews",
    detail: "New since yesterday afternoon",
    context: "Customers / Reviews",
    age: "1 hr",
    tone: "blue",
    icon: Users,
  },
];

const orders = [
  ["OQ-10482", "R. Patel", "£186.40", "Processing", "Today, 09:42"],
  ["OQ-10481", "S. Williams", "£72.00", "Ready to ship", "Today, 09:36"],
  ["OQ-10480", "J. Turner", "£318.75", "Payment review", "Today, 09:21"],
  ["OQ-10479", "A. Hughes", "£44.90", "Delivered", "Today, 08:58"],
];

const toneStyles: Record<TaskTone, { icon: string; line: string; badge: string }> = {
  amber: { icon: "bg-[#fff3d8] text-[#a96c0b]", line: "border-l-[#dd9a2b]", badge: "bg-[#fff3d8] text-[#98610e]" },
  rose: { icon: "bg-[#fde8ec] text-[#c03f55]", line: "border-l-[#d6475e]", badge: "bg-[#fde8ec] text-[#b7354b]" },
  aqua: { icon: "bg-[#dff7f3] text-[#087d71]", line: "border-l-[#13b8a6]", badge: "bg-[#dff7f3] text-[#087d71]" },
  blue: { icon: "bg-[#e4effc] text-[#235da7]", line: "border-l-[#65b7ee]", badge: "bg-[#e4effc] text-[#235da7]" },
};

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--oq-primary)] text-white shadow-[0_7px_16px_rgba(18,64,160,.22)]">
        <div className="h-4 w-4 rounded-full border-[2.5px] border-[var(--oq-accent)]" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[var(--oq-accent)]" />
      </div>
      <div>
        <p className="text-[15px] font-extrabold tracking-[-0.03em] text-[var(--oq-ink-deep)]">OmniQure</p>
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[var(--oq-muted-foreground)]">Operations</p>
      </div>
    </div>
  );
}

export function AdminTaskWorkspace() {
  const [active, setActive] = useState("Dashboard");
  const [tasks, setTasks] = useState(initialTasks);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.join(" ").toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  function completeTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    setTasks((items) => items.filter((item) => item.id !== id));
    setNotice(task ? `${task.title} marked complete` : "Task marked complete");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function snoozeTask(id: number) {
    const task = tasks.find((item) => item.id === id);
    setTasks((items) => items.filter((item) => item.id !== id));
    setNotice(task ? `${task.title} snoozed for later` : "Task snoozed for later");
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--oq-background)] text-[var(--oq-foreground)]">
      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--oq-ink-deep)] px-4 py-3 text-xs font-bold text-white shadow-[var(--oq-shadow-float)]">
          <CheckCircle2 className="h-4 w-4 text-[var(--oq-accent)]" />
          {notice}
        </div>
      )}
      <div className="mx-auto flex min-h-[100dvh] max-w-[1560px]">
        <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-[265px] border-r border-[var(--oq-border)] bg-[#f7fbfe] px-4 py-5 transition-transform duration-200 lg:static lg:translate-x-0`}>
          <div className="flex items-center justify-between px-2">
            <BrandMark />
            <button className="oq-focus-ring rounded-lg p-2 text-[var(--oq-muted-foreground)] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-8 rounded-xl border border-[#cfe9e5] bg-[#eaf8f5] p-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--oq-success)] shadow-[0_0_0_4px_rgba(14,159,131,.12)]" />
              <p className="text-xs font-extrabold text-[#087d71]">Store is operating normally</p>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-[#477d78]">Last checked 2 minutes ago</p>
          </div>
          <nav className="mt-7 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="oq-eyebrow px-3">{group.label}</p>
                <div className="mt-2 space-y-1">
                  {group.items.map(({ label, icon: Icon, count }) => (
                    <button
                      key={label}
                      onClick={() => { setActive(label); setMobileOpen(false); }}
                      className={`oq-interactive oq-focus-ring flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-bold ${active === label ? "bg-[var(--oq-primary)] text-white shadow-[0_8px_16px_rgba(18,64,160,.18)]" : "text-[var(--oq-muted-foreground)] hover:bg-[#e7f0f7] hover:text-[var(--oq-foreground)]"}`}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                      <span className="flex-1">{label}</span>
                      {count && <span className={`oq-mono text-[10px] ${active === label ? "text-white/75" : "text-[var(--oq-muted-foreground)]"}`}>{count}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="absolute bottom-5 left-4 right-4 border-t border-[var(--oq-border)] pt-4">
            <button onClick={() => setActive("Settings")} className="oq-focus-ring flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-[var(--oq-muted-foreground)] hover:bg-[#e7f0f7]">
              <Settings className="h-[17px] w-[17px]" /> Settings
            </button>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce9f7] text-xs font-extrabold text-[var(--oq-primary)]">AM</div>
              <div className="min-w-0"><p className="truncate text-xs font-extrabold">Alex Morgan</p><p className="truncate text-[10px] text-[var(--oq-muted-foreground)]">Administrator</p></div>
              <ChevronDown className="ml-auto h-4 w-4 text-[var(--oq-muted-foreground)]" />
            </div>
          </div>
        </aside>
        {mobileOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-[#07162b]/25 lg:hidden" onClick={() => setMobileOpen(false)} />}

        <section className="min-w-0 flex-1">
          <header className="flex min-h-[76px] items-center justify-between border-b border-[var(--oq-border)] bg-[#f9fcfe]/90 px-4 sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button className="oq-focus-ring rounded-lg p-2 text-[var(--oq-muted-foreground)] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
              <div>
                <p className="oq-eyebrow text-[var(--oq-primary)]">Tuesday, 12 November 2024</p>
                <h1 className="mt-1 text-lg font-extrabold tracking-[-0.03em] sm:text-xl">Good morning, Alex.</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--oq-muted-foreground)]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className="oq-focus-ring h-10 w-52 rounded-lg border border-[var(--oq-border)] bg-white pl-9 pr-3 text-xs font-semibold outline-none placeholder:text-[var(--oq-muted-foreground)]" />
              </div>
              <button onClick={() => setNotice("You are all caught up on notifications")} className="oq-focus-ring relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--oq-border)] bg-white text-[var(--oq-muted-foreground)] hover:bg-[#eef6fb]" aria-label="View notifications">
                <Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--oq-danger)]" />
              </button>
              <button onClick={() => setNotice("Quick action menu opened")} className="oq-interactive oq-focus-ring hidden items-center gap-2 rounded-lg bg-[var(--oq-primary)] px-3.5 py-2.5 text-xs font-extrabold text-white sm:flex"><Plus className="h-4 w-4" /> Quick action</button>
            </div>
          </header>

          <div className="oq-grid-noise min-h-[calc(100dvh-76px)] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
            <div className="mx-auto max-w-[1230px]">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="oq-eyebrow">Your workbench</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.045em] sm:text-[30px]">A clear path through today.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--oq-muted-foreground)]">Four decisions are waiting. The rest of the store is moving quietly in the background.</p></div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--oq-muted-foreground)]"><CircleDot className="h-3.5 w-3.5 text-[var(--oq-success)]" /> Live data <span className="oq-mono text-[10px]">09:47:18 GMT</span></div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="oq-panel p-5"><div className="flex items-start justify-between"><p className="oq-eyebrow">Needs your attention</p><span className="rounded-lg bg-[#fff3d8] p-2 text-[#a96c0b]"><AlertCircle className="h-4 w-4" /></span></div><p className="oq-mono mt-4 text-3xl font-semibold tracking-[-0.06em]">{tasks.length}</p><p className="mt-1 text-xs font-semibold text-[var(--oq-muted-foreground)]">items in your task list</p></div>
                <div className="oq-panel p-5"><div className="flex items-start justify-between"><p className="oq-eyebrow">Orders today</p><span className="rounded-lg bg-[#e4effc] p-2 text-[var(--oq-primary)]"><ShoppingCart className="h-4 w-4" /></span></div><p className="oq-mono mt-4 text-3xl font-semibold tracking-[-0.06em]">128</p><p className="mt-1 text-xs font-semibold text-[var(--oq-success)]">↑ 8.4% <span className="text-[var(--oq-muted-foreground)]">vs last Tuesday</span></p></div>
                <div className="oq-panel p-5"><div className="flex items-start justify-between"><p className="oq-eyebrow">Revenue today</p><span className="rounded-lg bg-[#dff7f3] p-2 text-[#087d71]"><Activity className="h-4 w-4" /></span></div><p className="oq-mono mt-4 text-3xl font-semibold tracking-[-0.06em]">£18,420</p><p className="mt-1 text-xs font-semibold text-[var(--oq-success)]">↑ 12.6% <span className="text-[var(--oq-muted-foreground)]">vs last Tuesday</span></p></div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <section className="oq-panel overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[var(--oq-border)] px-5 py-5 sm:px-6"><div><p className="oq-eyebrow">Priority queue</p><h3 className="mt-1.5 text-base font-extrabold">What needs a human next</h3></div><button onClick={() => setShowAllTasks(!showAllTasks)} className="oq-focus-ring rounded-lg px-2 py-2 text-xs font-extrabold text-[var(--oq-primary)] hover:bg-[#e8f1fa]">{showAllTasks ? "Show less" : "View all"} <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
                  <div className="divide-y divide-[var(--oq-border)]">{tasks.length === 0 ? <div className="p-10 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-[var(--oq-success)]" /><p className="mt-3 text-sm font-extrabold">A quiet queue.</p><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">You have cleared everything for now.</p></div> : tasks.slice(0, showAllTasks ? tasks.length : 3).map((task) => { const style = toneStyles[task.tone]; const Icon = task.icon; return <div key={task.id} className={`group flex gap-3 border-l-[3px] ${style.line} px-5 py-4 transition-colors hover:bg-[#f6fafc] sm:px-6`}><div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-extrabold">{task.title}</p><span className="oq-mono whitespace-nowrap text-[10px] text-[var(--oq-muted-foreground)]">{task.age}</span></div><p className="mt-1 text-xs text-[var(--oq-muted-foreground)]">{task.detail}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${style.badge}`}>{task.context}</span></div></div><div className="flex shrink-0 flex-col gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"><button onClick={() => completeTask(task.id)} className="oq-focus-ring rounded-md p-1.5 text-[var(--oq-success)] hover:bg-[#dff7f3]" aria-label={`Complete ${task.title}`}><Check className="h-4 w-4" /></button><button onClick={() => snoozeTask(task.id)} className="oq-focus-ring rounded-md p-1.5 text-[var(--oq-muted-foreground)] hover:bg-[#e8f1fa]" aria-label={`Snooze ${task.title}`}><Clock3 className="h-4 w-4" /></button></div></div>; })}</div>
                </section>

                <section className="oq-panel overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[var(--oq-border)] px-5 py-5"><div><p className="oq-eyebrow">Store pulse</p><h3 className="mt-1.5 text-base font-extrabold">How the day is moving</h3></div><button onClick={() => setNotice("Store pulse refreshed")} className="oq-focus-ring rounded-lg p-2 text-[var(--oq-muted-foreground)] hover:bg-[#e8f1fa]" aria-label="Refresh store pulse"><RefreshCw className="h-4 w-4" /></button></div>
                  <div className="space-y-5 p-5"><div><div className="flex justify-between text-xs font-bold"><span>Orders processed</span><span className="oq-mono text-[var(--oq-primary)]">82%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7eff5]"><div className="h-full w-[82%] rounded-full bg-[var(--oq-primary)]" /></div></div><div><div className="flex justify-between text-xs font-bold"><span>Same-day dispatch</span><span className="oq-mono text-[var(--oq-success)]">94%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7eff5]"><div className="h-full w-[94%] rounded-full bg-[var(--oq-success)]" /></div></div><div className="rounded-xl bg-[#f2f7fb] p-4"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-[var(--oq-primary)]" /><div><p className="text-xs font-extrabold">A good rhythm today</p><p className="mt-1 text-xs leading-5 text-[var(--oq-muted-foreground)]">Dispatch is ahead of its usual pace, and no critical service alerts are open.</p></div></div></div><div className="flex items-center justify-between pt-1 text-xs"><span className="font-bold text-[var(--oq-muted-foreground)]">Last 7 days</span><button onClick={() => setActive("Reports")} className="oq-focus-ring font-extrabold text-[var(--oq-primary)]">Open reports <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div></div>
                </section>
              </div>

              <section className="oq-panel mt-6 overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-[var(--oq-border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="oq-eyebrow">Recent activity</p><h3 className="mt-1.5 text-base font-extrabold">Orders worth a look</h3></div><div className="flex gap-2"><button onClick={() => setNotice("Filters opened")} className="oq-focus-ring flex min-h-10 items-center gap-2 rounded-lg border border-[var(--oq-border)] bg-white px-3 text-xs font-bold text-[var(--oq-muted-foreground)] hover:bg-[#f2f7fb]"><Filter className="h-3.5 w-3.5" /> Filter</button><button onClick={() => setActive("Orders")} className="oq-focus-ring flex min-h-10 items-center gap-2 rounded-lg bg-[#e8f1fa] px-3 text-xs font-extrabold text-[var(--oq-primary)]">All orders <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-[var(--oq-border)] bg-[#f8fbfd]"><th className="px-6 py-3 oq-eyebrow">Order</th><th className="px-4 py-3 oq-eyebrow">Customer</th><th className="px-4 py-3 oq-eyebrow">Total</th><th className="px-4 py-3 oq-eyebrow">Status</th><th className="px-4 py-3 oq-eyebrow">Placed</th><th className="px-4 py-3" /></tr></thead><tbody>{filteredOrders.map(([id, customer, total, status, placed]) => <tr key={id} className="group border-b border-[var(--oq-border)] last:border-0 hover:bg-[#f8fbfd]"><td className="oq-mono px-6 py-4 text-xs font-semibold text-[var(--oq-primary)]">{id}</td><td className="px-4 py-4 text-xs font-bold">{customer}</td><td className="oq-mono px-4 py-4 text-xs font-semibold">{total}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status === "Payment review" ? "bg-[#fde8ec] text-[#b7354b]" : status === "Delivered" ? "bg-[#dff7f3] text-[#087d71]" : "bg-[#e4effc] text-[#235da7]"}`}>{status}</span></td><td className="oq-mono px-4 py-4 text-[10px] text-[var(--oq-muted-foreground)]">{placed}</td><td className="px-4 py-4 text-right"><button onClick={() => setNotice(`${id} opened`)} className="oq-focus-ring rounded-md p-1.5 text-[var(--oq-muted-foreground)] hover:bg-[#e8f1fa]" aria-label={`More options for ${id}`}><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
              </section>
              <footer className="flex flex-col gap-2 py-7 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--oq-muted-foreground)] sm:flex-row sm:justify-between"><span>OmniQure Operations Console</span><span className="oq-mono normal-case tracking-normal">Secure session · v2.4.1</span></footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminTaskWorkspace;