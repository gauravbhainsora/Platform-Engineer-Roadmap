'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Play,
  Lightbulb,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Server,
  Layers,
  Box,
  FileCode,
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Wrench,
  ShieldCheck,
  RefreshCw,
  Flame,
  Cpu,
} from 'lucide-react';
import { triggerConfetti } from '@/lib/storage';

interface CriterionResult {
  id: string;
  label: string;
  passed: boolean;
  feedback: string;
}

interface LabChallenge {
  id: string;
  pillar: string;
  title: string;
  subtitle: string;
  severity: 'P1 - Critical Outage' | 'High - Security Audit' | 'P2 - Infrastructure Flapping';
  severityColor: string;
  icon: React.ElementType;
  language: 'yaml' | 'dockerfile' | 'hcl';
  starterCode: string;
  incidentSummary: string;
  symptoms: string[];
  rootCauses: string[];
  criteria: Array<{
    id: string;
    label: string;
    hint: string;
    validate: (code: string) => { passed: boolean; feedback: string };
  }>;
  hints: string[];
  modelSolution: string;
  staffEngineeringNotes: string;
}

const LAB_CHALLENGES: LabChallenge[] = [
  {
    id: 'k8s-crashloop',
    pillar: 'Kubernetes & Containers',
    title: 'Fix Kubernetes CrashLoopBackOff & OOMKilled Deployment',
    subtitle: 'Remediate a production checkout-service deployment failing liveness probes and suffocated by memory limits.',
    severity: 'P1 - Critical Outage',
    severityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    icon: Box,
    language: 'yaml',
    incidentSummary:
      'At 02:40 UTC, the checkout-service deployment in production began flapping with continuous CrashLoopBackOff and OOMKilled events. Pods enter an infinite restart cycle, causing 503 errors on the payment gateway.',
    symptoms: [
      'kubelet events report "Liveness probe failed: HTTP probe failed with statuscode: 404".',
      'Kernel cgroup reports "oom-kill:constraint=CONSTRAINT_MEMCG,oom_memcg=/kubepods/burstable/...".',
      'PodSecurity admission controller warns: "runAsUser: 0 violates restricted pod security standards".',
    ],
    rootCauses: [
      'Liveness probe path has a typo (/healtzh instead of /healthz), causing kubelet to terminate the pod after 15s.',
      'Container memory limit is set to an unviable 64Mi; JVM/Node base runtime immediately exceeds the memory ceiling and triggers SIGKILL.',
      'Pod spec runs as root (runAsNonRoot: false, runAsUser: 0), violating enterprise CIS Kubernetes hardening benchmarks.',
    ],
    starterCode: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-service
  namespace: prod
  labels:
    app: checkout-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: checkout-service
  template:
    metadata:
      labels:
        app: checkout-service
    spec:
      securityContext:
        # BUG 1: Security violation - running as root
        runAsNonRoot: false
        runAsUser: 0
      containers:
      - name: web
        image: registry.internal/checkout-api:v2.4.1
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            # BUG 2: Pods getting OOMKilled - only 64Mi allocated!
            memory: 64Mi
        livenessProbe:
          httpGet:
            # BUG 3: Typo in probe endpoint causes 404 failure loop
            path: /healtzh
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`,
    criteria: [
      {
        id: 'probe-fix',
        label: 'Fix liveness probe endpoint from /healtzh to /healthz',
        hint: 'Inspect livenessProbe.httpGet.path and correct the spelling to /healthz or /health.',
        validate: (code: string) => {
          if (code.includes('/healtzh')) {
            return {
              passed: false,
              feedback: 'Liveness probe path still has typo "/healtzh". Change it to "/healthz".',
            };
          }
          const hasValidPath = /path:\s*["']?\/(healthz|health)["']?/.test(code);
          if (!hasValidPath) {
            return {
              passed: false,
              feedback: 'Liveness probe must point to a valid endpoint like "/healthz".',
            };
          }
          return {
            passed: true,
            feedback: 'Liveness probe endpoint correctly targets /healthz.',
          };
        },
      },
      {
        id: 'memory-fix',
        label: 'Increase container memory limits to prevent OOMKilled crashes (>= 256Mi or 512Mi)',
        hint: 'Update resources.limits.memory to 512Mi or 1Gi (must be >= 256Mi).',
        validate: (code: string) => {
          const limitSection = code.match(/limits:[\s\S]*?memory:\s*["']?([0-9]+)([a-zA-Z]+)["']?/);
          if (!limitSection) {
            return {
              passed: false,
              feedback: 'resources.limits.memory is missing or unparseable.',
            };
          }
          const val = parseInt(limitSection[1], 10);
          const unit = limitSection[2].toLowerCase();

          if (unit.startsWith('m') && val < 256) {
            return {
              passed: false,
              feedback: `Memory limit is currently ${limitSection[1]}${limitSection[2]}, which is too low to prevent OOMKill. Set to at least 256Mi or 512Mi.`,
            };
          }
          return {
            passed: true,
            feedback: `Memory limit increased to ${limitSection[1]}${limitSection[2]} (safely resolves OOMKills).`,
          };
        },
      },
      {
        id: 'security-fix',
        label: 'Harden securityContext (runAsNonRoot: true with non-zero UID)',
        hint: 'Set runAsNonRoot: true and update runAsUser: 0 to a non-privileged UID like 10001.',
        validate: (code: string) => {
          const hasRunAsNonRootTrue = /runasnonroot:\s*true/i.test(code);
          const hasRunAsRootFalse = /runasnonroot:\s*false/i.test(code);
          const hasRunAsUserZero = /runasuser:\s*0\b/i.test(code);

          if (hasRunAsRootFalse) {
            return {
              passed: false,
              feedback: 'securityContext still has "runAsNonRoot: false". Change it to "true".',
            };
          }
          if (hasRunAsUserZero) {
            return {
              passed: false,
              feedback: 'securityContext still sets "runAsUser: 0" (root user). Use non-root UID e.g. 10001.',
            };
          }
          if (!hasRunAsNonRootTrue) {
            return {
              passed: false,
              feedback: 'Ensure "runAsNonRoot: true" is explicitly declared in securityContext.',
            };
          }
          return {
            passed: true,
            feedback: 'Pod securityContext properly enforces non-root container execution.',
          };
        },
      },
    ],
    hints: [
      'Examine line 46 under livenessProbe.httpGet: notice the typo "/healtzh" instead of "/healthz".',
      'Under resources.limits: 64Mi is suffocating. Change it to 512Mi or 1Gi.',
      'In template.spec.securityContext: flip "runAsNonRoot: false" to "true", and change "runAsUser: 0" to "10001".',
    ],
    modelSolution: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-service
  namespace: prod
  labels:
    app: checkout-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: checkout-service
  template:
    metadata:
      labels:
        app: checkout-service
    spec:
      securityContext:
        # Remediated: Non-root execution with dedicated unprivileged UID
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
      containers:
      - name: web
        image: registry.internal/checkout-api:v2.4.1
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            # Remediated: Increased memory ceiling to 512Mi to prevent OOMKill
            memory: 512Mi
        livenessProbe:
          httpGet:
            # Remediated: Corrected health probe route
            path: /healthz
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`,
    staffEngineeringNotes:
      'In production, liveness probes must test lightweight liveness without touching downstream databases. Always set memory requests to the 80th percentile baseline and limits to allow burst capacity without triggering kernel cgroup OOM reaper. PodSecurity standards require runAsNonRoot: true across all namespace workloads.',
  },
  {
    id: 'docker-multistage',
    pillar: 'Containers & Security',
    title: 'Multi-Stage Secure Distroless Dockerfile',
    subtitle: 'Shrink a bloated 1.2GB Debian image into a secure <35MB distroless/alpine container running as non-root.',
    severity: 'High - Security Audit',
    severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: Flame,
    language: 'dockerfile',
    incidentSummary:
      'A container security scan flagged the auth-gateway service. The image size is 1.2GB, includes the entire Go compiler, package managers, and development build tools in production, and runs as root UID 0.',
    symptoms: [
      'Image takes 4 minutes to pull across worker nodes during autoscaling scale-outs.',
      'Trivy and Clair vulnerability scans detect 420+ CVEs from unused Debian packages.',
      'Container executes with root privilege, failing SOC2 compliance checks.',
    ],
    rootCauses: [
      'Single-stage build incorporates the full golang:1.22-bookworm build toolchain into the final image.',
      'Source files copied before go mod download, invalidating the Docker layer cache on every commit.',
      'No non-root user specified; the binary executes with unrestricted root capabilities.',
    ],
    starterCode: `# BLOATED SINGLE-STAGE BUILD: 1.2GB Image
FROM golang:1.22-bookworm

WORKDIR /app

# Inefficient: installs full dev toolchain and keeps apt caches
RUN apt-get update && apt-get install -y git curl gcc make build-essential

# Inefficient caching: copies everything before downloading dependencies
COPY . .

RUN go mod download
RUN CGO_ENABLED=0 go build -o /app/auth-service ./cmd/main.go

# INSECURE: Runs as root (default in golang base image)
# No USER directive!

EXPOSE 8080
ENTRYPOINT ["/app/auth-service"]`,
    criteria: [
      {
        id: 'multistage-arch',
        label: 'Implement multi-stage build (builder stage + minimal distroless/alpine runtime)',
        hint: 'Use "FROM golang:... AS builder" and a second stage with "FROM gcr.io/distroless/static:nonroot" or "FROM alpine:3.19".',
        validate: (code: string) => {
          const fromMatches = code.match(/^FROM\s+[^\n]+/gim);
          if (!fromMatches || fromMatches.length < 2) {
            return {
              passed: false,
              feedback: 'Requires at least two FROM stages (e.g. FROM ... AS builder and a final minimal FROM stage).',
            };
          }
          const lastFrom = fromMatches[fromMatches.length - 1];
          const hasMinimal = /(distroless|alpine|scratch)/i.test(lastFrom);
          if (!hasMinimal) {
            return {
              passed: false,
              feedback: 'The final runtime stage should use a minimal image like "gcr.io/distroless/static-debian12:nonroot" or "alpine:3.19".',
            };
          }
          return {
            passed: true,
            feedback: `Multi-stage build configured with ${fromMatches.length} stages and minimal runtime base.`,
          };
        },
      },
      {
        id: 'layer-caching',
        label: 'Optimize layer caching (copy go.mod & go.sum before go mod download)',
        hint: 'Copy go.mod / go.sum first, run go mod download, then copy remaining source code.',
        validate: (code: string) => {
          const hasGoModCopy = /copy\s+go\.mod/i.test(code);
          const hasModDownload = /go\s+mod\s+download/i.test(code);
          const modCopyIdx = code.toLowerCase().indexOf('go.mod');
          const modDownloadIdx = code.toLowerCase().indexOf('go mod download');

          if (!hasGoModCopy || !hasModDownload || modCopyIdx > modDownloadIdx) {
            return {
              passed: false,
              feedback: 'Copy "go.mod" (and go.sum) before running "go mod download" to preserve Docker layer caching.',
            };
          }
          return {
            passed: true,
            feedback: 'Layer caching optimized: dependency manifests copied before dependency resolution.',
          };
        },
      },
      {
        id: 'copy-artifact',
        label: 'Extract compiled binary from builder via COPY --from=builder',
        hint: 'In the final stage, use "COPY --from=builder /app/auth-service /app/auth-service" or similar path.',
        validate: (code: string) => {
          const hasCopyFrom = /copy\s+--from=(builder|build|\d+)/i.test(code);
          const hasBinary = /auth-service/i.test(code);
          if (!hasCopyFrom || !hasBinary) {
            return {
              passed: false,
              feedback: 'The final stage must extract only the binary using "COPY --from=builder ... auth-service ...".',
            };
          }
          return {
            passed: true,
            feedback: 'Binary cleanly extracted from builder stage without bundling compiler tools.',
          };
        },
      },
      {
        id: 'non-root-user',
        label: 'Enforce non-root execution (USER nonroot or non-root UID)',
        hint: 'Specify a non-root user via "USER 65532:65532", "USER nonroot", or use a distroless :nonroot image tag.',
        validate: (code: string) => {
          const hasUserDirective = /user\s+(nonroot|[1-9][0-9]*|appuser|nobody)/i.test(code);
          const hasNonrootDistroless = /distroless\/[^\s]+:nonroot/i.test(code);
          if (!hasUserDirective && !hasNonrootDistroless) {
            return {
              passed: false,
              feedback: 'Enforce non-root execution with "USER 65532:65532" or by using a ":nonroot" distroless image.',
            };
          }
          return {
            passed: true,
            feedback: 'Container configured to execute as non-privileged non-root user.',
          };
        },
      },
    ],
    hints: [
      'Define stage 1: "FROM golang:1.22-alpine AS builder", set WORKDIR /app, copy go.mod & go.sum, then RUN go mod download.',
      'Compile static binary: "RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/auth-service ./cmd/main.go".',
      'Define stage 2: "FROM gcr.io/distroless/static-debian12:nonroot", then "COPY --from=builder /app/auth-service /auth-service".',
    ],
    modelSolution: `# Stage 1: Build & Compile
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Optimize layer caching: download dependencies before copying source
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build static binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/auth-service ./cmd/main.go

# Stage 2: Minimal Distroless Runtime (<25MB)
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app

# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /app/auth-service /app/auth-service

# Expose port and run as non-root user (UID 65532 is default in distroless:nonroot)
USER 65532:65532
EXPOSE 8080

ENTRYPOINT ["/app/auth-service"]`,
    staffEngineeringNotes:
      'Multi-stage builds eliminate CVE surface area by removing shells, package managers, and compilers from production. Linking statically with CGO_ENABLED=0 allows deployment to distroless/static or scratch images, shrinking image size from 1.2GB down to 18MB and speeding cold pull times from 4 minutes to 3 seconds.',
  },
  {
    id: 'terraform-drift',
    pillar: 'IaC & Automation',
    title: 'Terraform State Locking & Resource Drift Remediation',
    subtitle: 'Eliminate state locking collisions and prevent autoscaling drift flapping on production AWS resources.',
    severity: 'P2 - Infrastructure Flapping',
    severityColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    icon: Server,
    language: 'hcl',
    incidentSummary:
      'The platform CI/CD pipeline suffers from state locking errors when parallel jobs run. Additionally, every terraform apply resets the ECS worker desired_count and threatens accidental deletion of the production database.',
    symptoms: [
      'Concurrent CI/CD pipelines fail with state lock contention or risk overwriting state files.',
      'AWS Application Auto Scaling scales ECS tasks to 16, but subsequent terraform apply resets desired_count back to 4.',
      'A pull request with a changed database parameter threatened to destroy and recreate the primary Postgres database.',
    ],
    rootCauses: [
      'S3 backend lacks DynamoDB state locking table configuration and server-side encryption.',
      'The aws_ecs_service resource has no lifecycle { ignore_changes = [desired_count] } block to accommodate external autoscalers.',
      'The aws_db_instance resource is missing lifecycle { prevent_destroy = true }, leaving production data vulnerable to accidental deletion.',
    ],
    starterCode: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "corp-platform-tfstate-prod"
    key    = "production/databases/terraform.tfstate"
    region = "us-east-1"
    # BUG 1: Missing state locking table & encryption!
    # Concurrent CI runs can corrupt or overwrite state simultaneously.
  }
}

resource "aws_db_instance" "production_postgres" {
  identifier           = "prod-core-db"
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.xlarge"
  username             = "platform_admin"
  password             = "change-me-via-secretsmanager"
  skip_final_snapshot  = false

  # BUG 2: Missing lifecycle protection against accidental destruction
}

resource "aws_ecs_service" "checkout_workers" {
  name            = "checkout-worker"
  cluster         = "prod-cluster"
  task_definition = "arn:aws:ecs:us-east-1:123456789012:task-definition/checkout:14"
  desired_count   = 4

  # BUG 3: An external Application Auto Scaling policy manages desired_count.
  # Every terraform apply resets desired_count to 4, destroying autoscale state!
}`,
    criteria: [
      {
        id: 's3-backend-locking',
        label: 'Configure S3 backend distributed locking (dynamodb_table) and encryption (encrypt = true)',
        hint: 'In backend "s3", add dynamodb_table = "terraform-locks" and encrypt = true.',
        validate: (code: string) => {
          const hasDynamo = /dynamodb_table\s*=\s*["'][^"']+["']/.test(code);
          const hasEncrypt = /encrypt\s*=\s*true/.test(code);

          if (!hasDynamo) {
            return {
              passed: false,
              feedback: 'backend "s3" is missing "dynamodb_table = \\"terraform-locks\\"" for distributed state locking.',
            };
          }
          if (!hasEncrypt) {
            return {
              passed: false,
              feedback: 'backend "s3" should declare "encrypt = true" to enforce server-side state encryption.',
            };
          }
          return {
            passed: true,
            feedback: 'S3 backend configured with DynamoDB state locking and server-side encryption.',
          };
        },
      },
      {
        id: 'ecs-ignore-changes',
        label: 'Add lifecycle ignore_changes = [desired_count] to aws_ecs_service',
        hint: 'Inside aws_ecs_service, add lifecycle { ignore_changes = [desired_count] }.',
        validate: (code: string) => {
          const ecsBlock = code.match(/resource\s+["']aws_ecs_service["'][\s\S]*?(?=\nresource|\z)/);
          if (!ecsBlock) {
            return {
              passed: false,
              feedback: 'Resource "aws_ecs_service" not found.',
            };
          }
          const content = ecsBlock[0];
          const hasLifecycle = /lifecycle\s*\{/.test(content);
          const hasIgnore = /ignore_changes\s*=\s*\[[\s\S]*?desired_count[\s\S]*?\]/.test(content);

          if (!hasLifecycle || !hasIgnore) {
            return {
              passed: false,
              feedback: 'aws_ecs_service requires "lifecycle { ignore_changes = [desired_count] }" to prevent overwriting autoscaler state.',
            };
          }
          return {
            passed: true,
            feedback: 'Lifecycle ignore_changes applied to aws_ecs_service desired_count.',
          };
        },
      },
      {
        id: 'db-prevent-destroy',
        label: 'Guard production database with lifecycle prevent_destroy = true',
        hint: 'Inside aws_db_instance, add lifecycle { prevent_destroy = true }.',
        validate: (code: string) => {
          const dbBlock = code.match(/resource\s+["']aws_db_instance["'][\s\S]*?(?=\nresource|\z)/);
          if (!dbBlock) {
            return {
              passed: false,
              feedback: 'Resource "aws_db_instance" not found.',
            };
          }
          const content = dbBlock[0];
          const hasPrevent = /lifecycle\s*\{[\s\S]*?prevent_destroy\s*=\s*true[\s\S]*?\}/.test(content);

          if (!hasPrevent) {
            return {
              passed: false,
              feedback: 'aws_db_instance requires "lifecycle { prevent_destroy = true }" to safeguard against accidental teardowns.',
            };
          }
          return {
            passed: true,
            feedback: 'Production database guarded against accidental deletion with prevent_destroy = true.',
          };
        },
      },
    ],
    hints: [
      'In backend "s3", add: dynamodb_table = "terraform-locks" and encrypt = true.',
      'In aws_db_instance "production_postgres", add a lifecycle block: lifecycle { prevent_destroy = true }.',
      'In aws_ecs_service "checkout_workers", add: lifecycle { ignore_changes = [desired_count] }.',
    ],
    modelSolution: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "corp-platform-tfstate-prod"
    key            = "production/databases/terraform.tfstate"
    region         = "us-east-1"
    # Remediated: Distributed locking and encryption
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

resource "aws_db_instance" "production_postgres" {
  identifier           = "prod-core-db"
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.xlarge"
  username             = "platform_admin"
  password             = "change-me-via-secretsmanager"
  skip_final_snapshot  = false

  # Remediated: Safeguard against accidental destruction
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecs_service" "checkout_workers" {
  name            = "checkout-worker"
  cluster         = "prod-cluster"
  task_definition = "arn:aws:ecs:us-east-1:123456789012:task-definition/checkout:14"
  desired_count   = 4

  # Remediated: Prevent drift flapping with Application Auto Scaling
  lifecycle {
    ignore_changes = [
      desired_count,
    ]
  }
}`,
    staffEngineeringNotes:
      'Terraform state locking with DynamoDB ensures atomicity across CI/CD workers. When using dynamic autoscaling (ECS AutoScaling, Kubernetes HPA, or AWS AutoScaling Groups), ignore_changes prevents Terraform from resetting dynamic replica counts. Combining prevent_destroy on stateful databases provides crucial defense-in-depth against disastrous CI plan mistakes.',
  },
];

const LAB_PROGRESS_KEY = 'platform_roadmap_labs_v1';

export default function HandsOnLabs() {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const activeChallenge = LAB_CHALLENGES[activeChallengeIndex];

  // Code state per challenge
  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    LAB_CHALLENGES.forEach((c) => {
      initial[c.id] = c.starterCode;
    });
    return initial;
  });

  // Solved challenges saved in localStorage
  const [solvedLabs, setSolvedLabs] = useState<Record<string, boolean>>({});

  // Validation output results
  const [results, setResults] = useState<CriterionResult[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // UI helpers
  const [hintIndex, setHintIndex] = useState(0);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(LAB_PROGRESS_KEY);
      if (saved) {
        setSolvedLabs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading lab progress', e);
    }
  }, []);

  // Save progress helper
  const markLabCompleted = (labId: string) => {
    const updated = { ...solvedLabs, [labId]: true };
    setSolvedLabs(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LAB_PROGRESS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving lab progress', e);
      }
    }
  };

  // Reset results when switching tabs
  const handleSelectChallenge = (index: number) => {
    setActiveChallengeIndex(index);
    setResults([]);
    setHasValidated(false);
    setShowModelSolution(false);
    setHintIndex(0);
  };

  const currentCode = userCodes[activeChallenge.id] || activeChallenge.starterCode;

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserCodes((prev) => ({
      ...prev,
      [activeChallenge.id]: e.target.value,
    }));
    setHasValidated(false);
  };

  // Tab key indenter support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const original = textarea.value;

      const updated = original.substring(0, start) + '  ' + original.substring(end);
      setUserCodes((prev) => ({
        ...prev,
        [activeChallenge.id]: updated,
      }));

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this challenge back to original buggy code?')) {
      setUserCodes((prev) => ({
        ...prev,
        [activeChallenge.id]: activeChallenge.starterCode,
      }));
      setResults([]);
      setHasValidated(false);
      setShowModelSolution(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyModelSolution = () => {
    setUserCodes((prev) => ({
      ...prev,
      [activeChallenge.id]: activeChallenge.modelSolution,
    }));
    setHasValidated(false);
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      const evaluation = activeChallenge.criteria.map((c) => {
        const check = c.validate(currentCode);
        return {
          id: c.id,
          label: c.label,
          passed: check.passed,
          feedback: check.feedback,
        };
      });

      setResults(evaluation);
      setHasValidated(true);
      setIsValidating(false);

      const allPassed = evaluation.every((e) => e.passed);
      if (allPassed) {
        triggerConfetti();
        markLabCompleted(activeChallenge.id);
      }
    }, 350);
  };

  const allPassed = hasValidated && results.length > 0 && results.every((r) => r.passed);
  const totalSolved = Object.values(solvedLabs).filter(Boolean).length;
  const progressPercent = Math.round((totalSolved / LAB_CHALLENGES.length) * 100);

  // Line numbers calculation
  const lineCount = currentCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c121e] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono font-semibold text-sky-400 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Interactive Incident Labs</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production Scenario Labs
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Solve real-world platform engineering outages: debug Kubernetes CrashLoopBackOff YAML, craft multi-stage distroless Dockerfiles, and remediate Terraform resource drift.
            </p>
          </div>

          {/* Progress Card */}
          <div className="flex-shrink-0 rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Labs Completed</span>
              <span className="font-mono font-bold text-emerald-400">
                {totalSolved} / {LAB_CHALLENGES.length}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{progressPercent}% Solved</span>
              {totalSolved === LAB_CHALLENGES.length && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Award className="h-3 w-3" /> Certified!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Challenge Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-6">
          {LAB_CHALLENGES.map((challenge, idx) => {
            const Icon = challenge.icon;
            const isSolved = solvedLabs[challenge.id];
            const isActive = activeChallengeIndex === idx;

            return (
              <button
                key={challenge.id}
                onClick={() => handleSelectChallenge(idx)}
                className={`group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                    : 'border border-slate-850 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                <span>Lab {idx + 1}: {challenge.title.split(' ')[1] || challenge.title}</span>
                {isSolved ? (
                  <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-emerald-950' : 'text-emerald-400'}`} />
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-slate-950' : 'bg-slate-600 group-hover:bg-slate-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Scenario Details & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Incident Description & Criteria */}
        <div className="lg:col-span-5 space-y-6">
          {/* Incident Overview Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono font-semibold ${activeChallenge.severityColor}`}>
                <ShieldAlert className="h-3 w-3" />
                {activeChallenge.severity}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {activeChallenge.pillar}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{activeChallenge.title}</h2>
              <p className="mt-1 text-xs text-slate-400">{activeChallenge.subtitle}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300 leading-relaxed font-mono">
              <span className="text-rose-400 font-semibold block mb-1">INCIDENT ALERT:</span>
              {activeChallenge.incidentSummary}
            </div>

            {/* Symptoms & Root Causes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Telemetry & Symptoms
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeChallenge.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-sky-400" />
                Root Causes to Remediate
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeChallenge.rootCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Checklist Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Remediation Criteria ({activeChallenge.criteria.length})
              </span>
              {hasValidated && (
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                    allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {allPassed ? 'ALL PASSED' : 'ACTION REQUIRED'}
                </span>
              )}
            </h3>

            <div className="space-y-2.5">
              {activeChallenge.criteria.map((crit) => {
                const result = results.find((r) => r.id === crit.id);
                return (
                  <div
                    key={crit.id}
                    className={`rounded-xl border p-3 transition-all ${
                      result
                        ? result.passed
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-200'
                          : 'border-rose-500/40 bg-rose-950/20 text-slate-200'
                        : 'border-slate-800 bg-slate-950/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {result ? (
                        result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        )
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-xs">
                        <span className="font-medium">{crit.label}</span>
                        {result && (
                          <p
                            className={`mt-1 font-mono text-[11px] ${
                              result.passed ? 'text-emerald-400' : 'text-rose-300'
                            }`}
                          >
                            {result.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progressive Hint Drawer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                Staff Hints ({hintIndex} / {activeChallenge.hints.length})
              </span>
              {hintIndex < activeChallenge.hints.length && (
                <button
                  onClick={() => setHintIndex((h) => Math.min(h + 1, activeChallenge.hints.length))}
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Reveal Hint {hintIndex + 1}
                </button>
              )}
            </div>

            {hintIndex > 0 ? (
              <div className="space-y-2">
                {activeChallenge.hints.slice(0, hintIndex).map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 font-mono"
                  >
                    <span className="font-bold text-amber-400 mr-2">Hint #{i + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Stuck on a rule? Click &quot;Reveal Hint&quot; to inspect step-by-step guidance.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Action Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-sky-400" />
                  {activeChallenge.id === 'k8s-crashloop'
                    ? 'deployment.yaml'
                    : activeChallenge.id === 'docker-multistage'
                    ? 'Dockerfile'
                    : 'main.tf'}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                  {activeChallenge.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 transition"
                  title="Copy code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-850 transition"
                  title="Reset to starter code"
                >
                  <RotateCcw className="h-3 w-3 text-slate-400" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setShowModelSolution((prev) => !prev)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] transition ${
                    showModelSolution
                      ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle model reference solution"
                >
                  {showModelSolution ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      <span>Hide Solution</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Model Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Model Solution Comparison Banner */}
            {showModelSolution && (
              <div className="border-b border-indigo-500/30 bg-indigo-950/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    Staff Engineer Model Solution
                  </span>
                  <button
                    onClick={handleApplyModelSolution}
                    className="text-xs font-mono font-semibold text-sky-400 hover:text-sky-300 bg-slate-900 border border-sky-500/40 rounded px-2.5 py-1"
                  >
                    Apply into Editor
                  </button>
                </div>
                <pre className="max-h-60 overflow-y-auto rounded-lg bg-slate-950 p-3 text-[11px] font-mono text-indigo-200 border border-indigo-500/20">
                  {activeChallenge.modelSolution}
                </pre>
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  <strong className="text-indigo-300">Staff Architecture Rationale: </strong>
                  {activeChallenge.staffEngineeringNotes}
                </p>
              </div>
            )}

            {/* Code Editor Body with Line Numbers */}
            <div className="relative flex min-h-[460px] bg-[#090d16] font-mono text-xs leading-relaxed">
              {/* Line Numbers Column */}
              <div
                aria-hidden="true"
                className="select-none py-4 px-3 text-right text-slate-600 bg-slate-950/60 border-r border-slate-850 font-mono text-xs"
                style={{ minWidth: '3.5rem' }}
              >
                {lineNumbers.map((num) => (
                  <div key={num} className="leading-6">
                    {num}
                  </div>
                ))}
              </div>

              {/* Editable Textarea */}
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="w-full h-full min-h-[460px] resize-none bg-transparent p-4 font-mono text-xs leading-6 text-slate-100 placeholder-slate-600 focus:outline-none selection:bg-sky-500/30 selection:text-white"
                />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="h-4 w-4 text-sky-400" />
                <span>Press &quot;Validate Solution&quot; to test against automated SRE linters.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-lg ${
                    isValidating
                      ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      : allPassed
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:opacity-95 shadow-sky-500/25'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating Rules...</span>
                    </>
                  ) : allPassed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Passed! Run Again</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Validate Solution</span>
                    </>
                  )}
                </button>

                {allPassed && activeChallengeIndex < LAB_CHALLENGES.length - 1 && (
                  <button
                    onClick={() => handleSelectChallenge(activeChallengeIndex + 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-sky-300 hover:bg-sky-500/30 transition"
                  >
                    <span>Next Lab</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Validation Status Banner */}
          {hasValidated && (
            <div
              className={`rounded-2xl border p-5 transition-all ${
                allPassed
                  ? 'border-emerald-500/40 bg-emerald-950/30'
                  : 'border-rose-500/40 bg-rose-950/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {allPassed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-sm font-bold ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {allPassed
                      ? 'Congratulations! Production Incident Remediated!'
                      : 'Validation Failed: Criteria Not Met'}
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {allPassed
                      ? 'All automated linters and security checks passed. Pods will now safely deploy, run as unprivileged users, and prevent cascading cluster outages.'
                      : 'Review the failing checklist criteria on the left column, refine your code, and run validation again.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
