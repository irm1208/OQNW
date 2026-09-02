import "./_group.css";

const CORE_COLORS = [
  { name: "Shell", token: "--em-shell", hex: "#E6DDD2" },
  { name: "Background", token: "--em-background", hex: "#FAF7F2" },
  { name: "Card", token: "--em-card", hex: "#FFFFFF" },
  { name: "Foreground", token: "--em-foreground", hex: "#241C14" },
  { name: "Muted foreground", token: "--em-muted-foreground", hex: "#8A7A66" },
  { name: "Border", token: "--em-border", hex: "#EFE4D5" },
];

const BRAND_COLORS = [
  { name: "Primary", token: "--em-primary", hex: "#F4780C" },
  { name: "Primary strong", token: "--em-primary-strong", hex: "#E2660A" },
  { name: "Accent", token: "--em-accent", hex: "#FFB266" },
  { name: "Primary soft", token: "--em-primary-soft", hex: "#FFE9D4" },
  { name: "Primary tint", token: "--em-primary-tint", hex: "#FFF4E8" },
];

const STATUS_COLORS = [
  { name: "Success", token: "--em-success", hex: "#21A366" },
  { name: "Warning", token: "--em-warning", hex: "#D9970F" },
  { name: "Danger", token: "--em-danger", hex: "#D94F45" },
];

function Swatch({ name, token, hex }: { name: string; token: string; hex: string }) {
  return (
    <div className="em-panel overflow-hidden">
      <div className="h-16" style={{ background: `var(${token})` }} />
      <div className="px-3 py-2">
        <p className="text-xs font-bold">{name}</p>
        <p className="em-mono text-[10px] text-muted-foreground">
          {token} · {hex}
        </p>
      </div>
    </div>
  );
}

export default function Foundations() {
  return (
    <div className="min-h-screen p-10" style={{ background: "var(--em-shell)" }}>
      <div className="mx-auto max-w-6xl space-y-10 rounded-3xl bg-background p-10 shadow-xl">
        <header>
          <p className="em-eyebrow">Design system</p>
          <h1 className="mt-2 text-3xl font-extrabold">OmniQure Ember</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Warm commerce back-office language: parchment shell, white rounded
            cards, and a single ember-orange accent for navigation, primary
            actions, and data emphasis.
          </p>
        </header>

        <section>
          <p className="em-eyebrow">Surface & ink</p>
          <div className="mt-3 grid grid-cols-3 gap-4 md:grid-cols-6">
            {CORE_COLORS.map((c) => <Swatch key={c.token} {...c} />)}
          </div>
        </section>

        <section>
          <p className="em-eyebrow">Ember scale</p>
          <div className="mt-3 grid grid-cols-3 gap-4 md:grid-cols-5">
            {BRAND_COLORS.map((c) => <Swatch key={c.token} {...c} />)}
          </div>
        </section>

        <section>
          <p className="em-eyebrow">Status</p>
          <div className="mt-3 grid grid-cols-3 gap-4 md:w-1/2">
            {STATUS_COLORS.map((c) => <Swatch key={c.token} {...c} />)}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="em-panel p-6">
            <p className="em-eyebrow">Typography</p>
            <h2 className="mt-3 text-2xl font-extrabold">Plus Jakarta Sans</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Interface text, headings, labels. Weights 400–800.
            </p>
            <p className="em-mono mt-4 text-lg font-semibold">
              JetBrains Mono — $983,410 · #INV-2094 · 14:32
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Machine values: currency, IDs, quantities, timestamps.
            </p>
          </div>

          <div className="em-panel p-6">
            <p className="em-eyebrow">Pills & deltas</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="em-pill em-pill-up">+3.34% vs last week</span>
              <span className="em-pill em-pill-down">-2.89% vs last week</span>
              <span className="em-pill em-pill-warn">Low stock</span>
              <span className="em-pill em-pill-brand">Featured</span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Every delta pairs a color, an explicit sign, and a comparison
              caption. Color is never the only signal.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="em-panel-hero p-6">
            <p className="em-eyebrow" style={{ color: "var(--em-primary-strong)" }}>
              Hero card
            </p>
            <p className="em-mono mt-2 text-3xl font-bold">$983,410</p>
            <p className="mt-1 text-xs text-muted-foreground">
              One tinted, dashed-outline hero metric per view.
            </p>
          </div>
          <div className="em-panel p-6">
            <p className="em-eyebrow">Standard card</p>
            <p className="em-mono mt-2 text-3xl font-bold">58,375</p>
            <p className="mt-1 text-xs text-muted-foreground">
              White cards with soft warm shadows and 16px radius.
            </p>
          </div>
          <div className="em-panel p-6">
            <p className="em-eyebrow">Buttons</p>
            <div className="mt-4 flex flex-col gap-3">
              <button className="em-focus-ring em-interactive min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
                Primary action
              </button>
              <button className="em-focus-ring em-interactive min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold">
                Secondary action
              </button>
            </div>
          </div>
        </section>

        <section className="em-panel p-6">
          <p className="em-eyebrow">Navigation</p>
          <div className="mt-4 flex max-w-xs flex-col gap-1.5 text-sm font-semibold">
            <span className="em-nav-active flex min-h-11 items-center px-4">Dashboard</span>
            <span className="em-nav-item flex min-h-11 items-center px-4">Orders</span>
            <span className="em-nav-item flex min-h-11 items-center px-4">Products</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The active item is a solid ember pill with a warm glow; inactive
            items are quiet until hovered.
          </p>
        </section>
      </div>
    </div>
  );
}
