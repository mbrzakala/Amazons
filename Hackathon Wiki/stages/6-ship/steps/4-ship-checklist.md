---
stage: 6-ship
task: 4
---

# 4. Ship Checklist: Repo, Wiki, Submission

**What to do:** Close out the logistics that make the product actually submittable and judge-reviewable, not just "working on my machine."

**How:**
1. Commit this wiki folder into the product repo as `/wiki`, so a fresh Devin/Claude session (or a judge poking at the repo) reads `wiki/START.md` directly — no pasting context around.
2. Set `challenge-assigned: true` in `START.md`'s frontmatter and fill in `PRODUCT.md`'s repo field, per `START.md`'s own setup instructions.
3. Confirm the submission has everything the event's rules require: repo link, live deployed URL(s), and any pitch material, gathered in one place.
4. Do a final check that the deployed URLs in the submission match what's actually live right now — not an earlier deploy.

**Recommended tool:** Write directly — git commit the wiki folder, edit `START.md`/`PRODUCT.md`, and assemble the submission per the event's Discord rules doc.

## Gate

- [ ] The wiki folder is committed into the product repo at `/wiki`.
- [ ] `START.md`'s `challenge-assigned` is set to `true` and `PRODUCT.md`'s repo field is filled in.
- [ ] The submission bundle (repo link, live URLs, pitch material) is complete per the event's actual rules.
- [ ] The live URLs in the submission were re-checked right before submitting, not assumed from an earlier deploy.

Last task — once it passes, the stage is done.

## Result
