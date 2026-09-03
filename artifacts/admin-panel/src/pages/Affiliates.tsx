import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, Search, Network, CheckCircle2, XCircle, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// Types
type Settings = {
  attributionWindowDays: number;
  reviewHoldDays: number;
  customerDiscountPercent: number;
  freeRewardThresholdGbp: number;
  freeRewardValueCapGbp: number;
  maxFreeRewardsPerPeriod: number;
  payoutThresholdGbp: number;
  tierWindowDays: number;
};

type Tier = {
  id: number;
  name: string;
  slug: string;
  minimumSalesGbp: number;
  commissionRatePercent: number;
  rewardCreditGbp: number;
  isActive: boolean;
  sortOrder: number;
};

type Stats = {
  totalPartners: number;
  activePartners: number;
  pendingCommissionsGbp: number;
  approvedCommissionsGbp: number;
  paidCommissionsGbp: number;
  pendingRewards: number;
  availableRewards: number;
  claimedRewards: number;
  fulfilledRewards: number;
};

type OverviewData = {
  settings: Settings;
  tiers: Tier[];
  stats: Stats;
};

type Partner = {
  id: number;
  customerId: number | null;
  name: string;
  email: string;
  trackingCode: string;
  discountCode: string;
  discountPercent: number;
  status: string;
  channelUrl: string | null;
  audienceDescription: string | null;
  promotionPlan: string | null;
  notes: string | null;
  approvedAt: string | null;
  suspendedAt: string | null;
  createdAt: string;
  customer?: { id: number; name: string };
  tierProgress: {
    currentTier: Tier | null;
    nextTier: Tier | null;
    rollingSalesGbp: number;
    salesToNextTierGbp: number;
    progressPercent: number;
  };
};

type Commission = {
  id: number;
  partnerName: string;
  partnerEmail: string;
  orderNumber: string;
  orderStatus: string;
  eligibleSalesGbp: number;
  commissionRatePercent: number;
  amountGbp: number;
  status: string;
  statusReason: string | null;
  dates: { createdAt: string; approvedAt: string | null; heldAt: string | null; voidedAt: string | null; paidAt: string | null; };
};

type Reward = {
  id: number;
  partnerName: string;
  partnerEmail: string;
  qualifyingSalesGbp: number;
  creditValueGbp: number;
  status: string;
  productSlug: string | null;
  claimedProductName: string | null;
  statusReason: string | null;
  dates: { createdAt: string; approvedAt: string | null; claimedAt: string | null; fulfilledAt: string | null; voidedAt: string | null; };
};

const pounds = (v: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(v);

export default function Affiliates() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="admin-page space-y-6">
      <div className="flex items-center gap-3">
        <Network className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Affiliate Operations</h2>
          <p className="text-sm text-muted-foreground">Manage program rules, partners, commissions, and free product rewards.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview & Settings</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="rewards">Free Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="tiers" className="m-0">
          <TiersTab />
        </TabsContent>

        <TabsContent value="partners" className="m-0">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="commissions" className="m-0">
          <CommissionsTab />
        </TabsContent>

        <TabsContent value="rewards" className="m-0">
          <RewardsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --------------------------------------------------------------------------
// OVERVIEW TAB
// --------------------------------------------------------------------------
function OverviewTab() {
  const query = useQuery<OverviewData>({
    queryKey: ["affiliates", "overview"],
    queryFn: () => customFetch("/api/admin/affiliates/overview", { credentials: "include" })
  });
  const client = useQueryClient();

  const [form, setForm] = useState<Partial<Settings>>({});

  useEffect(() => {
    if (query.data?.settings) {
      setForm(query.data.settings);
    }
  }, [query.data?.settings]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Settings>) => customFetch("/api/admin/affiliates/settings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast.success("Affiliate settings saved");
      client.invalidateQueries({ queryKey: ["affiliates", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const handleSave = () => {
    mutation.mutate(form);
  };

  if (query.isLoading) {
    return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>;
  }

  if (query.isError || !query.data) {
    return <div className="text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Failed to load overview</div>;
  }

  const { stats } = query.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold">{stats.activePartners} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalPartners}</span></p>
            <p className="text-xs text-muted-foreground">Active Partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold">{pounds(stats.pendingCommissionsGbp)}</p>
            <p className="text-xs text-muted-foreground">Pending Commissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold text-primary">{pounds(stats.approvedCommissionsGbp)}</p>
            <p className="text-xs text-muted-foreground">Approved (Awaiting Payout)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-2xl font-bold">{stats.pendingRewards}</p>
            <p className="text-xs text-muted-foreground">Pending Free Rewards</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Rules & Settings</CardTitle>
          <CardDescription>Global configuration for attribution, thresholds, and holding periods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Attribution Window (Days)</Label>
                <Input type="number" value={form.attributionWindowDays ?? ""} onChange={e => setForm(f => ({ ...f, attributionWindowDays: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Days a customer is linked to an affiliate after first click/purchase.</p>
              </div>
              <div className="grid gap-2">
                <Label>Review Hold Period (Days)</Label>
                <Input type="number" value={form.reviewHoldDays ?? ""} onChange={e => setForm(f => ({ ...f, reviewHoldDays: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Days before a pending commission/reward can be approved (to handle returns).</p>
              </div>
              <div className="grid gap-2">
                <Label>Default Customer Discount (%)</Label>
                <Input type="number" value={form.customerDiscountPercent ?? ""} onChange={e => setForm(f => ({ ...f, customerDiscountPercent: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Standard discount granted to the buyer when using a partner's code.</p>
              </div>
              <div className="grid gap-2">
                <Label>Tier Window (Days)</Label>
                <Input type="number" value={form.tierWindowDays ?? ""} onChange={e => setForm(f => ({ ...f, tierWindowDays: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Timeframe used to calculate partner sales volume for tier placement.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Payout Threshold (£)</Label>
                <Input type="number" value={form.payoutThresholdGbp ?? ""} onChange={e => setForm(f => ({ ...f, payoutThresholdGbp: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Minimum approved cash balance required before payout.</p>
              </div>
              <div className="grid gap-2">
                <Label>Free Reward Threshold (£)</Label>
                <Input type="number" value={form.freeRewardThresholdGbp ?? ""} onChange={e => setForm(f => ({ ...f, freeRewardThresholdGbp: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Sales volume required to trigger a free peptide reward.</p>
              </div>
              <div className="grid gap-2">
                <Label>Free Reward Value Cap (£)</Label>
                <Input type="number" value={form.freeRewardValueCapGbp ?? ""} onChange={e => setForm(f => ({ ...f, freeRewardValueCapGbp: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Maximum value of the single product they can claim.</p>
              </div>
              <div className="grid gap-2">
                <Label>Max Free Rewards Per Period</Label>
                <Input type="number" value={form.maxFreeRewardsPerPeriod ?? ""} onChange={e => setForm(f => ({ ...f, maxFreeRewardsPerPeriod: Number(e.target.value) }))} />
                <p className="text-[11px] text-muted-foreground">Limit free rewards an affiliate can earn within the tier window.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --------------------------------------------------------------------------
// TIERS TAB
// --------------------------------------------------------------------------
function TiersTab() {
  const query = useQuery<OverviewData>({
    queryKey: ["affiliates", "overview"],
    queryFn: () => customFetch("/api/admin/affiliates/overview", { credentials: "include" })
  });
  const client = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Partial<Tier>>({});

  const mutation = useMutation({
    mutationFn: (data: Partial<Tier>) => {
      if (data.id) {
        return customFetch(`/api/admin/affiliates/tiers/${data.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }
      return customFetch("/api/admin/affiliates/tiers", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast.success("Tier saved successfully");
      setDialogOpen(false);
      client.invalidateQueries({ queryKey: ["affiliates", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const openDialog = (tier?: Tier) => {
    setEditingTier(tier ? { ...tier } : { isActive: true, minimumSalesGbp: 0, commissionRatePercent: 10, rewardCreditGbp: 0, sortOrder: 0 });
    setDialogOpen(true);
  };

  const handleSave = () => {
    mutation.mutate(editingTier);
  };

  if (query.isLoading) {
    return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>;
  }

  const tiers = query.data?.tiers ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Performance Tiers</h3>
          <p className="text-sm text-muted-foreground">Affiliates automatically move between tiers based on sales volume.</p>
        </div>
        <Button onClick={() => openDialog()}>Add Tier</Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Tier Name</TableHead>
              <TableHead>Min. Sales (£)</TableHead>
              <TableHead>Commission (%)</TableHead>
              <TableHead>Reward Credit (£)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No tiers configured.</TableCell></TableRow>
            ) : (
              tiers.map(tier => (
                <TableRow key={tier.id}>
                  <TableCell>{tier.sortOrder}</TableCell>
                  <TableCell className="font-medium">{tier.name}<br/><span className="text-xs text-muted-foreground font-mono">{tier.slug}</span></TableCell>
                  <TableCell>{pounds(tier.minimumSalesGbp)}</TableCell>
                  <TableCell>{tier.commissionRatePercent}%</TableCell>
                  <TableCell>{tier.rewardCreditGbp > 0 ? pounds(tier.rewardCreditGbp) : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={tier.isActive ? "default" : "secondary"}>{tier.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openDialog(tier)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier.id ? "Edit Tier" : "Create Tier"}</DialogTitle>
            <DialogDescription>Define the requirements and rewards for this affiliate tier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tier Name</Label>
                <Input value={editingTier.name ?? ""} onChange={e => setEditingTier(t => ({ ...t, name: e.target.value }))} placeholder="e.g. Gold" />
              </div>
              <div className="grid gap-2">
                <Label>Slug (Internal)</Label>
                <Input value={editingTier.slug ?? ""} onChange={e => setEditingTier(t => ({ ...t, slug: e.target.value }))} placeholder="gold-tier" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Minimum Sales Vol (£)</Label>
                <Input type="number" value={editingTier.minimumSalesGbp ?? ""} onChange={e => setEditingTier(t => ({ ...t, minimumSalesGbp: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <Label>Commission Rate (%)</Label>
                <Input type="number" value={editingTier.commissionRatePercent ?? ""} onChange={e => setEditingTier(t => ({ ...t, commissionRatePercent: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Bonus Reward Credit (£)</Label>
                <Input type="number" value={editingTier.rewardCreditGbp ?? ""} onChange={e => setEditingTier(t => ({ ...t, rewardCreditGbp: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <Label>Sort Order</Label>
                <Input type="number" value={editingTier.sortOrder ?? ""} onChange={e => setEditingTier(t => ({ ...t, sortOrder: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label>Active Status</Label>
              <Switch checked={editingTier.isActive ?? false} onCheckedChange={c => setEditingTier(t => ({ ...t, isActive: c }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --------------------------------------------------------------------------
// PARTNERS TAB
// --------------------------------------------------------------------------
const PARTNER_STATUSES = ["all", "pending", "approved", "rejected", "suspended"];

function PartnersTab() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const client = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner>>({});

  useEffect(() => {
    const timer = setTimeout(() => setTerm(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useQuery<{ partners: Partner[] }>({
    queryKey: ["affiliates", "partners", status, term],
    queryFn: () => customFetch(`/api/admin/affiliates/partners?${new URLSearchParams({ status, ...(term ? { search: term } : {}) })}`, { credentials: "include" })
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Partner>) => {
      if (data.id) {
        return customFetch(`/api/admin/affiliates/partners/${data.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }
      return customFetch("/api/admin/affiliates/partners", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast.success("Partner saved successfully");
      setDialogOpen(false);
      client.invalidateQueries({ queryKey: ["affiliates", "partners"] });
      client.invalidateQueries({ queryKey: ["affiliates", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const openDialog = (partner?: Partner) => {
    setEditingPartner(partner ? { ...partner } : { discountPercent: 10, status: "pending" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    mutation.mutate(editingPartner);
  };

  const partners = query.data?.partners ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
          {PARTNER_STATUSES.map(s => (
            <Button key={s} variant="ghost" size="sm" onClick={() => setStatus(s)} className={status === s ? "bg-muted font-bold" : ""}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search partners..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => openDialog()}>Add Partner</Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Customer Link</TableHead>
              <TableHead>Codes & Discount</TableHead>
              <TableHead>Tier Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>
            ) : partners.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No partners found.</TableCell></TableRow>
            ) : (
              partners.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </TableCell>
                  <TableCell>
                    {p.customer ? (
                      <Link href={`/customers/${p.customer.id}`} className="text-primary hover:underline text-sm font-medium">{p.customer.name}</Link>
                    ) : <span className="text-muted-foreground text-xs">Unlinked</span>}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono">Tracking: {p.trackingCode || "—"}</div>
                    <div className="text-xs font-mono mt-0.5">Discount: {p.discountCode || "—"}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.discountPercent}% OFF</div>
                  </TableCell>
                  <TableCell className="min-w-40">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold">{p.tierProgress.currentTier?.name ?? "Not placed"}</span>
                      <span className="text-muted-foreground">{pounds(p.tierProgress.rollingSalesGbp)}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.tierProgress.progressPercent}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {p.tierProgress.nextTier
                        ? `${pounds(p.tierProgress.salesToNextTierGbp)} to ${p.tierProgress.nextTier.name}`
                        : "Top tier reached"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === "approved" ? "default" : p.status === "pending" ? "outline" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(p.createdAt).toLocaleDateString('en-GB')}</div>
                    {p.approvedAt && <div className="text-xs text-muted-foreground">Approved {new Date(p.approvedAt).toLocaleDateString('en-GB')}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openDialog(p)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner.id ? "Edit Partner" : "Add Partner"}</DialogTitle>
            <DialogDescription>Manage affiliate partner details and status.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={editingPartner.name ?? ""} onChange={e => setEditingPartner(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={editingPartner.email ?? ""} onChange={e => setEditingPartner(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Customer ID (Optional)</Label>
                <Input type="number" value={editingPartner.customerId ?? ""} onChange={e => setEditingPartner(p => ({ ...p, customerId: e.target.value ? Number(e.target.value) : null }))} placeholder="Link to existing customer" />
              </div>
              <div className="grid gap-2">
                <Label>Discount Override (%)</Label>
                <Input type="number" value={editingPartner.discountPercent ?? ""} onChange={e => setEditingPartner(p => ({ ...p, discountPercent: Number(e.target.value) }))} />
              </div>
            </div>
            {editingPartner.id && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={editingPartner.status} onValueChange={v => setEditingPartner(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label>Channel or Website</Label>
              <Input
                value={editingPartner.channelUrl ?? ""}
                onChange={e => setEditingPartner(p => ({ ...p, channelUrl: e.target.value }))}
                placeholder="Website, social profile, newsletter, or community"
              />
            </div>
            <div className="grid gap-2">
              <Label>Audience</Label>
              <Textarea
                value={editingPartner.audienceDescription ?? ""}
                onChange={e => setEditingPartner(p => ({ ...p, audienceDescription: e.target.value }))}
                placeholder="Who they reach and how large or engaged the audience is"
              />
            </div>
            <div className="grid gap-2">
              <Label>Promotion Plan</Label>
              <Textarea
                value={editingPartner.promotionPlan ?? ""}
                onChange={e => setEditingPartner(p => ({ ...p, promotionPlan: e.target.value }))}
                placeholder="How they plan to introduce OmniQure"
              />
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea value={editingPartner.notes ?? ""} onChange={e => setEditingPartner(p => ({ ...p, notes: e.target.value }))} placeholder="Internal notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --------------------------------------------------------------------------
// COMMISSIONS TAB
// --------------------------------------------------------------------------
const COMMISSION_STATUSES = ["all", "pending", "approved", "held", "voided", "paid"];

function CommissionsTab() {
  const [status, setStatus] = useState("all");
  const client = useQueryClient();
  const [actionModal, setActionModal] = useState<{ id: number; action: string } | null>(null);
  const [reason, setReason] = useState("");

  const query = useQuery<{ commissions: Commission[] }>({
    queryKey: ["affiliates", "commissions", status],
    queryFn: () => customFetch(`/api/admin/affiliates/commissions?status=${status}`, { credentials: "include" })
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: number; action: string; reason: string }) => 
      customFetch(`/api/admin/affiliates/commissions/${id}/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      }),
    onSuccess: () => {
      toast.success("Commission updated");
      setActionModal(null);
      setReason("");
      client.invalidateQueries({ queryKey: ["affiliates", "commissions"] });
      client.invalidateQueries({ queryKey: ["affiliates", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const commissions = query.data?.commissions ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2 border-b">
        {COMMISSION_STATUSES.map(s => (
          <Button key={s} variant="ghost" size="sm" onClick={() => setStatus(s)} className={status === s ? "border-b-2 border-primary rounded-none font-bold" : ""}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Sales & Rate</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>
            ) : commissions.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No commissions found.</TableCell></TableRow>
            ) : (
              commissions.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.partnerName}</div>
                    <div className="text-xs text-muted-foreground">{c.partnerEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{c.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">{c.orderStatus}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{pounds(c.eligibleSalesGbp)}</div>
                    <div className="text-xs text-muted-foreground">{c.commissionRatePercent}% rate</div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{pounds(c.amountGbp)}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "paid" ? "default" : c.status === "approved" ? "outline" : "secondary"}>
                      {c.status}
                    </Badge>
                    {c.statusReason && <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={c.statusReason}>{c.statusReason}</div>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>Created: {new Date(c.dates.createdAt).toLocaleDateString('en-GB')}</div>
                    {c.dates.approvedAt && <div>Approved: {new Date(c.dates.approvedAt).toLocaleDateString('en-GB')}</div>}
                    {c.dates.paidAt && <div className="text-primary font-medium">Paid: {new Date(c.dates.paidAt).toLocaleDateString('en-GB')}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {c.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setActionModal({ id: c.id, action: "approve" })}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => setActionModal({ id: c.id, action: "hold" })}>Hold</Button>
                          <Button size="sm" variant="destructive" onClick={() => setActionModal({ id: c.id, action: "void" })}>Void</Button>
                        </>
                      )}
                      {c.status === "held" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setActionModal({ id: c.id, action: "approve" })}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => setActionModal({ id: c.id, action: "void" })}>Void</Button>
                        </>
                      )}
                      {c.status === "approved" && (
                        <>
                          <Button size="sm" variant="default" onClick={() => setActionModal({ id: c.id, action: "paid" })}>Mark Paid</Button>
                          <Button size="sm" variant="outline" onClick={() => setActionModal({ id: c.id, action: "hold" })}>Hold</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!actionModal} onOpenChange={(open) => !open && setActionModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{actionModal?.action} Commission</DialogTitle>
            <DialogDescription>Please provide a reason for this status change. This will be recorded in the audit log.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Reason</Label>
            <Textarea className="mt-2" value={reason} onChange={e => setReason(e.target.value)} placeholder="Required reason..." autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button 
              variant={actionModal?.action === "void" ? "destructive" : "default"}
              disabled={!reason.trim() || mutation.isPending} 
              onClick={() => actionModal && mutation.mutate({ ...actionModal, reason })}
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --------------------------------------------------------------------------
// REWARDS TAB
// --------------------------------------------------------------------------
const REWARD_STATUSES = ["all", "pending", "available", "claimed", "fulfilled", "voided"];

function RewardsTab() {
  const [status, setStatus] = useState("all");
  const client = useQueryClient();
  const [actionModal, setActionModal] = useState<{ id: number; action: string } | null>(null);
  const [reason, setReason] = useState("");

  const query = useQuery<{ rewards: Reward[] }>({
    queryKey: ["affiliates", "rewards", status],
    queryFn: () => customFetch(`/api/admin/affiliates/rewards?status=${status}`, { credentials: "include" })
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: number; action: string; reason: string }) => 
      customFetch(`/api/admin/affiliates/rewards/${id}/${action}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      }),
    onSuccess: () => {
      toast.success("Reward updated");
      setActionModal(null);
      setReason("");
      client.invalidateQueries({ queryKey: ["affiliates", "rewards"] });
      client.invalidateQueries({ queryKey: ["affiliates", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const rewards = query.data?.rewards ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto pb-2 border-b">
        {REWARD_STATUSES.map(s => (
          <Button key={s} variant="ghost" size="sm" onClick={() => setStatus(s)} className={status === s ? "border-b-2 border-primary rounded-none font-bold" : ""}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Qualifying Context</TableHead>
              <TableHead>Reward Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>
            ) : rewards.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No rewards found.</TableCell></TableRow>
            ) : (
              rewards.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.partnerName}</div>
                    <div className="text-xs text-muted-foreground">{r.partnerEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">Volume: {pounds(r.qualifyingSalesGbp)}</div>
                    <div className="text-xs text-muted-foreground">Credit Cap: {pounds(r.creditValueGbp)}</div>
                  </TableCell>
                  <TableCell>
                    {r.claimedProductName ? (
                      <div className="text-sm font-medium text-primary">{r.claimedProductName}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Not yet claimed</div>
                    )}
                    {r.productSlug && <div className="text-xs font-mono text-muted-foreground">{r.productSlug}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.status === "fulfilled" ? "default" : r.status === "available" || r.status === "claimed" ? "outline" : "secondary"}>
                      {r.status}
                    </Badge>
                    {r.statusReason && <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={r.statusReason}>{r.statusReason}</div>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>Created: {new Date(r.dates.createdAt).toLocaleDateString('en-GB')}</div>
                    {r.dates.approvedAt && <div>Approved: {new Date(r.dates.approvedAt).toLocaleDateString('en-GB')}</div>}
                    {r.dates.claimedAt && <div className="text-primary font-medium">Claimed: {new Date(r.dates.claimedAt).toLocaleDateString('en-GB')}</div>}
                    {r.dates.fulfilledAt && <div>Fulfilled: {new Date(r.dates.fulfilledAt).toLocaleDateString('en-GB')}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setActionModal({ id: r.id, action: "approve" })}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => setActionModal({ id: r.id, action: "void" })}>Void</Button>
                        </>
                      )}
                      {r.status === "claimed" && (
                        <Button size="sm" variant="default" onClick={() => setActionModal({ id: r.id, action: "fulfill" })}>Mark Fulfilled</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!actionModal} onOpenChange={(open) => !open && setActionModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{actionModal?.action} Reward</DialogTitle>
            <DialogDescription>Please provide a reason or internal note for this status change.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Reason / Note</Label>
            <Textarea className="mt-2" value={reason} onChange={e => setReason(e.target.value)} placeholder="Tracking reference or reason..." autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button 
              variant={actionModal?.action === "void" ? "destructive" : "default"}
              disabled={!reason.trim() || mutation.isPending} 
              onClick={() => actionModal && mutation.mutate({ ...actionModal, reason })}
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
