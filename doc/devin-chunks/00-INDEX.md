# Devin Execution Chunks — Index

This folder breaks `doc/frontend-ui-implementation-plan.md` (the master plan — read that first if you need the *why*, not just the *what*) into 18 small, sequential, self-contained chunks. Each chunk is one file you hand to Devin IDE as a single prompt/session. This index is not itself a task — it's the map.

## Why chunked this way

A weaker/free-tier model executing a large open-ended plan in one shot tends to either run out of context mid-task or quietly drop earlier constraints (tokens, accessibility rules, "no Tailwind") once the prompt gets long. The fix isn't just "make it small" — a chunk with no context is just as unreliable as a chunk with too much, because the model will invent its own conventions to fill the gap (wrong color values, wrong component API, wrong file location). So every chunk here is sized to **one cohesive deliverable** (usually 1-3 files) and carries **only the context that deliverable needs** — not the whole design system, just the token names it touches; not the whole wireframe, just its relevant fragment.

## Rules every chunk follows

1. **Depends on** lists exactly which earlier chunk(s) must be done first, and *what specifically* from them this chunk consumes (a file path, an exported symbol, a token name) — so Devin can go verify that thing exists before starting, rather than assuming.
2. **Context recap** is deliberately short. It restates only the facts this chunk needs. Full detail always lives in `doc/frontend-ui-implementation-plan.md` — chunks point back to it by section instead of re-pasting it.
3. **Out of scope** is explicit in every chunk. This is the main defense against scope creep eating the next chunk's work (e.g., the shell chunk must not start styling the Problem Input screen just because it's easy to see how).
4. **Definition of done** is mechanically checkable (a file exists with X in it, a build/lint passes, a specific behavior is observable) — never "looks right."
5. Chunks are numbered in required execution order. Do not skip ahead — later chunks assume earlier files exist exactly as specified.

## Before chunk 01: one operator prerequisite (not a code chunk)

The master plan's Phase 0 also calls for connecting Chrome DevTools MCP and Modern Web Guidance to Devin's own environment and verifying them with one deliberately-introduced bug (remove a template binding, confirm Devin reports the real console/network error unaided, without anyone pasting the error in manually) — done now, proactively, not during an actual mid-build debugging crisis. This is a one-time check of Devin's own tool access, not a UI deliverable, so it isn't one of the 18 numbered chunks below. Do it once, before chunk 01, and log that it happened (a line in this folder's README is enough) so it doesn't get skipped.

## Dependency graph (execution order)

```
01 tokens+contrast ──┬─────────────────────────────────────────────────────────────┐
02 fonts+typography ─┤                                                             │
03 ng-diagram setup ─┼── (independent, only needed again at 16)                    │
                     │                                                             │
04 card anatomy+cmp ◄┘                                                             │
05 icon-btn+chip    ◄── 01                                                        │
06 form fields      ◄── 01                                                        │
07 button           ◄── 01, 05                                                    │
                                                                                    │
08 shell nav        ◄── 01, 05                                                    │
09 session+routing  ◄── 08                                                        │
                                                                                    │
10 Screen A          ◄── 04, 06, 07, 09                                           │
                                                                                    │
11 config+fake API  ◄── 09                                                       │
                                                                                    │
12 reformulation card ◄── 04, 05, 01                                             │
13 solution card/stack ◄── 05, 04, 01                                            │
14 Screen B wiring   ◄── 12, 13, 11, 09                                          │
                                                                                    │
15 evaluation table  ◄── 01, 11                                                  │
16 ng-diagram trail   ◄── 03, 09, 11                                             │
17 Screen C wiring    ◄── 15, 16, 09                                             │
                                                                                    │
18 ship checklist     ◄── 10, 14, 17 (everything built) ◄────────────────────────┘
```

Chunks 01–03 can run in parallel (no shared files). 04–07 can mostly run in parallel once 01 is done. Everything from 08 onward is sequential per the arrows above.

## Chunk list

| # | File | Deliverable |
|---|---|---|
| 01 | `01-design-tokens-and-contrast.md` | Global CSS custom properties + contrast audit |
| 02 | `02-fonts-and-typography.md` | Geist + JetBrains Mono loaded, base typography wired |
| 03 | `03-ng-diagram-setup.md` | `ng-diagram` installed, real API confirmed and noted |
| 04 | `04-card-anatomy-and-component.md` | R&D Card anatomy doc + `Card` shared component |
| 05 | `05-icon-button-and-status-chip.md` | `IconButton` + `StatusChip` shared components |
| 06 | `06-form-field-atoms.md` | `LabeledTextarea` + `LabeledInput` shared components |
| 07 | `07-button-component.md` | `Button` shared component (primary/secondary) |
| 08 | `08-shell-nav-components.md` | `TopNav` + `SideNav` shell components |
| 09 | `09-session-service-and-routing.md` | `SolveSessionService` skeleton + real routing, `NxWelcome` removed |
| 10 | `10-screen-a-problem-input.md` | Full Problem Input screen (layout + submit logic) |
| 11 | `11-config-and-fake-data-layer.md` | `ConfigProvider` + interceptor + fake data service |
| 12 | `12-reformulation-cards.md` | TRIZ reformulation card + generic method card + Six-Hats grid |
| 13 | `13-solution-card-and-stack.md` | `SolutionCard` + `SolutionStack` components |
| 14 | `14-screen-b-pipeline-wiring.md` | Full Comparison Pipeline screen |
| 15 | `15-evaluation-table.md` | Evaluation Table component |
| 16 | `16-ng-diagram-reasoning-trail.md` | Reasoning Trail diagram (setup + data binding) |
| 17 | `17-screen-c-evaluation-wiring.md` | Full Evaluation & Reasoning Trail screen |
| 18 | `18-ship-checklist-verification.md` | Nx boundaries check (conditional), accessibility pass, WCS baseline, visual verification |

## How to use

Feed exactly one chunk file's contents to Devin per session. When Devin reports the Definition of Done met, verify it yourself (the DoD items are written so you can check them without re-reading the whole plan), then move to the next number. If a chunk fails or gets stuck, do not paste the next chunk on top — fix or re-run the current one; the dependency graph means downstream chunks will silently build on a broken foundation otherwise.
