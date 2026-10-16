import { useState } from "react";
import { Users, Gift, Copy, CheckCircle2, ChevronRight, Star, Share2, Zap, Shield, Percent, Wallet, ShoppingCart, FileText } from "lucide-react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/useSEO";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/context/CurrencyContext";
import {
  REFERRAL_SHARE_DESCRIPTION,
  REFERRAL_SHARE_MESSAGE,
  REFERRAL_SHARE_TITLE,
} from "@/seo/referral";

// Value of a single £25 referral credit reward, in each supported currency.
const REFERRAL_CREDIT_VALUE: Record<CurrencyCode, string> = {
  GBP: "£25",
  USD: "$33",
  EUR: "€30",
  AUD: "A$50",
  CAD: "C$45",
  CHF: "Fr28",
  NZD: "NZ$55",
  JPY: "¥5,000",
  SGD: "S$43",
  HKD: "HK$255",
  KRW: "₩44,000",
  TWD: "NT$1,025",
  MYR: "RM148",
  THB: "฿1,100",
  DKK: "kr225",
  NOK: "kr345",
  SEK: "kr340",
  PLN: "zł125",
  CZK: "Kč725",
  HUF: "Ft11,000",
  AED: "د.إ120",
};

// Maximum unredeemed referral credit balance (£50 cap), in each supported currency.
const REFERRAL_CREDIT_CAP: Record<CurrencyCode, string> = {
  GBP: "£50",
  USD: "$65",
  EUR: "€60",
  AUD: "A$100",
  CAD: "C$90",
  CHF: "Fr57",
  NZD: "NZ$110",
  JPY: "¥10,000",
  SGD: "S$85",
  HKD: "HK$510",
  KRW: "₩88,000",
  TWD: "NT$2,050",
  MYR: "RM295",
  THB: "฿2,200",
  DKK: "kr450",
  NOK: "kr690",
  SEK: "kr680",
  PLN: "zł250",
  CZK: "Kč1,450",
  HUF: "Ft22,000",
  AED: "د.إ240",
};

const PERKS = [
  { icon: <Zap size={16} />,          label: "No limit",        detail: "Refer as many friends as you like — each successful referral earns you and your friend £25 credit each." },
  { icon: <Shield size={16} />,       label: "Both sides win",  detail: "It's not just you — your friend gets £25 credit too, on top of their 10% first-order discount." },
  { icon: <Star size={16} />,         label: "Never expires",   detail: "Credit is added straight to your account balance and never expires — spend it whenever you next order." },
  { icon: <CheckCircle2 size={16} />, label: "Stackable",       detail: "Combine your referral credit with bundle discounts and sale prices on the rest of your order." },
];

const INK = "#1D2948";
const GRAPHITE = "#4A5672";
const COBALT = "#4E68C2";
const HAIR = "1px solid rgba(11,18,32,0.09)";
const CONTAINER = "w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12";
const h2Style = { fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px" } as const;
const subStyle = { fontSize: 14.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 } as const;

export default function ReferAFriendPage() {
  const search = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const refCode = search.get("ref")?.trim() || null;

  useSEO({
    title: refCode ? REFERRAL_SHARE_TITLE : "Refer a Friend",
    description: refCode
      ? REFERRAL_SHARE_DESCRIPTION
      : "Share OmniQure with a fellow researcher. When they place their first order, you both earn £25 credit each — up to £50 unredeemed balance.",
    canonicalPath: "/refer-a-friend",
    noIndex: Boolean(refCode),
  });

  const { currency } = useCurrency();
  const localValue = REFERRAL_CREDIT_VALUE[currency.code] ?? REFERRAL_CREDIT_VALUE.GBP;
  const localCap = REFERRAL_CREDIT_CAP[currency.code] ?? REFERRAL_CREDIT_CAP.GBP;

  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const referralLink = "https://omniqure.com/ref/YOUR-CODE";
  const registerHref = refCode
    ? `/register?ref=${encodeURIComponent(refCode)}`
    : "/register";

  function copyLink() {
    const message = `${REFERRAL_SHARE_MESSAGE}\n\n${referralLink}`;
    void navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const STEPS = [
    {
      icon: Share2,
      step: "01",
      title: "Share Your Link",
      desc: "Copy your unique referral link and share it with fellow researchers via email, social media, or any channel you prefer.",
    },
    {
      icon: Users,
      step: "02",
      title: "Friend Places an Order",
      desc: "Your friend uses your link and gets 10% off their first order automatically at checkout — no code needed. Bundle & Save free items apply too — 3-4 vials for a free 10ml BAC water ampule, 5-9 for a free peptide, or 10+ for 2 free peptides (one reward per order, no stacking).",
    },
    {
      icon: Gift,
      step: "03",
      title: "Both Claim £25 Credit",
      desc: `As soon as your friend's order ships, you both get ${localValue} credit added to your account — redeemable on your next order (up to ${localCap} unredeemed balance).`,
    },
  ];

  const FAQS = [
    {
      q: "Who can I refer?",
      a: "Anyone who hasn't previously placed an order with OmniQure — friends, colleagues, fellow researchers.",
    },
    {
      q: "How do I claim my £25 credit?",
      a: `Once your referred friend has placed their first order, ${localValue} credit is added automatically to your account — and to theirs. Redeem it on your next order at checkout.`,
    },
    {
      q: "Do I need to be placing an order to use the reward?",
      a: `Your credit must be redeemed as part of a new order — it has no standalone cash value. It's applied automatically at checkout as a discount up to the value of your order.`,
    },
    {
      q: "Can my referred friend also use bundle discounts on their first order?",
      a: "Yes. The 10% referral discount is automatically applied to your friend's first order, and Bundle & Save free items apply on top with no exceptions — 3-4 vials for a free 10ml BAC water ampule, 5-9 for a free peptide, or 10+ for 2 free peptides. These tiers don't stack — each order gets the reward for its own tier.",
    },
    {
      q: "Is there a limit to how many people I can refer?",
      a: `No — you can refer as many people as you like. Each successful referral earns you and your friend ${localValue} credit each, up to a ${localCap} unredeemed balance per account.`,
    },
    {
      q: "Do I need an account to refer someone?",
      a: "Yes. You need a registered OmniQure account to generate a referral link and claim your referral credit.",
    },
    {
      q: "Can I redeem more than one order's worth of credit at a time?",
      a: `Your available credit is applied automatically at checkout, up to your order's subtotal — any unused balance stays on your account (capped at ${localCap}) for a future order.`,
    },
    {
      q: "Can I refer myself or create extra accounts to claim rewards?",
      a: "No. Self-referral is strictly prohibited. This includes referring yourself using a different email address, name, or any other account. Referred accounts are verified against existing accounts using email, billing address, delivery address, payment method, IP address, and device signals. Any referral found to involve fake, duplicate, or self-created accounts will be voided and all associated accounts permanently terminated. OmniQure's fraud checks run automatically and our decisions are final.",
    },
    {
      q: "What happens if OmniQure detects misuse of the referral programme?",
      a: "If we identify fraudulent referral activity — including but not limited to self-referral, coordinated fake-account creation, or abuse of the 10% first-order discount — we will immediately void all associated rewards, permanently close all accounts involved, cancel any pending orders, and may pursue recovery of any value already redeemed. Repeat or large-scale abuse may be referred to relevant authorities.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <PageHero
        crumbs={[{ label: "Refer a Friend" }]}
        eyebrow="Referral programme"
        icon={Users}
        title={<>Refer a Friend, <span style={{ color: COBALT }}>Earn £25 Credit Each</span></>}
      >
        <p style={{ margin: 0 }}>
          Share OmniQure with a fellow researcher. They get <strong style={{ color: INK, fontWeight: 600 }}>10% off their first order</strong>, and once it ships you <strong style={{ color: INK, fontWeight: 600 }}>both claim {localValue} credit</strong> — up to {localCap} unredeemed balance each.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={registerHref}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: INK, textDecoration: "none" }}
          >
            Get Your Referral Link <ChevronRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[14px] font-medium transition-colors hover:bg-[#F2F0EB]"
            style={{ background: "#fff", color: INK, border: HAIR, textDecoration: "none" }}
          >
            Sign In
          </Link>
        </div>
      </PageHero>

      {/* Reward cards */}
      <section className={`${CONTAINER} pt-12 lg:pt-14`}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Percent,      label: "Your friend gets", value: "10% Off",            sub: "their first order, automatically" },
            { icon: Wallet,       label: "You both get",     value: `${localValue} Each`, sub: `credit added to your accounts (up to ${localCap})` },
            { icon: ShoppingCart, label: "How to claim",     value: "Next Order",         sub: "credit applies automatically at checkout" },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} style={{ background: "#fff", borderRadius: 16, padding: "24px", border: HAIR }}>
                <span className="mb-5 flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FFF6F2", color: COBALT }}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <p className="uppercase" style={{ fontSize: 11, fontWeight: 500, color: GRAPHITE, letterSpacing: "0.1em", margin: "0 0 6px" }}>
                  {card.label}
                </p>
                <p style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: "-0.02em", margin: "0 0 4px", lineHeight: 1.1 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 13, color: GRAPHITE, margin: 0 }}>{card.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className={`${CONTAINER} py-14 lg:py-16`}>
        <div className="mb-8">
          <h2 style={h2Style}>How It Works</h2>
          <p style={subStyle}>Three simple steps to start earning.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} style={{ borderRadius: 16, padding: "24px", background: "#fff", border: HAIR }}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FFF6F2", color: COBALT }}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, color: GRAPHITE, letterSpacing: "0.04em" }}>
                    {s.step}
                  </span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: INK, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: 13.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral link demo */}
      <section style={{ background: "#F2F0EB", borderTop: HAIR, borderBottom: HAIR }}>
        <div className={`${CONTAINER} py-14 lg:py-16`}>
          <div className="max-w-[640px]">
            <h2 style={h2Style}>Your Unique Referral Link</h2>
            <p style={{ ...subStyle, marginBottom: 24 }}>
              Sign in to generate your personal link. Share it anywhere.
            </p>

            <div className="flex items-center gap-2" style={{ background: "#fff", borderRadius: 9999, border: HAIR, padding: 5 }}>
              <span
                className="flex-1 truncate"
                style={{ padding: "0 14px", fontSize: 13.5, fontFamily: "var(--app-font-mono)", color: GRAPHITE }}
              >
                {referralLink}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex shrink-0 items-center gap-1.5 h-10 px-5 rounded-full text-[13px] font-medium text-white transition-colors"
                style={{ background: copied ? COBALT : INK, border: "none", cursor: "pointer" }}
              >
                {copied ? <><CheckCircle2 size={14} aria-hidden="true" /> Copied!</> : <><Copy size={14} aria-hidden="true" /> Copy</>}
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: GRAPHITE, marginTop: 14 }}>
              <Link href="/sign-in" style={{ color: COBALT, fontWeight: 500, textDecoration: "none" }}>Sign in</Link> or{" "}
              <Link href="/register" style={{ color: COBALT, fontWeight: 500, textDecoration: "none" }}>create an account</Link> to get your real referral link.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className={`${CONTAINER} py-14 lg:py-16`}>
        <h2 style={{ ...h2Style, marginBottom: 28 }}>Programme Perks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(p => (
            <div key={p.label} className="flex flex-col gap-2" style={{ borderRadius: 16, padding: "22px", background: "#fff", border: HAIR }}>
              <span className="mb-2 flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FFF6F2", color: COBALT }}>
                {p.icon}
              </span>
              <p style={{ fontSize: 15, fontWeight: 600, color: INK, letterSpacing: "-0.01em", margin: 0 }}>{p.label}</p>
              <p style={{ fontSize: 13, color: GRAPHITE, margin: 0, lineHeight: 1.6 }}>{p.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F2F0EB", borderTop: HAIR, borderBottom: HAIR }}>
        <div className={`${CONTAINER} py-14 lg:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 style={h2Style}>Frequently Asked Questions</h2>
              <p style={subStyle}>Everything you need to know about referral credit.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {FAQS.map((f, i) => (
                <div
                  key={f.q}
                  style={{
                    background: "#fff", borderRadius: 14, overflow: "hidden",
                    border: openFaq === i ? `1px solid ${COBALT}` : HAIR,
                    transition: "border-color 0.2s",
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                    style={{ padding: "16px 18px", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>{f.q}</span>
                    <ChevronRight
                      size={16}
                      aria-hidden="true"
                      style={{
                        color: GRAPHITE, flexShrink: 0,
                        transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 18px 16px" }}>
                      <p style={{ fontSize: 13.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 }}>{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programme T&Cs */}
      <section className={`${CONTAINER} py-12 lg:py-14`}>
        <div style={{ borderRadius: 16, border: HAIR, padding: "24px 28px", background: "#fff" }}>
          <h3 className="flex items-center gap-2.5" style={{ fontSize: 15, fontWeight: 600, color: INK, letterSpacing: "-0.01em", margin: "0 0 16px" }}>
            <span className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FFF6F2", color: COBALT }}>
              <FileText size={18} aria-hidden="true" />
            </span>
            Programme Terms &amp; Conditions
          </h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Referrals are valid only for genuinely new customers who have never previously placed an order with OmniQure.",
              "Self-referral is strictly prohibited. You may not refer yourself using a different email address, name, or any other account.",
              "Referred accounts sharing the same name, billing address, delivery address, payment method, IP address, or device fingerprint as an existing account will be treated as fraudulent and voided.",
              "Creating fake, duplicate, or third-party accounts solely to generate referral rewards is prohibited and will result in permanent termination of all associated accounts.",
              "A referral reward is only issued once the referred friend's first order has been fully paid and not subsequently refunded, cancelled, or charged back.",
              "£25 credit each is issued to the referrer and the referred friend per qualifying referral, up to a £50 unredeemed balance per account. Credit must be redeemed against a new order — it has no standalone cash value and is non-transferable.",
              "OmniQure reviews all referral rewards before release. We reserve the right to withhold, void, or claw back rewards pending or following a fraud investigation.",
              "Misuse of the programme will result in immediate account termination, cancellation of all pending and accrued rewards, and potential legal action.",
              "OmniQure's decisions regarding programme eligibility and fraud are final.",
            ].map((rule, i) => (
              <li key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: GRAPHITE, lineHeight: 1.6 }}>
                <span style={{ flexShrink: 0, fontFamily: "var(--app-font-mono)", fontSize: 12, color: GRAPHITE, minWidth: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {rule}
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 12.5, color: GRAPHITE, marginTop: 16, marginBottom: 0 }}>
            Full programme terms form part of our{" "}
            <Link href="/terms" style={{ color: COBALT, fontWeight: 500, textDecoration: "none" }}>Terms &amp; Conditions</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

