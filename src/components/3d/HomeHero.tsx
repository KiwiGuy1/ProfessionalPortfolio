"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import HeroScene from "./HeroScene";
import styles from "./home-hero.module.css";

const tags = ["React Three Fiber", "GSAP", "Next.js App Router"];

export default function HomeHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          "[data-hero-badge]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5 }
        )
        .fromTo(
          "[data-hero-title]",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.2"
        )
        .fromTo(
          "[data-hero-copy]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.65 },
          "-=0.45"
        )
        .fromTo(
          "[data-hero-actions]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          "-=0.35"
        )
        .fromTo(
          "[data-hero-tag]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(
          "[data-scene-panel]",
          { autoAlpha: 0, x: 28, scale: 0.98 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.7 },
          "-=0.55"
        );

      gsap.to("[data-grid]", {
        backgroundPosition: "48px 48px",
        duration: 10,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: rootRef }
  );

  return (
    <main className={styles.page}>
      <div className={styles.grid} data-grid aria-hidden="true" />

      <section ref={rootRef} className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.badge} data-hero-badge>
            3D Hero Starter
          </p>

          <h1 className={styles.title} data-hero-title>
            Clean foundation for a high-end interactive 3D homepage.
          </h1>

          <p className={styles.description} data-hero-copy>
            This starter is built for the App Router with a client-only React
            Three Fiber scene, orbit controls, lightweight GSAP page motion,
            and a simple cursor-reactive object you can later replace with a
            more advanced kiwi model.
          </p>

          <div className={styles.actions} data-hero-actions>
            <Link href="/projects" className={styles.primaryAction}>
              View Projects
            </Link>
            <Link href="/physics" className={styles.secondaryAction}>
              Physics Demo
            </Link>
          </div>

          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag} data-hero-tag>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.scenePanel} data-scene-panel>
          <HeroScene />

          <div className={styles.sceneCaption}>
            <span>Scene Notes</span>
            <strong>
              Orbit enabled, lights configured, and mesh rotation responds to
              cursor position.
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}
