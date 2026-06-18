import { useEffect } from "react";
import Hero from "./components/Hero";
import SelectedWork from "./components/SelectedWork";
import Capacity from "./components/Capacity";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import PersonalProjects from "./components/PersonalProjects";
import Footer from "./components/Footer";
import Rails from "./components/Rails";
import "./App.css";

const REVEAL_SELECTOR =
  ".section__head, .work-row, .exp, .pillar, .lab-card, .homelab, .capacity__lead, .stats";

function App() {
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
      <Hero />
      <SelectedWork />
      <Capacity />
      <Experience />
      <Skills />
      <PersonalProjects />
      <Footer />
    </>
  );
}

export default App;
