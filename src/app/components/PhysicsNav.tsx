"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./physics.css";

const WALL_THICKNESS = 2;

const PhysicsNav: React.FC = () => {
  const ballsRef = useRef<Matter.Body[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [cursorStyle, setCursorStyle] = useState<string>("none");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setCursorStyle(isTouchDevice ? "default" : "none");
  }, []);

  useEffect(() => {
    if (!mounted || !sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 600;
    const BALL_RADIUS = isMobile ? 35 : 70;
    const BALL_COUNT = isMobile ? 5 : 10;
    const ballYOffset = isMobile ? 30 : 60;

    const engine = Matter.Engine.create();
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

    // Only run Math.random() on client
    const balls = Array.from({ length: BALL_COUNT }, (_, i) =>
      Matter.Bodies.circle(
        Math.random() * (width - 2 * BALL_RADIUS) + BALL_RADIUS,
        height / 4 - i * ballYOffset,
        BALL_RADIUS,
        { render: { fillStyle: "#8EE53F" } }
      )
    );
    ballsRef.current = balls;

    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: {
        fillStyle: "rgba(0,0,0,0)",
        strokeStyle: "rgba(0,0,0,0)",
        lineWidth: 0,
      },
    });

    Matter.Composite.add(engine.world, [leftWall, rightWall, ground, ...balls]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
    };
  }, [mounted]);

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100vw",
        height: "100vh",
        cursor: cursorStyle,
      }}
    />
  );
};

export default PhysicsNav;
