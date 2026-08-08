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
   only; sharp/png-to-ico are devDeps for the favicon script, and `marked` is a
   devDep used only by the blog build step. Nothing parses markdown in the
   browser.
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
  `#blog`, `#contact`) must stay in sync with `NAV` in `Hero.tsx`. A `NAV`
  entry with `page: true` leaves the page for another route instead of
  scrolling, and the menu gives it an arrow cue.
- **The topbar drops `Resume ↓` below 720px.** Brand + Blog + Resume + menu
  needs about 408px at the mobile type settings and the smallest target is
  360px; all four never fit. Resume stays in the menu overlay and the footer,
  so the slot goes to Blog, which is otherwise only reachable through the
  menu. If you add another topbar item, measure before assuming it fits.
- **Hide topbar items by class, never `nth-child`.** The mobile block used
  positional selectors and silently retargeted the wrong elements the moment a
  link was inserted.
- The menu overlay scrolls (`min-height: 0` + `overflow-y: auto` on
  `.menu__nav`, `flex: none` on the links). Without it, a nav taller than the
  viewport overflowed the fixed overlay with the last entries unreachable,
  since body scroll is locked while the menu is open. `justify-content` is
  `safe center` so an overflowing list top-aligns rather than hiding its first
  entries above `scrollTop: 0`.
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
the register calibration. Scoped to prose only; the publishing pipeline is
documented under "The blog" below.

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

## The blog

Posts are markdown in `blog/`, rendered to HTML at **build time**. Nothing
about the blog runs in the browser beyond the normal hydration.

- **To publish a post:** add `blog/<slug>.md` with a frontmatter block. The
  filename is the URL slug (`/blog/<slug>`). Required fields: `title`, `date`
  (`YYYY-MM-DD`), `company`, `summary`. The build fails loudly if one is
  missing or the date is malformed. `company` is the engagement the work
  happened on (`Arcadia`, `TSD Digital`, `SimonsVoss`, `Ananas.mk`) or
  `Homelab` for the self-hosted pieces; it renders as a `.tag` chip.
- **Ordering is `date`, newest first, ties broken by title.** That one field
  controls both the archive order and which three posts surface on the
  homepage. The first nine run 2026-02-23 to 2026-08-08, spaced about three
  weeks apart, ordered so the homepage's three alternate delivery work and
  homelab rather than running three homelab posts together.
- **The leading `# H1` in a draft is stripped** at build time. The page renders
  the frontmatter `title`, so keeping the H1 in the file is just for reading it
  in an editor.
- **Raw HTML in markdown is escaped**, not passed through (see the
  `marked.use` block in `scripts/blog-data.mjs`). Delete that block to allow
  inline HTML.

Pipeline:

| File | Job |
|---|---|
| `scripts/blog-data.mjs` | Reads and parses `blog/*.md`, renders with `marked`. The single source of truth. |
| `scripts/build-blog.mjs` | Writes `src/blog/posts.generated.ts`. Runs as `predev`/`prebuild`/`prelint`. |
| `src/blog/posts.generated.ts` | **Gitignored, generated.** Never edit or commit it; edit the markdown. |
| `src/router.ts` | Maps a pathname to `home` / `blog` / `post`. Unknown paths resolve to `home`, matching Caddy's fallback. |
| `scripts/prerender.mjs` | Renders every route to its own `dist` file, rewrites the per-page `<head>`, emits `sitemap.xml` and `rss.xml`. |

- **In-site links are plain anchors, not a client router.** Every route is a
  real prerendered file, so navigation is a normal page load. If you ever add
  interception, the post HTML has to reach the client for the target route.
- **A post page is three columns** (`.post__layout`): contents index, prose,
  spec rail. The prose holds a 74ch measure and the rails carry the rest of the
  width, which is why the page does not trail off into empty space. The
  contents column keeps its width even on a post with no `##` headings, so the
  prose sits in the same place on every post. Everything stacks at 1080px.
- **`##` headings get ids** from `slugifyHeading` in `scripts/blog-data.mjs`,
  and the contents index links to them. Ids come from the lexer and the
  rendered HTML through the same function, so they cannot drift; the build
  throws if two headings in one post collide.
- **The contact footer is omitted on individual posts** (see the route check in
  `App.tsx`). A post ends on its newer/older nav. It stays on `/blog` and the
  homepage. `ScrollTop` docks against `.footer__links`, and already handles
  that element being absent.
- `/blog` leads with a masthead (`.blog-index__head`), not the mono
  `.section__head` the homepage sections use, because it is a page rather than
  a section of one. It is deliberately not in `REVEAL_SELECTOR`: a page title
  should not fade in.
- **`index.html` has a prerender-managed block** between `<!-- head:meta:start -->`
  and `<!-- head:meta:end -->`. The prerender replaces it per route. Homepage
  metadata is edited there; post metadata comes from frontmatter. Do not delete
  the markers, and keep social URLs absolute (rule 6).
- Section numbers now run `01`–`08`: Blog is `07`, contact/footer is `08`.

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
- ~~No `robots.txt` / `sitemap.xml`~~ **Done 2026-08-08** with the blog.
  `public/robots.txt` is static; `sitemap.xml` and `rss.xml` are generated into
  `dist/` by `scripts/prerender.mjs`. All three hardcode
  `https://gmojsoski.com`, so a domain change means editing `robots.txt` and
  `SITE_URL` in `scripts/blog-data.mjs`.
- **Blog page weight.** `src/blog/posts.generated.ts` bundles every post's HTML
  into the client JS (~42 kB raw at 9 posts), so the homepage downloads the
  full archive it does not display. Fine at this size and it keeps the build
  simple. If the archive grows past roughly 30 posts, split the payload per
  route rather than letting it creep.
