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
        Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
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
- If GoatCounter analytics is re-added later (see below), extend `script-src`
  and `connect-src` with the analytics origin.

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

## Optional: analytics

The previous site used self-hosted GoatCounter at
`https://analytics.gmojsoski.com`. It was intentionally left out of this build.
To re-add, drop the count.js snippet before `</body>` in `index.html` and widen
the CSP `script-src`/`connect-src` to include `https://analytics.gmojsoski.com`.

## Rollback

The old portfolio lives at `C:\Users\Admin\Desktop\Cursor\portfolio`
(vanilla HTML + Tailwind). To roll back, point Caddy's `root` at its directory.
```
