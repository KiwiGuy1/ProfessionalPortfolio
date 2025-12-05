"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GlobalNav from "./components/GlobalNav";
import { Bebas_Neue } from "next/font/google";
import Welcome from "./components/Welcome";

const ANIMATION_DURATION = 0.5; // seconds
const WELCOME_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayShouldHide, setOverlayShouldHide] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Don't show welcome for dashboard or auth routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/auth")) {
      setShowWelcome(false);
      setShowNav(false);
      return;
    }

    try {
      // Check if welcome should be shown based on localStorage
      const lastWelcomeTime = localStorage.getItem("lastWelcomeShown");
      const now = Date.now();

      if (lastWelcomeTime) {
        const parsedTime = parseInt(lastWelcomeTime, 10);
        // Validate timestamp is a valid number and not in the future
        if (isNaN(parsedTime) || parsedTime > now) {
          localStorage.removeItem("lastWelcomeShown");
          setShowWelcome(true);
          localStorage.setItem("lastWelcomeShown", now.toString());
        } else {
          const timeSinceWelcome = now - parsedTime;
          if (timeSinceWelcome < WELCOME_COOLDOWN_MS) {
            // Still in cooldown, don't show welcome
            setShowWelcome(false);
            setShowNav(true);
          } else {
            // Cooldown expired, show welcome again
            setShowWelcome(true);
            localStorage.setItem("lastWelcomeShown", now.toString());
          }
        }
      } else {
        // First visit, show welcome and record timestamp
        setShowWelcome(true);
        localStorage.setItem("lastWelcomeShown", now.toString());
      }
    } catch (error) {
      // localStorage might be unavailable or disabled
      console.warn("Unable to access localStorage", error);
      // Default to showing welcome if localStorage fails
      if (
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/api/auth")
      ) {
        setShowWelcome(true);
        setShowNav(false);
      }
    }
  }, [pathname]);

  // Handle welcome completion
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowNav(true);
  };

  // Custom navigation handler
  const handleNavigate = async (href: string) => {
    if (showWelcome || href === pathname) return;
    await router.prefetch(href);
    setOverlayVisible(true);
    setOverlayShouldHide(false);
    setPendingRoute(href);
  };

  // Use Framer Motion's animation complete for route change
  const handleOverlayAnimationComplete = () => {
    if (overlayVisible && pendingRoute) {
      router.push(pendingRoute);
      setPendingRoute(null);
      // Wait for new content to be ready, then fade out overlay
      setTimeout(() => setOverlayShouldHide(true), 100); // Small delay for React to render new content
    }
  };

  // Hide overlay after fade out
  useEffect(() => {
    if (overlayShouldHide) {
      const timer = setTimeout(() => {
        setOverlayVisible(false);
        setOverlayShouldHide(false);
      }, ANIMATION_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [overlayShouldHide]);

  return (
    <div>
      {mounted && (
        <>
          {/* Welcome Screen */}
          {showWelcome && <Welcome onComplete={handleWelcomeComplete} />}

          {/* Page Transition Overlay */}
          <motion.div
            initial={false}
            animate={{
              opacity: overlayVisible ? (overlayShouldHide ? 0 : 1) : 0,
            }}
            transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            style={{ pointerEvents: "none" }}
            className="fixed inset-0 z-40 bg-black"
            onAnimationComplete={handleOverlayAnimationComplete}
          />

          {/* Navigation */}
          {showNav && <GlobalNav onNavigate={handleNavigate} />}

          {/* Main Content */}
          <div className="relative min-h-screen w-full">
            {!showWelcome && pathname.startsWith("/dashboard") ? (
              // Dashboard: render without styling
              children
            ) : !showWelcome ? (
              // Other pages: render with styling
              <span className={bebas.className + " text-8xl font-extrabold"}>
                {children}
              </span>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
