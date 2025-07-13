"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { motion, AnimatePresence } from "framer-motion";

const WALL_THICKNESS = 2;
const BALL_COUNT = 10;
const BALL_RADIUS = 70;

const MatterDemo: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [showKiwi, setShowKiwi] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const setupMatterScene = useCallback(() => {
    if (!sceneRef.current) return () => {};

    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#edf8e9",
      },
    });

    // Side walls (just inside the visible area)
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

    // Balls
    const balls = Array.from({ length: BALL_COUNT }, (_, i) =>
      Matter.Bodies.circle(
        Math.random() * (width - 2 * BALL_RADIUS) + BALL_RADIUS,
        height / 4 - i * 60,
        BALL_RADIUS,
        { render: { fillStyle: "#8EE53F" } }
      )
    );

    // Ground
    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: { fillStyle: "#4caf50" },
    });

    // Add to world
    Matter.Composite.add(engine.world, [leftWall, rightWall, ground, ...balls]);

    // Mouse control
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

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Cleanup function
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
    };
  }, []);

  useEffect(() => {
    const cleanup = setupMatterScene();

    const kiwiTimeout = setTimeout(() => {
      setShowKiwi(true);
      setTimeout(() => setShowNav(true), 2000);
    }, 1000);

    return () => {
      cleanup();
      clearTimeout(kiwiTimeout);
    };
  }, [setupMatterScene]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />
      {/* Animated Kiwi */}
      <AnimatePresence>
        {showKiwi && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "4rem",
              fontWeight: "bold",
              color: "#8EE53F",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 10,
            }}
          >
            Kiwi
          </motion.span>
        )}
      </AnimatePresence>

      {/* Animated Navbar */}
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9,
              display: "flex",
              gap: "2rem",
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            <a href="#">Home</a>
            <a href="#">Projects</a>
            <a href="#">Contact</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatterDemo;
