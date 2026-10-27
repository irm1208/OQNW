import { useState, useMemo } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useAffiliateProgram, useAffiliateMe, useApplyAffiliate, useClaimReward } from "@/hooks/useAffiliate";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Gift, Copy, CheckCircle2, ChevronRight, Award,
  Clock, CheckCircle, XCircle, TrendingUp, FileText
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/PageHero";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const INK = "#1D2948";
const GRAPHITE = "#4A5672";
const COBALT = "#4E68C2";
const HAIR = "1px solid rgba(11,18,32,0.09)";
const CONTAINER = "w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12";
const h2Style = { fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px" } as const;
const subStyle = { fontSize: 14.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 } as const;
const labelStyle = { fontSize: 11, fontWeight: 500, color: GRAPHITE, letterSpacing: "0.1em", textTransform: "uppercase" } as const;
const inputStyle = { padding: "10px 14px", borderRadius: 10, border: HAIR, fontSize: 14, color: INK, background: "#fff" } as const;
const primaryBtnStyle = { background: INK, color: "#fff", border: "none", borderRadius: 9999, fontWeight: 500, fontSize: 14 } as const;
const card = { background: "#fff", borderRadius: 16, border: HAIR } as const;

function AffiliateLanding({ program }: { program: any }) {
  return (
    <div>
      <PageHero image={{ key: "hdr-affiliate", alt: "The OmniQure packaging family: pen kit, cartons and vials", fit: "center" }}
        crumbs={[{ label: "Affiliate Programme" }]}
        eyebrow="Partner programme"
        icon={Users}
        title={<>OmniQure Affiliate Partner, <span style={{ color: COBALT }}>Earn Monetary Payments & Rewards</span></>}
      >
        <p style={{ margin: 0 }}>
          Share OmniQure with your audience. Once approved, you earn up to {program?.tiers?.[program.tiers.length - 1]?.commissionRatePercent}% in monetary payments, give customers {program?.customerDiscountPercent}% off, and unlock product rewards as your sales grow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/sign-in?returnTo=/affiliate"
            data-testid="link-affiliate-sign-in"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: INK, textDecoration: "none" }}
          >
            Sign In to Apply <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </PageHero>

      {/* How It Works */}
      <section className={`${CONTAINER} py-14 lg:py-16`}>
        <div className="mb-8 max-w-[620px]">
          <p style={{ ...labelStyle, color: COBALT, margin: "0 0 10px" }}>Simple partner journey</p>
          <h2 style={h2Style}>How the affiliate programme works</h2>
          <p style={subStyle}>
            Apply once, wait for admin approval, then share your link and track everything from your partner dashboard.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { number: "01", title: "Apply", text: "Tell us where you reach people and how you plan to promote OmniQure." },
            { number: "02", title: "Get approved", text: "Our team reviews your application. Approved partners receive a tracking link and discount code." },
            { number: "03", title: "Share and earn", text: "Customers get the partner discount. You receive monetary payments on eligible product sales attributed to you." },
            { number: "04", title: "Track and claim", text: "See your monetary payments, sales progress, and product rewards in your dashboard." },
          ].map(step => (
            <div key={step.number} style={{ ...card, padding: "22px" }}>
              <span style={{ display: "block", fontFamily: "var(--app-font-mono)", fontSize: 12, color: GRAPHITE, letterSpacing: "0.04em", marginBottom: 14 }}>
                {step.number}
              </span>
              <h3 style={{ color: INK, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 7px" }}>{step.title}</h3>
              <p style={{ color: GRAPHITE, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{step.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: "#F2F0EB", border: HAIR, borderRadius: 14, padding: "14px 18px", color: GRAPHITE, fontSize: 13.5, lineHeight: 1.6 }}>
          <strong style={{ color: INK, fontWeight: 600 }}>Good to know:</strong> monetary payments are calculated from product sales after discounts. Shipping, tax, and payment fees are excluded. Payments are reviewed before approval and paid manually once you reach the payout threshold.
        </div>
      </section>

      {/* Program Details */}
      <section style={{ background: "#F2F0EB", borderTop: HAIR, borderBottom: HAIR }}>
        <div className={`${CONTAINER} py-14 lg:py-16`}>
          <div className="mb-8 max-w-[620px]">
            <h2 style={h2Style}>How you move up and receive more</h2>
            <p style={subStyle}>
              You start at Starter. As your reviewed, eligible sales grow within the rolling {program?.tierWindowDays}-day period, you unlock a higher monetary payment rate and product rewards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {program?.tiers?.map((tier: any, i: number) => (
              <div key={tier.id} style={{ ...card, padding: "22px", display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, color: GRAPHITE, letterSpacing: "0.04em" }}>
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 16, fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>{tier.name}</span>
                <span style={{ fontSize: 26, fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {tier.commissionRatePercent}% <span style={{ fontSize: 13, fontWeight: 500, color: GRAPHITE, letterSpacing: 0 }}>payment</span>
                </span>
                <p style={{ fontSize: 13, color: GRAPHITE, lineHeight: 1.55, margin: "4px 0 0" }}>
                  {i === 0
                    ? "Your first eligible sale starts you here."
                    : `Reach £${Number(tier.minimumSalesGbp).toLocaleString("en-GB")} in reviewed sales over ${program.tierWindowDays} days.`}
                </p>
                <div style={{ marginTop: 4, padding: "10px 12px", borderRadius: 10, background: "#F2F0EB", border: HAIR, color: GRAPHITE, fontSize: 12.5, lineHeight: 1.5 }}>
                  {i === 0 ? `Receive ${tier.commissionRatePercent}% as a monetary payment on eligible sales.` : `After reaching this level, receive ${tier.commissionRatePercent}% as a monetary payment on your next eligible sales.`}
                </div>
                {tier.rewardCreditGbp > 0 && (
                  <div style={{ background: "#FFF6F2", padding: "10px 12px", borderRadius: 10, fontSize: 12.5, color: COBALT, fontWeight: 500, display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.45 }}>
                    <Gift size={14} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" /> Choose one eligible product up to £{tier.rewardCreditGbp}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ ...card, marginTop: 16, padding: "24px" }}>
            <h3 style={{ color: INK, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 8px" }}>A quick example</h3>
            <p style={{ color: GRAPHITE, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 20px" }}>
              If a customer places a £200 eligible product order, your monetary payment would be: {program?.tiers?.map((tier: any) => `${tier.name} £${(200 * Number(tier.commissionRatePercent) / 100).toFixed(2)}`).join(" · ")}.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>Tracking Window</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: INK, margin: 0 }}>{program?.attributionWindowDays} Days</p>
              </div>
              <div>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>Customer Discount</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: INK, margin: 0 }}>{program?.customerDiscountPercent}% Off</p>
              </div>
              <div>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>Payout Threshold</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: INK, margin: 0 }}>£{program?.payoutThresholdGbp} <span style={{ fontSize: 12, fontWeight: 400, color: GRAPHITE }}>paid monthly</span></p>
              </div>
            </div>
            <p style={{ color: GRAPHITE, fontSize: 12.5, lineHeight: 1.5, margin: "18px 0 0", paddingTop: 14, borderTop: HAIR }}>
              Eligible sales mean the product total after discounts. Shipping, tax, and payment fees do not count.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AffiliateApplication({ apply, isPending }: { apply: (data: any) => void; isPending: boolean }) {
  const [form, setForm] = useState({ channelUrl: "", audienceDescription: "", promotionPlan: "" });

  return (
    <div className="w-full max-w-[640px] mx-auto px-5 md:px-8 py-14 lg:py-16">
      <p style={{ ...labelStyle, color: COBALT, margin: "0 0 10px" }}>Partner programme</p>
      <h2 style={h2Style}>Apply to be an Affiliate Partner</h2>
      <p style={{ ...subStyle, marginBottom: 28 }}>Tell us a bit about your audience and how you plan to promote OmniQure.</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        apply(form);
      }} style={{ ...card, padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: INK }}>Primary Channel URL</label>
          <input
            data-testid="input-affiliate-channel"
            type="url" required
            placeholder="https://youtube.com/c/yourchannel"
            value={form.channelUrl} onChange={e => setForm({...form, channelUrl: e.target.value})}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: INK }}>Audience Description</label>
          <textarea
            data-testid="input-affiliate-audience"
            required rows={3}
            placeholder="Who is your audience? (e.g. biohackers, fitness enthusiasts, researchers)"
            value={form.audienceDescription} onChange={e => setForm({...form, audienceDescription: e.target.value})}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: INK }}>Promotion Plan</label>
          <textarea
            data-testid="input-affiliate-promotion-plan"
            required rows={4}
            placeholder="How do you plan to promote OmniQure products?"
            value={form.promotionPlan} onChange={e => setForm({...form, promotionPlan: e.target.value})}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <button
          data-testid="button-submit-affiliate-application"
          type="submit"
          disabled={isPending}
          style={{
            ...primaryBtnStyle, height: 44, padding: "0 24px", cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1, marginTop: 8
          }}
        >
          {isPending ? "Submitting Application..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function AffiliatePending({ status }: { status: string }) {
  return (
    <div className="w-full max-w-[640px] mx-auto my-14 lg:my-20 px-6 py-10 text-center" style={{ ...card, background: "#F2F0EB" }}>
      {status === 'pending' ? (
        <>
          <span className="mx-auto mb-5 flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FFF6F2", color: COBALT }}><Clock size={18} aria-hidden="true" /></span>
          <h2 style={{ ...h2Style, fontSize: 24, marginBottom: 10 }}>Application Under Review</h2>
           <p style={subStyle}>We've received your application and our team is currently reviewing it. Your tracking link, discount code, payments, and rewards become available after admin approval.</p>
        </>
      ) : (
        <>
          <span className="mx-auto mb-5 flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#FEF2F2", color: "#DC2626" }}><XCircle size={18} aria-hidden="true" /></span>
          <h2 style={{ ...h2Style, fontSize: 24, marginBottom: 10 }}>Application Declined</h2>
          <p style={subStyle}>Your affiliate access is not active. Tracking links, discount codes, payments, and rewards are available only after admin approval.</p>
        </>
      )}
    </div>
  );
}

function AffiliateDashboard({ me, program }: { me: any, program: any }) {
  const { partner, totals, commissions, rewards, eligibleProducts, tierProgress } = me;
  const { formatPrice } = useCurrency();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();
  const claimMutation = useClaimReward();
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const trackingUrl = useMemo(
    () => new URL(partner.trackingPath, window.location.origin).toString(),
    [partner.trackingPath],
  );

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleClaim = (rewardId: number) => {
    if (!selectedProduct) {
      toast({ title: "Please select a product", variant: "destructive" });
      return;
    }
    claimMutation.mutate({ rewardId, productSlug: selectedProduct }, {
      onSuccess: () => {
        toast({ title: "Reward claimed successfully" });
        setSelectedProduct("");
      },
      onError: error => {
        toast({
          title: "Reward could not be claimed",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className={`${CONTAINER} pt-10 pb-20 lg:pt-14`}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ ...labelStyle, color: COBALT, margin: "0 0 10px" }}>Affiliate programme</p>
          <h1 style={{ fontSize: "clamp(28px,3.4vw,40px)", fontWeight: 600, color: INK, letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 6px" }}>Partner Dashboard</h1>
          <p style={{ fontSize: 14.5, color: GRAPHITE, margin: 0 }}>Welcome back, {partner.name}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: "#fff", border: HAIR, padding: "6px 8px 6px 16px", borderRadius: 9999, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: GRAPHITE }}>Discount Code:</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: INK, letterSpacing: "0.05em", fontFamily: "var(--app-font-mono)" }}>{partner.discountCode}</span>
            <button data-testid="button-copy-affiliate-code" onClick={() => copyToClipboard(partner.discountCode, 'code')} aria-label="Copy discount code" style={{ background: "#FFF6F2", border: "none", cursor: "pointer", color: COBALT, padding: 7, borderRadius: 9999, display: "inline-flex" }}>
              {copiedCode ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Link */}
      <div style={{ ...card, background: "#F2F0EB", padding: "24px", marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, letterSpacing: "-0.01em", marginBottom: 12 }}>Your Unique Tracking Link</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: 9999, border: HAIR, padding: "0 18px", height: 44, display: "flex", alignItems: "center", fontSize: 13.5, fontFamily: "var(--app-font-mono)", color: GRAPHITE, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {trackingUrl}
          </div>
          <button 
            data-testid="button-copy-affiliate-link"
            onClick={() => copyToClipboard(trackingUrl, 'link')}
            style={{ ...primaryBtnStyle, background: copiedLink ? COBALT : INK, height: 44, padding: "0 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
          >
            {copiedLink ? <><CheckCircle2 size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
          </button>
        </div>
      </div>

      <div data-testid="card-affiliate-tier-progress" style={{ ...card, padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...labelStyle, margin: "0 0 6px" }}>
              Current {program?.tierWindowDays}-day tier
            </p>
            <p data-testid="text-affiliate-current-tier" style={{ color: INK, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
              {tierProgress.currentTier?.name ?? "Not placed"} · {tierProgress.currentTier?.commissionRatePercent ?? 0}% payment
            </p>
          </div>
          <p style={{ color: GRAPHITE, fontSize: 13, margin: 0 }}>
            £{tierProgress.rollingSalesGbp.toFixed(2)} settled sales
          </p>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#EDF0F5", overflow: "hidden", marginTop: 16 }}>
          <div style={{ height: "100%", width: `${tierProgress.progressPercent}%`, background: COBALT, borderRadius: 999 }} />
        </div>
        <p style={{ color: GRAPHITE, fontSize: 12.5, margin: "8px 0 0" }}>
          {tierProgress.nextTier
            ? `£${tierProgress.salesToNextTierGbp.toFixed(2)} more to reach ${tierProgress.nextTier.name}`
            : "You have reached the highest active tier."}
        </p>
      </div>

      {/* Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
        <div style={{ ...card, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: GRAPHITE }}>
            <Clock size={15} color={COBALT} aria-hidden="true" /> <span style={labelStyle}>Pending Payments</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 600, color: INK, letterSpacing: "-0.02em", margin: 0 }}>£{totals.pendingGbp.toFixed(2)}</p>
        </div>
        <div style={{ ...card, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: GRAPHITE }}>
            <CheckCircle size={15} color={COBALT} aria-hidden="true" /> <span style={labelStyle}>Approved Payments</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 600, color: INK, letterSpacing: "-0.02em", margin: 0 }}>£{totals.approvedGbp.toFixed(2)}</p>
        </div>
        <div style={{ ...card, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: GRAPHITE }}>
            <Award size={15} color={COBALT} aria-hidden="true" /> <span style={labelStyle}>Payments Made</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 600, color: INK, letterSpacing: "-0.02em", margin: 0 }}>£{totals.paidGbp.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Commissions Table */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: INK, letterSpacing: "-0.01em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} color={COBALT} aria-hidden="true" /> Recent Monetary Payments
          </h3>
          <div style={{ ...card, overflow: "hidden" }}>
            {commissions.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: GRAPHITE }}>
                <FileText size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <p style={{ fontSize: 14 }}>No monetary payments recorded yet.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#F2F0EB", borderBottom: HAIR, textAlign: "left", color: GRAPHITE }}>
                    <th style={{ padding: "12px 16px", fontWeight: 500, fontSize: 12.5 }}>Date</th>
                    <th style={{ padding: "12px 16px", fontWeight: 500, fontSize: 12.5 }}>Sale Amount</th>
                    <th style={{ padding: "12px 16px", fontWeight: 500, fontSize: 12.5 }}>Monetary Payment</th>
                    <th style={{ padding: "12px 16px", fontWeight: 500, fontSize: 12.5 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c: any) => (
                    <tr key={c.id} style={{ borderBottom: HAIR }}>
                      <td style={{ padding: "16px", color: GRAPHITE }}>{new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(c.createdAt))}</td>
                      <td style={{ padding: "16px", color: GRAPHITE }}>£{c.eligibleSalesGbp.toFixed(2)}</td>
                      <td style={{ padding: "16px", fontWeight: 600, color: INK }}>£{c.amountGbp.toFixed(2)} <span style={{ fontSize: 11, color: GRAPHITE, fontWeight: 400 }}>({c.commissionRatePercent}% payment)</span></td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 500,
                          background: c.status === 'paid' ? "#ECFDF5" : c.status === 'approved' ? "#E8F2DE" : c.status === 'rejected' ? "#FEF2F2" : "#F8FAFC",
                          color: c.status === 'paid' ? "#059669" : c.status === 'approved' ? "#3D55A8" : c.status === 'rejected' ? "#DC2626" : GRAPHITE,
                        }}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Free Rewards */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: INK, letterSpacing: "-0.01em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={18} color={COBALT} aria-hidden="true" /> Free Product Rewards
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rewards.length === 0 ? (
              <div style={{ ...card, padding: "32px 20px", textAlign: "center", color: GRAPHITE }}>
                <p style={{ fontSize: 14 }}>Hit your first tier to unlock free product rewards.</p>
              </div>
            ) : (
              rewards.map((r: any) => (
                <div key={r.id} style={{ ...card, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "0 0 4px" }}>£{r.creditValueGbp} Product Credit</h4>
                      <p style={{ fontSize: 12, color: GRAPHITE, margin: 0 }}>Earned from £{r.qualifyingSalesGbp} in sales</p>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: 9999, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                      background: r.status === 'available' ? "#FFF6F2" : "#F2F0EB",
                      color: r.status === 'available' ? COBALT : GRAPHITE
                    }}>
                      {r.status}
                    </span>
                  </div>
                  
                  {r.status === 'available' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button data-testid={`button-claim-affiliate-reward-${r.id}`} style={{ ...primaryBtnStyle, width: "100%", height: 44, cursor: "pointer", marginTop: 8 }}>
                          Claim Reward
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Claim Free Product</DialogTitle>
                          <DialogDescription>
                            Select a product up to £{r.creditValueGbp} in value. Our team will arrange fulfilment using your account details.
                          </DialogDescription>
                        </DialogHeader>
                        <div style={{ padding: "20px 0" }}>
                          <select 
                            data-testid={`select-affiliate-reward-product-${r.id}`}
                            value={selectedProduct} 
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            style={{ ...inputStyle, width: "100%" }}
                          >
                            <option value="">Select a product...</option>
                            {eligibleProducts
                              .filter((p: any) => p.priceGbp <= r.creditValueGbp)
                              .map((p: any) => (
                                <option key={p.slug} value={p.slug}>{p.name} - £{p.priceGbp}</option>
                              ))
                            }
                          </select>
                        </div>
                        <DialogFooter>
                          <button 
                            data-testid={`button-confirm-affiliate-reward-${r.id}`}
                            onClick={() => handleClaim(r.id)}
                            disabled={!selectedProduct || claimMutation.isPending}
                            style={{ ...primaryBtnStyle, height: 44, padding: "0 24px", cursor: !selectedProduct || claimMutation.isPending ? "not-allowed" : "pointer", opacity: !selectedProduct || claimMutation.isPending ? 0.7 : 1 }}
                          >
                            {claimMutation.isPending ? "Claiming..." : "Confirm Selection"}
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {r.status === 'claimed' && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "#F2F0EB", border: HAIR, borderRadius: 10, fontSize: 13, color: GRAPHITE }}>
                      <strong>Claimed:</strong> {r.claimedProductName}
                      <br/>
                      <span style={{ fontSize: 12, color: GRAPHITE }}>Preparing for shipment</span>
                    </div>
                  )}
                  {r.status === 'fulfilled' && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "#F2F0EB", border: HAIR, borderRadius: 10, fontSize: 13, color: GRAPHITE }}>
                      <strong>Fulfilled:</strong> {r.claimedProductName}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  useSEO({
    title: "Affiliate Programme",
    description: "Partner with OmniQure to promote high-purity research peptides through tiered monetary payments and free-product rewards.",
    canonicalPath: "/affiliate",
  });

  const { customer, loadingAuth } = useCustomerAuth();
  const { data: program, isLoading: loadingProgram, error: programError } = useAffiliateProgram();
  const { data: me, isLoading: loadingMe, error: profileError } = useAffiliateMe(customer?.id);
  const applyMutation = useApplyAffiliate();
  const { toast } = useToast();

  const handleApply = (data: any) => {
    applyMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Application submitted successfully" });
      },
      onError: error => {
        toast({
          title: "Application could not be submitted",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (loadingAuth || loadingProgram || (customer && loadingMe)) {
    return <div role="status" aria-label="Loading affiliate programme" style={{ minHeight: "60vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(11,18,32,0.09)", borderTopColor: COBALT, animation: "spin 0.9s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>;
  }

  if (programError || profileError) {
    return (
      <div data-testid="status-affiliate-error" style={{ minHeight: "60vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <h1 style={{ ...h2Style, fontSize: 24 }}>Affiliate programme unavailable</h1>
          <p style={subStyle}>We could not load the programme right now. Please refresh the page or try again shortly.</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AffiliateLanding program={program?.program} />
    </div>;
  }

  if (!me?.partner) {
    return <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AffiliateApplication apply={handleApply} isPending={applyMutation.isPending} />
    </div>;
  }

  if (me.partner.status !== 'approved') {
    return <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AffiliatePending status={me.partner.status} />
    </div>;
  }

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <AffiliateDashboard me={me} program={program?.program} />
    </div>
  );
}
