import type { Profile } from "@/types/content.type";
import styles from "./Footer.module.css";

interface FooterProps {
  profile: Profile;
}

function Footer({ profile }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>
        {profile.name} <span className={styles.role}>{profile.role}</span>
      </p>
    </footer>
  );
}

export default Footer;
