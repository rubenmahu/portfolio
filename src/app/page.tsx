import Contact from "@/components/sections/Contact/Contact";
import Footer from "@/components/sections/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import Journey from "@/components/sections/Journey/Journey";
import RevealOnScroll from "@/components/ui/RevealOnScroll/RevealOnScroll";
import { getContact, getJourney, getProfile } from "@/lib/content/content";
import styles from "./page.module.css";

async function Home() {
  const [profile, journey, contact] = await Promise.all([
    getProfile(),
    getJourney(),
    getContact(),
  ]);

  return (
    <>
      <RevealOnScroll />
      <Contact contact={contact} />
      <main className={styles.page}>
        <Hero profile={profile} />
        <Journey journey={journey} />
      </main>
      <Footer profile={profile} />
    </>
  );
}

export default Home;
