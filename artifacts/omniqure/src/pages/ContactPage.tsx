import { useState } from "react";
import { Link } from "wouter";
import { Mail, ChevronRight, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

const EMAIL = "support@omniqure.com";

const SUBJECTS = [
  "Product / Order Question",
  "Certificate of Analysis (COA) Request",
  "Shipping & Tracking",
  "Returns & Refunds",
  "Wholesale / Bulk Enquiry",
  "Other",
];

export default function ContactPage() {
  useSEO({
    title: "Contact Us",
    description: "Get in touch with the OmniQure Peptide Research Institute team. Questions about orders, peptide specifications, COA documents, or reconstitution — we're here to help.",
    canonicalPath: "/contact",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.includes("@")) e.email = "Valid email required";
    if (message.trim().length < 10) e.message = "Please include a few more details (min 10 characters)";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject, message: message.trim() }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error ?? "Failed to send your message. Please try again.");
      }
    } catch {
      setSubmitError("Could not reach the server. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", padding: "40px 0 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>Contact Us</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.12)" }}>
              <MessageSquare size={20} style={{ color: "#93C5FD" }} />
            </div>
            <h1 className="font-bold text-white" style={{ fontSize: "clamp(22px, 4vw, 32px)" }}>
              Contact Us
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", maxWidth: "560px" }}>
            Questions about an order, a product's COA, or our research materials? Send us a message and our team will get back to you.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr,340px] gap-8">
        {/* Form */}
        <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5" }}>
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12">
              <div className="rounded-full flex items-center justify-center mb-4" style={{ width: "56px", height: "56px", backgroundColor: "#F0FDF4" }}>
                <CheckCircle2 size={28} style={{ color: "#16A34A" }} />
              </div>
              <h2 className="font-bold mb-2" style={{ fontSize: "18px", color: "#0F172A" }}>Message sent</h2>
              <p style={{ fontSize: "13px", color: "#64748B", maxWidth: "360px" }}>
                Thanks, {name.split(" ")[0] || "there"} — we've received your message and will reply within 1 business day.
              </p>
              <button
                onClick={() => { setSubmitted(false); setName(""); setEmail(""); setSubject(SUBJECTS[0]); setMessage(""); }}
                className="mt-6 rounded-lg font-semibold"
                style={{ fontSize: "13px", color: "#1240A0", padding: "8px 16px", border: "1.5px solid #BFDBFE", backgroundColor: "#EEF4FF" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="font-bold mb-1" style={{ fontSize: "18px", color: "#0F172A" }}>Send us a message</h2>
              <p className="mb-6" style={{ fontSize: "13px", color: "#64748B" }}>Fields marked with an asterisk are required.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Name *</label>
                  <input
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(({ name: _, ...rest }) => rest); }}
                    placeholder="Jane Smith"
                    style={{
                      width: "100%", height: "40px", padding: "0 12px", borderRadius: "8px",
                      border: `1.5px solid ${errors.name ? "#FCA5A5" : "#E2E8F0"}`, fontSize: "13px", color: "#0F172A", outline: "none",
                      backgroundColor: errors.name ? "#FFF5F5" : "#F8FAFC",
                    }}
                  />
                  {errors.name && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{errors.name}</p>}
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Email *</label>
                  <input
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(({ email: _, ...rest }) => rest); }}
                    placeholder="jane@example.com"
                    style={{
                      width: "100%", height: "40px", padding: "0 12px", borderRadius: "8px",
                      border: `1.5px solid ${errors.email ? "#FCA5A5" : "#E2E8F0"}`, fontSize: "13px", color: "#0F172A", outline: "none",
                      backgroundColor: errors.email ? "#FFF5F5" : "#F8FAFC",
                    }}
                  />
                  {errors.email && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{errors.email}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{
                    width: "100%", height: "40px", padding: "0 12px", borderRadius: "8px",
                    border: "1.5px solid #E2E8F0", fontSize: "13px", color: "#0F172A", outline: "none", backgroundColor: "#F8FAFC",
                  }}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Message *</label>
                <textarea
                  value={message}
                  onChange={e => { setMessage(e.target.value); setErrors(({ message: _, ...rest }) => rest); }}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "8px", resize: "vertical",
                    border: `1.5px solid ${errors.message ? "#FCA5A5" : "#E2E8F0"}`, fontSize: "13px", color: "#0F172A", outline: "none",
                    backgroundColor: errors.message ? "#FFF5F5" : "#F8FAFC", fontFamily: "'Arimo', Arial, sans-serif",
                  }}
                />
                {errors.message && <p style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px" }}>{errors.message}</p>}
              </div>

              {submitError && (
                <div className="rounded-lg mb-4 px-3 py-2" style={{ backgroundColor: "#FFF5F5", border: "1px solid #FCA5A5" }}>
                  <p style={{ fontSize: "12px", color: "#DC2626" }}>{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-lg font-bold"
                style={{
                  height: "44px", width: "100%", border: "none",
                  background: submitting ? "#94A3B8" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                  color: "#fff", fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Sending…" : (<>Send Message <Send size={15} /></>)}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
            <p className="font-bold mb-3" style={{ fontSize: "14px", color: "#1240A0" }}>Get in touch directly</p>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 mb-3" style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}>
              <Mail size={15} /> {EMAIL}
            </a>
            <div className="flex items-start gap-2" style={{ fontSize: "12px", color: "#475569" }}>
              <Clock size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>Monday–Friday, 9:00–17:00 GMT/BST<br />Response time: within 1 business day</span>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5" }}>
            <p className="font-bold mb-3" style={{ fontSize: "14px", color: "#0F172A" }}>Looking for something specific?</p>
            <div className="flex flex-col gap-2">
              <Link href="/track-order" style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}>Track an order →</Link>
              <Link href="/lab-tests" style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}>View COA & lab results →</Link>
              <Link href="/faq" style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}>Read the FAQ →</Link>
              <Link href="/shipping" style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}>Shipping policy →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
