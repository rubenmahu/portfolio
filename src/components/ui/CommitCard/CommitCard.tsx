import type { Commit } from "@/types/content.type";
import styles from "./CommitCard.module.css";

interface CommitCardProps {
  commit: Commit;
}

function CommitCard({ commit }: CommitCardProps) {
  return (
    <article className={styles.row}>
      <p className={styles.hash}>{commit.hash}</p>
      <h4 className={styles.message}>{commit.message}</h4>
      {commit.description && (
        <p className={styles.description}>{commit.description}</p>
      )}
      <ul className={styles.tags}>
        {commit.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default CommitCard;
