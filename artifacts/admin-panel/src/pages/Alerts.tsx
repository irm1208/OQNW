import { useAlerts, type AdminAlert } from "@/hooks/useAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, RotateCcw, Package, ShoppingBag, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

const TYPE_CONFIG: Record<
  AdminAlert["type"],
  { label: string; icon: React.ElementType; color: string }
> = {
  order:  { label: "Order",   icon: ShoppingCart, color: "text-amber-500" },
  return: { label: "Return",  icon: RotateCcw,    color: "text-blue-500" },
  stock:  { label: "Stock",   icon: Package,      color: "text-red-500" },
  cart:   { label: "Cart",    icon: ShoppingBag,  color: "text-slate-500" },
  fraud:  { label: "Fraud",   icon: ShieldAlert,  color: "text-red-600" },
};

const SEVERITY_BADGE: Record<AdminAlert["severity"], string> = {
  danger:  "destructive",
  warning: "warning",
  info:    "secondary",
};

function AlertRow({ alert }: { alert: AdminAlert }) {
  const cfg = TYPE_CONFIG[alert.type];
  const Icon = cfg.icon;
  const timeAgo = formatTimeAgo(alert.createdAt);

  return (
    <Link href={alert.link}>
      <div className="flex items-start gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-b-0">
        <div className={`mt-0.5 ${cfg.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{alert.title}</span>
            <Badge variant={SEVERITY_BADGE[alert.severity] as "destructive" | "secondary" | "outline"}>
              {alert.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{alert.message}</p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{timeAgo}</span>
      </div>
    </Link>
  );
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();

  const grouped = {
    danger:  (alerts ?? []).filter((a) => a.severity === "danger"),
    warning: (alerts ?? []).filter((a) => a.severity === "warning"),
    info:    (alerts ?? []).filter((a) => a.severity === "info"),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (alerts ?? []).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <p className="font-medium">All clear — no alerts right now</p>
          </CardContent>
        </Card>
      )}

      {grouped.danger.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
              Critical ({grouped.danger.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            {grouped.danger.map((a) => <AlertRow key={a.id} alert={a} />)}
          </CardContent>
        </Card>
      )}

      {grouped.warning.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-amber-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Warnings ({grouped.warning.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            {grouped.warning.map((a) => <AlertRow key={a.id} alert={a} />)}
          </CardContent>
        </Card>
      )}

      {grouped.info.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Info ({grouped.info.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            {grouped.info.map((a) => <AlertRow key={a.id} alert={a} />)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
