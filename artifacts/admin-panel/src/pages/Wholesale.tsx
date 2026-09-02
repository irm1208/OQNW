import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Copy, Send, CheckCircle2, Pencil } from "lucide-react";
import {
  WHOLESALE_EDIT_DRAFT_KEY,
  WHOLESALE_DRAFT_KEY,
  WholesaleApiError,
  useWholesaleInvoices,
  useResendWholesaleInvoice,
} from "@/hooks/use-wholesale";
import { CreateWholesaleSheet } from "@/components/wholesale/CreateWholesaleSheet";
import { EditWholesaleSheet } from "@/components/wholesale/EditWholesaleSheet";
import { toast } from "sonner";

export default function Wholesale() {
  const { data, isLoading } = useWholesaleInvoices();
  const resend = useResendWholesaleInvoice();
  const [sheetOpen, setSheetOpen] = useState(
    () => sessionStorage.getItem(WHOLESALE_DRAFT_KEY) !== null,
  );
  const [editInvoiceId, setEditInvoiceId] = useState<number | null>(() => {
    const savedDraft = sessionStorage.getItem(WHOLESALE_EDIT_DRAFT_KEY);
    if (!savedDraft) return null;
    try {
      const draft = JSON.parse(savedDraft) as { invoiceId?: unknown };
      return typeof draft.invoiceId === "number" ? draft.invoiceId : null;
    } catch {
      sessionStorage.removeItem(WHOLESALE_EDIT_DRAFT_KEY);
      return null;
    }
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const formatCurrency = (val: number, currency: "GBP" | "EUR" = "GBP") =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(val);

  const getStatusColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Payment link copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResend = (id: number) => {
    resend.mutate(id, {
      onSuccess: () => toast.success("Invoice resent successfully"),
      onError: (err) => {
        if (err instanceof WholesaleApiError && err.requiresRecentAuth) {
          toast.info("Please confirm your identity, then resend the invoice");
          window.location.assign(
            `${import.meta.env.BASE_URL}login?reauth=1&returnTo=%2Fwholesale`,
          );
          return;
        }
        toast.error(err.message || "Failed to resend");
      },
    });
  };

  const invoices = data?.invoices ?? [];

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Wholesale Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage manual pay-by-link invoices.</p>
        </div>
        <div className="page-actions">
          <Button onClick={() => setSheetOpen(true)} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Create payment
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold">Reference #</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="text-right font-semibold">Total</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/60 mx-auto" />
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No wholesale invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="group transition-colors hover:bg-muted/20">
                  <TableCell className="font-medium text-foreground">{inv.referenceNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{inv.customerName}</span>
                      <span className="text-xs text-muted-foreground">{inv.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-medium ${getStatusColor(inv.status)}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-GB") : "-"}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(inv.totalGbp, inv.currency)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      {inv.paymentUrl && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8 text-xs font-semibold shadow-sm"
                          onClick={() => copyUrl(inv.id, inv.paymentUrl!)}
                        >
                          {copiedId === inv.id ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                          Copy Link
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold shadow-sm"
                        onClick={() => setEditInvoiceId(inv.id)}
                        disabled={inv.paymentStatus === "paid"}
                        title={inv.paymentStatus === "paid" ? "Paid invoices cannot be edited" : "Edit invoice details"}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold shadow-sm"
                        onClick={() => handleResend(inv.id)}
                        disabled={resend.isPending}
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        Resend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateWholesaleSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <EditWholesaleSheet
        invoice={invoices.find((invoice) => invoice.id === editInvoiceId) ?? null}
        open={editInvoiceId !== null}
        onOpenChange={(open) => {
          if (!open) setEditInvoiceId(null);
        }}
      />
    </div>
  );
}
