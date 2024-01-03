export type InviteLink = {
  link: string;
  requireLogin?: boolean;
};

export type LinkGeneratorProps = {
  setInviteLink: (link: InviteLink | null) => void;
  inviteLink: InviteLink | null;
};
