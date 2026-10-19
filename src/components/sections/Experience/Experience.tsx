import Block from "@/components/ui/Block/Block";
import { BlockTone } from "@/components/ui/Block/Block.type";
import type { Experience as ExperienceData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Experience.module.css";

interface ExperienceProps {
  experience: ExperienceData;
}

function Experience({ experience }: ExperienceProps) {
  return (
    <section
      id={SectionId.Experience}
      className={styles.experience}
      aria-labelledby="experience-title"
    >
      <h2 id="experience-title" className={styles.title}>
        Experiencia
      </h2>
      <div className={styles.jobs}>
        {experience.jobs.map((job, index) => (
          // Jobs are listed from newest to oldest: the first one is the
          // current job and gets the highlighted tone.
          <Block
            key={job.id}
            tone={index === 0 ? BlockTone.Accent : BlockTone.Card}
          >
            <div className={styles.job}>
              <header className={styles.header}>
                <h3 className={styles.company}>{job.company}</h3>
                <p className={styles.role}>{job.role}</p>
                <p className={styles.period}>{job.period}</p>
              </header>
              <ul className={styles.highlights}>
                {job.highlights.map((highlight) => (
                  <li key={highlight} className={styles.highlight}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </Block>
        ))}
      </div>
    </section>
  );
}

export default Experience;
