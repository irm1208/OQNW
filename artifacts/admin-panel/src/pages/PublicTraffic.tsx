import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Ban, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TrafficEvent = {
  id: number;
  ip: string;
  resourceKind: string;
  path: string;
  userAgent: string | null;
  requestCount: number;
  uniquePathCount: number;
  action: string;
  reason: string;
  createdAt: string;
};

async function fetchTrafficEvents(): Promise<TrafficEvent[]> {
  const response = await fetch("/api/admin/public-traffic/events?limit=100", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch traffic events");
  return response.json();
}

async function blockIp(ip: string): Promise<void> {
  const response = await fetch("/api/admin/blocked-ips", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip, reason: "Repeated public catalogue scraping" }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok && response.status !== 409) {
    throw new Error((data as { error?: string }).error ?? "Failed to block IP");
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PublicTraffic() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-traffic-events"],
    queryFn: fetchTrafficEvents,
    refetchInterval: 30_000,
  });
  const blockMutation = useMutation({
    mutationFn: blockIp,
    onSuccess: (_data, ip) => {
      toast.success(`${ip} is now blocked`);
      queryClient.invalidateQueries({ queryKey: ["blocked-ips"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="admin-page space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Public Traffic Protection
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Recent catalogue, blog, review, sitemap, and image requests that crossed a protection limit.
          Search crawlers and ordinary browsing are allowed through.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-sm text-red-600 py-8">
          <AlertTriangle className="w-4 h-4" /> Traffic events are temporarily unavailable.
        </div>
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2 border rounded-lg">
          <ShieldCheck className="w-8 h-8 opacity-30" />
          <p className="text-sm">No scraping events recorded</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">When</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP address</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Resource</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Activity</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((event) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" data-label="When">
                      {formatDate(event.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium" data-label="IP address">{event.ip}</td>
                    <td className="px-4 py-3" data-label="Resource">
                      <Badge variant="secondary">{event.resourceKind}</Badge>
                      <p className="text-xs text-muted-foreground max-w-[260px] truncate mt-1" title={event.path}>
                        {event.path}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" data-label="Activity">
                      {event.requestCount} requests · {event.uniquePathCount} paths
                    </td>
                    <td className="px-4 py-3" data-label="Action">
                      <Badge variant={event.action === "temporary_block" ? "destructive" : "outline"}>
                        {event.action === "temporary_block" ? "Temporary block" : "Throttled"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{event.reason.replaceAll("_", " ")}</p>
                    </td>
                    <td className="px-4 py-3 text-right" data-label="Actions">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={blockMutation.isPending}
                        onClick={() => blockMutation.mutate(event.ip)}
                      >
                        <Ban className="w-3.5 h-3.5 mr-1" /> Block IP
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}