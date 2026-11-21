const BranchGraphKind = {
  // The origin: its commits sit directly on main.
  Main: "main",
  // A branch that leaves main and is merged back into it.
  Merged: "merged",
  // A branch that is still open: it does not come back and ends in HEAD.
  Open: "open",
} as const;

type BranchGraphKind = (typeof BranchGraphKind)[keyof typeof BranchGraphKind];

export { BranchGraphKind };
