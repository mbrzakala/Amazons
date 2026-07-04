import { describe, it, expect } from 'vitest';
import { extractJsonBlock, extractCandidates } from './candidate-parser';

describe('extractJsonBlock', () => {
  it('returns null for text with no fenced block', () => {
    expect(extractJsonBlock('just plain text')).toBeNull();
  });

  it('extracts a ```json block', () => {
    const text = 'Before\n```json\n{"a": 1}\n```\nAfter';
    expect(extractJsonBlock(text)).toEqual({ a: 1 });
  });

  it('extracts a plain ``` block', () => {
    const text = 'Before\n```\n{"b": 2}\n```\nAfter';
    expect(extractJsonBlock(text)).toEqual({ b: 2 });
  });

  it('returns the LAST fenced block when multiple exist', () => {
    const text = '```json\n{"first": true}\n```\nmiddle\n```json\n{"second": true}\n```';
    expect(extractJsonBlock(text)).toEqual({ second: true });
  });

  it('returns null for malformed JSON in the fence', () => {
    const text = '```json\n{not valid json}\n```';
    expect(extractJsonBlock(text)).toBeNull();
  });
});

describe('extractCandidates — TRIZ', () => {
  const trizAdvice = `
## Contradiction
Speed vs. Accuracy

## Actionable Technical Solutions
Solution 1: Segmentation
Solution 2: Asymmetry

\`\`\`json
{"candidates": [
  {"title": "Segment the data pipeline", "principleId": "1", "principleName": "Segmentation", "description": "Break the pipeline into independent stages"},
  {"title": "Use asymmetric processing", "principleId": "3", "principleName": "Asymmetry", "description": "Prioritize critical path processing"},
  {"title": "Apply dynamic dimensionality", "principleId": "15", "principleName": "Dynamicity", "description": "Shift dimensions based on load"}
]}
\`\`\`
`;

  it('parses exactly 3 TRIZ candidates with correct fields', () => {
    const candidates = extractCandidates(trizAdvice, 'triz');
    expect(candidates).toHaveLength(3);
    expect(candidates[0]).toEqual({
      id: 'triz-0',
      title: 'Segment the data pipeline',
      principleId: '1',
      principleName: 'Segmentation',
      description: 'Break the pipeline into independent stages',
    });
    expect(candidates[2].id).toBe('triz-2');
  });

  it('assigns IDs as triz-{index}', () => {
    const candidates = extractCandidates(trizAdvice, 'triz');
    expect(candidates.map((c) => c.id)).toEqual(['triz-0', 'triz-1', 'triz-2']);
  });
});

describe('extractCandidates — Ideation', () => {
  const ideationAdvice = `
## Problem
How to reduce latency in a real-time system.

## Idea 1: Edge Caching
...

\`\`\`json
{"candidates": [
  {"title": "Edge Caching", "mechanism": "Cache at edge nodes", "whyItWorks": "Reduces round-trip time", "tradeoffs": "Stale data risk"},
  {"title": "Predictive Prefetch", "mechanism": "Predict and preload", "whyItWorks": "Eliminates wait time", "tradeoffs": "Wasted bandwidth on wrong predictions"},
  {"title": "Async Replication", "mechanism": "Replicate asynchronously", "whyItWorks": "No blocking on writes", "tradeoffs": "Eventual consistency"},
  {"title": "Quantum Compression", "mechanism": "Compress with quantum algorithms", "whyItWorks": "Smaller payload", "tradeoffs": "Theoretical only"},
  {"title": "Mesh Routing", "mechanism": "Route through mesh network", "whyItWorks": "Shorter paths", "tradeoffs": "Complexity"}
]}
\`\`\`
`;

  it('parses exactly 5 ideation candidates with correct fields', () => {
    const candidates = extractCandidates(ideationAdvice, 'ideation');
    expect(candidates).toHaveLength(5);
    expect(candidates[0]).toEqual({
      id: 'ideation-0',
      title: 'Edge Caching',
      mechanism: 'Cache at edge nodes',
      whyItWorks: 'Reduces round-trip time',
      tradeoffs: 'Stale data risk',
    });
    expect(candidates[4].id).toBe('ideation-4');
  });
});

describe('extractCandidates — failure cases', () => {
  it('returns [] and does not throw for text with no JSON block', () => {
    expect(extractCandidates('just prose, no json here', 'triz')).toEqual([]);
  });

  it('returns [] and does not throw for malformed JSON', () => {
    const text = '```json\n{broken}\n```';
    expect(extractCandidates(text, 'ideation')).toEqual([]);
  });

  it('returns [] when candidates key is missing', () => {
    const text = '```json\n{"other": [1, 2, 3]}\n```';
    expect(extractCandidates(text, 'triz')).toEqual([]);
  });

  it('returns [] when candidates is not an array', () => {
    const text = '```json\n{"candidates": "not an array"}\n```';
    expect(extractCandidates(text, 'ideation')).toEqual([]);
  });

  it('returns [] when candidates array is empty', () => {
    const text = '```json\n{"candidates": []}\n```';
    expect(extractCandidates(text, 'triz')).toEqual([]);
  });

  it('skips items missing required fields', () => {
    const text = '```json\n{"candidates": [{"title": "OK", "principleId": "1", "principleName": "P", "description": "D"}, {"title": "No desc"}]}\n```';
    const candidates = extractCandidates(text, 'triz');
    expect(candidates).toHaveLength(1);
    expect(candidates[0].title).toBe('OK');
  });
});
