import styles from "./page.module.css";

function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.block}>
        <h1 className={styles.title}>
          Rubén Maestro, frontend con Angular y React.
        </h1>
        <p className={styles.lead}>
          Aprendo a trabajar con agentes de IA y lo aplico construyendo este
          sitio.
        </p>
      </section>
    </main>
  );
}

export default Home;
