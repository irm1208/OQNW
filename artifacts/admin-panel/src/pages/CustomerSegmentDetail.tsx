import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { 
  useGetAdminCustomerSegment, 
  getGetAdminCustomerSegmentQueryKey,
  type CustomerSegmentCondition,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Users, ExternalLink, Calendar } from "lucide-react";

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

const formatCurrency = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);
const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(value));

export default function CustomerSegmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const segmentId = Number(id);
  const hasValidId = Number.isSafeInteger(segmentId) && segmentId > 0;
  
  const [page, setPage] = useState(1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useGetAdminCustomerSegment(
    segmentId, 
    { limit, offset },
    {
      query: {
        queryKey: getGetAdminCustomerSegmentQueryKey(segmentId, { limit, offset }),
        enabled: hasValidId,
      },
    }
  );

  if (!hasValidId) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Invalid segment ID</p>
          <Button onClick={() => navigate("/customer-segments")}>Back to Segments</Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-page flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive font-medium">Failed to load segment details</p>
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" onClick={() => navigate("/customer-segments")}>Back to Segments</Button>
      </div>
    );
  }

  const { segment, members, total } = data || {};

  return (
    <div className="admin-page space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/customer-segments" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Segments
        </Link>
        <span>/</span>
        <span className="text-foreground">{segment?.name || "Loading..."}</span>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : segment ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  {segment.name}
                  <Badge variant={segment.isActive ? "default" : "secondary"}>
                    {segment.isActive ? "Active" : "Inactive"}
                  </Badge>
                </h2>
                {segment.description && (
                  <p className="text-muted-foreground mt-2">{segment.description}</p>
                )}
              </div>
              <div className="bg-muted/30 px-4 py-3 rounded-lg border flex items-center gap-4 text-sm shrink-0">
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Live Matches</span>
                  <div className="flex items-center gap-1.5 font-bold text-lg mt-0.5">
                    <Users className="w-4 h-4 text-primary" />
                    {total?.toLocaleString() ?? 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">Segment Rules (Match {segment.rules.matchMode.toUpperCase()})</h3>
              <div className="flex flex-wrap gap-2">
                {segment.rules.conditions.map((c, i) => (
                  <div key={i} className="bg-background border rounded px-3 py-1.5 text-xs font-medium font-mono text-muted-foreground">
                    {formatCondition(c)}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Matching Customers
        </h3>
        
        <div className="border rounded-md bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Marketing</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : members?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No customers match these rules.
                  </TableCell>
                </TableRow>
              ) : (
                members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell data-label="Customer">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </TableCell>
                    <TableCell data-label="Marketing">
                      <Badge variant={member.marketingStatus === "subscribed" ? "default" : "outline"} className="text-[10px]">
                        {member.marketingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell data-label="Orders" className="text-right">
                      {member.orderCount}
                    </TableCell>
                    <TableCell data-label="Total Spend" className="text-right font-medium">
                      {formatCurrency(member.totalSpendGbp)}
                    </TableCell>
                    <TableCell data-label="Last Order" className="text-muted-foreground">
                      {member.lastOrderAt ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3 h-3" />
                          {formatDate(member.lastOrderAt)}
                        </div>
                      ) : (
                        <span className="text-xs">Never</span>
                      )}
                    </TableCell>
                    <TableCell data-label="Actions" className="text-right">
                      <Button variant="ghost" size="icon" title="View Customer Profile" aria-label={`View ${member.name || member.email}`} asChild>
                        <Link href={`/customers/${member.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {total !== undefined && total > limit && (
          <div className="page-pagination flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} entries
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={offset + limit >= total}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}