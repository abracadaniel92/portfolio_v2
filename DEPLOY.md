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

## Caddy

Serve `dist/` with SPA-style fallback and security headers. Example
`Caddyfile`:

```caddy
gmojsoski.com, www.gmojsoski.com {
    root * /srv/portfolio/dist
    encode zstd gzip
    file_server
    try_files {path} /index.html

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

    # Long cache for hashed assets, no cache for the HTML entry
    @assets path /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"
    @html path /index.html
    header @html Cache-Control "no-cache"
}
```

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
