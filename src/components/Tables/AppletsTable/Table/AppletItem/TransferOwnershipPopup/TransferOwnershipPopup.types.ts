import { FolderApplet } from 'redux/modules';

export type TransferOwnership = { email: string };

export type TransferOwnershipPopupProps = {
  transferOwnershipPopupVisible: boolean;
  onClose: () => void;
  item: FolderApplet;
};
