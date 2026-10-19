interface Profile {
  name: string;
  role: string;
  headline: string;
  intro: string;
  description: string;
  siteUrl: string;
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

interface Job {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

interface Experience {
  jobs: Job[];
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

export type {
  Contact,
  ContactLink,
  Experience,
  Job,
  Profile,
  Stack,
  StackGroup,
  StackItem,
};
