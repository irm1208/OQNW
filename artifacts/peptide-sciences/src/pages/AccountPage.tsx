import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  User, Package, Settings, LogOut, ChevronRight,
  ShoppingBag, Clock, Shield, Eye, EyeOff, CheckCircle2,
  AlertCircle, Truck, Zap, FlaskConical, Heart, RotateCcw, X,
  RefreshCw, Users, Copy, CheckCheck, Calendar, PauseCircle, PlayCircle,
  Repeat, Trash2, Award, Gift, TrendingUp,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

type OrderItem = {
  productId: number;
  productName: string;
  productCategory: string;
  quantity: number;
  priceGbp: number;
};

type SubItem = {
  productId: number;
  productName: string;
  quantity: number;
  priceGbp: number;
};

type Subscription = {
  id: number;
  items: SubItem[];
  intervalDays: number;
  nextRenewalAt: string;
  discountPct: number;
  status: string;
  subtotal: number;
  discountedTotal: number;
  createdAt: string;
};

type ReferralInfo = {
  referralCode: string;
  referralCount: number;
};

type AccountOrder = {
  orderNumber: string;
  status: string;
  totalGbp: number;
  shippingMethod: string | null;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
};

type ReturnInfo = {
  id: number;
  orderId: number;
  orderNumber: string;
  reason: string;
  status: string;
  refundAmountGbp: number | null;
  adminNotes: string | null;
  createdAt: string;
};

const RETURN_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  requested: { label: "Return Requested", bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  approved:  { label: "Return Approved",  bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  rejected:  { label: "Return Rejected",  bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  refunded:  { label: "Refunded",         bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
};

type LoyaltyTx = {
  id: number;
  type: "earned" | "redeemed" | "expired" | "adjusted";
  points: number;
  description: string;
  createdAt: string;
};

type LoyaltyData = {
  balance: number;
  lifetimeEarned: number;
  tier: string;
  tierColor: string;
  tierEmoji: string;
  nextTier: string | null;
  pointsToNextTier: number | null;
  progressPct: number;
  gbpValue: number;
  transactions: LoyaltyTx[];
};

type AccountProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  totalOrders: number;
  totalSpendGbp: number;
  memberSince: string;
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  pending:    { label: "Pending",    bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  processing: { label: "Processing", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  shipped:    { label: "Shipped",    bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  delivered:  { label: "Delivered",  bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  cancelled:  { label: "Cancelled",  bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  refunded:   { label: "Refunded",   bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" };
  return (
    <span
      className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function AccountPage() {
  useSEO({ title: "My Account", description: "Manage your OmniQure account, view orders, and track your research peptide purchases.", canonicalPath: "/account" });
  const [, navigate] = useLocation();
  const { customer, loadingAuth, signOut } = useCustomerAuth();
  const { formatPrice } = useCurrency();
  const { wishlistIds, toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "wishlist" | "subscriptions" | "referral" | "loyalty">("orders");

  // Orders
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Profile from API
  const [profile, setProfile] = useState<AccountProfile | null>(null);

  // Profile edit form
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  // Returns
  const [returns, setReturns] = useState<Map<string, ReturnInfo>>(new Map());
  const [returnModal, setReturnModal] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [updatingSub, setUpdatingSub] = useState<number | null>(null);

  // Referral
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  // Loyalty
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);

  // Reorder feedback
  const [reorderedKey, setReorderedKey] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loadingAuth && !customer) {
      navigate("/sign-in");
    }
  }, [loadingAuth, customer, navigate]);

  // Load full profile + orders
  useEffect(() => {
    if (!customer) return;
    fetch(apiUrl("account/me"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<AccountProfile>) : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setProfileForm({ firstName: data.firstName, lastName: data.lastName });
        }
      })
      .catch(() => {});

    fetch(apiUrl("account/orders"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<AccountOrder[]>) : []))
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));

    fetch(apiUrl("returns"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<{ returns: ReturnInfo[] }>) : { returns: [] }))
      .then(({ returns: data }) => {
        const map = new Map<string, ReturnInfo>();
        for (const r of data) map.set(r.orderNumber, r);
        setReturns(map);
      })
      .catch(() => {});

    fetch(apiUrl("subscriptions"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<Subscription[]>) : []))
      .then((data) => setSubscriptions(data))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoadingSubs(false));

    fetch(apiUrl("account/referral"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<ReferralInfo>) : null))
      .then((data) => setReferral(data))
      .catch(() => {});

    fetch(apiUrl("loyalty/balance"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<LoyaltyData>) : null))
      .then((data) => { if (data) setLoyalty(data); })
      .catch(() => {})
      .finally(() => setLoadingLoyalty(false));
  }, [customer]);

  async function handleRequestReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!returnModal) return;
    setReturnError(null);
    setSubmittingReturn(true);
    try {
      const res = await fetch(apiUrl("returns"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderNumber: returnModal, reason: returnReason }),
      });
      const data = await res.json() as ReturnInfo & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to submit return");
      setReturns((prev) => new Map(prev).set(data.orderNumber, data));
      setReturnModal(null);
      setReturnReason("");
    } catch (err) {
      setReturnError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmittingReturn(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) return;
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const res = await fetch(apiUrl("account/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName: profileForm.firstName, lastName: profileForm.lastName }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to update profile");
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (pwForm.next.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    setSavingPw(true);
    try {
      const res = await fetch(apiUrl("account/password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Failed to change password");
      }
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Change failed");
    } finally {
      setSavingPw(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const handleReorder = useCallback((order: AccountOrder) => {
    for (const item of order.items) {
      const product = products.find((p) => p.id === String(item.productId));
      if (product) {
        addToCart(product, item.quantity);
      }
    }
    setReorderedKey(order.orderNumber);
    setTimeout(() => setReorderedKey(null), 2500);
  }, [products, addToCart]);

  async function handleSubAction(subId: number, action: string) {
    setUpdatingSub(subId);
    try {
      const res = await fetch(apiUrl(`subscriptions/${subId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const updated = await res.json() as Subscription;
        setSubscriptions((prev) => prev.map((s) => (s.id === subId ? updated : s)));
      }
    } catch {}
    setUpdatingSub(null);
  }

  function copyReferralLink() {
    if (!referral) return;
    const url = `${window.location.origin}/sign-up?ref=${referral.referralCode}`;
    void navigator.clipboard.writeText(url);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  }

  function intervalLabel(days: number): string {
    if (days === 7) return "Weekly";
    if (days === 14) return "Fortnightly";
    if (days === 30) return "Monthly";
    if (days === 60) return "Every 2 months";
    if (days === 90) return "Every 3 months";
    return `Every ${days} days`;
  }

  if (loadingAuth || !customer) {
    return (
      <div style={{ fontFamily: "'Arimo', Arial, sans-serif", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <FlaskConical size={28} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <p style={{ fontSize: "14px" }}>Loading your account…</p>
        </div>
      </div>
    );
  }

  // Return request modal
  const ReturnModal = returnModal ? (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) { setReturnModal(null); setReturnReason(""); setReturnError(null); } }}
    >
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: "480px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <RotateCcw size={18} style={{ color: "#1B5CB5" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Request a Return</h3>
          </div>
          <button
            onClick={() => { setReturnModal(null); setReturnReason(""); setReturnError(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={(e) => void handleRequestReturn(e)} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, marginBottom: "2px" }}>ORDER</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: 0 }}>{returnModal}</p>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
              Reason for return <span style={{ color: "#94A3B8", fontWeight: 400 }}>(required)</span>
            </label>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Please describe why you'd like to return this order…"
              rows={4}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "10px",
                border: "1.5px solid #E2E8F0", fontSize: "14px", color: "#0F172A",
                resize: "vertical", outline: "none", boxSizing: "border-box",
                fontFamily: "'Arimo', Arial, sans-serif",
              }}
            />
            <p style={{ fontSize: "11.5px", color: "#94A3B8", margin: "4px 0 0" }}>Minimum 10 characters</p>
          </div>
          {returnError && (
            <div style={{ padding: "10px 12px", borderRadius: "8px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
              <p style={{ fontSize: "13px", color: "#B91C1C", margin: 0 }}>{returnError}</p>
            </div>
          )}
          <div style={{ padding: "12px 14px", borderRadius: "8px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <p style={{ fontSize: "12px", color: "#92400E", margin: 0, lineHeight: 1.5 }}>
              Our team will review your request within 2–3 business days. You'll receive an email once a decision has been made.
            </p>
          </div>
          <button
            type="submit"
            disabled={submittingReturn || returnReason.trim().length < 10}
            style={{
              height: "44px", borderRadius: "10px", border: "none", cursor: submittingReturn || returnReason.trim().length < 10 ? "not-allowed" : "pointer",
              background: submittingReturn || returnReason.trim().length < 10 ? "#CBD5E1" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
              color: "#fff", fontSize: "14px", fontWeight: 700, transition: "opacity 0.15s",
            }}
          >
            {submittingReturn ? "Submitting…" : "Submit Return Request"}
          </button>
        </form>
      </div>
    </div>
  ) : null;

  const displayProfile = profile ?? { ...customer, totalOrders: 0, totalSpendGbp: 0, memberSince: new Date().toISOString() };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "70vh" }}>

      {/* Hero banner */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)", padding: "32px 0" }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <User size={24} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>Research account</p>
                <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>
                  {displayProfile.firstName} {displayProfile.lastName}
                </h1>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>{displayProfile.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="account-hero-stats">
              {[
                { label: "Orders", value: String(displayProfile.totalOrders), icon: <Package size={16} /> },
                { label: "Total spent", value: `£${displayProfile.totalSpendGbp.toFixed(2)}`, icon: <ShoppingBag size={16} /> },
                { label: "Member since", value: formatMemberSince(displayProfile.memberSince), icon: <Clock size={16} /> },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "rgba(255,255,255,0.55)", marginBottom: "3px" }}>
                    {stat.icon}
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
                  </div>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6" style={{ alignItems: "flex-start" }}>

          {/* Sidebar */}
          <div className="account-sidebar">
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
              {[
                { key: "orders",        label: "My Orders",       icon: <Package size={16} /> },
                { key: "subscriptions", label: "Subscriptions",   icon: <RefreshCw size={16} /> },
                { key: "referral",      label: "Refer a Friend",  icon: <Users size={16} /> },
                { key: "loyalty",       label: "Loyalty Rewards", icon: <Award size={16} /> },
                { key: "wishlist",      label: "Wishlist",        icon: <Heart size={16} /> },
                { key: "profile",       label: "Profile Settings",icon: <Settings size={16} /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as "orders" | "profile" | "wishlist" | "subscriptions" | "referral" | "loyalty")}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    width: "100%", padding: "13px 16px", border: "none",
                    backgroundColor: activeTab === item.key ? "#EEF4FF" : "#fff",
                    color: activeTab === item.key ? "#1240A0" : "#475569",
                    fontSize: "14px", fontWeight: activeTab === item.key ? 700 : 500,
                    cursor: "pointer", textAlign: "left",
                    borderLeft: activeTab === item.key ? "3px solid #1B5CB5" : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid #F1F5F9" }}>
                <Link
                  href="/track-order"
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", color: "#475569", textDecoration: "none", fontSize: "14px", fontWeight: 500, borderLeft: "3px solid transparent" }}
                >
                  <Truck size={16} />
                  Track Order
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    width: "100%", padding: "13px 16px", border: "none",
                    backgroundColor: "#fff", color: "#DC2626",
                    fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    textAlign: "left", borderLeft: "3px solid transparent",
                  }}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>

            {/* RUO notice */}
            <div style={{ marginTop: "16px", padding: "12px 14px", borderRadius: "12px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <p style={{ fontSize: "11px", color: "#92400E", lineHeight: 1.6, margin: 0 }}>
                <strong>Research Use Only.</strong> OmniQure products are for qualified researchers only. Not for human or veterinary use.
              </p>
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── ORDERS TAB ── */}
            {activeTab === "orders" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Order History</h2>
                  <Link href="/all-peptides" style={{ fontSize: "13px", color: "#1B5CB5", fontWeight: 600, textDecoration: "none" }}>
                    Shop again →
                  </Link>
                </div>

                {loadingOrders ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
                    <Package size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                    <p style={{ fontSize: "14px" }}>Loading orders…</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", padding: "60px 24px", textAlign: "center" }}>
                    <ShoppingBag size={36} style={{ margin: "0 auto 16px", color: "#CBD5E1" }} />
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No orders yet</p>
                    <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>
                      When you place an order, it will appear here.
                    </p>
                    <Link
                      href="/all-peptides"
                      style={{
                        display: "inline-block", padding: "10px 24px", borderRadius: "10px",
                        background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
                        color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none",
                      }}
                    >
                      Browse peptides
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {orders.map((order) => {
                      const isExpanded = expandedOrder === order.orderNumber;
                      const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <div
                          key={order.orderNumber}
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #E8EDF5",
                            boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                            overflow: "hidden",
                          }}
                        >
                          {/* Order header row */}
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.orderNumber)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: "12px",
                              padding: "16px 20px", border: "none", backgroundColor: "transparent",
                              cursor: "pointer", textAlign: "left",
                            }}
                          >
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                              <div>
                                <p style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", marginBottom: "1px" }}>
                                  {order.orderNumber}
                                </p>
                                <p style={{ fontSize: "12px", color: "#94A3B8" }}>{formatDate(order.createdAt)}</p>
                              </div>
                              <StatusBadge status={order.status} />
                              <p style={{ fontSize: "13px", color: "#64748B" }}>
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                              <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
                                {formatPrice(order.totalGbp)}
                              </p>
                              <ChevronRight
                                size={16}
                                style={{
                                  color: "#94A3B8",
                                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                }}
                              />
                            </div>
                          </button>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div style={{ borderTop: "1px solid #F1F5F9", padding: "16px 20px" }}>

                              {/* Status timeline */}
                              {(() => {
                                const isCancelled = order.status === "cancelled" || order.status === "refunded";
                                const steps = [
                                  { key: "pending",    label: "Order Placed",  icon: <ShoppingBag size={12} /> },
                                  { key: "processing", label: "Processing",    icon: <Clock size={12} /> },
                                  { key: "shipped",    label: "Shipped",       icon: <Truck size={12} /> },
                                  { key: "delivered",  label: "Delivered",     icon: <CheckCircle2 size={12} /> },
                                ];
                                const order_idx = ["pending","processing","shipped","delivered"].indexOf(order.status);
                                return (
                                  <div style={{ marginBottom: "20px", padding: "14px 16px", borderRadius: "12px", backgroundColor: isCancelled ? "#FEF2F2" : "#F8FAFC", border: `1px solid ${isCancelled ? "#FECACA" : "#E8EDF5"}` }}>
                                    {isCancelled ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#FEF2F2", border: "2px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                          <X size={13} style={{ color: "#DC2626" }} />
                                        </div>
                                        <div>
                                          <p style={{ fontSize: "13px", fontWeight: 700, color: "#B91C1C", margin: 0 }}>
                                            {order.status === "refunded" ? "Order Refunded" : "Order Cancelled"}
                                          </p>
                                          <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>This order is no longer active</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ position: "relative" }}>
                                        {/* connector line */}
                                        <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", height: "2px", backgroundColor: "#E2E8F0", zIndex: 0 }} />
                                        <div style={{
                                          position: "absolute", top: "14px", left: "14px", height: "2px", zIndex: 1,
                                          backgroundColor: "#1B5CB5",
                                          width: order_idx <= 0 ? "0%" : order_idx === 1 ? "33%" : order_idx === 2 ? "66%" : "100%",
                                          transition: "width 0.4s ease",
                                        }} />
                                        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                                          {steps.map((step, i) => {
                                            const done    = i < order_idx;
                                            const current = i === order_idx;
                                            const future  = i > order_idx;
                                            return (
                                              <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                                                <div style={{
                                                  width: "28px", height: "28px", borderRadius: "50%",
                                                  border: `2px solid ${done ? "#1B5CB5" : current ? "#1B5CB5" : "#CBD5E1"}`,
                                                  backgroundColor: done ? "#1B5CB5" : current ? "#EEF4FF" : "#fff",
                                                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                  boxShadow: current ? "0 0 0 3px rgba(27,92,181,0.15)" : "none",
                                                  transition: "all 0.2s",
                                                }}>
                                                  {done
                                                    ? <CheckCircle2 size={13} style={{ color: "#fff" }} />
                                                    : <span style={{ color: current ? "#1B5CB5" : "#CBD5E1" }}>{step.icon}</span>
                                                  }
                                                </div>
                                                <p style={{
                                                  fontSize: "10px", fontWeight: current ? 800 : done ? 600 : 500, margin: 0,
                                                  color: done ? "#1B5CB5" : current ? "#0D2565" : "#94A3B8",
                                                  textAlign: "center", whiteSpace: "nowrap",
                                                }}>
                                                  {step.label}
                                                </p>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Items list */}
                              <div style={{ marginBottom: "14px" }}>
                                {order.items.map((item, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex", alignItems: "center", justifyContent: "space-between",
                                      padding: "8px 0",
                                      borderBottom: i < order.items.length - 1 ? "1px solid #F8FAFC" : "none",
                                    }}
                                  >
                                    <div>
                                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{item.productName}</p>
                                      <p style={{ fontSize: "11px", color: "#94A3B8" }}>{item.productCategory} · Qty {item.quantity}</p>
                                    </div>
                                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                                      £{(item.priceGbp * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Return status badge */}
                              {(() => {
                                const ret = returns.get(order.orderNumber);
                                if (!ret) return null;
                                const rcfg = RETURN_STATUS_CONFIG[ret.status] ?? { label: ret.status, bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" };
                                return (
                                  <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "8px", backgroundColor: rcfg.bg, border: `1px solid ${rcfg.border}`, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                    <RotateCcw size={14} style={{ color: rcfg.color, marginTop: "2px", flexShrink: 0 }} />
                                    <div>
                                      <p style={{ fontSize: "12px", fontWeight: 700, color: rcfg.color, margin: "0 0 2px" }}>{rcfg.label}</p>
                                      {ret.adminNotes && (
                                        <p style={{ fontSize: "12px", color: rcfg.color, margin: 0, opacity: 0.85 }}>{ret.adminNotes}</p>
                                      )}
                                      {ret.refundAmountGbp != null && ret.status === "refunded" && (
                                        <p style={{ fontSize: "12px", color: rcfg.color, margin: "2px 0 0", fontWeight: 600 }}>Refund: £{ret.refundAmountGbp.toFixed(2)}</p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Actions */}
                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <Link
                                  href={`/track-order?number=${encodeURIComponent(order.orderNumber)}`}
                                  style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    padding: "8px 16px", borderRadius: "8px",
                                    background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
                                    color: "#fff", fontWeight: 600, fontSize: "13px", textDecoration: "none",
                                  }}
                                >
                                  <Zap size={13} />
                                  Track Order
                                </Link>
                                <button
                                  onClick={() => handleReorder(order)}
                                  style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    padding: "8px 14px", borderRadius: "8px",
                                    backgroundColor: reorderedKey === order.orderNumber ? "#F0FDF4" : "#F0F5FF",
                                    border: reorderedKey === order.orderNumber ? "1px solid #BBF7D0" : "1px solid #C7D7F7",
                                    color: reorderedKey === order.orderNumber ? "#15803D" : "#1240A0",
                                    fontWeight: 600, fontSize: "13px", cursor: "pointer",
                                  }}
                                >
                                  {reorderedKey === order.orderNumber
                                    ? <><CheckCheck size={13} /> Added to cart!</>
                                    : <><Repeat size={13} /> Reorder</>
                                  }
                                </button>
                                {order.shippingMethod && (
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                    <Truck size={13} style={{ color: "#64748B" }} />
                                    <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>{order.shippingMethod}</span>
                                  </div>
                                )}
                                {order.trackingNumber && (
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                                    <Shield size={13} style={{ color: "#16A34A" }} />
                                    <span style={{ fontSize: "13px", color: "#15803D", fontWeight: 600 }}>Tracking: {order.trackingNumber}</span>
                                  </div>
                                )}
                                {/* Request Return button — only for shipped/delivered with no active return */}
                                {["shipped", "delivered"].includes(order.status) && (() => {
                                  const ret = returns.get(order.orderNumber);
                                  const hasActiveReturn = ret && ["requested", "approved"].includes(ret.status);
                                  if (hasActiveReturn) return null;
                                  const isRefunded = order.status === "refunded" || ret?.status === "refunded";
                                  if (isRefunded) return null;
                                  return (
                                    <button
                                      onClick={() => { setReturnModal(order.orderNumber); setReturnReason(""); setReturnError(null); }}
                                      style={{
                                        display: "inline-flex", alignItems: "center", gap: "6px",
                                        padding: "8px 14px", borderRadius: "8px",
                                        backgroundColor: "#FFF7ED", border: "1px solid #FED7AA",
                                        color: "#C2410C", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                                      }}
                                    >
                                      <RotateCcw size={13} />
                                      Request Return
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SUBSCRIPTIONS TAB ── */}
            {activeTab === "subscriptions" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>My Subscriptions</h2>
                  <span style={{ fontSize: "12px", color: "#64748B", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "4px 10px", borderRadius: "20px", fontWeight: 600 }}>5% off every renewal</span>
                </div>

                {loadingSubs ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
                    <RefreshCw size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                    <p style={{ fontSize: "14px" }}>Loading subscriptions…</p>
                  </div>
                ) : subscriptions.filter((s) => s.status !== "cancelled").length === 0 ? (
                  <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", padding: "60px 24px", textAlign: "center" }}>
                    <RefreshCw size={36} style={{ margin: "0 auto 16px", color: "#CBD5E1" }} />
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No active subscriptions</p>
                    <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>
                      Subscribe to your favourite peptides at checkout and save 5% on every recurring order.
                    </p>
                    <Link href="/all-peptides" style={{ display: "inline-block", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                      Browse peptides
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {subscriptions.filter((s) => s.status !== "cancelled").map((sub) => (
                      <div key={sub.id} style={{ backgroundColor: "#fff", borderRadius: "16px", border: `1px solid ${sub.status === "paused" ? "#FDE68A" : "#E8EDF5"}`, boxShadow: "0 2px 12px rgba(15,23,42,0.04)", overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>{intervalLabel(sub.intervalDays)} Subscription</span>
                                <span style={{
                                  fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                                  backgroundColor: sub.status === "paused" ? "#FFFBEB" : "#F0FDF4",
                                  color: sub.status === "paused" ? "#B45309" : "#15803D",
                                  border: `1px solid ${sub.status === "paused" ? "#FDE68A" : "#BBF7D0"}`,
                                }}>
                                  {sub.status === "paused" ? "Paused" : "Active"}
                                </span>
                              </div>
                              <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>
                                <Calendar size={11} style={{ display: "inline", marginRight: "4px" }} />
                                Next renewal: {formatDate(sub.nextRenewalAt)}
                              </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px" }}>£{sub.discountedTotal.toFixed(2)}</p>
                              <p style={{ fontSize: "11px", color: "#16A34A", margin: 0 }}>{sub.discountPct}% off applied</p>
                            </div>
                          </div>
                          <div style={{ marginBottom: "14px", borderTop: "1px solid #F8FAFC", paddingTop: "10px" }}>
                            {sub.items.map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                                <span style={{ fontSize: "13px", color: "#0F172A" }}>{item.productName} × {item.quantity}</span>
                                <span style={{ fontSize: "13px", color: "#64748B" }}>£{(item.priceGbp * item.quantity * (1 - sub.discountPct / 100)).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {sub.status === "active" ? (
                              <button
                                onClick={() => void handleSubAction(sub.id, "pause")}
                                disabled={updatingSub === sub.id}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                              >
                                <PauseCircle size={13} />
                                {updatingSub === sub.id ? "…" : "Pause"}
                              </button>
                            ) : (
                              <button
                                onClick={() => void handleSubAction(sub.id, "resume")}
                                disabled={updatingSub === sub.id}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803D", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                              >
                                <PlayCircle size={13} />
                                {updatingSub === sub.id ? "…" : "Resume"}
                              </button>
                            )}
                            <button
                              onClick={() => void handleSubAction(sub.id, "cancel")}
                              disabled={updatingSub === sub.id}
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                            >
                              <Trash2 size={13} />
                              {updatingSub === sub.id ? "…" : "Cancel"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── REFERRAL TAB ── */}
            {activeTab === "referral" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Refer a Friend</h2>

                {/* How it works */}
                <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>How it works</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {[
                      { step: "1", title: "Share your link", desc: "Send your unique referral link to colleagues and fellow researchers." },
                      { step: "2", title: "They sign up & order", desc: "When a friend registers using your link and places their first order." },
                      { step: "3", title: "You earn £10 credit", desc: "A £10 discount code is sent to you automatically — no cap on referrals." },
                    ].map((s) => (
                      <div key={s.step} style={{ textAlign: "center", padding: "16px 12px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: "14px", fontWeight: 800, color: "#fff" }}>
                          {s.step}
                        </div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>{s.title}</p>
                        <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral link */}
                {referral && (
                  <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>Your referral link</h3>
                    <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>Share this link — when a friend signs up through it and orders, you'll receive £10 credit.</p>

                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ flex: 1, height: "44px", padding: "0 14px", borderRadius: "10px", border: "1.5px solid #E2E8F0", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", overflow: "hidden" }}>
                        <span style={{ fontSize: "13px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {`${window.location.origin}/sign-up?ref=${referral.referralCode}`}
                        </span>
                      </div>
                      <button
                        onClick={copyReferralLink}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          padding: "0 18px", height: "44px", borderRadius: "10px", border: "none",
                          background: referralCopied ? "linear-gradient(90deg, #16A34A, #15803D)" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                          color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
                          transition: "background 0.2s",
                        }}
                      >
                        {referralCopied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy link</>}
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ flex: 1, padding: "14px 16px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5", textAlign: "center" }}>
                        <p style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px" }}>{referral.referralCount}</p>
                        <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Friends referred</p>
                      </div>
                      <div style={{ flex: 1, padding: "14px 16px", borderRadius: "12px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", textAlign: "center" }}>
                        <p style={{ fontSize: "22px", fontWeight: 800, color: "#15803D", margin: "0 0 2px" }}>£{(referral.referralCount * 10).toFixed(2)}</p>
                        <p style={{ fontSize: "12px", color: "#16A34A", margin: 0 }}>Total credits earned</p>
                      </div>
                      <div style={{ flex: 1, padding: "14px 16px", borderRadius: "12px", backgroundColor: "#F0F5FF", border: "1px solid #C7D7F7", textAlign: "center" }}>
                        <p style={{ fontSize: "13px", fontWeight: 800, color: "#1240A0", margin: "0 0 2px", fontFamily: "monospace", letterSpacing: "0.05em" }}>{referral.referralCode}</p>
                        <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Your code</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── WISHLIST TAB ── */}
            {activeTab === "wishlist" && (() => {
              const wishlistProducts = products.filter((p) => inWishlist(parseInt(String(p.id), 10)));
              return (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Wishlist</h2>
                    <span style={{ fontSize: "13px", color: "#64748B" }}>{wishlistIds.size} saved item{wishlistIds.size !== 1 ? "s" : ""}</span>
                  </div>
                  {wishlistProducts.length === 0 ? (
                    <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", padding: "60px 24px", textAlign: "center" }}>
                      <Heart size={36} style={{ margin: "0 auto 16px", color: "#CBD5E1" }} />
                      <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No saved items yet</p>
                      <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>
                        Hit the heart icon on any product to save it here.
                      </p>
                      <Link
                        href="/all-peptides"
                        style={{
                          display: "inline-block", padding: "10px 24px", borderRadius: "10px",
                          background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
                          color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none",
                        }}
                      >
                        Browse peptides
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                      {wishlistProducts.map((product) => {
                        const productIdInt = parseInt(String(product.id), 10);
                        return (
                          <div
                            key={product.id}
                            style={{
                              backgroundColor: "#fff", borderRadius: "16px",
                              border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                              overflow: "hidden", position: "relative",
                            }}
                          >
                            <button
                              onClick={() => void toggleWishlist(productIdInt)}
                              title="Remove from wishlist"
                              style={{
                                position: "absolute", top: "8px", right: "8px", zIndex: 10,
                                width: "28px", height: "28px", borderRadius: "50%",
                                backgroundColor: "#FEF2F2", border: "1.5px solid #FECACA",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <Heart size={13} style={{ color: "#DC2626", fill: "#DC2626" }} />
                            </button>
                            <Link href={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
                              <div style={{ height: "100px", backgroundColor: "#F0F5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                  src={`/images/products/${product.image ?? "default.png"}`}
                                  alt={product.name}
                                  style={{ maxHeight: "80px", maxWidth: "80px", objectFit: "contain" }}
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.15"; }}
                                />
                              </div>
                              <div style={{ padding: "12px" }}>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "4px", lineHeight: 1.3 }}>
                                  {product.name}
                                </p>
                                <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "6px" }}>{product.category}</p>
                                {product.price != null && (
                                  <p style={{ fontSize: "13px", fontWeight: 800, color: "#1240A0" }}>
                                    {formatPrice(product.price)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── PROFILE TAB ── */}
            {/* ── LOYALTY TAB ── */}
            {activeTab === "loyalty" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Loyalty Rewards</h2>
                </div>

                {loadingLoyalty ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
                    <Award size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                    <p style={{ fontSize: "14px" }}>Loading your points…</p>
                  </div>
                ) : !loyalty ? (
                  <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", padding: "60px 24px", textAlign: "center" }}>
                    <Gift size={36} style={{ margin: "0 auto 16px", color: "#CBD5E1" }} />
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>No points yet</p>
                    <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>
                      Place your first order to start earning loyalty points.
                    </p>
                    <Link href="/all-peptides" style={{ display: "inline-block", padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                      Browse peptides
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                    {/* Balance card */}
                    <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
                      <div style={{ background: "linear-gradient(135deg, #0D2565 0%, #1B5CB5 100%)", padding: "28px 24px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                          <div>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                              Available Balance
                            </p>
                            <p style={{ fontSize: "48px", fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: "4px" }}>
                              {loyalty.balance.toLocaleString()}
                            </p>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                              points · worth <strong style={{ color: "#fff" }}>£{loyalty.gbpValue.toFixed(2)}</strong>
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "6px 14px", borderRadius: "20px",
                              backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                              fontSize: "14px", fontWeight: 800, color: "#fff",
                            }}>
                              <Award size={14} />
                              {loyalty.tier}
                            </span>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "6px" }}>
                              {loyalty.lifetimeEarned.toLocaleString()} pts earned lifetime
                            </p>
                          </div>
                        </div>

                        {/* Tier progress bar */}
                        {loyalty.nextTier && (
                          <div style={{ marginTop: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                                {loyalty.pointsToNextTier?.toLocaleString()} pts to {loyalty.nextTier}
                              </span>
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{loyalty.progressPct}%</span>
                            </div>
                            <div style={{ height: "6px", borderRadius: "3px", backgroundColor: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: "3px", width: `${loyalty.progressPct}%`, backgroundColor: "#F59E0B", transition: "width 0.5s ease" }} />
                            </div>
                          </div>
                        )}
                        {!loyalty.nextTier && (
                          <p style={{ marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                            🥇 You've reached the highest tier — Gold status!
                          </p>
                        )}
                      </div>

                      {/* How it works */}
                      <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        {[
                          { icon: <TrendingUp size={15} style={{ color: "#1B5CB5" }} />, label: "Earn", value: "1 pt per £1 spent" },
                          { icon: <Award size={15} style={{ color: "#F59E0B" }} />, label: "Redeem", value: "100 pts = £1 off" },
                          { icon: <Gift size={15} style={{ color: "#059669" }} />, label: "Use at checkout", value: "Applied automatically" },
                        ].map(item => (
                          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {item.icon}
                            </div>
                            <div>
                              <p style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1px" }}>{item.label}</p>
                              <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tier guide */}
                      <div style={{ padding: "14px 24px", display: "flex", gap: "12px" }}>
                        {[
                          { name: "Bronze", pts: "0–499", color: "#CD7F32", bg: "#FEF3C7" },
                          { name: "Silver", pts: "500–1999", color: "#9CA3AF", bg: "#F3F4F6" },
                          { name: "Gold",   pts: "2000+",   color: "#F59E0B", bg: "#FFFBEB" },
                        ].map(t => (
                          <div key={t.name} style={{
                            flex: 1, padding: "10px 12px", borderRadius: "10px",
                            backgroundColor: loyalty.tier === t.name ? t.bg : "#F8FAFC",
                            border: `1.5px solid ${loyalty.tier === t.name ? t.color : "#E8EDF5"}`,
                          }}>
                            <p style={{ fontSize: "13px", fontWeight: 800, color: t.color, marginBottom: "2px" }}>{t.name}</p>
                            <p style={{ fontSize: "11px", color: "#94A3B8" }}>{t.pts} pts</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    {loyalty.balance >= 100 && (
                      <div style={{ backgroundColor: "#FFFBEB", borderRadius: "14px", border: "1.5px solid #FDE68A", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Award size={20} style={{ color: "#F59E0B", flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 700, color: "#92400E", margin: 0 }}>
                              You can redeem {loyalty.balance} pts for £{loyalty.gbpValue.toFixed(2)} off
                            </p>
                            <p style={{ fontSize: "12px", color: "#B45309", margin: 0 }}>Points are applied automatically at checkout</p>
                          </div>
                        </div>
                        <Link href="/all-peptides" style={{ display: "inline-block", padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(90deg, #0D2565, #1B5CB5)", color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                          Shop now →
                        </Link>
                      </div>
                    )}

                    {/* Transaction history */}
                    {loyalty.transactions.length > 0 && (
                      <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E8EDF5", overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Points History</h3>
                        </div>
                        <div>
                          {loyalty.transactions.map(tx => {
                            const isPositive = tx.points > 0;
                            const typeConfig: Record<string, { label: string; bg: string; color: string }> = {
                              earned:   { label: "Earned",   bg: "#F0FDF4", color: "#16A34A" },
                              redeemed: { label: "Redeemed", bg: "#FFF7ED", color: "#C2410C" },
                              adjusted: { label: "Adjusted", bg: "#EFF6FF", color: "#1D4ED8" },
                              expired:  { label: "Expired",  bg: "#F1F5F9", color: "#64748B" },
                            };
                            const cfg = typeConfig[tx.type] ?? typeConfig.adjusted;
                            return (
                              <div key={tx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #F8FAFC", gap: "12px" }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {tx.description}
                                  </p>
                                  <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>{formatDate(tx.createdAt)}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                  <span style={{ fontSize: "14px", fontWeight: 800, color: isPositive ? "#16A34A" : "#DC2626", minWidth: "60px", textAlign: "right" }}>
                                    {isPositive ? "+" : ""}{tx.points}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Update name */}
                <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>Personal information</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>Update your name as it appears on orders.</p>

                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="form-grid-2">
                      {(["firstName", "lastName"] as const).map((field) => (
                        <div key={field}>
                          <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>
                            {field === "firstName" ? "First name" : "Last name"}
                          </label>
                          <input
                            value={profileForm[field]}
                            onChange={(e) => setProfileForm((p) => ({ ...p, [field]: e.target.value }))}
                            style={{
                              width: "100%", height: "42px", padding: "0 12px",
                              borderRadius: "10px", border: "1.5px solid #E2E8F0",
                              fontSize: "14px", color: "#0F172A", outline: "none",
                              backgroundColor: "#F8FAFC", boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#1B5CB5")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Email address</label>
                      <input
                        value={displayProfile.email}
                        readOnly
                        style={{
                          width: "100%", height: "42px", padding: "0 12px",
                          borderRadius: "10px", border: "1.5px solid #E2E8F0",
                          fontSize: "14px", color: "#94A3B8", outline: "none",
                          backgroundColor: "#F1F5F9", boxSizing: "border-box", cursor: "not-allowed",
                        }}
                      />
                      <p style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "4px" }}>Email address cannot be changed here.</p>
                    </div>

                    {profileError && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                        <AlertCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
                        <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{profileError}</p>
                      </div>
                    )}
                    {profileSuccess && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                        <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
                        <p style={{ fontSize: "13px", color: "#15803D", margin: 0 }}>Profile updated successfully.</p>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={savingProfile}
                        style={{
                          height: "42px", padding: "0 24px", borderRadius: "10px", border: "none",
                          background: savingProfile ? "#93C5FD" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                          color: "#fff", fontSize: "14px", fontWeight: 700, cursor: savingProfile ? "not-allowed" : "pointer",
                        }}
                      >
                        {savingProfile ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change password */}
                <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>Change password</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>Choose a strong password of at least 8 characters.</p>

                  <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {[
                      { field: "current" as const, label: "Current password", show: showCurrent, toggle: () => setShowCurrent((s) => !s) },
                      { field: "next" as const, label: "New password", show: showNext, toggle: () => setShowNext((s) => !s) },
                      { field: "confirm" as const, label: "Confirm new password", show: showNext, toggle: () => setShowNext((s) => !s) },
                    ].map(({ field, label, show, toggle }) => (
                      <div key={field}>
                        <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>{label}</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={show ? "text" : "password"}
                            value={pwForm[field]}
                            onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
                            style={{
                              width: "100%", height: "42px", padding: "0 42px 0 12px",
                              borderRadius: "10px", border: "1.5px solid #E2E8F0",
                              fontSize: "14px", color: "#0F172A", outline: "none",
                              backgroundColor: "#F8FAFC", boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#1B5CB5")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                          />
                          <button
                            type="button"
                            onClick={toggle}
                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0, display: "flex" }}
                          >
                            {show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}

                    {pwError && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                        <AlertCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
                        <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{pwError}</p>
                      </div>
                    )}
                    {pwSuccess && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                        <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
                        <p style={{ fontSize: "13px", color: "#15803D", margin: 0 }}>Password changed successfully.</p>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={savingPw}
                        style={{
                          height: "42px", padding: "0 24px", borderRadius: "10px", border: "none",
                          background: savingPw ? "#93C5FD" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                          color: "#fff", fontSize: "14px", fontWeight: 700, cursor: savingPw ? "not-allowed" : "pointer",
                        }}
                      >
                        {savingPw ? "Updating…" : "Update password"}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
      {ReturnModal}
    </div>
  );
}
