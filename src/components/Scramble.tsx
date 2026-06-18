import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·+=#%";

type Props = { text: string; className?: string; delay?: number };

/** Resolves text left-to-right out of random glyphs — the data-glyph signature. */
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Scramble({ text, className, delay = 0 }: Props) {
  const [out, setOut] = useState(() =>
    prefersReduced() ? text : text.replace(/[^ ]/g, "·")
  );

  useEffect(() => {
    if (prefersReduced()) return;

    let raf = 0;
    let timer = 0;
    let frame = 0;

    const run = () => {
      const revealed = Math.floor(frame / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " " || i < revealed) s += c;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      frame++;
      if (revealed <= text.length) raf = requestAnimationFrame(run);
      else setOut(text);
    };

    timer = window.setTimeout(() => {
      raf = requestAnimationFrame(run);
    }, delay);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, delay]);

  return <span className={className}>{out}</span>;
}

export default Scramble;
