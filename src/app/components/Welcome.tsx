"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const welcomeRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const logoRef = useRef(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const codeLineRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });
    document.addEventListener("wheel", preventWheel, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = "auto";
      document.removeEventListener("touchmove", preventTouchMove);
      document.removeEventListener("wheel", preventWheel);
    };
  }, []);

  useGSAP(() => {
    const particles: HTMLDivElement[] = [];
    const shapes = ["■", "□", "●", "○", "◆", "◇", "▲", "△"];
    const particleColors = [
      "rgba(255, 255, 255, 0.30)",
      "rgba(214, 214, 214, 0.24)",
      "rgba(255, 255, 255, 0.15)",
      "rgba(130, 130, 130, 0.22)",
    ];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 8 + 8}px;
        color: ${
          particleColors[Math.floor(Math.random() * particleColors.length)]
        };
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-family: ${inter.style.fontFamily};
        pointer-events: none;
        opacity: 0.6;
      `;
      particlesRef.current?.appendChild(particle);
      particles.push(particle);
    }

    const welcomeTl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          gsap.to(welcomeRef.current, {
            scale: 1.05,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => onComplete(),
          });
        }, 1500);
      },
    });

    welcomeTl
      .from(gridRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power2.out",
      })
      .from(
        logoRef.current,
        {
          scale: 0.5,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.2)",
        },
        "-=1.2"
      )
      .from(
        nameRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .from(
        titleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        subtitleRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .from(
        codeLineRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      );

    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        duration: "random(8, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    gsap.to(".geo-element", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      stagger: {
        each: 2,
        from: "random",
      },
    });

    gsap.to(".accent-line", {
      scaleX: "random(0.8, 1.2)",
      opacity: "random(0.2, 0.6)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5,
    });

    gsap.to(".cursor", {
      opacity: 0,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  });

  return (
    <div
      ref={welcomeRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${inter.className}`}
      style={{
        background: "radial-gradient(ellipse at center, #111111 0%, #000000 72%)",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        touchAction: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="absolute inset-0">
        <div className="accent-line absolute top-1/4 left-1/4 h-0.5 w-16 bg-gradient-to-r from-white to-transparent opacity-30" />
        <div className="accent-line absolute top-1/3 right-1/3 h-0.5 w-12 rotate-45 bg-gradient-to-l from-zinc-300 to-transparent opacity-25" />
        <div className="accent-line absolute bottom-1/3 left-1/5 h-0.5 w-20 bg-gradient-to-r from-zinc-400 to-transparent opacity-20" />
        <div className="accent-line absolute right-1/4 bottom-1/4 h-0.5 w-14 -rotate-45 bg-gradient-to-l from-zinc-200 to-transparent opacity-30" />

        <div className="geo-element absolute top-1/6 left-1/6 h-3 w-3 rotate-45 border border-white opacity-20" />
        <div className="geo-element absolute top-1/5 right-1/5 h-2 w-2 rounded-full bg-zinc-300 opacity-25" />
        <div className="geo-element absolute bottom-1/4 left-1/3 h-4 w-4 border border-zinc-400 opacity-15" />
        <div className="geo-element absolute right-1/6 bottom-1/6 h-3 w-3 bg-zinc-200 opacity-20" />
        <div className="geo-element absolute top-1/2 left-1/12 h-8 w-2 bg-gradient-to-b from-white to-transparent opacity-20" />
        <div className="geo-element absolute top-1/3 right-1/12 h-6 w-2 bg-gradient-to-t from-zinc-300 to-transparent opacity-15" />
      </div>

      <div className="z-10 mx-auto max-w-4xl px-4 text-center sm:px-8">
        <div ref={logoRef} className="mb-8 flex justify-center sm:mb-12">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-white sm:h-20 sm:w-20"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.12)",
            }}
          >
            <span className="text-xl font-bold text-white sm:text-2xl">JG</span>
          </div>
        </div>

        <h1
          ref={nameRef}
          className="mb-3 px-2 text-3xl font-light tracking-wide text-white sm:mb-4 sm:text-4xl md:text-6xl"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #A8A8A8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Joseph Gutierrez
        </h1>

        <h2
          ref={titleRef}
          className="mb-4 px-2 text-lg font-medium uppercase tracking-widest text-zinc-200 sm:mb-6 sm:text-xl md:text-2xl"
          style={{
            letterSpacing: "0.2em",
          }}
        >
          Full-Stack Developer
        </h2>

        <p
          ref={subtitleRef}
          className="mx-auto mb-8 max-w-2xl px-4 text-sm font-light leading-relaxed text-gray-400 sm:mb-12 sm:text-base md:text-lg"
          style={{
            letterSpacing: "0.05em",
          }}
        >
          Building scalable applications with modern technologies
          <br />
          <span className="text-zinc-300">React • Node.js • TypeScript</span>
        </p>

        <div
          ref={codeLineRef}
          className="mx-auto mb-12 max-w-lg px-4 text-xs text-gray-500 sm:mb-16 sm:text-sm md:text-base"
          style={{
            fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', monospace",
            lineHeight: "1.6",
          }}
        >
          <span className="text-zinc-200">const</span>{" "}
          <span className="text-white">developer</span>{" "}
          <span className="text-gray-400">=</span>{" "}
          <span className="text-zinc-300">&#123;</span>
          <br />
          <span className="ml-4 text-zinc-200">passionate</span>
          <span className="text-gray-400">:</span>{" "}
          <span className="text-white">true</span>
          <span className="text-gray-400">,</span>
          <br />
          <span className="ml-4 text-zinc-200">creative</span>
          <span className="text-gray-400">:</span>{" "}
          <span className="text-white">true</span>
          <br />
          <span className="text-zinc-300">&#125;</span>
          <span className="cursor text-zinc-100">|</span>
        </div>

        <div className="mt-6 px-4 sm:mt-8">
          <div className="mx-auto h-px w-48 overflow-hidden bg-gray-800 sm:w-64">
            <div
              className="h-full animate-pulse"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)",
                animation: "loading 2s ease-in-out infinite",
              }}
            />
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-500 sm:mt-6">
            Loading Portfolio
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}
