'use client';

import { validateManifestInputs } from '@/lib/manifest';
import { Box, Check, Copy, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function K8sManifestGenerator() {
  const [appName, setAppName] = useState('payment-api');
  const [image, setImage] = useState('ghcr.io/company/payment-api:v1.2.0');
  const [replicas, setReplicas] = useState(3);
  const [port, setPort] = useState(8080);
  const [cpuLimit, setCpuLimit] = useState('500m');
  const [memLimit, setMemLimit] = useState('512Mi');

  // Security Toggles
  const [runAsNonRoot, setRunAsNonRoot] = useState(true);
  const [readOnlyRoot, setReadOnlyRoot] = useState(true);
  const [dropCaps, setDropCaps] = useState(true);
  const [includeProbes, setIncludeProbes] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const errors = validateManifestInputs({ appName, image, replicas, port, cpuLimit, memLimit });

  const generateYaml = () => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${JSON.stringify(appName)}
  namespace: production
  labels:
    app: ${JSON.stringify(appName)}
    tier: backend
spec:
  replicas: ${replicas}
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: ${JSON.stringify(appName)}
  template:
    metadata:
      labels:
        app: ${JSON.stringify(appName)}
    spec:
      securityContext:
        ${runAsNonRoot ? `runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault` : '# Caution: Root execution enabled'}
      containers:
      - name: app
        image: ${JSON.stringify(image)}
        ports:
        - containerPort: ${port}
        securityContext:
          allowPrivilegeEscalation: false
          ${readOnlyRoot ? 'readOnlyRootFilesystem: true' : 'readOnlyRootFilesystem: false'}
          ${dropCaps ? `capabilities:
            drop:
            - ALL` : ''}
        resources:
          limits:
            cpu: ${JSON.stringify(cpuLimit)}
            memory: ${JSON.stringify(memLimit)}
          requests:
            cpu: "100m"
            memory: "128Mi"
        ${includeProbes ? `livenessProbe:
          httpGet:
            path: /healthz
            port: ${port}
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /ready
            port: ${port}
          initialDelaySeconds: 5
          periodSeconds: 10` : ''}
        ${readOnlyRoot ? `volumeMounts:
        - mountPath: /tmp
          name: temp-scratch` : ''}
      ${readOnlyRoot ? `volumes:
      - name: temp-scratch
        emptyDir:
          medium: Memory` : ''}
---
apiVersion: v1
kind: Service
metadata:
  name: ${JSON.stringify(appName)}
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: ${JSON.stringify(appName)}
  ports:
  - port: 80
    targetPort: ${port}
`;
  };

  const yamlOutput = errors.length ? '' : generateYaml();

  const handleCopy = async () => {
    if (errors.length) return;
    try {
      await navigator.clipboard.writeText(yamlOutput);
      setCopied(true); setCopyError('');
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopyError('Could not copy the manifest. Select and copy the output manually.'); }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-3 border-b border-line pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-ink border border-emerald-line">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Kubernetes Hardened Manifest Generator</h2>
          <p className="text-xs text-muted">
            Generate Deployment and Service examples with configurable security and health probes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-body uppercase mb-1.5">
                Service Name
              </label>
              <input aria-label="Service Name"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-xl border border-line bg-inset px-3.5 py-2 font-mono text-xs text-ink focus:border-emerald-line focus-visible:outline-2 focus-visible:outline-focus"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-body uppercase mb-1.5">
                Target Port
              </label>
              <input aria-label="Target Port"
                type="number"
                min={1}
                max={65535}
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full rounded-xl border border-line bg-inset px-3.5 py-2 font-mono text-xs text-ink focus:border-emerald-line focus-visible:outline-2 focus-visible:outline-focus"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-body uppercase mb-1.5">
              Container Image
            </label>
            <input aria-label="Container Image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-line bg-inset px-3.5 py-2 font-mono text-xs text-ink focus:border-emerald-line focus-visible:outline-2 focus-visible:outline-focus"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">Replicas ({replicas})</label>
              <input
                type="range"
                aria-label="Replicas"
                min={1}
                max={10}
                value={replicas}
                onChange={(e) => setReplicas(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">CPU Limit</label>
              <input aria-label="CPU Limit"
                type="text"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(e.target.value)}
                className="w-full rounded-lg border border-line bg-inset px-2 py-1 font-mono text-xs text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">Memory Limit</label>
              <input aria-label="Memory Limit"
                type="text"
                value={memLimit}
                onChange={(e) => setMemLimit(e.target.value)}
                className="w-full rounded-lg border border-line bg-inset px-2 py-1 font-mono text-xs text-ink"
              />
            </div>
          </div>

          {/* Security Toggles */}
          <div className="rounded-xl border border-line bg-inset p-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-ink flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Security & Reliability Settings
            </span>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={runAsNonRoot}
                onChange={(e) => setRunAsNonRoot(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-ink">
                <strong>Enforce Non-Root UID (10001)</strong>
                <span className="block text-xs text-muted">Runs the application with an unprivileged user</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={readOnlyRoot}
                onChange={(e) => setReadOnlyRoot(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-ink">
                <strong>Read-Only Root Filesystem + /tmp tmpfs</strong>
                <span className="block text-xs text-muted">Restricts writes to the root filesystem</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dropCaps}
                onChange={(e) => setDropCaps(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-ink">
                <strong>Drop All Linux Capabilities (ALL)</strong>
                <span className="block text-xs text-muted">Disables raw network sockets & root escalation</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeProbes}
                onChange={(e) => setIncludeProbes(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-ink">
                <strong>Liveness & Readiness Health Probes</strong>
                <span className="block text-xs text-muted">Checks application health and readiness</span>
              </span>
            </label>
          </div>
        </div>

        {/* Generated YAML Manifest Output */}
        <div className="relative rounded-2xl border border-line bg-inset overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
            <span className="font-mono text-xs text-emerald-ink font-bold">
              hardened-deployment.yaml
            </span>
            <button
              onClick={handleCopy}
              disabled={errors.length > 0}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-subtle px-3 py-1 text-xs font-mono text-body hover:text-ink disabled:opacity-50 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-ink" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Manifest'}
            </button>
          </div>
          {errors.length > 0 && <ul role="alert" className="p-4 text-xs text-rose-ink space-y-2">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
          {copyError && <p role="alert" className="p-4 text-xs text-rose-ink">{copyError}</p>}
          <pre className="p-4 font-mono text-xs text-emerald-ink overflow-x-auto flex-1 leading-relaxed">
            {yamlOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
