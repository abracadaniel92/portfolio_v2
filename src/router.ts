import { POSTS } from "./blog/posts.generated";

/** Every route is prerendered to a real file by scripts/prerender.mjs, so this
 *  only has to answer "what does this URL render". There is no client-side
 *  navigation: in-site links are plain anchors and the server serves the
 *  matching prerendered page.
 *
 *  Unknown paths resolve to "notfound", which is what Caddy serves them: an
 *  unmatched path produces a real 404 whose error handler returns 404.html.
 *  This deliberately does NOT fall back to "home". It used to, back when Caddy
 *  ended its `try_files` with `/index.html`, and the cost was that every stale
 *  or typo'd URL answered 200 with the homepage, which reads as a soft 404. */
export type Route =
  | { kind: "home" }
  | { kind: "blog" }
  | { kind: "post"; slug: string }
  | { kind: "notfound" };

export function parseRoute(pathname: string): Route {
  const path = pathname
    // The prerendered files are directory indexes, so a request can legitimately
    // name one directly (/blog/index.html). Treat it as the directory it indexes
    // or hydration would disagree with the markup that file contains.
    .replace(/\/index\.html$/, "/")
    // Collapse a trailing slash so /blog and /blog/ are the same route.
    .replace(/\/+$/, "");

  if (path === "") return { kind: "home" };

  if (path === "/blog") return { kind: "blog" };

  const match = /^\/blog\/([^/]+)$/.exec(path);
  if (match) {
    const slug = decodeURIComponent(match[1]);
    if (POSTS.some((p) => p.slug === slug)) return { kind: "post", slug };
  }

  return { kind: "notfound" };
}

/** Path a post lives at. Used for links and by the prerender script's output. */
export function postPath(slug: string) {
  return `/blog/${slug}`;
}
