import { TopicItem } from '@/types';

export const IAC_TOPICS: TopicItem[] = [
  {
    "id": "iac-landscape",
    "slug": "iac-landscape-terraform-pulumi-arm-cloudformation",
    "pillarId": "iac",
    "branch": "right",
    "order": 1,
    "title": "IaC Landscape: Agnostic vs Cloud-Specific",
    "subtitle": "Cloud-Agnostic (Terraform, OpenTofu, Pulumi) vs Cloud-Specific (CloudFormation, Bicep/ARM)",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Terraform",
      "Pulumi",
      "CloudFormation",
      "Bicep",
      "OpenTofu",
      "IaC"
    ],
    "summary": "Navigate the modern Infrastructure as Code tool ecosystem: evaluate multi-cloud agnostic frameworks (Terraform, Pulumi) against vendor-native DSLs (AWS CloudFormation, Azure Bicep).",
    "overview": "Infrastructure as Code frameworks allow provisioning cloud environments through version-controlled code rather than manual console clicking.\n\nTwo Primary Philosophies:\n1. Cloud-Agnostic Tools:\n   - Terraform / OpenTofu: The global industry standard using HashiCorp Configuration Language (HCL). Powered by a massive ecosystem of 3,000+ providers (AWS, Azure, GCP, Cloudflare, Datadog, GitHub).\n   - Pulumi: Uses standard programming languages (TypeScript, Python, Go, C#) instead of domain-specific languages (DSLs). Enables real loops, object-oriented abstractions, and unit testing.\n2. Cloud-Specific / Native Tools:\n   - AWS CloudFormation / AWS CDK: Deep native integration with AWS services; supports day-zero AWS features, but strictly locked into AWS.\n   - Azure Bicep / ARM Templates: Clean domain-specific language compiling down to Azure Resource Manager templates.\n   - Google Cloud Config Connector / Deployment Manager.",
    "keyConcepts": [
      {
        "title": "Vendor Lock-in vs Provider Ecosystems",
        "explanation": "Terraform configuration is not write-once-run-anywhere (an AWS EC2 HCL block does not deploy to Azure), but engineers use the SAME workflow, state management, and syntax across all clouds."
      },
      {
        "title": "Pulumi Real-Language Programming",
        "explanation": "Allows platform teams to create reusable infrastructure classes, inherit properties, and write unit tests using familiar tools like Jest or PyTest."
      }
    ],
    "diagram": {
      "title": "Infrastructure as Code Tool Spectrum",
      "type": "ascii",
      "code": "                            [IaC Ecosystem]\n                                   |\n        +--------------------------+--------------------------+\n        |                                                     |\n        v                                                     v\n[Cloud-Agnostic Multi-Cloud]                        [Cloud-Specific Native]\n- Terraform / OpenTofu (HCL)                        - AWS CloudFormation / CDK\n- Pulumi (TypeScript, Python, Go)                   - Azure Bicep / ARM\n- Crossplane (Kubernetes Control Plane)             - Google Deployment Manager"
    },
    "commands": [
      {
        "cmd": "tofu version || terraform version",
        "desc": "Check installed Terraform or OpenTofu CLI version",
        "example": "tofu version"
      },
      {
        "cmd": "pulumi preview",
        "desc": "Preview proposed cloud infrastructure modifications with Pulumi CLI",
        "example": "pulumi preview"
      }
    ],
    "productionCode": {
      "language": "typescript",
      "filename": "pulumi-infrastructure.ts",
      "code": "// Production Pulumi TypeScript example creating an AWS S3 Bucket with automated tags\nimport * as aws from \"@pulumi/aws\";\n\nconst environment = \"production\";\n\n// Create an AWS resource (S3 Bucket)\nexport const bucket = new aws.s3.BucketV2(\"platform-artifacts\", {\n    bucket: `company-platform-artifacts-${environment}`,\n    tags: {\n        Environment: environment,\n        ManagedBy: \"Pulumi\",\n    },\n});\n\n// Enforce private access\nexport const bucketAcl = new aws.s3.BucketAclV2(\"platform-artifacts-acl\", {\n    bucket: bucket.id,\n    acl: \"private\",\n});\n\n// Export bucket name and regional domain\nexport const bucketName = bucket.id;\nexport const bucketDomain = bucket.bucketRegionalDomainName;",
      "explanation": "Provisions encrypted, tagged S3 buckets using Pulumi with TypeScript type safety."
    },
    "gotchas": [
      {
        "issue": "Assuming cloud-agnostic means single config runs across both AWS and Azure",
        "resolution": "Terraform provides a unified workflow, but the resource models (`aws_instance` vs `azurerm_virtual_machine`) reflect each cloud's distinct APIs. You must write provider-specific configurations.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the key trade-off between using Terraform (HCL) and Pulumi (TypeScript/Python)?",
        "answer": "Terraform uses declarative HCL, which makes infrastructure state predictable and easier to parse for security scanners (tfsec/checkov), but lacks advanced programming logic. Pulumi uses general-purpose languages allowing loops, abstractions, and standard testing, but introduces the complexity of managing software dependencies and potential runtime exceptions in infrastructure code.",
        "platformContext": "Common architectural evaluation question for lead platform engineers."
      }
    ],
    "references": [
      {
        "title": "HashiCorp Terraform Documentation",
        "url": "https://developer.hashicorp.com/terraform/docs",
        "source": "HashiCorp",
        "type": "official"
      },
      {
        "title": "Pulumi Documentation",
        "url": "https://www.pulumi.com/docs/",
        "source": "Pulumi",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which open-source fork was established by the Linux Foundation following HashiCorp's license change for Terraform?",
        "options": [
          "OpenTofu",
          "OpenIaC",
          "CloudTofu",
          "KubeForm"
        ],
        "answerIndex": 0,
        "explanation": "OpenTofu is the community-driven open-source fork backed by the Linux Foundation."
      }
    ]
  },
  {
    "id": "iac-terraform",
    "slug": "terraform-state-workspaces-modules-variables",
    "pillarId": "iac",
    "branch": "right",
    "order": 2,
    "title": "Terraform Deep Dive: State, Modules & Workspaces",
    "subtitle": "State file management, remote backends (S3 + DynamoDB locking), reusable modules, and lifecycle rules",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "Terraform",
      "State",
      "Modules",
      "Workspaces",
      "S3 Backend",
      "DynamoDB Locking"
    ],
    "summary": "Master Terraform's engine: remote state locking, state migration, reusable child modules, input variables, outputs, and disaster recovery.",
    "overview": "Terraform is the gold standard of declarative infrastructure automation.\n\nCore Architecture:\n1. State Management (`terraform.tfstate`):\n   - Terraform records a JSON map of real-world infrastructure resources matching your configuration.\n   - Remote Backend: In production teams, state MUST be stored remotely (e.g. AWS S3) with state locking (AWS DynamoDB) to prevent concurrent writes from corrupting state.\n2. The Core Execution Cycle:\n   - `terraform init`: Downloads required provider plugins and initializes remote backend.\n   - `terraform plan`: Generates execution graph comparing desired code vs actual state, proposing creates, updates, and destroys.\n   - `terraform apply`: Executes API calls against cloud providers and commits state updates.\n3. Reusable Modules:\n   - Packages of HCL resources with input `variables.tf`, resource definitions, and `outputs.tf`.\n4. Workspaces:\n   - Isolated state files within the same backend configuration (useful for ephemeral feature environments).",
    "keyConcepts": [
      {
        "title": "Distributed State Locking",
        "explanation": "When engineer A runs `terraform apply`, DynamoDB places a cryptographic lock on the state file. If engineer B or a CI pipeline runs concurrently, execution is blocked until the lock releases, preventing state corruption."
      },
      {
        "title": "Never Edit State Files Manually",
        "explanation": "Directly modifying `terraform.tfstate` risks irreparable corruption. Always manipulate state using safe CLI commands: `terraform state mv`, `terraform state rm`, or `terraform import`."
      }
    ],
    "diagram": {
      "title": "Terraform Remote State & Distributed Locking Flow",
      "type": "ascii",
      "code": "[Platform Engineer / CI Runner]\n              |\n  (Executes: terraform apply)\n              v\n[AWS DynamoDB Table] (Requests Mutex Lock)\n              |\n     +--------+--------+\n     |                 |\n [Lock Acquired]    [Lock Fails! (Another apply active)]\n     |                 `--> Exits immediately with error\n     v\n[AWS S3 Bucket: terraform.tfstate] (Reads latest live state)\n     |\n     v\n[Executes Cloud APIs: Provisions AWS / Kubernetes Resources]\n     |\n     v\n[Updates S3 state] ===> [Releases DynamoDB Lock]"
    },
    "commands": [
      {
        "cmd": "terraform init -upgrade",
        "desc": "Initialize providers and remote backend with newest updates",
        "example": "terraform init"
      },
      {
        "cmd": "terraform plan -out=tfplan.binary",
        "desc": "Generate and save deterministic execution plan",
        "example": "terraform plan -out=tfplan"
      },
      {
        "cmd": "terraform apply tfplan.binary",
        "desc": "Apply exact saved execution plan with zero surprises",
        "example": "terraform apply tfplan"
      },
      {
        "cmd": "terraform state list",
        "desc": "List all tracked resources inside the current state file",
        "example": "terraform state list"
      },
      {
        "cmd": "terraform force-unlock <LOCK_ID>",
        "desc": "Forcefully release a dead lock in DynamoDB if a CI runner crashed",
        "example": "terraform force-unlock ID"
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "backend-config.tf",
      "code": "# Production Terraform remote backend with S3 and DynamoDB distributed state locking\nterraform {\n  required_version = \">= 1.7.0\"\n\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.40\"\n    }\n  }\n\n  backend \"s3\" {\n    bucket         = \"company-terraform-states-prod\"\n    key            = \"infrastructure/vpc-eks/terraform.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    dynamodb_table = \"terraform-state-locks\"\n  }\n}\n\nprovider \"aws\" {\n  region = \"us-east-1\"\n  default_tags {\n    tags = {\n      Environment = \"production\"\n      ManagedBy   = \"terraform\"\n      Repository  = \"infrastructure-code\"\n    }\n  }\n}",
      "explanation": "Standard production backend configuration with S3 server-side encryption and DynamoDB distributed mutex locking."
    },
    "gotchas": [
      {
        "issue": "Plaintext database passwords leaked in terraform.tfstate",
        "resolution": "Terraform state files store all resource attributes in plaintext JSON, including passwords generated by `random_password` or passed to RDS. Encrypt the S3 backend at rest and strictly restrict IAM read access to the state bucket.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the purpose of the terraform.tfstate file and why should it never be committed to Git?",
        "answer": "The state file maps declarative code to real-world cloud resource IDs and tracks metadata. It should never be committed to Git because: 1) It often contains sensitive plaintext secrets and database passwords; 2) Multiple developers committing state to Git will cause irreconcilable merge conflicts and state corruption.",
        "platformContext": "Standard platform engineer interview question."
      }
    ],
    "references": [
      {
        "title": "Terraform Backend Type: s3",
        "url": "https://developer.hashicorp.com/terraform/language/settings/backends/s3",
        "source": "HashiCorp",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which AWS service is commonly configured alongside an S3 remote backend to provide distributed state locking for Terraform?",
        "options": [
          "DynamoDB",
          "SQS",
          "ElastiCache",
          "RDS Aurora"
        ],
        "answerIndex": 0,
        "explanation": "Amazon DynamoDB provides distributed mutex locking to prevent concurrent state file modifications."
      }
    ]
  },
  {
    "id": "iac-config-management",
    "slug": "config-management-ansible-chef-puppet-vs-iac",
    "pillarId": "iac",
    "branch": "right",
    "order": 3,
    "title": "Configuration Management (Ansible, Chef, Puppet) & Why Replaced",
    "subtitle": "Push vs pull, mutable vs immutable infrastructure, and why containers & IaC took over",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Ansible",
      "Chef",
      "Puppet",
      "Config Management",
      "Immutable Infrastructure"
    ],
    "summary": "Understand traditional configuration management systems (Ansible, Puppet, Chef) and explore the architectural shift toward immutable containers and golden machine images.",
    "overview": "In the early 2010s, configuration management was the cornerstone of systems engineering.\n\nLegacy Tool Paradigms:\n1. Puppet & Chef (Agent & Pull-based):\n   - Required background agent installed on every node polling a central master server.\n   - Enforced desired host configuration by updating files, packages, and services on running servers.\n2. Ansible (Agentless & Push-based):\n   - Connects to targets via standard SSH.\n   - Executes declarative YAML Playbooks using Python modules.\n   - Simple, no background daemons, idempotent tasks.\n\nWhy Configuration Management Was Largely Replaced:\n- Mutable vs Immutable Infrastructure:\n  - In mutable architectures (Ansible/Chef), servers live for years and are repeatedly modified in place. Over time, servers develop 'snowflake' configuration drift, failed package dependencies, and untracked changes.\n  - In immutable architectures (Containers + Terraform + Packer), servers are NEVER modified. New versions build a brand new Docker image or AMI (Amazon Machine Image). Old instances are terminated and replaced instantly.\n- Where Ansible is still used: Bootstrapping bare-metal Kubernetes nodes, network switch configurations, and legacy enterprise VMs.",
    "keyConcepts": [
      {
        "title": "Mutable vs Immutable Infrastructure",
        "explanation": "Mutable infrastructure updates live servers in-place, risking configuration drift. Immutable infrastructure bakes dependencies into static images; updates deploy new instances and terminate old ones."
      },
      {
        "title": "Packer + Terraform Replacing In-Place Ansible",
        "explanation": "Modern teams run Ansible once at image-build time inside HashiCorp Packer to bake a 'Golden AMI', then use Terraform to deploy the immutable image without runtime configuration scripts."
      }
    ],
    "diagram": {
      "title": "Mutable Configuration Drift vs Immutable Replacement",
      "type": "ascii",
      "code": "MUTABLE INFRASTRUCTURE (Ansible / Chef Updating Live VMs):\n  [VM v1.0] ---Apply Playbook---> [VM v1.1] ---Patch failed---> [Drifted Snowflake Server!]\n\nIMMUTABLE INFRASTRUCTURE (Containers / Golden AMIs + Terraform):\n  [Commit Code] ===> [Bake Immutable Image v2.0] (Tested & Sealed)\n                               |\n                               v\n  [Deploy New VM v2.0] ===> Terminate Old VM v1.0! (Zero Drift!)"
    },
    "commands": [
      {
        "cmd": "ansible-playbook -i hosts.ini site.yml --check",
        "desc": "Perform dry-run syntax and change check with Ansible",
        "example": "ansible-playbook ... --check"
      },
      {
        "cmd": "ansible all -m ping -i inventory.ini",
        "desc": "Verify SSH connectivity and Python runtime across all managed hosts",
        "example": "ansible all -m ping"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "node-hardening-playbook.yml",
      "code": "# Production Ansible Playbook for baseline host OS hardening and Docker engine install\n- name: Hardened Container Host Baseline\n  hosts: k8s_nodes\n  become: true\n  tasks:\n    - name: Ensure required system packages are present\n      ansible.builtin.apt:\n        name:\n          - curl\n          - ca-certificates\n          - htop\n          - containerd\n        state: present\n        update_cache: true\n\n    - name: Enable IPv4 packet forwarding in sysctl\n      ansible.posix.sysctl:\n        name: net.ipv4.ip_forward\n        value: '1'\n        state: present\n        reload: true\n\n    - name: Ensure containerd service is enabled and running\n      ansible.builtin.systemd:\n        name: containerd\n        state: started\n        enabled: true",
      "explanation": "Idempotent Ansible playbook bootstrapping a node with containerd and kernel forwarding."
    },
    "gotchas": [
      {
        "issue": "Slow deployment pipelines caused by running 20-minute Ansible runs during VM boot",
        "resolution": "Executing long Ansible playbooks during cloud-init autoscaling adds 15+ minutes before new nodes can serve traffic. Pre-bake packages into AMIs using HashiCorp Packer so instances boot ready in under 60 seconds.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why has the industry largely shifted from Configuration Management (Puppet/Chef) to Immutable Infrastructure (Containers/Terraform)?",
        "answer": "Configuration management modifies live systems in place, which inevitably leads to configuration drift, untracked mutations, and slow deployment times. Immutable infrastructure builds pre-baked, disposable images (AMIs/Docker containers). When updates occur, new immutable instances replace old ones, eliminating drift and guaranteeing 100% environment parity.",
        "platformContext": "Fundamental systems philosophy evaluated in senior and lead engineering interviews."
      }
    ],
    "references": [
      {
        "title": "Martin Fowler on Immutable Infrastructure",
        "url": "https://martinfowler.com/bliki/ImmutableServer.html",
        "source": "Martin Fowler",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary difference in operational philosophy between Ansible and HashiCorp Terraform?",
        "options": [
          "Terraform provisions cloud infrastructure resources; Ansible configures software inside existing servers",
          "Ansible only runs on Windows",
          "Terraform requires an agent on every VM",
          "Ansible cannot execute shell commands"
        ],
        "answerIndex": 0,
        "explanation": "Terraform excels at orchestrating cloud infrastructure; Ansible traditionally configures inside running OS instances."
      }
    ]
  },
  {
    "id": "iac-why",
    "slug": "why-iac-benefits-and-problems-solved",
    "pillarId": "iac",
    "branch": "left",
    "order": 4,
    "title": "Why IaC? Benefits & Problems Solved",
    "subtitle": "Eliminating configuration drift, disaster recovery, reproducibility, and auditability",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "IaC",
      "Automation",
      "Configuration Drift",
      "Disaster Recovery",
      "Cloud"
    ],
    "summary": "Understand why manual console provisioning fails at scale: replace error-prone 'ClickOps' with version-controlled, auditable, and automated Infrastructure as Code.",
    "overview": "Before IaC, cloud infrastructure was provisioned manually by logging into cloud web consoles ('ClickOps') or running ad-hoc shell scripts.\n\nProblems Solved by IaC:\n1. Configuration Drift: When engineers manually tweak firewall rules or instance sizes in consoles without documentation, environments diverge unpredictably.\n2. Inability to Reproduce Environments: Spinning up a new staging or disaster-recovery environment took weeks of manual clicking.\n3. Zero Audit Trail: In ClickOps, who changed security group port 22 to 0.0.0.0 and why is lost in obscurity.\n\nCore Benefits of IaC:\n- Version Control: Infrastructure is stored in Git with commit messages, branch reviews, and pull request approvals.\n- Speed & Consistency: Spin up an entire multi-region cluster identically in 15 minutes.\n- Automated Disaster Recovery: If an entire AWS region experiences a catastrophic outage, re-running Terraform provisions identical infrastructure in an adjacent region.",
    "keyConcepts": [
      {
        "title": "Elimination of 'ClickOps'",
        "explanation": "Revoke write permissions to cloud web consoles in production. All infrastructure modifications must be executed via Git pull requests reviewed by platform peers."
      },
      {
        "title": "Infrastructure Documentation as Code",
        "explanation": "Configuration files serve as living, authoritative documentation. You never need to wonder how a VPC is configured; the code defines reality."
      }
    ],
    "diagram": {
      "title": "Manual ClickOps vs Declarative Infrastructure as Code",
      "type": "ascii",
      "code": "MANUAL CLIKCOPS (High Risk, Unrepeatable):\n  [Engineer Console Clicks] ===> [Untracked Changes] ===> [Snowflake Environments & Outages!]\n\nINFRASTRUCTURE AS CODE (Auditable, Automated):\n  [HCL Code in Git] ---> [PR Review & Plan] ---> [Merge to Main] ---> [Automated Apply]\n         |                                                                   |\n         `---(Replicable anywhere identically in minutes!)<------------------'"
    },
    "commands": [
      {
        "cmd": "terraform fmt -check",
        "desc": "Verify infrastructure code matches canonical formatting guidelines",
        "example": "terraform fmt -check"
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "reproducible-environment.tf",
      "code": "# Production parameterized module enabling identical environment instantiation\nvariable \"environment\" {\n  type        = string\n  description = \"Deployment tier (staging or production)\"\n}\n\nmodule \"core_network\" {\n  source      = \"./modules/network\"\n  environment = var.environment\n  vpc_cidr    = var.environment == \"production\" ? \"10.0.0.0/16\" : \"10.1.0.0/16\"\n}\n\noutput \"vpc_id\" {\n  value       = module.core_network.vpc_id\n  description = \"Exported VPC ID for downstream service binding\"\n}",
      "explanation": "Illustrates parameterized modules that enable spinning up staging and production with identical architecture."
    },
    "gotchas": [
      {
        "issue": "Making 'quick emergency hotfixes' in the cloud console directly",
        "resolution": "If an engineer fixes an outage by adding a security group rule in the console, the next `terraform apply` will detect the drift and overwrite/delete the manual rule. Always backport changes to code immediately.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is configuration drift in cloud infrastructure and how does IaC remediate it?",
        "answer": "Configuration drift occurs when live cloud resources diverge from the documented or coded configuration due to manual console edits or ad-hoc scripts. IaC tools like Terraform detect this drift during `plan` by comparing the live cloud API state against the state file and generating corrective actions to realign the infrastructure with code.",
        "platformContext": "Standard platform engineering screening question."
      }
    ],
    "references": [
      {
        "title": "HashiCorp What is Infrastructure as Code?",
        "url": "https://www.hashicorp.com/resources/what-is-infrastructure-as-code",
        "source": "HashiCorp",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary danger of managing cloud infrastructure through manual console clicks ('ClickOps')?",
        "options": [
          "It leads to undocumented configuration drift and non-reproducible environments",
          "It consumes too much cloud memory",
          "It requires Python compilers",
          "It disables HTTPS encryption"
        ],
        "answerIndex": 0,
        "explanation": "Manual console clicking results in unversioned, undocumented configuration drift that cannot be audited or replicated."
      }
    ]
  },
  {
    "id": "iac-imperative-declarative",
    "slug": "imperative-vs-declarative-infrastructure",
    "pillarId": "iac",
    "branch": "left",
    "order": 5,
    "title": "Imperative vs Declarative Infrastructure",
    "subtitle": "How vs What, idempotency, state reconciliation, and error recovery",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Declarative",
      "Imperative",
      "Idempotency",
      "IaC",
      "Terraform"
    ],
    "summary": "Understand the fundamental divide in systems engineering: imperative procedural commands ('do this, then do that') vs declarative desired state ('I want 3 servers').",
    "overview": "The mechanism by which tools manage infrastructure defines their resilience.\n\n1. Imperative (Procedural - The 'HOW'):\n   - You define the exact sequence of step-by-step commands to achieve a result.\n   - Examples: Bash scripts, AWS CLI (`aws ec2 run-instances ...`).\n   - Problem: If the script fails halfway through, running it again may create duplicate resources or fail with 'Resource already exists'. Lacks idempotency.\n2. Declarative (The 'WHAT'):\n   - You define the desired end-state of the system.\n   - Examples: Terraform (`resource \"aws_instance\" ... count = 3`), Kubernetes YAML (`replicas: 3`).\n   - The tool figures out what API calls are needed to transition the current state to the desired state.\n   - Idempotent: Running the tool 100 times produces the exact same end state without duplicating resources.",
    "keyConcepts": [
      {
        "title": "Idempotency",
        "explanation": "An operation is idempotent if executing it multiple times produces the exact same result as executing it once. Declarative IaC is idempotent by design."
      },
      {
        "title": "State Reconciliation",
        "explanation": "Declarative engines compute a directed acyclic graph (DAG) of dependencies to safely determine what to create, modify, or destroy in optimal parallel order."
      }
    ],
    "diagram": {
      "title": "Imperative Scripting vs Declarative State Reconciliation",
      "type": "ascii",
      "code": "IMPERATIVE (Bash / AWS CLI):\n  \"Create Subnet A\" -> \"Create Route Table\" -> \"Attach IGW\"\n  * If script fails at step 2, re-running fails with 'Subnet A already exists!'\n\nDECLARATIVE (Terraform / Kubernetes):\n  Desired State: [VPC, 2 Subnets, Route Table]\n  Engine queries Cloud: 'Subnet A exists; Subnet B and Route Table are missing.'\n  Action Plan: Creates ONLY Subnet B and Route Table. (Idempotent!)"
    },
    "commands": [
      {
        "cmd": "aws ec2 create-vpc --cidr-block 10.0.0.0/16",
        "desc": "Example of Imperative CLI command (fails if repeated without safeguards)",
        "example": "aws ec2 create-vpc ..."
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "declarative-resource.tf",
      "code": "# Declarative resource definition in Terraform: declares WHAT should exist\nresource \"aws_security_group\" \"web_traffic\" {\n  name        = \"allow-web-traffic\"\n  description = \"Allow TLS inbound traffic\"\n  vpc_id      = \"vpc-12345678\"\n\n  ingress {\n    description = \"HTTPS from Internet\"\n    from_port   = 443\n    to_port     = 443\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = \"-1\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}",
      "explanation": "Declarative definition: Terraform ensures this exact security group state exists regardless of how many times applied."
    },
    "gotchas": [
      {
        "issue": "Embedding imperative local-exec provisioners inside declarative Terraform",
        "resolution": "Using `local-exec` provisioners to run arbitrary Bash scripts breaks idempotency and state tracking. Avoid provisioners wherever cloud-init or native providers exist.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is idempotency and why is it essential for Infrastructure as Code?",
        "answer": "Idempotency means that executing an operation multiple times yields the exact same state as executing it once. In IaC, idempotency guarantees that running automated deployment pipelines repeatedly will never accidentally create duplicate resources, corrupt state, or crash when resources already exist.",
        "platformContext": "Fundamental systems engineering concept."
      }
    ],
    "references": [
      {
        "title": "Declarative vs Imperative IaC Guide",
        "url": "https://cloud.google.com/learn/what-is-infrastructure-as-code",
        "source": "Google Cloud",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which statement characterizes a declarative Infrastructure as Code system?",
        "options": [
          "You define the desired end state, and the engine determines the actions required",
          "You write procedural step-by-step commands",
          "It cannot be automated in CI pipelines",
          "It requires manual clicking in the cloud console"
        ],
        "answerIndex": 0,
        "explanation": "Declarative systems focus on declaring the desired state, letting the engine resolve necessary transitions."
      }
    ]
  },
  {
    "id": "iac-pipeline-integration",
    "slug": "integrating-iac-into-pipelines-plan-apply",
    "pillarId": "iac",
    "branch": "left",
    "order": 6,
    "title": "Integrating IaC into Pipelines",
    "subtitle": "Automated plan on PR, apply on merge, policy-as-code (OPA/Checkov), and state locking",
    "level": "Advanced",
    "estimatedMinutes": 25,
    "tags": [
      "IaC in CI/CD",
      "Terraform Cloud",
      "Checkov",
      "Atlantis",
      "Policy-as-Code"
    ],
    "summary": "Automate infrastructure delivery safely: execute security linting and speculative plans on pull requests, post diffs as PR comments, and gate applies on merge.",
    "overview": "Running `terraform apply` from developer laptops is dangerous: state locks can collide, local credentials can leak, and changes lack peer review.\n\nProduction IaC CI/CD Architecture:\n1. Pull Request Stage:\n   - Static Linting: `terraform fmt -check` and `tflint` validate syntax.\n   - Security & Compliance Scanning: Checkov or tfsec scans HCL for security misconfigurations (e.g. unencrypted S3 buckets, open SSH ports).\n   - Speculative Plan: Runs `terraform plan` and automatically posts the planned infrastructure diff as a markdown comment on the GitHub PR for peer review.\n2. Merge Stage:\n   - Once approved by platform leads and merged to `main`, the CI runner assumes cloud IAM roles via OIDC.\n   - Executes `terraform apply` using the exact pre-computed plan file, committing changes safely.",
    "keyConcepts": [
      {
        "title": "Speculative Plans on Pull Requests",
        "explanation": "Reviewers should see the exact proposed cloud changes (resources added, modified, or destroyed) directly inside the PR interface before approving merges."
      },
      {
        "title": "Policy as Code (Checkov / OPA Conftest)",
        "explanation": "Automated security policy enforcement: reject any PR in CI that attempts to provision public databases or unencrypted storage volumes before deployment."
      }
    ],
    "diagram": {
      "title": "IaC Pull Request Pipeline Architecture",
      "type": "ascii",
      "code": "[Developer creates PR with HCL changes]\n                  |\n                  v\n  [Job: Security Scan (Checkov / tfsec)]\n                  |\n                  v\n  [Job: terraform plan]\n                  |\n                  v\n  [Bot posts Plan Diff Comment on PR: +2 Added, ~1 Changed]\n                  |\n                  v\n  [Platform Lead Approves & Merges PR to main]\n                  |\n                  v\n  [Main Pipeline executes: terraform apply!]"
    },
    "commands": [
      {
        "cmd": "checkov -d . --framework terraform",
        "desc": "Scan local Terraform configuration for security compliance violations",
        "example": "checkov -d ."
      },
      {
        "cmd": "tflint --init && tflint",
        "desc": "Lint Terraform code for provider-specific anti-patterns",
        "example": "tflint"
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "terraform-pr-pipeline.yml",
      "code": "# Production GitHub Actions workflow executing Terraform Plan and Checkov scanning on PRs\nname: Terraform PR Validation\non:\n  pull_request:\n    branches: [main]\n\npermissions:\n  contents: read\n  pull-requests: write\n  id-token: write\n\njobs:\n  validate-plan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Terraform\n        uses: hashicorp/setup-terraform@v3\n        with:\n          terraform_version: 1.8.0\n\n      - name: Terraform Format Check\n        run: terraform fmt -check\n\n      - name: Security Scan with Checkov\n        uses: bridgecrewio/checkov-action@master\n        with:\n          framework: terraform\n          soft_fail: false\n\n      - name: Terraform Init\n        run: terraform init\n\n      - name: Terraform Plan\n        id: plan\n        run: terraform plan -no-color",
      "explanation": "Validates formatting, runs Checkov security checks, and computes a speculative plan on pull requests."
    },
    "gotchas": [
      {
        "issue": "Plan and Apply discrepancy caused by unpinned plan files",
        "resolution": "If a pipeline runs `terraform plan` on PR, but simply runs `terraform apply` (re-planning) on merge, another merged PR could have altered cloud state in the interim. Always save and apply the exact binary plan file: `terraform plan -out=tfplan` and `terraform apply tfplan`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Atlantis and how does it optimize IaC pull request workflows?",
        "answer": "Atlantis is an open-source GitOps tool for Terraform. It integrates directly into GitHub/GitLab pull requests, allowing developers to run `atlantis plan` and `atlantis apply` via PR comments, automatically locking the project workspace to prevent conflicting concurrent plans.",
        "platformContext": "Popular dedicated tool in modern platform engineering teams."
      }
    ],
    "references": [
      {
        "title": "Bridgecrew Checkov Scanner",
        "url": "https://www.checkov.io/",
        "source": "Checkov",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary role of tools like Checkov or tfsec in an IaC pipeline?",
        "options": [
          "To scan declarative configurations for security misconfigurations and compliance violations",
          "To compile HCL into Python",
          "To compress state files",
          "To execute DNS queries"
        ],
        "answerIndex": 0,
        "explanation": "Checkov and tfsec are Policy-as-Code scanners that detect security and compliance violations in IaC templates."
      }
    ]
  },
  {
    "id": "iac-vs-ifc",
    "slug": "iac-vs-ifc-infrastructure-from-code",
    "pillarId": "iac",
    "branch": "left",
    "order": 7,
    "title": "Infrastructure as Code (IaC) vs Infrastructure from Code (IfC)",
    "subtitle": "Declarative DSLs vs automatic cloud synthesis from application code semantics",
    "level": "Advanced",
    "estimatedMinutes": 20,
    "tags": [
      "IaC",
      "IfC",
      "Winglang",
      "Ampt",
      "Serverless",
      "Emerging Tech"
    ],
    "summary": "Explore the frontier of cloud programming: contrast traditional IaC (separate files declaring cloud primitives) with emerging IfC (application code semantics automatically inferring cloud infrastructure).",
    "overview": "In traditional IaC (Terraform, Pulumi), developers write application code in one language (e.g. TypeScript) and manually declare required cloud infrastructure in separate configuration files (Terraform HCL).\n\nThe Paradigm Shift:\n1. Infrastructure as Code (IaC - Dominant Standard):\n   - Infrastructure is explicitly and independently declared.\n   - Developer writes an SQS queue resource, creates an IAM policy, wires environment variables, and writes consumer application code.\n   - Benefit: Complete, granular control over network topology, sizing, and security.\n2. Infrastructure from Code (IfC - Emerging Paradigm):\n   - Application code semantics automatically infer and synthesize cloud infrastructure.\n   - Frameworks: Winglang, Ampt, Klotho, Encore.\n   - Developer writes: `const queue = new cloud.Queue(); queue.setConsumer(async (msg) => { ... });`\n   - The compiler automatically provisions the SQS queue, Lambda compute, IAM execution roles, and event source mapping without writing a single line of Terraform or YAML.\n\nWhy It Hasn't Caught on Broadly Yet:\n- Lack of fine-grained architectural control over enterprise VPCs, firewalls, and legacy compliance configurations; best suited for serverless greenfield applications.",
    "keyConcepts": [
      {
        "title": "Elimination of Configuration Gluing",
        "explanation": "In standard IaC, ~50% of code is boilerplate: passing ARNs, IAM policies, and environment variables between Terraform and application code. IfC eliminates this glue layer."
      },
      {
        "title": "Enterprise Adoption Barriers",
        "explanation": "Enterprise platform teams maintain strict separation of concerns: platform engineers control VPCs, subnets, and IAM boundaries, while developers deploy services within those boundaries."
      }
    ],
    "diagram": {
      "title": "IaC vs Infrastructure from Code (IfC)",
      "type": "ascii",
      "code": "TRADITIONAL IaC (Decoupled & Explicit):\n  [Application: index.js] <---> [Config Glue: IAM, ARNs] <---> [Terraform HCL: 50 lines]\n\nINFRASTRUCTURE FROM CODE (IfC - Inferred Semantics):\n  [Application Code: Wing / Encore]\n  `const bucket = new cloud.Bucket(); bucket.put(\"key\", data);`\n             |\n             v (Compiler automatically synthesizes S3 bucket, IAM role & policies!)"
    },
    "commands": [
      {
        "cmd": "wing --version 2>/dev/null || echo 'Winglang compiler'",
        "desc": "Check Winglang cloud-oriented programming compiler",
        "example": "wing compile"
      }
    ],
    "productionCode": {
      "language": "typescript",
      "filename": "wing-sample.w",
      "code": "// Winglang (IfC) example: Infrastructure synthesized directly from application semantics\nbring cloud;\n\nlet queue = new cloud.Queue();\nlet bucket = new cloud.Bucket();\n\n// When message arrives on queue, compiler synthesizes serverless consumer + IAM permissions\nqueue.setConsumer(inflight (message: str) => {\n    bucket.put(\"last_processed.txt\", message);\n    log(\"Processed message and stored in cloud bucket: {message}\");\n});",
      "explanation": "Winglang snippet where calling `bucket.put` automatically grants the consumer function least-privilege IAM write permissions."
    },
    "gotchas": [
      {
        "issue": "Loss of granular cloud networking control in complex enterprise VPCs",
        "resolution": "IfC frameworks often default to public serverless endpoints. For regulated financial environments requiring strict private subnets, transit gateways, and egress proxies, traditional Terraform remains required.",
        "severity": "tip"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the concept of Infrastructure from Code (IfC) and what problem does it attempt to solve?",
        "answer": "Infrastructure from Code is a paradigm where the compiler automatically infers and provisions necessary cloud resources (queues, databases, storage) directly from application code syntax. It attempts to eliminate the cognitive overhead and boilerplate configuration required to wire cloud infrastructure and IAM permissions in separate IaC files.",
        "platformContext": "Demonstrates forward-looking awareness of emerging cloud-native paradigms."
      }
    ],
    "references": [
      {
        "title": "Wing Programming Language Documentation",
        "url": "https://www.winglang.io/",
        "source": "Winglang",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the distinguishing feature of Infrastructure from Code (IfC) compared to traditional IaC?",
        "options": [
          "Infrastructure is automatically inferred and synthesized directly from application code",
          "It only operates on physical bare metal",
          "It requires writing raw assembly language",
          "It eliminates the need for cloud providers"
        ],
        "answerIndex": 0,
        "explanation": "IfC compilers synthesize required cloud resources directly from application code logic."
      }
    ]
  }
];
