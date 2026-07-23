"use client";

import { useCallback, useRef } from "react";
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
  secondary: "rgba(255, 255, 255, 0.66)",
  accent: "#ff7a18",
  border: "rgba(255, 122, 24, 0.16)",
  card: "rgba(6, 6, 6, 0.78)",
  surface: "rgba(255, 122, 24, 0.045)",
  gradient: "linear-gradient(135deg, #ffffff 0%, #ff9a2f 48%, #ff7a18 100%)",
};

const projects = [
  {
    title: "ShopSight",
    subtitle: "E-commerce analytics dashboard",
    description:
      "A focused analytics platform for tracking store performance, product activity, and customer behavior.",
    tech: ["React", "Node.js", "MongoDB", "Chart.js"],
    role: "Full-stack development",
    image: "/img/ecom.png",
    githubUrl: "https://github.com/KiwiGuy1",
    liveUrl: "#",
  },
  {
    title: "JM Drywall & Painting",
    subtitle: "Local service business website",
    description:
      "A clean bilingual website for drywall, texture, and painting services with polished project visuals and contact flow.",
    tech: ["Next.js", "TypeScript", "Responsive UI", "Contact API"],
    role: "Website design and build",
    image: "/img/jm-drywall-painting.jpg",
    githubUrl: "https://github.com/KiwiGuy1",
    liveUrl: "https://jmdrywallpainting.com",
  },
];

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".projects-hero", {
        y: 38,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from(".project-card", {
        y: 42,
        opacity: 0,
        duration: 0.78,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 84%",
        },
      });
    },
    { scope: containerRef }
  );

  const handleCardEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: -4,
      borderColor: "rgba(255, 154, 47, 0.32)",
      boxShadow: "0 18px 42px rgba(0, 0, 0, 0.34), 0 0 24px rgba(255, 122, 24, 0.08)",
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  const handleCardLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: COLORS.border,
      boxShadow: "none",
      duration: 0.25,
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
            Simple, polished builds with practical interfaces and clean execution.
          </p>
        </section>

        <section className="shell projects-grid" aria-label="Selected projects">
          {projects.map((project) => (
            <article
              key={project.title}
              className="project-card"
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            >
              <div className="project-media">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority={project.title === "ShopSight"}
                  sizes="(max-width: 860px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="project-copy">
                <span className="badge">{project.role}</span>
                <h2>{project.title}</h2>
                <p className="subtitle">{project.subtitle}</p>
                <p className="description">{project.description}</p>

                <div className="tech-row">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="link-row">
                  {project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      className="primary-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Site
                    </a>
                  )}
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    View Code
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <style jsx>{`
        .projects-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 16%, rgba(255, 122, 24, 0.1) 0%, transparent 39%),
            radial-gradient(circle at 88% 11%, rgba(255, 154, 47, 0.055) 0%, transparent 41%),
            linear-gradient(180deg, #020202 0%, #080808 48%, #000000 100%),
            ${COLORS.background};
          color: ${COLORS.primary};
          padding: clamp(7.25rem, 10vw, 8.5rem) 1rem 4.5rem;
        }

        .shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .projects-hero {
          text-align: center;
          margin-bottom: 2rem;
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
          max-width: 620px;
          color: ${COLORS.secondary};
          line-height: 1.7;
          font-size: clamp(0.98rem, 2.5vw, 1.13rem);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .project-card {
          border: 1px solid ${COLORS.border};
          border-radius: 1rem;
          background: ${COLORS.card};
          backdrop-filter: blur(14px);
          overflow: hidden;
          transition: border-color 0.2s ease;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
        }

        .project-media {
          position: relative;
          min-height: 280px;
          background: ${COLORS.surface};
        }

        .project-copy {
          display: grid;
          gap: 0.72rem;
          padding: 1rem;
        }

        .badge {
          width: fit-content;
          border: 1px solid ${COLORS.border};
          border-radius: 999px;
          background: ${COLORS.surface};
          color: ${COLORS.accent};
          padding: 0.28rem 0.68rem;
          font-size: 0.74rem;
          font-weight: 600;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.3rem, 3vw, 1.85rem);
          line-height: 1.18;
        }

        .subtitle {
          margin: 0;
          color: rgba(255, 177, 92, 0.68);
          font-size: 0.98rem;
        }

        .description {
          margin: 0;
          color: ${COLORS.secondary};
          line-height: 1.68;
          font-size: 0.94rem;
        }

        .tech-row,
        .link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .tech-pill {
          border-radius: 999px;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.surface};
          padding: 0.3rem 0.66rem;
          font-size: 0.74rem;
          color: rgba(255, 244, 232, 0.72);
        }

        .link-row {
          margin-top: 0.12rem;
        }

        .link-row a {
          border-radius: 0.78rem;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.surface};
          color: ${COLORS.primary};
          text-decoration: none;
          padding: 0.62rem 1rem;
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
          color: #120702 !important;
        }

        @media (max-width: 860px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }

          .project-media {
            min-height: 240px;
          }
        }

        @media (max-width: 640px) {
          .projects-root {
            padding-top: 7rem;
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
