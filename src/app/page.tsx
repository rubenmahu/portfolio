import Hero from "@/components/sections/Hero/Hero";
import { getProfile } from "@/lib/content";
import styles from "./page.module.css";

async function Home() {
  const profile = await getProfile();

  return (
    <main className={styles.page}>
      <Hero profile={profile} />
    </main>
  );
}

export default Home;
