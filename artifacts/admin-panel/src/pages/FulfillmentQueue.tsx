import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { DispatchDialog } from "@/components/DispatchDialog";
import { isSafeTrackingUrl } from "@/lib/tracking-carriers";
import {
  Loader2, Package, Printer, Truck, ArrowRight,
  CheckCircle2, ExternalLink, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FulfillmentItem {
  id: number;
  productName: string;
  productCategory: string | null;
  quantity: number;
  priceGbp: number;
}

interface FulfillmentOrder {
  id: number;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string | null;
  shippingMethod: string | null;
  carrierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  totalGbp: number;
  notes: string | null;
  createdAt: string;
  items: FulfillmentItem[];
}

type Tab = "ready" | "processing" | "shipped";

const TAB_LABELS: Record<Tab, string> = {
  ready:      "Ready to Pick",
  processing: "Processing",
  shipped:    "Shipped",
};

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchFulfillment(tab: Tab): Promise<{ orders: FulfillmentOrder[]; total: number }> {
  const res = await fetch(`/api/admin/fulfillment?tab=${tab}&limit=100`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load fulfillment queue");
  return res.json();
}

async function patchOrder(id: number, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

async function bulkUpdate(ids: number[], status: string) {
  const res = await fetch("/api/admin/orders/bulk-update", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, status }),
  });
  if (!res.ok) throw new Error("Failed to bulk-update orders");
}

function openPackingSlip(ids: number[]) {
  if (ids.length === 1) {
    window.open(`/api/admin/orders/${ids[0]}/packing-slip`, "_blank");
    return;
  }
  // Multi-slip: POST, open blob URL
  fetch("/api/admin/fulfillment/packing-slips", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  })
    .then(r => r.text())
    .then(html => {
      const blob = new Blob([html], { type: "text/html" });
      window.open(URL.createObjectURL(blob), "_blank");
    })
    .catch(() => toast.error("Failed to generate packing slips"));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:              "bg-emerald-100 text-emerald-800 border-emerald-200",
    payment_received:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    processing:        "bg-blue-100 text-blue-800 border-blue-200",
    shipped:           "bg-violet-100 text-violet-800 border-violet-200",
  };
  const labels: Record<string, string> = {
    paid:             "Paid",
    payment_received: "Payment Received",
    processing:       "Processing",
    shipped:          "Shipped",
  };
  const cls = map[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {labels[status] ?? status}
    </span>
  );
}

function OrderCard({
  order,
  selected,
  onSelect,
  onRefresh,
}: {
  order: FulfillmentOrder;
  selected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onRefresh: () => void;
}) {
  const [shipOpen, setShipOpen] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const address = [order.address1, order.address2, order.city, order.postcode, order.country]
    .filter(Boolean).join(", ");

  async function handleAdvance() {
    setAdvancing(true);
    try {
      const next = order.status === "processing" ? "shipped" : "processing";
      if (next === "shipped") { setShipOpen(true); setAdvancing(false); return; }
      await patchOrder(order.id, { status: next });
      toast.success(`${order.orderNumber} moved to Processing`);
      onRefresh();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <Card className={`transition-shadow ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4">
        {/* Row 1: checkbox + order # + status + actions */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={v => onSelect(order.id, !!v)}
            className="mt-0.5 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/orders/${order.id}`}>
                <span className="font-mono font-semibold text-sm hover:underline text-primary cursor-pointer">
                  {order.orderNumber}
                </span>
              </Link>
              <StatusBadge status={order.status} />
              {order.shippingMethod && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {order.shippingMethod}
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </span>
            </div>

            {/* Customer + address */}
            <div className="mt-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{address}</p>
            </div>

            {/* Items */}
            <div className="mt-3 border rounded-md overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Product</th>
                    <th className="text-right px-3 py-1.5 font-medium text-muted-foreground w-12">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-3 py-2" data-label="Product">
                        <span className="font-medium">{item.productName}</span>
                        {item.productCategory && (
                          <span className="text-muted-foreground ml-1">— {item.productCategory}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold" data-label="Qty">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {order.notes && (
              <p className="mt-2 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                {order.notes}
              </p>
            )}
             {order.status === "shipped" && order.trackingNumber && (
               <div className="mt-2 text-xs text-muted-foreground flex flex-wrap items-center gap-x-2">
                 <span><strong>{order.carrierName ?? "Carrier"}:</strong> {order.trackingNumber}</span>
                 {isSafeTrackingUrl(order.trackingUrl) && (
                   <a data-testid={`link-tracking-${order.id}`} href={order.trackingUrl!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                     Track parcel <ExternalLink className="w-3 h-3 ml-1" />
                   </a>
                 )}
               </div>
             )}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm" variant="outline"
                onClick={() => openPackingSlip([order.id])}
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Slip
              </Button>
              {order.status !== "shipped" && (
                <Button size="sm" onClick={handleAdvance} disabled={advancing}>
                  {advancing
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    : <ArrowRight className="w-3.5 h-3.5 mr-1.5" />}
                  {order.status === "processing" ? "Mark Shipped" : "Mark Processing"}
                </Button>
              )}
              <Link href={`/orders/${order.id}`}>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Detail
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>

      {shipOpen && (
        <DispatchDialog
          order={order}
          open={shipOpen}
          onOpenChange={setShipOpen}
          onDispatched={onRefresh}
        />
      )}
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FulfillmentQueue() {
  const [tab, setTab] = useState<Tab>("ready");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState<"processing" | null>(null);
  const [applying, setApplying] = useState(false);
  const qc = useQueryClient();

  const queryKey = ["fulfillment", tab];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchFulfillment(tab),
    staleTime: 20_000,
  });

  const orders = data?.orders ?? [];
  const total  = data?.total  ?? 0;

  const refresh = useCallback(() => {
    setSelectedIds(new Set());
    qc.invalidateQueries({ queryKey: ["fulfillment"] });
  }, [qc]);

  function toggleSelect(id: number, checked: boolean) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map(o => o.id)));
    }
  }

  async function handleBulkApply() {
    if (!bulkAction || selectedIds.size === 0) return;
    setApplying(true);
    try {
      await bulkUpdate([...selectedIds], bulkAction);
      toast.success(`${selectedIds.size} order${selectedIds.size > 1 ? "s" : ""} updated to ${bulkAction}`);
      refresh();
    } catch {
      toast.error("Bulk update failed");
    } finally {
      setApplying(false);
      setBulkAction(null);
    }
  }

  const allSelected = orders.length > 0 && selectedIds.size === orders.length;
  const someSelected = selectedIds.size > 0;

  return (
    <div className="admin-page space-y-6">
      {/* Header */}
      <div className="page-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" /> Fulfilment Queue
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Pick, pack, and dispatch paid orders
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b">
        {(["ready", "processing", "shipped"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedIds(new Set()); }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[t]}
            {t === "ready" && total > 0 && tab === t && (
              <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0">{total}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Bulk toolbar */}
      {someSelected && (
        <div className="page-actions flex items-center gap-3 px-4 py-2.5 bg-muted/60 border rounded-lg flex-wrap">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button
            size="sm" variant="outline"
            onClick={() => openPackingSlip([...selectedIds])}
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print {selectedIds.size > 1 ? `${selectedIds.size} slips` : "slip"}
          </Button>
          {tab === "ready" && (
            <Button
              size="sm"
              onClick={() => { setBulkAction("processing"); }}
              disabled={applying}
            >
              <ArrowRight className="w-3.5 h-3.5 mr-1.5" /> Mark Processing
            </Button>
          )}
          {bulkAction && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                Move {selectedIds.size} order{selectedIds.size > 1 ? "s" : ""} to{" "}
                <strong>{bulkAction}</strong>?
              </span>
              <Button size="sm" onClick={handleBulkApply} disabled={applying}>
                {applying ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setBulkAction(null)}>Cancel</Button>
            </div>
          )}
        </div>
      )}

      {/* Select all row */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
          <span className="text-sm text-muted-foreground">
            {allSelected ? "Deselect all" : `Select all ${orders.length}`}
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            {tab === "ready" ? "No orders waiting to be picked" :
             tab === "processing" ? "No orders currently being processed" :
             "No shipped orders yet"}
          </p>
          {tab === "ready" && (
            <p className="text-sm text-muted-foreground mt-1">
              New paid orders will appear here automatically.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              selected={selectedIds.has(order.id)}
              onSelect={toggleSelect}
              onRefresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
