# Goce Mojsoski — Portfolio (brutalist rebuild)

A personal portfolio for a product & delivery leader, built as a brutalist
"art object". Near-black concrete canvas, oversized machined display type, a
single industrial-orange signal accent, monospace technical labels, and a
ghosted photo of Skopje's Central Post Office (Janko Konstantinov, 1974) in the
hero. Static single-page site.

Live: https://gmojsoski.com

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Plain CSS** (no Tailwind) — design tokens as CSS variables in `src/index.css`
- Fonts via Google Fonts: **Archivo** (display grotesk), **IBM Plex Mono**
  (labels), **Instrument Serif** (italic accent word)
- No backend, no data store, no auth — it's fully static

## Commands

```bash
npm install
npm run dev       # Vite dev server (HMR)
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve the production build
npm run lint      # ESLint (must stay clean)
```

Node 20+ recommended (developed on Node 24).

## Project structure

```
public/
  favicon.svg / .ico / favicon-32/192/512.png / apple-touch-icon.png
  site.webmanifest
  og-image.png            # 1200×630 social card (the hero)
  files/GoceMojsoskiCV.pdf
src/
  index.css               # design tokens + global reset + film grain
  App.tsx / App.css       # composition + scroll-reveal observer + shared section styles
  components/
    Hero.tsx              # monument hero, top bar, menu overlay, base rail
    Rails.tsx             # fixed social rail (left) + email rail (right)
    SelectedWork.tsx      # §02 case studies, expandable delivered-work
    Capacity.tsx          # §03 leadership statement + animated stat counters
    Experience.tsx        # §04 7-role ledger, show-more, company links
    Skills.tsx            # §05 "How I work" — Lead/Build/Run/Secure pillars
    PersonalProjects.tsx  # §06 "The lab" — homelab grid + summary block
    Footer.tsx            # §07 contact CTA, live Skopje clock, colophon
    Scramble.tsx          # data-glyph text-resolve effect (hero eyebrow)
scripts/
  gen-favicons.mjs        # regenerate raster favicons from favicon.svg
```

## Content

All copy and data live in the component files as typed arrays (`WORK`,
`ROLES`, `PILLARS`, `HOMELAB`, `STATS`, `SOCIALS`, `NAV`). Edit those to update
the site — there's no CMS. Section numbering (`01`–`07`) and the orange square
markers are driven by `.section__no` / `section__lead` in `App.css`.

## Design tokens (`src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0b0b0a` | page background |
| `--surface` | `#131311` | gray blocks |
| `--ink` | `#e8e4dc` | bone display/body text |
| `--ink-dim` / `--ink-faint` | `#9a9a92` / `#6e6e68` | secondary / tertiary text |
| `--signal` | `#d2402e` | the single accent (squares, numbers, CTAs) |
| `--hairline` / `--hairline-faint` | `#2a2a27` / `#1c1c1a` | rules & borders |

Type families: `--display` (Archivo), `--mono` (IBM Plex Mono), `--serif`
(Instrument Serif). Spacing/clearance: `--pad` (widens at ≥1280px so the fixed
rails never overlap content).

## Conventions / gotchas

- **No em-dashes.** Copy uses periods, colons, or en-dashes for ranges. Keep it
  that way (it was a deliberate de-AI pass).
- **Motion is opt-in.** All animations sit behind
  `@media (prefers-reduced-motion: no-preference)` or check it in JS; the page
  renders fully static otherwise. Don't call `setState` synchronously inside an
  effect (ESLint enforces this — use lazy initial state).
- **Side rails** only render at ≥1280px and fade in after the hero.
- **Favicon:** edit `public/favicon.svg`, then `node scripts/gen-favicons.mjs`
  to regenerate every PNG/ICO size (`sharp` + `png-to-ico` are devDeps).
- **OG/meta URLs are absolute** (`https://gmojsoski.com/...`) in `index.html`.
  If the deploy domain changes, update `og:url`, `og:image`, `twitter:image`.

## Security

`npm audit` is clean and the code was reviewed with an external
`security-reviewer` AppSec skill (no XSS sinks, no secrets, no client storage, all
external links carry `rel="noopener noreferrer"`). The only hardening that
applies to a static site is **HTTP security headers at the web server** — see
[DEPLOY.md](DEPLOY.md).
