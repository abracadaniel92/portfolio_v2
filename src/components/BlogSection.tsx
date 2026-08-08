import { POSTS } from "../blog/posts.generated";
import { postPath } from "../router";
import "./BlogSection.css";

/** How many posts surface on the homepage. The rest live at /blog. */
const FEATURED = 3;

/** Homepage section 07. Numbered rows, same skeleton as Selected work, so the
 *  page reads as one index rather than a portfolio with a blog bolted on. */
function BlogSection() {
  const featured = POSTS.slice(0, FEATURED);

  return (
    <section className="section" id="blog">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">07</span>
          <span className="section__name">Blog</span>
        </span>
        <span className="section__meta">
          {String(POSTS.length).padStart(2, "0")} posts · Notes from the work
        </span>
      </div>

      <ol className="blog-section">
        {featured.map((post, i) => (
          <li className="blog-section__row" key={post.slug}>
            <a className="blog-section__link" href={postPath(post.slug)}>
              <span className="blog-section__no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="blog-section__main">
                <span className="blog-section__title">{post.title}</span>
                <span className="blog-section__summary">{post.summary}</span>
                <span className="blog-section__tags">
                  <span className="tag">{post.company}</span>
                  <span className="tag">{post.readingTime}</span>
                </span>
              </span>
              <span className="blog-section__date">{post.dateLabel}</span>
            </a>
          </li>
        ))}
      </ol>

      <a className="blog-section__all" href="/blog">
        All posts →
      </a>
    </section>
  );
}

export default BlogSection;
