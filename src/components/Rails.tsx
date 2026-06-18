import { useEffect, useState } from "react";
import "./Rails.css";

const SOCIALS: {
  label: string;
  href: string;
  path: string;
  download?: boolean;
}[] = [
  {
    label: "GitHub",
    href: "https://github.com/abracadaniel92",
    path: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4 M9 18c-4.51 2-5-2-7-2",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/gmojsoski",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/4366567077094",
    path: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  },
  {
    label: "Book a call",
    href: "https://koalendar.com/e/meet-with-goce",
    path: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  },
  {
    label: "Download resume",
    href: "/files/GoceMojsoskiCV.pdf",
    download: true,
    path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 11v6 M9 14l3 3 3-3",
  },
];

function Rails() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cls = (side: string) =>
    `rail rail--${side}${shown ? " rail--shown" : ""}`;

  return (
    <>
      <aside className={cls("left")} aria-label="Social links">
        <ul>
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                {...(s.download
                  ? { download: true }
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <aside className={cls("right")} aria-label="Email">
        <a href="mailto:contact@gmojsoski.com" className="rail__email">
          contact@gmojsoski.com
        </a>
      </aside>
    </>
  );
}

export default Rails;
