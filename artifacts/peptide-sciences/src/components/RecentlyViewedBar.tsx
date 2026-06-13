import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Clock, ChevronDown, ChevronUp, X } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useProducts } from "@/context/ProductsContext";
import { useCurrency } from "@/context/CurrencyContext";

const HIDE_ON = ["/cart", "/checkout", "/order-confirmation", "/sign-in", "/register", "/forgot-password", "/reset-password"];
const MAX_SHOWN = 4;

export default function RecentlyViewedBar() {
  const [location] = useLocation();
  const { recentIds } = useRecentlyViewed();
  const { products } = useProducts();
  const { formatPrice } = useCurrency();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("omniqure_rvbar_dismissed");
      if (stored === "1") setDismissed(true);
    } catch {}
  }, []);

  const currentProductId = location.startsWith("/product/")
    ? location.replace("/product/", "").split("?")[0]
    : null;

  const recentProducts = recentIds
    .filter(id => id !== currentProductId)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, MAX_SHOWN) as typeof products;

  const hide =
    dismissed ||
    recentProducts.length === 0 ||
    HIDE_ON.some(path => location.startsWith(path));

  if (hide) return null;

  function dismiss() {
    setDismissed(true);
    try { sessionStorage.setItem("omniqure_rvbar_dismissed", "1"); } catch {}
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        fontFamily: "'Arimo', Arial, sans-serif",
        transform: collapsed ? "translateY(calc(100% - 40px))" : "translateY(0)",
        transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2)",
      }}
    >
      {/* Header strip */}
      <div
        style={{
          background: "linear-gradient(90deg, #0D2565 0%, #1240A0 60%, #1B5CB5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          height: "40px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Clock size={13} style={{ color: "#E8A93E" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
            Recently Viewed
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 700, color: "#1240A0",
            backgroundColor: "#E8A93E", borderRadius: "99px",
            padding: "1px 7px", lineHeight: 1.6,
          }}>
            {recentProducts.length}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {collapsed
            ? <ChevronUp size={15} style={{ color: "rgba(255,255,255,0.7)" }} />
            : <ChevronDown size={15} style={{ color: "rgba(255,255,255,0.7)" }} />
          }
          <button
            onClick={e => { e.stopPropagation(); dismiss(); }}
            title="Dismiss"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", padding: "2px",
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Products strip */}
      <div style={{
        backgroundColor: "#fff",
        borderTop: "1px solid #E8EDF5",
        boxShadow: "0 -4px 24px rgba(18,64,160,0.10)",
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        gap: "10px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {recentProducts.map(product => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "7px 11px 7px 7px",
                borderRadius: "12px",
                border: "1.5px solid #E8EDF5",
                backgroundColor: "#FAFBFF",
                cursor: "pointer",
                transition: "all 0.15s",
                minWidth: "180px",
                maxWidth: "200px",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#93B8F0";
                el.style.backgroundColor = "#EEF4FF";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 4px 14px rgba(27,92,181,0.12)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#E8EDF5";
                el.style.backgroundColor = "#FAFBFF";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "8px", flexShrink: 0,
                background: "linear-gradient(145deg,#F4F8FF,#EBF2FF)",
                border: "1px solid #E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: "11.5px", fontWeight: 600, color: "#0F172A",
                  margin: "0 0 2px", lineHeight: 1.3,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {product.name}
                </p>
                {product.price != null && (
                  <p style={{ fontSize: "12px", fontWeight: 800, color: "#1240A0", margin: 0 }}>
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/all-peptides"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "4px", padding: "7px 14px", borderRadius: "12px",
            border: "1.5px dashed #BFDBFE", color: "#1B5CB5",
            fontSize: "11px", fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s", height: "58px",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#EEF4FF";
              (e.currentTarget as HTMLElement).style.borderColor = "#93B8F0";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "#BFDBFE";
            }}
          >
            <span style={{ fontSize: "16px" }}>🔬</span>
            <span>Browse all</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
