import { FolderApplet } from 'redux/modules';

export type DuplicatePopUpsProps = {
  duplicateModalsVisible: boolean;
  setDuplicateModalsVisible: (val: boolean) => void;
  item: FolderApplet;
};
