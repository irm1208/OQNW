import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  cryptoAddresses: CryptoAddresses;
};

type CryptoAddresses = {
  bitcoin: string;
  ethereum: string;
  usdcErc20: string;
  usdtErc20: string;
  solana: string;
  usdcSol: string;
  usdtSol: string;
};

const EMPTY_CRYPTO_ADDRESSES: CryptoAddresses = {
  bitcoin: "", ethereum: "", usdcErc20: "", usdtErc20: "",
  solana: "", usdcSol: "", usdtSol: "",
};

const EMPTY: Form = {
  storeName: "", supportEmail: "", supportPhone: "", currency: "GBP", orderPrefix: "OQ",
  addressLine1: "", addressLine2: "", city: "", postcode: "", country: "",
  announcementBanner: "", maintenanceMode: false,
  cryptoPaymentsEnabled: false, cryptoAddresses: EMPTY_CRYPTO_ADDRESSES,
};

function parseCryptoAddresses(raw: string): CryptoAddresses {
  const addresses = { ...EMPTY_CRYPTO_ADDRESSES };
  try {
    const routes = JSON.parse(raw) as Array<{ currency?: string; network?: string; walletAddress?: string }>;
    for (const route of Array.isArray(routes) ? routes : []) {
      if (typeof route.walletAddress !== "string") continue;
      const key =
        route.currency === "BTC" && route.network === "bitcoin" ? "bitcoin" :
        route.currency === "ETH" && route.network === "ethereum" ? "ethereum" :
        route.currency === "USDC" && route.network === "ethereum" ? "usdcErc20" :
        route.currency === "USDT" && route.network === "ethereum" ? "usdtErc20" :
        route.currency === "SOL" && route.network === "solana" ? "solana" :
        route.currency === "USDC" && route.network === "solana" ? "usdcSol" :
        route.currency === "USDT" && route.network === "solana" ? "usdtSol" :
        null;
      if (key) addresses[key] = route.walletAddress;
    }
  } catch {
    // Invalid legacy JSON is treated as empty fields; the API validates the next save.
  }
  return addresses;
}

function cryptoRoutesJson(addresses: CryptoAddresses): string {
  const routes = [
    ["BTC", "bitcoin", addresses.bitcoin],
    ["ETH", "ethereum", addresses.ethereum],
    ["USDC", "ethereum", addresses.usdcErc20],
    ["USDT", "ethereum", addresses.usdtErc20],
    ["SOL", "solana", addresses.solana],
    ["USDC", "solana", addresses.usdcSol],
    ["USDT", "solana", addresses.usdtSol],
  ] as const;
  return JSON.stringify(routes
    .filter(([, , walletAddress]) => walletAddress.trim())
    .map(([currency, network, walletAddress]) => ({ currency, network, walletAddress: walletAddress.trim(), enabled: true })));
}

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
  const [wallidTestCheckout, setWallidTestCheckout] = useState<{ checkoutPath: string; expiresAt: string } | null>(null);
  const [cryptoTestCheckout, setCryptoTestCheckout] = useState<{ checkoutPath: string; expiresAt: string } | null>(null);

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
        cryptoAddresses: parseCryptoAddresses(data.cryptoPaymentRoutes ?? "[]"),
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/settings"), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cryptoPaymentRoutes: cryptoRoutesJson(form.cryptoAddresses),
        }),
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

  const createWallidTestCheckout = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/test-payments/session"), {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({})) as {
        checkoutPath?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok || !data.checkoutPath || !data.expiresAt) {
        throw new Error(data.error ?? "Could not create the test checkout.");
      }
      return { checkoutPath: data.checkoutPath, expiresAt: data.expiresAt };
    },
    onSuccess: (data) => {
      setWallidTestCheckout(data);
      toast({
        title: "£1 test checkout ready",
        description: "Open it in this browser before the link expires.",
      });
    },
    onError: (error: Error) => toast({
      title: "Could not create test checkout",
      description: error.message,
      variant: "destructive",
    }),
  });

  const createCryptoTestCheckout = useMutation({
    mutationFn: async () => {
      const res = await fetch(api("admin/test-payments/crypto-session"), {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({})) as {
        checkoutPath?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok || !data.checkoutPath || !data.expiresAt) {
        throw new Error(data.error ?? "Could not create the crypto test checkout.");
      }
      return { checkoutPath: data.checkoutPath, expiresAt: data.expiresAt };
    },
    onSuccess: (data) => {
      setCryptoTestCheckout(data);
      toast({
        title: "£1 crypto test checkout ready",
        description: "Open it in this browser before the link expires.",
      });
    },
    onError: (error: Error) => toast({
      title: "Could not create crypto test checkout",
      description: error.message,
      variant: "destructive",
    }),
  });

  const set = (k: keyof Form) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const hasSavedCryptoRoute = Object.values(form.cryptoAddresses).some(address => address.trim().length > 0);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="admin-page space-y-6 max-w-3xl">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">General store configuration and contact details</p>
        </div>
        <div className="page-actions">
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.storeName.trim()}>
            <Save className="w-4 h-4 mr-2" /> {save.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
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

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:p-6 space-y-3">
          <div>
            <h3 className="font-semibold text-amber-950">Wallid £1 Test Payment</h3>
            <p className="text-sm text-amber-900/80 mt-1">
              Creates a short-lived, one-time checkout for a real £1.00 Wallid payment. Retail prices remain unchanged and the resulting order is marked as a test payment.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            data-testid="button-create-wallid-test-checkout"
            onClick={() => createWallidTestCheckout.mutate()}
            disabled={createWallidTestCheckout.isPending}
          >
            {createWallidTestCheckout.isPending ? "Creating test checkout…" : "Create £1 Wallid test checkout"}
          </Button>
          {wallidTestCheckout && (
            <div className="rounded-md border border-amber-200 bg-white p-3 text-sm" data-testid="status-wallid-test-checkout">
              <p className="font-medium text-amber-950">Your one-time test checkout is ready.</p>
              <p className="text-amber-900/80 mt-1">
                It expires at {new Date(wallidTestCheckout.expiresAt).toLocaleTimeString()} and must be opened in this browser while you remain signed in to the admin panel.
              </p>
              <a
                href={wallidTestCheckout.checkoutPath}
                target="_blank"
                rel="noreferrer"
                data-testid="link-open-wallid-test-checkout"
                className="inline-flex mt-3 font-medium text-primary underline underline-offset-4"
              >
                Open £1 Wallid test checkout
              </a>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 sm:p-6 space-y-3">
          <div>
            <h3 className="font-semibold text-blue-950">Crypto £1 Test Payment</h3>
            <p className="text-sm text-blue-900/80 mt-1">
              Creates a short-lived, one-time checkout for a real £1.00 on-chain payment. Retail prices remain unchanged and the resulting order is marked as a test payment.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            data-testid="button-create-crypto-test-checkout"
            onClick={() => createCryptoTestCheckout.mutate()}
            disabled={createCryptoTestCheckout.isPending || !form.cryptoPaymentsEnabled || !hasSavedCryptoRoute}
          >
            {createCryptoTestCheckout.isPending ? "Creating crypto test checkout…" : "Create £1 crypto test checkout"}
          </Button>
          {(!form.cryptoPaymentsEnabled || !hasSavedCryptoRoute) && (
            <p className="text-xs text-blue-900/70" data-testid="status-crypto-test-requirement">
              Enable direct crypto payments and save at least one receiving address below first.
            </p>
          )}
          {cryptoTestCheckout && (
            <div className="rounded-md border border-blue-200 bg-white p-3 text-sm" data-testid="status-crypto-test-checkout">
              <p className="font-medium text-blue-950">Your one-time crypto test checkout is ready.</p>
              <p className="text-blue-900/80 mt-1">
                It expires at {new Date(cryptoTestCheckout.expiresAt).toLocaleTimeString()} and must be opened in this browser while you remain signed in to the admin panel.
              </p>
              <a
                href={cryptoTestCheckout.checkoutPath}
                target="_blank"
                rel="noreferrer"
                data-testid="link-open-crypto-test-checkout"
                className="inline-flex mt-3 font-medium text-primary underline underline-offset-4"
              >
                Open £1 crypto test checkout
              </a>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            ["bitcoin", "Bitcoin Address", "Your BTC receiving address"],
            ["ethereum", "Ethereum Address", "Your ETH receiving address"],
            ["usdcErc20", "USDC ERC20", "Your Ethereum ERC20 receiving address"],
            ["usdtErc20", "USDT ERC20", "Your Ethereum ERC20 receiving address"],
            ["solana", "Solana Address", "Your native SOL receiving address"],
            ["usdcSol", "USDC SOL", "Your Solana receiving address"],
            ["usdtSol", "USDT SOL", "Your Solana receiving address"],
          ] as const).map(([key, label, placeholder]) => (
            <Field
              key={key}
              label={label}
              value={form.cryptoAddresses[key]}
              onChange={value => setForm(f => ({ ...f, cryptoAddresses: { ...f.cryptoAddresses, [key]: value } }))}
              placeholder={placeholder}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Only public receiving addresses are needed. Each address must belong to the matching network.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Support Email" value={form.supportEmail} onChange={set("supportEmail")} placeholder="support@omniqure.com" />
          <Field label="Support Phone" value={form.supportPhone} onChange={set("supportPhone")} placeholder="+44 …" />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
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
