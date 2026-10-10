'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCw,
  Check,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Award,
  Layers,
} from 'lucide-react';
import { PILLARS } from '@/data';
import { PillarId } from '@/types';

interface FlashcardItem {
  id: string;
  pillarId: PillarId;
  question: string;
  answer: string;
  category: string;
  tip: string;
}

const FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    pillarId: 'networking',
    category: 'DNS / Kubernetes',
    question: 'What is the ndots:5 default setting in Kubernetes and why can it overload CoreDNS?',
    answer: 'In Kubernetes pods, /etc/resolv.conf sets ndots:5 by default. Any hostname with fewer than 5 dots (e.g. api.stripe.com, which has 2) is queried against internal search domains first (e.g. api.stripe.com.default.svc.cluster.local). This causes up to 4 failed internal DNS queries before resolving externally, surging CoreDNS traffic 4x.',
    tip: 'Resolution: Add a trailing dot (api.stripe.com.) or tune pod dnsConfig with ndots:2.',
  },
  {
    id: 'fc-2',
    pillarId: 'observability',
    category: 'Google SRE',
    question: 'What are the Google SRE Four Golden Signals, and why must failed request latency be measured separately?',
    answer: 'The 4 Golden Signals are Latency, Traffic, Errors, and Saturation. Failed requests must be measured separately because errors often fail fast (e.g. HTTP 500 in 2ms when DB drops connection), which artificially lowers average latency and masks that healthy requests are suffering extreme delays.',
    tip: 'Always track p95 and p99 percentiles instead of mathematical averages.',
  },
  {
    id: 'fc-3',
    pillarId: 'containers',
    category: 'Kernel Primitives',
    question: 'What is the fundamental difference between Linux Namespaces and Control Groups (cgroups)?',
    answer: 'Namespaces isolate what a process can SEE (PID, Network, Mounts, IPC, UTS). Control groups (cgroups v2) isolate and limit what a process can USE (CPU bandwidth, Memory caps, I/O rates, PID limits). Together with pivot_root and OverlayFS, they create container isolation.',
    tip: 'Exceeding a cgroup memory cap triggers the kernel OOM-killer (Exit 137).',
  },
  {
    id: 'fc-4',
    pillarId: 'networking',
    category: 'Transport Layer',
    question: 'Explain the 3 steps of the TCP connection handshake and what happens during a SYN Flood attack.',
    answer: '1) Client sends SYN (seq=X); 2) Server replies with SYN-ACK (seq=Y, ack=X+1); 3) Client sends ACK. In a SYN flood attack, attackers send millions of SYN packets with spoofed IPs without sending final ACKs, exhausting server Transmission Control Block (TCB) queue memory.',
    tip: 'Mitigate using kernel SYN cookies: net.ipv4.tcp_syncookies = 1.',
  },
  {
    id: 'fc-5',
    pillarId: 'auth',
    category: 'Token Cryptography',
    question: 'Why is RS256 strongly preferred over HS256 for signing JSON Web Tokens in microservice architectures?',
    answer: 'HS256 uses a shared symmetric secret: every service verifying tokens must possess the secret, allowing any compromised service to forge admin tokens. RS256 uses asymmetric cryptography: the Auth server signs with a private key, and all downstream services verify using public keys from the JWKS endpoint.',
    tip: 'Always whitelist algorithms explicitly (algorithms=["RS256"]) to prevent alg: none attacks.',
  },
  {
    id: 'fc-6',
    pillarId: 'cloud',
    category: 'VPC Architecture',
    question: 'Why is AWS VPC Peering considered non-transitive?',
    answer: 'If VPC A is peered with VPC B, and VPC B is peered with VPC C, traffic from VPC A cannot transit through VPC B to reach VPC C. You must either create a direct peering connection between A and C, or deploy an AWS Transit Gateway as a centralized hub-and-spoke router.',
    tip: 'Avoid overlapping CIDR ranges across all VPCs to preserve future Transit Gateway peering.',
  },
  {
    id: 'fc-7',
    pillarId: 'cicd',
    category: 'GitOps Architecture',
    question: 'How does pull-based GitOps (ArgoCD) differ from traditional push-based CI/CD pipelines in security?',
    answer: 'Push-based CI/CD requires storing cluster admin tokens inside external CI servers (like GitHub Actions runners) and opening inbound firewall ports. Pull-based GitOps runs an agent inside the cluster that pulls manifests via read-only Git, requiring zero external credentials or inbound firewall holes.',
    tip: 'GitOps self-healing automatically rolls back unauthorized manual kubectl edits.',
  },
  {
    id: 'fc-8',
    pillarId: 'iac',
    category: 'Terraform State',
    question: 'What is the purpose of distributed state locking in Terraform, and what happens if a CI runner crashes holding a lock?',
    answer: 'State locking (via AWS DynamoDB or Azure Blob lease) prevents concurrent executions from corrupting the terraform.tfstate file simultaneously. If a CI runner crashes abruptly before releasing the lock, subsequent runs fail with "Error acquiring state lock". Operators must manually run terraform force-unlock <LOCK_ID>.',
    tip: 'Always store state remotely in encrypted S3 with DynamoDB locking enabled.',
  },
  {
    id: 'fc-9',
    pillarId: 'linux',
    category: 'Shell Scripting',
    question: 'What does set -euo pipefail accomplish in production Bash scripts?',
    answer: '-e exits immediately if any command returns non-zero; -u treats unset variables as fatal errors (preventing rm -rf /${UNSET}); -o pipefail ensures a pipeline returns the exit status of the first failing command instead of silently returning the final command success.',
    tip: 'Standard defensive baseline required for all container entrypoints and CI scripts.',
  },
  {
    id: 'fc-10',
    pillarId: 'containers',
    category: 'Kubernetes Reliability',
    question: 'What happens if a Kubernetes Deployment lacks a readinessProbe?',
    answer: 'The kubelet immediately adds the pod to the Service endpoint pool the millisecond the container process starts. If the app requires 10-15 seconds to connect to databases, compile caches, or initialize frameworks, incoming users immediately receive HTTP 502/503 errors during rolling updates.',
    tip: 'Readiness probes govern traffic routing; liveness probes govern container restarts.',
  },
  {
    id: 'fc-11',
    pillarId: 'observability',
    category: 'SRE Error Budgets',
    question: 'What is an Error Budget and what engineering policy governs its depletion?',
    answer: 'An Error Budget is 100% - SLO (e.g. 0.1% downtime for a 99.9% availability target). It represents allowable failure. If the budget is positive, teams ship features rapidly. When incidents exhaust the budget, feature releases freeze and sprints pivot exclusively to stability, tests, and resilience hardening.',
    tip: 'Balances product velocity with infrastructure reliability.',
  },
  {
    id: 'fc-12',
    pillarId: 'networking',
    category: 'SSH Security',
    question: 'Why should platform engineers use ProxyJump instead of SSH Agent Forwarding (ssh -A) through bastions?',
    answer: 'SSH Agent Forwarding creates a Unix domain socket on the intermediate bastion server that communicates with your local ssh-agent. Anyone with root privileges on that bastion can access your socket to authenticate as you anywhere on the network. ProxyJump forwards encrypted TCP packets directly without exposing agent sockets.',
    tip: 'Configure ProxyJump in ~/.ssh/config for transparent zero-trust jumping.',
  },
];

export function FlashcardDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [knownCards, setKnownCards] = useState<Record<string, boolean>>({});

  const filteredCards = FLASHCARDS.filter(
    (c) => selectedPillar === 'all' || c.pillarId === selectedPillar
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const markKnown = (known: boolean) => {
    if (!currentCard) return;
    setKnownCards((prev) => ({ ...prev, [currentCard.id]: known }));
    handleNext();
  };

  const knownCount = Object.values(knownCards).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-sky-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Spaced Repetition & Rapid Revision
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Platform Engineer Interview Flashcards
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Flip cards to test core technical mental models before interviews and production on-call shifts.
        </p>
      </div>

      {/* Filter and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedPillar('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedPillar === 'all'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Pillars ({FLASHCARDS.length})
          </button>
          {PILLARS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPillar(p.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                selectedPillar === p.id
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Card {currentIndex + 1} of {filteredCards.length}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{knownCount} Mastered</span>
        </div>
      </div>

      {/* Clean Flippable Card Box */}
      {currentCard && (
        <div className="relative my-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative min-h-[340px] w-full rounded-2xl border cursor-pointer p-8 sm:p-10 shadow-md transition-colors flex flex-col justify-between select-none ${
              isFlipped
                ? 'border-sky-500/30 bg-slate-900 text-slate-100'
                : 'border-slate-800 bg-slate-900/90 text-white hover:border-slate-700'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold uppercase text-sky-400 border border-slate-700">
                  {currentCard.pillarId}
                </span>
                <span className="text-xs text-slate-400">
                  {currentCard.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 text-slate-400" />
                Click to flip
              </span>
            </div>

            {/* Card Center Content */}
            <div className="my-6">
              {!isFlipped ? (
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">
                    Question / Scenario
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.question}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase text-emerald-400 block">
                    Key Architectural Answer
                  </span>
                  <p className="text-base text-slate-200 leading-relaxed font-normal">
                    {currentCard.answer}
                  </p>
                  <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-3.5 text-xs sm:text-sm text-slate-300">
                    💡 <strong className="text-white font-semibold">Pro Tip:</strong> {currentCard.tip}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
              <span>{isFlipped ? 'Showing Answer' : 'Showing Question'}</span>
              <span>Use arrows or buttons below to score</span>
            </div>
          </div>
        </div>
      )}

      {/* Card Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => markKnown(false)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Needs Review
          </button>
          <button
            onClick={() => markKnown(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 hover:bg-emerald-950/40 transition-colors"
          >
            <Check className="h-4 w-4" />
            I Know This ✓
          </button>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
