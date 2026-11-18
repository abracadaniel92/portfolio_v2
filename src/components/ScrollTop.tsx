import "./ScrollTop.css";

/** "Back to top" arrow. Static, not floating: it sits at the right end of the
 *  contact links row in the footer, and in its own row after a post's
 *  newer/older nav (posts have no footer). Respects reduced motion on click. */
function ScrollTop() {
  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="to-top"
      aria-label="Back to top"
      onClick={toTop}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}

export default ScrollTop;
