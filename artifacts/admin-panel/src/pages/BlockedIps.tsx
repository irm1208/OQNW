import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldBan, Trash2, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";


interface BlockedIp {
  id: number;
  ip: string;
  reason: string | null;
  blockedAt: string;
}

async function fetchBlockedIps(): Promise<BlockedIp[]> {
  const res = await fetch(`/api/admin/blocked-ips`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function blockIp(body: { ip: string; reason: string }): Promise<BlockedIp> {
  const res = await fetch(`/api/admin/blocked-ips`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to block IP");
  return data;
}

async function unblockIp(ip: string): Promise<void> {
  const res = await fetch(`/api/admin/blocked-ips/${encodeURIComponent(ip)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Failed to unblock");
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BlockedIps() {
  const qc = useQueryClient();
  const [ip, setIp] = useState("");
  const [reason, setReason] = useState("");

  const { data, isLoading } = useQuery<BlockedIp[]>({
    queryKey: ["blocked-ips"],
    queryFn: fetchBlockedIps,
  });

  const addMutation = useMutation({
    mutationFn: blockIp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocked-ips"] });
      setIp("");
      setReason("");
      toast.success("IP blocked");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeMutation = useMutation({
    mutationFn: unblockIp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocked-ips"] });
      toast.success("IP unblocked");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ip.trim();
    if (!trimmed) return;
    addMutation.mutate({ ip: trimmed, reason: reason.trim() });
  };

  return (
    <div className="admin-page space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldBan className="w-6 h-6 text-red-500" />
          Blocked IPs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          IPs on this list are permanently refused access to the admin login.
        </p>
      </div>

      <form onSubmit={handleAdd} className="page-filters flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="IP address (e.g. 203.0.113.42)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!ip.trim() || addMutation.isPending}>
          {addMutation.isPending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><Plus className="w-4 h-4 mr-1" />Block</>}
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <AlertTriangle className="w-8 h-8 opacity-30" />
          <p className="text-sm">No IPs blocked yet</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP Address</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reason</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Blocked</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-red-600" data-label="IP Address">{row.ip}</td>
                  <td className="px-4 py-3 text-muted-foreground" data-label="Reason">
                    {row.reason
                      ? <Badge variant="secondary" className="font-normal">{row.reason}</Badge>
                      : <span className="text-xs text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs" data-label="Blocked">{formatDate(row.blockedAt)}</td>
                  <td className="px-4 py-3 text-right" data-label="Actions">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-red-600"
                      disabled={removeMutation.isPending}
                      onClick={() => removeMutation.mutate(row.ip)}
                    >
                      <Trash2 className="w-4 h-4" />
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
