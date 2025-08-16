"use client";
import { createContext, useContext, useState } from "react";

interface BlobHoverContextType {
  hovered: boolean;
  hoveredText: string;
  targetPos: { x: number; y: number } | null;
  setHovered: (
    hovered: boolean,
    text?: string,
    pos?: { x: number; y: number }
  ) => void;
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

  const setHovered = (
    h: boolean,
    text?: string,
    pos?: { x: number; y: number }
  ) => {
    setHoveredState(h);
    setHoveredText(text || "");
    setTargetPos(pos || null);
  };

  return (
    <BlobHoverContext.Provider
      value={{ hovered, hoveredText, targetPos, setHovered }}
    >
      {children}
    </BlobHoverContext.Provider>
  );
};
