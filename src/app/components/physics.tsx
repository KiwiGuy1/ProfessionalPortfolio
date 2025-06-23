"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const MatterDemo: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [showKiwi, setShowKiwi] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

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

    const balls = Array.from({ length: 10 }).map((_, i) =>
      Matter.Bodies.circle(
        Math.random() * (width - 100) + 50,
        height / 4 - i * 60,
        70,
        { render: { fillStyle: "#8EE53F" } }
      )
    );

    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: { fillStyle: "#4caf50" },
    });
    Matter.Composite.add(engine.world, [...balls, ground]);

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

    // Show the word "Kiwi" with a transition after 1 second
    const timeout = setTimeout(() => setShowKiwi(true), 1000);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

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
      <div
        ref={sceneRef}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      />
      {/* Overlayed word "Kiwi" */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#8EE53F",
          opacity: showKiwi ? 1 : 0,
          transition: "opacity 2s ease",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 10, // ensure it's above the canvas
        }}
      >
        Kiwi
      </span>
    </div>
  );
};

export default MatterDemo;
