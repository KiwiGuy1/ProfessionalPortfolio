"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const COLORS = {
  background: "#020202",
  backgroundSoft: "#0b0b0b",
  primary: "#f5f5f5",
  secondary: "#b9b9b9",
  accent: "#f0f0f0",
  accentAlt: "#9d9d9d",
  border: "rgba(255, 255, 255, 0.14)",
  card: "rgba(255, 255, 255, 0.05)",
  chip: "rgba(255, 255, 255, 0.06)",
};

const journey = [
  {
    title: "Full Stack Developer",
    company: "Freelance",
    period: "2023 - Present",
    description:
      "Building polished web apps with a focus on performance, maintainable architecture, and product-quality UX.",
  },
  {
    title: "Frontend Developer",
    company: "Previous Company",
    period: "2022 - 2023",
    description:
      "Shipped responsive interfaces and improved core page performance across high-traffic surfaces.",
  },
  {
    title: "Learning & Growth",
    company: "Self-taught",
    period: "2021 - 2022",
    description:
      "Built fundamentals through consistent practice, project work, and modern web tooling.",
  },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".about-card", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".journey-item", {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".journey-wrap",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={inter.className}>
      <main className="about-root">
        <section className="about-hero section-shell">
          <p className="eyebrow">About</p>
          <h1>Crafting Clean, Fast Interfaces</h1>
          <p className="lead">
            I design and build modern web experiences focused on clarity,
            motion, and usability. My goal is always the same: make products
            feel effortless for users.
          </p>
        </section>

        <section className="section-shell about-card card">
          <div className="card-grid">
            <div>
              <h2>What I Do</h2>
              <p>
                I work across frontend and full-stack workflows, from component
                architecture to deployment. I enjoy turning rough ideas into
                production-ready interfaces that look sharp on desktop and
                mobile.
              </p>
            </div>

            <div className="skills-grid">
              <article className="skill-pill">
                <h3>Design</h3>
                <p>UI systems, visual hierarchy, responsive layouts</p>
              </article>
              <article className="skill-pill">
                <h3>Development</h3>
                <p>Next.js, React, TypeScript, APIs</p>
              </article>
              <article className="skill-pill">
                <h3>Performance</h3>
                <p>Core Web Vitals, smooth interactions, lean bundles</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell journey-wrap">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {journey.map((item, idx) => (
              <article key={idx} className="journey-item card timeline-item">
                <div className="timeline-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="company">{item.company}</p>
                  </div>
                  <span className="period">{item.period}</span>
                </div>
                <p className="description">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .about-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at 14% 18%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 86% 10%, rgba(255, 255, 255, 0.05) 0%, transparent 38%),
            ${COLORS.background};
          color: ${COLORS.primary};
          padding: 96px 1rem 4.5rem;
        }

        .section-shell {
          width: min(1080px, 100%);
          margin: 0 auto;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .eyebrow {
          color: ${COLORS.accent};
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          font-weight: 600;
          margin: 0 0 0.9rem;
        }

        h1 {
          margin: 0;
          font-size: clamp(2rem, 6.3vw, 4.6rem);
          line-height: 1.04;
          background: linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentAlt} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lead {
          margin: 1rem auto 0;
          max-width: 740px;
          color: ${COLORS.secondary};
          font-size: clamp(0.98rem, 2.5vw, 1.2rem);
          line-height: 1.75;
        }

        .card {
          border: 1px solid ${COLORS.border};
          background: ${COLORS.card};
          backdrop-filter: blur(14px);
          border-radius: 1.4rem;
        }

        .about-card {
          padding: clamp(1.3rem, 4vw, 2.2rem);
          margin-bottom: 2.2rem;
        }

        .card-grid {
          display: grid;
          gap: 1.2rem;
          grid-template-columns: 1.3fr 1fr;
        }

        h2 {
          margin: 0 0 0.8rem;
          font-size: clamp(1.45rem, 4vw, 2rem);
          line-height: 1.2;
        }

        .card-grid > div > p {
          margin: 0;
          color: ${COLORS.secondary};
          line-height: 1.75;
          font-size: 1rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .skill-pill {
          border: 1px solid ${COLORS.border};
          border-radius: 1rem;
          padding: 0.95rem 1rem;
          background: ${COLORS.chip};
        }

        .skill-pill h3 {
          margin: 0 0 0.3rem;
          font-size: 1.02rem;
        }

        .skill-pill p {
          margin: 0;
          color: ${COLORS.secondary};
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .section-title {
          text-align: center;
          margin-bottom: 1.15rem;
        }

        .timeline {
          display: grid;
          gap: 0.9rem;
        }

        .timeline-item {
          padding: 1.1rem;
        }

        .timeline-top {
          display: flex;
          justify-content: space-between;
          gap: 0.8rem;
          align-items: flex-start;
          margin-bottom: 0.7rem;
        }

        .timeline-item h3 {
          margin: 0;
          font-size: 1.07rem;
        }

        .company {
          margin: 0.2rem 0 0;
          color: #dddddd;
          font-size: 0.92rem;
        }

        .period {
          border: 1px solid ${COLORS.border};
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          font-size: 0.76rem;
          color: ${COLORS.secondary};
          background: ${COLORS.chip};
          white-space: nowrap;
        }

        .description {
          margin: 0;
          color: ${COLORS.secondary};
          line-height: 1.65;
          font-size: 0.95rem;
        }

        @media (max-width: 900px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .about-root {
            padding-top: 88px;
          }

          .timeline-top {
            flex-direction: column;
          }

          .period {
            margin-top: 0.15rem;
          }
        }
      `}</style>
    </div>
  );
}
