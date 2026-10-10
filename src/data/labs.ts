import type React from 'react';
import { Box, Flame, Server } from 'lucide-react';

export interface LabCriterionValidationResult {
  passed: boolean;
  feedback: string;
}

export interface LabCriterion {
  id: string;
  label: string;
  hint: string;
  validate: (code: string) => LabCriterionValidationResult;
}

export interface CriterionResult {
  id: string;
  label: string;
  passed: boolean;
  feedback: string;
}

export type LabCriterionResult = CriterionResult;

export interface LabValidationResult {
  challengeId: string;
  passed: boolean;
  allPassed: boolean;
  results: CriterionResult[];
}

export interface LabProgress {
  [challengeId: string]: boolean;
}

export interface LabChallenge {
  id: string;
  shortTitle: string;
  title: string;
  pillar: string;
  scenario: string;
  incidentSummary: string; // alias for scenario
  subtitle: string;
  severity: 'P1 - Critical Outage' | 'High - Security Audit' | 'P2 - Infrastructure Flapping' | string;
  severityColor: string;
  icon?: React.ElementType;
  language: 'yaml' | 'dockerfile' | 'hcl';
  filename: string;
  starterCode: string;
  initialCode: string; // alias for starterCode
  symptoms: string[];
  rootCauses: string[];
  criteria: LabCriterion[];
  hints: string[];
  modelSolution: string;
  solution: string; // alias for modelSolution
  staffEngineeringNotes: string;
}

export const LAB_PROGRESS_KEY = 'platform_roadmap_labs_v1';

export const LAB_CHALLENGES: LabChallenge[] = [
  {
    id: 'k8s-crashloop',
    shortTitle: '1. Fix K8s CrashLoopBackOff',
    pillar: 'Kubernetes & Containers',
    title: 'Fix Kubernetes CrashLoopBackOff & OOMKilled Deployment',
    subtitle: 'Remediate a production checkout-service deployment failing liveness probes and suffocated by memory limits.',
    severity: 'P1 - Critical Outage',
    severityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    icon: Box,
    language: 'yaml',
    filename: 'deployment.yaml',
    incidentSummary:
      'At 02:40 UTC, the checkout-service deployment in production began flapping with continuous CrashLoopBackOff and OOMKilled events. Pods enter an infinite restart cycle, causing 503 errors on the payment gateway.',
    scenario:
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
    initialCode: `apiVersion: apps/v1
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

          let megabytes = 0;
          if (unit.startsWith('g')) megabytes = val * 1024;
          else if (unit.startsWith('m')) megabytes = val;
          else if (unit.startsWith('k')) megabytes = val / 1024;

          if (megabytes < 256) {
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
          const hasRunAsUserZero = /runasuser:\s*["']?0\b["']?/i.test(code);

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
    solution: `apiVersion: apps/v1
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
    shortTitle: '2. Multi-Stage Dockerfile',
    pillar: 'Containers & Security',
    title: 'Multi-Stage Secure Distroless Dockerfile',
    subtitle: 'Shrink a bloated 1.2GB Debian image into a secure <35MB distroless/alpine container running as non-root.',
    severity: 'High - Security Audit',
    severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    icon: Flame,
    language: 'dockerfile',
    filename: 'Dockerfile',
    incidentSummary:
      'Container vulnerability scanners flagged 34 Critical/High CVEs in production auth-service. Image size is 1.2GB, includes gcc and curl, and executes as root UID 0.',
    scenario:
      'Container vulnerability scanners flagged 34 Critical/High CVEs in production auth-service. Image size is 1.2GB, includes gcc and curl, and executes as root UID 0.',
    symptoms: [
      'Trivy and Clair scans block deployment: "CRITICAL: gcc, apt, and systemd vulnerabilities found in runtime image".',
      'Deployment pull times across cluster take 45+ seconds due to 1.2GB layer downloads.',
      'Runtime executes as root (UID 0), failing PCI-DSS compliance audits.',
    ],
    rootCauses: [
      'Single-stage build: entire Go toolchain, OS compilers, and build dependencies are shipped into the production container.',
      'Sub-optimal layer caching: "COPY . ." precedes "RUN go mod download", invalidating dependency caches on every line change.',
      'No USER instruction: defaults to root user execution.',
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
    initialCode: `# BLOATED SINGLE-STAGE BUILD: 1.2GB Image
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
          const fromMatches = code.match(/^\s*FROM\s+[^\n]+/gim);
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
    solution: `# Stage 1: Build & Compile
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
      'Distroless containers strip package managers, shells, and system utilities, eliminating 95%+ of typical CVE blast radius. Multi-stage builds decouple compiler toolchains from production images. Ordering COPY manifests before source preserves Docker layer cache hit rates during CI runs.',
  },
  {
    id: 'terraform-drift',
    shortTitle: '3. Terraform State Drift',
    pillar: 'IaC & Automation',
    title: 'Terraform State Locking & Resource Drift Remediation',
    subtitle: 'Eliminate state locking collisions and prevent autoscaling drift flapping on production AWS resources.',
    severity: 'P2 - Infrastructure Flapping',
    severityColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    icon: Server,
    language: 'hcl',
    filename: 'main.tf',
    incidentSummary:
      'The platform CI/CD pipeline suffers from state locking errors when parallel jobs run. Additionally, every terraform apply resets the ECS worker desired_count and threatens accidental deletion of the production database.',
    scenario:
      'The platform CI/CD pipeline suffers from state locking errors when parallel jobs run. Additionally, every terraform apply resets the ECS worker desired_count and threatens accidental deletion of the production database.',
    symptoms: [
      'Concurrent CI/CD pipelines fail with state lock contention or risk overwriting state files.',
      'AWS Application Auto Scaling scales ECS tasks to 16, but subsequent terraform apply resets desired_count back to 4.',
      'A pull request with a changed database parameter threatened to destroy and recreate the primary Postgres database.',
    ],
    rootCauses: [
      'S3 remote backend lacks dynamodb_table configuration for distributed state locking and encrypt = true for state file encryption at rest.',
      'aws_ecs_service lacks lifecycle { ignore_changes = [desired_count] }, causing Terraform to fight the AWS Application AutoScaling service.',
      'aws_db_instance lacks lifecycle { prevent_destroy = true }, leaving production databases vulnerable to accidental teardown.',
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
    initialCode: `terraform {
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
          const ecsBlock = code.match(/resource\s+["']aws_ecs_service["'][\s\S]*?(?=\n\s*resource|$)/);
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
          const dbBlock = code.match(/resource\s+["']aws_db_instance["'][\s\S]*?(?=\n\s*resource|$)/);
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
    solution: `terraform {
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

export function getAllLabChallenges(): LabChallenge[] {
  return LAB_CHALLENGES;
}

export function getLabChallengeById(id: string): LabChallenge | undefined {
  return LAB_CHALLENGES.find((c) => c.id === id);
}

export function validateLabChallenge(
  challengeOrId: string | LabChallenge,
  code: string
): LabValidationResult {
  const challenge =
    typeof challengeOrId === 'string'
      ? getLabChallengeById(challengeOrId)
      : challengeOrId;

  if (!challenge) {
    const id = typeof challengeOrId === 'string' ? challengeOrId : 'unknown';
    return {
      challengeId: id,
      passed: false,
      allPassed: false,
      results: [
        {
          id: 'unknown-challenge',
          label: 'Challenge existence',
          passed: false,
          feedback: `Lab challenge "${id}" not found.`,
        },
      ],
    };
  }

  const results: CriterionResult[] = challenge.criteria.map((c) => {
    const outcome = c.validate(code);
    return {
      id: c.id,
      label: c.label,
      passed: outcome.passed,
      feedback: outcome.feedback,
    };
  });

  const passed = results.length > 0 && results.every((r) => r.passed);

  return {
    challengeId: challenge.id,
    passed,
    allPassed: passed,
    results,
  };
}
