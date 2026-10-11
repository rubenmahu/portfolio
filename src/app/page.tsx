import Hero from "@/components/sections/Hero/Hero";
import Stack from "@/components/sections/Stack/Stack";
import { getProfile, getStack } from "@/lib/content";
import styles from "./page.module.css";

async function Home() {
  const [profile, stack] = await Promise.all([getProfile(), getStack()]);

  return (
    <main className={styles.page}>
      <Hero profile={profile} />
      <Stack stack={stack} />
    </main>
  );
}

export default Home;
