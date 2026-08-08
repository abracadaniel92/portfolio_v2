// Single source of truth for blog content at build time. Reads blog/*.md,
// parses the frontmatter block, and renders the body to HTML with `marked`.
//
// `marked` is a devDependency and runs ONLY here, at build time. The browser
// never receives a markdown parser; it gets the finished HTML baked into the
// page by scripts/prerender.mjs. Runtime deps stay react + react-dom.
//
// Consumed by scripts/build-blog.mjs (emits the typed module the app imports)
// and scripts/prerender.mjs (per-route pages, sitemap, RSS).
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { marked } from "marked";

export const SITE_URL = "https://gmojsoski.com";
export const SITE_AUTHOR = "Goce Mojsoski";
export const BLOG_TITLE = "Blog · Goce Mojsoski";
export const BLOG_DESCRIPTION =
  "Notes on delivery, platform work and a self-hosted homelab. Build writeups and lessons from shipping products across cloud, SaaS and commerce.";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const blogDir = resolve(root, "blog");

// Files in blog/ that are working notes, not posts.
const NOT_A_POST = new Set(["EDITORIAL_LOG.md"]);

const REQUIRED_FIELDS = ["title", "date", "company", "summary"];

/** Heading text -> URL fragment. Used for both the `id` the renderer writes
 *  and the contents index the post page builds, so the two always agree. */
function slugifyHeading(text) {
  return stripInlineMarkdown(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Headings can contain `code` or **bold**. The contents index is plain text,
 *  so unwrap those rather than showing the markers. */
function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1");
}

marked.use({
  renderer: {
    /** Raw HTML in a post is escaped rather than passed through. The drafts
     *  are plain markdown, so nothing is lost, and it keeps a stray `<` from
     *  silently becoming live markup. Delete this to allow inline HTML. */
    html(token) {
      return escapeHtml(token.raw);
    },
    /** Section headings get an id so the contents index can link to them. */
    heading(token) {
      const inner = this.parser.parseInline(token.tokens);
      const id = slugifyHeading(token.text);
      return `<h${token.depth} id="${id}">${inner}</h${token.depth}>\n`;
    },
  },
});

export function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Minimal frontmatter parser: `key: value`, one per line, optional matching
 *  surrounding quotes. Deliberately not a YAML implementation. Anything more
 *  structured than a flat string map should not go in frontmatter. */
function parseFrontmatter(raw, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    throw new Error(`${file}: missing frontmatter block`);
  }

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const sep = line.indexOf(":");
    if (sep === -1) throw new Error(`${file}: frontmatter line has no key: ${line}`);
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) throw new Error(`${file}: frontmatter is missing "${field}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error(`${file}: date must be YYYY-MM-DD, got "${data.date}"`);
  }

  return { data, body: raw.slice(match[0].length) };
}

/** The drafts open with an `# H1` that repeats the frontmatter title. The page
 *  renders the title itself, so drop it rather than shipping two h1s. */
function stripLeadingH1(body) {
  return body.replace(/^\s*#\s+.*(\r?\n)+/, "");
}

/** "2026-08-08" -> "08 Aug 2026". Rendered as an uppercase mono label. */
export function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

/** RFC 822, for the RSS feed. Posts carry a date but no time; noon UTC keeps
 *  the displayed day the same on both sides of the Atlantic. */
export function toRfc822(iso) {
  return new Date(`${iso}T12:00:00Z`).toUTCString();
}

export async function loadPosts() {
  const files = (await readdir(blogDir))
    .filter((f) => f.endsWith(".md") && !NOT_A_POST.has(f))
    .sort();

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(resolve(blogDir, file), "utf8");
      const { data, body } = parseFrontmatter(raw, file);
      const content = stripLeadingH1(body);
      const words = content.split(/\s+/).filter(Boolean).length;

      // Section headings, for the contents index on the post page. Read from
      // the lexer rather than the rendered HTML so the ids here and the ids
      // the renderer writes come from the same slugify.
      const headings = marked
        .lexer(content)
        .filter((t) => t.type === "heading" && t.depth === 2)
        .map((t) => ({ id: slugifyHeading(t.text), text: stripInlineMarkdown(t.text) }));

      const ids = new Set();
      for (const h of headings) {
        if (ids.has(h.id)) {
          throw new Error(`${file}: two "## ${h.text}" headings collide on #${h.id}`);
        }
        ids.add(h.id);
      }

      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        dateLabel: formatDate(data.date),
        company: data.company,
        summary: data.summary,
        readingTime: `${Math.max(1, Math.round(words / 200))} min`,
        headings,
        html: marked.parse(content).trim(),
      };
    })
  );

  // Newest first. Dates are day-precision and a batch of drafts can share one,
  // so title breaks the tie to keep the order stable across builds.
  posts.sort((a, b) =>
    a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)
  );

  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`duplicate slug: ${post.slug}`);
    slugs.add(post.slug);
  }

  return posts;
}
