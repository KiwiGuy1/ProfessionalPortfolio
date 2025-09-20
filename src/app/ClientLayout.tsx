"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GlobalNav from "./components/GlobalNav";
import { Bebas_Neue } from "next/font/google";

const ANIMATION_DURATION = 0.5; // seconds
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const navTimer = setTimeout(() => setShowNav(true), 2000);
    return () => clearTimeout(navTimer);
  }, []);

  useEffect(() => {
    async function preload() {
      await wait(2000); // Simulate loading
      setLoading(false);
    }
    preload();
  }, []);

  // Custom navigation handler
  const handleNavigate = async (href: string) => {
    if (loading || href === pathname) return;
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
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: loading ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            >
              <span className="text-4xl text-white font-bold">Loading...</span>
            </motion.div>
          )}
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
          {showNav && <GlobalNav onNavigate={handleNavigate} />}
          <div className="relative min-h-screen w-full">
            {!loading && (
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
