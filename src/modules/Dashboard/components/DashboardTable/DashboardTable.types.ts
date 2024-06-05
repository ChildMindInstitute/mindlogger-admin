import { MouseEvent, UIEvent } from 'react';

import { Row, UiType } from 'shared/components';
import { HeadCell, Order } from 'shared/types';

export type DashboardTableProps = {
  uiType?: UiType;
  maxHeight?: string;
  className?: string;
  columns: HeadCell[];
  rows?: Row[];
  keyExtractor?: (item: Row, index: number) => string;
  order: Order;
  orderBy: string;
  handleRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  page: number;
  count: number;
  emptyComponent?: JSX.Element | string;
  searchValue?: string;
  handleChangePage: (event: unknown, newPage: number) => void;
  rowsPerPage?: number;
  hasColFixedWidth?: boolean;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  'data-testid'?: string;
};
