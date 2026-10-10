'use client';

import { ALL_TOPICS, searchTopics } from '@/data';
import { ArrowRight, BookOpen, Search, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Modal } from './Modal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query.trim() ? searchTopics(query).slice(0, 10) : ALL_TOPICS.slice(0, 6);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Search topics" className="flex items-start justify-center sm:p-6 md:p-20">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-line px-4 py-3.5">
          <Search className="h-5 w-5 text-sky-ink mr-3" />
          <input
            ref={inputRef}
            aria-label="Search topics and commands"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && results.length) {
                event.preventDefault(); resultRefs.current[0]?.focus();
              } else if (event.key === 'ArrowUp' && results.length) {
                event.preventDefault(); resultRefs.current[results.length - 1]?.focus();
              }
            }}
            placeholder="Search topics (e.g., DNS, Docker, Kubernetes, BBR, JWT)..."
            className="w-full bg-transparent text-sm sm:text-base text-ink placeholder-muted focus-visible:outline-2 focus-visible:outline-focus"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery('')} className="text-muted hover:text-body mr-2">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded px-1.5 py-0.5 text-xs font-mono text-muted border border-line bg-subtle hover:bg-selected"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">
              No topics or commands found for &ldquo;<span className="text-sky-ink">{query}</span>&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                {query ? 'Matching Topics & Guides' : 'Featured Topics'}
              </div>
              {results.map((topic, index) => (
                <Link
                  ref={(element) => { resultRefs.current[index] = element; }}
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  onClick={onClose}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                      event.preventDefault();
                      const next = index + (event.key === 'ArrowDown' ? 1 : -1);
                      if (next < 0 || next >= results.length) inputRef.current?.focus();
                      else resultRefs.current[next]?.focus();
                    }
                  }}
                  className="group flex items-start gap-3 rounded-xl p-3 hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-sky-400 transition-colors border border-transparent hover:border-line"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-soft text-sky-ink group-hover:bg-sky-fill group-hover:text-ink transition-colors">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-mono font-semibold text-muted group-hover:text-sky-ink">
                        {topic.pillarId}
                      </span>
                      <span className="text-ink">•</span>
                      <span className="text-sm font-semibold text-ink group-hover:text-ink truncate">
                        {topic.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted line-clamp-1 mt-0.5">
                      {topic.subtitle}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {topic.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded bg-subtle px-1.5 py-0.5 text-xs text-muted"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-sky-ink group-hover:translate-x-0.5 transition-all self-center" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-line bg-inset px-4 py-2.5 flex items-center justify-between text-xs text-muted font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </Modal>
  );
}
