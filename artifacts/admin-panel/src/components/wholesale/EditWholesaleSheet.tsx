import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LockKeyhole } from "lucide-react";
import {
  WHOLESALE_EDIT_DRAFT_KEY,
  WholesaleApiError,
  type WholesaleInvoice,
  useUpdateWholesaleInvoice,
} from "@/hooks/use-wholesale";
import { toast } from "sonner";

const editSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerEmailCc: z.string().optional().refine(
    (value) => !value || /^\S+@\S+\.\S+$/.test(value),
    "Invalid email",
  ),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type EditValues = z.infer<typeof editSchema>;

type SavedEditDraft = {
  invoiceId: number;
  values: EditValues;
};

function defaultValues(invoice: WholesaleInvoice): EditValues {
  return {
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    customerEmailCc: invoice.customerEmailCc ?? "",
    dueDate: invoice.dueDate ?? "",
    description: invoice.description ?? "",
    notes: invoice.invoiceNotes ?? "",
  };
}

export function EditWholesaleSheet({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: WholesaleInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateInvoice = useUpdateWholesaleInvoice();
  const [, setLocation] = useLocation();
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema as never) as Resolver<EditValues>,
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerEmailCc: "",
      dueDate: "",
      description: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open || !invoice) return;
    const savedDraft = sessionStorage.getItem(WHOLESALE_EDIT_DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft) as SavedEditDraft;
        if (draft.invoiceId === invoice.id) {
          form.reset(draft.values);
          sessionStorage.removeItem(WHOLESALE_EDIT_DRAFT_KEY);
          toast.info("Your changes were restored. Save them to update the invoice.");
          return;
        }
      } catch {
        // Remove malformed local draft below and load current invoice data.
      }
      sessionStorage.removeItem(WHOLESALE_EDIT_DRAFT_KEY);
    }
    form.reset(defaultValues(invoice));
  }, [form, invoice?.id, open]);

  const onSubmit = (values: EditValues) => {
    if (!invoice) return;
    updateInvoice.mutate(
      {
        id: invoice.id,
        data: {
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerEmailCc: values.customerEmailCc ?? "",
          dueDate: values.dueDate,
          description: values.description ?? "",
          notes: values.notes ?? "",
        },
      },
      {
        onSuccess: (result: { warning?: string | null }) => {
          sessionStorage.removeItem(WHOLESALE_EDIT_DRAFT_KEY);
          result.warning
            ? toast.warning(result.warning)
            : toast.success("Payment link updated and invoice resent");
          onOpenChange(false);
        },
        onError: (err) => {
          if (err instanceof WholesaleApiError && err.requiresRecentAuth) {
            const draft: SavedEditDraft = { invoiceId: invoice.id, values };
            sessionStorage.setItem(WHOLESALE_EDIT_DRAFT_KEY, JSON.stringify(draft));
            toast.info("Please confirm your identity to edit this payment link");
            setLocation("/login?reauth=1&returnTo=%2Fwholesale");
            return;
          }
          toast.error(err.message || "Failed to update invoice");
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(95vw,500px)] p-0 sm:max-w-[500px] flex flex-col bg-card overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0 bg-card z-10">
          <SheetTitle className="text-xl font-bold tracking-tight">Edit payment link</SheetTitle>
          <SheetDescription>
            Update the invoice details for {invoice ? `reference ${invoice.referenceNumber}` : "this payment"}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form id="edit-wholesale-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-md border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    The Wallid payment URL, reference, amount, and line items are locked. Editing will resend the
                    same link with the updated invoice details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/30 p-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-semibold">{invoice?.referenceNumber ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold">
                    {invoice
                       ? new Intl.NumberFormat("en-GB", {
                           style: "currency",
                           currency: invoice.currency ?? "GBP",
                         }).format(invoice.totalGbp)
                      : "—"}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Customer name *</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Customer email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmailCc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Customer email CC</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@mail.com" {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Due date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description..." {...field} className="bg-background min-h-[80px] shadow-sm resize-y" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="pb-6">
                    <FormLabel className="font-semibold text-sm">Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add internal notes..." {...field} className="bg-background min-h-[80px] shadow-sm resize-y" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="p-5 border-t bg-card shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
          <Button
            type="submit"
            form="edit-wholesale-form"
            className="w-full h-11 text-base font-semibold shadow-sm"
            disabled={!invoice || updateInvoice.isPending}
          >
            {updateInvoice.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save and resend invoice
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}