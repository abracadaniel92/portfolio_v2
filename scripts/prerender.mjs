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
  toUtcNoon,
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
const OG_IMAGE_ALT = "Goce Mojsoski, product and delivery leader";
const JOB_TITLE = "Product & Delivery Leader";
const SOCIAL_PROFILES = [
  "https://linkedin.com/in/gmojsoski",
  "https://github.com/abracadaniel92",
];
const ROOT_MARKER = '<div id="root"></div>';
const HEAD_START = "<!-- head:meta:start -->";
const HEAD_END = "<!-- head:meta:end -->";

// Stable @id anchors so the nodes on one page cross-reference each other and
// so a crawler can merge the Person seen on the homepage with the author of
// every post into a single entity.
const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;
const BLOG_ID = `${SITE_URL}/blog#blog`;

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
    post,
  })),
];

// ---- JSON-LD ----------------------------------------------------------------
// One `@graph` per page. This is the site's only machine-readable description of
// who wrote what and when: search engines get an author entity, a blog, and a
// dated article per post instead of having to infer them from the markup.
//
// These are `<script type="application/ld+json">` data blocks, which the CSP's
// `script-src` does not govern (a non-JS type never reaches the inline check),
// so no header change is needed. Verified against the live policy.

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_AUTHOR,
  url: `${SITE_URL}/`,
  jobTitle: JOB_TITLE,
  image: OG_IMAGE,
  sameAs: SOCIAL_PROFILES,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Skopje",
    addressCountry: "MK",
  },
};

const siteNode = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_AUTHOR,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

function breadcrumbNode(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: step.url,
    })),
  };
}

function postingNode(post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.summary,
    // Day-precision dates, pinned to noon UTC like the feed. Nothing here is
    // edited after publication, so modified mirrors published.
    datePublished: toUtcNoon(post.date),
    dateModified: toUtcNoon(post.date),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    image: OG_IMAGE,
    inLanguage: "en",
    isPartOf: { "@id": BLOG_ID },
    articleSection: post.company,
    keywords: post.company,
    wordCount: post.wordCount,
  };
}

function structuredData(route) {
  if (route.post) {
    return [
      personNode,
      postingNode(route.post),
      breadcrumbNode([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: route.post.title, url: `${SITE_URL}/blog/${route.post.slug}` },
      ]),
    ];
  }

  if (route.path === "/blog") {
    return [
      personNode,
      siteNode,
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: `${SITE_URL}/blog`,
        name: BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": SITE_ID },
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${post.slug}#post`,
        })),
      },
      breadcrumbNode([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Blog", url: `${SITE_URL}/blog` },
      ]),
    ];
  }

  return [
    personNode,
    siteNode,
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: route.title,
      description: route.description,
      inLanguage: "en",
      isPartOf: { "@id": SITE_ID },
      // `mainEntity`, not `about`: Google requires it on a ProfilePage and
      // rejects the page as invalid without it. The two read alike, but only
      // this one says "the page IS about this person" strongly enough to count.
      mainEntity: { "@id": PERSON_ID },
      // Spelled out as an ImageObject. Handed a bare URL string, Google coerces
      // it to an ImageObject with the URL parked in `name` and no `url` at all.
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
    },
  ];
}

/** A JSON-LD data block. `<` is escaped so a value can never close the script
 *  element early; the rest of JSON needs no HTML escaping inside one. */
function jsonLd(route) {
  const graph = JSON.stringify(
    { "@context": "https://schema.org", "@graph": structuredData(route) },
    null,
    2
  ).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${graph}\n    </script>`;
}

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
    // Default indexing, but opt in to full-size image previews and untruncated
    // snippets. Without max-image-preview:large the card in Google Discover and
    // in image-rich results falls back to a thumbnail.
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(
      BLOG_TITLE
    )}" href="${SITE_URL}/rss.xml" />`,
    `<meta property="og:type" content="${route.ogType}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${SITE_AUTHOR}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${socialTitle}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    route.publishedTime
      ? `<meta property="article:published_time" content="${toUtcNoon(
          route.publishedTime
        )}" />`
      : null,
    route.publishedTime
      ? `<meta property="article:modified_time" content="${toUtcNoon(
          route.publishedTime
        )}" />`
      : null,
    route.publishedTime
      ? `<meta property="article:author" content="${SITE_AUTHOR}" />`
      : null,
    route.post
      ? `<meta property="article:section" content="${escapeHtml(
          route.post.company
        )}" />`
      : null,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${socialTitle}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />`,
    jsonLd(route),
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
// Posts are sorted newest first, so the first one dates the feed. Empty is only
// possible before the first post exists.
const lastBuild = posts[0]
  ? `\n    <lastBuildDate>${toRfc822(posts[0].date)}</lastBuildDate>`
  : "";
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeHtml(BLOG_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeHtml(BLOG_DESCRIPTION)}</description>
    <language>en</language>${lastBuild}
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
