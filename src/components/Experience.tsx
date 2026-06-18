import { useState } from "react";
import "./Experience.css";

type Role = {
  no: string;
  role: string;
  company: string;
  place: string;
  dates: string;
  note: string;
  bullets: string[];
};

const SITES: Record<string, string> = {
  Intertec: "https://intertec.io",
  Arcadia: "https://arcadia.com",
  "TSD Digital": "https://tsd.digital",
  "Vox Teneo": "https://voxteneo.com",
  "Ananas.mk": "https://ananas.mk",
  Lidl: "https://lidl.com",
  Nike: "https://nike.com",
};

const ROLES: Role[] = [
  {
    no: "01",
    role: "Senior Technical Product Manager",
    company: "Intertec",
    place: "Munich, DE",
    dates: "Nov 2025 – Present",
    note: "Munich software company (est. 2015), 150+ people; custom builds and team extension across Europe.",
    bullets: [
      "Central PM across two .NET teams (11 engineers) for SimonsVoss (Allegion, Fortune 500), owning the API and multi-tenancy model.",
      "Shipped 5 features with 10 more in the pipeline; partner on pre-sales and discovery with Intertec's CTO and CEO.",
      "Primary product and technical liaison to the client, reporting to their Head of Software Engineering; own backlog refinement across multiple product streams.",
    ],
  },
  {
    no: "02",
    role: "Senior R&D Program Manager",
    company: "Arcadia",
    place: "Washington DC, US · Remote",
    dates: "Mar 2023 – Nov 2025",
    note: "US clean-energy tech building data and billing infrastructure for renewable energy.",
    bullets: [
      "Drove modernization across 150+ engineers; owned the SOC 2 program, a $3M AWS budget, and platform reliability.",
      "Led a 10-engineer DevOps team and built the multi-year tech roadmap with engineering and product leadership.",
      "Cut AWS spend with workload-level cost measures and no performance hit; led application rationalization and vendor consolidation.",
    ],
  },
  {
    no: "03",
    role: "Product Program Management Consultant",
    company: "TSD Digital",
    place: "Herefordshire, UK",
    dates: "Jul 2024 – Sep 2025",
    note: "UK agency specialising in Umbraco and Sitefinity, enterprise integrations and e-commerce.",
    bullets: [
      "Oversaw 20 concurrent client products across commerce and CMS; delivered 10% cost savings.",
      "Led delivery for Bond Jewellery, winner of the MVP Award at Umbraco Conference 2025.",
      "Senior product lead and primary decision-maker between business and engineering for Brightwells, Bond Jewellery and Joe Davies.",
    ],
  },
  {
    no: "04",
    role: "Managing Director / Technical PM",
    company: "Vox Teneo",
    place: "Brussels, BE",
    dates: "Sep 2021 – Feb 2023",
    note: "Brussels digital agency building software for EU institutions, NGOs and global brands.",
    bullets: [
      "Scaled a 35-person delivery org across 6 teams; €2M+ revenue from clients like Erasmus+, PEGI and D'Ieteren.",
      "Grew the development org 40% and ran 17 concurrent projects through platform consolidation and M&A integrations.",
      "Promoted from Technical PM after lifting delivery predictability ~20%, shipping e-commerce and ad-tech platforms.",
    ],
  },
  {
    no: "05",
    role: "Technical Integration Consultant",
    company: "Ananas.mk",
    place: "Skopje, MK",
    dates: "Jan 2023 – May 2023",
    note: "North Macedonia's biggest online marketplace.",
    bullets: [
      "Led a team of 5 building integration tooling; migrated ~100 merchants and lifted sales ~15%.",
      "Standardised API onboarding with reusable pipelines and docs, raising integration efficiency ~20% and delivery quality ~25%.",
    ],
  },
  {
    no: "06",
    role: "Project Manager",
    company: "Lidl",
    place: "Sofia, BG",
    dates: "Aug 2020 – Aug 2021",
    note: "One of Europe's largest discount retailers, 12,000+ stores across 30+ countries.",
    bullets: [
      "Owned budgets, vendor contracts and rollout logistics; cut store-expansion rollout time ~15%.",
      "Brought digital tooling into logistics and supply chain; coordinated IT, logistics and procurement at ~90% stakeholder satisfaction.",
    ],
  },
  {
    no: "07",
    role: "Regional / Brand Manager",
    company: "Nike",
    place: "Skopje, MK",
    dates: "Aug 2015 – Jul 2020",
    note: "Global leader in athletic footwear, apparel and equipment.",
    bullets: [
      "Opened 5 stores doing ~$2M annual revenue, managing 100 people across 7 cities; lifted store efficiency ~15%.",
      "Ran retail operations, budgets and merchandising for the market, with local partnerships and campaigns aligned to Nike Europe.",
    ],
  },
];

function Experience() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ROLES : ROLES.slice(0, 4);

  return (
    <section className="section" id="experience">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">04</span>
          <span className="section__name">Experience</span>
        </span>
        <span className="section__meta">Ledger / 2015–present</span>
      </div>

      <div className="ledger">
        {visible.map((r) => (
          <article className="exp" key={r.no}>
            <div className="exp__meta">
              <span className="exp__no">{r.no}</span>
              <span className="exp__dates">{r.dates}</span>
              <span className="exp__place">{r.place}</span>
            </div>
            <div className="exp__main">
              <h3 className="exp__role">
                {r.role} <span className="exp__at">@</span>{" "}
                <a
                  className="exp__company"
                  href={SITES[r.company]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.company}
                </a>
              </h3>
              <p className="exp__note">{r.note}</p>
              <ul className="exp__bullets">
                {r.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {!showAll && (
        <button className="ledger__more" onClick={() => setShowAll(true)}>
          Show earlier roles
          <span className="ledger__more-count">[+{ROLES.length - 4}]</span>
        </button>
      )}
    </section>
  );
}

export default Experience;
