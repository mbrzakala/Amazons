---
stage: 6-ship
step: 4
source: Hackathon Wiki/stages/6-ship/steps/4-ship-checklist.md
---

# Validator — 4. Ship Checklist: Repo, Wiki, Submission

Checks: `Hackathon Wiki/stages/6-ship/steps/4-ship-checklist.md`.

Last step of stage 6 — once it passes, the whole hackathon workflow is done.

## What this step is proving

The logistics that make the product actually submittable and judge-reviewable are
closed out: the wiki is committed into the product repo, `START.md`/`PRODUCT.md` are
updated per their own setup instructions, the submission bundle is complete, and the
live URLs were re-checked immediately before submitting — not assumed from an earlier
deploy.

## Evidence to gather

- The product repo's git history/tree for a `/wiki` folder matching this Hackathon
  Wiki's content.
- `START.md`'s `challenge-assigned` frontmatter field and `PRODUCT.md`'s repo field.
- The assembled submission bundle: repo link, live deployed URL(s), pitch material.
- A timestamp on the last live-URL check, compared against the actual submission
  time.

## Gate checklist

1. **The wiki folder is committed into the product repo at `/wiki`.**
   Evidence: git log/tree of the product repo.
2. **`START.md`'s `challenge-assigned` is set to `true` and `PRODUCT.md`'s repo field
   is filled in.**
   Evidence: frontmatter/content of both files.
3. **The submission bundle (repo link, live URLs, pitch material) is complete per the
   event's actual rules.**
   Evidence: the assembled bundle against the event's Discord rules doc.
4. **The live URLs in the submission were re-checked right before submitting, not
   assumed from an earlier deploy.**
   Evidence: timestamp of the last URL check vs. submission time — fail if the check
   predates a later redeploy.

See `agent_doc/README.md` for the verdict scale and reporting format.
