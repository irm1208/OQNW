import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetAdminOrder, 
  getGetAdminOrderQueryKey, 
  useUpdateAdminOrder 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Package, User, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

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

              <Button onClick={handleSaveDetails} disabled={updateOrder.isPending}>
                {updateOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Fulfillment Details
              </Button>
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
    </div>
  );
}
