// Bakes the app's static markup into one real HTML file per route, so crawlers
// and the first paint get real content before any JS runs. The client hydrates
// that markup (see src/main.tsx). Runs after the client + SSR builds in
// `npm run build`; uses only Vite output + react-dom/server.
//
// Routes:
//   /              -> dist/index.html
//   /blog          -> dist/blog/index.html
//   /blog/<slug>   -> dist/blog/<slug>/index.html
//
// Caddy's `try_files {path} /index.html` serves those directories directly and
// still falls back to the homepage for anything unknown, so no server config
// change is needed.
//
// Also emits sitemap.xml and rss.xml from the same post data.
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import {
  loadPosts,
  escapeHtml,
  toRfc822,
  SITE_URL,
  SITE_AUTHOR,
  BLOG_TITLE,
  BLOG_DESCRIPTION,
} from "./blog-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");
const serverEntry = resolve(distDir, "server/entry-server.js");

const OG_IMAGE = `${SITE_URL}/og-image.png`;
const ROOT_MARKER = '<div id="root"></div>';
const HEAD_START = "<!-- head:meta:start -->";
const HEAD_END = "<!-- head:meta:end -->";

const { render } = await import(pathToFileURL(serverEntry).href);
const template = await readFile(indexPath, "utf8");

for (const marker of [ROOT_MARKER, HEAD_START, HEAD_END]) {
  if (!template.includes(marker)) {
    throw new Error(`prerender: could not find "${marker}" in dist/index.html`);
  }
}

const posts = await loadPosts();

/** One entry per page to emit. `out` is relative to dist/. */
const routes = [
  {
    path: "/",
    out: "index.html",
    title: "Goce Mojsoski · Product & Delivery",
    socialTitle: "Goce Mojsoski · Product & Delivery Leader",
    description:
      "Product and delivery leader. A decade shipping products, teams and outcomes across cloud, SaaS and commerce, US and Europe.",
    ogType: "website",
  },
  {
    path: "/blog",
    out: "blog/index.html",
    title: BLOG_TITLE,
    socialTitle: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    ogType: "website",
  },
  ...posts.map((post) => ({
    path: `/blog/${post.slug}`,
    out: `blog/${post.slug}/index.html`,
    title: `${post.title} · Goce Mojsoski`,
    socialTitle: post.title,
    description: post.summary,
    ogType: "article",
    publishedTime: post.date,
  })),
];

/** The per-route replacement for the managed block in index.html's <head>. */
function headBlock(route) {
  const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.title);
  const socialTitle = escapeHtml(route.socialTitle);
  const description = escapeHtml(route.description);

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="${SITE_AUTHOR}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(
      BLOG_TITLE
    )}" href="${SITE_URL}/rss.xml" />`,
    `<meta property="og:type" content="${route.ogType}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${socialTitle}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    route.publishedTime
      ? `<meta property="article:published_time" content="${route.publishedTime}" />`
      : null,
    route.publishedTime
      ? `<meta property="article:author" content="${SITE_AUTHOR}" />`
      : null,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${socialTitle}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

for (const route of routes) {
  const appHtml = render(route.path);

  const headStart = template.indexOf(HEAD_START);
  const headEnd = template.indexOf(HEAD_END) + HEAD_END.length;
  const html = (
    template.slice(0, headStart) +
    headBlock(route) +
    template.slice(headEnd)
  ).replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`);

  const outPath = resolve(distDir, route.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
}

// ---- sitemap.xml ----
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
    const lastmod = route.publishedTime ?? posts[0]?.date;
    return [
      "  <url>",
      `    <loc>${url}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <priority>${route.path === "/" ? "1.0" : "0.7"}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n")}
</urlset>
`;
await writeFile(resolve(distDir, "sitemap.xml"), sitemap);

// ---- rss.xml ----
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeHtml(BLOG_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeHtml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map((post) =>
    [
      "    <item>",
      `      <title>${escapeHtml(post.title)}</title>`,
      `      <link>${SITE_URL}/blog/${post.slug}</link>`,
      `      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>`,
      `      <pubDate>${toRfc822(post.date)}</pubDate>`,
      `      <category>${escapeHtml(post.company)}</category>`,
      `      <description>${escapeHtml(post.summary)}</description>`,
      `      <content:encoded><![CDATA[${post.html}]]></content:encoded>`,
      "    </item>",
    ].join("\n")
  )
  .join("\n")}
  </channel>
</rss>
`;
await writeFile(resolve(distDir, "rss.xml"), rss);

// The SSR bundle is a build artifact only; don't ship it.
await rm(resolve(distDir, "server"), { recursive: true, force: true });

console.log(
  `prerender: wrote ${routes.length} pages (${posts.length} posts), sitemap.xml and rss.xml`
);
