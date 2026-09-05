import { useState } from "react";
import { Link } from "wouter";
import { useListAdminCustomers, getListAdminCustomersQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Eye, Download } from "lucide-react";
import { toast } from "sonner";

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

export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const limit = 20;
  
  const offset = (page - 1) * limit;
  const queryParams = { limit, offset, ...(search ? { search } : {}) };
  
  const { data, isLoading } = useListAdminCustomers(queryParams, {
    query: { queryKey: getListAdminCustomersQueryKey(queryParams) }
  });

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);
  const formatJoinedDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

  function countryFlag(cc: string) {
    return cc.toUpperCase().replace(/\p{L}/gu, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
  }

  function locationCell(customer: { city?: string | null; country?: string | null; lastSeenCountry?: string | null }) {
    const billing = customer.city ? `${customer.city}${customer.country ? `, ${customer.country}` : ""}` : (customer.country ?? null);
    const ipCC = (customer as { lastSeenCountry?: string | null }).lastSeenCountry;
    return (
      <span className="flex items-center gap-1.5">
        {billing && <span className="text-muted-foreground">{billing}</span>}
        {ipCC && (
          <span title={`IP country: ${ipCC}`} className="text-base leading-none">
            {countryFlag(ipCC)}
          </span>
        )}
        {!billing && !ipCC && <span className="text-muted-foreground">—</span>}
      </span>
    );
  }

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const qs = params.toString();
      const today = new Date().toISOString().slice(0, 10);
      await downloadCsv(`/api/admin/customers/export${qs ? `?${qs}` : ""}`, `registered-users-${today}.csv`);
      toast.success("Registered users exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registered Users</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {data ? `${data.total.toLocaleString()} website account${data.total === 1 ? "" : "s"}` : "Website accounts"}
          </p>
        </div>
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
            placeholder="Search registered users..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spend</TableHead>
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
            ) : data?.customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No registered users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium" data-label="Name">{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell className="text-muted-foreground" data-label="Email">{customer.email}</TableCell>
                   <TableCell className="text-muted-foreground whitespace-nowrap" data-label="Joined">{formatJoinedDate(customer.createdAt)}</TableCell>
                  <TableCell data-label="Location">{locationCell(customer as { city?: string | null; country?: string | null; lastSeenCountry?: string | null })}</TableCell>
                  <TableCell className="text-right" data-label="Orders">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right font-medium" data-label="Total Spend">{formatCurrency(customer.totalSpendGbp)}</TableCell>
                  <TableCell data-label="Actions">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/customers/${customer.id}`}>
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={offset + limit >= data.total}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
