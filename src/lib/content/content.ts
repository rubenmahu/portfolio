import contactData from "../../../content/contact.json";
import profileData from "../../../content/profile.json";
import stackData from "../../../content/stack.json";
import type { Contact, Profile, Stack } from "@/types/content.type";

const contact: Contact = contactData;
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

export { getContact, getProfile, getStack };
