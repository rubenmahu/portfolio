import profileData from "../../content/profile.json";
import stackData from "../../content/stack.json";
import type { Profile, Stack } from "@/types/content.type";

const profile: Profile = profileData;
const stack: Stack = stackData;

async function getProfile(): Promise<Profile> {
  return profile;
}

async function getStack(): Promise<Stack> {
  return stack;
}

export { getProfile, getStack };
