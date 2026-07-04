from google.adk import Agent
from google.genai import types
from pydantic import BaseModel, Field


class CandidateScore(BaseModel):
    """Structured score for a single candidate solution."""
    candidate_index: int = Field(
        description="The 0-based index of the candidate in the input list."
    )
    feasibility: float = Field(
        description="How practical and implementable the solution is, 0.0 to 1.0."
    )
    novelty: float = Field(
        description="How original and non-obvious the solution is, 0.0 to 1.0."
    )
    impact: float = Field(
        description="How much the solution addresses the core problem, 0.0 to 1.0."
    )
    risk: float = Field(
        description="How risky or uncertain the solution is, 0.0 to 1.0."
    )


class EvaluationResult(BaseModel):
    """Structured evaluation output containing scores for all candidates."""
    scores: list[CandidateScore] = Field(
        description="A score for each candidate, in the same order as the input."
    )


generation_config = types.GenerateContentConfig(
    temperature=0.3,
    top_p=0.95,
)

root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    generate_content_config=generation_config,
    instruction=(
        "You are BuildWithAI-Evaluator, a critical engineering evaluation agent.\n\n"
        "You receive a problem description and a list of candidate solutions (each with a title and description).\n"
        "Your job is to score each candidate on four dimensions, all on a 0.0–1.0 scale:\n\n"
        "- feasibility: How practical and implementable is this solution with current technology and resources?\n"
        "- novelty: How original and non-obvious is this approach compared to conventional solutions?\n"
        "- impact: How thoroughly does this solution address the core problem?\n"
        "- risk: How much uncertainty, downside, or potential for failure does this solution carry?\n\n"
        "Be rigorous and critical. Do not inflate scores. A solution that is easy to implement but "
        "unoriginal should get high feasibility but low novelty. A solution that fully solves the "
        "problem but is very risky should get high impact and high risk.\n\n"
        "Return a score for every candidate, using the 0-based index from the input list."
    ),
    output_schema=EvaluationResult,
)
