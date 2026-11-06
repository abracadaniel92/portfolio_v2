import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'

/**
 * Makes `vite preview` resolve URLs the way production (Cloudflare Pages, and
 * Caddy's `try_files {path} {path}.html`) does, for both pages and misses.
 *
 * The blog prerenders to `dist/blog.html` and `dist/blog/<slug>.html`, served
 * at the bare path. This middleware maps `/blog/<slug>` to its `.html` file
 * explicitly rather than trusting Vite's html fallback, and turns an unknown
 * path into `dist/404.html` with a real 404 instead of the homepage at 200 (a
 * soft 404, and a React #418 hydration mismatch on a post URL).
 *
 * Preview only. The dev server has no `dist/`, and still needs the SPA fallback
 * so `/blog` renders client-side there.
 */
function previewDirectoryIndex(): Plugin {
  return {
    name: 'preview-directory-index',
    configurePreviewServer(server) {
      // Registered directly, so it runs before Vite's html fallback.
      const outDir = resolve(server.config.root, server.config.build.outDir)
      // Never let a crafted path escape dist/.
      const inside = (p: string) => p === outDir || p.startsWith(outDir + sep)

      server.middlewares.use((req, res, next) => {
        const [pathname, query] = (req.url ?? '/').split('?')
        const search = query ? `?${query}` : ''
        const target = resolve(outDir, `.${decodeURIComponent(pathname)}`)
        if (!inside(target)) return next()

        if (!pathname.endsWith('/') && existsSync(`${target}.html`)) {
          req.url = `${pathname}.html${search}`
          return next()
        }

        // A real file, or a directory Vite will serve the index of.
        if (existsSync(target)) return next()

        // Miss. Mirror Caddy's error handler: 404.html with a real 404 status.
        // Written directly rather than rewritten to `/404.html`, because Vite's
        // static middleware sets its own 200 on anything it serves.
        const page = resolve(outDir, '404.html')
        if (!existsSync(page)) return next()
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(page))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), previewDirectoryIndex()],
})
