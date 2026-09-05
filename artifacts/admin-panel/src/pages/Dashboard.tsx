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
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  AlertCircle,
  CreditCard,
  Radio,
} from "lucide-react";

type Period = 7 | 30 | 90 | 365;

const PERIOD_LABELS: Record<Period, string> = { 7: "7D", 30: "30D", 90: "90D", 365: "1Y" };

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(43, 86%, 45%)",
  processing: "hsl(var(--primary))",
  shipped: "hsl(214, 58%, 62%)",
  delivered: "hsl(152, 66%, 38%)",
  cancelled: "hsl(var(--destructive))",
  returned: "hsl(var(--muted-foreground))",
};

const CATEGORY_COLORS = [
  "hsl(var(--primary))",
  "hsl(214, 58%, 62%)",
  "hsl(223, 77%, 22%)",
  "hsl(214, 75%, 82%)",
  "hsl(152, 66%, 38%)",
  "hsl(43, 86%, 45%)",
  "hsl(216, 100%, 92%)",
  "hsl(var(--muted-foreground))",
];

function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/20 p-1 shadow-sm">
      {(Object.keys(PERIOD_LABELS) as unknown as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`relative px-4 py-1.5 text-xs font-bold tracking-wide rounded-md transition-all duration-200 ${
            value == p
              ? "text-foreground shadow-sm bg-background border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
          }`}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "", isDateLabel = false }: any) => {
  if (active && payload && payload.length) {
    const displayLabel = isDateLabel && label
      ? new Date(label).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })
      : label;

    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl p-3 text-sm animate-in fade-in zoom-in-95 duration-200">
        {displayLabel && (
          <div className="text-muted-foreground mb-2 font-bold text-[10px] uppercase tracking-wider">
            {displayLabel}
          </div>
        )}
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color || entry.payload?.fill }}
              />
              <span className="text-muted-foreground font-medium capitalize">{entry.name}:</span>
              <span className="font-bold text-foreground ml-auto pl-4">
                {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString('en-GB') : entry.value}{suffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function DashboardSkeleton() {
  return (
    <div className="admin-page space-y-6 animate-pulse">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-muted rounded-lg"></div>
          <div className="h-4 w-64 bg-muted/50 rounded-lg"></div>
        </div>
        <div className="h-10 w-48 bg-muted rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[120px] bg-card rounded-xl border border-border/50"></div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="h-[360px] md:col-span-8 bg-card rounded-xl border border-border/50"></div>
        <div className="h-[360px] md:col-span-4 bg-card rounded-xl border border-border/50"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="h-[320px] md:col-span-4 bg-card rounded-xl border border-border/50"></div>
        <div className="h-[320px] md:col-span-4 bg-card rounded-xl border border-border/50"></div>
        <div className="h-[320px] md:col-span-4 bg-card rounded-xl border border-border/50"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>(30);

  const { data: stats, isLoading: statsLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey(), refetchInterval: 15_000 },
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
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.revenueToday),
      icon: TrendingUp,
      sub: `${stats.ordersToday} order${stats.ordersToday !== 1 ? "s" : ""} today`,
      primary: true,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: CreditCard,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats.avgOrderValue),
      icon: Package,
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockCount.toString(),
      icon: AlertCircle,
      danger: stats.lowStockCount > 0,
    },
  ];

  const totalOrdersStatus = orderStatus?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {stats.liveVisitors} live
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Monitor your store's performance and operations.</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className={`relative min-w-0 overflow-hidden group hover:border-primary/30 transition-all duration-300 ${
              card.primary ? "border-primary/20 bg-primary/[0.02]" : "border-border/50"
            }`}
          >
            <CardContent className="flex h-full min-h-[122px] flex-col justify-between p-3 sm:min-h-0 sm:p-5">
              <div className="min-w-0 mb-3 sm:mb-4">
                <div className="min-w-0 space-y-1">
                  <p className="pr-8 text-[9px] leading-4 font-semibold text-muted-foreground tracking-[0.08em] uppercase [overflow-wrap:normal] sm:pr-10 sm:text-[9px]">
                    {card.title}
                  </p>
                  <div className={`text-lg font-bold tracking-tight sm:text-2xl ${card.danger ? "text-destructive" : "text-foreground"}`}>
                    {card.value}
                  </div>
                </div>
                <div className={`absolute right-3 top-3 shrink-0 p-1.5 sm:right-4 sm:top-4 sm:p-2 rounded-lg sm:rounded-xl shadow-sm border ${
                  card.danger ? "bg-destructive/10 text-destructive border-destructive/20" :
                  card.primary ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-muted/50 text-muted-foreground border-border/50 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20"
                } transition-colors duration-300`}>
                  <card.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-[10px] leading-4 text-muted-foreground font-medium sm:text-xs">
                {card.sub || <span className="opacity-0">-</span>}
              </div>
            </CardContent>
            <div className={`absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left ${
              card.danger ? "bg-destructive" : "bg-primary"
            }`} />
          </Card>
        ))}
      </div>

      {/* Revenue + Order Status */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="min-w-0 overflow-hidden md:col-span-8 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 flex-1 px-3 sm:px-6">
            <div className="h-[240px] min-w-0 w-full mt-2 sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData ?? []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDate}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    minTickGap={20}
                  />
                  <YAxis
                    tickFormatter={formatShort}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip prefix="£" isDateLabel />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden md:col-span-4 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="relative h-[200px] w-full mb-6 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus ?? []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {(orderStatus ?? []).map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] ?? "hsl(var(--muted-foreground))"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold tracking-tight text-foreground">{totalOrdersStatus}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Orders</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-auto">
              {(orderStatus ?? []).map((s) => (
                <div key={s.status} className="flex min-w-0 items-center justify-between gap-3 text-sm group">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-sm group-hover:scale-125 transition-transform"
                      style={{ background: STATUS_COLORS[s.status] ?? "hsl(var(--muted-foreground))" }}
                    />
                    <span className="truncate text-muted-foreground capitalize font-medium">{s.status.replaceAll("_", " ")}</span>
                  </div>
                  <span className="font-bold text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Customers + Revenue by Category + Top Products */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">New Customers</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={newCustomers ?? []}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDate}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    minTickGap={20}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip isDateLabel />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    name="Customers"
                    stroke="hsl(152, 66%, 38%)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(152, 66%, 38%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByCategory ?? []}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={formatShort}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
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
                  <Tooltip content={<CustomTooltip prefix="£" />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} barSize={16}>
                    {(revenueByCategory ?? []).map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 mt-2">
              {(topProducts ?? []).slice(0, 5).map((product, i) => (
                <div key={product.productId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] shadow-sm ${
                    i === 0 ? "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" :
                    i === 1 ? "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" :
                    i === 2 ? "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" :
                    "bg-muted text-muted-foreground border border-border/50"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{product.productName}</p>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{product.totalSold} units sold</p>
                  </div>
                  <div className="font-mono text-sm font-bold tracking-tight text-foreground">
                    {formatCurrency(product.totalRevenue)}
                  </div>
                </div>
              ))}
              {(topProducts ?? []).length === 0 && (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Package className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">No products sold yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
