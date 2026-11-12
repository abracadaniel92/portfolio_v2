---
title: "Moving my portfolio to Cloudflare Workers: two defaults that would have quietly broken my SEO"
date: 2026-11-12
company: "Homelab"
summary: "Moving a static site from a self-hosted Caddy server to Cloudflare looks like a five-minute job. Two defaults would have turned every blog URL into a redirect and every missing page into a 200 homepage."
---

# Moving my portfolio to Cloudflare Workers: two defaults that would have quietly broken my SEO

*Written with AI help, reviewed by the author.*

This site used to run on my homelab: a Lenovo mini PC serving about 30
containers, with Caddy behind a Cloudflare Tunnel. That setup is great for
me. It's less great for the one page strangers actually look at. When the
server went down, lost power, or my ISP had a bad hour, the portfolio went
with it.

The site is a static Vite build with no backend, so a CDN is the obvious
home. I moved it to Cloudflare Workers static assets. The move itself took
an afternoon. Two of Cloudflare's defaults would have broken things without
a single error, and I only caught them by reading the build log and checking
the preview URL before touching DNS.

## Default 1: a directory index means a redirect

My build prerenders every route to HTML so search engines and link previews
get real content. It wrote the files the classic way:

```
/blog          -> dist/blog/index.html
/blog/<slug>   -> dist/blog/<slug>/index.html
```

Caddy serves `/blog/my-post` from `blog/my-post/index.html` with a 200.
Cloudflare's static assets don't. For a directory index, they answer
`/blog/my-post` with a 307 redirect to `/blog/my-post/`, with a trailing
slash.

That sounds harmless, but every canonical tag and every sitemap entry on
the site points at the address without the slash. After the move, each of
those URLs would have been a redirect to a different URL. Search engines
treat that as "the page you told me is canonical isn't really a page", and
nothing in a browser looks wrong while it happens.

## Fix: flat `.html` files

Instead of changing every URL, I changed what the prerender writes:

```
/blog          -> dist/blog.html
/blog/<slug>   -> dist/blog/<slug>.html
```

A flat `post.html` file is served at the bare path `/blog/post` with a 200,
no redirect.

The homelab copy still had to work, both as a fallback and because the
change landed there first. Its Caddy block only tried
`{path}/index.html`, so one line changed:

```
try_files {path} {path}.html {path}/index.html
```

That serves both the old and the new build layout, so the order of
deploys didn't matter.

## Default 2: no config file means SPA mode

The Cloudflare dashboard's "connect a Git repo" flow now creates a Worker,
not a Pages project. Its deploy command is `npx wrangler deploy`. If your
repo has no Wrangler config, `wrangler deploy` sets one up for you on the
build server. In my case that auto-setup did two things I didn't ask for:

1. It added `@cloudflare/vite-plugin` to the Vite config on the build
   machine, which broke my prerender step.
2. It picked single-page-app mode for missing URLs.

The second one is the quiet one. In SPA mode, any URL that doesn't match a
file gets the homepage with a **200** status. A typo, a dead link, an old
URL: all "succeed". That's a soft 404. To a search engine it looks like
your site has an endless number of copies of its homepage, and to a visitor
a broken link looks like a redirect to the start page with no explanation.

## Fix: commit a `wrangler.jsonc`

The fix is to never let the auto-setup run. One small file, committed to
the repo:

```jsonc
{
  "name": "my-portfolio",
  "compatibility_date": "2026-11-04",
  "assets": {
    "directory": "./dist",
    // Misses get dist/404.html with a real 404 status, never the homepage.
    "not_found_handling": "404-page"
  }
}
```

No Worker script, just the built `dist/` folder, and a real 404 page with a
real 404 status for anything that doesn't exist.

## Check on the preview URL, then move DNS

Every Worker gets a `*.workers.dev` address, so I could test the real
deployment while the homelab kept serving the domain. Before switching
anything I checked:

- `/`, `/blog` and every post returned 200 with its own title, and each
  post's canonical tag matched its own address.
- A made-up URL returned 404 with the styled 404 page, and the security
  headers (CSP, HSTS) were on the 404 response too.
- `/assets/*` came back with immutable caching; the CV, sitemap, RSS feed
  and `robots.txt` all returned 200.

## Cutover and rollback

The cutover was two dashboard steps: delete the apex DNS record that
pointed at the tunnel, and add the domain as the Worker's custom domain.
To tell which one is answering, I compared the HTML's `cache-control`
header: the Workers copy sends `public, max-age=0, must-revalidate`, while
Caddy sends `no-cache`.

Nothing changed on the homelab. The tunnel route and the Caddy block are
still there, unused. If Cloudflare ever has a bad day for this site,
rollback is removing the custom domain and one command on the server:

```bash
cloudflared tunnel route dns <tunnel-name> gmojsoski.com
```

Caddy serves again within a minute.

## What I'd tell someone doing the same move

- If your build writes `something/index.html`, check what your new host
  does with `/something`. A redirect is easy to miss in a browser and
  costly in a sitemap.
- Commit your host's config file before the first deploy. A tool that
  "helpfully" sets itself up on a build server will make choices for you,
  and you only see them in the build log.
- Test a URL that doesn't exist. If it returns 200, you have soft 404s.
- Keep the old host warm until you've lived with the new one for a while.
