import type { ReactNode } from "react";
import { BlockTone } from "./Block.type";
import styles from "./Block.module.css";

interface BlockProps {
  tone?: BlockTone;
  children: ReactNode;
}

function Block({ tone = BlockTone.Card, children }: BlockProps) {
  return <div className={`${styles.block} ${styles[tone]}`}>{children}</div>;
}

export default Block;
