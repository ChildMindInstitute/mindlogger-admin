import { DashboardTableProps } from 'modules/Dashboard/components';
import { Applet, Folder } from 'api';

export type AppletsTableProps = Omit<DashboardTableProps, 'rows'> & {
  rows?: (Folder | Applet)[];
  headerContent: JSX.Element;
  handleReload: () => void;
};
