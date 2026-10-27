import type { ReactNode } from "react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";

type Crumb = { label: string; href?: string };

/** A Sunburst page header: `key` names /sunburst/hdr-<key> in three sizes
    (1920x640, 1200x400 and a 900x1125 phone composition). */
/** `fit: "center"` for packaging and card photographs, whose subject is
    centred; the default suits the 3:1 headers with the product on the left. */
export type HeroImage = { key: string; alt: string; fit?: "left" | "center" };

export function HeroPicture({ image, className = "" }: { image: HeroImage; className?: string }) {
  const base = `/sunburst/${image.key}`;
  return (
    <picture className={className} data-fit={image.fit ?? "left"}>
      <source media="(max-width: 639px)" srcSet={`${base}-mobile.webp`} width={900} height={1125} />
      <source media="(max-width: 1279px)" srcSet={`${base}-md.webp`} width={1200} height={400} />
      <img src={`${base}.webp`} alt={image.alt} width={1920} height={640} decoding="async" fetchPriority="high" />
    </picture>
  );
}

export default function PageHero({
  crumbs,
  eyebrow,
  icon: Icon,
  title,
  children,
  aside,
  center = false,
  image,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  icon?: LucideIcon;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  center?: boolean;
  image?: HeroImage;
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
        <div className={image ? "page-hero--image" : aside ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end" : ""}>
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
            {/* With a photograph, the aside stays in the text column */}
            {image && aside && <div className="mt-6">{aside}</div>}
          </div>
          {image ? <div className="page-hero__media"><HeroPicture image={image} /></div> : aside}
        </div>
      </div>
    </section>
  );
}
