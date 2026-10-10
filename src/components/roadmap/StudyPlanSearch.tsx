'use client';

import { searchStudyPlan, studyPlanMatchExcerpt, type StudyPlanSearchEntry } from '@/lib/study-plan-search';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function revealModule(hash: string) {
  let id: string;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  if (!id.startsWith('module-')) return;
  const target = document.getElementById(id);
  if (!(target instanceof HTMLDetailsElement) || !target.closest('#study-plan')) return;
  target.open = true;
  target.scrollIntoView?.({ block: 'start' });
  target.querySelector('summary')?.focus({ preventScroll: true });
}

export function StudyPlanSearch({ entries }: { entries: StudyPlanSearchEntry[] }) {
  const [query, setQuery] = useState('');
  const [stageId, setStageId] = useState('');
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const stages = [...new Map(entries.map((entry) => [entry.stageId, entry.stageTitle])).entries()];
  const searching = !!query.trim() || !!stageId;
  const results = searching ? searchStudyPlan(entries, query, stageId) : [];
  const visible = showAll ? results : results.slice(0, 8);

  useEffect(() => {
    const onHashChange = () => revealModule(window.location.hash);
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function clearSearch() {
    setQuery('');
    setStageId('');
    setShowAll(false);
    inputRef.current?.focus();
  }

  return (
    <section aria-labelledby="study-plan-search-title" className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <h3 id="study-plan-search-title" className="text-base font-semibold text-ink">Find a study module</h3>
      <p id="study-plan-search-help" className="mt-1 text-sm leading-relaxed text-muted">Search all {entries.length} modules, including concepts, failure cases, labs, and prerequisites. Open a result to jump to its full module.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" />
          <label htmlFor="study-plan-query" className="sr-only">Search study plan</label>
          <input id="study-plan-query" ref={inputRef} type="search" value={query} aria-describedby="study-plan-search-help" onChange={(event) => { setQuery(event.target.value); setShowAll(false); }} placeholder="Try SQL, recovery, Terraform, or multi-tenancy" className="min-h-11 w-full rounded-xl border border-line bg-inset py-2.5 pl-10 pr-3 text-base text-ink placeholder:text-muted" />
        </div>
        <label className="sr-only" htmlFor="study-plan-stage">Filter study plan by stage</label>
        <select id="study-plan-stage" value={stageId} onChange={(event) => { setStageId(event.target.value); setShowAll(false); }} className="min-h-11 min-w-0 rounded-xl border border-line bg-inset px-3 text-sm text-ink sm:max-w-64">
          <option value="">All stages</option>
          {stages.map(([id, title], index) => <option key={id} value={id}>{index + 1}. {title}</option>)}
        </select>
      </div>
      {searching && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p role="status" className="text-sm font-medium text-body">{results.length} matching {results.length === 1 ? 'module' : 'modules'}{results.length > visible.length ? ` · showing ${visible.length}` : ''}</p>
            <button type="button" onClick={clearSearch} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-sky-ink hover:bg-hover"><X className="h-4 w-4" aria-hidden="true" />Clear search and filters</button>
          </div>
          {results.length === 0 ? <p className="rounded-xl bg-inset p-4 text-sm leading-relaxed text-body">No modules match these filters. Try a broader term or choose All stages.</p> : (
            <ul className="space-y-2">
              {visible.map(({ entry, match }) => <li key={entry.id}><a href={`#module-${entry.id}`} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) revealModule(`#module-${entry.id}`); }} className="block rounded-xl border border-line bg-inset p-4 hover:border-sky-line hover:bg-hover">
                <p className="text-sm font-semibold text-sky-ink">{entry.number}. {entry.title}</p>
                <p className="mt-1 text-xs text-muted">{entry.stageTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-body"><span className="font-semibold text-ink">{match.label}: </span>{studyPlanMatchExcerpt(match.text, query)}</p>
              </a></li>)}
            </ul>
          )}
          {!showAll && results.length > visible.length && <button type="button" onClick={() => setShowAll(true)} className="min-h-11 rounded-xl border border-line px-4 text-sm font-semibold text-sky-ink hover:bg-hover">Show all {results.length} results</button>}
        </div>
      )}
    </section>
  );
}
