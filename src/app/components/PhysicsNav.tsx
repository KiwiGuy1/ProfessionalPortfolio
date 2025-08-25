"use client";

import { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";
import "./physics.css";

const WALL_THICKNESS = 2;
const BALL_COUNT = 10;
const BALL_RADIUS = 70;

const PhysicsNav: React.FC = () => {
  const ballsRef = useRef<Matter.Body[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);

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

    const balls = Array.from({ length: BALL_COUNT }, (_, i) =>
      Matter.Bodies.circle(
        Math.random() * (width - 2 * BALL_RADIUS) + BALL_RADIUS,
        height / 4 - i * 60,
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
  }, []);

  useEffect(() => {
    const cleanup = setupMatterScene();
    return () => cleanup();
  }, [setupMatterScene]);

  return <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default PhysicsNav;
