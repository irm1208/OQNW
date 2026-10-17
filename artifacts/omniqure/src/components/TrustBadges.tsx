import { FlaskConical, Truck, ShieldCheck, Bitcoin } from "lucide-react";

const badges = [
  { icon: FlaskConical, label: "99%+ HPLC purity" },
  { icon: Truck, label: "Same-day dispatch" },
  { icon: ShieldCheck, label: "Discreet packaging" },
  { icon: Bitcoin, label: "Crypto accepted" },
];

export default function TrustBadges() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFF6F2 0%, #E8F2DE 100%)",
        borderTop: "1px solid #E8ECF1",
        borderBottom: "1px solid #E8ECF1",
      }}
      className="py-3 md:py-3.5"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2"
            >
              <badge.icon
                size={16}
                strokeWidth={2}
                style={{ color: "#3B62AB" }}
              />
              <span
                style={{
                  fontSize: "10.5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#2B3A52",
                  fontWeight: 600,
                }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
