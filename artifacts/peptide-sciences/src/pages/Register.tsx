import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, User, Building2, FlaskConical, CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useCustomerAuth();
  const refCode = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("ref") ?? undefined
    : undefined;
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", institution: "", password: "", confirm: "",
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
      navigate("/");
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
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
          color: "#94A3B8", pointerEvents: "none", display: "flex",
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
            border: `1.5px solid ${errors[key] ? "#FCA5A5" : "#E2E8F0"}`,
            fontSize: "14px", color: "#0F172A", outline: "none",
            backgroundColor: errors[key] ? "#FFF5F5" : "#F8FAFC",
            boxSizing: "border-box" as const,
            transition: "border-color 0.15s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#1B5CB5")}
          onBlur={e => (e.currentTarget.style.borderColor = errors[key] ? "#FCA5A5" : "#E2E8F0")}
        />
        {extra}
      </div>
      {errors[key] && (
        <p style={{ fontSize: "11.5px", color: "#DC2626", marginTop: "4px" }}>{errors[key]}</p>
      )}
    </div>
  );

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
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Heading */}
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
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>
            Join OmniQure and access 81 research-grade peptides.
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
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#94A3B8", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px",
                    border: `1.5px solid ${errors.password ? "#FCA5A5" : "#E2E8F0"}`,
                    fontSize: "14px", color: "#0F172A", outline: "none",
                    backgroundColor: errors.password ? "#FFF5F5" : "#F8FAFC",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#1B5CB5")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#FCA5A5" : "#E2E8F0")}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0, display: "flex" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: "11.5px", color: "#DC2626", marginTop: "4px" }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                Confirm password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                  color: "#94A3B8", pointerEvents: "none",
                }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Re-enter your password"
                  style={{
                    width: "100%", height: "44px", paddingLeft: "38px", paddingRight: "42px",
                    borderRadius: "10px",
                    border: `1.5px solid ${errors.confirm ? "#FCA5A5" : "#E2E8F0"}`,
                    fontSize: "14px", color: "#0F172A", outline: "none",
                    backgroundColor: errors.confirm ? "#FFF5F5" : "#F8FAFC",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#1B5CB5")}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.confirm ? "#FCA5A5" : "#E2E8F0")}
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0, display: "flex" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirm && <p style={{ fontSize: "11.5px", color: "#DC2626", marginTop: "4px" }}>{errors.confirm}</p>}
            </div>

            {/* Age + RUO agreement */}
            <div
              style={{
                backgroundColor: "#F8FAFF",
                border: `1.5px solid ${errors.agreed ? "#FCA5A5" : "#DBEAFE"}`,
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
                border: `2px solid ${agreed ? "#1B5CB5" : "#CBD5E1"}`,
                backgroundColor: agreed ? "#1B5CB5" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {agreed && <CheckCircle2 size={13} color="#fff" strokeWidth={3} />}
              </div>
              <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                I confirm I am <strong>18 years of age or older</strong> and a qualified researcher. I understand OmniQure products are for <strong>Research Use Only</strong> and not intended for human or veterinary use.
              </p>
            </div>
            {errors.agreed && <p style={{ fontSize: "11.5px", color: "#DC2626", marginTop: "-8px" }}>{errors.agreed}</p>}

            {errors.submit && (
              <p style={{ fontSize: "13px", color: "#DC2626", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 12px", margin: 0 }}>
                {errors.submit}
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
                marginTop: "4px",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", margin: "24px 0 0" }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "#1B5CB5", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginTop: "20px", lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <a href="/terms" style={{ color: "#64748B" }}>Terms & Conditions</a> and{" "}
          <a href="/privacy" style={{ color: "#64748B" }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
