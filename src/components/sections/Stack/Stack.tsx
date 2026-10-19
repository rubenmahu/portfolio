import Block from "@/components/ui/Block/Block";
import type { Stack as StackData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Stack.module.css";

interface StackProps {
  stack: StackData;
}

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
        {stack.groups.map((group) => (
          <Block key={group.id}>
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
