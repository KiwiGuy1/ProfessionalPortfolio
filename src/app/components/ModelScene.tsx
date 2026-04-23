"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Html } from "@react-three/drei";
import {
  DepthOfField,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  Bone,
  Color,
  Material,
  MeshStandardMaterial,
  Object3D,
  ShaderMaterial,
  Vector2,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { SkeletonUtils } from "three-stdlib";
import { KIWI_MODEL_PATH } from "@/lib/modelAssets";
import styles from "./model-viewer.module.css";

type SceneControls = {
  glowY: number;
  glowRadius: number;
  glowStrength: number;
  glowStretch: number;
  grainOpacity: number;
  innerColor: string;
  modelYOffset: number;
  noiseStrength: number;
  outerColor: string;
  topFadeStart: number;
  vignetteStrength: number;
};

const sceneControls: SceneControls = {
  glowY: -0.18,
  glowRadius: 2.45,
  glowStrength: 1.42,
  glowStretch: 2.8,
  grainOpacity: 0.42,
  innerColor: "#ffffff",
  modelYOffset: 0,
  noiseStrength: 0.035,
  outerColor: "#030403",
  topFadeStart: 0.48,
  vignetteStrength: 1.55,
};

const backdropVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const backdropFragmentShader = `
  uniform vec2 uResolution;
  uniform vec2 uGlowCenter;
  uniform float uGlowRadius;
  uniform float uGlowStrength;
  uniform float uGlowStretch;
  uniform float uVignetteStrength;
  uniform vec3 uInnerColor;
  uniform vec3 uOuterColor;
  uniform float uNoiseStrength;
  uniform float uTopFadeStart;
  uniform float uTime;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float softNoise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = uv - uGlowCenter;
    aspectUv.x *= (uResolution.x / uResolution.y) / uGlowStretch;

    float glowDistance = length(aspectUv);
    float glow = 1.0 - smoothstep(0.0, uGlowRadius, glowDistance);
    glow = pow(glow, 1.35) * uGlowStrength;

    vec2 vignetteUv = uv * (1.0 - uv.yx);
    float vignette = vignetteUv.x * vignetteUv.y * 16.0;
    vignette = pow(clamp(vignette, 0.0, 1.0), uVignetteStrength);
    float bottomOpen = smoothstep(0.0, 0.42, uv.y);
    vignette = mix(1.0, vignette, bottomOpen);

    float fogNoise = softNoise(uv * 5.0 + vec2(uTime * 0.015, -uTime * 0.01));
    float noise = (fogNoise - 0.5) * uNoiseStrength * 0.25;

    float topFade = 1.0 - smoothstep(uTopFadeStart, 1.0, uv.y);
    float tone = clamp(glow * vignette * topFade, 0.0, 1.0);
    tone = smoothstep(0.0, 1.0, tone) + noise * tone;
    tone = clamp(tone, 0.0, 1.0);
    vec3 color = mix(uOuterColor, uInnerColor, tone);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function KiwiModel({ controls }: { controls: SceneControls }) {
  const neckBoneRef = useRef<Bone>(null);
  const baseRotationRef = useRef({ x: 0, y: 0 });
  const pointer = useThree((state) => state.pointer);
  const { height, width } = useThree((state) => state.size);
  const [sourceScene, setSourceScene] = useState<Object3D | null>(null);
  const [loadError, setLoadError] = useState(false);
  const isMobile = width < 700;
  const isShortViewport = height < 680;
  const modelY =
    (isMobile ? -1.1 : isShortViewport ? -1.55 : -2) + controls.modelYOffset;
  const modelScale = isMobile ? 2.25 : isShortViewport ? 2.65 : 2.85;

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();

    loader.load(
      KIWI_MODEL_PATH,
      (gltf) => {
        if (!isMounted) return;
        setSourceScene(gltf.scene);
        setLoadError(false);
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${KIWI_MODEL_PATH}`, error);
        if (!isMounted) return;
        setLoadError(true);
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const clonedScene = useMemo(() => {
    if (!sourceScene) return null;

    const clonedModel = SkeletonUtils.clone(sourceScene);

    clonedModel.traverse((child: Object3D) => {
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

    return clonedModel;
  }, [sourceScene]);

  useEffect(() => {
    if (!clonedScene) return;

    const headBone = clonedScene.getObjectByName("Bone");
    if (headBone && headBone instanceof Bone) {
      neckBoneRef.current = headBone;
      baseRotationRef.current = {
        x: headBone.rotation.x,
        y: headBone.rotation.y,
      };
    }
  }, [clonedScene]);

  useFrame((_, delta) => {
    const headBone = neckBoneRef.current;
    if (!headBone) return;

    const followX = baseRotationRef.current.x - pointer.y * 0.16;
    const followY = baseRotationRef.current.y + pointer.x * 0.36;
    const blend = 1 - Math.exp(-6.5 * delta);

    headBone.rotation.x += (followX - headBone.rotation.x) * blend;
    headBone.rotation.y += (followY - headBone.rotation.y) * blend;
  });

  if (loadError) {
    return (
      <Html center className={styles.loading}>
        Model failed to load
      </Html>
    );
  }

  if (!clonedScene) {
    return <ModelLoadingFallback />;
  }

  return (
    <group position={[0, modelY, 0]} rotation={[0, 0.08, 0]}>
      <Center>
        <group scale={modelScale}>
          <primitive object={clonedScene as Object3D} />
        </group>
      </Center>
    </group>
  );
}

function ModelLoadingFallback() {
  return (
    <Html center className={styles.loading}>
      Loading model
    </Html>
  );
}

function CinematicBackdrop({ controls }: { controls: SceneControls }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Vector2(size.width, size.height) },
      uGlowCenter: { value: new Vector2(0.5, controls.glowY) },
      uGlowRadius: { value: controls.glowRadius },
      uGlowStrength: { value: controls.glowStrength },
      uGlowStretch: { value: controls.glowStretch },
      uVignetteStrength: { value: controls.vignetteStrength },
      uInnerColor: { value: new Color(controls.innerColor) },
      uOuterColor: { value: new Color(controls.outerColor) },
      uNoiseStrength: { value: controls.noiseStrength },
      uTopFadeStart: { value: controls.topFadeStart },
      uTime: { value: 0 },
    }),
    [controls, size.height, size.width],
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uGlowCenter.value.set(0.5, controls.glowY);
    uniforms.uGlowRadius.value = controls.glowRadius;
    uniforms.uGlowStrength.value = controls.glowStrength;
    uniforms.uGlowStretch.value = controls.glowStretch;
    uniforms.uVignetteStrength.value = controls.vignetteStrength;
    uniforms.uInnerColor.value.set(controls.innerColor);
    uniforms.uOuterColor.value.set(controls.outerColor);
    uniforms.uNoiseStrength.value = controls.noiseStrength;
    uniforms.uTopFadeStart.value = controls.topFadeStart;
  }, [
    controls,
    size.height,
    size.width,
    uniforms.uGlowCenter.value,
    uniforms.uGlowRadius,
    uniforms.uGlowStrength,
    uniforms.uGlowStretch,
    uniforms.uInnerColor.value,
    uniforms.uNoiseStrength,
    uniforms.uOuterColor.value,
    uniforms.uResolution.value,
    uniforms.uTopFadeStart,
    uniforms.uVignetteStrength,
  ]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={backdropVertexShader}
        fragmentShader={backdropFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ controls }: { controls: SceneControls }) {
  const cameraPosition: [number, number, number] = [0, 0.28, 3.05];

  return (
    <Canvas
      style={{ width: "100%", height: "100%", display: "block" }}
      camera={{ position: cameraPosition, fov: 31 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#030403"]} />
      <CinematicBackdrop controls={controls} />
      <ambientLight intensity={0.18} color="#c8d0c2" />
      <hemisphereLight args={["#3f463f", "#020302", 0.32]} />
      <directionalLight
        position={[0, 2.1, -3.8]}
        intensity={2.7}
        color="#eef0e8"
      />
      <directionalLight
        position={[-3.2, 1.7, -1.6]}
        intensity={1.45}
        color="#a8c7ff"
      />
      <directionalLight
        position={[3.4, 1.35, -1.2]}
        intensity={0.9}
        color="#ffe0b0"
      />
      <directionalLight
        position={[0, 1.2, 3.2]}
        intensity={0.12}
        color="#ffffff"
      />

      <KiwiModel controls={controls} />
      <EffectComposer multisampling={0}>
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.01}
          bokehScale={0.65}
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={controls.grainOpacity}
        />
      </EffectComposer>
    </Canvas>
  );
}

export default function ModelScene() {
  return <Scene controls={sceneControls} />;
}
