import { Dispatch, SetStateAction } from 'react';

import { Invitations } from '../AddUser.types';

export type InvitationsTableProps = {
  invitations: Invitations | null;
  setInvitations: (data: Invitations) => void;
};

export type GetInvitationsTableRows = {
  invitations: Invitations | null;
  setOpenTooltipIndex: Dispatch<SetStateAction<number>>;
  handleTooltipClose: () => void;
  openTooltipIndex: number;
};
