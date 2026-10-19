const BlockTone = {
  Card: "card",
  Highlight: "highlight",
  Accent: "accent",
} as const;

type BlockTone = (typeof BlockTone)[keyof typeof BlockTone];

export { BlockTone };
