import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, RefreshCw, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type Audit = {
  id: number;
  orderId: number;
  attemptId: number | null;
  orderNumber: string | null;
  customerEmail: string | null;
  txHash: string;
  currency: string;
  network: string;
  expectedWallet: string;
  expectedAmount: string;
  observedAmount: string | null;
  confirmations: number | null;
  result: string;
  reason: string | null;
  evidence: Record<string, unknown> | null;
  checkedAt: string;
};

type WalletHistory = { walletAddress: string; currency: string; network: string; firstUsedAt: string };

const RESULT_STYLE: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  underpaid: "bg-orange-100 text-orange-800",
  wrong_wallet: "bg-red-100 text-red-800",
  manual_review: "bg-violet-100 text-violet-800",
};

export default function CryptoPayments() {
  const queryClient = useQueryClient();
  const auditsQuery = useQuery<{ audits: Audit[] }>({
    queryKey: ["crypto-audits"],
    queryFn: async () => {
      const response = await fetch(api("admin/crypto/audits"), { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load payment audits");
      return response.json() as Promise<{ audits: Audit[] }>;
    },
  });
  const walletsQuery = useQuery<{ wallets: WalletHistory[] }>({
    queryKey: ["crypto-wallet-history"],
    queryFn: async () => {
      const response = await fetch(api("admin/crypto/wallet-history"), { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load wallet history");
      return response.json() as Promise<{ wallets: WalletHistory[] }>;
    },
  });
  const audits = auditsQuery.data?.audits ?? [];

  const refresh = async (attemptIds: number[]) => {
    try {
      const url = attemptIds.length === 1
        ? api(`admin/crypto/audits/${attemptIds[0]}/check`)
        : api("admin/crypto/audits/check-batch");
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: attemptIds.length === 1 ? undefined : JSON.stringify({ attemptIds }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string; checked?: number };
      if (!response.ok) throw new Error(data.error ?? "Audit recheck failed");
      toast.success(attemptIds.length === 1 ? "Payment rechecked" : `${data.checked ?? 0} payments rechecked`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crypto-audits"] }),
        queryClient.invalidateQueries({ queryKey: ["crypto-wallet-history"] }),
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Audit recheck failed");
    }
  };

  const isLoading = auditsQuery.isLoading || walletsQuery.isLoading;

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crypto Payment Audit</h2>
          <p className="text-sm text-muted-foreground mt-1">Review on-chain evidence without changing an order’s payment status.</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" disabled={audits.length === 0} onClick={() => void refresh(audits.flatMap((audit) => audit.attemptId ? [audit.attemptId] : []))}>
            <RefreshCw className="w-4 h-4 mr-2" /> Recheck visible
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <WalletCards className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Wallet history</h3>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : (walletsQuery.data?.wallets.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Wallet use will appear here after a customer submits a crypto payment.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {walletsQuery.data?.wallets.map((wallet) => (
              <div key={`${wallet.network}:${wallet.currency}:${wallet.walletAddress}`} className="rounded-lg border p-3">
                <p className="font-semibold text-sm">{wallet.currency} · {wallet.network}</p>
                <p className="font-mono text-xs break-all text-muted-foreground mt-1">{wallet.walletAddress}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">Verification evidence</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Expected / received</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-28 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></TableCell></TableRow>
            ) : audits.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No crypto payment evidence recorded yet.</TableCell></TableRow>
            ) : audits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell>
                  <p className="font-semibold text-sm">{audit.orderNumber ?? `Order ${audit.orderId}`}</p>
                  <p className="text-xs text-muted-foreground">{audit.customerEmail}</p>
                </TableCell>
                <TableCell className="text-sm">{audit.currency} · {audit.network}</TableCell>
                <TableCell>
                  <p className="text-sm">{audit.expectedAmount} {audit.currency}</p>
                  <p className="text-xs text-muted-foreground">{audit.observedAmount ? `${audit.observedAmount} received` : "Not detected"}</p>
                </TableCell>
                <TableCell>
                  <Badge className={RESULT_STYLE[audit.result] ?? "bg-slate-100 text-slate-800"}>{audit.result.replace("_", " ")}</Badge>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">{audit.reason}</p>
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[180px] truncate" title={audit.txHash}>{audit.txHash}</TableCell>
                <TableCell>
                  {audit.attemptId && <Button size="sm" variant="outline" onClick={() => void refresh([audit.attemptId!])}><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Check</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}