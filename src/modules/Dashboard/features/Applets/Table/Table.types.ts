import { Applet, FolderApplet } from 'redux/modules';
import { TableProps as SharedTableProps } from 'modules/Dashboard/components';

export type TableProps = Omit<SharedTableProps, 'rows'> & {
  rows?: FolderApplet[] | Applet[];
  headerContent: JSX.Element;
};
