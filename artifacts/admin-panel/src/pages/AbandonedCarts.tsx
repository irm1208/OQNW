import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Mail, MailCheck, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAlertIds } from "@/hooks/useAlerts";

function api(path: string) { return `/api${path}`; }
function apiFetch(url: string) {
  return fetch(url, { credentials: "include" }).then(r => {
    if (!r.ok) throw new Error("Request failed");
    return r.json();
  });
}

function formatGbp(val: number) {
  return `£${val.toFixed(2)}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60_000);
  return `${mins}m ago`;
}

interface CartItem { productName: string; quantity: number; priceGbp: number; }
interface AbandonedCart {
  id: number;
  customerEmail: string;
  customerName: string;
  itemCount: number;
  totalValue: number;
  updatedAt: string;
  emailSentAt: string | null;
  items: CartItem[];
}
interface Stats { total: number; totalAbandonedValue: number; emailsSent: number; pendingEmail: number; }
interface ApiResponse { carts: AbandonedCart[]; stats: Stats; }

export default function AbandonedCarts() {
  const notifiedCartIds = useAlertIds("cart");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["admin-abandoned-carts"],
    queryFn: () => apiFetch(api("/admin/abandoned-carts")) as Promise<ApiResponse>,
    refetchInterval: 60_000,
  });

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-sm">Failed to load abandoned carts.</div>;
  }

  const { carts = [], stats } = data ?? { carts: [], stats: { total: 0, totalAbandonedValue: 0, emailsSent: 0, pendingEmail: 0 } };

  return (
    <div className="admin-page space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Abandoned Carts</h1>
        <p className="text-muted-foreground text-sm mt-1">Logged-in customers who left items without checking out</p>
      </div>

      {/* Stats */}
       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Abandoned", value: String(stats.total), icon: ShoppingCart, color: "text-slate-600" },
          { label: "Abandoned Value", value: formatGbp(stats.totalAbandonedValue), icon: ShoppingCart, color: "text-orange-600" },
          { label: "Emails Sent", value: String(stats.emailsSent), icon: MailCheck, color: "text-green-600" },
          { label: "Awaiting Email", value: String(stats.pendingEmail), icon: Mail, color: "text-yellow-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {carts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <ShoppingCart className="w-8 h-8 opacity-30" />
          <p className="text-sm">No abandoned carts right now</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart) => (
                <>
                  <TableRow
                    key={cart.id}
                    className="cursor-pointer"
                    onClick={() => toggleExpand(cart.id)}
                  >
                    <TableCell className="pr-0">
                      {expanded.has(cart.id)
                        ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {cart.customerName}
                        {notifiedCartIds.has(cart.id) && <Badge className="bg-red-500 hover:bg-red-500 text-white">New</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{cart.customerEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm">{cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""}</TableCell>
                    <TableCell className="font-medium text-sm">{formatGbp(cart.totalValue)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{timeAgo(cart.updatedAt)}</TableCell>
                    <TableCell>
                      {cart.emailSentAt ? (
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 gap-1">
                          <MailCheck className="w-3 h-3" /> Sent
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50 gap-1">
                          <Mail className="w-3 h-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  {expanded.has(cart.id) && (
                    <TableRow key={`${cart.id}-detail`} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell />
                      <TableCell colSpan={5} className="pb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-muted-foreground">
                              <th className="text-left pb-1 font-medium">Product</th>
                              <th className="text-center pb-1 font-medium">Qty</th>
                              <th className="text-right pb-1 font-medium">Line</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.items.map((item, i) => (
                              <tr key={i} className="border-t border-border/40">
                                <td className="py-1.5 text-sm">{item.productName}</td>
                                <td className="py-1.5 text-center text-muted-foreground">×{item.quantity}</td>
                                <td className="py-1.5 text-right font-medium">{formatGbp(item.priceGbp * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {cart.emailSentAt && (
                          <p className="text-xs text-muted-foreground mt-2">Recovery email sent {timeAgo(cart.emailSentAt)}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
