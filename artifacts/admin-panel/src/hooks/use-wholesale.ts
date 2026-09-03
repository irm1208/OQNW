import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const WHOLESALE_DRAFT_KEY = "omniqure:wholesale-payment-draft";
export const WHOLESALE_EDIT_DRAFT_KEY = "omniqure:wholesale-edit-draft";
export const WHOLESALE_RETRY_DRAFT_KEY = "omniqure:wholesale-retry-draft";
export const WHOLESALE_RESOLVE_DRAFT_KEY = "omniqure:wholesale-resolve-draft";

export class WholesaleApiError extends Error {
  status: number;
  requiresRecentAuth: boolean;

  constructor(message: string, status: number, requiresRecentAuth = false) {
    super(message);
    this.name = "WholesaleApiError";
    this.status = status;
    this.requiresRecentAuth = requiresRecentAuth;
  }
}

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
  customerEmailCc?: string | null;
  totalGbp: number;
  currency?: "GBP" | "EUR";
  paymentUrl?: string;
  emailStatus?: string;
  paymentStatus?: string;
  paymentLastError?: string | null;
  paymentCreationStale?: boolean;
  dueDate?: string;
  description?: string | null;
  invoiceNotes?: string | null;
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
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
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
        const error = await res.json().catch(() => null) as {
          error?: string;
          requiresRecentAuth?: boolean;
        } | null;
        throw new WholesaleApiError(
          error?.requiresRecentAuth
            ? "Please confirm your identity before creating this payment link"
            : error?.error || "Failed to create invoice",
          res.status,
          error?.requiresRecentAuth === true,
        );
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
        const error = await res.json().catch(() => null) as {
          error?: string;
          requiresRecentAuth?: boolean;
        } | null;
        throw new WholesaleApiError(
          error?.requiresRecentAuth
            ? "Please confirm your identity before resending this payment link"
            : error?.error || "Failed to resend invoice",
          res.status,
          error?.requiresRecentAuth === true,
        );
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] }),
  });
}

export function useRetryWholesalePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/wholesale/${id}/retry`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => null) as {
          error?: string;
          requiresRecentAuth?: boolean;
        } | null;
        throw new WholesaleApiError(
          error?.requiresRecentAuth
            ? "Please confirm your identity before retrying this payment link"
            : error?.error || "Failed to retry payment link",
          res.status,
          error?.requiresRecentAuth === true,
        );
      }
      return res.json() as Promise<{ invoice: WholesaleInvoice; warning?: string | null }>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] }),
  });
}

export function useResolveWholesalePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, apiPaymentId, paymentUrl }: {
      id: number;
      apiPaymentId: string;
      paymentUrl: string;
    }) => {
      const res = await fetch(`/api/admin/wholesale/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ apiPaymentId, paymentUrl }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => null) as {
          error?: string;
          requiresRecentAuth?: boolean;
        } | null;
        throw new WholesaleApiError(
          error?.error || "Failed to attach the verified Wallid payment",
          res.status,
          error?.requiresRecentAuth === true,
        );
      }
      return res.json() as Promise<{ invoice: WholesaleInvoice; warning?: string | null }>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] }),
  });
}

export function useUpdateWholesaleInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: {
      id: number;
      data: {
        customerName: string;
        customerEmail: string;
        customerEmailCc: string;
        dueDate: string;
        description: string;
        notes: string;
      };
    }) => {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => null) as {
          error?: string;
          requiresRecentAuth?: boolean;
        } | null;
        throw new WholesaleApiError(
          error?.requiresRecentAuth
            ? "Please confirm your identity before editing this payment link"
            : error?.error || "Failed to update invoice",
          res.status,
          error?.requiresRecentAuth === true,
        );
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "wholesale"] }),
  });
}
