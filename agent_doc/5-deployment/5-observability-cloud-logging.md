---
stage: 5-deployment
step: 5
source: Hackathon Wiki/stages/5-deployment/steps/5-observability-cloud-logging.md
---

# Validator — 5. Observability: Cloud Logging

Checks: `Hackathon Wiki/stages/5-deployment/steps/5-observability-cloud-logging.md`.

Last step of stage 5 — once it passes, the stage is done.

## What this step is proving

Every deployed service's logs are actually visible and filterable in Cloud Logging
(confirmed, not assumed), and a specific test request can be traced to its log line
within a minute.

## Evidence to gather

- `gcloud logging read "resource.labels.service_name=<service>"` for each of the three
  services (MCP server, backend, frontend).
- A deliberate test request against a live service, then a search for its
  corresponding log line (e.g. the backend's `Logger.log(...)` startup message).

## Gate checklist

1. **Each deployed service's logs are visible in Cloud Logging, filtered by that
   service's name.**
   Evidence: `gcloud logging read` output per service.
2. **A deliberate test request can be traced to its corresponding log line within a
   minute of making it.**
   Evidence: timestamp correlation between the request and the log entry.
3. **The team knows where to look first (Logs Explorer / `gcloud logging read`) before
   assuming a deploy is broken.**
   Evidence: team self-report.

Corresponding Result/DoD (once filled): all three services have visible, filterable
logs in Cloud Logging; one real test request was traced end-to-end through the logs.

See `agent_doc/README.md` for the verdict scale and reporting format.
