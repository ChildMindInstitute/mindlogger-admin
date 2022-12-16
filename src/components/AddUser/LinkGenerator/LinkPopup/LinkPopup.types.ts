import { InviteLink } from 'components/AddUser/LinkGenerator/LinkGenerator.types';

export type LinkPopupProps = {
  open: boolean;
  onClose: () => void;
  setInviteLink: (value: InviteLink | null) => void;
};
