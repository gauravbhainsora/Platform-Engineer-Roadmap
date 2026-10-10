import { TopicItem } from '@/types';

export const CLOUD_TOPICS: TopicItem[] = [
  {
    "id": "cloud-containers",
    "slug": "containers-paas-kubernetes-eks-aks-fargate",
    "pillarId": "cloud",
    "branch": "right",
    "order": 1,
    "title": "Cloud Containers (EKS, AKS, ECS/Fargate)",
    "subtitle": "Managed control planes (EKS/AKS), serverless containers (Fargate, Container Apps), and App Runner",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "EKS",
      "AKS",
      "ECS",
      "Fargate",
      "Cloud Containers",
      "Cloud Native"
    ],
    "summary": "Deploy containerized workloads using hyperscaler managed control planes (AWS EKS, Azure AKS) and serverless container execution engines (AWS Fargate, Azure Container Apps).",
    "overview": "Running self-managed Kubernetes control planes (etcd, API server, controllers) is an operational burden. Cloud providers offer managed container services across two tiers:\n\n1. Managed Kubernetes (EKS / AKS / GKE):\n   - Cloud provider manages the control plane SLA (etcd backups, HA across 3 Availability Zones, API server scaling).\n   - You manage or autoscaling worker nodes (EC2 / Azure VMs) or delegate node provisioning to Karpenter.\n2. Serverless Containers (AWS Fargate / Azure Container Apps / GCP Cloud Run):\n   - Completely removes EC2/VM management. You define CPU and memory per task/pod; the cloud provider spins up dedicated microVMs (Firecracker) on demand in seconds.\n3. PaaS Containers (AWS App Runner / ECS):\n   - Opinionated, streamlined deployment directly from GitHub repo or container image with built-in load balancing and TLS.",
    "keyConcepts": [
      {
        "title": "Shared Responsibility in Managed Kubernetes",
        "explanation": "Cloud provider guarantees control plane uptime and upgrades. The platform engineering team remains responsible for node OS patching, CNI network addons, security policies, and cluster autoscaling."
      },
      {
        "title": "Fargate vs EC2 Worker Nodes",
        "explanation": "Fargate charges per second for allocated vCPU/memory, removing node management overhead. EC2 worker nodes are more cost-effective at high sustained scale and support DaemonSets, privileged containers, and GPUs."
      }
    ],
    "diagram": {
      "title": "AWS Managed Kubernetes (EKS) Architecture",
      "type": "ascii",
      "code": "+-------------------------------------------------------------+\n|               AWS Managed EKS Control Plane                 |\n|  [etcd HA Cluster]   [API Server]   [Controller Manager]    |\n|  (Replicated across 3 Availability Zones - Managed by AWS)  |\n+-------------------------------------------------------------+\n                               |\n       +-----------------------+-----------------------+\n       |                                               |\n       v                                               v\n[Self-Managed / Karpenter EC2 Nodes]         [AWS Fargate Serverless]\n- EC2 Spot / On-Demand instances             - Zero EC2 instances to patch\n- Supports DaemonSets & GPUs                 - Isolated microVM per Pod"
    },
    "commands": [
      {
        "cmd": "aws eks update-kubeconfig --region us-east-1 --name prod-cluster",
        "desc": "Configure local kubectl context to connect to AWS EKS cluster",
        "example": "aws eks update-kubeconfig ..."
      },
      {
        "cmd": "az aks get-credentials --resource-group rg-prod --name aks-prod",
        "desc": "Download kubeconfig credentials for Azure AKS cluster",
        "example": "az aks get-credentials ..."
      },
      {
        "cmd": "aws ecs list-tasks --cluster production-ecs",
        "desc": "List running ECS tasks on cluster",
        "example": "aws ecs list-tasks ..."
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "eks-cluster.tf",
      "code": "# Production Terraform snippet provisioning AWS EKS Cluster with managed node groups\nmodule \"eks\" {\n  source  = \"terraform-aws-modules/eks/aws\"\n  version = \"~> 20.0\"\n\n  cluster_name    = \"prod-platform-cluster\"\n  cluster_version = \"1.30\"\n\n  cluster_endpoint_public_access  = false # Restrict API to internal VPC\n  cluster_endpoint_private_access = true\n\n  vpc_id     = module.vpc.vpc_id\n  subnet_ids = module.vpc.private_subnets\n\n  eks_managed_node_groups = {\n    general_nodes = {\n      min_size     = 3\n      max_size     = 15\n      desired_size = 3\n\n      instance_types = [\"m6i.xlarge\"]\n      capacity_type  = \"ON_DEMAND\"\n\n      labels = {\n        Environment = \"production\"\n        Role        = \"general\"\n      }\n    }\n  }\n}",
      "explanation": "Provisions an enterprise EKS cluster with private API access across multi-AZ subnets."
    },
    "gotchas": [
      {
        "issue": "DaemonSets not scheduling on AWS Fargate",
        "resolution": "AWS Fargate does not support DaemonSets because each pod executes inside its own dedicated microVM without shared node resources. Run logging/monitoring agents as sidecars or use CloudWatch Observability integration.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is Karpenter and why is it preferred over the traditional Kubernetes Cluster Autoscaler on AWS?",
        "answer": "Karpenter is an open-source, high-performance node autoscaler built by AWS. Unlike the legacy Cluster Autoscaler which scales predefined EC2 Auto Scaling Groups, Karpenter evaluates unschedulable pod requirements directly and provisions optimal EC2 instance types and pricing models (Spot vs On-Demand) in under 45 seconds.",
        "platformContext": "The modern standard for Kubernetes autoscaling across hyperscalers."
      }
    ],
    "references": [
      {
        "title": "AWS EKS User Guide",
        "url": "https://docs.aws.amazon.com/eks/latest/userguide/",
        "source": "AWS",
        "type": "official"
      },
      {
        "title": "Azure Kubernetes Service (AKS) Documentation",
        "url": "https://learn.microsoft.com/en-us/azure/aks/",
        "source": "Microsoft",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which technology enables AWS Fargate to run serverless containers with dedicated hardware-assisted virtualization per pod?",
        "options": [
          "Firecracker microVMs",
          "VirtualBox",
          "Docker Swarm",
          "Xen Hypervisor"
        ],
        "answerIndex": 0,
        "explanation": "AWS Fargate uses Firecracker, an open-source microVM hypervisor written in Rust for minimal memory footprint."
      }
    ]
  },
  {
    "id": "cloud-serverless",
    "slug": "serverless-lambda-azure-functions-event-driven",
    "pillarId": "cloud",
    "branch": "right",
    "order": 2,
    "title": "Serverless (Lambda, Azure Functions)",
    "subtitle": "Function-as-a-Service (FaaS), event-driven architectures, cold starts, and concurrency limits",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Serverless",
      "Lambda",
      "Azure Functions",
      "FaaS",
      "Event-Driven"
    ],
    "summary": "Run code without provisioning or managing servers. Automatically scale from zero to tens of thousands of concurrent requests with pay-per-execution billing.",
    "overview": "Serverless architectures abstract the underlying infrastructure completely, executing code strictly in response to events.\n\nKey Concepts:\n1. Execution Model:\n   - Triggered by cloud events: HTTP requests (API Gateway), message queues (SQS/RabbitMQ), object uploads (S3), or database changes (DynamoDB Streams).\n   - Billed strictly for consumed execution duration rounded to the nearest millisecond.\n2. Cold Starts:\n   - The latency penalty incurred when a cloud provider allocates a new execution environment, downloads function code, and initializes runtime engines (e.g. JVM, Node.js). Mitigated with provisioned concurrency.\n3. Concurrency Limits:\n   - AWS accounts have default regional concurrency limits (typically 1,000 concurrent executions). Unchecked scaling can exhaust backend database connection pools.\n4. Idempotency:\n   - Because event-driven systems can deliver messages more than once ('at-least-once' delivery), serverless handlers must be designed to be idempotent.",
    "keyConcepts": [
      {
        "title": "Cold Starts & Provisioned Concurrency",
        "explanation": "Lightweight runtimes (Node.js, Go, Python) experience cold starts < 200ms, while heavy JVM/Spring runtimes can take 5-10s. Provisioned Concurrency pre-warms environments to eliminate cold start spikes."
      },
      {
        "title": "Database Connection Pool Exhaustion",
        "explanation": "If a Lambda function scales to 1,000 concurrent executions, each opening a database connection, it will exhaust a relational database (Postgres). Use managed proxies (AWS RDS Proxy) to pool connections."
      }
    ],
    "diagram": {
      "title": "Serverless Event-Driven Architecture",
      "type": "ascii",
      "code": "[S3 Bucket: Uploads] ===(ObjectCreated Event)===> [AWS Lambda Function]\n                                                        |\n                                                        v\n                                               [Processes Thumbnail]\n                                                        |\n                                                        v\n                                              [Writes to DynamoDB]"
    },
    "commands": [
      {
        "cmd": "aws lambda invoke --function-name image-processor --payload '{\"id\": 1}' response.json",
        "desc": "Manually trigger a Lambda function and capture JSON output",
        "example": "aws lambda invoke ..."
      },
      {
        "cmd": "aws lambda get-function --function-name my-function",
        "desc": "Inspect function configuration, memory size, and timeout limits",
        "example": "aws lambda get-function ..."
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "lambda_handler.py",
      "code": "# Production Python Lambda handler with structured JSON logging and idempotency check\nimport json\nimport logging\nimport os\n\nlogger = logging.getLogger()\nlogger.setLevel(logging.INFO)\n\ndef lambda_handler(event, context):\n    request_id = context.aws_request_id\n    logger.info(json.dumps({\n        \"message\": \"Processing event\",\n        \"request_id\": request_id,\n        \"function_name\": context.function_name,\n        \"remaining_time_ms\": context.get_remaining_time_in_millis()\n    }))\n    \n    try:\n        # Process incoming SQS / API Gateway event\n        records = event.get(\"Records\", [])\n        for record in records:\n            body = json.loads(record.get(\"body\", \"{}\"))\n            # Execute business logic...\n            \n        return {\n            \"statusCode\": 200,\n            \"body\": json.dumps({\"status\": \"success\", \"request_id\": request_id})\n        }\n    except Exception as e:\n        logger.error(f\"Error processing event: {str(e)}\")\n        raise e",
      "explanation": "Production AWS Lambda handler implementing structured JSON logging and remaining-time tracking."
    },
    "gotchas": [
      {
        "issue": "Unchecked Lambda concurrency overwhelming downstream relational databases",
        "resolution": "Configure Reserved Concurrency on the Lambda function to throttle maximum parallel executions, and deploy AWS RDS Proxy to pool database connections.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the maximum execution duration for an AWS Lambda function?",
        "answer": "15 minutes (900 seconds). For long-running batch jobs, workloads should run on AWS ECS/Fargate, AWS Batch, or Kubernetes Jobs.",
        "platformContext": "Standard cloud architecture qualification question."
      }
    ],
    "references": [
      {
        "title": "AWS Lambda Operator Guide",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What happens when an unthrottled serverless function experiences sudden burst traffic beyond regional limits?",
        "options": [
          "Excess requests are throttled with 429 errors or queued",
          "The cloud provider halts the entire account",
          "All existing instances are terminated",
          "Network bandwidth is cut in half"
        ],
        "answerIndex": 0,
        "explanation": "AWS Lambda returns HTTP 429 Too Many Requests when concurrency limits are exceeded."
      }
    ]
  },
  {
    "id": "cloud-object-storage",
    "slug": "object-storage-s3-azure-blob-lifecycle",
    "pillarId": "cloud",
    "branch": "right",
    "order": 3,
    "title": "Object Storage (S3, Azure Blob)",
    "subtitle": "Buckets, objects, storage tiers, bucket policies, lifecycle rules, and presigned URLs",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "S3",
      "Azure Blob",
      "Object Storage",
      "Storage Tiers",
      "Presigned URLs"
    ],
    "summary": "Store virtually unlimited unstructured data (backups, images, terraform state files, logs) with 99.999999999% (11 9s) durability.",
    "overview": "Object storage does not use a traditional hierarchical directory tree or block device; data is stored as immutable objects referenced by a unique key inside a flat bucket namespace.\n\nKey Concepts:\n1. Core Architecture:\n   - Buckets have globally unique names across the cloud region/platform.\n   - Objects consist of Key (path/name), Data (payload up to 5TB), Metadata (headers), and Version ID.\n2. Storage Classes & Cost Optimization:\n   - S3 Standard / Blob Hot: Immediate access, active workloads.\n   - S3 Infrequent Access (IA) / Blob Cool: Lower storage cost, higher retrieval fee.\n   - S3 Glacier / Blob Archive: Cold long-term archival (e.g. 7-year regulatory compliance) with retrieval times from minutes to hours.\n3. Security & Access:\n   - S3 Bucket Policies (JSON IAM format) & Block Public Access (preventing data leaks).\n   - Presigned URLs: Generate temporary cryptographically signed URLs granting clients time-limited upload/download access without sharing cloud credentials.\n4. Lifecycle Rules:\n   - Automatically transition objects from Standard to Glacier after 30 days and permanently delete them after 365 days.",
    "keyConcepts": [
      {
        "title": "11 Nines of Durability (99.999999999%)",
        "explanation": "Objects are automatically replicated across a minimum of 3 physically separated Availability Zones, ensuring near-zero probability of permanent data loss."
      },
      {
        "title": "Presigned URLs for Direct Browser Uploads",
        "explanation": "Instead of uploading 500MB video files through application servers (saturating web server memory and bandwidth), generate a Presigned S3 URL and let the client upload directly to S3."
      }
    ],
    "diagram": {
      "title": "Presigned URL Direct Upload Pattern",
      "type": "ascii",
      "code": "Client Browser               Backend API Service               AWS S3 Bucket\n      |                               |                              |\n      | --- 1. Request Upload URL --> |                              |\n      |                               | (Generates signed URL)       |\n      | <--- 2. Return Presigned URL - |                              |\n      |                                                              |\n      | === 3. Direct HTTP PUT Upload with Payload ================> |\n      | <== 4. 200 OK (Upload Complete) ============================ |"
    },
    "commands": [
      {
        "cmd": "aws s3 ls s3://company-production-backups/",
        "desc": "List objects inside private S3 bucket",
        "example": "aws s3 ls s3://bucket"
      },
      {
        "cmd": "aws s3 cp backup.tar.gz s3://my-bucket/backups/ --storage-class STANDARD_IA",
        "desc": "Upload file directly into Infrequent Access storage tier",
        "example": "aws s3 cp file s3://bucket/path"
      },
      {
        "cmd": "aws s3 presign s3://my-bucket/report.pdf --expires-in 3600",
        "desc": "Generate a temporary 1-hour presigned URL to download private object",
        "example": "aws s3 presign ..."
      }
    ],
    "productionCode": {
      "language": "json",
      "filename": "s3-bucket-policy.json",
      "code": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"EnforceTLSRequestsOnly\",\n      \"Effect\": \"Deny\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:*\",\n      \"Resource\": [\n        \"arn:aws:s3:::company-secure-storage\",\n        \"arn:aws:s3:::company-secure-storage/*\"\n      ],\n      \"Condition\": {\n        \"Bool\": {\n          \"aws:SecureTransport\": \"false\"\n        }\n      }\n    }\n  ]\n}",
      "explanation": "Enforces TLS 1.2+ encryption in transit on all S3 requests, strictly denying unencrypted plaintext HTTP access."
    },
    "gotchas": [
      {
        "issue": "Accidentally exposing sensitive company data via public S3 buckets",
        "resolution": "Enable AWS 'S3 Block Public Access' at the AWS account level and bucket level to override and prevent accidental public ACL assignments.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between storage durability and storage availability in S3?",
        "answer": "Durability (99.999999999%) is the probability that an object is not permanently lost or corrupted over time. Availability (e.g. 99.99%) is the percentage of time that requests to access the object succeed without receiving error responses.",
        "platformContext": "Standard cloud certification and system design question."
      }
    ],
    "references": [
      {
        "title": "AWS S3 Documentation",
        "url": "https://docs.aws.amazon.com/s3/",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which mechanism allows temporary upload or download access to an S3 object without granting AWS IAM credentials to the client?",
        "options": [
          "Presigned URL",
          "Public Bucket Policy",
          "VPC Endpoint",
          "AWS Direct Connect"
        ],
        "answerIndex": 0,
        "explanation": "Presigned URLs encode temporary cryptographic signatures granting short-lived access."
      }
    ]
  },
  {
    "id": "cloud-databases",
    "slug": "cloud-databases-rds-aurora-dynamodb-cosmos",
    "pillarId": "cloud",
    "branch": "right",
    "order": 4,
    "title": "Cloud Databases (SQL & NoSQL)",
    "subtitle": "Managed SQL (RDS, Aurora), NoSQL (DynamoDB, Cosmos DB), read replicas, and Multi-AZ failover",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "Databases",
      "RDS",
      "Aurora",
      "DynamoDB",
      "CosmosDB",
      "NoSQL"
    ],
    "summary": "Architect resilient data layers using managed relational engines (AWS Aurora / RDS) and serverless distributed NoSQL databases (DynamoDB / Cosmos DB).",
    "overview": "Operating production database clusters manually involves backups, OS patching, replication lag, and failover management. Cloud managed databases automate these operations.\n\nKey Offerings:\n1. Managed Relational Databases (AWS RDS / Azure Database):\n   - Engines: PostgreSQL, MySQL, MariaDB.\n   - Multi-AZ Deployment: Synchronous replication to a standby instance in an adjacent Availability Zone with automated DNS failover in <60 seconds.\n   - Read Replicas: Asynchronous read-only nodes to scale query throughput.\n2. Cloud-Native Relational (Amazon Aurora):\n   - Custom distributed storage subsystem replicating 6 copies across 3 AZs.\n   - 5x throughput of standard MySQL and up to 15 read replicas with near-zero lag.\n3. Managed NoSQL (Amazon DynamoDB / Azure Cosmos DB):\n   - Key-value and document store delivering consistent single-digit millisecond latency at any scale.\n   - Partition Keys & Sort Keys: Dictate data distribution across SSD storage clusters.\n   - Serverless On-Demand vs Provisioned Capacity.",
    "keyConcepts": [
      {
        "title": "Multi-AZ vs Read Replicas",
        "explanation": "Multi-AZ provides High Availability (synchronous standby for disaster failover). Read Replicas provide Performance Scaling (asynchronous replicas serving read-heavy web traffic)."
      },
      {
        "title": "DynamoDB Partition Key Design",
        "explanation": "Partition keys determine which physical partition holds the record. A key with uniform cardinality prevents 'hot partitions' and throttling."
      }
    ],
    "diagram": {
      "title": "AWS RDS Multi-AZ & Read Replica Topology",
      "type": "ascii",
      "code": "Write Queries (INSERT, UPDATE)                 Read Queries (SELECT)\n            |                                             |\n            v                                             v\n[Primary DB Instance] (AZ-A) ===(Sync)===> [Standby DB Instance] (AZ-B)\n            |                                 (Automated Failover Only)\n            |\n            +---(Async Replication)---> [Read Replica 1] (AZ-A)\n            |\n            `---(Async Replication)---> [Read Replica 2] (AZ-C)"
    },
    "commands": [
      {
        "cmd": "aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus,Engine]' --output table",
        "desc": "List all cloud database instances and their operational health",
        "example": "aws rds describe-db-instances"
      },
      {
        "cmd": "aws dynamodb describe-table --table-name Users --query 'Table.[ItemCount,TableSizeBytes,TableStatus]'",
        "desc": "Inspect DynamoDB item count and storage size",
        "example": "aws dynamodb describe-table ..."
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "aurora-postgresql.tf",
      "code": "# Production Terraform snippet for highly available Amazon Aurora PostgreSQL\nresource \"aws_rds_cluster\" \"aurora\" {\n  cluster_identifier      = \"prod-aurora-cluster\"\n  engine                  = \"aurora-postgresql\"\n  engine_version          = \"16.2\"\n  database_name           = \"app_production\"\n  master_username         = \"dbadmin\"\n  manage_master_user_password = true # Auto-managed in AWS Secrets Manager\n\n  backup_retention_period = 30\n  preferred_backup_window = \"02:00-03:00\"\n  storage_encrypted       = true\n  deletion_protection     = true\n  skip_final_snapshot     = false\n\n  vpc_security_group_ids = [aws_security_group.db_sg.id]\n  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name\n}\n\nresource \"aws_rds_cluster_instance\" \"instances\" {\n  count              = 2 # 1 Primary + 1 Aurora Replica for HA\n  identifier         = \"prod-aurora-instance-${count.index}\"\n  cluster_identifier = aws_rds_cluster.aurora.id\n  instance_class     = \"db.r6g.large\"\n  engine             = aws_rds_cluster.aurora.engine\n  engine_version     = aws_rds_cluster.aurora.engine_version\n}",
      "explanation": "Deploys an Amazon Aurora PostgreSQL cluster with automated Secrets Manager password rotation and multi-instance failover."
    },
    "gotchas": [
      {
        "issue": "Disabling deletion_protection on production databases",
        "resolution": "Accidental `terraform destroy` runs can destroy primary databases in minutes. Always enforce `deletion_protection = true` on all stateful cloud database resources.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between synchronous and asynchronous replication in database failover?",
        "answer": "Synchronous replication guarantees that a transaction is written and acknowledged to the standby instance before the primary reports success, ensuring zero data loss (RPO = 0) at the cost of minor write latency. Asynchronous replication acknowledges the primary immediately and replicates in the background, which can result in data loss during an abrupt failover.",
        "platformContext": "Critical database concept evaluated across RPO/RTO disaster recovery design."
      }
    ],
    "references": [
      {
        "title": "Amazon Aurora Architecture Paper",
        "url": "https://www.allthingsdistributed.com/2019/03/amazon-aurora-design-cloud-native-relational-database.html",
        "source": "Werner Vogels",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary benefit of deploying AWS RDS in a Multi-AZ configuration?",
        "options": [
          "High availability with automatic synchronous failover",
          "Scaling write query performance 5x",
          "Reducing storage pricing",
          "Enabling public internet access"
        ],
        "answerIndex": 0,
        "explanation": "Multi-AZ maintains a synchronous standby replica in an adjacent datacenter for automated disaster recovery."
      }
    ]
  },
  {
    "id": "cloud-fundamentals",
    "slug": "cloud-fundamentals-iaas-paas-saas-hyperscalers",
    "pillarId": "cloud",
    "branch": "left",
    "order": 5,
    "title": "Cloud Fundamentals (IaaS vs PaaS vs SaaS)",
    "subtitle": "Service models, Shared Responsibility Model, Big 3 Hyperscalers, and Global Infrastructure",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "IaaS",
      "PaaS",
      "SaaS",
      "Hyperscalers",
      "AWS",
      "Azure",
      "GCP"
    ],
    "summary": "Understand cloud computing paradigms, the Shared Responsibility Model, and the global infrastructure of AWS, Azure, and Google Cloud.",
    "overview": "Cloud computing delivers on-demand compute, storage, networking, and application services over the internet with pay-as-you-go pricing.\n\nService Models:\n1. Infrastructure as a Service (IaaS):\n   - Cloud provider manages physical hardware, datacenters, virtualization, and networking.\n   - You manage the OS, security patches, networking configuration, middleware, and application code (e.g. AWS EC2, Azure VMs, Google Compute Engine).\n2. Platform as a Service (PaaS):\n   - Cloud provider manages the OS, runtime environment, middleware, and automatic scaling.\n   - You manage only application code and data (e.g. AWS Elastic Beanstalk, Heroku, Azure App Service, Google App Engine).\n3. Software as a Service (SaaS):\n   - Complete finished product managed entirely by the vendor (e.g. Google Workspace, Microsoft 365, Datadog).\n\nShared Responsibility Model:\n- Security OF the Cloud: Provider responsibility (physical facilities, hypervisors, hardware).\n- Security IN the Cloud: Customer responsibility (IAM policies, OS patches on IaaS, encryption keys, firewall rules).",
    "keyConcepts": [
      {
        "title": "Regions and Availability Zones (AZs)",
        "explanation": "A Region is a geographic area containing 3+ physically isolated datacenters called Availability Zones (AZs) connected by redundant low-latency fiber (<1ms)."
      },
      {
        "title": "Shared Responsibility Model",
        "explanation": "The boundary shifts depending on service model. Moving from IaaS to PaaS delegates OS hardening and runtime patching to the cloud provider."
      }
    ],
    "diagram": {
      "title": "Shared Responsibility Model Spectrum",
      "type": "ascii",
      "code": "Layer               On-Premises         IaaS (EC2)          PaaS (App Service)   SaaS (Datadog)\nApplication         [CUSTOMER]          [CUSTOMER]          [CUSTOMER]           [PROVIDER]\nData & Access       [CUSTOMER]          [CUSTOMER]          [CUSTOMER]           [PROVIDER]\nRuntime & OS        [CUSTOMER]          [CUSTOMER]          [PROVIDER]           [PROVIDER]\nVirtualization      [CUSTOMER]          [PROVIDER]          [PROVIDER]           [PROVIDER]\nPhysical Hardware   [CUSTOMER]          [PROVIDER]          [PROVIDER]           [PROVIDER]"
    },
    "commands": [
      {
        "cmd": "aws ec2 describe-regions --output table",
        "desc": "List all active AWS geographic regions",
        "example": "aws ec2 describe-regions"
      },
      {
        "cmd": "az account list-locations --output table",
        "desc": "List all active Microsoft Azure datacenter regions",
        "example": "az account list-locations"
      }
    ],
    "productionCode": {
      "language": "bash",
      "filename": "verify-cloud-region.sh",
      "code": "#!/usr/bin/env bash\n# Query instance metadata service (IMDSv2) to determine host AZ and instance type\nset -euo pipefail\n\necho \"Fetching AWS IMDSv2 session token...\"\nTOKEN=$(curl -s -X PUT \"http://169.254.169.254/latest/api/token\" \\\n  -H \"X-aws-ec2-metadata-token-ttl-seconds: 60\")\n\nAZ=$(curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" \\\n  http://169.254.169.254/latest/meta-data/placement/availability-zone)\nINSTANCE_ID=$(curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" \\\n  http://169.254.169.254/latest/meta-data/instance-id)\nINSTANCE_TYPE=$(curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" \\\n  http://169.254.169.254/latest/meta-data/instance-type)\n\necho \"Instance ID   : ${INSTANCE_ID}\"\necho \"Instance Type : ${INSTANCE_TYPE}\"\necho \"AZ Placement  : ${AZ}\"",
      "explanation": "Securely queries AWS IMDSv2 to inspect the instance's physical availability zone and compute type."
    },
    "gotchas": [
      {
        "issue": "Assuming cloud provider backs up your data automatically in IaaS",
        "resolution": "In IaaS (EC2/EBS), the cloud provider guarantees physical drive durability but does NOT take backups of your filesystem. You must configure AWS Backup or automated EBS snapshots.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between an Availability Zone and a Region in AWS?",
        "answer": "A Region is a distinct geographic location in the world (e.g. us-east-1). Each Region consists of multiple (typically 3 or more) physically separated, isolated datacenters called Availability Zones (AZs) connected by ultra-low-latency private networking.",
        "platformContext": "The most fundamental foundational question across all cloud certifications."
      }
    ],
    "references": [
      {
        "title": "AWS Well-Architected Framework",
        "url": "https://aws.amazon.com/architecture/well-architected/",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "In the AWS Shared Responsibility Model for EC2 instances, who is responsible for applying operating system security patches?",
        "options": [
          "The Customer",
          "AWS",
          "Operating system vendor",
          "Hardware manufacturer"
        ],
        "answerIndex": 0,
        "explanation": "For IaaS (EC2), the customer is responsible for guest OS patching and software updates."
      }
    ]
  },
  {
    "id": "cloud-networking",
    "slug": "cloud-networking-vpc-subnets-hybrid-multicloud",
    "pillarId": "cloud",
    "branch": "left",
    "order": 6,
    "title": "Cloud Networking (VPC, Hybrid & Multi-Cloud)",
    "subtitle": "Virtual Private Clouds, route tables, peering, Transit Gateway, Direct Connect, and VPN",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "VPC",
      "Transit Gateway",
      "Direct Connect",
      "VPC Peering",
      "Hybrid Cloud"
    ],
    "summary": "Design scalable enterprise cloud network architectures connecting multi-VPC topologies, Kubernetes clusters, on-premises datacenters, and multi-cloud environments.",
    "overview": "Cloud networking provides private, isolated software-defined networks (SDN) for enterprise infrastructure.\n\nKey Concepts:\n1. Virtual Private Cloud (VPC / VNet):\n   - Dedicated private network space defined by a CIDR block (e.g. `10.0.0.0/16`).\n   - Spans all Availability Zones in a region.\n2. Subnets & Route Tables:\n   - Public Subnets: Route table sends `0.0.0.0/0` to an Internet Gateway (IGW).\n   - Private Subnets: Route table sends `0.0.0.0/0` to a NAT Gateway or egress firewall.\n3. Inter-VPC Connectivity:\n   - VPC Peering: Non-transitive 1-to-1 connection between two VPCs.\n   - AWS Transit Gateway (TGW) / Azure Virtual WAN: Centralized hub-and-spoke router connecting hundreds of VPCs and on-premises networks.\n4. Hybrid Cloud Connectivity:\n   - Site-to-Site VPN: IPsec encrypted tunnel over public internet.\n   - AWS Direct Connect / Azure ExpressRoute: Dedicated physical fiber line bypassing the internet for predictable gigabit throughput and low latency.",
    "keyConcepts": [
      {
        "title": "Non-Transitive VPC Peering",
        "explanation": "If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A CANNOT communicate with VPC C through B. To connect multiple VPCs transitively, deploy a Transit Gateway."
      },
      {
        "title": "VPC Endpoints & PrivateLink",
        "explanation": "Allows instances in private subnets to talk to cloud services (S3, ECR, DynamoDB) over the cloud provider's internal private network backbone without traversing the public internet."
      }
    ],
    "diagram": {
      "title": "Hub-and-Spoke Transit Gateway Topology",
      "type": "ascii",
      "code": "      [Corporate Datacenter] (Direct Connect / IPsec VPN)\n                             |\n                             v\n              [AWS Transit Gateway (TGW)] (Hub)\n                             |\n      +----------------------+----------------------+\n      |                      |                      |\n      v                      v                      v\n[Prod VPC (10.1.0.0/16)] [Stage VPC (10.2.0.0/16)] [Shared Services VPC]\n- EKS Cluster            - Dev Applications         - CI/CD Runners, Vault"
    },
    "commands": [
      {
        "cmd": "aws ec2 describe-vpcs --output table",
        "desc": "Inspect all VPCs and their allocated CIDR blocks",
        "example": "aws ec2 describe-vpcs"
      },
      {
        "cmd": "aws ec2 describe-route-tables --query 'RouteTables[*].[RouteTableId,VpcId,Routes]' --output json",
        "desc": "Inspect route table destination targets",
        "example": "aws ec2 describe-route-tables"
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "vpc-multi-az.tf",
      "code": "# Production multi-AZ VPC module in Terraform\nmodule \"vpc\" {\n  source  = \"terraform-aws-modules/vpc/aws\"\n  version = \"~> 5.0\"\n\n  name = \"production-vpc\"\n  cidr = \"10.0.0.0/16\"\n\n  azs             = [\"us-east-1a\", \"us-east-1b\", \"us-east-1c\"]\n  private_subnets = [\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.3.0/24\"]\n  public_subnets  = [\"10.0.101.0/24\", \"10.0.102.0/24\", \"10.0.103.0/24\"]\n  database_subnets= [\"10.0.201.0/24\", \"10.0.202.0/24\", \"10.0.203.0/24\"]\n\n  enable_nat_gateway     = true\n  single_nat_gateway     = false # High Availability: 1 NAT GW per AZ\n  enable_dns_hostnames   = true\n  enable_dns_support     = true\n\n  tags = {\n    Environment = \"production\"\n    Terraform   = \"true\"\n  }\n}",
      "explanation": "Provisions an enterprise production VPC across 3 Availability Zones with independent NAT Gateways per AZ for fault tolerance."
    },
    "gotchas": [
      {
        "issue": "Using a single NAT Gateway across all Availability Zones",
        "resolution": "Deploying `single_nat_gateway = true` creates a single point of failure. If the AZ hosting the lone NAT Gateway suffers an outage, all private subnets across all AZs lose outbound internet connectivity.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between an Internet Gateway and a NAT Gateway in AWS?",
        "answer": "An Internet Gateway (IGW) provides bidirectional communication (inbound and outbound) between instances with public IPs in a public subnet and the internet. A NAT Gateway provides strictly outbound internet access for instances with private IPs in private subnets, while blocking unsolicited inbound connections from the internet.",
        "platformContext": "A classic networking architecture screening question."
      }
    ],
    "references": [
      {
        "title": "AWS VPC Architecture Guide",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Why is VPC peering non-transitive?",
        "options": [
          "Traffic cannot hop through an intermediate VPC to reach a third VPC",
          "It only allows UDP packets",
          "It requires public IP addresses",
          "It only operates within a single availability zone"
        ],
        "answerIndex": 0,
        "explanation": "VPC peering does not support edge-to-edge routing across chained peering connections."
      }
    ]
  },
  {
    "id": "cloud-compute",
    "slug": "cloud-compute-virtual-machines-load-balancers-autoscaling",
    "pillarId": "cloud",
    "branch": "left",
    "order": 7,
    "title": "Cloud Compute & Auto Scaling",
    "subtitle": "Virtual Machines (EC2), Load Balancers (ALB/NLB), Auto Scaling Groups (ASG), and PaaS",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "EC2",
      "Auto Scaling",
      "ALB",
      "NLB",
      "Compute",
      "Cloud"
    ],
    "summary": "Provision scalable compute capacity, configure dynamic Auto Scaling Groups responding to metrics, and distribute traffic using Application & Network Load Balancers.",
    "overview": "Compute is the engine of the cloud, providing processing power for applications.\n\nKey Components:\n1. Virtual Machines (AWS EC2 / Azure VM):\n   - Family types: General Purpose (m6i/t4g), Compute Optimized (c6i), Memory Optimized (r6i), GPU (g5).\n   - Purchasing Options: On-Demand (pay-per-hour, flexible), Reserved / Savings Plans (1-3 yr commitment, 70% discount), Spot Instances (spare capacity up to 90% discount, subject to 2-minute interruption notice).\n2. Cloud Load Balancers:\n   - Application Load Balancer (ALB): Layer 7 HTTP/HTTPS reverse proxy with path-based routing, host headers, and SSL termination.\n   - Network Load Balancer (NLB): Layer 4 TCP/UDP load balancer delivering millions of requests per second with ultra-low latency and static IPs.\n3. Auto Scaling Groups (ASG):\n   - Dynamically scales instances in/out based on CloudWatch metrics (CPU %, SQS queue depth, request count per target).\n   - Integrates with Launch Templates defining AMI, user-data startup scripts, and security groups.",
    "keyConcepts": [
      {
        "title": "Spot Instances in Production",
        "explanation": "Spot instances offer massive cost savings (up to 90%). Ideal for stateless Kubernetes worker nodes, CI runners, and batch processing when paired with Graceful Termination handlers."
      },
      {
        "title": "Launch Templates vs Legacy Launch Configs",
        "explanation": "Launch Templates support versioning, mixed instance policies (combining Spot and On-Demand across diverse instance families), and modern IMDSv2 configuration."
      }
    ],
    "diagram": {
      "title": "Auto Scaling Group with Application Load Balancer",
      "type": "ascii",
      "code": "External Users ===(HTTPS: 443)===> [Application Load Balancer (ALB)]\n                                                  |\n                               +------------------+------------------+\n                               | (Health Check OK)                   | (Health Check OK)\n                               v                                     v\n             [EC2 Instance 1 (AZ-A)]               [EC2 Instance 2 (AZ-B)]\n             \\___________________________________________________________/\n                                           |\n                         [Auto Scaling Group (ASG)]\n                         (Monitors CPU: Adds instance if > 70%)"
    },
    "commands": [
      {
        "cmd": "aws ec2 describe-instances --filters \"Name=instance-state-name,Values=running\" --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,PrivateIpAddress]' --output table",
        "desc": "List running EC2 instances with private IPs",
        "example": "aws ec2 describe-instances"
      },
      {
        "cmd": "aws autoscaling set-desired-capacity --auto-scaling-group-name prod-asg --desired-capacity 5",
        "desc": "Manually scale an Auto Scaling Group's desired capacity",
        "example": "aws autoscaling ..."
      }
    ],
    "productionCode": {
      "language": "hcl",
      "filename": "asg-mixed-instances.tf",
      "code": "# Production Auto Scaling Group combining Spot and On-Demand instances for high availability and low cost\nresource \"aws_autoscaling_group\" \"app_asg\" {\n  name                = \"production-app-asg\"\n  vpc_zone_identifier = [\"subnet-123\", \"subnet-456\", \"subnet-789\"]\n  target_group_arns   = [aws_lb_target_group.app_tg.arn]\n  health_check_type   = \"ELB\"\n  health_check_grace_period = 300\n\n  min_size     = 2\n  max_size     = 10\n  desired_capacity = 3\n\n  mixed_instances_policy {\n    instances_distribution {\n      on_demand_base_capacity                  = 1 # Always guarantee 1 on-demand instance\n      on_demand_percentage_above_base_capacity = 20 # 80% Spot for cost efficiency\n      spot_allocation_strategy                 = \"price-capacity-optimized\"\n    }\n    launch_template {\n      launch_template_specification {\n        launch_template_id = aws_launch_template.app_template.id\n        version            = \"$Latest\"\n      }\n    }\n  }\n}",
      "explanation": "Configures an ASG utilizing a mixed instances policy that combines On-Demand base capacity with cost-effective Spot instances."
    },
    "gotchas": [
      {
        "issue": "Setting ASG health_check_type to EC2 instead of ELB",
        "resolution": "If `health_check_type` is left as `EC2`, the ASG only replaces an instance if the hypervisor crashes. If your application process dies or returns 500 errors, the instance remains in rotation. Always set `health_check_type = \"ELB\"`.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between an AWS ALB and an NLB?",
        "answer": "An Application Load Balancer (ALB) operates at Layer 7, terminating TLS and supporting path-based routing, HTTP/2, and host-based rules. A Network Load Balancer (NLB) operates at Layer 4, handling raw TCP/UDP streams with static IPs and delivering millions of requests per second with microsecond latency.",
        "platformContext": "Fundamental design decision when architecting Kubernetes ingresses and microservices."
      }
    ],
    "references": [
      {
        "title": "AWS EC2 Auto Scaling User Guide",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "How much warning notice does AWS provide via instance metadata before terminating an EC2 Spot Instance?",
        "options": [
          "2 minutes",
          "15 minutes",
          "1 hour",
          "Zero warning"
        ],
        "answerIndex": 0,
        "explanation": "AWS provides a 2-minute warning notice via IMDS before terminating a reclaimed Spot Instance."
      }
    ]
  },
  {
    "id": "cloud-iam",
    "slug": "identity-access-management-iam-roles-least-privilege",
    "pillarId": "cloud",
    "branch": "left",
    "order": 8,
    "title": "Identity & Access Management (IAM)",
    "subtitle": "Users, Groups, Roles, JSON policies, Least Privilege, and Workload Identities (IRSA)",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "IAM",
      "Security",
      "Roles",
      "Least Privilege",
      "IRSA",
      "Cloud Security"
    ],
    "summary": "Control authentication and authorization across cloud resources using fine-grained JSON policies, temporary credentials via AssumeRole, and IAM Roles for Service Accounts (IRSA).",
    "overview": "IAM is the security backbone of all cloud platforms. Every API call in AWS, Azure, or GCP is cryptographically evaluated against IAM policies.\n\nCore IAM Primitives:\n1. Principals: Users (humans), Groups, and Roles (assumable identities for machines/services).\n2. Policies: JSON documents defining `Effect` (Allow or Deny), `Action` (e.g. `s3:GetObject`), `Resource` (ARN target), and optional `Condition` blocks.\n3. Evaluation Logic:\n   - Default Deny -> Any Explicit Deny overrides all allows -> Explicit Allow grants access.\n4. IAM Roles & Temporary Credentials:\n   - Never hardcode static Access Keys (`AKIA...`) in configuration files. Machines assume IAM Roles via the STS (Security Token Service) to obtain short-lived credentials that rotate automatically.\n5. IAM Roles for Service Accounts (IRSA):\n   - Associates an AWS IAM role with a specific Kubernetes ServiceAccount via OIDC, allowing individual pods to query AWS APIs without granting permissions to the entire worker node.",
    "keyConcepts": [
      {
        "title": "The Golden Rule: Never Store Static Cloud Credentials",
        "explanation": "EC2 instances use Instance Profiles; Kubernetes pods use IRSA; GitHub Actions uses OIDC. Static access keys represent the #1 cause of cloud compromise and crypto-mining breaches."
      },
      {
        "title": "Explicit Deny Overrides All",
        "explanation": "If a policy grants `s3:*` but another policy (like a Service Control Policy or boundary) has an explicit `Deny`, the request is rejected immediately."
      }
    ],
    "diagram": {
      "title": "Kubernetes IRSA (IAM Roles for Service Accounts) Flow",
      "type": "ascii",
      "code": "[Kubernetes Pod (ServiceAccount: s3-reader)]\n                     |\n                     v (Presents projected OIDC token)\n[AWS Security Token Service (STS: AssumeRoleWithWebIdentity)]\n                     |\n                     v (Validates EKS OIDC Issuer signature)\n[Issues Temporary Scoped AWS Credentials (1 hour)]\n                     |\n                     v\n[Pod accesses S3 Bucket: company-data securely!]"
    },
    "commands": [
      {
        "cmd": "aws sts get-caller-identity",
        "desc": "Print currently assumed IAM identity ARN, account ID, and user ID",
        "example": "aws sts get-caller-identity"
      },
      {
        "cmd": "aws iam list-attached-user-policies --user-name deployer",
        "desc": "List IAM policies attached to specific user",
        "example": "aws iam list-attached-user-policies ..."
      }
    ],
    "productionCode": {
      "language": "json",
      "filename": "least-privilege-s3-policy.json",
      "code": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"AllowReadOnlyToSpecificBucket\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObject\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": [\n        \"arn:aws:s3:::production-app-artifacts\",\n        \"arn:aws:s3:::production-app-artifacts/*\"\n      ],\n      \"Condition\": {\n        \"Bool\": {\n          \"aws:SecureTransport\": \"true\"\n        }\n      }\n    }\n  ]\n}",
      "explanation": "Production least-privilege IAM policy granting read-only access to a specific bucket while enforcing HTTPS transmission."
    },
    "gotchas": [
      {
        "issue": "Granting IAM policies directly to worker nodes instead of pods",
        "resolution": "If you attach an S3 admin policy to an EC2 node instance profile, EVERY pod running on that worker node inherits S3 admin access via the metadata endpoint. Always use IRSA or Azure Workload Identity to isolate credentials per pod.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How does AWS evaluate an IAM policy when both an Allow and a Deny statement match?",
        "answer": "An explicit Deny always trumps an Allow. If a policy has an explicit Allow for `s3:*` but any attached policy (identity policy, resource policy, or Service Control Policy) contains an explicit Deny, the request is definitively denied.",
        "platformContext": "Fundamental cloud security question."
      }
    ],
    "references": [
      {
        "title": "AWS IAM Policy Evaluation Logic",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "source": "AWS",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which technology allows specific Kubernetes pods to securely assume AWS IAM roles using temporary tokens without granting permissions to the host node?",
        "options": [
          "IAM Roles for Service Accounts (IRSA)",
          "Static API Keys",
          "Bastion Proxy",
          "Kubelet Secret Manager"
        ],
        "answerIndex": 0,
        "explanation": "IRSA leverages OIDC federation between EKS and AWS STS to grant temporary IAM credentials per pod."
      }
    ]
  }
];
