import { Applet, Folder } from 'api';
import { DashboardTableProps } from 'modules/Dashboard/components';

export type AppletsTableProps = Omit<DashboardTableProps, 'rows'> & {
  rows?: (Folder | Applet)[];
  headerContent: JSX.Element;
  handleReload: () => void;
};
