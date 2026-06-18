import { useState } from "react";
import "./PersonalProjects.css";

type Lab = {
  name: string;
  desc: string;
  tags: string[];
  live?: string;
  repo?: string;
};

const REPO = "https://github.com/abracadaniel92/lenovo-homelab";

const HOMELAB: Lab[] = [
  {
    name: "Self-hosted cloud platform",
    desc: "A private cloud on Lenovo ThinkCentre hardware with no SaaS lock-in: file sync, docs, and the core services I use daily.",
    tags: ["Nextcloud", "Docker", "Linux", "Caddy"],
    live: "https://cloud.gmojsoski.com",
  },
  {
    name: "Zero-trust secure access",
    desc: "No open ports: identity-based access to every internal service via Cloudflare Tunnel with MFA and dual tunnel replicas.",
    tags: ["Zero Trust", "Cloudflare", "Identity", "Security"],
  },
  {
    name: "Self-healing monitoring & recovery",
    desc: "Layered health checks with systemd timers and restart policies that detect failures early and restore services on their own.",
    tags: ["systemd", "Bash", "Docker", "HA"],
    repo: REPO,
  },
  {
    name: "DevOps automation command layer",
    desc: "One Makefile interface for ops, monitoring, backups, logs and deploys, so recovery is a single command instead of a runbook.",
    tags: ["Makefile", "Bash", "DevOps", "Automation"],
    repo: REPO,
  },
  {
    name: "Off-site backup & retention engine",
    desc: "Daily backups to Backblaze B2 via Rclone with multi-tier retention (hourly to yearly) and integrity checks.",
    tags: ["Backblaze B2", "Rclone", "Disaster recovery"],
    repo: REPO,
  },
  {
    name: "System health alerting",
    desc: "Real-time health reports and incident alerts pushed to Mattermost by custom Bash agents watching containers and backups.",
    tags: ["Mattermost API", "Monitoring", "Bash", "SRE"],
    repo: REPO,
  },
  {
    name: "Reverse-proxy & routing layer",
    desc: "A hardened Caddy proxy: automatic HTTPS, multi-subdomain routing and Cloudflare rules behind a single entry point.",
    tags: ["Caddy", "TLS", "DNS", "Networking"],
  },
  {
    name: "Python data migration tool",
    desc: "Parsed, transformed and imported 290+ structured records into a self-hosted instance via REST APIs and JSON mapping.",
    tags: ["Python", "REST API", "JSON", "Data"],
    repo: REPO,
  },
  {
    name: "Private file-sharing service",
    desc: "Self-hosted sharing through Caddy + Cloudflare Tunnel, with temporary links, access rules and automatic cleanup.",
    tags: ["Docker", "Caddy", "Cloudflare"],
    live: "https://files.gmojsoski.com",
  },
  {
    name: "DNS privacy & network control",
    desc: "Pi-hole + Unbound on a Raspberry Pi for network-wide ad-blocking and recursive DNS resolution.",
    tags: ["Pi-hole", "Unbound", "Raspberry Pi", "Privacy"],
  },
  {
    name: "Network device intelligence",
    desc: "Pi Alert for device discovery and change detection, with Mattermost webhooks for new devices, disconnects and IP changes.",
    tags: ["Pi Alert", "Mattermost", "Webhooks"],
  },
  {
    name: "Self-hosted collaboration",
    desc: "Mattermost with persistent storage and runbooks, used as the ops and alerting hub for the whole stack.",
    tags: ["Mattermost", "Docker", "PostgreSQL"],
  },
  {
    name: "Internal app hosting",
    desc: "A shared hosting layer to deploy, test and iterate personal apps and static sites without third-party costs.",
    tags: ["Caddy", "Deployment", "ThinkCentre"],
  },
  {
    name: "Mobile bookmark → Slack",
    desc: "Share any link to a Slack channel with one tap: a mobile shortcut formats the URL and posts it through a webhook.",
    tags: ["iOS Shortcuts", "Webhooks", "Workflow"],
  },
];

function PersonalProjects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? HOMELAB : HOMELAB.slice(0, 6);

  return (
    <section className="section" id="lab">
      <div className="section__head">
        <span className="section__lead">
          <span className="section__no">06</span>
          <span className="section__name">The lab</span>
        </span>
        <span className="section__meta">Self-hosted on a ThinkCentre</span>
      </div>

      <div className="lab__grid">
        {visible.map((p) => (
          <article className="lab-card" key={p.name}>
            <div className="lab-card__top">
              <span className="lab-card__dir" aria-hidden="true">
                ▢
              </span>
              <div className="lab-card__links">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer">
                    WWW↗
                  </a>
                )}
              </div>
            </div>
            <h3 className="lab-card__name">{p.name}</h3>
            <p className="lab-card__blurb">{p.desc}</p>
            <div className="lab-card__tags">
              {p.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {!showAll && (
        <button className="lab__more" onClick={() => setShowAll(true)}>
          Show more
          <span className="lab__more-count">[+{HOMELAB.length - 6}]</span>
        </button>
      )}

      <div className="homelab">
        <div className="homelab__head">
          <h3 className="homelab__title">ThinkCentre home lab</h3>
          <a
            className="homelab__gh"
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
        <p className="homelab__copy">
          A private cloud I run on Lenovo ThinkCentre hardware, with no SaaS
          lock-in. If it can be automated, integrated, dockerized or hacked
          together for free, that's pretty much my love language. It hosts this
          site, file sync, docs, and a stack of self-hosted services with secure
          remote access and monitoring.
        </p>
        <div className="homelab__tags">
          {[
            "Docker",
            "Linux",
            "Caddy",
            "Cloudflare",
            "Nextcloud",
            "Makefile automation",
            "Monitoring",
            "Self-hosted",
          ].map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PersonalProjects;
