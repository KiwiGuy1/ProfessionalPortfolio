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

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const STAND_WIDTH = 1200;
const STAND_HEIGHT = 300;
const RECT_WIDTH = 1200;
const RECT_HEIGHT = 700;

const COLORS = {
  stand: "#fff",
  background: "#EAE8FF",
  rect: 0xffcc00,
};
function getSceneSize() {
  if (typeof window !== "undefined") {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
}

export default function ProjectPhysics() {
  const { width: SCENE_WIDTH, height: SCENE_HEIGHT } = getSceneSize();
  const pixiAppRef = useRef<ApplicationRef | null>(null); // PixiJS ApplicationRef from @pixi/react

  const [rectPos, setRectPos] = useState<{
    x: number;
    y: number;
    angle: number;
  }>({
    x: SCENE_WIDTH / 2,
    y: 100,
    angle: 0,
  });

  const engineRef = useRef<Matter.Engine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [appKey, setAppKey] = useState(() => Date.now());
  const [texture, setTexture] = useState<Texture | null>(null); // <-- Texture state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Assets.load("/img/green.jpeg").then((loaded) => {
      setTexture(loaded as Texture);
    });
  }, []);

  useEffect(() => {
    setAppKey(Date.now());
  }, []);

  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Rectangle
    const rect = Matter.Bodies.rectangle(
      SCENE_WIDTH / 2,
      100,
      RECT_WIDTH,
      RECT_HEIGHT,
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
      SCENE_WIDTH / 2,
      SCENE_HEIGHT - STAND_HEIGHT / 2,
      STAND_WIDTH,
      STAND_HEIGHT,
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

    // Mark as ready so canvas fades in
    setReady(true);

    // Cleanup
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      // REMOVE this block:
      // if (pixiAppRef.current) {
      //   pixiAppRef.current.destroy(true);
      //   pixiAppRef.current = null;
      // }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach MouseConstraint and scroll workaround
  useEffect(() => {
    let mouseConstraint: Matter.MouseConstraint | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;
    const canvas = appRef.current?.querySelector("canvas");

    function handleScroll() {
      if (!canvas) return;
      canvas.style.pointerEvents = "none";
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = "auto";
      }, 500);
    }

    function attachMouse() {
      if (!engineRef.current || !canvas) return;
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
      if (canvas) {
        canvas.removeEventListener("wheel", handleScroll);
        canvas.removeEventListener("touchmove", handleScroll);
      }
      clearTimeout(timeout);
    };
  }, []);

  // Draw stand
  const drawStand = useCallback((g: Graphics) => {
    if (!g) return;
    g.clear();
    g.fill({ color: COLORS.stand });
    g.rect(-STAND_WIDTH / 2, -STAND_HEIGHT / 2, STAND_WIDTH, STAND_HEIGHT);
    g.fill();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: COLORS.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* PixiJS Canvas */}
      <div
        ref={appRef}
        style={{
          width: "100vw",
          height: "80vh",
          background: COLORS.background,
          flex: 1,
          position: "relative",
          overflow: "auto",
        }}
      >
        <PixiApplication
          key={appKey}
          width={SCENE_WIDTH}
          height={SCENE_HEIGHT}
          background={COLORS.background}
          autoStart
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
            position: "relative",
            opacity: ready ? 1 : 0, // Hide until ready
            transition: "opacity 0.25s ease-in-out",
            background: "white",
          }}
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
              texture={texture ?? Texture.EMPTY} // Use the loaded texture, fallback to Texture.EMPTY
              width={RECT_WIDTH}
              height={RECT_HEIGHT}
              anchor={0.5}
            />
            <pixiGraphics
              draw={(g) => {
                if (!g) return;
                g.clear();
                g.setStrokeStyle({ width: 4, color: 0x000000 });
                g.rect(
                  -RECT_WIDTH / 2,
                  -RECT_HEIGHT / 2,
                  RECT_WIDTH,
                  RECT_HEIGHT
                );
              }}
            />
          </pixiContainer>

          {/* Stand */}
          <pixiContainer
            x={SCENE_WIDTH / 2}
            y={SCENE_HEIGHT - STAND_HEIGHT / 2}
          >
            <pixiGraphics draw={drawStand} />
          </pixiContainer>
        </PixiApplication>
      </div>
    </div>
  );
}
