import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetAdminCustomer, getGetAdminCustomerQueryKey, customFetch } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, Eye, Download, Trash2, AlertTriangle, CreditCard, Plus, Minus, Globe, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

interface CreditData {
  balancePence: number;
  transactions: {
    id: number;
    amountPence: number;
    type: string;
    reason: string;
    adminNote: string | null;
    createdAt: string;
  }[];
}

function CreditsPanel({ customerId }: { customerId: number }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [mode, setMode] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery<CreditData>({
    queryKey: ["customer-credits", customerId],
    queryFn: () => customFetch<CreditData>(api(`admin/customers/${customerId}/credits`)),
    enabled: !!customerId,
    staleTime: 30_000,
  });

  const adjust = useMutation({
    mutationFn: (body: { amountPence: number; reason: string; adminNote?: string }) =>
      customFetch(api(`admin/customers/${customerId}/credits`), {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customer-credits", customerId] });
      qc.invalidateQueries({ queryKey: ["admin-credits"] });
      toast({ title: mode === "credit" ? "Credits added" : "Credits deducted" });
      setAdjustOpen(false);
      setAmount("");
      setReason("");
      setNote("");
    },
    onError: (err: { message?: string }) => {
      toast({ title: err?.message ?? "Failed to adjust credits", variant: "destructive" });
    },
  });

  const fmt = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Math.abs(pence) / 100);

  const handleSubmit = () => {
    const pence = Math.round(parseFloat(amount) * 100);
    if (isNaN(pence) || pence <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (!reason.trim()) {
      toast({ title: "Reason is required", variant: "destructive" });
      return;
    }
    adjust.mutate({
      amountPence: mode === "credit" ? pence : -pence,
      reason: reason.trim(),
      adminNote: note.trim() || undefined,
    });
  };

  const balance = data?.balancePence ?? 0;

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-col items-start gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Store Credits
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => { setMode("debit"); setAdjustOpen(true); }}>
            <Minus className="w-3.5 h-3.5 mr-1" /> Deduct
          </Button>
          <Button size="sm" onClick={() => { setMode("credit"); setAdjustOpen(true); }}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className={`text-3xl font-bold ${balance > 0 ? "text-green-600" : "text-muted-foreground"}`}>
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : fmt(balance)}
          </div>
          <span className="text-sm text-muted-foreground">current balance</span>
        </div>

        {(data?.transactions ?? []).length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Transaction History</p>
            <div className="rounded-md border divide-y max-h-64 overflow-y-auto">
              {data!.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{tx.reason}</p>
                    {tx.adminNote && <p className="text-xs text-muted-foreground">{tx.adminNote}</p>}
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`font-semibold tabular-nums ${tx.amountPence > 0 ? "text-green-600" : "text-red-500"}`}>
                    {tx.amountPence > 0 ? "+" : "−"}{fmt(tx.amountPence)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && (data?.transactions ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No credit transactions yet.</p>
        )}
      </CardContent>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "credit" ? "Add Credits" : "Deduct Credits"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Amount (£)</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Reason <span className="text-destructive">*</span></Label>
              <Input
                placeholder={mode === "credit" ? "e.g. Goodwill credit, Referral bonus" : "e.g. Order applied, Correction"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Internal note <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea
                placeholder="Optional admin note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
            {mode === "debit" && (
              <p className="text-xs text-muted-foreground bg-muted rounded p-2">
                Current balance: <strong>{fmt(balance)}</strong>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={adjust.isPending}
              variant={mode === "debit" ? "destructive" : "default"}
            >
              {adjust.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "credit" ? "Add Credits" : "Deduct Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const [eraseOpen, setEraseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  
  const { data: customer, isLoading } = useGetAdminCustomer(customerId, {
    query: { 
      enabled: !!customerId, 
      queryKey: getGetAdminCustomerQueryKey(customerId) 
    }
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const res = await fetch(api(`admin/customers/${customerId}`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const message = await res.json().then((body: { error?: string }) => body.error).catch(() => null);
        throw new Error(message ?? "Failed to update customer profile");
      }
      return res.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetAdminCustomerQueryKey(customerId) }),
        queryClient.invalidateQueries({ queryKey: ["/api/admin/customers"] }),
      ]);
      toast({ title: "Customer profile updated" });
      setEditOpen(false);
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  function openProfileEditor() {
    if (!customer) return;
    setProfile({
      firstName: customer.firstName, lastName: customer.lastName, email: customer.email,
      phone: customer.phone ?? "", address1: customer.address1 ?? "", address2: customer.address2 ?? "",
      city: customer.city ?? "", county: customer.county ?? "", postcode: customer.postcode ?? "", country: customer.country ?? "",
    });
    setEditOpen(true);
  }

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
    <div className="admin-page mx-auto min-w-0 max-w-5xl space-y-6">
      <div className="page-header flex items-center gap-3 sm:gap-4 flex-wrap">
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
          <Button variant="outline" size="sm" onClick={openProfileEditor}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setEraseOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Erase Data
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
        <div className="min-w-0 space-y-6">
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
              {customer.lastSeenCountry && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {customer.lastSeenCountry.toUpperCase().replace(/\p{L}/gu, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397))}
                    </span>
                    <span className="text-muted-foreground">{customer.lastSeenCountry} — IP country</span>
                    {customer.lastSeenIp && (
                      <span className="text-xs text-muted-foreground/60">({customer.lastSeenIp})</span>
                    )}
                  </span>
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

        <div className="min-w-0 space-y-6 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <CreditsPanel customerId={customerId} />

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
                        <TableCell className="font-medium" data-label="Order #">{order.orderNumber}</TableCell>
                        <TableCell data-label="Date">{new Date(order.createdAt).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell data-label="Status">
                          <Badge variant="outline" className={`${getStatusColor(order.status)} px-2 py-0.5 text-xs font-normal border-0`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium" data-label="Total">{formatCurrency(order.totalGbp)}</TableCell>
                        <TableCell data-label="Actions">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/orders/${order.id}`} aria-label={`View order ${order.id}`}>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit customer profile</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Only profile and contact data can be changed. Orders, payments, and credit history are never modified.</p>
          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            {[
              ["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"],
              ["phone", "Phone"], ["address1", "Address line 1"], ["address2", "Address line 2"],
              ["city", "City"], ["county", "County"], ["postcode", "Postcode"], ["country", "Country"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={`customer-${field}`}>{label}{["firstName", "lastName", "email"].includes(field) ? " *" : ""}</Label>
                <Input id={`customer-${field}`} value={profile[field] ?? ""} onChange={event => setProfile(current => ({ ...current, [field]: event.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={updateProfile.isPending}>Cancel</Button>
            <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
