# Editorial log

Tracks text-checker-en passes, title changes, and structural notes for the
drafts in this folder. Not published content; delete or fold into real blog
infra whenever that exists.

## ssr-migration.md

- Title: "What SSR actually meant for a two-dependency portfolio" -> "Adding
  server-side rendering to a React portfolio without a framework migration"
  (skimmability/SEO: original buried the subject).
- text-checker-en: glossed "hydration mismatch" on first use (it was used
  before it was ever explained). Fixed ambiguous "Prerendering that gives
  you" -> "Prerendering that state gives you".

## homelab-deploy.md

- Title: "The deploy pipeline for this site has no CI provider" -> "This
  site's deploy pipeline has no CI provider" (tightened, same meaning).
- text-checker-en: fixed a garden-path sentence, "widen the header first,
  or with, the deploy" -> "widen the header before, or alongside, the
  deploy".

## self-hosting-lessons.md

- Title: "Self-hosting made the gaps in my own resilience impossible to
  ignore" -> "What self-hosting a homelab actually teaches you"
  (skimmability/SEO: original was too abstract to scan).
- text-checker-en: replaced "steelman" (jargon) with plain language;
  glossed "five nines" as "(99.999% uptime)".
- Structural: the "X, not Y" antithesis construction was overused as a
  rhetorical tic (6+ instances across drafting passes). Trimmed to one
  deliberate instance per the blog-post-writer voice floor.

## grouper-to-ananas-migration.md

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

## jira-service-desk-cloning.md

- Title: "Three seats, fifteen people: cloning a Jira Service Desk into a
  real backlog" -> "Automating Jira Service Desk ticket cloning for 15
  people on 3 free seats" (SEO: leads with "Jira Service Desk" +
  "automating", the actual search terms).
- text-checker-en: fixed "20" vs "Twenty" numeral inconsistency (3 spots,
  standardized to numerals). Replaced "SLA" (jargon) with plain language.

## crowdstrike-jira-alerts.md

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

## simonsvoss-service-desk-reuse.md

- text-checker-en: clean, no dashes, no blocklist hits, one deliberate
  antithesis line ("not because this build was inherently easier, but
  because it had already been paid for once, somewhere else").
- Word count: 534, under the 800-1500 build-writeup floor. Short on
  purpose: it deliberately doesn't re-explain automations one and two
  since that's already covered in jira-service-desk-cloning.md, and
  re-explaining them here would be padding, not content.
- Scope note: originally considered folding this into
  jira-service-desk-cloning.md as a "this pattern traveled" section, but
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

## cloudflare-tunnel-zero-trust.md

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

- No blog routing or slugs exist yet (see CLAUDE.md: "blog infrastructure
  does not exist in this repo yet"). When it does, revisit filenames as
  URL slugs; they were named before SEO was a consideration for this
  batch (e.g. `jira-service-desk-cloning.md` vs. the current title's
  emphasis on "automating").
