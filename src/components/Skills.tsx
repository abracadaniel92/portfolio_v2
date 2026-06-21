import "./Skills.css";

const PILLARS = [
  {
    no: "A",
    title: "How I lead",
    tag: "Product · Delivery · Stakeholders",
    line: "Roadmaps, backlogs, and stakeholder alignment across multi-team programs. Currently leading two .NET teams for a Fortune 500 client.",
    groups: [
      {
        label: "Methods",
        items: [
          "Product roadmapping",
          "Backlog grooming",
          "Sprint planning",
          "Prioritization (RICE / MoSCoW)",
          "OKRs",
          "Product discovery",
          "Release management",
          "A/B testing",
          "KPI tracking",
          "Stakeholder management",
          "Program management",
        ],
      },
      {
        label: "Tools",
        items: ["Jira", "Confluence", "Notion", "Miro", "Lucidchart", "Slack", "Mattermost", "Linear", "Loom", "GitHub Projects"],
      },
      {
        label: "Design",
        items: ["Figma", "Adobe Suite", "Canva"],
      },
    ],
  },
  {
    no: "B",
    title: "How I build",
    tag: "Engineering · Data · Platforms",
    line: "Hands-on with Python, SQL, and integrations across the CMS, e-commerce, and ERP stacks I ship on, increasingly with AI in the loop.",
    groups: [
      {
        label: "Engineering",
        items: ["Python", "SQL", "C#", "Bash", "PowerShell", "JavaScript", "TypeScript", "React", "HTML/CSS", "Git"],
      },
      {
        label: "Data & APIs",
        items: ["Snowflake", "ETL pipelines", "Excel / Sheets / AppScript", "REST", "GraphQL", "SOAP", "Webhooks", "Stripe", "PayPal"],
      },
      {
        label: "Platforms",
        items: ["WordPress", "Magento", "Pimcore", "Umbraco", "Shopify", "SAP", "Dynamics 365", "Odoo", "HubSpot"],
      },
      {
        label: "Automation",
        items: ["Make", "Zapier", "n8n", "airSlate"],
      },
      {
        label: "AI",
        items: ["Claude", "ChatGPT", "Gemini", "NotebookLM", "Cursor", "Copilot"],
      },
    ],
  },
  {
    no: "C",
    title: "How I run",
    tag: "Cloud · DevOps · Observability",
    line: "Built and ran cloud infrastructure end-to-end. Cost-managed a $3M AWS budget at Arcadia.",
    groups: [
      { label: "Cloud", items: ["AWS", "Azure", "GCP"] },
      {
        label: "Infrastructure",
        items: ["Docker", "Linux", "GitHub Actions", "IaC", "Caddy", "Nginx", "Traefik", "Coolify", "Proxmox", "Portainer", "Tailscale", "Cloudflare"],
      },
      {
        label: "Observability",
        items: ["Datadog", "Grafana", "Prometheus", "PagerDuty", "Uptime Kuma", "Beszel", "Glance", "systemd timers"],
      },
    ],
  },
  {
    no: "D",
    title: "How I secure & comply",
    tag: "Security · Compliance · Identity",
    line: "Owned the SOC 2 program at Arcadia. Day-to-day across identity, zero-trust networking, and audit tooling.",
    groups: [
      { label: "Compliance", items: ["SOC 2", "Vanta", "AuditBoard"] },
      { label: "Security", items: ["CrowdStrike", "Proofpoint", "Fail2ban"] },
      {
        label: "Identity & access",
        items: ["Cloudflare Zero Trust", "SSO / SAML", "IAM", "OAuth 2.0", "WireGuard", "SOPS", "Vaultwarden"],
      },
    ],
  },
];

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">05</span>
          <span className="section__name">How I work</span>
        </span>
        <span className="section__meta">Lead · Build · Run · Secure</span>
      </div>

      <div className="pillars">
        {PILLARS.map((p) => (
          <article className="pillar" key={p.no}>
            <div className="pillar__head">
              <span className="pillar__no">{p.no}</span>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__tag">{p.tag}</p>
            </div>
            <div className="pillar__body">
              <p className="pillar__line">{p.line}</p>
              {p.groups.map((g, i) => (
                <div className="pillar__group" key={g.label}>
                  <p
                    className={`pillar__group-label pillar__group-label--${
                      i % 2 === 0 ? "signal" : "ink"
                    }`}
                  >
                    {g.label}
                  </p>
                  <div className="pillar__chips">
                    {g.items.map((i) => (
                      <span className="tag" key={i}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
