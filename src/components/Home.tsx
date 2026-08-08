import Hero from "./Hero";
import SelectedWork from "./SelectedWork";
import Capacity from "./Capacity";
import Experience from "./Experience";
import Skills from "./Skills";
import PersonalProjects from "./PersonalProjects";
import BlogSection from "./BlogSection";

/** The landing page. Rails, Footer and ScrollTop are shared across routes and
 *  live in App; everything here is homepage-only. Section numbers run 01–08,
 *  with the footer carrying 08. */
function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Capacity />
      <Experience />
      <Skills />
      <PersonalProjects />
      <BlogSection />
    </>
  );
}

export default Home;
