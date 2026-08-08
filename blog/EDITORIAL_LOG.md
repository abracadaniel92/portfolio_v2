# Editorial log

Tracks text-checker-en passes, title changes, and structural notes for the
posts in this folder. Not published content: the build skips this file (see
`NOT_A_POST` in `scripts/blog-data.mjs`), so it never becomes a page.

Section headings are filenames, and filenames are URL slugs. If you rename a
post, rename its heading here too.

## react-ssr-without-a-framework.md

- Title: "What SSR actually meant for a two-dependency portfolio" -> "Adding
  server-side rendering to a React portfolio without a framework migration"
  (skimmability/SEO: original buried the subject).
- text-checker-en: glossed "hydration mismatch" on first use (it was used
  before it was ever explained). Fixed ambiguous "Prerendering that gives
  you" -> "Prerendering that state gives you".
- Correction (reader-caught, 2026-08-08): the hydration-mismatch gloss added
  during the text-checker-en pass introduced a false claim: "deletes
  dist/server ... [so] no hydration mismatch ... is possible from a file
  that never reaches the browser." Deleting a build-time-only SSR bundle has
  no bearing on hydration mismatches, and lines 69-72 already describe a
  real one (Scramble/Capacity needed suppressHydrationWarning because the
  client's first paint legitimately differs from the server's). Removed the
  false claim rather than patching it; the actual phenomenon was already
  correctly explained later without needing the term.
- Correction (review pass, 2026-08-08): "Three components had to change"
  and "the three components that were quietly deleting real content" were
  both wrong. `git show e3b0dbf --stat` confirms four changed component
  files (SelectedWork, Experience, Scramble, Capacity); the closing line
  already said "Four components". Both instances corrected to four. Note
  the error survived a full text-checker-en pass because Phase 0's
  consistency check reads spellings of the same term, not counts that
  contradict each other across sections.
- Verified against the repo this pass, all accurate: `prerender.mjs` is
  exactly 28 lines, `INITIAL_COUNT = 4`, `work-projects--collapsed` and
  `exp--collapsed` both exist, `suppressHydrationWarning` is present in
  Capacity.tsx and Scramble.tsx.

## deploy-pipeline-without-ci-provider.md

- Title: "The deploy pipeline for this site has no CI provider" -> "This
  site's deploy pipeline has no CI provider" (tightened, same meaning).
- text-checker-en: fixed a garden-path sentence, "widen the header first,
  or with, the deploy" -> "widen the header before, or alongside, the
  deploy".
- Review pass (2026-08-08): deleted the closing paragraph. It restated
  line 54's "a paragraph is easy to skip under pressure" almost verbatim
  as "paragraphs get skipped under pressure", which is the Tidy Ending
  pitfall. The post now ends on "A half-remembered runbook can be
  confidently wrong, which is worse than having none", which was always
  the stronger close. Word count 636 -> 597.

## self-hosting-homelab-resilience.md

- Title: "Self-hosting made the gaps in my own resilience impossible to
  ignore" -> "What self-hosting a homelab actually teaches you"
  (skimmability/SEO: original was too abstract to scan).
- text-checker-en: replaced "steelman" (jargon) with plain language;
  glossed "five nines" as "(99.999% uptime)".
- Structural: the "X, not Y" antithesis construction was overused as a
  rhetorical tic (6+ instances across drafting passes). Trimmed to one
  deliberate instance per the blog-post-writer voice floor.
- Title reverted (2026-08-08): back to "Self-hosting a homelab made every
  gap in my own resilience impossible to ignore". The SEO retitle traded
  the subject for a generic frame ("What X actually teaches you"), which
  scans fine and says nothing. Skimmability is fixed instead by putting
  the concrete subject first. A title rule now exists in the
  blog-post-writer voice floor so this doesn't recur.
- Structural, the significant one (2026-08-08): all three examples in
  "Where that shows up, specifically" were borrowed from other posts in
  this same batch. Dual tunnel replicas is the centerpiece of
  replace-vpn-with-cloudflare-tunnel.md; the CSP/Caddyfile seam and the
  lockfile-vs-Node-version commit are both from deploy-pipeline-without-ci-provider.md. A
  position piece earns its claim in the evidence section, and this one
  borrowed all of it. Kept the CSP case (compressed, now explicitly
  pointing at the post that tells it properly) and replaced the other two
  with `[TODO: ...]` markers rather than inventing incidents.
- The second marker asks for a case where the gap went unclosed or was
  found late. Every example in the section was "I noticed the seam",
  which flatters the argument. Unresolved: the post should not publish
  until at least the second marker is answered.
- Closing paragraph also re-listed the three borrowed examples; trimmed
  to "The seams I keep finding are not homelab problems."

## migrating-100-merchants-to-ecommerce-catalog.md

- Title: "Migrating 100 merchants off a deal-of-the-day site onto a real
  catalog" -> "Migrating 100 merchants from a daily-deals platform to a
  real e-commerce catalog" (SEO: "daily-deals" and "e-commerce catalog"
  are more standard search terms).
- text-checker-en: fixed a comma splice in the product-photography
  sentence (comma -> colon).
- Structural: same antithesis-tic trim as above, down to one instance in
  the closing section.
- Content note: the "what I'd change" section reflects the author's real
  answer (hold a workshop upfront), not an invented one; an earlier draft
  had a `[QUESTION: ...]` marker here that was resolved and removed.

## automate-jira-service-desk-ticket-cloning.md

- Title: "Three seats, fifteen people: cloning a Jira Service Desk into a
  real backlog" -> "Automating Jira Service Desk ticket cloning for 15
  people on 3 free seats" (SEO: leads with "Jira Service Desk" +
  "automating", the actual search terms).
- text-checker-en: fixed "20" vs "Twenty" numeral inconsistency (3 spots,
  standardized to numerals). Replaced "SLA" (jargon) with plain language.

## crowdstrike-alerts-to-jira-tickets.md

- text-checker-en: clean on first pass, no dashes, no blocklist hits, one
  deliberate antithesis line kept ("The gap was never a technical one. It
  was that...").
- Word count: 697, under the 800-1500 build-writeup floor. Left lean on
  purpose rather than padded; flagged to the author as an option to add
  real texture (e.g. actual keyword/tag examples used for classification)
  if they want it in range.
- Content note: the original "what I'd change" draft assumed the author
  could have checked for CrowdStrike's native integration sooner. The
  author corrected this: for most of the period, they had no access to
  CrowdStrike itself, so checking was never actually possible. Rewrote the
  section to reflect that (the real lever was pushing for access/visibility
  earlier, not "look before you build").

## avoiding-60-jira-service-desk-licenses.md

- text-checker-en: clean, no dashes, no blocklist hits, one deliberate
  antithesis line ("not because this build was inherently easier, but
  because it had already been paid for once, somewhere else").
- Word count: 534, under the 800-1500 build-writeup floor. Short on
  purpose: it deliberately doesn't re-explain automations one and two
  since that's already covered in automate-jira-service-desk-ticket-cloning.md, and
  re-explaining them here would be padding, not content.
- Scope note: originally considered folding this into
  automate-jira-service-desk-ticket-cloning.md as a "this pattern traveled" section, but
  split into its own post once the SimonsVoss specifics came in (~60
  licenses avoided, beta-tester feedback intake, Teams instead of Slack,
  no per-customer project split). Different enough shape that merging
  would have blurred both posts' numbers.

## goatcounter-vs-plausible.md

- Archetype: short note (150-400 words), not a build writeup. The raw
  material was genuinely light (a clean tool choice, a quiet re-add, no
  real incident), and the author confirmed there was no real tradeoff to
  dig into. Forcing it into a longer archetype would have been padding.
- text-checker-en: clean, no dashes, no blocklist hits. One deliberate
  closing contrast ("a fair trade, not a bug"); the other two "not X"
  phrasings in the piece are plain scope-clarifying negation, not the
  rhetorical antithesis tic, so left as is.
- Word count: 219.
- Review pass (2026-08-08): cut to one subject. At 219 words it was in
  range but covered four things (the tool comparison, why self-host at
  all, the snippet dropping during the brutalist rebuild, ad blockers),
  which breaks the short note's one-thing rule. Removed the "full control
  and privacy" paragraph (meta, and the vaguest thing in the piece) and
  the rebuild-history sentence. Kept the ad-blocker caveat: it is the
  honest cost of the same decision, not a second subject. 219 -> 129.
- That result exposed a contradiction in the skill: the short note budget
  read "150 to 400 words" and then "Under 100 is fine" two lines later,
  and its own worked example is 79 words. The floor was never real. Budget
  is now stated as "up to 400 words, no floor", which is what the skill
  always actually meant.
- Spun out: the analytics snippet disappearing during the rebrand and
  quietly coming back is a genuine short note of its own, if the reason
  it was dropped turns out to be more interesting than "a rebuild didn't
  carry everything over on day one".

## replace-vpn-with-cloudflare-tunnel.md

- text-checker-en: found four instances of the "isn't X. It's Y" /
  "X. It does nothing for Y." antithesis construction on the first pass,
  all clustered in the "redundancy" and "what I'd change" sections.
  Trimmed to one (""No downtime noticed" is not the same claim as "no
  downtime happened""), rewrote the other three into varied sentence
  constructions.
- Word count: 571, under the 800-1500 build-writeup floor. Left as is
  rather than padded.
- Content note: this post's honesty is load-bearing, not decorative. The
  author added the second tunnel replica to chase 100% uptime against
  daily router restarts, but replicas only guard against the
  `cloudflared` process dying, not against the router's own uplink going
  down (both replicas share it). "No downtime noticed" during those daily
  restarts is presented as unverified, not as evidence the redundancy
  worked, per the author's own correction during drafting.

## Skill changes from the 2026-08-08 review pass

The drafts exposed four gaps in the skills themselves. All four are fixed
in `.claude/skills/`, so future posts should not hit them.

- **Word budgets were miscalibrated.** Seven of nine drafts fell below
  their archetype floor, and the log overrode the rule three separate
  times with "left lean on purpose rather than padded". It was right every
  time. A rule that only ever fires falsely is a broken rule. Build
  writeup is now 500-1500 (was 800-1500) with the 500-800 band named as a
  legitimate finished shape; delivery lesson is 600-1200 (was 700-1200).
  Explicit instruction added never to pad toward a number.
- **No title rule existed.** SEO retitling was free to trade the concrete
  subject for a generic frame, which is what happened to
  self-hosting-homelab-resilience.md. Voice floor item 6 now requires the title to
  name the tool, system, number, or claim, and calls out the
  "What X actually teaches you" / "Lessons from Y" shapes.
- **No rule against reusing evidence across posts.** Added the "Recycled
  Evidence" pitfall to blog-post-writer: list what each existing post
  already owns before drafting, and compress-and-link rather than
  re-narrate.
- **text-checker-en's gloss rule could damage a sentence.** Its own
  hydration-mismatch gloss created a garden-path sentence and introduced
  a false claim. Rewrite rule 5 now requires glosses to sit in a following
  sentence or at clause end, never mid-clause, requires checking whether
  the term is needed at all before defining it, and requires re-reading
  the whole sentence rather than the diff.

Still open: Phase 0's consistency check catches inconsistent spellings of
the same term but not numbers that contradict each other across sections,
which is how "three components" survived a full pass twice in one file.
Worth a rule if it recurs.

## Backlog (not drafted, ideas pending real material)

- **ponytail, from the using-it side, not the building-it side.** Confirmed
  via `git log`/`git remote` in the `ponytail` project directory that this
  is `DietrichGebert/ponytail`, a real open-source project with dozens of
  outside contributors; the author's own git identity doesn't appear in
  it. Not a build writeup candidate. Fun angle instead: what actually
  happens running every AI coding session through it, as a short note or
  position piece, using the author's own before/after, not the project's
  published benchmark numbers. Blocked on one concrete anecdote from the
  author's own sessions (something an agent tried to over-build that
  ponytail visibly cut down). Revisit once they have one.
- **CEAM (Coordinated Engagement Attack Monitor).** Full-stack tool
  detecting comment-based coordination/inauthentic engagement on
  Instagram without violating ToS (no scraping, manual ingestion,
  velocity + linguistic-similarity scoring). Different domain from
  everything else on this blog so far; strong build-writeup candidate.
  Not yet scoped with the author.
- **parts-scraper.** Bash scraper watching Macedonian marketplace sites
  for a specific CPU, daily via systemd, Slack alerts. Small, concrete,
  probably a short note or light build writeup.
- **Jira Issue Extractor / Confluence Extractor.** Bulk migration and
  LLM-generated documentation tooling. Possible angle: these get
  anonymized before landing on a work laptop (per prior context), which
  could itself be the interesting build-writeup hook ("a tool you have to
  de-identify before you're allowed to use it at work").
- **Pi-version-control.** Git-tracked homelab config, ~30 services. Risk:
  likely overlaps with the homelab/self-hosting posts already published.
  Would need a genuinely different angle to not be a repeat.
- **Planning Poker app.** Self-hosted Node/Express/SQLite alternative to
  a SaaS planning-poker tool. Same "why build instead of buy" territory
  as the Jira Service Desk posts, smaller stakes.
- **Toggl -> Jira time logger, mp3_converter.** Smaller glue-tool
  candidates, probably short notes if pursued.

## Open items

- ~~No blog routing or slugs exist yet.~~ **Built 2026-08-08.** Each file is
  now live at `/blog/<filename>`, and every draft gained a frontmatter block
  (`title`, `date`, `company`, `summary`). See "The blog" in CLAUDE.md.
- ~~Slugs were chosen before SEO mattered.~~ **Renamed 2026-08-08**, before
  anything was indexed or shared. Eight of nine changed; the filenames in this
  log were updated to match. The renames dropped internal brand names nobody
  searches for (Grouper, Ananas, SimonsVoss) in favour of what each post
  answers. `goatcounter-vs-plausible` was deliberately left alone: it already
  matches the comparison query exactly, which is the strongest position any of
  these has.
  **From here on, a rename needs a redirect.** There is no redirect mechanism
  in the build, so adding one means a Caddy rule.
- ~~All nine share one date.~~ **Spaced 2026-08-08** across 2026-02-23 to
  2026-08-08, roughly three weeks apart. These are backdated publication
  dates, not the dates the posts were written (all nine were drafted in one
  batch). Ordering was chosen so the homepage's top three alternate delivery
  work and homelab rather than running three homelab posts together.
