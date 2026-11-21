import { BranchGraphKind, BranchGraphState } from "./BranchGraph.type";
import styles from "./BranchGraph.module.css";

interface BranchGraphStage {
  // Also the key of the stage color (data-stage).
  id: string;
  number: string;
  slug: string;
  // Shown under the name of the branch.
  period: string;
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

interface BranchArtProps {
  kind: BranchGraphKind;
  commits: number;
}

// Soft curves from main to the branch (fork) and back (join), from the center
// of one line to the center of the other. The SVG is stretched to the gap
// between both lines; the stroke keeps its width.
const FORK_PATH = "M0 0C0 14 28 14 28 28";
const JOIN_PATH = "M28 0C28 14 0 14 0 28";

function getState(index: number, activeIndex: number): BranchGraphState {
  if (index < activeIndex) {
    return BranchGraphState.Passed;
  }

  return index === activeIndex
    ? BranchGraphState.Active
    : BranchGraphState.Pending;
}

// The commits are spaced evenly around the middle of the branch (--center),
// one --spacing apart.
function commitTop(index: number, total: number) {
  const offset = index - (total - 1) / 2;

  return `calc(var(--center) + ${offset} * var(--spacing))`;
}

function Curve({ className, path }: { className: string; path: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" preserveAspectRatio="none">
      <path d={path} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// The branch of one stage: the origin sits on main, a merged branch leaves it
// and comes back, and the open one keeps going (dotted) and ends in HEAD.
function BranchArt({ kind, commits }: BranchArtProps) {
  const lastTop = commitTop(commits - 1, commits);

  return (
    <>
      <span className={styles.branch}>
        {kind !== BranchGraphKind.Main && (
          <Curve className={styles.fork} path={FORK_PATH} />
        )}
        {kind === BranchGraphKind.Merged && (
          <>
            <span className={styles.line} />
            <Curve className={styles.join} path={JOIN_PATH} />
          </>
        )}
        {kind === BranchGraphKind.Open && (
          <>
            <span
              className={styles.line}
              style={{ bottom: `calc(100% - ${lastTop})` }}
            />
            <span className={styles.tail} style={{ top: lastTop }} />
          </>
        )}
        {Array.from({ length: commits }, (_, index) => (
          <span
            key={index}
            className={styles.commit}
            style={{ top: commitTop(index, commits) }}
          />
        ))}
      </span>
      {kind === BranchGraphKind.Merged && <span className={styles.merge} />}
      {kind === BranchGraphKind.Open && (
        <span className={styles.head} style={{ top: lastTop }}>
          HEAD
        </span>
      )}
    </>
  );
}

// Each branch is a button that takes you to its stage. The drawing itself is
// decorative: the button name already says where it goes.
function BranchGraph({ stages, activeId, onSelect }: BranchGraphProps) {
  const activeIndex = stages.findIndex((stage) => stage.id === activeId);

  return (
    <nav className={styles.graph} aria-label="Etapas del recorrido">
      <ol className={styles.list}>
        {stages.map((stage, index) => {
          const state = getState(index, activeIndex);
          const isActive = state === BranchGraphState.Active;

          return (
            <li
              key={stage.id}
              className={styles.segment}
              data-stage={stage.id}
              data-kind={stage.kind}
              data-state={state}
              data-active={isActive ? "" : undefined}
            >
              <button
                type="button"
                className={styles.hit}
                aria-label={`Ir a ${stage.slug}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(stage.id)}
              />
              <span className={styles.art} aria-hidden="true">
                <span className={styles.main} />
                <BranchArt kind={stage.kind} commits={stage.commits} />
                <span className={styles.label}>
                  <span className={styles.number}>{stage.number}</span>
                  <span className={styles.name}>{stage.slug}</span>
                  <span className={styles.period}>{stage.period}</span>
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
