import { TopicItem } from '@/types';

export const OBSERVABILITY_TOPICS: TopicItem[] = [
  {
    "id": "obs-apm-solutions",
    "slug": "apm-solutions-open-source-prometheus-grafana-vs-datadog",
    "pillarId": "observability",
    "branch": "right",
    "order": 1,
    "title": "APM Solutions: Open Source Stack vs SaaS",
    "subtitle": "Open Source (Prometheus, Grafana, VictoriaMetrics, ELK/Loki) vs SaaS (Datadog, Dynatrace)",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "APM",
      "Prometheus",
      "Grafana",
      "Datadog",
      "Dynatrace",
      "Observability"
    ],
    "summary": "Evaluate Application Performance Monitoring (APM) ecosystems: compare self-hosted open-source telemetry stacks (LGTM: Loki, Grafana, Tempo, Mimir) against fully managed SaaS platforms (Datadog, Dynatrace).",
    "overview": "APM solutions ingest, index, query, and visualize telemetry signals across distributed systems.\n\nTwo Competing Paradigms:\n1. Open Source Telemetry Stack (LGTM / Prometheus):\n   - Metrics: Prometheus (pull model scraping `/metrics`), Thanos or Mimir (long-term multi-tenant retention), VictoriaMetrics.\n   - Dashboards: Grafana (the universal visualization dashboard).\n   - Logs: Grafana Loki (indexes labels, not full text, drastically cutting storage costs) or ELK/OpenSearch.\n   - Traces: Grafana Tempo or Jaeger.\n   - Advantages: Zero vendor lock-in, open standards, full data sovereignty, significant cost savings at massive petabyte scale.\n   - Trade-off: Operational maintenance (managing storage, backups, high availability).\n2. Commercial SaaS Solutions (Datadog, Dynatrace, New Relic):\n   - Single unified agent installed on hosts.\n   - Turnkey automated dashboards, anomaly detection, AI root-cause analysis, and enterprise integrations.\n   - Advantages: Zero maintenance overhead, fast time-to-value.\n   - Trade-off: High, unpredictable usage-based pricing at scale.",
    "keyConcepts": [
      {
        "title": "Prometheus Pull Model",
        "explanation": "Prometheus periodically queries (scrapes) HTTP endpoints (e.g. `http://pod:8080/metrics`). This pull architecture allows Prometheus to detect dead nodes automatically if scrapes time out."
      },
      {
        "title": "High Cardinality Cost Impact",
        "explanation": "In both Datadog and Prometheus, attaching unbounded labels (like user IDs or UUIDs) causes metric series cardinality to explode, consuming massive RAM or ballooning SaaS bills."
      }
    ],
    "diagram": {
      "title": "Open Source Observability Stack (LGTM)",
      "type": "ascii",
      "code": "                [Kubernetes Worker Nodes & Microservices]\n                                    |\n     +------------------------------+-----------------------------+\n     | (Metrics)                    | (Logs)                      | (Traces)\n     v                              v                             v\n[Prometheus / Mimir]         [Grafana Loki]                [Grafana Tempo]\n(Scrapes /metrics)          (Fluent Bit / Promtail)       (OpenTelemetry OTLP)\n     \\                              |                             /\n      \\_____________________________|____________________________/\n                                    |\n                                    v\n                         [Grafana Dashboard UI]\n                     (Single Pane of Glass Glassware)"
    },
    "commands": [
      {
        "cmd": "curl -s http://localhost:9090/-/healthy",
        "desc": "Check Prometheus server health status",
        "example": "curl -s http://localhost:9090/-/healthy"
      },
      {
        "cmd": "promtool check config prometheus.yml",
        "desc": "Validate Prometheus configuration file syntax",
        "example": "promtool check config ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "prometheus.yml",
      "code": "# Production Prometheus configuration with Kubernetes service discovery & scrape intervals\nglobal:\n  scrape_interval: 15s\n  evaluation_interval: 15s\n  scrape_timeout: 10s\n\nrule_files:\n  - \"/etc/prometheus/alerts/*.yml\"\n\nalerting:\n  alertmanagers:\n    - static_configs:\n        - targets: ['alertmanager:9093']\n\nscrape_configs:\n  - job_name: 'kubernetes-pods'\n    kubernetes_sd_configs:\n      - role: pod\n    relabel_configs:\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]\n        action: keep\n        regex: true\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]\n        action: replace\n        target_label: __metrics_path__\n        regex: (.+)",
      "explanation": "Production Prometheus configuration dynamically discovering Kubernetes pods with `prometheus.io/scrape: true` annotations."
    },
    "gotchas": [
      {
        "issue": "Cardinality explosion in Prometheus metrics",
        "resolution": "Adding high-cardinality labels (like `user_id` or `order_uuid`) to metric tags generates millions of distinct time series, crashing Prometheus with out-of-memory errors. Store high-cardinality attributes in Logs or Traces, never in Metrics.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is high cardinality in metrics and why is it dangerous for Prometheus?",
        "answer": "Cardinality refers to the number of unique combinations of label key-value pairs for a given metric. High cardinality occurs when labels with millions of unique values (like user IDs or transaction IDs) are added. Prometheus creates a separate in-memory time series for each combination, leading to rapid RAM exhaustion and OOM crashes.",
        "platformContext": "Standard SRE interview question."
      }
    ],
    "references": [
      {
        "title": "Prometheus Official Overview",
        "url": "https://prometheus.io/docs/introduction/overview/",
        "source": "Prometheus",
        "type": "official"
      },
      {
        "title": "Grafana Observability Stack",
        "url": "https://grafana.com/",
        "source": "Grafana",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which component in the Grafana ecosystem specifically indexes metadata labels instead of full-text message bodies to drastically lower log storage costs?",
        "options": [
          "Grafana Loki",
          "Prometheus",
          "Grafana Tempo",
          "Grafana Mimir"
        ],
        "answerIndex": 0,
        "explanation": "Grafana Loki indexes only stream labels (like Prometheus), keeping log storage lean and cost-effective."
      }
    ]
  },
  {
    "id": "obs-structured-logging",
    "slug": "structured-logging-json-context-fluentbit-vector",
    "pillarId": "observability",
    "branch": "right",
    "order": 2,
    "title": "Structured Logging",
    "subtitle": "JSON formatted logs, contextual fields, log aggregation pipelines (Fluent Bit, Vector), and log levels",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Logging",
      "JSON Logs",
      "Fluent Bit",
      "Vector",
      "Log Aggregation"
    ],
    "summary": "Transform unstructured text logs into queryable JSON objects: inject contextual trace IDs, standardize log severity levels, and route logs with high-performance collectors.",
    "overview": "Traditional plaintext logs (`[INFO] User logged in: 123`) require brittle regex parsers to query. Structured logging emits logs as structured JSON objects.\n\nCore Principles:\n1. Standard JSON Schema:\n   - Every log message is a single-line JSON string containing consistent fields: `timestamp`, `level` (DEBUG, INFO, WARN, ERROR), `service`, `message`, `trace_id`, `span_id`.\n2. Contextual Attributes:\n   - Include domain attributes: `customer_id`, `http_status`, `duration_ms`.\n3. The 12-Factor App Logging Standard:\n   - Applications must NEVER manage log files directly or configure logrotation in application code. Applications stream JSON to `stdout` and `stderr`. The platform runtime captures and routes streams.\n4. Log Shipping Agents (Fluent Bit / Vector):\n   - Lightweight C or Rust daemon reading node container logs from `/var/log/pods/`, parsing JSON, and shipping them to Loki, Elasticsearch, or S3.",
    "keyConcepts": [
      {
        "title": "Correlation IDs & Trace IDs in Logs",
        "explanation": "Injecting the distributed `trace_id` into every log statement bridges logging with distributed tracing. In Grafana, clicking a log statement instantly opens the corresponding distributed trace."
      },
      {
        "title": "Stdout/Stderr Container Streaming",
        "explanation": "Writing logs to local disk files inside containers causes container storage to fill up. Always stream to `stdout` so the container runtime can manage log rotation."
      }
    ],
    "diagram": {
      "title": "Structured Log Ingestion Pipeline",
      "type": "ascii",
      "code": "[Microservice Container]\n       |\n  (Writes JSON to stdout: {\"level\":\"info\", \"trace_id\":\"abc...\"})\n       v\n[Kubelet writes to /var/log/pods/]\n       |\n       v\n[Node Daemon: Fluent Bit / Vector (Rust)]\n       |\n       +---> Parses JSON & Enriches with Pod Labels\n       |\n       v (Batched & Compressed)\n[Centralized Storage: Grafana Loki / Elasticsearch]"
    },
    "commands": [
      {
        "cmd": "fluent-bit -c /etc/fluent-bit/fluent-bit.conf --dry-run",
        "desc": "Verify Fluent Bit log shipping configuration",
        "example": "fluent-bit -c ..."
      },
      {
        "cmd": "vector validate /etc/vector/vector.yaml",
        "desc": "Validate Vector log pipeline syntax",
        "example": "vector validate ..."
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "structured_logger.py",
      "code": "# Production Python structured JSON logger emitting to stdout with trace correlation\nimport json\nimport logging\nimport sys\nfrom datetime import datetime, timezone\n\nclass JSONFormatter(logging.Formatter):\n    def format(self, record):\n        log_entry = {\n            \"timestamp\": datetime.now(timezone.utc).isoformat(),\n            \"level\": record.levelname,\n            \"service\": \"order-api\",\n            \"message\": record.getMessage(),\n            \"logger\": record.name,\n            \"trace_id\": getattr(record, \"trace_id\", \"none\"),\n            \"span_id\": getattr(record, \"span_id\", \"none\"),\n        }\n        if record.exc_info:\n            log_entry[\"exception\"] = self.formatException(record.exc_info)\n        return json.dumps(log_entry)\n\n# Configure root logger to output to stdout\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(JSONFormatter())\nlogger = logging.getLogger(\"app\")\nlogger.setLevel(logging.INFO)\nlogger.addHandler(handler)\n\n# Example usage\nlogger.info(\"Order processed successfully\", extra={\"trace_id\": \"4bf92f3577b34da6a3ce929d0e0e4736\"})",
      "explanation": "Structured JSON logging formatter embedding UTC ISO-8601 timestamps and distributed trace correlation IDs."
    },
    "gotchas": [
      {
        "issue": "Multi-line stack traces split into separate log entries",
        "resolution": "If an application prints stack traces across multiple lines, standard container log collectors treat each line as a distinct log event, scrambling the trace. Format exceptions inside a single JSON string or configure multi-line parsing in Fluent Bit.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "Why should containerized microservices always log to stdout/stderr instead of writing to local log files?",
        "answer": "Following Factor XI of the Twelve-Factor App, applications should treat logs as event streams. Logging to stdout decouples the app from storage mechanics. The platform runtime (Docker/containerd) automatically buffers, rotates, and allows lightweight agents (Fluent Bit) to harvest and ship logs without consuming container disk space.",
        "platformContext": "Standard cloud-native logging best practice."
      }
    ],
    "references": [
      {
        "title": "The Twelve-Factor App: XI. Logs",
        "url": "https://12factor.net/logs",
        "source": "12factor.net",
        "type": "spec"
      },
      {
        "title": "Fluent Bit Documentation",
        "url": "https://docs.fluentbit.io/manual/",
        "source": "Fluent Bit",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary advantage of structured JSON logging over plaintext logs?",
        "options": [
          "It can be indexed, filtered, and aggregated programmatically without brittle regex parsing",
          "It takes up zero disk space",
          "It runs faster than plain text writes",
          "It prevents network latency"
        ],
        "answerIndex": 0,
        "explanation": "Structured JSON enables database-like queries and aggregations across discrete attributes without complex regexes."
      }
    ]
  },
  {
    "id": "obs-alerting-best-practices",
    "slug": "alerting-best-practices-actionable-alerts-runbooks",
    "pillarId": "observability",
    "branch": "right",
    "order": 3,
    "title": "Alerting: Best Practices",
    "subtitle": "Actionable alerts, symptom-based alerting, runbook attachments, and eliminating alert fatigue",
    "level": "Intermediate",
    "estimatedMinutes": 20,
    "tags": [
      "Alerting",
      "Alertmanager",
      "PagerDuty",
      "SRE",
      "Alert Fatigue",
      "Runbooks"
    ],
    "summary": "Design high-signal alerting systems that wake up on-call engineers only when human intervention is required, alerting on symptoms rather than causes.",
    "overview": "Alert fatigue is the silent killer of engineering organizations: when systems fire hundreds of noisy, non-actionable alerts, engineers start ignoring alerts, resulting in major outages going unnoticed.\n\nCore Alerting Rules (Google SRE Book):\n1. Every Alert Must Be Actionable: If an engineer receives a page at 3:00 AM and has no immediate action to take (e.g. 'CPU briefly spiked to 85% and returned to normal'), that alert must be deleted.\n2. Alert on Symptoms, Not Causes:\n   - Bad (Cause-based): 'High CPU on host 4'. (Users may be completely unaffected if the cluster auto-scales).\n   - Good (Symptom-based): 'Checkout API 5xx error rate > 2% for 5 minutes' or 'SLO Error Budget burning 10x faster than normal'.\n3. Attach Runbooks to Every Alert:\n   - Every alert notification must contain an explicit URL to an internal runbook explaining what the alert means, what dashboard to check, and exact triage steps.\n4. Route by Severity:\n   - Critical (Paging): PagerDuty / Opsgenie waking up on-call engineer (active customer impact).\n   - Warning (Ticket/Slack): Non-urgent anomalies (disk at 70% capacity) investigated during business hours.",
    "keyConcepts": [
      {
        "title": "Symptom-Based Alerting",
        "explanation": "Alert on what the customer is experiencing (high latency, failed purchases, dropped connections) rather than internal implementation details."
      },
      {
        "title": "Alertmanager Deduplication & Grouping",
        "explanation": "When an entire rack or AZ goes down, 50 individual alerts fire. Alertmanager groups them into a single consolidated notification, preventing notification storms."
      }
    ],
    "diagram": {
      "title": "Prometheus & Alertmanager Notification Routing",
      "type": "ascii",
      "code": "[Prometheus Metric Evaluation]\n             |\n     (Alert Rule Evaluates TRUE for 5m)\n             v\n   [Alertmanager Engine]\n             |\n     +-------+-------+\n     | Deduplication & Grouping\n     |\n     +---> Severity: Critical ===> [PagerDuty / On-Call Engineer Paged]\n     |                             (Direct Customer Impact! Runbook Linked)\n     |\n     `---> Severity: Warning  ===> [Slack / Jira Ticket Generated]\n                                   (Investigate during business hours)"
    },
    "commands": [
      {
        "cmd": "amtool alert --alertmanager.url=http://alertmanager:9093",
        "desc": "View active firing alerts in Alertmanager via amtool CLI",
        "example": "amtool alert"
      },
      {
        "cmd": "amtool silence add alertname=HighDiskUsage --duration=2h -c 'Investigating maintenance'",
        "desc": "Silence an alert temporarily during scheduled maintenance",
        "example": "amtool silence add ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "prometheus-alerts.yaml",
      "code": "# Production Prometheus alerting rule evaluating error rate symptom with runbook linkage\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: payment-service-alerts\n  namespace: monitoring\nspec:\n  groups:\n  - name: payment-api.rules\n    rules:\n    - alert: HighHTTPErrorRate\n      expr: |\n        sum(rate(http_requests_total{job=\"payment-api\", status=~\"5..\"}[5m]))\n        /\n        sum(rate(http_requests_total{job=\"payment-api\"}[5m])) * 100 > 2\n      for: 5m\n      labels:\n        severity: critical\n        tier: platform\n      annotations:\n        summary: \"High HTTP 5xx error rate on payment-api\"\n        description: \"Payment API error rate is currently {{ $value | printf '%.2f' }}% (> 2% threshold) for the last 5 minutes.\"\n        runbook_url: \"https://wiki.internal.company.com/runbooks/payment-api-5xx\"\n        dashboard_url: \"https://grafana.company.com/d/payment-overview\"",
      "explanation": "Symptom-based Prometheus alert firing if the 5xx error rate exceeds 2% for 5 continuous minutes, including direct runbook and dashboard links."
    },
    "gotchas": [
      {
        "issue": "Alerting on instantaneous thresholds without a 'for' duration",
        "resolution": "Setting `for: 0m` triggers alerts on temporary 2-second CPU or latency spikes. Always configure `for: 5m` or `for: 10m` so alerts only trigger for sustained, genuine anomalies.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between symptom-based alerting and cause-based alerting?",
        "answer": "Cause-based alerting triggers on internal system states that might indicate a problem (e.g. host CPU > 80% or memory high). Symptom-based alerting triggers on actual degraded user experience or business impact (e.g. HTTP 5xx error rate rising or latency exceeding SLO targets). Symptom-based alerting drastically reduces false alarms and alert fatigue.",
        "platformContext": "Fundamental principle from the Google SRE handbook."
      }
    ],
    "references": [
      {
        "title": "Google SRE Book: Monitoring Distributed Systems",
        "url": "https://sre.google/sre-book/monitoring-distributed-systems/",
        "source": "Google SRE",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Why should critical paging alerts focus primarily on symptoms rather than causes?",
        "options": [
          "To avoid waking up engineers when customers are not actually experiencing degraded service",
          "Because symptoms are easier to calculate in SQL",
          "Because cloud providers only support symptom metrics",
          "To reduce network bandwidth"
        ],
        "answerIndex": 0,
        "explanation": "Symptom-based alerting guarantees that engineers are only paged when genuine user degradation or business impact occurs."
      }
    ]
  },
  {
    "id": "obs-distributed-tracing",
    "slug": "distributed-tracing-opentelemetry-jaeger-tempo",
    "pillarId": "observability",
    "branch": "right",
    "order": 4,
    "title": "Distributed Tracing & W3C Baggage Propagation (OpenTelemetry)",
    "subtitle": "OTel spans, W3C traceparent & baggage headers, context propagation, BaggageSpanProcessor & Tempo",
    "level": "Advanced",
    "estimatedMinutes": 35,
    "tags": [
      "Distributed Tracing",
      "OpenTelemetry",
      "OTel",
      "W3C TraceContext",
      "W3C Baggage",
      "BaggageSpanProcessor",
      "Jaeger",
      "Tempo",
      "SRE"
    ],
    "summary": "Trace request journeys across microservice boundaries: master W3C traceparent (telemetry DAG) and baggage (in-band metadata) propagation, OpenTelemetry Baggage API, and BaggageSpanProcessor span indexing.",
    "overview": "In distributed microservices, a single user transaction can traverse 15 downstream services (API Gateway -> Auth -> Order -> Inventory -> Payment -> DB). If the request latency spikes to 4 seconds, isolated service logs cannot pinpoint which hop caused the bottleneck. OpenTelemetry distributed tracing and W3C context propagation solve this challenge by linking cross-service execution paths and propagating contextual metadata.\n\nCore Architectural Concepts:\n1. OpenTelemetry Traces and Spans:\n   - Trace: The complete directed acyclic graph (DAG) of work representing an end-to-end user request.\n   - Span: A single contiguous block of execution within a service, containing start/end timestamps, status codes, events, and key-value attributes.\n2. W3C TraceContext Specification (`traceparent`):\n   - Standardized HTTP header establishing causal parent-child span relationships:\n     `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`\n   - Composed of 4 hyphen-delimited fields: Version (00), 16-byte Trace ID, 8-byte Parent Span ID, and Trace Flags (01 = sampled).\n3. W3C Baggage Specification (`baggage`):\n   - Standardized HTTP header propagating application-specific contextual metadata across process boundaries:\n     `baggage: tenant.id=acme-corp,user.tier=enterprise,region=us-east-1`\n   - Baggage carries cross-cutting business context (routing lanes, tenant tiers, transaction types) without requiring intermediate services to deserialize payload bodies or query databases.\n4. Critical Difference: Baggage vs Traceparent:\n   - `traceparent` is managed by the tracing engine and automatically constructs span trees in Jaeger and Tempo.\n   - `baggage` lives strictly in memory within the distributed context. By default, OpenTelemetry DOES NOT add baggage entries as span attributes or export them to tracing backends!\n5. The Bridge: `BaggageSpanProcessor`:\n   - To visualize baggage values in waterfall charts or search traces by `tenant.id`, a `BaggageSpanProcessor` intercepts span creation (`on_start`) and copies allowlisted baggage keys directly into span attributes.\n6. Security, Privacy & Reliability Guardrails:\n   - Cleartext Risk: Baggage travels unencrypted in HTTP headers. Egress calls to external 3rd-party APIs (Stripe, Twilio) must explicitly strip baggage to avoid leaking internal metadata.\n   - Header Bloat: Unbounded baggage appending risks HTTP 431 Request Header Fields Too Large.\n   - Edge Validation: Edge API Gateways must sanitize untrusted inbound `baggage` headers to prevent privilege spoofing.",
    "keyConcepts": [
      {
        "title": "W3C Traceparent vs Baggage Propagation",
        "explanation": "traceparent defines the causal telemetry graph (trace ID, parent span ID, sampling flag) parsed by tracing collectors. baggage carries in-band application metadata (tenant ID, account tier) across network hops without requiring intermediate microservices to alter database schemas or payload contracts."
      },
      {
        "title": "The BaggageSpanProcessor Bridge",
        "explanation": "Baggage values exist purely in runtime context and are NOT recorded on spans or sent to Grafana Tempo/Jaeger by default. A BaggageSpanProcessor inspects active baggage on span creation and selectively copies approved keys into span attributes for indexing and search."
      },
      {
        "title": "Baggage Security Boundaries & Egress Sanitization",
        "explanation": "Baggage is transmitted in plain text across HTTP/gRPC. Platform engineers must enforce gateway sanitization to reject spoofed edge headers, prune outbound headers to prevent HTTP 431 overflows, and strip baggage when dispatching calls to third-party vendor APIs."
      }
    ],
    "diagram": {
      "title": "W3C TraceContext & Baggage Propagation Flow",
      "type": "ascii",
      "code": "[External Client] --(HTTP POST /checkout)--> [API Gateway]\n                                                    |\n  +-------------------------------------------------+-------------------------------------------------+\n  | Injects W3C Context Propagation Headers:                                                          |\n  | 1. traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 (Causal Graph)            |\n  | 2. baggage: tenant.id=acme-corp,user.tier=enterprise (In-Band Business Metadata)                   |\n  +-------------------------------------------------+-------------------------------------------------+\n                                                    |\n                                                    v\n                                        [Order Service (Pod 1)]\n                                        |-- Extracts traceparent & baggage into active context\n                                        |-- BaggageSpanProcessor copies 'tenant.id' to Span Attributes\n                                        |-- Starts span: 'order.process' (attributes: tenant.id=acme-corp)\n                                                    |\n                           +------------------------+------------------------+\n                           | (HTTP Request with traceparent & baggage)       |\n                           v                                                 v\n               [Inventory Service (Pod 2)]                       [Payment Gateway (External)]\n               |-- Inherits baggage: user.tier=enterprise        |-- Egress Filter Strips 'baggage'\n               |-- Prioritizes queue for 'enterprise'            +-- Prevents internal metadata leak!\n                           |\n                           v\n              [Grafana Tempo / Jaeger Backend]\n              (Waterfall trace searchable by tag: tenant.id = \"acme-corp\")"
    },
    "commands": [
      {
        "cmd": "curl -v -H \"traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\" -H \"baggage: tenant.id=acme-corp,user.tier=enterprise\" http://localhost:8080/api/v1/orders",
        "desc": "Simulate inbound HTTP request injecting both W3C traceparent and baggage headers",
        "example": "curl -v -H \"traceparent: ...\" -H \"baggage: ...\" http://localhost:8080/api/v1/orders"
      },
      {
        "cmd": "otel-cli exec --service order-service --name \"process_order\" --baggage \"tenant.id=acme-corp,tier=enterprise\" curl -s http://payment-service:8080/charge",
        "desc": "Execute synthetic trace span and propagate baggage using OpenTelemetry CLI",
        "example": "otel-cli exec --service order-service ..."
      },
      {
        "cmd": "hubble observe --pod payment-pod --protocol http -o jsonpb | jq '.flow.l7.http.headers[] | select(.key==\"baggage\" or .key==\"traceparent\")'",
        "desc": "Inspect W3C traceparent and baggage headers traversing Kubernetes pods via Cilium Hubble eBPF",
        "example": "hubble observe --pod payment-pod ..."
      },
      {
        "cmd": "curl -s \"http://localhost:16686/api/traces?service=order-service&tags=%7B%22tenant.id%22%3A%22acme-corp%22%7D\" | jq .",
        "desc": "Query Jaeger REST API for distributed traces filtered by indexed baggage span attribute",
        "example": "curl -s \"http://localhost:16686/api/traces?service=order-service&tags=...\""
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "otel_baggage_instrumentation.py",
      "code": "# Production OpenTelemetry Tracing & W3C Baggage Propagation with BaggageSpanProcessor\nimport requests\nfrom opentelemetry import trace, baggage, context\nfrom opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator\nfrom opentelemetry.baggage.propagation import W3CBaggagePropagator\nfrom opentelemetry.propagators.composite import CompositePropagator\nfrom opentelemetry.sdk.trace import TracerProvider, SpanProcessor\nfrom opentelemetry.sdk.trace.export import BatchSpanProcessor\nfrom opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter\nfrom opentelemetry.sdk.resources import Resource\n\n# Configure composite propagator for W3C TraceContext and W3C Baggage\ncomposite_propagator = CompositePropagator([\n    TraceContextTextMapPropagator(),\n    W3CBaggagePropagator(),\n])\ntrace.set_tracer_provider(TracerProvider(\n    resource=Resource.create({\"service.name\": \"order-service\", \"deployment.environment\": \"production\"})\n))\n\n# Custom BaggageSpanProcessor: copies allowlisted baggage keys into span attributes for indexing\nclass BaggageSpanProcessor(SpanProcessor):\n    def __init__(self, allowed_keys=None):\n        self.allowed_keys = set(allowed_keys or [\"tenant.id\", \"user.tier\", \"transaction.type\"])\n\n    def on_start(self, span, parent_context=None):\n        ctx = parent_context or context.get_current()\n        for key in self.allowed_keys:\n            val = baggage.get_baggage(key, ctx)\n            if val is not None:\n                span.set_attribute(f\"baggage.{key}\", val)\n\n    def on_end(self, span):\n        pass\n\n# Register processors\nprovider = trace.get_tracer_provider()\notlp_exporter = OTLPSpanExporter(endpoint=\"otel-collector.monitoring:4317\", insecure=True)\nprovider.add_span_processor(BaggageSpanProcessor())\nprovider.add_span_processor(BatchSpanProcessor(otlp_exporter))\ntracer = trace.get_tracer(__name__)\n\ndef handle_incoming_request(incoming_headers: dict):\n    # 1. Extract W3C traceparent and baggage from incoming HTTP headers into active context\n    extracted_ctx = composite_propagator.extract(incoming_headers)\n    token = context.attach(extracted_ctx)\n    try:\n        # 2. Enrich context with new business baggage\n        updated_ctx = baggage.set_baggage(\"tenant.id\", \"acme-corp\")\n        updated_ctx = baggage.set_baggage(\"user.tier\", \"enterprise\", updated_ctx)\n        context.attach(updated_ctx)\n\n        # 3. Start span (BaggageSpanProcessor automatically attaches baggage.* attributes)\n        with tracer.start_as_current_span(\"process_order\") as span:\n            span.set_attribute(\"order.id\", \"ord-8921\")\n            \n            # 4. Propagate headers downstream to payment service\n            outbound_headers = {}\n            composite_propagator.inject(outbound_headers)\n            # outbound_headers now contains valid 'traceparent' and 'baggage'\n            response = requests.post(\"http://payment-service:8080/charge\", headers=outbound_headers, timeout=5)\n            return response.status_code\n    finally:\n        context.detach(token)",
      "explanation": "Production OpenTelemetry configuration setting up composite W3C TraceContext + Baggage propagators, an allowlisted BaggageSpanProcessor to bridge context metadata into queryable span attributes, and automated outbound header injection."
    },
    "gotchas": [
      {
        "issue": "Assuming baggage entries automatically appear as span attributes in Jaeger or Tempo",
        "resolution": "Baggage is strictly an in-memory context propagation mechanism. By default, OpenTelemetry will not persist baggage onto spans. Always deploy a BaggageSpanProcessor with a strict allowlist to copy designated keys (e.g. tenant.id) onto span attributes.",
        "severity": "critical"
      },
      {
        "issue": "Leaking internal organizational metadata to external third-party APIs via outbound baggage headers",
        "resolution": "Default HTTP client instrumentation auto-injects baggage into every outbound HTTP request. When calling external SaaS vendors (e.g. Stripe, Twilio), configure egress HTTP interceptors to strip or omit the 'baggage' header to prevent data leaks.",
        "severity": "critical"
      },
      {
        "issue": "HTTP 431 Request Header Fields Too Large caused by unbounded baggage appending across microservices",
        "resolution": "As requests traverse deep call graphs, each service appending baggage entries causes header sizes to balloon past standard 8KB proxy limits. Enforce strict character limits and prune transient baggage keys at intermediate gateways.",
        "severity": "warning"
      },
      {
        "issue": "Using unauthenticated W3C Baggage for authorization or billing enforcement",
        "resolution": "W3C Baggage is not cryptographically signed (unlike JWTs). Untrusted edge clients can spoof headers like 'baggage: user.tier=admin'. Always strip untrusted baggage at the public API Gateway and populate baggage only from authenticated session tokens.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the primary difference between W3C traceparent and baggage HTTP headers in OpenTelemetry?",
        "answer": "The 'traceparent' header defines the distributed causal graph (version, 16-byte trace ID, 8-byte parent span ID, sampling flags) and is automatically consumed by tracing engines to assemble span waterfalls. The 'baggage' header carries cross-cutting application metadata (like tenant ID or account tier) across service hops in memory without requiring intermediate services to deserialize business payloads. Critically, baggage entries are NOT automatically stored as span attributes or exported to trace backends unless explicitly bridged using a BaggageSpanProcessor.",
        "platformContext": "Senior/Staff Platform and SRE interview question assessing distributed systems telemetry architecture and context propagation standards."
      },
      {
        "question": "Why does OpenTelemetry avoid copying all baggage entries into span attributes by default, and how should platform teams manage this?",
        "answer": "Automatically copying all baggage into span attributes would trigger massive high-cardinality storage explosions and unintentional PII leakage into tracing backends (like Grafana Tempo or Jaeger). Platform teams should implement a BaggageSpanProcessor with a strict allowlist (e.g., only allowing 'tenant.id' and 'routing.tier') to index necessary routing dimensions while protecting TSDB cardinality and compliance.",
        "platformContext": "Core telemetry architecture question regarding storage economics and FinOps cardinality management."
      }
    ],
    "references": [
      {
        "title": "W3C Baggage Specification",
        "url": "https://www.w3.org/TR/baggage/",
        "source": "W3C",
        "type": "spec"
      },
      {
        "title": "W3C Trace Context Specification",
        "url": "https://www.w3.org/TR/trace-context/",
        "source": "W3C",
        "type": "spec"
      },
      {
        "title": "OpenTelemetry Baggage API Specification",
        "url": "https://opentelemetry.io/docs/specs/otel/baggage/api/",
        "source": "CNCF OpenTelemetry",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the primary difference between the W3C 'traceparent' and 'baggage' HTTP headers in OpenTelemetry?",
        "options": [
          "traceparent builds the distributed span execution graph, while baggage propagates cross-cutting in-band metadata across hops without automatically creating span attributes",
          "traceparent carries user business metadata, while baggage carries the 16-byte distributed trace ID",
          "traceparent is only supported in Python, while baggage is only supported in Go and Java",
          "baggage is automatically indexed as span attributes in Tempo, while traceparent requires a custom processor"
        ],
        "answerIndex": 0,
        "explanation": "traceparent standardizes causal trace and span IDs, whereas baggage transports application metadata across service hops in-memory and requires a BaggageSpanProcessor to become queryable span attributes."
      },
      {
        "id": "q2",
        "question": "Why is it dangerous to allow default OpenTelemetry auto-instrumentation to inject baggage into outbound HTTP calls to third-party external APIs?",
        "options": [
          "Third-party APIs reject all requests containing HTTP headers longer than 10 bytes",
          "Internal business context (such as tenant IDs, internal account numbers, or cluster topology) leaks to external vendors in cleartext headers",
          "Outbound baggage injection will corrupt the local operating system kernel routing table",
          "Baggage injection causes the external vendor to bill your cloud account twice"
        ],
        "answerIndex": 1,
        "explanation": "Because baggage travels in cleartext HTTP headers, propagating it to external third-party services leaks sensitive internal operational and business metadata."
      }
    ]
  },
  {
    "id": "obs-key-pillars",
    "slug": "observability-key-pillars-metrics-logs-traces",
    "pillarId": "observability",
    "branch": "left",
    "order": 5,
    "title": "Observability Key Pillars: Metrics, Logs, Traces",
    "subtitle": "The Telemetry Trinity, high-cardinality dimensionality, and unified telemetry correlation",
    "level": "Beginner",
    "estimatedMinutes": 20,
    "tags": [
      "Observability",
      "Metrics",
      "Logs",
      "Traces",
      "Telemetry"
    ],
    "summary": "Understand the three foundational pillars of modern observability: numeric time-series Metrics, detailed discrete event Logs, and request-lifecycle distributed Traces.",
    "overview": "Monitoring tells you WHEN a system is broken; Observability allows you to infer the internal state of a system and understand WHY it broke from its external telemetry outputs.\n\nThe Three Pillars (The Telemetry Trinity):\n1. Metrics (Aggregated Time-Series Numbers):\n   - Examples: CPU usage, HTTP request rate, memory consumed.\n   - Characteristics: Extremely cheap to store and query; ideal for dashboards, alerts, and trend capacity analysis.\n   - Weakness: Lacks granular request context.\n2. Logs (Discrete Event Records):\n   - Examples: Timestamped JSON messages containing error stack traces or audit events.\n   - Characteristics: Rich context detailing what happened at a specific millisecond.\n   - Weakness: Expensive to index and store at scale.\n3. Traces (Distributed Request Journeys):\n   - Examples: Waterfall diagrams tracing a single HTTP request across 10 microservices.\n   - Characteristics: Pinpoints latency bottlenecks across service boundaries.\n   - Weakness: Requires instrumentation in application code.\n\nThe Holy Grail: Telemetry Correlation\nA metric alert fires -> Jump directly to filtered logs -> Click a trace ID to open the waterfall diagram in seconds.",
    "keyConcepts": [
      {
        "title": "Monitoring vs Observability",
        "explanation": "Monitoring tracks known failure modes ('known-unknowns' via predefined thresholds). Observability allows exploring novel, emergent failure modes ('unknown-unknowns') in complex distributed systems."
      },
      {
        "title": "Telemetry Inter-Correlation",
        "explanation": "The real power is linking all three: Prometheus metrics generate the alert, Loki logs reveal the error message, and Tempo traces show the slow downstream database call."
      }
    ],
    "diagram": {
      "title": "The Three Pillars of Observability",
      "type": "ascii",
      "code": "                     +-----------------------------+\n                     |  OBSERVABILITY TRINITY      |\n                     +-----------------------------+\n                       /            |            \\\n                      /             |             \\\n                     v              v              v\n                [METRICS]        [LOGS]        [TRACES]\n               \"Is there a     \"What happened    \"Where did the\n                problem?\"       specifically?\"   time go?\"\n               (Prometheus)     (Loki / ELK)    (Tempo / Jaeger)"
    },
    "commands": [
      {
        "cmd": "curl -s http://localhost:8080/metrics | head -n 20",
        "desc": "Inspect raw Prometheus exposition text format",
        "example": "curl -s http://localhost:8080/metrics"
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "correlated_telemetry.py",
      "code": "# Python example demonstrating simultaneous Metric increment, Structured Log, and Trace span\nfrom prometheus_client import Counter\nimport logging\nimport json\n\nREQUEST_COUNTER = Counter(\"http_requests_total\", \"Total HTTP requests\", [\"method\", \"status\"])\n\ndef handle_api_request(method: str, path: str, status_code: int, trace_id: str):\n    # 1. METRIC: Increments aggregated time-series counter (cheap, fast, alertable)\n    REQUEST_COUNTER.labels(method=method, status=str(status_code)).inc()\n    \n    # 2. LOG: Emits detailed contextual event with embedded trace_id\n    log_payload = {\n        \"event\": \"api_request_completed\",\n        \"method\": method,\n        \"path\": path,\n        \"status\": status_code,\n        \"trace_id\": trace_id\n    }\n    print(json.dumps(log_payload))\n    \n    # 3. TRACE: Span context propagated across downstream services",
      "explanation": "Demonstrates simultaneous generation of Prometheus metrics, structured JSON logs, and trace correlation IDs."
    },
    "gotchas": [
      {
        "issue": "Treating logs as metrics by parsing millions of log lines to count errors",
        "resolution": "Counting errors by running heavy full-text queries over petabytes of logs consumes massive CPU and delays alerts. Expose a native Prometheus Counter metric (`errors_total`) instead.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are the three pillars of observability and what are their respective trade-offs?",
        "answer": "Metrics, Logs, and Traces. Metrics are numerically aggregated and cheap to store/query, making them ideal for alerting and dashboards, but lack detailed context. Logs provide rich granular event details, but are expensive to store and query at scale. Traces visualize cross-service latency and request flows, but require distributed context propagation and code instrumentation.",
        "platformContext": "Fundamental observability architecture question."
      }
    ],
    "references": [
      {
        "title": "Cindy Sridharan: Distributed Systems Observability",
        "url": "https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/",
        "source": "O'Reilly",
        "type": "guide"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which telemetry pillar is computationally cheapest to store and query, making it the primary choice for automated alerting and dashboards?",
        "options": [
          "Metrics",
          "Logs",
          "Traces",
          "Memory Dumps"
        ],
        "answerIndex": 0,
        "explanation": "Metrics are compact numeric time-series data points, making them extremely lightweight to query and alert on."
      }
    ]
  },
  {
    "id": "obs-4-golden-signals",
    "slug": "4-golden-signals-latency-errors-traffic-saturation",
    "pillarId": "observability",
    "branch": "left",
    "order": 6,
    "title": "The 4 Golden Signals (Google SRE)",
    "subtitle": "Latency, Traffic / Throughput, Errors, Saturation, RED Method, and USE Method",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "4 Golden Signals",
      "Google SRE",
      "RED Method",
      "USE Method",
      "Latency",
      "Saturation"
    ],
    "summary": "Master the essential telemetry metrics defined in the Google SRE Book: Latency, Traffic, Errors, and Saturation, along with the RED and USE observability frameworks.",
    "overview": "If you can only measure four metrics about a user-facing system, focus on the Four Golden Signals defined by Google Site Reliability Engineering.\n\nThe 4 Golden Signals:\n1. Latency:\n   - The time it takes to service a request.\n   - Crucial: Measure successful latency separately from failed latency (a failed request that returns 500 in 2ms should not artificially lower your perceived latency!). Track p50, p95, and p99 percentiles, not averages.\n2. Traffic (Throughput):\n   - A measure of how much demand is being placed on your system (e.g. HTTP requests per second, concurrent connections, network I/O per sec).\n3. Errors:\n   - The rate of requests that fail, either explicitly (HTTP 500s) or implicitly (e.g. HTTP 200 with wrong response content).\n4. Saturation:\n   - How 'full' the service is. Measures the fraction of constrained resources that are consumed (e.g. CPU utilization %, memory saturation, disk I/O wait, connection pool queue depth).\n\nRelated Frameworks:\n- RED Method (for Request-driven services): Rate (Traffic), Errors, Duration (Latency).\n- USE Method (for Resource-driven infrastructure): Utilization, Saturation, Errors.",
    "keyConcepts": [
      {
        "title": "Never Rely on Mean / Average Latency",
        "explanation": "Averages hide severe tail latency problems. If 95% of requests take 50ms, but 5% take 5,000ms, the average looks healthy while 1 in 20 customers experiences a broken experience. Always monitor 95th and 99th percentiles (p95, p99)."
      },
      {
        "title": "Saturation as a Leading Indicator",
        "explanation": "Saturation alerts fire BEFORE user-facing failures occur. If database connection pools hit 90% capacity, engineers can scale capacity before requests start failing."
      }
    ],
    "diagram": {
      "title": "Google SRE 4 Golden Signals Overview",
      "type": "ascii",
      "code": "+-------------------------------------------------------------------------+\n|                         THE 4 GOLDEN SIGNALS                            |\n+-------------------------------------------------------------------------+\n|  1. LATENCY       | Time to serve request (p50, p95, p99 percentiles)   |\n|  2. TRAFFIC       | Demand placed on system (HTTP req/sec, QPS)         |\n|  3. ERRORS        | Rate of requests failing (5xx errors, timeouts)     |\n|  4. SATURATION    | How full the system is (Memory %, Thread pool queue)|\n+-------------------------------------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "promtool query instant http://localhost:9090 'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))'",
        "desc": "Query 99th percentile (p99) latency in Prometheus",
        "example": "promtool query instant ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "promql-golden-signals.yaml",
      "code": "# Production PromQL queries for the 4 Golden Signals on an API service\ngolden_signals_promql:\n  # 1. Latency (p99 duration)\n  p99_latency_seconds:\n    query: \"histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job='api'}[5m])) by (le))\"\n\n  # 2. Traffic (Requests per second)\n  traffic_req_per_sec:\n    query: \"sum(rate(http_requests_total{job='api'}[5m]))\"\n\n  # 3. Errors (5xx error percentage)\n  error_percentage:\n    query: \"sum(rate(http_requests_total{job='api', status=~'5..'}[5m])) / sum(rate(http_requests_total{job='api'}[5m])) * 100\"\n\n  # 4. Saturation (Container memory utilization percentage against limit)\n  memory_saturation_pct:\n    query: \"sum(container_memory_working_set_bytes{container='api'}) / sum(kube_pod_container_resource_limits{container='api', resource='memory'}) * 100\"",
      "explanation": "Production PromQL queries computing Latency p99, Traffic RPS, Error %, and Memory Saturation %."
    },
    "gotchas": [
      {
        "issue": "Averaging percentiles across multiple servers",
        "resolution": "Averaging percentiles (e.g. taking the average of 10 nodes' p99 metrics) is mathematically invalid. Compute percentiles across raw aggregated histogram buckets using `histogram_quantile()` in Prometheus.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What are the Four Golden Signals in Google SRE and why should you measure failed request latency separately?",
        "answer": "The Four Golden Signals are Latency, Traffic, Errors, and Saturation. Failed requests should be tracked separately because errors often fail fast (e.g. returning HTTP 500 in 2ms when a database connection fails), which artificially pulls down average latency and masks that healthy requests are suffering slow latency.",
        "platformContext": "The definitive SRE telemetry question."
      }
    ],
    "references": [
      {
        "title": "Google SRE Book: The Four Golden Signals",
        "url": "https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals",
        "source": "Google SRE",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "Which golden signal measures how 'full' a system is, acting as a leading indicator before user-facing error rates spike?",
        "options": [
          "Saturation",
          "Traffic",
          "Latency",
          "Error Rate"
        ],
        "answerIndex": 0,
        "explanation": "Saturation measures resource strain (queue depth, memory %, CPU saturation) before system failures occur."
      }
    ]
  },
  {
    "id": "obs-slo-sla-sli",
    "slug": "slos-slas-slis-error-budgets",
    "pillarId": "observability",
    "branch": "left",
    "order": 7,
    "title": "SLOs, SLAs, SLIs & Error Budgets",
    "subtitle": "Service Level Indicators, Service Level Objectives, Service Level Agreements, and Error Budgets",
    "level": "Intermediate",
    "estimatedMinutes": 25,
    "tags": [
      "SLO",
      "SLA",
      "SLI",
      "Error Budget",
      "SRE",
      "Google SRE"
    ],
    "summary": "Balance feature velocity and system reliability: measure quantified Service Level Indicators (SLIs), establish internal targets (SLOs), and govern releases with Error Budgets.",
    "overview": "100% uptime is the wrong target for almost any system: achieving 100% reliability costs an exponential amount of money and halts engineering feature velocity. SRE uses SLOs and Error Budgets to define an acceptable failure rate.\n\nKey Concepts:\n1. Service Level Indicator (SLI):\n   - A quantifiable metric of service performance.\n   - Formula: `Good Events / Total Events * 100`.\n   - Example: Percentage of HTTP GET requests to `/checkout` returning 200 in < 300ms over a 30-day window.\n2. Service Level Objective (SLO):\n   - An internal target agreed upon by engineering and product teams.\n   - Example: 99.9% of requests meet the SLI over a rolling 30-day window.\n3. Service Level Agreement (SLA):\n   - A legally binding contract with customers with financial penalties (refunds, credits) if breached.\n   - Best practice: Always set the internal SLO stricter than the external SLA (e.g. SLO is 99.9%, SLA is 99.5%) to give engineering room to recover before incurring fines.\n4. Error Budget:\n   - The inverse of the SLO: `100% - SLO`.\n   - For a 99.9% SLO, the error budget is 0.1% (allowing ~43 minutes of downtime per month).\n   - If the error budget is healthy, developers can deploy risky new features. If the error budget is exhausted, feature deployments are frozen and all engineering effort pivots to reliability hardening.",
    "keyConcepts": [
      {
        "title": "Error Budget Policy",
        "explanation": "A formal agreement between Product and Engineering: when the error budget is depleted, feature work pauses, and sprints focus exclusively on automated testing, resilience, and tech debt."
      },
      {
        "title": "Multi-Window Multi-Burn-Rate Alerting",
        "explanation": "Instead of alerting when the budget is 100% exhausted, alert on burn rate: alert if 5% of the monthly error budget is burned in 1 hour (rapid fire) or 10% in 6 hours."
      }
    ],
    "diagram": {
      "title": "SLI, SLO, SLA Hierarchy & Error Budget",
      "type": "ascii",
      "code": "+-------------------------------------------------------------+\n|  TOTAL TIME (100%)                                          |\n+-------------------------------------------------------------+\n|  Service Level Objective (SLO: 99.9%)       | Error Budget  |\n|  (Internal Engineering Target)              | (0.1% = 43m)  |\n+---------------------------------------------+---------------+\n|  Service Level Agreement (SLA: 99.5%)       |\n|  (Legal Contract with Financial Penalties)  |\n+---------------------------------------------+"
    },
    "commands": [
      {
        "cmd": "curl -s http://prometheus:9090/api/v1/query?query=sum_over_time... | jq .",
        "desc": "Query 30-day rolling SLI error budget burn in Prometheus",
        "example": "curl -s ..."
      }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "sloth-slo-definition.yaml",
      "code": "# Production SLO definition using Sloth (Prometheus SLO generator)\nversion: \"prometheus/v1\"\nservice: \"checkout-api\"\nslos:\n  - name: \"requests-availability\"\n    objective: 99.9\n    description: \"99.9% of checkout requests succeed with non-5xx status over 30 days\"\n    sli:\n      events:\n        error_query: sum(rate(http_requests_total{job=\"checkout-api\", status=~\"5..\"}[{{.window}}]))\n        total_query: sum(rate(http_requests_total{job=\"checkout-api\"}[{{.window}}]))\n    alerting:\n      name: CheckoutAPIAvailabilityAlert\n      labels:\n        severity: critical\n      annotations:\n        runbook: \"https://wiki.company.com/runbooks/checkout-slo-burn\"",
      "explanation": "Automated SLO manifest generating multi-window burn rate alerts and recording rules via Sloth."
    },
    "gotchas": [
      {
        "issue": "Setting a 100% availability SLO target",
        "resolution": "Aiming for 100% uptime halts innovation, prevents updates, and is impossible because underlying cloud providers and internet ISPs only guarantee 99.99%. Embrace an Error Budget.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is an Error Budget and how does it balance feature velocity with system reliability?",
        "answer": "An Error Budget is the allowable room for unreliability defined as `100% - SLO` (e.g. 0.1% for a 99.9% SLO). It acts as a neutral mechanism negotiated between Product and Engineering: as long as the error budget is positive, teams can ship new features rapidly. If incidents exhaust the budget, feature releases freeze and engineering focuses strictly on reliability and bug fixes.",
        "platformContext": "Standard SRE leadership and culture question."
      }
    ],
    "references": [
      {
        "title": "Google SRE Book: Service Level Objectives",
        "url": "https://sre.google/sre-book/service-level-objectives/",
        "source": "Google SRE",
        "type": "official"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "If a service commits to an internal SLO of 99.9% over a 30-day calendar month, approximately how much total allowable downtime constitutes its Error Budget?",
        "options": [
          "Approximately 43 minutes",
          "Approximately 4 hours",
          "Approximately 12 hours",
          "Zero minutes"
        ],
        "answerIndex": 0,
        "explanation": "30 days * 24 hours * 60 minutes = 43,200 minutes. 0.1% of 43,200 minutes is ~43.2 minutes."
      }
    ]
  },
  {
    "id": "obs-otel-collector-transformations",
    "slug": "opentelemetry-collector-ottl-transformations",
    "pillarId": "observability",
    "branch": "right",
    "order": 8,
    "title": "OpenTelemetry Collector Architecture & OTTL Transformations",
    "subtitle": "High-performance telemetry gateways, transform processors, OTTL syntax & PII redaction",
    "level": "Advanced",
    "estimatedMinutes": 35,
    "tags": ["OpenTelemetry", "OTel Collector", "OTTL", "Pipelines", "Observability", "FinOps", "SRE"],
    "summary": "Build vendor-neutral telemetry pipelines. Use OpenTelemetry Transformation Language (OTTL) to sanitize PII, drop noisy data, and control cardinality in-flight.",
    "overview": "Sending raw telemetry directly from client SDKs to observability backends creates vendor lock-in, leaks sensitive PII into third-party clouds, and drives catastrophic ingestion bills.\n\nThe OpenTelemetry Collector acts as a vendor-neutral proxy:\n1. Pipeline Architecture:\n   - Receivers: Ingest OTLP, Prometheus, Zipkin, or Fluent Bit streams.\n   - Processors: Modify, filter, batch, and transform data in memory.\n   - Exporters: Route transformed telemetry to Prometheus, Tempo, Datadog, or S3.\n2. OTTL (OpenTelemetry Transformation Language):\n   - Standardized expression language for in-flight telemetry modification.\n   - Contexts: Operates on resource, scope, span, metric, or log.\n   - Functions: set, replace_pattern, delete_key, drop, IsMatch.\n3. Real-World Use Cases:\n   - Redacting PII: Masking credit cards, authorization bearer tokens, and emails using regex.\n   - Baggage Extraction & Sanitization: Scrubbing or filtering sensitive baggage attributes bridged from upstream requests before exporting to external analytics or SaaS tracing vendors.\n   - Cardinality Control: Stripping random UUIDs or customer IDs from metric labels to prevent TSDB crashes.\n   - Cost Reduction: Dropping 200 OK health-check spans while retaining 100% of 5xx error traces.",
    "keyConcepts": [
      {
        "title": "Collector Pipeline Composition",
        "explanation": "Telemetry flows deterministically through Receivers -> Processors -> Exporters. Processors execute sequentially."
      },
      {
        "title": "OTTL (OpenTelemetry Transformation Language)",
        "explanation": "Declarative condition-based language designed to mutate attributes, drop fields, or reshape telemetry structures with zero application redeploys."
      }
    ],
    "diagram": {
      "title": "OpenTelemetry Collector Gateway Topology",
      "type": "ascii",
      "code": "[App Pod 1] --(OTLP gRPC)---+\n                            |\n[App Pod 2] --(OTLP HTTP)---+---> [OTel Collector Gateway (Deployment)]\n                                  |-- Receiver: otlp\n                                  |-- Processor: memory_limiter\n                                  |-- Processor: transform (OTTL Redaction & Filter)\n                                  |-- Processor: batch\n                                  +--> Exporter: prometheus (Metrics)\n                                  +--> Exporter: otlp/tempo (Traces)\n                                  +--> Exporter: loki / s3 (Sanitized Logs)"
    },
    "commands": [
      { "cmd": "otelcorecol validate --config=collector.yaml", "desc": "Validate OpenTelemetry collector configuration syntax and pipeline topology" },
      { "cmd": "curl -s http://localhost:8888/metrics | grep otelcol_processor", "desc": "Inspect collector processor throughput, dropped spans, and memory pressure" },
      { "cmd": "curl -s http://localhost:13133/healthz", "desc": "Check OpenTelemetry Collector health check endpoint" }
    ],
    "productionCode": {
      "language": "yaml",
      "filename": "otel-collector-transform.yaml",
      "code": "processors:\n  memory_limiter:\n    check_interval: 1s\n    limit_percentage: 75\n    spike_limit_percentage: 20\n\n  transform:\n    error_mode: ignore\n    trace_statements:\n      - context: span\n        statements:\n          # Redact sensitive authorization tokens from span attributes\n          - replace_pattern(attributes[\"http.request.header.authorization\"], \"Bearer .*\", \"Bearer [REDACTED]\")\n          # Sanitize baggage attributes bridged via BaggageSpanProcessor\n          - replace_pattern(attributes[\"baggage.customer_email\"], \".*@.*\", \"[EMAIL_REDACTED]\")\n          - delete_key(attributes, \"baggage.internal_secret_token\")\n          # Route high-priority tenants to premium SLA lane based on baggage tier\n          - set(attributes[\"sla.priority\"], \"vip\") where attributes[\"baggage.user.tier\"] == \"enterprise\"\n          - delete_key(attributes, \"debug.verbose_payload\")\n          - set(attributes[\"sla.breached\"], \"true\") where duration > 2000000000\n    \n    log_statements:\n      - context: log\n        statements:\n          - replace_pattern(body, \"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}\", \"[EMAIL_REDACTED]\")\n\n  filter/drop_noisy_spans:\n    error_mode: ignore\n    traces:\n      span:\n        - 'attributes[\"http.target\"] == \"/healthz\" and status.code == 0'\n\nservice:\n  pipelines:\n    traces:\n      receivers: [otlp]\n      processors: [memory_limiter, filter/drop_noisy_spans, transform, batch]\n      exporters: [otlp/tempo]",
      "explanation": "Production OpenTelemetry Collector pipeline demonstrating memory limiting, OTTL-driven PII redaction and baggage attribute sanitization, SLA breaching tagging, and automated dropping of noisy health checks."
    },
    "gotchas": [
      {
        "issue": "Collector OOM crashes under telemetry burst traffic",
        "resolution": "Always place the 'memory_limiter' processor as the first processor in your pipeline, and set GOMEMLIMIT environment variable to 80% of container memory limit.",
        "severity": "critical"
      },
      {
        "issue": "Leaking unredacted baggage attributes to third-party tracing SaaS backends",
        "resolution": "Use the OTTL transform processor with delete_key and replace_pattern to scrub sensitive baggage attributes (such as customer emails or internal tokens) before export.",
        "severity": "warning"
      }
    ],
    "interviewQuestions": [
      {
        "question": "How do you control observability ingestion costs and prevent PII leakage across 500 microservices?",
        "answer": "Deploy an OpenTelemetry Collector gateway with the Transform processor and OTTL. OTTL statements can sanitize PII (passwords, emails, JWTs) using regex before telemetry leaves your VPC, while filter processors drop 100% of successful /healthz polling spans, saving 30-50% on vendor ingestion bills without touching application source code.",
        "platformContext": "Staff SRE interview scenario addressing compliance (GDPR/HIPAA) and FinOps telemetry cost control."
      }
    ],
    "references": [
      { "title": "OpenTelemetry Transform Processor & OTTL", "url": "https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor", "source": "CNCF OpenTelemetry", "type": "official" }
    ],
    "quiz": [
      {
        "id": "ottl-1",
        "question": "In what order should processors be configured in an OpenTelemetry Collector pipeline?",
        "options": [
          "batch, exporters, transform, memory_limiter",
          "memory_limiter, filter, transform, batch",
          "transform, batch, memory_limiter, filter",
          "exporters, batch, transform, memory_limiter"
        ],
        "answerIndex": 1,
        "explanation": "memory_limiter must run first to drop or backpressure data when RAM spikes, followed by filtering and transformation, and ending with batch to group network flushes."
      }
    ]
  }
];
