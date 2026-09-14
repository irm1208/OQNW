import { useEffect } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";

const numericFields = ["total_orders", "total_spend_gbp", "days_since_last_order", "account_age_days"] as const;

const conditionSchema = z.discriminatedUnion("field", [
  z.object({
    field: z.enum(numericFields),
    operator: z.enum(["gte", "lte"]),
    value: z.coerce.number().min(0).max(1000000000),
  }),
  z.object({
    field: z.literal("marketing_status"),
    operator: z.literal("equals"),
    value: z.enum(["subscribed", "unsubscribed"]),
  }),
  z.object({
    field: z.enum(["has_abandoned_cart", "has_wholesale_order", "is_referred", "is_affiliate"]),
    operator: z.literal("equals"),
    value: z.union([z.boolean(), z.string().transform(s => s === "true")]),
  })
]);

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(2000).nullable().optional(),
  rules: z.object({
    matchMode: z.literal("all"),
    conditions: z.array(conditionSchema).min(1, "At least one rule is required").max(20, "Maximum 20 rules allowed"),
  })
});

type FormValues = z.infer<typeof formSchema>;

interface SegmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FormValues | null;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  total_orders: "Total Orders",
  total_spend_gbp: "Total Spend (£)",
  days_since_last_order: "Days Since Last Order",
  account_age_days: "Account Age (Days)",
  marketing_status: "Marketing Status",
  has_abandoned_cart: "Has Abandoned Cart",
  has_wholesale_order: "Has Wholesale Order",
  is_referred: "Is Referred",
  is_affiliate: "Is Affiliate",
};

export function SegmentFormDialog({ open, onOpenChange, initialData, onSubmit, isSubmitting }: SegmentFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as never) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      description: "",
      rules: {
        matchMode: "all",
        conditions: [
          { field: "total_orders", operator: "gte", value: 1 }
        ]
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules.conditions",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          name: "",
          description: "",
          rules: {
            matchMode: "all",
            conditions: [{ field: "total_orders", operator: "gte", value: 1 }]
          }
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: FormValues) => {
    const cleanedConditions = data.rules.conditions.map(c => {
      if (
        c.field === "has_abandoned_cart" ||
        c.field === "has_wholesale_order" ||
        c.field === "is_referred" ||
        c.field === "is_affiliate"
      ) {
        return { ...c, value: c.value === true || String(c.value) === "true" };
      }
      return c;
    });

    onSubmit({
      ...data,
      rules: {
        ...data.rules,
        conditions: cleanedConditions as any
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Segment" : "Create Segment"}</DialogTitle>
          <DialogDescription>
            Dynamic segments automatically group customers based on live rules.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. VIP Customers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What does this segment represent?" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Rules</h4>
                  <p className="text-xs text-muted-foreground">All rules must match for a customer to be included.</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ field: "total_orders", operator: "gte", value: 1 })}
                  disabled={fields.length >= 20}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              {form.formState.errors.rules?.conditions?.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.rules.conditions.root.message}
                </p>
              )}

              <div className="bg-muted/30 border rounded-md p-4 space-y-3">
                {fields.map((field, index) => {
                  const conditionField = form.watch(`rules.conditions.${index}.field`);

                  const isNumeric = [
                    "total_orders", "total_spend_gbp", "days_since_last_order", "account_age_days"
                  ].includes(conditionField);
                  const isMarketing = conditionField === "marketing_status";
                  const isBoolean = [
                    "has_abandoned_cart", "has_wholesale_order", "is_referred", "is_affiliate"
                  ].includes(conditionField);

                  return (
                    <div key={field.id} className="flex flex-col sm:flex-row items-start gap-2 bg-background p-2 rounded border">
                      <FormField
                        control={form.control}
                        name={`rules.conditions.${index}.field`}
                        render={({ field }) => (
                          <FormItem className="flex-1 w-full sm:w-auto">
                            <Select 
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (["total_orders", "total_spend_gbp", "days_since_last_order", "account_age_days"].includes(val)) {
                                  form.setValue(`rules.conditions.${index}.operator`, "gte");
                                  form.setValue(`rules.conditions.${index}.value`, 0);
                                } else if (val === "marketing_status") {
                                  form.setValue(`rules.conditions.${index}.operator`, "equals");
                                  form.setValue(`rules.conditions.${index}.value`, "subscribed");
                                } else {
                                  form.setValue(`rules.conditions.${index}.operator`, "equals");
                                  form.setValue(`rules.conditions.${index}.value`, true as any);
                                }
                              }} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(FIELD_LABELS).map(([k, v]) => (
                                  <SelectItem key={k} value={k}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`rules.conditions.${index}.operator`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-32 shrink-0">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Operator" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isNumeric && (
                                  <>
                                    <SelectItem value="gte">At least</SelectItem>
                                    <SelectItem value="lte">At most</SelectItem>
                                  </>
                                )}
                                {(isMarketing || isBoolean) && (
                                  <SelectItem value="equals">Equals</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`rules.conditions.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1 w-full sm:w-auto">
                            {isNumeric && (
                              <FormControl>
                                <Input type="number" step="any" {...field} value={field.value as any} />
                              </FormControl>
                            )}
                            {isMarketing && (
                              <Select onValueChange={field.onChange} value={String(field.value)}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="subscribed">Subscribed</SelectItem>
                                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {isBoolean && (
                              <Select onValueChange={(val) => field.onChange(val === "true")} value={String(field.value)}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0 mt-2 sm:mt-0"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        aria-label={`Remove rule ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? "Save Changes" : "Create Segment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}