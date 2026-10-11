interface Profile {
  name: string;
  role: string;
  headline: string;
  intro: string;
}

interface StackItem {
  id: string;
  name: string;
}

interface StackGroup {
  id: string;
  name: string;
  items: StackItem[];
}

interface Stack {
  groups: StackGroup[];
}

interface ContactLink {
  id: string;
  label: string;
  href: string;
}

interface Contact {
  intro: string;
  links: ContactLink[];
}

export type { Contact, ContactLink, Profile, Stack, StackGroup, StackItem };
