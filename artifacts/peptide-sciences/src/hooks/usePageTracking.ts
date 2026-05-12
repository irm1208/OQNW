import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/pixels";

export function usePageTracking() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location]);
}
