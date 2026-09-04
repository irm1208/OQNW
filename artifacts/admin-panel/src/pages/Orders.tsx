import { useState } from "react";
import { Link } from "wouter";
import { useListAdminOrders, getListAdminOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Eye, Download, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAlertIds } from "@/hooks/useAlerts";
import { AdminNotificationBadge } from "@/components/AdminNotificationBadge";

async function downloadCsv(url: string, filename: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "payment_received", label: "Payment Received" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));

export default function Orders() {
  const notifiedOrderIds = useAlertIds("order");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [applying, setApplying] = useState(false);
  const queryClient = useQueryClient();
  const limit = 20;

  const offset = (page - 1) * limit;
  const queryParams = {
    limit,
    offset,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading } = useListAdminOrders(queryParams, {
    query: { queryKey: getListAdminOrdersQueryKey(queryParams) },
  });

  const orders = data?.orders ?? [];
  const pageIds = orders.map((o) => o.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  function toggleOne(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkStatus("");
  }

  async function handleBulkApply() {
    if (!bulkStatus || selectedIds.size === 0) return;
    setApplying(true);
    try {
      const res = await fetch("/api/admin/orders/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: Array.from(selectedIds), status: bulkStatus }),
      });
      if (!res.ok) throw new Error("Bulk update failed");
      const { updated } = await res.json();
      toast.success(`${updated} order${updated !== 1 ? "s" : ""} updated to "${bulkStatus}"`);
      clearSelection();
      queryClient.invalidateQueries({ queryKey: getListAdminOrdersQueryKey(queryParams) });
    } catch {
      toast.error("Bulk update failed");
    } finally {
      setApplying(false);
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200";
      case "shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200";
      case "payment_received": return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 hover:bg-teal-200";
      case "awaiting_payment": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200";
    }
  };

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      const qs = params.toString();
      const today = new Date().toISOString().slice(0, 10);
      await downloadCsv(`/api/admin/orders/export${qs ? `?${qs}` : ""}`, `orders-${today}.csv`);
      toast.success("Orders exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="page-actions">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Export CSV
          </Button>
        </div>
      </div>

      <div className="page-filters flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
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

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-muted/60 border rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">
            {selectedIds.size} order{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="page-actions flex items-center gap-2 ml-auto">
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="Change status to…" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleBulkApply}
              disabled={!bulkStatus || applying}
            >
              {applying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Apply
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearSelection}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md bg-card">
        <Table className="mobile-orders-table table-fixed sm:table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[44px] sm:table-cell">
                <Checkbox
                  checked={allPageSelected}
                  data-state={somePageSelected && !allPageSelected ? "indeterminate" : undefined}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all on this page"
                />
              </TableHead>
              <TableHead className="w-[52%] sm:w-auto">Order</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Customer</TableHead>
              <TableHead className="w-[34%] sm:w-auto">Status</TableHead>
              <TableHead className="hidden text-right sm:table-cell">Total</TableHead>
              <TableHead className="w-[44px] sm:w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className={selectedIds.has(order.id) ? "bg-muted/40" : ""}
                  onClick={() => toggleOne(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className="hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={() => toggleOne(order.id)}
                      aria-label={`Select order ${order.orderNumber}`}
                    />
                  </TableCell>
                  <TableCell className="min-w-0 font-medium">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate" title={order.orderNumber}>{order.orderNumber}</span>
                      {notifiedOrderIds.has(order.id) && <AdminNotificationBadge type="order" itemId={order.id} />}
                    </div>
                    <div className="mt-1 space-y-0.5 text-[10px] leading-4 font-normal text-muted-foreground sm:hidden">
                      <div className="truncate">{order.customerName}</div>
                      <div className="flex items-center gap-1.5">
                        <span>{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-foreground">{formatCurrency(order.totalGbp)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>{order.customerName}</span>
                      <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className={`max-w-full truncate px-1.5 text-[10px] sm:px-2.5 sm:text-xs ${getStatusColor(order.status)}`}>
                        {STATUS_LABELS[order.status] ?? (order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                      </Badge>
                      {(order.fraudScore ?? 0) >= 25 && !(order as any).fraudReviewed && (
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0.5 gap-1 ${
                            (order.fraudScore ?? 0) >= 50
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }`}
                          title={`Fraud score: ${order.fraudScore}`}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          {order.fraudScore}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-right font-medium sm:table-cell">{formatCurrency(order.totalGbp)}</TableCell>
                  <TableCell className="px-1 sm:px-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
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

      {data && data.total > limit && (
        <div className="page-pagination flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, data.total)} of {data.total} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={offset + limit >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
