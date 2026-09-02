import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Loader2, Search, Share2, AlertTriangle, CheckCircle2, 
  Clock, Eye, AlertCircle
} from "lucide-react";

type ReferralStatus = 'pending' | 'qualified' | 'flagged';

interface CustomerLink {
  id: number;
  name: string;
  email: string;
  joinedAt?: string;
  totalOrders?: number;
  totalSpendGbp?: number;
  referralCode?: string;
  referralCreditGbp?: number;
}

interface FirstOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
}

interface Referral {
  id: number;
  status: ReferralStatus;
  referredCustomer: CustomerLink;
  referrer: CustomerLink | null;
  firstOrder: FirstOrder | null;
  rewardGbp: number;
}

interface ReferralStats {
  total: number;
  pending: number;
  qualified: number;
  flagged: number;
  conversionRate: number;
  outstandingCreditGbp: number;
}

interface ReferralsResponse {
  stats: ReferralStats;
  referrals: Referral[];
}

const STATUS_TABS = [
  { key: "all", label: "All Referrals" },
  { key: "pending", label: "Pending" },
  { key: "qualified", label: "Qualified" },
  { key: "flagged", label: "Flagged" },
];

export default function Referrals() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryKey = ["referrals", activeTab, debouncedSearch];

  const { data, isLoading, isError, refetch, isFetching } = useQuery<ReferralsResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      if (debouncedSearch) params.set("search", debouncedSearch);
      return customFetch<ReferralsResponse>(`/api/admin/referrals?${params.toString()}`);
    },
    staleTime: 30_000,
  });

  const stats = data?.stats;
  const referrals = data?.referrals ?? [];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  const formatPercent = (val: number) => 
    new Intl.NumberFormat("en-GB", { style: "percent", maximumFractionDigits: 1 }).format(val / 100);

  return (
    <div className="admin-page space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Referrals</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold">{stats?.total ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-green-600">
              {stats?.conversionRate !== undefined ? formatPercent(stats.conversionRate) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Conversion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-2xl font-bold text-primary">
              {stats?.outstandingCreditGbp !== undefined ? formatCurrency(stats.outstandingCreditGbp) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Outstanding Credit</p>
          </CardContent>
        </Card>
        <Card className={stats?.flagged && stats.flagged > 0 ? "border-red-200" : ""}>
          <CardContent className="pt-5 pb-4">
            <p className={`text-2xl font-bold ${stats?.flagged && stats.flagged > 0 ? "text-red-600" : "text-muted-foreground"}`}>
              {stats?.flagged ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Flagged for Review</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 border border-muted-border rounded-lg p-4 text-sm flex flex-col md:flex-row gap-4 md:gap-8 shadow-sm">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <div className="leading-snug">
            <span className="font-semibold block">Pending</span>
            <span className="text-muted-foreground text-xs">Registered but no first order.</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <div className="leading-snug">
            <span className="font-semibold block">Qualified</span>
            <span className="text-muted-foreground text-xs">First order recorded and checks passed.</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="leading-snug">
            <span className="font-semibold block">Flagged</span>
            <span className="text-muted-foreground text-xs">Automated referral abuse review required.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between border-b pb-4 sm:pb-0">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap sm:-mb-[1px] ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              {tab.label}
              {tab.key === "flagged" && stats?.flagged ? (
                <span className="ml-2 inline-flex items-center justify-center bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-1 ring-inset ring-red-200">
                  {stats.flagged}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72 sm:mb-2 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email or code..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Referred Customer</TableHead>
              <TableHead className="w-[45%]">Referred By</TableHead>
              <TableHead className="text-center w-[10%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm font-medium">Failed to load referrals</p>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isFetching}
                      onClick={() => void refetch()}
                    >
                      {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : referrals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Share2 className="w-8 h-8 opacity-20" />
                    <p className="text-sm">No referrals found matching your criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              referrals.map(ref => (
                <TableRow key={ref.id} className="group hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Link href={`/customers/${ref.referredCustomer.id}`} className="font-semibold text-primary hover:underline flex items-center gap-1.5 w-max">
                        {ref.referredCustomer.name}
                        <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="text-xs text-muted-foreground">{ref.referredCustomer.email}</span>
                      
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        {ref.firstOrder && (
                          <div className="flex items-center gap-1 text-xs bg-muted/40 border px-1.5 py-0.5 rounded">
                            <span className="font-medium text-foreground">1st Order: {ref.firstOrder.orderNumber}</span>
                            <span className="text-muted-foreground">({ref.firstOrder.status})</span>
                            <span className="text-muted-foreground border-l pl-1 ml-0.5">
                              {new Date(ref.firstOrder.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        )}
                        {ref.referredCustomer.totalSpendGbp !== undefined && ref.referredCustomer.totalSpendGbp > 0 && (
                          <span className="text-muted-foreground">
                            LTV: <span className="font-medium text-foreground">{formatCurrency(ref.referredCustomer.totalSpendGbp)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {ref.referrer ? (
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/customers/${ref.referrer.id}`} className="font-semibold text-primary hover:underline flex items-center gap-1.5 w-max">
                          {ref.referrer.name}
                          <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-xs text-muted-foreground">{ref.referrer.email}</span>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          {ref.referrer.referralCode && (
                            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-muted/50">
                              {ref.referrer.referralCode}
                            </Badge>
                          )}
                          {ref.status === "qualified" ? (
                            <span className="text-muted-foreground">
                              Qualified reward: <span className="font-medium text-foreground">{formatCurrency(ref.rewardGbp)}</span>
                            </span>
                          ) : ref.status === "flagged" ? (
                            <span className="font-medium text-red-600">Reward held for review</span>
                          ) : (
                            <span className="text-muted-foreground">Awaiting first order</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Unknown Referrer</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {ref.status === 'qualified' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3 mr-1.5" />
                        Qualified
                      </Badge>
                    ) : ref.status === 'flagged' ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-2 py-0.5">
                        <AlertTriangle className="w-3 h-3 mr-1.5" />
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-0.5">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}