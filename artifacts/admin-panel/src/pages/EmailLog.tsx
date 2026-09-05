import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MailCheck, XCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function api(path: string) { return `/api${path}`; }
function apiFetch(url: string) {
  return fetch(url, { credentials: "include" }).then(r => {
    if (!r.ok) throw new Error("Request failed");
    return r.json();
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  order_confirmation: { label: "Order Confirmation", color: "text-blue-700 border-blue-200 bg-blue-50" },
  shipping:          { label: "Shipping",            color: "text-green-700 border-green-200 bg-green-50" },
  password_reset:    { label: "Password Reset",      color: "text-purple-700 border-purple-200 bg-purple-50" },
  return_update:     { label: "Return Update",       color: "text-orange-700 border-orange-200 bg-orange-50" },
  low_stock:         { label: "Low Stock",           color: "text-red-700 border-red-200 bg-red-50" },
  abandoned_cart:    { label: "Abandoned Cart",      color: "text-yellow-700 border-yellow-200 bg-yellow-50" },
  back_in_stock:     { label: "Back in Stock",       color: "text-teal-700 border-teal-200 bg-teal-50" },
  review_request:    { label: "Review Request",      color: "text-slate-700 border-slate-200 bg-slate-50" },
  referral_reward:   { label: "Referral Reward",     color: "text-pink-700 border-pink-200 bg-pink-50" },
};

const ALL_TYPES = Object.keys(TYPE_LABELS);

interface EmailLogEntry {
  id: number;
  toEmail: string;
  subject: string;
  type: string;
  status: string;
  resendId: string | null;
  orderNumber: string | null;
  createdAt: string;
}
interface Stats { total: number; sent: number; failed: number; }
interface ApiResponse { logs: EmailLogEntry[]; stats: Stats; }

export default function EmailLog() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading, error, refetch, isFetching } = useQuery<ApiResponse>({
    queryKey: ["admin-email-logs"],
    queryFn: () => apiFetch(api("/admin/email-logs")) as Promise<ApiResponse>,
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) {
    return <div className="text-destructive text-sm">Failed to load email logs.</div>;
  }

  const { logs = [], stats = { total: 0, sent: 0, failed: 0 } } = data ?? {};
  const filtered = typeFilter === "all" ? logs : logs.filter((l) => l.type === typeFilter);

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Log</h1>
          <p className="text-muted-foreground text-sm mt-1">All transactional emails sent by the platform</p>
        </div>
        <div className="page-actions">
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border rounded-md px-3 py-2 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total Sent", value: String(stats.total), icon: Mail, color: "text-slate-600" },
          { label: "Delivered", value: String(stats.sent), icon: MailCheck, color: "text-green-600" },
          { label: "Failed", value: String(stats.failed), icon: XCircle, color: "text-red-600" },
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

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter("all")}
          className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
            typeFilter === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:bg-muted"
          }`}
        >
          All
        </button>
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              typeFilter === t
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {TYPE_LABELS[t]?.label ?? t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <Mail className="w-8 h-8 opacity-30" />
          <p className="text-sm">No emails logged yet</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date / Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => {
                const typeCfg = TYPE_LABELS[log.type] ?? { label: log.type, color: "text-slate-700 border-slate-200 bg-slate-50" };
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap" data-label="Date / Time">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell data-label="Type">
                      <Badge variant="outline" className={`text-xs gap-1 ${typeCfg.color}`}>
                        {typeCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm" data-label="Recipient">{log.toEmail}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate" data-label="Subject">
                      {log.subject}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground" data-label="Order">
                      {log.orderNumber ?? "—"}
                    </TableCell>
                    <TableCell data-label="Status">
                      {log.status === "failed" ? (
                        <Badge variant="outline" className="gap-1 text-red-700 border-red-200 bg-red-50">
                          <XCircle className="w-3 h-3" /> Failed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-green-700 border-green-200 bg-green-50">
                          <MailCheck className="w-3 h-3" /> Sent
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
