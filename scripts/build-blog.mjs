// Turns blog/*.md into src/blog/posts.generated.ts, the typed module the app
// imports. Runs as `prebuild` / `predev` / `prelint` so the file is always in
// sync with the markdown; it is gitignored, since the markdown is the source.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadPosts } from "./blog-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "src/blog");
const outFile = resolve(outDir, "posts.generated.ts");

const posts = await loadPosts();

const contents = `// GENERATED FILE. Do not edit, and do not commit.
// Written by scripts/build-blog.mjs from blog/*.md. To change a post, edit the
// markdown; the next build regenerates this.
import type { Post } from "./types";

export const POSTS: Post[] = ${JSON.stringify(posts, null, 2)};
`;

await mkdir(outDir, { recursive: true });
await writeFile(outFile, contents);

console.log(`build-blog: wrote ${posts.length} posts to src/blog/posts.generated.ts`);
