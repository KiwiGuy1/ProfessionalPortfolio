"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Inter } from "next/font/google";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const COLORS = {
  background: "#020202",
  primary: "#f5f5f5",
  secondary: "#b9b9b9",
  accent: "#f0f0f0",
  accentAlt: "#8f8f8f",
  border: "rgba(255, 255, 255, 0.14)",
  card: "rgba(255, 255, 255, 0.05)",
  surface: "rgba(255, 255, 255, 0.06)",
  gradient: "linear-gradient(135deg, #ffffff 0%, #d7d7d7 55%, #8d8d8d 100%)",
};

const projects = [
  {
    id: 1,
    title: "ShopSight",
    subtitle: "E-Commerce Analytics Dashboard",
    description:
      "A full-stack analytics platform with realtime charts, product insights, and behavior tracking for online stores.",
    tech: ["React", "Node.js", "MongoDB", "Chart.js", "Express", "CSS3"],
    role: "Full-Stack Developer",
    duration: "3 months",
    image: "/img/ecom.png",
    githubUrl: "https://github.com/KiwiGuy1",
    demoUrl: "#",
  },
];

const upcomingProjects = [
  {
    title: "TaskFlow Pro",
    description:
      "Team collaboration platform with realtime updates and project tracking.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "In Development",
  },
  {
    title: "FinanceTracker",
    description: "Budgeting and personal finance insights app with progress goals.",
    tech: ["React Native", "Firebase", "Redux"],
    status: "Planning",
  },
  {
    title: "AI Weather Assistant",
    description:
      "Weather experience with ML-driven recommendations and custom alerts.",
    tech: ["Vue", "Python", "TensorFlow"],
    status: "Research",
  },
];

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredProjectRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const featuredProject = projects[0];

  useGSAP(
    () => {
      gsap.from(".projects-hero", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".stats-item", {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 86%",
        },
      });

      gsap.from(".featured-card", {
        y: 52,
        opacity: 0,
        duration: 0.95,
        scrollTrigger: {
          trigger: ".featured-wrap",
          start: "top 82%",
        },
      });

      gsap.from(".upcoming-card", {
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".upcoming-grid",
          start: "top 84%",
        },
      });
    },
    { scope: containerRef }
  );

  const handleFeaturedMouseEnter = useCallback(() => {
    if (!featuredProjectRef.current) return;
    gsap.to(featuredProjectRef.current, {
      y: -4,
      borderColor: "rgba(255, 255, 255, 0.28)",
      boxShadow: "0 18px 34px rgba(255, 255, 255, 0.08)",
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  const handleFeaturedMouseLeave = useCallback(() => {
    if (!featuredProjectRef.current) return;
    gsap.to(featuredProjectRef.current, {
      y: 0,
      borderColor: COLORS.border,
      boxShadow: "none",
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  const handleCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -3,
      borderColor: "rgba(255, 255, 255, 0.24)",
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: COLORS.border,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleCtaEnter = useCallback(() => {
    if (!ctaButtonRef.current) return;
    gsap.to(ctaButtonRef.current, {
      scale: 1.03,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleCtaLeave = useCallback(() => {
    if (!ctaButtonRef.current) return;
    gsap.to(ctaButtonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div ref={containerRef} className={inter.className}>
      <main className="projects-root">
        <section className="projects-hero shell">
          <p className="eyebrow">Projects</p>
          <h1>Selected Work</h1>
          <p>
            A look at products I&apos;ve designed and developed, with a focus on
            practical interfaces, clean architecture, and measurable outcomes.
          </p>
        </section>

        <section className="shell stats-grid">
          {[
            ["1", "Featured Project"],
            ["6+", "Tech Stack Tools"],
            ["3", "Upcoming Builds"],
            ["100%", "Execution Focus"],
          ].map(([value, label]) => (
            <article key={label} className="stats-item card">
              <p className="value">{value}</p>
              <p className="label">{label}</p>
            </article>
          ))}
        </section>

        <section className="shell featured-wrap">
          <h2>Featured Project</h2>

          {featuredProject && (
            <article
              ref={featuredProjectRef}
              className="featured-card card"
              onMouseEnter={handleFeaturedMouseEnter}
              onMouseLeave={handleFeaturedMouseLeave}
            >
              <div className="project-media">
                {featuredProject.image ? (
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    fill
                    priority
                    sizes="(max-width: 920px) 100vw, 48vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="fallback">{featuredProject.title}</div>
                )}
              </div>

              <div className="project-copy">
                <div className="meta-row">
                  <span className="badge badge-accent">{featuredProject.role}</span>
                  <span className="badge">{featuredProject.duration}</span>
                </div>

                <h3>{featuredProject.title}</h3>
                <p className="subtitle">{featuredProject.subtitle}</p>
                <p className="description">{featuredProject.description}</p>

                <div className="tech-row">
                  {featuredProject.tech.map((tech) => (
                    <span key={tech} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="link-row">
                  <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer">
                    View Code
                  </a>
                  <a href={featuredProject.demoUrl} className="primary-link">
                    Live Demo
                  </a>
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="shell upcoming-wrap">
          <h2>What&apos;s Next</h2>

          <div className="upcoming-grid">
            {upcomingProjects.map((project) => (
              <article
                key={project.title}
                className="upcoming-card card"
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
              >
                <div className="status-row">
                  <h3>{project.title}</h3>
                  <span className="status">{project.status}</span>
                </div>
                <p>{project.description}</p>
                <div className="tech-row">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shell cta-wrap">
          <div className="cta-card">
            <h2>Need a Product Partner?</h2>
            <p>
              I&apos;m available for selective freelance projects and collaborative
              product work.
            </p>
            <button ref={ctaButtonRef} onMouseEnter={handleCtaEnter} onMouseLeave={handleCtaLeave}>
              Get In Touch
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .projects-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 16%, rgba(255, 255, 255, 0.08) 0%, transparent 39%),
            radial-gradient(circle at 88% 11%, rgba(255, 255, 255, 0.05) 0%, transparent 41%),
            ${COLORS.background};
          color: ${COLORS.primary};
          padding: 96px 1rem 4.5rem;
        }

        .shell {
          width: min(1160px, 100%);
          margin: 0 auto;
        }

        .projects-hero {
          text-align: center;
          margin-bottom: 1.8rem;
        }

        .eyebrow {
          margin: 0 0 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: ${COLORS.accent};
          font-weight: 600;
        }

        h1 {
          margin: 0;
          font-size: clamp(2rem, 6.2vw, 4.8rem);
          line-height: 1.03;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .projects-hero > p {
          margin: 1rem auto 0;
          max-width: 770px;
          color: ${COLORS.secondary};
          line-height: 1.74;
          font-size: clamp(0.98rem, 2.5vw, 1.18rem);
        }

        .card {
          border: 1px solid ${COLORS.border};
          border-radius: 1.2rem;
          background: ${COLORS.card};
          backdrop-filter: blur(14px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.8rem;
        }

        .stats-item {
          padding: 0.95rem;
          text-align: center;
        }

        .value {
          margin: 0;
          color: ${COLORS.accent};
          font-size: 1.45rem;
          font-weight: 700;
        }

        .label {
          margin: 0.25rem 0 0;
          color: ${COLORS.secondary};
          font-size: 0.8rem;
          letter-spacing: 0.02em;
        }

        h2 {
          margin: 0 0 0.9rem;
          font-size: clamp(1.4rem, 4vw, 2rem);
        }

        .featured-wrap {
          margin-bottom: 1.8rem;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.15rem;
          padding: 1rem;
          transition: border-color 0.2s ease;
        }

        .project-media {
          position: relative;
          min-height: 270px;
          border-radius: 1rem;
          overflow: hidden;
          background: ${COLORS.gradient};
        }

        .fallback {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          font-weight: 700;
        }

        .project-copy {
          display: grid;
          align-content: start;
          gap: 0.7rem;
          padding: 0.2rem 0.25rem 0.1rem;
        }

        .meta-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          border: 1px solid ${COLORS.border};
          border-radius: 999px;
          background: ${COLORS.surface};
          color: ${COLORS.secondary};
          padding: 0.26rem 0.65rem;
          font-size: 0.74rem;
          font-weight: 500;
        }

        .badge-accent {
          color: ${COLORS.accent};
          background: rgba(255, 255, 255, 0.08);
        }

        h3 {
          margin: 0;
          font-size: clamp(1.22rem, 3vw, 1.85rem);
          line-height: 1.25;
        }

        .subtitle {
          margin: 0;
          color: #e1e1e1;
          font-size: 1rem;
        }

        .description {
          margin: 0;
          color: ${COLORS.secondary};
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .tech-pill {
          border-radius: 999px;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.surface};
          padding: 0.3rem 0.68rem;
          font-size: 0.75rem;
          color: #e8e8e8;
        }

        .link-row {
          display: flex;
          gap: 0.55rem;
          flex-wrap: wrap;
          margin-top: 0.2rem;
        }

        .link-row a {
          border-radius: 0.78rem;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.surface};
          color: ${COLORS.primary};
          text-decoration: none;
          padding: 0.6rem 1rem;
          font-size: 0.86rem;
          font-weight: 600;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        .link-row a:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }

        .primary-link {
          border: none !important;
          background: ${COLORS.gradient} !important;
          color: #050505 !important;
        }

        .upcoming-wrap {
          margin-bottom: 1.8rem;
        }

        .upcoming-grid {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .upcoming-card {
          padding: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          align-items: flex-start;
          margin-bottom: 0.65rem;
        }

        .status {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: ${COLORS.primary};
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.28rem 0.58rem;
          white-space: nowrap;
        }

        .upcoming-card p {
          margin: 0 0 0.75rem;
          color: ${COLORS.secondary};
          font-size: 0.93rem;
          line-height: 1.62;
        }

        .cta-wrap {
          text-align: center;
        }

        .cta-card {
          border-radius: 1.25rem;
          background: ${COLORS.gradient};
          padding: clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 1.8rem);
          color: #050505;
        }

        .cta-card h2 {
          margin: 0 0 0.55rem;
        }

        .cta-card p {
          margin: 0 auto 0.95rem;
          max-width: 680px;
          font-size: 0.98rem;
          line-height: 1.65;
          opacity: 0.92;
        }

        .cta-card button {
          border: none;
          border-radius: 999px;
          background: #111111;
          color: ${COLORS.primary};
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.68rem 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 1040px) {
          .upcoming-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 920px) {
          .featured-card {
            grid-template-columns: 1fr;
          }

          .project-media {
            min-height: 230px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .projects-root {
            padding-top: 88px;
          }

          .upcoming-grid {
            grid-template-columns: 1fr;
          }

          .status-row {
            flex-direction: column;
          }

          .status {
            width: fit-content;
          }

          .link-row a {
            flex: 1 1 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
