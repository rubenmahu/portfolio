import type { Profile } from "@/types/content.type";
import styles from "./Hero.module.css";

interface HeroProps {
  profile: Profile;
}

function Hero({ profile }: HeroProps) {
  return (
    <section className={styles.block} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.title}>
        {profile.name}
      </h1>
      <p className={styles.headline}>{profile.headline}</p>
      <p className={styles.intro}>{profile.intro}</p>
    </section>
  );
}

export default Hero;
