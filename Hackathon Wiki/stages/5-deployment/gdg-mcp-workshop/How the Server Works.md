# How the Server Works

File-by-file, mapped to concept:

- `pytriz` (external package) — the actual TRIZ data: matrix, 40 principles, 39 parameters, plus semantic search.
- `app/services/triz.py` — wraps `pytriz` into one shared `TRIZStore`, optionally hooked to an embedding model for "search by meaning."
- `app/tools/contradictions.py` — six functions that call the store: matrix lookup by parameter IDs, semantic search for a parameter/principle by plain text, get-by-ID, get-random.
- `app/tools/__init__.py` — registers those six functions as MCP tools the chatbot is allowed to call.
- `app/main.py` — boots the actual server (`localhost:8123/mcp`).
- `embeddings/Dockerfile` — a separate container running Ollama (`embeddinggemma:300m`), which turns your plain-text query into a vector so it can be matched against the 39 parameters. This is what powers the "search by meaning" tools.
- `resources/`, `prompts/` — unused example placeholders, not part of the TRIZ flow.

## Request flow

1. You type a plain-English tradeoff into a connected chat client.
2. The LLM calls `search_parameter(...)` for each side of the tradeoff.
3. That call hits the Ollama embedding container to convert your text to a vector, matches it to the closest official parameter.
4. The LLM calls `browse_contradiction_matrix(...)` with those parameter IDs.
5. The server returns named Inventive Principles with rules/examples.
6. The LLM turns that into a reply for you.

Everything else (Docker, CORS, pydantic config) is deployment plumbing — see [[SIMPLE - how to use]] for what to actually run.
