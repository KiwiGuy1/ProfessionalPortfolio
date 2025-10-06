"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
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

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

      // Form animation
      gsap.from(".form-card", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Form field animations
      gsap.from(".form-field", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".form-field",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });

        // Success animation
        gsap.to(".form-card", {
          scale: 1.02,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch {
      setStatus("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

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
            Let's Work Together
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
            Ready to bring your ideas to life? Send me a message and let's
            discuss your next project.
          </p>

          {/* Contact Form */}
          <div
            className="form-card"
            style={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "2rem",
              padding: "clamp(2rem, 6vw, 3rem)",
              textAlign: "left",
            }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div className="form-field">
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    fontWeight: "500",
                    color: COLORS.primary,
                  }}
                >
                  Name
                </label>
                <input
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "0.75rem",
                    color: COLORS.primary,
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    outline: "none",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.accent;
                    e.target.style.boxShadow = `0 0 0 3px rgba(108, 99, 255, 0.1)`;
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border;
                    e.target.style.boxShadow = "none";
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                />
              </div>

              <div className="form-field">
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    fontWeight: "500",
                    color: COLORS.primary,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "0.75rem",
                    color: COLORS.primary,
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    outline: "none",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.accent;
                    e.target.style.boxShadow = `0 0 0 3px rgba(108, 99, 255, 0.1)`;
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border;
                    e.target.style.boxShadow = "none";
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                />
              </div>

              <div className="form-field">
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    fontWeight: "500",
                    color: COLORS.primary,
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "0.75rem",
                    color: COLORS.primary,
                    fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                    outline: "none",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
                    resize: "vertical",
                    minHeight: "120px",
                    boxSizing: "border-box",
                    fontFamily: inter.style.fontFamily,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.accent;
                    e.target.style.boxShadow = `0 0 0 3px rgba(108, 99, 255, 0.1)`;
                    gsap.to(e.target, {
                      scale: 1.02,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border;
                    e.target.style.boxShadow = "none";
                    gsap.to(e.target, {
                      scale: 1,
                      duration: 0.5, // Longer duration
                      ease: "power2.out",
                    });
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "1rem 2rem",
                  background: isSubmitting ? COLORS.secondary : COLORS.gradient,
                  color: "#FFFFFF !important",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
                  fontWeight: "700",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother and longer transition
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  position: "relative",
                  overflow: "hidden",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  transform: "translateY(0) scale(1)", // Initial state for smooth animation
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    // Smoother GSAP animation
                    gsap.to(e.currentTarget, {
                      scale: 1.03, // Slightly less dramatic
                      y: -3, // Subtle lift
                      duration: 0.6, // Longer duration
                      ease: "power2.out", // Smoother easing
                    });

                    // Gradual box shadow
                    gsap.to(e.currentTarget, {
                      boxShadow: "0 20px 40px rgba(108, 99, 255, 0.3)",
                      duration: 0.6,
                      ease: "power2.out",
                    });

                    // Smoother ripple effect
                    const ripple = document.createElement("div");
                    ripple.style.cssText = `
                      position: absolute;
                      border-radius: 50%;
                      background: rgba(255, 255, 255, 0.2);
                      transform: scale(0);
                      animation: smoothRipple 0.8s ease-out;
                      pointer-events: none;
                      left: 50%;
                      top: 50%;
                      width: 30px;
                      height: 30px;
                      margin-left: -15px;
                      margin-top: -15px;
                    `;
                    e.currentTarget.appendChild(ripple);

                    setTimeout(() => ripple.remove(), 800);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    // Smooth return animation
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      y: 0,
                      boxShadow: "0 4px 12px rgba(108, 99, 255, 0.1)",
                      duration: 0.6, // Longer duration
                      ease: "power2.out",
                    });
                  }
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {status && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  textAlign: "center",
                  fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                  background: status.includes("success")
                    ? "rgba(34, 197, 94, 0.1)"
                    : status.includes("Failed") || status.includes("error")
                    ? "rgba(239, 68, 68, 0.1)"
                    : COLORS.surface,
                  color: status.includes("success")
                    ? "#22c55e"
                    : status.includes("Failed") || status.includes("error")
                    ? "#ef4444"
                    : COLORS.accent,
                  border: `1px solid ${
                    status.includes("success")
                      ? "rgba(34, 197, 94, 0.2)"
                      : status.includes("Failed") || status.includes("error")
                      ? "rgba(239, 68, 68, 0.2)"
                      : COLORS.border
                  }`,
                }}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Minimal Footer */}
      <footer
        style={{
          padding: "3rem 1rem 2rem",
          textAlign: "center",
          borderTop: `1px solid rgba(255, 255, 255, 0.05)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a
            href="mailto:prototype.object@outlook.com"
            style={{
              color: COLORS.accent,
              textDecoration: "none",
              fontSize: "1.125rem",
              fontWeight: "500",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#8B7EFF";
              (e.target as HTMLElement).style.transform = "translateY(-3px)"; // Slightly more movement
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = COLORS.accent;
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            prototype.object@outlook.com
          </a>

          <span style={{ color: COLORS.border, fontSize: "1.25rem" }}>•</span>

          <a
            href="https://linkedin.com/in/joseph"
            style={{
              color: COLORS.secondary,
              textDecoration: "none",
              fontSize: "1.125rem",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = COLORS.primary;
              (e.target as HTMLElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = COLORS.secondary;
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            LinkedIn
          </a>

          <span style={{ color: COLORS.border, fontSize: "1.25rem" }}>•</span>

          <a
            href="https://github.com/KiwiGuy1"
            style={{
              color: COLORS.secondary,
              textDecoration: "none",
              fontSize: "1.125rem",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = COLORS.primary;
              (e.target as HTMLElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = COLORS.secondary;
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            GitHub
          </a>

          <span style={{ color: COLORS.border, fontSize: "1.25rem" }}>•</span>

          <span
            style={{
              color: COLORS.secondary,
              fontSize: "1.125rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            📍 Sioux Falls, SD
          </span>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: `1px solid rgba(255, 255, 255, 0.05)`,
          }}
        >
          <p
            style={{
              color: COLORS.secondary,
              fontSize: "0.875rem",
              margin: "0",
              opacity: "0.6",
            }}
          >
            © 2024 Joseph Gutierrez • Available for remote work worldwide
          </p>
        </div>
      </footer>

      {/* Enhanced CSS for smoother animations */}
      <style jsx>{`
        @keyframes smoothRipple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(6);
            opacity: 0;
          }
        }

        /* Smooth scroll behavior */
        * {
          scroll-behavior: smooth;
        }

        @media (max-width: 768px) {
          footer > div:first-child {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }

          footer > div:first-child span {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
