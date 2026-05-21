import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";

export type AlertSeverity = "info" | "warning" | "danger";
export type AlertType = "order" | "return" | "stock" | "cart";

export interface AdminAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  link: string;
  createdAt: string;
}

export function useAlerts() {
  return useQuery<AdminAlert[]>({
    queryKey: ["admin-alerts"],
    queryFn: () => customFetch<AdminAlert[]>("/api/admin/alerts"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
