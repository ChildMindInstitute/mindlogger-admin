import { MouseEvent, UIEvent } from 'react';

import { Row, UiType } from 'shared/components';
import { HeadCell, Order } from 'shared/types';

interface DashboardTableCommonProps {
  'data-testid'?: string;
  className?: string;
  columns: HeadCell[];
  emptyComponent?: JSX.Element | string;
  handleRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  hasColFixedWidth?: boolean;
  keyExtractor?: (item: Row, index: number) => string;
  maxHeight?: string;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  order: Order;
  orderBy: string;
  rows?: Row[];
  searchValue?: string;
  uiType?: UiType;
}

export interface DashboardTablePropsWithoutPagination extends DashboardTableCommonProps {
  count?: never;
  enablePagination: false;
  handleChangePage?: never;
  page?: never;
  rowsPerPage?: never;
}

export interface DashboardTablePropsWithPagination extends DashboardTableCommonProps {
  count: number;
  enablePagination?: true;
  handleChangePage: (event: unknown, newPage: number) => void;
  page: number;
  rowsPerPage?: number;
}

export type DashboardTableProps =
  | DashboardTablePropsWithoutPagination
  | DashboardTablePropsWithPagination;
