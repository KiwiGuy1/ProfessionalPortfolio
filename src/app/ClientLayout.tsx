"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BlobHoverProvider } from "./components/BlobHoverContext";
import BlobFollower from "./components/BlobFollower";
import GlobalNav from "./components/GlobalNav";

const ANIMATION_DURATION = 0.5; // seconds

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  // Custom navigation handler
  const handleNavigate = (href: string) => {
    if (href === pathname) return;
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
      <div className="relative min-h-screen w-full">
        <GlobalNav onNavigate={handleNavigate} />
        <div>{children}</div>
        <BlobFollower />
        {/* Black overlay for fade transition */}
        <motion.div
          initial={false}
          animate={{ opacity: overlayVisible ? 1 : 0 }}
          transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
          style={{
            pointerEvents: overlayVisible ? "auto" : "none",
          }}
          className="fixed inset-0 z-50 bg-black"
        />
      </div>
    </BlobHoverProvider>
  );
}
