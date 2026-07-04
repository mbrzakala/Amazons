---
stage: 1-discovery
supports: problem-6
---

# Problem 6 research — Improving desalination (SDG 6/7)

Filtered for one thing: levers that raise freshwater output without a proportional rise
in energy demand or equipment strain (the stated contradiction). Background material
on what desalination is, general SDG framing, etc. is deliberately excluded — the
[[../../stages/1-discovery/contest task|contest task]] already covers that.

## Levers that cut energy per liter (output ↑, energy flat)

**Isobaric pressure exchangers (ERD)** — recover hydraulic pressure from the reject
brine stream and hand it straight to incoming feed, cutting the high-pressure pump's
load by up to 60% (some vendor claims of ~97% device efficiency). Mature, retrofittable
tech: 35,000+ units installed, ~36M m³/day capacity, ~$6B/yr saved industry-wide.
[Energy Recovery](https://energyrecovery.com/resources/highly-efficient-energy-recovery-devices/) ·
[ScienceDirect overview](https://www.sciencedirect.com/topics/engineering/energy-recovery-device)

**Batch / true-batch RO (flexible-bladder design)** — varies feed pressure over time to
track the rising osmotic pressure of the batch, instead of holding one high pressure for
the whole run. MIT's 2025 flexible-bladder pilot hit 82.6% recovery at 3.3 kWh/m³
(seawater RO is typically ~3.5–4+ kWh/m³), with a scale-up model projecting <1 kWh/m³.
Time-varying flow also reduces membrane exposure to peak fouling conditions — one lever,
two payoffs (energy + wear).
[MIT pilot writeup](https://www.nature.com/articles/s41545-025-00462-6) ·
[Lienhard group](https://lienhard.mit.edu/reverse-osmosis/)

**FO-RO hybrid (osmotic dilution)** — forward osmosis pulls water out of a low-value
feed (wastewater) into the seawater, diluting it *before* RO, so RO runs at lower
pressure for the same permeate. Demonstrated: 90% wastewater recovery + RO energy at
0.96 kWh/m³ (under the 1 kWh/m³ mark); a hollow-fiber FO variant let RO run at 25 bar for
unchanged 60% recovery. Bonus: reclaims a wastewater stream as a second freshwater
source, which is a direct output increase, not just an efficiency gain.
[90% recovery study](https://www.sciencedirect.com/science/article/pii/S0011916424004788) ·
[hollow-fiber FO-RO](https://www.nature.com/articles/s41545-021-00143-0)

**Pressure-retarded osmosis (PRO) on reject brine** — instead of discharging brine (a
harmful/wasted output), run it through PRO to extract osmotic energy and feed that back
into the plant. Converts a disposal liability into a power source.
[RO-PRO hybrid](https://www.sciencedirect.com/science/article/abs/pii/S0376738819300407)

## Levers that cut equipment strain (wear ↓, independent of output)

**Closed-circuit / batch operation reduces fouling exposure** — continuously varying the
water composition at the membrane surface (rather than constant flow) suppresses
inorganic scaling, organic fouling, and biofouling. Relevant because fouling/scaling is
cited as 25–50% of total RO operating cost and is the direct driver of the "equipment
wear" half of the problem statement (higher differential pressure → membrane damage,
more frequent chemical cleaning).
[Fouling cost review](https://www.sciencedirect.com/science/article/pii/S2772416625000968) ·
[CCRO fouling mechanism](https://thesourcemagazine.org/fouling-and-scaling-in-seawater-reverse-osmosis-desalination/)

## Levers that target the energy-access constraint specifically

**Battery-free solar-matched RO** — MIT's community-scale system adjusts desalination
rate in real time to match fluctuating solar output, no battery buffer needed (batteries
are themselves an equipment-strain/waste liability). Field-tested 6 months in New
Mexico: >94% utilization of generated solar power, up to 5,000 L/day.
[MIT News](https://news.mit.edu/2024/solar-powered-desalination-system-requires-no-extra-batteries-1008)

**Low-grade waste-heat-driven thermal desalination** — uses reject heat from industrial
processes or power generation (60°C+, otherwise discarded) instead of new primary
energy. Reported 55.25 kg/(m²·h) distillate at 90.7% heat-conversion efficiency from a
60°C source. Directly answers "expensive/limited energy access": the energy is already
there and already paid for.
[Low-grade heat driven desalination](https://www.sciencedirect.com/science/article/abs/pii/S0360544218316578)

**Solar-thermal, brine-free ("superwicking") desalination** — laser-etched superwicking
metal panels desalinate via solar heat with no brine byproduct at all, removing the
energy/cost of brine handling and disposal entirely. Early-stage; output-rate-at-scale
data not yet established — flag as promising, not yet provable.
[TechXplore, May 2026](https://techxplore.com/news/2026-05-solar-powered-desalination-ocean.html)

## Filtered OUT (dead end unless paired with a system redesign)

**Advanced membrane materials alone (graphene oxide / aquaporin biomimetic membranes)**
— achieve higher permeance and salt rejection than commercial thin-film composite
membranes, but a more-permeable membrane does not meaningfully cut energy consumption
under today's single-stage, high-pressure-pump RO architecture. Only worth revisiting
if paired with a low-pressure/multi-stage system redesign — not a standalone answer to
this problem.
[Aquaporin-GO membrane](https://pmc.ncbi.nlm.nih.gov/articles/PMC8529452/)

## Possible TRIZ angles surfaced by this research (not a decision — team calls the official contradiction/parameters)

- Segmentation / local quality in time → batch & CCRO (vary pressure/composition over
  time instead of one constant harsh condition)
- Convert harmful factor into useful → PRO on brine, waste-heat reuse
- Merging → FO-RO and solar-thermal+RO hybrids (combine two processes so one offsets
  the other's energy cost)
- Feedback / self-adaptation → solar-matched RO control loop replacing battery buffering
- Another dimension / different physical effect → brine-free solar-thermal wicking
  avoids the pressure-driven wear problem altogether rather than mitigating it

## Sources
- [Energy Recovery — PX pressure exchanger](https://energyrecovery.com/resources/highly-efficient-energy-recovery-devices/)
- [ScienceDirect — Energy Recovery Device overview](https://www.sciencedirect.com/topics/engineering/energy-recovery-device)
- [npj Clean Water — batch RO flexible-bladder pilot](https://www.nature.com/articles/s41545-025-00462-6)
- [MIT Lienhard Research Group — Reverse Osmosis](https://lienhard.mit.edu/reverse-osmosis/)
- [ScienceDirect — FO-RO hybrid, 90% recovery below 1 kWh/m³](https://www.sciencedirect.com/science/article/pii/S0011916424004788)
- [npj Clean Water — hollow-fiber FO-RO hybrid](https://www.nature.com/articles/s41545-021-00143-0)
- [ScienceDirect — RO-PRO hybrid energy recovery from brine](https://www.sciencedirect.com/science/article/abs/pii/S0376738819300407)
- [ScienceDirect — RO fouling cost review](https://www.sciencedirect.com/science/article/pii/S2772416625000968)
- [The Source Magazine — fouling and scaling mechanisms](https://thesourcemagazine.org/fouling-and-scaling-in-seawater-reverse-osmosis-desalination/)
- [MIT News — battery-free solar-powered desalination](https://news.mit.edu/2024/solar-powered-desalination-system-requires-no-extra-batteries-1008)
- [ScienceDirect — low-grade waste heat driven desalination](https://www.sciencedirect.com/science/article/abs/pii/S0360544218316578)
- [TechXplore — brine-free solar-thermal desalination, May 2026](https://techxplore.com/news/2026-05-solar-powered-desalination-ocean.html)
- [PMC — aquaporin/graphene oxide biomimetic membrane](https://pmc.ncbi.nlm.nih.gov/articles/PMC8529452/)
