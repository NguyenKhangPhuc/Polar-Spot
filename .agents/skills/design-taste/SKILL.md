---
name: design-taste
description: Taste rules for color, layout, and information display when building UI, websites, or apps. Use this skill whenever creating or editing an interface, website, component, dashboard, or landing page — even if the user doesn't explicitly say "design" but instead says "build a UI", "make a website", "make an app", "create a page", or "fix the layout". This skill specifically bans clichéd AI-generated icons (rocket, sparkles, lightbulb, target, etc.) and forces deliberate choices for color, layout, and data presentation instead of generic defaults. Always consult this skill alongside the frontend-design skill when both are relevant.
license: Complete terms in LICENSE.txt
---

# Design Taste

A fast, applicable rulebook for color, layout, and information display in any UI build or edit. The goal: interfaces that read as the work of a designer with real taste, not generic AI output.

## 1. No clichéd icons

This is a hard rule, non-negotiable.

**Never use** the following icons/emoji (or their equivalents) to decorate headings, feature cards, or bullet points:
- Rocket — a hollow "launch/growth" symbol
- Sparkles — a hollow "AI magic" symbol
- Lightbulb — a hollow "idea" symbol
- Target/dartboard — a hollow "goal" symbol
- Rising diagonal chart arrows, handshake, fire, decorative lightning bolt, decorative shield, brain, trophy, starburst
- Any icon chosen because it "sounds catchy" (launch, growth, innovation, power, magic) rather than because it accurately describes what that element actually does

**Why this is banned:** these icons carry no information — they're emotional placeholders that show up everywhere in AI-generated content, and they make an interface look cheap and undirected.

**What to use instead:**
- Standard functional icons (from a consistent set like Lucide, Phosphor, Heroicons) only when they represent a specific, concrete action or object: "trash" for delete, "download" for download, "search" for search — never metaphorical icons.
- If no icon accurately represents the concept, **don't use one** — use a number, an initial letter, or nothing at all. Empty space beats a mismatched icon.
- Before inserting any icon, ask: "If this icon disappeared, would the user lose any information?" If the answer is no, drop it.

## 2. Color taste

Don't default to instantly-recognizable "AI-generated" palettes: (a) cream background (~#F4F1EA) + high-contrast serif + terracotta accent, (b) near-black background + a single bright green/red accent, (c) generic SaaS purple-blue gradient. These are valid if the brief calls for them, but never default to them.

**Deliberate color process:**
1. Nail down the real subject/industry of the product first (a serious fintech app is not a handcrafted coffee shop is not a wellness app). Color should come from that subject's real world — its materials, light, cultural context — not "generically nice colors."
2. Lock a palette of 4–6 named hex values (e.g., `--ink: #1A1D1F`, `--accent: #C4622D`), not a bare list of hex codes.
3. One dominant background color, one primary text color with sufficient contrast (WCAG AA minimum, ≥4.5:1 contrast ratio for body text), one accent color used sparingly, and one or two supporting neutrals (borders, secondary surfaces, muted text).
4. The accent should only appear where attention genuinely needs to be drawn: the primary CTA, active states, the single most important metric. If the accent shows up everywhere, it's no longer an accent.
5. Dark mode (if present) isn't a mechanical light↔dark inversion — adjust saturation and brightness per color to preserve the original palette's feel.
6. Avoid decorative, meaningless gradients (random purple→pink) unless the gradient actually serves the subject (e.g., a weather app using a sky gradient).

## 3. Layout taste

**Structure must reflect the actual nature of the content**, not a pre-set template:
- Only use an even 3-column card grid when the content is genuinely parallel, independent items of equal importance. If one item matters far more than the others, don't give it the same size as the rest.
- Only number items (01 / 02 / 03) when the content genuinely has a sequence (a process, steps, a timeline). Don't number an unordered feature list — that's empty decoration.
- Visual hierarchy must match actual information hierarchy: the most important element should be the largest/boldest/most prominent, not whatever was added last.
- Whitespace is a layout tool, not leftover space. Use it to group related elements close together and separate unrelated ones — the proximity principle.
- Align consistently to a grid (8px or 4px base); avoid arbitrary padding/margin values scattered around.
- For dashboards/data tables: prefer a table or clear list for multi-attribute data that needs comparison; only use cards when each item is genuinely a standalone entity worth viewing individually, not a data row awkwardly "card-ified" for looks.

## 4. Information display taste

- Don't pad the page with vanity metrics styled as "big number + small label + gradient accent" unless that number is something the user genuinely needs to know right now. A metric only earns emphasis when it's the thing users actually need.
- Empty and error states must clearly explain what happened and how to fix it, in the system's own voice — never vague, never a sad emoji standing in for real content.
- Labels should name exactly what the user controls ("Save changes," not a generic "Submit"), and an action keeps the same name throughout a flow (a "Publish" button leads to a "Published" toast).
- Don't repeat the same information through two different decorative forms at once (e.g., a metaphorical icon plus a colored badge plus a text label, all for the same status). Pick the clearest single representation and use only that.

## 5. Self-check before finishing

Before delivering the final result, ask:
- Did any clichéd icon (rocket, sparkles, lightbulb, target, etc.) slip in? → Remove it or replace with a genuinely functional icon, or drop it entirely.
- Does the color palette come from the real subject, or is it "generically nice" and could apply to any other product? → If renaming the product wouldn't break the palette's fit, it isn't deliberate enough.
- Is the layout following a pre-set template (3-column grid, 01/02/03 numbering) without a content-driven reason? → Reconsider.
- Does text/background contrast meet readability standards, especially for secondary/muted text?
- Is the accent color being overused across too many elements?

When working alongside the `frontend-design` skill, use `frontend-design` for the overall process (brainstorm → token system → build → critique), and use this `design-taste` skill as a hard-rule checklist applied at every stage, especially the final pass before delivering output.