import { TopicItem } from '@/types';

export const NETWORKING_TOPICS: TopicItem[] = [
  {
    "id": "net-ssh",
    "slug": "ssh-keys-agent-config-tunneling",
    "pillarId": "networking",
    "branch": "right",
    "order": 1,
    "title": "SSH (Secure Shell)",
    "subtitle": "Cryptographic key pairs (ed25519), ~/.ssh/config, agent forwarding, and bastion tunneling",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "SSH",
      "ed25519",
      "Bastion Host",
      "Port Forwarding",
      "Security"
    ],
    "summary": "SSH (Secure Shell) operates on port 22 to provide encrypted remote terminal access, secure file transfers (scp/rsync), and encrypted TCP tunneling through bastion jump hosts.",
    "overview": "Platform engineers rely on SSH for accessing staging compute nodes, debugging Kubernetes worker hosts, and tunneling private database connections securely across public networks.\n\nKey Concepts:\n1. Cryptographic Keys:\n   - Modern standard: Ed25519 (`ssh-keygen -t ed25519`). Shorter, faster, and more cryptographically resilient than legacy RSA 2048/4096.\n   - Public key (`~/.ssh/id_ed25519.pub`) is placed on servers in `~/.ssh/authorized_keys`.\n   - Private key (`~/.ssh/id_ed25519`) remains strictly on the client machine with 600 permissions.\n2. Bastion Jump Hosts & ~/.ssh/config:\n   - Use `ProxyJump` to reach private VPC nodes through a public bastion without exposing the private nodes to the internet.\n3. SSH Port Forwarding:\n   - Local (-L): Forward a local port to a remote destination through SSH (`ssh -L 5432:db.internal:5432 bastion`).\n   - Remote (-R): Forward a remote port back to local machine.",
    "keyConcepts": [
      {
        "title": "Ed25519 vs RSA Keys",
        "explanation": "Ed25519 elliptic-curve keys provide superior security with 256-bit keys that compute signatures faster and resist timing attacks compared to large RSA keys."
      },
      {
        "title": "Bastion Jump Host Automation (ProxyJump)",
        "explanation": "Instead of executing chained SSH logins, `ProxyJump` (or `-J`) establishes an end-to-end encrypted TCP stream through the jump server without decrypting payloads on the bastion."
      }
    ],
    "diagram": {
      "title": "SSH ProxyJump & Local Tunnel Architecture",
      "type": "ascii",
      "code": "Local Engineer Machine            Public Internet / DMZ           Private VPC (No Public IP)\n+-----------------------+         +--------------------+         +------------------------+\n| Developer Laptop      | ======> | Public Bastion Host| ======> | Private RDS Database   |\n| localhost:5432        | (Port 22)| (ProxyJump Router) |         | 10.0.2.45:5432         |\n+-----------------------+         +--------------------+         +------------------------+\n           \\_________________________________________________________________/\n                             End-to-End Encrypted SSH Tunnel"
    },
    "commands": [
      {
        "cmd": "ssh-keygen -t ed25519 -C \"gaurav@infra\"",
        "desc": "Generate a modern secure Ed25519 SSH keypair with a comment",
        "example": "ssh-keygen -t ed25519"
      },
      {
        "cmd": "ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.internal",
        "desc": "Safely install public key into remote server's authorized_keys",
        "example": "ssh-copy-id user@host"
      },
      {
        "cmd": "ssh -L 9000:minio.internal:9000 -N bastion",
        "desc": "Forward local port 9000 to private MinIO server through bastion without opening shell",
        "example": "ssh -L 8080:target:8080 host -N"
      },
      {
        "cmd": "ssh -J bastion.cloud.io user@10.0.1.15",
        "desc": "Connect directly to private IP jumping through public bastion",
        "example": "ssh -J bastion user@private-ip"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "~/.ssh/config",
      "code": "# Production ~/.ssh/config for multi-tier cloud environments\nHost *\n    AddKeysToAgent yes\n    IdentitiesOnly yes\n    ServerAliveInterval 60\n    ServerAliveCountMax 3\n\n# Public Cloud Bastion / Jump Host\nHost bastion-prod\n    HostName bastion.production.company.com\n    User jumpadmin\n    IdentityFile ~/.ssh/id_ed25519\n    Port 22\n\n# Private Kubernetes Worker Nodes (Accessible only through Bastion)\nHost 10.0.*.* *.internal.infra\n    ProxyJump bastion-prod\n    User nodeadmin\n    IdentityFile ~/.ssh/id_ed25519\n    StrictHostKeyChecking accept-new",
      "explanation": "Standardized SSH configuration allowing transparent access to private VPC instances using `ProxyJump` and automated keepalive pings."
    },
    "gotchas": [
      {
        "issue": "SSH Agent Forwarding security vulnerability",
        "resolution": "Using `ssh -A` (agent forwarding) to a shared or untrusted bastion allows anyone with root on the bastion to hijack your local SSH keys. Use `ProxyJump` instead, which never exposes your agent socket to intermediate hosts.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the security difference between SSH Agent Forwarding and ProxyJump?",
        "answer": "Agent Forwarding (`ssh -A`) creates a Unix domain socket on the intermediate server that talks back to your local ssh-agent. Any root user on the bastion can access that socket to authenticate as you. `ProxyJump` simply forwards raw TCP packets without exposing key material or agent sockets.",
        "platformContext": "Common platform security review question for accessing internal cloud infrastructure."
      }
    ],
    "references": [
      {
        "title": "OpenSSH Cookbook",
        "url": "https://en.wikibooks.org/wiki/OpenSSH",
        "source": "OpenSSH",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which SSH key type is currently recommended for new deployments due to performance and security advantages?",
        "options": [
          "ed25519",
          "dsa",
          "rsa-1024",
          "des"
        ],
        "answerIndex": 0,
        "explanation": "Ed25519 elliptic-curve algorithm is the modern gold standard over legacy RSA and deprecated DSA keys."
      }
    ]
  },
  {
    "id": "net-http-https",
    "slug": "http-https-tls-handshake-status-codes",
    "pillarId": "networking",
    "branch": "right",
    "order": 2,
    "title": "HTTP/HTTPS",
    "subtitle": "HTTP/1.1 vs HTTP/2 vs HTTP/3, status codes, header semantics, and TLS handshakes",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "HTTP",
      "HTTPS",
      "HTTP/2",
      "HTTP/3",
      "QUIC",
      "REST",
      "gRPC"
    ],
    "summary": "Understand application-layer transport protocols powering web APIs, microservices, gRPC multiplexing over HTTP/2, and UDP-based QUIC in HTTP/3.",
    "overview": "Hypertext Transfer Protocol (HTTP) is the protocol of the World Wide Web and cloud microservices.\n\nProtocol Evolution:\n1. HTTP/1.1: Head-of-line blocking on single TCP connections. Requires domain sharding and pipelining workarounds.\n2. HTTP/2: Binary framing, connection multiplexing (hundreds of concurrent requests over a single TCP socket), header compression (HPACK), and server push. Required for gRPC communication.\n3. HTTP/3: Runs over QUIC (built on UDP instead of TCP). Eliminates head-of-line blocking during packet loss and supports instant connection migration across networks.\n\nStatus Code Families:\n- 2xx: Success (200 OK, 201 Created, 204 No Content)\n- 3xx: Redirection (301 Moved Permanently, 302 Found, 304 Not Modified)\n- 4xx: Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests)\n- 5xx: Server Error (500 Internal Error, 502 Bad Gateway - upstream died, 503 Service Unavailable, 504 Gateway Timeout)",
    "keyConcepts": [
      {
        "title": "502 Bad Gateway vs 504 Gateway Timeout",
        "explanation": "A 502 occurs when a reverse proxy (like NGINX or AWS ALB) receives an invalid or terminated response from the upstream app container. A 504 occurs when the upstream container fails to reply before the proxy's timeout window expires."
      },
      {
        "title": "HTTP/2 Multiplexing & gRPC",
        "explanation": "Multiple concurrent bidirectional streams are interleaved as binary frames across a single TCP socket, drastically cutting latency and connection overhead for internal platform microservices."
      }
    ],
    "diagram": {
      "title": "HTTP/1.1 vs HTTP/2 Multiplexing",
      "type": "ascii",
      "code": "HTTP/1.1: [Req 1] -> [Resp 1] | [Req 2] -> [Resp 2] (Sequential or Multi-Socket)\n\nHTTP/2:   Single TCP Socket\n          +-------------------------------------------------------+\n          | [Stream 1: Req] [Stream 2: Req] [Stream 1: Chunk] ... |\n          +-------------------------------------------------------+\n          Bidirectional Interleaved Binary Frames (Zero Blocking!)"
    },
    "commands": [
      {
        "cmd": "curl -Iv --http2 https://api.github.com",
        "desc": "Inspect HTTP/2 headers and TLS handshake negotiation details",
        "example": "curl -Iv https://site.com"
      },
      {
        "cmd": "curl -w \"\\nTime Total: %{time_total}s | HTTP Code: %{http_code}\\n\" -s -o /dev/null https://api.endpoint.com",
        "desc": "Benchmark total HTTP response latency and extract status code",
        "example": "curl -w ..."
      },
      {
        "cmd": "openssl s_client -connect google.com:443 -servername google.com",
        "desc": "Inspect raw TLS handshake and certificate chain",
        "example": "openssl s_client -connect host:443"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "http-healthcheck.sh",
      "code": "#!/usr/bin/env bash\n# Production HTTP endpoint health prober measuring latency and response status\nset -euo pipefail\n\nTARGET_URL=\"${1:-https://httpbin.org/status/200}\"\nTIMEOUT_SECONDS=\"5\"\n\nRESPONSE=$(curl -s -w \"\\n%{http_code}|%{time_total}|%{remote_ip}\" \\\n  --max-time \"${TIMEOUT_SECONDS}\" \\\n  -o /tmp/probe_body.txt \"${TARGET_URL}\")\n\nHTTP_STATUS=$(echo \"${RESPONSE}\" | tail -n 1 | cut -d'|' -f1)\nLATENCY=$(echo \"${RESPONSE}\" | tail -n 1 | cut -d'|' -f2)\nREMOTE_IP=$(echo \"${RESPONSE}\" | tail -n 1 | cut -d'|' -f3)\n\necho \"Target      : ${TARGET_URL}\"\necho \"Remote IP   : ${REMOTE_IP}\"\necho \"Status Code : ${HTTP_STATUS}\"\necho \"Latency     : ${LATENCY}s\"\n\nif [[ \"${HTTP_STATUS}\" -ge 200 && \"${HTTP_STATUS}\" -lt 400 ]]; then\n  echo \"Health Check: PASS (Service Healthy)\"\n  exit 0\nelse\n  echo \"Health Check: FAIL (Non-2xx/3xx code returned)\"\n  exit 1\nfi",
      "explanation": "Measures connection time and status code to validate microservice health in synthetic monitoring suites."
    },
    "gotchas": [
      {
        "issue": "Misinterpreting 502 vs 504 errors in ingress controllers",
        "resolution": "502 means your backend crashed or refused the TCP connection immediately (e.g. process OOMKilled). 504 means the backend was processing too slowly (e.g. database query deadlocked or CPU throttled).",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What happens during a TLS 1.3 handshake?",
        "answer": "In TLS 1.3, the handshake is completed in a single round-trip (1-RTT). The client sends a ClientHello containing supported cipher suites and key share guesses. The server replies with ServerHello, selects the cipher, sends its certificate, and finishes with an encrypted key exchange. Subsequent connections can achieve 0-RTT via pre-shared keys.",
        "platformContext": "Critical for minimizing API gateway and service mesh latency."
      }
    ],
    "references": [
      {
        "title": "MDN HTTP Overview",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
        "source": "MDN",
        "type": "official"
      },
      {
        "title": "RFC 9113: HTTP/2 Specification",
        "url": "https://datatracker.ietf.org/doc/html/rfc9113",
        "source": "IETF",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which HTTP status code signifies that an upstream server crashed or dropped connection unexpectedly to a reverse proxy?",
        "options": [
          "502 Bad Gateway",
          "504 Gateway Timeout",
          "404 Not Found",
          "401 Unauthorized"
        ],
        "answerIndex": 0,
        "explanation": "502 Bad Gateway indicates that the reverse proxy received an invalid response or reset from upstream."
      }
    ]
  },
  {
    "id": "net-ports",
    "slug": "what-is-a-port-common-ports",
    "pillarId": "networking",
    "branch": "right",
    "order": 3,
    "title": "What is a Port? Common Ports & Sockets",
    "subtitle": "Transport layer multiplexing, 0-65535 port ranges, well-known services, and ephemeral ports",
    "level": "Beginner",
    "estimatedMinutes": 15,
    "tags": [
      "Ports",
      "Sockets",
      "TCP",
      "UDP",
      "Networking Basics"
    ],
    "summary": "Ports allow a single host with one IP address to run hundreds of distinct network services concurrently by assigning each process a 16-bit numeric identifier.",
    "overview": "An IP address identifies a machine on the network; a Port number identifies the specific application or process inside that machine. The combination of `IP:Port` is called a Socket.\n\nPort Range Classifications (0 - 65,535):\n1. Well-Known System Ports (0 - 1023): Require root privileges to bind on Unix hosts.\n2. Registered Ports (1024 - 49151): Assigned by IANA for specific services (e.g. MySQL, PostgreSQL, Redis).\n3. Dynamic / Ephemeral Ports (49152 - 65535): Outbound client ports assigned by the kernel when initiating outgoing connections.\n\nEssential Platform Engineer Ports:\n- 22: SSH (Remote administration)\n- 53: DNS (Domain resolution, UDP/TCP)\n- 80 / 443: HTTP / HTTPS (Web traffic)\n- 6443: Kubernetes API Server\n- 2379 / 2380: etcd client & peer communication\n- 3306: MySQL / MariaDB\n- 5432: PostgreSQL\n- 6379: Redis in-memory cache\n- 9090: Prometheus Server\n- 3000: Grafana Dashboard",
    "keyConcepts": [
      {
        "title": "Ephemeral Port Exhaustion",
        "explanation": "When a reverse proxy initiates thousands of high-frequency outbound connections without TCP socket reuse, it can deplete the ephemeral port range, causing connection drop errors (`EADDRNOTAVAIL`)."
      },
      {
        "title": "Privileged Ports (<1024) in Containers",
        "explanation": "Binding to port 80 or 443 traditionally required root UID 0. Modern container security best practices run containers as non-root (UID 10001) and bind services to unprivileged ports like 8080 or 8443."
      }
    ],
    "diagram": {
      "title": "Socket Multiplexing on a Single Host IP",
      "type": "ascii",
      "code": "Incoming Network Traffic (Host IP: 198.51.100.10)\n                       |\n      +----------------+----------------+\n      |                |                |\n      v                v                v\n  Port 22           Port 80          Port 5432\n  [sshd]            [nginx]          [postgresql]\n(Remote Shell)    (Web Server)        (Database)"
    },
    "commands": [
      {
        "cmd": "sudo lsof -i -P -n | grep LISTEN",
        "desc": "List all listening ports and the processes owning them without DNS resolution",
        "example": "lsof -i :443"
      },
      {
        "cmd": "cat /proc/sys/net/ipv4/ip_local_port_range",
        "desc": "Display the kernel ephemeral port allocation range",
        "example": "32768   60999"
      },
      {
        "cmd": "nc -zv 127.0.0.1 6443",
        "desc": "Verify if Kubernetes API server port 6443 is accepting connections locally",
        "example": "nc -zv 127.0.0.1 6443"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "audit-open-ports.sh",
      "code": "#!/usr/bin/env bash\n# Audit host listening ports and alert on unintended publicly exposed services\nset -euo pipefail\n\necho \"=== [Active Listening Sockets] ===\"\nss -tulpn | awk 'NR>1 {print $1, $5, $7}' | while read -r proto addr proc; do\n  PORT=$(echo \"${addr}\" | rev | cut -d':' -f1 | rev)\n  IP=$(echo \"${addr}\" | rev | cut -d':' -f2- | rev)\n  \n  if [[ \"${IP}\" == \"0.0.0.0\" || \"${IP}\" == \"*\" || \"${IP}\" == \"[::]\" ]]; then\n    echo \"[EXPOSED PUBLICLY] Proto: ${proto} | Port: ${PORT} | Bound: ${IP} | Proc: ${proc}\"\n  else\n    echo \"[LOCAL ONLY]       Proto: ${proto} | Port: ${PORT} | Bound: ${IP} | Proc: ${proc}\"\n  fi\ndone",
      "explanation": "Audits open listening ports to ensure database or internal management ports are not inadvertently bound to `0.0.0.0` (all public interfaces)."
    },
    "gotchas": [
      {
        "issue": "Binding to 127.0.0.1 inside a container prevents outside access",
        "resolution": "Inside a container, binding a server to `127.0.0.1` binds exclusively to the container's private loopback interface. To make the service accessible via Docker/Kubernetes port forwarding, bind to `0.0.0.0`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the default port for the Kubernetes API Server?",
        "answer": "Port 6443 (HTTPS). The kubelet, kubectl CLI, and cluster controllers communicate with the control plane over this port.",
        "platformContext": "Must be permitted in security groups and network firewalls when bootstrapping control planes."
      }
    ],
    "references": [
      {
        "title": "IANA Service Name and Port Number Registry",
        "url": "https://www.iana.org/assignments/service-names-port-numbers/",
        "source": "IANA",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the default port used by PostgreSQL database engines?",
        "options": [
          "5432",
          "3306",
          "6379",
          "27017"
        ],
        "answerIndex": 0,
        "explanation": "PostgreSQL listens on port 5432 by default (MySQL uses 3306, Redis uses 6379, MongoDB uses 27017)."
      }
    ]
  },
  {
    "id": "net-security",
    "slug": "security-firewalls-vpn-zerotrust",
    "pillarId": "networking",
    "branch": "right",
    "order": 4,
    "title": "Security: Firewalls & VPNs",
    "subtitle": "iptables, nftables, ufw, WireGuard, OpenVPN, and zero-trust overlay networks",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Firewalls",
      "iptables",
      "nftables",
      "WireGuard",
      "VPN",
      "Security"
    ],
    "summary": "Protect infrastructure perimeters with stateful packet filtering firewalls, configure container packet routing with iptables/nftables, and establish encrypted mesh tunnels with WireGuard.",
    "overview": "Network security controls traffic flow across untrusted boundaries.\n\n1. Host Firewalls (iptables / nftables / UFW):\n   - Netfilter: Kernel framework inspecting every packet passing through network hooks (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING).\n   - `iptables` / `nftables`: Define chains and tables (`filter`, `nat`, `mangle`). Kubernetes `kube-proxy` relies on iptables or IPVS to route Service ClusterIPs to Pod endpoints.\n   - `ufw` (Uncomplicated Firewall): User-friendly frontend for Ubuntu hosts.\n\n2. Virtual Private Networks (VPNs) & Overlay Meshes:\n   - WireGuard: Fast, modern, kernel-space VPN using state-of-the-art cryptography (Noise protocol, Curve25519, ChaCha20-Poly1305). Far simpler and faster than OpenVPN or IPsec.\n   - Tailscale / WireGuard Meshes: Zero-Trust Network Access (ZTNA) overlay routing devices without opening public firewall ports.",
    "keyConcepts": [
      {
        "title": "Stateful Packet Inspection",
        "explanation": "Firewalls track TCP handshake connection states (NEW, ESTABLISHED, RELATED). Inbound rules allow responses to outgoing requests automatically."
      },
      {
        "title": "kube-proxy iptables vs IPVS",
        "explanation": "As Kubernetes clusters grow past 5,000 services, sequential iptables rule chains incur CPU overhead. IPVS uses hash tables in the kernel to achieve O(1) packet routing efficiency."
      }
    ],
    "diagram": {
      "title": "Netfilter Packet Traversal Flow in Linux",
      "type": "ascii",
      "code": "Packet arrives on NIC\n         |\n         v\n   [PREROUTING] (DNAT / Service Routing)\n         |\n  Is packet for local host?\n      /          \\\n   [YES]        [NO] ---> [FORWARD] (Containers & Pods)\n     |                       |\n     v                       v\n  [INPUT]               [POSTROUTING] (SNAT / Masquerade)\n     |                       |\n  Local Process          Leaves Host"
    },
    "commands": [
      {
        "cmd": "sudo ufw status verbose",
        "desc": "Check status and active rules in Ubuntu UFW firewall",
        "example": "ufw status"
      },
      {
        "cmd": "sudo ufw default deny incoming && sudo ufw allow 22/tcp",
        "desc": "Enforce default-deny posture allowing only SSH port 22",
        "example": "ufw default deny incoming"
      },
      {
        "cmd": "sudo iptables -L -n -v",
        "desc": "List all iptables firewall rules with packet and byte counters",
        "example": "iptables -L -n -v"
      },
      {
        "cmd": "wg show",
        "desc": "Inspect WireGuard active VPN peers, handshake timestamps, and transferred bytes",
        "example": "wg show"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "hardened-ufw-setup.sh",
      "code": "#!/usr/bin/env bash\n# Production firewall hardening script establishing strict default-deny baseline\nset -euo pipefail\n\n# Reset rules to clean slate\nufw --force reset\n\n# Default posture: Deny all incoming, allow all outgoing\nufw default deny incoming\nufw default allow outgoing\n\n# Allow SSH (Restricted to management bastion subnet if applicable)\nufw allow proto tcp from 10.0.0.0/16 to any port 22 comment 'Internal SSH only'\n\n# Allow Web Traffic\nufw allow 80/tcp comment 'HTTP'\nufw allow 443/tcp comment 'HTTPS'\n\n# Enable logging & activate\nufw logging on\nufw --force enable\n\necho \"Hardened UFW firewall active!\"",
      "explanation": "Configures a defensive default-deny firewall posture while whitelisting strictly required ports."
    },
    "gotchas": [
      {
        "issue": "Docker bypassing UFW rules automatically",
        "resolution": "Docker directly manipulates iptables rules and inserts its `DOCKER` chain before UFW rules. Publishing a port with `-p 8080:8080` exposes it to the entire internet even if UFW blocks 8080! Always bind to localhost `-p 127.0.0.1:8080:8080` or use DOCKER-USER iptables chain.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why does Docker bypass UFW rules by default on Linux servers?",
        "answer": "Docker writes its own rules into the `PREROUTING` and `FORWARD` chains in iptables before UFW's rules are evaluated. Consequently, ports published with `-p` are forwarded directly to the container before UFW's `INPUT` chain can block them.",
        "platformContext": "A critical security trap responsible for accidental exposure of databases and internal admin tools."
      }
    ],
    "references": [
      {
        "title": "WireGuard Technical Whitepaper",
        "url": "https://www.wireguard.com/papers/wireguard.pdf",
        "source": "WireGuard",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which modern cryptographic VPN protocol runs directly in the Linux kernel and replaces legacy IPsec/OpenVPN architectures?",
        "options": [
          "WireGuard",
          "PPTP",
          "SOCKS5",
          "Telnet"
        ],
        "answerIndex": 0,
        "explanation": "WireGuard is implemented directly in the Linux kernel (since 5.6) providing unmatched throughput and modern cryptography."
      }
    ]
  },
  {
    "id": "net-dhcp-mac",
    "slug": "dhcp-mac-address-arp-layer2",
    "pillarId": "networking",
    "branch": "right",
    "order": 5,
    "title": "DHCP & MAC Address",
    "subtitle": "Data Link Layer (L2), ARP tables, DORA dynamic allocation, and static reservations",
    "level": "Beginner",
    "estimatedMinutes": 15,
    "tags": [
      "DHCP",
      "MAC Address",
      "ARP",
      "Layer 2",
      "Networking"
    ],
    "summary": "Understand physical hardware addressing (MAC), the Address Resolution Protocol (ARP), and the 4-step DHCP lease negotiation process powering automated network bootstrapping.",
    "overview": "Before an operating system can communicate over IP (Layer 3), it must establish its identity on the local physical link (Layer 2).\n\nKey Concepts:\n1. MAC Address (Media Access Control):\n   - 48-bit hardware identifier burned into network interface cards (e.g. `00:1A:2B:3C:4D:5E`).\n   - First 24 bits represent the Organizationally Unique Identifier (OUI - manufacturer); last 24 bits identify the specific device.\n2. ARP (Address Resolution Protocol):\n   - Resolves Layer 3 IP addresses to Layer 2 MAC addresses (`ip neigh` or `arp -a`). Broadcasts 'Who has IP X? Tell MAC Y'.\n3. DHCP (Dynamic Host Configuration Protocol):\n   - Automatically configures IP, subnet mask, default gateway, and DNS servers.\n   - Negotiated via the 4-step DORA process:\n     1. Discover: Client broadcasts DHCPDISCOVER to 255.255.255.255.\n     2. Offer: DHCP server responds with DHCPOFFER proposing an IP address.\n     3. Request: Client broadcasts DHCPREQUEST accepting the proposed IP.\n     4. Acknowledge: Server sends DHCPACK confirming the lease duration.",
    "keyConcepts": [
      {
        "title": "DORA Lease Cycle",
        "explanation": "Discover, Offer, Request, Acknowledge. When lease expires or hits 50% lifetime (T1 timer), the client attempts renewal to retain the IP."
      },
      {
        "title": "ARP Cache Poisoning / Spoofing",
        "explanation": "Because traditional ARP lacks authentication, malicious actors can send forged ARP replies claiming their MAC owns the default gateway IP, executing a man-in-the-middle attack."
      }
    ],
    "diagram": {
      "title": "DHCP 4-Step DORA Negotiation",
      "type": "ascii",
      "code": "Client (Booting Node)                    DHCP Server\n        |                                     |\n        | ------ DHCPDISCOVER (Broadcast) --> |\n        |                                     |\n        | <----- DHCPOFFER (Proposing IP) --- |\n        |                                     |\n        | ------ DHCPREQUEST (Accepting) ---> |\n        |                                     |\n        | <----- DHCPACK (Lease Confirmed) -- |\n        |                                     |\n    [Node Configures IP, Netmask, Gateway & DNS]"
    },
    "commands": [
      {
        "cmd": "ip neigh show",
        "desc": "Display local ARP table resolving neighbor IP addresses to MAC addresses",
        "example": "ip neigh show"
      },
      {
        "cmd": "ip link show eth0",
        "desc": "Display MAC address (link/ether) and status of network interface eth0",
        "example": "ip link show eth0"
      },
      {
        "cmd": "arping -I eth0 10.0.0.1",
        "desc": "Send Layer 2 ARP requests to probe reachability and detect IP conflicts",
        "example": "arping -I eth0 10.0.0.1"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "detect-duplicate-ip.sh",
      "code": "#!/usr/bin/env bash\n# Detect duplicate IP collisions on local subnet using gratuitous ARP\nset -euo pipefail\n\nINTERFACE=\"${1:-eth0}\"\nTARGET_IP=\"$(ip -4 addr show \"${INTERFACE}\" | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}')\"\n\necho \"Probing for IP collisions on interface ${INTERFACE} for IP ${TARGET_IP}...\"\n\n# arping returns exit code 0 if another host answers with target IP\nif arping -D -c 2 -I \"${INTERFACE}\" \"${TARGET_IP}\" | grep -q \"Received 0 reply\"; then\n  echo \"No IP collision detected. IP ${TARGET_IP} is unique on link.\"\n  exit 0\nelse\n  echo \"CRITICAL: Duplicate IP address detected for ${TARGET_IP} on local network!\"\n  exit 1\nfi",
      "explanation": "Uses `arping -D` (duplicate address detection) to discover whether another host on the Layer 2 broadcast domain is claiming the same IP."
    },
    "gotchas": [
      {
        "issue": "DHCP lease expiration in cloud VMs causes sudden connection drop",
        "resolution": "If an instance's network manager daemon fails to renew its DHCP lease before the lease expires, the kernel drops the IP configuration and disconnects all active connections. Ensure `systemd-networkd` or `dhclient` runs healthy.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between a MAC address and an IP address?",
        "answer": "A MAC address is a physical Layer 2 identifier assigned to the hardware interface and used for forwarding frames within a local broadcast domain. An IP address is a logical Layer 3 identifier used for routing packets across distinct interconnected networks and subnets.",
        "platformContext": "Fundamental for configuring cloud virtual interfaces, SDN bridges, and Kubernetes CNI plugins."
      }
    ],
    "references": [
      {
        "title": "RFC 2131: Dynamic Host Configuration Protocol",
        "url": "https://datatracker.ietf.org/doc/html/rfc2131",
        "source": "IETF",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What does the acronym DORA represent in DHCP protocol negotiation?",
        "options": [
          "Discover, Offer, Request, Acknowledge",
          "Domain, Origin, Route, Address",
          "Direct, Open, Receive, Allocate",
          "Dynamic, Optimal, Router, Access"
        ],
        "answerIndex": 0,
        "explanation": "DORA stands for the 4 steps: Discover, Offer, Request, and Acknowledge."
      }
    ]
  },
  {
    "id": "net-load-balancing-webservers",
    "slug": "load-balancing-web-servers-nginx-haproxy",
    "pillarId": "networking",
    "branch": "right",
    "order": 6,
    "title": "Load Balancing & Web Servers (NGINX or HAProxy)",
    "subtitle": "Reverse proxies, L4 vs L7 routing, upstream pools, SSL termination, and health checks",
    "level": "Advanced",
    "estimatedMinutes": 25,
    "tags": [
      "Load Balancing",
      "NGINX",
      "HAProxy",
      "Reverse Proxy",
      "L7 Routing"
    ],
    "summary": "Distribute incoming client traffic across horizontal server pools, terminate TLS certificates, enforce rate limiting, and implement zero-downtime rolling deploys using NGINX and HAProxy.",
    "overview": "Load balancers are the traffic controllers of distributed systems, providing scalability, redundancy, and defense against service failure.\n\nKey Architectures:\n1. Layer 4 (Transport Layer) Balancing:\n   - Operates on IP address and TCP/UDP ports. Does not decrypt TLS or inspect HTTP headers. Extremely high throughput and low CPU overhead (e.g. AWS Network Load Balancer, HAProxy TCP mode).\n2. Layer 7 (Application Layer) Balancing:\n   - Inspects HTTP methods, URLs, host headers, cookies, and payloads. Enables path-based routing (e.g. `/api` to app servers, `/static` to CDN), TLS termination, and header rewrites (e.g. NGINX, AWS Application Load Balancer, Traefik, Envoy).\n3. Algorithms:\n   - Round Robin: Distributes sequentially.\n   - Least Connections: Directs new requests to the backend with fewest active connections (ideal for long-lived WebSocket or database queries).\n   - IP Hash: Ensures client sessions persist to the same server.",
    "keyConcepts": [
      {
        "title": "Reverse Proxy vs Forward Proxy",
        "explanation": "A forward proxy sits in front of clients to filter and mask outbound requests. A reverse proxy sits in front of backend servers to intercept inbound requests, cache content, and load balance."
      },
      {
        "title": "Active vs Passive Health Checks",
        "explanation": "Active checks probe backends periodically on `/healthz`. Passive checks monitor live traffic and temporarily remove backends that return consecutive 5xx errors."
      }
    ],
    "diagram": {
      "title": "Layer 7 Reverse Proxy & Load Balancing Flow",
      "type": "ascii",
      "code": "Client Browser / Mobile App\n             |\n     [HTTPS / 443]\n             v\n[NGINX / HAProxy Load Balancer] (Terminates SSL, Buffers, Rate Limits)\n             |\n     +-------+-------+\n     | (Path /api)   | (Path /auth)\n     v               v\n[Upstream Node 1] [Upstream Node 2] [Upstream Node 3]\n (Microservice)    (Microservice)    (Microservice)"
    },
    "commands": [
      {
        "cmd": "sudo nginx -t",
        "desc": "Validate NGINX configuration syntax before applying reloads",
        "example": "nginx -t"
      },
      {
        "cmd": "sudo systemctl reload nginx",
        "desc": "Gracefully reload NGINX workers with zero dropped connections",
        "example": "systemctl reload nginx"
      },
      {
        "cmd": "curl -I -H \"Host: api.example.com\" http://127.0.0.1",
        "desc": "Test virtual host routing through local reverse proxy",
        "example": "curl -I -H ..."
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "nginx-production.conf",
      "code": "# /etc/nginx/conf.d/api-gateway.conf\n# Production Layer 7 Reverse Proxy with TLS termination, health check & rate limiting\nupstream backend_microservices {\n    least_conn;\n    server 10.0.2.11:8080 max_fails=3 fail_timeout=10s;\n    server 10.0.2.12:8080 max_fails=3 fail_timeout=10s;\n    keepalive 32; # Reusable upstream TCP sockets\n}\n\nlimit_req_zone $binary_remote_addr zone=api_limit:10m rate=50r/s;\n\nserver {\n    listen 443 ssl http2;\n    server_name api.company.com;\n\n    ssl_certificate /etc/letsencrypt/live/api.company.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/api.company.com/privkey.pem;\n    ssl_protocols TLSv1.2 TLSv1.3;\n\n    location / {\n        limit_req zone=api_limit burst=20 nodelay;\n\n        proxy_pass http://backend_microservices;\n        proxy_http_version 1.1;\n        proxy_set_header Connection \"\";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_connect_timeout 5s;\n        proxy_read_timeout 30s;\n    }\n}",
      "explanation": "A hardened NGINX configuration implementing `least_conn` upstream balancing, rate limiting, and HTTP/1.1 persistent keepalive connections."
    },
    "gotchas": [
      {
        "issue": "Upstream connection pool starvation due to missing keepalive in proxy_pass",
        "resolution": "By default, NGINX closes TCP connections to upstream servers after every request (`Connection: close`). Adding `proxy_http_version 1.1;` and `proxy_set_header Connection \"\";` allows TCP socket reuse, eliminating socket exhaustion.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between Layer 4 and Layer 7 load balancing?",
        "answer": "Layer 4 load balancers make routing decisions based purely on IP addresses and TCP/UDP ports without inspecting packet payloads or decrypting TLS. Layer 7 balancers terminate TLS and inspect application headers, URLs, cookies, and HTTP methods, enabling content-based routing at the cost of higher CPU overhead.",
        "platformContext": "Fundamental for choosing between AWS ALB vs NLB and configuring Kubernetes Ingress."
      }
    ],
    "references": [
      {
        "title": "NGINX Reverse Proxy Guide",
        "url": "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/",
        "source": "NGINX",
        "type": "official"
      },
      {
        "title": "HAProxy Architecture Guide",
        "url": "https://www.haproxy.org/",
        "source": "HAProxy",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which load balancing algorithm directs incoming requests to the backend server with the lowest number of active client connections?",
        "options": [
          "Least Connections",
          "Round Robin",
          "IP Hash",
          "Random"
        ],
        "answerIndex": 0,
        "explanation": "Least Connections tracks active request counts and assigns new traffic to the server with the lightest active load."
      }
    ]
  },
  {
    "id": "net-dns",
    "slug": "dns-resolution-records-authoritative-recursive",
    "pillarId": "networking",
    "branch": "left",
    "order": 7,
    "title": "DNS (Domain Name System)",
    "subtitle": "Hierarchical name resolution, record types (A, CNAME, TXT, MX), recursive vs authoritative, and dig",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "DNS",
      "dig",
      "Route53",
      "CoreDNS",
      "Networking"
    ],
    "summary": "DNS maps human-readable domain names to machine-routable IP addresses across a globally distributed hierarchical database.",
    "overview": "Every web request begins with a DNS lookup. In Kubernetes, DNS (CoreDNS) is also the primary mechanism for internal service discovery.\n\nResolution Hierarchy:\n1. Root Servers (.): 13 root server clusters globally.\n2. Top-Level Domain (TLD) Servers (.com, .org, .io).\n3. Authoritative Name Servers: Holds the actual DNS records for a domain (e.g. AWS Route 53, Cloudflare).\n4. Recursive Resolvers: Queries the hierarchy on behalf of clients (e.g. 1.1.1.1, 8.8.8.8, or company DNS) and caches responses based on TTL.\n\nCritical Record Types:\n- `A`: Maps hostname to IPv4 address (`example.com -> 93.184.216.34`).\n- `AAAA`: Maps hostname to IPv6 address.\n- `CNAME`: Canonical Name (alias to another domain name).\n- `MX`: Mail Exchange records for email delivery.\n- `TXT`: Text records used for SPF, DKIM, and domain ownership verification.\n- `SRV`: Service record defining port, weight, and target (used in service discovery).",
    "keyConcepts": [
      {
        "title": "Time To Live (TTL) & Propagation",
        "explanation": "TTL determines how long recursive resolvers cache a record. Before executing a DNS migration or IP cutover, reduce TTL to 60-300 seconds well in advance to prevent stale caching."
      },
      {
        "title": "CoreDNS in Kubernetes",
        "explanation": "Kubernetes runs CoreDNS as an internal cluster service. A service named `orders` in namespace `prod` resolves to `orders.prod.svc.cluster.local` with an internal ClusterIP."
      }
    ],
    "diagram": {
      "title": "DNS Resolution Flow (Recursive Query)",
      "type": "ascii",
      "code": "Client Browser ===> [Recursive Resolver (1.1.1.1)]\n                         |\n                         +---> 1. Query Root Server (.)\n                         |     <--- Returns .com TLD Server\n                         |\n                         +---> 2. Query .com TLD Server\n                         |     <--- Returns Authoritative Nameserver\n                         |\n                         `---> 3. Query Authoritative NS (Route53)\n                               <--- Returns IP (198.51.100.25) (Cached with TTL)"
    },
    "commands": [
      {
        "cmd": "dig +short api.github.com",
        "desc": "Quickly query the resolved IPv4 address without verbose headers",
        "example": "dig +short domain.com"
      },
      {
        "cmd": "dig @8.8.8.8 example.com ANY",
        "desc": "Directly query Google's public resolver for all records",
        "example": "dig @1.1.1.1 host"
      },
      {
        "cmd": "dig +trace company.com",
        "desc": "Trace the entire resolution path from root servers down to authoritative NS",
        "example": "dig +trace company.com"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "dns-propagation-checker.sh",
      "code": "#!/usr/bin/env bash\n# Verify DNS propagation across global public resolvers and authoritative server\nset -euo pipefail\n\nDOMAIN=\"${1:-google.com}\"\nRESOLVERS=(\n  \"1.1.1.1 (Cloudflare)\"\n  \"8.8.8.8 (Google)\"\n  \"9.9.9.9 (Quad9)\"\n  \"208.67.222.222 (OpenDNS)\"\n)\n\necho \"=== [Checking DNS Records for ${DOMAIN}] ===\"\nfor item in \"${RESOLVERS[@]}\"; do\n  IP=$(echo \"${item}\" | cut -d' ' -f1)\n  NAME=$(echo \"${item}\" | cut -d' ' -f2-)\n  RESULT=$(dig \"@${IP}\" +short +time=2 \"${DOMAIN}\" | tr '\\n' ' ')\n  echo \"${NAME} [${IP}] -> ${RESULT:-NO_ANSWER}\"\ndone",
      "explanation": "Tests multiple public DNS resolvers concurrently to verify global record propagation during domain migration."
    },
    "gotchas": [
      {
        "issue": "CNAME record placed at apex/root domain (@)",
        "resolution": "RFC 1034 states that a CNAME record cannot coexist with other records (like MX or NS). Placing a CNAME at `domain.com` breaks email delivery. Use DNS provider ALIAS or ANAME records instead.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the ndots:5 issue in Kubernetes DNS?",
        "answer": "By default, `/etc/resolv.conf` in Kubernetes pods sets `ndots:5`. Any hostname with fewer than 5 dots (e.g. `api.stripe.com`, which has 2 dots) will first query internal search paths like `api.stripe.com.<namespace>.svc.cluster.local`, causing CoreDNS traffic to surge 4x-5x before resolving externally. Setting `ndots:2` or appending a trailing dot (`api.stripe.com.`) resolves this.",
        "platformContext": "A classic high-traffic CoreDNS performance bottleneck tested in Senior SRE interviews."
      }
    ],
    "references": [
      {
        "title": "Cloudflare DNS Learning Guide",
        "url": "https://www.cloudflare.com/learning/dns/what-is-dns/",
        "source": "Cloudflare",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which DNS record type acts as an alias pointing to another domain name rather than an IP address?",
        "options": [
          "CNAME",
          "A",
          "TXT",
          "PTR"
        ],
        "answerIndex": 0,
        "explanation": "A CNAME (Canonical Name) record aliases one domain name to another canonical domain."
      }
    ]
  },
  {
    "id": "net-ssl-tls",
    "slug": "ssl-tls-certificate-management-pki",
    "pillarId": "networking",
    "branch": "left",
    "order": 8,
    "title": "SSL / TLS Certificate Management",
    "subtitle": "Public Key Infrastructure (PKI), TLS 1.3, Let's Encrypt, Certbot, cert-manager, and mTLS",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "TLS",
      "SSL",
      "Certificates",
      "Certbot",
      "cert-manager",
      "mTLS"
    ],
    "summary": "Implement end-to-end encryption in transit, automate certificate issuance and renewals with ACME / Let's Encrypt, and establish mutual TLS (mTLS) for zero-trust microservices.",
    "overview": "Transport Layer Security (TLS) ensures privacy, integrity, and authenticity across networks.\n\nKey Concepts:\n1. Public Key Infrastructure (PKI):\n   - Asymmetric cryptography: Server holds private key; distributes public certificate signed by a trusted Certificate Authority (CA).\n   - Certificate Chains: Server Certificate -> Intermediate CA -> Root CA (trusted in OS trust store).\n2. Automated ACME Protocol & Let's Encrypt:\n   - Let's Encrypt issues free 90-day certificates verified via HTTP-01 or DNS-01 challenges using `certbot`.\n3. Kubernetes cert-manager:\n   - Cloud-native certificate controller automating issuance and renewal for Ingress resources.\n4. Mutual TLS (mTLS):\n   - Both server and client present certificates to verify mutual identity. Standard across service meshes (Istio, Linkerd).",
    "keyConcepts": [
      {
        "title": "DNS-01 vs HTTP-01 ACME Challenges",
        "explanation": "HTTP-01 requires a publicly reachable port 80 to verify domain ownership. DNS-01 creates a TXT record via DNS API, allowing certificates for private internal environments and wildcards (`*.example.com`)."
      },
      {
        "title": "Automated Renewal Cycles",
        "explanation": "Let's Encrypt certificates expire in 90 days. Systems must automate renewals at 60 days to prevent production outages caused by expired certificates."
      }
    ],
    "diagram": {
      "title": "Public Key Infrastructure (PKI) Chain of Trust",
      "type": "ascii",
      "code": "[Root Certificate Authority] (Pre-installed in OS / Browser Trust Store)\n             |\n             v (Signs Intermediate)\n[Intermediate CA] (e.g. Let's Encrypt R3 Authority)\n             |\n             v (Signs Leaf Certificate)\n[Leaf Domain Certificate] (api.company.com)\n             |\n     Validated by Client via Cryptographic Signature Verification"
    },
    "commands": [
      {
        "cmd": "openssl x509 -in cert.pem -text -noout | grep -E \"Issuer|Not After|Subject:\"",
        "desc": "Inspect certificate expiration date, issuer, and domain subject",
        "example": "openssl x509 -in cert.pem -noout -dates"
      },
      {
        "cmd": "certbot certonly --standalone -d api.company.com",
        "desc": "Obtain certificate using standalone ACME server with Certbot",
        "example": "certbot certonly ..."
      },
      {
        "cmd": "openssl s_client -connect api.company.com:443 -servername api.company.com 2>/dev/null | openssl x509 -noout -dates",
        "desc": "Check live TLS certificate expiration date over the network",
        "example": "openssl s_client ..."
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "cert-expiry-monitor.sh",
      "code": "#!/usr/bin/env bash\n# Production TLS certificate expiration alert script for on-call engineers\nset -euo pipefail\n\nTARGET_HOST=\"${1:-api.github.com}\"\nTARGET_PORT=\"${2:-443}\"\nWARN_DAYS_THRESHOLD=30\n\necho \"Probing TLS certificate for ${TARGET_HOST}:${TARGET_PORT}...\"\nEXPIRY_DATE=$(openssl s_client -connect \"${TARGET_HOST}:${TARGET_PORT}\" \\\n  -servername \"${TARGET_HOST}\" </dev/null 2>/dev/null | \\\n  openssl x509 -noout -enddate | cut -d'=' -f2)\n\nEXPIRY_EPOCH=$(date -d \"${EXPIRY_DATE}\" +%s 2>/dev/null || date -j -f \"%b %d %T %Y %Z\" \"${EXPIRY_DATE}\" +%s)\nCURRENT_EPOCH=$(date +%s)\nDAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))\n\necho \"Expiration Date : ${EXPIRY_DATE}\"\necho \"Days Remaining  : ${DAYS_LEFT} days\"\n\nif [ \"${DAYS_LEFT}\" -lt \"${WARN_DAYS_THRESHOLD}\" ]; then\n  echo \"WARNING: Certificate expires in under ${WARN_DAYS_THRESHOLD} days! Triggering renewal alert.\"\n  exit 1\nelse\n  echo \"Certificate status: HEALTHY (Valid for ${DAYS_LEFT} days)\"\n  exit 0\nfi",
      "explanation": "Extracts certificate metadata over network sockets and computes remaining validity days to prevent unexpected expirations."
    },
    "gotchas": [
      {
        "issue": "Missing intermediate certificates in web server configuration",
        "resolution": "If your web server serves only the leaf certificate instead of the full chain (`fullchain.pem`), desktop browsers with cached intermediates will connect, but mobile devices and CLI tools like `curl` will fail with 'certificate signed by unknown authority'. Always serve the full chain bundle.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between TLS and mTLS?",
        "answer": "In standard TLS, only the server proves its identity to the client via a certificate; the client remains anonymous until authenticating at the application layer. In mutual TLS (mTLS), both client and server present certificates and verify each other before any data exchange begins.",
        "platformContext": "Standard zero-trust networking architecture for Kubernetes service meshes."
      }
    ],
    "references": [
      {
        "title": "Let's Encrypt How It Works",
        "url": "https://letsencrypt.org/howitworks/",
        "source": "Let's Encrypt",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which ACME challenge type allows issuing wildcard TLS certificates (*.domain.com) without exposing port 80?",
        "options": [
          "DNS-01",
          "HTTP-01",
          "TLS-ALPN-01",
          "FTP-01"
        ],
        "answerIndex": 0,
        "explanation": "DNS-01 verifies domain ownership via DNS TXT records, making it the only standard challenge capable of issuing wildcard certificates."
      }
    ]
  },
  {
    "id": "net-tcp-udp",
    "slug": "tcp-vs-udp-handshake-reliability-quic",
    "pillarId": "networking",
    "branch": "left",
    "order": 9,
    "title": "TCP vs UDP",
    "subtitle": "Layer 4 transport, 3-way handshake (SYN, SYN-ACK, ACK), flow control, and UDP streaming",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "TCP",
      "UDP",
      "3-way Handshake",
      "Layer 4",
      "Networking"
    ],
    "summary": "Understand fundamental differences between connection-oriented reliable TCP and lightweight connectionless UDP protocols governing internet traffic.",
    "overview": "Layer 4 of the OSI model handles end-to-end communication between hosts.\n\n1. TCP (Transmission Control Protocol):\n   - Connection-Oriented: Requires a 3-way handshake (`SYN`, `SYN-ACK`, `ACK`) before sending data.\n   - Reliability: Packets are sequenced; missing packets are detected and retransmitted.\n   - Flow Control & Congestion Control: Uses sliding window mechanisms and congestion algorithms (BBR, Cubic) to match receiver buffer speeds and avoid network saturation.\n   - Use cases: Web (HTTP/1.1 & HTTP/2), database connections, SSH, file transfer.\n\n2. UDP (User Datagram Protocol):\n   - Connectionless: Sends datagrams immediately without handshakes or acknowledgments.\n   - Low Latency: Minimal overhead (8-byte header vs 20-60 bytes in TCP). No retransmission delays.\n   - Use cases: DNS queries, VoIP, live video streaming, multiplayer gaming, HTTP/3 (QUIC).",
    "keyConcepts": [
      {
        "title": "TCP 3-Way Handshake",
        "explanation": "Client sends SYN (proposing initial sequence number). Server replies with SYN-ACK (acknowledging client's seq and proposing its own). Client replies with ACK. Connection is established."
      },
      {
        "title": "TCP TIME_WAIT State",
        "explanation": "When an active TCP connection closes, the socket enters TIME_WAIT for 2x Maximum Segment Lifetime (typically 60s) to guarantee late-arriving packets are discarded rather than corrupting a new connection."
      }
    ],
    "diagram": {
      "title": "TCP 3-Way Handshake Flow",
      "type": "ascii",
      "code": "Client Host                                   Server Host\n     |                                             |\n     | -------- 1. SYN (seq=100) ----------------> |  (Server allocates TCB buffer)\n     |                                             |\n     | <------- 2. SYN-ACK (ack=101, seq=300) ---- |  (Server acknowledges)\n     |                                             |\n     | -------- 3. ACK (ack=301) ----------------> |  (Connection ESTABLISHED)\n     |                                             |\n     | ======= Data Transfer (HTTP / TLS) ======== |"
    },
    "commands": [
      {
        "cmd": "ss -s",
        "desc": "Display summary of sockets (TCP total, established, time-wait, closed)",
        "example": "ss -s"
      },
      {
        "cmd": "sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn) != 0'",
        "desc": "Capture live TCP SYN packets to monitor incoming connection attempts",
        "example": "tcpdump -i any tcp port 80"
      },
      {
        "cmd": "nc -u -zv 8.8.8.8 53",
        "desc": "Probe UDP connectivity to Google DNS on port 53",
        "example": "nc -u -zv host 53"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "tune-tcp-stack.sh",
      "code": "#!/usr/bin/env bash\n# Production Linux kernel TCP stack tuning for high-throughput container hosts\nset -euo pipefail\n\ncat << 'EOF' > /etc/sysctl.d/99-high-performance-tcp.conf\n# Increase max backlog of pending TCP connection requests\nnet.core.somaxconn = 65535\nnet.ipv4.tcp_max_syn_backlog = 65535\n\n# Enable modern Google BBR congestion control algorithm\nnet.core.default_qdisc = fq\nnet.ipv4.tcp_congestion_control = bbr\n\n# Fast socket recycling and fin timeout\nnet.ipv4.tcp_fin_timeout = 15\nnet.ipv4.tcp_tw_reuse = 1\n\n# Max open file descriptors\nfs.file-max = 2097152\nEOF\n\nsysctl --system\necho \"High-performance TCP kernel parameters applied successfully!\"",
      "explanation": "Tunes host kernel sysctl parameters to enable Google BBR congestion control and increase TCP connection limits."
    },
    "gotchas": [
      {
        "issue": "SYN Flood Denial-of-Service attacks filling kernel backlog queue",
        "resolution": "Attackers send millions of SYN packets from spoofed IPs without sending final ACKs. Enable SYN cookies in `/proc/sys/net/ipv4/tcp_syncookies = 1` to cryptographically encode connection state in sequence numbers without exhausting server memory.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why did HTTP/3 choose UDP instead of TCP as its underlying transport layer?",
        "answer": "TCP suffers from head-of-line blocking: if a single packet is dropped in transit, the entire TCP connection halts until that packet is retransmitted, stalling all multiplexed HTTP/2 streams. HTTP/3 builds QUIC on top of UDP to handle packet loss per stream independently without stalling unrelated streams.",
        "platformContext": "Modern web performance and edge CDN networking question."
      }
    ],
    "references": [
      {
        "title": "RFC 793: Transmission Control Protocol",
        "url": "https://datatracker.ietf.org/doc/html/rfc793",
        "source": "IETF",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the correct 3-step packet sequence of the TCP connection handshake?",
        "options": [
          "SYN, SYN-ACK, ACK",
          "ACK, SYN, FIN",
          "HELLO, ACCEPT, OK",
          "PING, PONG, ACK"
        ],
        "answerIndex": 0,
        "explanation": "TCP establishes a connection via SYN (synchronize), SYN-ACK (synchronize-acknowledge), and ACK (acknowledge)."
      }
    ]
  },
  {
    "id": "net-architecture",
    "slug": "network-architecture-cidr-subnets-ipv4-ipv6",
    "pillarId": "networking",
    "branch": "left",
    "order": 10,
    "title": "Network Architecture: CIDR, Subnets & IP Ranges",
    "subtitle": "Classless Inter-Domain Routing (CIDR), RFC 1918 private ranges, IPv4 vs IPv6, and subnet sizing",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "CIDR",
      "Subnets",
      "RFC1918",
      "IPv4",
      "IPv6",
      "VPC Architecture"
    ],
    "summary": "Design scalable cloud VPCs, calculate subnet capacities with CIDR bitmasks, allocate RFC 1918 private IP blocks, and avoid overlapping network ranges.",
    "overview": "Network architecture is the foundation of cloud infrastructure. A poorly architected CIDR block causes routing deadlocks when connecting VPCs, Kubernetes clusters, and on-premises datacenters.\n\nKey Concepts:\n1. CIDR Notation (Classless Inter-Domain Routing):\n   - Format: `IP/PrefixLength` (e.g. `10.0.0.0/16`).\n   - Prefix length denotes fixed network bits; remaining bits (`32 - prefix`) denote available host IPs (`2^(32-prefix)`).\n   - `/16` = 65,536 total addresses (Typical Cloud VPC).\n   - `/24` = 256 total addresses (Typical subnet).\n   - In cloud providers (AWS/Azure/GCP), 5 IP addresses per subnet are reserved for network, router, DNS, broadcast, and future use.\n2. RFC 1918 Private IP Ranges (Non-routable over public internet):\n   - `10.0.0.0/8` (10.0.0.0 - 10.255.255.255) -> 16 million IPs.\n   - `172.16.0.0/12` (172.16.0.0 - 172.31.255.255) -> 1 million IPs.\n   - `192.168.0.0/16` (192.168.0.0 - 192.168.255.255) -> 65,536 IPs.\n3. IPv4 vs IPv6:\n   - IPv4 is 32-bit (4.3 billion addresses, exhausted).\n   - IPv6 is 128-bit (3.4 x 10^38 addresses), represented in hexadecimal with native end-to-end routing without NAT.",
    "keyConcepts": [
      {
        "title": "Avoiding Overlapping CIDR Blocks",
        "explanation": "Never provision two VPCs or Kubernetes clusters with identical CIDR ranges (e.g. both using `10.0.0.0/16`). Overlapping CIDRs prevent VPC peering, AWS Transit Gateway routing, and VPN connectivity."
      },
      {
        "title": "Kubernetes Pod IP Planning",
        "explanation": "Each Kubernetes node requires a CIDR slice (often `/24` = 254 pods per node). In AWS EKS using the AWS VPC CNI, pods receive secondary private IPs directly from the VPC subnet, demanding large subnet allocations."
      }
    ],
    "diagram": {
      "title": "Cloud VPC Subnet Architecture (10.0.0.0/16)",
      "type": "ascii",
      "code": "+-------------------------------------------------------------------------+\n|                    VPC CIDR Block: 10.0.0.0/16 (65,536 IPs)             |\n+-------------------------------------------------------------------------+\n|  Public Subnet A (10.0.1.0/24)          |  Public Subnet B (10.0.2.0/24)|\n|  [NAT Gateway, ALBs, Bastions]          |  [Redundant NAT GW, ALBs]     |\n+-----------------------------------------+-------------------------------+\n|  Private Subnet A (10.0.10.0/24)        |  Private Subnet B (10.0.20.0/24)\n|  [Kubernetes Nodes, Microservices]      |  [Kubernetes Worker Nodes]    |\n+-----------------------------------------+-------------------------------+\n|  Database Subnet A (10.0.100.0/24)      |  Database Subnet B (10.0.200.0/24)\n|  [Postgres Primary (RDS)]               |  [Postgres Replica (RDS)]     |\n+-----------------------------------------+-------------------------------+"
    },
    "commands": [
      {
        "cmd": "python3 -c \"import ipaddress; net=ipaddress.ip_network('10.0.1.0/24'); print('Hosts:', net.num_addresses - 5, 'Netmask:', net.netmask)\"",
        "desc": "Calculate usable cloud hosts and netmask for a CIDR block",
        "example": "python3 -c ..."
      },
      {
        "cmd": "ip calc 172.16.0.0/20 2>/dev/null || ipcalc 172.16.0.0/20",
        "desc": "Display detailed CIDR subnet breakdown, broadcast, and address ranges",
        "example": "ipcalc 10.0.0.0/16"
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "cidr_calculator.py",
      "code": "#!/usr/bin/env python3\n\"\"\"\nProduction VPC Subnet Planner\nValidates CIDR blocks, computes usable cloud capacity, and checks for overlaps.\n\"\"\"\nimport ipaddress\n\ndef plan_vpc(vpc_cidr_str, subnet_cidrs):\n    vpc = ipaddress.ip_network(vpc_cidr_str)\n    print(f\"=== VPC: {vpc} ===\")\n    print(f\"Total Capacity: {vpc.num_addresses} IP addresses\\n\")\n    \n    subnets = [ipaddress.ip_network(s) for s in subnet_cidrs]\n    \n    # Check containment\n    for sub in subnets:\n        if not sub.subnet_of(vpc):\n            raise ValueError(f\"Subnet {sub} is NOT within VPC {vpc}!\")\n            \n    # Check overlaps\n    for i in range(len(subnets)):\n        for j in range(i + 1, len(subnets)):\n            if subnets[i].overlaps(subnets[j]):\n                raise ValueError(f\"COLLISION: Subnet {subnets[i]} overlaps with {subnets[j]}!\")\n                \n    for sub in subnets:\n        cloud_usable = max(0, sub.num_addresses - 5)\n        print(f\"Subnet: {str(sub):<18} | Netmask: {str(sub.netmask):<15} | Usable Cloud IPs: {cloud_usable}\")\n\nif __name__ == \"__main__\":\n    plan_vpc(\"10.0.0.0/16\", [\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.10.0/22\", \"10.0.20.0/22\"])",
      "explanation": "Programmatically validates subnet planning, flags IP range collisions, and computes usable cloud host capacities."
    },
    "gotchas": [
      {
        "issue": "Subnet exhaustion in AWS EKS clusters",
        "resolution": "AWS VPC CNI assigns real VPC IPs to every container pod. Allocating a small subnet (like `/24` = 251 usable IPs) causes pods to fail with `CreatePodSandboxError` when cluster scales. Plan subnets with at least `/20` or `/19` for Kubernetes worker nodes.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How many total IP addresses are in a /24 CIDR block, and how many are usable in an AWS subnet?",
        "answer": "A /24 network has 2^(32-24) = 256 total IP addresses. In AWS, 5 addresses are reserved (Network, VPC Router, DNS, Future Reserve, Broadcast), leaving 251 usable IPs for EC2 instances and pods.",
        "platformContext": "Standard networking question during cloud architecture and CKA interviews."
      }
    ],
    "references": [
      {
        "title": "RFC 1918: Address Allocation for Private Internets",
        "url": "https://datatracker.ietf.org/doc/html/rfc1918",
        "source": "IETF",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which of the following IP ranges is defined by RFC 1918 as a private, non-routable range?",
        "options": [
          "10.0.0.0/8",
          "8.8.8.0/24",
          "1.1.1.0/24",
          "198.51.100.0/24"
        ],
        "answerIndex": 0,
        "explanation": "10.0.0.0/8 is the largest designated RFC 1918 private IP address block."
      }
    ]
  },
  {
    "id": "net-routers-switches-nat",
    "slug": "routers-switches-nat-gateways",
    "pillarId": "networking",
    "branch": "left",
    "order": 11,
    "title": "Routers, Switches & NAT Gateways",
    "subtitle": "Layer 2 MAC switching, Layer 3 IP routing, SNAT vs DNAT, and Cloud NAT Gateways",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Routers",
      "Switches",
      "NAT Gateway",
      "SNAT",
      "DNAT",
      "Networking"
    ],
    "summary": "Understand packet routing across network segments, default gateways, and Network Address Translation (NAT) enabling private instances to access external internet APIs securely.",
    "overview": "Moving packets between containers, virtual machines, and the public internet relies on Layer 2 and Layer 3 forwarding hardware and software abstractions.\n\nKey Concepts:\n1. Switches (OSI Layer 2):\n   - Forward Ethernet frames based on destination MAC addresses stored in a CAM (Content Addressable Memory) table.\n   - Operates strictly within the same local broadcast domain / subnet.\n2. Routers (OSI Layer 3):\n   - Route IP packets across different networks and subnets based on routing tables (`ip route`).\n   - Strips Layer 2 frame headers, inspects Layer 3 destination IP, looks up next-hop gateway, and re-encapsulates the frame.\n3. Network Address Translation (NAT):\n   - SNAT (Source NAT / Masquerade): Replaces the private source IP of an outbound packet with the public IP of the NAT Gateway. Allows private database/app nodes to download patches without being reachable from the public internet.\n   - DNAT (Destination NAT): Rewrites destination IP/port of inbound packets to route traffic to an internal private address (used in port forwarding and Docker container port publishing).",
    "keyConcepts": [
      {
        "title": "Cloud NAT Gateways in Private Subnets",
        "explanation": "Private subnets route `0.0.0.0/0` outbound traffic to a NAT Gateway located in a public subnet. The NAT Gateway maps connections via dynamic port translation, preserving ingress isolation."
      },
      {
        "title": "SNAT Port Exhaustion",
        "explanation": "A single NAT Gateway has 64,000 ephemeral ports per assigned Elastic IP. If thousands of microservices open outbound connections simultaneously to the same third-party endpoint, SNAT port allocation can fail."
      }
    ],
    "diagram": {
      "title": "SNAT Traffic Flow Through Cloud NAT Gateway",
      "type": "ascii",
      "code": "Private App Instance (10.0.10.5) ---> Initiates HTTPS request to api.stripe.com\n       |\n       v (Routes via VPC Route Table)\n[Public NAT Gateway] (Public Elastic IP: 54.210.15.20)\n       |  (Rewrites Source IP from 10.0.10.5 to 54.210.15.20)\n       v\nInternet / External API\n       |  (Replies to 54.210.15.20)\n       v\n[Public NAT Gateway] (Translates destination back to 10.0.10.5)\n       |\n       v\nPrivate App Instance receives response! (Inbound access strictly blocked)"
    },
    "commands": [
      {
        "cmd": "sudo iptables -t nat -L -n -v",
        "desc": "Inspect kernel NAT tables and SNAT/DNAT rules",
        "example": "iptables -t nat -L"
      },
      {
        "cmd": "traceroute -n 8.8.8.8",
        "desc": "Inspect every router hop along the path to destination",
        "example": "traceroute 8.8.8.8"
      },
      {
        "cmd": "curl -s ifconfig.me",
        "desc": "Query public egress IP to verify NAT Gateway translation",
        "example": "curl -s ifconfig.me"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "configure-linux-nat.sh",
      "code": "#!/usr/bin/env bash\n# Configure a Linux VM as an egress NAT router for a private subnet\nset -euo pipefail\n\nPUBLIC_IF=\"eth0\"\nPRIVATE_IF=\"eth1\"\n\necho \"Enabling IPv4 forwarding in kernel...\"\nsysctl -w net.ipv4.ip_forward=1\necho \"net.ipv4.ip_forward = 1\" >> /etc/sysctl.d/99-nat-forwarding.conf\n\necho \"Configuring IP Masquerade (SNAT) via ${PUBLIC_IF}...\"\niptables -t nat -A POSTROUTING -o \"${PUBLIC_IF}\" -j MASQUERADE\n\necho \"Allowing forwarded established traffic...\"\niptables -A FORWARD -i \"${PUBLIC_IF}\" -o \"${PRIVATE_IF}\" -m state --state RELATED,ESTABLISHED -j ACCEPT\niptables -A FORWARD -i \"${PRIVATE_IF}\" -o \"${PUBLIC_IF}\" -j ACCEPT\n\necho \"Linux NAT router configured!\"",
      "explanation": "Configures a Linux host to act as a stateful egress NAT gateway using kernel IP forwarding and iptables masquerading."
    },
    "gotchas": [
      {
        "issue": "Placing NAT Gateway in a private subnet",
        "resolution": "A NAT Gateway must itself reside in a public subnet with an attached Internet Gateway (IGW) route to reach the internet. Placing a NAT Gateway in a private subnet breaks outbound connectivity.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between SNAT and DNAT?",
        "answer": "Source NAT (SNAT) rewrites the source IP address of an outgoing packet so internal private nodes can share one public IP for internet access. Destination NAT (DNAT) rewrites the destination IP of an incoming packet to route external traffic to a specific private internal server.",
        "platformContext": "Core concept for container port publishing (`docker -p`) and cloud VPC routing."
      }
    ],
    "references": [
      {
        "title": "AWS VPC NAT Gateway Documentation",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which form of NAT allows private instances with non-routable IPs to initiate outbound internet connections without accepting inbound connections?",
        "options": [
          "Source NAT (SNAT / Masquerade)",
          "Destination NAT (DNAT)",
          "Static NAT (1:1)",
          "Reverse Proxy"
        ],
        "answerIndex": 0,
        "explanation": "SNAT rewrites outgoing source IPs, masking internal addresses while blocking unsolicited inbound connections."
      }
    ]
  }
];
