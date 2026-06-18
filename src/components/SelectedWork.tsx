import { useState } from "react";
import "./SelectedWork.css";

type Project = { name: string; desc: string; tags: string[]; href?: string };

type Work = {
  no: string;
  company: string;
  scope: string;
  tags: string[];
  year: string;
  projects: Project[];
};

const WORK: Work[] = [
  {
    no: "01",
    company: "SimonsVoss · Allegion",
    scope:
      "Central PM across two .NET teams (11 engineers) on an enterprise access-control platform, owning the API and multi-tenancy model.",
    tags: [".NET", "SQL", "Angular", "Security", "Multi-tenancy"],
    year: "2025",
    projects: [
      {
        name: "Super Admin Panel",
        desc: "Cross-tenant admin console, shipped across both teams.",
        tags: [".NET", "Angular", "SQL", "Security"],
      },
      {
        name: "Client service desk",
        desc: "Feedback intake and triage workflow for the client.",
        tags: ["Triage", "Feedback intake"],
      },
    ],
  },
  {
    no: "02",
    company: "Arcadia",
    scope:
      "Ran R&D modernization across 150+ engineers: cloud and platform consolidation, the SOC 2 program, and a $3M AWS budget.",
    tags: ["AWS", "DevOps", "SOC 2", "Roadmap", "Cost"],
    year: "2023–25",
    projects: [
      {
        name: "MySQL 5.7 → 8.0 upgrades",
        desc: "Upgraded 50 backend services with zero downtime and full data integrity.",
        tags: ["SQL", "Zero-downtime"],
      },
      {
        name: "AWS SDK v1 → v2 migration",
        desc: "Migrated the Java SDK ahead of AWS end-of-support timelines.",
        tags: ["AWS", "Java", "DevOps"],
      },
      {
        name: "Java 8 → 21 + Spring Boot 3",
        desc: "Moved 100+ microservices to Spring Boot 3 and modernised pipelines.",
        tags: ["Java", "100+ services"],
      },
    ],
  },
  {
    no: "03",
    company: "TSD Digital",
    scope:
      "Led delivery on 20 concurrent client products across commerce and Umbraco builds. Bond Jewellery won the MVP Award at Umbraco Conf 2025.",
    tags: ["Commerce", "Umbraco", "CMS", "Delivery"],
    year: "2024–25",
    projects: [
      {
        name: "Bond Jewellery",
        desc: "Award-winning Umbraco e-commerce with optimised product search.",
        tags: ["Umbraco", "E-commerce", "MVP Award"],
        href: "https://bondjewellery.co.uk/",
      },
      {
        name: "Joe Davies",
        desc: "Trade-only store, 10,000+ SKUs, tiered pricing and ERP sync.",
        tags: ["Umbraco", "Trade e-commerce"],
        href: "https://joedavies.co.uk/",
      },
      {
        name: "Ameriband",
        desc: "Enterprise Wi-DAS platform for a US telecom, with partner integrations.",
        tags: [".NET", "Telecom"],
        href: "https://ameriband.com/",
      },
      {
        name: "ETAP Lighting",
        desc: "Multilingual product catalogue and ERP integration for a lighting maker.",
        tags: [".NET", "ERP", "Multilingual"],
        href: "https://etap.com/",
      },
      {
        name: "Delineate.ai",
        desc: "Market-research analytics with real-time audience and brand insights.",
        tags: [".NET", "AI", "Analytics"],
      },
      {
        name: "QuoteHub AI",
        desc: "AI-assisted quoting: pricing, templates and proposal tracking.",
        tags: ["Blazor", "AI", "SQL"],
        href: "https://quotehub.ai/",
      },
      {
        name: "PersonaFin.ai",
        desc: "Personal-finance SaaS with budgeting and AI-driven forecasting.",
        tags: [".NET", "AI", "SaaS"],
        href: "https://www.personafin.ai/",
      },
      {
        name: "Brightwells",
        desc: "Live auction platform for vehicles, machinery and wine.",
        tags: [".NET", "Auctions", "Payments"],
        href: "https://www.brightwells.com/",
      },
      {
        name: "Westons Cider",
        desc: "Corporate site and online shop on a scalable Umbraco CMS.",
        tags: ["Umbraco", "Shop"],
        href: "https://www.westons-cider.co.uk/",
      },
      {
        name: "Wye Valley Brewery",
        desc: "Brand site with storytelling and an interactive find-a-pub map.",
        tags: ["Umbraco", "CMS"],
        href: "https://www.wyevalleybrewery.co.uk/",
      },
      {
        name: "Westgate Labs",
        desc: "Vet diagnostics store with subscriptions and a results portal.",
        tags: ["Umbraco", "Subscriptions"],
        href: "https://www.westgatelabs.co.uk/",
      },
      {
        name: "SafeLives",
        desc: "Accessibility-first charity site with resources and donation flows.",
        tags: [".NET", "Power BI", "Accessibility"],
        href: "https://safelives.org.uk/",
      },
      {
        name: "Advance Joinery",
        desc: "Portfolio-led joinery site with quote forms and CRM.",
        tags: ["Umbraco", "E-commerce"],
        href: "https://advancedjoinery.co.uk/",
      },
      {
        name: "BH Savige",
        desc: "Construction site with galleries, quote forms and CRM integration.",
        tags: [".NET", "Umbraco"],
        href: "https://www.bhsavidge.co.uk/",
      },
      {
        name: "All Nations Centre",
        desc: "Venue platform with event scheduling, bookings and admin tools.",
        tags: [".NET", "Bookings"],
        href: "https://www.allnationscentre.com/",
      },
      {
        name: "Your Epic Home",
        desc: "Home-improvement configurators with lead capture and referrals.",
        tags: [".NET", "Configurators"],
        href: "https://yourepichome.co.uk/",
      },
      {
        name: "Avansere",
        desc: "Innovation-hub site with modular content and marketing automation.",
        tags: ["Angular", "Marketing"],
        href: "https://avansere.no/",
      },
      {
        name: "InfoBrokers",
        desc: "B2B data aggregation with REST APIs and analytics dashboards.",
        tags: [".NET", "REST APIs"],
        href: "https://www.infobrokers.co.uk/",
      },
    ],
  },
  {
    no: "04",
    company: "Vox Teneo",
    scope:
      "Managing Director of a 35-person delivery org running EU institution platforms (Erasmus+, PEGI, D'Ieteren), €2M+ revenue, and M&A integrations.",
    tags: [".NET", "PHP", "EU platforms", "M&A"],
    year: "2021–23",
    projects: [
      {
        name: "Erasmus+",
        desc: "EU-wide platform for education grants and exchange programmes.",
        tags: ["PHP", "Laravel", "EU"],
        href: "https://erasmus-plus.ec.europa.eu/",
      },
      {
        name: "PEGI",
        desc: "Official European game age-rating portal for publishers.",
        tags: ["PHP", "Laravel"],
        href: "https://pegi.info/",
      },
      {
        name: "D'Ieteren Group",
        desc: "Corporate mobility platform for automotive and transport.",
        tags: [".NET", "Mobility"],
        href: "https://www.dieterengroup.com/",
      },
      {
        name: "Thomas & Piron",
        desc: "Multilingual real-estate site with advanced filtering.",
        tags: [".NET", "Real estate"],
        href: "https://www.thomas-piron.lu/",
      },
      {
        name: "IBSA",
        desc: "Urban analytics and neighbourhood-development data platform.",
        tags: [".NET", "Urban data"],
        href: "https://monitoringdesquartiers.brussels/",
      },
      {
        name: "Sport Brussels",
        desc: "Regional portal promoting sport and events across Brussels.",
        tags: [".NET", "Portal"],
        href: "https://sport.brussels/",
      },
      {
        name: "LawBox",
        desc: "LegalTech SaaS for document and contract lifecycle management.",
        tags: [".NET", "LegalTech"],
        href: "https://www.lawbox.com/index.html",
      },
      {
        name: "Genealex",
        desc: "Ancestry research platform with DNA testing and visualisation.",
        tags: [".NET", "MongoDB"],
        href: "https://www.genealex.com/",
      },
      {
        name: "OTRA",
        desc: "NGO platform for youth reintegration through creative projects.",
        tags: [".NET", "NGO"],
        href: "https://www.weareotra.com/",
      },
      {
        name: "Oregon",
        desc: "Multi-channel campaign for the Oregon Speed Cut chainsaw line.",
        tags: [".NET", "Campaign"],
        href: "https://www.oregonproducts.com/en",
      },
      {
        name: "Cremagest",
        desc: "Operations platform for scheduling, billing and reporting.",
        tags: ["PHP", "Laravel"],
        href: "https://www.cremagest.com/",
      },
      {
        name: "WawStreet",
        desc: "Social investment platform connecting traders and analysts.",
        tags: ["PHP", "Fintech"],
        href: "https://wawstreet.com/",
      },
    ],
  },
  {
    no: "05",
    company: "Ananas.mk",
    scope:
      "Led integration tooling for North Macedonia's largest marketplace. Migrated ~100 merchants and lifted sales ~15%.",
    tags: ["Integrations", "APIs", "Marketplace"],
    year: "2023",
    projects: [
      {
        name: "Grouper merchant migration",
        desc: "Migrated 100 merchants with structured cutover plans and validation.",
        tags: ["SQL", "REST API", "100 merchants"],
      },
      {
        name: "Merchant API integration",
        desc: "Onboarded 10 merchants with ongoing implementation support.",
        tags: ["SQL", "REST API", "Onboarding"],
      },
    ],
  },
];

function SelectedWork() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="section" id="work">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">02</span>
          <span className="section__name">Selected work</span>
        </span>
        <span className="section__meta">05 engagements / 2021–26</span>
      </div>

      <ol className="work">
        {WORK.map((w) => {
          const isOpen = open === w.no;
          return (
            <li className="work-row" key={w.no} data-open={isOpen}>
              <div className="work-row__header">
                <span className="work-row__no">{w.no}</span>
                <div className="work-row__main">
                  <h3 className="work-row__company">{w.company}</h3>
                  <p className="work-row__scope">{w.scope}</p>
                  <div className="work-row__tags">
                    {w.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="work-row__toggle work-row__toggle--feature"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : w.no)}
                  >
                    <span className="work-row__toggle-arrow" aria-hidden="true">
                      {isOpen ? "▾" : "▸"}
                    </span>
                    {isOpen ? "Hide" : "View"} delivered work
                    <span className="work-row__count">
                      [{isOpen ? "−" : "+"}
                      {w.projects.length}]
                    </span>
                  </button>
                </div>
                <span className="work-row__year">{w.year}</span>
              </div>

              {isOpen && (
                <div className="work-projects">
                  {w.projects.map((p) => (
                    <div className="wp" key={p.name}>
                      <div className="wp__top">
                        <span className="wp__name">{p.name}</span>
                        {p.href && (
                          <a
                            className="wp__link"
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                      <p className="wp__desc">{p.desc}</p>
                      <div className="wp__tags">
                        {p.tags.map((t) => (
                          <span className="wp__tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default SelectedWork;
