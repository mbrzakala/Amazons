---
stage: 5-deployment
task: 5
---

# 5. Observability: Cloud Logging

**What to do:** Confirm every deployed service's logs are visible in Cloud Logging, so a production issue can be diagnosed without redeploying with extra print statements.

**How:**
1. Cloud Run automatically streams each container's stdout/stderr to Cloud Logging — no extra setup needed. Confirm this actually works for each deployed service (MCP server, backend, frontend) rather than assuming it.
2. Check that the backend's existing `Logger.log(...)` startup messages (e.g. "Application is running on...") actually appear in Cloud Logging for the deployed service, not just in the local terminal.
3. Filter logs by service name in Cloud Logging (Console → Logs Explorer, or `gcloud logging read "resource.labels.service_name=<service>"`) and confirm you can find a specific request's log line during a real test call.

**Recommended tool:** Cloud Run's built-in Cloud Logging integration (automatic, zero config) + Cloud Console Logs Explorer. Backup: `gcloud logging read` from the CLI if the Console is unavailable.

## Gate

- [ ] Each deployed service's logs are visible in Cloud Logging, filtered by that service's name.
- [ ] A deliberate test request can be traced to its corresponding log line within a minute of making it.
- [ ] The team knows where to look first (Logs Explorer / `gcloud logging read`) before assuming a deploy is broken.

Last task — once it passes, the stage is done.

## Result

**Scope:** Verify Cloud Logging observability for every deployed service, so production issues surface as log lines, not guesswork.

**DoD:**
- [ ] All three services (MCP server, backend, frontend) have visible, filterable logs in Cloud Logging.
- [ ] One real test request was traced end-to-end through the logs.

**Layers:** infra: observability, Cloud Logging.
