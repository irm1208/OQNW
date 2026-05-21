import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShieldAlert, ShieldCheck, Shield, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const FLAG_META: Record<string, { label: string; color: string }> = {
  vpn_proxy_detected:          { label: "VPN / Proxy",        color: "bg-red-100 text-red-700 border-red-200" },
  ip_country_mismatch:         { label: "IP ≠ Ship Country",  color: "bg-red-100 text-red-700 border-red-200" },
  multiple_orders_same_hour:   { label: "Order Flood",         color: "bg-red-100 text-red-700 border-red-200" },
  high_value_first_order:      { label: "High Value 1st Order",color: "bg-orange-100 text-orange-700 border-orange-200" },
  new_account:                 { label: "New Account",         color: "bg-orange-100 text-orange-700 border-orange-200" },
  repeated_orders_short_window:{ label: "Repeated Orders",     color: "bg-orange-100 text-orange-700 border-orange-200" },
  high_value_international:    { label: "High Value Intl",     color: "bg-orange-100 text-orange-700 border-orange-200" },
  cryptocurrency_payment:      { label: "Crypto Payment",      color: "bg-orange-100 text-orange-700 border-orange-200" },
  po_box_address:              { label: "PO Box",              color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  bank_transfer_payment:       { label: "Bank Transfer",       color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  elevated_value_first_order:  { label: "Elevated 1st Order",  color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  email_alias_pattern:         { label: "Email Alias",         color: "bg-slate-100 text-slate-600 border-slate-200" },
  free_email_provider:         { label: "Free Email",          color: "bg-slate-100 text-slate-600 border-slate-200" },
};

interface FraudOrder {
  id: number;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  country: string | null;
  totalGbp: number;
  fraudScore: number;
  fraudFlags: string[];
  fraudReviewed: boolean;
  fraudReviewNote: string | null;
  notes: string | null;
  createdAt: string;
}

interface FraudStats {
  total: number;
  highRisk: number;
  mediumRisk: number;
  reviewed: number;
}

interface FraudResponse {
  orders: FraudOrder[];
  stats: FraudStats;
}

function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 50;
  const isMed = score >= 25;
  return (
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
        isHigh
          ? "bg-red-100 text-red-700 ring-2 ring-red-300"
          : isMed
          ? "bg-orange-100 text-orange-700 ring-2 ring-orange-300"
          : "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200"
      }`}
    >
      {score}
    </div>
  );
}

function FlagChips({ flags }: { flags: string[] }) {
  if (!flags.length) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map(f => {
        const meta = FLAG_META[f] ?? { label: f, color: "bg-slate-100 text-slate-600 border-slate-200" };
        return (
          <span
            key={f}
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border ${meta.color}`}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

const TABS = [
  { key: "all",        label: "All" },
  { key: "unreviewed", label: "Unreviewed" },
  { key: "high",       label: "High Risk" },
  { key: "reviewed",   label: "Reviewed" },
];

export default function Fraud() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("unreviewed");
  const [reviewingOrder, setReviewingOrder] = useState<FraudOrder | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function buildQueryString() {
    const params = new URLSearchParams({ minScore: "20" });
    if (activeTab === "unreviewed") params.set("reviewed", "false");
    if (activeTab === "reviewed")   params.set("reviewed", "true");
    if (activeTab === "high")       params.set("minScore", "50");
    return params.toString();
  }

  const queryKey = ["fraud-queue", activeTab];

  const { data, isLoading } = useQuery<FraudResponse>({
    queryKey,
    queryFn: () => customFetch<FraudResponse>(`/api/admin/fraud?${buildQueryString()}`),
    staleTime: 30_000,
  });

  const statsQuery = useQuery<FraudResponse>({
    queryKey: ["fraud-stats"],
    queryFn: () => customFetch<FraudResponse>("/api/admin/fraud?minScore=20"),
    staleTime: 60_000,
  });

  const stats = statsQuery.data?.stats;
  const orders = data?.orders ?? [];

  async function handleReview(reviewed: boolean) {
    if (!reviewingOrder) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/fraud/${reviewingOrder.id}/review`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewed, note: reviewNote.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(reviewed ? "Marked as reviewed — safe" : "Marked as confirmed fraud");
      queryClient.invalidateQueries({ queryKey: ["fraud-queue"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-stats"] });
      setReviewingOrder(null);
      setReviewNote("");
    } catch {
      toast.error("Failed to update review status");
    } finally {
      setSubmitting(false);
    }
  }

  async function quickReview(order: FraudOrder, reviewed: boolean) {
    try {
      const res = await fetch(`/api/admin/fraud/${order.id}/review`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewed }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(reviewed ? `${order.orderNumber} marked as safe` : `${order.orderNumber} flagged`);
      queryClient.invalidateQueries({ queryKey: ["fraud-queue"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-stats"] });
    } catch {
      toast.error("Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold tracking-tight">Fraud Queue</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold">{stats?.total ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Flagged</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-red-600">{stats?.highRisk ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">High Risk (≥50)</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-orange-600">{stats?.mediumRisk ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Medium Risk (25–49)</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-green-600">{stats?.reviewed ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Reviewed / Cleared</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Risk Flags</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                    <p className="text-sm">No flagged orders in this view</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map(order => (
                <TableRow
                  key={order.id}
                  className={order.fraudReviewed ? "opacity-60" : ""}
                >
                  <TableCell className="font-medium">
                    <Link href={`/orders/${order.id}`} className="hover:underline text-primary">
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{order.customerName}</span>
                      <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{order.country ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">
                    £{order.totalGbp.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreBadge score={order.fraudScore} />
                  </TableCell>
                  <TableCell>
                    <FlagChips flags={order.fraudFlags} />
                  </TableCell>
                  <TableCell className="text-center">
                    {order.fraudReviewed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Reviewed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={`text-xs ${order.fraudScore >= 50 ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                        <AlertTriangle className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {!order.fraudReviewed ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Mark as reviewed (safe)"
                          onClick={() => {
                            setReviewingOrder(order);
                            setReviewNote("");
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          title="Un-review"
                          onClick={() => quickReview(order, false)}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!reviewingOrder}
        onOpenChange={(open) => {
          if (!open) { setReviewingOrder(null); setReviewNote(""); }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Mark as Reviewed — {reviewingOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{reviewingOrder?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fraud Score</span>
                <span className={`font-bold ${(reviewingOrder?.fraudScore ?? 0) >= 50 ? "text-red-600" : "text-orange-600"}`}>
                  {reviewingOrder?.fraudScore}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted-foreground shrink-0">Flags</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  <FlagChips flags={reviewingOrder?.fraudFlags ?? []} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Review Note (optional)</label>
              <Textarea
                placeholder="e.g. Verified customer, legitimate order..."
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setReviewingOrder(null); setReviewNote(""); }}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={submitting}
              onClick={() => handleReview(true)}
            >
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Mark as Safe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
