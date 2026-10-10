import { TopicItem } from '@/types';

export const CICD_TOPICS: TopicItem[] = [
  {
    "id": "cicd-learn-tool",
    "slug": "learn-a-tool-github-actions-gitlab-azure-devops",
    "pillarId": "cicd",
    "branch": "right",
    "order": 1,
    "title": "Learn a Tool: GitHub Actions (or GitLab CI / Azure DevOps)",
    "subtitle": "Workflows, runners, jobs, steps, matrix builds, action ecosystem, and secret management",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "GitHub Actions",
      "CI/CD",
      "GitLab CI",
      "Azure DevOps",
      "Automation"
    ],
    "summary": "Master pipeline syntax, trigger conditions, ephemeral runner environments, matrix testing strategies, and secure secret injection using GitHub Actions.",
    "overview": "GitHub Actions has become the dominant CI/CD engine for modern engineering teams due to its deep integration with pull requests, releases, and repository events.\n\nCore Constructs:\n1. Workflow: Declarative YAML file located in `.github/workflows/` triggered by events (`push`, `pull_request`, `workflow_dispatch`, `schedule`).\n2. Events & Triggers: Filter by branch (`branches: [main]`), file paths (`paths: ['src/**']`), or tags (`tags: ['v*']`).\n3. Jobs: Units of execution running on dedicated virtual machines (hosted `ubuntu-latest` or self-hosted Kubernetes runners). Jobs run in parallel by default unless constrained by `needs`.\n4. Steps & Actions: Sequential tasks inside a job running shell commands (`run`) or reusable community actions (`uses: actions/checkout@v4`).\n5. Matrix Builds: Run the same test suite concurrently across multiple language versions (Node 18, 20, 22) or operating systems (Ubuntu, Windows, macOS).\n6. Secrets & Environment Protection: Encrypted repository secrets and manual deployment approval gates for production environments.",
    "keyConcepts": [
      {
        "title": "Job Parallelism vs Dependencies (needs)",
        "explanation": "Jobs run concurrently by default. Use `needs: [test, lint]` on the build/deploy job to guarantee that deployments only execute if testing and linting succeed."
      },
      {
        "title": "Self-Hosted Runners & Ephemeral Security",
        "explanation": "For internal VPC deployments, use ephemeral self-hosted runners (via Actions Runner Controller in Kubernetes) that destroy the runner pod after each job to prevent credential contamination."
      }
    ],
    "diagram": {
      "title": "GitHub Actions Workflow Execution Graph",
      "type": "ascii",
      "code": "[Event: Pull Request to main]\n             |\n             v\n      [Job: Lint & Static Scan] <----+ Parallel Execution\n      [Job: Unit Test Suite]    <----+\n             |\n             v (Both Pass! needs: [lint, test])\n      [Job: Build & Push Docker Image]\n             |\n             v (Merged to main: Environment Approval Gate)\n      [Job: Deploy to Production Kubernetes]"
    },
    "commands": [
      {
        "cmd": "act pull_request",
        "desc": "Run GitHub Actions workflows locally using Docker via 'act' CLI",
        "example": "act"
      },
      {
        "cmd": "gh run list --limit 10",
        "desc": "List recent GitHub Actions workflow runs via GitHub CLI",
        "example": "gh run list"
      },
      {
        "cmd": "gh run view --log-failed",
        "desc": "Inspect failed job logs directly in terminal",
        "example": "gh run view ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": ".github/workflows/ci-cd.yml",
      "code": "# Production CI/CD workflow testing, building, and deploying with OIDC authentication\nname: Production Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\npermissions:\n  contents: read\n  id-token: write # Required for AWS OIDC\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [20.x, 22.x]\n    steps:\n      - uses: actions/checkout@v4\n      - name: Use Node.js ${{ matrix.node-version }}\n        uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n          cache: 'npm'\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test -- --coverage\n\n  build-and-deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main' && github.event_name == 'push'\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build Docker Image\n        run: |\n          docker build -t app:${{ github.sha }} .\n      - name: Deploy to Cluster\n        run: echo \"Deployment succeeded!\"",
      "explanation": "Matrix-testing workflow that gates deployment to the production environment exclusively on successful tests on the main branch."
    },
    "gotchas": [
      {
        "issue": "Using pull_request_target trigger with untrusted external PRs",
        "resolution": "Using `pull_request_target` grants repository secrets to workflows triggered by forked pull requests. Malicious contributors can alter tests to exfiltrate secrets. Always use standard `pull_request` for untrusted code.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the purpose of the 'matrix' strategy in GitHub Actions?",
        "answer": "The matrix strategy automatically spawns multiple concurrent job variations parameterized by combinations of variables (e.g. testing across 3 OS versions and 3 language runtime versions = 9 parallel jobs), drastically reducing feedback time.",
        "platformContext": "Standard CI optimization technique."
      }
    ],
    "references": [
      {
        "title": "GitHub Actions Documentation",
        "url": "https://docs.github.com/en/actions",
        "source": "GitHub",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which keyword enforces that a job only executes after one or more other jobs finish successfully in GitHub Actions?",
        "options": [
          "needs",
          "depends_on",
          "after",
          "requires"
        ],
        "answerIndex": 0,
        "explanation": "The 'needs' keyword establishes sequential job dependencies in GitHub Actions."
      }
    ]
  },
  {
    "id": "cicd-deployment-strategies",
    "slug": "deployment-strategies-blue-green-canary-rolling",
    "pillarId": "cicd",
    "branch": "right",
    "order": 2,
    "title": "Deployment Strategies (Blue-Green, Canary, Rolling)",
    "subtitle": "Zero-downtime releases, traffic shifting, rollback speeds, and blast radius reduction",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Deployment Strategies",
      "Blue-Green",
      "Canary",
      "Rolling Update",
      "Argo Rollouts"
    ],
    "summary": "Minimize blast radius and eliminate user downtime during releases using Blue-Green switches, progressive Canary traffic analysis, and Rolling updates.",
    "overview": "Deploying code directly by replacing running instances all at once ('Recreate' strategy) causes service downtime and catastrophic failures if bugs exist. Modern platform engineering relies on progressive delivery.\n\nCore Strategies:\n1. Rolling Update (Default Kubernetes):\n   - Replaces old pods with new pods incrementally (e.g. 25% at a time via `maxSurge` and `maxUnavailable`).\n   - Zero downtime, low resource overhead (requires no duplicate environment).\n   - Drawback: Old and new versions run concurrently; requires backwards-compatible database schemas.\n2. Blue-Green Deployment:\n   - Two identical production environments: Blue (active live version) and Green (new version idle).\n   - Test Green with synthetic checks; switch router/load balancer instantly from Blue to Green.\n   - Instant 1-second rollback by toggling router back if issues arise.\n   - Drawback: Requires 2x server capacity/cost during cutover.\n3. Canary Deployment:\n   - Releases new version to a tiny subset of users (e.g. 5% traffic).\n   - Continuously monitors automated metrics (error rate, HTTP 500s, latency). If metrics stay healthy, progressively increases traffic (5% -> 25% -> 50% -> 100%). If errors surge, rolls back automatically.",
    "keyConcepts": [
      {
        "title": "Canary Automated Metric Analysis",
        "explanation": "Tools like Argo Rollouts query Prometheus during canary stages. If HTTP 5xx errors increase by more than 0.5%, the rollout aborts immediately without human intervention."
      },
      {
        "title": "Database Schema Compatibility (Expand-Contract)",
        "explanation": "In both Rolling and Canary deploys, old and new application versions run simultaneously. Database migrations must follow the 'Expand and Contract' pattern to support both codebases."
      }
    ],
    "diagram": {
      "title": "Canary Progressive Traffic Shifting",
      "type": "ascii",
      "code": "Incoming User Requests (100%)\n               |\n               v\n     [Smart Ingress Router / Envoy]\n               |\n       +-------+-------+\n       | (95%)         | (5% Canary)\n       v               v\n  [Version 1.0 (Stable)] [Version 2.0 (Canary)]\n       |                       |\n       v                       v\n  [Metrics Evaluator: Prometheus Alerts OK?]\n  ===> If Healthy: Shift 25% -> 50% -> 100%\n  ===> If 5xx Spikes: Instant Rollback to 0%!"
    },
    "commands": [
      {
        "cmd": "kubectl argo rollouts status rollout/web-app",
        "desc": "Monitor active Canary rollout stages with Argo Rollouts CLI",
        "example": "kubectl argo rollouts status ..."
      },
      {
        "cmd": "kubectl argo rollouts abort rollout/web-app",
        "desc": "Instantly abort Canary deployment and route 100% traffic back to stable",
        "example": "kubectl argo rollouts abort ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "argo-rollout-canary.yaml",
      "code": "# Production Argo Rollouts manifest executing a progressive 5-step Canary deployment\napiVersion: argoproj.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: payment-api\nspec:\n  replicas: 10\n  strategy:\n    canary:\n      steps:\n      - setWeight: 5\n      - pause: { duration: 10m } # Monitor 5% traffic for 10 minutes\n      - setWeight: 20\n      - pause: { duration: 15m }\n      - setWeight: 50\n      - pause: { duration: 10m }\n      analysis:\n        templates:\n        - templateName: success-rate-prometheus\n        args:\n        - name: service-name\n          value: payment-api\n  selector:\n    matchLabels:\n      app: payment-api\n  template:\n    metadata:\n      labels:\n        app: payment-api\n    spec:\n      containers:\n      - name: app\n        image: payment-api:v2.1.0",
      "explanation": "Argo Rollout manifest shifting traffic progressively while continuously querying Prometheus analysis metrics."
    },
    "gotchas": [
      {
        "issue": "Breaking database migrations deployed simultaneously with code",
        "resolution": "Renaming or dropping a column immediately breaks active stable pods running the older version. Always execute migrations in two phases: Phase 1 adds new column; Phase 2 drops old column after the canary reaches 100%.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the key advantage of Canary deployments over Blue-Green deployments?",
        "answer": "Canary deployments limit the blast radius of unexpected defects to a small percentage of users (e.g. 5%) and allow validating real production traffic patterns before committing 100%. Blue-Green switches 100% of traffic at once, exposing all users if an edge-case bug exists.",
        "platformContext": "Fundamental platform reliability question."
      }
    ],
    "references": [
      {
        "title": "Argo Rollouts Documentation",
        "url": "https://argoproj.github.io/argo-rollouts/",
        "source": "Argo",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which deployment strategy switches 100% of incoming traffic from one identical environment to another using a router/load balancer toggle?",
        "options": [
          "Blue-Green Deployment",
          "Canary Deployment",
          "Recreate Deployment",
          "Shadow Deployment"
        ],
        "answerIndex": 0,
        "explanation": "Blue-Green deploys maintain two identical production stacks, switching router targets instantly."
      }
    ]
  },
  {
    "id": "cicd-gitops",
    "slug": "gitops-declarative-delivery-argocd-flux",
    "pillarId": "cicd",
    "branch": "right",
    "order": 3,
    "title": "GitOps (ArgoCD or Flux CD)",
    "subtitle": "Git as single source of truth, pull-based reconciliation loops, drift detection, and self-healing",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "GitOps",
      "ArgoCD",
      "Flux",
      "Kubernetes",
      "Declarative"
    ],
    "summary": "Manage Kubernetes clusters declaratively where Git is the single source of truth, and in-cluster agents automatically reconcile cluster state to match Git commits.",
    "overview": "Traditional CI/CD pipelines use a 'push' model: CI runners hold administrative cluster credentials and execute `kubectl apply` over the network. GitOps inverts this into a secure 'pull' model.\n\nCore Principles of GitOps:\n1. Entire System Described Declaratively: Kubernetes manifests, Helm charts, or Kustomize overlays committed in Git.\n2. Canonical Desired State Versioned in Git: All changes occur via Git commits and Pull Requests (providing audit logs and rollback history).\n3. Pull-based Automated Reconciliation Loop: An agent running inside the cluster (ArgoCD or Flux) continuously monitors Git. When changes are pushed, the controller pulls and applies them.\n4. Drift Detection & Self-Healing: If an engineer manually edits a resource using `kubectl edit`, the GitOps controller detects the divergence (drift) and automatically overwrites it back to the Git source of truth.",
    "keyConcepts": [
      {
        "title": "Push-based CI vs Pull-based GitOps",
        "explanation": "Push-based CI requires storing cluster admin tokens inside third-party CI runners. GitOps runs the reconciler inside the cluster, requiring zero inbound network ports or external admin credentials."
      },
      {
        "title": "Automated Drift Self-Healing",
        "explanation": "Eliminates configuration drift across large clusters. Manual unauthorized kubectl hotfixes are wiped out and reconciled back to the version-controlled Git state."
      }
    ],
    "diagram": {
      "title": "GitOps Pull-Based Reconciliation Architecture",
      "type": "ascii",
      "code": "[Developer / CI Pipeline]\n            |\n  (Git Commit & PR Merge)\n            v\n[Git Repository: infra-manifests] <------------------+\n                                                      | (Pulls changes every 3m)\n[Kubernetes Production Cluster]                       |\n+-----------------------------------------------------+------------------+\n| [ArgoCD / Flux Operator] ---------------------------+                  |\n|             |                                                          |\n|             v (Compares Desired Git State vs Live Cluster State)       |\n|       Is there drift?                                                  |\n|        /          \\                                                    |\n|     [YES]        [NO]                                                  |\n|       |            |                                                   |\n|  Self-Heals:   (In-Sync)                                               |\n|  Applies Git State!                                                    |\n+------------------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "argocd app list",
        "desc": "List all managed applications and their Sync/Health status",
        "example": "argocd app list"
      },
      {
        "cmd": "argocd app sync production-api",
        "desc": "Trigger immediate manual synchronization of application from Git",
        "example": "argocd app sync app"
      },
      {
        "cmd": "argocd app diff production-api",
        "desc": "Display diff between Git manifests and live running cluster resources",
        "example": "argocd app diff app"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "argocd-application.yaml",
      "code": "# Production ArgoCD Application CRD managing microservice via Kustomize with self-healing\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: checkout-service-prod\n  namespace: argocd\n  finalizers:\n    - resources-finalizer.argocd.argoproj.io\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/company/platform-gitops.git\n    targetRevision: HEAD\n    path: environments/production/checkout\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true    # Automatically delete resources removed from Git\n      selfHeal: true # Automatically overwrite manual kubectl edits\n    syncOptions:\n      - CreateNamespace=true\n      - ApplyOutOfSyncOnly=true",
      "explanation": "Declarative ArgoCD Application resource that continuously reconciles cluster state against a Git repository with automatic pruning and self-healing."
    },
    "gotchas": [
      {
        "issue": "Infinite sync loops between CI image tag updates and GitOps commits",
        "resolution": "If your CI writes newly built image tags back into the same application Git repo that triggers CI, it can trigger an infinite commit loop. Decouple application source code repos from dedicated GitOps manifest repositories.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why is GitOps considered more secure than traditional push-based CI/CD pipelines?",
        "answer": "Push-based CI requires storing cluster admin credentials in external CI systems, exposing the cluster to supply chain compromise. GitOps runs inside the cluster firewall, pulling from Git over read-only HTTPS/SSH, requiring zero inbound network firewall holes or external credentials.",
        "platformContext": "Core concept in CNCF and modern cloud-native architecture interviews."
      }
    ],
    "references": [
      {
        "title": "OpenGitOps Principles",
        "url": "https://opengitops.dev/",
        "source": "CNCF",
        "type": "spec"
      },
      {
        "title": "ArgoCD Documentation",
        "url": "https://argo-cd.readthedocs.io/",
        "source": "Argo",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What happens in a GitOps setup with self-healing enabled when an operator manually deletes a pod or modifies a deployment via kubectl?",
        "options": [
          "The controller detects the drift and automatically reverts the cluster to match Git",
          "Git is updated with the manual change",
          "The cluster halts and raises an error",
          "The change is permitted permanently"
        ],
        "answerIndex": 0,
        "explanation": "GitOps self-healing reconciles the live cluster back to the desired state declared in Git."
      }
    ]
  },
  {
    "id": "cicd-branching-strategies",
    "slug": "branching-strategies-trunk-based-github-flow-gitflow",
    "pillarId": "cicd",
    "branch": "right",
    "order": 4,
    "title": "Branching Strategies (Trunk-Based vs GitFlow)",
    "subtitle": "Trunk-Based Development, GitHub Flow, GitFlow legacy models, and feature flags",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Git",
      "Trunk-Based Development",
      "GitFlow",
      "GitHub Flow",
      "Feature Flags"
    ],
    "summary": "Select and scale team branching models: eliminate painful merge hell using short-lived branches in Trunk-Based Development paired with Feature Flags.",
    "overview": "Branching models dictate how teams integrate code into production.\n\nKey Models:\n1. Trunk-Based Development (TBD - Modern DevOps Standard):\n   - All developers commit frequently to a single shared branch ('trunk' or 'main').\n   - Feature branches are short-lived (< 1 to 2 days) and merged via small pull requests.\n   - Incomplete features are hidden behind Feature Flags (LaunchDarkly, Unleash, Flipt) rather than sequestered on long-running branches.\n   - High velocity, minimal merge conflicts, constant integration testing.\n2. GitHub Flow:\n   - Lightweight workflow: Create descriptive branch -> Open Pull Request -> Review and run automated tests -> Merge to main -> Deploy to production immediately.\n3. GitFlow (Legacy Model):\n   - Complex branching model with multiple long-lived branches: `master`, `develop`, `feature/*`, `release/*`, `hotfix/*`.\n   - Leads to 'merge hell', delayed integration feedback, and slow release cycles. Mostly abandoned by high-performing DevOps teams.",
    "keyConcepts": [
      {
        "title": "Feature Flags Decouple Deployment from Release",
        "explanation": "Deployment is technical (shipping compiled code to production servers). Release is business (turning the feature on for users). Feature flags allow deploying code continuously without exposing half-finished features."
      },
      {
        "title": "DORA Metrics Correlation",
        "explanation": "DORA research demonstrates that high-performing engineering teams universally practice Trunk-Based Development, achieving significantly higher deployment frequencies and lower change failure rates."
      }
    ],
    "diagram": {
      "title": "Trunk-Based Development vs GitFlow",
      "type": "ascii",
      "code": "TRUNK-BASED DEVELOPMENT: (Short-lived, Fast, Continuous)\n  Main Branch:  ======o=======o=======o=======o=======> (Always Deployable)\n                      \\      / \\     /\n  Short Feature Branch: `----'   `---' (< 24 hours)\n\nLEGACY GITFLOW: (Long-lived, Slow, Complex Merges)\n  Master:       =============================o========> (Releases Only)\n                                            /\n  Release:                     +-----------+---------->\n                              /\n  Develop:      ======o======o========================>\n                     /      /\n  Feature A/B:  ----+------+---------------------------> (Weeks / Months of drift)"
    },
    "commands": [
      {
        "cmd": "git checkout -b feat/add-payment-webhook",
        "desc": "Create short-lived feature branch off main",
        "example": "git checkout -b feat/branch"
      },
      {
        "cmd": "git fetch origin && git rebase origin/main",
        "desc": "Rebase feature branch onto latest main to keep history clean and avoid merge conflicts",
        "example": "git rebase origin/main"
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "feature_flag_middleware.py",
      "code": "# Production Feature Flag integration decoupling deployment from feature release\nimport os\n\ndef is_feature_enabled(flag_name: str, user_id: str) -> bool:\n    \"\"\"\n    Evaluates feature flag state via environment or centralized flag service\n    \"\"\"\n    # Example rollout: 10% canary percentage rollout based on user_id hash\n    rollout_percentage = int(os.getenv(f\"FLAG_{flag_name.upper()}_PERCENT\", \"0\"))\n    user_hash = hash(user_id) % 100\n    return user_hash < rollout_percentage\n\ndef process_checkout(order_data: dict, user_id: str):\n    if is_feature_enabled(\"new_stripe_v3\", user_id):\n        # New implementation (safely deploying to trunk without risk)\n        return process_with_stripe_v3(order_data)\n    else:\n        # Stable legacy implementation\n        return process_with_legacy_payment(order_data)",
      "explanation": "Demonstrates feature flagging in code, allowing safe continuous deployment to trunk without exposing unvetted code paths to all users."
    },
    "gotchas": [
      {
        "issue": "Accumulating stale, dead feature flag branches in codebase",
        "resolution": "Feature flags introduce technical debt. Once a feature reaches 100% rollout and stabilizes for 2 weeks, schedule a cleanup PR to remove the flag checks and legacy code branches.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why does DORA recommend Trunk-Based Development over GitFlow?",
        "answer": "GitFlow isolates code on long-lived branches for weeks, deferring integration testing and causing painful merge conflicts and regression bugs. Trunk-Based Development requires merging small changes daily, surfacing integration conflicts immediately and enabling continuous automated testing.",
        "platformContext": "Standard engineering management and DevOps transformation question."
      }
    ],
    "references": [
      {
        "title": "Trunk Based Development Reference",
        "url": "https://trunkbaseddevelopment.com/",
        "source": "Paul Hammant",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What technique allows developers practicing Trunk-Based Development to merge incomplete features into main without exposing them to end users?",
        "options": [
          "Feature Flags / Toggles",
          "Stashing commits",
          "Git Cherry-pick",
          "Detached HEAD states"
        ],
        "answerIndex": 0,
        "explanation": "Feature Flags allow code to ship to production in an inactive state, decoupling deployment from release."
      }
    ]
  },
  {
    "id": "cicd-static-scanning",
    "slug": "static-scanning-sonarqube-sast-sca-secrets",
    "pillarId": "cicd",
    "branch": "right",
    "order": 5,
    "title": "Static Scanning & DevSecOps (SonarQube, SAST)",
    "subtitle": "SonarQube quality gates, Static Application Security Testing (SAST), SCA, and secret leak prevention",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "SonarQube",
      "SAST",
      "SCA",
      "DevSecOps",
      "Security",
      "Code Quality"
    ],
    "summary": "Shift security left by automatically scanning code for quality smells, security bugs, vulnerable third-party dependencies, and committed API secrets directly inside CI pipelines.",
    "overview": "DevSecOps integrates security automated gates into the early development phases before binaries ever reach production.\n\nKey Static Scanning Disciplines:\n1. Code Quality & Linting (SonarQube / ESLint / GolangCI-Lint):\n   - Measures test coverage percentages, code duplication, cyclomatic complexity, and code smells.\n   - Quality Gates: Pipeline automatically fails PR if test coverage drops below 80% or new bugs are introduced.\n2. Static Application Security Testing (SAST - Semgrep, CodeQL):\n   - Analyzes source code without executing it to detect SQL injection vulnerabilities, cross-site scripting (XSS), insecure deserialization, and path traversal bugs.\n3. Software Composition Analysis (SCA - Dependabot, Snyk):\n   - Scans third-party open-source libraries (`package.json`, `pom.xml`, `go.mod`) against known CVE vulnerability databases.\n4. Secret Scanning (TruffleHog, Gitleaks):\n   - Scans commit history for accidentally committed private keys, AWS access keys, or Slack webhooks.",
    "keyConcepts": [
      {
        "title": "Shift-Left Security Philosophy",
        "explanation": "Fixing a security vulnerability in production costs 30x more in remediation time and breach risks than detecting it automatically on a pull request in CI."
      },
      {
        "title": "Pre-Commit Secret Scanning",
        "explanation": "Once an API secret is committed to Git history, pushing it exposes it immediately. Tools like `pre-commit` with Gitleaks block the commit on the developer's laptop before it ever touches remote servers."
      }
    ],
    "diagram": {
      "title": "DevSecOps Shift-Left Pipeline Security Gates",
      "type": "ascii",
      "code": "[Developer types: git commit]\n            |\n            v (1. Pre-commit Hook: Gitleaks - Scans for API secrets)\n[Push Pull Request to GitHub]\n            |\n            +---> 2. SAST Scan (Semgrep / CodeQL - Detects OWASP bugs)\n            |\n            +---> 3. SCA Scan (Snyk / Dependabot - Detects vulnerable dependencies)\n            |\n            `---> 4. Quality Gate (SonarQube - Enforces 80% test coverage)\n            |\n       All Gates Passed? ===> Merged to Main and Deployed!"
    },
    "commands": [
      {
        "cmd": "gitleaks detect --source . -v",
        "desc": "Scan repository and git history for leaked API secrets and passwords",
        "example": "gitleaks detect"
      },
      {
        "cmd": "semgrep scan --config auto",
        "desc": "Run static application security testing using standard OWASP rule sets",
        "example": "semgrep scan"
      },
      {
        "cmd": "sonar-scanner -Dsonar.projectKey=my-project",
        "desc": "Execute SonarQube CLI scanner against local codebase",
        "example": "sonar-scanner ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "security-scan-pr.yml",
      "code": "# Production GitHub Actions workflow executing SAST and Secret Scanning on PRs\nname: DevSecOps Security Gates\non:\n  pull_request:\n    branches: [main]\n\njobs:\n  security-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0 # Deep fetch for full Git history scanning\n\n      - name: Gitleaks Secret Scanner\n        uses: gitleaks/gitleaks-action@v2\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n      - name: Semgrep SAST Scan\n        uses: returntocorp/semgrep-action@v1\n        with:\n          config: >-\n            p/security-audit\n            p/owasp-top-ten\n        env:\n          SEMGREP_RULES: p/default",
      "explanation": "Integrates Gitleaks and Semgrep into PR checks to automatically block merges containing leaked credentials or OWASP Top 10 vulnerabilities."
    },
    "gotchas": [
      {
        "issue": "Deleting a secret in a subsequent commit does not remove it from Git history",
        "resolution": "Git preserves full historical blobs. If a secret was committed, attackers can view earlier commits. The secret must be revoked/rotated immediately, and the repository rewritten using `git-filter-repo`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between SAST and DAST in pipeline security?",
        "answer": "SAST (Static Application Security Testing) analyzes source code directly without running the application ('white-box' testing early in CI). DAST (Dynamic Application Security Testing) analyzes a running application by sending simulated attacks from the outside ('black-box' testing in staging environments).",
        "platformContext": "Core DevSecOps interview topic."
      }
    ],
    "references": [
      {
        "title": "SonarQube Documentation",
        "url": "https://docs.sonarsource.com/sonarqube/latest/",
        "source": "SonarSource",
        "type": "official"
      },
      {
        "title": "OWASP DevSecOps Guideline",
        "url": "https://owasp.org/www-project-devsecops-guideline/",
        "source": "OWASP",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which tool type specifically inspects third-party package dependencies (like npm or pip packages) for known CVE vulnerabilities?",
        "options": [
          "Software Composition Analysis (SCA)",
          "Dynamic Application Security Testing (DAST)",
          "Hypervisor Inspection",
          "TCP Port Scanner"
        ],
        "answerIndex": 0,
        "explanation": "SCA tools (like Snyk and Dependabot) scan open-source software dependencies for known CVE vulnerabilities."
      }
    ]
  },
  {
    "id": "cicd-benefits",
    "slug": "benefits-of-ci-cd-why-do-we-do-it-dora",
    "pillarId": "cicd",
    "branch": "left",
    "order": 6,
    "title": "Benefits of CI & CD: Why Do We Do It?",
    "subtitle": "Accelerated feedback loops, risk reduction, DORA metrics, and business impact",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "CI/CD",
      "DORA Metrics",
      "DevOps Culture",
      "Automation",
      "Reliability"
    ],
    "summary": "Understand the business and engineering justification for CI/CD: transform high-risk, infrequent release marathons into low-risk, continuous deployments measured by DORA metrics.",
    "overview": "Before CI/CD, software releases were infrequent, manual, and terrifying events ('release weekends') plagued by merge conflicts, manual configuration mistakes, and production downtime.\n\nCore Benefits of CI/CD:\n1. Accelerated Feedback Loops: Bugs are caught within 5 minutes of writing code, when the mental context is fresh.\n2. Smaller Blast Radius: Shipping small changes multiple times a day isolates defects quickly compared to releasing 500 changes at once.\n3. Automated Quality & Security Enforcement: Eliminates human error in testing and deployments.\n4. DORA Metrics (DevOps Research and Assessment):\n   - Deployment Frequency: How often code is successfully deployed to production (Elite: on-demand multiple times per day).\n   - Lead Time for Changes: Time from code commit to running in production (Elite: < 1 hour).\n   - Change Failure Rate: Percentage of deployments causing production incidents (Elite: 0-15%).\n   - Time to Restore Service (MTTR): Time to recover from an outage (Elite: < 1 hour).",
    "keyConcepts": [
      {
        "title": "Frequent Small Batches Over Large Batches",
        "explanation": "Lean manufacturing principles applied to software. Small batches minimize work-in-progress, accelerate flow, and drastically reduce troubleshooting time when bugs occur."
      },
      {
        "title": "The Four DORA Metrics",
        "explanation": "The scientific industry benchmark proving that high velocity and high stability reinforce each other rather than being opposing trade-offs."
      }
    ],
    "diagram": {
      "title": "The 4 DORA Metrics Equilibrium",
      "type": "ascii",
      "code": "         +---------------------------------------------------+\n         |             DORA Core Performance Metrics         |\n         +---------------------------------------------------+\n           /                                               \\\n   [THROUGHPUT METRICS]                            [STABILITY METRICS]\n   - Deployment Frequency                          - Change Failure Rate\n     (Multiple deploys / day)                        (< 10% of releases)\n   - Lead Time for Changes                         - Time to Restore Service (MTTR)\n     (Under 1 hour commit to prod)                   (Recover in < 1 hour)"
    },
    "commands": [
      {
        "cmd": "git log --oneline --since=\"1 month ago\" | wc -l",
        "desc": "Measure monthly commit velocity in repository",
        "example": "git log ..."
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "dora_metrics_calculator.py",
      "code": "#!/usr/bin/env python3\n\"\"\"\nCalculates DORA Deployment Frequency & Lead Time for Changes from GitHub deployment API events\n\"\"\"\nimport datetime\n\ndef calculate_dora_score(deployments_per_month: int, avg_lead_time_hours: float, failure_rate_pct: float):\n    print(\"=== [DORA Engineering Maturity Assessment] ===\")\n    print(f\"Deployments / Month : {deployments_per_month}\")\n    print(f\"Avg Lead Time       : {avg_lead_time_hours:.1f} hours\")\n    print(f\"Change Failure Rate : {failure_rate_pct:.1f}%\")\n    \n    if deployments_per_month >= 30 and avg_lead_time_hours <= 24 and failure_rate_pct <= 15:\n        status = \"ELITE PERFORMER (High Velocity & High Stability)\"\n    elif deployments_per_month >= 4 and avg_lead_time_hours <= 168:\n        status = \"HIGH PERFORMER\"\n    else:\n        status = \"MEDIUM / LOW PERFORMER (Opportunities for CI/CD optimization)\"\n        \n    print(f\"Result: {status}\")\n\nif __name__ == \"__main__\":\n    calculate_dora_score(deployments_per_month=65, avg_lead_time_hours=1.5, failure_rate_pct=4.2)",
      "explanation": "Calculates organizational DORA performance tiers based on deployment frequency, lead time, and failure rates."
    },
    "gotchas": [
      {
        "issue": "Treating CI/CD purely as tooling rather than culture",
        "resolution": "Setting up Jenkins or GitHub Actions while developers continue working on 2-month branches without tests does not achieve CI/CD benefits. CI/CD requires cultural discipline: committing frequently and prioritizing broken build fixes immediately.",
        "severity": "tip"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are the four DORA metrics and why are they significant?",
        "answer": "Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Time to Restore Service (MTTR). They are significant because rigorous empirical research from Google DORA proved that top engineering teams do not sacrifice stability for speed\u2014they achieve both simultaneously through continuous delivery.",
        "platformContext": "Standard leadership and principal engineer interview topic."
      }
    ],
    "references": [
      {
        "title": "Google Cloud DORA State of DevOps Report",
        "url": "https://dora.dev/",
        "source": "Google DORA",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which of the following is NOT one of the four core DORA metrics?",
        "options": [
          "Lines of Code per Engineer",
          "Deployment Frequency",
          "Change Failure Rate",
          "Lead Time for Changes"
        ],
        "answerIndex": 0,
        "explanation": "Lines of Code is a vanity metric; DORA measures Deployment Frequency, Lead Time, Change Failure Rate, and Time to Restore Service."
      }
    ]
  },
  {
    "id": "cicd-difference",
    "slug": "difference-between-ci-and-cd-build-test-deploy",
    "pillarId": "cicd",
    "branch": "left",
    "order": 7,
    "title": "Difference Between CI & CD: Build, Test, Deploy",
    "subtitle": "Continuous Integration vs Continuous Delivery vs Continuous Deployment",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "CI vs CD",
      "Pipelines",
      "Continuous Integration",
      "Continuous Delivery",
      "Deployment"
    ],
    "summary": "Differentiate Continuous Integration, Continuous Delivery, and Continuous Deployment, and dissect the discrete responsibilities of Build, Test, and Deploy pipeline phases.",
    "overview": "While commonly grouped together as 'CI/CD', they represent distinct engineering automation milestones.\n\nDefinitions:\n1. Continuous Integration (CI):\n   - Developers merge code into the shared mainline daily.\n   - Automated systems immediately build the code and execute unit and integration test suites.\n   - Goal: Catch integration and logic bugs in minutes.\n2. Continuous Delivery (CD):\n   - Automatically packages tested code into production-ready deployable artifacts (Docker images, Helm charts, binaries) and deploys them to staging environments.\n   - Production deployment is fully automated but triggered via a manual human decision/button ('ready to deploy at any moment').\n3. Continuous Deployment (CD):\n   - Goes one step further: every single commit that passes automated testing is automatically deployed directly into production with ZERO human intervention.\n\nPipeline Phases:\n- Build Phase: Compiles source code, bundles assets, packages container image.\n- Test Phase: Runs unit, integration, and security scans in isolated containers.\n- Deploy Phase: Shifts traffic to new artifacts in target environments.",
    "keyConcepts": [
      {
        "title": "Continuous Delivery vs Continuous Deployment",
        "explanation": "Continuous Delivery ensures software is ALWAYS in a deployable state, requiring a human trigger for production. Continuous Deployment deploys every commit to production fully automatically."
      },
      {
        "title": "Fast Feedback (< 10 Minutes)",
        "explanation": "The CI phase must finish in under 10 minutes. If CI takes 45 minutes, developers context-switch to other tasks, breaking the continuous feedback loop."
      }
    ],
    "diagram": {
      "title": "CI vs Continuous Delivery vs Continuous Deployment",
      "type": "ascii",
      "code": "[Code Commit] -> [Automated Build] -> [Automated Test] ===> CONTINUOUS INTEGRATION (CI)\n                                              |\n                                              v\n                                   [Deploy to Staging]\n                                              |\n                                              v\n                             [Deployable Artifact Ready]\n                                      /        \\\n      [Manual Approval Click]        /          \\ [Zero Human Intervention]\n                |                   /            \\\n                v                  /              v\n    [Deploy to Production] <------+                [Deploy to Production] (Continuous Deployment)\n    (Continuous Delivery)"
    },
    "commands": [
      {
        "cmd": "npm run build && npm test",
        "desc": "Simulate local CI phase before pushing commit",
        "example": "npm test"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "pipeline-stages.yml",
      "code": "# Pipeline demonstrating distinct Build, Test, Delivery, and Deployment stages\nstages:\n  - build\n  - test\n  - delivery\n  - production_deployment\n\nbuild_artifact:\n  stage: build\n  script:\n    - docker build -t app:${CI_COMMIT_SHA} .\n\nrun_tests:\n  stage: test\n  script:\n    - docker run --rm app:${CI_COMMIT_SHA} npm test\n\ndeploy_staging:\n  stage: delivery\n  script:\n    - kubectl apply -f k8s/staging/ # Continuous Delivery\n\ndeploy_production:\n  stage: production_deployment\n  script:\n    - kubectl apply -f k8s/production/\n  rules:\n    - if: $CI_COMMIT_BRANCH == \"main\"\n      when: manual # Change to 'always' for Continuous Deployment",
      "explanation": "Explicitly distinguishes the automated staging delivery stage from a gated production deployment stage."
    },
    "gotchas": [
      {
        "issue": "Attempting Continuous Deployment without comprehensive automated test suites",
        "resolution": "Continuous Deployment requires mature unit, integration, smoke, and synthetic tests with automated rollback triggers. Moving straight to continuous deployment without tests will push bugs straight to users.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the precise difference between Continuous Delivery and Continuous Deployment?",
        "answer": "In Continuous Delivery, the release artifact is validated and staged automatically, but human intervention (clicking a deploy button) is required to release to production. In Continuous Deployment, changes pass through the entire pipeline and deploy to production automatically with zero human intervention.",
        "platformContext": "Standard introductory screening question."
      }
    ],
    "references": [
      {
        "title": "Martin Fowler on Continuous Delivery",
        "url": "https://martinfowler.com/bliki/ContinuousDelivery.html",
        "source": "Martin Fowler",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which practice automatically deploys every change that passes all automated test stages directly to production without any manual approval gates?",
        "options": [
          "Continuous Deployment",
          "Continuous Delivery",
          "Continuous Integration",
          "Nightly Builds"
        ],
        "answerIndex": 0,
        "explanation": "Continuous Deployment deploys every validated build directly to production with zero manual intervention."
      }
    ]
  },
  {
    "id": "cicd-best-practices",
    "slug": "ci-cd-best-practices-build-once-pipelines-as-code",
    "pillarId": "cicd",
    "branch": "left",
    "order": 8,
    "title": "CI / CD Best Practices",
    "subtitle": "Build once - deploy everywhere, builds on PRs, pipeline-as-code, and secret management",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Best Practices",
      "Build Once",
      "Pipelines-as-Code",
      "CI/CD",
      "DevOps"
    ],
    "summary": "Implement production-grade pipeline engineering principles: generate immutable binary artifacts once, inject environment configuration at runtime, and treat pipelines as version-controlled code.",
    "overview": "A poorly architected CI/CD pipeline creates flaky builds, slow deployments, and security holes.\n\nCore Best Practices:\n1. Build Once, Deploy Everywhere:\n   - Build the container image or application binary exactly ONCE during the initial CI build stage.\n   - Promote the exact same binary image from dev -> staging -> production. Never recompile code between environments; inject environment variables or ConfigMaps at runtime.\n2. Pipelines as Code:\n   - Pipeline definitions must be version-controlled in the repository alongside application source code (e.g. `.github/workflows/`), enabling PR reviews and rollback capability.\n3. Ephemeral, Clean Build Environments:\n   - Run every build job in an isolated container or fresh VM to eliminate 'it works on my runner' contamination.\n4. Build on Every Pull Request:\n   - Never wait until code merges to main to test. Execute tests and security scans on PR creation to catch issues before merge.\n5. Fast, Reliable Feedback:\n   - Parallelize independent test suites and cache package manager dependencies.",
    "keyConcepts": [
      {
        "title": "Immutable Artifact Promotion",
        "explanation": "Rebuilding an image for production creates an untested binary with potentially newer upstream dependencies. Building once guarantees that the artifact verified in staging is bit-for-bit identical to production."
      },
      {
        "title": "Fail Fast Strategy",
        "explanation": "Order pipeline steps from fastest to slowest: run fast linters (<30s) and static scans (<1m) before kicking off heavy integration tests and Docker builds."
      }
    ],
    "diagram": {
      "title": "Build Once, Deploy Everywhere Artifact Flow",
      "type": "ascii",
      "code": "[Source Code Commit (SHA: 4a9f2)]\n               |\n               v\n  [CI Step: Docker Build & Test]\n               |\n               v (Produces Immutable Image: app:4a9f2)\n  +------------+------------+\n  | (Promote exact same image)\n  v\n[Dev Cluster] =====> [Staging Cluster] =====> [Production Cluster]\n(Config: dev.env)    (Config: stage.env)     (Config: prod.env)"
    },
    "commands": [
      {
        "cmd": "docker image inspect --format='{{.Id}}' myapp:staging",
        "desc": "Verify image ID checksum matches between staging and production",
        "example": "docker image inspect ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "promote-artifact-pipeline.yml",
      "code": "# Best-practice pipeline illustrating Build Once and Immutable Promotion\nname: Release Pipeline\non:\n  push:\n    tags: ['v*']\n\njobs:\n  build-artifact:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build and Tag Single Artifact\n        run: |\n          docker build -t registry.company.com/api:${{ github.sha }} .\n          docker push registry.company.com/api:${{ github.sha }}\n\n  deploy-staging:\n    needs: build-artifact\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n      - name: Deploy SHA to Staging\n        run: kubectl set image deployment/api api=registry.company.com/api:${{ github.sha }} -n staging\n\n  deploy-production:\n    needs: deploy-staging\n    runs-on: ubuntu-latest\n    environment: production # Holds manual approval gate\n    steps:\n      - name: Promote Exact Same SHA to Production\n        run: kubectl set image deployment/api api=registry.company.com/api:${{ github.sha }} -n production",
      "explanation": "Promotes the exact same container image SHA verified in staging directly to production without recompiling."
    },
    "gotchas": [
      {
        "issue": "Baking environment variables into Docker images during build",
        "resolution": "Hardcoding `DATABASE_URL` inside the Docker image means you must rebuild different images for staging and production, violating 'Build Once'. Inject environment configuration at runtime via Kubernetes ConfigMaps and Secrets.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why is 'Build Once, Deploy Everywhere' considered a foundational CI/CD best practice?",
        "answer": "If you rebuild code for each environment, you risk pulling in different sub-dependency versions, OS package patches, or compiler differences. Rebuilding produces an untested binary. Building once and promoting the same image guarantees that what was vetted in staging is identical in production.",
        "platformContext": "Fundamental principle of modern release engineering."
      }
    ],
    "references": [
      {
        "title": "The Twelve-Factor App: Config & Build, Release, Run",
        "url": "https://12factor.net/",
        "source": "12factor.net",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary risk of rebuilding a Docker image for production instead of promoting the image tested in staging?",
        "options": [
          "The production image may pull updated sub-dependencies, resulting in an unverified binary running in production",
          "Docker images expire after 24 hours",
          "Kubernetes rejects images built more than once",
          "It consumes more CPU on worker nodes"
        ],
        "answerIndex": 0,
        "explanation": "Rebuilding creates a new untested binary that may differ from what was verified in QA and staging."
      }
    ]
  },
  {
    "id": "cicd-test-types",
    "slug": "types-of-tests-unit-integration-end-to-end",
    "pillarId": "cicd",
    "branch": "left",
    "order": 9,
    "title": "Types of Tests in CI: Unit, Integration, End-to-End",
    "subtitle": "The Test Pyramid, mocking, contract testing, and fast pipeline feedback loops",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "Testing",
      "Unit Tests",
      "Integration Tests",
      "E2E",
      "Test Pyramid",
      "CI"
    ],
    "summary": "Structure test suites along the Test Pyramid: maximize high-speed, isolated unit tests, validate service boundaries with integration tests, and reserve E2E tests for critical user journeys.",
    "overview": "Automated testing is the safety net that makes continuous deployment possible.\n\nTesting Hierarchy (The Test Pyramid):\n1. Unit Tests (Base of Pyramid - 70%):\n   - Tests individual functions or classes in complete isolation.\n   - External dependencies (databases, third-party APIs, disk) are mocked.\n   - Execution speed: Milliseconds. Runs on every commit.\n2. Integration Tests (Middle of Pyramid - 20%):\n   - Tests how multiple components work together (e.g. repository querying a real ephemeral PostgreSQL test container via Testcontainers).\n   - Catches database query syntax bugs, serialization issues, and schema mismatches.\n   - Execution speed: Seconds.\n3. End-to-End (E2E) Tests (Peak of Pyramid - 10%):\n   - Tests complete user journeys against a fully deployed environment (e.g. Playwright / Cypress driving a browser to login, add item to cart, and checkout).\n   - Slower, brittle to minor UI changes, and resource-heavy.\n4. Specialized Tests:\n   - Contract Tests (Pact): Verifies microservice API compatibility.\n   - Smoke Tests: Rapid sanity probes validating core endpoints post-deployment.",
    "keyConcepts": [
      {
        "title": "The Test Inverted Pyramid Anti-Pattern (Ice Cream Cone)",
        "explanation": "Relying heavily on slow, flaky E2E tests with few unit tests creates pipeline runs that take hours, fail unpredictably, and delay feedback. Always maintain a strong unit test base."
      },
      {
        "title": "Testcontainers for Realistic Integration Testing",
        "explanation": "Spinning up real ephemeral Docker instances of Redis, Kafka, or Postgres during test execution provides realistic fidelity without mocking database dialects."
      }
    ],
    "diagram": {
      "title": "The Classic Test Pyramid Architecture",
      "type": "ascii",
      "code": "                    /\\ \n                   /  \\   [End-to-End (E2E) Tests]\n                  / 10%\\  - Slowest, highest cost, tests full system\n                 /------\\ \n                /  20%   \\   [Integration Tests]\n               /          \\  - Tests DB, API contracts, services\n              /------------\\ \n             /     70%      \\   [Unit Tests]\n            /                \\  - Fastest, cheapest, tests isolated functions\n           +------------------+"
    },
    "commands": [
      {
        "cmd": "pytest tests/unit -v",
        "desc": "Run unit test suite with verbose output",
        "example": "pytest tests/unit"
      },
      {
        "cmd": "pytest tests/integration -v",
        "desc": "Run integration test suite against ephemeral containers",
        "example": "pytest tests/integration"
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "test_payment_integration.py",
      "code": "# Production integration test using Testcontainers to spin up real PostgreSQL instance\nimport pytest\nfrom testcontainers.postgres import PostgresContainer\nimport sqlalchemy\n\n@pytest.fixture(scope=\"module\")\ndef postgres_db():\n    # Spins up isolated Docker container running Postgres\n    with PostgresContainer(\"postgres:16-alpine\") as postgres:\n        engine = sqlalchemy.create_engine(postgres.get_connection_url())\n        yield engine\n\ndef test_database_payment_insert(postgres_db):\n    with postgres_db.connect() as conn:\n        conn.execute(sqlalchemy.text(\"CREATE TABLE payments (id INT, amount NUMERIC);\"))\n        conn.execute(sqlalchemy.text(\"INSERT INTO payments VALUES (1, 150.00);\"))\n        result = conn.execute(sqlalchemy.text(\"SELECT amount FROM payments WHERE id = 1;\")).scalar()\n        assert float(result) == 150.00",
      "explanation": "Executes real integration tests against ephemeral PostgreSQL Docker containers spawned on-demand via Testcontainers."
    },
    "gotchas": [
      {
        "issue": "Flaky E2E tests that pass on retry eroding team trust",
        "resolution": "Tests that randomly fail due to network timeouts or animations train engineers to ignore CI red flags. Isolate and quarantine flaky tests immediately until rewritten or replaced with integration tests.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why should unit tests never make real network calls or query real databases?",
        "answer": "Unit tests must be fast (executing thousands of tests in seconds) and completely deterministic. Querying real networks or shared databases introduces external latency, network flakiness, and state pollution between test runs.",
        "platformContext": "Fundamental software quality principle."
      }
    ],
    "references": [
      {
        "title": "The Practical Test Pyramid",
        "url": "https://martinfowler.com/articles/practical-test-pyramid.html",
        "source": "Martin Fowler",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "According to the Test Pyramid, which category of tests should constitute the vast majority of an application's test suite?",
        "options": [
          "Unit Tests",
          "End-to-End Tests",
          "Manual Tests",
          "UI Tests"
        ],
        "answerIndex": 0,
        "explanation": "Unit tests form the broad foundation (typically ~70%) because they are fast, isolated, and cheap to run."
      }
    ]
  }
];
