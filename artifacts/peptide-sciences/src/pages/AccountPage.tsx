import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  User, Package, Settings, LogOut, ChevronRight,
  ShoppingBag, Clock, Shield, Eye, EyeOff, CheckCircle2,
  AlertCircle, Truck, Zap, FlaskConical, Heart,
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductsContext";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

type OrderItem = {
  productName: string;
  productCategory: string;
  quantity: number;
  priceGbp: number;
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
  const [, navigate] = useLocation();
  const { customer, loadingAuth, signOut } = useCustomerAuth();
  const { formatPrice } = useCurrency();
  const { wishlistIds, toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const { products } = useProducts();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "wishlist">("orders");

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
  }, [customer]);

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
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
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
          <div style={{ width: "220px", flexShrink: 0 }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
              {[
                { key: "orders", label: "My Orders", icon: <Package size={16} /> },
                { key: "wishlist", label: "Wishlist", icon: <Heart size={16} /> },
                { key: "profile", label: "Profile Settings", icon: <Settings size={16} /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as "orders" | "profile" | "wishlist")}
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
            {activeTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Update name */}
                <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "24px 28px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>Personal information</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>Update your name as it appears on orders.</p>

                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
    </div>
  );
}
