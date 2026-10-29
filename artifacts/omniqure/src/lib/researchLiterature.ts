/*
 * Research literature for a compound, from NCBI's public APIs (PubChem and
 * PubMed). scripts/save-research-literature.ts runs this once per compound and
 * saves the result to public/research/<key>.json, which the product page reads
 * instantly. The live functions remain as a fallback for compounds added since.
 * Runs in the browser and in Node (no DOM APIs).
 */

export type PubChemRecord = {
  cid: number;
  title?: string;
  iupac?: string;
  formula?: string;
  weight?: string;
  synonyms: string[];
};
export type Paper = {
  id: string;
  title: string;
  journal: string;
  year: string;
  authors: string;
  abstract?: string;
};
export type PubMedResult = {
  count: number;
  papers: Paper[];
  /** Shown above the papers when they are for a parent compound or a blend's components. */
  note?: string;
};
export type SavedLiterature = {
  compound: string;
  savedAt: string;
  pubchem: PubChemRecord | null;
  pubmed: PubMedResult;
};

const PUG = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/** File name for a compound's saved literature, e.g. "BPC-157" → "bpc-157". */
export const literatureKey = (compound: string) =>
  compound.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const pause = (ms: number) => new Promise(r => setTimeout(r, ms));

// NCBI rate-limits bursts (its 429s carry no CORS header, so in a browser they
// surface as network errors); one retry after a second covers it.
async function get(url: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url);
      if (r.ok || attempt) return r;
    } catch (e) {
      if (attempt) throw e;
    }
    await pause(1100);
  }
}

async function json(url: string) {
  const r = await get(url);
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

async function pubchemFor(query: string): Promise<PubChemRecord | null> {
  const q = encodeURIComponent(query);
  try {
    const props = await json(`${PUG}/compound/name/${q}/property/Title,IUPACName,MolecularFormula,MolecularWeight/JSON`);
    const p = props?.PropertyTable?.Properties?.[0];
    if (!p) return null;
    let synonyms: string[] = [];
    try {
      const syn = await json(`${PUG}/compound/cid/${p.CID}/synonyms/JSON`);
      synonyms = (syn?.InformationList?.Information?.[0]?.Synonym ?? []).slice(0, 8);
    } catch { /* synonyms are optional */ }
    return { cid: p.CID, title: p.Title, iupac: p.IUPACName, formula: p.MolecularFormula, weight: p.MolecularWeight, synonyms };
  } catch (e) {
    // 404/400: no record under this name. Anything else (rate limit, network) is a real failure.
    if (/^(400|404)$/.test((e as Error).message)) return null;
    throw e;
  }
}

/** The first PubChem record found for any of the names (CAS number first). */
export async function loadPubChem(lookup: string[]): Promise<PubChemRecord | null> {
  for (const n of lookup) {
    const rec = await pubchemFor(n);
    if (rec) return rec;
  }
  return null;
}

/** Name-like synonyms only: skips registry codes, catalogue numbers and CAS numbers. */
export const nameLike = (s: string) =>
  s.length >= 3 && s.length <= 60 && /[a-z]/i.test(s) && !/^\d+-\d+-\d$/.test(s) &&
  !/^(MFCD|CHEMBL|SCHEMBL|DTXSID|AKOS|orb|CS-|HY-|AC-|SY|UNII)/i.test(s) && !/^[A-Z0-9]{8,}$/.test(s);

// PubMed silently splits a quoted phrase it does not know into loose words
// ("iodide"), so each name is checked on its own and kept only if it matched
// as a whole.
async function exactTerm(name: string): Promise<boolean> {
  const r = await json(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=${encodeURIComponent(`"${name.replace(/"/g, "")}"`)}`);
  const res = r?.esearchresult ?? {};
  const w = res.warninglist ?? {};
  const unmatched = (w.quotedphrasesnotfound?.length ?? 0) + (w.phrasesignored?.length ?? 0);
  return unmatched === 0 && Number(res.count ?? 0) > 0;
}

/** The most relevant PubMed papers for the compound, under any name that matches exactly. */
export async function loadPubMed(names: string[], pubchem: PubChemRecord | null, limit = 6): Promise<PubMedResult> {
  // PubChem's record title and synonyms catch spellings the product name misses.
  const extra = pubchem ? [pubchem.title ?? "", ...pubchem.synonyms].filter(nameLike) : [];
  const candidates = [...names, ...extra]
    .filter((n, i, a) => n && a.findIndex(x => x.toLowerCase() === n.toLowerCase()) === i)
    .slice(0, 7);
  const kept: string[] = [];
  for (const [i, n] of candidates.entries()) {
    if (i) await pause(350); // NCBI allows 3 requests a second
    if (await exactTerm(n)) kept.push(n); // a failed check throws, so it is never mistaken for "no papers"
  }
  if (!kept.length) return { count: 0, papers: [] };
  const term = kept.map(n => `"${n.replace(/"/g, "")}"`).join(" OR ");
  await pause(350);
  const search = await json(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=${limit}&sort=relevance&term=${encodeURIComponent(term)}`);
  const ids: string[] = search?.esearchresult?.idlist ?? [];
  const count = Number(search?.esearchresult?.count ?? 0);
  if (!ids.length) return { count, papers: [] };
  await pause(350);
  const sum = await json(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`);
  const papers = ids.map(id => {
    const d = sum?.result?.[id] ?? {};
    const authors: { name: string }[] = d.authors ?? [];
    return {
      id,
      title: String(d.title ?? "Untitled").replace(/\.$/, ""),
      journal: d.source ?? "",
      year: String(d.pubdate ?? "").slice(0, 4),
      authors: authors.length ? `${authors[0].name}${authors.length > 1 ? " et al." : ""}` : "",
    };
  });
  return { count, papers };
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s: string) =>
  s.replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => ENTITIES[e])
    .replace(/\s+/g, " ")
    .trim();

/** Abstracts for several PubMed IDs in one request, as paragraphs split by blank lines. */
export async function loadAbstracts(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const r = await get(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&id=${ids.join(",")}`);
  if (!r.ok) throw new Error(String(r.status));
  const xml = await r.text();
  const out: Record<string, string> = {};
  for (const article of xml.split(/<\/PubmedArticle>/)) {
    const id = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1];
    if (!id) continue;
    const parts = [...article.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(([, attrs, body]) => {
      const label = attrs.match(/Label="([^"]+)"/)?.[1];
      const text = decode(body);
      return label ? `${label[0]}${label.slice(1).toLowerCase()}: ${text}` : text;
    });
    out[id] = parts.filter(Boolean).join("\n\n");
  }
  return out;
}

/** Adds abstracts to a PubMed result's papers. */
export async function withAbstracts(pubmed: PubMedResult): Promise<PubMedResult> {
  if (!pubmed.papers.length) return pubmed;
  await pause(350);
  const abstracts = await loadAbstracts(pubmed.papers.map(p => p.id)).catch(() => ({} as Record<string, string>));
  return { ...pubmed, papers: pubmed.papers.map(p => ({ ...p, abstract: abstracts[p.id] ?? "" })) };
}

/** Everything the modal shows, fetched live. */
export async function loadLiterature(compound: string, names: string[], lookup: string[]): Promise<SavedLiterature> {
  const pubchem = await loadPubChem(lookup);
  const pubmed = await withAbstracts(await loadPubMed(names, pubchem));
  return { compound, savedAt: new Date().toISOString(), pubchem, pubmed };
}
