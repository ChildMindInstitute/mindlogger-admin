import { FoldersApplets } from 'redux/modules';
import { HeadCell } from 'types/table';

export type TableProps = {
  columns: HeadCell[];
  rows: FoldersApplets[] | undefined;
  orderBy: string;
  headerContent: JSX.Element;
};
