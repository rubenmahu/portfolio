const SectionId = {
  Home: "inicio",
  Journey: "viaje",
  Contact: "contacto",
} as const;

type SectionId = (typeof SectionId)[keyof typeof SectionId];

export { SectionId };
