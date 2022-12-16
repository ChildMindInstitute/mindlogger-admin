import { FolderApplet } from 'redux/modules';

export type DuplicatePopupsProps = {
  duplicatePopupVisible: boolean;
  setDuplicatePopupVisible: (val: boolean) => void;
  item: FolderApplet;
};
