# The four archetypes

Pick one before drafting. Each has a spine, a word budget, and a characteristic
way of failing. A post that follows no spine reads as notes. A post that follows
two reads as confusion.

---

## 1. Build writeup

**Use when:** something was built, fixed, migrated, or broken and repaired, and
there is a technical decision worth explaining. The homelab, the SSR prerender,
a database upgrade, a Caddy config that took three attempts.

**Budget:** 800 to 1500 words.

### Spine

1. **What I wanted, and why it was not trivial.** State the goal and the
   constraint in the same breath. A goal with no constraint is a to-do item,
   not a post.
2. **What I tried first.** Usually the obvious thing. Say why it was reasonable
   before saying why it failed, or the reader assumes you were careless.
3. **The tradeoff.** The heart of the post. Two or three real options, what each
   cost, which one you took. This is the section a reader would not have got
   anywhere else.
4. **What actually happened.** Numbers. Before and after. Including the part
   that did not improve.
5. **What I would do differently.** One or two things. Not a summary.

### Worked opening

> My portfolio scored 62 on Lighthouse for a page that is mostly static text.
> The problem was that a crawler asking for gmojsoski.com got an empty
> `<div id="root">` and a 180KB bundle it had to run before seeing a single word.
>
> The obvious fix is a framework with SSR built in. I did not want one. The
> whole site is 9 components and 2 runtime dependencies, and adopting Next just
> to render static text would have cost more than the problem was worth.

Constraint stated in sentence two, obvious option acknowledged and rejected with
a reason by paragraph two. The tradeoff section is already set up.

### Failure mode

**Tutorial drift.** The post turns into a how-to and the decisions vanish. If
the draft could be replaced by the library's documentation, it has drifted.
Nobody needs another walkthrough. They need to know what you chose and why.

---

## 2. Delivery lesson

**Use when:** something about leading teams, programs, or budgets turned out
differently than expected, and the gap is instructive. Needs real stakes:
headcount, money, deadlines, a decision that could have gone badly.

**Budget:** 700 to 1200 words.

### Spine

1. **The situation, with numbers.** Team size, budget, timeline, what was at
   risk. Two or three sentences. Anonymize the client if needed, never the
   scale.
2. **What I believed going in.** State the assumption plainly, in the words you
   would have used at the time. Do not pre-soften it with hindsight.
3. **What actually happened.** Including the part that was uncomfortable.
4. **The lesson, stated as a rule.** One sentence, usable by someone else. If it
   cannot be stated in one sentence, the post has not found it yet.
5. **Where the rule breaks.** Every delivery lesson has a context where it is
   wrong. Naming that is what separates this from a LinkedIn post.

### Worked opening

> We had 150 engineers, a $3M AWS bill, and a SOC 2 audit nine months out. I was
> certain the compliance work would be the hard part.
>
> It was not. The audit was mostly documentation we should have been keeping
> anyway. What nearly sank the timeline was that eleven teams each had their own
> definition of "production", and no two of them agreed on which accounts that
> covered.

Scale, stakes, and a stated wrong belief inside 60 words. Step 5 writes itself:
this rule fails in an org small enough to hold the whole estate in one head.

### Failure mode

**The Résumé Reflex.** The situation section keeps expanding until the post is a
list of things you have run. *Fix:* the situation gets three sentences. If it
needs more, the post is about the wrong thing.

---

## 3. Position piece

**Use when:** you have an argument, not a story. Something the field gets wrong,
a practice worth abandoning, a tool that is oversold.

**Budget:** 600 to 1000 words. Shorter than you think. An argument that needs
1500 words is usually three arguments.

### Spine

1. **The claim, inside the first 100 words.** Do not build to it. State it, then
   spend the post earning it.
2. **The steelman.** Why do reasonable people believe the opposite? Answer this
   properly and at length. A position piece that skips it is a rant, and readers
   who disagree stop reading at the first paragraph.
3. **The evidence.** Where you have seen it, with specifics. Your own experience
   counts, and it is the only thing you have that a general-purpose writer does
   not.
4. **The strongest objection, answered honestly.** Pick the objection that
   actually worries you, not a weak one you can dispatch. If it partly lands,
   say so and narrow the claim.
5. **What to do instead.** Concrete. A position with no alternative is a complaint.

### Failure mode

**The Straw Steelman.** Step 2 is written to be knocked down. Every reader who
holds the opposing view recognizes this instantly and discounts the rest. *Fix:*
write step 2 so that someone who disagrees with you would say it is fair. If you
cannot, you do not understand the position well enough to argue against it.

---

## 4. Short note

**Use when:** one thing. A result, a gotcha, a tool, a number worth knowing.
This is the highest-value archetype because it is the one that gets published.
A blog dies of unfinished long-form, never of too many short notes.

**Budget:** 150 to 400 words. Under 100 is fine.

### Spine

There is no spine. There are three rules.

1. **Result first.** The finding is sentence one. Context, if any, comes after.
2. **One thing only.** If a second idea appears, it is a second note.
3. **No conclusion.** Stop when the information stops. Do not summarize, do not
   reflect, do not tell the reader what to take away.

### Worked example, complete

> Vite 8 silently ignores an injected `PORT` env var. If 5173 is busy it
> increments to 5174 and tells you only in the startup log, which means a
> fixed-port preview proxy ends up pointing at nothing and you spend twenty
> minutes debugging a blank page that was never being served.
>
> Read the actual `Local:` URL from the log. That is the whole tip.

79 words. Publishable as-is.

### Failure mode

**Inflation.** The note grows a preamble, then a conclusion, then a section
heading, and now it is a bad 600-word post instead of a good 90-word one. *Fix:*
if a note passes 400 words, either cut it back or promote it deliberately to a
build writeup and give it a real spine.

---

## Choosing between them

| The material is mostly... | Archetype |
|---|---|
| A technical decision with alternatives | Build writeup |
| A wrong assumption about people or process | Delivery lesson |
| A disagreement with common practice | Position piece |
| A single fact | Short note |

When two fit, it is two posts. Propose the split rather than merging them: the
merged version is always worse than either half, and the second post is free.
