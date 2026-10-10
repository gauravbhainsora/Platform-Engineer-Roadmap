'use client';

import React, { useState } from 'react';
import { Box, Copy, Check, ShieldCheck, Download } from 'lucide-react';

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

  const generateYaml = () => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  namespace: production
  labels:
    app: ${appName}
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
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
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
        image: ${image}
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
            cpu: "${cpuLimit}"
            memory: "${memLimit}"
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
  name: ${appName}
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: ${appName}
  ports:
  - port: 80
    targetPort: ${port}
`;
  };

  const yamlOutput = generateYaml();

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Kubernetes Hardened Manifest Generator</h2>
          <p className="text-xs text-slate-400">
            Configure secure, production-grade Deployment and Service manifests with CIS security standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                Service Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
                Target Port
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1.5">
              Container Image
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Replicas ({replicas})</label>
              <input
                type="range"
                min={1}
                max={10}
                value={replicas}
                onChange={(e) => setReplicas(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">CPU Limit</label>
              <input
                type="text"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Memory Limit</label>
              <input
                type="text"
                value={memLimit}
                onChange={(e) => setMemLimit(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Security Toggles */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              CIS Security & Reliability Hardening
            </span>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={runAsNonRoot}
                onChange={(e) => setRunAsNonRoot(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-200">
                <strong>Enforce Non-Root UID (10001)</strong>
                <span className="block text-[11px] text-slate-500">Prevents host kernel takeover</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={readOnlyRoot}
                onChange={(e) => setReadOnlyRoot(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-200">
                <strong>Read-Only Root Filesystem + /tmp tmpfs</strong>
                <span className="block text-[11px] text-slate-500">Blocks in-memory malware write payloads</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dropCaps}
                onChange={(e) => setDropCaps(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-200">
                <strong>Drop All Linux Capabilities (ALL)</strong>
                <span className="block text-[11px] text-slate-500">Disables raw network sockets & root escalation</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeProbes}
                onChange={(e) => setIncludeProbes(e.target.checked)}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-xs text-slate-200">
                <strong>Liveness & Readiness Health Probes</strong>
                <span className="block text-[11px] text-slate-500">Ensures zero-downtime rolling updates</span>
              </span>
            </label>
          </div>
        </div>

        {/* Generated YAML Manifest Output */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
            <span className="font-mono text-xs text-emerald-400 font-bold">
              hardened-deployment.yaml
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Manifest'}
            </button>
          </div>
          <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto flex-1 leading-relaxed">
            {yamlOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
