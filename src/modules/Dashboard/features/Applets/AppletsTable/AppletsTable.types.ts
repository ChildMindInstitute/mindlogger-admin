import { DashboardTablePropsWithPagination } from 'modules/Dashboard/components';
import { Applet, Folder } from 'api';

export type AppletsTableProps = Omit<DashboardTablePropsWithPagination, 'rows'> & {
  rows?: (Folder | Applet)[];
  headerContent: JSX.Element;
  handleReload: () => void;
};

export type GetTableRowClassNames = {
  hasHover: boolean;
  isDragOver: boolean;
};
