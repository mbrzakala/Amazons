# TRIZ Basics

TRIZ is a 1940s engineering method built on one observation: most inventions solve a *contradiction* — improve one thing, and something else gets worse (make it stronger, it gets heavier).

Engineers had already solved thousands of these contradictions before, so TRIZ catalogued the patterns:

- **39 parameters** — standard tradeoff traits (weight, speed, reliability, loss of time, etc.)
- **40 inventive principles** — abstract fix-strategies (Segmentation, Do It in Reverse, Sacrificial Element, etc.)
- **The contradiction matrix** — a 39×39 table: pick the parameter you're improving and the one that's getting worse, and it points to the principles that historically resolved that exact clash.

Nothing in [[How the Server Works|this repo's code]] invents any of this — it all comes from the `pytriz` package. The code just exposes it as callable tools. See [[SIMPLE - how to use]] for the quick start, and [[Hackathon Playbook]] for applying this outside engineering.
