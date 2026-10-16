import { useState, useEffect, useId } from "react";
import { X, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "wouter";

// ─── Jurisdiction definitions ────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "info";

interface JurisdictionRule {
  countries: string[];
  severity: Severity;
  flag: string;
  regionName: string;
  headline: string;
  body: string;
  requireAck?: boolean; // forces "I understand" click before dismissing
  learnMoreHref?: string;
}

const RULES: JurisdictionRule[] = [
  {
    countries: ["AU"],
    severity: "critical",
    flag: "🇦🇺",
    regionName: "Australia",
    headline: "TGA Schedule 4 Notice — Australia",
    body: "Under the Therapeutic Goods Act 1989, many peptides sold on this site (including BPC-157, TB-500, Ipamorelin, CJC-1295, Epithalon, and others) are classified as Schedule 4 prescription-only substances in Australia. These products are supplied strictly for in-vitro laboratory research only. You must comply with all applicable TGA regulations in your jurisdiction. It is your sole responsibility to verify the legal status of any compound before importing or possessing it in Australia.",
    requireAck: true,
    learnMoreHref: "/terms",
  },
  {
    countries: ["NZ"],
    severity: "critical",
    flag: "🇳🇿",
    regionName: "New Zealand",
    headline: "Medsafe Regulatory Notice — New Zealand",
    body: "In New Zealand, many peptides are classified as prescription medicines under the Medicines Act 1981 and regulated by Medsafe. Products including growth hormone peptides, GLP-1 receptor agonists, and thymosin derivatives may require a prescription for legal possession. All products are sold for in-vitro research use only. Verify the legal classification of any compound before importing it into New Zealand.",
    requireAck: true,
    learnMoreHref: "/terms",
  },
  {
    countries: ["US"],
    severity: "high",
    flag: "🇺🇸",
    regionName: "United States",
    headline: "FDA Research Use Only Notice — United States",
    body: "These products are not approved by the U.S. Food and Drug Administration (FDA). They are sold exclusively for in-vitro scientific research purposes and are not intended for human consumption, clinical use, or veterinary use. Certain compounds may be subject to additional federal or state regulations. You are solely responsible for ensuring compliance with all applicable U.S. laws before purchasing.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["CA"],
    severity: "high",
    flag: "🇨🇦",
    regionName: "Canada",
    headline: "Health Canada Notice — Canada",
    body: "In Canada, many peptides are regulated as Schedule F prescription drugs under the Food and Drug Regulations. These products are sold strictly for in-vitro laboratory research and are not for human use. You are responsible for verifying the regulatory status of all compounds under Health Canada's framework before importing or possessing them in Canada.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["DE", "AT"],
    severity: "medium",
    flag: "🇩🇪",
    regionName: "Germany / Austria",
    headline: "Arzneimittelgesetz (AMG) Notice — Germany & Austria",
    body: "Under the German Medicines Act (Arzneimittelgesetz), many research peptides may be classified as medicinal products and subject to strict regulation. These products are sold exclusively for in-vitro scientific research. Ensure compliance with applicable German and Austrian pharmaceutical law before purchasing.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["FR"],
    severity: "medium",
    flag: "🇫🇷",
    regionName: "France",
    headline: "Réglementation pharmaceutique — France",
    body: "En France, certains peptides de recherche peuvent être réglementés en tant que médicaments ou substances contrôlées. Tous les produits sont vendus exclusivement à des fins de recherche scientifique en laboratoire. Il est de votre responsabilité de vérifier la conformité avec la législation pharmaceutique française applicable.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["JP"],
    severity: "medium",
    flag: "🇯🇵",
    regionName: "Japan",
    headline: "Pharmaceutical & Medical Device Act Notice — Japan",
    body: "In Japan, research peptides may be subject to regulation under the Pharmaceutical and Medical Device Act (薬機法). These products are sold strictly for in-vitro laboratory research use only and are not approved by the PMDA for human use. You are responsible for verifying the legal status of all compounds before importing them into Japan.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["SG"],
    severity: "medium",
    flag: "🇸🇬",
    regionName: "Singapore",
    headline: "HSA Regulatory Notice — Singapore",
    body: "In Singapore, research chemicals including peptides may be regulated under the Health Products Act and administered by the Health Sciences Authority (HSA). These products are for in-vitro research use only. Please verify the regulatory classification of all products before importing them into Singapore.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["AE", "SA", "QA", "KW", "BH", "OM"],
    severity: "medium",
    flag: "🌍",
    regionName: "Gulf / Middle East",
    headline: "Regulatory Notice — Gulf Region",
    body: "Research chemicals including peptides are subject to strict pharmaceutical and controlled substance regulations in Gulf Cooperation Council countries. These products are sold for in-vitro laboratory research only. You are solely responsible for ensuring compliance with all applicable laws in your country before purchasing or importing these compounds.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
  {
    countries: ["NO", "SE", "DK", "FI"],
    severity: "info",
    flag: "🇸🇪",
    regionName: "Scandinavia",
    headline: "Nordic Pharmaceutical Notice",
    body: "Nordic countries apply strict pharmaceutical regulations. Many research peptides may require authorisation for import or possession in Norway, Sweden, Denmark, or Finland. All products are sold for in-vitro research use only. Please verify regulatory requirements in your jurisdiction before ordering.",
    requireAck: false,
    learnMoreHref: "/terms",
  },
];

// ─── Style helpers ────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<Severity, {
  bg: string; border: string; icon: string; iconBg: string; bar: string;
  headlineColor: string; bodyColor: string; btnBg: string; btnText: string;
}> = {
  critical: {
    bg: "#FEF2F2",
    border: "#FCA5A5",
    icon: "#DC2626",
    iconBg: "#FEE2E2",
    bar: "#DC2626",
    headlineColor: "#7F1D1D",
    bodyColor: "#991B1B",
    btnBg: "#DC2626",
    btnText: "#fff",
  },
  high: {
    bg: "#FFFBEB",
    border: "#FCD34D",
    icon: "#D97706",
    iconBg: "#FEF3C7",
    bar: "#D97706",
    headlineColor: "#78350F",
    bodyColor: "#92400E",
    btnBg: "#D97706",
    btnText: "#fff",
  },
  medium: {
    bg: "#FFF7ED",
    border: "#FDBA74",
    icon: "#EA580C",
    iconBg: "#FFEDD5",
    bar: "#EA580C",
    headlineColor: "#7C2D12",
    bodyColor: "#9A3412",
    btnBg: "#EA580C",
    btnText: "#fff",
  },
  info: {
    bg: "#E8F2DE",
    border: "#C8DDB4",
    icon: "#3D55A8",
    iconBg: "#E8F2DE",
    bar: "#3D55A8",
    headlineColor: "#1E3A8A",
    bodyColor: "#3D55A8",
    btnBg: "#3D55A8",
    btnText: "#fff",
  },
};

// ─── Dismiss key helpers ──────────────────────────────────────────────────────

const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getDismissKey(country: string) {
  return `omniqure_juris_dismissed_${country}`;
}

function isDismissed(country: string): boolean {
  try {
    const raw = localStorage.getItem(getDismissKey(country));
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return !isNaN(ts) && Date.now() - ts < DISMISS_TTL_MS;
  } catch { return false; }
}

function setDismissed(country: string) {
  try { localStorage.setItem(getDismissKey(country), String(Date.now())); } catch {}
}

// ─── Single banner ────────────────────────────────────────────────────────────

function Banner({ rule, onDismiss }: { rule: JurisdictionRule; onDismiss: () => void }) {
  const [acked, setAcked] = useState(!rule.requireAck);
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();
  const s = SEVERITY_STYLES[rule.severity];
  const Icon = rule.severity === "critical" ? ShieldAlert : rule.severity === "info" ? Info : AlertTriangle;

  return (
    <div
      role="alert"
      className="border-b"
      style={{ backgroundColor: rule.severity === "info" ? "#F2F0EB" : s.bg, borderColor: rule.severity === "info" ? "#E8ECF2" : s.border }}
    >
      <div className="mx-auto flex max-w-[1312px] items-start gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Icon size={15} className="mt-[3px] shrink-0" style={{ color: s.icon }} />
        <div className="min-w-0 flex-1">
          <p id={bodyId} className={expanded ? "" : "line-clamp-2 sm:line-clamp-none"} style={{ fontSize: 12.5, lineHeight: 1.55, color: rule.severity === "info" ? "#475569" : s.bodyColor }}>
            <span className="font-semibold" style={{ color: rule.severity === "info" ? "#1D2948" : s.headlineColor }}>{rule.headline}.</span>{" "}
            {rule.body}{" "}
            {rule.learnMoreHref && (
              <Link href={rule.learnMoreHref} className="font-medium underline underline-offset-2" style={{ color: s.icon }}>
                Read full terms
              </Link>
            )}
          </p>
          {!expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-expanded={false}
              aria-controls={bodyId}
              className="mt-0.5 font-medium underline underline-offset-2 sm:hidden"
              style={{ fontSize: 12, color: s.icon }}
            >
              More
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {rule.requireAck && !acked ? (
            <button
              onClick={() => setAcked(true)}
              className="rounded-full px-3 py-1 font-semibold transition-opacity hover:opacity-90"
              style={{ fontSize: 12, backgroundColor: s.btnBg, color: s.btnText }}
            >
              I understand
            </button>
          ) : (
            <button
              onClick={onDismiss}
              className="hidden rounded-full border px-3 py-1 font-medium transition-colors hover:bg-white sm:inline-flex"
              style={{ fontSize: 12, borderColor: "#D6DCE5", color: "#1D2948" }}
            >
              Acknowledge
            </button>
          )}
          {acked && (
            <button onClick={onDismiss} aria-label="Dismiss notice" className="rounded-full p-1 hover:opacity-70" style={{ color: "#64748B" }}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function JurisdictionWarning({
  onActiveChange,
}: {
  // Notifies the parent when this banner has a rule to show and isn't
  // dismissed, so lower-priority chrome (e.g. the marketing announcement bar)
  // can step aside instead of stacking underneath it.
  onActiveChange?: (active: boolean) => void;
}) {
  const { countryCode: geoCode } = useCurrency();
  const [dismissed, setDismissedState] = useState(false);
  const [rule, setRule] = useState<JurisdictionRule | null>(null);

  // ?preview_country=AU  →  forces that country's banner for testing
  const previewCode = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("preview_country")
    : null;

  const countryCode = previewCode ?? geoCode;

  useEffect(() => {
    if (!countryCode) return;

    const matched = RULES.find(r => r.countries.includes(countryCode));
    if (!matched) return;
    if (!previewCode && isDismissed(countryCode)) return;

    setRule(matched);
    setDismissedState(false);
  }, [countryCode, previewCode]);

  const active = !!rule && !dismissed;

  useEffect(() => {
    onActiveChange?.(active);
    return () => onActiveChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <Banner
      rule={rule!}
      onDismiss={() => {
        if (countryCode) setDismissed(countryCode);
        setDismissedState(true);
      }}
    />
  );
}
