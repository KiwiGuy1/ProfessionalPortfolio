import styles from "./Intro.module.css";

export default function Intro() {
  console.log("Imported styles:", styles);

  return (
    <div className={styles["intro-container"]}>
      <div className={styles["intro-oval"]}>
        <div className={`${styles["links-side"]} ${styles.left}`}>
          <a href="#" className={styles["link-oval"]}>
            Left 1
          </a>
          <a href="#" className={styles["link-oval"]}>
            Left 2
          </a>
          <a href="#" className={styles["link-oval"]}>
            Left 3
          </a>
          <a href="#" className={styles["link-oval"]}>
            Left 4
          </a>
        </div>
        <div className={styles["page-title"]}>Kiwi</div>
        <div className={`${styles["links-side"]} ${styles.right}`}>
          <a href="#" className={styles["link-oval"]}>
            Right 1
          </a>
          <a href="#" className={styles["link-oval"]}>
            Right 2
          </a>
          <a href="#" className={styles["link-oval"]}>
            Right 3
          </a>
          <a href="#" className={styles["link-oval"]}>
            Right 4
          </a>
        </div>
      </div>
    </div>
  );
}
