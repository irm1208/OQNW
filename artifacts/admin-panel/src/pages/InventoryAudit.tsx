import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Search, Download, TrendingDown, TrendingUp, RotateCcw, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type AuditEntry = {
  id: number;
  productId: number;
  productName: string;
  changeType: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string | null;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
};

const CHANGE_TYPE_CONFIG: Record<string, { label: string; color: string; icon: typeof TrendingDown }> = {
  sale: { label: "Sale", color: "text-red-600 border-red-200 bg-red-50", icon: TrendingDown },
  manual_adjustment: { label: "Manual", color: "text-blue-600 border-blue-200 bg-blue-50", icon: Wrench },
  return_restore: { label: "Return", color: "text-green-600 border-green-200 bg-green-50", icon: TrendingUp },
  refund_restore: { label: "Refund", color: "text-green-600 border-green-200 bg-green-50", icon: TrendingUp },
  restock: { label: "Restock", color: "text-purple-600 border-purple-200 bg-purple-50", icon: TrendingUp },
};

async function downloadCsv(url: string, filename: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href; a.download = filename; a.click();
  URL.revokeObjectURL(href);
}

export default function InventoryAudit() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [changeType, setChangeType] = useState("all");
  const [exporting, setExporting] = useState(false);

  const params = new URLSearchParams({ limit: "100" });
  if (changeType !== "all") params.set("changeType", changeType);

  const { data, isLoading } = useQuery<{ total: number; entries: AuditEntry[] }>({
    queryKey: ["inventory-audit", changeType],
    queryFn: () => fetch(api(`admin/inventory/audit-log?${params}`), { credentials: "include" }).then(r => r.json() as Promise<{ total: number; entries: AuditEntry[] }>),
  });

  const entries = (data?.entries ?? []).filter(e =>
    !search || e.productName.toLowerCase().includes(search.toLowerCase()) || (e.referenceId ?? "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleExport() {
    setExporting(true);
    try {
      await downloadCsv(api("admin/export/inventory-audit.csv"), `inventory-audit-${new Date().toISOString().slice(0, 10)}.csv`);
      toast({ title: "Export downloaded" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  const sales = entries.filter(e => e.changeType === "sale").reduce((s, e) => s + Math.abs(e.quantityChange), 0);
  const restores = entries.filter(e => e.changeType.includes("restore") || e.changeType === "restock").reduce((s, e) => s + e.quantityChange, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Audit Log</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete history of every stock change</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={exporting}>
          <Download className="w-4 h-4 mr-2" />
          {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Events</p>
          <p className="text-3xl font-bold">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Units Sold (filtered)</p>
          <p className="text-3xl font-bold text-red-600">{sales}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Units Restored (filtered)</p>
          <p className="text-3xl font-bold text-green-600">{restores}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search product or order…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={changeType} onValueChange={setChangeType}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="sale">Sales</SelectItem>
              <SelectItem value="manual_adjustment">Manual</SelectItem>
              <SelectItem value="return_restore">Returns</SelectItem>
              <SelectItem value="refund_restore">Refund Restores</SelectItem>
              <SelectItem value="restock">Restocks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No audit entries yet. They appear automatically when orders are placed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Change</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const cfg = CHANGE_TYPE_CONFIG[e.changeType] ?? { label: e.changeType, color: "text-gray-600 border-gray-200 bg-gray-50", icon: RotateCcw };
                  const Icon = cfg.icon;
                  return (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{e.productName}</p>
                        <p className="text-xs text-muted-foreground">ID: {e.productId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${cfg.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        <span className={e.quantityChange < 0 ? "text-red-600" : "text-green-600"}>
                          {e.quantityChange > 0 ? "+" : ""}{e.quantityChange}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.quantityBefore} → {e.quantityAfter}
                      </td>
                      <td className="px-4 py-3">
                        {e.referenceId ? (
                          <span className="font-mono text-xs">{e.referenceId}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                        {e.reason && <p className="text-xs text-muted-foreground truncate max-w-xs">{e.reason}</p>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
