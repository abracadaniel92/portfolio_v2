import "./BlogHeader.css";

/** Blog pages have no hero, so they get this in place of the hero topbar. Same
 *  mono bar, same hairline, one row of anchors. Everything is a plain link:
 *  each route is a real prerendered page, so no JS is involved in navigation. */
function BlogHeader({ current }: { current: "index" | "post" }) {
  return (
    <header className="blogbar">
      <a className="blogbar__brand" href="/">
        Goce Mojsoski
      </a>
      <span className="blogbar__meta">Blog</span>
      {current === "post" ? (
        <a className="blogbar__back" href="/blog">
          ← All posts
        </a>
      ) : (
        <a className="blogbar__back" href="/">
          ← Index
        </a>
      )}
      <a className="blogbar__resume" href="/files/GoceMojsoskiCV.pdf" download>
        Resume ↓
      </a>
    </header>
  );
}

export default BlogHeader;
