import { FolderApplet } from 'redux/modules';

export type FolderItemProps = {
  item: FolderApplet;
  onRowClick: (row: FolderApplet) => void;
};
