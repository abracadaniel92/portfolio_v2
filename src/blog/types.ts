/** One published post. Built from a blog/*.md file by scripts/build-blog.mjs;
 *  `html` is already-rendered markup, so nothing parses markdown at runtime. */
export type Post = {
  slug: string;
  title: string;
  /** ISO day, YYYY-MM-DD. Sorts the archive; edit it in the markdown. */
  date: string;
  /** Display form of `date`, e.g. "08 Aug 2026". */
  dateLabel: string;
  /** Where the work happened. "Homelab" for the self-hosted pieces. */
  company: string;
  summary: string;
  readingTime: string;
  /** Body words. Only used by the `BlogPosting` structured data. */
  wordCount: number;
  /** `## ` headings, in document order, for the contents index. Empty for a
   *  short note with no sections. */
  headings: { id: string; text: string }[];
  html: string;
};
