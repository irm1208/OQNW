import { Link } from "wouter";
import { ArrowRight, CheckCircle2, UserRoundPlus } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function PostOrderAccountPrompt({ orderNumber }: { orderNumber: string }) {
  const { customer, loadingAuth } = useCustomerAuth();
  if (!orderNumber || loadingAuth) return null;

  const query = `order=${encodeURIComponent(orderNumber)}&returnTo=account`;
  const accountHref = `/account?order=${encodeURIComponent(orderNumber)}`;

  if (customer) {
    return (
      <section
        style={{
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          borderRadius: 16,
          padding: "18px 20px",
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <CheckCircle2 size={22} style={{ color: "#059669", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ margin: 0, color: "#065F46", fontSize: 14, fontWeight: 800 }}>This order is saved to your account.</p>
          <p style={{ margin: "3px 0 0", color: "#047857", fontSize: 12.5, lineHeight: 1.5 }}>View its status and order history whenever you need it.</p>
        </div>
        <Link
          href={accountHref}
          style={{ color: "#065F46", fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          View my account <ArrowRight size={14} style={{ verticalAlign: "text-bottom" }} />
        </Link>
      </section>
    );
  }

  return (
    <section style={{ background: "#F8FAFF", border: "1px solid #C7D7F7", borderRadius: 16, padding: "20px", marginTop: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#E0EAFF", color: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <UserRoundPlus size={19} />
        </div>
        <div>
          <p style={{ margin: 0, color: "#0F172A", fontSize: 15, fontWeight: 900 }}>Save this order to an account?</p>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.55 }}>
            Create a password to view this order and future purchases in one place.
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 15 }}>
        <Link
          href={`/register?${query}`}
          style={{ borderRadius: 9, background: "#1240A0", color: "#fff", padding: "10px 14px", textDecoration: "none", fontWeight: 800, fontSize: 13 }}
        >
          Create an account <ArrowRight size={14} style={{ verticalAlign: "text-bottom", marginLeft: 3 }} />
        </Link>
        <span style={{ color: "#64748B", fontSize: 12.5 }}>
          Already have an account?{" "}
          <Link href={`/sign-in?${query}`} style={{ color: "#1240A0", fontWeight: 800, textDecoration: "none" }}>Sign in</Link>
        </span>
      </div>
    </section>
  );
}