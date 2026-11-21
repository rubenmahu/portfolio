import contactData from "../../../content/contact.json";
import journeyData from "../../../content/journey.json";
import profileData from "../../../content/profile.json";
import type { Contact, Journey, Profile } from "@/types/content.type";

const contact: Contact = contactData;
const journey: Journey = journeyData;
const profile: Profile = profileData;

async function getProfile(): Promise<Profile> {
  return profile;
}

async function getContact(): Promise<Contact> {
  return contact;
}

async function getJourney(): Promise<Journey> {
  return journey;
}

export { getContact, getJourney, getProfile };
