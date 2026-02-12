// src/app/notes/loading.tsx
import styles from "./notes.module.css";

export default function Loading() {
  // We'll create a simple grid of 6 empty boxes
  const skeletons = Array.from({ length: 6 });

  return (
    <div className={styles.notesGrid}>
      <header className={styles.header}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonBtn}></div>
      </header>
      
      <div className={styles.notesGrid}>
        {skeletons.map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonLineShort}></div>
            <div className={styles.skeletonLineLong}></div>
            <div className={styles.skeletonLineLong}></div>
          </div>
        ))}
      </div>
    </div>
  );
}