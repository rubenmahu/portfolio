import contactData from "../../../content/contact.json";
import experienceData from "../../../content/experience.json";
import profileData from "../../../content/profile.json";
import stackData from "../../../content/stack.json";
import type { Contact, Experience, Profile, Stack } from "@/types/content.type";

const contact: Contact = contactData;
const experience: Experience = experienceData;
const profile: Profile = profileData;
const stack: Stack = stackData;

async function getProfile(): Promise<Profile> {
  return profile;
}

async function getStack(): Promise<Stack> {
  return stack;
}

async function getContact(): Promise<Contact> {
  return contact;
}

async function getExperience(): Promise<Experience> {
  return experience;
}

export { getContact, getExperience, getProfile, getStack };
