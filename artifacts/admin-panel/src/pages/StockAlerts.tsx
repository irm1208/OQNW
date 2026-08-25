import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, CheckCircle2, Clock, Package, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type ProductRow = {
  productId: number;
  productName: string;
  pendingCount: number;
  totalCount: number;
  lastSignupAt: string | null;
};

type Stats = {
  totalPending: number;
  totalNotified: number;
  productsWithWaitlist: number;
};

type AlertsData = {
  stats: Stats;
  products: ProductRow[];
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function StockAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifying, setNotifying] = useState<number | null>(null);

  const { data, isLoading } = useQuery<AlertsData>({
    queryKey: ["stock-alerts"],
    queryFn: () =>
      fetch(api("admin/stock-alerts"), { credentials: "include" })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<AlertsData>; }),
  });

  const notify = useMutation({
    mutationFn: async (productId: number) => {
      setNotifying(productId);
      const r = await fetch(api(`admin/stock-alerts/notify/${productId}`), {
        method: "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error("Failed");
      return r.json() as Promise<{ sent: number }>;
    },
    onSuccess: (result, productId) => {
      setNotifying(null);
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      const product = data?.products.find(p => p.productId === productId);
      toast({
        title: "Notifications sent",
        description: `Emailed ${result.sent} subscriber${result.sent !== 1 ? "s" : ""} about ${product?.productName ?? "the product"}.`,
      });
    },
    onError: () => {
      setNotifying(null);
      toast({ title: "Error", description: "Failed to send notifications.", variant: "destructive" });
    },
  });

  const stats = data?.stats;
  const products = data?.products ?? [];
  const withWaitlist = products.filter(p => p.pendingCount > 0);
  const alreadyNotified = products.filter(p => p.pendingCount === 0 && p.totalCount > 0);

  return (
    <div className="admin-page space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Back-in-Stock Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customers waiting to be notified when out-of-stock products return.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Pending Notifications", value: stats?.totalPending ?? 0, icon: BellRing, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
          { label: "Products with Waitlists", value: stats?.productsWithWaitlist ?? 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Already Notified", value: stats?.totalNotified ?? 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 flex items-center gap-4 ${stat.bg}`}>
            <div className={`p-2 rounded-lg bg-white/60`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <Bell className="w-6 h-6 animate-pulse mr-2" /> Loading…
        </div>
      ) : withWaitlist.length === 0 && alreadyNotified.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-semibold text-foreground">No stock alert requests yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            When customers sign up for back-in-stock notifications on product pages, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active waitlists */}
          {withWaitlist.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Pending Waitlists ({withWaitlist.length})
              </h2>
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Waiting</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Last Sign-up</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withWaitlist.map((product, i) => (
                      <tr
                        key={product.productId}
                        className={`${i < withWaitlist.length - 1 ? "border-b" : ""} hover:bg-muted/20 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-foreground">{product.productName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                            {product.pendingCount} subscriber{product.pendingCount !== 1 ? "s" : ""}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(product.lastSignupAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => notify.mutate(product.productId)}
                            disabled={notifying === product.productId}
                            className="gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {notifying === product.productId ? "Sending…" : `Notify ${product.pendingCount}`}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {/* Already notified */}
          {alreadyNotified.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Already Notified
              </h2>
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total Notified</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Last Sign-up</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {alreadyNotified.map((product, i) => (
                      <tr
                        key={product.productId}
                        className={`${i < alreadyNotified.length - 1 ? "border-b" : ""} opacity-70`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-foreground">{product.productName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {product.totalCount} notified
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {formatDate(product.lastSignupAt)}
                        </td>
                        <td className="px-4 py-3" />
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
