// @vitest-environment jsdom
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_TOPICS } from '@/data';
import { StudyPlan } from '@/components/roadmap/StudyPlan';
import { TopicReader } from '@/components/guide/TopicReader';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

let root: Root;
let host: HTMLDivElement;
const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
  window.history.replaceState(null, '', '/');
  if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
  else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function render(node: ReactNode) { await act(() => root.render(node)); }
async function search(value: string) {
  const input = host.querySelector<HTMLInputElement>('#study-plan-query')!;
  await act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
function searchPanel() { return host.querySelector('section[aria-labelledby="study-plan-search-title"]')!; }
function button(label: string) { return [...host.querySelectorAll('button')].find((button) => button.textContent === label)!; }

describe('Study plan navigation', () => {
  it('finds a failure case, opens its closed module, focuses it, and clears filters', async () => {
    await render(<StudyPlan />);
    const moduleDetails = host.querySelector<HTMLDetailsElement>('#module-sql-basics')!;
    expect(moduleDetails.open).toBe(false);
    await search('SQL injection');
    const link = searchPanel().querySelector<HTMLAnchorElement>('a[href="#module-sql-basics"]')!;
    expect(link.textContent).toContain('Edge cases and failure modes');
    // JSDOM cannot perform native fragment scrolling; the href is asserted above.
    link.addEventListener('click', (event) => event.preventDefault());
    await act(() => link.click());
    expect(moduleDetails.open).toBe(true);
    expect(document.activeElement).toBe(moduleDetails.querySelector('summary'));
    expect(moduleDetails.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    await act(() => button('Clear search and filters').click());
    expect(host.querySelector<HTMLInputElement>('#study-plan-query')?.value).toBe('');
    expect(document.activeElement?.id).toBe('study-plan-query');
    expect(searchPanel().querySelector('[role="status"]')).toBeNull();
    expect(host.querySelectorAll('details[id^="module-"]')).toHaveLength(60);
    expect(moduleDetails.open).toBe(true);
  });

  it('combines stage filters with search and makes all matching results available', async () => {
    await render(<StudyPlan />);
    await search('core concepts');
    expect(searchPanel().querySelector('[role="status"]')?.textContent).toContain('60 matching modules');
    expect(searchPanel().querySelectorAll('a[href^="#module-"]')).toHaveLength(8);
    await act(() => button('Show all 60 results').click());
    expect(searchPanel().querySelectorAll('a[href^="#module-"]')).toHaveLength(60);
    await search('SQL injection');
    const select = host.querySelector<HTMLSelectElement>('#study-plan-stage')!;
    await act(() => {
      select.value = 'orchestration';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(searchPanel().querySelector('[role="status"]')?.textContent).toContain('0 matching modules');
    expect(searchPanel().textContent).toContain('Try a broader term');
    await act(() => button('Clear search and filters').click());
    expect(select.value).toBe('');
  });

  it('opens bookmarked module links on load and prerequisite links on hash changes', async () => {
    window.history.replaceState(null, '', '/#module-sql-basics');
    await render(<StudyPlan />);
    expect(host.querySelector<HTMLDetailsElement>('#module-sql-basics')?.open).toBe(true);
    window.history.replaceState(null, '', '/#module-ssh');
    await act(() => window.dispatchEvent(new HashChangeEvent('hashchange')));
    expect(host.querySelector<HTMLDetailsElement>('#module-ssh')?.open).toBe(true);
    expect(document.activeElement).toBe(host.querySelector('#module-ssh summary'));
    window.history.replaceState(null, '', '/#module-%invalid');
    await act(() => window.dispatchEvent(new HashChangeEvent('hashchange')));
  });
});

describe('Guide section menu', () => {
  it('links each item to an existing focusable section', async () => {
    await render(<TopicReader topic={ALL_TOPICS.find((topic) => topic.id === 'net-ssh')!} />);
    const links = host.querySelectorAll<HTMLAnchorElement>('nav[aria-label="Guide sections"] a');
    expect(links).toHaveLength(9);
    for (const link of links) {
      const section = host.querySelector<HTMLElement>(link.getAttribute('href')!)!;
      expect(section.tagName).toBe('SECTION');
      expect(section.tabIndex).toBe(-1);
      section.focus();
      expect(document.activeElement).toBe(section);
    }
  });

  it('omits optional sections that a guide does not contain', async () => {
    await render(<TopicReader topic={{ ...ALL_TOPICS[0], diagram: undefined, commands: [], gotchas: [], interviewQuestions: [], quiz: [], references: [] }} />);
    const labels = [...host.querySelectorAll('nav[aria-label="Guide sections"] a')].map((link) => link.textContent);
    expect(labels).toEqual(['Overview', 'Mechanics', 'Configuration']);
  });
});
