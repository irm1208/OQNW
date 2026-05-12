import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, ChevronDown, ChevronRight, TrendingUp, PauseCircle, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function api(path: string) { return `/api${path}`; }
function apiFetch(url: string) {
  return fetch(url, { credentials: "include" }).then(r => {
    if (!r.ok) throw new Error("Request failed");
    return r.json();
  });
}

function formatGbp(val: number) { return `£${val.toFixed(2)}`; }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function intervalLabel(days: number) {
  if (days === 7) return "Weekly";
  if (days === 14) return "Fortnightly";
  if (days === 30) return "Monthly";
  if (days === 60) return "Every 2 mo";
  if (days === 90) return "Every 3 mo";
  return `${days}d`;
}

interface SubItem { productId: number; productName: string; quantity: number; priceGbp: number; }
interface Subscription {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  items: SubItem[];
  intervalDays: number;
  nextRenewalAt: string;
  discountPct: number;
  status: string;
  subtotal: number;
  discountedTotal: number;
  createdAt: string;
}
interface Stats { total: number; active: number; paused: number; mrr: number; }
interface ApiResponse { subscriptions: Subscription[]; stats: Stats; }

const STATUS_CONFIG: Record<string, { label: string; variant: "outline"; className: string; icon: React.ReactNode }> = {
  active:    { label: "Active",    variant: "outline", className: "text-green-700 border-green-200 bg-green-50",  icon: <CheckCircle2 className="w-3 h-3" /> },
  paused:    { label: "Paused",    variant: "outline", className: "text-yellow-700 border-yellow-200 bg-yellow-50", icon: <PauseCircle className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", variant: "outline", className: "text-red-700 border-red-200 bg-red-50",        icon: <XCircle className="w-3 h-3" /> },
};

export default function Subscriptions() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "cancelled">("all");

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["admin-subscriptions"],
    queryFn: () => apiFetch(api("/admin/subscriptions")) as Promise<ApiResponse>,
    refetchInterval: 60_000,
  });

  const toggle = (id: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) {
    return <div className="text-destructive text-sm">Failed to load subscriptions.</div>;
  }

  const { subscriptions = [], stats = { total: 0, active: 0, paused: 0, mrr: 0 } } = data ?? {};
  const filtered = statusFilter === "all" ? subscriptions : subscriptions.filter((s) => s.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">Recurring orders — auto-renewed with 5% discount</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Active", value: String(stats.active), icon: RefreshCw, color: "text-blue-600" },
          { label: "Paused", value: String(stats.paused), icon: PauseCircle, color: "text-yellow-600" },
          { label: "All Subscriptions", value: String(stats.total), icon: CheckCircle2, color: "text-slate-600" },
          { label: "Est. Monthly Revenue", value: formatGbp(stats.mrr), icon: TrendingUp, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "active", "paused", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors capitalize ${
              statusFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <RefreshCw className="w-8 h-8 opacity-30" />
          <p className="text-sm">No subscriptions found</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead>Total / renewal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <>
                  <TableRow
                    key={sub.id}
                    className="cursor-pointer"
                    onClick={() => toggle(sub.id)}
                  >
                    <TableCell className="pr-0">
                      {expanded.has(sub.id)
                        ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{sub.customerName}</div>
                      <div className="text-xs text-muted-foreground">{sub.customerEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.items.length} item{sub.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {intervalLabel(sub.intervalDays)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(sub.nextRenewalAt)}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm">{formatGbp(sub.discountedTotal)}</div>
                      <div className="text-xs text-muted-foreground line-through">{formatGbp(sub.subtotal)}</div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.active;
                        return (
                          <Badge variant={cfg.variant} className={`gap-1 ${cfg.className}`}>
                            {cfg.icon} {cfg.label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                  {expanded.has(sub.id) && (
                    <TableRow key={`${sub.id}-detail`} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell />
                      <TableCell colSpan={6} className="pb-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Items</div>
                        <table className="w-full text-sm max-w-lg">
                          <thead>
                            <tr className="text-xs text-muted-foreground">
                              <th className="text-left pb-1 font-medium">Product</th>
                              <th className="text-center pb-1 font-medium">Qty</th>
                              <th className="text-right pb-1 font-medium">Unit</th>
                              <th className="text-right pb-1 font-medium">Line (−{sub.discountPct}%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.items.map((item, i) => (
                              <tr key={i} className="border-t border-border/40">
                                <td className="py-1.5 text-sm">{item.productName}</td>
                                <td className="py-1.5 text-center text-muted-foreground">×{item.quantity}</td>
                                <td className="py-1.5 text-right text-muted-foreground">{formatGbp(item.priceGbp)}</td>
                                <td className="py-1.5 text-right font-medium">
                                  {formatGbp(item.priceGbp * item.quantity * (1 - sub.discountPct / 100))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-border">
                              <td colSpan={3} className="pt-2 text-xs text-muted-foreground font-medium">Total per renewal</td>
                              <td className="pt-2 text-right font-bold">{formatGbp(sub.discountedTotal)}</td>
                            </tr>
                          </tfoot>
                        </table>
                        <p className="text-xs text-muted-foreground mt-3">
                          Created {formatDate(sub.createdAt)} · Renews {intervalLabel(sub.intervalDays).toLowerCase()} · Next: {formatDate(sub.nextRenewalAt)}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
