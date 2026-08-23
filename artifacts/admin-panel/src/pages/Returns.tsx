import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type ReturnRecord = {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  reason: string;
  status: string;
  refundAmountGbp: number | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = [
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "refunded", label: "Refunded" },
  { value: "rejected", label: "Rejected" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "refunded": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "approved": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "requested": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export default function Returns() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ReturnRecord | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRefund, setEditRefund] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const limit = 20;
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search) params.set("search", search);
  if (statusFilter !== "all") params.set("status", statusFilter);

  const queryKey = ["admin-returns", search, statusFilter, page];

  const { data, isLoading } = useQuery<{ returns: ReturnRecord[]; total: number }>({
    queryKey,
    queryFn: () => apiFetch(`/api/admin/returns?${params}`),
  });

  function openEdit(r: ReturnRecord) {
    setEditing(r);
    setEditStatus(r.status);
    setEditRefund(r.refundAmountGbp !== null ? String(r.refundAmountGbp) : "");
    setEditNotes(r.adminNotes ?? "");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/returns/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          refundAmountGbp: editRefund !== "" ? parseFloat(editRefund) : null,
          adminNotes: editNotes || null,
        }),
      });
      toast.success("Return updated");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey });
    } catch {
      toast.error("Failed to update return");
    } finally {
      setSaving(false);
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  const returns = data?.returns ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Returns & Refunds</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search returns..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Refund</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : returns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No returns found.
                </TableCell>
              </TableRow>
            ) : (
              returns.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link href={`/orders/${r.orderId}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                      {r.orderNumber}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{r.customerName}</span>
                      <span className="text-xs text-muted-foreground">{r.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {r.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(r.status)}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {r.refundAmountGbp !== null ? formatCurrency(r.refundAmountGbp) : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openEdit(r)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={offset + limit >= total}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Return — {editing?.orderNumber}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                <p className="font-medium text-foreground mb-1">{editing.customerName}</p>
                <p className="italic">"{editing.reason}"</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Refund Amount (£)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 49.99"
                  value={editRefund}
                  onChange={(e) => setEditRefund(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  placeholder="Internal notes about this return..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
