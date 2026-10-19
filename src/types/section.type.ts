const SectionId = {
  Home: "inicio",
  Knowledge: "conocimientos",
  Experience: "experiencia",
  Contact: "contacto",
} as const;

type SectionId = (typeof SectionId)[keyof typeof SectionId];

export { SectionId };
