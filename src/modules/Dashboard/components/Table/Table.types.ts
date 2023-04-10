import { MouseEvent } from 'react';

import { Row, UiType } from 'shared/components';
import { HeadCell, Order } from 'shared/types';

export type TableProps = {
  uiType?: UiType;
  maxHeight?: string;
  className?: string;
  columns: HeadCell[];
  rows?: Row[];
  order: Order;
  orderBy: string;
  handleRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  page: number;
  count: number;
  emptyComponent?: JSX.Element | string;
  searchValue?: string;
  handleChangePage: (event: unknown, newPage: number) => void;
};
