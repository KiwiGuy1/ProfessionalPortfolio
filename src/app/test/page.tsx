// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import Matter from "matter-js";
// import { Application, extend } from "@pixi/react";
// import { Graphics, Container } from "pixi.js";

// extend({ Graphics, Container });

// const SCENE_WIDTH = typeof window !== "undefined" ? window.innerWidth : 1200;
// const SCENE_HEIGHT = typeof window !== "undefined" ? window.innerHeight : 800;
// const STAND_WIDTH = 1200;
// const STAND_HEIGHT = 500;
// const RECT_WIDTH = 200;
// const RECT_HEIGHT = 200;

// const COLORS = {
//   stand: "#fff",
//   background: "#EAE8FF",
//   rect: 0xffcc00,
// };

// export default function Physics() {
//   const [rectPos, setRectPos] = useState<{
//     x: number;
//     y: number;
//     angle: number;
//   }>({
//     x: SCENE_WIDTH / 2,
//     y: 100,
//     angle: 0,
//   });

//   const engineRef = useRef<Matter.Engine | null>(null);
//   const animationFrameRef = useRef<number | null>(null);
//   const appRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const engine = Matter.Engine.create();
//     engineRef.current = engine;

//     // Rectangle
//     const rect = Matter.Bodies.rectangle(
//       SCENE_WIDTH / 2,
//       100,
//       RECT_WIDTH,
//       RECT_HEIGHT,
//       {
//         restitution: 0.7,
//         friction: 0.05,
//         label: "rect",
//         collisionFilter: { category: 0x0001 },
//       }
//     );
//     Matter.World.add(engine.world, rect);
//     Matter.Body.setAngularVelocity(rect, 0.5);

//     // Stand (ground)
//     const stand = Matter.Bodies.rectangle(
//       SCENE_WIDTH / 2,
//       SCENE_HEIGHT - STAND_HEIGHT / 2,
//       STAND_WIDTH,
//       STAND_HEIGHT,
//       { isStatic: true, label: "stand" }
//     );
//     Matter.World.add(engine.world, stand);

//     // Runner
//     const runner = Matter.Runner.create();
//     Matter.Runner.run(runner, engine);

//     function update() {
//       Matter.Engine.update(engine, 1000 / 60);
//       setRectPos({
//         x: rect.position.x,
//         y: rect.position.y,
//         angle: rect.angle,
//       });
//       animationFrameRef.current = requestAnimationFrame(update);
//     }
//     update();

//     return () => {
//       if (animationFrameRef.current)
//         cancelAnimationFrame(animationFrameRef.current);
//       Matter.Runner.stop(runner);
//       Matter.Engine.clear(engine);
//     };
//   }, []);

//   // Attach mouse constraint after canvas is rendered
//   useEffect(() => {
//     let mouseConstraint: Matter.MouseConstraint | null = null;
//     let scrollTimeout: any = null;

//     const attachMouse = () => {
//       if (!engineRef.current || !appRef.current) return;
//       const canvas = appRef.current.querySelector("canvas");
//       if (!canvas) return;
//       canvas.style.touchAction = "auto";
//       canvas.style.userSelect = "none";
//       canvas.style.pointerEvents = "auto";
//       const mouse = Matter.Mouse.create(canvas);
//       mouseConstraint = Matter.MouseConstraint.create(engineRef.current, {
//         mouse,
//         constraint: {
//           stiffness: 0.2,
//           render: { visible: false },
//         },
//         collisionFilter: {
//           mask: 0x0001, // Only interact with bodies in category 0x0001
//         },
//       });
//       Matter.World.add(engineRef.current.world, mouseConstraint);

//       // --- PointerEvents workaround for scroll ---
//       function handleScroll() {
//         canvas.style.pointerEvents = "none";
//         clearTimeout(scrollTimeout);
//         scrollTimeout = setTimeout(() => {
//           canvas.style.pointerEvents = "auto";
//         }, 500);
//       }
//       canvas.addEventListener("wheel", handleScroll);
//       canvas.addEventListener("touchmove", handleScroll);

//       // Cleanup
//       return () => {
//         canvas.removeEventListener("wheel", handleScroll);
//         canvas.removeEventListener("touchmove", handleScroll);
//       };
//     };

//     const timeout = setTimeout(attachMouse, 100);

//     return () => {
//       if (mouseConstraint && engineRef.current) {
//         Matter.World.remove(engineRef.current.world, mouseConstraint);
//       }
//       clearTimeout(timeout);
//     };
//   }, []);

//   // Draw stand
//   const drawStand = useCallback((g: Graphics) => {
//     g.clear();
//     g.fill({ color: COLORS.stand });
//     g.rect(-STAND_WIDTH / 2, -STAND_HEIGHT / 2, STAND_WIDTH, STAND_HEIGHT);
//     g.fill();
//   }, []);

//   return (
//     <div
//       style={{
//         width: "100vw",
//         minHeight: "100vh",
//         background: COLORS.background,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* PixiJS Canvas */}
//       <div
//         ref={appRef}
//         style={{
//           width: "100vw",
//           height: "80vh", // Fixed height for scroll area
//           background: COLORS.background,
//           flex: 1,
//           position: "relative",
//           overflow: "auto", // Enable scrolling
//         }}
//       >
//         <Application
//           width={SCENE_WIDTH}
//           height={SCENE_HEIGHT}
//           background={COLORS.background}
//           autoStart
//           style={{
//             width: SCENE_WIDTH,
//             height: SCENE_HEIGHT,
//             margin: 0,
//             padding: 0,
//             boxSizing: "border-box",
//             position: "relative",
//           }}
//         >
//           {/* Rectangle */}
//           <pixiContainer
//             x={rectPos.x}
//             y={rectPos.y}
//             rotation={rectPos.angle}
//             pivot={{ x: 0, y: 0 }}
//           >
//             <pixiGraphics
//               draw={(g) => {
//                 g.clear();
//                 g.fill({ color: COLORS.rect });
//                 g.rect(
//                   -RECT_WIDTH / 2,
//                   -RECT_HEIGHT / 2,
//                   RECT_WIDTH,
//                   RECT_HEIGHT
//                 );
//                 g.fill();
//                 g.setStrokeStyle({ width: 4, color: 0x000000 });
//                 g.rect(0, 0, RECT_WIDTH, RECT_HEIGHT);
//               }}
//             />
//           </pixiContainer>
//           {/* Stand */}
//           <pixiContainer
//             x={SCENE_WIDTH / 2}
//             y={SCENE_HEIGHT - STAND_HEIGHT / 2}
//           >
//             <pixiGraphics draw={drawStand} />
//           </pixiContainer>
//         </Application>
//       </div>
//     </div>
//   );
// }
