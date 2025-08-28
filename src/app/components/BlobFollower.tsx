import { useEffect, useRef, useState } from "react";
import { useBlobHover } from "./BlobHoverContext";

const KIWI_GREEN = "#8ee000";

const BlobFollower: React.FC = () => {
  const blobRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const blob = useRef({ x: 0, y: 0, scale: 1 });
  const { hovered, hoveredText, targetPos } = useBlobHover();
  const [mouseActive, setMouseActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    mouse.current.x = window.innerWidth / 2;
    mouse.current.y = window.innerHeight / 2;
    blob.current.x = window.innerWidth / 2;
    blob.current.y = window.innerHeight / 2;
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
      blob.current.x = lastX;
      blob.current.y = lastY;
      blob.current.scale = lastScale;
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(-50%, -50%) translate(${lastX}px, ${lastY}px) scale(${stretchX}, ${stretchY})`;
        blobRef.current.style.transition =
          "background 0.2s, width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s";
        blobRef.current.style.opacity = hovered || mouseActive ? "1" : "0";
        blobRef.current.style.display =
          hovered || mouseActive ? "flex" : "none";
      }
      requestAnimationFrame(animate);
    }
    animate();
  }, [hovered, targetPos, mouseActive]);

  const isMobile = mounted && window.innerWidth < 600;

  return (
    <>
      <div
        ref={blobRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: hovered ? (isMobile ? 100 : 140) : isMobile ? 80 : 100,
          height: hovered ? (isMobile ? 100 : 140) : isMobile ? 80 : 100,
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
          zIndex: 9998,
          transition: "opacity 0.5s",
        }}
      />
    </>
  );
};

export default BlobFollower;
