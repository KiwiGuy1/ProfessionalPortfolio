import styles from "./Intro.module.css";
import Link from "next/link";

export default function Intro() {
  return (
    <div className={styles["intro-container"]}>
      <div className={styles["intro-oval"]}>
        {/* Left links */}
        <div className={`${styles["links-side"]} ${styles.left}`}>
          <Link href="/about" className={styles["link-oval"]}>
            About
          </Link>
          <Link href="#skills" className={styles["link-oval"]}>
            Skills
          </Link>
          <Link href="#projects" className={styles["link-oval"]}>
            Projects
          </Link>
          <Link href="#contact" className={styles["link-oval"]}>
            Contact
          </Link>
        </div>
        {/* Title and subtitle */}
        <div className={styles["page-title-wrapper"]}>
          <div className={styles["page-title"]}>Kiwi</div>
          <div className={styles.spacer}></div>
          <div className={styles["page-subtitle"]}>Software Developer</div>
        </div>
        {/* Right links */}
        <div className={`${styles["links-side"]} ${styles.right}`}>
          <a href="#resume" className={styles["link-oval"]}>
            Resume
          </a>
          <a href="#blog" className={styles["link-oval"]}>
            Blog
          </a>
          <a href="#testimonials" className={styles["link-oval"]}>
            Testimonials
          </a>
          <a href="#github" className={styles["link-oval"]}>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
