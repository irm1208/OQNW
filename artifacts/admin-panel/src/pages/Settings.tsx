import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type StoreSettings = {
  storeName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  currency: string;
  orderPrefix: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
  announcementBanner: string | null;
  maintenanceMode: boolean;
  cryptoPaymentsEnabled: boolean;
  cryptoPaymentRoutes: string;
  updatedAt: string;
};

type Form = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  orderPrefix: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  announcementBanner: string;
  maintenanceMode: boolean;
  cryptoPaymentsEnabled: boolean;
  cryptoPaymentRoutes: string;
};

const EMPTY: Form = {
  storeName: "", supportEmail: "", supportPhone: "", currency: "GBP", orderPrefix: "OQ",
  addressLine1: "", addressLine2: "", city: "", postcode: "", country: "",
  announcementBanner: "", maintenanceMode: false,
  cryptoPaymentsEnabled: false, cryptoPaymentRoutes: "[]",
};

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Form>(EMPTY);

  const { data, isLoading } = useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: () => fetch(api("admin/settings"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<StoreSettings>; }),
  });

  useEffect(() => {
    if (data) {
      setForm({
        storeName: data.storeName ?? "",
        supportEmail: data.supportEmail ?? "",
        supportPhone: data.supportPhone ?? "",
        currency: data.currency ?? "GBP",
        orderPrefix: data.orderPrefix ?? "OQ",
        addressLine1: data.addressLine1 ?? "",
        addressLine2: data.addressLine2 ?? "",
        city: data.city ?? "",
        postcode: data.postcode ?? "",
        country: data.country ?? "",
        announcementBanner: data.announcementBanner ?? "",
        maintenanceMode: data.maintenanceMode ?? false,
        cryptoPaymentsEnabled: data.cryptoPaymentsEnabled ?? false,
        cryptoPaymentRoutes: data.cryptoPaymentRoutes ?? "[]",
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/settings"), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<StoreSettings>;
    },
    onSuccess: () => {
      toast({ title: "Settings saved" });
      void queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const set = (k: keyof Form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">General store configuration and contact details</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending || !form.storeName.trim()}>
          <Save className="w-4 h-4 mr-2" /> {save.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-semibold">General</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Store Name" value={form.storeName} onChange={set("storeName")} placeholder="OmniQure" />
          <Field label="Currency" value={form.currency} onChange={set("currency")} placeholder="GBP" />
          <Field label="Order Number Prefix" value={form.orderPrefix} onChange={set("orderPrefix")} placeholder="OQ" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Announcement Banner</label>
          <Input value={form.announcementBanner} placeholder="Shown across the storefront (optional)" onChange={e => set("announcementBanner")(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium pt-1">
          <input type="checkbox" checked={form.maintenanceMode} onChange={e => setForm(f => ({ ...f, maintenanceMode: e.target.checked }))} className="rounded" />
          Maintenance mode
        </label>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h3 className="font-semibold">Direct Crypto Payments</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Keep this disabled until every enabled route has a verified receiving address. Private keys are never stored here.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.cryptoPaymentsEnabled}
            onChange={e => setForm(f => ({ ...f, cryptoPaymentsEnabled: e.target.checked }))}
            className="rounded"
          />
          Offer direct crypto payments at checkout
        </label>
        <div className="space-y-1">
          <label className="text-sm font-medium">Wallet routes (JSON)</label>
          <Textarea
            value={form.cryptoPaymentRoutes}
            onChange={e => setForm(f => ({ ...f, cryptoPaymentRoutes: e.target.value }))}
            rows={12}
            spellCheck={false}
            placeholder={'[\n  { \"currency\": \"BTC\", \"network\": \"bitcoin\", \"walletAddress\": \"...\", \"enabled\": true },\n  { \"currency\": \"USDT\", \"network\": \"solana\", \"walletAddress\": \"...\", \"enabled\": true }\n]'}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Supported routes: BTC/bitcoin; ETH/ethereum; USDT or USDC on ethereum, bsc, arbitrum, polygon, or solana; USDT/tron.
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Support Email" value={form.supportEmail} onChange={set("supportEmail")} placeholder="support@omniqure.com" />
          <Field label="Support Phone" value={form.supportPhone} onChange={set("supportPhone")} placeholder="+44 …" />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Business Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Address Line 1" value={form.addressLine1} onChange={set("addressLine1")} />
          <Field label="Address Line 2" value={form.addressLine2} onChange={set("addressLine2")} />
          <Field label="City" value={form.city} onChange={set("city")} />
          <Field label="Postcode" value={form.postcode} onChange={set("postcode")} />
          <Field label="Country" value={form.country} onChange={set("country")} />
        </div>
      </section>
    </div>
  );
}
