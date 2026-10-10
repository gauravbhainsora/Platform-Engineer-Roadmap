import { Fragment, type ReactNode } from 'react';

interface ListMarker {
  indent: number;
  ordered: boolean;
  number?: number;
  text: string;
}

function listMarker(line: string): ListMarker | null {
  const match = /^(\s*)(?:(\d+)\.|[-*])\s+(.+)$/.exec(line);
  return match ? {
    indent: match[1].length,
    ordered: !!match[2],
    number: match[2] ? Number(match[2]) : undefined,
    text: match[3],
  } : null;
}

// The guide corpus uses plain text, indented lists, backticks, and bold markers.
// Render those as React elements so source text is always escaped, never HTML.
function inlineText(text: string): ReactNode {
  return text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={index} className="rounded-md border border-line bg-inset px-1.5 py-0.5 font-mono text-[0.875em] text-ink [overflow-wrap:anywhere]">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index} className="font-semibold text-ink">{inlineText(part.slice(2, -2))}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function itemText(text: string): ReactNode {
  const colon = text.indexOf(':');
  if (colon > 0 && colon < 100 && !text.slice(0, colon).includes('`')) {
    return <><strong className="font-semibold text-ink">{inlineText(text.slice(0, colon + 1))}</strong>{inlineText(text.slice(colon + 1))}</>;
  }
  return inlineText(text);
}

function renderBlocks(lines: string[]): ReactNode[] {
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index++;
      continue;
    }

    const marker = listMarker(lines[index]);
    if (marker) {
      const start = index;
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const current = listMarker(lines[index]);
        if (!current || current.indent !== marker.indent || current.ordered !== marker.ordered) break;
        const itemIndex = index++;
        const body: string[] = [];
        while (index < lines.length) {
          const line = lines[index];
          if (!line.trim()) {
            // Keep a blank line only when the item continues after it.
            let next = index + 1;
            while (next < lines.length && !lines[next].trim()) next++;
            if (next === lines.length || lines[next].search(/\S/) <= marker.indent) break;
          } else if (line.search(/\S/) <= marker.indent) {
            break;
          }
          body.push(line.slice(Math.min(line.search(/\S/) < 0 ? line.length : line.search(/\S/), marker.indent + 2)));
          index++;
        }
        items.push(
          <li key={itemIndex} value={current.number} className="pl-1.5 marker:font-semibold marker:text-muted">
            <p>{itemText(current.text)}</p>
            {body.length > 0 && <div className="mt-3 space-y-3">{renderBlocks(body)}</div>}
          </li>,
        );
      }
      blocks.push(marker.ordered
        ? <ol key={start} start={marker.number} className="list-decimal space-y-6 pl-6">{items}</ol>
        : <ul key={start} className="list-disc space-y-2.5 pl-5">{items}</ul>);
      continue;
    }

    const start = index;
    const paragraph = [lines[index++].trim()];
    while (index < lines.length && lines[index].trim() && !listMarker(lines[index])) {
      paragraph.push(lines[index++].trim());
    }
    const text = paragraph.join(' ');
    blocks.push(paragraph.length === 1 && text.length <= 100 && text.endsWith(':')
      ? <h3 key={start} className="text-lg font-semibold leading-snug text-ink">{inlineText(text.slice(0, -1))}</h3>
      : <p key={start}>{inlineText(text)}</p>);
  }

  return blocks;
}

export function GuideContent({ text }: { text: string }) {
  return <div className="max-w-[68ch] space-y-5 text-base leading-7 text-ink [overflow-wrap:anywhere]">{renderBlocks(text.replace(/\r\n?/g, '\n').split('\n'))}</div>;
}

export function InlineGuideText({ text }: { text: string }) {
  return <>{inlineText(text)}</>;
}
