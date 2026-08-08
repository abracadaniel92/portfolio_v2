import { useEffect, useRef, useState } from "react";
import "./ScrollTop.css";

const REST_BOTTOM = 24; // px above the viewport bottom at rest
const FOOTER_GAP = 24; // px kept between the button and the footer links block
const MOBILE = "(max-width: 720px)";

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
      if (!btn) return;

      // On mobile the links row wraps and grows tall, so docking above it
      // lifted the button onto "Book a call". There, line the button up with
      // the contact heading instead: it sits above every control in the
      // footer, so nothing can end up underneath it.
      const mobile = window.matchMedia(MOBILE).matches;
      const anchor = document.querySelector(
        mobile ? ".footer__eyebrow" : ".footer__links"
      );
      // No footer on a blog post; the button keeps its resting CSS position.
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();

      if (mobile) {
        // Centre the button on the heading.
        const centred =
          window.innerHeight - rect.top - rect.height / 2 - btn.offsetHeight / 2;
        // Never below the resting position, never off the top of the viewport.
        const maxBottom = window.innerHeight - btn.offsetHeight - REST_BOTTOM;
        btn.style.bottom = `${Math.min(maxBottom, Math.max(REST_BOTTOM, centred))}px`;
        return;
      }

      // Desktop: dock above the footer links (GitHub is the last one), so the
      // button never covers a link as the footer scrolls in — regardless of
      // viewport height or a mobile browser's dynamic toolbar.
      const lift = Math.max(
        0,
        window.innerHeight - rect.top + FOOTER_GAP - REST_BOTTOM
      );
      btn.style.bottom = `${REST_BOTTOM + lift}px`;
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
