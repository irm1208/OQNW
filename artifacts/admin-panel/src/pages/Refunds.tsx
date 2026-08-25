import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { RefreshCcw, Search, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type RefundRow = {
  id: number;
  orderId: number;
  orderNumber: string;
  amountGbp: number;
  type: string;
  reason: string;
  notes: string | null;
  restoreInventory: boolean;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Refunds() {
  const [search, setSearch] = useState("");

  const { data: refunds = [], isLoading } = useQuery<RefundRow[]>({
    queryKey: ["refunds"],
    queryFn: () => fetch(api("admin/refunds"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<RefundRow[]>; }),
  });

  const filtered = refunds.filter(r =>
    !search ||
    r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase())
  );

  const totalRefunded = refunds.reduce((s, r) => s + r.amountGbp, 0);
  const fullCount = refunds.filter(r => r.type === "full").length;
  const partialCount = refunds.filter(r => r.type === "partial").length;

  return (
    <div className="admin-page space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Refunds</h2>
        <p className="text-sm text-muted-foreground mt-1">All refunds issued from order detail pages</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Refunded</p>
          <p className="text-3xl font-bold text-red-600">£{totalRefunded.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Full Refunds</p>
          <p className="text-3xl font-bold">{fullCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Partial Refunds</p>
          <p className="text-3xl font-bold">{partialCount}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by order or reason…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <RefreshCcw className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">{search ? "No refunds match your search" : "No refunds issued yet"}</p>
            <p className="text-sm text-muted-foreground mt-1">Issue refunds from individual order pages</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reason</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inventory</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono font-medium">{r.orderNumber}</td>
                    <td className="px-4 py-3 font-bold text-red-600">£{r.amountGbp.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={r.type === "full" ? "text-red-600 border-red-200 bg-red-50" : "text-orange-600 border-orange-200 bg-orange-50"}>
                        {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate">{r.reason}</p>
                      {r.notes && <p className="text-xs text-muted-foreground truncate">{r.notes}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {r.restoreInventory
                        ? <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">Restored</Badge>
                        : <span className="text-muted-foreground text-xs">No</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/orders/${r.orderId}`} className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
