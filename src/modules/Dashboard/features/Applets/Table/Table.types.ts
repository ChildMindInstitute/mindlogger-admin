import { TableProps as SharedTableProps } from 'modules/Dashboard/components';
import { Applet, Folder } from 'api';

export type TableProps = Omit<SharedTableProps, 'rows'> & {
  rows?: (Folder | Applet)[];
  headerContent: JSX.Element;
  handleReload: () => void;
};
