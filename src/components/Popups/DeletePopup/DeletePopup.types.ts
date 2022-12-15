import { FolderApplet } from 'redux/modules';

export type DeletePopupProps = {
  deletePopupVisible: boolean;
  setDeletePopupVisible: (value: boolean) => void;
  item: FolderApplet;
};
