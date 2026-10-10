// Core curriculum syllabus; existing guide IDs preserve reading progress and links.
import type { StudyPlan } from '@/types/study-plan';

export const STUDY_PLAN: StudyPlan = {
  "title": "Platform Engineering: Beginner to Expert",
  "reviewedAt": "2026-10-10",
  "scope": "A comprehensive syllabus for the core platform engineering discipline, with explicit advanced and specialist extensions. It is a study and practice plan, not a claim that a finite checklist covers every vendor implementation or proves production expertise.",
  "studyMethod": [
    "Work in stage order. Module prerequisites identify skills to demonstrate before starting; experienced learners may skip reading only after passing the relevant lab and exit criteria.",
    "For each module: explain the model, complete the linked reading, build the lab, inject a failure, diagnose it from evidence, recover, and write a short runbook or ADR.",
    "Keep a portfolio repository containing code, tests, diagrams, assumptions, commands with explanations, measurements, failure evidence, recovery steps, and cleanup instructions.",
    "Use one primary cloud and a local disposable environment first. Compare alternative providers and tools after understanding the shared concepts; review costs and tear down unused resources.",
    "Treat advanced material as required for the expert path. Specialization adds depth after the core path; it does not replace foundations, security, data integrity, or reliability.",
    "Existing guide completion tracks reading only. Plan labs, capstones, and expert review are additional evidence and are not silently counted by the app certificate.",
    "Use documentation for the exact installed version, API feature state, controller/driver support, deprecations, and support window. Version-specific guide titles are starting points, not an assertion that a named release is still current."
  ],
  "stages": [
    {
      "id": "foundations",
      "title": "Computing and engineering foundations",
      "level": "Beginner",
      "goal": "Build the vocabulary and coding skills needed to understand infrastructure instead of memorizing commands.",
      "entryRequirements": [
        "No prior infrastructure experience required.",
        "Use an isolated Linux VM or disposable local container lab, a code editor, Git, and a notes repository."
      ],
      "capstone": "Build a small HTTP service with a CLI, tests, structured logs, SQL persistence, and a reproducible setup. Commit the source, runbook, and failure tests.",
      "exitCriteria": [
        "Explain what happens from command execution to an HTTP response.",
        "Write, test, and review a script without copying an unexplained solution.",
        "Recover a mistaken Git change without losing work.",
        "Show both successful and failed API/database interactions with useful diagnostics."
      ],
      "modules": [
        {
          "id": "computing",
          "title": "Computer, operating system, and application fundamentals",
          "prerequisites": [],
          "core": [
            "CPU instructions, RAM, disks, binary units, and latency scales.",
            "Kernel versus user space; processes, threads, files, devices, and system calls.",
            "What an application, library, runtime, compiler, package, and service do.",
            "Client/server boundaries; requests, responses, state, and resource ownership."
          ],
          "advanced": [
            "Virtualization versus containers; hypervisors, VM images, hardware architectures, and emulation.",
            "Basic algorithmic complexity and why unbounded loops, scans, and allocations matter."
          ],
          "edgeCases": [
            "Bytes versus bits and decimal versus binary storage sizes.",
            "A process running does not imply its service is healthy.",
            "Wall-clock time can change; elapsed time needs a monotonic clock."
          ],
          "lab": "Draw the path of a request through CPU, memory, disk, OS, and application. Measure a cached versus uncached file read and explain the difference.",
          "guideIds": [
            "linux-overview-distributions"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "cli",
          "title": "Terminal, files, and command-line tools",
          "prerequisites": [
            "computing"
          ],
          "core": [
            "Shell prompt, working directory, absolute/relative paths, help, man pages, and exit codes.",
            "stdin, stdout, stderr, redirection, pipes, quoting, globbing, environment variables, and PATH.",
            "Filesystem hierarchy; create, copy, move, inspect, search, and archive files.",
            "Edit files with nano or vim; use grep, find, sort, cut, awk, sed, jq, and diff."
          ],
          "advanced": [
            "File descriptors, command substitution, process substitution, subshells, and environment inheritance.",
            "Regular expressions versus shell globs; NUL-delimited pipelines for filenames."
          ],
          "edgeCases": [
            "Spaces, newlines, leading dashes, and wildcard characters in filenames.",
            "Redirecting stderr separately; pipeline success can hide an earlier failure.",
            "Overwriting files and deleting the wrong directory: inspect target paths first."
          ],
          "lab": "Create and search a fixture tree containing awkward filenames. Process it without losing names; demonstrate separate stdout/stderr and meaningful exit status.",
          "guideIds": [
            "linux-basic-commands-navigation",
            "linux-text-editors",
            "linux-file-management"
          ],
          "sourceIds": [
            "bash",
            "linux"
          ]
        },
        {
          "id": "git",
          "title": "Git, collaboration, and technical writing",
          "prerequisites": [
            "cli"
          ],
          "core": [
            "Working tree, index, commits, branches, diffs, remotes, fetch, pull, and push.",
            "Small commits; pull requests, review, merge conflicts, and protected branches.",
            "Document setup, ownership, troubleshooting, rollback, and architectural decisions.",
            "Trunk-based collaboration and when short-lived release branches are useful."
          ],
          "advanced": [
            "Rebase versus merge, cherry-pick, revert, reflog, bisect, tags, submodules, and large-file storage.",
            "Signed commits, secret removal procedures, and repository permissions."
          ],
          "edgeCases": [
            "Rewriting published history disrupts collaborators.",
            "Deleting a secret in the next commit leaves it in history; revoke exposed credentials.",
            "Line endings, case-sensitive paths, binary conflicts, and detached HEAD."
          ],
          "lab": "Use two clones to create and resolve a conflict, revert a faulty release, recover a lost commit with reflog, and identify a regression with bisect.",
          "guideIds": [
            "cicd-branching-strategies"
          ],
          "sourceIds": [
            "git"
          ]
        },
        {
          "id": "bash",
          "title": "Bash automation and safe shell scripting",
          "prerequisites": [
            "cli",
            "git"
          ],
          "core": [
            "Variables, arrays, functions, conditionals, loops, test expressions, and parameter expansion.",
            "Exit status, explicit failure handling, traps, cleanup, timeouts, and input validation.",
            "Idempotent operations, dry-run mode, structured output, and logging.",
            "Use shell for orchestration; use a programming language for complex data and concurrency."
          ],
          "advanced": [
            "set -e, -u, and pipefail semantics; conditional contexts and command substitutions.",
            "flock, atomic file replacement, signal handling, and bounded parallelism."
          ],
          "edgeCases": [
            "Unquoted expansion splits words or expands globs.",
            "set -e is not a universal exception mechanism; expected nonzero exits need explicit handling.",
            "Temporary-file races, partial writes, SIGTERM cleanup, and reruns after interruption."
          ],
          "lab": "Write a backup script with checked inputs, dry-run mode, checksums, temporary files, cleanup traps, and tests for spaces, failed commands, and interrupted runs.",
          "guideIds": [
            "linux-bash-scripting"
          ],
          "sourceIds": [
            "bash"
          ]
        },
        {
          "id": "programming",
          "title": "Programming for automation: Python and Go",
          "prerequisites": [
            "computing",
            "cli",
            "git"
          ],
          "core": [
            "Values, types, expressions, control flow, functions, collections, modules, and exceptions.",
            "File I/O, JSON parsing, command-line arguments, logging, and HTTP clients.",
            "Dependency management, virtual environments, builds, formatting, and linting.",
            "Choose Python for general automation; learn Go for compiled CLIs and Kubernetes extensions.",
            "Basic data structures (lists, maps, sets, stacks, queues), iteration complexity, recursion, and memory ownership.",
            "Build a minimal HTTP server; dependency injection, structured errors, configuration, and shutdown hooks."
          ],
          "advanced": [
            "Interfaces, composition, context cancellation, goroutines/channels, and synchronization in Go.",
            "Python iterators, generators, type hints, subprocess safety, asynchronous I/O, and packaging.",
            "Race detection, synchronization primitives, deadlock avoidance, Go memory-model assumptions, and language/runtime profiling."
          ],
          "edgeCases": [
            "Mutable shared state, races, leaked tasks, and cancellation propagation.",
            "Unicode, floating-point precision, large inputs, and partial reads/writes.",
            "Shell injection through subprocess arguments and leaked secrets in logs."
          ],
          "lab": "Implement an inventory CLI with pagination, bounded concurrent requests, retries, timeouts, schema validation, and cancellation. Test invalid input and a mid-run failure.",
          "guideIds": [],
          "sourceIds": [
            "python",
            "go"
          ]
        },
        {
          "id": "formats-api",
          "title": "Data formats, HTTP APIs, and configuration",
          "prerequisites": [
            "programming"
          ],
          "core": [
            "JSON, YAML, TOML, environment configuration, schema validation, and serialization.",
            "REST resources, methods, status codes, headers, pagination, and authentication boundaries.",
            "Content types, timestamps, time zones, encoding, and secret references.",
            "Separate configuration from code and validate it before making changes."
          ],
          "advanced": [
            "OpenAPI, API versioning, compatibility, ETags, conditional requests, and idempotency keys.",
            "gRPC/Protocol Buffers, streaming, and schema evolution."
          ],
          "edgeCases": [
            "YAML implicit typing, indentation, duplicate keys, and multi-document input.",
            "Unknown fields, null versus absent values, unsafe deserialization, and overlarge payloads.",
            "A timeout after a write may mean the operation succeeded; blind retry can duplicate it."
          ],
          "lab": "Create a versioned API with validated input and a paginated list endpoint. Test malformed JSON, duplicate requests, invalid enum values, and backward-compatible schema changes.",
          "guideIds": [
            "net-http-https"
          ],
          "sourceIds": [
            "owasp",
            "go"
          ]
        },
        {
          "id": "testing",
          "title": "Testing, debugging, and reproducible builds",
          "prerequisites": [
            "programming",
            "formats-api"
          ],
          "core": [
            "Unit, integration, contract, end-to-end, and smoke tests; fixtures and assertions.",
            "Logs, debuggers, stack traces, error reproduction, and root-cause hypotheses.",
            "Dependency lockfiles, artifact versions, build/test separation, and clean environments.",
            "Test behavior and failure paths, not only implementation details."
          ],
          "advanced": [
            "Property-based tests, fuzzing, coverage limitations, race detection, and deterministic clocks.",
            "Load tests versus stress/soak tests; reliability and security test gates.",
            "Contract/property/fuzz testing for parsers and APIs; chaos/failover tests; testing authorization and destructive-operation safeguards."
          ],
          "edgeCases": [
            "Flaky tests from timing or order dependence; mocks hiding real integration failures.",
            "A cached build can pass while a clean build fails.",
            "Coverage percentage is not proof of correctness."
          ],
          "lab": "Test the foundation service with invalid requests, database disconnects, parallel writes, and a clean build. Record a regression test for an intentionally introduced bug.",
          "guideIds": [
            "cicd-test-types"
          ],
          "sourceIds": [
            "go",
            "python"
          ]
        },
        {
          "id": "security-basics",
          "title": "Security fundamentals and threat modeling",
          "prerequisites": [
            "formats-api"
          ],
          "core": [
            "Confidentiality, integrity, availability; assets, trust boundaries, and attacker capabilities.",
            "Authentication versus authorization; least privilege, separation of duties, and secure defaults.",
            "Hashing versus encryption versus signatures; symmetric/asymmetric keys and secret lifecycle.",
            "Input validation, dependency hygiene, updates, audit logs, and data classification.",
            "Common web/API risks: injection, XSS, CSRF, SSRF, unsafe redirects, insecure object authorization, and unsafe dependency/code execution."
          ],
          "advanced": [
            "Threat models, abuse cases, attack surface mapping, defense in depth, and secure design review.",
            "Credential rotation, break-glass access, MFA, and phishing-resistant authentication concepts.",
            "Session cookies (Secure, HttpOnly, SameSite), session fixation, CORS versus authorization, CSP, and credential leakage through URLs."
          ],
          "edgeCases": [
            "Encrypted transport does not authorize a caller.",
            "Base64 is encoding, not encryption; a signed token is usually readable.",
            "Backups, logs, error messages, and build artifacts can expose secrets."
          ],
          "lab": "Threat-model the foundation service; restrict permissions, remove credentials from the repo, verify audit trails, and test unauthorized access.",
          "guideIds": [],
          "sourceIds": [
            "owasp"
          ]
        },
        {
          "id": "sql-basics",
          "title": "SQL and relational data fundamentals",
          "prerequisites": [
            "programming"
          ],
          "core": [
            "Tables, types, keys, constraints, normalization, joins, and indexes.",
            "SELECT, INSERT, UPDATE, DELETE; transactions and parameterized queries.",
            "Schema migrations and reproducible development data.",
            "Connection lifecycle and least-privilege database roles."
          ],
          "advanced": [
            "Isolation levels, MVCC, query plans, indexes versus scans, and lock contention.",
            "Migration compatibility and expand/contract changes."
          ],
          "edgeCases": [
            "SQL injection, NULL semantics, timezone errors, and collation differences.",
            "Transactions left open block work; retryable errors need bounded retries.",
            "An index speeds some reads but costs storage and write work."
          ],
          "lab": "Add database persistence to the service. Prove constraints hold, inspect a query plan, reproduce a lock conflict, and roll forward a compatible schema migration.",
          "guideIds": [
            "cloud-databases"
          ],
          "sourceIds": [
            "postgres"
          ]
        }
      ]
    },
    {
      "id": "systems",
      "title": "Linux and network operations",
      "level": "Beginner → Intermediate",
      "goal": "Diagnose hosts and packet paths before introducing orchestration or cloud abstractions.",
      "entryRequirements": [
        "Complete the foundation capstone and prerequisite modules.",
        "Use two disposable Linux hosts or namespaces for network and service experiments."
      ],
      "capstone": "Operate a secured Linux HTTP service behind a reverse proxy. Break DNS, permissions, storage, and routing one at a time, then diagnose and recover using a runbook.",
      "exitCriteria": [
        "Trace a request through DNS, routing, transport, TLS, and HTTP.",
        "Distinguish CPU saturation, memory pressure, I/O bottlenecks, and packet loss.",
        "Restore service without disabling access controls or deleting evidence.",
        "Explain each fix and the telemetry that verifies recovery."
      ],
      "modules": [
        {
          "id": "linux-access",
          "title": "Linux identities, permissions, and host hardening",
          "prerequisites": [
            "cli",
            "security-basics"
          ],
          "core": [
            "Users, groups, UID/GID, ownership, rwx modes, umask, and sudo.",
            "PAM, /etc/passwd, /etc/shadow, ACLs, capabilities, and least privilege.",
            "Package managers, repositories, signatures, updates, and dependency resolution.",
            "Host baseline, service accounts, secret file permissions, and audit logging."
          ],
          "advanced": [
            "SELinux/AppArmor policies, seccomp, systemd sandboxing, and privilege separation.",
            "Central identity integration and controlled administrative access.",
            "Binary/package ABI compatibility, shared libraries, dynamic linking, kernel modules, repository trust, and supply-chain ownership."
          ],
          "edgeCases": [
            "Directory execute permission controls traversal; file write access is not the same as delete permission.",
            "Setuid, capabilities, ACL masks, shared group ownership, and NFS root-squash.",
            "An update can change configuration or require restart; test and plan recovery."
          ],
          "lab": "Run a service as a dedicated user, enforce a restrictive sandbox, patch packages, and diagnose a deliberate ACL or SELinux denial without making everything writable.",
          "guideIds": [
            "linux-user-group-management",
            "linux-package-management"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "processes",
          "title": "Processes, services, signals, and boot",
          "prerequisites": [
            "computing",
            "bash",
            "linux-access"
          ],
          "core": [
            "Fork/exec, process trees, threads, PIDs, jobs, signals, and exit states.",
            "systemd units, dependencies, startup, restart behavior, timers, and journald.",
            "Graceful shutdown, PID 1 behavior, zombies, and file descriptor limits.",
            "Boot chain, kernel arguments, service readiness, and scheduled automation.",
            "UEFI/BIOS, bootloader, initramfs, root filesystem, kernel modules, emergency targets, and NTP/chrony time synchronization."
          ],
          "advanced": [
            "cgroups v2 resource control, namespaces, process accounting, and service isolation.",
            "strace, /proc inspection, core dumps, and deadlock investigation."
          ],
          "edgeCases": [
            "SIGKILL skips cleanup; SIGTERM needs a bounded grace period.",
            "Restart loops can amplify dependency failures.",
            "A service may be alive but deadlocked, orphaned, or unable to open files.",
            "Broken fstab entries, failed boot dependencies, read-only root filesystems, and time jumps affecting certificates or scheduled jobs."
          ],
          "lab": "Build a systemd unit with resource limits and graceful shutdown. Reproduce an FD leak and restart loop, diagnose them, and document a safe recovery.",
          "guideIds": [
            "linux-process-management",
            "linux-system-logs"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "performance-host",
          "title": "CPU, memory, and host performance",
          "prerequisites": [
            "processes"
          ],
          "core": [
            "Load average, utilization, runnable queues, context switches, and CPU versus I/O wait.",
            "Virtual memory, page cache, swap, anonymous memory, RSS, and OOM behavior.",
            "top, ps, free, vmstat, iostat, pidstat, and pressure-stall information.",
            "Correlate observations over time and compare them with a known baseline."
          ],
          "advanced": [
            "NUMA, CPU affinity, scheduling classes, huge pages, perf profiling, and flame graphs.",
            "Container memory accounting, CPU throttling, page faults, and eBPF-based diagnosis."
          ],
          "edgeCases": [
            "High load does not always mean high CPU utilization.",
            "Free RAM is not a useful target if reclaimable cache serves workloads.",
            "CPU limits, noisy neighbors, memory fragmentation, and swap thrashing."
          ],
          "lab": "Generate CPU, memory, and disk pressure separately. Capture metrics and profiles; identify the constrained resource and verify an improvement under the same load.",
          "guideIds": [
            "linux-system-monitoring"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "storage-host",
          "title": "Filesystems, block storage, and recovery",
          "prerequisites": [
            "cli",
            "processes"
          ],
          "core": [
            "Partitions, block devices, filesystem types, mount options, fstab, and UUIDs.",
            "Inodes, links, permissions, capacity, quotas, and deleted-but-open files.",
            "LVM, RAID tradeoffs, filesystem checks, NFS/SMB, and backups.",
            "Page cache, writeback, sync/fsync, and durability expectations."
          ],
          "advanced": [
            "Snapshots versus backups, thin provisioning, journaling, and copy-on-write.",
            "Encryption at rest, storage latency, multipath, and coordinated filesystem growth.",
            "RAID failure/rebuild exposure, write barriers, IOPS versus throughput, queue depth, NFS locking, and distributed-storage failure domains."
          ],
          "edgeCases": [
            "Disk space can remain while inodes are exhausted.",
            "RAID and replication do not replace independent backups.",
            "Network filesystem stalls, stale handles, full thin pools, and unsafe shrink operations."
          ],
          "lab": "Attach a disposable volume, mount it safely, trigger inode and space exhaustion, identify an open deleted file, and restore a verified backup.",
          "guideIds": [
            "linux-filesystems-storage"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "ip-transport",
          "title": "IP, Ethernet, TCP/UDP, and IPv6",
          "prerequisites": [
            "computing",
            "cli"
          ],
          "core": [
            "OSI/TCP-IP models; Ethernet frames, MAC addresses, ARP, IP packets, and ICMP.",
            "TCP handshake, sequence numbers, retransmission, flow control, congestion control, and teardown.",
            "UDP semantics, sockets, ports, ephemeral ports, and connection states.",
            "IPv4 versus IPv6, neighbor discovery, DHCP, SLAAC, and dual-stack basics."
          ],
          "advanced": [
            "MTU, MSS, path MTU discovery, fragmentation, socket buffers, and packet captures.",
            "QUIC transport principles; TCP congestion behavior and connection reuse.",
            "IPv6 address scope, multicast, neighbor discovery security, prefix delegation, and NAT64/DNS64 migration concepts."
          ],
          "edgeCases": [
            "Blocked ICMP can cause MTU black holes.",
            "UDP still needs application-level loss handling and congestion considerations.",
            "Port exhaustion, TIME_WAIT, half-open connections, IPv6-only resolution, and asymmetric routes."
          ],
          "lab": "Trace a TCP connection with tcpdump and ss. Introduce delay, packet loss, and MTU mismatch in namespaces; explain retransmission and recovery.",
          "guideIds": [
            "linux-networking-basics",
            "net-tcp-udp",
            "net-ports",
            "net-dhcp-mac"
          ],
          "sourceIds": [
            "linux"
          ]
        },
        {
          "id": "network-design",
          "title": "Subnets, routing, NAT, load balancing, and firewalls",
          "prerequisites": [
            "ip-transport"
          ],
          "core": [
            "CIDR, subnet masks, private/public ranges, routing tables, longest-prefix match, and gateways.",
            "Routers, switches, VLANs, bridges, NAT/SNAT/DNAT, conntrack, and stateful firewalls.",
            "L4 versus L7 load balancers, health checks, stickiness, and reverse proxies.",
            "Security groups versus network ACLs; VPN, private connectivity, and segmentation."
          ],
          "advanced": [
            "BGP fundamentals, route advertisement, ECMP, network overlays, and hybrid connectivity.",
            "nftables/iptables rule order, conntrack sizing, DDoS mitigations, and flow logs.",
            "BGP route filtering, route leaks, anycast, ECMP hash behavior, redundant paths, and route convergence tradeoffs."
          ],
          "edgeCases": [
            "Overlapping CIDRs prevent straightforward peering.",
            "NAT is not authorization; a return path can fail independently.",
            "Connection tracking exhaustion, asymmetric flows, stale health checks, and hairpin NAT."
          ],
          "lab": "Build two subnets and a routed/firewalled path. Prove allowed and denied flows with captures, test failover behind a proxy, and diagnose a missing return route.",
          "guideIds": [
            "net-architecture",
            "net-routers-switches-nat",
            "net-security",
            "net-load-balancing-webservers"
          ],
          "sourceIds": [
            "linux",
            "aws"
          ]
        },
        {
          "id": "dns",
          "title": "DNS resolution, service discovery, and failure analysis",
          "prerequisites": [
            "ip-transport"
          ],
          "core": [
            "Recursive versus authoritative DNS, delegations, zones, and root/TLD resolution.",
            "A/AAAA, CNAME, MX, TXT, SRV, NS, SOA, PTR, TTL, and negative caching.",
            "dig, resolv.conf, search domains, split DNS, and service discovery.",
            "DNS changes, certificate challenges, and caching layers."
          ],
          "advanced": [
            "DNSSEC validation concepts, EDNS, TCP fallback, encrypted DNS, and resolver capacity.",
            "Geo/weighted/failover DNS and the limits of DNS-based traffic steering.",
            "Delegation glue, zone transfers, authoritative anycast, wildcard behavior, DNSSEC chain of trust, and key rollover."
          ],
          "edgeCases": [
            "NXDOMAIN is different from SERVFAIL; negative responses can be cached.",
            "Low TTL does not force every client to refresh immediately.",
            "Search-path expansion, stale caches, oversized UDP replies, CNAME chains, and DNS rebinding."
          ],
          "lab": "Run an authoritative zone and resolver in a lab. Diagnose a broken delegation, stale answer, IPv6 mismatch, and UDP truncation using dig and packet capture.",
          "guideIds": [
            "net-dns"
          ],
          "sourceIds": [
            "aws",
            "kubernetes"
          ]
        },
        {
          "id": "http",
          "title": "HTTP, proxies, caching, and API traffic",
          "prerequisites": [
            "formats-api",
            "ip-transport",
            "dns"
          ],
          "core": [
            "HTTP methods, status codes, headers, URLs, cookies, sessions, and content negotiation.",
            "HTTP/1.1 connections, HTTP/2 multiplexing, and HTTP/3 over QUIC.",
            "Forward versus reverse proxies, virtual hosts, keepalive, request limits, and timeouts.",
            "Cache-Control, validators, Vary, CDN behavior, compression, and streaming.",
            "301/302 versus 307/308 redirect method behavior; 401/403/404 semantics; conditional writes and cache invalidation."
          ],
          "advanced": [
            "Connection pools, backpressure, retries at proxies, rate limiting, and load shedding.",
            "WebSockets, SSE, gRPC, request tracing, and end-to-end timeout budgets."
          ],
          "edgeCases": [
            "Unsafe caching of personalized responses can disclose data.",
            "Retrying non-idempotent writes can create duplicates.",
            "Proxy/header trust, request smuggling boundaries, slow clients, streaming timeouts, and 429 Retry-After.",
            "Forwarded/X-Forwarded-* spoofing, mixed proxy parser behavior, WebSocket upgrades, and gRPC status versus HTTP status."
          ],
          "lab": "Configure a reverse proxy and cache for the service. Test personalized cache isolation, oversized requests, slow upstreams, and safe retries.",
          "guideIds": [
            "net-http-https",
            "net-load-balancing-webservers"
          ],
          "sourceIds": [
            "owasp"
          ]
        },
        {
          "id": "tls",
          "title": "TLS, PKI, certificates, and encryption lifecycle",
          "prerequisites": [
            "security-basics",
            "dns",
            "http"
          ],
          "core": [
            "Certificate chains, trust stores, public/private keys, SANs, and host validation.",
            "TLS handshakes, protocol negotiation, SNI, forward secrecy, and HTTPS termination.",
            "ACME issuance/renewal, certificate ownership, expiry alerts, and key storage.",
            "mTLS client identities and the difference between encrypted and authorized traffic."
          ],
          "advanced": [
            "Private CAs, revocation approaches, key rotation, trust-root migration, and TLS session resumption.",
            "Certificate pinning tradeoffs, FIPS requirements, and hardware-backed key management.",
            "CSR generation, certificate usages, PEM/DER formats, OCSP/CRL limitations, certificate transparency, and cipher/protocol policy."
          ],
          "edgeCases": [
            "Clock skew, missing intermediates, wrong SANs, and inconsistent trust stores.",
            "TLS 1.3 early data can be replayed; do not assume it is safe for arbitrary writes.",
            "Renewal success does not imply the service loaded the new certificate."
          ],
          "lab": "Issue and rotate lab certificates, test wrong-host and expired certificates, deploy mTLS, and verify clients across a trust-root transition.",
          "guideIds": [
            "net-ssl-tls"
          ],
          "sourceIds": [
            "owasp"
          ]
        },
        {
          "id": "ssh",
          "title": "SSH, remote operations, and secure access",
          "prerequisites": [
            "linux-access",
            "ip-transport"
          ],
          "core": [
            "SSH keys, host keys, known_hosts, agent use, key permissions, and remote command execution.",
            "Bastions, jump hosts, tunnels, scp/sftp, and audited administrative access.",
            "Key lifecycle, restricted users, MFA integration, and access revocation.",
            "Use host key verification and temporary access where possible."
          ],
          "advanced": [
            "SSH certificates, agent-forwarding risks, reverse tunnels, and session recording.",
            "Emergency access paths and documented revocation/rotation drills."
          ],
          "edgeCases": [
            "A changed host key needs investigation, not automatic verification bypass.",
            "Private keys and forwarded agents expand the trust boundary.",
            "Expired access, broken bastion routes, stale authorized_keys, and tunnel exposure."
          ],
          "lab": "Reach a private host through a jump host, rotate credentials, test revocation, and distinguish network failure from authentication or host-key failure.",
          "guideIds": [
            "net-ssh"
          ],
          "sourceIds": [
            "owasp",
            "linux"
          ]
        }
      ]
    },
    {
      "id": "orchestration",
      "title": "Containers and Kubernetes engineering",
      "level": "Intermediate",
      "goal": "Understand the runtime and control loops, then build and operate workloads rather than only writing YAML.",
      "entryRequirements": [
        "Complete host/network troubleshooting gates.",
        "Have a tested service, registry access, and a disposable Kubernetes cluster with a documented teardown."
      ],
      "capstone": "Package the foundation service and database client, deploy them to Kubernetes with configuration, probes, limits, secure identities, network policy, and persistent storage. Exercise a rollout and a node disruption.",
      "exitCriteria": [
        "Explain a container from image pull through process startup and shutdown.",
        "Trace Pod scheduling, service discovery, network routing, and volume attachment.",
        "Diagnose image, probe, RBAC, scheduling, network, and storage failures.",
        "Roll forward/back while preserving data and availability requirements."
      ],
      "modules": [
        {
          "id": "containers-runtime",
          "title": "OCI containers, namespaces, cgroups, and runtimes",
          "prerequisites": [
            "processes",
            "performance-host",
            "storage-host"
          ],
          "core": [
            "Images versus running containers; OCI image/runtime/distribution concepts.",
            "Namespaces, cgroups, capabilities, seccomp, root filesystem, and layered filesystems.",
            "PID 1, signals, environment, resource limits, and host-kernel sharing.",
            "Docker Engine, containerd, CRI, runc, rootless mode, and runtime boundaries."
          ],
          "advanced": [
            "User namespaces, cgroups v2 delegation, alternate sandboxed runtimes, and runtime inspection.",
            "Container isolation limits and VM isolation tradeoffs."
          ],
          "edgeCases": [
            "A container shares the host kernel and is not a small independent VM.",
            "Host architecture must match image architecture or use emulation.",
            "Zombie reaping, writable-layer loss, unsupported syscall behavior, and resource accounting differences."
          ],
          "lab": "Run the service as non-root with resource limits and restricted capabilities. Inspect namespace and cgroup state; verify graceful termination and host/container visibility.",
          "guideIds": [
            "containers-what-is-it"
          ],
          "sourceIds": [
            "docker",
            "linux"
          ]
        },
        {
          "id": "container-build",
          "title": "Images, registries, builds, and software packaging",
          "prerequisites": [
            "containers-runtime",
            "testing",
            "git"
          ],
          "core": [
            "Dockerfile instructions, build context, .dockerignore, layers, cache, and multi-stage builds.",
            "Image tags versus digests; registries, credentials, retention, and vulnerability reports.",
            "Minimal runtime images, non-root users, dependency lockfiles, and reproducibility.",
            "BuildKit, cache mounts, build secrets, and provenance attachment."
          ],
          "advanced": [
            "Multi-architecture builds, reproducible artifacts, image promotion, and air-gapped distribution.",
            "SBOMs, image signing, attestation verification, and root-of-trust ownership."
          ],
          "edgeCases": [
            "Mutable tags can change underneath a release.",
            "Deleting secrets in a later layer does not remove earlier-layer data.",
            "Stale cache, private dependency credentials, architecture mismatch, and registry pull limits."
          ],
          "lab": "Build a small multi-stage image, publish it by digest, verify no secret exists in image layers, and reproduce the build in a clean environment.",
          "guideIds": [
            "containers-docker",
            "containers-image-repository"
          ],
          "sourceIds": [
            "docker",
            "slsa"
          ]
        },
        {
          "id": "compose-volumes",
          "title": "Local stacks, Compose, and container persistence",
          "prerequisites": [
            "container-build",
            "sql-basics"
          ],
          "core": [
            "Compose services, networks, dependencies, health checks, environment files, and profiles.",
            "Bind mounts, named volumes, tmpfs, file ownership, and storage lifecycle.",
            "Local development versus production assumptions.",
            "Separate persistent data from disposable containers."
          ],
          "advanced": [
            "Backup/restore with application-consistent data; filesystem driver and host-platform differences.",
            "Local integration tests with multiple services and ephemeral environments."
          ],
          "edgeCases": [
            "depends_on is not a universal guarantee that a database is ready.",
            "UID/GID mismatch and SELinux labeling can prevent writes.",
            "Removing volumes destroys data; a bind mount can hide files packaged in an image."
          ],
          "lab": "Build a Compose service/database stack with readiness checks. Restart containers without losing data, reproduce a permission failure, and restore an application-consistent backup.",
          "guideIds": [
            "containers-docker-compose",
            "containers-mounting-volumes"
          ],
          "sourceIds": [
            "docker",
            "postgres"
          ]
        },
        {
          "id": "k8s-control-plane",
          "title": "Kubernetes architecture and API control loops",
          "prerequisites": [
            "containers-runtime",
            "network-design",
            "dns"
          ],
          "core": [
            "API server, etcd, scheduler, controllers, kubelet, and kube-proxy or equivalent data plane.",
            "Desired state, reconciliation, object metadata, spec/status, namespaces, labels, and selectors.",
            "kubectl, API discovery, kubeconfig contexts, declarative apply, and field ownership.",
            "Watch/list behavior, resource versions, and eventual convergence."
          ],
          "advanced": [
            "etcd quorum, API availability, admission, audit logs, and controller work queues.",
            "Control-plane high availability, encryption at rest, API priority/fairness, and backup/restore.",
            "Kubernetes version skew, deprecated APIs, etcd compaction/defragmentation, audit-log policy, and API-server certificate lifecycle."
          ],
          "edgeCases": [
            "kubectl apply success does not mean the workload converged.",
            "Wrong context or namespace can change the wrong environment.",
            "etcd loss of quorum, watch expiration, admission outages, and competing field managers."
          ],
          "lab": "Follow a Deployment request through API storage, scheduling, and kubelet. Inspect events/status; restore a disposable control plane from a tested backup.",
          "guideIds": [
            "containers-kubernetes-resources"
          ],
          "sourceIds": [
            "kubernetes",
            "etcd"
          ]
        },
        {
          "id": "k8s-workloads",
          "title": "Workloads, probes, configuration, and graceful lifecycle",
          "prerequisites": [
            "k8s-control-plane",
            "container-build"
          ],
          "core": [
            "Pods, Deployments, ReplicaSets, StatefulSets, DaemonSets, Jobs, and CronJobs.",
            "ConfigMaps, Secrets, init containers, sidecars, startup/readiness/liveness probes.",
            "Requests, limits, QoS, restart policy, termination grace, and preStop hooks.",
            "Rolling updates, revision history, and deployment health."
          ],
          "advanced": [
            "Sidecar lifecycle ordering, indexed jobs, graceful endpoint removal, and rollout tuning.",
            "PodDisruptionBudgets and the difference between voluntary and involuntary disruption."
          ],
          "edgeCases": [
            "Liveness checks against a failing dependency can trigger restart storms.",
            "ConfigMap/Secret updates may not refresh environment variables or subPath mounts.",
            "CronJob overlap, duplicate job execution, stuck rollout, and termination before request drain.",
            "PDBs constrain eviction-subresource requests, not arbitrary Pod deletion or every rolling update; rollout strategies must independently preserve availability."
          ],
          "lab": "Deploy the service with correct probes and shutdown handling. Break a dependency, rotate configuration, run a rolling update under load, and test disruption behavior.",
          "guideIds": [
            "containers-kubernetes-resources"
          ],
          "sourceIds": [
            "kubernetes"
          ]
        },
        {
          "id": "k8s-scheduling",
          "title": "Scheduling, placement, scaling, and node operations",
          "prerequisites": [
            "k8s-workloads",
            "performance-host"
          ],
          "core": [
            "Node selectors, affinity/anti-affinity, taints/tolerations, and topology-spread constraints.",
            "Resource requests, capacity, scheduling queues, priorities, and preemption.",
            "HPA metrics, VPA concepts, cluster autoscaling, and workload/node scaling separation.",
            "Node cordon, drain, eviction, leases, pressure signals, and maintenance."
          ],
          "advanced": [
            "Spot/preemptible nodes, provisioning constraints, consolidation, Karpenter, and capacity buffers.",
            "Custom scheduling plugins, batch workloads, GPUs, and NUMA/device placement.",
            "HPA scale-to-zero constraints, custom/external metrics and KEDA-style event scaling; interaction with VPA, requests, and node provisioning."
          ],
          "edgeCases": [
            "A PodDisruptionBudget can block a drain but cannot prevent every outage.",
            "Requests drive scheduling; actual use, limits, and node overhead differ.",
            "Impossible affinity, stale metrics, autoscaling oscillation, spot shortages, and eviction loops."
          ],
          "lab": "Create an unschedulable workload and diagnose it. Tune placement/scaling under variable load, drain a node, and measure availability with constrained spare capacity.",
          "guideIds": [
            "cloud-karpenter-autoscaling"
          ],
          "sourceIds": [
            "kubernetes",
            "aws"
          ]
        },
        {
          "id": "k8s-networking",
          "title": "Cluster networking, service discovery, and ingress",
          "prerequisites": [
            "k8s-control-plane",
            "dns",
            "http",
            "tls"
          ],
          "core": [
            "Pod networking, CNI, Service types, EndpointSlices, ClusterIP, and cluster DNS.",
            "Ingress controllers, Gateway API roles, routes, listeners, and TLS termination.",
            "NetworkPolicy ingress/egress, default-deny design, and plugin enforcement.",
            "External load balancers, source IP behavior, and connection tracking."
          ],
          "advanced": [
            "eBPF data planes, service topology, dual-stack clusters, and multi-cluster networking.",
            "Gateway policy attachment, cross-namespace references, and mesh integration.",
            "CoreDNS troubleshooting, Service traffic policies, readiness/EndpointSlice timing, DNS ndots amplification, and observability of dropped packets."
          ],
          "edgeCases": [
            "A NetworkPolicy object only works if the network plugin enforces it.",
            "Ingress/Gateway resources need matching controllers; feature support is implementation-dependent.",
            "DNS blocked by default-deny, asymmetric routing, MTU mismatch, stale endpoints, and port confusion."
          ],
          "lab": "Trace external-to-Pod traffic, expose the service through a Gateway, enforce least-privilege network policy, and diagnose blocked DNS and a misconfigured backend port.",
          "guideIds": [
            "containers-gateway-api"
          ],
          "sourceIds": [
            "kubernetes"
          ]
        },
        {
          "id": "k8s-storage",
          "title": "Kubernetes persistent storage and stateful workloads",
          "prerequisites": [
            "k8s-workloads",
            "storage-host",
            "compose-volumes"
          ],
          "core": [
            "CSI drivers, PersistentVolumes, PVCs, StorageClasses, dynamic provisioning, and reclaim policies.",
            "Access modes, volume modes, topology, attachment/mount, and StatefulSet identity.",
            "Expansion, snapshots, backups, restore, and storage encryption.",
            "Database operators versus unmanaged stateful workloads."
          ],
          "advanced": [
            "Volume binding modes, zonal failures, fencing, replication, and application consistency.",
            "Storage performance isolation and migration between drivers/classes."
          ],
          "edgeCases": [
            "ReadWriteOnce is not a universal single-Pod locking guarantee; understand driver/mode semantics.",
            "A volume snapshot is not automatically a consistent database backup.",
            "Multi-attach errors, wrong zone, ownership mismatch, stuck finalizers, and accidental reclaim."
          ],
          "lab": "Deploy a stateful workload, simulate node/zone placement trouble, grow a volume, and restore a verified database backup into a separate namespace.",
          "guideIds": [
            "containers-mounting-volumes"
          ],
          "sourceIds": [
            "kubernetes",
            "postgres"
          ]
        },
        {
          "id": "k8s-security",
          "title": "Cluster identity, RBAC, secrets, and workload security",
          "prerequisites": [
            "k8s-control-plane",
            "linux-access",
            "security-basics"
          ],
          "core": [
            "Authentication, authorization, admission, service accounts, RBAC verbs, and namespace scoping.",
            "Pod Security Standards/admission, securityContext, capabilities, non-root, and read-only filesystems.",
            "Projected tokens, secret access, KMS encryption, and cloud workload identity.",
            "Image security, audit trails, least-privilege operators, and secure cluster endpoints.",
            "Secrets managers, external secret synchronization, CSI secret mounts, dynamic credentials, key rotation, and cloud metadata endpoint restrictions."
          ],
          "advanced": [
            "Admission webhooks, policy engines, credential boundaries, and sandboxed runtimes.",
            "Threat modeling privilege escalation through RBAC, host access, or metadata endpoints."
          ],
          "edgeCases": [
            "Namespace separation alone is not a strong hostile-tenant security boundary.",
            "Secrets are not encrypted merely because their YAML representation is base64.",
            "Wildcard permissions, token audience mismatch, privileged DaemonSets, and webhook fail-open versus fail-closed."
          ],
          "lab": "Deploy least-privilege workload identities, enforce restrictive Pod policy, test forbidden API actions, and verify that the application cannot access another namespace or cloud role.",
          "guideIds": [
            "containers-security-practices",
            "cloud-iam"
          ],
          "sourceIds": [
            "kubernetes",
            "owasp"
          ]
        },
        {
          "id": "mesh",
          "title": "Service meshes, workload identity, and network troubleshooting",
          "prerequisites": [
            "k8s-networking",
            "k8s-security",
            "tls"
          ],
          "core": [
            "Proxy/data-plane versus control-plane roles, mTLS, service identity, and authorization policy.",
            "Traffic routing, retry budgets, timeout propagation, and telemetry overhead.",
            "Sidecar versus ambient/sidecarless approaches and when a mesh is unnecessary.",
            "Istio/Linkerd/Envoy concepts; SPIFFE/SPIRE identities and trust domains."
          ],
          "advanced": [
            "eBPF-based service connectivity and identity enforcement; encryption versus authentication versus L7 policy.",
            "Cross-cluster trust, certificate rotation, and control-plane upgrade compatibility."
          ],
          "edgeCases": [
            "Do not assume mutual authentication also encrypts every traffic path.",
            "Retries at mesh and application layers can multiply load.",
            "Injected probes, opaque protocols, certificate expiry, asymmetric enrollment, and policy bypass paths."
          ],
          "lab": "Secure a two-service request path. Verify both identity and encryption, rotate workload certificates, inject latency, and demonstrate retry-budget enforcement.",
          "guideIds": [
            "containers-service-mesh",
            "containers-cilium-ebpf-mesh"
          ],
          "sourceIds": [
            "kubernetes",
            "owasp"
          ]
        }
      ]
    },
    {
      "id": "delivery",
      "title": "Cloud foundations, infrastructure automation, and delivery",
      "level": "Intermediate → Advanced",
      "goal": "Build repeatable cloud environments and deliver changes with controlled identity, provenance, and rollback.",
      "entryRequirements": [
        "Complete the orchestration capstone.",
        "Choose one primary cloud for hands-on work; compare AWS, Azure, and GCP service models without trying to master all simultaneously."
      ],
      "capstone": "Provision an isolated cloud environment with IaC, federated CI identity, artifact promotion, deployment gates, GitOps, logging, budgets, and teardown. Demonstrate a failed deployment and safe recovery.",
      "exitCriteria": [
        "Reproduce infrastructure from versioned definitions and explain state ownership.",
        "Deploy immutable artifacts without long-lived credentials in CI.",
        "Show environment isolation, least privilege, and auditable changes.",
        "Demonstrate rollback limits when data/schema changes are involved."
      ],
      "modules": [
        {
          "id": "cloud-foundations",
          "title": "Cloud service models, landing zones, and governance",
          "prerequisites": [
            "network-design",
            "security-basics"
          ],
          "core": [
            "IaaS/PaaS/SaaS, regions, zones, managed services, and shared responsibility.",
            "Organization/account/subscription/project boundaries; landing zones, naming, ownership, and tags.",
            "Quotas, limits, resource lifecycle, support boundaries, and service availability.",
            "Well-Architected tradeoffs across reliability, security, performance, operations, cost, and sustainability."
          ],
          "advanced": [
            "Organization policies, account vending, federation, central audit trails, and delegated administration.",
            "Provider comparison based on requirements, not superficial service-name equivalence.",
            "Cloud control-plane versus data-plane dependencies; identity, DNS, billing, and artifact services that can couple otherwise separate regions."
          ],
          "edgeCases": [
            "Multi-zone is not automatically multi-region disaster recovery.",
            "Service quotas can stop scale-out during an incident.",
            "Control-plane dependencies, region-wide services, orphaned resources, and unexpected egress charges."
          ],
          "lab": "Create a sandbox account/project structure, audit logging, owner tags, budget alerts, quota checks, and a teardown inventory. Explain responsibility for each managed service.",
          "guideIds": [
            "cloud-fundamentals"
          ],
          "sourceIds": [
            "aws",
            "finops"
          ]
        },
        {
          "id": "identity",
          "title": "IAM, OAuth/OIDC, SSO, and workload federation",
          "prerequisites": [
            "security-basics",
            "tls",
            "formats-api"
          ],
          "core": [
            "Principals, roles, policies, scopes, resource policies, and explicit deny behavior.",
            "OAuth authorization code with PKCE, OIDC ID tokens versus access tokens, and SAML SSO.",
            "JWT header/claims/signature validation, issuer, audience, expiry, nonce/state, and key discovery.",
            "Workload identity, short-lived credentials, federation, SaaS IdPs, SCIM, and joiner/mover/leaver lifecycle.",
            "RBAC, ABAC, relationship-based authorization concepts; deny-by-default, permission boundaries, session duration, and tenant context."
          ],
          "advanced": [
            "Policy evaluation, confused-deputy defenses, token exchange, sender-constrained tokens, and trust conditions.",
            "Key rotation, JWKS caching, refresh token rotation, revocation, and enterprise identity availability.",
            "SAML audience/recipient/signature validation, IdP-initiated versus SP-initiated login, logout limits, browser sessions, and refresh-token storage."
          ],
          "edgeCases": [
            "Do not use resource-owner password grants or implicit flow as a modern default; follow OAuth security BCP.",
            "Decoded JWT claims are untrusted until validation; reject wrong audience, issuer, algorithm, or token type.",
            "Clock skew, stale JWKS, reused authorization codes, provisioning delay, and IdP outage can break access."
          ],
          "lab": "Federate a CI workload into a least-privilege cloud role and implement a PKCE login demo. Test wrong issuer/audience, expired tokens, key rotation, replay, and access revocation.",
          "guideIds": [
            "cloud-iam",
            "auth-sso",
            "auth-saas-providers",
            "auth-jwt",
            "auth-oauth2",
            "auth-oidc"
          ],
          "sourceIds": [
            "oauth",
            "owasp",
            "aws"
          ]
        },
        {
          "id": "cloud-network",
          "title": "Cloud and hybrid network architecture",
          "prerequisites": [
            "network-design",
            "dns",
            "cloud-foundations"
          ],
          "core": [
            "VPC/VNet networks, subnet tiers, route tables, NAT, public/private endpoints, and load balancing.",
            "Peering, transit routing, private service access, hybrid VPN/direct links, and DNS integration.",
            "Security groups, ACLs, network policy boundaries, and flow logging.",
            "Design address plans for growth, tenants, and clusters."
          ],
          "advanced": [
            "Hub/spoke and transit models; IPv6 adoption, private endpoints, and centralized egress controls.",
            "Cross-region traffic, route propagation, failure detection, and provider-specific routing constraints."
          ],
          "edgeCases": [
            "Private subnets still need explicit paths to registries, identity, DNS, and updates.",
            "Peering is often non-transitive; overlapping CIDRs need a migration or translation plan.",
            "AZ-specific NAT cost/failure, asymmetric hybrid routes, MTU differences, and exhausted address ranges."
          ],
          "lab": "Deploy private workload subnets with controlled egress and private service access. Validate route/DNS behavior and prove a second account cannot access an unauthorized service.",
          "guideIds": [
            "cloud-networking"
          ],
          "sourceIds": [
            "aws"
          ]
        },
        {
          "id": "cloud-compute",
          "title": "Compute, managed Kubernetes, and cloud storage",
          "prerequisites": [
            "cloud-network",
            "k8s-workloads",
            "k8s-storage"
          ],
          "core": [
            "VM images, autoscaling groups, health checks, managed container services, and managed Kubernetes.",
            "Instance families, accelerators, burst credits, reserved versus spot capacity, and placement.",
            "Block, file, and object storage; consistency, versioning, lifecycle, and encryption.",
            "Buckets, object policies, presigned URLs, multipart uploads, and event notifications.",
            "Availability zones, attachment/access constraints, replication, storage durability versus availability, lifecycle/cost tradeoffs, and restore requirements."
          ],
          "advanced": [
            "Instance bootstrapping, immutable images, launch templates, and node provisioning strategy.",
            "Managed-control-plane boundaries, serverless containers, cross-account storage, and replication design."
          ],
          "edgeCases": [
            "Object storage is not a POSIX filesystem; rename/append semantics differ.",
            "Spot capacity can disappear and scale-out may fail despite configured targets.",
            "Presigned URLs are bearer access, incomplete multipart uploads cost money, and lifecycle policies can delete required data."
          ],
          "lab": "Deploy resilient compute and object storage with least privilege, lifecycle rules, and verified recovery. Interrupt spot capacity and test placement, scaling, and object access policies.",
          "guideIds": [
            "cloud-compute",
            "cloud-containers",
            "cloud-object-storage"
          ],
          "sourceIds": [
            "aws"
          ]
        },
        {
          "id": "serverless",
          "title": "Serverless, managed events, and execution constraints",
          "prerequisites": [
            "cloud-compute",
            "identity",
            "formats-api"
          ],
          "core": [
            "Function triggers, execution limits, concurrency, cold starts, and deployment packaging.",
            "Event delivery, duplicate processing, batching, retries, dead-letter queues, and idempotency.",
            "Managed queues, schedulers, event buses, and workflow orchestration.",
            "VPC integration, connection reuse, secrets, telemetry, and cost controls."
          ],
          "advanced": [
            "Backpressure, reserved/provisioned concurrency, tenant isolation, and fan-out/fan-in workflows.",
            "Durable state, replay-safe handlers, compensation, and partial batch failure."
          ],
          "edgeCases": [
            "A retried event may already have changed external state.",
            "Unbounded concurrency can exhaust a database or downstream quota.",
            "Poison messages, dropped destinations, cold-start latency, execution timeout, and retry cost amplification."
          ],
          "lab": "Build a queued function with idempotent handling, a dead-letter path, bounded concurrency, and a replay tool. Test duplicate messages and partial failures.",
          "guideIds": [
            "cloud-serverless"
          ],
          "sourceIds": [
            "aws"
          ]
        },
        {
          "id": "iac-models",
          "title": "Infrastructure models and declarative reconciliation",
          "prerequisites": [
            "git",
            "cloud-foundations",
            "formats-api"
          ],
          "core": [
            "Why IaC: repeatability, review, drift visibility, lifecycle ownership, and safe automation.",
            "Imperative versus declarative approaches; IaC versus infrastructure from application code.",
            "Terraform/OpenTofu, Pulumi, cloud-native templates, and configuration management roles.",
            "Dependency graphs, create/update/delete lifecycle, providers, and idempotency."
          ],
          "advanced": [
            "Abstraction boundaries, generated infrastructure, policy validation, and component interfaces.",
            "Reconciliation versus one-time execution; compare tool choices against team constraints."
          ],
          "edgeCases": [
            "Declarative intent does not make every replacement safe.",
            "Mixing manual and automated ownership creates drift and destructive plans.",
            "Eventual cloud API consistency, provider retries, incomplete imports, and accidental resource recreation."
          ],
          "lab": "Model the cloud lab in one IaC tool, document ownership, reproduce it in a clean environment, and review a plan that intentionally replaces a persistent resource.",
          "guideIds": [
            "iac-why",
            "iac-imperative-declarative",
            "iac-landscape",
            "iac-vs-ifc"
          ],
          "sourceIds": [
            "terraform"
          ]
        },
        {
          "id": "terraform",
          "title": "Terraform/OpenTofu state, modules, testing, and migrations",
          "prerequisites": [
            "iac-models",
            "cloud-network"
          ],
          "core": [
            "HCL types, expressions, variables, outputs, modules, providers, and version constraints.",
            "State, remote backends, encryption, locking, dependency graphs, plan/apply, and refresh.",
            "Environment isolation; workspaces versus separate accounts/backends and blast radius.",
            "Module contracts, validation, tests, imports, moved blocks, and sensitive values."
          ],
          "advanced": [
            "Provider upgrades, state migration, drift reconciliation, lifecycle rules, and recovery after partial apply.",
            "Policy-as-code, cost estimation, plan provenance, and controlled CI applies.",
            "for_each stable keys versus count indices, provider aliases, unknown values, dependency cycles, pre/postconditions, and drift-safe refactoring."
          ],
          "edgeCases": [
            "Sensitive output flags do not encrypt state; state may contain credentials.",
            "Locking behavior depends on backend/version; never remove a lock without establishing ownership.",
            "Count/index churn, unstable keys, state corruption, removed providers, and plan/apply races."
          ],
          "lab": "Create tested modules with separate environment state, perform a reviewed import/move, simulate a partial apply, recover without duplicate resources, and prove state backup restoration.",
          "guideIds": [
            "iac-terraform",
            "iac-pipeline-integration"
          ],
          "sourceIds": [
            "terraform"
          ]
        },
        {
          "id": "configuration",
          "title": "Configuration management, immutable images, and packaging",
          "prerequisites": [
            "bash",
            "linux-access",
            "iac-models"
          ],
          "core": [
            "Ansible inventory, facts, roles, tasks, handlers, templates, and secret handling.",
            "Desired-state configuration versus image baking; Packer and immutable host replacement.",
            "Idempotency, check/diff modes, drift detection, and package pinning.",
            "Helm charts, values, templates, releases; Kustomize bases/overlays and manifests."
          ],
          "advanced": [
            "Helm hooks, CRD lifecycle, chart schema validation, and rollback behavior.",
            "Managed configuration services, patch orchestration, Windows/PowerShell/DSC comparison, and air-gapped packaging.",
            "Ansible privilege escalation, inventory precedence, delegation, check-mode limitations, handler timing, and rolling host updates."
          ],
          "edgeCases": [
            "Configuration management remains useful; immutability does not eliminate every configuration need.",
            "A successful template render is not proof of valid Kubernetes behavior.",
            "Non-idempotent tasks, secret leakage, hook ordering, values precedence, and CRDs not rolled back with application releases."
          ],
          "lab": "Build an idempotent host role and a validated application chart/overlay. Run twice, assert no unexpected changes, and reproduce a failed hook or incompatible configuration update.",
          "guideIds": [
            "iac-config-management"
          ],
          "sourceIds": [
            "terraform",
            "kubernetes"
          ]
        },
        {
          "id": "ci-pipelines",
          "title": "Continuous integration and test/build pipelines",
          "prerequisites": [
            "testing",
            "git",
            "container-build",
            "identity"
          ],
          "core": [
            "CI versus continuous delivery versus automatic deployment; build/test/package boundaries.",
            "GitHub Actions, GitLab CI, or Azure DevOps jobs, runners, artifacts, environments, and approvals.",
            "Reusable workflows, dependency caches, lockfiles, matrix testing, and resource limits.",
            "Build once and promote the same digest; separate trusted release actions from untrusted contributions."
          ],
          "advanced": [
            "Ephemeral/self-hosted runner isolation, workload federation, queueing, and concurrency controls.",
            "Pipeline performance, flaky-test management, reproducibility, and auditability.",
            "Artifact retention, reproducible dependency resolution, runner network isolation, least-privilege workflow tokens, and fork/PR event trust."
          ],
          "edgeCases": [
            "Pull requests from forks are untrusted; do not expose release secrets to their code.",
            "Cache poisoning and action drift can compromise builds.",
            "Cancelled jobs leave partial work, runner disks fill, and approval does not bind an artifact unless explicitly designed."
          ],
          "lab": "Build a workflow with tests, immutable artifacts, pinned dependencies/actions where appropriate, federated cloud access, and protected promotion. Test a malicious fork and a cancelled deployment.",
          "guideIds": [
            "cicd-benefits",
            "cicd-difference",
            "cicd-best-practices",
            "cicd-learn-tool"
          ],
          "sourceIds": [
            "slsa",
            "owasp"
          ]
        },
        {
          "id": "supply-chain",
          "title": "Software supply chain, provenance, and release assurance",
          "prerequisites": [
            "ci-pipelines",
            "container-build",
            "security-basics"
          ],
          "core": [
            "SAST, DAST, SCA, secret scanning, dependency advisories, and vulnerability triage.",
            "SBOMs, artifact signatures, provenance, trusted builders, and policy verification.",
            "SLSA requirements, Sigstore/keyless signing, trusted issuer/subject, and transparency logs.",
            "Patch prioritization, exception ownership, expiry, and release evidence."
          ],
          "advanced": [
            "Hermetic builds, dependency mirrors, reproducible builds, and isolated build services.",
            "Verify provenance at admission/promotion; assess build and source trust separately."
          ],
          "edgeCases": [
            "A valid signature does not prove the code is safe or the builder is trustworthy.",
            "An SBOM identifies components but does not fix vulnerabilities.",
            "Compromised runners, lookalike packages, stolen signing identity, revoked trust, and transparency service unavailability."
          ],
          "lab": "Generate SBOM and provenance, sign an image, verify issuer/subject/digest and build policy, then prove that tampered artifacts and untrusted builders are rejected.",
          "guideIds": [
            "cicd-static-scanning",
            "cicd-slsa-sigstore-supplychain"
          ],
          "sourceIds": [
            "slsa",
            "owasp"
          ]
        },
        {
          "id": "delivery-strategies",
          "title": "Deployment strategies, GitOps, and release recovery",
          "prerequisites": [
            "ci-pipelines",
            "terraform",
            "k8s-workloads"
          ],
          "core": [
            "Rolling, blue-green, canary, feature flags, shadow traffic, and deployment health gates.",
            "Argo CD/Flux reconciliation, desired state, sync policy, drift, and environment promotion.",
            "Secret references, chart/manifest promotion, release ownership, and change audit trails.",
            "Database migration coordination, expand/contract, and rollback versus roll-forward."
          ],
          "advanced": [
            "Progressive delivery, metrics-based analysis, GitOps dependency ordering, and fleet rollout waves.",
            "DORA-style delivery outcomes, release risk scoring, and separation of duties."
          ],
          "edgeCases": [
            "Rollback cannot unwrite data or reverse every schema migration.",
            "Automated self-healing can revert emergency manual fixes unless ownership is coordinated.",
            "Bad analysis metrics, stuck finalizers, controller outages, cross-environment promotion mistakes, and feature-flag debt.",
            "Rollback compatibility includes configuration, message schemas, external API contracts, caches, and persistent state—not just the previous container image."
          ],
          "lab": "Promote a signed digest through staging and production-like environments. Run a canary with abort conditions, break a dependency, and recover with a compatible database migration.",
          "guideIds": [
            "cicd-deployment-strategies",
            "cicd-gitops"
          ],
          "sourceIds": [
            "kubernetes",
            "sre"
          ]
        }
      ]
    },
    {
      "id": "reliability",
      "title": "Distributed systems, reliability, and security operations",
      "level": "Advanced",
      "goal": "Operate under partial failure and prove data integrity, recovery, and user-visible reliability.",
      "entryRequirements": [
        "Complete a repeatable delivery pipeline and know the dependencies of your service.",
        "Establish isolated failure-injection environments, test data, and explicit recovery objectives."
      ],
      "capstone": "Operate a multi-service system with a database, queue, cache, metrics, logs, traces, SLOs, and recovery procedures. Run a controlled game day with a dependency failure and a data restore.",
      "exitCriteria": [
        "Explain consistency and delivery guarantees without relying on product marketing terms.",
        "Demonstrate bounded retries, backpressure, observability, and actionable SLO alerts.",
        "Restore verified data within measured RPO/RTO objectives.",
        "Produce an incident timeline, contributing causes, and tested follow-up actions."
      ],
      "modules": [
        {
          "id": "distributed-systems",
          "title": "Distributed systems, time, consistency, and consensus",
          "prerequisites": [
            "formats-api",
            "k8s-control-plane",
            "sql-basics"
          ],
          "core": [
            "Partial failures, message loss/duplication/reordering, network partitions, and unreliable clocks.",
            "Consistency models, linearizability, causal/eventual consistency, and read-your-writes.",
            "CAP tradeoffs during partitions; replication, leader election, quorum, and durability.",
            "Idempotency, state machines, and separation of safety from liveness."
          ],
          "advanced": [
            "Raft/Paxos concepts, leases, fencing tokens, logical clocks, and replicated logs.",
            "Sharding, rebalancing, anti-entropy, conflict resolution, and failure detector limitations.",
            "Snapshot isolation versus serializability, write skew, session guarantees, quorum intersections, membership changes, and reconfiguration safety."
          ],
          "edgeCases": [
            "A timeout cannot distinguish failure from slow execution.",
            "A majority quorum depends on membership and failure independence.",
            "Split brain, stale leaders, clock skew, lease expiry, and acknowledged writes lost by weak durability configurations."
          ],
          "lab": "Run a small replicated store and observe a partition and leader change. Test stale reads, duplicate writes, and fencing; document which operations remain safe and available.",
          "guideIds": [],
          "sourceIds": [
            "etcd"
          ]
        },
        {
          "id": "databases",
          "title": "Production databases, replication, and schema evolution",
          "prerequisites": [
            "sql-basics",
            "distributed-systems",
            "storage-host"
          ],
          "core": [
            "SQL versus key-value/document/wide-column models; indexes and workload-driven selection.",
            "Transactions, isolation, locks, deadlocks, query plans, connection pools, and slow queries.",
            "Replication, primary/replica roles, read routing, backups, WAL, and point-in-time recovery.",
            "Schema migration, data retention, access control, encryption, and capacity planning."
          ],
          "advanced": [
            "Sharding, online migrations, CDC, consistency/durability knobs, and failover automation.",
            "Vacuum/compaction, partitioning, replication lag, and restore verification.",
            "PostgreSQL vacuum/bloat, write-ahead logging, checkpoints, failover fencing, connection pool modes, and transactional DDL limits."
          ],
          "edgeCases": [
            "Replica reads can lag and violate read-after-write assumptions.",
            "Pool exhaustion is often downstream overload, not a reason for unbounded connections.",
            "Long transactions, hot keys/partitions, lock escalation, lost acknowledgments, and incompatible rollback."
          ],
          "lab": "Profile and improve a slow query, force a deadlock, measure replica lag, perform a compatible migration, and restore to a chosen point in time with integrity checks.",
          "guideIds": [
            "cloud-databases"
          ],
          "sourceIds": [
            "postgres",
            "aws"
          ]
        },
        {
          "id": "messaging",
          "title": "Queues, streams, caches, and asynchronous workflows",
          "prerequisites": [
            "distributed-systems",
            "databases",
            "serverless"
          ],
          "core": [
            "Queue versus log semantics, topics, partitions, consumer groups, offsets, and ordering.",
            "At-most-once/at-least-once processing, idempotent consumers, acknowledgments, and dead-letter handling.",
            "Cache-aside, write-through/write-behind, TTL, invalidation, eviction, and cache coherence.",
            "Backpressure, batching, lag, outbox pattern, and event schema compatibility."
          ],
          "advanced": [
            "Kafka transactions and exactly-once scope; deduplication across external side effects.",
            "Sagas/compensation, replay, poison-message isolation, cache stampede prevention, and hot-key mitigation.",
            "Replication factors, minimum in-sync replicas, durability acknowledgments, consumer rebalance strategies, schema registries, and compaction versus retention."
          ],
          "edgeCases": [
            "Exactly-once within a system does not guarantee exactly-once effects in an external database or API.",
            "A cache failure can overload the source of truth.",
            "Rebalance duplicates, offset commit races, tombstones, lost invalidations, and retention shorter than outage duration."
          ],
          "lab": "Build a transactional outbox and idempotent consumer. Replay duplicates, pause consumption, trigger a poison message and cache stampede, and verify no business action is duplicated.",
          "guideIds": [],
          "sourceIds": [
            "kafka",
            "postgres"
          ]
        },
        {
          "id": "metrics-logs",
          "title": "Metrics, structured logs, and telemetry architecture",
          "prerequisites": [
            "performance-host",
            "formats-api",
            "ci-pipelines"
          ],
          "core": [
            "Counters, gauges, histograms, labels, time series, logs, and traces.",
            "Prometheus scrape/discovery, recording rules, histogram queries, and dashboard design.",
            "Structured JSON logs, correlation IDs, timestamps, centralized collection, and retention.",
            "Golden signals, RED/USE methods, symptoms versus causes, and telemetry ownership.",
            "PromQL range vectors, rates/increases, counter resets, histogram buckets, summaries, recording rules, and missing-series semantics."
          ],
          "advanced": [
            "High cardinality, aggregation, remote write, multi-tenant storage, and telemetry cost controls.",
            "Log sampling, redaction, schema evolution, and profiling/continuous profiling."
          ],
          "edgeCases": [
            "Averages conceal tail latency; quantiles cannot generally be averaged across services.",
            "Missing telemetry is not the same as zero errors.",
            "Unbounded labels, sensitive log data, clock skew, dropped samples, and dashboards that hide data gaps."
          ],
          "lab": "Instrument the service and queue with useful metrics and structured logs. Detect saturation, test missing scrapes, and show p95/p99 latency without incorrect aggregation.",
          "guideIds": [
            "obs-key-pillars",
            "obs-4-golden-signals",
            "obs-structured-logging",
            "obs-apm-solutions"
          ],
          "sourceIds": [
            "prometheus",
            "otel"
          ]
        },
        {
          "id": "tracing",
          "title": "OpenTelemetry, tracing, sampling, and collector pipelines",
          "prerequisites": [
            "metrics-logs",
            "messaging",
            "http"
          ],
          "core": [
            "Trace/span lifecycle, parent/child links, W3C propagation, attributes, events, and resource identity.",
            "Automatic versus manual instrumentation; async context and trace correlation with logs.",
            "OTel Collector receivers, processors, exporters, pipelines, and deployment roles.",
            "Sampling, batching, retry queues, memory limits, and secure transport."
          ],
          "advanced": [
            "Tail versus head sampling, trace completeness, multi-cluster collection, and OTTL transformations.",
            "Collector self-observability, persistent buffering, scale-out, and sampling bias analysis."
          ],
          "edgeCases": [
            "Baggage crosses trust boundaries and can leak sensitive information.",
            "Tail sampling needs appropriate trace routing and memory; it is not free.",
            "Broken async propagation, duplicate instrumentation, mismatched resource attributes, queue overflow, and exporter backpressure."
          ],
          "lab": "Trace a request through HTTP and a queue, inject an error, redact a sensitive attribute, overload an exporter, and demonstrate collector recovery plus loss accounting.",
          "guideIds": [
            "obs-distributed-tracing",
            "obs-otel-collector-transformations"
          ],
          "sourceIds": [
            "otel"
          ]
        },
        {
          "id": "slos",
          "title": "SLIs, SLOs, error budgets, and actionable alerting",
          "prerequisites": [
            "metrics-logs",
            "tracing"
          ],
          "core": [
            "User journeys, valid/good events, availability, latency, correctness, freshness, and durability indicators.",
            "SLO windows, error-budget calculation, burn rates, and release policy.",
            "SLA contractual distinction, symptom-based pages, and ticket-level signals.",
            "Alert ownership, severity, routing, deduplication, runbooks, and escalation."
          ],
          "advanced": [
            "Multi-window/multi-burn-rate alerts, low-volume services, dependency budgets, and composite user journeys.",
            "SLO governance, capacity/error-budget tradeoffs, and alert quality review.",
            "Time-based versus request-based availability, batch/data freshness SLIs, objective selection, and error-budget policy for maintenance/change windows."
          ],
          "edgeCases": [
            "A 200 response can still be incorrect; choose indicators tied to user outcomes.",
            "No requests and missing data must not silently count as perfect reliability.",
            "Unrepresentative synthetic tests, traffic shifts, retry masking, noisy alerts, and rounding tiny budgets."
          ],
          "lab": "Define an availability and latency SLO with explicit exclusions. Replay normal and incident traffic, compute burn rates, and test alert routing and runbook usefulness.",
          "guideIds": [
            "obs-slo-sla-sli",
            "obs-alerting-best-practices"
          ],
          "sourceIds": [
            "sre",
            "prometheus"
          ]
        },
        {
          "id": "resilience",
          "title": "Timeouts, retries, backpressure, and failure containment",
          "prerequisites": [
            "distributed-systems",
            "messaging",
            "slos"
          ],
          "core": [
            "End-to-end deadlines, per-hop timeouts, cancellation, bounded retries, exponential backoff, and jitter.",
            "Circuit breakers, bulkheads, concurrency limits, rate limits, load shedding, and graceful degradation.",
            "Idempotent operations, hedging tradeoffs, retry budgets, and dependency isolation.",
            "Bounded queues, admission control, and saturation-aware autoscaling."
          ],
          "advanced": [
            "Queueing theory, Little’s Law, latency distributions, and overload stability.",
            "Fault injection, controlled chaos experiments, and failure-domain design."
          ],
          "edgeCases": [
            "Nested retry policies can create multiplicative load.",
            "A retry after timeout may duplicate a successful write.",
            "Thundering herds, synchronized retry clocks, circuit-breaker oscillation, stalled cancellation, and unlimited buffering."
          ],
          "lab": "Inject downstream delay/loss and load spikes. Prove queue sizes and retries remain bounded, critical requests remain usable, and recovery does not trigger a retry storm.",
          "guideIds": [],
          "sourceIds": [
            "sre"
          ]
        },
        {
          "id": "capacity",
          "title": "Performance engineering and capacity planning",
          "prerequisites": [
            "performance-host",
            "k8s-scheduling",
            "slos",
            "resilience"
          ],
          "core": [
            "Workload characterization, throughput, concurrency, latency, utilization, and saturation.",
            "Load/stress/soak tests, bottleneck isolation, regression budgets, and reproducible profiling.",
            "Scaling limits, horizontal/vertical scaling, cache efficiency, connection pools, and data locality.",
            "Capacity headroom, demand forecasts, dependency limits, and failure capacity."
          ],
          "advanced": [
            "CPU/memory/network/disk profiles, flame graphs, eBPF, NUMA, and kernel tuning with evidence.",
            "Cost/performance tradeoffs, benchmark bias, coordinated omission, and multi-tenant noisy neighbors."
          ],
          "edgeCases": [
            "A benchmark can omit slow responses and understate tail latency.",
            "Autoscaling reacts late and may be capped by quotas, partitions, or serialized bottlenecks.",
            "Bursty demand, memory leaks, allocator behavior, GC pauses, packet-per-second limits, and testing only warm caches."
          ],
          "lab": "Establish a repeatable benchmark with tail-latency and saturation measurements. Find a real bottleneck, improve it, and show behavior after losing one failure domain.",
          "guideIds": [],
          "sourceIds": [
            "linux",
            "sre",
            "finops"
          ]
        },
        {
          "id": "recovery",
          "title": "Backups, disaster recovery, and business continuity",
          "prerequisites": [
            "databases",
            "k8s-storage",
            "terraform",
            "slos"
          ],
          "core": [
            "RPO/RTO objectives, data inventory, restore dependencies, backup schedules, retention, and encryption.",
            "Application-consistent backups, restore tests, cross-account isolation, immutable copies, and access controls.",
            "Active/passive versus active/active designs; regional recovery, DNS/traffic cutover, and runbooks.",
            "Infrastructure, credentials, certificates, artifacts, configuration, and data needed for a rebuild."
          ],
          "advanced": [
            "Point-in-time recovery, failback, replica divergence, and multi-region consistency tradeoffs.",
            "Game days, cyber-recovery, control-plane unavailability, and recovery sequencing."
          ],
          "edgeCases": [
            "Replicas can copy deletion or corruption; snapshots in one account share compromise risk.",
            "A successful backup job does not prove data can be restored.",
            "Lost keys, missing WAL segments, untested failback, stale DNS, and recovery that exceeds downstream quotas."
          ],
          "lab": "Restore the full service into an isolated environment from backups and IaC. Measure data loss and recovery time, verify record integrity, and demonstrate failback without duplicate writes.",
          "guideIds": [],
          "sourceIds": [
            "sre",
            "postgres",
            "aws"
          ]
        },
        {
          "id": "incident-security",
          "title": "Incident management, security response, and operational learning",
          "prerequisites": [
            "slos",
            "recovery",
            "supply-chain"
          ],
          "core": [
            "On-call handover, incident roles, triage, severity, communications, timelines, and escalation.",
            "Containment, evidence preservation, mitigation, recovery, and follow-up ownership.",
            "Blameless postmortems, contributing factors, remediation verification, and recurring incident reduction.",
            "Security incident response, credential revocation, patching, audit evidence, and data exposure assessment."
          ],
          "advanced": [
            "Threat hunting, runtime detection, forensic acquisition, dependency compromise response, and tabletop exercises.",
            "Toil budgets, operational readiness reviews, runbook testing, and incident trend analysis.",
            "Security response includes scoped credential/session revocation, dependency trust restoration, evidence retention, and coordinated disclosure procedures."
          ],
          "edgeCases": [
            "Containment can destroy evidence or widen downtime if performed blindly.",
            "The first plausible cause is not necessarily the root contributing mechanism.",
            "Unknown blast radius, stale escalation routes, time-zone gaps, and repeated unverified follow-up tasks."
          ],
          "lab": "Run an outage and credential-compromise tabletop. Produce incident roles, evidence/timeline, stakeholder updates, recovery checks, and assigned regression-tested follow-ups.",
          "guideIds": [],
          "sourceIds": [
            "sre",
            "owasp"
          ]
        }
      ]
    },
    {
      "id": "platform",
      "title": "Internal platforms and expert engineering judgment",
      "level": "Advanced → Expert",
      "goal": "Create a platform people can use safely, then demonstrate scale, evolution, governance, and organizational impact.",
      "entryRequirements": [
        "Meet the reliability capstone gates and explain the tradeoffs of your own architecture.",
        "Work with real or representative developer users and define the platform’s supported workload and tenant model."
      ],
      "capstone": "Deliver a self-service platform for two independent teams: service catalog, golden-path template, environment provisioning API, delivery pipeline, policy, telemetry, budgets, documentation, and recovery. Run an upgrade, tenant-isolation test, and recovery exercise; defend your design to reviewers.",
      "exitCriteria": [
        "A new team can deliver a service using the documented path without hidden manual steps.",
        "Tests prove authorization, tenant boundaries, idempotency, lifecycle cleanup, and failure recovery.",
        "Evidence includes adoption/usability feedback, operating cost, SLOs, and migration plans.",
        "Explain rejected alternatives, limitations, support ownership, and how the platform will evolve."
      ],
      "modules": [
        {
          "id": "platform-product",
          "title": "Platform as a product, developer experience, and ownership",
          "prerequisites": [
            "incident-security",
            "ci-pipelines"
          ],
          "core": [
            "Internal user discovery, personas, jobs-to-be-done, friction mapping, and feedback interviews.",
            "Golden paths, paved roads, supported capabilities, escape hatches, and service ownership.",
            "Platform roadmap, build/buy decisions, product boundaries, and adoption strategy.",
            "Docs, onboarding, support channels, service catalog, and explicit responsibility models."
          ],
          "advanced": [
            "Measure onboarding/task completion, developer feedback, adoption, reliability, and delivery outcomes together.",
            "CNCF maturity dimensions; organizational constraints, funding, team interaction modes, and change management."
          ],
          "edgeCases": [
            "Mandated adoption is not proof that the platform solves user problems.",
            "A portal alone is not a functioning platform.",
            "Over-abstraction, missing escape hatches, undocumented ownership, unused features, and support overload."
          ],
          "lab": "Interview representative teams, identify one repeated bottleneck, prototype a golden path, observe users completing it, and compare measured task friction before/after.",
          "guideIds": [],
          "sourceIds": [
            "cncf",
            "backstage"
          ]
        },
        {
          "id": "self-service",
          "title": "Service catalogs, portals, templates, and environment lifecycle",
          "prerequisites": [
            "platform-product",
            "identity",
            "terraform",
            "delivery-strategies"
          ],
          "core": [
            "Catalog entities, ownership, documentation, dependency metadata, and lifecycle status.",
            "Backstage-style templates, CLI/API interfaces, environment creation, and policy checks.",
            "Provision repositories, CI, identity, infrastructure, telemetry, and documentation as a coherent workflow.",
            "Resource ownership, deletion, expiration, quotas, and support escalation."
          ],
          "advanced": [
            "Ephemeral environments, task orchestration, auditability, approval boundaries, and reusable platform components.",
            "Versioned templates, plugin extension, user journey testing, and template migration."
          ],
          "edgeCases": [
            "Template success can leave partial infrastructure if a later step fails.",
            "Deleting a catalog entry does not necessarily delete or safely retain its resources.",
            "Stale ownership, orphaned cloud costs, unsafe template inputs, plugin credentials, and permission drift."
          ],
          "lab": "Create a template that provisions a service and preview environment. Test partial failure cleanup, permission denial, expiry, teardown, and migration to a newer template.",
          "guideIds": [],
          "sourceIds": [
            "backstage",
            "cncf"
          ]
        },
        {
          "id": "platform-apis",
          "title": "Platform API contracts and asynchronous provisioning",
          "prerequisites": [
            "self-service",
            "formats-api",
            "resilience"
          ],
          "core": [
            "Resource-oriented APIs, schemas, validation, ownership, authz, status, and error models.",
            "Async operations, polling/events, idempotency keys, retries, cancellation, and pagination.",
            "Tenant-aware quotas, rate limits, audit trails, and credential boundaries.",
            "Contract tests, documentation, SDKs/CLIs, and backward-compatible versions."
          ],
          "advanced": [
            "Transactional workflow boundaries, sagas, reconciliation, generation/status patterns, and eventual consistency.",
            "API deprecation, customer migration, support contracts, and long-running operation recovery."
          ],
          "edgeCases": [
            "Request acceptance does not imply successful provisioning.",
            "Cancellation may stop waiting while external side effects continue.",
            "Duplicate creates, out-of-order status, cross-tenant object IDs, stuck operations, and unknown downstream outcomes."
          ],
          "lab": "Build an authenticated provisioning API with idempotent creates, observable operation status, bounded retries, tenant checks, and a reconciliation process for interrupted requests.",
          "guideIds": [],
          "sourceIds": [
            "go",
            "owasp"
          ]
        },
        {
          "id": "controllers",
          "title": "Kubernetes extensions, operators, and compositions",
          "prerequisites": [
            "k8s-control-plane",
            "programming",
            "platform-apis"
          ],
          "core": [
            "CRDs, custom resource schemas, controllers, reconciliation, spec/status, owner references, and finalizers.",
            "Work queues, rate limiting, cache/watch patterns, events, and conflict handling.",
            "Operator lifecycle, reconciliation idempotency, external-resource ownership, and cleanup.",
            "Crossplane-style managed resources/compositions and platform-facing abstractions."
          ],
          "advanced": [
            "Conversion webhooks, CRD/API version migration, leader election, sharded controllers, and controller scaling.",
            "Composition revisions, provider trust, drift handling, and control-plane dependency isolation.",
            "Informer cache freshness, optimistic concurrency, status subresources, retry/requeue strategy, tombstones, webhooks, and CRD schema/defaulting/pruning."
          ],
          "edgeCases": [
            "Finalizers can block deletion forever if a controller or external API fails.",
            "Reconcile can run repeatedly or concurrently; do not assume exactly-once execution.",
            "Watch gaps, stale cache reads, conflict retries, non-idempotent external APIs, and orphaned resources after owner deletion."
          ],
          "lab": "Implement a small controller that provisions a disposable external resource. Test repeated reconciliation, restart during create, API throttling, and failed deletion with a documented recovery path.",
          "guideIds": [],
          "sourceIds": [
            "kubernetes",
            "crossplane",
            "go"
          ]
        },
        {
          "id": "tenancy",
          "title": "Multi-tenancy, identity boundaries, and policy as code",
          "prerequisites": [
            "k8s-security",
            "identity",
            "platform-apis"
          ],
          "core": [
            "Tenant model, identity-to-tenant mapping, isolation levels, quotas, and resource ownership.",
            "Namespaces versus separate clusters/accounts; shared services and noisy-neighbor controls.",
            "OPA/Rego or equivalent policy, admission checks, policy tests, and audit evidence.",
            "Secrets, encryption key separation, network/data isolation, and least-privilege delegation."
          ],
          "advanced": [
            "Hostile versus cooperative tenants, virtual clusters, sandboxed workloads, and delegated control planes.",
            "Policy rollout, exceptions with expiry, authorization review, and control-plane availability tradeoffs."
          ],
          "edgeCases": [
            "Namespace/RBAC separation does not isolate host kernel or every shared cluster resource.",
            "Policy at admission may not cover runtime behavior or existing resources.",
            "Cross-tenant cache keys, shared operator credentials, quota starvation, policy outages, and incomplete deletion."
          ],
          "lab": "Provision two tenants; prove denied cross-tenant API/network/storage access, test quota pressure and policy failure, and document remaining trust assumptions.",
          "guideIds": [],
          "sourceIds": [
            "kubernetes",
            "opa",
            "owasp"
          ]
        },
        {
          "id": "fleet",
          "title": "Cluster fleets, upgrades, and multi-region architecture",
          "prerequisites": [
            "recovery",
            "delivery-strategies",
            "controllers",
            "tenancy"
          ],
          "core": [
            "Cluster lifecycle, version inventories, configuration baselines, lifecycle automation, and upgrade waves.",
            "Version skew, API deprecations, addon/CNI/CSI compatibility, and conformance testing.",
            "Multi-region traffic, service discovery, replication, failover/failback, and capacity reserve.",
            "Fleet policy, secrets distribution, artifact access, and regional control dependencies."
          ],
          "advanced": [
            "Cell-based architectures, blast-radius containment, sovereign/edge deployments, and disconnected operation.",
            "Progressive fleet rollout, API conversion, data locality, and multi-cloud exit plans.",
            "Bare-metal bootstrap, node OS/image upgrades, managed-service maintenance windows, DNS/CA trust continuity, and edge connectivity constraints."
          ],
          "edgeCases": [
            "Rolling back a cluster version may not be supported; design restore/rebuild paths.",
            "Region failover can saturate the destination or violate data residency constraints.",
            "Removed APIs, addon incompatibility, global identity outages, stale configuration, and simultaneous rollout failures."
          ],
          "lab": "Upgrade a small cluster fleet in waves with compatibility checks and abort gates. Simulate a regional loss and verify capacity, data integrity, identity, and measured recovery.",
          "guideIds": [],
          "sourceIds": [
            "kubernetes",
            "aws",
            "sre"
          ]
        },
        {
          "id": "finops",
          "title": "FinOps, capacity economics, and sustainability",
          "prerequisites": [
            "capacity",
            "cloud-foundations",
            "platform-product"
          ],
          "core": [
            "Cost allocation, owner tags, budgets, forecasts, unit economics, and cost anomaly response.",
            "Rightsizing, reservations/commitments, spot tradeoffs, storage lifecycle, and network egress.",
            "Showback/chargeback, shared-cost allocation, OpenCost, and billing data normalization such as FOCUS.",
            "Balance cost with availability, performance, developer effort, and operational risk."
          ],
          "advanced": [
            "Marginal versus average cost, workload bin-packing, purchasing strategy, and cost/performance experiments.",
            "Sustainability considerations, hardware utilization, and transparent measurement assumptions."
          ],
          "edgeCases": [
            "Budget alerts are not a guaranteed spending cap.",
            "Savings commitments can strand cost when demand changes.",
            "Idle environments, untagged shared services, duplicate telemetry, NAT/egress surprises, and spot interruption impact."
          ],
          "lab": "Attribute the platform’s cost to tenants, define a unit-cost metric, remove one waste source, and verify reliability/performance remain within targets.",
          "guideIds": [
            "cloud-finops-opencost-focus"
          ],
          "sourceIds": [
            "finops",
            "aws"
          ]
        },
        {
          "id": "governance",
          "title": "Security architecture, compliance evidence, and governance",
          "prerequisites": [
            "tenancy",
            "supply-chain",
            "incident-security"
          ],
          "core": [
            "Control objectives, risk assessment, asset inventory, classification, and responsibility ownership.",
            "Secrets/KMS lifecycle, access reviews, audit logging, vulnerability exceptions, and change records.",
            "Privacy, retention/deletion, residency, encryption boundaries, and data minimization.",
            "Operational policy, threat models, vendor evaluation, licensing, and portability."
          ],
          "advanced": [
            "Control mapping and automated evidence collection without conflating tools with compliance certification.",
            "Hardware roots of trust, attestation, formal policy reasoning, and threat-informed detection."
          ],
          "edgeCases": [
            "A policy check is not proof that every organizational control is satisfied.",
            "Encryption with broadly accessible keys does not create meaningful tenant isolation.",
            "Deleted data in backups, privileged audit gaps, stale access, emergency exceptions, and conflicting retention requirements."
          ],
          "lab": "Produce a control/evidence matrix for the capstone, test key and access rotation, record an expiring exception, and demonstrate audit evidence for a privileged action.",
          "guideIds": [],
          "sourceIds": [
            "owasp",
            "opa"
          ]
        },
        {
          "id": "evolution",
          "title": "Architecture evolution, migrations, and technical leadership",
          "prerequisites": [
            "fleet",
            "governance",
            "finops"
          ],
          "core": [
            "Requirements and constraints, architecture diagrams, ADRs, alternatives, and tradeoff analysis.",
            "Migration sequencing, strangler patterns, compatibility, data reconciliation, and reversible changes.",
            "Deprecation policy, user communication, ownership transfer, and platform lifecycle management.",
            "Build/buy decisions, dependency strategy, staffing, support load, and risk communication."
          ],
          "advanced": [
            "Socio-technical scaling, incident learning, architectural fitness functions, and continuous validation.",
            "Mentoring, design reviews, stakeholder negotiation, reliability prioritization, and vendor exit strategy."
          ],
          "edgeCases": [
            "Big-bang migrations couple too many independent risks.",
            "Dual writes can diverge and make rollback unsafe.",
            "Silent contract consumers, stranded tenants, incompatible state, undocumented tribal knowledge, and unfunded maintenance."
          ],
          "lab": "Write and defend a migration ADR with staged rollout, success/abort gates, data verification, recovery, user communication, cost, and an explicit deprecation plan.",
          "guideIds": [],
          "sourceIds": [
            "cncf",
            "sre"
          ]
        },
        {
          "id": "specialization",
          "title": "Expert specialization and continuous learning",
          "prerequisites": [
            "evolution"
          ],
          "core": [
            "Choose a depth track while retaining broad operating competence: kernel/networking, Kubernetes control planes, security, data reliability, or platform product engineering.",
            "Read primary designs/specifications, reproduce problems, profile implementations, and contribute focused fixes.",
            "Translate unfamiliar incidents into testable models and compare competing solutions with evidence.",
            "Maintain a version/support matrix and revalidate assumptions as upstream behavior changes."
          ],
          "advanced": [
            "Depth extensions: BGP/eBPF/DPDK, storage internals, GPU scheduling, batch/HPC, ML/data platforms, edge/air-gapped systems, Windows/bare metal, or formal distributed-systems methods.",
            "Review current research and production limitations; know when the simpler design is the better one.",
            "ML/AI platform depth: reproducible data/model lineage, training/serving separation, GPU sharing/isolation, artifact governance, inference SLOs, evaluation, and model/API/data trust boundaries."
          ],
          "edgeCases": [
            "Tool expertise alone is not expert engineering judgment.",
            "Passing quizzes or checking every topic does not validate production expertise.",
            "Stale guides, unsupported versions, benchmark overclaims, and transferring assumptions across different trust/failure models."
          ],
          "lab": "Select a specialization, reproduce a real upstream issue or design constraint, build a benchmark/test harness, propose a fix or documented tradeoff, and have an experienced reviewer challenge it.",
          "guideIds": [],
          "sourceIds": [
            "linux",
            "kubernetes",
            "etcd",
            "cncf"
          ]
        }
      ]
    }
  ],
  "sources": [
    {
      "id": "linux",
      "title": "Linux kernel administrator guide",
      "url": "https://docs.kernel.org/admin-guide/index.html"
    },
    {
      "id": "git",
      "title": "Pro Git",
      "url": "https://git-scm.com/book/en/v2"
    },
    {
      "id": "bash",
      "title": "GNU Bash reference manual",
      "url": "https://www.gnu.org/software/bash/manual/"
    },
    {
      "id": "python",
      "title": "Python tutorial and standard library",
      "url": "https://docs.python.org/3/tutorial/"
    },
    {
      "id": "go",
      "title": "Go documentation",
      "url": "https://go.dev/doc/"
    },
    {
      "id": "postgres",
      "title": "PostgreSQL documentation",
      "url": "https://www.postgresql.org/docs/current/index.html"
    },
    {
      "id": "kubernetes",
      "title": "Kubernetes concepts",
      "url": "https://kubernetes.io/docs/concepts/"
    },
    {
      "id": "docker",
      "title": "Docker Build documentation",
      "url": "https://docs.docker.com/build/"
    },
    {
      "id": "aws",
      "title": "AWS Well-Architected Framework",
      "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
    },
    {
      "id": "terraform",
      "title": "Terraform language documentation",
      "url": "https://developer.hashicorp.com/terraform/language"
    },
    {
      "id": "sre",
      "title": "Google SRE Workbook",
      "url": "https://sre.google/workbook/table-of-contents/"
    },
    {
      "id": "otel",
      "title": "OpenTelemetry concepts",
      "url": "https://opentelemetry.io/docs/concepts/"
    },
    {
      "id": "prometheus",
      "title": "Prometheus documentation",
      "url": "https://prometheus.io/docs/introduction/overview/"
    },
    {
      "id": "oauth",
      "title": "OAuth security best current practice: RFC 9700",
      "url": "https://www.rfc-editor.org/info/rfc9700/"
    },
    {
      "id": "owasp",
      "title": "OWASP Cheat Sheet Series",
      "url": "https://cheatsheetseries.owasp.org/"
    },
    {
      "id": "slsa",
      "title": "SLSA specification",
      "url": "https://slsa.dev/spec/v1.2/"
    },
    {
      "id": "etcd",
      "title": "etcd distributed systems learning guide",
      "url": "https://etcd.io/docs/v3.6/learning/"
    },
    {
      "id": "kafka",
      "title": "Apache Kafka documentation",
      "url": "https://kafka.apache.org/documentation/"
    },
    {
      "id": "cncf",
      "title": "CNCF Platform Engineering Maturity Model",
      "url": "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/"
    },
    {
      "id": "backstage",
      "title": "Backstage software templates",
      "url": "https://backstage.io/docs/features/software-templates/"
    },
    {
      "id": "crossplane",
      "title": "Crossplane documentation",
      "url": "https://docs.crossplane.io/"
    },
    {
      "id": "opa",
      "title": "Open Policy Agent documentation",
      "url": "https://www.openpolicyagent.org/docs"
    },
    {
      "id": "finops",
      "title": "FinOps Framework",
      "url": "https://www.finops.org/framework/"
    }
  ]
};
