// Pure candidate extraction from agent advice text.
//
// Both TRIZ and ideation agents append a fenced JSON block after their
// narrative output. This module extracts and validates that block,
// assigning deterministic IDs (${source}-${index}) to each candidate.
//
// Never throws: returns [] on any failure (missing block, malformed JSON,
// wrong shape, empty array).

export interface TrizCandidate {
  id: string;
  title: string;
  principleId: string;
  principleName: string;
  description: string;
}

export interface IdeationCandidate {
  id: string;
  title: string;
  mechanism: string;
  whyItWorks: string;
  tradeoffs: string;
}

export type Candidate = TrizCandidate | IdeationCandidate;

// Finds the LAST fenced JSON block in the text.
// Handles both ```json and ``` fences. Returns parsed JSON or null.
export function extractJsonBlock(text: string): unknown | null {
  // Match all fenced blocks, then take the last one.
  const fenceRe = /```(?:json)?\s*([\s\S]*?)```/gi;
  let lastMatch: string | null = null;
  let match: RegExpExecArray | null;

  while ((match = fenceRe.exec(text)) !== null) {
    lastMatch = match[1].trim();
  }

  if (!lastMatch) return null;

  try {
    return JSON.parse(lastMatch);
  } catch {
    return null;
  }
}

// Extracts candidates from agent advice text.
// source determines the expected field shape and ID prefix.
// Returns [] on any failure — never throws.
export function extractCandidates(
  adviceText: string,
  source: 'triz' | 'ideation'
): Candidate[] {
  const parsed = extractJsonBlock(adviceText);
  if (parsed === null || typeof parsed !== 'object') return [];

  // The agent wraps candidates in { "candidates": [...] }.
  const candidatesArray = (parsed as Record<string, unknown>).candidates;
  if (!Array.isArray(candidatesArray)) return [];

  if (source === 'triz') {
    return parseTrizCandidates(candidatesArray);
  }
  return parseIdeationCandidates(candidatesArray);
}

function parseTrizCandidates(arr: unknown[]): TrizCandidate[] {
  const result: TrizCandidate[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!isValidRecord(item)) continue;
    const title = String(item.title ?? '');
    const principleId = String(item.principleId ?? '');
    const principleName = String(item.principleName ?? '');
    const description = String(item.description ?? '');
    if (!title || !description) continue;
    result.push({
      id: `triz-${i}`,
      title,
      principleId,
      principleName,
      description,
    });
  }
  return result;
}

function parseIdeationCandidates(arr: unknown[]): IdeationCandidate[] {
  const result: IdeationCandidate[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!isValidRecord(item)) continue;
    const title = String(item.title ?? '');
    const mechanism = String(item.mechanism ?? '');
    const whyItWorks = String(item.whyItWorks ?? '');
    const tradeoffs = String(item.tradeoffs ?? '');
    if (!title || !mechanism) continue;
    result.push({
      id: `ideation-${i}`,
      title,
      mechanism,
      whyItWorks,
      tradeoffs,
    });
  }
  return result;
}

function isValidRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
