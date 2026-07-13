import { useState } from "react";
import { Link } from "wouter";
import { Mail, FlaskConical, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

export default function ForgotPassword() {
  useSEO({ title: "Forgot Password", noIndex: true });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Request failed");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Arimo', Arial, sans-serif",
        minHeight: "calc(100vh - 120px)",
        background: "linear-gradient(135deg, #F0F5FF 0%, #F7FAFF 50%, #EEF4FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #0D2565, #1B5CB5)",
            marginBottom: "16px",
          }}>
            <FlaskConical size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: "6px" }}>
            Forgot your password?
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1.5px solid #E8EDF5",
          boxShadow: "0 8px 48px rgba(15,23,42,0.09)",
          padding: "36px 32px",
        }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <CheckCircle2 size={40} style={{ color: "#059669", margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "10px" }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
                If an account exists for <strong>{email}</strong>, we've sent a password reset link. It expires in 1 hour.
              </p>
              <Link
                href="/sign-in"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "14px", color: "#1B5CB5", fontWeight: 600, textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "#94A3B8", pointerEvents: "none",
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="researcher@institution.ac.uk"
                    autoComplete="email"
                    autoFocus
                    style={{
                      width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "14px",
                      borderRadius: "10px", border: "1.5px solid #E2E8F0",
                      fontSize: "14px", color: "#0F172A", outline: "none",
                      backgroundColor: "#F8FAFC", boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#1B5CB5")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontSize: "13px", color: "#DC2626", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", height: "46px", borderRadius: "10px", border: "none",
                  background: loading ? "#93C5FD" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <p style={{ textAlign: "center", margin: 0 }}>
                <Link
                  href="/sign-in"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", color: "#64748B", textDecoration: "none", fontWeight: 500,
                  }}
                >
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
