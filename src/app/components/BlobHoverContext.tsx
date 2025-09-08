"use client";

import { createContext, useContext, useState, useEffect } from "react";

// --- Types ---
interface BlobHoverContextType {
  hovered: boolean;
  hoveredText: string;
  targetPos: { x: number; y: number } | null;
  isTransitioning: boolean;
  setHovered: (
    hovered: boolean,
    text?: string,
    pos?: { x: number; y: number }
  ) => void;
  startTransition: () => void;
  endTransition: () => void;
  navigate: (link: string) => void;
}

// --- Context ---
const BlobHoverContext = createContext<BlobHoverContextType | undefined>(
  undefined
);

// --- Hook ---
export const useBlobHover = () => {
  const context = useContext(BlobHoverContext);
  if (!context) {
    throw new Error("useBlobHover must be used within BlobHoverProvider");
  }
  return context;
};

// --- Provider ---
export const BlobHoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // --- State ---
  const [hovered, setHoveredState] = useState(false);
  const [hoveredText, setHoveredText] = useState("");
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  // --- Navigation ---
  const navigate = (link: string) => setPendingNavigation(link);

  useEffect(() => {
    if (pendingNavigation) {
      startTransition();
      const timeout = setTimeout(() => {
        window.location.href = pendingNavigation;
      }, 500); // match fade-out duration
      return () => clearTimeout(timeout);
    }
  }, [pendingNavigation]);

  // --- Handlers ---
  const setHovered = (
    h: boolean,
    text?: string,
    pos?: { x: number; y: number }
  ) => {
    setHoveredState(h);
    setHoveredText(text || "");
    setTargetPos(pos || null);
  };

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  // --- Context Value ---
  const value: BlobHoverContextType = {
    hovered,
    hoveredText,
    targetPos,
    isTransitioning,
    setHovered,
    startTransition,
    endTransition,
    navigate,
  };

  // --- Render ---
  return (
    <BlobHoverContext.Provider value={value}>
      {children}
    </BlobHoverContext.Provider>
  );
};
