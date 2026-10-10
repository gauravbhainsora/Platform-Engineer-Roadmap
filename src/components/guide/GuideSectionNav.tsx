export function GuideSectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Guide sections" className="sticky top-16 z-20 mt-6 -mx-4 border-y border-line bg-page px-4 py-2 sm:mx-0 sm:rounded-xl sm:border xl:top-28 print:hidden">
      <div className="flex items-center gap-3">
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-muted sm:block">On this page</span>
        <ul className="flex min-w-0 gap-1 overflow-x-auto px-1.5 py-1.5">
          {sections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a href={`#${section.id}`} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-body hover:bg-selected hover:text-ink">{section.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
