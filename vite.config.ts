import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve, sep } from 'node:path'

/**
 * Makes `vite preview` resolve directory index files the way the production
 * server does.
 *
 * Vite's html fallback looks for `<url>.html` and, failing that, rewrites to
 * `/index.html`. The blog prerenders to `dist/blog/<slug>/index.html`, so
 * `/blog/<slug>` matched neither: preview served the homepage, the client then
 * hydrated it as a post, and React threw a hydration mismatch (error #418).
 * Nothing was wrong with the build. Caddy's `file_server` resolves the
 * directory's `index.html`, so this makes preview agree with it.
 *
 * Preview only. The dev server has no `dist/`, and still needs the SPA
 * fallback so `/blog` renders client-side there.
 */
function previewDirectoryIndex(): Plugin {
  return {
    name: 'preview-directory-index',
    configurePreviewServer(server) {
      // Registered directly, so it runs before Vite's html fallback.
      const outDir = resolve(server.config.root, server.config.build.outDir)

      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? '/').split('?')
        if (pathname.endsWith('/')) return next()

        const candidate = resolve(outDir, `.${decodeURIComponent(pathname)}`, 'index.html')
        // Never let a crafted path escape dist/.
        if (candidate.startsWith(outDir + sep) && existsSync(candidate)) {
          req.url = `${pathname}/index.html${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), previewDirectoryIndex()],
})
