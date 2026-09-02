import { useState } from "react";
import {
  useGetAdminDashboard,
  useGetRevenueChart,
  useGetTopProducts,
  useGetNewCustomersChart,
  useGetOrderStatusBreakdown,
  useGetRevenueByCategoryChart,
  getGetAdminDashboardQueryKey,
  getGetTopProductsQueryKey,
  getGetOrderStatusBreakdownQueryKey,
  getGetRevenueByCategoryChartQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Loader2,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  AlertCircle,
  CreditCard,
} from "lucide-react";

type Period = 7 | 30 | 90 | 365;

const PERIOD_LABELS: Record<Period, string> = { 7: "7d", 30: "30d", 90: "90d", 365: "1y" };

const STATUS_COLORS: Record<string, string> = {
  pending: "#d9970f",
  processing: "#f4780c",
  shipped: "#ffb266",
  delivered: "#21a366",
  cancelled: "#d94f45",
  returned: "#8a7a66",
};

const CATEGORY_COLORS = [
  "#f4780c",
  "#ffb266",
  "#e2660a",
  "#ffd9ad",
  "#21a366",
  "#d9970f",
  "#ffe9d4",
  "#8a7a66",
];

function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex gap-1 bg-muted rounded-full p-1">
      {(Object.keys(PERIOD_LABELS) as unknown as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
            value === p
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>(30);

  const { data: stats, isLoading: statsLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() },
  });
  const { data: revenueData, isLoading: chartLoading } = useGetRevenueChart(
    { period },
    { query: { queryKey: ["revenue-chart", period] } }
  );
  const { data: topProducts, isLoading: productsLoading } = useGetTopProducts({
    query: { queryKey: getGetTopProductsQueryKey() },
  });
  const { data: newCustomers, isLoading: customersLoading } = useGetNewCustomersChart(
    { period },
    { query: { queryKey: ["new-customers-chart", period] } }
  );
  const { data: orderStatus, isLoading: statusLoading } = useGetOrderStatusBreakdown({
    query: { queryKey: getGetOrderStatusBreakdownQueryKey() },
  });
  const { data: revenueByCategory, isLoading: categoryLoading } = useGetRevenueByCategoryChart({
    query: { queryKey: getGetRevenueByCategoryChartQueryKey() },
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);
  const formatShort = (val: number) =>
    val >= 1000 ? `£${(val / 1000).toFixed(1)}k` : `£${val.toFixed(0)}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { month: "short", day: "numeric" });

  const isLoading =
    statsLoading || chartLoading || productsLoading || customersLoading || statusLoading || categoryLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.revenueToday),
      icon: TrendingUp,
      sub: `${stats.ordersToday} order${stats.ordersToday !== 1 ? "s" : ""} today`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
      sub: null,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      sub: null,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      sub: null,
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats.avgOrderValue),
      icon: Package,
      sub: null,
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockCount.toString(),
      icon: AlertCircle,
      sub: null,
      danger: stats.lowStockCount > 0,
    },
  ];

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card, i) => (
          <Card
            key={card.title}
            className={
              i === 0
                ? "border-[1.5px] border-dashed border-primary bg-accent/60"
                : undefined
            }
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {card.title}
              </CardTitle>
              <span
                className={`grid h-8 w-8 place-items-center rounded-full ${
                  card.danger
                    ? "bg-destructive/10 text-destructive"
                    : i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-primary"
                }`}
              >
                <card.icon className="w-4 h-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div
                className={`font-mono text-2xl font-bold ${card.danger ? "text-destructive" : ""}`}
              >
                {card.value}
              </div>
              {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue + Order Status */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDate}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={formatShort}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                    labelFormatter={(label) =>
                      new Date(label as string).toLocaleDateString("en-GB", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus ?? []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {(orderStatus ?? []).map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [val, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {(orderStatus ?? []).map((s) => (
                <div key={s.status} className="flex items-center gap-1 text-xs">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: STATUS_COLORS[s.status] ?? "#94a3b8" }}
                  />
                  <span className="text-muted-foreground capitalize">{s.status}</span>
                  <span className="font-medium">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Customers + Revenue by Category */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={newCustomers ?? []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDate}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(val: number) => [val, "New Customers"]}
                    labelFormatter={fmtDate}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    stroke="#21a366"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByCategory ?? []}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={formatShort}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={90}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) =>
                      v.length > 14 ? v.slice(0, 13) + "…" : v
                    }
                  />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {(revenueByCategory ?? []).map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {(topProducts ?? []).map((product, i) => (
              <div key={product.productId} className="flex items-center py-3 gap-4">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">{product.totalSold} units sold</p>
                </div>
                <div className="font-mono text-sm font-semibold text-right">
                  {formatCurrency(product.totalRevenue)}
                </div>
              </div>
            ))}
            {(topProducts ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No product data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
