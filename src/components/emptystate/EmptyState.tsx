import styles from "./emptystate.module.css";
import { FolderOpen, TriangleAlert } from "lucide-react";

export default function EmptyStateCard({head, body}: {head: string, body: string}) {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.iconWrapper}>
        {head.toLowerCase().includes("error") ? (
          <TriangleAlert size={28} className={styles.emptyIcon} />
        ) : (
          <FolderOpen size={28} className={styles.emptyIcon} />
        )}
      </div>
      <h3 className={styles.emptyTitle}>{head}</h3>
      <p className={styles.emptyText}>
        {body}
      </p>
    </div>
  );
}