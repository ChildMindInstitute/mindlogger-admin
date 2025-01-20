import { Manager } from 'modules/Dashboard/types';
import { MenuActionProps } from 'shared/components';

export type ManagersActions = {
  removeTeamMemberAction: ({ context }: MenuActionProps<Manager>) => void;
  editTeamMemberAction: ({ context }: MenuActionProps<Manager>) => void;
  copyEmailAddressAction: ({ context }: MenuActionProps<Manager>) => void;
  copyInvitationLinkAction: ({ context }: MenuActionProps<Manager>) => void;
};
