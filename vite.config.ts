import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'

/**
 * Makes `vite preview` resolve URLs the way the production server does, for both
 * directory indexes and misses.
 *
 * Vite's html fallback looks for `<url>.html` and, failing that, rewrites to
 * `/index.html`. That is wrong twice over here. The blog prerenders to
 * `dist/blog/<slug>/index.html`, so `/blog/<slug>` matched neither: preview
 * served the homepage, the client then hydrated it as a post, and React threw a
 * hydration mismatch (error #418). And an unknown path fell back to the
 * homepage at 200, which is exactly the soft 404 that Caddy's error handler and
 * `dist/404.html` now exist to avoid.
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

        if (!pathname.endsWith('/')) {
          const index = resolve(target, 'index.html')
          if (existsSync(index)) {
            req.url = `${pathname}/index.html${search}`
            return next()
          }
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
