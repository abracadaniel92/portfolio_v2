# Voice and the editing pass

The site copy is clipped by design. The blog is warmer and looser. This file
calibrates how far, and gives the editing pass that gets a draft there.

**Division of labour:** this file covers *register and structure*. The
sentence-level mechanical pass (typos, grammar, clarity, flow, the AI-tell
blocklist, plain-language swaps) belongs to the `text-checker-en` skill in this
repo. Do not restate its rules here. Run it as step 5 of the pass below.

## How far "looser" goes

| Site copy | Blog |
|---|---|
| `On time.` | "It shipped on the date we said it would, which surprised me more than it should have." |
| `Ran R&D modernization across 150+ engineers.` | "I spent two years trying to get 150 engineers to agree on what 'production' meant." |
| Fragments, no verbs | Full sentences, varied length |
| No first person | First person throughout |
| No humor | Dry, in passing, never a bit |

What loosens: contractions, sentence length, first person, asides, the
occasional joke that does not stop to check whether you noticed.

What does not loosen: the specificity, and the ban on marketing register. A
warmer sentence is still a sentence with a number in it. "It surprised me more
than it should have" earns its place only because the sentence before it was
concrete.

## Warmth without slop

Warmth in this voice comes from **admission**, not from adjectives.

- Cold and abstract: "The migration presented several challenges."
- Warm and slop: "Buckle up, because this migration was a wild ride!"
- Warm and concrete: "I budgeted a weekend for the migration. It took nine days,
  and six of those were one foreign key I had misread."

The third is warm because it admits something, not because it uses friendly
words. This is the single most useful distinction in the file.

## The editing pass

Run in order. Do not skip step 1 because the opening "seems fine". It is the
step with the highest hit rate.

1. **Delete the first paragraph.** Read what remains. If the post still makes
   sense, and it usually does, the deletion stands. Restore only the specific
   facts that were load-bearing, as a clause somewhere later.

2. **Kill every adjective that is not load-bearing.** An adjective is
   load-bearing if removing it changes the meaning, not the temperature.
   "A nine-day migration" keeps its adjective. "A challenging migration" loses it
   and gains a number instead.

3. **Ground or cut every claim.** Go claim by claim. Each one needs a number, a
   name, a date, or a concrete instance attached. Claims that cannot be grounded
   are either things you do not actually know, or filler. Both get cut.

4. **Check the honesty quota.** Find the sentence admitting something went wrong,
   cost more than expected, or would be done differently. If there is no such
   sentence, the draft is marketing and needs one before it goes further.

5. **Run `text-checker-en`.** The full mechanical pass: mechanics, comprehension,
   flow, blocklist, em-dashes, plain-language swaps. Apply its rewrite, then come
   back here.

6. **Read the first and last sentence together.** They should feel like they
   belong to one piece and the last should not restate the first. If the last
   sentence summarizes, delete it and check the one before. Keep deleting until
   you reach a sentence with something concrete in it. That is the real ending.

## Before/after pairs

**Throat-clearing → specific**
- Before: "In this post I want to explore some thoughts on technical debt."
- After: "We spent eleven months on a rewrite that a two-week patch would have
  solved. Here is how I talked myself into it."

**Abstract claim → grounded claim**
- Before: "Good observability pays for itself quickly."
- After: "The dashboards took four days to build. They paid for themselves the
  first time an incident was diagnosed in nine minutes instead of an afternoon."

**Marketing register → plain**
- Before: "I'm excited to share a game-changing approach to cloud cost management."
- After: "We cut the AWS bill by 38% without turning anything off. Most of it was
  three instance families nobody had revisited since 2021."

**Adjective pile → number**
- Before: "A significant and complex migration across numerous services."
- After: "Fourteen services, six weeks, two of them unplanned."

**Tidy ending → concrete ending**
- Before: "Ultimately, the lesson here is that planning matters and communication
  is key to any successful migration."
- After: "The foreign key I misread is still there. I renamed it."

## A note on humor

Dry, brief, and load-bearing on a real fact. It works when it is the shortest
possible way to say something true, and fails the moment it becomes a bit that
the sentence has to stop and accommodate. If a joke needs a setup sentence, it
is not worth the sentence.
