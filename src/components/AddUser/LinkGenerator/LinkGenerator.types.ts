export type InviteLink = {
  requireLogin: boolean;
  inviteId: string;
};

export type LinkGeneratorProps = {
  setInviteLink: (val: InviteLink | null) => void;
  inviteLink: InviteLink;
};
