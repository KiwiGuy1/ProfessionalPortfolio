import { useEffect, useRef, useState } from "react";
import { useBlobHover } from "./BlobHoverContext";

// --- Constants ---
const KIWI_GREEN = "#8ee000";

// --- Helper ---
function getBlobSize(hovered: boolean, isMobile: boolean) {
  return hovered ? (isMobile ? 100 : 140) : isMobile ? 60 : 50;
}
function getBlob2Size(hovered: boolean, isMobile: boolean) {
  return hovered ? (isMobile ? 60 : 80) : isMobile ? 40 : 60;
}
function getBlob3Size(hovered: boolean, isMobile: boolean) {
  return hovered ? (isMobile ? 30 : 40) : isMobile ? 20 : 30;
}

// --- Main Component ---
const BlobFollower: React.FC<{ className?: string }> = ({ className = "" }) => {
  // --- Refs ---
  const blobRef = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const blobRef3 = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const blob = useRef({ x: 0, y: 0, scale: 1 });
  const blob2 = useRef({ x: 0, y: 0 });
  const blob3 = useRef({ x: 0, y: 0 });

  // --- Context ---
  const { hovered, hoveredText, targetPos } = useBlobHover();

  // --- State ---
  const [isMobile, setIsMobile] = useState(false);
  const [blobState, setBlobState] = useState({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    width: 100,
    height: 100,
  });

  // --- Effects ---
  // Set initial positions
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

  // Mobile detection
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 600);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse movement tracking
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

  // Animation loop for blob and trailing blobs
  useEffect(() => {
    let lastX = blob.current.x;
    let lastY = blob.current.y;
    let lastScale = blob.current.scale;
    let lastX2 = blob2.current.x;
    let lastY2 = blob2.current.y;
    let lastX3 = blob3.current.x;
    let lastY3 = blob3.current.y;

    function animate() {
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
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
      } else {
        const dx = mouse.current.x - lastX;
        const dy = mouse.current.y - lastY;
        lastX += dx * 0.15;
        lastY += dy * 0.15;
        const speed = Math.sqrt(dx * dx + dy * dy);
        lastScale = 1 + Math.min(speed / 100, 0.5);
        stretchX = 1 + (lastScale - 1) * 0.7;
        stretchY = 2 - lastScale;
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
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

      // --- Update blobState for PhysicsNav ---
      const newBlobState = {
        x: lastX,
        y: lastY,
        width: getBlobSize(hovered, isMobile),
        height: getBlobSize(hovered, isMobile),
      };
      setBlobState((prev) =>
        prev.x !== newBlobState.x ||
        prev.y !== newBlobState.y ||
        prev.width !== newBlobState.width ||
        prev.height !== newBlobState.height
          ? newBlobState
          : prev
      );

      // --- Dispatch custom event for PhysicsNav ---
      window.dispatchEvent(
        new CustomEvent("blobmove", { detail: newBlobState })
      );

      // --- Main blob style ---
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(-50%, -50%) translate(${lastX}px, ${lastY}px) scale(${stretchX}, ${stretchY})`;
        blobRef.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef.current.style.opacity = "1";
        blobRef.current.style.display = "flex";
      }
      // --- Trailing blob 2 style ---
      if (blobRef2.current) {
        blobRef2.current.style.transform = `translate(-50%, -50%) translate(${lastX2}px, ${lastY2}px) scale(0.7, 0.7)`;
        blobRef2.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef2.current.style.opacity = "0.7";
        blobRef2.current.style.display = "flex";
      }
      // --- Trailing blob 3 style ---
      if (blobRef3.current) {
        blobRef3.current.style.transform = `translate(-50%, -50%) translate(${lastX3}px, ${lastY3}px) scale(0.5, 0.5)`;
        blobRef3.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef3.current.style.opacity = "0.5";
        blobRef3.current.style.display = "flex";
      }
      requestAnimationFrame(animate);
    }
    animate();
  }, [hovered, targetPos, isMobile]);

  // --- Render ---
  return (
    <>
      {/* Main Blob */}
      <div
        ref={blobRef}
        className={`fixed top-0 left-0 pointer-events-none ${className}`}
        style={{
          width: blobState.width,
          height: blobState.height,
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: hovered
            ? "0 16px 64px 0 rgba(140, 220, 0, 0.5)"
            : "0 8px 32px 0 rgba(140, 220, 0, 0.3)",
          zIndex: 9999,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: hovered ? 15 : 0,
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: hovered ? "0 2px 8px #6a9c00" : "none",
          userSelect: "none",
          opacity: 1,
        }}
      >
        {hovered && hoveredText}
      </div>
      {/* Trailing Blob 2 */}
      <div
        ref={blobRef2}
        className={`fixed top-0 left-0 pointer-events-none ${className}`}
        style={{
          width: getBlob2Size(hovered, isMobile),
          height: getBlob2Size(hovered, isMobile),
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: "0 4px 16px 0 rgba(140, 220, 0, 0.2)",
          zIndex: 9998,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.7,
        }}
      />
      {/* Trailing Blob 3 */}
      <div
        ref={blobRef3}
        className={`fixed top-0 left-0 pointer-events-none ${className}`}
        style={{
          width: getBlob3Size(hovered, isMobile),
          height: getBlob3Size(hovered, isMobile),
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: "0 2px 8px 0 rgba(140, 220, 0, 0.1)",
          zIndex: 9997,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.5,
        }}
      />
      {/* Overlay (not used, but kept for completeness) */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          background: KIWI_GREEN,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9996,
          transition: "opacity 0.5s",
        }}
      />
    </>
  );
};

export default BlobFollower;
