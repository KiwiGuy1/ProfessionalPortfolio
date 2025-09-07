"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./physics.css";

const NAME = "Joseph Gutierrez";
const BALL_COUNT = 8;
const BALL_RADIUS = 40;
const LETTER_WIDTH = 32;
const LETTER_HEIGHT = 48;
const LETTER_SPACING = 32;

type FallenLetter = { index: number; x: number; y: number };

const PhysicsNav: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [fallenLetters, setFallenLetters] = useState<FallenLetter[]>([]);
  const [letterPositions, setLetterPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const letterBodiesRef = useRef<{ [key: number]: Matter.Body }>({});
  const engineRef = useRef<Matter.Engine | null>(null);

  const letters = NAME.split("");

  // Calculate letter positions based on viewport size
  const calculateLetterPositions = () => {
    if (typeof window === "undefined") return [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const totalWidth = letters.length * (LETTER_WIDTH + LETTER_SPACING);
    const startX = width / 2 - totalWidth / 2;
    const y = height / 3;
    return letters.map((_, i) => ({
      x: startX + i * (LETTER_WIDTH + LETTER_SPACING) + LETTER_WIDTH / 2,
      y,
    }));
  };

  // Set letter positions on mount and resize
  useEffect(() => {
    setMounted(true);
    const updatePositions = () =>
      setLetterPositions(calculateLetterPositions());
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
    // eslint-disable-next-line
  }, []);

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

    function handleMouseMove(e: MouseEvent) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      Object.entries(letterBodiesRef.current).forEach(([key, body]) => {
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

  // Handler for when a letter is hovered
  const handleLetterHover = (index: number) => {
    if (
      !fallenLetters.some((l) => l.index === index) &&
      letterPositions[index]
    ) {
      const { x, y } = letterPositions[index];
      setFallenLetters((prev) => [...prev, { index, x, y }]);
      if (engineRef.current) {
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
        Matter.Composite.add(engineRef.current.world, body);
      }
    }
  };

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
      {/* Overlay letters that haven't fallen yet */}
      {letterPositions.length > 0 &&
        letters.map((char, i) => {
          const isFallen = fallenLetters.some((l) => l.index === i);
          const { x, y } = letterPositions[i];
          return (
            <span
              key={i}
              className="text-8xl font-extrabold text-gray-400 mx-1 cursor-pointer"
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                opacity: isFallen ? 0 : 1,
                pointerEvents: isFallen ? "none" : "auto",
                transition: "none",
                userSelect: "none",
                zIndex: 20,
              }}
              onMouseEnter={() => handleLetterHover(i)}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      {/* Render fallen letters as absolutely positioned HTML */}
      {fallenLetters.map(({ index, x, y }) => (
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
      ))}
    </div>
  );
};

export default PhysicsNav;
