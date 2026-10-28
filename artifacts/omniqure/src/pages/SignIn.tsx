import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, FlaskConical } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useSEO } from "@/hooks/useSEO";

export default function SignIn() {
  useSEO({ title: "Sign In", noIndex: true });
  const [, navigate] = useLocation();
  const { signIn } = useCustomerAuth();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const returnToAccount = search.get("returnTo") === "account";
  const requestedReturnTo = search.get("returnTo");
  const orderNumber = search.get("order");
  const destination = returnToAccount
    ? `/account${orderNumber ? `?order=${encodeURIComponent(orderNumber)}` : ""}`
    : requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
      ? requestedReturnTo
      : "/";
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
      navigate(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
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

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "52px", height: "52px", borderRadius: "14px",
            background: "#1D2948",
            marginBottom: "16px",
          }}>
            <FlaskConical size={24} color="#fff" />
          </div>
          <h1 className="signin-h1-mobile" style={{ fontSize: "26px", fontWeight: 800, color: "#22252C", letterSpacing: "-0.025em", marginBottom: "6px" }}>
            Sign in to OmniQure
          </h1>
          <p style={{ fontSize: "14px", color: "#4A5672" }}>
            Access your research account and order history.
          </p>
        </div>

        {/* Card */}
        <div className="signin-card-mobile" style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1.5px solid #D3D8E2",
          boxShadow: "none",
          padding: "36px 32px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#22252C", display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#8D9BB8", pointerEvents: "none",
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="researcher@institution.ac.uk"
                  autoComplete="email"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "14px",
                    borderRadius: "10px", border: "1.5px solid #D3D8E2",
                    fontSize: "14px", color: "#22252C", outline: "none",
                    backgroundColor: "#F4F5F8", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#D3D8E2")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#22252C" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "#4E68C2", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#8D9BB8", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px", border: "1.5px solid #D3D8E2",
                    fontSize: "14px", color: "#22252C", outline: "none",
                    backgroundColor: "#F4F5F8", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#D3D8E2")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#8D9BB8", padding: 0,
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p style={{ fontSize: "13px", color: "#9C4A44", backgroundColor: "#F8F2F3", border: "1px solid #C9939A", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: "46px", borderRadius: "10px", border: "none",
                background: loading ? "#4A5672" : "#1D2948",
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
            <div style={{ flex: 1, height: "1px", backgroundColor: "#D3D8E2" }} />
            <span style={{ fontSize: "12px", color: "#8D9BB8", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#D3D8E2" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#4A5672", margin: 0 }}>
            Don't have an account?{" "}
            <Link
              href={`/register${returnToAccount ? `?returnTo=account${orderNumber ? `&order=${encodeURIComponent(orderNumber)}` : ""}` : ""}`}
              style={{ color: "#4E68C2", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
            >
              Create account
            </Link>
          </p>
        </div>

        {/* RUO disclaimer */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#8D9BB8", marginTop: "20px", lineHeight: 1.6 }}>
          By signing in you confirm you are 18+ and a qualified researcher.<br />
          OmniQure products are for Research Use Only.
        </p>
      </div>
    </div>
  );
}
