const BranchGraphKind = {
  // The origin: its commits sit directly on main.
  Main: "main",
  // A branch that leaves main and is merged back into it.
  Merged: "merged",
  // A branch that is still open: it does not come back and ends in HEAD.
  Open: "open",
} as const;

type BranchGraphKind = (typeof BranchGraphKind)[keyof typeof BranchGraphKind];

// Where each branch is in the reading: before, on or after the active one.
const BranchGraphState = {
  Passed: "passed",
  Active: "active",
  Pending: "pending",
} as const;

type BranchGraphState =
  (typeof BranchGraphState)[keyof typeof BranchGraphState];

export { BranchGraphKind, BranchGraphState };
