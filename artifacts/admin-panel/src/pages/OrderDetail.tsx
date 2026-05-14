import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetAdminOrder, 
  getGetAdminOrderQueryKey, 
  useUpdateAdminOrder 
} from "@workspace/api-client-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Package, User, MapPin, Truck, RotateCcw, Plus, Send, DollarSign } from "lucide-react";
import { toast } from "sonner";

type ReturnRecord = {
  id: number;
  orderNumber: string;
  reason: string;
  status: string;
  refundAmountGbp: number | null;
  adminNotes: string | null;
  createdAt: string;
};

function getReturnStatusColor(status: string) {
  switch (status) {
    case "refunded": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "approved": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "requested": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-800";
  }
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  
  const { data: order, isLoading } = useGetAdminOrder(orderId, {
    query: { 
      enabled: !!orderId, 
      queryKey: getGetAdminOrderQueryKey(orderId) 
    }
  });

  const updateOrder = useUpdateAdminOrder();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [sendingTracking, setSendingTracking] = useState(false);
  const [logReturnOpen, setLogReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");
  const [restoreInventory, setRestoreInventory] = useState(false);
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const refundsQueryKey = ["order-refunds", orderId];
  const { data: refundsData } = useQuery<{ id: number; amountGbp: number; type: string; reason: string; notes: string | null; restoreInventory: boolean; createdAt: string }[]>({
    queryKey: refundsQueryKey,
    queryFn: () => apiFetch(`/api/admin/orders/${orderId}/refunds`),
    enabled: !!orderId,
  });
  const orderRefunds = refundsData ?? [];

  async function handleIssueRefund() {
    const amt = parseFloat(refundAmount);
    if (!amt || amt <= 0 || !refundReason.trim()) return;
    setSubmittingRefund(true);
    try {
      await apiFetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountGbp: amt,
          reason: refundReason.trim(),
          notes: refundNotes.trim() || undefined,
          restoreInventory,
        }),
      });
      toast.success(`Refund of £${amt.toFixed(2)} issued`);
      setRefundOpen(false);
      setRefundAmount("");
      setRefundReason("");
      setRefundNotes("");
      setRestoreInventory(false);
      queryClient.invalidateQueries({ queryKey: refundsQueryKey });
      queryClient.invalidateQueries({ queryKey: getGetAdminOrderQueryKey(orderId) });
    } catch {
      toast.error("Failed to issue refund");
    } finally {
      setSubmittingRefund(false);
    }
  }

  const returnsQueryKey = ["order-returns", orderId];
  const { data: returnsData } = useQuery<{ returns: ReturnRecord[] }>({
    queryKey: returnsQueryKey,
    queryFn: () => apiFetch(`/api/admin/orders/${orderId}/returns`),
    enabled: !!orderId,
  });
  const orderReturns = returnsData?.returns ?? [];

  async function handleLogReturn() {
    if (!returnReason.trim()) return;
    setSubmittingReturn(true);
    try {
      await apiFetch(`/api/admin/orders/${orderId}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: returnReason.trim() }),
      });
      toast.success("Return request logged");
      setLogReturnOpen(false);
      setReturnReason("");
      queryClient.invalidateQueries({ queryKey: returnsQueryKey });
    } catch {
      toast.error("Failed to log return");
    } finally {
      setSubmittingReturn(false);
    }
  }

  // Initialize form state when order loads
  if (order && !isEditing && (trackingNumber !== (order.trackingNumber || "") || notes !== (order.notes || ""))) {
    setTrackingNumber(order.trackingNumber || "");
    setNotes(order.notes || "");
    setIsEditing(true);
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200";
      case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!order) return;
    updateOrder.mutate({ id: orderId, data: { status: newStatus } }, {
      onSuccess: (updatedOrder) => {
        toast.success(`Order status updated to ${newStatus}`);
        queryClient.setQueryData(getGetAdminOrderQueryKey(orderId), { ...order, status: newStatus });
      },
      onError: () => toast.error("Failed to update status")
    });
  };

  const handleSaveDetails = () => {
    updateOrder.mutate({ id: orderId, data: { trackingNumber, notes } }, {
      onSuccess: () => {
        toast.success("Order details saved");
        queryClient.setQueryData(getGetAdminOrderQueryKey(orderId), { ...order, trackingNumber, notes });
      },
      onError: () => toast.error("Failed to save details")
    });
  };

  const handleSendTracking = async () => {
    setSendingTracking(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/send-tracking`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Tracking notification sent to customer");
    } catch {
      toast.error("Failed to send tracking notification");
    } finally {
      setSendingTracking(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/orders"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h2>
        <Badge variant="outline" className={`ml-auto ${getStatusColor(order.status)} text-sm px-3 py-1`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" /> Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.productCategory} × {item.quantity}</p>
                    </div>
                    <div className="font-medium text-right">
                      {formatCurrency(item.priceGbp * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotalGbp || 0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingCostGbp || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalGbp)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-muted-foreground" /> Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={order.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tracking Number</label>
                  <Input 
                    placeholder="Enter tracking ID" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                <Textarea 
                  placeholder="Internal notes about this order..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveDetails} disabled={updateOrder.isPending}>
                  {updateOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Fulfillment Details
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendTracking}
                  disabled={sendingTracking || !trackingNumber}
                  title={!trackingNumber ? "Add a tracking number first" : "Send shipping notification email to customer"}
                >
                  {sendingTracking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Tracking Email
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-muted-foreground" /> Returns
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => setLogReturnOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Log Return
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {orderReturns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No returns logged for this order.</p>
              ) : (
                <div className="space-y-3">
                  {orderReturns.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.reason}</p>
                        {r.adminNotes && <p className="text-xs text-muted-foreground mt-1">{r.adminNotes}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="outline" className={getReturnStatusColor(r.status)}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </Badge>
                        {r.refundAmountGbp !== null && (
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            £{r.refundAmountGbp.toFixed(2)} refunded
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" /> Refunds
                </CardTitle>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setRefundOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Issue Refund
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {orderRefunds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No refunds issued for this order.</p>
              ) : (
                <div className="space-y-3">
                  {orderRefunds.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.reason}</p>
                        {r.notes && <p className="text-xs text-muted-foreground mt-0.5">{r.notes}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString("en-GB")}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="font-bold text-red-600">–£{r.amountGbp.toFixed(2)}</span>
                        <Badge variant="outline" className={r.type === "full" ? "text-red-600 border-red-200 bg-red-50 text-xs" : "text-orange-600 border-orange-200 bg-orange-50 text-xs"}>
                          {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                        </Badge>
                        {r.restoreInventory && <span className="text-xs text-green-600">Stock restored</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm">
              <div>
                <p className="font-medium text-base">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
                {order.phone && <p className="text-muted-foreground">{order.phone}</p>}
              </div>
              {order.customerId && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/customers/${order.customerId}`}>View Full Profile</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm space-y-1 text-muted-foreground">
              <p className="text-foreground font-medium">{order.customerName}</p>
              <p>{order.address1}</p>
              {order.address2 && <p>{order.address2}</p>}
              <p>{order.city}{order.county ? `, ${order.county}` : ''}</p>
              <p>{order.postcode}</p>
              <p>{order.country}</p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium text-foreground mb-1">Shipping Method</p>
                <p>{order.shippingMethod || "Standard Shipping"}</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground text-center">
            Placed on {new Date(order.createdAt).toLocaleString("en-GB")}
          </div>
        </div>
      </div>

      <Dialog open={refundOpen} onOpenChange={(open) => { setRefundOpen(open); if (!open) { setRefundAmount(""); setRefundReason(""); setRefundNotes(""); setRestoreInventory(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Refund — {order.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order total</span>
                <span className="font-medium">{formatCurrency(order.totalGbp)}</span>
              </div>
              {(order.refundedAmountGbp ?? 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Already refunded</span>
                  <span>–{formatCurrency(order.refundedAmountGbp ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Max refundable</span>
                <span>{formatCurrency(order.totalGbp - (order.refundedAmountGbp ?? 0))}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Refund Amount (£)</label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="0.00"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Reason</label>
              <Input placeholder="e.g. Item damaged in transit" value={refundReason} onChange={e => setRefundReason(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Internal Notes (optional)</label>
              <Textarea placeholder="Any additional notes for your records…" value={refundNotes} onChange={e => setRefundNotes(e.target.value)} rows={2} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={restoreInventory} onChange={e => setRestoreInventory(e.target.checked)} className="rounded" />
              Restore stock levels for refunded items
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleIssueRefund}
              disabled={submittingRefund || !refundAmount || !refundReason.trim() || parseFloat(refundAmount) <= 0}
            >
              {submittingRefund && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Issue Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logReturnOpen} onOpenChange={(open) => { setLogReturnOpen(open); if (!open) setReturnReason(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Return — {order.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Describe the reason for the return. You can update the status and refund amount from the Returns page.</p>
            <Textarea
              placeholder="e.g. Customer received wrong item, requested exchange..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setLogReturnOpen(false); setReturnReason(""); }}>Cancel</Button>
            <Button onClick={handleLogReturn} disabled={submittingReturn || !returnReason.trim()}>
              {submittingReturn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Log Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
