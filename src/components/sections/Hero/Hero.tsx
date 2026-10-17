import Block from "@/components/ui/Block/Block";
import type { Profile } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Hero.module.css";

interface HeroProps {
  profile: Profile;
}

function Hero({ profile }: HeroProps) {
  return (
    <section
      id={SectionId.Home}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <Block>
        <h1 id="hero-title" className={styles.title}>
          {profile.name}
        </h1>
        <p className={styles.headline}>{profile.headline}</p>
        <p className={styles.intro}>{profile.intro}</p>
      </Block>
    </section>
  );
}

export default Hero;
