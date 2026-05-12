import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, FlaskConical } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function SignIn() {
  const [, navigate] = useLocation();
  const { signIn } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
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

        {/* Logo + heading */}
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
            Sign in to OmniQure
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>
            Access your research account and order history.
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1.5px solid #E8EDF5",
          boxShadow: "0 8px 48px rgba(15,23,42,0.09)",
          padding: "36px 32px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
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

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: "12px", color: "#1B5CB5", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#94A3B8", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px", border: "1.5px solid #E2E8F0",
                    fontSize: "14px", color: "#0F172A", outline: "none",
                    backgroundColor: "#F8FAFC", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#1B5CB5")}
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

            {/* Error */}
            {error && (
              <p style={{ fontSize: "13px", color: "#DC2626", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: "46px", borderRadius: "10px", border: "none",
                background: loading ? "#93C5FD" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
                marginTop: "2px",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E8EDF5" }} />
            <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E8EDF5" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", margin: 0 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#1B5CB5", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
            >
              Create account
            </Link>
          </p>
        </div>

        {/* RUO disclaimer */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginTop: "20px", lineHeight: 1.6 }}>
          By signing in you confirm you are 18+ and a qualified researcher.<br />
          OmniQure products are for Research Use Only.
        </p>
      </div>
    </div>
  );
}
