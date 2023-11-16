import { Invitations } from '../AddUser.types';

export type InvitationsTableProps = {
  invitations: Invitations | null;
  setInvitations: (data: Invitations) => void;
};
