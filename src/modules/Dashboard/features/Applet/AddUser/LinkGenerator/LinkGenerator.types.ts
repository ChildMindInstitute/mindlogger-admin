export type InviteLink = {
  link: string;
  requireLogin?: boolean;
};

export type LinkGeneratorProps = {
  setInviteLink: (val: InviteLink | null) => void;
  inviteLink: InviteLink | null;
};
