import { FolderApplet } from 'redux/modules';

export type FolderItemProps = {
  item: FolderApplet;
  onFolderClick: (row: FolderApplet) => void;
};
