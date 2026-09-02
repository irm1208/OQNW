import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import "./_group.css";

const swatches = [
  ["Deep ink", "var(--oq-ink-deep)", "#07162B"],
  ["Cobalt", "var(--oq-primary)", "#1240A0"],
  ["Aqua signal", "var(--oq-accent)", "#13B8A6"],
  ["Sky lift", "var(--oq-sky)", "#65B7EE"],
  ["Attention", "var(--oq-warning)", "#DD9A2B"],
  ["Danger", "var(--oq-danger)", "#D6475E"],
];

const navItems = [
  { label: "Dashboard", icon: Activity, active: true },
  { label: "Orders", icon: Package },
  { label: "Customers", icon: Users },
  { label: "Fulfilment", icon: Truck },
  { label: "Security", icon: ShieldCheck },
];

function Status({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const colors = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
  };
  const Icon = tone === "success" ? CheckCircle2 : CircleAlert;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${colors[tone]}`}>
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function Foundations() {
  return (
    <main className="min-h-screen bg-[var(--oq-background)] p-5 text-[var(--oq-foreground)] sm:p-8">
      <div className="mx-auto max-w-[1160px]">
        <header className="flex flex-col gap-5 border-b border-[var(--oq-border)] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--oq-primary)]">
              <Sparkles className="h-4 w-4" />
              <p className="oq-eyebrow text-[var(--oq-primary)]">OmniQure Ops / v0.1</p>
            </div>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              Calm authority for high-stakes operations.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--oq-muted-foreground)]">
              A visual language for scanning, deciding, and acting across the
              store without losing the human signal.
            </p>
          </div>
          <div className="oq-mono rounded-full bg-[var(--oq-ink-deep)] px-3 py-2 text-xs text-white">
            DESIGN SYSTEM / READY
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="oq-panel h-fit overflow-hidden p-3">
            <div className="mb-4 px-3 pt-2">
              <p className="text-sm font-extrabold text-[var(--oq-primary)]">OmniQure</p>
              <p className="mt-1 text-[11px] text-[var(--oq-muted-foreground)]">Operations console</p>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ label, icon: Icon, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-[var(--oq-primary)] text-white shadow-lg shadow-blue-900/20"
                      : "text-[var(--oq-muted-foreground)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Healthy orders", "96.8%", "↑ 4.2%", "text-[var(--oq-success)]"],
                ["Needs attention", "12", "3 urgent", "text-[var(--oq-warning)]"],
                ["Revenue today", "£18,420", "↑ 12.6%", "text-[var(--oq-primary)]"],
              ].map(([label, value, delta, tone]) => (
                <div className="oq-panel p-5" key={label}>
                  <p className="oq-eyebrow">{label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="oq-mono text-2xl font-semibold tracking-[-0.04em]">{value}</p>
                    <span className={`text-xs font-bold ${tone}`}>{delta}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="oq-panel p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="oq-eyebrow">Type scale / data hierarchy</p>
                    <h2 className="mt-2 text-xl font-extrabold tracking-tight">Make the next decision obvious.</h2>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-[var(--oq-accent)]" />
                </div>
                <div className="mt-7 grid gap-5 sm:grid-cols-[1fr_0.8fr]">
                  <div className="space-y-3">
                    <p className="text-3xl font-extrabold tracking-[-0.04em]">Heading / 32</p>
                    <p className="text-xl font-bold">Section heading / 20</p>
                    <p className="text-sm leading-6 text-[var(--oq-muted-foreground)]">Body copy / 14 — useful context never competes with the action.</p>
                    <p className="oq-mono text-xs text-[var(--oq-primary)]">ORDER_08271 / MONO 12</p>
                  </div>
                  <div className="space-y-3">
                    <Status tone="success">Ready to ship</Status>
                    <Status tone="warning">Review needed</Status>
                    <Status tone="danger">Payment blocked</Status>
                  </div>
                </div>
              </div>

              <div className="oq-panel overflow-hidden">
                <div className="border-b border-[var(--oq-border)] px-5 py-4">
                  <p className="oq-eyebrow">Core palette</p>
                  <p className="mt-1 text-sm font-semibold">Signals, not decoration.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 p-5">
                  {swatches.map(([label, color, hex]) => (
                    <div key={label}>
                      <div className="h-14 rounded-xl" style={{ background: color }} />
                      <p className="mt-2 text-xs font-bold">{label}</p>
                      <p className="oq-mono mt-0.5 text-[10px] text-[var(--oq-muted-foreground)]">{hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="oq-grid-noise rounded-2xl border border-[var(--oq-border)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="oq-eyebrow">Interaction language</p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-tight">Firm controls. Gentle feedback.</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="oq-interactive oq-focus-ring rounded-lg bg-[var(--oq-primary)] px-4 py-2.5 text-sm font-bold text-white">Primary action</button>
                  <button className="oq-interactive oq-focus-ring rounded-lg border border-[var(--oq-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--oq-foreground)]">Secondary</button>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Operator rhythm", "Scan → decide → confirm", "text-[var(--oq-primary)]"],
                  ["Healthy signal", "Mint means the system can move", "text-[var(--oq-success)]"],
                  ["Attention signal", "Amber asks for a human look", "text-[var(--oq-warning)]"],
                ].map(([label, body, tone]) => (
                  <div className="rounded-xl border border-white/70 bg-white/75 p-4" key={label}>
                    <p className={`text-xs font-extrabold ${tone}`}>{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-5">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}