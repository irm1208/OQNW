import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type Summary = {
  from: string; to: string;
  revenue: number; orders: number; avgOrderValue: number;
  unitsSold: number; newCustomers: number;
};
type DayRow = { date: string; revenue: number; orders: number };
type ProductRow = { productId: string; productName: string; unitsSold: number; revenue: number };
type CategoryRow = { category: string | null; revenue: number; unitsSold: number; orders: number };

const gbp = (n: number) => `£${(n ?? 0).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map(r => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [from, setFrom] = useState(isoDaysAgo(30));
  const [to, setTo] = useState(isoDaysAgo(0));
  const [applied, setApplied] = useState({ from: isoDaysAgo(30), to: isoDaysAgo(0) });

  const qs = `from=${applied.from}&to=${applied.to}`;

  const { data: summary } = useQuery<Summary>({
    queryKey: ["report-summary", applied],
    queryFn: () => fetch(api(`admin/reports/summary?${qs}`), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<Summary>; }),
  });
  const { data: days = [] } = useQuery<DayRow[]>({
    queryKey: ["report-timeseries", applied],
    queryFn: () => fetch(api(`admin/reports/timeseries?${qs}`), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<DayRow[]>; }),
  });
  const { data: products = [] } = useQuery<ProductRow[]>({
    queryKey: ["report-top-products", applied],
    queryFn: () => fetch(api(`admin/reports/top-products?${qs}`), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<ProductRow[]>; }),
  });
  const { data: categories = [] } = useQuery<CategoryRow[]>({
    queryKey: ["report-by-category", applied],
    queryFn: () => fetch(api(`admin/reports/by-category?${qs}`), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<CategoryRow[]>; }),
  });

  const maxRevenue = Math.max(1, ...days.map(d => d.revenue));

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">Sales performance over a custom date range</p>
        </div>
        <div className="page-actions flex items-end gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">From</label>
            <Input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} className="w-full sm:w-40" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <Input type="date" value={to} min={from} onChange={e => setTo(e.target.value)} className="w-full sm:w-40" />
          </div>
          <Button onClick={() => setApplied({ from, to })}>Apply</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Revenue</p>
          <p className="text-2xl font-bold">{gbp(summary?.revenue ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Orders</p>
          <p className="text-2xl font-bold">{summary?.orders ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Avg Order</p>
          <p className="text-2xl font-bold">{gbp(summary?.avgOrderValue ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Units Sold</p>
          <p className="text-2xl font-bold">{summary?.unitsSold ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">New Customers</p>
          <p className="text-2xl font-bold">{summary?.newCustomers ?? 0}</p>
        </div>
      </div>

      <section className="rounded-xl border bg-card">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Daily Sales</h3>
          <Button variant="outline" size="sm" disabled={days.length === 0}
            onClick={() => downloadCsv(`sales_${applied.from}_${applied.to}.csv`, ["date", "revenue", "orders"], days.map(d => [d.date, d.revenue, d.orders]))}>
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
        </div>
        {days.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No sales in this range</div>
        ) : (
          <div className="p-5 space-y-1.5 max-h-80 overflow-y-auto">
            {days.map(d => (
              <div key={d.date} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted-foreground text-xs">{d.date}</span>
                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(d.revenue / maxRevenue) * 100}%` }} />
                </div>
                <span className="w-24 shrink-0 text-right font-medium">{gbp(d.revenue)}</span>
                <span className="w-16 shrink-0 text-right text-muted-foreground text-xs">{d.orders} ord</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border bg-card">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h3 className="font-semibold">Top Products</h3>
            <Button variant="outline" size="sm" disabled={products.length === 0}
              onClick={() => downloadCsv(`top_products_${applied.from}_${applied.to}.csv`, ["productId", "productName", "unitsSold", "revenue"], products.map(p => [p.productId, p.productName, p.unitsSold, p.revenue]))}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No data</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Product</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Units</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productId} className="border-b last:border-0">
                    <td className="px-4 py-2">{p.productName}</td>
                    <td className="px-4 py-2 text-right">{p.unitsSold}</td>
                    <td className="px-4 py-2 text-right font-medium">{gbp(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-card">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h3 className="font-semibold">By Category</h3>
            <Button variant="outline" size="sm" disabled={categories.length === 0}
              onClick={() => downloadCsv(`by_category_${applied.from}_${applied.to}.csv`, ["category", "unitsSold", "orders", "revenue"], categories.map(c => [c.category ?? "Uncategorised", c.unitsSold, c.orders, c.revenue]))}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
          </div>
          {categories.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No data</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Category</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Units</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-2">{c.category ?? "Uncategorised"}</td>
                    <td className="px-4 py-2 text-right">{c.unitsSold}</td>
                    <td className="px-4 py-2 text-right font-medium">{gbp(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
