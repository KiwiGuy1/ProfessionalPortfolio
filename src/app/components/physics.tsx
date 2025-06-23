"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const MatterDemo: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine and renderer
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "#fafafa",
      },
    });

    // Create a ball and a ground
    const ball = Matter.Bodies.circle(width / 2, height / 4, 50, {
      render: { fillStyle: "#e91e63" },
    });
    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: { fillStyle: "#4caf50" },
    });
    Matter.Composite.add(engine.world, [ball, ground]);

    // Mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      render.options.width = width;
      render.options.height = height;
      render.canvas.width = width;
      render.canvas.height = height;
      Matter.Body.setPosition(ground, { x: width / 2, y: height - 30 });
      Matter.Body.setVertices(ground, [
        { x: 0, y: height - 60 },
        { x: width, y: height - 60 },
        { x: width, y: height },
        { x: 0, y: height },
      ]);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      // @ts-ignore
      render.textures = {};
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Style: Fill the viewport completely, no scrollbars, no margins
  return (
    <div
      ref={sceneRef}
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
    />
  );
};

export default MatterDemo;
