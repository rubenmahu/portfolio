import { describe, expect, test } from "vitest";
import type { Profile } from "@/types/content.type";
import { buildMetadata } from "./metadata";

const profile: Profile = {
  name: "Nombre Apellido",
  role: "Rol de prueba",
  headline: "Titular de prueba.",
  intro: "Presentación de prueba.",
  description: "Descripción de prueba.",
  siteUrl: "https://ejemplo.com",
};

describe("buildMetadata", () => {
  test("builds the title from the name and the role", () => {
    expect(buildMetadata(profile).title).toBe(
      "Nombre Apellido | Rol de prueba",
    );
  });

  test("uses the profile description and the site URL as base", () => {
    const metadata = buildMetadata(profile);

    expect(metadata.description).toBe("Descripción de prueba.");
    expect(metadata.metadataBase?.toString()).toBe("https://ejemplo.com/");
  });

  test("fills the Open Graph tags", () => {
    const { openGraph } = buildMetadata(profile);

    expect(openGraph).toMatchObject({
      title: "Nombre Apellido | Rol de prueba",
      description: "Descripción de prueba.",
      siteName: "Nombre Apellido",
      locale: "es_ES",
      type: "website",
    });
  });
});
