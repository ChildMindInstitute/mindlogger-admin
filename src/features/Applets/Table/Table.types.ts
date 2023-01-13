import { FolderApplet } from 'redux/modules';
import { HeadCell } from 'types/table';

export type TableProps = {
  columns: HeadCell[];
  rows: FolderApplet[] | undefined;
  orderBy: string;
  headerContent: JSX.Element;
};
