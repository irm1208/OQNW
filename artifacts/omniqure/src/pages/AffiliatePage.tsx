import { useState, useMemo } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useAffiliateProgram, useAffiliateMe, useApplyAffiliate, useClaimReward } from "@/hooks/useAffiliate";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Gift, Copy, CheckCircle2, ChevronRight, Share2, Award,
  Clock, CheckCircle, XCircle, TrendingUp, FileText
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

function AffiliateLanding({ program }: { program: any }) {
  return (
    <div>
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
              PARTNER PROGRAMME
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 16px",
          }}>
            OmniQure Affiliate Partner,<br />
            <span style={{ color: "#E8A93E" }}>Earn Monetary Payments & Rewards</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto 32px" }}>
            Share OmniQure with your audience. Once approved, you earn up to {program?.tiers?.[program.tiers.length - 1]?.commissionRatePercent}% in monetary payments, give customers {program?.customerDiscountPercent}% off, and unlock product rewards as your sales grow.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/sign-in?returnTo=/affiliate"
              data-testid="link-affiliate-sign-in"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#E8A93E", color: "#0D2565",
                padding: "13px 28px", borderRadius: 12, fontWeight: 800, fontSize: 15,
                textDecoration: "none", boxShadow: "0 4px 16px rgba(232,169,62,0.4)",
              }}
            >
              Sign In to Apply <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: "48px 20px", background: "#F5F8FC", borderBottom: "1px solid #E8EDF5" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ maxWidth: 620, margin: "0 auto 30px", textAlign: "center" }}>
            <p style={{ color: "#1B5CB5", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Simple partner journey
            </p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "#0D2565", margin: "0 0 10px" }}>
              How the affiliate programme works
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#64748B", margin: 0 }}>
              Apply once, wait for admin approval, then share your link and track everything from your partner dashboard.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
            {[
              { number: "01", title: "Apply", text: "Tell us where you reach people and how you plan to promote OmniQure." },
              { number: "02", title: "Get approved", text: "Our team reviews your application. Approved partners receive a tracking link and discount code." },
              { number: "03", title: "Share and earn", text: "Customers get the partner discount. You receive monetary payments on eligible product sales attributed to you." },
              { number: "04", title: "Track and claim", text: "See your monetary payments, sales progress, and product rewards in your dashboard." },
            ].map(step => (
              <div key={step.number} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "20px 18px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 9, background: "#EEF4FF", color: "#1B5CB5", fontSize: 12, fontWeight: 900, marginBottom: 14 }}>
                  {step.number}
                </span>
                <h3 style={{ color: "#0F172A", fontSize: 16, fontWeight: 800, margin: "0 0 7px" }}>{step.title}</h3>
                <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.55, margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "#FFF9ED", border: "1px solid #F5D99A", borderRadius: 12, padding: "14px 16px", color: "#78530E", fontSize: 13, lineHeight: 1.55 }}>
            <strong>Good to know:</strong> monetary payments are calculated from product sales after discounts. Shipping, tax, and payment fees are excluded. Payments are reviewed before approval and paid manually once you reach the payout threshold.
          </div>
        </div>
      </div>

      {/* Program Details */}
      <div style={{ padding: "56px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 8 }}>
            How you move up and receive more
          </h2>
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14, margin: "0 auto 36px", maxWidth: 560 }}>
            You start at Starter. As your reviewed, eligible sales grow within the rolling {program?.tierWindowDays}-day period, you unlock a higher monetary payment rate and product rewards.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {program?.tiers?.map((tier: any, i: number) => (
              <div key={tier.id} style={{
                borderRadius: 14, padding: "20px",
                background: i === 0 ? "#F8FAFF" : "#fff", border: i === 0 ? "2px solid #BFD5F7" : "1px solid #E2E8F0",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <span style={{ color: "#64748B", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Step {i + 1}
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "#0D2565" }}>{tier.name}</span>
                  <span style={{ fontSize: 25, fontWeight: 900, color: "#0D2565", lineHeight: 1 }}>{tier.commissionRatePercent}% payment</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748B", margin: "8px 0 0" }}>
                  {i === 0
                    ? "Your first eligible sale starts you here."
                    : `Reach £${Number(tier.minimumSalesGbp).toLocaleString("en-GB")} in reviewed sales over ${program.tierWindowDays} days.`}
                </p>
                <div style={{ marginTop: 4, padding: "10px 12px", borderRadius: 8, background: "#F1F5F9", color: "#334155", fontSize: 12, lineHeight: 1.45 }}>
                  {i === 0 ? `Receive ${tier.commissionRatePercent}% as a monetary payment on eligible sales.` : `After reaching this level, receive ${tier.commissionRatePercent}% as a monetary payment on your next eligible sales.`}
                </div>
                {tier.rewardCreditGbp > 0 && (
                  <div style={{ background: "#EEF4FF", padding: "10px 12px", borderRadius: 8, fontSize: 12, color: "#1B5CB5", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: 6, lineHeight: 1.4 }}>
                    <Gift size={14} style={{ flexShrink: 0, marginTop: 1 }} /> Choose one eligible product up to £{tier.rewardCreditGbp}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: "#F1F5F9", borderRadius: 16, padding: "22px 24px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#0F172A", fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>A quick example</h3>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.55, margin: "0 0 18px" }}>
              If a customer places a £200 eligible product order, your monetary payment would be: {program?.tiers?.map((tier: any) => `${tier.name} £${(200 * Number(tier.commissionRatePercent) / 100).toFixed(2)}`).join(" · ")}.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Tracking Window</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>{program?.attributionWindowDays} Days</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Customer Discount</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>{program?.customerDiscountPercent}% Off</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Payout Threshold</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>£{program?.payoutThresholdGbp} <span style={{ fontSize: 11, fontWeight: 500, color: "#64748B" }}>paid monthly</span></p>
            </div>
            </div>
            <p style={{ color: "#64748B", fontSize: 12, lineHeight: 1.5, margin: "18px 0 0", paddingTop: 14, borderTop: "1px solid #D8E0EB" }}>
              Eligible sales mean the product total after discounts. Shipping, tax, and payment fees do not count.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AffiliateApplication({ apply, isPending }: { apply: (data: any) => void; isPending: boolean }) {
  const [form, setForm] = useState({ channelUrl: "", audienceDescription: "", promotionPlan: "" });

  return (
    <div style={{ maxWidth: 600, margin: "64px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0D2565", marginBottom: 8 }}>Apply to be an Affiliate Partner</h2>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>Tell us a bit about your audience and how you plan to promote OmniQure.</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        apply(form);
      }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Primary Channel URL</label>
          <input
            data-testid="input-affiliate-channel"
            type="url" required
            placeholder="https://youtube.com/c/yourchannel"
            value={form.channelUrl} onChange={e => setForm({...form, channelUrl: e.target.value})}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 14 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Audience Description</label>
          <textarea
            data-testid="input-affiliate-audience"
            required rows={3}
            placeholder="Who is your audience? (e.g. biohackers, fitness enthusiasts, researchers)"
            value={form.audienceDescription} onChange={e => setForm({...form, audienceDescription: e.target.value})}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 14, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Promotion Plan</label>
          <textarea
            data-testid="input-affiliate-promotion-plan"
            required rows={4}
            placeholder="How do you plan to promote OmniQure products?"
            value={form.promotionPlan} onChange={e => setForm({...form, promotionPlan: e.target.value})}
            style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 14, resize: "vertical" }}
          />
        </div>

        <button
          data-testid="button-submit-affiliate-application"
          type="submit"
          disabled={isPending}
          style={{
            padding: "12px", borderRadius: 8, background: "#1B5CB5", color: "#fff",
            fontSize: 15, fontWeight: 700, border: "none", cursor: isPending ? "not-allowed" : "pointer",
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
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "40px 20px", textAlign: "center", background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0" }}>
      {status === 'pending' ? (
        <>
          <Clock size={48} color="#94A3B8" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Application Under Review</h2>
           <p style={{ fontSize: 15, color: "#64748B" }}>We've received your application and our team is currently reviewing it. Your tracking link, discount code, payments, and rewards become available after admin approval.</p>
        </>
      ) : (
        <>
          <XCircle size={48} color="#EF4444" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Application Declined</h2>
          <p style={{ fontSize: 15, color: "#64748B" }}>Your affiliate access is not active. Tracking links, discount codes, payments, and rewards are available only after admin approval.</p>
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
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0D2565", marginBottom: 4 }}>Partner Dashboard</h1>
          <p style={{ fontSize: 14, color: "#64748B" }}>Welcome back, {partner.name}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: "#F1F5F9", padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>Discount Code:</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", letterSpacing: "0.05em" }}>{partner.discountCode}</span>
            <button data-testid="button-copy-affiliate-code" onClick={() => copyToClipboard(partner.discountCode, 'code')} style={{ background: "none", border: "none", cursor: "pointer", color: "#1B5CB5", padding: 4 }}>
              {copiedCode ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Link */}
      <div style={{ background: "linear-gradient(135deg, #EEF4FF, #F5F8FF)", borderRadius: 16, padding: "24px", marginBottom: 32, border: "1px solid #BFDBFE" }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D2565", marginBottom: 12 }}>Your Unique Tracking Link</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, border: "1px solid #CBD5E1", padding: "12px 16px", fontSize: 14, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {trackingUrl}
          </div>
          <button 
            data-testid="button-copy-affiliate-link"
            onClick={() => copyToClipboard(trackingUrl, 'link')}
            style={{ padding: "0 24px", borderRadius: 8, background: copiedLink ? "#059669" : "#1B5CB5", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}
          >
            {copiedLink ? <><CheckCircle2 size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
          </button>
        </div>
      </div>

      <div data-testid="card-affiliate-tier-progress" style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", marginBottom: 24, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#64748B", fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 5px" }}>
              Current {program?.tierWindowDays}-day tier
            </p>
            <p data-testid="text-affiliate-current-tier" style={{ color: "#0D2565", fontSize: 22, fontWeight: 900, margin: 0 }}>
              {tierProgress.currentTier?.name ?? "Not placed"} · {tierProgress.currentTier?.commissionRatePercent ?? 0}% payment
            </p>
          </div>
          <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
            £{tierProgress.rollingSalesGbp.toFixed(2)} settled sales
          </p>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#E8EDF5", overflow: "hidden", marginTop: 16 }}>
          <div style={{ height: "100%", width: `${tierProgress.progressPercent}%`, background: "linear-gradient(90deg, #1240A0, #1E68CC)", borderRadius: 999 }} />
        </div>
        <p style={{ color: "#64748B", fontSize: 12, margin: "8px 0 0" }}>
          {tierProgress.nextTier
            ? `£${tierProgress.salesToNextTierGbp.toFixed(2)} more to reach ${tierProgress.nextTier.name}`
            : "You have reached the highest active tier."}
        </p>
      </div>

      {/* Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#64748B" }}>
            <Clock size={16} /> <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending Payments</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0 }}>£{totals.pendingGbp.toFixed(2)}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#059669" }}>
            <CheckCircle size={16} /> <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Approved Payments</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0 }}>£{totals.approvedGbp.toFixed(2)}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#1B5CB5" }}>
            <Award size={16} /> <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Payments Made</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0 }}>£{totals.paidGbp.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Commissions Table */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={20} color="#1B5CB5" /> Recent Monetary Payments
          </h3>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            {commissions.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748B" }}>
                <FileText size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <p style={{ fontSize: 14 }}>No monetary payments recorded yet.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textAlign: "left", color: "#475569" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Date</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Sale Amount</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Monetary Payment</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c: any) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px", color: "#334155" }}>{new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(c.createdAt))}</td>
                      <td style={{ padding: "16px", color: "#334155" }}>£{c.eligibleSalesGbp.toFixed(2)}</td>
                      <td style={{ padding: "16px", fontWeight: 600, color: "#0F172A" }}>£{c.amountGbp.toFixed(2)} <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400 }}>({c.commissionRatePercent}% payment)</span></td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: c.status === 'paid' ? "#ECFDF5" : c.status === 'approved' ? "#EFF6FF" : c.status === 'rejected' ? "#FEF2F2" : "#F8FAFC",
                          color: c.status === 'paid' ? "#059669" : c.status === 'approved' ? "#1D4ED8" : c.status === 'rejected' ? "#DC2626" : "#64748B",
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
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={20} color="#E8A93E" /> Free Product Rewards
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rewards.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "32px 20px", textAlign: "center", color: "#64748B" }}>
                <p style={{ fontSize: 14 }}>Hit your first tier to unlock free product rewards.</p>
              </div>
            ) : (
              rewards.map((r: any) => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>£{r.creditValueGbp} Product Credit</h4>
                      <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Earned from £{r.qualifyingSalesGbp} in sales</p>
                    </div>
                    <span style={{
                      padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                      background: r.status === 'available' ? "#ECFDF5" : "#F1F5F9",
                      color: r.status === 'available' ? "#059669" : "#64748B"
                    }}>
                      {r.status}
                    </span>
                  </div>
                  
                  {r.status === 'available' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button data-testid={`button-claim-affiliate-reward-${r.id}`} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#1B5CB5", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 8 }}>
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
                            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 14 }}
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
                            style={{ padding: "10px 20px", borderRadius: 8, background: "#1B5CB5", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: !selectedProduct || claimMutation.isPending ? "not-allowed" : "pointer", opacity: !selectedProduct || claimMutation.isPending ? 0.7 : 1 }}
                          >
                            {claimMutation.isPending ? "Claiming..." : "Confirm Selection"}
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {r.status === 'claimed' && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, fontSize: 13, color: "#334155" }}>
                      <strong>Claimed:</strong> {r.claimedProductName}
                      <br/>
                      <span style={{ fontSize: 12, color: "#64748B" }}>Preparing for shipment</span>
                    </div>
                  )}
                  {r.status === 'fulfilled' && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, fontSize: 13, color: "#334155" }}>
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
  const { data: me, isLoading: loadingMe, error: profileError } = useAffiliateMe(!!customer);
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
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#1B5CB5", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>;
  }

  if (programError || profileError) {
    return (
      <div data-testid="status-affiliate-error" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <h1 style={{ color: "#0D2565", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Affiliate programme unavailable</h1>
          <p style={{ color: "#64748B", lineHeight: 1.6 }}>We could not load the programme right now. Please refresh the page or try again shortly.</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      <AffiliateLanding program={program?.program} />
    </div>;
  }

  if (!me?.partner) {
    return <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      <AffiliateApplication apply={handleApply} isPending={applyMutation.isPending} />
    </div>;
  }

  if (me.partner.status !== 'approved') {
    return <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      <AffiliatePending status={me.partner.status} />
    </div>;
  }

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      <AffiliateDashboard me={me} program={program?.program} />
    </div>
  );
}
