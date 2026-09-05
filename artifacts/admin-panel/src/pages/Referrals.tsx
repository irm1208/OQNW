import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Loader2, Search, Share2 } from "lucide-react";
import { toast } from "sonner";

type Person = { id: number; name: string; email: string } | null;
type Reward = { id: number | string; status: string; beneficiaryRole: string | null; amountGbp: number; remainingAmountGbp: number; historical: boolean; statusReason: string | null; lastAdminActor: string | null; createdAt: string; earnedAt?: string | null; heldAt?: string | null; voidedAt?: string | null; redeemedAt?: string | null; beneficiary: Person; referredCustomer: Person; referrer?: Person; qualifyingOrder: { orderNumber: string; status: string } | null; redemptions?: { id: number; amountGbp: number; createdAt: string; order: { orderNumber: string; status: string } | null }[] };
type Response = { stats: Record<string, number>; referrals: Reward[] };
const tabs = ["all", "pending", "earned", "held", "redeemed", "voided", "legacy", "untracked"];
const pounds = (v: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(v);

async function changeReward(id: number, action: string, reason: string) {
  const response = await fetch(`/api/admin/referrals/${id}/${action}`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }) });
  const payload = await response.json().catch(() => null) as { error?: string };
  if (!response.ok) throw new Error(payload?.error ?? "Could not update reward");
}

export default function Referrals() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [editing, setEditing] = useState<{ id: number; action: string } | null>(null);
  const [reason, setReason] = useState("");
  const client = useQueryClient();
  useEffect(() => { const timer = setTimeout(() => setTerm(search), 300); return () => clearTimeout(timer); }, [search]);
  const query = useQuery<Response>({ queryKey: ["referrals", status, term], queryFn: () => customFetch(`/api/admin/referrals?${new URLSearchParams({ status, ...(term ? { search: term } : {}) })}`), staleTime: 30_000 });
  const mutation = useMutation({ mutationFn: ({ id, action, reason }: { id: number; action: string; reason: string }) => changeReward(id, action, reason), onSuccess: () => { toast.success("Referral reward updated"); setEditing(null); setReason(""); void client.invalidateQueries({ queryKey: ["referrals"] }); }, onError: (e: Error) => toast.error(e.message) });
  const rows = query.data?.referrals ?? [];
  return <div className="admin-page space-y-6">
    <div className="flex items-center gap-3"><Share2 className="h-6 w-6 text-primary" /><div><h2 className="text-2xl font-bold">Referral rewards</h2><p className="text-sm text-muted-foreground">Ledger records become earned when the qualifying order ships.</p></div></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[["Ledger rewards", "total"], ["Earned", "earned"], ["Held", "held"], ["Compatibility balance", "outstandingCreditGbp"]].map(([label, key]) => <Card key={key}><CardContent className="py-4"><p className="text-2xl font-bold">{key === "outstandingCreditGbp" ? pounds(query.data?.stats[key] ?? 0) : query.data?.stats[key] ?? "—"}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}
    </div>
    <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">Historical buckets preserve pre-ledger balances and are redeemable, but cannot be edited. Untracked relationships deliberately have no manufactured reward.</div>
    <div className="flex flex-col justify-between gap-3 border-b sm:flex-row"><div className="flex flex-wrap gap-1">{tabs.map(tab => <Button key={tab} variant="ghost" onClick={() => setStatus(tab)} className={status === tab ? "border-b-2 border-primary rounded-none" : ""}>{tab[0].toUpperCase() + tab.slice(1)}</Button>)}</div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or reason" /></div></div>
    <div className="overflow-x-auto rounded-md border bg-card"><Table><TableHeader><TableRow><TableHead>Beneficiary / role</TableHead><TableHead>Reward</TableHead><TableHead>Qualifying order</TableHead><TableHead>Status</TableHead><TableHead>Reason / audit</TableHead><TableHead>Controls</TableHead></TableRow></TableHeader><TableBody>
      {query.isLoading ? <TableRow><TableCell colSpan={6} className="h-28 text-center"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow> : query.isError ? <TableRow><TableCell colSpan={6} className="h-28 text-center text-destructive"><AlertCircle className="mx-auto mb-2" />Could not load referral ledger</TableCell></TableRow> : rows.length === 0 ? <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No referral records match this filter.</TableCell></TableRow> : rows.map(row => <TableRow key={row.id}>
        <TableCell data-label="Beneficiary / role">{row.beneficiary ? <Link className="font-medium text-primary hover:underline" href={`/customers/${row.beneficiary.id}`}>{row.beneficiary.name}</Link> : <span className="text-muted-foreground">No beneficiary</span>}<div className="text-xs text-muted-foreground">{row.beneficiary?.email} {row.beneficiaryRole && `· ${row.beneficiaryRole}`}</div>{row.referrer && <div className="text-xs">Referrer: <Link className="text-primary hover:underline" href={`/customers/${row.referrer.id}`}>{row.referrer.name}</Link></div>}{row.referredCustomer && <div className="text-xs">Referred: <Link className="text-primary hover:underline" href={`/customers/${row.referredCustomer.id}`}>{row.referredCustomer.name}</Link></div>}</TableCell>
        <TableCell data-label="Reward">{pounds(row.amountGbp)}<div className="text-xs text-muted-foreground">Remaining {pounds(row.remainingAmountGbp)}{row.historical ? " · historical" : ""}</div>{row.redemptions?.map(redemption => <div key={redemption.id} className="mt-1 text-xs text-muted-foreground">Used {pounds(redemption.amountGbp)}{redemption.order ? ` on ${redemption.order.orderNumber}` : ""} · {new Date(redemption.createdAt).toLocaleDateString("en-GB")}</div>)}</TableCell>
        <TableCell data-label="Qualifying order">{row.qualifyingOrder ? <><span className="font-mono text-xs">{row.qualifyingOrder.orderNumber}</span><div className="text-xs text-muted-foreground">{row.qualifyingOrder.status}</div></> : "—"}<div className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleDateString("en-GB")}</div></TableCell>
        <TableCell data-label="Status"><Badge variant="outline">{row.status}</Badge></TableCell><TableCell className="max-w-52 text-xs" data-label="Reason / audit">{row.statusReason ?? "—"}{row.lastAdminActor && <div className="mt-1 text-muted-foreground">by {row.lastAdminActor}</div>}<div className="mt-1 text-muted-foreground">{row.earnedAt && `Earned ${new Date(row.earnedAt).toLocaleDateString("en-GB")}`}{row.heldAt && ` Held ${new Date(row.heldAt).toLocaleDateString("en-GB")}`}{row.voidedAt && ` Voided ${new Date(row.voidedAt).toLocaleDateString("en-GB")}`}{row.redeemedAt && ` Redeemed ${new Date(row.redeemedAt).toLocaleDateString("en-GB")}`}</div></TableCell>
        <TableCell data-label="Controls">{typeof row.id === "number" && !row.historical && row.status === "held" ? <Button size="sm" variant="outline" onClick={() => setEditing({ id: row.id as number, action: "release" })}>Release</Button> : typeof row.id === "number" && !row.historical && ["pending", "earned"].includes(row.status) ? <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setEditing({ id: row.id as number, action: "hold" })}>Hold</Button><Button size="sm" variant="destructive" onClick={() => setEditing({ id: row.id as number, action: "void" })}>Void</Button></div> : "—"}</TableCell>
      </TableRow>)}</TableBody></Table></div>
    <Dialog open={!!editing} onOpenChange={open => { if (!open) { setEditing(null); setReason(""); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm {editing?.action} reward</DialogTitle>
          <DialogDescription>This action is recorded in the referral ledger and audit log. A reason is required.</DialogDescription>
        </DialogHeader>
        <Textarea autoFocus value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for this action" aria-label="Reason for this action" />
        <DialogFooter>
          <Button variant="outline" onClick={() => { setEditing(null); setReason(""); }}>Cancel</Button>
          <Button disabled={!editing || !reason.trim() || mutation.isPending} variant={editing?.action === "void" ? "destructive" : "default"} onClick={() => { if (editing) mutation.mutate({ ...editing, reason }); }}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm {editing?.action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}