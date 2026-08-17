import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Receipt, CheckCircle2, XCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type TaxRate = {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  region: string | null;
  rate: number;
  isInclusive: boolean;
  isActive: boolean;
  createdAt: string;
};

const BLANK: Omit<TaxRate, "id" | "createdAt"> = {
  name: "", countryCode: "", countryName: "", region: "", rate: 20, isInclusive: true, isActive: true,
};

export default function Tax() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [form, setForm] = useState({ ...BLANK });

  const { data: rates = [], isLoading } = useQuery<TaxRate[]>({
    queryKey: ["tax-rates"],
    queryFn: () => fetch(api("admin/tax-rates"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<TaxRate[]>; }),
  });

  const save = useMutation({
    mutationFn: async (values: typeof form & { id?: number }) => {
      const url = values.id ? api(`admin/tax-rates/${values.id}`) : api("admin/tax-rates");
      const res = await fetch(url, {
        method: values.id ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, rate: Number(values.rate) }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editing ? "Tax rate updated" : "Tax rate created" });
      void queryClient.invalidateQueries({ queryKey: ["tax-rates"] });
      setOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/tax-rates/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Tax rate deleted" });
      void queryClient.invalidateQueries({ queryKey: ["tax-rates"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(api(`admin/tax-rates/${id}`), {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["tax-rates"] }),
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...BLANK });
    setOpen(true);
  }

  function openEdit(r: TaxRate) {
    setEditing(r);
    setForm({ name: r.name, countryCode: r.countryCode, countryName: r.countryName, region: r.region ?? "", rate: r.rate, isInclusive: r.isInclusive, isActive: r.isActive });
    setOpen(true);
  }

  function handleSubmit() {
    save.mutate(editing ? { ...form, id: editing.id } : form);
  }

  const activeCount = rates.filter(r => r.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tax Rates</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage VAT and sales tax by country</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Tax Rate
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Rules</p>
          <p className="text-3xl font-bold">{rates.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Countries Covered</p>
          <p className="text-3xl font-bold">{new Set(rates.map(r => r.countryCode)).size}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : rates.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No tax rates configured</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add First Rate</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rate</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{r.countryName}</span>
                        <span className="text-muted-foreground text-xs">({r.countryCode})</span>
                      </div>
                      {r.region && <p className="text-xs text-muted-foreground mt-0.5">{r.region}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium">{r.rate}%</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={r.isInclusive ? "text-blue-600 border-blue-200 bg-blue-50" : "text-orange-600 border-orange-200 bg-orange-50"}>
                        {r.isInclusive ? "Inclusive" : "Exclusive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive.mutate({ id: r.id, isActive: !r.isActive })}
                        className="flex items-center gap-1.5"
                      >
                        {r.isActive
                          ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-green-600 text-xs font-medium">Active</span></>
                          : <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground text-xs">Inactive</span></>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(r)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(r.id)}>
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
            <DialogTitle>{editing ? "Edit Tax Rate" : "Add Tax Rate"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="e.g. UK VAT" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Country Code</label>
                <Input placeholder="GB" value={form.countryCode} onChange={e => setForm(f => ({ ...f, countryCode: e.target.value.toUpperCase() }))} maxLength={2} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Rate (%)</label>
                <Input type="number" min={0} max={100} step={0.1} value={form.rate} onChange={e => setForm(f => ({ ...f, rate: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Country Name</label>
              <Input placeholder="United Kingdom" value={form.countryName} onChange={e => setForm(f => ({ ...f, countryName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Region (optional)</label>
              <Input placeholder="e.g. England" value={form.region ?? ""} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <input type="checkbox" checked={form.isInclusive} onChange={e => setForm(f => ({ ...f, isInclusive: e.target.checked }))} className="rounded" />
                Tax inclusive in price
              </label>
              <label className="text-sm font-medium flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                Active
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={save.isPending || !form.name || !form.countryCode}>
              {save.isPending ? "Saving…" : editing ? "Save Changes" : "Add Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
