"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ModelScene from "./ModelScene";
import styles from "./model-viewer.module.css";

const fieldNodes = ["Motion", "Systems", "3D", "UI"];
const tickerItems = [
  "Interactive systems",
  "Product interfaces",
  "Motion design",
  "Full-stack builds",
];

export default function ModelViewer() {
  const pageRef = useRef<HTMLElement>(null);
  const cursorMovedRef = useRef(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setShowIntro(false);
    }, 5600);

    return () => {
      window.clearTimeout(introTimer);
    };
  }, []);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        delay: 5.15,
        defaults: { ease: "power3.out" },
      });

      timeline
        .fromTo(
          "[data-home-kicker]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
        )
        .fromTo(
          "[data-home-title]",
          { autoAlpha: 0, y: 44, filter: "blur(16px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          "-=0.28",
        )
        .fromTo(
          "[data-home-copy]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.75 },
          "-=0.52",
        )
        .fromTo(
          "[data-home-action]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.42",
        )
        .fromTo(
          "[data-home-hud]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 },
          "-=0.48",
        );

      gsap.to("[data-signal-beam]", {
        yPercent: 34,
        opacity: 0.74,
        duration: 5.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.8,
      });

      gsap.to("[data-ticker-track]", {
        xPercent: -50,
        duration: 24,
        ease: "none",
        repeat: -1,
      });

      gsap.to("[data-field-ring]", {
        rotate: 360,
        duration: 18,
        ease: "none",
        repeat: -1,
        stagger: 2.2,
      });

      gsap.to("[data-field-node]", {
        y: "random(-5, 5)",
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.16,
      });

      const moveCursorX = gsap.quickTo("[data-cursor-target]", "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const moveCursorY = gsap.quickTo("[data-cursor-target]", "y", {
        duration: 0.45,
        ease: "power3.out",
      });

      const handlePointerMove = (event: PointerEvent) => {
        moveCursorX(event.clientX);
        moveCursorY(event.clientY);

        if (cursorMovedRef.current) return;
        cursorMovedRef.current = true;

        gsap.to("[data-cursor-target]", {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        });
        gsap.to("[data-interaction-cue]", {
          autoAlpha: 0,
          y: -10,
          duration: 0.45,
          ease: "power3.out",
        });
      };

      window.addEventListener("pointermove", handlePointerMove);

      gsap.set("[data-cursor-target]", {
        autoAlpha: 0,
        scale: 0.72,
        xPercent: -50,
        yPercent: -50,
      });

      gsap.to("[data-cue-dot]", {
        x: 18,
        duration: 0.9,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
      };
    },
    { scope: pageRef },
  );

  const handleFieldPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const field = event.currentTarget;
    const bounds = field.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const xPercent = Math.round(x * 100);
    const yPercent = Math.round(y * 100);

    gsap.to(field, {
      "--field-x": `${xPercent}%`,
      "--field-y": `${yPercent}%`,
      duration: 0.36,
      ease: "power3.out",
    });

    field.querySelectorAll<HTMLElement>("[data-field-node]").forEach((node, index) => {
      const pull = 18 - index * 2.5;
      gsap.to(node, {
        x: (x - 0.5) * pull,
        y: (y - 0.5) * pull,
        duration: 0.42,
        ease: "power3.out",
      });
    });
  };

  const resetField = (event: React.PointerEvent<HTMLElement>) => {
    const field = event.currentTarget;

    gsap.to(field, {
      "--field-x": "50%",
      "--field-y": "50%",
      duration: 0.55,
      ease: "power3.out",
    });

    gsap.to(field.querySelectorAll("[data-field-node]"), {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.72)",
    });
  };

  return (
    <main ref={pageRef} className={styles.page}>
      <ModelScene />

      <div className={styles.motionField} aria-hidden="true">
        <div className={styles.signalBeam} data-signal-beam />
        <div className={styles.signalBeamSoft} data-signal-beam />
      </div>

      <div className={styles.cursorTarget} data-cursor-target aria-hidden="true">
        <span />
      </div>

      <section className={styles.heroOverlay} aria-label="Portfolio introduction">
        <div className={styles.heroCopy}>
          <p className={styles.kicker} data-home-kicker>
            Independent web developer
          </p>

          <h1 className={styles.heroTitle} data-home-title>
            Building sharp interfaces with motion, code, and character.
          </h1>

          <p className={styles.heroText} data-home-copy>
            I craft fast, expressive web experiences that feel polished from
            the first interaction to the final deploy.
          </p>

          <div className={styles.heroActions}>
            <Link href="/projects" className={styles.primaryAction} data-home-action>
              View Work
            </Link>
            <Link href="/contact" className={styles.secondaryAction} data-home-action>
              Start a Project
            </Link>
          </div>
        </div>

        <aside
          className={styles.fieldPanel}
          data-home-hud
          onPointerMove={handleFieldPointerMove}
          onPointerLeave={resetField}
        >
          <div className={styles.fieldHeader}>
            <span>Motion Field</span>
            <strong>Move through this panel</strong>
          </div>

          <div className={styles.fieldCore} aria-hidden="true">
            <span data-field-ring />
            <span data-field-ring />
            <i />
          </div>

          <div className={styles.fieldNodes}>
            {fieldNodes.map((node) => (
              <span key={node} data-field-node>
                {node}
              </span>
            ))}
          </div>

        </aside>
      </section>

      <div className={styles.interactionCue} data-interaction-cue>
        <span className={styles.cueTrack} aria-hidden="true">
          <i data-cue-dot />
        </span>
        <strong>Move your cursor</strong>
        <small>The kiwi tracks your motion</small>
      </div>

      <div className={styles.ticker} aria-hidden="true" data-home-hud>
        <div className={styles.tickerTrack} data-ticker-track>
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      {showIntro ? (
        <div className={styles.introOverlay} aria-hidden="true">
          <div className={styles.introLetters}>
            <span className={styles.introLetterK}>K</span>
            <span className={styles.introLetterJ}>J</span>
          </div>
        </div>
      ) : null}
    </main>
  );
}
