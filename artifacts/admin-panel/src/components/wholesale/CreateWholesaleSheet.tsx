import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Info } from "lucide-react";
import { useCatalog, useCreateWholesaleInvoice } from "@/hooks/use-wholesale";
import { toast } from "sonner";

const itemSchema = z.object({
  productId: z.coerce.number().min(1, "Required"),
  quantity: z.coerce.number().min(1, "Min 1"),
  priceGbp: z.union([z.string(), z.number()]).refine(v => v !== "", "Required").transform(v => Number(v)).pipe(z.number().positive("Enter a price above £0")),
});

const formSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerEmailCc: z.string().optional().refine(val => !val || /^\S+@\S+\.\S+$/.test(val), "Invalid email"),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one line item is required"),
}).refine((value) => new Set(value.items.map((item) => item.productId)).size === value.items.length, {
  path: ["items"],
  message: "Each product can only be added once",
});

type FormValues = z.infer<typeof formSchema>;

export function CreateWholesaleSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: catalogData } = useCatalog();
  const createInvoice = useCreateWholesaleInvoice();
  const [showNotes, setShowNotes] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referenceNumber: "",
      customerName: "",
      customerEmail: "",
      customerEmailCc: "",
      dueDate: "",
      description: "",
      notes: "",
      items: [{ productId: 0, quantity: 1, priceGbp: "" as any }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  
  const totalAmount = useMemo(() => {
    return watchedItems.reduce((acc, item) => {
      const price = Number(item.priceGbp) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + (price * qty);
    }, 0);
  }, [watchedItems]);

  const handleProductSelect = (index: number, productId: string) => {
    const id = Number(productId);
    form.setValue(`items.${index}.productId`, id);
  };

  const onSubmit = (data: FormValues) => {
    createInvoice.mutate(data, {
      onSuccess: (result: { warning?: string | null }) => {
        result.warning ? toast.warning(result.warning) : toast.success("Payment link created and invoice sent");
        form.reset();
        setShowNotes(false);
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create payment");
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setShowNotes(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[min(95vw,500px)] p-0 sm:max-w-[500px] flex flex-col bg-card overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b shrink-0 bg-card z-10">
          <SheetTitle className="text-xl font-bold tracking-tight">Create payment</SheetTitle>
          <SheetDescription className="sr-only">Create a new wholesale payment link.</SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form id="wholesale-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Reference number *</FormLabel>
                    <FormControl>
                      <Input placeholder="001" {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="font-semibold text-sm">Amount</FormLabel>
                <div className="flex rounded-md border border-input overflow-hidden shadow-sm">
                  <div className="bg-muted px-4 py-2 text-muted-foreground border-r font-medium flex items-center justify-center">
                    £
                  </div>
                  <Input 
                    disabled 
                    value={totalAmount.toFixed(2)} 
                    className="border-0 rounded-none bg-background disabled:opacity-100 disabled:text-foreground font-medium focus-visible:ring-0 focus-visible:ring-offset-0" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel className="font-semibold text-sm">Bank account</FormLabel>
                <Select disabled defaultValue="wallid">
                  <SelectTrigger className="bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallid">Wallid Business Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <FormLabel className="font-semibold text-sm">Payer account</FormLabel>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <RadioGroup defaultValue="any" className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="r1" className="text-primary border-primary fill-primary" />
                    <label htmlFor="r1" className="text-sm font-medium leading-none cursor-pointer">
                      Any bank account
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specified" id="r2" disabled />
                    <label htmlFor="r2" className="text-sm font-medium leading-none opacity-50 cursor-not-allowed">
                      Specified bank account
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Customer name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-background shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-semibold text-sm">Line items *</FormLabel>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start p-3 bg-muted/40 border rounded-md">
                      <div className="grid grid-cols-12 gap-2 flex-1">
                        <div className="col-span-12 sm:col-span-6">
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field: selectField }) => (
                              <FormItem>
                                <Select 
                                  value={selectField.value ? String(selectField.value) : ""} 
                                  onValueChange={(val) => handleProductSelect(index, val)}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-background text-sm h-9 shadow-sm">
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {catalogData?.map(p => (
                                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field: inputField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" min="1" placeholder="Qty" {...inputField} className="bg-background text-sm h-9 shadow-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.priceGbp`}
                            render={({ field: inputField }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-2.5 top-2 text-muted-foreground text-sm font-medium">£</div>
                                    <Input type="number" step="0.01" min="0" placeholder="Price" {...inputField} className="bg-background text-sm h-9 pl-6 shadow-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-dashed shadow-sm"
                  onClick={() => append({ productId: 0, quantity: 1, priceGbp: "" as any })}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add line item
                </Button>
                {form.formState.errors.items?.root && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.items.root.message}</p>
                )}
              </div>

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

              <div className="rounded-md border border-dashed bg-muted/30 px-4 py-3">
                <p className="text-sm font-semibold">Attachment</p>
                <p className="mt-1 text-xs text-muted-foreground">A branded PDF invoice and the payment QR code are attached automatically.</p>
              </div>

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm">Customer email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@mail.com" {...field} className="bg-background shadow-sm" />
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

              <div className="space-y-2 pb-6">
                <FormLabel className="font-semibold text-sm">Notes (optional)</FormLabel>
                {!showNotes ? (
                  <div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-2 -ml-2 text-sm font-medium"
                      onClick={() => setShowNotes(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add note
                    </Button>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Add internal notes..." {...field} className="bg-background min-h-[80px] shadow-sm resize-y" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </form>
          </Form>
        </div>

        <div className="p-5 border-t bg-card shrink-0 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
          <Button 
            type="submit" 
            form="wholesale-form" 
            className="w-full h-11 text-base font-semibold shadow-sm"
            disabled={createInvoice.isPending}
          >
            {createInvoice.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create payment link
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
