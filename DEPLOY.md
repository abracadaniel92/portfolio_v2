# Deploy guide

Static SPA. `npm run build` emits `dist/` (plain HTML/CSS/JS + assets) — serve
it as static files. Target: Caddy on the homelab, domain `gmojsoski.com` (this
replaces the previous portfolio at that domain).

## Build

```bash
npm ci
npm run build      # outputs dist/
```

`dist/` is everything: `index.html`, hashed `assets/`, favicons,
`og-image.png`, `site.webmanifest`, and `files/GoceMojsoskiCV.pdf`.

Since the blog landed, the build also emits one prerendered page per route:
`dist/blog/index.html` and `dist/blog/<slug>/index.html` for each post, plus
`sitemap.xml` and `rss.xml` at the root (`robots.txt` ships from `public/`).

## Caddy

Serve `dist/` with SPA-style fallback and security headers. Example
`Caddyfile`:

```caddy
# www serves the identical build, so it must 301 rather than answer 200.
www.gmojsoski.com {
    redir https://gmojsoski.com{uri} permanent
}

gmojsoski.com {
    root * /srv/portfolio/dist
    encode zstd gzip
    file_server
    # {path}/index.html is REQUIRED, not an optimisation. It resolves /blog and
    # /blog/<slug> to their prerendered files. Without it every one of those URLs
    # falls through and serves the homepage at 200, so the whole blog reads as
    # duplicate content.
    #
    # There is deliberately NO /index.html fallback at the end. With one, every
    # unknown URL answers 200 with the homepage, which Google reads as a soft
    # 404. Without it, a miss reaches handle_errors below.
    try_files {path} {path}/index.html

    header {
        # HTTPS only, one year, include subdomains
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        # No MIME sniffing
        X-Content-Type-Options "nosniff"
        # Don't leak full URLs cross-origin
        Referrer-Policy "strict-origin-when-cross-origin"
        # Lock down powerful APIs we don't use
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        # Content Security Policy — tuned to what this site actually loads:
        # self for scripts/img, Google Fonts for CSS+fonts, data: for the SVG grain
        Content-Security-Policy "default-src 'self'; script-src 'self' https://analytics.gmojsoski.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://analytics.gmojsoski.com; connect-src 'self' https://analytics.gmojsoski.com; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
        -Server
    }

    # Long cache for hashed assets, no cache for any prerendered HTML entry.
    # `header` runs before `try_files` rewrites the path, so the blog entries
    # have to be listed explicitly.
    @assets path /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"
    @html path / /index.html /blog /blog/*
    header @html Cache-Control "no-cache"

    # A miss serves the prerendered 404 page WITH a 404 status. An error route is
    # a separate route, so it inherits none of the headers above and has to
    # repeat them.
    handle_errors 404 {
        rewrite * /404.html
        file_server
    }
}
```

On the homelab the error handler cannot live in the site's `handle` block, since
`handle_errors` is a site-level directive and Caddy rejects it inside `handle`
outright. It sits in the shared `handle_errors` in the main `Caddyfile`, matched
to the host with `expression {err.status_code} == 404 && {host} == "gmojsoski.com"`
so other homelab services keep their plain-text errors.

**The live config is not this file.** Caddy runs on the homelab server, and its
real config is `docker/caddy/config.d/10-gmojsoski-home.caddy` plus the
`handle_errors` block in `docker/caddy/Caddyfile`, both in the `lenovo-homelab`
repo (a `handle` block inside one `:80` site, since Cloudflare terminates TLS in
front of it). The block above is the equivalent standalone form. Change the
homelab repo, then reload Caddy there; editing only this file changes nothing.
The apply-and-verify runbook is
`lenovo-homelab/docs/how-to-guides/gmojsoski-404-and-canonical-fix.md`.

Notes on routing:
- Anything unknown returns `dist/404.html` with a real 404 status, which is what
  `src/router.ts` renders for an unmatched path, so the error page is never a
  hydration mismatch. Until 2026-08-09 it fell back to the homepage at 200
  instead, which made every stale inbound link a soft 404.
- **`{path}/index.html` was missing from the live config from the blog launch
  (2026-08-08) until 2026-08-09.** Every post URL served the homepage at 200,
  which is what produced the Search Console "Duplicate, Google chose different
  canonical" and "Duplicate without user-selected canonical" reports. Treat that
  line as load-bearing. The regression test is the `<title>` check in the
  checklist below, not the status code: the broken state returned 200 too.
- **`vite preview` needed a plugin to match this**, since Vite's html fallback
  looks for `<url>.html` and would otherwise serve the homepage for
  `/blog/<slug>` (see `previewDirectoryIndex` in `vite.config.ts`). If a post
  page ever renders as the homepage again, that is the class of bug: a server
  resolving the URL differently from the prerender, not a broken build.
- **The CSP is unchanged.** The blog added no new origins, and the only thing
  the managed `<head>` block adds beyond meta/link tags is a
  `<script type="application/ld+json">` data block. That is not governed by
  `script-src`: a script element whose type is not a JavaScript MIME type is
  never prepared as a script, so the inline check never runs. Verified against
  the exact policy above (element present, readable, no violation event). If a
  real inline `<script>` is ever added, that needs a hash or a nonce.

Notes on the CSP:
- `style-src` needs `'unsafe-inline'` because the build inlines some styles and
  the components use inline `style=` attributes. Fonts come from Google.
- `img-src` needs `data:` for the inline SVG film-grain texture.
- `https://analytics.gmojsoski.com` appears in `script-src` (count.js),
  `connect-src` (sendBeacon hit), and `img-src` (image-fallback hit) for the
  self-hosted GoatCounter snippet in `index.html`. Removing analytics means
  removing the snippet AND these three CSP entries.

Reload: `caddy reload --config /etc/caddy/Caddyfile`.

## Post-deploy checklist

- [ ] `https://gmojsoski.com` serves the new site (hard-refresh; favicons cache hard).
- [ ] Verify headers: `curl -sI https://gmojsoski.com | grep -i -E 'content-security|strict-transport|x-content-type|referrer'`.
- [ ] `/files/GoceMojsoskiCV.pdf` downloads.
- [ ] Re-scrape the social card so the new OG image shows:
      LinkedIn Post Inspector + Facebook Sharing Debugger (they cache aggressively).
- [ ] Spot-check the live Skopje clock in the footer and the menu anchors.
- [ ] **Every sitemap URL serves its own page, not the homepage.** This is the
      one check that catches a broken `try_files`, and a status code will not:
      the failure mode is 200 with the wrong content. Every line must print a
      distinct canonical matching its own URL:

      ```bash
      curl -s https://gmojsoski.com/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g' | while read -r u; do printf '%s -> ' "$u"; curl -s "$u" | grep -o 'rel="canonical" href="[^"]*"' | head -1; done
      ```
- [ ] www 301s to the apex: `curl -sI https://www.gmojsoski.com/ | head -1`
      returns `301`, not `200`. Two hosts serving the same bytes is a duplicate.
- [ ] A miss is a real 404, not the homepage:
      `curl -sI https://gmojsoski.com/definitely-not-a-page | head -1` returns
      `404`. Then load it in a browser: the styled 404 page, no console errors
      (a React #418 there means `404.html` was not the file served).
- [ ] The 404 response still carries the CSP and the other security headers.
      They are repeated inside the error handler because an error route inherits
      nothing: `curl -sI https://gmojsoski.com/definitely-not-a-page | grep -i -E 'content-security|strict-transport'`.
- [ ] `/sitemap.xml`, `/rss.xml` and `/robots.txt` all return 200.
- [ ] Structured data passes: run the homepage and one post through Google's
      Rich Results Test and Schema.org's validator. Both should report a
      `Person` and, on a post, a `BlogPosting` plus breadcrumbs, with no errors.
- [ ] Submit `sitemap.xml` in Google Search Console (one-time, then it recrawls
      on its own).
- [ ] No console errors on a post page (a React error #418 means the wrong
      file was served for the URL and the page is falling back to the homepage).

## Domain / metadata

`index.html` hardcodes absolute social URLs at `https://gmojsoski.com/`
(`og:url`, `og:image`, `twitter:image`). If the domain ever changes, update
those three and regenerate `og-image.png` if the hero changed
(`node` + `sharp`, see `scripts/gen-favicons.mjs` for the pattern).

## Analytics

Self-hosted GoatCounter at `https://analytics.gmojsoski.com` (runs on the
homelab, see the `lenovo-homelab` repo). The count.js snippet sits before
`</body>` in `index.html`; the CSP above allows the origin. The snippet is a
plain external `<script>` (no inline JS — the CSP has no `'unsafe-inline'`
for scripts). Ad blockers will silently drop it; that's expected.

**Deploy-order note:** the live Caddy CSP header must be widened BEFORE (or
with) deploying the site build that contains the snippet, otherwise the
browser blocks count.js and hits are lost until Caddy reloads.

## Rollback

The old portfolio lives at `C:\Users\Admin\Desktop\Cursor\portfolio`
(vanilla HTML + Tailwind). To roll back, point Caddy's `root` at its directory.
```
