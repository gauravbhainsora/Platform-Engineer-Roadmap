'use client';

import { Modal } from '@/components/ui/Modal';
import { InlineGuideText } from '@/components/guide/GuideContent';
import { toggleTopicCompletion } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import type { TopicItem } from '@/types';
import { BookOpen, CheckCircle2, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function TopicPreview({ topic, onClose }: { topic: TopicItem; onClose: () => void }) {
  const { completedTopics } = useProgress();
  const [saveError, setSaveError] = useState('');
  const done = !!completedTopics[topic.id];
  return (
    <Modal isOpen onClose={onClose} label="Topic preview" className="flex items-center justify-end sm:p-6">
      <div className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-lg sm:p-7">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sky-ink">{topic.pillarId} pillar · {topic.level}</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{topic.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{topic.subtitle}</p>
          </div>
          <button type="button" aria-label="Close topic preview" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-subtle hover:text-ink"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <section className="my-5"><h3 className="text-sm font-semibold text-ink">Overview</h3><p className="mt-2 text-base leading-relaxed text-body">{topic.summary}</p></section>
        <section className="my-5 space-y-3">
          <h3 className="text-sm font-semibold text-ink">Key platform concepts</h3>
          {topic.keyConcepts.map((concept) => <div key={concept.title} className="rounded-xl border border-line bg-inset p-4"><h4 className="text-base font-semibold text-ink">{concept.title}</h4><p className="mt-2 text-sm leading-6 text-body"><InlineGuideText text={concept.explanation} /></p></div>)}
        </section>
        {topic.commands.length > 0 && <section className="my-5"><h3 className="text-sm font-semibold text-ink">Essential commands</h3><div className="mt-2 space-y-2">{topic.commands.slice(0, 3).map((command) => <pre key={command.cmd} className="overflow-x-auto rounded-lg border border-line bg-inset p-3 font-mono text-sm text-emerald-ink"><code>{command.cmd}</code></pre>)}</div></section>}
        {saveError && <p role="alert" className="text-sm text-rose-ink">{saveError}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" aria-pressed={done} onClick={() => setSaveError(toggleTopicCompletion(topic.id) === !done ? '' : 'Could not save your progress. Please try again.')} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold ${done ? 'bg-emerald-soft text-emerald-ink' : 'bg-subtle text-ink hover:bg-selected'}`}><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{done ? 'Completed ✓' : 'Mark Complete'}</button>
          <Link href={`/topics/${topic.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-action px-4 text-sm font-semibold text-action-ink hover:opacity-90"><BookOpen className="h-4 w-4" aria-hidden="true" />Open full study guide<ChevronRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </Modal>
  );
}
