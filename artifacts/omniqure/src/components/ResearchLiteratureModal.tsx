import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Copy, X } from "lucide-react";
import "./research-modal.css";

/*
 * Research literature, kept on OmniQure: PubChem compound data, recent
 * PubMed papers (abstracts open in place) and the CAS registry number,
 * read live from NCBI's public APIs (both send CORS headers).
 */

export type LiteratureTab = "pubchem" | "pubmed" | "cas";

type Props = {
  compound: string;
  aliases: string[];
  casNumber?: string;
  fallback: { formula?: string; molecularWeight?: string; sequence?: string };
  initialTab: LiteratureTab;
  onClose: () => void;
};

type PubChemRecord = {
  cid: number;
  title?: string;
  iupac?: string;
  formula?: string;
  weight?: string;
  synonyms: string[];
};
type Paper = { id: string; title: string; journal: string; year: string; authors: string };
type PubMedResult = { count: number; papers: Paper[] };

const PUG = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    const p = load();
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return cache.get(key) as Promise<T>;
}

const pause = (ms: number) => new Promise(r => setTimeout(r, ms));

// NCBI rate-limits bursts (its 429s carry no CORS header, so they surface as
// network errors); one retry after a second covers it.
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
  } catch {
    return null;
  }
}

async function loadPubChem(names: string[]): Promise<PubChemRecord | null> {
  for (const n of names) {
    const rec = await pubchemFor(n);
    if (rec) return rec;
  }
  return null;
}

// Name-like synonyms only: skip registry codes, catalogue numbers and CAS numbers.
const nameLike = (s: string) =>
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

async function loadPubMed(names: string[], pubchemKey: string, lookup: string[]): Promise<PubMedResult> {
  // PubChem's record title and synonyms catch spellings the product name misses.
  const rec = await cached(pubchemKey, () => loadPubChem(lookup)).catch(() => null);
  const extra = rec ? [rec.title ?? "", ...rec.synonyms].filter(nameLike) : [];
  const candidates = [...names, ...extra]
    .filter((n, i, a) => a.findIndex(x => x.toLowerCase() === n.toLowerCase()) === i)
    .slice(0, 7);
  const kept: string[] = [];
  for (const [i, n] of candidates.entries()) {
    if (i) await pause(350); // NCBI allows 3 requests a second
    if (await exactTerm(n).catch(() => false)) kept.push(n);
  }
  if (!kept.length) return { count: 0, papers: [] };
  const term = kept.map(n => `"${n.replace(/"/g, "")}"`).join(" OR ");
  const search = await json(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=6&sort=relevance&term=${encodeURIComponent(term)}`);
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

async function loadAbstract(id: string): Promise<string> {
  const r = await get(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&id=${id}`);
  if (!r.ok) throw new Error(String(r.status));
  const doc = new DOMParser().parseFromString(await r.text(), "text/xml");
  const parts = [...doc.querySelectorAll("AbstractText")].map(el => {
    const label = el.getAttribute("Label");
    const text = el.textContent?.trim() ?? "";
    return label ? `${label[0]}${label.slice(1).toLowerCase()}: ${text}` : text;
  });
  return parts.join("\n\n");
}

function useAsync<T>(key: string | null, load: () => Promise<T>) {
  const [state, setState] = useState<{ key: string | null; data?: T; error?: boolean }>({ key: null });
  useEffect(() => {
    if (!key) return;
    let live = true;
    cached(key, load).then(
      data => { if (live) setState({ key, data }); },
      () => { if (live) setState({ key, error: true }); },
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const ready = state.key === key;
  return { loading: !!key && !ready, data: ready ? state.data : undefined, error: ready && !!state.error };
}

function Formula({ value }: { value: string }) {
  return <>{value.split(/(\d+)/).map((part, i) => (/^\d+$/.test(part) ? <sub key={i}>{part}</sub> : part))}</>;
}

function Rows({ rows }: { rows: [string, React.ReactNode | undefined][] }) {
  const shown = rows.filter(([, v]) => v);
  return (
    <dl className="rlm__rows">
      {shown.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Loading() {
  return (
    <div className="rlm__loading" aria-live="polite">
      <span /><span /><span />
      <p className="sr-only">Loading</p>
    </div>
  );
}

function PaperItem({ paper }: { paper: Paper }) {
  const [open, setOpen] = useState(false);
  const abs = useAsync(open ? `abs:${paper.id}` : null, () => loadAbstract(paper.id));
  return (
    <li className="rlm__paper">
      <button type="button" className="rlm__paper-head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span>
          <span className="rlm__paper-title">{paper.title}</span>
          <span className="rlm__paper-meta">{[paper.authors, paper.journal, paper.year].filter(Boolean).join(" · ")}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="rlm__abstract">
          {abs.loading ? <Loading /> : abs.error ? (
            <p className="rlm__muted">The abstract could not be loaded. Please try again shortly.</p>
          ) : abs.data ? (
            abs.data.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p className="rlm__muted">No abstract is published for this paper.</p>
          )}
          <p className="rlm__pmid">PMID {paper.id}</p>
        </div>
      )}
    </li>
  );
}

export default function ResearchLiteratureModal({ compound, aliases, casNumber, fallback, initialTab, onClose }: Props) {
  const [tab, setTab] = useState<LiteratureTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const names = [compound, ...aliases].filter((n, i, a) => n && a.indexOf(n) === i);
  const lookup = casNumber ? [casNumber, ...names] : names;

  const pubchemKey = `pc:${lookup.join("|")}`;
  const pubchem = useAsync(tab === "pubchem" || tab === "cas" ? pubchemKey : null, () => loadPubChem(lookup));
  const pubmed = useAsync(tab === "pubmed" ? `pm:${names.join("|")}` : null, () => loadPubMed(names, pubchemKey, lookup));

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  const copyCas = async () => {
    if (!casNumber) return;
    try {
      await navigator.clipboard.writeText(casNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked */ }
  };

  const tabs: { id: LiteratureTab; label: string }[] = [
    { id: "pubchem", label: "PubChem" },
    { id: "pubmed", label: "PubMed" },
    ...(casNumber ? [{ id: "cas" as const, label: "CAS number" }] : []),
  ];

  const pc = pubchem.data as PubChemRecord | null | undefined;
  const pm = pubmed.data as PubMedResult | undefined;

  return createPortal(
    <div className="rlm" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rlm__dialog" role="dialog" aria-modal="true" aria-labelledby="rlm-title" tabIndex={-1} ref={dialogRef}>
        <div className="pinstripe" aria-hidden="true" />
        <header className="rlm__head">
          <div>
            <p className="rlm__eyebrow">Research literature</p>
            <h2 id="rlm-title" className="rlm__title">{compound}</h2>
          </div>
          <button type="button" className="rlm__close" onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="rlm__tabs" role="tablist" aria-label="Source">
          {tabs.map(t => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="rlm__tab" onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="rlm__body" role="tabpanel">
          {tab === "pubchem" && (
            pubchem.loading ? <Loading /> : pc ? (
              <>
                <Rows rows={[
                  ["Record", pc.title],
                  ["PubChem CID", String(pc.cid)],
                  ["Formula", pc.formula ? <Formula value={pc.formula} /> : undefined],
                  ["Molecular weight", pc.weight ? `${pc.weight} g/mol` : undefined],
                  // Peptide IUPAC names run to dozens of lines; show only readable ones.
                  ["IUPAC name", pc.iupac && pc.iupac.length <= 140 ? pc.iupac : undefined],
                ]} />
                {pc.synonyms.filter(n => nameLike(n) && n.length <= 40).length > 0 && (
                  <div className="rlm__chips">
                    <p className="rlm__label">Also indexed as</p>
                    <ul>{pc.synonyms.filter(n => nameLike(n) && n.length <= 40).map(n => <li key={n}>{n}</li>)}</ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="rlm__muted">PubChem has no single compound record under this name. These are the details from our specification sheet.</p>
                <Rows rows={[
                  ["Compound", compound],
                  ["Formula", fallback.formula ? <Formula value={fallback.formula} /> : undefined],
                  ["Molecular weight", fallback.molecularWeight],
                  ["Sequence", fallback.sequence],
                ]} />
              </>
            )
          )}

          {tab === "pubmed" && (
            pubmed.loading ? <Loading /> : pubmed.error ? (
              <p className="rlm__muted">PubMed could not be reached. Please try again shortly.</p>
            ) : pm && pm.papers.length > 0 ? (
              <>
                <p className="rlm__count">
                  <strong>{pm.count.toLocaleString("en-GB")}</strong> indexed paper{pm.count !== 1 ? "s" : ""} mention {compound}. The most relevant are below; open one to read its abstract.
                </p>
                <ul className="rlm__papers">{pm.papers.map(p => <PaperItem key={p.id} paper={p} />)}</ul>
              </>
            ) : (
              <p className="rlm__muted">PubMed has no indexed papers under this name yet.</p>
            )
          )}

          {tab === "cas" && casNumber && (
            <>
              <div className="rlm__cas">
                <span className="rlm__cas-num">{casNumber}</span>
                <button type="button" className="rlm__copy" onClick={copyCas}>
                  {copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Copy size={14} aria-hidden="true" /> Copy</>}
                </button>
              </div>
              <p className="rlm__muted">
                The CAS Registry Number is the unique identifier the Chemical Abstracts Service gives this substance. Use it to match {compound} across suppliers, papers and safety data.
              </p>
              {pubchem.loading ? <Loading /> : (
                <Rows rows={[
                  ["PubChem record", pc?.title ?? compound],
                  ["Formula", (pc?.formula ?? fallback.formula) ? <Formula value={(pc?.formula ?? fallback.formula)!} /> : undefined],
                  ["Molecular weight", pc?.weight ? `${pc.weight} g/mol` : fallback.molecularWeight],
                ]} />
              )}
            </>
          )}
        </div>

        <p className="rlm__foot">
          Data from PubChem and PubMed, U.S. National Library of Medicine. Provided for research reference only.
        </p>
      </div>
    </div>,
    document.body,
  );
}
