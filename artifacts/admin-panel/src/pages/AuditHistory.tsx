import { useMemo, useState } from "react";
import { useListAdminAuditHistory } from "@workspace/api-client-react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Loader2, Search, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 50;

function eventLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function targetContext(metadata: Record<string, unknown> | null | undefined) {
  if (!metadata) return null;
  const targetEmail = metadata.targetEmail ?? metadata.targetCustomerEmail;
  const targetId = metadata.targetAdminUserId ?? metadata.targetCustomerId;
  if (typeof targetEmail === "string") return `Target: ${targetEmail}`;
  if (typeof targetId === "number") return `Target ID: ${targetId}`;
  return null;
}

export default function AuditHistory() {
  const [eventType, setEventType] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const params = useMemo(() => ({
    limit: PAGE_SIZE,
    offset,
    ...(eventType !== "all" ? { eventType } : {}),
    ...(outcome !== "all" ? { success: outcome === "true" } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  }), [eventType, offset, outcome, search]);
  const query = useListAdminAuditHistory(params);
  const data = query.data;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const resetAnd = (action: () => void) => {
    action();
    setOffset(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <ClipboardList className="h-6 w-6 text-primary" />
          Audit History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Immutable owner-only record of administrator authentication and account-management activity.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => resetAnd(() => setSearch(event.target.value))} className="pl-9" placeholder="Search event, email, or IP address" aria-label="Search audit history" />
          </div>
          <Select value={eventType} onValueChange={(value) => resetAnd(() => setEventType(value))}>
            <SelectTrigger className="w-full lg:w-60"><SelectValue placeholder="All event types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {(data?.eventTypes ?? []).map((type) => <SelectItem key={type} value={type}>{eventLabel(type)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={outcome} onValueChange={(value) => resetAnd(() => setOutcome(value))}>
            <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="All outcomes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All outcomes</SelectItem>
              <SelectItem value="true">Successful</SelectItem>
              <SelectItem value="false">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {query.isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : query.isError ? (
          <div className="flex items-center gap-2 p-8 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {(query.error as Error).message || "Audit history is unavailable."}
          </div>
        ) : !data?.events.length ? (
          <div className="p-12 text-center text-muted-foreground">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>No audit events match these filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">When</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Event</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Outcome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Administrator</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP address</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Browser</th>
              </tr></thead>
              <tbody>{data.events.map((event) => (
                <tr key={event.id} className="border-b align-top last:border-0 hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(event.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">
                    <div>{eventLabel(event.eventType)}</div>
                    {targetContext(event.metadata) && <div className="mt-0.5 text-xs font-normal text-muted-foreground">{targetContext(event.metadata)}</div>}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className={event.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>
                    {event.success ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}{event.success ? "Success" : "Failed"}
                  </Badge></td>
                  <td className="px-4 py-3">{event.email ?? "Shared owner access"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.ip ?? "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-muted-foreground" title={event.userAgent ?? undefined}>{event.userAgent ?? "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">{data ? `${data.total.toLocaleString()} event${data.total === 1 ? "" : "s"} · Page ${page} of ${totalPages}` : "Loading events…"}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={offset === 0 || query.isFetching} onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}><ChevronLeft /> Previous</Button>
            <Button variant="outline" size="sm" disabled={!data || offset + PAGE_SIZE >= data.total || query.isFetching} onClick={() => setOffset((value) => value + PAGE_SIZE)}>Next <ChevronRight /></Button>
          </div>
        </div>
      </section>
    </div>
  );
}