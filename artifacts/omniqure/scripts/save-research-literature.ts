/*
 * Saves PubChem and PubMed data (with abstracts) for every compound in the
 * catalogue to public/research/<compound>.json, so the product page's research
 * literature modal loads instantly from our own site.
 *
 *   pnpm run research:save                 # API at http://localhost:8080
 *   pnpm run research:save -- <api-url>    # another API, e.g. production
 *
 * Re-run after adding compounds, or now and then to pick up new papers.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { literatureKey, loadPubChem, loadPubMed, pause, withAbstracts, type SavedLiterature } from "../src/lib/researchLiterature";

const api = (process.argv[2] ?? "http://localhost:8080").replace(/\/$/, "");
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/research");

// The names PubMed indexes these under, where the catalogue name is ambiguous
// ("P21" is also a gene) or spelled differently.
const PUBMED_NAMES: Record<string, string[]> = {
  "P21": ["P021", "Peptide 021"],
  "CJC-1295 No DAC": ["CJC-1295", "Modified GRF 1-29"],
  "Melanotan 1": ["afamelanotide", "Melanotan I"],
  "Melanotan 2": ["Melanotan II"],
};
// PubChem lookups that must skip the catalogue's CAS number. ARA-290's is
// stored as 506-32-1, which is arachidonic acid (Cibinetide is 1208243-50-8).
const PUBCHEM_LOOKUP: Record<string, string[]> = {
  "ARA-290": ["Cibinetide", "ARA290"],
};
// Modified forms with little literature of their own: fall back to the parent's papers.
const PARENT: Record<string, string> = {
  "N-Acetyl Epithalon Amidate": "Epithalon",
  "N-Acetyl Selank Amidate": "Selank",
  "N-Acetyl Semax Amidate": "Semax",
  "TB-500 Fragment (17-23)": "TB-500",
};

// Same split as the product page: "BPC-157 5mg" → "BPC-157".
const baseName = (name: string) =>
  name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)(?:\s+\(.*?\))?)$/i)?.[1].trim() ?? name;

type ApiProduct = { slug: string; name: string; category?: string; casNumber?: string | null; alsoKnownAs?: string | null };
const products: ApiProduct[] = await fetch(`${api}/api/products`).then(r => {
  if (!r.ok) throw new Error(`GET ${api}/api/products → ${r.status}`);
  return r.json();
});

const compounds = new Map<string, ApiProduct[]>();
for (const p of products) {
  if (p.category === "Accessories" || /bac(teriostatic)? water/i.test(p.name)) continue;
  const base = baseName(p.name);
  compounds.set(base, [...(compounds.get(base) ?? []), p]);
}

// The product page's own names (compound + up to three aliases), as it builds them.
function pageNames(base: string) {
  const v = compounds.get(base) ?? [];
  const aliases = (v.find(p => p.alsoKnownAs)?.alsoKnownAs ?? "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 3);
  const names = [base, ...aliases].filter((n, i, a) => a.indexOf(n) === i);
  const cas = v.find(p => p.casNumber)?.casNumber?.split("/")[0].trim();
  return { names, lookup: PUBCHEM_LOOKUP[base] ?? (cas ? [cas, ...names] : names) };
}
// Names to search PubMed under.
const searchNames = (base: string) => PUBMED_NAMES[base] ?? pageNames(base).names;
const list = (xs: string[]) => xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}` : xs[0];

await mkdir(outDir, { recursive: true });
let saved = 0;
const empty: string[] = [];
for (const [base] of compounds) {
  const { names, lookup } = pageNames(base);
  // "A + B Blend" is a blend; "NAD+" is not.
  const components = /\s\+\s/.test(base) ? base.replace(/\bblend\b/i, "").split("+").map(s => s.trim()).filter(Boolean) : [];
  for (let attempt = 1; ; attempt++) {
    try {
      const pubchem = components.length ? null : await loadPubChem(lookup);
      let pubmed;
      if (components.length) {
        pubmed = await loadPubMed(components.flatMap(searchNames), null);
        if (pubmed.papers.length) pubmed.note = `Papers on the compounds in this blend: ${list(components)}.`;
      } else {
        pubmed = await loadPubMed(searchNames(base), pubchem);
        const parent = PARENT[base];
        if (!pubmed.papers.length && parent) {
          await pause(350);
          pubmed = await loadPubMed(searchNames(parent), null);
          if (pubmed.papers.length) pubmed.note = `No papers are indexed under ${base} itself, so these are for its parent compound, ${parent}.`;
        }
      }
      pubmed = await withAbstracts(pubmed);
      const lit: SavedLiterature = { compound: base, savedAt: new Date().toISOString(), pubchem, pubmed };
      await writeFile(path.join(outDir, `${literatureKey(base)}.json`), JSON.stringify(lit));
      saved++;
      if (!pubchem && !pubmed.papers.length) empty.push(base);
      const abs = pubmed.papers.filter(p => p.abstract).length;
      console.log(`${base.padEnd(31)} PubChem ${pubchem ? "✓" : "–"}  PubMed ${String(pubmed.count).padStart(6)}  saved ${pubmed.papers.length} (${abs} abstracts)${pubmed.note ? "  *" : ""}`);
      break;
    } catch (e) {
      if (attempt < 3) { await pause(5000 * attempt); continue; } // NCBI rate limit: wait and retry
      console.error(`${base}: failed (${(e as Error).message}); the page will look it up live`);
      break;
    }
  }
  await pause(1000);
}
console.log(`\nSaved ${saved} of ${compounds.size} compounds to public/research/.  * = parent or blend components`);
if (empty.length) console.log(`No PubChem record or papers: ${empty.join(", ")}`);
