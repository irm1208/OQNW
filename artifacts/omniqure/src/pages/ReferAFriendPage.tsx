import { useState } from "react";
import { Users, Gift, Copy, CheckCircle2, ChevronRight, Star, Share2, Zap, Shield } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/context/CurrencyContext";

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

export default function ReferAFriendPage() {
  useSEO({
    title: "Refer a Friend",
    description: "Share OmniQure with a fellow researcher. When they place their first order, you both earn £25 credit each — up to £50 unredeemed balance.",
    canonicalPath: "/refer-a-friend",
  });

  const { currency } = useCurrency();
  const localValue = REFERRAL_CREDIT_VALUE[currency.code] ?? REFERRAL_CREDIT_VALUE.GBP;
  const localCap = REFERRAL_CREDIT_CAP[currency.code] ?? REFERRAL_CREDIT_CAP.GBP;

  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const referralLink = "https://omniqure.com/ref/YOUR-CODE";

  function copyLink() {
    void navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const STEPS = [
    {
      icon: <Share2 size={22} color="#fff" />,
      bg: "linear-gradient(135deg, #1240A0, #1B5CB5)",
      step: "01",
      title: "Share Your Link",
      desc: "Copy your unique referral link and share it with fellow researchers via email, social media, or any channel you prefer.",
    },
    {
      icon: <Users size={22} color="#fff" />,
      bg: "linear-gradient(135deg, #7C3AED, #A855F7)",
      step: "02",
      title: "Friend Places an Order",
      desc: "Your friend uses your link and gets 10% off their first order automatically at checkout — no code needed. Bundle & Save free items apply too — 3-4 vials for free BAC water, 5-9 for a free peptide, or 10+ for 2 free peptides (one reward per order, no stacking).",
    },
    {
      icon: <Gift size={22} color="#fff" />,
      bg: "linear-gradient(135deg, #059669, #10B981)",
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
      a: "Yes. The 10% referral discount is automatically applied to your friend's first order, and Bundle & Save free items apply on top with no exceptions — 3-4 vials for a free BAC water, 5-9 for a free peptide, or 10+ for 2 free peptides. These tiers don't stack — each order gets the reward for its own tier.",
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
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0D2565 0%, #1240A0 45%, #1B5CB5 80%, #1E68CC 100%)",
        padding: "64px 20px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", borderRadius: 9999,
            padding: "6px 18px", marginBottom: 20,
          }}>
            <Users size={14} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>
              REFERRAL PROGRAMME
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 16px",
          }}>
            Refer a Friend,<br />
            <span style={{ color: "#E8A93E" }}>Earn £25 Credit Each</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto 32px" }}>
            Share OmniQure with a fellow researcher. They get <strong style={{ color: "#fff" }}>10% off their first order</strong>, and once it ships you <strong style={{ color: "#fff" }}>both claim {localValue} credit</strong> — up to {localCap} unredeemed balance each.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#E8A93E", color: "#0D2565",
                padding: "13px 28px", borderRadius: 12, fontWeight: 800, fontSize: 15,
                textDecoration: "none", boxShadow: "0 4px 16px rgba(232,169,62,0.4)",
              }}
            >
              Get Your Referral Link <ChevronRight size={16} />
            </Link>
            <Link
              href="/sign-in"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.12)", color: "#fff",
                padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15,
                textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.25)",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Reward cards */}
      <div style={{ background: "#fff", padding: "0 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", transform: "translateY(-32px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { emoji: "🎁", label: "Your friend gets",  value: "10% Off",         sub: "their first order, automatically" },
              { emoji: "💷", label: "You both get",       value: `${localValue} Each`, sub: `credit added to your accounts (up to ${localCap})` },
              { emoji: "🛒", label: "How to claim",      value: "Next Order",      sub: "credit applies automatically at checkout" },
            ].map(card => (
              <div key={card.label} style={{
                background: "#fff", borderRadius: 16, padding: "24px 20px",
                boxShadow: "0 4px 24px rgba(15,23,42,0.08)", border: "1px solid #E8EDF5",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{card.emoji}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                  {card.label}
                </p>
                <p style={{ fontSize: card.value.length > 8 ? 22 : 28, fontWeight: 900, color: "#0D2565", margin: "0 0 4px", lineHeight: 1.1 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "0 20px 60px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 8 }}>
            How It Works
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", textAlign: "center", marginBottom: 40 }}>
            Three simple steps to start earning.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.step} style={{
                borderRadius: 16, padding: "28px 24px",
                background: "#F8FAFF", border: "1px solid #E8EDF5",
                position: "relative",
              }}>
                <span style={{
                  position: "absolute", top: 18, right: 20,
                  fontSize: 40, fontWeight: 900, color: "#E8EDF5", lineHeight: 1,
                  userSelect: "none",
                }}>
                  {s.step}
                </span>
                <span style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: s.bg, display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 16, boxShadow: "0 4px 14px rgba(18,64,160,0.22)",
                }}>
                  {s.icon}
                </span>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral link demo */}
      <div style={{ background: "linear-gradient(135deg, #EEF4FF, #F5F8FF)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", marginBottom: 8 }}>
            Your Unique Referral Link
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Sign in to generate your personal link. Share it anywhere.
          </p>

          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: "#fff", borderRadius: 12, border: "2px solid #BFDBFE",
            overflow: "hidden", boxShadow: "0 4px 16px rgba(18,64,160,0.08)",
          }}>
            <span style={{
              flex: 1, padding: "14px 16px",
              fontSize: 13.5, fontWeight: 600, color: "#475569",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {referralLink}
            </span>
            <button
              onClick={copyLink}
              style={{
                padding: "14px 20px", flexShrink: 0,
                background: copied ? "linear-gradient(135deg, #059669, #10B981)" : "linear-gradient(135deg, #1240A0, #1B5CB5)",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 7,
                transition: "background 0.2s",
              }}
            >
              {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>

          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14 }}>
            <Link href="/sign-in" style={{ color: "#1B5CB5", fontWeight: 600, textDecoration: "none" }}>Sign in</Link> or{" "}
            <Link href="/register" style={{ color: "#1B5CB5", fontWeight: 600, textDecoration: "none" }}>create an account</Link> to get your real referral link.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div style={{ padding: "56px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 36 }}>
            Programme Perks
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {PERKS.map(p => (
              <div key={p.label} style={{
                borderRadius: 14, padding: "20px 18px",
                background: "#F8FAFF", border: "1px solid #E8EDF5",
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: "#EEF4FF", color: "#1240A0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {p.icon}
                </span>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", margin: 0 }}>{p.label}</p>
                <p style={{ fontSize: 12.5, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "56px 20px 72px", background: "#F5F8FC" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 32 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", borderRadius: 12, overflow: "hidden",
                  border: openFaq === i ? "1.5px solid #BFDBFE" : "1px solid #E8EDF5",
                  boxShadow: openFaq === i ? "0 4px 14px rgba(18,64,160,0.07)" : "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "16px 18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{f.q}</span>
                  <ChevronRight
                    size={16}
                    style={{
                      color: "#1B5CB5", flexShrink: 0,
                      transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 18px 16px" }}>
                    <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, margin: 0 }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programme T&Cs */}
      <div style={{ padding: "40px 20px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            borderRadius: 14,
            border: "1.5px solid #E2E8F0",
            padding: "24px 28px",
            background: "#F8FAFC",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📋</span> Programme Terms &amp; Conditions
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
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
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, color: "#94A3B8", fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14, marginBottom: 0 }}>
              Full programme terms form part of our{" "}
              <Link href="/terms" style={{ color: "#1B5CB5", fontWeight: 600, textDecoration: "none" }}>Terms &amp; Conditions</Link>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
