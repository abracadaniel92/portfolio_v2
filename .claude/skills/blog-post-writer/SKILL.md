---
name: blog-post-writer
description: Draft, structure, and edit blog posts for gmojsoski.com in the site's own voice. Use when writing a new post, note, or article, outlining one from rough notes, restructuring a draft that isn't landing, tightening prose before publishing, or picking which of the four post archetypes a piece should be. Triggers on "write a blog post", "draft a post about", "turn these notes into a post", "edit my draft", "is this post any good", "what should I write about", or any long-form writing for the site. Enforces the voice floor (concrete over abstract, no marketing register, no em-dashes), the archetype spines, and the editing pass. Load reference/archetypes.md for the four post structures and reference/voice.md for the register and the editing pass. The AI-tell blocklist and the sentence-level pass live in the text-checker-en skill.
---

# Blog Post Writer

Posts on gmojsoski.com are written by a delivery lead who has actually shipped
the things being described. That is the whole advantage, and almost every way a
post fails is a way of throwing it away: going abstract, going promotional, or
going anonymous. Your job is to keep the specifics in and the LinkedIn voice out.

The blog voice is **looser and warmer than the site copy**. The site is clipped
by design (`150+ engineers`, `MySQL 5.7 → 8.0`, `On time.`). A 900-word post
written at that compression is airless. Contractions, first person, asides, and
dry humor in passing are all welcome. What does *not* loosen is the floor in the
next section.

Read `CLAUDE.md` for the repo's hard rules. This skill covers writing craft only:
what a post says and how it reads. It does not cover file placement, frontmatter,
slugs, or the build. Blog infrastructure does not exist in this repo yet.

## The voice floor (these do not loosen)

1. **Concrete beats abstract, every time.** Numbers, tool names, real figures,
   real dates. `Cut the deploy from 40 minutes to under 4` is a sentence.
   `Dramatically improved our deployment velocity` is not. If a paragraph has no
   specific in it, it is either wrong or unnecessary.
2. **No em-dashes.** Periods, colons, parentheses, or en-dashes for ranges. This
   is a deliberate de-AI editing pass across the whole site. It applies to posts
   too, and it is not a style preference you get to relax for prose.
3. **No marketing register.** No "I'm excited to share", no "game-changer", no
   "in today's fast-paced landscape", no opening rhetorical question. The full
   blocklist lives in the `text-checker-en` skill and you run it every time.
4. **Earned opinions only, including the wrong ones.** Say what you actually
   think. A post where nothing was difficult and nothing was misjudged reads as
   marketing. The most valuable line in most posts is the one admitting what the
   first attempt got wrong.
5. **Open on a specific.** The first two sentences must carry a fact or a claim.
   No scene-setting, no "recently I've been thinking about". If the draft opens
   with context, the real opening is usually paragraph two.
6. **Titles name the concrete thing.** The tool, the system, the number, or the
   actual claim. Making a title more scannable means moving the subject earlier,
   never trading the subject for a generic frame. Watch for "What X actually
   teaches you", "Lessons from Y", and "A deep dive into Z": they scan fine and
   say nothing, and search rewards the specific noun anyway.

## The four archetypes

Pick one before drafting and commit to its spine. A post that is two archetypes
at once is the most common structural failure. Full spines, length targets, and a
worked example each are in `reference/archetypes.md`.

- **Build writeup** (500 to 1500 words). How something was built, fixed, or
  migrated. Spine: what I wanted → what I tried first → the tradeoff → what
  actually happened → what I would do differently. The homelab, the SSR
  prerender, a database upgrade.
- **Delivery lesson** (600 to 1200 words). What worked and what did not, leading
  teams and programs. Spine: the situation with real numbers → what I believed
  going in → what actually happened → the lesson as a rule → where the rule
  breaks. Needs stakes to work.
- **Position piece** (600 to 1000 words). An argument, not a story. Spine: the
  claim inside the first 100 words → why the opposing view is reasonable →
  the evidence → the strongest objection, answered honestly → what to do
  instead. Never skip the steelman.
- **Short note** (up to 400 words, no floor). One thing. A result, a tool, a thing
  learned. Result first, context second, and **no concluding paragraph**. Low
  ceremony is the point. Publish these often; they are what keeps a blog alive.

## Application

1. **Establish the raw material.** What actually happened, with numbers. If the
   answer is thin, stop and ask rather than padding with generalities. A post
   with no specifics cannot be rescued by structure.
2. **Pick the archetype** and say which one you picked and why. If the material
   fits two, it is probably two posts; propose the split.
3. **Find the sharpest concrete thing** in the material. That is either the
   opening or the ending, rarely the middle. Place it deliberately.
4. **Outline against the spine** from `reference/archetypes.md`. Three to five
   sections for long-form, zero for a short note. Show the outline before
   drafting anything longer than a note.
5. **Draft.** Vary sentence length: long-form needs rhythm the site copy does not.
   Every section carries at least one specific.
6. **Run the editing pass** in `reference/voice.md` in order. It is six steps and
   it is not optional. Step one is deleting the first paragraph, and it is
   correct more often than it is not.
7. **Run the self-check below**, then present the draft with a one-line note on
   what you cut and why.

## Examples

**Opening, before:** "Recently I've been thinking a lot about server-side
rendering and its role in modern web development. In this post, I want to share
my journey of migrating my portfolio site from CSR to SSR."

Throat-clearing, zero specifics, announces itself instead of starting. Also two
em-dashes away from a stock AI paragraph.

**Opening, after:** "My portfolio scored 62 on Lighthouse for a page that is
mostly static text. The problem was that a crawler asking for gmojsoski.com got
an empty `<div id="root">` and a 180KB JavaScript bundle it had to run before
seeing a single word."

The claim is specific, the number is real, and the second sentence already
explains the mechanism. The reader knows what the post is about and that the
writer knows what they are talking about.

**Short note, complete:** "Vite 8 silently ignores an injected `PORT` env var. If
5173 is busy it increments to 5174 and tells you only in the startup log, which
means a fixed-port preview proxy ends up pointing at nothing and you spend
twenty minutes debugging a blank page that was never being served. Read the
actual `Local:` URL from the log. That is the whole tip."

Under 80 words, one thing, result first, no summary paragraph. This is a
publishable post.

## Common pitfalls

- **The Throat-Clear.** Opening with context nobody asked for. The reader leaves
  before the substance arrives. *Fix:* delete the first paragraph and read what
  is left. It nearly always starts better.
- **The Résumé Reflex.** The post drifts into a list of accomplishments. It reads
  as self-promotion, and the portfolio page already does that job better than
  prose can. *Fix:* every claim gets followed by what it cost, what broke, or
  what the first attempt got wrong.
- **The Anonymous Lesson.** Advice with no numbers, no names, no stakes.
  Indistinguishable from a thousand other posts, and therefore worthless.
  *Fix:* one concrete instance per section, minimum.
- **The Tidy Ending.** A closing paragraph that restates everything above it. It
  kills the momentum at exactly the wrong moment. *Fix:* end on the sharpest
  concrete thing and cut the recap. Long-form does not need a conclusion any more
  than a short note does.
- **The Consistency Seam.** The looser blog voice drifts so far that the post and
  the site read as two different people. *Fix:* the voice floor above is the
  hard boundary. Warmer is fine. Marketing register never is.
- **Recycled Evidence.** A post built out of anecdotes that are already carrying
  other posts. Anyone reading the blog in order meets the same story three
  times, and a position piece whose evidence is borrowed has not earned its
  claim. *Fix:* before drafting, list the specifics each existing post already
  owns. New post, new evidence. Where an old example genuinely is the best one,
  compress it to a sentence and point at the post that tells it properly,
  instead of narrating it again at length.
- **Archetype Collision.** A build writeup that turns into a position piece
  halfway down. The reader cannot tell what they are reading. *Fix:* split it.
  Two focused posts beat one confused one, and you needed a second post anyway.

## Before you finish (self-check)

1. **Specifics:** every section contains at least one number, name, or concrete
   instance. Flag any paragraph that does not.
2. **Opening:** first two sentences carry a fact or claim. Nothing is being set up.
3. **Em-dashes:** zero. Search the draft for `—` and `--`.
4. **Blocklist:** run `text-checker-en`'s AI-tell list. Zero hits.
5. **Archetype:** the draft follows one spine end to end, and hits its word range.
6. **Honesty:** at least one thing that went wrong, was harder than expected, or
   would be done differently. If there is none, the post is marketing.
7. **Ending:** no summary paragraph. The last line is concrete.
8. **Read it aloud.** Anything you would not say out loud gets rewritten.

If any check fails, fix it before presenting. Never publish or push on your own
initiative: pushing `main` is a production deploy.

## References

- `reference/archetypes.md` — the four spines in detail, with a worked example
  and word budget for each
- `reference/voice.md` — how far "looser" goes, the six-step editing pass, and
  before/after sentence pairs
- `../text-checker-en/SKILL.md` — the sentence-level pass: mechanics, clarity,
  flow, the AI-tell blocklist, plain-language swaps. This skill decides what a
  post says; that one fixes how it reads. Run this first, that second
- `../brutalist-style/SKILL.md` — the design system, for when a post needs page
  or component work. This skill stops at the prose
- `CLAUDE.md` — repo hard rules, including the em-dash ban and the deploy pipeline
