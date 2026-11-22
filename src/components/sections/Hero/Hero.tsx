import Image from "next/image";
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
      <div className={styles.text}>
        <p className={styles.prompt} aria-hidden="true" data-stack>
          $ <span className={styles.command}>whoami</span>{" "}
          <span className={styles.cursor} />
        </p>
        <h1 id="hero-title" className={styles.title} data-stack>
          {profile.name}
        </h1>
        <p className={styles.lead} data-stack>
          {profile.headline} {profile.intro}
        </p>
        <a className={styles.start} href={`#${SectionId.Journey}`} data-stack>
          El viaje empieza aquí
        </a>
      </div>
      <div className={styles.portrait} data-stack>
        <div className={styles.bar} aria-hidden="true">
          <span className={styles.dots}>
            <span />
            <span />
            <span />
          </span>
          ruben.webp
        </div>
        <div className={styles.screen}>
          <Image
            className={styles.photo}
            src="/ruben-recorte.webp"
            width={639}
            height={838}
            sizes="(max-width: 760px) 200px, 300px"
            loading="eager"
            fetchPriority="high"
            alt={`Retrato de ${profile.name}`}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
