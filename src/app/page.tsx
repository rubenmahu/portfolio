import Contact from "@/components/sections/Contact/Contact";
import Experience from "@/components/sections/Experience/Experience";
import Hero from "@/components/sections/Hero/Hero";
import Nav from "@/components/sections/Nav/Nav";
import Stack from "@/components/sections/Stack/Stack";
import {
  getContact,
  getExperience,
  getProfile,
  getStack,
} from "@/lib/content/content";
import styles from "./page.module.css";

async function Home() {
  const [profile, stack, experience, contact] = await Promise.all([
    getProfile(),
    getStack(),
    getExperience(),
    getContact(),
  ]);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <Hero profile={profile} />
        <Stack stack={stack} />
        <Experience experience={experience} />
        <Contact contact={contact} />
      </main>
    </>
  );
}

export default Home;
