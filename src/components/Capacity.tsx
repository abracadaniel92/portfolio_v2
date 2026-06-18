import { useEffect, useRef, useState } from "react";
import "./Capacity.css";

const STATS = [
  { value: 10, prefix: "", suffix: "+", label: "Years", note: "Cloud, engineering & delivery" },
  { value: 35, prefix: "", suffix: "+", label: "Projects", note: "Digital, SaaS & platform" },
  { value: 3, prefix: "€", suffix: "M+", label: "Budgets", note: "Cloud, vendors & programmes" },
  { value: 150, prefix: "", suffix: "+", label: "Engineers", note: "Largest org coordinated" },
];

function Capacity() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<number[]>(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? STATS.map((s) => s.value)
      : STATS.map(() => 0)
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = statsRef.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 2100;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          // easeInOutCubic — gentle ramp so it reads as counting, not a jump
          const eased =
            p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          setVals(STATS.map((s) => Math.round(s.value * eased)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section" id="capacity">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">03</span>
          <span className="section__name">Capacity</span>
        </span>
        <span className="section__meta">Leadership / scope</span>
      </div>

      <div className="capacity">
        <div className="capacity__lead">
          <p className="capacity__statement">
            I figure out what to build, get the right people aligned, and make
            sure it ships. <em>On time</em>.
          </p>
          <div className="capacity__body">
            <p>
              Over ten years I've taken products from discovery to launch:
              platform consolidations, post-acquisition integrations, and
              company-wide roadmaps. I've worked with organisations of 150+
              engineers and coordinated teams across the US and Europe.
            </p>
            <p>
              Technical enough to hold real conversations with engineering,
              DevOps, SRE and security about what's happening under the hood.
              I've led compliance programmes (SOC 2, audit readiness) and built
              reporting leadership could actually use.
            </p>
          </div>
        </div>

        <div className="stats" ref={statsRef}>
          {STATS.map((s, i) => (
            <div className="stat" key={s.label}>
              <span className="stat__num">
                {s.prefix}
                {vals[i]}
                {s.suffix}
              </span>
              <span className="stat__label">{s.label}</span>
              <span className="stat__note">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capacity;
