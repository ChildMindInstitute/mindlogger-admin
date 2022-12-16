import { FolderApplet } from 'redux/modules';

export type DeletePopupProps = {
  deletePopupVisible: boolean;
  onClose: () => void;
  item: FolderApplet;
};
