import { useEffect } from "react";
import { X, Star, Loader2 } from "lucide-react";
import ReviewsCarousel, { type ReviewItem } from "@/components/ReviewsCarousel";

export type ReviewsData = {
  summary: {
    avgRating: number;
    totalCount: number;
    breakdown: Record<number, number>;
  };
  reviews: ReviewItem[];
  myReview: { isApproved: boolean } | null;
  hasPurchased: boolean;
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} style={{ color: "#F59E0B", fill: s <= rating ? "#F59E0B" : "none", flexShrink: 0 }} />
      ))}
    </span>
  );
}

interface ReviewsModalProps {
  productName: string;
  reviewsData: ReviewsData | null;
  reviewsLoading: boolean;
  customer: { email: string } | null;
  writeRating: number;
  setWriteRating: (n: number) => void;
  hoverRating: number;
  setHoverRating: (n: number) => void;
  writeTitle: string;
  setWriteTitle: (s: string) => void;
  writeBody: string;
  setWriteBody: (s: string) => void;
  submitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ReviewsModal({
  productName,
  reviewsData,
  reviewsLoading,
  customer,
  writeRating,
  setWriteRating,
  hoverRating,
  setHoverRating,
  writeTitle,
  setWriteTitle,
  writeBody,
  setWriteBody,
  submitting,
  submitSuccess,
  submitError,
  onSubmit,
  onClose,
}: ReviewsModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.65)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%", maxWidth: "680px",
          maxHeight: "90vh",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "#fff",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: "1px solid #F1F5F9",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Reviews</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{productName}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F1F5F9", border: "none", borderRadius: "8px",
              width: "34px", height: "34px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#475569", flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px" }}>
          {reviewsLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <Loader2 size={24} style={{ color: "#1B5CB5", animation: "spin 1s linear infinite" }} />
            </div>
          ) : reviewsData ? (
            <>
              {/* Summary bar */}
              {reviewsData.summary.totalCount > 0 && (
                <div style={{
                  display: "flex", gap: "24px", marginBottom: "24px",
                  padding: "20px", borderRadius: "14px",
                  backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
                }}>
                  <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "90px" }}>
                    <span style={{ fontSize: "40px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                      {(reviewsData.summary.avgRating ?? 0).toFixed(1)}
                    </span>
                    <StarRow rating={Math.round(reviewsData.summary.avgRating ?? 0)} size={15} />
                    <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                      {reviewsData.summary.totalCount} review{reviewsData.summary.totalCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center" }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewsData.summary.breakdown[star] ?? 0;
                      const pct = reviewsData.summary.totalCount > 0 ? (count / reviewsData.summary.totalCount) * 100 : 0;
                      return (
                        <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748B" }}>
                          <span style={{ width: "12px", textAlign: "right" }}>{star}</span>
                          <Star size={11} style={{ color: "#F59E0B", fill: "#F59E0B", flexShrink: 0 }} />
                          <div style={{ flex: 1, height: "7px", borderRadius: "9999px", overflow: "hidden", backgroundColor: "#E2E8F0" }}>
                            <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#F59E0B", borderRadius: "9999px" }} />
                          </div>
                          <span style={{ width: "20px" }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write review */}
              {customer ? (
                reviewsData.myReview ? (
                  <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "12px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600, color: "#15803D" }}>Your review is submitted</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#166534" }}>
                      {reviewsData.myReview.isApproved === false ? "Pending approval." : "Published."}
                    </p>
                  </div>
                ) : reviewsData.hasPurchased ? (
                  <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "14px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>Write a Review</p>
                    {submitSuccess ? (
                      <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#F0FDF4", color: "#15803D", fontSize: "13px", fontWeight: 500 }}>
                        Thank you! Your review has been submitted and is pending approval.
                      </div>
                    ) : (
                      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Your Rating *</label>
                          <div style={{ display: "flex", gap: "4px" }}>
                            {[1,2,3,4,5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setWriteRating(s)}
                                style={{ background: "none", border: "none", padding: "2px", cursor: "pointer" }}
                              >
                                <Star size={24} style={{
                                  color: s <= (hoverRating || writeRating) ? "#F59E0B" : "#CBD5E1",
                                  fill: s <= (hoverRating || writeRating) ? "#F59E0B" : "#CBD5E1",
                                  transition: "color 0.1s, fill 0.1s",
                                }} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Title *</label>
                          <input
                            type="text" required maxLength={120}
                            value={writeTitle} onChange={(e) => setWriteTitle(e.target.value)}
                            placeholder="Summarise your experience"
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", border: "1px solid #CBD5E1", backgroundColor: "#fff", color: "#0F172A", boxSizing: "border-box" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>Review *</label>
                          <textarea
                            required rows={4} maxLength={2000}
                            value={writeBody} onChange={(e) => setWriteBody(e.target.value)}
                            placeholder="Share your experience with this product"
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none", border: "1px solid #CBD5E1", backgroundColor: "#fff", color: "#0F172A", resize: "none", boxSizing: "border-box" }}
                          />
                        </div>
                        {submitError && <p style={{ margin: 0, fontSize: "12px", color: "#DC2626" }}>{submitError}</p>}
                        <button
                          type="submit"
                          disabled={submitting || writeRating === 0}
                          style={{
                            alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px",
                            padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                            backgroundColor: "#1B5CB5", color: "#fff", border: "none",
                            opacity: submitting || writeRating === 0 ? 0.6 : 1,
                            cursor: submitting || writeRating === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          {submitting && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
                          {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px", padding: "14px 16px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Only verified purchasers can leave a review.</p>
                  </div>
                )
              ) : (
                <div style={{ marginBottom: "20px", padding: "14px 16px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
                    <a href="/account" style={{ color: "#1B5CB5", fontWeight: 600 }}>Sign in</a> to write a review. Only verified purchasers may review products.
                  </p>
                </div>
              )}

              {/* Reviews list */}
              {reviewsData.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                  <Star size={32} style={{ color: "#E2E8F0", fill: "#E2E8F0", margin: "0 auto 12px", display: "block" }} />
                  <p style={{ margin: 0, fontSize: "13px" }}>No reviews yet. Be the first to review this product.</p>
                </div>
              ) : (
                <ReviewsCarousel reviews={reviewsData.reviews} />
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
              <p style={{ margin: 0, fontSize: "13px" }}>Unable to load reviews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
