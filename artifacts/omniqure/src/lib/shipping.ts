const CHANNEL_ISLANDS = new Set(["Guernsey", "Jersey", "Isle of Man"]);
const EUROPE_ZONE_A = new Set([
  "Germany", "France", "Netherlands", "Belgium", "Austria", "Ireland", "Spain", "Italy",
]);
const EUROPE_ZONE_B = new Set([
  "Poland", "Czechia", "Czech Republic", "Sweden", "Denmark", "Norway", "Finland", "Switzerland",
]);
const NORTH_AMERICA = new Set(["United States", "Canada"]);
const AUSTRALIA_AND_NEW_ZEALAND = new Set(["Australia", "New Zealand"]);
const ASIA_PACIFIC = new Set([
  "Japan", "Singapore", "Hong Kong", "South Korea", "Taiwan", "Malaysia", "Thailand",
]);

export function standardShippingPriceGbpForCountry(country: string): number {
  if (country === "United Kingdom") return 0;
  if (CHANNEL_ISLANDS.has(country)) return 9.95;
  if (EUROPE_ZONE_A.has(country)) return 14.99;
  if (EUROPE_ZONE_B.has(country)) return 17.99;
  if (NORTH_AMERICA.has(country)) return 22.99;
  if (AUSTRALIA_AND_NEW_ZEALAND.has(country)) return 27.99;
  if (ASIA_PACIFIC.has(country)) return 23.99;
  return 29.99;
}