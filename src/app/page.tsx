import Contact from "@/components/sections/Contact/Contact";
import Hero from "@/components/sections/Hero/Hero";
import Stack from "@/components/sections/Stack/Stack";
import { getContact, getProfile, getStack } from "@/lib/content";
import styles from "./page.module.css";

async function Home() {
  const [profile, stack, contact] = await Promise.all([
    getProfile(),
    getStack(),
    getContact(),
  ]);

  return (
    <main className={styles.page}>
      <Hero profile={profile} />
      <Stack stack={stack} />
      <Contact contact={contact} />
    </main>
  );
}

export default Home;
