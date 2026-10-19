import Block from "@/components/ui/Block/Block";
import type { Contact as ContactData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Contact.module.css";

interface ContactProps {
  contact: ContactData;
}

function Contact({ contact }: ContactProps) {
  return (
    <section
      id={SectionId.Contact}
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className={styles.title}>
        Contacto
      </h2>
      <Block>
        <p className={styles.intro}>{contact.intro}</p>
        <ul className={styles.links}>
          {contact.links.map((link) => {
            const isExternal = link.href.startsWith("https://");

            return (
              <li key={link.id}>
                <a
                  className={styles.link}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </Block>
    </section>
  );
}

export default Contact;
