import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CatalogProduct {
  id: number;
  name: string;
  category: string;
  priceGbp: number | null;
  isPublished: boolean;
}

export interface WholesaleInvoice {
  id: number;
  orderId?: number;
  orderNumber?: string;
  referenceNumber: string;
  status: string; // 'pending', 'paid', 'cancelled'
  customerName: string;
  customerEmail: string;
  totalGbp: number;
  paymentUrl?: string;
  emailStatus?: string;
  dueDate?: string;
  createdAt: string;
}

export function useCatalog() {
  return useQuery({
    queryKey: ["admin", "catalog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/catalog", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch catalog");
      return res.json() as Promise<CatalogProduct[]>;
    }
  });
}

export function useWholesaleInvoices() {
  return useQuery({
    queryKey: ["admin", "wholesale"],
    queryFn: async () => {
      const res = await fetch("/api/admin/wholesale", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json() as Promise<{ invoices: WholesaleInvoice[] }>;
    }
  });
}

export function useCreateWholesaleInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(error?.error || "Failed to create invoice");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] });
    }
  });
}

export function useResendWholesaleInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/wholesale/${id}/resend`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        const error = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(error?.error || "Failed to resend invoice");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] }),
  });
}
