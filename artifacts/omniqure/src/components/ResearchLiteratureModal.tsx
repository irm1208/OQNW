import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Copy, X } from "lucide-react";
import { literatureKey, loadLiterature, nameLike, type Paper, type PubChemRecord, type PubMedResult, type SavedLiterature } from "@/lib/researchLiterature";
import "./research-modal.css";

/*
 * Research literature, kept on OmniQure: PubChem compound data, the most
 * relevant PubMed papers (abstracts open in place) and the CAS registry
 * number. Read from public/research/<compound>.json, saved by
 * `pnpm run research:save`; compounds added since are looked up live.
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

// Saved literature loads from our own site; the live NCBI lookup only runs
// for compounds added since the last save.
const cache = new Map<string, Promise<SavedLiterature>>();

function literatureFor(compound: string, names: string[], lookup: string[]): Promise<SavedLiterature> {
  const key = literatureKey(compound);
  if (!cache.has(key)) {
    const p = fetch(`${import.meta.env.BASE_URL}research/${key}.json`)
      .then(r => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() as Promise<SavedLiterature> : Promise.reject()))
      .catch(() => loadLiterature(compound, names, lookup));
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return cache.get(key)!;
}

function useAsync<T>(key: string | null, load: () => Promise<T>) {
  const [state, setState] = useState<{ key: string | null; data?: T; error?: boolean }>({ key: null });
  useEffect(() => {
    if (!key) return;
    let live = true;
    load().then(
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
          {paper.abstract ? (
            paper.abstract.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
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

  const lit = useAsync(`lit:${literatureKey(compound)}`, () => literatureFor(compound, names, lookup));
  const pubchem = { loading: lit.loading, data: lit.data?.pubchem };
  const pubmed = { loading: lit.loading, error: lit.error, data: lit.data?.pubmed };

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
                {pm.note && <p className="rlm__note">{pm.note}</p>}
                <p className="rlm__count">
                  <strong>{pm.count.toLocaleString("en-GB")}</strong> indexed paper{pm.count !== 1 ? "s" : ""}{pm.note ? "" : ` mention ${compound}`}. The most relevant are below; open one to read its abstract.
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
