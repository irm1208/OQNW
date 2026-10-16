import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Lock, Eye, EyeOff, FlaskConical, CheckCircle2, XCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

export default function ResetPassword() {
  useSEO({ title: "Reset Password", noIndex: true });
  const [, navigate] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setError("Invalid or missing reset link. Please request a new one.");
    } else {
      setToken(t);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl("auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Reset failed");
      }
      setSuccess(true);
      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif",
        minHeight: "calc(100vh - 120px)",
        background: "#F2F0EB",
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
            background: "#1D2948",
            marginBottom: "16px",
          }}>
            <FlaskConical size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#22252C", letterSpacing: "-0.025em", marginBottom: "6px" }}>
            Set a new password
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>
            Choose a strong password of at least 8 characters.
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1.5px solid #D3D8E2",
          boxShadow: "0 8px 48px rgba(15,23,42,0.09)",
          padding: "36px 32px",
        }}>
          {success ? (
            <div style={{ textAlign: "center" }}>
              <CheckCircle2 size={40} style={{ color: "#059669", margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#22252C", marginBottom: "10px" }}>
                Password updated
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
                Your password has been changed successfully. Redirecting you to sign in…
              </p>
              <Link href="/sign-in" style={{ fontSize: "14px", color: "#4E68C2", fontWeight: 600, textDecoration: "none" }}>
                Sign in now →
              </Link>
            </div>
          ) : !token && error ? (
            <div style={{ textAlign: "center" }}>
              <XCircle size={40} style={{ color: "#DC2626", margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#22252C", marginBottom: "10px" }}>
                Invalid reset link
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "24px" }}>
                This password reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                style={{
                  display: "inline-block", padding: "10px 24px", borderRadius: "10px",
                  background: "#1D2948",
                  color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none",
                }}
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { label: "New password", value: password, onChange: setPassword, placeholder: "••••••••", autoComplete: "new-password" },
                { label: "Confirm password", value: confirm, onChange: setConfirm, placeholder: "••••••••", autoComplete: "new-password" },
              ].map(({ label, value, onChange, placeholder, autoComplete }) => (
                <div key={label}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                      color: "#94A3B8", pointerEvents: "none",
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      style={{
                        width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                        borderRadius: "10px", border: "1.5px solid #E2E8F0",
                        fontSize: "14px", color: "#22252C", outline: "none",
                        backgroundColor: "#F8FAFC", boxSizing: "border-box",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0,
                        display: "flex", alignItems: "center",
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}

              {error && (
                <p style={{ fontSize: "13px", color: "#DC2626", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                style={{
                  width: "100%", height: "46px", borderRadius: "10px", border: "none",
                  background: loading ? "#4A5672" : "#1D2948",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {loading ? "Updating…" : "Set new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
