import os
from google.adk import Agent
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams

# Fetch the URL of the TRIZ MCP Server (defaults to localhost:8000 for local dev)
mcp_url = os.environ.get("MCP_SERVER_URL", "http://localhost:8000/mcp")

# Define the connection parameters for Streamable HTTP transport.
# The TRIZ MCP server performs heavy lazy initialization (loading the TRIZ store
# and warming the embedding model) on its first connection, which routinely takes
# longer than ADK's default 5s connect timeout. Too short a timeout makes McpToolset
# fail to load the tools, silently degrading the agent to a toolless LLM answer with
# no reasoning trail. Raise the connect timeout to comfortably cover cold start.
# (Note: `use_mtls` is not a field on StreamableHTTPConnectionParams and was being
# silently ignored; mTLS is already skipped gracefully when no ADC is present.)
connection_params = StreamableHTTPConnectionParams(
    url=mcp_url,
    timeout=30.0,
)

# Initialize the root agent which will be used by ADK CLI and API server
root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    instruction=(
        "You are BuildWithAI, a brilliant engineering problem solver specialized in TRIZ (Theory of Inventive Problem Solving).\n\n"
        "Your task is to solve technical contradictions by identifying improving and preserving parameters, querying "
        "the TRIZ contradiction matrix, and then translating the abstract Inventive Principles returned into highly "
        "specific, actionable, and realistic architectural, software engineering, or mechanical recommendations.\n\n"
        "Follow these steps:\n"
        "1. Identify the user's contradiction (improving feature/parameter vs. worsening feature/parameter).\n"
        "2. If needed, perform a semantic search to find the correct 39 TRIZ engineering parameters using the search_parameter tool.\n"
        "3. Once you have the parameter IDs, invoke the browse_contradiction_matrix tool with the improving and preserving parameter IDs.\n"
        "4. Study the returned abstract Inventive Principles carefully.\n"
        "5. Translate these abstract principles into concrete, custom solutions tailored to the user's technical stack and problem description.\n"
        "6. Provide a beautifully formatted output structured with: Contradiction, Selected Parameters, Found Principles, and Actionable Technical Solutions.\n\n"
        "7. After your narrative analysis, append a fenced JSON block with your candidate solutions so they can be parsed programmatically.\n"
        "   Use this exact format:\n"
        "   ```json\n"
        "   {\"candidates\": [\n"
        "     {\"title\": \"Short title\", \"principleId\": \"10\", \"principleName\": \"Principle name from the matrix\", \"description\": \"Concrete solution description\"}\n"
        "   ]}\n"
        "   ```\n"
        "   Provide at least 3 candidates. Each candidate must have all 4 fields (title, principleId, principleName, description).\n"
        "   Use the principleId and principleName from the browse_contradiction_matrix tool result."
    ),
    tools=[
        McpToolset(connection_params=connection_params)
    ]
)
