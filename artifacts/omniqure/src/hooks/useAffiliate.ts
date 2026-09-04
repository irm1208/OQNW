import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

export function useAffiliateProgram() {
  return useQuery({
    queryKey: ["affiliate-program"],
    queryFn: async () => {
      const res = await fetch(apiUrl("affiliates/program"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch program");
      return res.json();
    }
  });
}

export function useAffiliateMe(customerId?: number) {
  return useQuery({
    queryKey: ["affiliate-me", customerId],
    queryFn: async () => {
      const res = await fetch(apiUrl("affiliates/me"), { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch affiliate profile");
      }
      return res.json();
    },
    enabled: typeof customerId === "number"
  });
}

export function useApplyAffiliate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { channelUrl: string; audienceDescription: string; promotionPlan: string }) => {
      const res = await fetch(apiUrl("affiliates/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to apply");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-me"] });
    }
  });
}

export function useClaimReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rewardId, productSlug }: { rewardId: number; productSlug: string }) => {
      const res = await fetch(apiUrl(`affiliates/rewards/${rewardId}/claim`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productSlug }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to claim reward");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-me"] });
    }
  });
}
