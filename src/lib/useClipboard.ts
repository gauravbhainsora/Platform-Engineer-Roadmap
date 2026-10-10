'use client';

import { useEffect, useRef, useState } from 'react';

export function useClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id); setCopyError('');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
      setCopyError('Could not copy. Select the text and copy it manually.');
    }
  };
  return { copy, copiedId, copyError };
}
