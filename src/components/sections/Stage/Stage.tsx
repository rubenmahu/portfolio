import Image from "next/image";
import CommitCard from "@/components/ui/CommitCard/CommitCard";
import type { Chapter } from "@/types/content.type";
import styles from "./Stage.module.css";

interface StageProps {
  chapter: Chapter;
}

function Stage({ chapter }: StageProps) {
  const titleId = `stage-${chapter.id}-title`;

  return (
    <article
      className={styles.stage}
      data-stage={chapter.id}
      aria-labelledby={titleId}
    >
      <div className={styles.intro} data-reveal>
        <p className={styles.meta}>
          <code className={styles.branch}>{chapter.branch}</code>
          {chapter.period && (
            <span className={styles.period}>{chapter.period}</span>
          )}
        </p>
        <h3 id={titleId} className={styles.title}>
          {chapter.title}
        </h3>
        {chapter.summary && <p className={styles.summary}>{chapter.summary}</p>}
      </div>
      <Image
        className={styles.scene}
        src={`/scenes/${chapter.id}.svg`}
        width={435}
        height={420}
        unoptimized
        alt=""
      />
      <div className={styles.content}>
        <h4 className={styles.heading}>Historial de commits</h4>
        <ul className={styles.commits}>
          {chapter.commits.map((commit) => (
            <li key={commit.hash} data-reveal>
              <CommitCard commit={commit} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default Stage;
