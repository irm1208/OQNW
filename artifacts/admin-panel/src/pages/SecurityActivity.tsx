import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, KeyRound, Loader2, Search, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SecurityEvent = {
  id: number;
  eventType: string;
  email: string | null;
  ip: string | null;
  userAgent: string | null;
  requestId: string | null;
  success: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

type SecurityEventsResponse = {
  total: number;
  eventTypes: string[];
  events: SecurityEvent[];
};

async function fetchSecurityEvents(eventType: string, status: string, search: string): Promise<SecurityEventsResponse> {
  const params = new URLSearchParams({ limit: "250" });
  if (eventType !== "all") params.set("eventType", eventType);
  if (status !== "all") params.set("success", status);
  if (search.trim()) params.set("search", search.trim());
  const response = await fetch(`/api/admin/security/events?${params}`, { credentials: "include" });
  if (!response.ok) throw new Error(response.status === 403 ? "Owner access is required" : "Security activity is unavailable");
  return response.json();
}

function eventLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SecurityActivity() {
  const [eventType, setEventType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["admin-security-events", eventType, status, search],
    queryFn: () => fetchSecurityEvents(eventType, status, search),
    refetchInterval: 30_000,
  });

  const summary = useMemo(() => {
    const events = query.data?.events ?? [];
    return {
      failures: events.filter((event) => !event.success).length,
      successful: events.filter((event) => event.success).length,
      mfa: events.filter((event) => event.eventType.includes("mfa")).length,
    };
  }, [query.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Security Activity
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Owner-only record of administrator sign-ins, lockouts, MFA activity, and session changes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Successful events shown</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{summary.successful}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Failed events shown</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{summary.failures}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">MFA events shown</p>
          <p className="text-3xl font-bold text-primary mt-1">{summary.mfa}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search email, IP, or event…" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full lg:w-56"><SelectValue placeholder="All event types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {(query.data?.eventTypes ?? []).map((type) => <SelectItem key={type} value={type}>{eventLabel(type)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="All outcomes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All outcomes</SelectItem>
              <SelectItem value="true">Successful</SelectItem>
              <SelectItem value="false">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {query.isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : query.isError ? (
          <div className="flex items-center gap-2 p-8 text-sm text-red-600">
            <AlertTriangle className="w-4 h-4" />
            {(query.error as Error).message}
          </div>
        ) : !query.data?.events.length ? (
          <div className="p-12 text-center text-muted-foreground">
            <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No matching security events.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">When</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Outcome</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Administrator</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP address</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Browser</th>
                </tr>
              </thead>
              <tbody>
                {query.data.events.map((event) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground" data-label="When">{formatDate(event.createdAt)}</td>
                    <td className="px-4 py-3 font-medium" data-label="Event">{eventLabel(event.eventType)}</td>
                    <td className="px-4 py-3" data-label="Outcome">
                      <Badge variant="outline" className={event.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>
                        {event.success ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {event.success ? "Success" : "Failed"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3" data-label="Administrator">{event.email ?? "Shared owner access"}</td>
                    <td className="px-4 py-3 font-mono text-xs" data-label="IP address">{event.ip ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate" title={event.userAgent ?? undefined} data-label="Browser">
                      {event.userAgent ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}