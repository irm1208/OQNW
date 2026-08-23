/**
 * Express query and route params can be `string | string[]` (e.g. `?status=a&status=b`,
 * or a repeated route segment). This helper normalizes that to a single string, taking
 * the first value when an array is provided, so downstream code never receives an
 * unsound cast.
 */
export function firstString(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }
  return typeof value === "string" ? value : undefined;
}
