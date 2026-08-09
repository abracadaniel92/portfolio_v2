import BlogHeader from "./BlogHeader";
import "./NotFound.css";

const LEAD =
  "Nothing lives at this address. Either the URL picked up a typo on the way here, or it points at a page that moved and left the link behind.";

const DESTINATIONS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
] as const;

/** Served by Caddy's error handler as 404.html, with a real 404 status, for any
 *  path that does not resolve to a prerendered page. Led by a masthead like
 *  /blog rather than the mono section head, since it is a page of its own. */
function NotFound() {
  return (
    <>
      <BlogHeader current="notfound" />

      <section className="section">
        <header className="notfound__head">
          <span className="notfound__mark" aria-hidden="true" />
          <p className="notfound__code">Error 404</p>
          <h1 className="notfound__title">Page not found</h1>
          <p className="notfound__lead">{LEAD}</p>
        </header>

        <nav className="notfound__links" aria-label="Other pages">
          {/* The label is one interpolated string, not `[ {dest.label} ]`: three
              JSX children would prerender as `[ <!-- -->Home<!-- --> ]`. */}
          {DESTINATIONS.map((dest) => (
            <a className="notfound__link" href={dest.href} key={dest.href}>
              {`[ ${dest.label} ]`}
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}

export default NotFound;
