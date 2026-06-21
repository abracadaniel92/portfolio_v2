import { useState } from "react";
import postOffice from "../assets/skopje-post-office.jpg";
import Scramble from "./Scramble";
import "./Hero.css";

const NAV = [
  { label: "Selected work", href: "#work" },
  { label: "Capacity", href: "#capacity" },
  { label: "Experience", href: "#experience" },
  { label: "How I work", href: "#skills" },
  { label: "The lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
];

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="hero">
      <img
        className="hero__photo"
        src={postOffice}
        alt="The Central Post Office of Skopje, a brutalist concrete landmark by Janko Konstantinov"
      />
      <div className="hero__scrim" aria-hidden="true" />

      <span className="crop crop--tl" aria-hidden="true" />
      <span className="crop crop--tr" aria-hidden="true" />
      <span className="crop crop--bl" aria-hidden="true" />
      <span className="crop crop--br" aria-hidden="true" />

      <header className="topbar">
        <span className="topbar__brand">Goce Mojsoski</span>
        <span className="topbar__meta">Product &amp; delivery</span>
        <span className="topbar__meta">Idx 2015–26</span>
        <a
          className="topbar__resume"
          href="/files/GoceMojsoskiCV.pdf"
          download
        >
          Resume ↓
        </a>
        <button
          type="button"
          className="topbar__menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          [ menu ]
        </button>
      </header>

      <div className="hero__body">
        <span className="spine" aria-hidden="true">
          <span className="spine__no">No. 01</span> / Intro
        </span>

        <div className="hero__content">
          <p className="eyebrow">
            <span className="eyebrow__mark" aria-hidden="true" />
            <Scramble
              text="Product & delivery leader · cloud, SaaS, commerce"
              delay={520}
            />
          </p>

          <h1 className="monument">
            <span className="monument__mask">
              <span className="monument__line">Goce</span>
            </span>
            <span className="monument__mask">
              <span className="monument__line">Mojsoski</span>
            </span>
          </h1>

          <p className="statement">
            <span className="statement__line">
              A decade shipping products, teams &amp; <em>outcomes</em>. ERP
              rollouts, cloud migrations
            </span>
            <span className="statement__line">
              and post-acquisition integrations across the US &amp; Europe.
            </span>
          </p>

          <div className="hero__actions">
            <a className="hero__btn hero__btn--primary" href="#contact">
              Contact
            </a>
            <a
              className="hero__btn hero__btn--secondary"
              href="https://koalendar.com/e/meet-with-goce"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call ↗
            </a>
          </div>
        </div>
      </div>

      <footer className="baserail">
        <span>Skopje 41.9981°N 21.4254°E</span>
        <span className="baserail__cue">↓ built on concrete</span>
      </footer>

      {menuOpen && (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__bar">
            <span className="menu__label">Index</span>
            <button
              type="button"
              className="menu__close"
              onClick={() => setMenuOpen(false)}
            >
              [ close ]
            </button>
          </div>
          <nav className="menu__nav">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                className="menu__link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="menu__no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.label}
              </a>
            ))}
            <a
              className="menu__link menu__link--resume"
              href="/files/GoceMojsoskiCV.pdf"
              download
              onClick={() => setMenuOpen(false)}
            >
              <span className="menu__no" aria-hidden="true" />
              Resume ↓
            </a>
          </nav>
        </div>
      )}
    </section>
  );
}

export default Hero;
