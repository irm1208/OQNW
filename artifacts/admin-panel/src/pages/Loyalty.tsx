import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, Star, TrendingUp, Users, Award, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

const TIERS = [
  { name: "Bronze", min: 0,    color: "#CD7F32", bg: "#FEF3C7" },
  { name: "Silver", min: 500,  color: "#9CA3AF", bg: "#F3F4F6" },
  { name: "Gold",   min: 2000, color: "#F59E0B", bg: "#FFFBEB" },
];

function getTier(lifetime: number) {
  return [...TIERS].reverse().find(t => lifetime >= t.min) ?? TIERS[0];
}

type CustomerRow = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  lifetimeEarned: number;
  transactionCount: number;
};

type Stats = {
  totalEarned: number;
  totalRedeemed: number;
  totalOutstanding: number;
  membersWithPoints: number;
};

type OverviewData = {
  customers: CustomerRow[];
  stats: Stats;
};

export default function Loyalty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adjustModal, setAdjustModal] = useState<CustomerRow | null>(null);
  const [adjustPoints, setAdjustPoints] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [sortKey, setSortKey] = useState<keyof CustomerRow>("balance");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useQuery<OverviewData>({
    queryKey: ["loyalty-overview"],
    queryFn: () =>
      fetch(api("admin/loyalty/overview"), { credentials: "include" })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<OverviewData>; }),
  });

  const adjust = useMutation({
    mutationFn: (body: { customerId: number; points: number; reason: string }) =>
      fetch(api("admin/loyalty/adjust"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    onSuccess: () => {
      toast({ title: "Points adjusted successfully" });
      queryClient.invalidateQueries({ queryKey: ["loyalty-overview"] });
      setAdjustModal(null);
      setAdjustPoints("");
      setAdjustReason("");
    },
    onError: () => toast({ title: "Failed to adjust points", variant: "destructive" }),
  });

  function handleSort(key: keyof CustomerRow) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = [...(data?.customers ?? [])].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === "string" ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const stats = data?.stats;

  function handleAdjustSubmit() {
    if (!adjustModal) return;
    const pts = Number(adjustPoints);
    if (!Number.isInteger(pts) || pts === 0) { toast({ title: "Enter a non-zero whole point value", variant: "destructive" }); return; }
    if (pts < 0 && adjustModal.balance + pts < 0) { toast({ title: "Adjustment cannot make the balance negative", variant: "destructive" }); return; }
    if (!adjustReason.trim()) { toast({ title: "Reason is required", variant: "destructive" }); return; }
    adjust.mutate({ customerId: adjustModal.id, points: pts, reason: adjustReason.trim() });
  }

  const SortIcon = ({ col }: { col: keyof CustomerRow }) => (
    sortKey === col
      ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3 inline ml-1" /> : <ChevronUp className="w-3 h-3 inline ml-1" />)
      : null
  );

  return (
    <div className="admin-page space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Loyalty Programme</h1>
        <p className="text-muted-foreground text-sm mt-1">
          1 point per £1 spent · 100 points = £1 reward · Tiers: Bronze (0+), Silver (500+), Gold (2000+)
        </p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        Point history is an immutable ledger. Use a reasoned compensating adjustment only; earned and redeemed transactions are never edited or deleted.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Points Issued",     value: stats?.totalEarned?.toLocaleString() ?? "—",       icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-600"  },
          { label: "Points Redeemed",         value: stats?.totalRedeemed?.toLocaleString() ?? "—",     icon: <Gift className="w-5 h-5" />,       color: "text-green-600" },
          { label: "Outstanding Balance",     value: stats?.totalOutstanding?.toLocaleString() ?? "—",  icon: <Star className="w-5 h-5" />,       color: "text-amber-500" },
          { label: "Members with Points",     value: stats?.membersWithPoints?.toLocaleString() ?? "—", icon: <Users className="w-5 h-5" />,      color: "text-purple-600"},
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-5">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <p className="text-2xl font-bold">{isLoading ? "…" : s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Customer table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Member Balances
          </h2>
          <span className="text-sm text-muted-foreground">{sorted.length} members</span>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No loyalty transactions yet. Points are awarded automatically when orders are placed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  {[
                    { key: "firstName" as const, label: "Customer" },
                    { key: "email"     as const, label: "Email" },
                    { key: "balance"   as const, label: "Balance" },
                    { key: "lifetimeEarned" as const, label: "Lifetime Earned" },
                  ].map(col => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      <button
                        className="min-h-11 -my-3 inline-flex items-center hover:text-foreground"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}<SortIcon col={col.key} />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground">Tier</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground">GBP Value</th>
                  <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map(c => {
                  const tier = getTier(c.lifetimeEarned);
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium" data-label="Customer">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-3 text-muted-foreground" data-label="Email">{c.email}</td>
                      <td className="px-4 py-3 font-bold tabular-nums" data-label="Balance">{c.balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums" data-label="Lifetime Earned">{c.lifetimeEarned.toLocaleString()}</td>
                      <td className="px-4 py-3" data-label="Tier">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ backgroundColor: tier.bg, color: tier.color }}
                        >
                          {tier.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-green-700" data-label="GBP Value">
                        £{(c.balance / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right" data-label="Actions">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setAdjustModal(c); setAdjustPoints(""); setAdjustReason(""); }}
                        >
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!adjustModal} onOpenChange={open => { if (!open) setAdjustModal(null); }}>
        {adjustModal && (
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm point adjustment</DialogTitle>
              <DialogDescription>
                This creates an immutable compensating entry for {adjustModal.firstName} {adjustModal.lastName}. Current balance: <strong>{adjustModal.balance}</strong> pts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Points adjustment</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setAdjustPoints(v => { const n = parseInt(v) || 0; return String(Math.abs(n)); })}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setAdjustPoints(v => { const n = parseInt(v) || 0; return String(-Math.abs(n)); })}
                    className="gap-1"
                  >
                    <Minus className="w-3 h-3" /> Deduct
                  </Button>
                </div>
                <Input
                  type="number"
                  value={adjustPoints}
                  onChange={e => setAdjustPoints(e.target.value)}
                  placeholder="e.g. 500 (add) or -200 (deduct)"
                />
                {adjustPoints && !isNaN(parseInt(adjustPoints)) && (
                  <p className="text-xs text-muted-foreground">
                    New balance: <strong>{adjustModal.balance + parseInt(adjustPoints)} pts</strong>
                    {" "}(£{((adjustModal.balance + parseInt(adjustPoints)) / 100).toFixed(2)})
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Reason <span className="text-muted-foreground font-normal">(visible in transaction history)</span></Label>
                <Input
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Compensation for delayed order"
                />
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAdjustModal(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAdjustSubmit} disabled={adjust.isPending}>
                {adjust.isPending ? "Saving…" : "Confirm Adjustment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
