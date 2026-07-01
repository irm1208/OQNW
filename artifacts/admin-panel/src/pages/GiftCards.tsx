import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type GiftCard = {
  id: number;
  code: string;
  amountGbp: number;
  remainingGbp: number;
  purchaserEmail: string;
  recipientEmail: string;
  recipientName: string | null;
  message: string | null;
  isActive: boolean;
  createdAt: string;
  redeemedAt: string | null;
};

type GiftCardsResponse = {
  stats: {
    totalIssued: number;
    totalValueGbp: number;
    redeemedGbp: number;
    outstandingGbp: number;
    activeCount: number;
  };
  cards: GiftCard[];
};

const gbp = (n: number) => `£${n.toFixed(2)}`;

export default function GiftCards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<GiftCardsResponse>({
    queryKey: ["gift-cards"],
    queryFn: () => fetch(api("admin/gift-cards"), { credentials: "include" }).then(r => r.json() as Promise<GiftCardsResponse>),
  });

  const deactivate = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/gift-cards/${id}/deactivate`), { method: "PATCH", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Gift card deactivated" });
      void queryClient.invalidateQueries({ queryKey: ["gift-cards"] });
    },
    onError: () => toast({ title: "Deactivation failed", variant: "destructive" }),
  });

  const stats = data?.stats;
  const cards = data?.cards ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gift Cards</h2>
        <p className="text-sm text-muted-foreground mt-1">Track issued gift cards and outstanding balances</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Issued</p>
          <p className="text-3xl font-bold">{stats?.totalIssued ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-3xl font-bold">{gbp(stats?.totalValueGbp ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Redeemed</p>
          <p className="text-3xl font-bold text-green-600">{gbp(stats?.redeemedGbp ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
          <p className="text-3xl font-bold text-amber-600">{gbp(stats?.outstandingGbp ?? 0)}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : cards.length === 0 ? (
          <div className="p-12 text-center">
            <Gift className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No gift cards issued yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Balance</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Recipient</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Purchaser</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map(c => {
                  const spent = c.amountGbp > 0;
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{gbp(c.remainingGbp)}</span>
                        <span className="text-muted-foreground text-xs"> / {gbp(c.amountGbp)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p>{c.recipientName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{c.recipientEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.purchaserEmail}</td>
                      <td className="px-4 py-3">
                        {c.isActive
                          ? <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4" /> Active</span>
                          : <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><XCircle className="w-4 h-4" /> Inactive</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.isActive && (
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={deactivate.isPending} onClick={() => deactivate.mutate(c.id)}>
                            Deactivate
                          </Button>
                        )}
                        {!spent && <Badge variant="outline" className="ml-1 text-xs">unused</Badge>}
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
