import { useState } from "react";
import { 
  useListAdminDiscounts, 
  getListAdminDiscountsQueryKey,
  useCreateAdminDiscount,
  useUpdateAdminDiscount
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Archive, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { DiscountCode } from "@workspace/api-client-react";

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20).toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be greater than 0"),
  minSpend: z.coerce.number().nonnegative().optional().or(z.literal("")),
  usageLimit: z.coerce.number().positive().optional().or(z.literal("")),
});

export default function Discounts() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);

  const { data: discounts, isLoading } = useListAdminDiscounts({
    query: { queryKey: getListAdminDiscountsQueryKey() }
  });

  const createDiscount = useCreateAdminDiscount();
  const updateDiscount = useUpdateAdminDiscount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      minSpend: "",
      usageLimit: "",
    },
  });

  const openCreateDialog = () => {
    setEditingDiscount(null);
    form.reset({ code: "", type: "percentage", value: 10, minSpend: "", usageLimit: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    form.reset({
      code: discount.code,
      type: discount.type as any,
      value: discount.value,
      minSpend: discount.minSpend || "",
      usageLimit: discount.usageLimit || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      minSpend: values.minSpend === "" ? undefined : Number(values.minSpend),
      usageLimit: values.usageLimit === "" ? undefined : Number(values.usageLimit),
    };

    if (editingDiscount) {
      updateDiscount.mutate({ id: editingDiscount.id, data }, {
        onSuccess: () => {
          toast.success("Discount code updated");
          queryClient.invalidateQueries({ queryKey: getListAdminDiscountsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to update discount")
      });
    } else {
      createDiscount.mutate({ data }, {
        onSuccess: () => {
          toast.success("Discount code created");
          queryClient.invalidateQueries({ queryKey: getListAdminDiscountsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.error || "Failed to create discount")
      });
    }
  };

  const handleToggleActive = (discount: DiscountCode, isActive: boolean) => {
    if (!isActive && !confirm(`Deactivate ${discount.code}? It will no longer be available at checkout.`)) return;
    updateDiscount.mutate({ id: discount.id, data: { isActive } }, {
      onSuccess: () => {
        toast.success(`Discount ${discount.code} ${isActive ? 'activated' : 'deactivated'}`);
        queryClient.invalidateQueries({ queryKey: getListAdminDiscountsQueryKey() });
      },
      onError: () => toast.error("Failed to toggle status")
    });
  };

  const handleArchive = (discount: DiscountCode) => {
    if (!confirm(`Archive ${discount.code}? It will be deactivated and retained for historical orders.`)) return;
    updateDiscount.mutate({ id: discount.id, data: { isActive: false } }, {
      onSuccess: () => {
        toast.success("Discount archived");
        queryClient.invalidateQueries({ queryKey: getListAdminDiscountsQueryKey() });
      },
      onError: () => toast.error("Failed to archive discount")
    });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Discounts & Promotions</h2>
        <div className="page-actions">
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Create Discount
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Conditions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : discounts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No discount codes found.
                </TableCell>
              </TableRow>
            ) : (
              discounts?.map((discount) => (
                <TableRow key={discount.id} className={!discount.isActive ? "opacity-60" : ""}>
                  <TableCell className="font-mono font-medium" data-label="Code">{discount.code}</TableCell>
                  <TableCell data-label="Value">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {discount.type === 'percentage' ? `${discount.value}% OFF` : `${formatCurrency(discount.value)} OFF`}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="Usage">
                    {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : 'used'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground" data-label="Conditions">
                    {discount.minSpend ? `Min. spend ${formatCurrency(discount.minSpend)}` : 'None'}
                  </TableCell>
                  <TableCell data-label="Status">
                    <Switch 
                      checked={discount.isActive}
                      onCheckedChange={(c) => handleToggleActive(discount, c)}
                    />
                  </TableCell>
                  <TableCell className="text-right" data-label="Actions">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEditDialog(discount)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label={`Archive ${discount.code}`} title="Archive (deactivate)" disabled={!discount.isActive || updateDiscount.isPending} onClick={() => handleArchive(discount)}>
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount Code' : 'Create Discount Code'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SUMMER20" {...field} className="uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (£)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minSpend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Spend (£) - Optional</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit - Optional</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Unlimited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createDiscount.isPending || updateDiscount.isPending}>
                  {(createDiscount.isPending || updateDiscount.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingDiscount ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
