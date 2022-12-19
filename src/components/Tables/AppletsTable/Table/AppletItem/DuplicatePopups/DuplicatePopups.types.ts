import { FolderApplet } from 'redux/modules';

export type DuplicatePopupsProps = {
  duplicatePopupsVisible: boolean;
  setDuplicatePopupsVisible: (val: boolean) => void;
  item: FolderApplet;
};
