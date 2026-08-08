import { POSTS } from "./blog/posts.generated";

/** Every route is prerendered to a real file by scripts/prerender.mjs, so this
 *  only has to answer "what does this URL render". There is no client-side
 *  navigation: in-site links are plain anchors and the server serves the
 *  matching prerendered page.
 *
 *  Unknown paths resolve to "home" on purpose. Caddy's `try_files {path}
 *  /index.html` serves the prerendered homepage for anything it cannot find,
 *  so home is what the markup already says, and hydration agrees with it. */
export type Route =
  | { kind: "home" }
  | { kind: "blog" }
  | { kind: "post"; slug: string };

export function parseRoute(pathname: string): Route {
  // Collapse a trailing slash so /blog and /blog/ are the same route.
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/blog") return { kind: "blog" };

  const match = /^\/blog\/([^/]+)$/.exec(path);
  if (match) {
    const slug = decodeURIComponent(match[1]);
    if (POSTS.some((p) => p.slug === slug)) return { kind: "post", slug };
  }

  return { kind: "home" };
}

/** Path a post lives at. Used for links and by the prerender script's output. */
export function postPath(slug: string) {
  return `/blog/${slug}`;
}
