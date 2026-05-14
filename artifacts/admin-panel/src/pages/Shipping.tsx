import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Truck, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

type ShippingZone = {
  id: number;
  name: string;
  description: string | null;
  countryCodes: string[];
  isActive: boolean;
  createdAt: string;
};

type ShippingRate = {
  id: number;
  zoneId: number;
  name: string;
  carrier: string;
  priceGbp: number;
  freeAboveGbp: number | null;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isActive: boolean;
  createdAt: string;
};

const BLANK_ZONE = { name: "", description: "", countryCodes: "" };
const BLANK_RATE = { zoneId: 0, name: "", carrier: "Royal Mail", priceGbp: "4.99", freeAboveGbp: "", estimatedDaysMin: "2", estimatedDaysMax: "5" };

export default function Shipping() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set());

  const [zoneOpen, setZoneOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ ...BLANK_ZONE });

  const [rateOpen, setRateOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [rateForm, setRateForm] = useState({ ...BLANK_RATE });

  const { data: zones = [], isLoading: zonesLoading } = useQuery<ShippingZone[]>({
    queryKey: ["shipping-zones"],
    queryFn: () => fetch(api("admin/shipping/zones"), { credentials: "include" }).then(r => r.json() as Promise<ShippingZone[]>),
  });

  const { data: rates = [] } = useQuery<ShippingRate[]>({
    queryKey: ["shipping-rates"],
    queryFn: () => fetch(api("admin/shipping/rates"), { credentials: "include" }).then(r => r.json() as Promise<ShippingRate[]>),
  });

  const saveZone = useMutation({
    mutationFn: async (v: typeof zoneForm & { id?: number }) => {
      const countryCodes = v.countryCodes.split(",").map(c => c.trim().toUpperCase()).filter(Boolean);
      const url = v.id ? api(`admin/shipping/zones/${v.id}`) : api("admin/shipping/zones");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v.name, description: v.description || null, countryCodes }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editingZone ? "Zone updated" : "Zone created" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] });
      setZoneOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const deleteZone = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/shipping/zones/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Zone deleted" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const saveRate = useMutation({
    mutationFn: async (v: typeof rateForm & { id?: number }) => {
      const url = v.id ? api(`admin/shipping/rates/${v.id}`) : api("admin/shipping/rates");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: Number(v.zoneId),
          name: v.name,
          carrier: v.carrier,
          priceGbp: parseFloat(v.priceGbp) || 0,
          freeAboveGbp: v.freeAboveGbp ? parseFloat(v.freeAboveGbp) : null,
          estimatedDaysMin: parseInt(v.estimatedDaysMin) || 2,
          estimatedDaysMax: parseInt(v.estimatedDaysMax) || 5,
        }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editingRate ? "Rate updated" : "Rate created" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      setRateOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const deleteRate = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/shipping/rates/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Rate deleted" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  function toggleZone(id: number) {
    setExpandedZones(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function openCreateZone() {
    setEditingZone(null);
    setZoneForm({ ...BLANK_ZONE });
    setZoneOpen(true);
  }

  function openEditZone(z: ShippingZone) {
    setEditingZone(z);
    setZoneForm({ name: z.name, description: z.description ?? "", countryCodes: z.countryCodes.join(", ") });
    setZoneOpen(true);
  }

  function openCreateRate(zoneId?: number) {
    setEditingRate(null);
    setRateForm({ ...BLANK_RATE, zoneId: zoneId ?? (zones[0]?.id ?? 0) });
    setRateOpen(true);
  }

  function openEditRate(r: ShippingRate) {
    setEditingRate(r);
    setRateForm({
      zoneId: r.zoneId, name: r.name, carrier: r.carrier,
      priceGbp: String(r.priceGbp), freeAboveGbp: r.freeAboveGbp != null ? String(r.freeAboveGbp) : "",
      estimatedDaysMin: String(r.estimatedDaysMin), estimatedDaysMax: String(r.estimatedDaysMax),
    });
    setRateOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shipping</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage zones and delivery rates by region</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openCreateRate()}><Plus className="w-4 h-4 mr-2" /> Add Rate</Button>
          <Button onClick={openCreateZone}><Plus className="w-4 h-4 mr-2" /> Add Zone</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Zones</p>
          <p className="text-3xl font-bold">{zones.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Shipping Methods</p>
          <p className="text-3xl font-bold">{rates.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Countries Covered</p>
          <p className="text-3xl font-bold">{new Set(zones.flatMap(z => z.countryCodes)).size}</p>
        </div>
      </div>

      {zonesLoading ? (
        <div className="p-12 text-center text-muted-foreground rounded-xl border bg-card">Loading…</div>
      ) : zones.length === 0 ? (
        <div className="p-12 text-center rounded-xl border bg-card">
          <Truck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">No shipping zones configured</p>
          <Button className="mt-4" onClick={openCreateZone}><Plus className="w-4 h-4 mr-2" /> Create First Zone</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map(zone => {
            const zoneRates = rates.filter(r => r.zoneId === zone.id);
            const expanded = expandedZones.has(zone.id);
            return (
              <div key={zone.id} className="rounded-xl border bg-card">
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleZone(zone.id)}
                >
                  {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{zone.name}</p>
                    {zone.description && <p className="text-xs text-muted-foreground">{zone.description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {zone.countryCodes.slice(0, 6).map(cc => (
                      <Badge key={cc} variant="outline" className="text-xs px-1.5 py-0">{cc}</Badge>
                    ))}
                    {zone.countryCodes.length > 6 && <Badge variant="outline" className="text-xs px-1.5 py-0">+{zone.countryCodes.length - 6}</Badge>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => openCreateRate(zone.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Rate
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditZone(zone)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteZone.mutate(zone.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t">
                    {zoneRates.length === 0 ? (
                      <p className="text-sm text-muted-foreground px-5 py-4">No rates for this zone. <button className="underline text-primary" onClick={() => openCreateRate(zone.id)}>Add one</button></p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/20">
                            <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Method</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Carrier</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Price</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Free Above</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Lead Time</th>
                            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {zoneRates.map(r => (
                            <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                              <td className="px-5 py-3 font-medium">{r.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.carrier}</td>
                              <td className="px-4 py-3 font-mono">£{r.priceGbp.toFixed(2)}</td>
                              <td className="px-4 py-3">{r.freeAboveGbp != null ? `£${r.freeAboveGbp.toFixed(2)}+` : <span className="text-muted-foreground">—</span>}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.estimatedDaysMin}–{r.estimatedDaysMax} days</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditRate(r)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteRate.mutate(r.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={zoneOpen} onOpenChange={setZoneOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingZone ? "Edit Zone" : "Create Shipping Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Zone Name</label>
              <Input placeholder="e.g. United Kingdom" value={zoneForm.name} onChange={e => setZoneForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input placeholder="Brief description" value={zoneForm.description} onChange={e => setZoneForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Country Codes</label>
              <Textarea
                placeholder="GB, IE, US (comma-separated ISO codes)"
                value={zoneForm.countryCodes}
                onChange={e => setZoneForm(f => ({ ...f, countryCodes: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Use ISO 3166-1 alpha-2 codes, e.g. GB, US, DE, FR</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZoneOpen(false)}>Cancel</Button>
            <Button onClick={() => saveZone.mutate(editingZone ? { ...zoneForm, id: editingZone.id } : zoneForm)} disabled={saveZone.isPending || !zoneForm.name}>
              {saveZone.isPending ? "Saving…" : editingZone ? "Save Changes" : "Create Zone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRate ? "Edit Shipping Rate" : "Add Shipping Rate"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Zone</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={rateForm.zoneId}
                onChange={e => setRateForm(f => ({ ...f, zoneId: parseInt(e.target.value) }))}
              >
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Method Name</label>
                <Input placeholder="Standard Delivery" value={rateForm.name} onChange={e => setRateForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Carrier</label>
                <Input placeholder="Royal Mail" value={rateForm.carrier} onChange={e => setRateForm(f => ({ ...f, carrier: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Price (£)</label>
                <Input type="number" min={0} step={0.01} value={rateForm.priceGbp} onChange={e => setRateForm(f => ({ ...f, priceGbp: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Free Above (£)</label>
                <Input type="number" min={0} step={0.01} placeholder="e.g. 50 or leave blank" value={rateForm.freeAboveGbp} onChange={e => setRateForm(f => ({ ...f, freeAboveGbp: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Min Days</label>
                <Input type="number" min={1} value={rateForm.estimatedDaysMin} onChange={e => setRateForm(f => ({ ...f, estimatedDaysMin: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Days</label>
                <Input type="number" min={1} value={rateForm.estimatedDaysMax} onChange={e => setRateForm(f => ({ ...f, estimatedDaysMax: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRateOpen(false)}>Cancel</Button>
            <Button onClick={() => saveRate.mutate(editingRate ? { ...rateForm, id: editingRate.id } : rateForm)} disabled={saveRate.isPending || !rateForm.name}>
              {saveRate.isPending ? "Saving…" : editingRate ? "Save Changes" : "Add Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
