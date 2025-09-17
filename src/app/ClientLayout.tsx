"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BlobHoverProvider } from "./components/BlobHoverContext";
import BlobFollower from "./components/BlobFollower";
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
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // --- Loading state for preloading ---
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function preload() {
      await wait(2000); // 2 seconds

      setLoading(false);
    }
    preload();
  }, []);

  // Custom navigation handler
  const handleNavigate = async (href: string) => {
    if (loading) return; // Block navigation until loaded
    if (href === pathname) return;
    await router.prefetch(href); // Preload the route!
    setOverlayVisible(true);
    setPendingRoute(href);
  };

  // When overlay is fully opaque, route to new page
  useEffect(() => {
    if (overlayVisible && pendingRoute) {
      const timer = setTimeout(() => {
        router.push(pendingRoute);
        setPendingRoute(null);
      }, ANIMATION_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [overlayVisible, pendingRoute, router]);

  // When route changes, fade overlay out
  useEffect(() => {
    if (overlayVisible) {
      const timer = setTimeout(() => {
        setOverlayVisible(false);
      }, ANIMATION_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname, overlayVisible]);

  return (
    <BlobHoverProvider>
      {mounted ? (
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
            animate={{ opacity: overlayVisible ? 1 : 0 }}
            transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            style={{
              pointerEvents: "none",
            }}
            className="fixed inset-0 z-40 bg-black"
          />
          <GlobalNav onNavigate={handleNavigate} />
          <BlobFollower className="z-60" />
          <div
            className="relative min-h-screen w-full"
            style={
              {
                // Background image and related styles removed
              }
            }
          >
            {!loading && (
              <div>
                <span className={bebas.className + " text-8xl font-extrabold"}>
                  {children}
                </span>
              </div>
            )}
          </div>
        </>
      ) : null}
    </BlobHoverProvider>
  );
}
