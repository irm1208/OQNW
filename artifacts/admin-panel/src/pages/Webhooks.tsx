import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Zap, CheckCircle2, XCircle, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type Webhook = {
  id: number;
  url: string;
  events: string[];
  description: string | null;
  isActive: boolean;
  createdAt: string;
  secret?: string;
};

type Delivery = {
  id: number;
  eventType: string;
  status: string;
  responseCode: number | null;
  responseBody: string | null;
  attemptedAt: string;
};

const ALL_EVENTS = [
  { value: "order.created", label: "Order Created" },
  { value: "order.updated", label: "Order Updated" },
  { value: "order.cancelled", label: "Order Cancelled" },
  { value: "order.refunded", label: "Order Refunded" },
];

const BLANK = { url: "", description: "", events: [] as string[] };

export default function Webhooks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Webhook | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: () => fetch(api("admin/webhooks"), { credentials: "include" }).then(r => r.json() as Promise<Webhook[]>),
  });

  const { data: deliveriesMap = {} } = useQuery<Record<number, Delivery[]>>({
    queryKey: ["webhook-deliveries", [...expanded].join(",")],
    queryFn: async () => {
      const map: Record<number, Delivery[]> = {};
      await Promise.all([...expanded].map(async id => {
        const r = await fetch(api(`admin/webhooks/${id}/deliveries`), { credentials: "include" });
        if (r.ok) map[id] = await r.json() as Delivery[];
      }));
      return map;
    },
    enabled: expanded.size > 0,
  });

  const save = useMutation({
    mutationFn: async (v: typeof form & { id?: number }) => {
      const url = v.id ? api(`admin/webhooks/${v.id}`) : api("admin/webhooks");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: v.url, description: v.description || null, events: v.events }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<Webhook>;
    },
    onSuccess: (data) => {
      if (data.secret) setNewSecret(data.secret);
      toast({ title: editing ? "Webhook updated" : "Webhook created" });
      void queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      if (!data.secret) setOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/webhooks/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Webhook deleted" });
      void queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(api(`admin/webhooks/${id}`), {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["webhooks"] }),
  });

  function openCreate() { setEditing(null); setNewSecret(null); setForm({ ...BLANK }); setOpen(true); }
  function openEdit(w: Webhook) { setEditing(w); setNewSecret(null); setForm({ url: w.url, description: w.description ?? "", events: [...w.events] }); setOpen(true); }

  function toggleEvent(event: string) {
    setForm(f => ({
      ...f,
      events: f.events.includes(event) ? f.events.filter(e => e !== event) : [...f.events, event],
    }));
  }

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Webhooks</h2>
          <p className="text-sm text-muted-foreground mt-1">Send real-time events to external systems</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Webhook</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Endpoints</p>
          <p className="text-3xl font-bold">{webhooks.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{webhooks.filter(w => w.isActive).length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Event Types Supported</p>
          <p className="text-3xl font-bold">{ALL_EVENTS.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground rounded-xl border bg-card">Loading…</div>
      ) : webhooks.length === 0 ? (
        <div className="p-12 text-center rounded-xl border bg-card">
          <Zap className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">No webhooks configured</p>
          <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add First Webhook</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map(w => {
            const isExpanded = expanded.has(w.id);
            const deliveries = deliveriesMap[w.id] ?? [];
            return (
              <div key={w.id} className="rounded-xl border bg-card">
                <div className="flex items-center gap-3 px-5 py-4">
                  <button onClick={() => toggleExpand(w.id)} className="text-muted-foreground">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate font-medium">{w.url}</p>
                    {w.description && <p className="text-xs text-muted-foreground">{w.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {w.events.map(e => <Badge key={e} variant="outline" className="text-xs px-1.5 py-0">{e}</Badge>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleActive.mutate({ id: w.id, isActive: !w.isActive })}>
                      {w.isActive
                        ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                        : <XCircle className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(w)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(w.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t px-5 py-4">
                    <p className="text-sm font-medium mb-3">Recent Deliveries</p>
                    {deliveries.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No deliveries yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {deliveries.slice(0, 10).map(d => (
                          <div key={d.id} className="flex items-center gap-3 text-xs">
                            <Badge variant="outline" className={d.status === "success" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}>
                              {d.status}
                            </Badge>
                            <span className="font-mono">{d.eventType}</span>
                            {d.responseCode && <span className="text-muted-foreground">HTTP {d.responseCode}</span>}
                            <span className="text-muted-foreground ml-auto">{new Date(d.attemptedAt).toLocaleString("en-GB")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open && !newSecret} onOpenChange={v => { if (!v) { setOpen(false); setNewSecret(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Endpoint URL</label>
              <Input placeholder="https://your-app.com/webhook" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input placeholder="e.g. Zapier order handler" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Events to send</label>
              {ALL_EVENTS.map(ev => (
                <label key={ev.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.events.includes(ev.value)} onChange={() => toggleEvent(ev.value)} className="rounded" />
                  {ev.label} <span className="text-xs text-muted-foreground font-mono">({ev.value})</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate(editing ? { ...form, id: editing.id } : form)} disabled={save.isPending || !form.url || form.events.length === 0}>
              {save.isPending ? "Saving…" : editing ? "Save Changes" : "Create Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!newSecret} onOpenChange={v => { if (!v) { setNewSecret(null); setOpen(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Webhook Created — Save Your Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">This signing secret will only be shown once. Store it securely — use it to verify incoming webhook payloads using <code className="text-xs bg-muted px-1 py-0.5 rounded">X-OmniQure-Signature</code>.</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-xs break-all font-mono">{newSecret}</code>
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => { void navigator.clipboard.writeText(newSecret ?? ""); toast({ title: "Copied" }); }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setNewSecret(null); setOpen(false); }}>I've saved it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
