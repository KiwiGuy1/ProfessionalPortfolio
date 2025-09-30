"use client";
import { useRef } from "react";
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

  useGSAP(() => {
    // Create floating code particles
    const particles = [];
    const codeSymbols = [
      "{ }",
      "< />",
      "( )",
      "[ ]",
      "=>",
      "&&",
      "||",
      "++",
      "--",
    ];
    const particleColors = [
      "rgba(108, 99, 255, 0.8)", // Purple accent
      "rgba(90, 82, 232, 0.6)", // Darker purple
      "rgba(255, 255, 255, 0.3)", // White
      "rgba(168, 168, 168, 0.5)", // Gray
    ];

    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.textContent =
        codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 16 + 12}px;
        color: ${
          particleColors[Math.floor(Math.random() * particleColors.length)]
        };
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-family: 'JetBrains Mono', monospace;
        pointer-events: none;
        opacity: 0.7;
      `;
      particlesRef.current?.appendChild(particle);
      particles.push(particle);
    }

    // Welcome screen animations
    const welcomeTl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Exit animation
          gsap.to(welcomeRef.current, {
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => onComplete(),
          });
        }, 3000);
      },
    });

    // Logo entrance with elegant scale and rotation
    welcomeTl
      .from(logoRef.current, {
        scale: 0,
        rotation: 180,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      })
      // Name with wave effect
      .from(
        nameRef.current,
        {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.8"
      )
      // Title with slide in
      .from(
        titleRef.current,
        {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      // Subtitle with typewriter effect
      .from(
        subtitleRef.current,
        {
          width: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.4"
      )
      // Code line animation
      .from(
        codeLineRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

    // Floating particles animation
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: "random(-150, 150)",
        x: "random(-150, 150)",
        rotation: "random(-360, 360)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    });

    // Animate floating tech icons
    gsap.to(".floating-tech", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(3, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });

    // Animate glowing lines
    gsap.to(".glow-line", {
      scaleY: "random(0.5, 1.5)",
      opacity: "random(0.3, 0.8)",
      duration: "random(1.5, 3)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

    // Animate the code cursor
    gsap.to(".cursor", {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  });

  return (
    <div
      ref={welcomeRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${inter.className}`}
      style={{
        background:
          "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)",
      }}
    >
      {/* Particles Container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Background Tech Elements */}
      <div className="absolute inset-0">
        {/* Floating Tech Icons */}
        <div className="floating-tech absolute top-1/4 left-1/4 text-3xl opacity-20">
          ⚛️
        </div>
        <div className="floating-tech absolute top-1/3 right-1/3 text-2xl opacity-25">
          📱
        </div>
        <div className="floating-tech absolute bottom-1/3 left-1/5 text-4xl opacity-15">
          💻
        </div>
        <div className="floating-tech absolute top-3/4 right-1/4 text-2xl opacity-30">
          🚀
        </div>
        <div className="floating-tech absolute top-1/5 right-1/5 text-3xl opacity-20">
          ⚡
        </div>
        <div className="floating-tech absolute bottom-1/4 right-2/3 text-2xl opacity-25">
          🔧
        </div>
        <div className="floating-tech absolute top-2/3 left-1/6 text-3xl opacity-15">
          🎯
        </div>
        <div className="floating-tech absolute bottom-1/2 right-1/6 text-2xl opacity-30">
          💡
        </div>

        {/* Glowing Lines */}
        <div className="glow-line absolute top-1/4 left-1/2 w-0.5 h-20 bg-gradient-to-b from-purple-500 to-transparent opacity-30 rounded-full"></div>
        <div className="glow-line absolute top-1/3 left-3/4 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent opacity-25 rounded-full"></div>
        <div className="glow-line absolute bottom-1/3 left-1/4 w-0.5 h-24 bg-gradient-to-b from-purple-400 to-transparent opacity-20 rounded-full"></div>
        <div className="glow-line absolute bottom-1/4 right-1/3 w-0.5 h-18 bg-gradient-to-b from-indigo-400 to-transparent opacity-25 rounded-full"></div>

        {/* Circuit-like decorative elements */}
        <div className="floating-tech absolute top-1/6 left-1/3 text-xl opacity-30">
          ○
        </div>
        <div className="floating-tech absolute bottom-1/6 right-1/4 text-lg opacity-25">
          ◇
        </div>
        <div className="floating-tech absolute top-1/2 left-1/6 text-xl opacity-20">
          △
        </div>
      </div>

      {/* Welcome Content */}
      <div className="text-center z-10 max-w-4xl mx-auto px-8">
        {/* Logo */}
        <div
          ref={logoRef}
          className="mb-8 text-7xl"
          style={{
            filter: "drop-shadow(0 0 30px rgba(108, 99, 255, 0.6))",
          }}
        >
          👨‍💻
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px rgba(108, 99, 255, 0.3)",
          }}
        >
          Joseph Gutierrez
        </h1>

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-2xl md:text-4xl text-gray-300 font-medium mb-4"
          style={{
            letterSpacing: "0.1em",
          }}
        >
          Full-Stack Developer
        </h2>

        {/* Subtitle with overflow hidden for typewriter effect */}
        <div className="overflow-hidden mb-8">
          <h3
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-400 font-light whitespace-nowrap"
            style={{
              letterSpacing: "0.15em",
            }}
          >
            Crafting Digital Experiences
          </h3>
        </div>

        {/* Code Line */}
        <div
          ref={codeLineRef}
          className="text-sm md:text-base text-purple-400 font-mono mb-12"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          const developer = &#123; passionate: true, creative: true &#125;;
          <span className="cursor text-white">|</span>
        </div>

        {/* Loading indicator */}
        <div className="mt-12">
          <div className="w-80 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full rounded-full animate-pulse"
              style={{
                background:
                  "linear-gradient(90deg, #6C63FF 0%, #5A52E8 50%, #6C63FF 100%)",
              }}
            ></div>
          </div>
          <p className="text-gray-400 mt-4 text-sm tracking-widest">
            INITIALIZING PORTFOLIO
          </p>
        </div>
      </div>

      {/* Corner Decorative Elements */}
      <div className="absolute top-10 left-10 text-3xl text-purple-500 opacity-50 animate-spin-slow">
        ⚙️
      </div>
      <div className="absolute bottom-10 right-10 text-2xl text-blue-400 opacity-60 animate-bounce">
        💻
      </div>
      <div className="absolute top-1/2 left-10 text-xl text-purple-400 opacity-40 animate-pulse">
        🔗
      </div>
      <div className="absolute top-1/2 right-10 text-xl text-indigo-400 opacity-50 animate-ping">
        ✨
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-2xl text-purple-300 opacity-40 animate-bounce">
        🚀
      </div>
    </div>
  );
}
