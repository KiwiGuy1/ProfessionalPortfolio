"use client";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

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
  navigate: (link: string) => void; // <- add this
}

const BlobHoverContext = createContext<BlobHoverContextType | undefined>(
  undefined
);

export const useBlobHover = () => {
  const context = useContext(BlobHoverContext);
  if (!context)
    throw new Error("useBlobHover must be used within BlobHoverProvider");
  return context;
};

export const BlobHoverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hovered, setHoveredState] = useState(false);
  const [hoveredText, setHoveredText] = useState("");
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

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

  return (
    <BlobHoverContext.Provider
      value={{
        hovered,
        hoveredText,
        targetPos,
        isTransitioning,
        setHovered,
        startTransition,
        endTransition,
        navigate, // <- provide here
      }}
    >
      {children}
    </BlobHoverContext.Provider>
  );
};
