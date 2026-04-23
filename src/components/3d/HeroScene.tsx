"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds } from "@react-three/drei";
import InteractiveMesh from "./InteractiveMesh";

export default function HeroScene() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0.15, 0.1, 3.35], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0b110d"]} />
        <ambientLight intensity={0.72} color="#fff7e8" />
        <hemisphereLight args={["#fff4dc", "#152016", 1.1]} />
        <directionalLight
          position={[2.4, 3.4, 4.2]}
          intensity={1.85}
          color="#fff2d4"
        />
        <directionalLight
          position={[-3.4, 1.2, 2.2]}
          intensity={0.85}
          color="#bcefff"
        />
        <directionalLight
          position={[0.2, 2.6, -3.5]}
          intensity={0.9}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <InteractiveMesh />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
