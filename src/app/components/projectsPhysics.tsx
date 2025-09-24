"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import {
  Application as PixiApplication,
  extend,
  ApplicationRef,
} from "@pixi/react";
import { Graphics, Container, Sprite, Texture, Assets } from "pixi.js";

extend({ Graphics, Container, Sprite, Texture });

const COLORS = {
  stand: "#fff",
  background: "#EAE8FF",
  rect: 0xffcc00,
};
const MOBILE_BREAKPOINT = 600;
const MAX_CANVAS_HEIGHT = 300;
function getResponsiveSizes(width: number, height: number) {
  // Mobile: smaller objects, Desktop: larger
  const isMobile = width < 600;
  return {
    rectWidth: isMobile
      ? Math.max(width * 0.7, 120)
      : Math.max(width * 0.5, 1200),
    rectHeight: isMobile
      ? Math.max(height * 0.18, 60)
      : Math.max(height * 0.22, 800),
    standWidth: isMobile
      ? Math.max(width * 0.85, 120)
      : Math.max(width * 0.7, 500),
    standHeight: isMobile
      ? Math.max(height * 0.07, 32)
      : Math.max(height * 0.09, 60),
    rectY: isMobile
      ? Math.max(height * 0.12, 40)
      : Math.max(height * 0.18, 100),
  };
}

export default function ProjectPhysics() {
  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState(() => {
    const isMobile =
      typeof window !== "undefined"
        ? window.innerWidth < MOBILE_BREAKPOINT
        : false;
    return {
      width: typeof window !== "undefined" ? window.innerWidth : 1200,
      height:
        typeof window !== "undefined"
          ? isMobile
            ? Math.min(window.innerHeight, MAX_CANVAS_HEIGHT)
            : window.innerHeight
          : 800,
    };
  });

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 600;
      setCanvasSize({
        width: window.innerWidth,
        height: isMobile
          ? Math.min(window.innerHeight, MAX_CANVAS_HEIGHT)
          : window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive object sizes
  const { rectWidth, rectHeight, standWidth, standHeight, rectY } =
    getResponsiveSizes(canvasSize.width, canvasSize.height);

  const pixiAppRef = useRef<ApplicationRef | null>(null);
  const [rectPos, setRectPos] = useState<{
    x: number;
    y: number;
    angle: number;
  }>({
    x: canvasSize.width / 2,
    y: rectY,
    angle: 0,
  });

  const engineRef = useRef<Matter.Engine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [appKey, setAppKey] = useState(() => Date.now());
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    Assets.load("/img/ecom.png").then((loaded) => {
      setTexture(loaded as Texture);
    });
  }, []);

  useEffect(() => {
    setAppKey(Date.now());
  }, [canvasSize.width, canvasSize.height]);

  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Rectangle
    const rect = Matter.Bodies.rectangle(
      canvasSize.width / 2,
      rectY,
      rectWidth,
      rectHeight,
      {
        restitution: 0.7,
        friction: 0.05,
        label: "rect",
        collisionFilter: { category: 0x0001 },
      }
    );
    Matter.World.add(engine.world, rect);

    // Stand (ground)
    const stand = Matter.Bodies.rectangle(
      canvasSize.width / 2,
      canvasSize.height - standHeight / 2,
      standWidth,
      standHeight,
      { isStatic: true, label: "stand" }
    );
    Matter.World.add(engine.world, stand);

    // Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Animation loop
    function update() {
      Matter.Engine.update(engine, 1000 / 60);
      setRectPos({
        x: rect.position.x,
        y: rect.position.y,
        angle: rect.angle,
      });
      animationFrameRef.current = requestAnimationFrame(update);
    }
    update();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasSize.width,
    canvasSize.height,
    rectWidth,
    rectHeight,
    standWidth,
    standHeight,
    rectY,
  ]);

  // Attach MouseConstraint and scroll workaround
  useEffect(() => {
    let mouseConstraint: Matter.MouseConstraint | null = null;
    let scrollTimeout: NodeJS.Timeout | undefined = undefined;
    const appDiv = appRef.current;

    function handleScroll() {
      const canvas = appDiv?.querySelector("canvas");
      if (!canvas) return;
      canvas.style.pointerEvents = "none";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = "auto";
      }, 500);
    }

    function attachMouse() {
      if (!engineRef.current || !appDiv) return;
      const canvas = appDiv.querySelector("canvas");
      if (!canvas) return;
      canvas.style.touchAction = "auto";
      canvas.style.userSelect = "none";
      canvas.style.pointerEvents = "auto";
      const mouse = Matter.Mouse.create(canvas);
      mouseConstraint = Matter.MouseConstraint.create(engineRef.current, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
        collisionFilter: {
          mask: 0x0001,
        },
      });
      Matter.World.add(engineRef.current.world, mouseConstraint);

      canvas.addEventListener("wheel", handleScroll, { passive: false });
      canvas.addEventListener("touchmove", handleScroll, { passive: false });
    }

    const timeout = setTimeout(attachMouse, 100);

    return () => {
      if (mouseConstraint && engineRef.current) {
        Matter.World.remove(engineRef.current.world, mouseConstraint);
      }
      const canvas = appDiv?.querySelector("canvas");
      if (canvas) {
        canvas.removeEventListener("wheel", handleScroll);
        canvas.removeEventListener("touchmove", handleScroll);
      }
      clearTimeout(timeout);
    };
  }, [canvasSize.width, canvasSize.height]);

  // Draw stand
  const drawStand = useCallback(
    (g: Graphics) => {
      if (!g) return;
      g.clear();
      g.fill({ color: COLORS.stand });
      g.rect(-standWidth / 2, -standHeight / 2, standWidth, standHeight);
      g.fill();
    },
    [standWidth, standHeight]
  );

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* PixiJS Canvas */}
      <div
        ref={appRef}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          maxWidth: "100vw",
          background: COLORS.background,
          position: "relative",
          overflow: "auto",
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        <PixiApplication
          key={appKey}
          width={canvasSize.width}
          height={canvasSize.height}
          background={COLORS.background}
          autoStart
          ref={pixiAppRef}
        >
          {/* Rectangle */}
          <pixiContainer
            x={rectPos.x}
            y={rectPos.y}
            rotation={rectPos.angle}
            pivot={{ x: 0, y: 0 }}
          >
            <pixiSprite
              texture={texture ?? Texture.EMPTY}
              width={rectWidth}
              height={rectHeight}
              anchor={0.5}
            />
            <pixiGraphics
              draw={(g) => {
                if (!g) return;
                g.clear();
                g.setStrokeStyle({ width: 4, color: 0x000000 });
                g.rect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
              }}
            />
          </pixiContainer>

          {/* Stand */}
          <pixiContainer
            x={canvasSize.width / 2}
            y={canvasSize.height - standHeight / 2}
          >
            <pixiGraphics draw={drawStand} />
          </pixiContainer>
        </PixiApplication>
      </div>
    </div>
  );
}
