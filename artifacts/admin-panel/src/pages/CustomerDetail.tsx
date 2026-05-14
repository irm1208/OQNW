import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetAdminCustomer, getGetAdminCustomerQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, Eye, Download, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const [eraseOpen, setEraseOpen] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const { data: customer, isLoading } = useGetAdminCustomer(customerId, {
    query: { 
      enabled: !!customerId, 
      queryKey: getGetAdminCustomerQueryKey(customerId) 
    }
  });

  async function handleGdprExport() {
    setExporting(true);
    try {
      const res = await fetch(api(`admin/customers/${customerId}/gdpr-export`), { credentials: "include" });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `gdpr-export-customer-${customerId}.json`;
      a.click();
      URL.revokeObjectURL(href);
      toast({ title: "GDPR data exported" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  async function handleGdprErase() {
    setErasing(true);
    try {
      const res = await fetch(api(`admin/customers/${customerId}/gdpr-erase`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Erase failed");
      toast({ title: "Customer data erased" });
      setEraseOpen(false);
      history.back();
    } catch {
      toast({ title: "Erase failed", variant: "destructive" });
    } finally {
      setErasing(false);
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!customer) {
    return <div className="text-center py-12">Customer not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" size="icon" asChild>
          <Link href="/customers"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">{customer.firstName} {customer.lastName}</h2>
        <Badge variant="secondary" className="ml-2">Customer ID: {customer.id}</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGdprExport} disabled={exporting}>
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            GDPR Export
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setEraseOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Erase Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline">{customer.email}</a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Customer since {new Date(customer.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1 text-muted-foreground">
                  <p className="text-foreground">{customer.address1 || "No address provided"}</p>
                  {customer.address2 && <p>{customer.address2}</p>}
                  <p>{customer.city}{customer.county ? `, ${customer.county}` : ''}</p>
                  <p>{customer.postcode}</p>
                  <p>{customer.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{customer.totalOrders}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">£</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Lifetime Spend</p>
                  <p className="text-2xl font-bold">{formatCurrency(customer.totalSpendGbp)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Order History</CardTitle>
            </CardHeader>
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!customer.orders || customer.orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customer.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(order.status)} px-2 py-0.5 text-xs font-normal border-0`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.totalGbp)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={eraseOpen} onOpenChange={setEraseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Erase Customer Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <p>This will permanently delete <strong>{customer.firstName} {customer.lastName}</strong>'s account and anonymise all associated orders. This action cannot be undone.</p>
            <p className="text-muted-foreground">Orders will be retained for accounting purposes with personal details replaced by anonymised placeholders.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEraseOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleGdprErase} disabled={erasing}>
              {erasing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Permanently Erase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
