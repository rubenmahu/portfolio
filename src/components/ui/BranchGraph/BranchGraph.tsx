import { BranchGraphKind } from "./BranchGraph.type";
import styles from "./BranchGraph.module.css";

interface BranchGraphStage {
  // Also the key of the stage color (data-stage).
  id: string;
  number: string;
  slug: string;
  kind: BranchGraphKind;
  commits: number;
}

interface BranchGraphProps {
  stages: BranchGraphStage[];
  // The stage that is being read: its branch is highlighted.
  activeId: string;
  // Called with the id of the stage whose branch is clicked.
  onSelect: (id: string) => void;
}

// The commits are spread, from top to bottom, between the fork (12 %) and
// the merge (88 %) of the segment.
const START = 12;
const END = 88;

function commitPosition(index: number, total: number) {
  return `${START + ((END - START) * (index + 1)) / (total + 1)}%`;
}

// Each branch is a button that takes you to its stage. The drawing itself is
// decorative: the button name already says where it goes.
function BranchGraph({ stages, activeId, onSelect }: BranchGraphProps) {
  return (
    <nav className={styles.graph} aria-label="Etapas del recorrido">
      <ol className={styles.list}>
        {stages.map((stage) => {
          const isMain = stage.kind === BranchGraphKind.Main;
          const isOpen = stage.kind === BranchGraphKind.Open;
          const isMerged = stage.kind === BranchGraphKind.Merged;
          const isActive = stage.id === activeId;
          const name = `${stage.number}-${stage.slug}`;

          return (
            <li
              key={stage.id}
              className={styles.segment}
              data-stage={stage.id}
              data-active={isActive ? "" : undefined}
            >
              <button
                type="button"
                className={styles.hit}
                aria-label={`Ir a ${name}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(stage.id)}
              />
              <span className={styles.art} aria-hidden="true">
                <span className={styles.main} />
                {!isMain && (
                  <>
                    <span className={styles.fork} />
                    <span className={isOpen ? styles.openLine : styles.line} />
                  </>
                )}
                {isMerged && (
                  <>
                    <span className={styles.join} />
                    <span className={styles.merge} />
                  </>
                )}
                {isOpen && <span className={styles.head}>HEAD</span>}
                {Array.from({ length: stage.commits }, (_, index) => (
                  <span
                    key={index}
                    className={isMain ? styles.mainCommit : styles.commit}
                    style={{ top: commitPosition(index, stage.commits) }}
                  />
                ))}
                <span className={styles.label}>
                  {stage.number}
                  <span className={styles.slug}>-{stage.slug}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type { BranchGraphStage };
export default BranchGraph;
