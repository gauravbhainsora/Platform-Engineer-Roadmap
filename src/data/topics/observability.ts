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
    "title": "Distributed Tracing (OpenTelemetry)",
    "subtitle": "OpenTelemetry (OTel), traces, spans, W3C TraceContext propagation, Jaeger, and Tempo",
    "level": "Advanced",
    "estimatedMinutes": 30,
    "tags": [
      "Distributed Tracing",
      "OpenTelemetry",
      "OTel",
      "Jaeger",
      "Tempo",
      "W3C TraceContext"
    ],
    "summary": "Trace request journeys across microservice boundaries: identify latency bottlenecks, visualize execution flow, and correlate traces with logs using OpenTelemetry.",
    "overview": "In distributed microservices, a single user click can traverse 15 services (API Gateway -> Auth -> Order -> Inventory -> Payment -> DB). If the request takes 4 seconds, traditional logs cannot pinpoint which service caused the delay. Distributed tracing solves this.\n\nKey Concepts:\n1. OpenTelemetry (OTel):\n   - CNCF industry standard unifying APIs, SDKs, and tooling to collect traces, metrics, and logs.\n2. Traces and Spans:\n   - Trace: The complete end-to-end journey of a request through the distributed system.\n   - Span: A single unit of contiguous work (e.g. an HTTP handler execution, database query, or gRPC call). Contains start/end timestamps, tags, events, and status.\n3. Context Propagation (W3C TraceContext):\n   - When Service A calls Service B, it injects standard HTTP headers:\n     `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`\n   - Service B extracts the header, making its spans children of the upstream span.\n4. Visualization Backends:\n   - Jaeger and Grafana Tempo display waterfall charts pinpointing exactly where milliseconds were spent.",
    "keyConcepts": [
      {
        "title": "Waterfall Visualizations",
        "explanation": "Displays all spans hierarchically along a time axis, immediately exposing whether latency was caused by slow database queries, sequential external HTTP calls, or CPU contention."
      },
      {
        "title": "W3C TraceContext Standard",
        "explanation": "Standardizes header propagation (`traceparent` and `tracestate`) across heterogeneous languages (Go, Java, Node.js, Python), enabling end-to-end tracing across diverse tech stacks."
      }
    ],
    "diagram": {
      "title": "Distributed Trace Waterfall Timeline",
      "type": "ascii",
      "code": "[Trace: Total Duration = 850ms]\n|=============================================================================|\n  [Span: API Gateway - /checkout] (850ms)\n  |===========================================================================|\n    [Span: Auth-Service - verify_jwt] (40ms)\n    |====|\n    [Span: Order-Service - create_order] (780ms)\n         |====================================================================|\n         [Span: PostgreSQL - INSERT INTO orders] (25ms)\n         |==|\n         [Span: Payment-Service - charge_card] (720ms) <=== BOTTLENECK DETECTED!\n              |===============================================================|"
    },
    "commands": [
      {
        "cmd": "curl -s http://localhost:16686/api/traces?service=order-api | jq .",
        "desc": "Query Jaeger REST API for recent service traces",
        "example": "curl -s ..."
      }
    ],
    "productionCode": {
      "language": "python",
      "filename": "otel_instrumentation.py",
      "code": "# Production OpenTelemetry automatic trace instrumentation with OTLP exporter\nfrom opentelemetry import trace\nfrom opentelemetry.sdk.trace import TracerProvider\nfrom opentelemetry.sdk.trace.export import BatchSpanProcessor\nfrom opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter\nfrom opentelemetry.sdk.resources import Resource\n\n# Configure service resource metadata\nresource = Resource.create({\"service.name\": \"checkout-service\", \"deployment.environment\": \"production\"})\nprovider = TracerProvider(resource=resource)\n\n# Export via gRPC to OpenTelemetry Collector or Grafana Tempo\notlp_exporter = OTLPSpanExporter(endpoint=\"otel-collector.monitoring:4317\", insecure=True)\nprovider.add_span_processor(BatchSpanProcessor(otlp_exporter))\ntrace.set_tracer_provider(provider)\n\ntracer = trace.get_tracer(__name__)\n\ndef process_checkout_span(order_id: str):\n    with tracer.start_as_current_span(\"process_checkout\") as span:\n        span.set_attribute(\"order.id\", order_id)\n        # Execute work...\n        span.add_event(\"Inventory reserved\")",
      "explanation": "Initializes OpenTelemetry TracerProvider with an OTLP gRPC exporter and instruments an execution span."
    },
    "gotchas": [
      {
        "issue": "Forgetting to propagate trace headers when making outbound HTTP requests",
        "resolution": "If Service A calls Service B with a plain HTTP client without injecting the `traceparent` header, the trace breaks into two disconnected traces. Use OpenTelemetry auto-instrumentation libraries to inject headers automatically.",
        "severity": "critical"
      }
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between a Trace and a Span in OpenTelemetry?",
        "answer": "A Span is a single unit of contiguous work within a service, tracking a start time, duration, attributes, and status (e.g. a SQL query or HTTP request). A Trace is the complete directed acyclic graph (DAG) of Spans representing the end-to-end journey of a request as it traverses multiple distributed services.",
        "platformContext": "Core telemetry question in distributed systems interviews."
      }
    ],
    "references": [
      {
        "title": "OpenTelemetry Official Documentation",
        "url": "https://opentelemetry.io/docs/",
        "source": "CNCF",
        "type": "official"
      },
      {
        "title": "W3C Trace Context Specification",
        "url": "https://www.w3.org/TR/trace-context/",
        "source": "W3C",
        "type": "spec"
      }
    ],
    "quiz": [
      {
        "id": "q1",
        "question": "What is the standard W3C HTTP header used to propagate distributed trace context across microservice network boundaries?",
        "options": [
          "traceparent",
          "x-request-id",
          "correlation-token",
          "otel-span"
        ],
        "answerIndex": 0,
        "explanation": "The W3C TraceContext specification standardizes the 'traceparent' header."
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
  }
];
