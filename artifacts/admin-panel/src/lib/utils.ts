import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shared API path helper — normalises double-slashes. */
export function api(path: string) {
  return `/api/${path}`.replace(/\/+/g, "/");
}

/**
 * Fetch JSON and throw on any non-2xx response so React Query marks the
 * query as errored (keeping `data` undefined / the default value) instead of
 * storing the error body as data and crashing downstream `.map()` calls.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}
