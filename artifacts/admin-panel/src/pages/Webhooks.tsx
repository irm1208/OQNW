import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Webhook as WebhookIcon, CheckCircle2, XCircle, Copy, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

const ALLOWED_EVENTS = ["order.created", "order.updated", "order.cancelled", "order.refunded"];

type Webhook = {
  id: number;
  url: string;
  events: string[];
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

type Delivery = {
  id: number;
  eventType: string;
  status: string;
  responseCode: number | null;
  responseBody: string | null;
  attemptedAt: string;
};

const BLANK = { url: "", events: [] as string[], description: "" };

export default function Webhooks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Webhook | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [deliveriesFor, setDeliveriesFor] = useState<Webhook | null>(null);

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: () => fetch(api("admin/webhooks"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<Webhook[]>; }),
  });

  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery<Delivery[]>({
    queryKey: ["webhook-deliveries", deliveriesFor?.id],
    queryFn: () => fetch(api(`admin/webhooks/${deliveriesFor!.id}/deliveries`), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<Delivery[]>; }),
    enabled: deliveriesFor !== null,
  });

  const save = useMutation({
    mutationFn: async (values: typeof form & { id?: number }) => {
      const url = values.id ? api(`admin/webhooks/${values.id}`) : api("admin/webhooks");
      const res = await fetch(url, {
        method: values.id ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: values.url, events: values.events, description: values.description }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<Webhook & { secret?: string }>;
    },
    onSuccess: (data) => {
      toast({ title: editing ? "Webhook updated" : "Webhook created" });
      void queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setOpen(false);
      if (!editing && data.secret) setNewSecret(data.secret);
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
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...BLANK });
    setOpen(true);
  }

  function openEdit(w: Webhook) {
    setEditing(w);
    setForm({ url: w.url, events: w.events, description: w.description ?? "" });
    setOpen(true);
  }

  function toggleEvent(ev: string) {
    setForm(f => ({ ...f, events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev] }));
  }

  function handleSubmit() {
    save.mutate(editing ? { ...form, id: editing.id } : form);
  }

  const activeCount = webhooks.filter(w => w.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Webhooks</h2>
          <p className="text-sm text-muted-foreground mt-1">Notify external systems when store events occur</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Webhook
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Endpoints</p>
          <p className="text-3xl font-bold">{webhooks.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Event Types</p>
          <p className="text-3xl font-bold">{ALLOWED_EVENTS.length}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : webhooks.length === 0 ? (
          <div className="p-12 text-center">
            <WebhookIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No webhooks configured</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add First Webhook</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Endpoint URL</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Events</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map(w => (
                  <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3" data-label="Endpoint URL">
                      <p className="font-mono text-xs break-all max-w-xs">{w.url}</p>
                      {w.description && <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>}
                    </td>
                    <td className="px-4 py-3" data-label="Events">
                      <div className="flex flex-wrap gap-1">
                        {w.events.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                      </div>
                    </td>
                    <td className="px-4 py-3" data-label="Status">
                      <button onClick={() => toggleActive.mutate({ id: w.id, isActive: !w.isActive })} className="flex items-center gap-1.5">
                        {w.isActive
                          ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-green-600 text-xs font-medium">Active</span></>
                          : <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground text-xs">Inactive</span></>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right" data-label="Actions">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" title="Delivery log" onClick={() => setDeliveriesFor(w)}>
                          <Activity className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(w)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(w.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Endpoint URL</label>
              <Input placeholder="https://example.com/hooks/omniqure" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Events</label>
              <div className="grid grid-cols-1 gap-1.5">
                {ALLOWED_EVENTS.map(ev => (
                  <label key={ev} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.events.includes(ev)} onChange={() => toggleEvent(ev)} className="rounded" />
                    <span className="font-mono text-xs">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input placeholder="e.g. Zapier order sync" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={save.isPending || !form.url || form.events.length === 0}>
              {save.isPending ? "Saving…" : editing ? "Save Changes" : "Add Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newSecret !== null} onOpenChange={(o) => { if (!o) setNewSecret(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signing Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">Save this secret now — it won't be shown again. Use it to verify webhook signatures.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted rounded-md px-3 py-2 text-xs break-all">{newSecret}</code>
              <Button size="icon" variant="outline" className="h-9 w-9 shrink-0" onClick={() => { if (newSecret) { void navigator.clipboard.writeText(newSecret); toast({ title: "Copied to clipboard" }); } }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setNewSecret(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deliveriesFor !== null} onOpenChange={(o) => { if (!o) setDeliveriesFor(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delivery Log</DialogTitle>
          </DialogHeader>
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {deliveriesLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading…</div>
            ) : deliveries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No deliveries yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Event</th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">Code</th>
                    <th className="text-left px-2 py-2 font-medium text-muted-foreground">When</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(d => (
                    <tr key={d.id} className="border-b last:border-0">
                      <td className="px-2 py-2 font-mono text-xs" data-label="Event">{d.eventType}</td>
                      <td className="px-2 py-2" data-label="Status">
                        <Badge variant="outline" className={d.status === "success" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-2 py-2 font-mono text-xs" data-label="Code">{d.responseCode ?? "—"}</td>
                      <td className="px-2 py-2 text-xs text-muted-foreground" data-label="When">{new Date(d.attemptedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliveriesFor(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
