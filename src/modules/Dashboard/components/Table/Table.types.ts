import { Dispatch, SetStateAction, MouseEvent } from 'react';

import { Row, UiType } from 'shared/components';
import { HeadCell, Order, OrderBy } from 'shared/types';

export type TableProps = {
  uiType?: UiType;
  maxHeight?: string;
  className?: string;
  columns: HeadCell[];
  rows?: Row[];
  order: Order;
  orderBy: OrderBy;
  handleRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  count: number;
  emptyComponent?: JSX.Element | string;
};
