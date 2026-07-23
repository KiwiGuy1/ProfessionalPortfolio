"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import GlobalNav from "@/components/navigation/GlobalNav";
import { Bebas_Neue } from "next/font/google";

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
  const [transitionPhase, setTransitionPhase] = useState<
    "idle" | "covering" | "navigating" | "revealing"
  >("idle");
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setMounted(true);

    setShowNav(!pathname.startsWith("/dashboard") && !pathname.startsWith("/signin"));
  }, [pathname]);

  // Custom navigation handler
  const handleNavigate = async (href: string) => {
    if (href === pathname || transitionPhase !== "idle") return;
    try {
      await router.prefetch(href);
    } catch {
      // Prefetch can fail in some environments; navigation should still proceed.
    }
    setPendingRoute(href);
    setTransitionPhase("covering");
  };

  // Start route change only after the old page is fully covered.
  const handleOverlayAnimationComplete = () => {
    if (transitionPhase === "covering" && pendingRoute) {
      router.push(pendingRoute);
      setTransitionPhase("navigating");
      return;
    }

    if (transitionPhase === "revealing") {
      setTransitionPhase("idle");
      setPendingRoute(null);
    }
  };

  // Fade overlay out only when the new pathname is active.
  useEffect(() => {
    if (transitionPhase === "navigating" && pendingRoute === pathname) {
      requestAnimationFrame(() => setTransitionPhase("revealing"));
    }
  }, [pathname, pendingRoute, transitionPhase]);

  const overlayOpacity =
    transitionPhase === "covering" || transitionPhase === "navigating" ? 1 : 0;

  return (
    <div>
      {mounted && (
        <>
          {/* Page Transition Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: overlayOpacity }}
            transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            style={{ pointerEvents: "none" }}
            className="fixed inset-0 z-40 bg-black"
            onAnimationComplete={handleOverlayAnimationComplete}
          />

          {/* Navigation */}
          {showNav && (
            <GlobalNav onNavigate={handleNavigate} currentPath={pathname} />
          )}

          {/* Main Content */}
          <div className="relative min-h-screen w-full">
            {pathname.startsWith("/dashboard") || pathname.startsWith("/signin") ? (
              // Dashboard: render without styling
              children
            ) : (
              // Other pages: render with styling
              <div className={bebas.className}>{children}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
