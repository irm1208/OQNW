import type { ReactNode } from "react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function PageHero({
  crumbs,
  eyebrow,
  icon: Icon,
  title,
  children,
  aside,
  center = false,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  icon?: LucideIcon;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  center?: boolean;
}) {
  const trail = crumbs ?? [];
  return (
    <section className="border-b" style={{ borderColor: "var(--hairline)", background: "rgba(244,246,250,0.2)" }}>
      <div className={`w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 pt-10 pb-9 lg:pt-14 lg:pb-11 ${center ? "text-center" : ""}`}>
        {trail.length > 0 && (
          <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 mb-5 ${center ? "justify-center" : ""}`}>
            <Link href="/" className="uppercase hover:text-[var(--ink)]" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)", textDecoration: "none" }}>
              Home
            </Link>
            {trail.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <span aria-hidden="true" style={{ fontSize: 10, color: "rgba(74,85,104,0.4)" }}>/</span>
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="uppercase hover:text-[var(--ink)]" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)", textDecoration: "none" }}>
                    {c.label}
                  </Link>
                ) : (
                  <span className="uppercase" aria-current="page" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink)" }}>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className={aside ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end" : ""}>
          <div>
            {eyebrow && (
              <p className={`uppercase mb-3 flex items-center gap-1.5 ${center ? "justify-center" : ""}`} style={{ fontSize: 11, fontWeight: 500, lineHeight: 1, letterSpacing: "0.12em", color: "var(--cobalt)" }}>
                {Icon && <Icon size={14} aria-hidden="true" />}
                {eyebrow}
              </p>
            )}
            <h1 className="font-bold" style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "var(--ink)", margin: 0 }}>
              {title}
            </h1>
            {children && (
              <div className={`mt-4 max-w-2xl ${center ? "mx-auto" : ""}`} style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--graphite)" }}>
                {children}
              </div>
            )}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
