import type { ReactNode } from "react";
import type { AdminAlert } from "@/hooks/useAlerts";
import { useAlerts, useMarkAlertRead } from "@/hooks/useAlerts";
import { Badge } from "@/components/ui/badge";

export function AdminNotificationBadge({
  type,
  itemId,
  children = "New",
}: {
  type: AdminAlert["type"];
  itemId: number;
  children?: ReactNode;
}) {
  const { data: alerts } = useAlerts();
  const markRead = useMarkAlertRead();
  const alert = alerts?.find((candidate) =>
    candidate.type === type &&
    !candidate.isRead &&
    candidate.id === `${type}-${itemId}`,
  );
  if (!alert) return null;

  return (
    <Badge
      role="button"
      tabIndex={0}
      title="Mark this notification as read"
      className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        markRead.mutate(alert);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          markRead.mutate(alert);
        }
      }}
    >
      {children}
    </Badge>
  );
}