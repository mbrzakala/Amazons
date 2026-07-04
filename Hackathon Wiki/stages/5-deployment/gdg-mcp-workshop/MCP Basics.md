# MCP Basics

MCP (Model Context Protocol) is just a standard way for a chatbot to call outside functions — "tools" — instead of only generating text.

In this repo, the chatbot doesn't know TRIZ. It knows it has six tools it's allowed to call (defined in [[How the Server Works|contradictions.py]]), like "look up the matrix" or "search parameters by meaning." When you describe a problem, the chatbot decides which tool to call, sends the request to the server running locally, and gets a text answer back to work into its reply.

That's the whole trick: the AI doesn't need to have TRIZ memorized — it just needs permission to ask a server that does.

Related: [[TRIZ Basics]], [[SIMPLE - how to use]]
