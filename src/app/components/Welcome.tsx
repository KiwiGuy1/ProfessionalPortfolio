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

  // Disable scrolling when component mounts
  useEffect(() => {
    // Prevent scrolling on document body
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Also prevent touch scrolling on mobile
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

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = "auto";
      document.removeEventListener("touchmove", preventTouchMove);
      document.removeEventListener("wheel", preventWheel);
    };
  }, []);

  useGSAP(() => {
    // Create subtle geometric particles
    const particles = [];
    const shapes = ["▪", "▫", "●", "○", "◆", "◇", "▲", "△"];
    const particleColors = [
      "rgba(108, 99, 255, 0.4)",
      "rgba(90, 82, 232, 0.3)",
      "rgba(255, 255, 255, 0.15)",
      "rgba(168, 168, 168, 0.2)",
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

    // Professional welcome animation sequence
    const welcomeTl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Smooth exit animation
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

    // Sophisticated entrance animations
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

    // Subtle floating animation for particles
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

    // Animate geometric elements
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

    // Pulse animation for accent lines
    gsap.to(".accent-line", {
      scaleX: "random(0.8, 1.2)",
      opacity: "random(0.2, 0.6)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5,
    });

    // Typing cursor animation
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
        background:
          "radial-gradient(ellipse at center, #1A1A1A 0%, #0F0F0F 70%)",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        touchAction: "none", // Prevents touch scrolling
        WebkitOverflowScrolling: "touch", // iOS specific
      }}
    >
      {/* Subtle Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Particles Container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Minimalist Geometric Elements */}
      <div className="absolute inset-0">
        {/* Accent Lines */}
        <div className="accent-line absolute top-1/4 left-1/4 w-16 h-0.5 bg-gradient-to-r from-purple-500 to-transparent opacity-30"></div>
        <div className="accent-line absolute top-1/3 right-1/3 w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent opacity-25 rotate-45"></div>
        <div className="accent-line absolute bottom-1/3 left-1/5 w-20 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent opacity-20"></div>
        <div className="accent-line absolute bottom-1/4 right-1/4 w-14 h-0.5 bg-gradient-to-l from-purple-300 to-transparent opacity-30 -rotate-45"></div>

        {/* Geometric Elements */}
        <div className="geo-element absolute top-1/6 left-1/6 w-3 h-3 border border-purple-500 opacity-20 rotate-45"></div>
        <div className="geo-element absolute top-1/5 right-1/5 w-2 h-2 bg-purple-400 opacity-25 rounded-full"></div>
        <div className="geo-element absolute bottom-1/4 left-1/3 w-4 h-4 border border-indigo-400 opacity-15"></div>
        <div className="geo-element absolute bottom-1/6 right-1/6 w-3 h-3 bg-purple-300 opacity-20"></div>
        <div className="geo-element absolute top-1/2 left-1/12 w-2 h-8 bg-gradient-to-b from-purple-500 to-transparent opacity-20"></div>
        <div className="geo-element absolute top-1/3 right-1/12 w-2 h-6 bg-gradient-to-t from-indigo-500 to-transparent opacity-15"></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl mx-auto px-4 sm:px-8">
        {/* Minimalist Logo */}
        <div ref={logoRef} className="mb-8 sm:mb-12 flex justify-center">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-purple-500 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(108, 99, 255, 0.1)",
              boxShadow: "0 0 40px rgba(108, 99, 255, 0.2)",
            }}
          >
            <span className="text-xl sm:text-2xl font-bold text-purple-400">
              JG
            </span>
          </div>
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          className="text-3xl sm:text-4xl md:text-6xl font-light text-white mb-3 sm:mb-4 tracking-wide px-2"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #A8A8A8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Joseph Gutierrez
        </h1>

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-lg sm:text-xl md:text-2xl text-purple-400 font-medium mb-4 sm:mb-6 tracking-widest uppercase px-2"
          style={{
            letterSpacing: "0.2em",
          }}
        >
          Full-Stack Developer
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm sm:text-base md:text-lg text-gray-400 font-light mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          style={{
            letterSpacing: "0.05em",
          }}
        >
          Building scalable applications with modern technologies
          <br />
          <span className="text-purple-300">React • Node.js • TypeScript</span>
        </p>

        {/* Code Line */}
        <div
          ref={codeLineRef}
          className="text-xs sm:text-sm md:text-base text-gray-500 font-mono mb-12 sm:mb-16 max-w-lg mx-auto px-4"
          style={{
            fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', monospace",
            lineHeight: "1.6",
          }}
        >
          <span className="text-purple-400">const</span>{" "}
          <span className="text-white">developer</span>{" "}
          <span className="text-gray-400">=</span>{" "}
          <span className="text-green-400">&#123;</span>
          <br />
          <span className="ml-4 text-blue-400">passionate</span>
          <span className="text-gray-400">:</span>{" "}
          <span className="text-yellow-400">true</span>
          <span className="text-gray-400">,</span>
          <br />
          <span className="ml-4 text-blue-400">creative</span>
          <span className="text-gray-400">:</span>{" "}
          <span className="text-yellow-400">true</span>
          <br />
          <span className="text-green-400">&#125;</span>
          <span className="cursor text-purple-400">|</span>
        </div>

        {/* Loading indicator */}
        <div className="mt-6 sm:mt-8 px-4">
          <div className="w-48 sm:w-64 h-px bg-gray-800 mx-auto overflow-hidden">
            <div
              className="h-full animate-pulse"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, #6C63FF 50%, transparent 100%)",
                animation: "loading 2s ease-in-out infinite",
              }}
            ></div>
          </div>
          <p className="text-gray-500 mt-4 sm:mt-6 text-xs tracking-[0.3em] uppercase font-medium">
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
