import Block from "@/components/ui/Block/Block";
import { BlockTone } from "@/components/ui/Block/Block.type";
import type { Stack as StackData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Stack.module.css";

interface StackProps {
  stack: StackData;
}

const GROUP_TONES = [BlockTone.Card, BlockTone.Olive];

function Stack({ stack }: StackProps) {
  return (
    <section
      id={SectionId.Knowledge}
      className={styles.stack}
      aria-labelledby="stack-title"
    >
      <h2 id="stack-title" className={styles.title}>
        Conocimientos
      </h2>
      <div className={styles.grid}>
        {stack.groups.map((group, index) => (
          <Block key={group.id} tone={GROUP_TONES[index % GROUP_TONES.length]}>
            <h3 className={styles.groupTitle}>{group.name}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  {item.name}
                </li>
              ))}
            </ul>
          </Block>
        ))}
      </div>
    </section>
  );
}

export default Stack;
