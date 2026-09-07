import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListAdminCustomerSegments, 
  getListAdminCustomerSegmentsQueryKey,
  getGetAdminCustomerSegmentQueryKey,
  useCreateAdminCustomerSegment,
  useUpdateAdminCustomerSegment,
  useArchiveAdminCustomerSegment,
  type CustomerSegment,
  type CustomerSegmentCondition,
  type CustomerSegmentInput,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Users, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { SegmentFormDialog } from "@/components/segments/SegmentFormDialog";

function formatCondition(c: CustomerSegmentCondition): string {
  const fields: Record<string, string> = {
    total_orders: "Orders",
    total_spend_gbp: "Spend (£)",
    days_since_last_order: "Days Since Order",
    account_age_days: "Account Age",
    marketing_status: "Marketing",
    has_abandoned_cart: "Abandoned Cart",
    has_wholesale_order: "Wholesale",
    is_referred: "Referred",
    is_affiliate: "Affiliate",
  };
  const fieldName = fields[c.field] || c.field;
  if (c.operator === "gte") return `${fieldName} ≥ ${c.value}`;
  if (c.operator === "lte") return `${fieldName} ≤ ${c.value}`;
  if (c.operator === "equals") return `${fieldName} = ${c.value}`;
  return `${fieldName} ${c.operator} ${c.value}`;
}

export default function CustomerSegments() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useListAdminCustomerSegments();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<CustomerSegment | null>(null);
  
  const [archiveId, setArchiveId] = useState<number | null>(null);

  const createMut = useCreateAdminCustomerSegment();
  const updateMut = useUpdateAdminCustomerSegment();
  const archiveMut = useArchiveAdminCustomerSegment();

  const handleFormSubmit = (formData: CustomerSegmentInput) => {
    if (editingSegment) {
      updateMut.mutate({ id: editingSegment.id, data: formData }, {
        onSuccess: () => {
          toast.success("Segment updated");
          setFormOpen(false);
          queryClient.invalidateQueries({ queryKey: getListAdminCustomerSegmentsQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getGetAdminCustomerSegmentQueryKey(editingSegment.id),
          });
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update segment")
      });
    } else {
      createMut.mutate({ data: formData }, {
        onSuccess: () => {
          toast.success("Segment created");
          setFormOpen(false);
          queryClient.invalidateQueries({ queryKey: getListAdminCustomerSegmentsQueryKey() });
        },
        onError: (err: Error) => toast.error(err.message || "Failed to create segment")
      });
    }
  };

  const handleArchive = () => {
    if (!archiveId) return;
    archiveMut.mutate({ id: archiveId }, {
      onSuccess: () => {
        toast.success("Segment archived");
        queryClient.invalidateQueries({
          queryKey: getGetAdminCustomerSegmentQueryKey(archiveId),
        });
        setArchiveId(null);
        queryClient.invalidateQueries({ queryKey: getListAdminCustomerSegmentsQueryKey() });
      },
      onError: (err: Error) => toast.error(err.message || "Failed to archive segment")
    });
  };

  const openEdit = (segment: CustomerSegment) => {
    setEditingSegment(segment);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingSegment(null);
    setFormOpen(true);
  };

  return (
    <div className="admin-page space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Segments</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage dynamic customer groups for marketing and operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment</TableHead>
              <TableHead>Rules</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Live Matches</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <p className="font-medium text-destructive">Failed to load customer segments</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
                </TableCell>
              </TableRow>
            ) : data?.segments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No segments found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data?.segments?.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell data-label="Segment" className="max-w-[200px]">
                    <div className="font-semibold text-sm truncate">{segment.name}</div>
                    {segment.description && (
                      <div className="text-xs text-muted-foreground truncate" title={segment.description}>
                        {segment.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell data-label="Rules">
                    <div className="flex flex-wrap gap-1">
                      {segment.rules.conditions.map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] font-medium uppercase tracking-wider bg-muted text-muted-foreground">
                          {formatCondition(c)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell data-label="Status">
                    <Badge variant={segment.isActive ? "default" : "outline"}>
                      {segment.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="Live Matches" className="text-right">
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {segment.matchCount?.toLocaleString() ?? 0}
                    </div>
                  </TableCell>
                  <TableCell data-label="Actions" className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="View Members" aria-label={`View members of ${segment.name}`} asChild>
                        <Link href={`/customer-segments/${segment.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit Segment" aria-label={`Edit ${segment.name}`} onClick={() => openEdit(segment)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Archive Segment" aria-label={`Archive ${segment.name}`} className="text-muted-foreground hover:text-destructive" onClick={() => setArchiveId(segment.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SegmentFormDialog 
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingSegment ? {
          name: editingSegment.name,
          description: editingSegment.description,
          rules: editingSegment.rules,
        } : null}
        onSubmit={handleFormSubmit}
        isSubmitting={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog open={!!archiveId} onOpenChange={(open) => !open && setArchiveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Segment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this segment? This action will hide the segment from the list.
              <br/><br/>
              <strong>Note:</strong> Customer accounts and order history will NOT be deleted. This only removes the grouping logic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleArchive(); }} 
              disabled={archiveMut.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {archiveMut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}