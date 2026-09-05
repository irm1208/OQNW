import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Copy, Send, CheckCircle2, Pencil, RotateCcw, Link2 } from "lucide-react";
import {
  WHOLESALE_EDIT_DRAFT_KEY,
  WHOLESALE_DRAFT_KEY,
  WHOLESALE_RETRY_DRAFT_KEY,
  WHOLESALE_RESOLVE_DRAFT_KEY,
  WholesaleApiError,
  useResolveWholesalePayment,
  useRetryWholesalePayment,
  useWholesaleInvoices,
  useResendWholesaleInvoice,
} from "@/hooks/use-wholesale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateWholesaleSheet } from "@/components/wholesale/CreateWholesaleSheet";
import { EditWholesaleSheet } from "@/components/wholesale/EditWholesaleSheet";
import { toast } from "sonner";

export default function Wholesale() {
  const { data, isLoading } = useWholesaleInvoices();
  const resend = useResendWholesaleInvoice();
  const retry = useRetryWholesalePayment();
  const resolvePayment = useResolveWholesalePayment();
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
  const [retryDraftId, setRetryDraftId] = useState<number | null>(() => {
    const saved = sessionStorage.getItem(WHOLESALE_RETRY_DRAFT_KEY);
    if (!saved) return null;
    const id = Number(saved);
    return Number.isInteger(id) && id > 0 ? id : null;
  });
  const [resolveDraft, setResolveDraft] = useState<{
    invoiceId: number;
    apiPaymentId: string;
    paymentUrl: string;
  } | null>(() => {
    const saved = sessionStorage.getItem(WHOLESALE_RESOLVE_DRAFT_KEY);
    if (!saved) return null;
    try {
      const draft = JSON.parse(saved) as Record<string, unknown>;
      if (typeof draft.invoiceId !== "number") return null;
      return {
        invoiceId: draft.invoiceId,
        apiPaymentId: typeof draft.apiPaymentId === "string" ? draft.apiPaymentId : "",
        paymentUrl: typeof draft.paymentUrl === "string" ? draft.paymentUrl : "",
      };
    } catch {
      sessionStorage.removeItem(WHOLESALE_RESOLVE_DRAFT_KEY);
      return null;
    }
  });

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

  const handleRetry = (id: number) => {
    sessionStorage.removeItem(WHOLESALE_RETRY_DRAFT_KEY);
    setRetryDraftId(null);
    retry.mutate(id, {
      onSuccess: (result) => {
        result.warning
          ? toast.warning(result.warning)
          : toast.success("Payment link is ready and the invoice was sent");
      },
      onError: (err) => {
        if (err instanceof WholesaleApiError && err.requiresRecentAuth) {
          sessionStorage.setItem(WHOLESALE_RETRY_DRAFT_KEY, String(id));
          setRetryDraftId(id);
          toast.info("Please confirm your identity, then retry the payment link");
          window.location.assign(
            `${import.meta.env.BASE_URL}login?reauth=1&returnTo=%2Fwholesale`,
          );
          return;
        }
        toast.error(err.message || "Failed to retry payment link");
      },
    });
  };

  const submitManualRecovery = () => {
    if (!resolveDraft) return;
    resolvePayment.mutate({
      id: resolveDraft.invoiceId,
      apiPaymentId: resolveDraft.apiPaymentId,
      paymentUrl: resolveDraft.paymentUrl,
    }, {
      onSuccess: (result) => {
        sessionStorage.removeItem(WHOLESALE_RESOLVE_DRAFT_KEY);
        setResolveDraft(null);
        result.warning
          ? toast.warning(result.warning)
          : toast.success("Verified Wallid payment attached and invoice sent");
      },
      onError: (err) => {
        if (err instanceof WholesaleApiError && err.requiresRecentAuth) {
          sessionStorage.setItem(WHOLESALE_RESOLVE_DRAFT_KEY, JSON.stringify(resolveDraft));
          toast.info("Please confirm your identity, then finish manual recovery");
          window.location.assign(
            `${import.meta.env.BASE_URL}login?reauth=1&returnTo=%2Fwholesale`,
          );
          return;
        }
        toast.error(err.message || "Failed to attach the verified Wallid payment");
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
                  <TableCell className="font-medium text-foreground" data-label="Reference #">{inv.referenceNumber}</TableCell>
                  <TableCell className="text-muted-foreground" data-label="Date">{new Date(inv.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell data-label="Customer">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{inv.customerName}</span>
                      <span className="text-xs text-muted-foreground">{inv.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell data-label="Status">
                    <div className="flex min-w-40 flex-col items-start gap-1.5">
                      <Badge variant="outline" className={`font-medium ${getStatusColor(inv.status)}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        Payment: {inv.paymentCreationStale ? "stale creating — verify manually" : inv.paymentStatus ?? "unknown"} · {inv.paymentUrl ? "link ready" : "no link"}
                      </span>
                      {inv.paymentLastError && (
                        <span className="max-w-64 text-xs text-destructive" title={inv.paymentLastError}>
                          {inv.paymentLastError}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground" data-label="Due Date">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-GB") : "-"}</TableCell>
                  <TableCell className="text-right font-semibold" data-label="Total">{formatCurrency(inv.totalGbp, inv.currency)}</TableCell>
                  <TableCell className="text-right" data-label="Actions">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {inv.paymentUrl && inv.status !== "paid" && inv.paymentStatus !== "paid" && (
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
                      {(inv.paymentStatus === "failed" || inv.paymentStatus === "creating") &&
                        Boolean(inv.paymentUrl) && inv.status !== "paid" && (
                          <Button
                            variant={retryDraftId === inv.id ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs font-semibold shadow-sm"
                            onClick={() => handleRetry(inv.id)}
                            disabled={retry.isPending}
                            title="Repair this payment using its stored provider details"
                          >
                            {retry.isPending && retry.variables === inv.id
                              ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                              : <RotateCcw className="w-3.5 h-3.5 mr-1" />}
                            Retry / Repair
                          </Button>
                        )}
                      {(inv.paymentStatus === "failed" || inv.paymentStatus === "unknown" || inv.paymentStatus === "creating") &&
                        !inv.paymentUrl && inv.status !== "paid" && (
                          <Button
                            variant={resolveDraft?.invoiceId === inv.id ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs font-semibold shadow-sm"
                            onClick={() => setResolveDraft({
                              invoiceId: inv.id,
                              apiPaymentId: "",
                              paymentUrl: "",
                            })}
                            title="Attach payment details after verifying them in Wallid"
                          >
                            <Link2 className="w-3.5 h-3.5 mr-1" />
                            Manual recovery
                          </Button>
                        )}
                      {inv.paymentStatus !== "creating" && inv.paymentStatus !== "paid" && inv.status !== "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold shadow-sm"
                          onClick={() => setEditInvoiceId(inv.id)}
                          title="Edit invoice details"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      )}
                      {inv.paymentUrl && inv.paymentStatus === "ready" && (
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
                      )}
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
      <Dialog
        open={resolveDraft !== null}
        onOpenChange={(open) => {
          if (!open && !resolvePayment.isPending) {
            sessionStorage.removeItem(WHOLESALE_RESOLVE_DRAFT_KEY);
            setResolveDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach verified Wallid payment</DialogTitle>
            <DialogDescription>
              Copy both values from the Wallid dashboard. Before attaching them, verify the
              order reference, amount, and currency match this invoice. This does not create
              another payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="wallid-api-payment-id">Wallid API payment ID</Label>
              <Input
                id="wallid-api-payment-id"
                value={resolveDraft?.apiPaymentId ?? ""}
                onChange={(event) => setResolveDraft((draft) => draft && ({
                  ...draft,
                  apiPaymentId: event.target.value,
                }))}
                autoComplete="off"
                placeholder="API payment ID from Wallid"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wallid-payment-url">HTTPS Wallid payment URL</Label>
              <Input
                id="wallid-payment-url"
                type="url"
                value={resolveDraft?.paymentUrl ?? ""}
                onChange={(event) => setResolveDraft((draft) => draft && ({
                  ...draft,
                  paymentUrl: event.target.value,
                }))}
                autoComplete="off"
                placeholder="https://pay.wallid.io/…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDraft(null)}
              disabled={resolvePayment.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={submitManualRecovery}
              disabled={
                resolvePayment.isPending ||
                !resolveDraft?.apiPaymentId.trim() ||
                !resolveDraft?.paymentUrl.trim()
              }
            >
              {resolvePayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Attach verified payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
