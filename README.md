# Platform Engineer Roadmap 🚀

An interactive, comprehensive study platform and visual learning roadmap designed for aspiring and practicing **Platform Engineers, SREs, and Cloud Architects**.

Built with modern **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## Beginner-to-expert study plan

Open **Curriculum** (`/topics`) for a six-stage path containing **60 syllabus modules**, prerequisite links, core concepts, advanced details, failure cases, **60 practical labs**, and **six capstones with exit criteria**. All 73 existing technical guides are linked into the path.

Use **Find a study module** to search concepts, advanced details, failure cases, labs, prerequisites, linked guide titles, and reading titles. Filter by stage and open a result to reveal the complete module. Module bookmarks and prerequisite links also open their target automatically. Each technical guide has a sticky section menu for jumping to its available content.

The stages are computing/programming foundations; Linux/network operations; containers/Kubernetes; cloud/IaC/delivery; distributed systems/reliability/security operations; and internal platforms/expert engineering judgment. The path adds Git, programming, SQL, messaging, caches, disaster recovery, operators, multi-tenancy, platform product design, governance, migrations, and explicit specialist extensions.

Download [the complete offline plan](public/platform-engineering-study-plan.txt). Its single content source is `src/data/study-plan.ts`; run `pnpm study-plan:export` after editing the syllabus to regenerate the download. References were reviewed on **2026-10-10**; use documentation matching your installed versions.

Progress and certificates continue to describe the 73 technical guides. Labs, capstones, and expert review are additional evidence; completing a reading checklist does not establish production expertise.

---

## 🌟 Overview & Mindmap Pillars

The curriculum is structured around the **8 foundational pillars** of modern Cloud-Native & Platform Engineering:

```
                          +-------------------------------------------------+
                          |            Platform Engineer Roadmap            |
                          +-------------------------------------------------+
                                                   |
         +-----------------------------------------+-----------------------------------------+
         |                                                                                   |
         v                                                                                   v
  1. Linux Systems                                                            2. Computer Networking
     • User & Group Mgmt, /etc/passwd                                            • DNS Trees, Root Servers, dig
     • Package Managers (apt, dnf, apk)                                          • SSL/TLS, Let's Encrypt, mTLS
     • iproute2, ss, ping, telnet                                                • TCP 3-Way Handshake vs UDP
     • Signals (SIGTERM, SIGKILL), PID 1                                         • CIDR Subnetting & RFC 1918
     • /var/log, journalctl, logrotate                                           • Routers, Switches, NAT Gateways
     • Storage: fdisk, lsblk, NFS, SMB                                           • SSH, ed25519, Bastion Tunneling
     • Bash Automation: set -euo pipefail                                        • HTTP/1.1 vs HTTP/2 vs HTTP/3
     • Filesystem Hierarchy Standard (FHS)                                       • Common Ports & Sockets
     • Modal Editing with Vim & Nano                                             • Netfilter, iptables, WireGuard
     • Monitoring: top, free, df, iostat                                         • DHCP (DORA) & ARP Layer 2
                                                                                 • NGINX & HAProxy Load Balancing
                                                   |
         +-----------------------------------------+-----------------------------------------+
         |                                                                                   |
         v                                                                                   v
  3. Auth & Identity                                                          4. Containers & Orchestration
     • Single Sign-On (SSO: SAML 2.0)                                            • Kernel: Namespaces & cgroups v2
     • SaaS Providers: Okta, Entra ID, SCIM                                      • Docker & Multi-Stage Builds
     • JSON Web Tokens: HS256 vs RS256                                           • Docker Compose & Healthchecks
     • OAuth 2.0 Grants & PKCE Security                                          • Named Volumes vs Bind Mounts
     • OpenID Connect (OIDC) ID Tokens                                           • Kubernetes Resources (Pod, Deploy,
                                                                                   Service, DaemonSet, Ingress, Secret)
                                                                                 • Registries: ECR, GHCR, Harbor
                                                                                 • Security: Distroless, Non-root, Trivy
                                                                                 • Service Mesh: Istio, Envoy, mTLS
                                                   |
         +-----------------------------------------+-----------------------------------------+
         |                                                                                   |
         v                                                                                   v
  5. Cloud Engineering (Hyperscalers)                                         6. CI/CD & Delivery
     • IaaS vs PaaS vs SaaS, Shared Model                                        • Why CI/CD? DORA Metrics
     • Multi-AZ VPCs, Peering, Transit GW                                        • CI vs CD vs Continuous Deploy
     • EC2, Auto Scaling Groups, ALB/NLB                                         • Build Once, Deploy Everywhere
     • IAM Roles, Policies, IRSA Pod Auth                                        • Testing Pyramid: Unit, Integration
     • Managed K8s: EKS, AKS, Fargate                                            • GitHub Actions & Reusable Workflows
     • Serverless: Lambda, Event-Driven                                          • Blue-Green, Canary, Rolling Updates
     • S3 Object Storage, Presigned URLs                                         • GitOps: ArgoCD Self-Healing Loops
     • Cloud Databases: Aurora, DynamoDB                                         • Trunk-Based vs GitFlow Branching
                                                                                 • Static Scans: SonarQube, SAST, SCA
                                                   |
         +-----------------------------------------+-----------------------------------------+
         |                                                                                   |
         v                                                                                   v
  7. Infrastructure as Code (IaC)                                             8. Observability & SRE
     • Why IaC? Eliminating Drift                                                • Telemetry Trinity: Metrics, Logs, Traces
     • Imperative (How) vs Declarative (What)                                    • Google SRE 4 Golden Signals
     • IaC CI/CD: Plan on PR, Apply on Merge                                     • SLI, SLO, SLA & Error Budgets
     • IaC vs Infrastructure from Code (IfC)                                     • Open Source APM (LGTM) vs SaaS
     • Landscape: Terraform, Pulumi, Bicep                                       • Structured JSON Logging & Vector
     • Terraform State, S3 Locking, Modules                                      • Symptom-Based Actionable Alerting
     • Config Mgmt (Ansible) vs Immutability                                     • OpenTelemetry (OTel) Tracing
```

---

## ⚡ Key Features

1. **Interactive Visual Mindmap Canvas**
   - Directly visualizes the 8 core pillars with color-coded connector branches matching the roadmap architecture.
   - Click any node for an instant quick preview or jump straight into the full guide.
   - Filter by completed status, bookmarked topics, or search keywords.

2. **73 In-Depth Production Study Guides**
   - Scraped and curated from highest-rated authoritative engineering sources: *Linux Foundation, Cloudflare Learning, RFCs, Docker Docs, Kubernetes.io, AWS Architecture Center, Martin Fowler, and Google SRE*.
   - Each guide features:
     - Architecture & Conceptual Deep-Dive
     - ASCII Architecture Topology Diagrams
     - Core Mechanics Breakdown
     - Copyable CLI Commands with explanations
     - Real-World Production Configuration Files (Kubernetes YAML, Dockerfile, Terraform HCL, Python, Bash)
     - Production Gotchas & Pitfalls
     - Senior Platform Engineer Interview Questions & Answers
     - Authoritative Documentation Links
     - Interactive Self-Assessment Quiz with Instant Explanations

3. **Searchable CLI Cheat Sheet (100+ Commands)**
   - Filterable command reference across Linux, Docker, kubectl, Terraform, Git, AWS, and Prometheus.
   - One-click copy with toast confirmation.

4. **Interactive Knowledge Assessment Center (Quizzes)**
   - Test your understanding per topic or per entire pillar.
   - Immediate feedback and explanations with confetti animations on high scores.

5. **Local-First Progress Tracking**
   - Mark topics as complete or bookmarked.
   - Progress and in-app personal notes persist automatically in `localStorage`.
   - Global `Cmd+K` / `Ctrl+K` modal search.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router + Turbopack)
- **UI & Components**: [React](https://react.dev/) 19 & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 (readable neutral/pastel light mode and charcoal dark mode)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebrations**: `canvas-confetti`

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone git@github.com:gauravbhainsora/Platform-Engineer-Roadmap.git
cd Platform-Engineer-Roadmap
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
pnpm build
pnpm start
```

---

## 📂 Project Structure

```
Platform-Engineer-Roadmap/
├── scripts/
│   ├── gen_linux.py          # Data generator for 12 Linux topics
│   ├── gen_networking.py     # Data generator for 11 Networking topics
│   ├── gen_auth.py           # Data generator for 5 Auth topics
│   ├── gen_containers.py     # Data generator for 8 Container & K8s topics
│   ├── gen_cloud.py          # Data generator for 8 Cloud topics
│   ├── gen_cicd.py           # Data generator for 9 CI/CD topics
│   ├── gen_iac.py            # Data generator for 7 IaC topics
│   └── gen_observability.py  # Data generator for 8 Observability topics
├── src/
│   ├── app/
│   │   ├── cheatsheet/       # CLI Cheat Sheet page
│   │   ├── quizzes/          # Interactive assessment page
│   │   ├── topics/           # Curriculum list & dynamic [slug] reader
│   │   ├── globals.css       # Tailwind 4 custom dark styling
│   │   ├── layout.tsx        # Root layout with metadata
│   │   └── page.tsx          # Homepage with Mindmap Canvas
│   ├── components/
│   │   ├── cheatsheet/       # CheatSheetView component
│   │   ├── guide/            # TopicReader in-depth study component
│   │   ├── quiz/             # QuizHub assessment component
│   │   ├── roadmap/          # RoadmapCanvas & CurriculumList
│   │   └── ui/               # Navbar & SearchModal (Cmd+K)
│   ├── data/
│   │   ├── cheatsheets.ts    # 100+ production CLI commands
│   │   ├── pillars.ts        # Metadata for 8 pillars
│   │   ├── topics/           # 73 comprehensive topic data files
│   │   └── index.ts          # Central data aggregator & lookups
│   ├── lib/
│   │   └── storage.ts        # LocalStorage persistence & Confetti
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── package.json
└── tsconfig.json
```

---

## Progress, certificates, and validation

Study progress, notes, quiz scores, and flashcard review schedules stay in your browser. Use **Sync → Export Backup** to keep a portable JSON copy. Restoring a validated backup replaces these fields; selecting a file only loads it for review until you choose **Restore Progress**. Lab completion is stored separately.

Flashcards schedule known cards for review after 1, 3, 7, 14, and 30 days. Cards marked **Needs Review** return after 10 minutes. Use **Browse all cards** for unscheduled practice.

Certificates are self-reported completion records. Printing requires every curriculum topic to be completed and a name to be entered. The **Preview 100%** view is watermarked and cannot issue a completion record. Certificates do not provide external verification or cryptographic certification.

Kubernetes labs parse YAML and check the pod's configuration. Dockerfile and Terraform labs use text checks on active, uncommented code. These exercises do not run containers, apply infrastructure, or guarantee that a configuration will work in production.

Run the checks locally:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

GitHub Actions runs linting, regression tests, and the production build on pushes and pull requests.

## 📜 License

MIT License • Maintained by [Gaurav Bhainsora](https://github.com/gauravbhainsora)
