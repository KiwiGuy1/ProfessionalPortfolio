"use client";

import { useEffect } from "react";
import styles from "./kj-welcome-screen.module.css";

const ANIMATION_DURATION_MS = 3200;

interface KJWelcomeScreenProps {
  onComplete?: () => void;
  letters?: [string, string];
}

export default function KJWelcomeScreen({
  onComplete,
  letters = ["K", "J"],
}: KJWelcomeScreenProps) {
  useEffect(() => {
    if (!onComplete) return;

    const timer = window.setTimeout(onComplete, ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={styles.introOverlay} aria-hidden="true">
      <div className={styles.introLetters}>
        <span className={styles.introLetterK}>{letters[0]}</span>
        <span className={styles.introLetterJ}>{letters[1]}</span>
      </div>
    </div>
  );
}
