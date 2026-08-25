import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Send, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type Subscriber = {
  id: number;
  email: string;
  firstName: string | null;
  isActive: boolean;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
};

type SubscribersResponse = {
  total: number;
  active: number;
  subscribers: Subscriber[];
};

export default function Newsletter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");

  const { data, isLoading } = useQuery<SubscribersResponse>({
    queryKey: ["newsletter-subscribers"],
    queryFn: () => fetch(api("admin/newsletter/subscribers"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<SubscribersResponse>; }),
  });

  const broadcast = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/newsletter/broadcast"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, htmlBody }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ sent: number; failed?: number; total?: number; message?: string }>;
    },
    onSuccess: (r) => {
      toast({ title: `Broadcast sent to ${r.sent} subscriber${r.sent === 1 ? "" : "s"}`, description: r.failed ? `${r.failed} failed` : undefined });
      setBroadcastOpen(false);
      setSubject("");
      setHtmlBody("");
    },
    onError: () => toast({ title: "Broadcast failed", variant: "destructive" }),
  });

  const reorderReminders = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/newsletter/reorder-reminders"), { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ sent: number; skipped?: number; message?: string }>;
    },
    onSuccess: (r) => toast({ title: `Reorder reminders: ${r.sent} sent`, description: r.message ?? (r.skipped ? `${r.skipped} skipped` : undefined) }),
    onError: () => toast({ title: "Failed to send reminders", variant: "destructive" }),
  });

  const subscribers = data?.subscribers ?? [];

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Newsletter</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage subscribers and send campaigns</p>
        </div>
        <div className="page-actions flex items-center gap-2">
          <Button variant="outline" onClick={() => reorderReminders.mutate()} disabled={reorderReminders.isPending}>
            <RefreshCw className="w-4 h-4 mr-2" /> {reorderReminders.isPending ? "Sending…" : "Reorder Reminders"}
          </Button>
          <Button onClick={() => setBroadcastOpen(true)}>
            <Send className="w-4 h-4 mr-2" /> New Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Subscribers</p>
          <p className="text-3xl font-bold">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{data?.active ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Unsubscribed</p>
          <p className="text-3xl font-bold text-muted-foreground">{(data?.total ?? 0) - (data?.active ?? 0)}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3">{s.firstName ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.source ?? "—"}</td>
                    <td className="px-4 py-3">
                      {s.isActive
                        ? <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4" /> Active</span>
                        : <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><XCircle className="w-4 h-4" /> Unsubscribed</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Broadcast</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="e.g. New peptides now in stock" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HTML Body</label>
              <textarea
                className="w-full min-h-[180px] rounded-md border bg-background px-3 py-2 text-sm font-mono"
                placeholder="<p>Hello {{firstName}},</p>"
                value={htmlBody}
                onChange={e => setHtmlBody(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Sent to all active subscribers. An unsubscribe link is appended automatically.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBroadcastOpen(false)}>Cancel</Button>
            <Button onClick={() => broadcast.mutate()} disabled={broadcast.isPending || !subject.trim() || !htmlBody.trim()}>
              {broadcast.isPending ? "Sending…" : `Send to ${data?.active ?? 0}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
