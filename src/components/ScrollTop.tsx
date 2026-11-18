import "./ScrollTop.css";

/** "Back to top" arrow at the very end of every page (after the footer, or
 *  after a post's newer/older nav). Static, not floating: it only shows once
 *  the reader has reached the bottom. Respects reduced motion on click. */
function ScrollTop() {
  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="to-top-row">
      <button
        type="button"
        className="to-top"
        aria-label="Back to top"
        onClick={toTop}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}

export default ScrollTop;
