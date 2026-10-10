'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  text: string;
}

const COMMAND_RESPONSES: Record<string, string> = {
  'help': `Available Commands in Platform Shell:
  • Linux System:      uname -a, whoami, uptime, free -h, df -h, cat /etc/os-release
  • Networking:        ip a, ip route, ss -tulpn, dig google.com, ping -c 3 8.8.8.8
  • Containers:        docker ps, docker images, docker info
  • Kubernetes:        kubectl get nodes, kubectl get pods -A, kubectl get svc
  • Infrastructure:    terraform version, terraform plan, terraform state list
  • Shell Controls:    clear, history, echo <text>, help`,

  'whoami': 'platform-engineer',

  'uname -a': 'Linux platform-node-01 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',

  'cat /etc/os-release': `PRETTY_NAME="Ubuntu 24.04 LTS (Noble Numbat)"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04 LTS"
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"`,

  'uptime': ' 14:22:15 up 42 days, 3:18,  2 users,  load average: 0.18, 0.22, 0.19',

  'free -h': `               total        used        free      shared  buff/cache   available
Mem:            16Gi       4.8Gi       6.2Gi       256Mi       5.0Gi        10Gi
Swap:          2.0Gi          0B       2.0Gi`,

  'df -h': `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   50G   18G   30G  38% /
/dev/nvme1n1    100G   24G   72G  25% /var/lib/docker
tmpfs           7.8G     0  7.8G   0% /dev/shm
overlay          50G   18G   30G  38% /var/lib/docker/overlay2/merged`,

  'ip a': `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP qlen 1000
    link/ether 02:42:0a:00:01:05 brd ff:ff:ff:ff:ff:ff
    inet 10.0.1.5/24 brd 10.0.1.255 scope global dynamic eth0
3: cni0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP
    inet 10.244.0.1/24 brd 10.244.0.255 scope global cni0`,

  'ip route': `default via 10.0.1.1 dev eth0 proto dhcp src 10.0.1.5 metric 100
10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.5
10.244.0.0/24 dev cni0 proto kernel scope link src 10.244.0.1`,

  'ss -tulpn': `Netid State  Recv-Q Send-Q   Local Address:Port   Peer Address:Port Process
tcp   LISTEN 0      128            0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=842,fd=3))
tcp   LISTEN 0      511            0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=1204,fd=6))
tcp   LISTEN 0      511            0.0.0.0:443         0.0.0.0:*     users:(("nginx",pid=1204,fd=7))
tcp   LISTEN 0      128          127.0.0.1:6443        0.0.0.0:*     users:(("kube-apiserver",pid=2102,fd=9))
tcp   LISTEN 0      128          127.0.0.1:9090        0.0.0.0:*     users:(("prometheus",pid=3115,fd=8))`,

  'ping -c 3 8.8.8.8': `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=14.0 ms

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max/mdev = 13.842/14.015/14.218/0.155 ms`,

  'dig google.com': `; <<>> DiG 9.18.28-1ubuntu0.24.04.1 <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 38291
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;google.com.			IN	A

;; ANSWER SECTION:
google.com.		245	IN	A	142.250.190.46

;; Query time: 12 msec
;; SERVER: 10.0.1.2#53(10.0.1.2)
;; WHEN: Sat Oct 10 14:22:20 UTC 2026
;; MSG SIZE  rcvd: 55`,

  'docker ps': `CONTAINER ID   IMAGE                          COMMAND                  CREATED        STATUS        PORTS                               NAMES
4a9f201bce42   nginx:alpine                   "/docker-entrypoint.…"   2 hours ago    Up 2 hours    0.0.0.0:80->80/tcp, :::80->80/tcp   edge-reverse-proxy
98d7cb129a31   prom/prometheus:v2.52.0        "/bin/prometheus --c…"   5 hours ago    Up 5 hours    127.0.0.1:9090->9090/tcp            telemetry-prometheus
f18a42c301d2   postgres:16-alpine             "docker-entrypoint.s…"   2 days ago     Up 2 days     127.0.0.1:5432->5432/tcp            production-postgres`,

  'docker images': `REPOSITORY         TAG       IMAGE ID       CREATED        SIZE
nginx              alpine    a6eb3e670d8a   3 days ago     42.1MB
prom/prometheus    v2.52.0   5d23e618ac14   2 weeks ago    215MB
postgres           16-alpine e3810f69a19c   3 weeks ago    389MB
gcr.io/distroless  static    841b80d0d8fa   1 month ago    18.4MB`,

  'docker info': `Client: Docker Engine - Community
 Version:           26.1.4
 Server:
  Containers: 3
   Running: 3
   Paused: 0
   Stopped: 0
  Images: 4
  Server Version: 26.1.4
  Storage Driver: overlay2
  Cgroup Version: 2`,

  'kubectl get nodes': `NAME                    STATUS   ROLES           AGE   VERSION
control-plane-node-01   Ready    control-plane   34d   v1.30.2
worker-node-us-east-1a  Ready    <none>          34d   v1.30.2
worker-node-us-east-1b  Ready    <none>          34d   v1.30.2`,

  'kubectl get pods -A': `NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE
kube-system   coredns-7db6d8ff4d-5q8xk                  1/1     Running   0          34d
kube-system   etcd-control-plane-node-01                1/1     Running   0          34d
kube-system   kube-apiserver-control-plane-node-01      1/1     Running   0          34d
kube-system   kube-proxy-8zkm2                          1/1     Running   0          34d
production    checkout-service-78f9f4c7d9-2bx82         1/1     Running   0          4h
production    payment-service-54c86b4f7b-9wkq1          1/1     Running   0          18h
monitoring    prometheus-server-84fdb68987-5zmnq        1/1     Running   0          2d`,

  'kubectl get svc': `NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes         ClusterIP   10.96.0.1       <none>        443/TCP          34d
checkout-service   ClusterIP   10.96.128.45    <none>        8080/TCP         4h
payment-service    ClusterIP   10.96.210.82    <none>        8080/TCP         18h
ingress-nginx      NodePort    10.96.44.19     <none>        80:30080/TCP     34d`,

  'terraform version': `Terraform v1.8.5
on linux_amd64
+ provider registry.terraform.io/hashicorp/aws v5.55.0
+ provider registry.terraform.io/hashicorp/kubernetes v2.30.0`,

  'terraform plan': `Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_s3_bucket.artifacts will be created
  + resource "aws_s3_bucket" "artifacts" {
      + arn                         = (known after apply)
      + bucket                      = "company-platform-artifacts-prod"
      + bucket_domain_name          = (known after apply)
      + id                          = (known after apply)
      + force_destroy               = false
    }

Plan: 1 to add, 0 to change, 0 to destroy.`,

  'terraform state list': `module.vpc.aws_vpc.this[0]
module.vpc.aws_subnet.private[0]
module.vpc.aws_subnet.public[0]
module.eks.aws_eks_cluster.this[0]
aws_security_group.allow_tls`,
};

const SUGGESTIONS = [
  'help',
  'kubectl get pods -A',
  'docker ps',
  'free -h',
  'ss -tulpn',
  'dig google.com',
  'terraform plan',
  'cat /etc/os-release',
];

export function TerminalSimulator() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: '🚀 Welcome to the Platform Engineering Interactive Shell Simulator v1.0',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" to inspect supported Linux, Docker, K8s, and Terraform commands.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    // Append input line
    const inputLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: cmd,
    };

    let newLines = [...lines, inputLine];

    if (cmd === 'clear') {
      setLines([]);
      setInputVal('');
      return;
    }

    if (cmd.startsWith('echo ')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: cmd.slice(5).replace(/^["']|["']$/g, ''),
      });
    } else if (cmd === 'history') {
      const historyList = history.map((h, i) => `  ${i + 1}  ${h}`).join('\n');
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: historyList || 'No command history recorded yet.',
      });
    } else if (COMMAND_RESPONSES[cmd]) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: COMMAND_RESPONSES[cmd],
      });
    } else {
      newLines.push({
        id: `err-${Date.now()}`,
        type: 'error',
        text: `bash: ${cmd.split(' ')[0]}: command not found in simulation sandbox. Type 'help' for supported commands.`,
      });
    }

    setLines(newLines);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-xs text-slate-400">
            platform-node-01: ~ (bash 5.2)
          </span>
        </div>
        <button
          onClick={() => setLines([])}
          title="Clear screen"
          className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 bg-slate-900/40 p-2.5">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 mr-1">
          Quick Run:
        </span>
        {SUGGESTIONS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[11px] text-sky-400 hover:border-sky-500 hover:bg-slate-900 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="h-[460px] overflow-y-auto p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-200"
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-2">
            {line.type === 'input' ? (
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <span className="text-emerald-400 font-bold">guest@platform-node:~$</span>
                <span className="text-white">{line.text}</span>
              </div>
            ) : line.type === 'error' ? (
              <div className="text-rose-400 whitespace-pre-wrap">{line.text}</div>
            ) : (
              <div className="text-slate-300 whitespace-pre-wrap">{line.text}</div>
            )}
          </div>
        ))}

        {/* Input prompt */}
        <div className="flex items-center gap-2 text-sky-400 mt-2">
          <span className="text-emerald-400 font-bold shrink-0">guest@platform-node:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command or click quick run above..."
            autoFocus
            className="flex-1 bg-transparent text-white focus:outline-none"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
