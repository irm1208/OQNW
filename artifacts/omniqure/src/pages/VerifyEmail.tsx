import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link. Please use the link from your welcome email.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, { method: "POST" })
      .then(r => r.json())
      .then((data: { ok?: boolean; error?: string }) => {
        if (data.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.error ?? "This link is invalid or has expired. Please register again or contact support.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again or contact support.");
      });
  }, [token]);

  return (
    <div style={{
      fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif",
      backgroundColor: "#F2F0EB",
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px",
    }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

        {status === "loading" && (
          <>
            <Loader2 size={48} color="#4E68C2" style={{ margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#22252C", marginBottom: "8px" }}>
              Verifying your email…
            </h1>
            <p style={{ color: "#64748B", fontSize: "15px" }}>Just a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "linear-gradient(135deg, #059669, #34D399)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 12px 40px rgba(5,150,105,0.25)",
            }}>
              <CheckCircle2 size={40} color="#fff" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#22252C", letterSpacing: "-0.02em", marginBottom: "10px" }}>
              Email verified!
            </h1>
            <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.6, marginBottom: "28px" }}>
              Your OmniQure account is fully activated. You can now browse and order.
            </p>
            <Link
              href="/all-peptides"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                height: "48px", paddingLeft: "28px", paddingRight: "28px",
                borderRadius: "12px", background: "linear-gradient(90deg, #22252C, #4E68C2)",
                color: "#fff", fontWeight: 700, fontSize: "15px", textDecoration: "none",
              }}
            >
              Browse Peptides
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "linear-gradient(135deg, #DC2626, #F87171)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 12px 40px rgba(220,38,38,0.2)",
            }}>
              <XCircle size={40} color="#fff" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#22252C", marginBottom: "10px" }}>
              Verification failed
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.65, marginBottom: "28px" }}>
              {message}
            </p>
            <Link
              href="/account"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                height: "46px", paddingLeft: "24px", paddingRight: "24px",
                borderRadius: "12px", border: "1.5px solid #E2E8F0", backgroundColor: "#fff",
                color: "#475569", fontWeight: 700, fontSize: "14px", textDecoration: "none",
              }}
            >
              Go to My Account
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
