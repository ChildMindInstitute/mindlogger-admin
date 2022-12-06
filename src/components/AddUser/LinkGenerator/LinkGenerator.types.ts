export type IinviteLink = {
  requireLogin: boolean;
  inviteId: string;
};

export type LinkGeneratorProps = {
  setInviteLink: (val: IinviteLink | null) => void;
  inviteLink: IinviteLink;
};
