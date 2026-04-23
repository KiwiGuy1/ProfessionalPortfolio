"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import InteractiveMesh from "./InteractiveMesh";

export default function HeroScene() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [1.9, 0.2, 2.45], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0b110d"]} />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[3, 4, 4]}
          intensity={1.35}
          color="#f6fff2"
        />
        <pointLight position={[-2, 1, 3]} intensity={8} color="#95ff7a" />

        <Suspense fallback={null}>
          <InteractiveMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
