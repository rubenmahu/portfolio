const BlockTone = {
  Card: "card",
  Olive: "olive",
  Accent: "accent",
} as const;

type BlockTone = (typeof BlockTone)[keyof typeof BlockTone];

export { BlockTone };
