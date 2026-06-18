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
  ".section__head, .work-row, .exp, .pillar, .lab-card, .homelab, .capacity__lead, .stats, .footer__inner > *";

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
    return () => io.disconnect();
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
