# CLAUDE.md — rules for AI agents working on portfolio-brutalist

**This is the LIVE gmojsoski.com.** Read `README.md` first — it carries the
design tokens, project structure, and conventions; this file adds the rules
that aren't obvious from it.

## Deploy pipeline (the most important thing to know)

- GitHub remote is `abracadaniel92/portfolio_v2`. The homelab server
  (`lemongrab`) pulls **`main`**, runs `npm run build`, and syncs `dist/` into
  Caddy via `update-portfolio.sh` (triggered by `make portfolio-update` or the
  `portfolio-update` systemd timer — see the `lenovo-homelab` repo).
- **Therefore: pushing to `main` is a production deploy.** Commit freely,
  push deliberately. Never push a red build.
- Local `dist/` is gitignored; the server builds from source. Caddy config,
  security headers, and the post-deploy checklist live in `DEPLOY.md`.
- The razmeni-fork repo at `C:\Users\Admin\Desktop\Cursor\portfoliov2` is a
  SUPERSEDED design iteration, not this site. Don't mix their conventions —
  this repo is plain CSS, no Tailwind.

## Verification

`npm run build` (runs `tsc -b` first) **and** `npm run lint` must both be
clean before any change is done. There are no tests; the ESLint config
includes `react-hooks` rules and they are treated as errors.

For visual/interaction changes, also verify in a browser (the build passing does
not prove behavior). Note: Vite 8 ignores an injected `PORT` and auto-increments
if its port is busy (5173 → 5174 → 5175…), so a fixed-port preview proxy can end
up pointing at nothing. Read the actual `Local:` URL from the Vite startup log and
drive that.

## Hard rules

1. **No em-dashes in copy.** Periods, colons, or en-dashes for ranges. This
   was a deliberate de-AI editing pass — do not undo it when writing or
   rewording copy.
2. **Motion is opt-in.** Every animation either sits behind
   `@media (prefers-reduced-motion: no-preference)` in CSS or checks
   `matchMedia("(prefers-reduced-motion: reduce)")` in JS (see `Scramble.tsx`,
   `App.tsx`). Any new animation must do the same, and must render the final
   state immediately for reduced-motion users.
3. **No `setState` synchronously in effects** — use lazy initial state
   (`useState(() => ...)`, as `Scramble` does). ESLint enforces it.
4. **No new dependencies** without asking. Runtime deps are react + react-dom
   only; sharp/png-to-ico are devDeps for the favicon script.
5. **One accent color.** `--signal` (`#d2402e`) is the only accent; everything
   else is the bone/concrete neutral ramp in `src/index.css`. Never introduce
   a second accent or "improve" the palette.
6. **OG/social URLs stay absolute** (`https://gmojsoski.com/...`) in
   `index.html`.

## Conventions

- Copy/data live as typed `const` arrays at the top of each component
  (`WORK`, `ROLES`, `PILLARS`, `HOMELAB`, `STATS`, `SOCIALS`, `NAV`). Edit
  the array, not the JSX.
- One CSS file per component (`Hero.tsx` + `Hero.css`), plain CSS with the
  BEM-ish `block__element--modifier` naming. Shared section scaffolding
  (`.section__head`, `.section__no`, reveal classes) is in `App.css`; tokens
  and the film-grain overlay in `src/index.css`.
- Scroll reveals: add new revealable selectors to `REVEAL_SELECTOR` in
  `App.tsx` rather than wiring a new observer.
- Section anchors (`#work`, `#capacity`, `#experience`, `#skills`, `#lab`,
  `#contact`) must stay in sync with `NAV` in `Hero.tsx`.
- External links: `target="_blank" rel="noopener noreferrer"` always.
- The hero menu overlay closes on Escape and locks body scroll while open —
  keep both behaviors if you touch it.
- Favicons: edit `public/favicon.svg`, then `node scripts/gen-favicons.mjs`.
  Never hand-edit the PNG/ICO outputs.

## Skills available

`.claude/skills/brutalist-style/` — the design-system + code-convention guardian.
Use it for **any** UI change: new section/component, editing `.tsx`/`.css` under
`src/`, layout/type/spacing/color tweaks, copy or data edits, or new animations.
It encodes the token palette, section scaffolding, mono-label system, motion
opt-in, and the file/data conventions, with concrete specs in its
`reference/tokens.md` and `reference/new-component.md`. Run its self-check before
finishing UI work.

`.claude/skills/blog-post-writer/` — writing craft for blog posts and notes:
the four archetypes (build writeup, delivery lesson, position piece, short note),
the voice floor, and the editing pass. Covers what a post **says**. Its
`reference/archetypes.md` has the spines and word budgets, `reference/voice.md`
the register calibration. Scoped to prose only; blog infrastructure does not
exist in this repo yet (see the open item below).

`.claude/skills/text-checker-en/` — English-only line editor: mechanics,
comprehension, flow, the AI-tell blocklist, plain-language swaps. Covers how
prose **reads**, and outputs a report plus a full rewrite. Adapted from the
multilingual `text-checker` in `../product_manager_skills/`. Run it after
`blog-post-writer` on a draft, or standalone on any English prose. The AI-tell
blocklist lives here and only here; don't duplicate it into the other skill.

`.claude/skills/security-reviewer/` — AppSec review skill (already run once;
repo was clean). Re-run it if you add anything that touches external input,
storage, or third-party scripts (e.g. re-adding GoatCounter analytics — and
if you do, widen the CSP in DEPLOY.md's Caddy block per its notes).

## Open items (as of 2026-07-06)

- **Analytics: GoatCounter re-added 2026-07-06.** The count.js snippet is in
  `index.html` (plain external script — no inline JS, the CSP forbids it) and
  the CSP allows `analytics.gmojsoski.com` in script/connect/img-src. The
  live Caddy header on lemongrab must match (mirrored in lenovo-homelab
  `docker/caddy/config.d/10-gmojsoski-home.caddy`) — if analytics is ever
  removed, strip the snippet AND the three CSP entries together.
- **Fonts come from Google Fonts** (render-blocking, third-party). Candidate
  improvement: self-host Archivo / IBM Plex Mono / Instrument Serif and
  tighten the CSP's `style-src`/`font-src` to `'self'`.
- No `robots.txt` / `sitemap.xml` in `public/` — harmless for a single page,
  trivial to add if SEO ever matters.
