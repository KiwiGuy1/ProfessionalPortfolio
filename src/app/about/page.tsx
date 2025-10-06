"use client";
import React, { useRef, useEffect } from "react";
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
  background: "#0F0F0F",
  primary: "#FFFFFF",
  accent: "#6C63FF",
  secondary: "#A8A8A8",
  cardBg: "#1A1A1A",
  gradient: "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
  border: "rgba(255, 255, 255, 0.1)",
  surface: "rgba(255, 255, 255, 0.05)",
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          ".hero-line",
          {
            scaleX: 0,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=0.5"
        );

      // Experience animation
      gsap.from(".experience-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={inter.className}
      style={{
        background: COLORS.background,
        color: COLORS.primary,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        paddingTop: "80px",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem 1rem",
          width: "100%",
          boxSizing: "border-box",
          background: `radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%)`,
        }}
      >
        <div style={{ maxWidth: "48rem", width: "100%" }}>
          <h1
            ref={titleRef}
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: "bold",
              marginBottom: "2rem",
              background: COLORS.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1.1",
            }}
          >
            About Me
          </h1>
          <div
            className="hero-line"
            style={{
              width: "clamp(64px, 10vw, 128px)",
              height: "4px",
              margin: "0 auto 2rem",
              background: COLORS.accent,
            }}
          />
          <p
            ref={subtitleRef}
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: COLORS.secondary,
              margin: "0 auto 3rem",
              lineHeight: "1.6",
              padding: "0 1rem",
            }}
          >
            Hi, I make beautiful websites and web applications. I have a passion
            for creating engaging and interactive user experiences with modern
            technologies and thoughtful design.
          </p>

          {/* About Card */}
          <div
            style={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "2rem",
              padding: "clamp(2rem, 6vw, 3rem)",
              textAlign: "left",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: COLORS.primary,
                  }}
                >
                  What I Do
                </h3>
                <p
                  style={{
                    color: COLORS.secondary,
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    lineHeight: "1.6",
                    marginBottom: "1.5rem",
                  }}
                >
                  My expertise includes front-end development, UI/UX design, and
                  performance optimization. I specialize in creating responsive,
                  accessible, and high-performance web applications that deliver
                  exceptional user experiences.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    🎨
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                      color: COLORS.primary,
                    }}
                  >
                    Design
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: COLORS.secondary,
                      margin: "0",
                    }}
                  >
                    UI/UX Design
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    💻
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                      color: COLORS.primary,
                    }}
                  >
                    Development
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: COLORS.secondary,
                      margin: "0",
                    }}
                  >
                    Frontend & Backend
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    ⚡
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                      color: COLORS.primary,
                    }}
                  >
                    Performance
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: COLORS.secondary,
                      margin: "0",
                    }}
                  >
                    Optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceRef}
        style={{
          padding: "clamp(3rem, 8vw, 5rem) 1rem",
        }}
      >
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "3rem",
              color: COLORS.primary,
              textAlign: "center",
            }}
          >
            Experience & Journey
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {[
              {
                title: "Full Stack Developer",
                company: "Freelance",
                period: "2023 - Present",
                description:
                  "Creating modern web applications with focus on performance and user experience.",
              },
              {
                title: "Frontend Developer",
                company: "Previous Company",
                period: "2022 - 2023",
                description:
                  "Developed responsive interfaces and improved website performance by 40%.",
              },
              {
                title: "Learning & Growth",
                company: "Self-taught",
                period: "2021 - 2022",
                description:
                  "Mastered modern web technologies through continuous learning and practice.",
              },
            ].map((exp, i) => (
              <div
                key={i}
                className="experience-item"
                style={{
                  background: COLORS.cardBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "1.5rem",
                  padding: "clamp(1.5rem, 4vw, 2rem)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.accent;
                  e.currentTarget.style.transform = "translateX(8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "clamp(1.125rem, 3vw, 1.25rem)",
                        fontWeight: "600",
                        color: COLORS.primary,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      style={{
                        color: COLORS.accent,
                        fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                        fontWeight: "500",
                        margin: "0",
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <span
                    style={{
                      color: COLORS.secondary,
                      fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                      background: COLORS.surface,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <p
                  style={{
                    color: COLORS.secondary,
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    lineHeight: "1.6",
                    margin: "0",
                  }}
                >
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS for smooth animations */}
      <style jsx>{`
        /* Smooth scroll behavior */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
