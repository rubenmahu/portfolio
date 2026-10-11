import profileData from "../../content/profile.json";
import stackData from "../../content/stack.json";

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

const profile: Profile = profileData;
const stack: Stack = stackData;

async function getProfile(): Promise<Profile> {
  return profile;
}

async function getStack(): Promise<Stack> {
  return stack;
}

export { getProfile, getStack };
export type { Profile, Stack, StackGroup, StackItem };
