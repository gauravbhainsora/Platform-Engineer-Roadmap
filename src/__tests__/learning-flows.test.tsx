// @vitest-environment jsdom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseAllDocuments } from 'yaml';
import { ALL_TOPICS, PILLARS, getTopicsByPillar } from '@/data';
import { createDefaultProgress } from '@/lib/progress';
import { getStoredProgress, saveProgress, STORAGE_KEY } from '@/lib/storage';
import { QuizHub } from '@/components/quiz/QuizHub';
import { LayoutWrapper } from '@/components/ui/LayoutWrapper';
import { TopicReader } from '@/components/guide/TopicReader';
import BackupSyncModal from '@/components/ui/BackupSyncModal';
import CertificateGenerator from '@/components/certificate/CertificateGenerator';
import { K8sManifestGenerator } from '@/components/tools/K8sManifestGenerator';
import { FlashcardDeck } from '@/components/flashcards/FlashcardDeck';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { StudyWorkspace } from '@/components/roadmap/StudyWorkspace';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  host = document.createElement('div'); document.body.append(host);
  root = createRoot(host);
  vi.spyOn(window, 'print').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  // JSDOM does not implement native dialog opening, focus, or cancellation.
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
    this.querySelector<HTMLElement>('input, button, textarea, a')?.focus();
  };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
afterEach(async () => {
  await act(() => root.unmount()); host.remove();
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

async function render(node: ReactNode) { await act(() => root.render(node)); }
function button(text: string) {
  const result = Array.from(host.querySelectorAll('button')).find((element) => element.textContent?.trim() === text);
  if (!result) throw new Error(`Button not found: ${text}`);
  return result;
}
async function click(text: string) { await act(() => button(text).click()); }
async function input(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  await act(() => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('Theme preference', () => {
  const toggle = () => host.querySelector<HTMLButtonElement>('button[aria-label^="Switch to "]')!;

  it('toggles both ways, preserves progress, and restores the theme after remounting', async () => {
    saveProgress({ ...createDefaultProgress(), notes: { topic: 'Keep my notes' }, completedTopics: { topic: true } });
    await render(<LayoutWrapper><p>Content</p></LayoutWrapper>);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(toggle().getAttribute('aria-label')).toBe('Switch to dark mode');
    await act(() => toggle().click());
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(getStoredProgress()).toMatchObject({ theme: 'dark', notes: { topic: 'Keep my notes' }, completedTopics: { topic: true } });
    await render(null);
    await render(<LayoutWrapper><p>Content</p></LayoutWrapper>);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(toggle().getAttribute('aria-label')).toBe('Switch to light mode');
    await act(() => toggle().click());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(getStoredProgress().theme).toBe('light');
  });

  it('applies restored and cross-tab preferences to the whole app', async () => {
    await render(<LayoutWrapper><p>Content</p></LayoutWrapper>);
    await act(() => { saveProgress({ ...createDefaultProgress(), theme: 'dark' }); });
    expect(document.documentElement.dataset.theme).toBe('dark');
    await act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...createDefaultProgress(), theme: 'light' }));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    });
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('keeps the current theme and reports a failed storage write', async () => {
    await render(<LayoutWrapper><p>Content</p></LayoutWrapper>);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    await act(() => toggle().click());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Could not save your theme');
  });
});

describe('Quiz scoring', () => {
  it.each([true, false])('counts the final correct answer once, all earlier correct: %s', async (allCorrect) => {
    await render(<QuizHub />);
    for (let index = 0; index < 10; index++) {
      const questionText = host.querySelector('h2')!.textContent;
      const question = ALL_TOPICS.flatMap((topic) => topic.quiz).find((item) => item.question === questionText)!;
      const answer = allCorrect || index === 9 ? question.answerIndex : (question.answerIndex + 1) % question.options.length;
      await click(question.options[answer]);
      await click('Confirm Answer');
      await click(index === 9 ? 'View Results' : 'Next Question');
    }
    expect(getStoredProgress().quizScores.linux).toMatchObject({ score: allCorrect ? 10 : 1, total: 10 });
    expect(host.textContent).toContain(`You scored ${allCorrect ? 10 : 1} out of 10`);
  });
});

describe('Search and dialogs', () => {
  it('opens with Cmd+K, navigates results with arrows, and restores focus on close', async () => {
    await render(<LayoutWrapper><p>Content</p></LayoutWrapper>);
    const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Search topics"]')!;
    trigger.focus();
    await act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, cancelable: true })));
    const dialog = host.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    const search = host.querySelector<HTMLInputElement>('input[aria-label="Search topics and commands"]')!;
    await input(search, 'DNS');
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement?.tagName).toBe('A');
    await act(() => dialog.dispatchEvent(new Event('cancel', { cancelable: true })));
    expect(host.querySelector('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
  });

  it('rejects empty-object backup imports and preserves existing notes', async () => {
    saveProgress({ ...createDefaultProgress(), notes: { topic: 'Keep me' } });
    await render(<BackupSyncModal isOpen onClose={() => {}} />);
    await click('Import & Restore');
    await input(host.querySelector('textarea')!, '{}');
    await click('Restore Progress');
    expect(getStoredProgress().notes.topic).toBe('Keep me');
    expect(host.textContent).toContain('Backup is missing completedTopics');
  });

  it('does not report successful restore when browser storage rejects the write', async () => {
    await render(<BackupSyncModal isOpen onClose={() => {}} />);
    await click('Import & Restore');
    await input(host.querySelector('textarea')!, JSON.stringify(createDefaultProgress()));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
    await click('Restore Progress');
    expect(host.textContent).toContain('Your progress was not restored');
    expect(host.textContent).not.toContain('Successfully restored');
  });
});

describe('Shared progress', () => {
  it('keeps an unsaved note draft visible when persistence fails', async () => {
    await render(<TopicReader topic={ALL_TOPICS[0]} />);
    await click('Notes');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
    await input(host.querySelector('textarea')!, 'Keep this unsaved draft');
    expect(host.querySelector('textarea')!.value).toBe('Keep this unsaved draft');
    expect(host.textContent).toContain('Could not save your note');
    expect(getStoredProgress().notes).toEqual({});
  });

  it('updates topic notes, bookmarks, and completion after restore and cross-tab reset', async () => {
    const topic = ALL_TOPICS[0];
    await render(<TopicReader topic={topic} />);
    await click('Notes');
    await act(() => { saveProgress({ ...createDefaultProgress(), completedTopics: { [topic.id]: true }, bookmarkedTopics: { [topic.id]: true }, notes: { [topic.id]: 'Restored note' } }); });
    expect(host.querySelector('textarea')!.value).toBe('Restored note');
    expect(button('Completed ✓')).toBeDefined();
    expect(button('Bookmarked')).toBeDefined();
    await act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createDefaultProgress()));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    });
    expect(host.querySelector('textarea')!.value).toBe('');
    expect(button('Mark Complete')).toBeDefined();
    expect(button('Bookmark')).toBeDefined();
  });
});

describe('Roadmap previews', () => {
  it('exposes topic previews as buttons and closes the dialog without losing progress', async () => {
    const onSelect = vi.fn();
    await render(<RoadmapCanvas onSelectTopic={onSelect} />);
    const preview = host.querySelector<HTMLButtonElement>('button[aria-label^="Preview "]')!;
    expect(preview).not.toBeNull();
    await act(() => preview.click());
    expect(onSelect).toHaveBeenCalledOnce();
    expect(host.querySelector('dialog')?.getAttribute('aria-label')).toBe('Topic preview');
    await click('Mark Complete');
    expect(Object.values(getStoredProgress().completedTopics).filter(Boolean)).toHaveLength(1);
    const close = host.querySelector<HTMLButtonElement>('button[aria-label="Close topic preview"]')!;
    await act(() => close.click());
    expect(host.querySelector('dialog')).toBeNull();
    expect(Object.values(getStoredProgress().completedTopics).filter(Boolean)).toHaveLength(1);
  });
});

describe('Compact study workspace', () => {
  it('makes every real topic accessible through the eight pillar cards', async () => {
    await render(<StudyWorkspace />);
    const visited = new Set<string>();
    for (const pillar of PILLARS) {
      const card = host.querySelector<HTMLButtonElement>(`button[aria-label="View ${pillar.name} topics"]`)!;
      await act(() => card.click());
      expect(document.activeElement?.id).toBe('explorer-title');
      for (const topic of getTopicsByPillar(pillar.id)) {
        expect(host.querySelector(`a[href="/topics/${topic.slug}"]`)).not.toBeNull();
        visited.add(topic.id);
      }
      expect(host.querySelectorAll('article')).toHaveLength(getTopicsByPillar(pillar.id).length);
    }
    expect(visited.size).toBe(ALL_TOPICS.length);
  });

  it('keeps bookmark and completion filters, counters, and undo in sync with storage', async () => {
    const topic = getTopicsByPillar('linux')[0];
    await render(<StudyWorkspace />);
    const action = (prefix: string) => Array.from(host.querySelectorAll<HTMLButtonElement>('button[aria-label]')).find((element) => element.getAttribute('aria-label') === `${prefix} ${topic.title}`)!;
    await act(() => action('Bookmark').click());
    await click('Bookmarked');
    expect(host.querySelectorAll('article')).toHaveLength(1);
    await act(() => action('Remove bookmark for').click());
    expect(host.querySelectorAll('article')).toHaveLength(0);
    expect(host.textContent).toContain('No bookmarked topics in Linux yet');
    expect(host.querySelector('[role="alert"]')).toBeNull();
    await click('Show all topics');
    await act(() => action('Mark complete:').click());
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('1');
    await click('To learn');
    expect(host.querySelector(`a[href="/topics/${topic.slug}"]`)).toBeNull();
    await click('All topics');
    await act(() => action('Mark incomplete:').click());
    expect(getStoredProgress().completedTopics[topic.id]).toBe(false);
    expect(host.querySelector('[role="alert"]')).toBeNull();
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('opens a preview, persists completion, and restores focus when it closes', async () => {
    await render(<StudyWorkspace />);
    const trigger = host.querySelector<HTMLButtonElement>('button[aria-label^="Preview "]')!;
    trigger.focus();
    await act(() => trigger.click());
    expect(host.querySelector('dialog')?.open).toBe(true);
    await click('Mark Complete');
    await click('Completed ✓');
    expect(host.querySelector('[role="alert"]')).toBeNull();
    await act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Close topic preview"]')!.click());
    expect(document.activeElement).toBe(trigger);
    expect(host.querySelector('dialog')).toBeNull();
  });

  it('reports failed writes without changing the visible progress', async () => {
    await render(<StudyWorkspace />);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    await act(() => host.querySelector<HTMLButtonElement>('button[aria-label^="Mark complete:"]')!.click());
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Could not save');
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('keeps the original mindmap available and can return to the selected topic list', async () => {
    await render(<StudyWorkspace />);
    await click('Visual mindmap');
    await act(async () => { await vi.waitFor(() => expect(host.querySelector('#mindmap-canvas h2')?.textContent).toBe('Platform Engineering Roadmap')); });
    await click('Topic list');
    expect(host.querySelectorAll('article')).toHaveLength(getTopicsByPillar('linux').length);
  });
});

describe('Completion certificates', () => {
  it('blocks printing incomplete and simulated progress and removes verification claims', async () => {
    await render(<CertificateGenerator />);
    expect(button('Print / Save PDF').disabled).toBe(true);
    await click('Preview 100%');
    expect(button('Print / Save PDF').disabled).toBe(true);
    expect(host.textContent).toContain('PREVIEW ONLY');
    expect(host.textContent).not.toContain('Cryptographically');
    expect(host.textContent).not.toContain('Copy Verify URL');
  });
  it('enables printing after every real topic is completed and a name is entered', async () => {
    saveProgress({ ...createDefaultProgress(), completedTopics: Object.fromEntries(ALL_TOPICS.map((topic) => [topic.id, true])) });
    await render(<CertificateGenerator />);
    await input(host.querySelector('input')!, 'Test Learner');
    expect(button('Print / Save PDF').disabled).toBe(false);
    await click('Print / Save PDF');
    expect(window.print).toHaveBeenCalledOnce();
    expect(host.textContent).not.toContain('PREVIEW ONLY');
  });
});

describe('Manifest generator', () => {
  it('generates parseable manifests and blocks invalid ports and YAML injection', async () => {
    await render(<K8sManifestGenerator />);
    const documents = parseAllDocuments(host.querySelector('pre')!.textContent!);
    expect(documents).toHaveLength(2);
    expect(documents.every((document) => document.errors.length === 0)).toBe(true);
    expect(documents[0].get('kind')).toBe('Deployment');
    await input(host.querySelector('input[aria-label="Target Port"]')!, '70000');
    expect(button('Copy Manifest').disabled).toBe(true);
    expect(host.textContent).toContain('between 1 and 65535');
    expect(host.querySelector('pre')!.textContent).toBe('');
    await input(host.querySelector('input[aria-label="Target Port"]')!, '8080');
    await input(host.querySelector('input[aria-label="Container Image"]')!, 'nginx # injected');
    expect(button('Copy Manifest').disabled).toBe(true);
  });
});

describe('Flashcard review queue', () => {
  it('removes reviewed cards from the due queue and persists their schedule across remounts', async () => {
    await render(<FlashcardDeck />);
    await click('I Know This ✓');
    expect(host.textContent).toContain('1 Mastered');
    const review = getStoredProgress().flashcardReviews;
    expect(Object.values(review!)).toHaveLength(1);
    await render(null);
    await render(<FlashcardDeck />);
    expect(host.textContent).toContain('1 Mastered');
    expect(host.textContent).toContain('of 11');
    await click('Browse all cards');
    expect(host.textContent).toContain('of 12');
  });
});
