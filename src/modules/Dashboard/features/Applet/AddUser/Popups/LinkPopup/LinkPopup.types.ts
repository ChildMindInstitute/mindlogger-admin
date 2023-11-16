import { InviteLink } from '../../LinkGenerator/LinkGenerator.types';

export type LinkPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: InviteLink | null) => void;
};
