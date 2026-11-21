const IconName = {
  Close: "close",
  Github: "github",
  Linkedin: "linkedin",
  Mail: "mail",
  Message: "message",
} as const;

type IconName = (typeof IconName)[keyof typeof IconName];

export { IconName };
