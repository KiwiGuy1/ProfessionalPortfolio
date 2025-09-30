"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GlobalNav from "./components/GlobalNav";
import { Bebas_Neue } from "next/font/google";
import Welcome from "./components/Welcome";

const ANIMATION_DURATION = 0.5; // seconds
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
  }, []);

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
            {!showWelcome && (
              <span className={bebas.className + " text-8xl font-extrabold"}>
                {children}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
