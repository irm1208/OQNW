import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, CreditCard, TrendingUp, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type GiftCardRow = {
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

type Stats = {
  totalIssued: number;
  totalValueGbp: number;
  redeemedGbp: number;
  outstandingGbp: number;
  activeCount: number;
};

type GiftCardsData = {
  stats: Stats;
  cards: GiftCardRow[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatGbp(v: number) {
  return `£${v.toFixed(2)}`;
}

export default function GiftCards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<GiftCardsData>({
    queryKey: ["gift-cards"],
    queryFn: () => fetch(api("admin/gift-cards"), { credentials: "include" }).then(r => r.json() as Promise<GiftCardsData>),
  });

  const deactivate = useMutation({
    mutationFn: async (id: number) => {
      const r = await fetch(api(`admin/gift-cards/${id}/deactivate`), { method: "PATCH", credentials: "include" });
      if (!r.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-cards"] });
      toast({ title: "Gift card deactivated" });
    },
    onError: () => toast({ title: "Error", description: "Could not deactivate gift card.", variant: "destructive" }),
  });

  const stats = data?.stats;
  const all = data?.cards ?? [];
  const filtered = search.trim()
    ? all.filter(c =>
        c.code.includes(search.toUpperCase()) ||
        c.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
        c.purchaserEmail.toLowerCase().includes(search.toLowerCase())
      )
    : all;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gift Cards</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage issued gift cards and their redemption status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Issued", value: String(stats?.totalIssued ?? 0), icon: Gift, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Active Cards", value: String(stats?.activeCount ?? 0), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Outstanding Balance", value: formatGbp(stats?.outstandingGbp ?? 0), icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
          { label: "Total Redeemed", value: formatGbp(stats?.redeemedGbp ?? 0), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.bg}`}>
            <div className="p-2 rounded-lg bg-white/60">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search code, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <Gift className="w-6 h-6 animate-pulse mr-2" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Gift className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-semibold text-foreground">No gift cards found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Gift cards appear here when customers purchase them from the store.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Recipient</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Purchaser</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Value</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Remaining</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Issued</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((card, i) => {
                  const isFullyUsed = card.remainingGbp <= 0;
                  const isPartial = card.remainingGbp > 0 && card.remainingGbp < card.amountGbp;
                  return (
                    <tr key={card.id} className={`${i < filtered.length - 1 ? "border-b" : ""} hover:bg-muted/20 transition-colors ${!card.isActive ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-foreground">{card.code}</span>
                        {card.message && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate" title={card.message}>"{card.message}"</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>
                          {card.recipientName && <p className="font-medium text-foreground text-xs">{card.recipientName}</p>}
                          <p className="text-xs text-muted-foreground">{card.recipientEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{card.purchaserEmail}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{formatGbp(card.amountGbp)}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className={`font-semibold ${isFullyUsed ? "text-muted-foreground line-through" : isPartial ? "text-amber-600" : "text-green-600"}`}>
                          {formatGbp(card.remainingGbp)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {!card.isActive ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 text-xs">
                            <XCircle className="w-3 h-3 mr-1" />Deactivated
                          </Badge>
                        ) : isFullyUsed ? (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                            Fully Used
                          </Badge>
                        ) : isPartial ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            Partially Used
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />Active
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(card.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {card.isActive && !isFullyUsed && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7"
                            onClick={() => deactivate.mutate(card.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
