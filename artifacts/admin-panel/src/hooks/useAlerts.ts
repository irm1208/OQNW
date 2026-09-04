import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";

export type AlertSeverity = "info" | "warning" | "danger";
export type AlertType = "order" | "return" | "stock" | "cart" | "fraud";

export interface AdminAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}

export function useAlerts() {
  return useQuery<AdminAlert[]>({
    queryKey: ["admin-alerts"],
    queryFn: () => customFetch<AdminAlert[]>("/api/admin/alerts"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useAlertIds(type: AdminAlert["type"]) {
  const { data: alerts } = useAlerts();
  return useMemo(() => new Set(
    (alerts ?? [])
      .filter((alert) => alert.type === type)
      .filter((alert) => !alert.isRead)
      .map((alert) => Number(alert.id.slice(type.length + 1)))
      .filter(Number.isInteger),
  ), [alerts, type]);
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alert: Pick<AdminAlert, "id" | "createdAt">) => {
      const res = await fetch(`/api/admin/alerts/${encodeURIComponent(alert.id)}/read`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createdAt: alert.createdAt }),
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
    },
    onMutate: async (alert) => {
      await queryClient.cancelQueries({ queryKey: ["admin-alerts"] });
      const previous = queryClient.getQueryData<AdminAlert[]>(["admin-alerts"]);
      queryClient.setQueryData<AdminAlert[]>(["admin-alerts"], (current) =>
        current?.map((item) => item.id === alert.id && item.createdAt === alert.createdAt
          ? { ...item, isRead: true }
          : item),
      );
      return { previous };
    },
    onError: (_error, _alert, context) => {
      if (context?.previous) queryClient.setQueryData(["admin-alerts"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin-alerts"] }),
  });
}
