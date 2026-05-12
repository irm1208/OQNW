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

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const qs = params.toString();
      const today = new Date().toISOString().slice(0, 10);
      await downloadCsv(`/api/admin/customers/export${qs ? `?${qs}` : ""}`, `customers-${today}.csv`);
      toast.success("Customers exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
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
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spend</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              data?.customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.firstName} {customer.lastName}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>{customer.city ? `${customer.city}, ${customer.country}` : customer.country || '-'}</TableCell>
                  <TableCell className="text-right">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpendGbp)}</TableCell>
                  <TableCell>
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
        <div className="flex items-center justify-between">
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
