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

export type { Profile, Stack, StackGroup, StackItem };
