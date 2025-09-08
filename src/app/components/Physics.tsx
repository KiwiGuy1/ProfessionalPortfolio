"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./physics.css";

// --- Constants ---
const NAME = "Joseph Gutierrez";
const BALL_COUNT = 8;
const BALL_RADIUS = 40;
const LETTER_WIDTH = 32;
const LETTER_HEIGHT = 48;
const LETTER_SPACING = 32;

// --- Types ---
type FallenLetter = { index: number; x: number; y: number };

// --- Helpers ---
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

// --- Subcomponents ---
function LettersOverlay({
  letters,
  letterPositions,
  fallenLetters,
  returningLetters,
  onHover,
}: {
  letters: string[];
  letterPositions: { x: number; y: number }[];
  fallenLetters: FallenLetter[];
  returningLetters: number[];
  onHover: (index: number) => void;
}) {
  return (
    <>
      {letterPositions.length > 0 &&
        letters.map((char, i) => {
          const isFallen = fallenLetters.some((l) => l.index === i);
          const isReturning = returningLetters.includes(i);
          const { x, y } = letterPositions[i];
          return (
            <span
              key={i}
              className={`text-8xl font-extrabold mx-1 cursor-pointer ${
                isReturning ? "text-blue-500" : "text-gray-400"
              }`}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: isReturning
                  ? "translate(-50%, -50%) scale(1.2)"
                  : "translate(-50%, -50%) scale(1)",
                opacity: isFallen && !isReturning ? 0 : 1,
                pointerEvents: isFallen && !isReturning ? "none" : "auto",
                transition: isReturning
                  ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s"
                  : "none",
                userSelect: "none",
                zIndex: 20,
              }}
              onMouseEnter={() => onHover(i)}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
    </>
  );
}

function FallenLetters({
  fallenLetters,
  returningLetters,
  letters,
}: {
  fallenLetters: FallenLetter[];
  returningLetters: number[];
  letters: string[];
}) {
  return (
    <>
      {fallenLetters.map(
        ({ index, x, y }) =>
          !returningLetters.includes(index) && (
            <span
              key={index}
              id={`falling-letter-${index}`}
              className="text-8xl font-extrabold text-gray-900 mx-1 pointer-events-none"
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 30,
                transition: "none",
                userSelect: "none",
              }}
            >
              {letters[index] === " " ? "\u00A0" : letters[index]}
            </span>
          )
      )}
    </>
  );
}

// --- Main Component ---
const PhysicsNav: React.FC = () => {
  // --- State ---
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [fallenLetters, setFallenLetters] = useState<FallenLetter[]>([]);
  const [letterPositions, setLetterPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [returningLetters, setReturningLetters] = useState<number[]>([]);
  const letterBodiesRef = useRef<{ [key: number]: Matter.Body }>({});
  // Store static bodies separately
  const staticLetterBodiesRef = useRef<{ [key: number]: Matter.Body }>({});
  const engineRef = useRef<Matter.Engine | null>(null);
  const letters = NAME.split("");

  // --- Effects ---
  // Set letter positions on mount and resize
  useEffect(() => {
    setMounted(true);
    function updatePositions() {
      setLetterPositions(calculateLetterPositions(letters));
    }
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  // Physics setup
  useEffect(() => {
    if (!mounted || !sceneRef.current || letterPositions.length === 0) return;

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

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Walls and ground
    const WALL_THICKNESS = 2;
    const leftWall = Matter.Bodies.rectangle(
      WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      { isStatic: true, render: { visible: false } }
    );
    const rightWall = Matter.Bodies.rectangle(
      width - WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      { isStatic: true, render: { visible: false } }
    );
    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: { fillStyle: "rgba(0,0,0,0)" },
    });

    Matter.Composite.add(engine.world, [leftWall, rightWall, ground]);

    // Balls
    const balls = Array.from({ length: BALL_COUNT }, (_, i) =>
      Matter.Bodies.circle(
        Math.random() * (width - 2 * BALL_RADIUS) + BALL_RADIUS,
        height / 4 - i * 60,
        BALL_RADIUS,
        { render: { fillStyle: "#8EE53F" } }
      )
    );
    Matter.Composite.add(engine.world, balls);

    // --- Add static letter bodies ---
    staticLetterBodiesRef.current = {};
    letters.forEach((char, i) => {
      const { x, y } = letterPositions[i];
      const body = Matter.Bodies.rectangle(x, y, LETTER_WIDTH, LETTER_HEIGHT, {
        isStatic: true,
        label: `letter-${i}`,
        render: {
          fillStyle: "rgba(0,0,0,0)",
          strokeStyle: "rgba(0,0,0,0)",
        },
      });
      staticLetterBodiesRef.current[i] = body;
    });
    Matter.Composite.add(
      engine.world,
      Object.values(staticLetterBodiesRef.current)
    );

    function handleMouseMove(e: MouseEvent) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      Object.entries(letterBodiesRef.current).forEach(([, body]) => {
        if (
          mouseX > body.position.x - LETTER_WIDTH / 2 &&
          mouseX < body.position.x + LETTER_WIDTH / 2 &&
          mouseY > body.position.y - LETTER_HEIGHT / 2 &&
          mouseY < body.position.y + LETTER_HEIGHT / 2
        ) {
          const forceMagnitude = 0.08;
          const angle = Math.atan2(
            body.position.y - mouseY,
            body.position.x - mouseX
          );
          Matter.Body.applyForce(body, body.position, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude,
          });
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 2);
        }
      });
    }
    window.addEventListener("mousemove", handleMouseMove);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Animate HTML letters to follow their bodies
    let animationFrame: number;
    function updateLetterPositionsAnim() {
      Object.entries(letterBodiesRef.current).forEach(([key, body]) => {
        const el = document.getElementById(`falling-letter-${key}`);
        if (el) {
          el.style.left = `${body.position.x}px`;
          el.style.top = `${body.position.y}px`;
        }
      });
      animationFrame = requestAnimationFrame(updateLetterPositionsAnim);
    }
    updateLetterPositionsAnim();

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, letterPositions.length]);

  // Spawn and remove physics bodies for fallen/returning letters
  useEffect(() => {
    if (!engineRef.current) return;

    // --- Handle fallen letters ---
    fallenLetters.forEach(({ index, x, y }) => {
      // Remove static body if present
      if (staticLetterBodiesRef.current[index]) {
        Matter.Composite.remove(
          engineRef.current!.world,
          staticLetterBodiesRef.current[index]
        );
        delete staticLetterBodiesRef.current[index];
      }
      // Add dynamic body if not present
      if (
        !returningLetters.includes(index) &&
        !letterBodiesRef.current[index]
      ) {
        const body = Matter.Bodies.rectangle(
          x,
          y,
          LETTER_WIDTH,
          LETTER_HEIGHT,
          {
            restitution: 0.5,
            render: {
              fillStyle: "rgba(0,0,0,0)",
              strokeStyle: "rgba(0,0,0,0)",
            },
          }
        );
        letterBodiesRef.current[index] = body;
        Matter.Composite.add(engineRef.current!.world, body);
      }
    });

    // --- Handle returning letters ---
    returningLetters.forEach((index) => {
      // Remove dynamic body if present
      if (letterBodiesRef.current[index]) {
        Matter.Composite.remove(
          engineRef.current!.world,
          letterBodiesRef.current[index]
        );
        delete letterBodiesRef.current[index];
      }
      // Add back static body
      if (letterPositions[index]) {
        const { x, y } = letterPositions[index];
        const staticBody = Matter.Bodies.rectangle(
          x,
          y,
          LETTER_WIDTH,
          LETTER_HEIGHT,
          {
            isStatic: true,
            label: `letter-${index}`,
            render: {
              fillStyle: "rgba(0,0,0,0)",
              strokeStyle: "rgba(0,0,0,0)",
            },
          }
        );
        staticLetterBodiesRef.current[index] = staticBody;
        Matter.Composite.add(engineRef.current!.world, staticBody);
      }
    });
  }, [fallenLetters, returningLetters, letterPositions]);

  // Wheel/touch scroll logic for returning/flying/falling letters
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;

    function handleWheel() {
      if (fallenLetters.length > 0) {
        fallenLetters.forEach(({ index }) => {
          if (letterBodiesRef.current[index]) {
            Matter.Composite.remove(
              engineRef.current!.world,
              letterBodiesRef.current[index]
            );
            delete letterBodiesRef.current[index];
          }
        });
        setReturningLetters(fallenLetters.map((l) => l.index));

        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          setFallenLetters([]);
          setReturningLetters([]);
        }, 700);
      }
    }

    const container = sceneRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchmove", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchmove", handleWheel);
      }
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [fallenLetters]);

  // --- Handlers ---
  const handleLetterHover = (index: number) => {
    if (
      !fallenLetters.some((l) => l.index === index) &&
      letterPositions[index] &&
      !returningLetters.includes(index)
    ) {
      const { x, y } = letterPositions[index];
      setFallenLetters((prev) => [...prev, { index, x, y }]);
    }
  };

  // --- Render ---
  return (
    <div
      ref={sceneRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LettersOverlay
        letters={letters}
        letterPositions={letterPositions}
        fallenLetters={fallenLetters}
        returningLetters={returningLetters}
        onHover={handleLetterHover}
      />
      <FallenLetters
        fallenLetters={fallenLetters}
        returningLetters={returningLetters}
        letters={letters}
      />
    </div>
  );
};

export default PhysicsNav;
