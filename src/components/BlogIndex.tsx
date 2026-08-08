import BlogHeader from "./BlogHeader";
import { POSTS } from "../blog/posts.generated";
import { postPath } from "../router";
import "./BlogIndex.css";

const LEAD =
  "Build writeups and delivery lessons. What got shipped, what it cost, and what I would not do again. Mostly Jira automation, platform migrations and a homelab that keeps finding new ways to fail.";

/** /blog. The full archive as numbered rows, newest first. Led by a masthead
 *  rather than the mono section head the homepage sections use: this is a page
 *  in its own right, not a section of another one. */
function BlogIndex() {
  return (
    <>
      <BlogHeader current="index" />

      <section className="section" id="blog">
        <header className="blog-index__head">
          <span className="blog-index__mark" aria-hidden="true" />
          <h1 className="blog-index__title">Blog</h1>
          <p className="blog-index__lead">{LEAD}</p>
          <p className="blog-index__meta">
            {String(POSTS.length).padStart(2, "0")} posts · Newest first
          </p>
        </header>

        <ol className="blog-index">
          {POSTS.map((post, i) => (
            <li className="post-row" key={post.slug}>
              <a className="post-row__link" href={postPath(post.slug)}>
                <span className="post-row__no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="post-row__main">
                  {/* h2 under the page's h1: the archive's outline is its list
                      of posts. */}
                  <h2 className="post-row__title">{post.title}</h2>
                  <span className="post-row__summary">{post.summary}</span>
                  <span className="post-row__tags">
                    <span className="tag">{post.company}</span>
                    <span className="tag">{post.readingTime}</span>
                  </span>
                </div>
                <time className="post-row__date" dateTime={post.date}>
                  {post.dateLabel}
                </time>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

export default BlogIndex;
