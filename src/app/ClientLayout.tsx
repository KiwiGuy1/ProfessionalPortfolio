"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BlobHoverProvider } from "./components/BlobHoverContext";
import BlobFollower from "./components/BlobFollower";
import GlobalNav from "./components/GlobalNav";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // deterministic key

  return (
    <BlobHoverProvider>
      <GlobalNav />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
        // key={pathname}
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: -20 }}
        // transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <BlobFollower />
    </BlobHoverProvider>
  );
}
