"use client";

import { useMemo } from "react";
import { Center, useGLTF } from "@react-three/drei";
import { Material, MeshStandardMaterial, Object3D } from "three";
import { SkeletonUtils } from "three-stdlib";
import { KIWI_MODEL_PATH } from "@/lib/modelAssets";

export default function InteractiveMesh() {
  const { scene } = useGLTF(KIWI_MODEL_PATH);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);

    clone.traverse((child) => {
      if ("frustumCulled" in child) {
        child.frustumCulled = false;
      }

      const meshChild = child as { material?: Material | Material[] };
      if (!meshChild.material) return;

      const materialList = Array.isArray(meshChild.material)
        ? meshChild.material
        : [meshChild.material];

      materialList.forEach((material) => {
        if (!(material instanceof MeshStandardMaterial)) return;

        if (material.name === "Material_0") {
          material.emissive.set("#000000");
          material.emissiveMap = null;
          material.emissiveIntensity = 0;
          material.needsUpdate = true;
        }
      });
    });

    return clone;
  }, [scene]);

  return (
    <group rotation={[0, -0.18, 0]}>
      <Center>
        <group scale={2.55}>
          <primitive object={clonedScene as Object3D} />
        </group>
      </Center>
    </group>
  );
}

useGLTF.preload(KIWI_MODEL_PATH);
