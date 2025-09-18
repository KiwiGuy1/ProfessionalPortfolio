"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useBlobHover } from "./BlobHoverContext";

const COLORS = {
  line: "#FFF",
  letter: "#141414",
  letterShadow: "none",
  background: "#EAE8FF",
};

const NAME = "Joseph Gutierrez";
const LETTER_WIDTH = 48;
const LETTER_HEIGHT = 64;
const LETTER_SPACING = 60;
const LINE_HEIGHT = 12;

function calculateLetterPositions(letters: string[]) {
  if (typeof window === "undefined") return [];
  const width = window.innerWidth;
  const totalWidth = letters.length * (LETTER_WIDTH + LETTER_SPACING);
  const startX = width / 2 - totalWidth / 2;
  const y = window.innerHeight / 3;
  return letters.map((_, i) => ({
    x: startX + i * (LETTER_WIDTH + LETTER_SPACING) + LETTER_WIDTH / 2,
    y,
  }));
}

const Physics: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const letterBodiesRef = useRef<Matter.Body[]>([]);
  const groundRef = useRef<Matter.Body | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const [currentPositions, setCurrentPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [isDragging] = useState(false);
  // Removed unused draggedIndex state
  const letters = NAME.split("");
  const { setHovered } = useBlobHover();

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    // Ground line
    const totalNameWidth = letters.length * (LETTER_WIDTH + LETTER_SPACING);
    const lineY = Math.floor(height / 2);
    const ground = Matter.Bodies.rectangle(
      width / 2,
      lineY,
      totalNameWidth,
      LINE_HEIGHT,
      {
        isStatic: true,
        render: {
          fillStyle: COLORS.line,
          strokeStyle: COLORS.line,
        },
      }
    );
    groundRef.current = ground;
    Matter.Composite.add(engine.world, ground);

    // Letter bodies
    const letterPositions = calculateLetterPositions(letters);
    letterBodiesRef.current = letters.map((_, i) => {
      const { x, y } = letterPositions[i];
      return Matter.Bodies.rectangle(x, y, LETTER_WIDTH, LETTER_HEIGHT, {
        render: {
          fillStyle: "rgba(0,0,0,0)",
          strokeStyle: "rgba(0,0,0,0)",
        },
      });
    });
    Matter.Composite.add(engine.world, letterBodiesRef.current);

    // Walls
    const wallThickness = 20;
    const leftWall = Matter.Bodies.rectangle(
      wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { visible: false } }
    );
    const rightWall = Matter.Bodies.rectangle(
      width - wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { visible: false } }
    );
    Matter.Composite.add(engine.world, [leftWall, rightWall]);

    // Mouse constraint for dragging
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.4,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;
    render.mouse = mouse;

    // Use Matter.js mousemove for hover detection
    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      if (isDragging) return; // Don't show blob while dragging
      const mousePosition = event.mouse.position;
      const foundIndex = letterBodiesRef.current.findIndex((body) =>
        Matter.Bounds.contains(body.bounds, mousePosition)
      );
      if (foundIndex !== -1) {
        const pos = letterBodiesRef.current[foundIndex].position;
        setHovered(true, letters[foundIndex], { x: pos.x, y: pos.y });
      } else {
        setHovered(false);
      }
    });

    // Runner & Render
    const runner = Matter.Runner.create();
    runner.delta = 1000 / 120; // 120 FPS for smoother animation
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Animation loop
    let animationFrame: number;
    function updatePositionsAnim() {
      setCurrentPositions(
        letterBodiesRef.current.map((body) => ({
          x: body.position.x,
          y: body.position.y,
        }))
      );
      animationFrame = requestAnimationFrame(updatePositionsAnim);
    }
    animationFrame = requestAnimationFrame(updatePositionsAnim);

    // Handle resize: update positions, not recreate world
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const totalNameWidth = letters.length * (LETTER_WIDTH + LETTER_SPACING);
      const lineY = Math.floor(height / 2);

      // Move ground
      Matter.Body.setPosition(groundRef.current!, {
        x: width / 2,
        y: lineY,
      });
      Matter.Body.setVertices(
        groundRef.current!,
        Matter.Vertices.create(
          [
            { x: -totalNameWidth / 2, y: -LINE_HEIGHT / 2 },
            { x: totalNameWidth / 2, y: -LINE_HEIGHT / 2 },
            { x: totalNameWidth / 2, y: LINE_HEIGHT / 2 },
            { x: -totalNameWidth / 2, y: LINE_HEIGHT / 2 },
          ],
          groundRef.current!
        )
      );

      // Move letters to new positions
      const newPositions = calculateLetterPositions(letters);
      letterBodiesRef.current.forEach((body, i) => {
        Matter.Body.setPosition(body, {
          x: newPositions[i].x,
          y: newPositions[i].y,
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
      cancelAnimationFrame(animationFrame);
    };
  }, [letters.length]);

  // --- RENDER HTML ---
  const totalNameWidth = letters.length * (LETTER_WIDTH + LETTER_SPACING);

  return (
    <div
      ref={sceneRef}
      className="relative min-h-screen w-full"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: COLORS.background,
        boxSizing: "border-box",
      }}
    >
      {/* White line */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% - ${totalNameWidth / 2}px)`,
          width: `${totalNameWidth}px`,
          height: `${LINE_HEIGHT}px`,
          top: `${Math.floor(window.innerHeight / 2) - LINE_HEIGHT / 2}px`,
          background: COLORS.line,
          borderRadius: "6px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Letters */}
      {letters.map((char, i) => {
        const pos = currentPositions[i];
        if (!pos) return null;
        return (
          <span
            key={i}
            className="text-7xl font-extrabold"
            style={{
              position: "absolute",
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              color: COLORS.letter,
              willChange: "transform",
              textShadow: `
              0 0 8px ${COLORS.letterShadow},
              0 0 16px ${COLORS.letterShadow},
              0 0 24px ${COLORS.letterShadow}
            `,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              zIndex: 2,
              cursor: "pointer",
              pointerEvents: "none",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      {/* No blob follower/cursor here */}
    </div>
  );
};
export default Physics;
