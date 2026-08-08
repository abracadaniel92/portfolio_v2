import BlogHeader from "./BlogHeader";
import { POSTS } from "../blog/posts.generated";
import { postPath } from "../router";
import type { Post } from "../blog/types";
import "./BlogPost.css";

/** /blog/:slug. `post.html` is rendered from markdown at build time by
 *  scripts/build-blog.mjs, so nothing parses markdown in the browser. The
 *  source is this repo's own blog/*.md, and raw HTML in it is escaped there.
 *
 *  Three columns on a wide screen: contents index, prose, spec rail. The prose
 *  stays at a readable measure and the rails carry the width instead of the
 *  page ending in dead space. Everything stacks below 1080px. */
function BlogPost({ post }: { post: Post }) {
  const i = POSTS.findIndex((p) => p.slug === post.slug);
  const newer = i > 0 ? POSTS[i - 1] : undefined;
  const older = i < POSTS.length - 1 ? POSTS[i + 1] : undefined;

  return (
    <>
      <BlogHeader current="post" />

      <article className="section post">
        <header className="post__head">
          <span className="post__mark" aria-hidden="true" />
          <h1 className="post__title">{post.title}</h1>
          <p className="post__summary">{post.summary}</p>
        </header>

        <div className="post__layout">
          {post.headings.length > 0 && (
            <nav className="post__contents" aria-label="On this page">
              <p className="post__rail-label">Contents</p>
              <ol>
                {post.headings.map((h, n) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>
                      <span className="post__contents-no" aria-hidden="true">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span>{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="post__body"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <aside className="post__spec">
            <p className="post__rail-label">Filed</p>
            <dl>
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={post.date}>{post.dateLabel}</time>
                </dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{post.company}</dd>
              </div>
              <div>
                <dt>Reading</dt>
                <dd>{post.readingTime}</dd>
              </div>
            </dl>
            <a className="post__spec-link" href="/blog">
              All posts →
            </a>
          </aside>
        </div>

        <nav className="post__nav" aria-label="More posts">
          {newer && (
            <a className="post__nav-link" href={postPath(newer.slug)}>
              <span className="post__nav-label">← Newer</span>
              <span className="post__nav-title">{newer.title}</span>
            </a>
          )}
          {older && (
            <a
              className="post__nav-link post__nav-link--older"
              href={postPath(older.slug)}
            >
              <span className="post__nav-label">Older →</span>
              <span className="post__nav-title">{older.title}</span>
            </a>
          )}
        </nav>
      </article>
    </>
  );
}

export default BlogPost;
