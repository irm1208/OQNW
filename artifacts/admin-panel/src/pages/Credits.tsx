import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreditRow {
  customerId: number;
  balancePence: number;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
}

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

export default function Credits() {
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<CreditRow | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const { data: rows, isLoading } = useQuery<CreditRow[]>({
    queryKey: ["admin-credits"],
    queryFn: () => customFetch<CreditRow[]>(api("admin/credits")),
    staleTime: 30_000,
  });

  const fmt = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

  const filtered = (Array.isArray(rows) ? rows : []).filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  });

  const totalPence = (Array.isArray(rows) ? rows : []).reduce((s, r) => s + r.balancePence, 0);
  const adjustment = useMutation({
    mutationFn: async ({ customerId, amountPence, adjustmentReason }: { customerId: number; amountPence: number; adjustmentReason: string }) => {
      const response = await fetch(api(`admin/customers/${customerId}/credits`), {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPence, reason: adjustmentReason }),
      });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Could not apply credit adjustment");
      return payload;
    },
    onSuccess: () => {
      toast.success("Credit adjustment recorded");
      setAdjusting(null); setAmount(""); setReason("");
      void queryClient.invalidateQueries({ queryKey: ["admin-credits"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const submitAdjustment = (): void => {
    if (!adjusting) return;
    const amountPence = Number(amount);
    if (!Number.isInteger(amountPence) || amountPence === 0) { toast.error("Enter a non-zero whole-pence adjustment"); return; }
    if (amountPence < 0 && adjusting.balancePence + amountPence < 0) { toast.error("An adjustment cannot make the balance negative"); return; }
    if (!reason.trim() || reason.trim().length > 300) { toast.error("A reason of up to 300 characters is required"); return; }
    adjustment.mutate({ customerId: adjusting.customerId, amountPence, adjustmentReason: reason.trim() });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold tracking-tight">Customer Credits</h2><p className="mt-1 text-sm text-muted-foreground">Balances are ledger-backed. Corrections create a compensating adjustment; transactions cannot be edited or deleted.</p></div>
        <Card className="sm:min-w-48">
          <CardContent className="flex items-center gap-3 p-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Issued</p>
              <p className="font-bold text-lg leading-tight">{fmt(totalPence)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No credit balances found</p>
          ) : (
            <div className="divide-y">
              {filtered.map((row) => (
                <div data-admin-mobile-record key={row.customerId} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                  <Link href={`/customers/${row.customerId}`} className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm font-medium">{row.firstName} {row.lastName}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${row.balancePence > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                        {fmt(row.balancePence)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        updated {new Date(row.updatedAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </Link>
                  <Button size="sm" variant="outline" className="ml-4" onClick={() => { setAdjusting(row); setAmount(""); setReason(""); }}>Adjust</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!adjusting} onOpenChange={(open) => { if (!open && !adjustment.isPending) setAdjusting(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirm credit adjustment</DialogTitle><DialogDescription>This creates an immutable compensating ledger entry for {adjusting?.firstName} {adjusting?.lastName}; it does not alter historical transactions.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label htmlFor="credit-adjustment-amount">Amount (pence)</Label><Input id="credit-adjustment-amount" type="number" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 500 or -500" /></div>
            <div className="grid gap-2"><Label htmlFor="credit-adjustment-reason">Reason</Label><Textarea id="credit-adjustment-reason" value={reason} maxLength={300} onChange={(event) => setReason(event.target.value)} placeholder="Required audit reason" /></div>
          </div>
          <DialogFooter><Button variant="outline" disabled={adjustment.isPending} onClick={() => setAdjusting(null)}>Cancel</Button><Button disabled={adjustment.isPending} onClick={submitAdjustment}>{adjustment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm adjustment</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
