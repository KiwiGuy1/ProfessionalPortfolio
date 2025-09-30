"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  line: "#6C63FF", // Changed to accent purple
  letter: "#FFFFFF", // Changed to white
  letterShadow: "rgba(108, 99, 255, 0.3)", // Purple glow
  background: "#0F0F0F", // Changed to dark background
  ball: "#1A1A1A", // Dark gray for ball
  ballStroke: "#1A1A1A", // Purple stroke for ball
  button: "#1A1A1A", // Dark button background
  buttonText: "#FFFFFF", // White button text
  buttonBorder: "rgba(255, 255, 255, 0.1)", // Subtle border
};

const NAME = "Joseph Gutierrez";

// Responsive sizes for mobile (except font)
const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
const LETTER_WIDTH = isMobile ? 12 : 36;
const LETTER_HEIGHT = isMobile ? 32 : 70;
const LETTER_SPACING = isMobile
  ? Math.max((window.innerWidth - 16 * NAME.length) / (NAME.length + 1), 6)
  : 40;
const LINE_HEIGHT =
  typeof window !== "undefined"
    ? isMobile
      ? window.innerHeight / 2.5
      : window.innerHeight / 2
    : 400;
const BALL_RADIUS = isMobile ? 30 : 80;

function calculateLetterPositions(letters: string[]) {
  if (typeof window === "undefined") return [];
  const width = window.innerWidth;
  const totalWidth =
    letters.length * LETTER_WIDTH + (letters.length - 1) * LETTER_SPACING;
  const startX = Math.max(width / 2 - totalWidth / 2, 8);
  const y = Math.max(window.innerHeight / 3, 40);
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
  const letters = NAME.split("");
  const ballRef = useRef<Matter.Body | null>(null);
  const [showWave, setShowWave] = useState(false);

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
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
      },
    });

    // Giant ball with new colors
    let ball: Matter.Body | null = null;
    setTimeout(() => {
      ball = Matter.Bodies.circle(
        width / 2 - (isMobile ? 80 : 160),
        -BALL_RADIUS * 2,
        BALL_RADIUS,
        {
          restitution: 0.5,
          friction: 0.05,
          render: {
            fillStyle: COLORS.ball,
            strokeStyle: COLORS.ballStroke,
            lineWidth: 3,
          },
          label: "giant-ball",
        }
      );
      Matter.Body.setVelocity(ball, { x: 0, y: isMobile ? 18 : 25 });
      Matter.Composite.add(engine.world, ball);
      ballRef.current = ball;
    }, 1200);

    // Ground line with new color
    const totalNameWidth =
      letters.length * LETTER_WIDTH + (letters.length - 1) * LETTER_SPACING;
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height - LINE_HEIGHT / 2,
      totalNameWidth,
      LINE_HEIGHT,
      {
        isStatic: true,
        render: {
          fillStyle: COLORS.line,
          strokeStyle: COLORS.line,
        },
        label: "ground",
      }
    );

    groundRef.current = ground;
    Matter.Composite.add(engine.world, ground);

    // Letter bodies
    const letterPositions = calculateLetterPositions(letters);
    letterBodiesRef.current = letters.map((char, i) => {
      const { x, y } = letterPositions[i];
      if (char === " ") {
        return Matter.Bodies.rectangle(x, y, LETTER_WIDTH, LETTER_HEIGHT, {
          isSensor: true,
          render: {
            fillStyle: "rgba(0,0,0,0)",
            strokeStyle: "rgba(0,0,0,0)",
          },
        });
      }
      return Matter.Bodies.rectangle(x, y, LETTER_WIDTH, LETTER_HEIGHT, {
        restitution: 0.4,
        friction: 0.2,
        render: {
          fillStyle: "rgba(0,0,0,0)",
          strokeStyle: "rgba(0,0,0,0)",
        },
      });
    });
    Matter.Composite.add(engine.world, letterBodiesRef.current);

    // Walls
    const wallThickness = isMobile ? 10 : 20;
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

    // Mouse/touch constraint for dragging
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

    // Runner & Render
    const runner = Matter.Runner.create();
    runner.delta = 1000 / 120;
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

    // Handle resize
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const totalNameWidth =
        letters.length * LETTER_WIDTH + (letters.length - 1) * LETTER_SPACING;
      const groundY = height - LINE_HEIGHT / 2;
      Matter.Body.setPosition(groundRef.current!, {
        x: width / 2,
        y: groundY,
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
  }, []);

  const handleReset = () => {
    const letterPositions = calculateLetterPositions(letters);
    letterBodiesRef.current.forEach((body, i) => {
      Matter.Body.setPosition(body, {
        x: letterPositions[i].x,
        y: letterPositions[i].y,
      });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setAngle(body, 0);
    });

    // Reset the ball as well
    if (ballRef.current) {
      Matter.Body.setPosition(ballRef.current, {
        x: window.innerWidth / 2 - (isMobile ? 80 : 160),
        y: -BALL_RADIUS * 2,
      });
      Matter.Body.setVelocity(ballRef.current, { x: 0, y: isMobile ? 5 : 10 });
      Matter.Body.setAngularVelocity(ballRef.current, 0);
      Matter.Body.setAngle(ballRef.current, 0);
    }
  };

  const handleResetWithWave = () => {
    handleReset();
    setShowWave(true);
    setTimeout(() => setShowWave(false), 700);
  };

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
        touchAction: "none",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Reset Button with new styling */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: `${LINE_HEIGHT - 200}px`,
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleResetWithWave}
          style={{
            minWidth: 120,
            minHeight: 48,
            padding: "12px 32px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: COLORS.button,
            color: COLORS.buttonText,
            border: `1px solid ${COLORS.buttonBorder}`,
            borderRadius: "8px",
            cursor: "pointer",
            opacity: 0.95,
            outline: "none",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2A2A2A";
            e.currentTarget.style.borderColor = COLORS.line;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.button;
            e.currentTarget.style.borderColor = COLORS.buttonBorder;
          }}
        >
          Reset
          <AnimatePresence>
            {showWave && (
              <motion.svg
                key="ripple"
                width="100%"
                height="100%"
                viewBox="0 0 200 200"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
                initial={{ opacity: 0.5, scale: 0.7 }}
                animate={{ opacity: 0, scale: 2.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={COLORS.line}
                  strokeWidth="6"
                  strokeOpacity="0.7"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Letters with new colors and glow */}
      {letters.map((char, i) => {
        const pos = currentPositions[i];
        if (!pos) return null;
        return (
          <span
            key={i}
            className="font-extrabold"
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
              fontSize: `${LETTER_HEIGHT}px`,
              lineHeight: 1,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
};

export default Physics;
