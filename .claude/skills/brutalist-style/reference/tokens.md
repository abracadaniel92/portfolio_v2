# Design tokens and scale reference

The source of truth is `src/index.css` (`:root`). This file explains what each
token is for so you pick the right one instead of eyeballing a value. If a token
does not exist for what you need, that is a signal to reuse an existing one, not
to invent a literal.

## Color ramp

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0b0b0a` | page background, the concrete base |
| `--surface` | `#131311` | raised gray blocks, insets |
| `--ink` | `#e8e4dc` | bone: display headings and primary body text |
| `--ink-dim` | `#9a9a92` | secondary text (body paragraphs, descriptions) |
| `--ink-faint` | `#6e6e68` | tertiary text: most mono labels, meta, captions |
| `--steel` | `#4a4a46` | hover border lift, subtle interactive states |
| `--hairline` | `#2a2a27` | primary 1px borders (section head underline) |
| `--hairline-faint` | `#1c1c1a` | quieter internal rules (between rows/cards) |
| `--signal` | `#d2402e` | THE accent. Squares, section numbers, CTAs, one label |

Rules:

- The only non-neutral is `--signal`. There is no second accent and there will
  not be one. Do not add hover colors, success/error hues, or gradients.
- Text on canvas: `--ink` for what matters, `--ink-dim` for supporting prose,
  `--ink-faint` for labels and metadata. Walk down the ramp as importance drops.
- Borders are always one of the two hairlines. `--steel` appears only as a hover
  lift on borders (see `.tag:hover` in `App.css`).

## Type families and their fixed jobs

| Token | Font | Job | Typical treatment |
|---|---|---|---|
| `--display` | Archivo | headings + body | weight 400–700; big sizes get `letter-spacing: -0.02em`, `line-height: ~1.05` |
| `--mono` | IBM Plex Mono | technical labels ONLY | `text-transform: uppercase`, `letter-spacing: 1–1.8px`, size `10–13px`, color `--ink-faint` or `--signal` |
| `--serif` | Instrument Serif | one italic accent word inside a display line | italic, inline only, never for blocks |

The mono-label texture is the signature of the design. Section meta lines, tags,
eyebrows, pillar group labels, the hero spine number, stat labels: all mono,
uppercase, letter-spaced, small. When you add a label, it is mono. When you add a
heading or a sentence, it is display.

## Sizing: use clamp(), match the existing scale

Nothing that should scale across viewports uses a fixed pixel size. Match the
patterns already in the CSS rather than picking new numbers:

- Section vertical padding: `clamp(44px, 5vw, 80px)` (see `.section`).
- Display headings: e.g. `clamp(20px, 2.4vw, 30px)` for a pillar title; the hero
  monument is larger. Scale the three clamp stops proportionally to the existing
  ones.
- Body/lead text: `clamp(15px, 1.4vw, 18px)`, `line-height: 1.55`, `max-width`
  around `60ch` so lines stay readable.
- Mono labels: fixed small sizes (10–13px) are fine; they are not meant to scale.

## Spacing and layout

- **Horizontal padding is always `var(--pad)`.** It is defined once and widens at
  breakpoints so the fixed side rails (which appear at ≥1280px) never overlap
  content. Never hardcode left/right section padding.
- `--pad` values: base `clamp(22px, 4.4vw, 48px)`; laptop band (720–1279px)
  `clamp(57px, 6.6vw, 88px)`; desktop (≥1280px) `clamp(88px, 5.5vw, 99px)`.
- Max content width: `.section` caps at `1600px`, centered.
- Gaps between items use `clamp()` too (e.g. pillar gap `clamp(16px, 4vw, 64px)`).

## Breakpoints (match these exact widths)

| Width | Meaning |
|---|---|
| `max-width: 720px` | mobile: single column, tighter head, `white-space: nowrap` guards |
| `min-width: 720px and max-width: 1279px` | laptop band: extra side padding, rails still hidden |
| `min-width: 1280px` | side rails appear and fade in after the hero |
| `max-width: 760px` | component-level column collapse (e.g. `.pillar` to 1 column) |

Use `max-width: 720px` for the section-head responsiveness and `max-width: 760px`
for collapsing a component's internal grid, matching what the existing components
do. Do not introduce new breakpoint values.

## Borders, edges, texture

- 1px solid hairline borders only. No `border-radius` on structural elements, no
  `box-shadow`. Brutalist is hard edges and rules.
- The global film grain is `body::after` in `index.css` (fractal-noise SVG,
  `opacity: 0.05`, `mix-blend-mode: overlay`, `z-index: 9999`,
  `pointer-events: none`). It sits over everything. Do not duplicate, move, or
  restyle it.
- `color-scheme: dark` is set on `:root`; this is a dark-only site. Do not add a
  light theme.

## z-index ladder (fixed/overlay elements)

There are no z-index tokens; these are the established layers. Slot new fixed
elements in without covering something above them.

| Layer | z-index | Element |
|---|---|---|
| Film grain | 9999 | `body::after`, over everything, `pointer-events: none` |
| Hero menu overlay | 100 | the open `[ menu ]` overlay |
| Side rails | 50 | `.rail` (social + email, ≥1280px) |
| Floating utility | 40 | scroll-to-top `.to-top`; keep new overlays here or below so an open menu always wins |

## Shared classes you should reuse (from App.css), not re-create

- `.section`, `.section__head`, `.section__lead`, `.section__no`,
  `.section__name`, `.section__meta` — section scaffolding.
- `.reveal`, `.reveal--in` — the scroll-reveal transition (JS adds the classes).
- `.tag` — the mono chip with hover border-lift. Reuse for any chip/pill.
