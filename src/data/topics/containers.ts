import { TopicItem } from '@/types';

export const CONTAINERS_TOPICS: TopicItem[] = [
  {
    "id": "containers-kubernetes-resources",
    "slug": "kubernetes-basic-resource-types",
    "pillarId": "containers",
    "branch": "right",
    "order": 1,
    "title": "Kubernetes: Basic Resource Types",
    "subtitle": "Pods, Deployments, Services (ClusterIP/NodePort/LB), DaemonSets, Ingress, ConfigMaps & Secrets",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "Kubernetes",
      "Pod",
      "Deployment",
      "Service",
      "Ingress",
      "ConfigMap",
      "Secret"
    ],
    "summary": "Master the core declarative declarative API objects of Kubernetes that orchestrate, schedule, network, and configure distributed cloud-native container workloads.",
    "overview": "Kubernetes manages workloads declaratively using API objects reconciled by control plane controllers.\n\nCore Resource Types:\n1. Pod: The smallest deployable unit in Kubernetes. Encapsulates one or more containers that share network namespaces (IP and localhost) and storage volumes.\n2. Deployment: Manages declarative updates for Pods via ReplicaSets. Handles rolling updates, rollbacks, and self-healing pod replication.\n3. Service: Stable network abstraction (virtual IP & DNS) exposing a set of dynamic pods determined by label selectors:\n   - ClusterIP: Default internal-only IP accessible within the cluster.\n   - NodePort: Exposes service on a static high port (30000-32767) across all worker nodes.\n   - LoadBalancer: Provisions an external cloud load balancer (AWS NLB, GCP LB).\n4. DaemonSet: Ensures a copy of a Pod runs on every eligible node (ideal for node monitoring like Prometheus Node Exporter or log agents like Fluentbit).\n5. Ingress: Layer 7 reverse proxy routing external HTTP/HTTPS traffic to internal Services based on hostname and URI paths.\n6. ConfigMap & Secret: Injects environment variables and mounted files into pods separating configuration code from container images.",
    "keyConcepts": [
      {
        "title": "Reconciliation Loop (Desired vs Actual State)",
        "explanation": "Controllers continuously query the Kubernetes API server: if actual pod count is 2 and desired is 3, the ReplicaSet controller schedules a new pod to match desired state."
      },
      {
        "title": "Labels and Selectors",
        "explanation": "Decouples objects. Services discover target pods dynamically by querying labels (`app: order-api`) rather than maintaining static IP tables."
      }
    ],
    "diagram": {
      "title": "Kubernetes Ingress, Service, Deployment, and Pod Topology",
      "type": "ascii",
      "code": "External Client\n      |\n[HTTPS: 443]\n      v\n[Ingress Controller (NGINX / Envoy)]\n      |\n  (Host: api.company.com / Path: /v1)\n      v\n[Kubernetes Service (ClusterIP: 10.96.0.45)]\n      |\n  (Label Selector: app=api, tier=backend)\n      |\n  +---+-------------------+\n  |                       |\n  v                       v\n[Pod 1 (10.244.1.12)]   [Pod 2 (10.244.2.19)]\n(Managed by Deployment) (Managed by Deployment)"
    },
    "commands": [
      {
        "cmd": "kubectl get pods -A -o wide",
        "desc": "List all pods across all namespaces with node and IP details",
        "example": "kubectl get pods -A"
      },
      {
        "cmd": "kubectl rollout status deployment/web-app",
        "desc": "Watch rolling update progress of a deployment",
        "example": "kubectl rollout status deployment/app"
      },
      {
        "cmd": "kubectl rollout undo deployment/web-app",
        "desc": "Instantly rollback a deployment to its previous revision",
        "example": "kubectl rollout undo deployment/app"
      },
      {
        "cmd": "kubectl describe pod <pod-name>",
        "desc": "Inspect pod events, container restart reasons, and probe failures",
        "example": "kubectl describe pod mypod"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "production-deployment-service.yaml",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-service\n  namespace: production\n  labels:\n    app: payment-service\nspec:\n  replicas: 3\n  revisionHistoryLimit: 5\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 25%\n      maxUnavailable: 0 # Zero-downtime rolling deploys\n  selector:\n    matchLabels:\n      app: payment-service\n  template:\n    metadata:\n      labels:\n        app: payment-service\n    spec:\n      containers:\n      - name: app\n        image: ghcr.io/company/payment-service:v2.4.1\n        ports:\n        - containerPort: 8080\n        resources:\n          limits:\n            cpu: \"1000m\"\n            memory: \"1Gi\"\n          requests:\n            cpu: \"250m\"\n            memory: \"256Mi\"\n        livenessProbe:\n          httpGet:\n            path: /healthz\n            port: 8080\n          initialDelaySeconds: 10\n          periodSeconds: 10\n        readinessProbe:\n          httpGet:\n            path: /ready\n            port: 8080\n          initialDelaySeconds: 5\n          periodSeconds: 5\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: payment-service\n  namespace: production\nspec:\n  type: ClusterIP\n  selector:\n    app: payment-service\n  ports:\n  - port: 80\n    targetPort: 8080",
      "explanation": "Production Deployment and Service manifests featuring zero-downtime rolling updates, resource limits, and health probes."
    },
    "gotchas": [
      {
        "issue": "Missing readinessProbe causing 502 Bad Gateway during deployments",
        "resolution": "Without a readiness probe, Kubernetes routes traffic to newly spawned pods the moment the container process starts, even if the app takes 15 seconds to connect to databases and warm caches. Always define `readinessProbe`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between a livenessProbe and a readinessProbe?",
        "answer": "A livenessProbe checks if the container is running and healthy; if it fails, the kubelet kills the container and restarts it according to its restartPolicy. A readinessProbe checks if the container is ready to accept incoming network traffic; if it fails, the pod is removed from Service endpoint endpoints without being restarted.",
        "platformContext": "Standard CKA question essential for avoiding production outage loops."
      }
    ],
    "references": [
      {
        "title": "Kubernetes Core Concepts & Objects",
        "url": "https://kubernetes.io/docs/concepts/",
        "source": "Kubernetes.io",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which Kubernetes workload object guarantees that exactly one instance of a pod runs on every worker node in the cluster?",
        "options": [
          "DaemonSet",
          "Deployment",
          "StatefulSet",
          "CronJob"
        ],
        "answerIndex": 0,
        "explanation": "DaemonSets ensure that all (or eligible) nodes run a copy of a pod, commonly used for monitoring and log shipping."
      }
    ]
  },
  {
    "id": "containers-image-repository",
    "slug": "container-image-repositories-registries",
    "pillarId": "containers",
    "branch": "right",
    "order": 2,
    "title": "Image Repository & Registries",
    "subtitle": "Docker Hub, AWS ECR, GitHub Packages (GHCR), Harbor, image signing (Cosign), and immutable tags",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "ECR",
      "Docker Hub",
      "GHCR",
      "Harbor",
      "Cosign",
      "Security"
    ],
    "summary": "Securely store, scan, version, and distribute container images using cloud registries and on-premise private registries with cryptographic provenance.",
    "overview": "Container registries store OCI-compliant container image manifests, layers, and signatures.\n\nKey Registries:\n1. Cloud Registries: AWS Elastic Container Registry (ECR), Google Artifact Registry, Azure Container Registry (ACR). Highly integrated with IAM authentication and KMS encryption at rest.\n2. GitHub Packages (ghcr.io): Tightly coupled with GitHub Actions workflows and repository permissions.\n3. Harbor: CNCF open-source enterprise registry featuring multi-tenant RBAC, automated Trivy scanning, replication policies, and image retention rules.\n\nBest Practices:\n- Tag Immutability: Prevent tags like `v1.0` from being overwritten. In production deployments, pin images by SHA256 digest (`image@sha256:abc...`) rather than mutable tags (`:latest`).\n- Image Signing: Use Sigstore `cosign` to sign images in CI and verify signatures in Kubernetes admission controllers (Kyverno / OPA Gatekeeper).",
    "keyConcepts": [
      {
        "title": "The Dangers of the ':latest' Tag",
        "explanation": "The `:latest` tag is mutable. If two nodes pull `:latest` at different times, they may run completely different application binaries, causing non-reproducible bugs and unpredictable rollbacks."
      },
      {
        "title": "Image Scanning on Push",
        "explanation": "Registries scan newly pushed image layers for known Common Vulnerabilities and Exposures (CVEs) and block deployments if critical vulnerabilities are discovered."
      }
    ],
    "diagram": {
      "title": "Container Image CI/CD & Registry Workflow",
      "type": "ascii",
      "code": "[CI Pipeline: GitHub Actions]\n       |\n       +---> 1. Build & Test Container Binary\n       |\n       +---> 2. Push Image to ECR / GHCR with Commit SHA\n       |\n       +---> 3. Sign Image with Sigstore Cosign\n       |\n       v\n[Container Registry (Harbor / ECR)] (Enforces Tag Immutability & Vulnerability Scan)\n       |\n       v\n[Kubernetes Cluster (Worker Nodes)] (Kubelet pulls image verified by Admission Controller)"
    },
    "commands": [
      {
        "cmd": "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <acc>.dkr.ecr.us-east-1.amazonaws.com",
        "desc": "Authenticate local Docker CLI with AWS ECR",
        "example": "aws ecr get-login-password ..."
      },
      {
        "cmd": "cosign sign --key cosign.key ghcr.io/org/app:v1.0.0",
        "desc": "Cryptographically sign container image using Cosign",
        "example": "cosign sign ..."
      },
      {
        "cmd": "docker image inspect --format='{{index .RepoDigests 0}}' nginx",
        "desc": "Extract immutable SHA256 digest of pulled image",
        "example": "docker image inspect ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "github-actions-push-ecr.yml",
      "code": "# Production GitHub Actions workflow building and pushing image to AWS ECR with immutable tags\nname: Build and Push to ECR\non:\n  push:\n    tags: ['v*']\n\njobs:\n  build-push:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Configure AWS Credentials via OIDC\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::123456789012:role/github-actions-ecr\n          aws-region: us-east-1\n\n      - name: Login to Amazon ECR\n        id: login-ecr\n        uses: aws-actions/amazon-ecr-login@v2\n\n      - name: Build, tag, and push image to Amazon ECR\n        env:\n          REGISTRY: ${{ steps.login-ecr.outputs.registry }}\n          REPOSITORY: platform-api\n          IMAGE_TAG: ${{ github.sha }}\n        run: |\n          docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG -t $REGISTRY/$REPOSITORY:${{ github.ref_name }} .\n          docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG\n          docker push $REGISTRY/$REPOSITORY:${{ github.ref_name }}",
      "explanation": "Authenticates to AWS ECR using OIDC, builds the image, and pushes with immutable Git SHA and release tags."
    },
    "gotchas": [
      {
        "issue": "Docker Hub anonymous pull rate limiting breaking production node autoscaling",
        "resolution": "Docker Hub enforces 100 pulls per 6 hours for unauthenticated requests. When Kubernetes autoscales 50 nodes, pulls fail with `toomanyrequests: 429`. Mirror critical public images into private ECR/Harbor registries.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why should Kubernetes manifests deploy images using SHA256 digests instead of tags?",
        "answer": "Tags are mutable pointers that can be overwritten or tampered with in registries. SHA256 digests are immutable content-addressable hashes of the image manifest, guaranteeing every pod runs the exact bit-for-bit verified binary.",
        "platformContext": "Required for compliance in banking, defense, and high-security platform engineering."
      }
    ],
    "references": [
      {
        "title": "Open Container Initiative Distribution Spec",
        "url": "https://github.com/opencontainers/distribution-spec",
        "source": "OCI",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What ensures that a pushed container image tag (e.g. v1.2.0) cannot be deleted or overwritten with a different binary?",
        "options": [
          "Tag Immutability Policy",
          "Image Pruning",
          "Docker Swarm",
          "Multi-stage building"
        ],
        "answerIndex": 0,
        "explanation": "Tag Immutability policies enforced by the registry reject any subsequent push to an existing tag."
      }
    ]
  },
  {
    "id": "containers-security-practices",
    "slug": "container-security-practices-hardening",
    "pillarId": "containers",
    "branch": "right",
    "order": 3,
    "title": "Container Security Practices",
    "subtitle": "Non-root users, distroless images, read-only root filesystems, dropping capabilities, and Trivy scans",
    "level": "Advanced",
    "estimatedMinutes": 25,
    "tags": [
      "Container Security",
      "Distroless",
      "Trivy",
      "SecurityContext",
      "Least Privilege"
    ],
    "summary": "Hardening containers against breakout attacks, eliminating attack surfaces with minimal distroless bases, enforcing read-only filesystems, and scanning for vulnerabilities in CI.",
    "overview": "Containers do not provide virtualization boundaries\u2014they share the host kernel. Hardening container configurations prevents container breakouts.\n\nSecurity Best Practices:\n1. Never Run as Root:\n   - Set `USER 10001:10001` in Dockerfiles and `runAsNonRoot: true` in Kubernetes security contexts.\n2. Minimal Base Images (Distroless / Scratch):\n   - Google Distroless images contain only the compiled application and minimal runtime dependencies\u2014no shell (`/bin/sh`), no package manager (`apt`/`apk`), and no basic utilities. Attackers cannot spawn reverse shells if a shell binary does not exist.\n3. Read-Only Root Filesystem:\n   - Set `readOnlyRootFilesystem: true`. Prevents malware from downloading or modifying executables. Use ephemeral `tmpfs` mounts for temporary scratch writes.\n4. Drop Linux Capabilities:\n   - Docker grants containers a default set of capabilities (like `CHOWN`, `KILL`, `NET_BIND_SERVICE`). Drop all capabilities (`drop: [\"ALL\"]`) and add back only strictly necessary ones.\n5. Vulnerability Scanning:\n   - Integrate Trivy or Grype in CI to reject builds with High/Critical CVEs.",
    "keyConcepts": [
      {
        "title": "Linux Capabilities Dropping",
        "explanation": "Linux divides root privileges into granular capabilities. Dropping all capabilities prevents containers from altering system time, creating raw sockets, or loading kernel modules."
      },
      {
        "title": "Distroless Execution",
        "explanation": "Eliminating shells and package managers reduces container size by 90% and removes 95%+ of CVE vulnerabilities from common OS packages."
      }
    ],
    "diagram": {
      "title": "Defense-in-Depth Container Hardening",
      "type": "ascii",
      "code": "+-------------------------------------------------------------+\n|                 Host Linux Kernel                           |\n+-------------------------------------------------------------+\n  ^  (Seccomp & AppArmor Profiles restrict dangerous syscalls)\n  |\n+-------------------------------------------------------------+\n|                 Hardened Container Pod                      |\n|  - Non-Root UID: 10001                                       |\n|  - Capabilities: ALL Dropped                                |\n|  - Root Filesystem: READ-ONLY (readOnlyRootFilesystem: true)|\n|  - Scratch Memory: tmpfs mounted on /tmp                    |\n|  - Image Base: Distroless (No shell, no apt, no curl)       |\n+-------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "trivy image --severity HIGH,CRITICAL nginx:alpine",
        "desc": "Scan container image for High and Critical vulnerabilities",
        "example": "trivy image myapp:latest"
      },
      {
        "cmd": "docker run --rm --read-only --tmpfs /tmp myapp:v1",
        "desc": "Run container with read-only root filesystem and in-memory tmpfs",
        "example": "docker run --read-only ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "hardened-security-context.yaml",
      "code": "# Production Kubernetes Pod SecurityContext enforcing CIS Benchmark compliance\napiVersion: v1\nkind: Pod\nmetadata:\n  name: secure-microservice\nspec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 10001\n    runAsGroup: 10001\n    fsGroup: 10001\n    seccompProfile:\n      type: RuntimeDefault\n  containers:\n  - name: app\n    image: gcr.io/distroless/static-debian12:nonroot\n    securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop:\n        - ALL\n    volumeMounts:\n    - mountPath: /tmp\n      name: temp-scratch\n  volumes:\n  - name: temp-scratch\n    emptyDir:\n      medium: Memory # In-memory tmpfs mount for temporary scratch files",
      "explanation": "Strict Kubernetes security context dropping all Linux capabilities, enforcing non-root execution, and setting root filesystem to read-only."
    },
    "gotchas": [
      {
        "issue": "Application crashes when readOnlyRootFilesystem is enabled",
        "resolution": "Many web frameworks write temporary logs or cache files to `/tmp` or `/var/run`. When rootfs is read-only, write calls fail with `Read-only file system`. Mount an in-memory `emptyDir` volume at `/tmp` to resolve this.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is allowPrivilegeEscalation: false in a Kubernetes SecurityContext?",
        "answer": "It controls whether a process in the container can gain more privileges than its parent process (governed by the `no_new_privs` kernel flag). Setting it to false blocks SUID binaries (like `sudo` or `ping`) from escalating privileges to root.",
        "platformContext": "Tested in CKS (Certified Kubernetes Security Specialist) examinations."
      }
    ],
    "references": [
      {
        "title": "Kubernetes Pod Security Standards",
        "url": "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
        "source": "Kubernetes.io",
        "type": "official"
      },
      {
        "title": "Aqua Security Trivy Scanner",
        "url": "https://trivy.dev/",
        "source": "Trivy",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Why do Google Distroless images significantly enhance container security?",
        "options": [
          "They contain no shell or package managers, making command execution and payload downloading impossible",
          "They bypass the Linux kernel entirely",
          "They run exclusively in kernel space",
          "They automatically disable all TCP ports"
        ],
        "answerIndex": 0,
        "explanation": "Distroless images strip shells (/bin/sh) and package managers, drastically reducing the attack surface."
      }
    ]
  },
  {
    "id": "containers-service-mesh",
    "slug": "service-mesh-istio-linkerd-envoy-mtls",
    "pillarId": "containers",
    "branch": "right",
    "order": 4,
    "title": "Service Mesh (Istio, Linkerd)",
    "subtitle": "Envoy sidecar proxies, mutual TLS (mTLS), canary traffic shifting, and distributed tracing",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "Service Mesh",
      "Istio",
      "Linkerd",
      "Envoy",
      "mTLS",
      "Canary"
    ],
    "summary": "Manage service-to-service communication, enforce zero-trust cryptographic mutual TLS encryption, split canary traffic dynamically, and inject observability without changing application code.",
    "overview": "As architectures scale to hundreds of microservices, managing network retries, circuit breaking, security encryption, and distributed tracing inside application libraries becomes unmaintainable. A Service Mesh delegates these network concerns to the infrastructure layer.\n\nArchitecture:\n1. Data Plane: High-performance proxies (usually Envoy) injected alongside every application container as a sidecar. Intercepts all inbound and outbound TCP/HTTP traffic.\n2. Control Plane (Istiod): Translates high-level declarative routing policies into dynamic configuration rules pushed to Envoy proxies.\n\nKey Capabilities:\n- Mutual TLS (mTLS): Automatic zero-trust encryption and cryptographic identity validation between pods without certificate management in code.\n- Traffic Management: Canary releases (route 10% traffic to `v2`, 90% to `v1`), fault injection, and circuit breaking.\n- Observability: Automatic generation of golden signal metrics (latency, error rates, throughput) and W3C distributed trace header propagation.",
    "keyConcepts": [
      {
        "title": "Sidecar Proxy Pattern",
        "explanation": "The Envoy proxy runs inside the same pod network namespace as the application, capturing localhost traffic via iptables redirects without requiring SDK changes in application code."
      },
      {
        "title": "Circuit Breaking",
        "explanation": "If a downstream microservice begins failing or responding slowly, the proxy trips the circuit, failing fast and protecting upstream callers from cascading failures."
      }
    ],
    "diagram": {
      "title": "Service Mesh Data Plane Traffic Interception",
      "type": "ascii",
      "code": "[Pod: Order-Service]                             [Pod: Payment-Service]\n+--------------------------------+               +--------------------------------+\n| [Application Container]        |               | [Application Container]        |\n|               |                |               |               ^                |\n|       (Localhost 8080)         |               |       (Localhost 8080)         |\n|               v                |               |               |                |\n| [Envoy Sidecar Proxy]          | ===(mTLS)===> | [Envoy Sidecar Proxy]          |\n+--------------------------------+  (Port 15001) +--------------------------------+\n                ^                                                ^\n                | (Pushes Configuration & Certificates)          |\n+----------------------------------------------------------------+\n|                 Control Plane (Istiod)                         |\n+----------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "istioctl analyze -n default",
        "desc": "Validate Istio configuration and diagnose routing conflicts",
        "example": "istioctl analyze"
      },
      {
        "cmd": "istioctl proxy-status",
        "desc": "Check sync status between Istiod control plane and Envoy sidecars",
        "example": "istioctl proxy-status"
      },
      {
        "cmd": "kubectl get virtualservices,destinationrules -A",
        "desc": "List all active Istio traffic routing resources",
        "example": "kubectl get vs,dr"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "istio-canary-virtualservice.yaml",
      "code": "# Production Istio VirtualService executing a 90/10 Canary Traffic Split\napiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: recommendation-service\n  namespace: default\nspec:\n  hosts:\n  - recommendation-service\n  http:\n  - route:\n    - destination:\n        host: recommendation-service\n        subset: v1\n      weight: 90\n    - destination:\n        host: recommendation-service\n        subset: v2\n      weight: 10\n---\napiVersion: networking.istio.io/v1alpha3\nkind: DestinationRule\nmetadata:\n  name: recommendation-service\n  namespace: default\nspec:\n  hosts: recommendation-service\n  trafficPolicy:\n    tls:\n      mode: ISTIO_MUTUAL # Enforce mTLS encryption\n  subsets:\n  - name: v1\n    labels:\n      version: 1.0.0\n  - name: v2\n    labels:\n      version: 2.0.0",
      "explanation": "Declarative traffic routing splitting 10% of live traffic to canary version `v2` while enforcing strict mTLS encryption."
    },
    "gotchas": [
      {
        "issue": "Memory and latency overhead introduced by sidecar proxies",
        "resolution": "Injecting Envoy proxies into thousands of pods adds ~2-5ms of latency and consumes 50MB+ RAM per sidecar. For latency-sensitive microservices, evaluate Ambient Mesh (sidecar-less Istio) or Linkerd.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between an Ingress Controller and a Service Mesh?",
        "answer": "An Ingress Controller manages north-south traffic (traffic entering the cluster from the external internet to internal services). A Service Mesh manages east-west traffic (internal communication between microservices within the cluster), providing mTLS, traffic splitting, and tracing.",
        "platformContext": "Common architectural design question in enterprise cloud engineering."
      }
    ],
    "references": [
      {
        "title": "Istio Official Documentation",
        "url": "https://istio.io/latest/docs/",
        "source": "Istio",
        "type": "official"
      },
      {
        "title": "Linkerd Architecture",
        "url": "https://linkerd.io/2/overview/",
        "source": "Linkerd",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which open-source C++ proxy is the industry standard data plane engine utilized by Istio?",
        "options": [
          "Envoy",
          "Apache HTTPD",
          "Squid",
          "Varnish"
        ],
        "answerIndex": 0,
        "explanation": "Envoy is the high-performance CNCF proxy powering Istio's sidecar data plane."
      }
    ]
  },
  {
    "id": "containers-what-is-it",
    "slug": "what-is-it-container-fundamentals-namespaces-cgroups",
    "pillarId": "containers",
    "branch": "left",
    "order": 5,
    "title": "What is it? Container Fundamentals",
    "subtitle": "Linux namespaces (PID, NET, MNT), cgroups v2, chroot/pivot_root, and Containers vs VMs",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Containers",
      "Namespaces",
      "cgroups",
      "chroot",
      "OCI",
      "Kernel Primitives"
    ],
    "summary": "Understand how containers actually work: they are regular Linux processes isolated by kernel primitives (namespaces and control groups) rather than virtual machines.",
    "overview": "A container is NOT a virtual machine. There is no hypervisor, virtual hardware, or guest operating system kernel. A container is a standard Linux process running directly on the host kernel, isolated by three foundational kernel primitives:\n\n1. Linux Namespaces (What a process can SEE):\n   - `pid`: Isolates process IDs (container sees its entrypoint as PID 1).\n   - `net`: Isolates network devices, routing tables, and port bindings.\n   - `mnt`: Isolates filesystem mount points.\n   - `ipc`: Isolates inter-process communication.\n   - `uts`: Isolates hostname and NIS domain.\n   - `user`: Maps container UIDs to unprivileged host UIDs.\n2. Control Groups (cgroups v2 - What a process can USE):\n   - Throttles and limits resource consumption (CPU shares/bandwidth, memory limits, block I/O, PID count).\n   - If a container exceeds its memory limit, the kernel OOM-killer terminates the process.\n3. Pivot_root / Chroot (What a process's FILESYSTEM looks like):\n   - Changes the apparent root directory `/` of the process to the container's unpacked image layer.",
    "keyConcepts": [
      {
        "title": "Containers vs Virtual Machines",
        "explanation": "Virtual machines run a hypervisor (Type 1 or 2) emulating hardware and boot full guest OS kernels (gigabytes of RAM, minutes to boot). Containers share the host kernel, starting in milliseconds with near-zero overhead."
      },
      {
        "title": "cgroups v2 Unified Hierarchy",
        "explanation": "cgroups v2 replaces legacy multiple hierarchies with a unified filesystem tree (`/sys/fs/cgroup`), supporting accurate out-of-memory accounting and memory pressure stall information (PSI)."
      }
    ],
    "diagram": {
      "title": "Virtual Machines vs Containers Architecture",
      "type": "ascii",
      "code": "       VIRTUAL MACHINES                                CONTAINERS\n+----------------------------+                +----------------------------+\n| App A   | App B   | App C  |                | App A   | App B   | App C  |\n+---------+---------+--------+                +---------+---------+--------+\n| Guest OS| Guest OS| Guest OS                | Container Engine (runc)    |\n| (Kernel)| (Kernel)| (Kernel)                +----------------------------+\n+---------+---------+--------+                |  Namespaces & cgroups v2   |\n| Hypervisor (KVM / ESXi)    |                +----------------------------+\n+----------------------------+                |    Single Host Kernel      |\n| Physical Server Hardware   |                | Physical Server Hardware   |\n+----------------------------+                +----------------------------+"
    },
    "commands": [
      {
        "cmd": "ls -l /proc/$$/ns",
        "desc": "Inspect kernel namespaces associated with current shell process",
        "example": "ls -l /proc/$$/ns"
      },
      {
        "cmd": "cat /proc/1/cgroup",
        "desc": "Check if current process is running inside a container cgroup",
        "example": "cat /proc/1/cgroup"
      },
      {
        "cmd": "sudo unshare --fork --pid --mount-proc bash",
        "desc": "Manually create an isolated PID namespace and spawn a shell",
        "example": "unshare --fork ..."
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "detect-container-runtime.sh",
      "code": "#!/usr/bin/env bash\n# Script detecting if execution environment is a physical host, VM, or container\nset -euo pipefail\n\necho \"=== [Runtime Environment Detection] ===\"\nif [ -f /.dockerenv ]; then\n  echo \"Environment: Docker Container (found /.dockerenv)\"\nelif grep -qa container= /proc/1/environ 2>/dev/null; then\n  echo \"Environment: Containerized Process (detected in /proc/1/environ)\"\nelif [ -f /run/systemd/container ]; then\n  echo \"Environment: systemd-nspawn Container\"\nelse\n  VIRT=$(systemd-detect-virt 2>/dev/null || echo \"none\")\n  if [ \"${VIRT}\" != \"none\" ]; then\n    echo \"Environment: Virtual Machine (Hypervisor: ${VIRT})\"\n  else\n    echo \"Environment: Bare Metal Physical Host\"\n  fi\nfi\n\necho \"cgroup Version: $(mount | grep cgroup2 >/dev/null && echo 'v2' || echo 'v1')\"",
      "explanation": "Inspects `/proc` virtual files and cgroup mount states to determine whether the shell runs in bare metal, VM, or a container."
    },
    "gotchas": [
      {
        "issue": "Old JVM versions in containers misinterpreting host CPU/RAM",
        "resolution": "Java 8 before update 191 read `/proc/meminfo` (the host hardware) instead of cgroup limits. A JVM in a 512MB container would allocate a 16GB heap based on host RAM and immediately get OOMKilled. Always use modern runtimes with cgroup awareness.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What kernel mechanisms in Linux make containers possible?",
        "answer": "Linux Namespaces (which isolate process visibility including PID, Network, Mounts, IPC, and UTS) and Control Groups (cgroups, which throttle and enforce limits on CPU, Memory, and I/O resources), combined with copy-on-write filesystems (OverlayFS).",
        "platformContext": "The most fundamental interview question in container and platform engineering."
      }
    ],
    "references": [
      {
        "title": "Linux Namespaces Man Page",
        "url": "https://man7.org/linux/man-pages/man7/namespaces.7.html",
        "source": "man7.org",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which Linux kernel feature enforces CPU and Memory resource limits on a container?",
        "options": [
          "Control Groups (cgroups)",
          "Namespaces",
          "chroot",
          "Netfilter"
        ],
        "answerIndex": 0,
        "explanation": "cgroups (Control Groups) meter, monitor, and limit hardware resource usage such as CPU and RAM."
      }
    ]
  },
  {
    "id": "containers-docker",
    "slug": "docker-architecture-dockerfile-multistage-builds",
    "pillarId": "containers",
    "branch": "left",
    "order": 6,
    "title": "Docker & Multi-Stage Builds",
    "subtitle": "Docker daemon, Dockerfile directives, layer caching, multi-stage builds, and .dockerignore",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Docker",
      "Dockerfile",
      "Multi-stage Builds",
      "Layer Caching",
      "Containers"
    ],
    "summary": "Build lean, production-ready container images using multi-stage builds, optimize layer caching, and eliminate build-time compilers from runtime artifacts.",
    "overview": "Docker standardized container images via the Open Container Initiative (OCI) image specification.\n\nKey Concepts:\n1. Docker Architecture: Client CLI communicates with the background `dockerd` daemon via a Unix socket (`/var/run/docker.sock`) or TCP.\n2. Image Layers: Each `RUN`, `COPY`, and `ADD` directive in a `Dockerfile` creates a read-only filesystem layer. Layers are cached based on file checksums.\n3. Multi-Stage Builds: The most important pattern for production containers. Compilers, SDKs, test tools, and source code live in early builder stages. Only the final compiled binary is copied into a clean minimal runtime image (Distroless or Alpine).\n4. Essential Directives:\n   - `FROM`: Sets the base image.\n   - `WORKDIR`: Sets working directory (creates it if missing).\n   - `COPY`: Copies files from host into image (always pair with `.dockerignore`).\n   - `ENTRYPOINT` vs `CMD`: `ENTRYPOINT` specifies the fixed binary executable; `CMD` specifies default arguments that can be overridden.",
    "keyConcepts": [
      {
        "title": "Optimizing Layer Caching",
        "explanation": "Order Dockerfile instructions from least frequently changed to most frequently changed. Copy dependency manifests (`package.json`, `go.mod`) and install dependencies BEFORE copying application source code."
      },
      {
        "title": "Multi-Stage Build Size Reduction",
        "explanation": "A Go or Rust container built in a single stage with the full compiler can weigh 1.2GB. Splitting into a builder stage and copying the binary to `scratch` reduces the final image to under 20MB."
      }
    ],
    "diagram": {
      "title": "Multi-Stage Docker Build Flow",
      "type": "ascii",
      "code": "[Stage 1: Builder (golang:1.24-alpine)] (1.1 GB Image)\n  - Installs git, compilers, linters\n  - Compiles Go source code into static binary: /app/server\n  - Runs unit tests\n            |\n            v (COPY --from=builder /app/server /server)\n[Stage 2: Final Runtime (gcr.io/distroless/static)] (18 MB Image)\n  - Contains ONLY the compiled /server binary & CA certificates\n  - Zero build tools, zero shell, zero package manager!"
    },
    "commands": [
      {
        "cmd": "docker build -t myapp:v1.0 .",
        "desc": "Build container image from local Dockerfile",
        "example": "docker build -t app ."
      },
      {
        "cmd": "docker history --human myapp:v1.0",
        "desc": "Inspect size and commands that produced each image layer",
        "example": "docker history image"
      },
      {
        "cmd": "docker system prune -af --volumes",
        "desc": "Clean up unused images, stopped containers, build caches, and volumes",
        "example": "docker system prune -af"
      }
    ],
    "productionCode": {
      "language": "dockerfile",
      "filename": "Dockerfile",
      "code": "# Production Multi-Stage Dockerfile for Go Microservice\n# Stage 1: Build & compile static binary\nFROM golang:1.24-alpine AS builder\nWORKDIR /src\n\n# Cache dependencies layer\nCOPY go.mod go.sum ./\nRUN go mod download\n\n# Copy source code and build\nCOPY . .\nRUN CGO_ENABLED=0 GOOS=linux go build -ldflags=\"-w -s\" -o /bin/api .\n\n# Stage 2: Minimal runtime using Distroless non-root image\nFROM gcr.io/distroless/static-debian12:nonroot\nWORKDIR /app\n\nCOPY --from=builder /bin/api /app/api\n\nUSER 65532:65532\nEXPOSE 8080\n\nENTRYPOINT [\"/app/api\"]",
      "explanation": "Multi-stage Dockerfile that caches dependencies and copies a stripped binary into an unprivileged Google Distroless runtime image."
    },
    "gotchas": [
      {
        "issue": "Missing .dockerignore copying node_modules or .git into build context",
        "resolution": "Without a `.dockerignore` file, `COPY . .` copies gigabytes of local `.git` history and host-specific `node_modules` into the Docker daemon, drastically slowing builds and creating invalid layer caches.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between ENTRYPOINT and CMD in a Dockerfile?",
        "answer": "ENTRYPOINT defines the executable to be run when the container starts. CMD defines default arguments passed to the ENTRYPOINT, which can be easily overridden by passing arguments at runtime (`docker run myimage <override_args>`).",
        "platformContext": "Fundamental Docker knowledge evaluated in all DevOps screenings."
      }
    ],
    "references": [
      {
        "title": "Docker Best Practices Guide",
        "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
        "source": "Docker",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Why should dependency manifests (like package.json or go.mod) be copied and installed before copying source code in a Dockerfile?",
        "options": [
          "To leverage Docker's layer cache so dependencies are not reinstalled on every source code edit",
          "Because Docker requires files in alphabetical order",
          "To reduce RAM during compilation",
          "To enable multi-threading"
        ],
        "answerIndex": 0,
        "explanation": "Docker invalidates cache for subsequent layers if copied files change. Isolating dependency installs keeps heavy downloads cached when modifying code."
      }
    ]
  },
  {
    "id": "containers-docker-compose",
    "slug": "docker-compose-multi-container-orchestration",
    "pillarId": "containers",
    "branch": "left",
    "order": 7,
    "title": "Docker Compose",
    "subtitle": "Multi-container local development, compose.yaml spec, networks, volumes, and healthchecks",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Docker Compose",
      "compose.yaml",
      "Local Dev",
      "Networking",
      "Volumes"
    ],
    "summary": "Orchestrate multi-container application stacks locally using declarative YAML specs, user-defined bridge networks, and dependency health checks.",
    "overview": "Docker Compose defines and runs multi-container Docker applications via a single `compose.yaml` (or `docker-compose.yml`) file.\n\nKey Concepts:\n1. Services: Containers instantiated from an `image` or `build` context.\n2. Automatic DNS & Networking: Compose automatically provisions a dedicated user-defined bridge network. Services discover each other by service name (e.g. `web` connects to `database:5432`).\n3. Volumes: Persist data across container restarts (e.g. PostgreSQL data directory).\n4. Environment Configuration: Loads `.env` files automatically.\n5. Service Dependencies (`depends_on` with condition `service_healthy`):\n   - Ensures backend services do not launch until database containers pass active health checks.",
    "keyConcepts": [
      {
        "title": "Built-in Service Discovery",
        "explanation": "Services defined in the same compose file communicate over service names as DNS hostnames without manually assigning or mapping ports."
      },
      {
        "title": "Healthcheck-based Ordering",
        "explanation": "Using `depends_on: { condition: service_healthy }` prevents race conditions where an API container boots and crashes because the database is still initializing its schema."
      }
    ],
    "diagram": {
      "title": "Docker Compose Isolated Bridge Network",
      "type": "ascii",
      "code": "+-------------------------------------------------------------------------+\n|               User-Defined Docker Bridge Network (app_net)              |\n+-------------------------------------------------------------------------+\n|  [Service: web-api]   ======(DNS: db:5432)=====>   [Service: db]        |\n|  - Port: 8080:8080                                  - Image: postgres:16 |\n|  - Environment from .env                            - Volume: pgdata     |\n|  - Waits for db healthy                             - Port: 5432 (local) |\n+-------------------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "docker compose up -d",
        "desc": "Build and start all services in detached background mode",
        "example": "docker compose up -d"
      },
      {
        "cmd": "docker compose logs -f web-api",
        "desc": "Follow and stream live logs for specific service",
        "example": "docker compose logs -f"
      },
      {
        "cmd": "docker compose down -v",
        "desc": "Stop containers, destroy networks, and remove named persistent volumes",
        "example": "docker compose down -v"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "compose.yaml",
      "code": "# Production-ready Docker Compose stack with healthchecks and persistent volumes\nservices:\n  postgres:\n    image: postgres:16-alpine\n    container_name: postgres-db\n    environment:\n      POSTGRES_DB: app_db\n      POSTGRES_USER: postgres\n      POSTGRES_PASSWORD: securepassword123\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - \"127.0.0.1:5432:5432\"\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n    networks:\n      - internal_net\n\n  api:\n    build: .\n    container_name: backend-api\n    environment:\n      DATABASE_URL: postgres://postgres:securepassword123@postgres:5432/app_db\n    ports:\n      - \"8080:8080\"\n    depends_on:\n      postgres:\n        condition: service_healthy\n    networks:\n      - internal_net\n\nvolumes:\n  pgdata:\n\nnetworks:\n  internal_net:\n    driver: bridge",
      "explanation": "Defines an API and PostgreSQL stack ensuring the API waits for PostgreSQL to be completely initialized via `condition: service_healthy`."
    },
    "gotchas": [
      {
        "issue": "Exposing internal databases on 0.0.0.0:5432 on public servers",
        "resolution": "Specifying `ports: [\"5432:5432\"]` binds the database to all network interfaces on the host, exposing it to the public internet. Always bind to localhost: `ports: [\"127.0.0.1:5432:5432\"]`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does basic depends_on differ from depends_on with condition: service_healthy in Docker Compose?",
        "answer": "Basic `depends_on` only waits for the dependency container to start its process. `condition: service_healthy` waits until the dependency's configured healthcheck command succeeds, guaranteeing the service is fully ready to accept queries.",
        "platformContext": "Standard local development reliability best practice."
      }
    ],
    "references": [
      {
        "title": "Docker Compose Specification",
        "url": "https://docs.docker.com/compose/compose-file/",
        "source": "Docker",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "How do containers in the same Docker Compose network resolve each other's network addresses?",
        "options": [
          "Using the Compose service name as an automatic DNS hostname",
          "By manually querying the host's /etc/hosts file",
          "Via hardcoded MAC addresses",
          "By broadcasting ARP requests on eth0"
        ],
        "answerIndex": 0,
        "explanation": "Docker Compose provisions an embedded DNS server that resolves service names directly."
      }
    ]
  },
  {
    "id": "containers-mounting-volumes",
    "slug": "mounting-volumes-bind-mounts-named-volumes-tmpfs",
    "pillarId": "containers",
    "branch": "left",
    "order": 8,
    "title": "Mounting Volumes",
    "subtitle": "Named volumes, bind mounts, tmpfs in-memory mounts, and container file permissions",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Volumes",
      "Bind Mounts",
      "tmpfs",
      "Storage",
      "Docker"
    ],
    "summary": "Persist container data beyond container lifecycle destructions, synchronize local code into live containers, and isolate ephemeral memory with tmpfs.",
    "overview": "Containers have an ephemeral writable layer: when a container is deleted, all files created inside that layer are permanently destroyed. Volumes decouple storage from the container lifecycle.\n\nThree Storage Types in Docker:\n1. Named Volumes:\n   - Managed entirely by Docker in host storage (`/var/lib/docker/volumes/`).\n   - Best choice for database persistence and production workloads.\n   - High performance, decoupled from host directory structures, and easily backed up.\n2. Bind Mounts:\n   - Directly mounts an arbitrary directory or file from the host filesystem into the container (`/home/user/code:/app`).\n   - Ideal for local development (hot-reloading source code).\n   - Dependent on host directory paths and UID/GID permissions.\n3. tmpfs Mounts:\n   - Stored purely in host system RAM, never written to disk.\n   - Ideal for storing transient sensitive credentials or performance-critical scratch data.",
    "keyConcepts": [
      {
        "title": "Named Volumes vs Bind Mounts",
        "explanation": "Named volumes are managed by the container runtime and isolated from host path changes. Bind mounts link directly to host filesystem paths, carrying security and permission risks."
      },
      {
        "title": "File Permission Mapping (UID/GID)",
        "explanation": "Files created by a container process inherit the UID of that container process. If container runs as UID 10001, files created on a bind mount are owned by UID 10001 on the host."
      }
    ],
    "diagram": {
      "title": "Docker Mount Types Comparison",
      "type": "ascii",
      "code": "                   [Container File System: /app]\n                                 |\n       +-------------------------+-------------------------+\n       |                         |                         |\n       v                         v                         v\n[Named Volume]            [Bind Mount]              [tmpfs Mount]\n/var/lib/docker/volumes/  /home/user/project/       Host System RAM\n(Managed & Persistent)   (Host Path Dependent)      (Never touches disk)"
    },
    "commands": [
      {
        "cmd": "docker volume create db_storage",
        "desc": "Create a new managed named Docker volume",
        "example": "docker volume create myvol"
      },
      {
        "cmd": "docker volume ls",
        "desc": "List all named volumes on host",
        "example": "docker volume ls"
      },
      {
        "cmd": "docker run -v db_storage:/var/lib/postgresql/data postgres",
        "desc": "Attach named volume to container mount point",
        "example": "docker run -v vol:/path image"
      },
      {
        "cmd": "docker run -v $(pwd):/app -w /app node:20 npm test",
        "desc": "Bind mount current directory into container for testing",
        "example": "docker run -v $(pwd):/app ..."
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "backup-named-volume.sh",
      "code": "#!/usr/bin/env bash\n# Backup a production Docker named volume to a compressed tarball using a scratch container\nset -euo pipefail\n\nVOLUME_NAME=\"${1:-db_storage}\"\nBACKUP_DIR=\"/var/backups/volumes\"\nmkdir -p \"${BACKUP_DIR}\"\n\nOUTPUT_FILE=\"${BACKUP_DIR}/${VOLUME_NAME}_$(date +%F).tar.gz\"\n\necho \"Backing up volume '${VOLUME_NAME}' to ${OUTPUT_FILE}...\"\n\n# Run lightweight Alpine container mounting target volume and host backup directory\ndocker run --rm \\\n  -v \"${VOLUME_NAME}:/volume-data:ro\" \\\n  -v \"${BACKUP_DIR}:/backup\" \\\n  alpine:latest \\\n  tar -czf \"/backup/$(basename \"${OUTPUT_FILE}\")\" -C /volume-data .\n\necho \"Volume backup completed successfully!\"",
      "explanation": "Safely creates a consistent compressed backup of a named Docker volume using an ephemeral helper container."
    },
    "gotchas": [
      {
        "issue": "Bind mounting an empty host directory over an image directory hides files",
        "resolution": "If an image has files in `/app` and you bind-mount an empty host directory over `/app`, the image's files become completely hidden by the mount. Named volumes, by contrast, automatically populate with the image's files on first initialization.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What happens to data in a Docker named volume when the container using it is removed?",
        "answer": "The data persists completely untouched. Named volumes exist independently of container lifecycles and can be reattached to new container instances. They must be explicitly deleted using `docker volume rm`.",
        "platformContext": "Fundamental storage concept across container operations."
      }
    ],
    "references": [
      {
        "title": "Docker Volumes Documentation",
        "url": "https://docs.docker.com/storage/volumes/",
        "source": "Docker",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which Docker mount type stores data exclusively in host memory (RAM) and never writes to disk?",
        "options": [
          "tmpfs mount",
          "Named volume",
          "Bind mount",
          "NFS mount"
        ],
        "answerIndex": 0,
        "explanation": "tmpfs mounts are kept strictly in system RAM for ephemeral or highly sensitive credentials."
      }
    ]
  }
];
