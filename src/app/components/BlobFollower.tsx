import { useEffect, useRef, useState } from "react";
import { useBlobHover } from "./BlobHoverContext";

// --- Default Config ---
const DEFAULT_COLORS = {
  main: "#000",
  shadowMain: "#000",
  shadow2: "rgba(140, 220, 0, 0.2)",
  shadow3: "rgba(140, 220, 0, 0.1)",
  text: "#fff",
  textShadow: "#6a9c00",
};
const DEFAULT_SIZES = {
  main: { base: 50, hover: 140, mobileBase: 60, mobileHover: 100 },
  blob2: { base: 60, hover: 80, mobileBase: 40, mobileHover: 60 },
  blob3: { base: 30, hover: 40, mobileBase: 20, mobileHover: 30 },
};

// --- Helper ---
function getBlobSize(hovered: boolean, isMobile: boolean, config: any) {
  return hovered
    ? isMobile
      ? config.mobileHover
      : config.hover
    : isMobile
    ? config.mobileBase
    : config.base;
}

// --- Main Component ---
interface BlobFollowerProps {
  className?: string;
  colors?: Partial<typeof DEFAULT_COLORS>;
  sizes?: Partial<typeof DEFAULT_SIZES>;
  showText?: boolean;
  trailingBlobs?: number; // 0, 1, 2
}

const BlobFollower: React.FC<BlobFollowerProps> = ({
  className = "",
  colors = {},
  sizes = {},
  showText = true,
  trailingBlobs = 2,
}) => {
  // --- Merge configs ---
  const mergedColors = { ...DEFAULT_COLORS, ...colors };
  const mergedSizes = {
    main: { ...DEFAULT_SIZES.main, ...(sizes.main || {}) },
    blob2: { ...DEFAULT_SIZES.blob2, ...(sizes.blob2 || {}) },
    blob3: { ...DEFAULT_SIZES.blob3, ...(sizes.blob3 || {}) },
  };

  // --- Refs ---
  const blobRef = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const blobRef3 = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const blob = useRef({ x: 0, y: 0, scale: 1 });
  const blob2 = useRef({ x: 0, y: 0 });
  const blob3 = useRef({ x: 0, y: 0 });

  // --- Context ---
  const { hovered, hoveredText, targetPos } = useBlobHover();

  // --- State ---
  const [isMobile, setIsMobile] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouse.current.x = centerX;
    mouse.current.y = centerY;
    blob.current.x = centerX;
    blob.current.y = centerY;
    blob2.current.x = centerX;
    blob2.current.y = centerY;
    blob3.current.x = centerX;
    blob3.current.y = centerY;
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 600);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- Animation loop (no setState inside loop, so no rerender) ---
  useEffect(() => {
    let lastX = blob.current.x;
    let lastY = blob.current.y;
    let lastScale = blob.current.scale;
    let lastX2 = blob2.current.x;
    let lastY2 = blob2.current.y;
    let lastX3 = blob3.current.x;
    let lastY3 = blob3.current.y;

    let running = true;
    function animate() {
      if (!running) return;

      // --- Main blob follows mouse or hovered target ---
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;
      let stretchX = 1,
        stretchY = 1;

      if (hovered && targetPos) {
        targetX = targetPos.x;
        targetY = targetPos.y;
        const dx = targetX - lastX;
        const dy = targetY - lastY;
        stretchX = 1 + Math.min(Math.abs(dx) / 80, 0.7);
        stretchY = 1 + Math.min(Math.abs(dy) / 80, 0.7);
        lastX += dx * 0.18;
        lastY += dy * 0.18;
      } else {
        const dx = mouse.current.x - lastX;
        const dy = mouse.current.y - lastY;
        lastX += dx * 0.15;
        lastY += dy * 0.15;
        const speed = Math.sqrt(dx * dx + dy * dy);
        lastScale = 1 + Math.min(speed / 100, 0.5);
        stretchX = 1 + (lastScale - 1) * 0.7;
        stretchY = 2 - lastScale;
      }

      // --- Trailing blobs follow with delay ---
      lastX2 += (lastX - lastX2) * 0.15;
      lastY2 += (lastY - lastY2) * 0.15;
      lastX3 += (lastX2 - lastX3) * 0.15;
      lastY3 += (lastY2 - lastY3) * 0.15;

      // --- Update refs ---
      blob.current.x = lastX;
      blob.current.y = lastY;
      blob.current.scale = lastScale;
      blob2.current.x = lastX2;
      blob2.current.y = lastY2;
      blob3.current.x = lastX3;
      blob3.current.y = lastY3;

      // --- Main blob style ---
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(-50%, -50%) translate(${lastX}px, ${lastY}px) scale(${stretchX}, ${stretchY})`;
        blobRef.current.style.opacity = "1";
        blobRef.current.style.display = "flex";
      }
      // --- Trailing blob 2 style ---
      if (blobRef2.current && trailingBlobs > 0) {
        blobRef2.current.style.transform = `translate(-50%, -50%) translate(${lastX2}px, ${lastY2}px) scale(0.7, 0.7)`;
        blobRef2.current.style.opacity = "0.7";
        blobRef2.current.style.display = "flex";
      }
      // --- Trailing blob 3 style ---
      if (blobRef3.current && trailingBlobs > 1) {
        blobRef3.current.style.transform = `translate(-50%, -50%) translate(${lastX3}px, ${lastY3}px) scale(0.5, 0.5)`;
        blobRef3.current.style.opacity = "0.5";
        blobRef3.current.style.display = "flex";
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
    };
  }, [hovered, targetPos, isMobile, trailingBlobs, mergedSizes]);

  // --- Render ---
  return (
    <>
      {/* Main Blob */}
      <div
        ref={blobRef}
        className={`fixed top-0 left-0 pointer-events-none ${className}`}
        style={{
          width: getBlobSize(hovered, isMobile, mergedSizes.main),
          height: getBlobSize(hovered, isMobile, mergedSizes.main),
          borderRadius: "50%",
          background: mergedColors.main,
          boxShadow: hovered
            ? `0 16px 64px 0 ${mergedColors.shadowMain}`
            : `0 8px 32px 0 ${mergedColors.shadowMain}`,
          zIndex: 9999,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: hovered && showText ? 15 : 0,
          color: mergedColors.text,
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: hovered ? `0 2px 8px ${mergedColors.textShadow}` : "none",
          userSelect: "none",
          opacity: 1,
        }}
      >
        {hovered && showText && hoveredText}
      </div>
      {/* Trailing Blob 2 */}
      {trailingBlobs > 0 && (
        <div
          ref={blobRef2}
          className={`fixed top-0 left-0 pointer-events-none ${className}`}
          style={{
            width: getBlobSize(hovered, isMobile, mergedSizes.blob2),
            height: getBlobSize(hovered, isMobile, mergedSizes.blob2),
            borderRadius: "50%",
            background: mergedColors.main,
            boxShadow: `0 4px 16px 0 ${mergedColors.shadow2}`,
            zIndex: 9998,
            transition:
              "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}
        />
      )}
      {/* Trailing Blob 3 */}
      {trailingBlobs > 1 && (
        <div
          ref={blobRef3}
          className={`fixed top-0 left-0 pointer-events-none ${className}`}
          style={{
            width: getBlobSize(hovered, isMobile, mergedSizes.blob3),
            height: getBlobSize(hovered, isMobile, mergedSizes.blob3),
            borderRadius: "50%",
            background: mergedColors.main,
            boxShadow: `0 2px 8px 0 ${mergedColors.shadow3}`,
            zIndex: 9997,
            transition:
              "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
          }}
        />
      )}
    </>
  );
};

export default BlobFollower;
