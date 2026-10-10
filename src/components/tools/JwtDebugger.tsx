'use client';

import { useClipboard } from '@/lib/useClipboard';
import { AlertTriangle, Check, Copy, Key, ShieldCheck, UserCheck } from 'lucide-react';
import { useState } from 'react';

const SAMPLE_JWT =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImF1dGgtcGxhdGZvcm0ta2V5LTAxIn0.eyJpc3MiOiJodHRwczovL2F1dGguY29tcGFueS5jb20vIiwic3ViIjoidXNyXzk4MTAyNDg5MSIsImF1ZCI6WyJodHRwczovL2FwaS5jb21wYW55LmNvbSIsImh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2YyJdLCJpYXQiOjE3OTIwMDAwMDAsImV4cCI6MTc5MjAwMzYwMCwiZW1haWwiOiJnYXVyYXZAcGxhdGZvcm0uaW8iLCJyb2xlcyI6WyJwbGF0Zm9ybS1hZG1pbiIsImNsdXN0ZXItb3BlcmF0b3IiXSwidGVuYW50X2lkIjoidG50X2F3c19wcm9kXzAxIn0.TJVA95OrM7E20RMkZ8N21xK910P_fake_signature_hash_demonstrating_rs256_asymmetric_cryptography';

export function JwtDebugger() {
  const [tokenInput, setTokenInput] = useState(SAMPLE_JWT);
  const { copy, copiedId: copiedPart, copyError } = useClipboard();

  const decodeJwt = () => {
    try {
      const parts = tokenInput.trim().split('.');
      if (parts.length !== 3) {
        return { error: 'Invalid JWT format. A valid token must have exactly 3 parts separated by periods (header.payload.signature).' };
      }

      const decodeBase64 = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))));
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);
      if (!header || typeof header !== 'object' || Array.isArray(header) || !payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Header and payload must be JSON objects.');
      for (const claim of ['sub', 'iss']) { if (payload[claim] !== undefined && typeof payload[claim] !== 'string') throw new Error(`${claim} must be a string.`); }
      if (payload.exp !== undefined && (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp))) throw new Error('exp must be a numeric timestamp.');
      if (header.alg !== undefined && typeof header.alg !== 'string') throw new Error('alg must be a string.');
      const signature = parts[2];

      return { header, payload, signature };
    } catch (e: unknown) {
      return { error: `Failed to decode token: ${e instanceof Error ? e.message : 'Invalid token'}` };
    }
  };

  const parsed = decodeJwt();

  const copyText = (text: string, part: string) => copy(text, part);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg">
      <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-soft text-amber-ink border border-amber-line">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Interactive JWT Decoder & Inspector</h2>
            <p className="text-xs text-muted">
              Decode headers, claims, and timestamps locally. Signatures are not verified.
            </p>
          </div>
        </div>
        <button
          onClick={() => setTokenInput(SAMPLE_JWT)}
          className="rounded-lg border border-line bg-subtle px-3 py-1.5 text-xs font-mono text-body hover:text-ink"
        >
          Reset to Sample
        </button>
      </div>

      {copyError && <p role="alert" className="text-sm text-rose-ink">{copyError}</p>}
      {/* Raw Token Input */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-semibold text-body uppercase mb-2">
          Encoded Token (Header . Payload . Signature)
        </label>
        <textarea aria-label="Encoded JWT"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          rows={4}
          placeholder="Paste JWT string here..."
          className="w-full rounded-xl border border-line bg-inset p-3.5 font-mono text-xs text-ink placeholder-muted focus:border-amber-line focus-visible:outline-2 focus-visible:outline-focus"
        />
      </div>

      {/* Decoded Sections */}
      {parsed.error ? (
        <div className="rounded-xl border border-rose-line bg-rose-tint p-4 text-xs text-rose-ink flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-ink" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header */}
          <div className="rounded-xl border border-line bg-inset overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
              <span className="text-xs font-mono font-bold text-rose-ink flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                HEADER (Algorithm & Token Type)
              </span>
              <button
                onClick={() => copyText(JSON.stringify(parsed.header, null, 2), 'hdr')}
                className="text-xs font-mono text-muted hover:text-ink flex items-center gap-1"
              >
                {copiedPart === 'hdr' ? <Check className="h-3 w-3 text-emerald-ink" /> : <Copy className="h-3 w-3" />}
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-rose-ink overflow-x-auto">
              {JSON.stringify(parsed.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl border border-line bg-inset overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
              <span className="text-xs font-mono font-bold text-purple-ink flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                PAYLOAD (Subject & Claims)
              </span>
              <button
                onClick={() => copyText(JSON.stringify(parsed.payload, null, 2), 'pay')}
                className="text-xs font-mono text-muted hover:text-ink flex items-center gap-1"
              >
                {copiedPart === 'pay' ? <Check className="h-3 w-3 text-emerald-ink" /> : <Copy className="h-3 w-3" />}
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-purple-ink overflow-x-auto">
              {JSON.stringify(parsed.payload, null, 2)}
            </pre>
          </div>

          {/* Token Claims Summary Banner */}
          <div className="md:col-span-2 rounded-xl border border-line bg-inset p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Signing Algorithm:</span>
              <span className="text-amber-ink font-bold">{parsed.header?.alg || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Subject (User ID):</span>
              <span className="text-sky-ink">{parsed.payload?.sub || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line">
              <span className="text-muted">Issuer:</span>
              <span className="text-ink">{parsed.payload?.iss || 'None'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Expiration (Epoch):</span>
              <span className="text-emerald-ink">
                {typeof parsed.payload?.exp === 'number' ? new Date(parsed.payload.exp * 1000).toLocaleString() : 'No expiry claim'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
