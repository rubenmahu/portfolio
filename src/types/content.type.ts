interface Profile {
  name: string;
  role: string;
  headline: string;
  intro: string;
  description: string;
  siteUrl: string;
}

interface Commit {
  hash: string;
  message: string;
  // Missing while it is not written.
  description?: string;
  tags: string[];
}

interface Chapter {
  id: string;
  number: string;
  label: string;
  // Git branch of the stage and its short name in the branch bar.
  branch: string;
  slug: string;
  period?: string;
  title: string;
  company?: string;
  role?: string;
  // Missing while it is not written.
  summary?: string;
  commits: Commit[];
}

interface Journey {
  chapters: Chapter[];
}

interface ContactLink {
  id: string;
  label: string;
  href: string;
}

interface Contact {
  links: ContactLink[];
}

export type { Chapter, Commit, Contact, ContactLink, Journey, Profile };
