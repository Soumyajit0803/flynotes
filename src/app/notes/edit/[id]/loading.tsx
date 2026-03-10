import styles from "@/app/loading.module.css";

export default function Loading() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* Simulate the "Edit Note" Title */}
      <div className={styles.skeletonTitleMain} style={{ width: "150px" }}></div>
      
      <div className={styles.skeletonCard} style={{ height: "450px", marginTop: "1rem" }}>
        
        {/* Category Selection Block */}
        <div className={styles.skeletonBadge} style={{ width: "100%", marginTop: "24px", marginBottom: "8px", height: "50px" }}></div>
        <div className={styles.skeletonBadge} style={{ width: "100%", marginTop: "24px", marginBottom: "8px", height: "50px" }}></div>

        {/* Content Area */}
        <div className={styles.skeletonBadge} style={{ width: "100%", marginTop: "24px", marginBottom: "8px" }}></div>
        <div className={styles.skeletonText} style={{ height: "150px" }}></div>
        
        {/* Bottom Button */}
        <div className={styles.skeletonIcon} style={{ width: "100%", height: "45px", marginTop: "30px" }}></div>
      </div>
    </div>
  );
}