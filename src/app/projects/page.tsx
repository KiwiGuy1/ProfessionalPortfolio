"use client";
import React, { useRef, useCallback } from "react";
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

const projects = [
  {
    id: 1,
    title: "ShopSight",
    subtitle: "E-Commerce Analytics Dashboard",
    description:
      "A comprehensive full-stack analytics platform built with React, Node.js, and MongoDB. Features real-time data visualization, user behavior tracking, and business intelligence tools. This project demonstrates modern web development practices and showcases my ability to create complex, data-driven applications.",
    tech: ["React", "Node.js", "MongoDB", "Chart.js", "Express", "CSS3"],
    role: "Full-Stack Developer",
    duration: "3 months",
    image: "/img/ecom.png",
    githubUrl: "https://github.com/KiwiGuy1",
    demoUrl: "#",
    featured: true,
  },
];

const upcomingProjects = [
  {
    title: "TaskFlow Pro",
    description:
      "Team collaboration platform with real-time updates and project management tools",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "In Development",
  },
  {
    title: "FinanceTracker",
    description:
      "Personal finance management application with budget tracking and analytics",
    tech: ["React Native", "Firebase", "Redux"],
    status: "Planning",
  },
  {
    title: "AI Weather Assistant",
    description:
      "Smart weather app with machine learning predictions and personalized insights",
    tech: ["Vue.js", "Python", "TensorFlow"],
    status: "Research",
  },
];

const ProjectsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Refs for hover animations
  const featuredProjectRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  // Get the featured project
  const featuredProject = projects[0];

  // GSAP scroll animations setup
  useGSAP(
    () => {
      // Hero animations
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .from(
          lineRef.current,
          {
            scaleX: 0,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=1"
        );

      // Stats animations
      gsap.from(".stat-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 85%",
          end: "bottom 20%",
        },
      });

      // Featured project animation
      gsap.from(".featured-project", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      // Tech stack animations
      gsap.from(".tech-item", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".tech-stack",
          start: "top 85%",
          end: "bottom 20%",
        },
      });

      // Upcoming projects animations
      gsap.from(".upcoming-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".upcoming-section",
          start: "top 85%",
          end: "bottom 20%",
        },
      });

      // CTA animation
      gsap.from(".cta-content", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });
    },
    { scope: containerRef }
  ); // This ensures proper cleanup

  // React synthetic event handlers using useCallback to prevent re-renders
  const handleFeaturedProjectMouseEnter = useCallback(() => {
    if (featuredProjectRef.current) {
      gsap.to(featuredProjectRef.current, {
        y: -10,
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(108, 99, 255, 0.3)",
        borderColor: "rgba(108, 99, 255, 0.6)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleFeaturedProjectMouseLeave = useCallback(() => {
    if (featuredProjectRef.current) {
      gsap.to(featuredProjectRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 0 0 rgba(108, 99, 255, 0)",
        borderColor: "rgba(108, 99, 255, 0.3)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleUpcomingCardMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      gsap.to(e.currentTarget, {
        y: -5,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    },
    []
  );

  const handleUpcomingCardMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      gsap.to(e.currentTarget, {
        y: 0,
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    },
    []
  );

  const handleButtonMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      gsap.to(e.currentTarget, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    },
    []
  );

  const handleButtonMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    },
    []
  );

  const handleCtaButtonMouseEnter = useCallback(() => {
    if (ctaButtonRef.current) {
      gsap.to(ctaButtonRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, []);

  const handleCtaButtonMouseLeave = useCallback(() => {
    if (ctaButtonRef.current) {
      gsap.to(ctaButtonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
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
            My Work
          </h1>
          <div
            ref={lineRef}
            style={{
              width: "clamp(64px, 10vw, 128px)",
              height: "4px",
              margin: "0 auto 2rem",
              background: "#6C63FF",
              transformOrigin: "left",
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
            Showcasing my journey in full-stack development through real
            projects and innovative solutions. Every line of code tells a story
            of growth and learning.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="stats-section"
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
            { number: "1", label: "Featured Project" },
            { number: "6+", label: "Technologies Used" },
            { number: "3", label: "Projects in Pipeline" },
            { number: "100%", label: "Passion Driven" },
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

      {/* Featured Project Section */}
      <section
        className="featured-section"
        style={{ padding: "clamp(3rem, 8vw, 5rem) 1rem" }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "3rem",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            Featured Project
          </h2>

          {featuredProject && (
            <div
              ref={featuredProjectRef}
              className="featured-project"
              onMouseEnter={handleFeaturedProjectMouseEnter}
              onMouseLeave={handleFeaturedProjectMouseLeave}
              style={{
                background: "#1A1A1A",
                borderRadius: "2rem",
                padding: "clamp(2rem, 5vw, 3rem)",
                border: "2px solid rgba(108, 99, 255, 0.3)",
                cursor: "pointer",
                width: "100%",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Featured Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "2rem",
                  right: "2rem",
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  zIndex: 10,
                }}
              >
                ⭐ Featured
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3rem",
                  alignItems: "center",
                }}
                className="project-grid"
              >
                {/* Project Image */}
                <div
                  style={{
                    borderRadius: "1rem",
                    overflow: "hidden",
                    height: "clamp(250px, 35vw, 400px)",
                    width: "100%",
                    position: "relative",
                    background:
                      "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
                  }}
                >
                  {featuredProject.image ? (
                    <Image
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              color: white; 
                              font-size: clamp(1.5rem, 4vw, 2rem); 
                              font-weight: bold;
                              text-align: center;
                            ">
                              ${featuredProject.title}
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "clamp(1.5rem, 4vw, 2rem)",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {featuredProject.title}
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "1.5rem",
                        background: "rgba(108, 99, 255, 0.2)",
                        color: "#6C63FF",
                      }}
                    >
                      {featuredProject.role}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "1.5rem",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#A8A8A8",
                      }}
                    >
                      {featuredProject.duration}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      lineHeight: "1.2",
                    }}
                  >
                    {featuredProject.title}
                  </h3>
                  <h4
                    style={{
                      fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                      color: "#D1D5DB",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {featuredProject.subtitle}
                  </h4>
                  <p
                    style={{
                      color: "#A8A8A8",
                      lineHeight: "1.7",
                      marginBottom: "2rem",
                      fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
                    }}
                  >
                    {featuredProject.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="tech-stack" style={{ marginBottom: "2rem" }}>
                    <h5
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#D1D5DB",
                        marginBottom: "1rem",
                      }}
                    >
                      Technologies Used
                    </h5>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                      }}
                    >
                      {featuredProject.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="tech-item"
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "1.5rem",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            background: "rgba(255, 255, 255, 0.05)",
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
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={handleButtonMouseEnter}
                      onMouseLeave={handleButtonMouseLeave}
                      style={{
                        padding: "1rem 2rem",
                        textAlign: "center",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "rgba(255, 255, 255, 0.05)",
                        textDecoration: "none",
                        color: "inherit",
                        fontSize: "1rem",
                        fontWeight: "500",
                        minWidth: "140px",
                        display: "inline-block",
                      }}
                    >
                      View Code
                    </a>
                    <a
                      href={featuredProject.demoUrl}
                      onMouseEnter={handleButtonMouseEnter}
                      onMouseLeave={handleButtonMouseLeave}
                      style={{
                        padding: "1rem 2rem",
                        textAlign: "center",
                        borderRadius: "0.75rem",
                        background:
                          "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "1rem",
                        fontWeight: "500",
                        minWidth: "140px",
                        display: "inline-block",
                      }}
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Projects Section */}
      <section
        className="upcoming-section"
        style={{ padding: "clamp(3rem, 8vw, 5rem) 1rem" }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "3rem",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            What&#39;s Next
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              maxWidth: "80rem",
              margin: "0 auto",
            }}
          >
            {upcomingProjects.map((project, index) => (
              <div
                key={index}
                className="upcoming-card"
                onMouseEnter={handleUpcomingCardMouseEnter}
                onMouseLeave={handleUpcomingCardMouseLeave}
                style={{
                  background: "#1A1A1A",
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  position: "relative",
                  cursor: "pointer",
                  height: "fit-content",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "1.5rem",
                    background:
                      project.status === "In Development"
                        ? "rgba(34, 197, 94, 0.2)"
                        : project.status === "Planning"
                        ? "rgba(251, 191, 36, 0.2)"
                        : "rgba(156, 163, 175, 0.2)",
                    color:
                      project.status === "In Development"
                        ? "#22c55e"
                        : project.status === "Planning"
                        ? "#fbbf24"
                        : "#9ca3af",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {project.status}
                </div>

                <h3
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    paddingRight: "5rem",
                    lineHeight: "1.3",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    color: "#A8A8A8",
                    marginBottom: "2rem",
                    lineHeight: "1.6",
                    fontSize: "1rem",
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "1.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="cta-section"
        style={{ padding: "clamp(3rem, 8vw, 5rem) 1rem", textAlign: "center" }}
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
            Let&#39;s Create Something Together
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              marginBottom: "2rem",
              opacity: "0.9",
              lineHeight: "1.5",
            }}
          >
            I&#39;m always excited to take on new challenges and collaborate on
            innovative projects.
          </p>
          <button
            ref={ctaButtonRef}
            onMouseEnter={handleCtaButtonMouseEnter}
            onMouseLeave={handleCtaButtonMouseLeave}
            style={{
              padding: "clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem)",
              fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
              fontWeight: "600",
              borderRadius: "1.875rem",
              background: "#0F0F0F",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Get In Touch
          </button>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .project-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
