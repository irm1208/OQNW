import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, User, Building2, FlaskConical, CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useSEO } from "@/hooks/useSEO";
import { REFERRAL_SHARE_DESCRIPTION, REFERRAL_SHARE_TITLE } from "@/seo/referral";

type CheckoutAccountContext = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
};

function checkoutAccountContext(orderNumber: string | null): CheckoutAccountContext | null {
  if (!orderNumber || typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem("omniqure:checkout-account") ?? "null") as Partial<CheckoutAccountContext> | null;
    if (
      parsed?.orderNumber === orderNumber &&
      typeof parsed.firstName === "string" &&
      typeof parsed.lastName === "string" &&
      typeof parsed.email === "string"
    ) {
      return parsed as CheckoutAccountContext;
    }
  } catch {
    // The standard empty registration form is a safe fallback.
  }
  return null;
}

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useCustomerAuth();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const refCode = search.get("ref") ?? undefined;
  useSEO({
    title: refCode ? REFERRAL_SHARE_TITLE : "Create Account",
    description: refCode ? REFERRAL_SHARE_DESCRIPTION : undefined,
    canonicalPath: refCode ? "/sign-up" : null,
    noIndex: true,
  });
  useEffect(() => {
    if (!refCode) {
      document.querySelector('script[data-seo="referral"]')?.remove();
    }
  }, [refCode]);
  const returnToAccount = search.get("returnTo") === "account";
  const orderNumber = search.get("order");
  const checkoutContext = checkoutAccountContext(orderNumber);
  const [form, setForm] = useState({
    firstName: checkoutContext?.firstName ?? "",
    lastName: checkoutContext?.lastName ?? "",
    email: checkoutContext?.email ?? "",
    institution: "", password: "", confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!agreed) e.agreed = "You must agree to continue";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        institution: form.institution || undefined,
        referredBy: refCode,
      });
      if (checkoutContext) {
        window.sessionStorage.removeItem("omniqure:checkout-account");
      }
      navigate(returnToAccount
        ? `/account${orderNumber ? `?order=${encodeURIComponent(orderNumber)}` : ""}`
        : "/");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : "Registration failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder: string,
    icon: React.ReactNode,
    type = "text",
    extra?: React.ReactNode,
  ) => (
    <div>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#22252C", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
          color: "#8D9BB8", pointerEvents: "none", display: "flex",
        }}>
          {icon}
        </span>
        <input
          type={type}
          value={form[key]}
          onChange={set(key)}
          placeholder={placeholder}
          style={{
            width: "100%", height: "44px", paddingLeft: "38px",
            paddingRight: extra ? "42px" : "14px",
            borderRadius: "10px",
            border: `1.5px solid ${errors[key] ? "#C9939A" : "#D3D8E2"}`,
            fontSize: "14px", color: "#22252C", outline: "none",
            backgroundColor: errors[key] ? "#F8F2F3" : "#F4F5F8",
            boxSizing: "border-box" as const,
            transition: "border-color 0.15s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
          onBlur={e => (e.currentTarget.style.borderColor = errors[key] ? "#C9939A" : "#D3D8E2")}
        />
        {extra}
      </div>
      {errors[key] && (
        <p style={{ fontSize: "11.5px", color: "#9C4A44", marginTop: "4px" }}>{errors[key]}</p>
      )}
    </div>
  );

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
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Heading */}
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
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "#4A5672" }}>
            Join OmniQure and access 81 research-grade peptides.
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1.5px solid #D3D8E2",
          boxShadow: "0 8px 48px rgba(15,23,42,0.09)",
          padding: "36px 32px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Name row */}
            <div className="form-grid-2">
              {field("First name", "firstName", "Jane", <User size={15} />)}
              {field("Last name", "lastName", "Smith", <User size={15} />)}
            </div>

            {field("Email address", "email", "researcher@institution.ac.uk", <Mail size={15} />, "email")}
            {field("Institution / Organisation", "institution", "University of Oxford (optional)", <Building2 size={15} />)}

            {/* Password */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#22252C", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#8D9BB8", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px",
                    border: `1.5px solid ${errors.password ? "#C9939A" : "#D3D8E2"}`,
                    fontSize: "14px", color: "#22252C", outline: "none",
                    backgroundColor: errors.password ? "#F8F2F3" : "#F4F5F8",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#C9939A" : "#D3D8E2")}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8D9BB8", padding: 0, display: "flex" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: "11.5px", color: "#9C4A44", marginTop: "4px" }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#22252C", display: "block", marginBottom: "6px" }}>
                Confirm password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#8D9BB8", pointerEvents: "none",
                }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Re-enter your password"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px",
                    border: `1.5px solid ${errors.confirm ? "#C9939A" : "#D3D8E2"}`,
                    fontSize: "14px", color: "#22252C", outline: "none",
                    backgroundColor: errors.confirm ? "#F8F2F3" : "#F4F5F8",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#4E68C2")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.confirm ? "#C9939A" : "#D3D8E2")}
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8D9BB8", padding: 0, display: "flex" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirm && <p style={{ fontSize: "11.5px", color: "#9C4A44", marginTop: "4px" }}>{errors.confirm}</p>}
            </div>

            {/* Age + RUO agreement */}
            <div
              style={{
                backgroundColor: "#EDF0F9",
                border: `1.5px solid ${errors.agreed ? "#C9939A" : "#EFF2EF"}`,
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                gap: "12px",
                cursor: "pointer",
              }}
              onClick={() => setAgreed(a => !a)}
            >
              <div style={{
                width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0,
                border: `2px solid ${agreed ? "#4E68C2" : "#D3D8E2"}`,
                backgroundColor: agreed ? "#4E68C2" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {agreed && <CheckCircle2 size={13} color="#fff" strokeWidth={3} />}
              </div>
              <p style={{ fontSize: "12.5px", color: "#4A5672", lineHeight: 1.55, margin: 0 }}>
                I confirm I am <strong>18 years of age or older</strong> and a qualified researcher. I understand OmniQure products are for <strong>Research Use Only</strong> and not intended for human or veterinary use.
              </p>
            </div>
            {errors.agreed && <p style={{ fontSize: "11.5px", color: "#9C4A44", marginTop: "-8px" }}>{errors.agreed}</p>}

            {errors.submit && (
              <p style={{ fontSize: "13px", color: "#9C4A44", backgroundColor: "#F8F2F3", border: "1px solid #C9939A", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                {errors.submit}{" "}
                {errors.submit.includes("already exists") && (
                  <Link
                    href={`/sign-in${returnToAccount ? `?returnTo=account${orderNumber ? `&order=${encodeURIComponent(orderNumber)}` : ""}` : ""}`}
                    style={{ color: "#9C4A44", fontWeight: 800 }}
                  >
                    Sign in instead
                  </Link>
                )}
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
                marginTop: "4px",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#4A5672", margin: "24px 0 0" }}>
            Already have an account?{" "}
            <Link
              href={`/sign-in${returnToAccount ? `?returnTo=account${orderNumber ? `&order=${encodeURIComponent(orderNumber)}` : ""}` : ""}`}
              style={{ color: "#4E68C2", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#8D9BB8", marginTop: "20px", lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <a href="/terms" style={{ color: "#4A5672" }}>Terms & Conditions</a> and{" "}
          <a href="/privacy" style={{ color: "#4A5672" }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
