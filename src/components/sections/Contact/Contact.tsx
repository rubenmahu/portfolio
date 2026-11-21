"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { IconName } from "@/components/ui/Icon/Icon.type";
import type { Contact as ContactData } from "@/types/content.type";
import { SectionId } from "@/types/section.type";
import styles from "./Contact.module.css";

interface ContactProps {
  contact: ContactData;
}

// Icon of each link by its id in contact.json; a link without one has none.
const LINK_ICONS: Record<string, IconName> = {
  email: IconName.Mail,
  github: IconName.Github,
  linkedin: IconName.Linkedin,
};

function Contact({ contact }: ContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <section
      id={SectionId.Contact}
      className={styles.contact}
      aria-label="Contacto"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        Contacto
        <span className={styles.icon}>
          <Icon
            name={isOpen ? IconName.Close : IconName.Message}
            className={styles.toggleIcon}
          />
        </span>
      </button>
      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        <ul className={styles.links}>
          {contact.links.map((link) => {
            const isExternal = link.href.startsWith("https://");
            const icon = LINK_ICONS[link.id];

            return (
              <li key={link.id}>
                <a
                  className={styles.link}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {icon && <Icon name={icon} className={styles.linkIcon} />}
                  <span className={styles.label}>{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Contact;
