import { useState } from "react";
import { Link } from "wouter";
import { Mail, Clock, Send, CheckCircle2, ArrowRight, Building2, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

const EMAIL = "support@omniqure.com";

const SUBJECTS = [
  "Product / Order Question",
  "Janoshik Report Question",
  "Shipping & Tracking",
  "Returns & Refunds",
  "Wholesale / Bulk Enquiry",
  "Other",
];

export default function ContactPage() {
  useSEO({
    title: "Contact Us",
    description: "Get in touch with the OmniQure team. Questions about orders, peptide specifications, Janoshik reports, or reconstitution — we're here to help.",
    canonicalPath: "/contact",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const name = `${firstName} ${lastName}`.trim();
  const [mode, setMode] = useState<"general" | "wholesale">("general");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.name = "First name is required";
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
        body: JSON.stringify({ name, email: email.trim(), subject: mode === "wholesale" ? "Wholesale / Bulk Enquiry" : subject, message: message.trim() }),
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

  const field = (err?: string) => ({
    borderColor: err ? "#FCA5A5" : "var(--hairline)",
    background: err ? "#FFF5F5" : "#fff",
    color: "var(--ink)",
  });
  const fieldCls = "w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--cobalt)]";
  const labelCls = "mb-1.5 block text-[12.5px] font-semibold";
  const card = "rounded-2xl border bg-white p-5";
  const hair = { borderColor: "var(--hairline)" } as const;

  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#fff" }}>
      <PageHero image={{ key: "hdr-contact", alt: "OmniQure vial beside a thank-you card" }} crumbs={[{ label: "Contact" }]} eyebrow="Get in touch" title="Research desk.">
        Questions about compounds, orders, Janoshik reports, wholesale pricing or institutional accounts. We respond within one business day.
      </PageHero>

      <section className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <div className="mb-4 grid grid-cols-2 rounded-xl border p-1" style={hair} role="tablist" aria-label="Enquiry type">
              {([["general", "General inquiry"], ["wholesale", "Wholesale / Institutional"]] as const).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={mode === k}
                  onClick={() => setMode(k)}
                  className="rounded-lg py-2.5 text-[13px] font-semibold transition-colors"
                  style={mode === k ? { background: "var(--ink)", color: "#fff" } : { color: "var(--graphite)" }}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border bg-white p-6 md:p-7" style={hair}>
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: "#F0FDF4" }}>
                    <CheckCircle2 size={28} style={{ color: "#16A34A" }} aria-hidden="true" />
                  </span>
                  <h2 className="mb-2 text-[18px] font-bold" style={{ color: "var(--ink)" }}>Message sent</h2>
                  <p className="max-w-sm text-[13px]" style={{ color: "var(--graphite)" }}>
                    Thanks, {firstName || "there"}. We've received your message and will reply within 1 business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setFirstName(""); setLastName(""); setEmail(""); setSubject(SUBJECTS[0]); setMessage(""); }}
                    className="mt-6 rounded-full border px-5 py-2 text-[13px] font-semibold transition-colors hover:bg-[#F4F6FA]"
                    style={{ ...hair, color: "var(--ink)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelCls} style={{ color: "var(--ink)" }}>First name</span>
                      <input value={firstName} autoComplete="given-name" placeholder="James" aria-invalid={!!errors.name}
                        onChange={(e) => { setFirstName(e.target.value); setErrors(({ name: _, ...rest }) => rest); }}
                        className={fieldCls} style={field(errors.name)} />
                      {errors.name && <span className="mt-1 block text-[11px]" style={{ color: "#DC2626" }}>{errors.name}</span>}
                    </label>
                    <label className="block">
                      <span className={labelCls} style={{ color: "var(--ink)" }}>Last name</span>
                      <input value={lastName} autoComplete="family-name" placeholder="Robertson"
                        onChange={(e) => setLastName(e.target.value)} className={fieldCls} style={field()} />
                    </label>
                  </div>
                  <label className="mt-4 block">
                    <span className={labelCls} style={{ color: "var(--ink)" }}>Email address</span>
                    <input type="email" value={email} autoComplete="email" placeholder="james@laboratory.com" aria-invalid={!!errors.email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(({ email: _, ...rest }) => rest); }}
                      className={fieldCls} style={field(errors.email)} />
                    {errors.email && <span className="mt-1 block text-[11px]" style={{ color: "#DC2626" }}>{errors.email}</span>}
                  </label>
                  {mode === "general" && (
                    <label className="mt-4 block">
                      <span className={labelCls} style={{ color: "var(--ink)" }}>Subject</span>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldCls} style={field()}>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  )}
                  <label className="mt-4 block">
                    <span className={labelCls} style={{ color: "var(--ink)" }}>Message</span>
                    <textarea value={message} rows={4} aria-invalid={!!errors.message}
                      placeholder={mode === "wholesale" ? "Tell us about your institution, compounds and expected volumes…" : "How can we help? Order questions, compound enquiries or anything else…"}
                      onChange={(e) => { setMessage(e.target.value); setErrors(({ message: _, ...rest }) => rest); }}
                      className={`${fieldCls} resize-y`} style={field(errors.message)} />
                    {errors.message && <span className="mt-1 block text-[11px]" style={{ color: "#DC2626" }}>{errors.message}</span>}
                  </label>
                  {submitError && (
                    <p role="alert" className="mt-4 rounded-lg border px-3 py-2 text-[12px]" style={{ borderColor: "#FCA5A5", background: "#FFF5F5", color: "#DC2626" }}>{submitError}</p>
                  )}
                  <button type="submit" disabled={submitting}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "var(--ink)" }}>
                    {submitting ? "Sending…" : <>Send message <ArrowRight size={15} aria-hidden="true" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className={card} style={hair}>
              <p className="mb-3 flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                <Clock size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> Response time
              </p>
              <dl className="divide-y text-[13px]" style={hair}>
                {[["General inquiries", "≤ 1 business day"], ["Order support", "≤ 1 business day"], ["Wholesale / institutional", "≤ 2 business days"]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5" style={hair}>
                    <dt style={{ color: "var(--graphite)" }}>{k}</dt>
                    <dd className="font-semibold" style={{ color: "var(--ink)" }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[11.5px]" style={{ color: "var(--graphite)" }}>Monday to Friday, 9:00–17:00 GMT/BST</p>
            </div>

            <div className={card} style={hair}>
              <p className="mb-3 flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                <Mail size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> Direct contact
              </p>
              <p className="uppercase" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--graphite)" }}>Support &amp; orders</p>
              <a href={`mailto:${EMAIL}`} className="mt-1 block text-[14px] font-medium hover:text-[var(--cobalt)]" style={{ color: "var(--ink)" }}>{EMAIL}</a>
              <div className="mt-4 flex flex-col gap-2 border-t pt-4 text-[13px]" style={hair}>
                {[["/track-order", "Track an order"], ["/lab-reports", "View Janoshik reports"], ["/faq", "Read the FAQ"], ["/shipping", "Shipping policy"]].map(([h, l]) => (
                  <Link key={h} href={h} className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--cobalt)]" style={{ color: "var(--graphite)" }}>
                    {l} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(59, 98, 171,0.15)", background: "#E3EEFC" }}>
              <p className="mb-2 flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                <Building2 size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> Wholesale accounts
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite)" }}>
                Research institutions, universities and registered laboratories can ask about volume pricing and dedicated account support.
              </p>
              <ul className="mt-3 space-y-2 text-[12.5px]" style={{ color: "var(--ink)" }}>
                {["Volume pricing on larger orders", "Bundle & Save free items on top", "Batch-specific Janoshik reports", "Direct contact with our team"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Sparkles size={13} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setMode("wholesale")} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "var(--cobalt)" }}>
                Start a wholesale enquiry <Send size={13} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
