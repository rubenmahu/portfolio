import type { Metadata } from "next";
import type { Profile } from "@/types/content.type";

function buildMetadata(profile: Profile): Metadata {
  const title = `${profile.name} | ${profile.role}`;

  return {
    metadataBase: new URL(profile.siteUrl),
    title,
    description: profile.description,
    openGraph: {
      title,
      description: profile.description,
      url: "/",
      siteName: profile.name,
      locale: "es_ES",
      type: "website",
    },
  };
}

export { buildMetadata };
