import { useEffect, useRef, useState } from "react";
import "./ScrollTop.css";

const REST_BOTTOM = 24; // px above the viewport bottom at rest
const FOOTER_GAP = 24; // px kept between the button and the footer links block

/** Fixed "to top" control. Hidden over the hero, fades in once scrolled past it
 *  (same threshold as the side rails), then pins itself just above the footer
 *  colophon bar as it scrolls in so it never overlaps. Respects reduced motion
 *  on click. */
function ScrollTop() {
  const [shown, setShown] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.85);

      const btn = btnRef.current;
      // Dock above the footer links (GitHub is the last one), so the button
      // never covers a link as the footer scrolls in — regardless of viewport
      // height or a mobile browser's dynamic toolbar.
      const anchor = document.querySelector(".footer__links");
      if (btn && anchor) {
        const anchorTop = anchor.getBoundingClientRect().top;
        // Lift the button so its bottom edge stays FOOTER_GAP above the links,
        // but never below its resting position.
        const lift = Math.max(
          0,
          window.innerHeight - anchorTop + FOOTER_GAP - REST_BOTTOM
        );
        btn.style.bottom = `${REST_BOTTOM + lift}px`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      className={`to-top${shown ? " to-top--shown" : ""}`}
      aria-label="Scroll to top"
      onClick={toTop}
    >
      [ top ]
    </button>
  );
}

export default ScrollTop;
