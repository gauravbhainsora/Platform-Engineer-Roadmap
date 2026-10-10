import { TopicItem } from '@/types';

export const LINUX_TOPICS: TopicItem[] = [
  {
    "id": "linux-overview-distributions",
    "slug": "what-is-it-overview-distributions",
    "pillarId": "linux",
    "branch": "right",
    "order": 1,
    "title": "What is it? How it's used & Overview of Distributions",
    "subtitle": "The Unix-like open-source operating system kernel powering the global cloud infrastructure",
    "level": "Beginner",
    "estimatedMinutes": 15,
    "tags": [
      "Linux Kernel",
      "GNU",
      "Distributions",
      "Debian",
      "RHEL",
      "Ubuntu",
      "Alpine"
    ],
    "summary": "Linux is a free, open-source monolithic Unix-like operating system kernel created by Linus Torvalds in 1991. Paired with GNU userland utilities, it forms the foundation of servers, container images, Android, and 95%+ of top cloud workloads.",
    "overview": "In modern platform engineering, Linux is not merely an OS\u2014it is the execution runtime for every microservice, Kubernetes worker node, and Docker container. Choosing the right distribution influences package stability, container attack surface, security CVE patching speed, and memory overhead.\n\nThe Linux ecosystem is organized into primary distribution families:\n1. Debian Family (Debian, Ubuntu): Features the APT package manager and `.deb` packages. Ubuntu Server is widely adopted across hyperscalers for compute instances.\n2. Red Hat Family (RHEL, Rocky Linux, AlmaLinux, Fedora): Features RPM/DNF packaging, strict SELinux mandatory access controls, and long-term enterprise certifications.\n3. Alpine Linux: Ultra-minimalistic (~5MB base image) built on musl libc and BusyBox, ubiquitous as a base image for lightweight container packaging.\n4. Arch Linux: Rolling release using pacman, popular for edge systems and development rigs needing bleeding-edge kernel features.",
    "keyConcepts": [
      {
        "title": "Monolithic Kernel Architecture",
        "explanation": "Linux executes device drivers, memory management, process scheduling, and network stacks inside kernel space for maximum performance, while isolating userland applications in user space."
      },
      {
        "title": "Kernel vs GNU Userland",
        "explanation": "The kernel manages hardware and system calls (syscalls). GNU utilities (coreutils, bash, glibc) provide the shell environment and user-facing commands that platform engineers interact with."
      },
      {
        "title": "Distribution Trade-offs",
        "explanation": "Enterprise servers prefer RHEL/Ubuntu LTS for ABI stability and 5-10 year support windows. Production container images prioritize minimal attack surface using Alpine or Google Distroless."
      }
    ],
    "diagram": {
      "title": "Linux Architecture & Distribution Hierarchy",
      "type": "ascii",
      "code": "+-------------------------------------------------------------+\n|                      User Applications                      |\n|             (Nginx, Docker, Python, Go, Node.js)            |\n+-------------------------------------------------------------+\n|                     GNU Userland / Libc                     |\n|              (glibc / musl, bash, coreutils, systemd)       |\n+-------------------------------------------------------------+\n|                 System Call Interface (syscalls)             |\n+-------------------------------------------------------------+\n|                         Linux Kernel                        |\n|   [Process Scheduler] [Memory Manager] [VFS] [Network Stack] |\n+-------------------------------------------------------------+\n|                     Hardware & Peripherals                  |\n|                  (CPU, RAM, Disks, NICs, GPUs)              |\n+-------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "uname -r",
        "desc": "Display the running Linux kernel version",
        "example": "6.8.0-40-generic"
      },
      {
        "cmd": "cat /etc/os-release",
        "desc": "Inspect distribution details, release codename, and version ID",
        "example": "NAME=\"Ubuntu\" VERSION=\"24.04 LTS\""
      },
      {
        "cmd": "hostnamectl",
        "desc": "Show system hostname, operating system, kernel architecture, and virtualization type",
        "example": "hostnamectl status"
      },
      {
        "cmd": "lscpu",
        "desc": "List CPU architecture, cores, sockets, threads, and virtualization extensions",
        "example": "lscpu | grep \"Model name\""
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "verify-node-distro.sh",
      "code": "#!/usr/bin/env bash\n# Production health check verifying host OS, kernel version, and container runtime readiness\nset -euo pipefail\n\necho \"=== [Node Distribution Inspection] ===\"\nif [ -f /etc/os-release ]; then\n  . /etc/os-release\n  echo \"Distribution : ${PRETTY_NAME:-$NAME}\"\n  echo \"ID / Version : ${ID} / ${VERSION_ID:-unknown}\"\nelse\n  echo \"Warning: /etc/os-release not found!\"\nfi\n\necho \"Kernel       : $(uname -srm)\"\necho \"Uptime       : $(uptime -p)\"\necho \"Memory (MB)  : $(free -m | awk '/Mem:/ {print $3\" used / \"$2\" total\"}')\"\n\n# Validate cgroups v2 availability (crucial for modern Kubernetes & Docker)\nif [ -f /sys/fs/cgroup/cgroup.controllers ]; then\n  echo \"cgroups      : cgroups v2 enabled (Modern Cloud Native Standard)\"\nelse\n  echo \"cgroups      : cgroups v1 detected (Legacy)\"\nfi",
      "explanation": "A standard platform node bootstrapping snippet to determine host distribution, kernel release, and cgroups v2 support prior to joining a Kubernetes cluster."
    },
    "gotchas": [
      {
        "issue": "Alpine Linux musl vs glibc DNS & Memory Allocation",
        "resolution": "Alpine uses musl libc, which historically handles multithreaded DNS timeouts and memory allocation differently than glibc. For high-throughput Python/C++ binaries, test thoroughly or consider Debian-slim base images.",
        "severity": "warning"
      },
      {
        "issue": "Kernel Sysctl Tuning for High Connection Density",
        "resolution": "Default distribution kernel parameters limit file descriptors and TCP socket queues. Increase `fs.file-max` and `net.core.somaxconn` in `/etc/sysctl.d/99-kubernetes.conf`.",
        "severity": "tip"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between Linux kernel space and user space?",
        "answer": "Kernel space has unrestricted execution access to the underlying hardware and memory addresses (Ring 0 on x86). User space (Ring 3) isolates application processes so that an application crash does not bring down the entire operating system. Applications communicate with the kernel exclusively via system calls.",
        "platformContext": "Essential for understanding container isolation, seccomp filters, and eBPF observability tools."
      }
    ],
    "references": [
      {
        "title": "The Linux Kernel Archives",
        "url": "https://kernel.org/",
        "source": "kernel.org",
        "type": "official"
      },
      {
        "title": "Debian Administrator's Handbook",
        "url": "https://debian-handbook.info/",
        "source": "Debian",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which component provides the bridge between user applications and the Linux kernel?",
        "options": [
          "System Call Interface (syscalls)",
          "BIOS/UEFI",
          "systemd journal",
          "Cron daemon"
        ],
        "answerIndex": 0,
        "explanation": "System calls (syscalls) like read, write, fork, and socket are the primary programmatic interface for user-space programs to request kernel operations."
      },
      {
        "id": "q2",
        "question": "Why is Alpine Linux commonly chosen for container base images?",
        "options": [
          "It uses systemd by default",
          "It has a minimal footprint (~5MB) built on musl and BusyBox",
          "It is officially certified by Red Hat",
          "It supports glibc natively without patches"
        ],
        "answerIndex": 1,
        "explanation": "Alpine delivers extremely tiny image sizes and reduced vulnerability surfaces by pairing musl libc with BusyBox."
      }
    ]
  },
  {
    "id": "linux-basic-commands-navigation",
    "slug": "basic-commands-navigation-file-directory-structure",
    "pillarId": "linux",
    "branch": "right",
    "order": 2,
    "title": "Basic Commands & Navigation, File & Directory Structure",
    "subtitle": "Master the Filesystem Hierarchy Standard (FHS) and essential CLI navigation",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "FHS",
      "Navigation",
      "CLI",
      "Directory Structure",
      "Linux Filesystem"
    ],
    "summary": "Linux organizes all files in a single unified hierarchical tree starting at the root directory `/`. The Filesystem Hierarchy Standard (FHS) defines the exact purpose of directories like `/etc`, `/var`, `/proc`, and `/sys`.",
    "overview": "Unlike Windows with drive letters (C:\\, D:\\), Linux unifies all physical storage devices, virtual filesystems, and network mounts into one tree rooted at `/`.\n\nKey FHS Directories:\n- `/bin` & `/usr/bin`: Essential binary executables for all users.\n- `/etc`: Host-specific system configuration files (e.g. nginx configs, hosts, fstab).\n- `/var`: Variable data that changes during system operation (e.g. `/var/log` for logs, `/var/lib/docker` for container layers).\n- `/proc` & `/sys`: Virtual pseudo-filesystems exposing kernel runtime states, hardware devices, and running process memory (e.g. `/proc/cpuinfo`, `/proc/sys/net/`).\n- `/tmp`: Ephemeral scratch files emptied on reboot or via tmpwatch.",
    "keyConcepts": [
      {
        "title": "Filesystem Hierarchy Standard (FHS)",
        "explanation": "Guarantees cross-distribution consistency so software and administrators know where configuration, binaries, and logs reside."
      },
      {
        "title": "Virtual Pseudo-filesystems (/proc and /sys)",
        "explanation": "Files in `/proc` do not consume disk space; they are in-memory kernel data structures exposed as files for easy shell reading and tuning."
      }
    ],
    "diagram": {
      "title": "Linux Filesystem Hierarchy Tree",
      "type": "ascii",
      "code": "/ (Root)\n|-- bin -> usr/bin (User Binaries)\n|-- etc/ (Configuration Files: nginx.conf, passwd, hosts)\n|-- home/ (User personal directories)\n|-- proc/ (Virtual: Process memory & Kernel state)\n|-- sys/ (Virtual: Hardware & Device drivers)\n|-- tmp/ (Temporary files)\n|-- usr/ (User utilities, libraries, share)\n`-- var/\n    |-- log/ (System logs: journal, syslog)\n    `-- lib/docker (Container images & runtime storage)"
    },
    "commands": [
      {
        "cmd": "pwd",
        "desc": "Print Current Working Directory",
        "example": "/var/log/nginx"
      },
      {
        "cmd": "ls -lah",
        "desc": "List all files including hidden with human-readable sizes and permissions",
        "example": "ls -lah /var/log"
      },
      {
        "cmd": "cd -",
        "desc": "Toggle back to the previous working directory",
        "example": "cd -"
      },
      {
        "cmd": "find /var/log -type f -name \"*.log\" -mtime -7",
        "desc": "Find log files modified within the past 7 days",
        "example": "find /var/log -name \"*.log\""
      },
      {
        "cmd": "tree -L 2 /etc",
        "desc": "Visualize directory structure up to depth 2",
        "example": "tree -L 2 /etc"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "fhs-audit.sh",
      "code": "#!/usr/bin/env bash\n# Checks key FHS mount point health and identifies top space consumers\nset -euo pipefail\n\necho \"=== Disk Usage by Critical FHS Partitions ===\"\ndf -h / /var /tmp /home\n\necho \"\n=== Top 5 Space Consumers in /var/log ===\"\ndu -sh /var/log/* 2>/dev/null | sort -hr | head -n 5\n\necho \"\n=== Kernel Tunables via /proc/sys ===\"\necho \"TCP Fin Timeout : $(cat /proc/sys/net/ipv4/tcp_fin_timeout)\"\necho \"Max Open Files  : $(cat /proc/sys/fs/file-max)\"",
      "explanation": "Script to inspect key directories defined by the FHS and query virtual `/proc` kernel tunables."
    },
    "gotchas": [
      {
        "issue": "Filling up /var/log causing system lockup",
        "resolution": "If `/var/log` fills 100% of the root partition, services like Docker or databases crash because they cannot append write-ahead logs. Always configure logrotate and place `/var` on a dedicated volume.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the purpose of the /proc filesystem in Linux?",
        "answer": "It is a pseudo-filesystem generated dynamically by the kernel in RAM. It contains runtime system information (hardware, memory, processes) and allows viewing and modifying kernel parameters on the fly without rebooting.",
        "platformContext": "Container tools inspect `/proc/<PID>/ns` to enter container namespaces and debug runtime processes."
      }
    ],
    "references": [
      {
        "title": "Filesystem Hierarchy Standard (FHS 3.0)",
        "url": "https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html",
        "source": "Linux Foundation",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Where are system-wide configuration files stored according to the FHS?",
        "options": [
          "/etc",
          "/var",
          "/usr/bin",
          "/opt"
        ],
        "answerIndex": 0,
        "explanation": "/etc contains host-specific system configuration files for all installed services."
      }
    ]
  },
  {
    "id": "linux-text-editors",
    "slug": "text-editors-nano-vim",
    "pillarId": "linux",
    "branch": "right",
    "order": 3,
    "title": "Text Editors (nano or vim)",
    "subtitle": "Productivity, modes, remote editing, and config manipulation in headless environments",
    "level": "Beginner",
    "estimatedMinutes": 15,
    "tags": [
      "Vim",
      "Nano",
      "CLI Editing",
      "Modal Editing",
      "Sysadmin Productivity"
    ],
    "summary": "Platform engineers regularly manage remote cloud VMs, bastion hosts, and container debug shells without graphical interfaces. Proficiency in terminal text editors like vim and nano is essential.",
    "overview": "When modifying configuration files over SSH or troubleshooting a pod via `kubectl exec`, GUI editors are unavailable.\n\n1. GNU nano: Simple, modeless editor. Commands are displayed along the bottom (`Ctrl+O` to write out, `Ctrl+X` to exit, `Ctrl+W` to search).\n2. Vim (Vi IMproved): High-efficiency modal editor with three primary modes:\n   - Normal Mode: Default navigation mode (`h, j, k, l`, `gg`, `G`, `/pattern`, `dd` to delete lines, `u` to undo).\n   - Insert Mode: Entered by pressing `i` or `a`; allows text entry. Return to Normal Mode with `Esc`.\n   - Command-Line Mode: Entered by pressing `:`; `:w` (save), `:q` (exit), `:wq` (save & quit), `:q!` (quit discarding changes), `:%s/foo/bar/g` (search & replace).",
    "keyConcepts": [
      {
        "title": "Modal Editing Architecture",
        "explanation": "Separating navigation/editing commands from raw text typing allows rapid edits with fewer keystrokes and no mouse interaction."
      },
      {
        "title": "Vim Configuration (~/.vimrc)",
        "explanation": "Customizing line numbers, syntax highlighting, and 2-space YAML indentation prevents catastrophic indentation bugs in Kubernetes manifests."
      }
    ],
    "diagram": {
      "title": "Vim Mode Transitions",
      "type": "ascii",
      "code": "         +-----------------------------+\n         |         Normal Mode         |<-------+\n         |  (Navigation, dd, yy, u)    |        |\n         +-----------------------------+        |\n           /          ^             \\           |\n    press |           | press        | press    | press\n     'i'  |           | 'Esc'        | ':'      | 'Esc'\n          v           |              v          |\n  +---------------+   |      +-----------------++\n  |  Insert Mode  |---+      |  Command Mode   |\n  | (Typing text) |          | (:w, :q!, :%s)  |\n  +---------------+          +-----------------+"
    },
    "commands": [
      {
        "cmd": "vim /etc/nginx/nginx.conf",
        "desc": "Open file in Vim",
        "example": "vim filename"
      },
      {
        "cmd": ":set number",
        "desc": "In Vim command mode: display line numbers",
        "example": ":set nu"
      },
      {
        "cmd": ":%s/http/https/g",
        "desc": "In Vim command mode: replace all instances of 'http' with 'https'",
        "example": ":%s/old/new/g"
      },
      {
        "cmd": "nano /etc/hosts",
        "desc": "Open file in Nano editor for simple edits",
        "example": "nano /etc/hosts"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": ".vimrc",
      "code": "\" Recommended ~/.vimrc for Platform & DevOps Engineers\n\" Optimizes Vim for YAML (Kubernetes/Ansible/Helm) and Bash scripting\nsyntax on\nset number\nset relativenumber\nset tabstop=2\nset shiftwidth=2\nset expandtab\nset autoindent\nset cursorline\nset showmatch\n\n\" Highlight trailing whitespace\nhighlight ExtraWhitespace ctermbg=red guibg=red\nmatch ExtraWhitespace /\\s\\+$/\n\n\" YAML specific autocommand\nautocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab indentkeys-=0# indentkeys-=<:>",
      "explanation": "A battle-tested `.vimrc` for DevOps engineers working with YAML, ensuring strict 2-space indentation and highlighting trailing whitespace."
    },
    "gotchas": [
      {
        "issue": "Accidental tabs instead of spaces in Kubernetes YAML",
        "resolution": "YAML syntax forbids hard tabs. Configure `set expandtab` and `set shiftwidth=2` in your Vim config to automatically convert tabs to spaces.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you substitute a string across all lines in Vim?",
        "answer": "In Command-line mode, enter `:%s/search_term/replace_term/g`. The `%` specifies the entire file range, `s` stands for substitute, and `g` replaces all occurrences on each line.",
        "platformContext": "Useful when rapidly refactoring server URLs or cluster IPs across configuration files."
      }
    ],
    "references": [
      {
        "title": "Vim Documentation",
        "url": "https://www.vim.org/docs.php",
        "source": "vim.org",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "How do you exit Vim discarding any unsaved modifications?",
        "options": [
          ":q!",
          ":w",
          ":x",
          "Ctrl+C"
        ],
        "answerIndex": 0,
        "explanation": "The command `:q!` instructs Vim to quit immediately without saving changes."
      }
    ]
  },
  {
    "id": "linux-file-management",
    "slug": "file-management-viewing-permissions-compression",
    "pillarId": "linux",
    "branch": "right",
    "order": 4,
    "title": "File Management: Viewing, Permissions, Compression & Decompression",
    "subtitle": "cat, tail, chmod octals, ACLs, tar, gzip, and ownership isolation",
    "level": "Beginner",
    "estimatedMinutes": 25,
    "tags": [
      "Permissions",
      "chmod",
      "chown",
      "tar",
      "gzip",
      "grep",
      "tail"
    ],
    "summary": "Managing access permissions, streaming log files in real time, and archiving container artifacts or database backups using tar and compression algorithms.",
    "overview": "Linux enforces a strict permission model based on User, Group, and Others across Read (4), Write (2), and Execute (1) bits.\n\n1. Viewing & Filtering Files:\n   - `cat`: Output entire file to stdout.\n   - `less`: Pageable viewer with search (`/pattern`).\n   - `head -n 20` / `tail -n 50`: Preview header or trailing lines.\n   - `tail -f /var/log/syslog`: Follow live logs in real time.\n   - `grep -inr \"error\" /var/log/`: Recursively search case-insensitive text.\n\n2. Permissions (rwx = 4, 2, 1):\n   - `chmod 755 script.sh`: User rwx (7), Group r-x (5), Others r-x (5).\n   - `chmod 600 id_ed25519`: Restrict private SSH keys to User rw- only.\n   - Special bits: SUID (4000), SGID (2000), Sticky Bit (1000 e.g. `/tmp`).\n\n3. Archiving & Compression:\n   - `tar -czvf archive.tar.gz /folder`: Create gzipped tarball.\n   - `tar -xzvf archive.tar.gz -C /dest`: Extract archive to destination directory.",
    "keyConcepts": [
      {
        "title": "Octal Representation of Permissions",
        "explanation": "Calculated by summing bits: Read=4, Write=2, Execute=1. Total combinations range from 0 (---) to 7 (rwx)."
      },
      {
        "title": "Sticky Bit on Shared Directories",
        "explanation": "When set on a directory like `/tmp` (`chmod +t /tmp`), users can only delete or rename files they personally own, preventing tampering."
      }
    ],
    "diagram": {
      "title": "Linux File Permission Bitmask Breakdown",
      "type": "ascii",
      "code": "-  r w x   r - x   r - -\n|  \\___/   \\___/   \\___/\n|    |       |       |\n|  User    Group   Others\n| (Owner)  (devs) (public)\n|\n+--- File Type: '-' = regular file, 'd' = directory, 'l' = symlink\n\nCalculation: r(4) + w(2) + x(1) = 7\n             r(4) + -(0) + x(1) = 5\n             r(4) + -(0) + -(0) = 4  ==> chmod 754"
    },
    "commands": [
      {
        "cmd": "chmod 600 ~/.ssh/id_rsa",
        "desc": "Set private SSH key permissions to user-read-write only",
        "example": "chmod 600 id_rsa"
      },
      {
        "cmd": "chown -R www-data:www-data /var/www/html",
        "desc": "Recursively assign ownership to user and group www-data",
        "example": "chown -R user:group path"
      },
      {
        "cmd": "tar -czvf backup-$(date +%F).tar.gz /data",
        "desc": "Archive and gzip directory with timestamp in filename",
        "example": "tar -czvf backup.tar.gz /data"
      },
      {
        "cmd": "tar -xzvf backup.tar.gz -C /restore",
        "desc": "Extract gzip archive into specified directory",
        "example": "tar -xzvf backup.tar.gz -C /target"
      },
      {
        "cmd": "tail -fn 100 /var/log/auth.log",
        "desc": "Stream the last 100 lines and follow live additions",
        "example": "tail -f app.log"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "backup-and-verify.sh",
      "code": "#!/usr/bin/env bash\n# Production directory backup script with SHA256 checksum validation\nset -euo pipefail\n\nSRC_DIR=\"${1:-/etc/nginx}\"\nOUT_DIR=\"/var/backups\"\nmkdir -p \"${OUT_DIR}\"\n\nTIMESTAMP=$(date +\"%Y%m%d_%H%M%S\")\nARCHIVE_NAME=\"nginx_config_${TIMESTAMP}.tar.gz\"\nTARGET_PATH=\"${OUT_DIR}/${ARCHIVE_NAME}\"\n\necho \"Archiving ${SRC_DIR} to ${TARGET_PATH}...\"\ntar --exclude='*.sock' -czf \"${TARGET_PATH}\" -C \"$(dirname \"${SRC_DIR}\")\" \"$(basename \"${SRC_DIR}\")\"\n\n# Secure backup permissions\nchmod 600 \"${TARGET_PATH}\"\n\n# Generate checksum\nsha256sum \"${TARGET_PATH}\" > \"${TARGET_PATH}.sha256\"\necho \"Backup complete! SHA256: $(cat \"${TARGET_PATH}.sha256\")\"",
      "explanation": "Creates a compressed tarball of critical service configurations, restricts permissions to 600, and generates an integrity hash."
    },
    "gotchas": [
      {
        "issue": "SSH connection rejected due to overly permissive key files",
        "resolution": "OpenSSH enforces strict file permissions. If `~/.ssh/id_rsa` is readable by other users (e.g. 644 or 777), SSH will refuse to use it with 'Permissions are too open'. Always run `chmod 600 ~/.ssh/id_rsa`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What does chmod 777 mean and why is it dangerous in production?",
        "answer": "Chmod 777 grants read, write, and execute permissions to the file owner, group members, and every other user on the system. This allows unprivileged processes or compromised services to overwrite system binaries or inject malicious scripts.",
        "platformContext": "Violates CIS Linux Benchmarks and container security standards."
      }
    ],
    "references": [
      {
        "title": "GNU Coreutils Manual",
        "url": "https://www.gnu.org/software/coreutils/manual/",
        "source": "GNU",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the numeric octal permission for Read and Write for owner, Read-only for group, and no permissions for others?",
        "options": [
          "640",
          "750",
          "644",
          "600"
        ],
        "answerIndex": 0,
        "explanation": "Owner: Read(4)+Write(2)=6; Group: Read(4)=4; Others: None(0)=0. Result: 640."
      }
    ]
  },
  {
    "id": "linux-system-monitoring",
    "slug": "system-monitoring-top-ps-df-du",
    "pillarId": "linux",
    "branch": "right",
    "order": 5,
    "title": "System Monitoring (top, ps, df, du, etc)",
    "subtitle": "Inspect CPU utilization, load averages, memory saturation, and disk I/O",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Monitoring",
      "top",
      "htop",
      "free",
      "df",
      "du",
      "vmstat",
      "iostat"
    ],
    "summary": "Triage node performance anomalies in real time. Interpret Linux load averages, differentiate cached memory from out-of-memory leaks, and identify runaway processes.",
    "overview": "When production alerts fire for high CPU or node pressure, platform engineers must quickly distinguish CPU saturation from disk I/O bottlenecks.\n\n1. Process & CPU Inspection:\n   - `top` / `htop`: Real-time view of running tasks, CPU % per core, memory %, and load average (1m, 5m, 15m).\n   - `ps aux --sort=-%cpu | head -n 10`: Top 10 CPU-consuming processes.\n   - `uptime`: Quick system uptime and 3 load average numbers.\n\n2. Memory & Swapping:\n   - `free -h` / `free -m`: Total, used, free, shared, and `buff/cache`. In Linux, high cache is healthy because unused RAM is wasted RAM; look at `available` RAM.\n\n3. Storage & I/O Subsystems:\n   - `df -h`: Filesystem disk usage and mount points.\n   - `du -sh /var/lib/docker`: Detailed directory size calculation.\n   - `iostat -xz 1`: Disk utilization `%util` and await time.",
    "keyConcepts": [
      {
        "title": "Interpreting Load Averages",
        "explanation": "Load average is the average number of processes in the runnable state (R) plus processes in uninterruptible disk sleep (D). On an 8-core CPU, a load average of 8.0 signifies 100% saturation without queuing."
      },
      {
        "title": "Buffer/Cache vs Available Memory",
        "explanation": "Linux caches filesystem blocks in free memory. When applications request RAM, the kernel reclaims buffer/cache instantly. The `available` column indicates actual free capacity before swapping occurs."
      }
    ],
    "diagram": {
      "title": "Interpreting Linux Memory Allocation (free -h)",
      "type": "ascii",
      "code": "+-------------------------------------------------------------+\n|                        Total RAM (16GB)                     |\n+-------------------------------------------------------------+\n|  Application Used   |      Kernel Buff/Cache      |  Free   |\n|        (6GB)        |            (8GB)            |  (2GB)  |\n+---------------------+-----------------------------+---------+\n                      \\____________________________/\n                                     |\n                   Actual Available for New Apps = 10GB"
    },
    "commands": [
      {
        "cmd": "top -b -n 1 | head -n 20",
        "desc": "Capture a batch snapshot of top metrics for script inspection",
        "example": "top -b -n 1"
      },
      {
        "cmd": "free -h",
        "desc": "Display memory utilization in human-readable gigabytes and megabytes",
        "example": "free -h"
      },
      {
        "cmd": "df -hT",
        "desc": "Display mounted filesystems with their filesystem type (ext4, xfs, overlay)",
        "example": "df -hT"
      },
      {
        "cmd": "vmstat 1 5",
        "desc": "Report virtual memory, processes, traps, and CPU activity every second for 5 intervals",
        "example": "vmstat 1 5"
      },
      {
        "cmd": "iostat -x 1 3",
        "desc": "Display extended disk I/O statistics and saturation",
        "example": "iostat -x 1 3"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "node-triage.sh",
      "code": "#!/usr/bin/env bash\n# Instant node triage report for on-call platform engineers\nset -euo pipefail\n\necho \"================= [LOAD & UPTIME] =================\"\nuptime\n\necho \"\n================= [MEMORY SATURATION] ===============\"\nfree -m | awk 'NR==2{printf \"Memory Usage: %s/%sMB (%.2f%%) | Available: %sMB\\n\", $3,$2,$3*100/$2,$7}'\n\necho \"\n================= [DISK SPACE] ======================\"\ndf -h / /var | awk '{print $1 \" \" $5 \" used on \" $6}'\n\necho \"\n================= [TOP 5 CPU PROCESSES] =============\"\nps -eo pid,user,%cpu,%mem,comm --sort=-%cpu | head -n 6\n\necho \"\n================= [TOP 5 MEMORY PROCESSES] ==========\"\nps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head -n 6",
      "explanation": "Executes a rapid health triage during high-alert incidents to extract bottleneck signals in under 1 second."
    },
    "gotchas": [
      {
        "issue": "High load average with low CPU utilization",
        "resolution": "If load average is high (e.g. 24 on an 8-core machine) but `top` reports 90% idle CPU, processes are blocked in uninterruptible disk I/O sleep (state 'D'). Check `iostat` for failing NFS mounts or saturated storage disks.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between free memory and available memory in Linux?",
        "answer": "Free memory represents completely unused memory pages. Available memory includes both free memory and page cache/buffers that can immediately be reclaimed by the kernel to allocate to applications without forcing swap out.",
        "platformContext": "Crucial for configuring Kubernetes pod memory limits and container cgroup throttling."
      }
    ],
    "references": [
      {
        "title": "Brendan Gregg's Linux Performance Tools",
        "url": "https://www.brendangregg.com/linuxperf.html",
        "source": "brendangregg.com",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "If a server has 4 CPU cores, what does a load average of 4.0 indicate?",
        "options": [
          "The system is 50% idle",
          "All 4 cores are fully utilized with zero waiting processes",
          "The system is overloaded by 400%",
          "Memory swap is completely exhausted"
        ],
        "answerIndex": 1,
        "explanation": "A load average equal to the number of CPU cores indicates 100% capacity utilization with no queued tasks."
      }
    ]
  },
  {
    "id": "linux-user-group-management",
    "slug": "user-and-group-management",
    "pillarId": "linux",
    "branch": "left",
    "order": 6,
    "title": "User and Group Management",
    "subtitle": "useradd, usermod, /etc/passwd, /etc/shadow, sudoers, and least-privilege security",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "User Management",
      "sudoers",
      "Groups",
      "Security",
      "Linux PAM"
    ],
    "summary": "Implement principle of least privilege, manage service accounts for daemons, configure granular sudoers permissions, and understand user authentication databases.",
    "overview": "Platform security begins with strict identity isolation on the host. Every process runs under a specific User ID (UID) and Group ID (GID).\n\nKey Identity Files:\n- `/etc/passwd`: Publicly readable user database listing username, UID, primary GID, home directory, and default login shell.\n- `/etc/shadow`: Restricted file (root-only) holding salted and hashed passwords and account expiration metadata.\n- `/etc/group`: Lists system groups and supplemental group memberships.\n- `/etc/sudoers`: Rules governing privilege elevation with `sudo`.\n\nService Accounts vs Human Accounts:\nPlatform engineers create non-login system accounts (UID < 1000) with disabled shells (`/usr/sbin/nologin`) to run background services (Prometheus, Nginx, Docker) securely.",
    "keyConcepts": [
      {
        "title": "Principle of Least Privilege",
        "explanation": "Never run long-lived application daemons or scripts as `root`. Run services under dedicated system users with minimal filesystem access."
      },
      {
        "title": "Granular Sudoers Configuration (/etc/sudoers.d/)",
        "explanation": "Instead of editing `/etc/sudoers` directly, create modular files in `/etc/sudoers.d/` with `visudo -f` to restrict specific commands without prompting for passwords."
      }
    ],
    "diagram": {
      "title": "Linux User Authentication Flow",
      "type": "ascii",
      "code": "User / Process\n     |\n     v\n[PAM: Pluggable Authentication Modules]\n     |\n     +---> Checks /etc/passwd (User existence, UID, shell)\n     |\n     +---> Checks /etc/shadow (Password hash verification)\n     |\n     `---> Checks /etc/sudoers (Privilege elevation rights)"
    },
    "commands": [
      {
        "cmd": "useradd -r -s /bin/false -m -d /opt/prometheus prometheus",
        "desc": "Create a secure system user without login capabilities for Prometheus",
        "example": "useradd -r -s /bin/false appuser"
      },
      {
        "cmd": "usermod -aG docker deployer",
        "desc": "Append user deployer to the docker supplemental group",
        "example": "usermod -aG group user"
      },
      {
        "cmd": "id",
        "desc": "Print real and effective UID, GID, and supplemental groups",
        "example": "id -u"
      },
      {
        "cmd": "visudo",
        "desc": "Safely edit the sudoers file with syntax validation",
        "example": "visudo"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "create-service-account.sh",
      "code": "#!/usr/bin/env bash\n# Provision a hardened system user for application deployment\nset -euo pipefail\n\nUSER_NAME=\"appdeploy\"\nGROUP_NAME=\"appdeploy\"\nAPP_DIR=\"/opt/company/app\"\n\n# Create dedicated group\nif ! getent group \"${GROUP_NAME}\" >/dev/null; then\n  groupadd -r \"${GROUP_NAME}\"\nfi\n\n# Create system user with no shell login\nif ! id -u \"${USER_NAME}\" >/dev/null 2>&1; then\n  useradd -r -g \"${GROUP_NAME}\" -d \"${APP_DIR}\" -s /sbin/nologin \\\n    -c \"Application Service Account\" \"${USER_NAME}\"\n  echo \"Created system service account: ${USER_NAME}\"\nfi\n\n# Configure directory permissions\nmkdir -p \"${APP_DIR}\"\nchown -R \"${USER_NAME}:${GROUP_NAME}\" \"${APP_DIR}\"\nchmod 750 \"${APP_DIR}\"",
      "explanation": "Provisions a hardened service account with an unprivileged system UID and nologin shell for deploying microservices."
    },
    "gotchas": [
      {
        "issue": "Directly modifying /etc/sudoers with a regular editor",
        "resolution": "Never edit `/etc/sudoers` with `vim` or `nano`. A single syntax error will lock you out of `sudo` entirely. Always use `visudo`, which validates syntax before saving.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why should container processes and background daemons never run as root UID 0?",
        "answer": "If a container is compromised and the container runtime experiences a privilege escalation or container breakout vulnerability, the attacker gains root access to the host kernel.",
        "platformContext": "Directly tested in CKA, CKS, and enterprise security compliance audits."
      }
    ],
    "references": [
      {
        "title": "Debian System User Documentation",
        "url": "https://wiki.debian.org/SystemUsers",
        "source": "Debian",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which command safely validates sudoers file syntax before committing changes?",
        "options": [
          "visudo",
          "chmod sudoers",
          "sudo check",
          "passwd -e"
        ],
        "answerIndex": 0,
        "explanation": "visudo parses and checks syntax, preventing catastrophic administrative lockouts."
      }
    ]
  },
  {
    "id": "linux-package-management",
    "slug": "package-management",
    "pillarId": "linux",
    "branch": "left",
    "order": 7,
    "title": "Package Management",
    "subtitle": "apt, yum/dnf, pacman, apk, repositories, and CVE security patching",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "apt",
      "dnf",
      "yum",
      "apk",
      "Package Management",
      "CVE Patching"
    ],
    "summary": "Automate software installation, repository signing keys (GPG), dependency resolution, and automated security upgrades across Debian, RHEL, and Alpine distributions.",
    "overview": "Package managers resolve dependencies, verify cryptographic GPG signatures, and install compiled binaries and systemd unit files.\n\nMajor Ecosystems:\n1. APT (Advanced Package Tool - Ubuntu/Debian):\n   - Commands: `apt-get update`, `apt-get install -y`, `apt-get upgrade`.\n   - Repositories configured in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`.\n2. DNF / YUM (RHEL / Rocky / Fedora):\n   - Commands: `dnf install -y`, `dnf check-update`, `dnf update`.\n   - Repositories stored in `/etc/yum.repos.d/*.repo`.\n3. APK (Alpine Linux):\n   - Command: `apk add --no-cache curl`.\n   - `--no-cache` prevents caching package index tarballs inside container layers.\n4. Pacman (Arch Linux):\n   - Command: `pacman -Syu`.",
    "keyConcepts": [
      {
        "title": "GPG Signature Verification",
        "explanation": "Every repository publishes cryptographic keys. Package managers check signatures to prevent man-in-the-middle software supply chain tampering."
      },
      {
        "title": "Container Layer Optimization with apk and apt",
        "explanation": "In Dockerfiles, always combine updating and installing into a single `RUN` instruction and remove package lists (`rm -rf /var/lib/apt/lists/*`) to minimize image size."
      }
    ],
    "diagram": {
      "title": "Package Manager Architecture",
      "type": "ascii",
      "code": "[Admin / CI Runner]\n       |\n       v\n[apt / dnf / apk CLI]\n       |\n       +---> Downloads Package Index (Metadata & Hashes)\n       |\n       +---> Validates Repository GPG Public Key\n       |\n       +---> Resolves Dependency Graph (libssl, libc, etc)\n       |\n       `---> Unpacks binaries to /usr/bin, configs to /etc"
    },
    "commands": [
      {
        "cmd": "apt-get update && apt-get install -y curl htop",
        "desc": "Update Debian/Ubuntu package index and install packages non-interactively",
        "example": "apt-get install -y package"
      },
      {
        "cmd": "apt-cache policy nginx",
        "desc": "Inspect installed vs candidate version of a package in APT",
        "example": "apt-cache policy nginx"
      },
      {
        "cmd": "dnf check-update --security",
        "desc": "In RHEL/Rocky, check specifically for available security patches",
        "example": "dnf check-update --security"
      },
      {
        "cmd": "apk add --no-cache ca-certificates",
        "desc": "Install packages in Alpine container images without caching indices",
        "example": "apk add --no-cache curl"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "add-docker-repo.sh",
      "code": "#!/usr/bin/env bash\n# Modern official Docker CE repository installation on Ubuntu using trusted GPG keyring\nset -euo pipefail\n\napt-get update\napt-get install -y ca-certificates curl gnupg\n\ninstall -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\\n  gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nchmod a+r /etc/apt/keyrings/docker.gpg\n\necho \\\n  \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\\n  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable\" | \\\n  tee /etc/apt/sources.list.d/docker.list > /dev/null\n\napt-get update\necho \"Docker repository configured successfully!\"",
      "explanation": "Configures an external software repository using Debian's secure `/etc/apt/keyrings` dearmored GPG pattern."
    },
    "gotchas": [
      {
        "issue": "Caching package manager index layers in Docker images",
        "resolution": "Running `RUN apt-get update` in a separate Dockerfile layer wastes 50MB+ in image size. Always combine: `RUN apt-get update && apt-get install -y --no-install-recommends pkg && rm -rf /var/lib/apt/lists/*`.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is unattended-upgrades in Ubuntu and why is it used?",
        "answer": "It is a background service that automatically downloads and installs critical security patches without human intervention, maintaining compliance and closing CVE vulnerabilities rapidly.",
        "platformContext": "Standard across cloud-init base machine images."
      }
    ],
    "references": [
      {
        "title": "Ubuntu Server Package Management",
        "url": "https://ubuntu.com/server/docs/package-management",
        "source": "Ubuntu",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which flag in Alpine Linux prevents saving the package index cache to disk?",
        "options": [
          "--no-cache",
          "--clean",
          "-y",
          "--purge"
        ],
        "answerIndex": 0,
        "explanation": "apk add --no-cache bypasses writing index caches to disk, keeping container layers slim."
      }
    ]
  },
  {
    "id": "linux-networking-basics",
    "slug": "networking-basics-ifconfig-ip-ping-telnet",
    "pillarId": "linux",
    "branch": "left",
    "order": 8,
    "title": "Networking Basics (ifconfig, ip, ping, telnet, etc)",
    "subtitle": "Network interfaces, routing tables, socket diagnostics with iproute2, ss, and curl",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "iproute2",
      "ss",
      "ping",
      "telnet",
      "curl",
      "Networking Basics",
      "Linux Networking"
    ],
    "summary": "Inspect IP allocations, check routing tables, triage open listening sockets, trace network latency, and troubleshoot connectivity across Kubernetes pod network interfaces.",
    "overview": "The modern Linux networking toolkit is `iproute2` (`ip` command), which replaced deprecated tools like `ifconfig` and `netstat`.\n\nEssential Tools:\n1. `ip addr` (or `ip a`): Lists all network interfaces (e.g. `eth0`, `lo`, `docker0`, `cni0`), MAC addresses, and assigned IPv4/IPv6 addresses.\n2. `ip route`: Inspects the kernel routing table and default gateway.\n3. `ss -tulpn`: Displays all listening TCP and UDP sockets with owning process IDs (replacing `netstat`).\n4. `ping -c 4 <host>`: Checks ICMP reachability and round-trip latency.\n5. `nc -zv <host> <port>` or `telnet <host> <port>`: Tests TCP socket connectivity on specific ports.\n6. `curl -Iv https://service`: Inspects HTTP status, TLS handshake, and headers.",
    "keyConcepts": [
      {
        "title": "iproute2 vs net-tools",
        "explanation": "Tools like `ifconfig` and `netstat` are deprecated. Modern platform engineers use `ip` and `ss`, which query netlink sockets directly in the kernel for significantly higher performance."
      },
      {
        "title": "Loopback Interface (lo 127.0.0.1)",
        "explanation": "Internal network interface that bypasses physical NIC hardware. Containers in the same Kubernetes pod share the loopback interface and communicate over `localhost`."
      }
    ],
    "diagram": {
      "title": "Host Network Interfaces & Packet Flow",
      "type": "ascii",
      "code": "Physical Network / Internet\n             |\n             v\n         [eth0 NIC] (e.g. 10.0.1.5)\n             |\n     +-------+-------+\n     |               |\n     v               v\n[cni0 / docker0]   [lo: 127.0.0.1]\n (Container Bridge)  (Pod Localhost)\n     |               |\n     v               v\n  Containers     Local daemons"
    },
    "commands": [
      {
        "cmd": "ip -br a",
        "desc": "Brief view of all network interfaces and assigned IPs",
        "example": "ip -br a"
      },
      {
        "cmd": "ip route show",
        "desc": "Display default gateway and kernel routing table",
        "example": "ip route show"
      },
      {
        "cmd": "ss -tulpn",
        "desc": "Display all listening TCP and UDP ports with PID and process names",
        "example": "ss -tulpn | grep 80"
      },
      {
        "cmd": "nc -zv database.internal 5432",
        "desc": "Test TCP socket reachability to PostgreSQL database",
        "example": "nc -zv host 5432"
      },
      {
        "cmd": "traceroute -n 8.8.8.8",
        "desc": "Trace network hops and routing paths to target IP",
        "example": "traceroute -n 1.1.1.1"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "network-preflight.sh",
      "code": "#!/usr/bin/env bash\n# Production preflight check verifying gateway reachability, DNS, and service ports\nset -euo pipefail\n\nTARGET_HOST=\"api.github.com\"\nTARGET_PORT=\"443\"\n\necho \"=== [Default Gateway] ===\"\nDEFAULT_GW=$(ip route | awk '/default/ {print $3}')\necho \"Gateway IP: ${DEFAULT_GW}\"\nping -c 2 \"${DEFAULT_GW}\" >/dev/null && echo \"Gateway reachable!\" || echo \"Gateway UNREACHABLE!\"\n\necho \"\n=== [DNS Resolution] ===\"\nRESOLVED_IP=$(getent hosts \"${TARGET_HOST}\" | awk '{print $1}' | head -n 1)\necho \"Resolved ${TARGET_HOST} to ${RESOLVED_IP}\"\n\necho \"\n=== [TCP Port Connectivity] ===\"\nif nc -z -w 3 \"${TARGET_HOST}\" \"${TARGET_PORT}\" 2>/dev/null; then\n  echo \"Connection to ${TARGET_HOST}:${TARGET_PORT} succeeded!\"\nelse\n  echo \"Connection to ${TARGET_HOST}:${TARGET_PORT} FAILED!\"\nfi",
      "explanation": "Validates the three foundational layers of connectivity: gateway ICMP, DNS resolution, and TCP handshake."
    },
    "gotchas": [
      {
        "issue": "Assuming ping failure means a web service is down",
        "resolution": "Many corporate cloud VPCs and firewalls drop ICMP packets by design. Always test actual application ports using `curl -Iv` or `nc -zv` rather than relying solely on `ping`.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you identify which process is listening on port 8080 in Linux?",
        "answer": "Run `sudo ss -tulpn | grep ':8080'` or `sudo lsof -i :8080`. This prints the process name and PID owning the listening socket.",
        "platformContext": "Standard daily troubleshooting when services fail with 'Address already in use'."
      }
    ],
    "references": [
      {
        "title": "Linux iproute2 Documentation",
        "url": "https://wiki.linuxfoundation.org/networking/iproute2",
        "source": "Linux Foundation",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which modern command replaces netstat for inspecting listening sockets and TCP connections?",
        "options": [
          "ss",
          "ifconfig",
          "traceroute",
          "route"
        ],
        "answerIndex": 0,
        "explanation": "ss (socket statistics) is the high-performance modern replacement for netstat in the iproute2 suite."
      }
    ]
  },
  {
    "id": "linux-process-management",
    "slug": "process-management-kill-pkill-jobs-bg-fg",
    "pillarId": "linux",
    "branch": "left",
    "order": 9,
    "title": "Process Management (kill, pkill, jobs, bg, fg)",
    "subtitle": "Process lifecycle, POSIX signals (SIGTERM, SIGKILL), nice values, and job control",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Processes",
      "Signals",
      "kill",
      "pkill",
      "SIGTERM",
      "SIGKILL",
      "systemd"
    ],
    "summary": "Control running Linux processes, understand PID namespaces, send graceful termination signals, manage background jobs, and adjust CPU priority scheduling.",
    "overview": "Every running application in Linux is represented as a Process with a unique Process ID (PID). The first user-space process spawned by the kernel is PID 1 (usually `systemd` on hosts, or an entrypoint binary inside a container).\n\nKey Concepts:\n1. POSIX Signals:\n   - `SIGTERM` (Signal 15): Default graceful termination signal. Allows the application to finish pending requests, flush database connections, and exit cleanly.\n   - `SIGKILL` (Signal 9): Uncatchable immediate kill enforced by the kernel. Can leave state corrupted; use only as a last resort.\n   - `SIGHUP` (Signal 1): Hangup signal. Conventionally used to tell daemons (like Nginx) to reload configuration without dropping connections.\n2. Commands:\n   - `kill -15 <PID>`: Send SIGTERM to a specific PID.\n   - `pkill -f \"pattern\"`: Terminate processes matching a regex pattern.\n   - `killall -9 <name>`: Kill all processes by binary name.\n3. Job Control in Shell:\n   - Append `&` to run a command in the background (`./app &`).\n   - `jobs`: List background jobs.\n   - `fg %1`: Bring job 1 to foreground; `bg %1`: Resume stopped job in background.",
    "keyConcepts": [
      {
        "title": "Graceful Shutdown (SIGTERM vs SIGKILL)",
        "explanation": "Kubernetes sends SIGTERM when stopping a pod, waits for `terminationGracePeriodSeconds` (default 30s), and sends SIGKILL if the process has not exited. Container apps must handle SIGTERM to achieve zero-downtime deployments."
      },
      {
        "title": "PID 1 Responsibilities (Zombies and Signal Forwarding)",
        "explanation": "PID 1 is responsible for reaping orphaned child processes (zombie processes) and routing signals. If a custom script is PID 1 in a container without an init system (like `tini`), zombies can accumulate."
      }
    ],
    "diagram": {
      "title": "Kubernetes Pod Lifecycle & POSIX Signal Flow",
      "type": "ascii",
      "code": "Kubelet initiates pod shutdown\n             |\n             v\n     Sends SIGTERM (Signal 15)\n             |\n     +-------+-------+\n     |               |\n[App handles]    [App hangs]\n     |               |\nFlushes buffers      | (Wait 30s grace period)\nCloses DB pool       |\nExits code 0         v\n             Sends SIGKILL (Signal 9)\n             (Kernel terminates immediately)"
    },
    "commands": [
      {
        "cmd": "kill -SIGTERM 1234",
        "desc": "Send graceful termination signal to process with PID 1234",
        "example": "kill -15 1234"
      },
      {
        "cmd": "kill -9 1234",
        "desc": "Forcefully terminate process with uncatchable SIGKILL",
        "example": "kill -9 1234"
      },
      {
        "cmd": "pkill -HUP -f nginx",
        "desc": "Send SIGHUP to reload Nginx configuration smoothly",
        "example": "pkill -HUP nginx"
      },
      {
        "cmd": "ps -ef | grep python",
        "desc": "List all running processes matching python",
        "example": "ps -ef | grep app"
      },
      {
        "cmd": "nohup ./long-task.sh > output.log 2>&1 &",
        "desc": "Run script detached from terminal session ignoring hangups",
        "example": "nohup ./task.sh &"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "graceful-worker.sh",
      "code": "#!/usr/bin/env bash\n# Production shell script demonstrating POSIX signal trapping for zero-data-loss shutdown\nset -euo pipefail\n\nRUNNING=true\n\ncleanup() {\n  echo \"Received SIGTERM! Starting graceful cleanup...\"\n  RUNNING=false\n  # Finish in-flight batch, flush logs\n  sleep 2\n  echo \"Cleanup complete. Exiting cleanly.\"\n  exit 0\n}\n\n# Register trap for SIGTERM and SIGINT\ntrap cleanup SIGTERM SIGINT\n\necho \"Worker process started with PID $$ (Listening for SIGTERM)...\"\nwhile $RUNNING; do\n  echo \"Processing job at $(date)...\"\n  sleep 3 &\n  wait $! # Waiting on background sleep allows instant signal delivery\ndone",
      "explanation": "Traps SIGTERM signals using bash `trap`, enabling graceful drain of worker jobs before exit."
    },
    "gotchas": [
      {
        "issue": "Relying on kill -9 as default habit",
        "resolution": "Using `kill -9` prevents applications from committing SQLite transactions, releasing file locks, or cleaning up sockets. Always send `kill -15` (SIGTERM) first and wait before sending `kill -9`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is a zombie process in Linux and how is it cleaned up?",
        "answer": "A zombie process is a process that has completed execution but still has an entry in the process table because its parent has not yet read its exit status with the `wait()` system call. Zombies do not consume CPU or RAM, only a PID slot. They are cleared when the parent reads their status or when the parent dies and PID 1 reaps them.",
        "platformContext": "A classic container issue when running multi-process containers without an init wrapper like tini."
      }
    ],
    "references": [
      {
        "title": "Linux Signals Man Page",
        "url": "https://man7.org/linux/man-pages/man7/signal.7.html",
        "source": "man7.org",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which signal allows an application to gracefully close connections before exiting?",
        "options": [
          "SIGTERM (15)",
          "SIGKILL (9)",
          "SIGSTOP (19)",
          "SIGSEGV (11)"
        ],
        "answerIndex": 0,
        "explanation": "SIGTERM (signal 15) is the catchable termination request that enables graceful shutdowns."
      }
    ]
  },
  {
    "id": "linux-system-logs",
    "slug": "system-logs-var-log-journalctl-logrotate",
    "pillarId": "linux",
    "branch": "left",
    "order": 10,
    "title": "System Logs (/var/log, journalctl, syslog)",
    "subtitle": "systemd journal, syslog forwarding, logrotate retention, and debugging failures",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Logs",
      "journalctl",
      "systemd",
      "logrotate",
      "syslog",
      "Observability"
    ],
    "summary": "Master systemd journal queries with journalctl, inspect `/var/log` text files, configure log rotation policies to prevent disk exhaustion, and understand structured log forwarders.",
    "overview": "Every service failure, kernel panic, authentication attempt, and deployment event is recorded in Linux logs.\n\nKey Logging Components:\n1. systemd-journald: High-performance binary logging service indexing all service stdout/stderr and kernel logs.\n   - `journalctl -u nginx`: View logs for a specific systemd unit.\n   - `journalctl -f`: Follow all system logs in real time.\n   - `journalctl -p err -b`: Show only errors since the current boot.\n   - `journalctl --since \"1 hour ago\"`: Time-window filtering.\n2. Traditional Text Logs in `/var/log`:\n   - `/var/log/auth.log` (or `secure` on RHEL): SSH logins, sudo executions, and failed authentication attempts.\n   - `/var/log/syslog` (or `messages` on RHEL): General system activity.\n   - `/var/log/dmesg`: Kernel ring buffer messages.\n3. Logrotate:\n   - Daemon configured in `/etc/logrotate.d/` that rotates, compresses, and purges logs based on file size or age.",
    "keyConcepts": [
      {
        "title": "Binary Indexing in journalctl",
        "explanation": "Unlike raw text files, `journald` stores structured key-value pairs (like `_PID`, `_UID`, `_SYSTEMD_UNIT`), enabling sub-second filtering across gigabytes of log data."
      },
      {
        "title": "Logrotate Policies",
        "explanation": "Prevents uncontrolled disk growth by rotating files (e.g. daily, keep 7 days, compress with gzip, reopen file handles via postrotate scripts)."
      }
    ],
    "diagram": {
      "title": "Linux Logging Pipeline",
      "type": "ascii",
      "code": "[Kernel Drivers]   [systemd units]   [User Apps]\n       |                  |                |\n       +------------------+----------------+\n                          |\n                          v\n                 [systemd-journald]\n                          |\n        +-----------------+-----------------+\n        |                                   |\n        v                                   v\n[journalctl queries]               [/var/log text files]\n                                            |\n                                            v\n                                    [logrotate daemon]\n                                  (compress & purge)"
    },
    "commands": [
      {
        "cmd": "journalctl -u docker.service -n 50 --no-pager",
        "desc": "Display last 50 log lines for docker service",
        "example": "journalctl -u service"
      },
      {
        "cmd": "journalctl -f -u kubelet",
        "desc": "Stream live logs for the kubelet daemon",
        "example": "journalctl -f -u kubelet"
      },
      {
        "cmd": "journalctl -p 3 -b",
        "desc": "Display errors (priority 3) and above since current boot",
        "example": "journalctl -p err -b"
      },
      {
        "cmd": "logrotate -d /etc/logrotate.d/nginx",
        "desc": "Debug test logrotate configuration without modifying files",
        "example": "logrotate -d config_file"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "nginx-logrotate.conf",
      "code": "# /etc/logrotate.d/nginx\n# Production log rotation policy ensuring zero disk fill and daily compression\n/var/log/nginx/*.log {\n    daily\n    missingok\n    rotate 14\n    compress\n    delaycompress\n    notifempty\n    create 0640 www-data adm\n    sharedscripts\n    postrotate\n        if [ -f /var/run/nginx.pid ]; then\n            kill -USR1 $(cat /var/run/nginx.pid)\n        fi\n    endscript\n}",
      "explanation": "A production logrotate configuration rotating Nginx logs daily, retaining 14 compressed archives, and sending USR1 signal to reopen file handles."
    },
    "gotchas": [
      {
        "issue": "Deleting a large log file with rm does not free disk space",
        "resolution": "If a running process has the deleted file open, Linux retains the disk blocks until the process closes the file handle. Clear the file without deleting it by truncating: `> /var/log/app.log`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What happens when you delete an open log file in Linux and how do you recover space?",
        "answer": "The file's directory link is removed, but its inode remains allocated because the open file descriptor maintains a reference count > 0. `df` will still show the space as consumed. Identify the process with `lsof | grep deleted` and either restart the process or truncate the file via `/proc/<PID>/fd/<FD>`.",
        "platformContext": "Frequent production incident when administrators try to free space in a hurry."
      }
    ],
    "references": [
      {
        "title": "systemd journalctl Documentation",
        "url": "https://www.freedesktop.org/software/systemd/man/journalctl.html",
        "source": "freedesktop.org",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "How do you clear a growing log file instantly without breaking the active file handle of the writing service?",
        "options": [
          "> /var/log/file.log (truncate)",
          "rm -f /var/log/file.log",
          "chmod 000 /var/log/file.log",
          "kill -9 1"
        ],
        "answerIndex": 0,
        "explanation": "Truncating the file (`> filename` or `truncate -s 0 filename`) empties its contents immediately while keeping the inode and open file descriptors intact."
      }
    ]
  },
  {
    "id": "linux-filesystems-storage",
    "slug": "file-systems-storage-fdisk-lsblk-nfs-smb",
    "pillarId": "linux",
    "branch": "left",
    "order": 11,
    "title": "File Systems & Storage (fdisk, lsblk, NFS, SMB)",
    "subtitle": "Block devices, ext4 vs xfs, LVM, /etc/fstab, NFS exports, and network mounts",
    "level": "Advanced",
    "estimatedMinutes": 25,
    "tags": [
      "Storage",
      "lsblk",
      "fdisk",
      "NFS",
      "SMB",
      "LVM",
      "ext4",
      "xfs"
    ],
    "summary": "Partition NVMe and virtual block devices, format filesystems (ext4/XFS), configure persistent automounts in `/etc/fstab`, and integrate network storage via NFS and Samba/SMB.",
    "overview": "Storage in Linux spans raw block devices (`/dev/sda`, `/dev/nvme0n1`), volume management (LVM), formatted filesystems (ext4, XFS, Btrfs), and network-attached storage (NFS, SMB).\n\nKey Concepts:\n1. Block Device Inspection:\n   - `lsblk -f`: Tree view of block devices, partitions, filesystem types, and UUIDs.\n   - `fdisk -l` / `parted`: Inspect partition tables (GPT vs MBR).\n2. Formatting & Mounting:\n   - `mkfs.ext4 /dev/sdb1` or `mkfs.xfs /dev/sdb1`: Format raw partition.\n   - `mount /dev/sdb1 /mnt/data`: Temporarily attach filesystem.\n   - `/etc/fstab`: Static configuration table defining automounts on boot using persistent UUIDs.\n3. Network File Systems (NFS & SMB):\n   - NFS: Native Unix protocol for sharing directories over TCP (`mount -t nfs server:/export /mnt/nfs`). Widely used for Kubernetes ReadWriteMany (RWX) volumes.\n   - SMB/CIFS: Cross-platform protocol commonly used with Windows File Shares and Azure Files.",
    "keyConcepts": [
      {
        "title": "Always Mount by UUID in /etc/fstab",
        "explanation": "Never mount block devices by device paths like `/dev/sdb` in `/etc/fstab`. Device letters can swap during reboots or disk replacements. Use `UUID=xxxx` to guarantee persistent identity."
      },
      {
        "title": "XFS vs ext4 in Enterprise Linux",
        "explanation": "ext4 is the mature default for Debian/Ubuntu, while XFS is the high-performance default for RHEL. XFS excels at parallel I/O and large files, though shrinking an XFS filesystem is unsupported."
      }
    ],
    "diagram": {
      "title": "Linux Storage Layer Stack",
      "type": "ascii",
      "code": "Application / Database\n         |\n         v\n[Virtual Filesystem (VFS)]\n         |\n    +----+----+\n    |         |\n [ext4/XFS]  [NFS / CIFS Network Mount]\n    |                 |\n [LVM / Volumes]      v\n    |          Remote Storage Server\n    v\n[Physical Block Device: /dev/nvme0n1, /dev/sda]"
    },
    "commands": [
      {
        "cmd": "lsblk -f",
        "desc": "List block devices, partition layout, mount points, and UUIDs",
        "example": "lsblk -f"
      },
      {
        "cmd": "blkid /dev/nvme0n1p1",
        "desc": "Print block device attributes and filesystem UUID",
        "example": "blkid /dev/sda1"
      },
      {
        "cmd": "mount -t nfs 10.0.0.50:/exports/data /mnt/shared",
        "desc": "Mount remote NFS export to local mount point",
        "example": "mount -t nfs server:/share /mnt"
      },
      {
        "cmd": "mount -a",
        "desc": "Test-mount all entries configured in /etc/fstab without rebooting",
        "example": "mount -a"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "fstab-setup.sh",
      "code": "#!/usr/bin/env bash\n# Format a new EBS/data volume as ext4 and configure permanent fstab mount by UUID\nset -euo pipefail\n\nDEVICE=\"${1:-/dev/nvme1n1}\"\nMOUNT_POINT=\"/mnt/production-data\"\n\n# 1. Format if not already formatted\nif ! blkid \"${DEVICE}\" >/dev/null; then\n  echo \"Formatting ${DEVICE} with ext4...\"\n  mkfs.ext4 -m 1 \"${DEVICE}\"\nfi\n\n# 2. Extract UUID\nUUID=$(blkid -s UUID -o value \"${DEVICE}\")\necho \"Device UUID: ${UUID}\"\n\n# 3. Create mount point\nmkdir -p \"${MOUNT_POINT}\"\n\n# 4. Add to /etc/fstab idempotently with nofail to prevent boot lockouts\nFSTAB_LINE=\"UUID=${UUID} ${MOUNT_POINT} ext4 defaults,noatime,nofail 0 2\"\nif ! grep -qs \"${UUID}\" /etc/fstab; then\n  echo \"${FSTAB_LINE}\" >> /etc/fstab\n  echo \"Appended entry to /etc/fstab\"\nfi\n\n# 5. Mount and verify\nmount -a\ndf -h \"${MOUNT_POINT}\"",
      "explanation": "Safely provisions a block device, formats it with ext4, and adds a durable `nofail` entry to `/etc/fstab` using its UUID."
    },
    "gotchas": [
      {
        "issue": "Syntax error or missing disk in /etc/fstab causes server boot loop into Emergency Mode",
        "resolution": "Always add the `nofail` mount option in `/etc/fstab` for secondary data disks. If the cloud disk fails to attach, the OS will continue booting instead of freezing in emergency recovery mode.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the purpose of the 'nofail' option in /etc/fstab?",
        "answer": "It informs the Linux init system (systemd) not to halt the system boot sequence into emergency mode if the target storage device is missing, unformatted, or fails to mount.",
        "platformContext": "Crucial for cloud virtual machines attaching dynamic EBS or Azure Managed Disks."
      }
    ],
    "references": [
      {
        "title": "ArchWiki File Systems & fstab Guide",
        "url": "https://wiki.archlinux.org/title/fstab",
        "source": "ArchWiki",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which command mounts all filesystems specified in /etc/fstab that are not already mounted?",
        "options": [
          "mount -a",
          "mount --all-force",
          "fstab mount",
          "df -m"
        ],
        "answerIndex": 0,
        "explanation": "mount -a reads /etc/fstab and mounts all defined filesystems, serving as a critical safety test before rebooting."
      }
    ]
  },
  {
    "id": "linux-bash-scripting",
    "slug": "bash-scripting",
    "pillarId": "linux",
    "branch": "left",
    "order": 12,
    "title": "Bash Scripting",
    "subtitle": "Robust automation, set -euo pipefail, parameter expansion, loops, and error traps",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Bash",
      "Shell Scripting",
      "Automation",
      "CI/CD Scripts",
      "pipefail"
    ],
    "summary": "Write production-ready, defensive shell scripts that fail fast, validate inputs, parse CLI arguments, and handle cleanup signals gracefully.",
    "overview": "Platform engineering relies on shell scripts for container entrypoints, CI/CD pipeline steps, cloud-init provisioning, and system maintenance.\n\nDefensive Bash (The Holy Trinity):\n`set -euo pipefail`\n- `-e`: Exit immediately if any command returns a non-zero exit status.\n- `-u`: Treat unset variables as an error and exit immediately, preventing catastrophic bugs like `rm -rf /${UNSET_VAR}`.\n- `-o pipefail`: Return the exit status of the first command in a pipeline that fails (e.g. `bad_cmd | tee log` will return failure instead of `tee`'s success 0).\n\nCore Constructs:\n- Parameter expansion: `${VAR:-default}`, `${VAR:?error if unset}`.\n- Conditionals: `[[ -f file ]]`, `[[ -z \"${STR}\" ]]`, `[[ \"${ENV}\" == \"prod\" ]]`.\n- Loops: `for file in *.log; do ...; done`.\n- Functions with local variables: `local my_var=\"value\"`.",
    "keyConcepts": [
      {
        "title": "Defensive Mode: set -euo pipefail",
        "explanation": "Standard practice for all production shell scripts. Catches typos, pipeline failures, and unexpected command errors before they cause data loss."
      },
      {
        "title": "Double Brackets [[ vs Single Brackets [",
        "explanation": "Use `[[ ... ]]` in Bash. It supports regular expression matching (`=~`), prevents word splitting, and handles empty variable expansions safely."
      }
    ],
    "diagram": {
      "title": "Pipeline Exit Status: pipefail vs default",
      "type": "ascii",
      "code": "Command Pipeline:  grep \"missing\" /nonexistent | tee output.txt\n\nDefault Behavior: [Exits 2 (Failed)] ---> [tee exits 0 (Success)]\n                  Overall Exit Status = 0 (Silent Failure!)\n\nWith set -o pipefail:\n                  [Exits 2 (Failed)] ---> [tee exits 0 (Success)]\n                  Overall Exit Status = 2 (Correctly Fails Pipeline!)"
    },
    "commands": [
      {
        "cmd": "bash -n script.sh",
        "desc": "Check script for syntax errors without executing commands",
        "example": "bash -n script.sh"
      },
      {
        "cmd": "shellcheck script.sh",
        "desc": "Run static analysis linter to identify bugs and security vulnerabilities",
        "example": "shellcheck script.sh"
      },
      {
        "cmd": "bash -x script.sh",
        "desc": "Execute script in debug mode printing every expanded command trace",
        "example": "bash -x script.sh"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "production-template.sh",
      "code": "#!/usr/bin/env bash\n# Production-grade Bash script template incorporating best practices\nset -euo pipefail\n\nreadonly SCRIPT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")\" && pwd)\"\nreadonly LOG_FILE=\"/tmp/task-$(date +%s).log\"\n\nlog() {\n  local level=\"$1\"\n  shift\n  echo \"[$(date +'%Y-%m-%dT%H:%M:%S%z')] [${level}] $*\" | tee -a \"${LOG_FILE}\"\n}\n\ncleanup() {\n  local exit_code=$?\n  if [ ${exit_code} -ne 0 ]; then\n    log \"ERROR\" \"Script failed with exit status ${exit_code}!\"\n  fi\n}\ntrap cleanup EXIT\n\n# Validate input arguments\nTARGET_ENVIRONMENT=\"${1:-staging}\"\nlog \"INFO\" \"Executing task for environment: ${TARGET_ENVIRONMENT}\"\n\nif [[ ! \"${TARGET_ENVIRONMENT}\" =~ ^(staging|production)$ ]]; then\n  log \"ERROR\" \"Invalid environment. Must be 'staging' or 'production'.\"\n  exit 1\nfi\n\nlog \"INFO\" \"Task completed successfully!\"",
      "explanation": "A battle-tested production bash template featuring `set -euo pipefail`, structured logging, argument regex validation, and an EXIT trap."
    },
    "gotchas": [
      {
        "issue": "Unquoted variables in rm -rf ${DIR}/*",
        "resolution": "If `${DIR}` is unset or contains spaces, unquoted expansion can evaluate to `rm -rf /*`, destroying the filesystem. Always quote variables `\"${DIR}\"` and use `set -u`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the effect of set -o pipefail in Bash?",
        "answer": "By default, a pipeline's return value is the exit status of the last command executed. If an earlier command fails but the final command succeeds, the entire pipeline reports success. `set -o pipefail` causes the pipeline to return the exit code of the last command that failed.",
        "platformContext": "Critical in CI/CD pipelines where test failures piped to formatting tools must fail the build."
      }
    ],
    "references": [
      {
        "title": "Google Shell Style Guide",
        "url": "https://google.github.io/styleguide/shellguide.html",
        "source": "Google",
        "type": "official"
      },
      {
        "title": "ShellCheck Linter",
        "url": "https://www.shellcheck.net/",
        "source": "shellcheck.net",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which bash flag ensures that using an uninitialized or undeclared variable throws an immediate error?",
        "options": [
          "-u",
          "-e",
          "-x",
          "-o pipefail"
        ],
        "answerIndex": 0,
        "explanation": "The -u (nounset) flag forces bash to exit immediately when an unset variable is referenced."
      }
    ]
  }
];
