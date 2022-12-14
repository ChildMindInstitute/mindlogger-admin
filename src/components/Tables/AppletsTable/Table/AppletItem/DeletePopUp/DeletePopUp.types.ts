import { FolderApplet } from 'redux/modules';

export type DeletePopUpProps = {
  deleteModalVisible: boolean;
  setDeleteModalVisible: (val: boolean) => void;
  item: FolderApplet;
};
