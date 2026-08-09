import { useEffect } from "react";
import Home from "./components/Home";
import BlogIndex from "./components/BlogIndex";
import BlogPost from "./components/BlogPost";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import Rails from "./components/Rails";
import ScrollTop from "./components/ScrollTop";
import { POSTS } from "./blog/posts.generated";
import type { Route } from "./router";
import "./App.css";

const REVEAL_SELECTOR =
  ".section__head, .work-row, .exp, .pillar, .lab-card, .homelab, .capacity__lead, .stats, .blog-section__row, .post-row";

function App({ route }: { route: Route }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(
      document.querySelectorAll(REVEAL_SELECTOR)
    ) as HTMLElement[];
    targets.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -14% 0px" }
    );
    targets.forEach((el) => io.observe(el));

    // Footer reveals as one block, tied to the "Let's build something" heading,
    // so the social links don't lag behind and force extra scrolling.
    const footerChildren = Array.from(
      document.querySelectorAll(".footer__inner > *")
    ) as HTMLElement[];
    const footerTrigger = document.querySelector(".footer__cta");
    let footerIo: IntersectionObserver | undefined;
    if (footerTrigger && footerChildren.length) {
      footerChildren.forEach((el) => el.classList.add("reveal"));
      footerIo = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            footerChildren.forEach((el) => el.classList.add("reveal--in"));
            footerIo?.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -14% 0px" }
      );
      footerIo.observe(footerTrigger);
    }

    return () => {
      io.disconnect();
      footerIo?.disconnect();
    };
  }, []);

  return (
    <>
      <Rails />
      {route.kind === "home" && <Home />}
      {route.kind === "blog" && <BlogIndex />}
      {route.kind === "post" && (
        <BlogPost post={POSTS.find((p) => p.slug === route.slug)!} />
      )}
      {route.kind === "notfound" && <NotFound />}
      {/* A post ends on its own newer/older nav. The contact pitch belongs on
          the homepage and the blog index, not at the foot of every article. */}
      {route.kind !== "post" && <Footer />}
      <ScrollTop />
    </>
  );
}

export default App;
