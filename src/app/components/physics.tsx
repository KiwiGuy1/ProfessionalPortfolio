"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { motion, AnimatePresence } from "framer-motion";
import "./physics.css";

const WALL_THICKNESS = 2;
const BALL_COUNT = 10;
const BALL_RADIUS = 70;

const MatterDemo: React.FC = () => {
  const ballsRef = useRef<Matter.Body[]>([]);
  const flyingPageRef = useRef<Matter.Body | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const flyingPageDivRef = useRef<HTMLDivElement | null>(null); // NEW ref for flying page div

  const [showPage, setShowPage] = useState(false);
  const showPageRef = useRef(showPage);

  // Dimensions set once on mount
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Keep showPageRef updated so Matter event always has latest
  useEffect(() => {
    showPageRef.current = showPage;
  }, [showPage]);

  const setupMatterScene = useCallback(() => {
    if (!sceneRef.current) return () => {};

    const width = window.innerWidth;
    const height = window.innerHeight;

    setDimensions({ width, height });

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

    // Walls
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
    ballsRef.current = balls;

    // Ground
    const ground = Matter.Bodies.rectangle(width / 2, height - 30, width, 60, {
      isStatic: true,
      render: {
        fillStyle: "rgba(0,0,0,0)",
        strokeStyle: "rgba(0,0,0,0)",
        lineWidth: 0,
      },
    });

    // Flying Page Body
    const flyingRectWidth = width * 0.2;
    const flyingRectHeight = height;
    const startX = width + flyingRectWidth / 2;

    const flyingPageBody = Matter.Bodies.rectangle(
      startX,
      flyingRectHeight / 2,
      flyingRectWidth,
      flyingRectHeight,
      {
        isStatic: true,
        render: {
          fillStyle: "rgba(0,0,0,0.8)",
        },
      }
    );
    flyingPageRef.current = flyingPageBody;

    // Add all bodies to world
    Matter.Composite.add(engine.world, [
      leftWall,
      rightWall,
      ground,
      ...balls,
      flyingPageBody,
    ]);

    // Mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Runner
    const runner = Matter.Runner.create();

    const targetX = width - flyingRectWidth / 2;
    const speed = 25;

    Matter.Events.on(engine, "beforeUpdate", () => {
      if (!flyingPageRef.current) return;

      const currentX = flyingPageRef.current.position.x;

      if (showPageRef.current) {
        const newX = Math.max(currentX - speed, targetX);
        Matter.Body.setPosition(flyingPageRef.current, {
          x: newX,
          y: flyingPageRef.current.position.y,
        });
      } else {
        const offscreenX = width + flyingRectWidth / 2 + 100;
        if (currentX < offscreenX) {
          const newX = Math.min(currentX + speed, offscreenX);
          Matter.Body.setPosition(flyingPageRef.current, {
            x: newX,
            y: flyingPageRef.current.position.y,
          });
        }
      }
    });

    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Check if one is flyingPageBody and the other is a ball
        if (
          (bodyA === flyingPageRef.current &&
            ballsRef.current.includes(bodyB)) ||
          (bodyB === flyingPageRef.current && ballsRef.current.includes(bodyA))
        ) {
          const ball = bodyA === flyingPageRef.current ? bodyB : bodyA;

          // Calculate a force direction away from the flying page center
          const forceMagnitude = 0.02;
          const dir = Matter.Vector.sub(
            ball.position,
            flyingPageRef.current!.position
          );
          const normalizedDir = Matter.Vector.normalise(dir);

          Matter.Body.applyForce(ball, ball.position, {
            x: normalizedDir.x * forceMagnitude,
            y: normalizedDir.y * forceMagnitude,
          });
        }
      });
    });

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Events.off(engine, "beforeUpdate");
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // Push balls on nav click
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPage(true);
  };

  // Setup scene once on mount
  useEffect(() => {
    const cleanup = setupMatterScene();
    return () => cleanup();
  }, [setupMatterScene]);

  // Animation loop to sync flying page div position with physics body
  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      if (
        flyingPageDivRef.current &&
        flyingPageRef.current &&
        dimensions.width
      ) {
        const x = flyingPageRef.current.position.x;
        const width = dimensions.width * 0.2;

        flyingPageDivRef.current.style.transform = `translateX(${
          x - width / 2
        }px)`;
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

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

      {/* Nav Bar */}
      <AnimatePresence>
        <motion.div
          className="nav-bar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 1.5 }}
          style={{ translateX: "-50%" }}
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 1 }}
          >
            <p className="kiwi-text">KIWI</p>
          </motion.span>

          <motion.nav
            className="nav"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 1 }}
          >
            <a href="#" onClick={handleNavClick}>
              Home
            </a>
            <a href="#" onClick={handleNavClick}>
              Projects
            </a>
            <a href="#" onClick={handleNavClick}>
              Contact
            </a>
          </motion.nav>
        </motion.div>
      </AnimatePresence>

      {/* Flying Page synced with Matter.js body */}
      <AnimatePresence>
        {showPage && (
          <motion.div
            key="flyingPage"
            ref={flyingPageDivRef} // assign ref here
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              width: dimensions.width * 0.2,
              height: "100vh",
              backgroundColor: "transparent", // black rectangle is in Matter.js render
              pointerEvents: "auto",
              color: "white",
              padding: "2rem",
              // Remove left, position via transform instead
              zIndex: 25,
            }}
          >
            <h1>Your Page Content</h1>
            <button onClick={() => setShowPage(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatterDemo;
