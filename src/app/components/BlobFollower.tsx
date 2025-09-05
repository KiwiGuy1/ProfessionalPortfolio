import { useEffect, useRef, useState } from "react";
import { useBlobHover } from "./BlobHoverContext";

const KIWI_GREEN = "#8ee000";

const BlobFollower: React.FC = () => {
  const blobRef = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const blobRef3 = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const blob = useRef({ x: 0, y: 0, scale: 1 });
  const blob2 = useRef({ x: 0, y: 0 });
  const blob3 = useRef({ x: 0, y: 0 });
  const { hovered, hoveredText, targetPos } = useBlobHover();
  const [mouseActive, setMouseActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    mouse.current.x = window.innerWidth / 2;
    mouse.current.y = window.innerHeight / 2;
    blob.current.x = window.innerWidth / 2;
    blob.current.y = window.innerHeight / 2;
    blob2.current.x = window.innerWidth / 2;
    blob2.current.y = window.innerHeight / 2;
    blob3.current.x = window.innerWidth / 2;
    blob3.current.y = window.innerHeight / 2;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setMouseActive(true);
    };
    const handleMouseLeave = () => setMouseActive(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let lastX = blob.current.x;
    let lastY = blob.current.y;
    let lastScale = blob.current.scale;
    let lastX2 = blob2.current.x;
    let lastY2 = blob2.current.y;
    let lastX3 = blob3.current.x;
    let lastY3 = blob3.current.y;
    function animate() {
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
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "0";
        }
      } else {
        const dx = mouse.current.x - lastX;
        const dy = mouse.current.y - lastY;
        lastX += dx * 0.15;
        lastY += dy * 0.15;
        const speed = Math.sqrt(dx * dx + dy * dy);
        lastScale = 1 + Math.min(speed / 100, 0.5);
        stretchX = 1 + (lastScale - 1) * 0.7;
        stretchY = 2 - lastScale;
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "0";
        }
      }
      // Trailing blobs follow the previous blob with a delay
      lastX2 += (lastX - lastX2) * 0.15;
      lastY2 += (lastY - lastY2) * 0.15;
      lastX3 += (lastX2 - lastX3) * 0.15;
      lastY3 += (lastY2 - lastY3) * 0.15;
      blob.current.x = lastX;
      blob.current.y = lastY;
      blob.current.scale = lastScale;
      blob2.current.x = lastX2;
      blob2.current.y = lastY2;
      blob3.current.x = lastX3;
      blob3.current.y = lastY3;
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(-50%, -50%) translate(${lastX}px, ${lastY}px) scale(${stretchX}, ${stretchY})`;
        blobRef.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef.current.style.opacity = hovered || mouseActive ? "1" : "0";
        blobRef.current.style.display =
          hovered || mouseActive ? "flex" : "none";
      }
      if (blobRef2.current) {
        blobRef2.current.style.transform = `translate(-50%, -50%) translate(${lastX2}px, ${lastY2}px) scale(0.7, 0.7)`;
        blobRef2.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef2.current.style.opacity = hovered || mouseActive ? "0.7" : "0";
        blobRef2.current.style.display =
          hovered || mouseActive ? "flex" : "none";
      }
      if (blobRef3.current) {
        blobRef3.current.style.transform = `translate(-50%, -50%) translate(${lastX3}px, ${lastY3}px) scale(0.5, 0.5)`;
        blobRef3.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef3.current.style.opacity = hovered || mouseActive ? "0.5" : "0";
        blobRef3.current.style.display =
          hovered || mouseActive ? "flex" : "none";
      }
      requestAnimationFrame(animate);
    }
    animate();
  }, [hovered, targetPos, mouseActive]);

  const isMobile = mounted && window.innerWidth < 600;

  return (
    <>
      {/* Main Blob */}
      <div
        ref={blobRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: hovered ? (isMobile ? 100 : 140) : isMobile ? 60 : 50,
          height: hovered ? (isMobile ? 100 : 140) : isMobile ? 60 : 50,
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: hovered
            ? "0 16px 64px 0 rgba(140, 220, 0, 0.5)"
            : "0 8px 32px 0 rgba(140, 220, 0, 0.3)",
          pointerEvents: "none",
          zIndex: 9999,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: hovered || mouseActive ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          fontSize: hovered ? 15 : 0,
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: hovered ? "0 2px 8px #6a9c00" : "none",
          userSelect: "none",
          opacity: hovered || mouseActive ? 1 : 0,
        }}
      >
        {hovered && hoveredText}
      </div>
      {/* Trailing Blob 2 */}
      <div
        ref={blobRef2}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: hovered ? (isMobile ? 60 : 80) : isMobile ? 40 : 60,
          height: hovered ? (isMobile ? 60 : 80) : isMobile ? 40 : 60,
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: "0 4px 16px 0 rgba(140, 220, 0, 0.2)",
          pointerEvents: "none",
          zIndex: 9998,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: hovered || mouseActive ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered || mouseActive ? 0.7 : 0,
        }}
      />
      {/* Trailing Blob 3 */}
      <div
        ref={blobRef3}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: hovered ? (isMobile ? 30 : 40) : isMobile ? 20 : 30,
          height: hovered ? (isMobile ? 30 : 40) : isMobile ? 20 : 30,
          borderRadius: "50%",
          background: KIWI_GREEN,
          boxShadow: "0 2px 8px 0 rgba(140, 220, 0, 0.1)",
          pointerEvents: "none",
          zIndex: 9997,
          transition:
            "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s",
          display: hovered || mouseActive ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered || mouseActive ? 0.5 : 0,
        }}
      />
      {/* Overlay */}
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
