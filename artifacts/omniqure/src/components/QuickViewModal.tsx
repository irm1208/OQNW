import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart, CheckCircle2, ExternalLink, Shield } from "lucide-react";
import { useLocation } from "wouter";
import type { GroupedProduct } from "@/data/groupedProducts";
import { parseName } from "@/data/groupedProducts";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import { janoshikDataBySlug } from "@/data/janoshikData";
import { useProducts } from "@/context/ProductsContext";
import { getCatalogueVialImage } from "@/lib/catalogueImages";

interface QuickViewModalProps {
  group: GroupedProduct;
  initialIdx?: number;
  onClose: () => void;
}

export default function QuickViewModal({ group, initialIdx = 0, onClose }: QuickViewModalProps) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const { productDetails } = useProducts();

  const [selectedIdx, setSelectedIdx] = useState(initialIdx);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = group.variants[selectedIdx];
  const productIdInt = Number.parseInt(String(variant.id), 10);
  const purityStr = variant.purity ?? "Not specified";
  const janoshikReport = janoshikDataBySlug[variant.slug];
  const detail = productDetails[variant.slug];
  const description = variant.description ?? "";
  const shortDesc = description.length > 200 ? description.slice(0, 200).trimEnd() + "…" : description;

  const handleAddToCart = useCallback(() => {
    addToCart(variant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addToCart, variant, qty]);

  const goToProduct = useCallback(() => {
    onClose();
    navigate(`/product/${variant.id}`);
  }, [navigate, variant.id, onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => { setAdded(false); setQty(1); }, [selectedIdx]);

  const isOos = variant.stockLevel === 0;
  const isLow = !isOos && variant.stockLevel !== undefined && variant.stockLevel <= 10;

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(5,15,40,0.72)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: "20px",
        width: "100%", maxWidth: "820px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "row",
        overflow: "hidden", maxHeight: "90vh",
        position: "relative",
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 10,
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(15,23,42,0.08)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#22252C",
          }}
        >
          <X size={15} />
        </button>

        {/* Left — image */}
        <div style={{
          width: "44%", flexShrink: 0, background: "#EDF0F9",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px 24px", position: "relative", minHeight: "360px",
        }}>
          {/* Purity badge */}
          <div style={{
            position: "absolute", top: "14px", left: "14px",
            background: "#EFF2EF", border: "1.5px solid #94A895",
            borderRadius: "10px", padding: "5px 10px",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <Shield size={12} color="#4F6B52" fill="none" />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#4F6B52" }}>{purityStr} Purity</span>
          </div>

          <img
            src={getCatalogueVialImage(variant.id, variant.slug, variant.image, variant.sourceImage)}
            onError={(e) => {
              if (variant.image && e.currentTarget.src !== variant.image) {
                e.currentTarget.src = variant.image;
              }
            }}
            alt={group.baseName}
            style={{ maxWidth: "100%", maxHeight: "240px", objectFit: "contain" }}
          />

          {janoshikReport?.taskNumber && janoshikReport.verifyUrl && janoshikReport.image && (
            <div style={{
              marginTop: "16px", padding: "7px 14px", borderRadius: "10px",
              background: "#EDF0F9", border: "1.5px solid #4E68C2",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "18px", width: "auto", borderRadius: "3px", display: "block" }} />
            </div>
          )}
        </div>

        {/* Right — details */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "28px 26px 24px",
          display: "flex", flexDirection: "column", gap: "14px",
        }}>
          {/* Category + wishlist row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              fontSize: "10px", fontWeight: 700, color: "#4E68C2", background: "#EFF2EF",
              padding: "3px 9px", borderRadius: "5px", letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {group.category}
            </span>
            <button
              onClick={() => void toggleWishlist(productIdInt)}
              title={inWishlist(productIdInt) ? "Remove from wishlist" : "Save to wishlist"}
              style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: inWishlist(productIdInt) ? "#F8F2F3" : "#F4F5F8",
                border: inWishlist(productIdInt) ? "1.5px solid #C9939A" : "1.5px solid #D3D8E2",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Heart size={14} style={{
                color: inWishlist(productIdInt) ? "#9C4A44" : "#8D9BB8",
                fill: inWishlist(productIdInt) ? "#9C4A44" : "none",
              }} />
            </button>
          </div>

          {/* Name */}
          <div>
            <h2 style={{
              margin: 0, fontSize: "22px", fontWeight: 900, lineHeight: 1.15,
              background: "#1D2948",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {group.baseName}
            </h2>
            {detail?.alsoKnownAs && (
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#8D9BB8" }}>
                Also known as: {detail.alsoKnownAs}
              </p>
            )}
          </div>

          {/* Description */}
          {shortDesc && (
            <p style={{ margin: 0, fontSize: "12.5px", color: "#4A5672", lineHeight: 1.65 }}>
              {shortDesc}
            </p>
          )}

          {/* Key stats row */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "Purity", value: purityStr, color: "#4F6B52", bg: "#EFF2EF", border: "#94A895" },
              ...(detail?.molecularWeight ? [{ label: "M.W.", value: detail.molecularWeight, color: "#4E68C2", bg: "#EFF2EF", border: "#94A895" }] : []),
              ...(detail?.casNumber ? [{ label: "CAS", value: detail.casNumber, color: "#22252C", bg: "#F4F5F8", border: "#D3D8E2" }] : []),
            ].map(s => (
              <div key={s.label} style={{
                padding: "6px 10px", borderRadius: "8px", background: s.bg, border: `1.5px solid ${s.border}`,
              }}>
                <div style={{ fontSize: "8.5px", fontWeight: 700, color: "#4A5672", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: s.color, marginTop: "2px" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Variant pills */}
          {group.variants.length > 1 && (
            <div>
              <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#4A5672", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Select Strength
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {group.variants.map((v, i) => {
                  const { strength } = parseName(v.name);
                  const active = i === selectedIdx;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedIdx(i)}
                      style={{
                        padding: "6px 14px", borderRadius: "9px", fontSize: "12.5px", fontWeight: 700,
                        border: active ? "2px solid #4E68C2" : "1.5px solid #D3D8E2",
                        background: active ? "#EFF2EF" : "#F4F5F8",
                        color: active ? "#4E68C2" : "#22252C",
                        cursor: "pointer", transition: "all 0.12s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "1px",
                      }}
                    >
                      <span>{strength}</span>
                      {v.price != null && (
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: active ? "#4F6B52" : "#4A5672" }}>
                          {formatPrice(v.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          {isOos ? (
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#9C4A44",
              background: "#F8F2F3", border: "1px solid #C9939A",
              padding: "4px 10px", borderRadius: "6px", alignSelf: "flex-start",
            }}>✗ Sold Out</span>
          ) : isLow ? (
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#85683A",
              background: "#F8F4EF", border: "1px solid #CDB894",
              padding: "4px 10px", borderRadius: "6px", alignSelf: "flex-start",
            }}>⚡ Low stock</span>
          ) : null}

          {/* Price */}
          {variant.price != null && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "26px", fontWeight: 900, color: "#4F6B52", lineHeight: 1 }}>
                {formatPrice(variant.price)}
              </span>
              {group.variants.length > 1 && selectedIdx !== 0 && group.variants[0].price != null && (
                <span style={{ fontSize: "12px", color: "#8D9BB8" }}>
                  from {formatPrice(group.variants[0].price)}
                </span>
              )}
            </div>
          )}

          {/* Qty + ATC */}
          <div className="quick-view-cta-row" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center",
              border: "1.5px solid #D3D8E2", borderRadius: "10px", overflow: "hidden",
            }}>
              {(["−", qty, "+"] as const).map((v, i) => (
                i === 1
                  ? <span key="qty" style={{ minWidth: "34px", textAlign: "center", fontSize: "14px", fontWeight: 800, color: "#22252C" }}>{qty}</span>
                  : <button
                      key={i}
                      onClick={() => setQty(q => i === 0 ? Math.max(1, q - 1) : q + 1)}
                      style={{
                        width: "36px", height: "38px", border: "none",
                        background: "#F4F5F8", cursor: "pointer",
                        fontSize: "18px", color: "#4A5672", display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#EFF2EF"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#F4F5F8"}
                    >{v}</button>
              ))}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOos}
              className="quick-view-add-btn"
              style={{
                flex: 1, height: "40px", borderRadius: "10px",
                background: isOos ? "#D3D8E2" : added ? "#4F6B52" : "#4E68C2",
                color: isOos ? "#8D9BB8" : "#fff",
                border: "none", fontSize: "13.5px", fontWeight: 800,
                cursor: isOos ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!isOos && !added) (e.currentTarget as HTMLButtonElement).style.background = "#4E68C2"; }}
              onMouseLeave={e => { if (!isOos && !added) (e.currentTarget as HTMLButtonElement).style.background = "#4E68C2"; }}
            >
              {added
                ? <><CheckCircle2 size={15} /> Added to Cart!</>
                : isOos
                  ? "Sold Out"
                  : <><ShoppingCart size={15} /> Add to Cart</>
              }
            </button>
          </div>

          {/* View full details */}
          <button
            onClick={goToProduct}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", gap: "5px",
              fontSize: "12.5px", fontWeight: 700, color: "#4E68C2", alignSelf: "flex-start",
              textDecoration: "underline", textUnderlineOffset: "3px",
            }}
          >
            <ExternalLink size={12} /> View Full Product Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
