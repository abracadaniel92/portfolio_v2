---
name: text-checker-en
description: Proofread and clarity-check English prose, then return a report plus a full rewrite. Use when asked to review, improve, simplify, tighten, proofread, or punctuation-check any written text, including blog post drafts, site copy, and README or docs prose. Triggers on "review this text", "proofread", "make it clearer", "tighten this up", "check my draft", "does this read well", "fix the em-dashes". English only. Owns the sentence-level pass: mechanics, comprehension, flow, the AI-tell blocklist, and plain-language swaps. Structural work on a blog post (choosing an archetype, outlining, deciding what a post should say) belongs to blog-post-writer instead.
---

# Text Checker (English)

Three-phase review of any English prose: (0) **mechanics**, typos, grammar,
punctuation; (1) **comprehension**, would a first-time reader understand it?
(2) **flow**, does it read smoothly? Output a short report of issues, then a full
rewrite.

English only. This is the adapted English-language variant of the multilingual
`text-checker` in the `product_manager_skills` repo. If the input is not English,
say so and stop rather than translating.

## When to use

- "Review this text" / "improve this" / "make it clearer"
- "Proofread" / "simplify" / "tighten this up"
- A line-level pass over a blog draft, site copy, or docs prose

**Do NOT use for:** code review, translation, generating content from scratch,
or fact-checking. **Deciding what a blog post should say** (archetype, spine,
opening, whether it is honest enough) belongs to `blog-post-writer`. This skill
takes the draft as given and fixes how it reads. The two are meant to be run in
sequence: structure first, then this.

## Phase 0 — Mechanics

Catch surface breakage before anything else. These need fixing regardless of style.

| Issue | Example |
|---|---|
| Typos | "recieve" → "receive", "Sovereign" spelled two ways in one file |
| Grammar / agreement errors | "the team are" → "the team is" (or make it consistent) |
| Truncated or mid-word cutoffs | a sentence ending "and then the parall" |
| Tense shifts inside a paragraph | mixed past/present with no reason |
| Inconsistent spelling of the same term | "multi-tenancy" vs "multitenancy" |
| Broken markdown | unclosed code fence, broken list nesting, orphan link |
| Straight vs curly quotes, used inconsistently | pick one and hold it |
| **Em dash or en dash** | Never output `—` or `–`. Replace with a comma, colon, parentheses, or period. En dash is allowed **only** in a numeric range (`2023–25`). |

If a passage is truncated or missing information, do not invent the rest. Mark
it (see Marker Convention).

## Phase 1 — Comprehension

Ask: *could someone reading this cold, with no prior context, follow it?*

| Issue | Example |
|---|---|
| Undefined jargon or acronyms | "K8s", "CQRS", "the API", "SOC 2" on first use |
| Implicit context | "as discussed", "the usual approach", "you know the one" |
| Vague pronouns | "it", "this", "they" with no clear antecedent |
| Buried subject | passive constructions hiding who acted |
| Dense noun stacks | "revenue optimization framework deployment" |
| Missing gloss on first use | a new concept introduced with no one-line explanation |

## Phase 2 — Flow

Read it through. Note where you stumble.

| Issue | Fix |
|---|---|
| Monotone rhythm (all long or all short) | Vary sentence length |
| Missing connectives between ideas | Add "however", "because", "so", "but" |
| Buried lede, main point in paragraph 3 | Move it to paragraph 1 |
| Redundancy: "in order to", "due to the fact that" | "to", "because" |
| Passive where active is clearer | "X was done by Y" → "Y did X" |
| Filler: "basically", "actually", "in terms of" | Cut |
| Weak opener: "There is...", "It is..." | Lead with the real subject |
| Antithesis tic: "it's not X, it's Y" | State the point directly. Or, if the contrast carries real information, give it its own sentence: "Y. X was never the constraint." |

## The AI-tell blocklist

This skill is the canonical home for this list. Zero tolerance: every hit gets
rewritten, and every hit goes in the report.

**Phrases:** "I'm excited to share" · "in today's fast-paced world" · "in the
ever-evolving landscape of" · "it's worth noting that" · "here's the thing" ·
"let's dive in" / "let's unpack" · "at the end of the day" · "game-changer" ·
"a testament to" · "the key takeaway" · "buckle up" · "spoiler alert"

**Words that almost always mean nothing:** delve · leverage (as a verb) ·
robust · seamless · streamlined · holistic · cutting-edge · myriad · plethora ·
utilize · elevate · unlock (figurative) · empower · journey (figurative) ·
landscape (figurative)

**Structural tells:**
- Opening with a rhetorical question
- The "not X, but Y" antithesis used more than once in a piece
- Rule-of-three lists where the third item is filler ("faster, cheaper, and more
  scalable")
- Every bullet starting with a bolded lead-in phrase
- A closing paragraph that restates the piece
- Perfectly uniform paragraph lengths
- Hedging stacks: "it's important to note that it may potentially"

## Phase 3 — Output

Two sections:

```
## Report
- [Mechanics] "exact quote" → suggestion
- [Comprehension] "exact quote" → suggestion
- [Flow] "exact quote" → suggestion
- [Blocklist] "exact quote" → suggestion

## Rewrite
[full rewritten text]
```

Group by phase when there are many issues. One bullet per real issue. Do not
invent issues to look thorough: "no issues in this phase" is a valid finding and
a useful one.

## Marker convention

When the rewrite needs information you do not have, leave an inline marker.
Never fabricate the missing content.

- `[TODO: <what is missing>]` — content was truncated, ambiguous, or unknown
  *Example:* `The migration took [TODO: actual duration] against a two-week estimate.`
- `[QUESTION: <question for the author>]` — a clarification needed before publishing
  *Example:* `We cut the bill by 38% [QUESTION: is this figure public?].`

Markers stay on one line, in square brackets, so the author can grep them out.
Every marker also appears as its own bullet in the Report.

## Rewrite rules

1. **Preserve voice and intent.** Fix what blocks comprehension. Do not
   neutralize the author. A rewrite that sounds like nobody in particular has
   failed even if every sentence is correct.
2. **Cut, do not add.** If the rewrite is longer than the original, you probably
   failed. State the before and after word count in the report.
3. **Plain words win.** "use" not "utilize", "help" not "facilitate", "now" not
   "at this point in time".
4. **Do not fabricate.** If a passage is unclear because information is missing,
   flag it. Never invent a fix.
5. **Place a gloss where it cannot break the sentence.** Glossing jargon on
   first use is Phase 1's job, but an appositive dropped between a subject and
   its verb creates a garden-path sentence and can smuggle in a claim the
   author never made. Put the gloss in its own following sentence, or in
   parentheses at the end of the clause. Never mid-clause. If the surrounding
   text already explains the phenomenon in plain words, the better fix is to
   cut the jargon rather than define it: check whether the term is needed at
   all before glossing it. After adding any gloss, re-read the full sentence
   as a sentence, not as a diff.
6. **Match the audience's level.** Clarity is not talking down. A specialist text
   stays specialist. Remove only what blocks the specialist reader.
7. **Keep formatting.** Markdown structure, lists, headings, and code blocks stay
   intact unless they are the problem.
8. **Preserve structured documents.** If the text is structured (a README, a
   changelog, a doc with required sections), keep its scaffolding. Fix mechanics,
   clarity, flow, and punctuation only. Do not turn a structured doc into an essay.
9. **Never rewrite quoted material or code.** Quotes, log output, error messages,
   and code samples are evidence. Flag a problem in them; do not silently fix it.

## Common mistakes

| Mistake | Why it is wrong |
|---|---|
| Using an em dash or en dash anywhere in the rewrite | Zero tolerance, not a matter of degree. Replace it even where it would read naturally |
| Rewriting into corporate or "professional" tone | Plain prose is clearer than business-speak, and this site does not use it |
| Leaning on "not X but Y" to sound punchy | One lands. A page of them reads as a tic and every claim starts to sound like a reveal |
| Padding to sound thorough | Adds noise, hurts comprehension |
| Over-simplifying technical content | Strips the meaning the author needed |
| Inventing facts to smooth over gaps | The author owns the claims, not you |
| Skipping the report, going straight to rewrite | The author needs to know what changed and why |
| Sanding off the author's opinions | Hedging a strong claim into neutrality is a content change disguised as an edit. Flag it, do not do it |

## Plain-language swaps

utilize→use · in order to→to · due to the fact that→because · a number of→several ·
facilitate→help · at this point in time→now · prior to→before · subsequent to→after ·
in the event that→if · has the ability to→can · make a decision→decide ·
is able to→can · at this juncture→now · with regard to→about

Same principle for anything not on the list: prefer the shortest natural way to
say it.

## References

- `../blog-post-writer/SKILL.md` — structural and developmental editing for posts.
  Run that first, this second
- `../blog-post-writer/reference/voice.md` — the blog's register, and where this
  skill sits in its six-step editing pass
- `../../../CLAUDE.md` — repo hard rules, including the em-dash ban
- Source: `product_manager_skills/text-checker/SKILL.md`, the multilingual original
