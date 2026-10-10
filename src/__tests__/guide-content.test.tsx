import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ALL_TOPICS } from '@/data';
import { GuideContent } from '@/components/guide/GuideContent';

function render(text: string) {
  return new JSDOM(renderToStaticMarkup(<GuideContent text={text} />)).window.document;
}

describe('Guide overview readability', () => {
  it('renders the SSH overview as three concepts with nested bullets and readable commands', () => {
    const topic = ALL_TOPICS.find((topic) => topic.id === 'net-ssh')!;
    const document = render(topic.overview);
    expect(document.querySelector('h3')?.textContent).toBe('Key Concepts');
    expect(document.querySelectorAll('ol > li')).toHaveLength(3);
    expect(document.querySelectorAll('ol > li ul')).toHaveLength(3);
    expect(document.querySelectorAll('ul > li')).toHaveLength(6);
    expect(document.querySelector('ol > li > p > strong')?.textContent).toBe('Cryptographic Keys:');
    const commands = [...document.querySelectorAll('code')].map((node) => node.textContent);
    expect(commands).toContain('ssh-keygen -t ed25519');
    expect(commands).toContain('ssh -L 5432:db.internal:5432 bastion');
    expect(commands).toContain('~/.ssh/authorized_keys');
    expect(document.body.textContent).not.toContain('`');
  });

  it('retains the text of every existing overview while removing formatting markers', () => {
    for (const topic of ALL_TOPICS) {
      const document = render(topic.overview);
      const expected = topic.overview
        .replace(/^\s*(?:\d+\.|[-*])\s+/gm, '')
        .replace(/`([^`\n]+)`/g, '$1')
        .replace(/\*\*([^*\n]+)\*\*/g, '$1')
        .replace(/:/g, '').replace(/\s/g, '');
      const actual = document.body.textContent!.replace(/:/g, '').replace(/\s/g, '');
      expect(actual, topic.id).toBe(expected);
    }
  });

  it('keeps nested lists, wrapped text, bold emphasis, and non-default numbering', () => {
    const document = render('Intro **with emphasis**.\r\n\r\nSteps:\r\n4. First:\r\n   - Child `command`\r\n     continued on another line\r\n     - Deeper detail\r\n5. Second');
    expect(document.querySelector('ol')?.start).toBe(4);
    expect(document.querySelectorAll('ol > li')).toHaveLength(2);
    expect(document.querySelectorAll('ul ul')).toHaveLength(1);
    expect(document.querySelector('strong')?.textContent).toBe('with emphasis');
    expect(document.body.textContent).toContain('continued on another line');
    expect(document.querySelector('code')?.textContent).toBe('command');
  });

  it('escapes HTML in prose and inline code', () => {
    const document = render('<script>alert(1)</script>\n\n- `<img src=x onerror=alert(1)>`');
    expect(document.querySelector('script, img')).toBeNull();
    expect(document.body.textContent).toContain('<script>alert(1)</script>');
    expect(document.querySelector('code')?.textContent).toBe('<img src=x onerror=alert(1)>');
  });
});
