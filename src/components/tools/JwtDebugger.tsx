'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, AlertTriangle, Key, Clock, UserCheck } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImF1dGgtcGxhdGZvcm0ta2V5LTAxIn0.eyJpc3MiOiJodHRwczovL2F1dGguY29tcGFueS5jb20vIiwic3ViIjoidXNyXzk4MTAyNDg5MSIsImF1ZCI6WyJodHRwczovL2FwaS5jb21wYW55LmNvbSIsImh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2YyJdLCJpYXQiOjE3OTIwMDAwMDAsImV4cCI6MTc5MjAwMzYwMCwiZW1haWwiOiJnYXVyYXZAcGxhdGZvcm0uaW8iLCJyb2xlcyI6WyJwbGF0Zm9ybS1hZG1pbiIsImNsdXN0ZXItb3BlcmF0b3IiXSwidGVuYW50X2lkIjoidG50X2F3c19wcm9kXzAxIn0.TJVA95OrM7E20RMkZ8N21xK910P_fake_signature_hash_demonstrating_rs256_asymmetric_cryptography';

export function JwtDebugger() {
  const [tokenInput, setTokenInput] = useState(SAMPLE_JWT);
  const [copiedPart, setCopiedPart] = useState<string | null>(null);

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
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);
      const signature = parts[2];

      return { header, payload, signature };
    } catch (e: any) {
      return { error: `Failed to decode token: ${e.message}` };
    }
  };

  const parsed = decodeJwt();

  const copyText = (text: string, part: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPart(part);
    setTimeout(() => setCopiedPart(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Interactive JWT Decoder & Inspector</h2>
            <p className="text-xs text-slate-400">
              Paste tokens to inspect cryptographic headers, claims, and expiry timestamps
            </p>
          </div>
        </div>
        <button
          onClick={() => setTokenInput(SAMPLE_JWT)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white"
        >
          Reset to Sample
        </button>
      </div>

      {/* Raw Token Input */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-2">
          Encoded Token (Header . Payload . Signature)
        </label>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          rows={4}
          placeholder="Paste JWT string here..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Decoded Sections */}
      {parsed.error ? (
        <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                HEADER (Algorithm & Token Type)
              </span>
              <button
                onClick={() => copyText(JSON.stringify(parsed.header, null, 2), 'hdr')}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedPart === 'hdr' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-rose-300 overflow-x-auto">
              {JSON.stringify(parsed.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                PAYLOAD (Subject & Claims)
              </span>
              <button
                onClick={() => copyText(JSON.stringify(parsed.payload, null, 2), 'pay')}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedPart === 'pay' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-purple-300 overflow-x-auto">
              {JSON.stringify(parsed.payload, null, 2)}
            </pre>
          </div>

          {/* Token Claims Summary Banner */}
          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Signing Algorithm:</span>
              <span className="text-amber-400 font-bold">{parsed.header?.alg || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Subject (User ID):</span>
              <span className="text-sky-300">{parsed.payload?.sub || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-500">Issuer:</span>
              <span className="text-slate-200">{parsed.payload?.iss || 'None'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Expiration (Epoch):</span>
              <span className="text-emerald-300">
                {parsed.payload?.exp ? new Date(parsed.payload.exp * 1000).toLocaleString() : 'Never expires'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
