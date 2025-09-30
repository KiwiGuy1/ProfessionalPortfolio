"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const projects = [
  {
    id: 1,
    title: "ShopSight",
    subtitle: "E-Commerce Analytics Dashboard",
    description:
      "Full-stack analytics platform built with React, Node.js, and PostgreSQL. Features real-time data visualization, user behavior tracking, and predictive analytics.",
    tech: ["React", "Node.js", "PostgreSQL", "Chart.js", "Redis"],
    role: "Full-Stack Developer",
    duration: "3 months",
    image: "/img/ecom.png",
  },
  {
    id: 2,
    title: "TaskFlow",
    subtitle: "Project Management System",
    description:
      "Collaborative project management tool with real-time updates, team collaboration features, and advanced reporting capabilities.",
    tech: ["Next.js", "Express", "MongoDB", "Socket.io", "Tailwind"],
    role: "Lead Developer",
    duration: "4 months",
  },
  {
    id: 3,
    title: "FinanceTracker",
    subtitle: "Personal Finance Application",
    description:
      "Modern financial tracking app with budgeting tools, expense categorization, and investment portfolio management.",
    tech: ["React Native", "Firebase", "Plaid API", "Redux", "TypeScript"],
    role: "Mobile Developer",
    duration: "2 months",
  },
  {
    id: 4,
    title: "WeatherVision",
    subtitle: "AI-Powered Weather App",
    description:
      "Advanced weather application with machine learning predictions, satellite imagery, and personalized recommendations.",
    tech: ["Vue.js", "Python", "TensorFlow", "OpenWeather API", "Docker"],
    role: "Full-Stack Developer",
    duration: "2 months",
  },
];

const ProjectsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap
        .timeline()
        .from(titleRef.current, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(
          subtitleRef.current,
          { y: 50, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.8"
        )
        .from(
          ".hero-line",
          { scaleX: 0, duration: 1.5, ease: "power3.out" },
          "-=0.5"
        );

      // Stats animation
      gsap.from(".stat-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: { trigger: ".stats", start: "top 85%" },
      });

      // Project cards animation
      gsap.from(".project-card", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        scrollTrigger: { trigger: ".projects", start: "top 80%" },
      });

      // Tech items animation
      gsap.from(".tech-item", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".tech-stack", start: "top 85%" },
      });

      // CTA animation
      gsap.from(".cta-content", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: { trigger: ".cta", start: "top 80%" },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={inter.className}
      style={{
        background: "#0F0F0F",
        color: "#FFFFFF",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 1rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "90rem", width: "100%" }}>
          <h1
            ref={titleRef}
            style={{
              fontSize: "clamp(2.5rem, 8vw, 8rem)",
              fontWeight: "bold",
              marginBottom: "2rem",
              background: "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1.1",
            }}
          >
            Projects
          </h1>
          <div
            className="hero-line"
            style={{
              width: "clamp(64px, 10vw, 128px)",
              height: "4px",
              margin: "0 auto 2rem",
              background: "#6C63FF",
            }}
          />
          <p
            ref={subtitleRef}
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "#A8A8A8",
              maxWidth: "48rem",
              margin: "0 auto",
              lineHeight: "1.6",
              padding: "0 1rem",
            }}
          >
            Crafting digital experiences through innovative full-stack
            solutions. Each project represents a journey of problem-solving,
            creativity, and technical excellence.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="stats"
        style={{ padding: "clamp(3rem, 8vw, 5rem) 1rem" }}
      >
        <div
          style={{
            maxWidth: "75rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "clamp(1rem, 4vw, 2rem)",
          }}
        >
          {[
            { number: "15+", label: "Projects Completed" },
            { number: "3+", label: "Years Experience" },
            { number: "10+", label: "Technologies" },
            { number: "98%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="stat-item" style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "#6C63FF",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  color: "#A8A8A8",
                  fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section
        className="projects"
        style={{ padding: "clamp(3rem, 8vw, 5rem) 1rem" }}
      >
        <div
          style={{
            maxWidth: "90rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{
                background: "#1A1A1A",
                borderRadius: "1.5rem",
                padding: "clamp(1.5rem, 4vw, 2rem)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                width: "100%",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, { y: -10, scale: 1.02, duration: 0.4 })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.4 })
              }
            >
              {/* Project Image */}
              <div
                style={{
                  marginBottom: "clamp(1rem, 3vw, 2rem)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  height: "clamp(200px, 30vw, 256px)",
                  width: "100%",
                  position: "relative",
                }}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    onError={(e) => {
                      // Hide the image and show fallback
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.background =
                          "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)";
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";
                        parent.innerHTML = `<div style='color: white; font-size: clamp(1rem, 3vw, 1.5rem); font-weight: bold; text-align: center; padding: 1rem;'>${project.title}</div>`;
                      }
                    }}
                  />
                ) : (
                  // Fallback for projects without images
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "clamp(1rem, 3vw, 1.5rem)",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    {project.title}
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1.25rem",
                      background: "rgba(108, 99, 255, 0.2)",
                      color: "#6C63FF",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.role}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      color: "#A8A8A8",
                    }}
                  >
                    {project.duration}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    lineHeight: "1.2",
                  }}
                >
                  {project.title}
                </h3>
                <h4
                  style={{
                    fontSize: "clamp(1rem, 3vw, 1.25rem)",
                    color: "#D1D5DB",
                    marginBottom: "1rem",
                    lineHeight: "1.3",
                  }}
                >
                  {project.subtitle}
                </h4>
                <p
                  style={{
                    color: "#A8A8A8",
                    lineHeight: "1.6",
                    marginBottom: "1.5rem",
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                  }}
                >
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="tech-stack" style={{ marginBottom: "1.5rem" }}>
                  <h5
                    style={{
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      fontWeight: "600",
                      color: "#D1D5DB",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Technologies
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="tech-item"
                        style={{
                          fontSize: "clamp(0.625rem, 1.8vw, 0.75rem)",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1.25rem",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          background: "rgba(255, 255, 255, 0.05)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexDirection: window.innerWidth < 400 ? "column" : "row",
                  }}
                >
                  <a
                    href="#"
                    style={{
                      flex: "1",
                      padding: "0.75rem 1rem",
                      textAlign: "center",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.05)",
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    GitHub
                  </a>
                  <a
                    href="#"
                    style={{
                      flex: "1",
                      padding: "0.75rem 1rem",
                      textAlign: "center",
                      borderRadius: "0.5rem",
                      background: "#6C63FF",
                      color: "#0F0F0F",
                      textDecoration: "none",
                      fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="cta"
        style={{
          padding: "clamp(3rem, 8vw, 5rem) 1rem",
          textAlign: "center",
        }}
      >
        <div
          className="cta-content"
          style={{
            maxWidth: "62.5rem",
            margin: "0 auto",
            padding: "clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)",
            background: "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
            borderRadius: "2rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              lineHeight: "1.2",
            }}
          >
            Let&#39;s Build Something Amazing
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              marginBottom: "2rem",
              opacity: "0.9",
              lineHeight: "1.5",
            }}
          >
            Ready to bring your next project to life? Let&#39;s discuss how we
            can work together.
          </p>
          <button
            style={{
              padding: "clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem)",
              fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
              fontWeight: "600",
              borderRadius: "1.875rem",
              background: "#0F0F0F",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
