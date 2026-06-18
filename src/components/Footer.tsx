import { useEffect, useState } from "react";
import "./Footer.css";

const SOCIALS: { label: string; href: string; download?: boolean }[] = [
  { label: "Resume ↓", href: "/files/GoceMojsoskiCV.pdf", download: true },
  { label: "Email", href: "mailto:contact@gmojsoski.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/gmojsoski" },
  { label: "GitHub", href: "https://github.com/abracadaniel92" },
];

function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Skopje",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <p className="footer__eyebrow">
          <span className="footer__mark" aria-hidden="true" />
          <span>
            <span className="footer__no">07</span> /{" "}
            <span className="footer__name">Contact</span>
          </span>
        </p>

        <h2 className="footer__cta">
          Let's build <em>something</em>.
        </h2>

        <div className="footer__actions">
          <a className="footer__email" href="mailto:contact@gmojsoski.com">
            contact@gmojsoski.com
          </a>
          <a
            className="footer__call"
            href="https://koalendar.com/e/meet-with-goce"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call ↗
          </a>
        </div>

        <ul className="footer__links">
          {SOCIALS.map((s) =>
            s.download ? (
              <li key={s.label}>
                <a href={s.href} download>
                  {s.label}
                </a>
              </li>
            ) : (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              </li>
            )
          )}
        </ul>
      </div>

      <div className="footer__colophon">
        <span className="footer__status">
          <span className="footer__dot" aria-hidden="true" />
          Open to select work
        </span>
        <span>
          Skopje {time || "—"} → wherever the work is
        </span>
        <span>Set in Archivo &amp; IBM Plex Mono</span>
        <span>© 2026 · built on concrete</span>
      </div>
    </footer>
  );
}

export default Footer;
