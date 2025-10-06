"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const COLORS = {
  line: "#6C63FF",
  letter: "#FFFFFF",
  letterShadow: "rgba(108, 99, 255, 0.3)",
  background: "#0F0F0F",
  ball: "#1A1A1A",
  ballStroke: "#6C63FF",
  button: "#1A1A1A",
  buttonText: "#FFFFFF",
  buttonBorder: "rgba(255, 255, 255, 0.1)",
  particle: "#6C63FF",
  star: "#FFD700",
  comet: "#FF6B6B",
  aurora: ["#6C63FF", "#8B5FBF", "#A855F7", "#C084FC"],
  rain: [
    "#6C63FF", // Primary purple
    "#8B5FBF", // Medium purple
    "#A855F7", // Light purple
    "#C084FC", // Lavender
    "#7C3AED", // Violet
    "#5B21B6", // Deep purple
    "#4C1D95", // Dark purple
    "#3730A3", // Indigo
  ],
};

const NAME = "Joseph Gutierrez";

const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
const LETTER_WIDTH = isMobile ? 12 : 36;
const LETTER_HEIGHT = isMobile ? 32 : 70;
const LETTER_SPACING = isMobile
  ? Math.max((window.innerWidth - 16 * NAME.length) / (NAME.length + 1), 6)
  : 40;
const LINE_HEIGHT =
  typeof window !== "undefined"
    ? isMobile
      ? window.innerHeight / 3.5 // Changed from 2.5 to 3.5 for mobile
      : window.innerHeight / 3 // Changed from 2 to 3 for desktop
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

// Particle system for magical effects
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "star" | "trail" | "aurora" | "sparkle";

  constructor(
    x: number,
    y: number,
    type: "star" | "trail" | "aurora" | "sparkle" = "star"
  ) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.maxLife = Math.random() * 100 + 50;
    this.life = this.maxLife;
    this.size = Math.random() * 3 + 2;
    this.type = type;

    switch (type) {
      case "star":
        this.color = COLORS.star;
        break;
      case "trail":
        this.color = COLORS.particle;
        break;
      case "aurora":
        this.color =
          COLORS.aurora[Math.floor(Math.random() * COLORS.aurora.length)];
        break;
      case "sparkle":
        this.color = "#FFFFFF";
        break;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    if (this.type === "aurora") {
      this.vy += 0.02;
      this.vx = Math.sin(this.life * 0.05) * 0.5;
    }

    if (this.type === "star") {
      this.vy += 0.1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife);
    const renderSize = Math.max(0.5, this.size * alpha);

    ctx.save();
    ctx.globalAlpha = alpha;

    if (this.type === "star") {
      this.drawStar(ctx, renderSize);
    } else if (this.type === "sparkle") {
      this.drawSparkle(ctx, renderSize);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, renderSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fill();
    }

    ctx.restore();
  }

  drawStar(ctx: CanvasRenderingContext2D, renderSize: number) {
    const spikes = 5;
    const outerRadius = Math.max(1, renderSize * 2);
    const innerRadius = Math.max(0.5, outerRadius * 0.4);

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = this.x + Math.cos(angle) * radius;
      const y = this.y + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawSparkle(ctx: CanvasRenderingContext2D, renderSize: number) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    const size = Math.max(2, renderSize * 3);
    ctx.beginPath();
    ctx.moveTo(this.x - size, this.y);
    ctx.lineTo(this.x + size, this.y);
    ctx.moveTo(this.x, this.y - size);
    ctx.lineTo(this.x, this.y + size);
    ctx.stroke();
  }

  isDead() {
    return this.life <= 0;
  }
}

// Enhanced floating shape class
class FloatingShape {
  body: Matter.Body;
  originalY: number;
  floatOffset: number;
  floatSpeed: number;
  driftSpeed: number;
  targetY: number;

  constructor(body: Matter.Body) {
    this.body = body;
    this.originalY = body.position.y;
    this.floatOffset = Math.random() * Math.PI * 2;
    this.floatSpeed = 0.01 + Math.random() * 0.02;
    this.driftSpeed = 0.5 + Math.random() * 1;
    this.targetY = this.originalY;
  }

  update() {
    const upwardForce = {
      x: 0,
      y: -0.0008 * this.body.mass,
    };
    Matter.Body.applyForce(this.body, this.body.position, upwardForce);

    const time = Date.now() * this.floatSpeed;
    const floatForce = {
      x: Math.sin(time * 0.5 + this.floatOffset) * 0.0001,
      y: Math.cos(time + this.floatOffset) * 0.0001,
    };
    Matter.Body.applyForce(this.body, this.body.position, floatForce);

    if (Math.random() < 0.002) {
      const height = window.innerHeight;
      this.targetY = Math.random() * (height * 0.7) + 50;
    }

    const currentY = this.body.position.y;
    const diff = this.targetY - currentY;
    const targetForce = {
      x: 0,
      y: diff * 0.000001,
    };
    Matter.Body.applyForce(this.body, this.body.position, targetForce);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 80;

    if (this.body.position.x < margin) {
      Matter.Body.applyForce(this.body, this.body.position, {
        x: 0.0008,
        y: 0,
      });
    }
    if (this.body.position.x > width - margin) {
      Matter.Body.applyForce(this.body, this.body.position, {
        x: -0.0008,
        y: 0,
      });
    }
    if (this.body.position.y < margin) {
      Matter.Body.applyForce(this.body, this.body.position, {
        x: 0,
        y: 0.0008,
      });
    }
    if (this.body.position.y > height - 250) {
      Matter.Body.applyForce(this.body, this.body.position, {
        x: 0,
        y: -0.0012,
      });
    }

    if (this.body.position.y > height - 50) {
      Matter.Body.setPosition(this.body, {
        x: Math.random() * width,
        y: 50,
      });
      this.targetY = Math.random() * (height * 0.4) + 100;
    }
    if (this.body.position.y < 20) {
      Matter.Body.setPosition(this.body, {
        x: Math.random() * width,
        y: height - 100,
      });
      this.targetY = Math.random() * (height * 0.4) + height * 0.4;
    }
  }
}

const Physics: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const floatingShapesRef = useRef<FloatingShape[]>([]);
  const floatingBodiesRef = useRef<Matter.Body[]>([]);
  const rainingShapesRef = useRef<Matter.Body[]>([]);

  // GSAP refs for button animations
  const buttonRef = useRef<HTMLButtonElement>(null);
  const atomRef = useRef<HTMLDivElement>(null);
  const electronRefs = useRef<HTMLDivElement[]>([]);

  // Create raining shapes that fall from the sky
  const createRainingShape = (engine: Matter.Engine) => {
    const width = window.innerWidth;
    const x = Math.random() * width;
    const y = -50;
    const size = Math.random() * 12 + 6;

    let body;
    const shapeType = Math.random();
    const rainColor =
      COLORS.rain[Math.floor(Math.random() * COLORS.rain.length)];

    if (shapeType < 0.3) {
      body = Matter.Bodies.circle(x, y, size, {
        restitution: 0.8,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.002,
        render: {
          fillStyle: rainColor,
          strokeStyle: "rgba(255, 255, 255, 0.3)",
          lineWidth: 1,
        },
        label: "rain-shape",
      });
    } else if (shapeType < 0.6) {
      body = Matter.Bodies.polygon(x, y, 3, size, {
        restitution: 0.8,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.002,
        render: {
          fillStyle: rainColor,
          strokeStyle: "rgba(255, 255, 255, 0.3)",
          lineWidth: 1,
        },
        label: "rain-shape",
      });
    } else {
      body = Matter.Bodies.rectangle(x, y, size * 1.5, size, {
        restitution: 0.8,
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.002,
        render: {
          fillStyle: rainColor,
          strokeStyle: "rgba(255, 255, 255, 0.3)",
          lineWidth: 1,
        },
        label: "rain-shape",
      });
    }

    Matter.Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 2 + 4,
    });

    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

    Matter.Composite.add(engine.world, body);
    rainingShapesRef.current.push(body);

    setTimeout(() => {
      const index = rainingShapesRef.current.indexOf(body);
      if (index > -1) {
        rainingShapesRef.current.splice(index, 1);
        Matter.Composite.remove(engine.world, body);
      }
    }, 8000);
  };

  // Create floating decorative elements with physics interactions
  const createFloatingElements = (engine: Matter.Engine) => {
    const elements: Matter.Body[] = [];
    const shapes: FloatingShape[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < (isMobile ? 6 : 12); i++) {
      const x = Math.random() * (width - 100) + 50;
      const y = Math.random() * (height * 0.7) + 50;
      const size = Math.random() * 15 + 8;

      let body;
      if (Math.random() > 0.5) {
        body = Matter.Bodies.circle(x, y, size, {
          restitution: 0.9,
          friction: 0.05,
          frictionAir: 0.02,
          density: 0.0008,
          render: {
            fillStyle: `rgba(108, 99, 255, ${Math.random() * 0.25 + 0.1})`,
            strokeStyle: COLORS.particle,
            lineWidth: 1.5,
          },
          label: "floating-shape",
        });
      } else {
        const sides = Math.floor(Math.random() * 4) + 3;
        body = Matter.Bodies.polygon(x, y, sides, size, {
          restitution: 0.9,
          friction: 0.05,
          frictionAir: 0.02,
          density: 0.0008,
          render: {
            fillStyle: `rgba(168, 85, 247, ${Math.random() * 0.25 + 0.1})`,
            strokeStyle:
              COLORS.aurora[Math.floor(Math.random() * COLORS.aurora.length)],
            lineWidth: 1.5,
          },
          label: "floating-shape",
        });
      }

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1,
        y: (Math.random() - 0.5) * 1,
      });

      elements.push(body);
      shapes.push(new FloatingShape(body));
    }

    Matter.Composite.add(engine.world, elements);
    floatingShapesRef.current = shapes;
    floatingBodiesRef.current = elements;

    const animateFloatingShapes = () => {
      shapes.forEach((shape) => shape.update());
      requestAnimationFrame(animateFloatingShapes);
    };

    requestAnimationFrame(animateFloatingShapes);

    return () => {
      shapes.length = 0;
    };
  };

  // Start rain system
  const startRainSystem = (engine: Matter.Engine) => {
    const rainInterval = setInterval(
      () => {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            if (engineRef.current) {
              createRainingShape(engine);
            }
          }, i * 200);
        }
      },
      isMobile ? 2000 : 1500
    );

    return () => clearInterval(rainInterval);
  };

  // Particle animation loop
  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      try {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      } catch (error) {
        console.warn("Particle rendering error:", error);
        return false;
      }
    });

    if (Math.random() > 0.88) {
      const types: ("star" | "trail" | "aurora" | "sparkle")[] = [
        "star",
        "trail",
        "aurora",
        "sparkle",
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      try {
        particlesRef.current.push(
          new Particle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight * 0.3,
            type
          )
        );
      } catch (error) {
        console.warn("Particle creation error:", error);
      }
    }

    if (ballRef.current) {
      const ballVelocity =
        Math.abs(ballRef.current.velocity.x) +
        Math.abs(ballRef.current.velocity.y);
      if (ballVelocity > 3) {
        for (let i = 0; i < 3; i++) {
          try {
            particlesRef.current.push(
              new Particle(
                ballRef.current.position.x + (Math.random() - 0.5) * 50,
                ballRef.current.position.y + (Math.random() - 0.5) * 50,
                "sparkle"
              )
            );
          } catch (error) {
            console.warn("Collision particle creation error:", error);
          }
        }
      }
    }

    if (particlesRef.current.length > 150) {
      particlesRef.current = particlesRef.current.slice(-100);
    }

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  // GSAP Button Animations
  useEffect(() => {
    if (buttonRef.current && atomRef.current) {
      // Continuous atom bounce animation
      gsap.to(atomRef.current, {
        y: -3,
        duration: 1.2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Electron orbital animations
      electronRefs.current.forEach((electron, index) => {
        if (electron) {
          gsap.to(electron, {
            rotation: 360,
            duration: 2 + index * 0.5, // Different speeds for each electron
            ease: "none",
            repeat: -1,
          });
        }
      });

      // Button hover animations
      const button = buttonRef.current;

      const handleMouseEnter = () => {
        gsap.to(button, {
          y: -4,
          scale: 1.02,
          duration: 0.3,
          ease: "back.out(1.7)",
        });

        gsap.to(atomRef.current, {
          scale: 1.15,
          duration: 0.3,
          ease: "back.out(1.7)",
        });

        // Speed up electrons on hover
        electronRefs.current.forEach((electron, index) => {
          if (electron) {
            gsap.to(electron, {
              rotation: "+=360",
              duration: 0.8,
              ease: "power2.out",
            });
          }
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });

        gsap.to(atomRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      };

      const handleMouseDown = () => {
        gsap.to(button, {
          scale: 0.98,
          duration: 0.1,
          ease: "power2.out",
        });

        // Atom explosion effect
        gsap.to(atomRef.current, {
          scale: 1.3,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      button.addEventListener("mousedown", handleMouseDown);

      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        button.removeEventListener("mousedown", handleMouseDown);
      };
    }
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    sceneRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
        showVelocity: false,
        showAngleIndicator: false,
      },
    });

    let ball: Matter.Body | null = null;
    const ballTimeout = setTimeout(() => {
      ball = Matter.Bodies.circle(
        width / 2 - (isMobile ? 80 : 160),
        -BALL_RADIUS * 2,
        BALL_RADIUS,
        {
          restitution: 0.7,
          friction: 0.05,
          render: {
            fillStyle: COLORS.ball,
            strokeStyle: COLORS.ballStroke,
            lineWidth: 4,
          },
          label: "giant-ball",
        }
      );
      Matter.Body.setVelocity(ball, { x: 0, y: isMobile ? 18 : 25 });
      Matter.Composite.add(engine.world, ball);
      ballRef.current = ball;

      for (let i = 0; i < 20; i++) {
        try {
          particlesRef.current.push(
            new Particle(
              ball.position.x + (Math.random() - 0.5) * 100,
              ball.position.y + (Math.random() - 0.5) * 100,
              "aurora"
            )
          );
        } catch (error) {
          console.warn("Ball appearance particle creation error:", error);
        }
      }
    }, 1200);

    const totalNameWidth =
      letters.length * LETTER_WIDTH + (letters.length - 1) * LETTER_SPACING;
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height - LINE_HEIGHT / 2,
      totalNameWidth + 100,
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

    const cleanupFloating = createFloatingElements(engine);
    const cleanupRain = startRainSystem(engine);

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
        restitution: 0.6,
        friction: 0.3,
        frictionAir: 0.01,
        render: {
          fillStyle: "rgba(0,0,0,0)",
          strokeStyle: "rgba(0,0,0,0)",
        },
        label: "letter",
      });
    });
    Matter.Composite.add(engine.world, letterBodiesRef.current);

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
    const ceiling = Matter.Bodies.rectangle(width / 2, -50, width, 100, {
      isStatic: true,
      render: { visible: false },
    });
    Matter.Composite.add(engine.world, [leftWall, rightWall, ceiling]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.8,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;
    render.mouse = mouse;

    let lastMousePos = { x: 0, y: 0 };
    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      const mousePos = event.mouse.position;
      const distance = Math.sqrt(
        Math.pow(mousePos.x - lastMousePos.x, 2) +
          Math.pow(mousePos.y - lastMousePos.y, 2)
      );

      if (distance > 25) {
        try {
          particlesRef.current.push(
            new Particle(mousePos.x, mousePos.y, "trail")
          );
          lastMousePos = { ...mousePos };
        } catch (error) {
          console.warn("Mouse trail particle creation error:", error);
        }
      }
    });

    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const contact = pair.collision.supports[0];

        if (bodyA.label === "giant-ball" || bodyB.label === "giant-ball") {
          for (let i = 0; i < 6; i++) {
            try {
              particlesRef.current.push(
                new Particle(
                  contact.x + (Math.random() - 0.5) * 30,
                  contact.y + (Math.random() - 0.5) * 30,
                  "sparkle"
                )
              );
            } catch (error) {
              console.warn("Impact particle creation error:", error);
            }
          }
        }

        const isFloatingCollision =
          floatingBodiesRef.current.includes(bodyA) ||
          floatingBodiesRef.current.includes(bodyB);

        const isRainCollision =
          bodyA.label === "rain-shape" || bodyB.label === "rain-shape";

        if (isFloatingCollision && Math.random() > 0.8) {
          try {
            particlesRef.current.push(
              new Particle(
                contact.x + (Math.random() - 0.5) * 15,
                contact.y + (Math.random() - 0.5) * 15,
                "aurora"
              )
            );
          } catch (error) {
            console.warn("Floating collision particle creation error:", error);
          }
        }

        if (isRainCollision && Math.random() > 0.7) {
          try {
            for (let i = 0; i < 4; i++) {
              particlesRef.current.push(
                new Particle(
                  contact.x + (Math.random() - 0.5) * 20,
                  contact.y + (Math.random() - 0.5) * 20,
                  "sparkle"
                )
              );
            }
          } catch (error) {
            console.warn("Rain collision particle creation error:", error);
          }
        }

        const isLetterCollision =
          bodyA.label === "letter" || bodyB.label === "letter";

        if (isLetterCollision && (isRainCollision || isFloatingCollision)) {
          try {
            for (let i = 0; i < 3; i++) {
              particlesRef.current.push(
                new Particle(
                  contact.x + (Math.random() - 0.5) * 25,
                  contact.y + (Math.random() - 0.5) * 25,
                  "aurora"
                )
              );
            }
          } catch (error) {
            console.warn("Letter collision particle creation error:", error);
          }
        }
      });
    });

    const cleanupRainShapes = setInterval(() => {
      rainingShapesRef.current = rainingShapesRef.current.filter((body) => {
        if (body.position.y > height + 200) {
          Matter.Composite.remove(engine.world, body);
          return false;
        }
        return true;
      });
    }, 2000);

    engine.world.gravity.y = 0.8;
    engine.world.gravity.scale = 0.001;

    const runner = Matter.Runner.create();
    runner.delta = 1000 / 120;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    animateParticles();

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

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }

      const groundY = height - LINE_HEIGHT / 2;
      if (groundRef.current) {
        Matter.Body.setPosition(groundRef.current, {
          x: width / 2,
          y: groundY,
        });
      }

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
      clearTimeout(ballTimeout);
      clearInterval(cleanupRainShapes);
      cleanupFloating();
      cleanupRain();
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      if (canvasRef.current) canvasRef.current.remove();
      render.textures = {};
      cancelAnimationFrame(animationFrame);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
      floatingShapesRef.current = [];
      floatingBodiesRef.current = [];
      rainingShapesRef.current = [];
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

    if (ballRef.current) {
      const ballPos = ballRef.current.position;

      for (let i = 0; i < 25; i++) {
        try {
          const angle = (i / 25) * Math.PI * 2;
          const particle = new Particle(
            ballPos.x + Math.cos(angle) * 20,
            ballPos.y + Math.sin(angle) * 20,
            "aurora"
          );
          particle.vx = Math.cos(angle) * 2.5;
          particle.vy = Math.sin(angle) * 2.5;
          particlesRef.current.push(particle);
        } catch (error) {
          console.warn("Reset explosion particle creation error:", error);
        }
      }

      Matter.Body.setPosition(ballRef.current, {
        x: window.innerWidth / 2 - (isMobile ? 80 : 160),
        y: -BALL_RADIUS * 2,
      });
      Matter.Body.setVelocity(ballRef.current, { x: 0, y: isMobile ? 5 : 10 });
      Matter.Body.setAngularVelocity(ballRef.current, 0);
      Matter.Body.setAngle(ballRef.current, 0);
    }

    floatingShapesRef.current.forEach((shape) => {
      shape.targetY = Math.random() * (window.innerHeight * 0.6) + 50;
    });

    floatingBodiesRef.current.forEach((body) => {
      const force = {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
      };
      Matter.Body.applyForce(body, body.position, force);
    });

    if (engineRef.current) {
      rainingShapesRef.current.forEach((body) => {
        Matter.Composite.remove(engineRef.current!.world, body);
      });
      rainingShapesRef.current = [];
    }
  };

  const handleResetWithWave = () => {
    handleReset();
    setShowWave(true);
    setTimeout(() => setShowWave(false), 700);

    // GSAP button click animation
    if (buttonRef.current && atomRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });

      // Atom explosion effect
      gsap.to(atomRef.current, {
        scale: 1.4,
        rotation: 180,
        duration: 0.4,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  return (
    <div
      ref={sceneRef}
      className="relative min-h-screen w-full"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(circle at 20% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
          ${COLORS.background}
        `,
        boxSizing: "border-box",
        touchAction: "none",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Cute Atom Button */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: `${LINE_HEIGHT - 200}px`,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "translateX(-50%)",
        }}
      >
        <button
          ref={buttonRef}
          onClick={handleResetWithWave}
          style={{
            minWidth: 200,
            minHeight: 64,
            padding: "18px 32px",
            fontSize: "0.95rem",
            fontWeight: "500",
            background: `
              linear-gradient(145deg, 
                rgba(23, 23, 28, 0.95) 0%, 
                rgba(31, 31, 40, 0.95) 100%
              )
            `,
            color: "#FFFFFF",
            border: `1px solid rgba(108, 99, 255, 0.25)`,
            borderRadius: "16px",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            overflow: "visible",
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 2px 8px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Animated Atom Icon */}
          <div
            ref={atomRef}
            style={{
              position: "relative",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Nucleus */}
            <div
              style={{
                width: "8px",
                height: "8px",
                background: `
                  radial-gradient(circle, 
                    rgba(108, 99, 255, 1) 0%, 
                    rgba(168, 85, 247, 0.8) 100%
                  )
                `,
                borderRadius: "50%",
                boxShadow: "0 0 12px rgba(108, 99, 255, 0.6)",
                zIndex: 3,
              }}
            />

            {/* Electron Orbits */}
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) electronRefs.current[index] = el;
                }}
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  border: "1px solid rgba(108, 99, 255, 0.3)",
                  borderRadius: "50%",
                  transform: `rotate(${index * 60}deg)`,
                  transformOrigin: "center",
                }}
              >
                {/* Electron */}
                <div
                  style={{
                    position: "absolute",
                    top: "-2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    background: `rgba(${
                      index === 0
                        ? "108, 99, 255"
                        : index === 1
                        ? "168, 85, 247"
                        : "196, 132, 252"
                    }, 0.9)`,
                    borderRadius: "50%",
                    boxShadow: `0 0 8px rgba(${
                      index === 0
                        ? "108, 99, 255"
                        : index === 1
                        ? "168, 85, 247"
                        : "196, 132, 252"
                    }, 0.6)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Text */}
          <span
            style={{
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.01em",
              color: "#FFFFFF",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            Reset Physics
          </span>

          {/* Ripple effect container */}
          <AnimatePresence>
            {showWave && (
              <motion.div
                key="ripple-container"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: "absolute",
                      width: "64px",
                      height: "64px",
                      border: `2px solid rgba(108, 99, 255, 0.4)`,
                      borderRadius: "50%",
                      left: "-32px",
                      top: "-32px",
                    }}
                    initial={{ opacity: 0.8, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 3.5 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      ease: "easeOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Enhanced Letters with magical glow */}
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
                0 0 10px ${COLORS.letterShadow},
                0 0 20px ${COLORS.letterShadow},
                0 0 30px ${COLORS.letterShadow},
                0 0 40px rgba(108, 99, 255, 0.1)
              `,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              zIndex: 2,
              cursor: "pointer",
              pointerEvents: "none",
              fontSize: `${LETTER_HEIGHT}px`,
              lineHeight: 1,
              filter: "drop-shadow(0 0 8px rgba(108, 99, 255, 0.4))",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}

      {/* Ambient glow overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.05) 0%, transparent 70%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default Physics;
