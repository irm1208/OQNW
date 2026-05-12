import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api${path}`; }
function apiFetch(url: string, options?: RequestInit) {
  return fetch(url, { credentials: "include", ...options }).then(r => {
    if (!r.ok) throw new Error("Request failed");
    return r.json();
  });
}

type Review = {
  id: number;
  productId: number;
  customerId: number;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          style={{ color: s <= rating ? "#F59E0B" : "#E2E8F0", fill: s <= rating ? "#F59E0B" : "#E2E8F0" }}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 25;

  const queryKey = ["admin-reviews", { search, statusFilter, page }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      return apiFetch(api(`/admin/reviews?${params}`)) as Promise<{ reviews: Review[]; total: number; page: number; limit: number }>;
    },
    staleTime: 10_000,
  });

  const approve = useMutation({
    mutationFn: ({ id, isApproved }: { id: number; isApproved: boolean }) =>
      apiFetch(api(`/admin/reviews/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      }),
    onSuccess: (_, { isApproved }) => {
      toast.success(isApproved ? "Review approved" : "Review unapproved");
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Failed to update review"),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      apiFetch(api(`/admin/reviews/${id}`), { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Review deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const offset = (page - 1) * limit;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        <p className="text-sm text-muted-foreground mt-1">Moderate customer product reviews</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer name..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.customerName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">#{r.productId}</TableCell>
                  <TableCell>
                    <StarDisplay rating={r.rating} />
                  </TableCell>
                  <TableCell className="max-w-[280px]">
                    <p className="font-medium text-sm truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.body}</p>
                  </TableCell>
                  <TableCell>
                    {r.isApproved ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-0">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      {r.isApproved ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-yellow-600 hover:text-yellow-700"
                          title="Unapprove"
                          onClick={() => approve.mutate({ id: r.id, isApproved: false })}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700"
                          title="Approve"
                          onClick={() => approve.mutate({ id: r.id, isApproved: true })}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete"
                        onClick={() => remove.mutate(r.id)}
                      >
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

      {total > limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={offset + limit >= total}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
