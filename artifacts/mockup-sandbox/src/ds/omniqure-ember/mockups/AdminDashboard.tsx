import "./_group.css";

const NAV_MAIN = [
  { label: "Dashboard", active: true, icon: "▦" },
  { label: "Orders", icon: "▣" },
  { label: "Products", icon: "⬡" },
  { label: "Customers", icon: "◉" },
  { label: "Reports", icon: "▤" },
  { label: "Discounts", icon: "％" },
];

const NAV_FOOT = [
  { label: "Integrations", icon: "◫" },
  { label: "Help", icon: "?" },
  { label: "Settings", icon: "⚙" },
];

const CATEGORIES = [
  { name: "Weight Management", value: "£1,200,000", color: "var(--em-primary)" },
  { name: "Recovery", value: "£950,000", color: "var(--em-accent)" },
  { name: "Cognitive", value: "£750,000", color: "var(--em-primary-soft)" },
  { name: "Longevity", value: "£500,000", color: "var(--em-primary-tint)" },
];

const SOURCES = [
  { name: "Direct Traffic", pct: 40 },
  { name: "Organic Search", pct: 30 },
  { name: "Social Media", pct: 15 },
  { name: "Referral Traffic", pct: 10 },
  { name: "Email Campaigns", pct: 5 },
];

const COUNTRIES = [
  { name: "United Kingdom", pct: 46 },
  { name: "United States", pct: 24 },
  { name: "Australia", pct: 17.5 },
  { name: "Germany", pct: 12.5 },
];

const FUNNEL = [
  { label: "Product Views", value: "25,000", delta: "+9%", up: true, h: 100 },
  { label: "Add to Cart", value: "12,000", delta: "+6%", up: true, h: 62 },
  { label: "Proceed to Checkout", value: "8,500", delta: "+4%", up: true, h: 46 },
  { label: "Completed Purchases", value: "6,200", delta: "+7%", up: true, h: 34 },
  { label: "Abandoned Carts", value: "3,000", delta: "-5%", up: false, h: 22 },
];

const REVENUE = [6, 8, 7.4, 9.2, 8.6, 10.4, 14.5, 11.8, 12.6, 11.2, 12.9, 12.2];
const ORDERS = [4.4, 5.6, 5.1, 6.4, 6, 7.2, 9.8, 8.2, 8.7, 7.9, 9, 8.5];

function linePath(values: number[], w: number, h: number, max: number) {
  const step = w / (values.length - 1);
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");
}

function StatCard({
  label,
  value,
  delta,
  up,
  hero,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  hero?: boolean;
}) {
  return (
    <div className={`${hero ? "em-panel-hero" : "em-panel"} flex flex-col justify-between p-5`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{
            background: hero ? "var(--em-primary)" : "var(--em-primary-soft)",
            color: hero ? "#fff" : "var(--em-primary-strong)",
          }}
        >
          £
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="em-mono text-2xl font-bold">{value}</p>
        <span className={`em-pill ${up ? "em-pill-up" : "em-pill-down"}`}>{delta}</span>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">vs last week</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--em-shell)" }}>
      <div className="mx-auto flex max-w-[1400px] overflow-hidden rounded-3xl bg-background shadow-2xl">
        {/* Sidebar */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card px-4 py-6">
          <div className="flex items-center gap-2 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
              O
            </span>
            <span className="text-lg font-extrabold">OmniQure</span>
          </div>
          <nav className="mt-8 flex flex-col gap-1.5 text-sm font-semibold">
            {NAV_MAIN.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`em-focus-ring flex min-h-11 items-center gap-3 px-4 ${item.active ? "em-nav-active" : "em-nav-item"}`}
              >
                <span aria-hidden className="w-4 text-center text-xs">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-4 text-sm font-semibold">
            {NAV_FOOT.map((item) => (
              <a key={item.label} href="#" className="em-focus-ring em-nav-item flex min-h-11 items-center gap-3 px-4">
                <span aria-hidden className="w-4 text-center text-xs">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 py-6">
          <header className="flex items-center justify-between gap-6">
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <label className="em-panel flex min-h-11 w-72 items-center gap-2 rounded-xl px-3 py-2 shadow-none">
                <span aria-hidden className="text-muted-foreground">⌕</span>
                <input
                  aria-label="Search orders, products, customers"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search orders, products, customers…"
                />
              </label>
              <button aria-label="Notifications" className="em-focus-ring relative grid h-11 w-11 place-items-center rounded-full border border-border bg-card">
                <span aria-hidden>◔</span>
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
              </button>
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-bold text-primary" style={{ background: "var(--em-primary-soft)", color: "var(--em-primary-strong)" }}>
                  MG
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">Marcus George</p>
                  <p className="text-[11px] text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-12 gap-5">
            {/* Stat row */}
            <div className="col-span-4">
              <StatCard hero label="Total Sales" value="£983,410" delta="+3.34%" up />
            </div>
            <div className="col-span-4">
              <StatCard label="Total Orders" value="58,375" delta="-2.89%" up={false} />
            </div>
            <div className="col-span-4">
              <StatCard label="Total Visitors" value="237,782" delta="+8.02%" up />
            </div>

            {/* Revenue analytics */}
            <section className="em-panel col-span-8 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Revenue Analytics</h2>
                <button className="em-focus-ring min-h-11 rounded-full bg-primary px-4 text-[11px] font-bold text-primary-foreground">
                  Last 8 Days ▾
                </button>
              </div>
              <div className="mt-2 flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--em-primary)" }} /> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--em-accent)" }} /> Orders
                </span>
              </div>
              <svg viewBox="0 0 560 160" className="mt-3 h-44 w-full" role="img" aria-label="Revenue and orders trend over the last 8 days">
                {[0, 40, 80, 120, 160].map((y) => (
                  <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="var(--em-border)" strokeWidth="1" />
                ))}
                <path d={linePath(ORDERS, 560, 160, 16)} fill="none" stroke="var(--em-accent)" strokeWidth="2" strokeDasharray="5 4" />
                <path d={linePath(REVENUE, 560, 160, 16)} fill="none" stroke="var(--em-primary)" strokeWidth="2.5" />
                <circle cx={560 / 11 * 6} cy={160 - (14.5 / 16) * 160} r="4.5" fill="#fff" stroke="var(--em-primary)" strokeWidth="2.5" />
              </svg>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                {["12 Aug", "13 Aug", "14 Aug", "15 Aug", "16 Aug", "17 Aug", "18 Aug", "19 Aug"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </section>

            {/* Monthly target */}
            <section className="em-panel col-span-4 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Monthly Target</h2>
                <span className="text-muted-foreground">···</span>
              </div>
              <div className="mt-3 flex flex-col items-center">
                <svg viewBox="0 0 120 66" className="w-44" role="img" aria-label="85 percent of monthly target reached">
                  <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--em-primary-soft)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M10 60 A50 50 0 0 1 96 24" fill="none" stroke="var(--em-primary)" strokeWidth="12" strokeLinecap="round" />
                </svg>
                <p className="-mt-8 text-2xl font-extrabold">85%</p>
                <span className="em-pill em-pill-up mt-1">+8.02% from last month</span>
                <p className="mt-3 text-center text-sm font-bold">Great progress</p>
                <p className="mt-1 text-center text-[11px] text-muted-foreground">
                  Achievement increased by £200,000 — on track to reach 100% next month.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl" style={{ background: "var(--em-primary-tint)" }}>
                <div className="p-3 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground">Target</p>
                  <p className="em-mono text-sm font-bold">£600,000</p>
                </div>
                <div className="border-l border-border p-3 text-center">
                  <p className="text-[10px] font-semibold text-muted-foreground">Revenue</p>
                  <p className="em-mono text-sm font-bold">£510,000</p>
                </div>
              </div>
            </section>

            {/* Active users */}
            <section className="em-panel col-span-4 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Active Users</h2>
                <span className="text-muted-foreground">···</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <p className="em-mono text-2xl font-bold">2,758</p>
                <span className="em-pill em-pill-up mb-1">+8.02%</span>
              </div>
              <p className="text-[10px] text-muted-foreground">users, from last month</p>
              <div className="mt-4 space-y-3">
                {COUNTRIES.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{c.name}</span>
                      <span className="em-mono">{c.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full" style={{ background: "var(--em-muted)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${c.pct}%`, background: "var(--em-primary)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Conversion funnel */}
            <section className="em-panel col-span-8 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Conversion Rate</h2>
                <button className="em-focus-ring min-h-11 rounded-full bg-primary px-4 text-[11px] font-bold text-primary-foreground">
                  This Week ▾
                </button>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-4">
                {FUNNEL.map((step) => (
                  <div key={step.label} className="flex flex-col">
                    <p className="text-[10px] font-semibold text-muted-foreground">{step.label}</p>
                    <p className="em-mono mt-1 text-lg font-bold">{step.value}</p>
                    <span className={`em-pill mt-1 w-fit ${step.up ? "em-pill-up" : "em-pill-down"}`}>{step.delta}</span>
                    <div className="mt-3 flex h-28 items-end">
                      <div
                        className="w-full rounded-t-xl"
                        style={{
                          height: `${step.h}%`,
                          background: step.up ? "var(--em-primary-soft)" : "var(--em-danger-soft)",
                          borderTop: `3px solid ${step.up ? "var(--em-primary)" : "var(--em-danger)"}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top categories */}
            <section className="em-panel col-span-6 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Top Categories</h2>
                <a href="#" className="em-focus-ring text-[11px] font-bold" style={{ color: "var(--em-primary-strong)" }}>
                  See all
                </a>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <div className="relative h-36 w-36 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-36 w-36 -rotate-90" role="img" aria-label="Sales by category donut chart">
                    {(() => {
                      let offset = 0;
                      const total = 3400000;
                      const values = [1200000, 950000, 750000, 500000];
                      return values.map((v, i) => {
                        const frac = (v / total) * 100;
                        const el = (
                          <circle
                            key={i}
                            cx="18" cy="18" r="15.9155" fill="none"
                            stroke={CATEGORIES[i].color} strokeWidth="4.5"
                            strokeDasharray={`${frac - 2} ${100 - frac + 2}`}
                            strokeDashoffset={-offset} strokeLinecap="round"
                          />
                        );
                        offset += frac;
                        return el;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground">Total Sales</p>
                      <p className="em-mono text-sm font-extrabold">£3,400,000</p>
                    </div>
                  </div>
                </div>
                <ul className="w-full space-y-2.5 text-[12px] font-semibold">
                  {CATEGORIES.map((c) => (
                    <li key={c.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full border border-border" style={{ background: c.color }} />
                        {c.name}
                      </span>
                      <span className="em-mono">{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Traffic sources */}
            <section className="em-panel col-span-6 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold">Traffic Sources</h2>
                <span className="text-muted-foreground">···</span>
              </div>
              <div className="mt-4 flex h-8 w-full gap-1 overflow-hidden rounded-lg">
                {SOURCES.map((s, i) => (
                  <div
                    key={s.name}
                    style={{
                      width: `${s.pct}%`,
                      background: i === 0 ? "var(--em-primary-tint)" : i === 1 ? "var(--em-primary-soft)" : i === 2 ? "var(--em-accent)" : i === 3 ? "var(--em-primary)" : "var(--em-primary-strong)",
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2.5 text-[12px] font-semibold">
                {SOURCES.map((s, i) => (
                  <li key={s.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-border"
                        style={{ background: i === 0 ? "var(--em-primary-tint)" : i === 1 ? "var(--em-primary-soft)" : i === 2 ? "var(--em-accent)" : i === 3 ? "var(--em-primary)" : "var(--em-primary-strong)" }}
                      />
                      {s.name}
                    </span>
                    <span className="em-mono">{s.pct}%</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
