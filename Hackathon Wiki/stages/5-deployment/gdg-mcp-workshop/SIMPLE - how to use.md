# SIMPLE - How to Use

One line: this repo lets a chatbot look up [[TRIZ Basics|TRIZ]] answers for you over [[MCP Basics|MCP]], instead of you searching a table by hand.

## Quick start

1. Run the server: `cd mcp-server && uv run python app/main.py` (or `./local_deploy.sh` for Docker).
2. Connect a chat client to `http://localhost:8000/mcp` — LM Studio, Claude, or the MCP Inspector all work.
3. Describe your problem as a tradeoff: "we want faster onboarding, but that means fewer security checks."
4. The chatbot calls the tools for you and hands back a named strategy (e.g. "Segmentation") plus an example.

## What you actually get

A *category* of solution, not a finished feature. TRIZ was built for engineering tradeoffs, so for a business/product problem, treat the strategy name as a brainstorming prompt — you still translate it into something concrete. See [[Hackathon Playbook]].

## Map of this wiki

- [[TRIZ Basics]] — what the method is, in plain English
- [[MCP Basics]] — what lets a chatbot use tools at all
- [[How the Server Works]] — which file does what, and the request flow
- [[Hackathon Playbook]] — how to actually use this in a hackathon
- [[GCP Deploy Windows 11]] — full step-by-step GCP Cloud Run deployment from Windows 11 PowerShell
