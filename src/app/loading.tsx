import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.skeletonTitleMain}></div>
      <div className={styles.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonBadge}></div>
              <div className={styles.skeletonIcon}></div>
            </div>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonTextShort}></div>
            <div className={styles.skeletonFooter}></div>
          </div>
        ))}
      </div>
    </div>
  );
}