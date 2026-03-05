"use client";

import {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
  CSSProperties,
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
  background: "#06141F",
  primary: "#F8FAFC",
  secondary: "#9FB5C7",
  accent: "#2DD4BF",
  accentAlt: "#38BDF8",
  border: "rgba(45, 212, 191, 0.22)",
  card: "rgba(8, 33, 49, 0.74)",
  field: "rgba(56, 189, 248, 0.1)",
  successBg: "rgba(34, 197, 94, 0.14)",
  successText: "#22C55E",
  errorBg: "rgba(239, 68, 68, 0.14)",
  errorText: "#F87171",
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

const focusStyle = (el: HTMLInputElement | HTMLTextAreaElement) => {
  el.style.borderColor = COLORS.accent;
  el.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.18)";
};

const blurStyle = (el: HTMLInputElement | HTMLTextAreaElement) => {
  el.style.borderColor = COLORS.border;
  el.style.boxShadow = "none";
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".contact-panel", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

        gsap.to(".form-shell", {
          scale: 1.01,
          duration: 0.2,
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

  const statusStyle: CSSProperties = status.includes("success")
    ? {
        background: COLORS.successBg,
        border: "1px solid rgba(34, 197, 94, 0.35)",
        color: COLORS.successText,
      }
    : status.includes("Failed") || status.includes("error")
    ? {
        background: COLORS.errorBg,
        border: "1px solid rgba(239, 68, 68, 0.35)",
        color: COLORS.errorText,
      }
    : {
        background: COLORS.field,
        border: `1px solid ${COLORS.border}`,
        color: COLORS.accent,
      };

  return (
    <div ref={containerRef} className={inter.className}>
      <main className="contact-root">
        <section className="contact-hero shell">
          <p className="eyebrow">Contact</p>
          <h1>Let&apos;s Build Something Great</h1>
          <p>
            Have a product idea, redesign, or collaboration in mind? Send a
            message and I&apos;ll get back to you.
          </p>
        </section>

        <section className="shell contact-grid">
          <aside className="contact-panel info-shell">
            <h2>Get In Touch</h2>
            <p>
              I&apos;m open to freelance and full-time opportunities. The best way
              to reach me is email, but I&apos;m also active on social platforms.
            </p>

            <ul>
              <li>
                <span>Email</span>
                <a href="mailto:prototype.object@outlook.com">
                  prototype.object@outlook.com
                </a>
              </li>
              <li>
                <span>Location</span>
                <strong>Sioux Falls, SD</strong>
              </li>
              <li>
                <span>Availability</span>
                <strong>Open for projects</strong>
              </li>
            </ul>
          </aside>

          <div className="contact-panel form-shell">
            <form ref={formRef} onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={(e) => focusStyle(e.target)}
                  onBlur={(e) => blurStyle(e.target)}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={(e) => focusStyle(e.target)}
                  onBlur={(e) => blurStyle(e.target)}
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Tell me about your project"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={(e) => focusStyle(e.target)}
                  onBlur={(e) => blurStyle(e.target)}
                  required
                />
              </label>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <div className="status" style={statusStyle}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <style jsx>{`
        .contact-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 20%, rgba(45, 212, 191, 0.16) 0%, transparent 38%),
            radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.14) 0%, transparent 42%),
            ${COLORS.background};
          color: ${COLORS.primary};
          padding: 96px 1rem 4.5rem;
        }

        .shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .contact-hero {
          text-align: center;
          margin-bottom: 1.8rem;
        }

        .eyebrow {
          margin: 0 0 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: ${COLORS.accent};
          font-weight: 600;
        }

        h1 {
          margin: 0;
          font-size: clamp(2rem, 6.4vw, 4.4rem);
          line-height: 1.06;
          background: linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentAlt} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-hero > p {
          margin: 1rem auto 0;
          max-width: 720px;
          color: ${COLORS.secondary};
          line-height: 1.75;
          font-size: clamp(0.97rem, 2.4vw, 1.18rem);
        }

        .contact-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 0.95fr 1.2fr;
        }

        .contact-panel {
          border-radius: 1.35rem;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.card};
          backdrop-filter: blur(14px);
        }

        .info-shell {
          padding: clamp(1rem, 3vw, 1.5rem);
        }

        h2 {
          margin: 0;
          font-size: clamp(1.25rem, 4vw, 1.75rem);
        }

        .info-shell > p {
          margin: 0.8rem 0 1.15rem;
          color: ${COLORS.secondary};
          line-height: 1.7;
          font-size: 0.96rem;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.8rem;
        }

        li {
          border: 1px solid ${COLORS.border};
          border-radius: 0.9rem;
          background: ${COLORS.field};
          padding: 0.85rem 0.9rem;
          display: grid;
          gap: 0.2rem;
        }

        li span {
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${COLORS.secondary};
        }

        li a,
        li strong {
          color: ${COLORS.primary};
          font-size: 0.95rem;
          text-decoration: none;
          font-weight: 500;
        }

        .form-shell {
          padding: clamp(1rem, 3vw, 1.5rem);
        }

        form {
          display: grid;
          gap: 0.85rem;
        }

        label {
          display: grid;
          gap: 0.45rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: ${COLORS.primary};
        }

        input,
        textarea {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.field};
          color: ${COLORS.primary};
          padding: 0.82rem 0.92rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
          font-family: ${inter.style.fontFamily};
        }

        textarea {
          resize: vertical;
          min-height: 132px;
        }

        input::placeholder,
        textarea::placeholder {
          color: #89a6bc;
        }

        button {
          border: none;
          border-radius: 0.85rem;
          padding: 0.88rem 1rem;
          font-size: 0.96rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #02161f;
          background: linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentAlt} 100%);
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .status {
          border-radius: 0.8rem;
          padding: 0.72rem 0.82rem;
          font-size: 0.9rem;
          text-align: center;
        }

        @media (max-width: 920px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .contact-root {
            padding-top: 88px;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
