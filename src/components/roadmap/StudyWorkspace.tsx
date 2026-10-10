'use client';

import { ALL_TOPICS, getTopicsByPillar } from '@/data';
import { PILLARS } from '@/data/pillars';
import { toggleTopicBookmark, toggleTopicCompletion } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import type { PillarId, TopicItem } from '@/types';
import { Activity, ArrowRight, Award, BookOpen, Box, Boxes, CheckCircle2, Cloud, Compass, GitMerge, Network, Server, ShieldCheck, Sparkles, Star, Terminal, Wrench } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { TopicPreview } from './TopicPreview';

const RoadmapCanvas = dynamic(() => import('./RoadmapCanvas').then((module) => module.RoadmapCanvas), {
  loading: () => <p className="p-6 text-muted" role="status">Loading visual mindmap…</p>,
});
const icons = { Terminal, Network, ShieldCheck, Box, Cloud, GitMerge, Boxes, Activity };
const descriptions: Record<PillarId, string> = {
  linux: 'Linux fundamentals, shell commands, services, processes, and storage.',
  networking: 'TCP/IP, DNS, TLS, routing, and reverse proxies.',
  auth: 'JWT, OAuth 2.0, OpenID Connect, and enterprise SSO.',
  containers: 'Docker, Kubernetes, container security, and service meshes.',
  cloud: 'Cloud compute, networking, storage, and managed services.',
  cicd: 'Automated pipelines, GitOps, deployment strategies, and security scans.',
  iac: 'Terraform, OpenTofu, Pulumi, and infrastructure state.',
  observability: 'Metrics, logs, traces, reliability goals, and incident signals.',
};
const resources = [
  { href: '/labs', label: 'Hands-On Labs', icon: Box },
  { href: '/tools', label: 'DevOps Tools', icon: Wrench },
  { href: '/flashcards', label: 'Flashcards', icon: Sparkles },
  { href: '/interview-prep', label: 'Mock Interview', icon: Server },
  { href: '/quizzes', label: 'Quizzes', icon: Award },
  { href: '/certificate', label: 'Certificate', icon: ShieldCheck },
  { href: '/cheatsheet', label: 'CLI Cheat Sheet', icon: Terminal },
];
const filters = [
  { id: 'all', label: 'All topics' },
  { id: 'incomplete', label: 'To learn' },
  { id: 'bookmarked', label: 'Bookmarked' },
] as const;

export function StudyWorkspace() {
  const { completedTopics, bookmarkedTopics } = useProgress();
  const [pillarId, setPillarId] = useState<PillarId>('linux');
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');
  const [view, setView] = useState<'topics' | 'mindmap'>('topics');
  const [preview, setPreview] = useState<TopicItem | null>(null);
  const [saveError, setSaveError] = useState('');
  const explorerHeading = useRef<HTMLHeadingElement>(null);
  const pillar = PILLARS.find((item) => item.id === pillarId)!;
  const pillarTopics = getTopicsByPillar(pillarId);
  const topics = pillarTopics.filter((topic) => filter === 'all' || (filter === 'incomplete' ? !completedTopics[topic.id] : bookmarkedTopics[topic.id]));
  const completed = ALL_TOPICS.filter((topic) => completedTopics[topic.id]).length;
  const percent = Math.round(completed / ALL_TOPICS.length * 100);

  function selectPillar(id: PillarId) {
    setPillarId(id);
    setView('topics');
    explorerHeading.current?.focus({ preventScroll: true });
    explorerHeading.current?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
  }

  function saveTopic(kind: 'bookmark' | 'complete', topicId: string) {
    const expected = !(kind === 'bookmark' ? bookmarkedTopics[topicId] : completedTopics[topicId]);
    const saved = kind === 'bookmark' ? toggleTopicBookmark(topicId) : toggleTopicCompletion(topicId);
    setSaveError(saved === expected ? '' : 'Could not save your progress. Please check browser storage and try again.');
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section aria-labelledby="workspace-title" className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-sm font-medium text-muted">{PILLARS.length} pillars · {ALL_TOPICS.length} topics · free study resources</p>
          <h1 id="workspace-title" className="text-3xl font-extrabold leading-tight tracking-tight text-ink lg:text-4xl">Platform Engineer <span className="text-sky-ink">Roadmap</span></h1>
          <p className="max-w-2xl text-base leading-relaxed text-body">Build your platform engineering skills across Linux, Kubernetes, cloud infrastructure, CI/CD, and observability.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/topics" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-action px-6 text-sm font-semibold text-action-ink hover:opacity-90"><BookOpen className="h-4 w-4" aria-hidden="true" />Start learning</Link>
            <a href="#roadmap-explorer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-6 text-sm font-semibold text-ink hover:bg-hover"><Compass className="h-4 w-4" aria-hidden="true" />Explore roadmap</a>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-2xl border border-line bg-surface p-4 shadow-sm lg:w-72">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm font-bold text-ink"><h2 className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-ink" aria-hidden="true" />Your progress</h2><span>{completed} / {ALL_TOPICS.length}</span></div>
          <div role="progressbar" aria-label="Topics completed" aria-valuemin={0} aria-valuemax={ALL_TOPICS.length} aria-valuenow={completed} className="mb-3 h-2.5 overflow-hidden rounded-full border border-line bg-inset"><div className="h-full rounded-full bg-emerald-line" style={{ width: `${percent}%` }} /></div>
          <p className="text-sm leading-relaxed text-muted">Your progress is saved in this browser. No signup required.</p>
        </div>
      </section>

      <section aria-labelledby="pillars-title" className="space-y-4">
        <h2 id="pillars-title" className="text-2xl font-bold text-ink">Core pillars</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PILLARS.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            const count = getTopicsByPillar(item.id).length;
            return <button key={item.id} type="button" aria-label={`View ${item.name} topics`} onClick={() => selectPillar(item.id)} className="group flex flex-col rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong hover:bg-hover">
              <span className="mb-3 flex w-full items-start justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `var(--color-${item.color}-soft)`, color: `var(--color-${item.color}-ink)` }}><Icon className="h-4 w-4" aria-hidden="true" /></span><span className="break-words text-base font-bold text-ink">{item.name}</span></span>
                <span className="shrink-0 rounded-full border px-2 py-1 text-xs font-semibold" style={{ backgroundColor: `var(--color-${item.color}-tint)`, color: `var(--color-${item.color}-ink)`, borderColor: `var(--color-${item.color}-line)` }}>{count} topics</span>
              </span>
              <span className="mb-4 text-sm leading-relaxed text-body">{descriptions[item.id]}</span>
              <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold" style={{ color: `var(--color-${item.color}-ink)` }}>View topics<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </button>;
          })}
        </div>
      </section>

      <section id="roadmap-explorer" aria-labelledby="explorer-title" className="scroll-mt-36 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="explorer-title" ref={explorerHeading} tabIndex={-1} className="scroll-mt-36 rounded text-2xl font-bold text-ink">Roadmap explorer</h2>
          <div className="flex flex-wrap gap-2" aria-label="Roadmap view">
            <button type="button" aria-pressed={view === 'topics'} onClick={() => setView('topics')} className={`min-h-11 rounded-xl border border-line px-4 text-sm font-semibold ${view === 'topics' ? 'bg-selected text-ink' : 'bg-surface text-body hover:bg-hover'}`}>Topic list</button>
            <button type="button" aria-pressed={view === 'mindmap'} onClick={() => setView('mindmap')} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold ${view === 'mindmap' ? 'bg-selected text-ink' : 'bg-surface text-body hover:bg-hover'}`}><Compass className="h-4 w-4" aria-hidden="true" />Visual mindmap</button>
          </div>
        </div>
        {view === 'mindmap' ? <div id="mindmap-canvas"><RoadmapCanvas /></div> : <>
          <nav aria-label="Choose a pillar" className="flex flex-wrap gap-2">
            {PILLARS.map((item) => <button key={item.id} type="button" aria-pressed={pillarId === item.id} onClick={() => setPillarId(item.id)} className={`min-h-11 rounded-xl border px-3 text-sm font-medium ${pillarId === item.id ? 'border-line-strong bg-selected text-ink' : 'border-line bg-surface text-body hover:bg-hover'}`}>{item.name}</button>)}
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
            <div><h3 className="text-lg font-bold text-ink">{pillar.title}</h3><p className="text-sm text-muted">{topics.length} of {pillarTopics.length} topics · {pillarTopics.filter((topic) => completedTopics[topic.id]).length} completed</p></div>
            <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-inset p-1" aria-label="Filter topics">
              {filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`min-h-11 rounded-lg px-3 text-sm font-medium ${filter === item.id ? 'bg-selected text-ink' : 'text-body hover:bg-hover'}`}>{item.label}</button>)}
            </div>
          </div>
          {saveError && <p role="alert" className="text-sm text-rose-ink">{saveError}</p>}
          <div className="space-y-3">
            {topics.map((topic) => {
              const done = !!completedTopics[topic.id], saved = !!bookmarkedTopics[topic.id];
              return <article key={topic.id} className={`rounded-2xl border p-5 ${done ? 'border-emerald-line bg-emerald-tint' : 'border-line bg-surface'}`}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-semibold leading-snug text-ink"><button type="button" aria-label={`Preview ${topic.title}`} onClick={() => setPreview(topic)} className="block w-full rounded-lg text-left hover:text-sky-ink">{topic.title}</button></h4><p className="mt-2 text-sm leading-relaxed text-muted">{topic.subtitle}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">{topic.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-md border border-line bg-inset px-2 py-0.5 text-xs text-muted">{tag}</span>)}{done && <span className="text-sm font-medium text-emerald-ink">Completed</span>}{saved && <span className="text-sm font-medium text-amber-ink">Bookmarked</span>}</div>
                    <Link href={`/topics/${topic.slug}`} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-sky-ink">Open study guide<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-start gap-2">
                    <button type="button" aria-label={`${saved ? 'Remove bookmark for' : 'Bookmark'} ${topic.title}`} aria-pressed={saved} onClick={() => saveTopic('bookmark', topic.id)} className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line px-3 ${saved ? 'bg-amber-soft text-amber-ink' : 'bg-inset text-muted hover:text-amber-ink'}`}><Star className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} aria-hidden="true" /></button>
                    <button type="button" aria-label={`${done ? 'Mark incomplete:' : 'Mark complete:'} ${topic.title}`} aria-pressed={done} onClick={() => saveTopic('complete', topic.id)} className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line px-3 ${done ? 'bg-emerald-soft text-emerald-ink' : 'bg-inset text-muted hover:text-emerald-ink'}`}><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></button>
                  </div>
                </div>
              </article>;
            })}
            {topics.length === 0 && <div className="rounded-2xl border border-dashed border-line-strong p-6 text-sm text-muted"><p>{filter === 'bookmarked' ? `No bookmarked topics in ${pillar.name} yet. Use the star on a topic to save it.` : `All ${pillar.name} topics are complete.`}</p><button type="button" onClick={() => setFilter('all')} className="mt-3 min-h-11 rounded-lg px-3 font-semibold text-sky-ink hover:bg-hover">Show all topics</button></div>}
          </div>
        </>}
      </section>

      <section aria-labelledby="practice-title" className="space-y-4">
        <h2 id="practice-title" className="text-xl font-bold text-ink">Practice resources</h2>
        <div className="flex flex-wrap gap-3">{resources.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink hover:bg-hover"><Icon className="h-4 w-4 text-sky-ink" aria-hidden="true" />{label}</Link>)}</div>
      </section>
      {preview && <TopicPreview topic={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
